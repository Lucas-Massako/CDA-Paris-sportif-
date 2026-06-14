const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { checkAndUnlockAvatars } = require('../utils/avatarUnlock');

async function getFullProfile(req, res) {
    const userId = req.user.id;
    try {
        await checkAndUnlockAvatars(userId);

        const [userRes, avatarRes, teamsRes] = await Promise.all([
            pool.query(`
                SELECT u.id_user, u.nom, u.email, u.bankroll, u.dateinscription,
                       u.id_avatar_actif, u.id_equipe_favorite,
                       a.emoji AS avatar_emoji, a.couleur AS avatar_couleur, a.nom AS avatar_nom,
                       e.nom  AS equipe_favorite_nom
                FROM utilisateur u
                LEFT JOIN avatars a ON u.id_avatar_actif = a.id_avatar
                LEFT JOIN equipe  e ON u.id_equipe_favorite = e.id_equipe
                WHERE u.id_user = $1`, [userId]),

            pool.query(`
                SELECT a.id_avatar, a.nom, a.emoji, a.couleur, a.description, a.condition_code,
                       a.condition_valeur,
                       (ua.id_user IS NOT NULL) AS debloque,
                       ua.debloque_le,
                       (u.id_avatar_actif = a.id_avatar) AS actif
                FROM avatars a
                LEFT JOIN user_avatars ua ON a.id_avatar = ua.id_avatar AND ua.id_user = $1
                CROSS JOIN utilisateur u
                WHERE u.id_user = $1
                ORDER BY a.id_avatar`, [userId]),

            pool.query(`
                SELECT id_equipe, nom, pays
                FROM equipe
                ORDER BY
                    CASE pays
                        WHEN 'Ligue 1'       THEN 1
                        WHEN 'Premier League' THEN 2
                        WHEN 'La Liga'        THEN 3
                        WHEN 'Serie A'        THEN 4
                        WHEN 'Bundesliga'     THEN 5
                        ELSE 6
                    END, nom
            `)
        ]);

        if (userRes.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        const u = userRes.rows[0];

        res.json({
            user: {
                id:                   u.id_user,
                name:                 u.nom,
                email:                u.email,
                bankroll:             u.bankroll,
                joinDate:             u.dateinscription,
                id_equipe_favorite:   u.id_equipe_favorite,
                equipe_favorite_nom:  u.equipe_favorite_nom,
                avatar: {
                    id:     u.id_avatar_actif || 1,
                    nom:    u.avatar_nom     || 'Rookie',
                    emoji:  u.avatar_emoji   || '⚽',
                    couleur: u.avatar_couleur || '#6366f1'
                }
            },
            avatars: avatarRes.rows,
            teams:   teamsRes.rows
        });
    } catch (err) {
        console.error("Erreur profil complet:", err.message);
        res.status(500).json({ message: "Erreur serveur lors du chargement du profil." });
    }
}

async function updateProfile(req, res) {
    const { nom, password, id_equipe_favorite, id_avatar_actif } = req.body;
    const userId = req.user.id;

    try {
        if (id_avatar_actif) {
            const check = await pool.query(
                'SELECT 1 FROM user_avatars WHERE id_user = $1 AND id_avatar = $2',
                [userId, id_avatar_actif]
            );
            if (check.rows.length === 0) {
                return res.status(403).json({ message: "Cet avatar n'est pas encore débloqué" });
            }
        }

        const updates = [];
        const values  = [];
        let i = 1;

        if (nom && nom.trim()) {
            updates.push(`nom=$${i++}`);
            values.push(nom.trim());
        }
        if (password && password.length >= 6) {
            updates.push(`motdepasse=$${i++}`);
            values.push(await bcrypt.hash(password, 10));
        }
        if (id_equipe_favorite !== undefined) {
            updates.push(`id_equipe_favorite=$${i++}`);
            values.push(id_equipe_favorite || null);
        }
        if (id_avatar_actif) {
            updates.push(`id_avatar_actif=$${i++}`);
            values.push(id_avatar_actif);
        }

        if (updates.length === 0) return res.status(400).json({ message: "Aucune modification" });

        values.push(userId);
        await pool.query(`UPDATE utilisateur SET ${updates.join(', ')} WHERE id_user = $${i}`, values);

        res.json({ message: "Profil mis à jour !" });
    } catch (err) {
        console.error("Erreur update profil:", err.message);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
    }
}

module.exports = { getFullProfile, updateProfile };

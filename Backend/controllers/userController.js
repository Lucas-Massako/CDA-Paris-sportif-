const pool = require('../config/db');

async function getLeaderboard(req, res) {
    try {
        const result = await pool.query(`
            SELECT u.id_user, u.nom, u.bankroll,
                   COALESCE(a.emoji,   '⚽')     AS avatar_emoji,
                   COALESCE(a.couleur, '#6366f1') AS avatar_couleur,
                   COUNT(p.id_match) AS total_paris,
                   SUM(CASE WHEN p.statut = 'GAGNE' THEN 1 ELSE 0 END) AS paris_gagnes
            FROM utilisateur u
            LEFT JOIN parii   p ON u.id_user    = p.id_user
            LEFT JOIN avatars a ON u.id_avatar_actif = a.id_avatar
            GROUP BY u.id_user, u.nom, u.bankroll, a.emoji, a.couleur
            ORDER BY u.bankroll DESC
            LIMIT 20
        `);

        res.json(result.rows.map(u => ({
            name:           u.nom,
            points:         u.bankroll,
            avatar_emoji:   u.avatar_emoji,
            avatar_couleur: u.avatar_couleur,
            total_paris:    parseInt(u.total_paris),
            paris_gagnes:   parseInt(u.paris_gagnes)
        })));
    } catch (err) {
        console.error("Erreur leaderboard:", err.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

async function getProfile(req, res) {
    try {
        const result = await pool.query(`
            SELECT u.id_user, u.nom, u.email, u.bankroll, u.dateinscription, u.is_admin,
                   COALESCE(a.emoji,   '⚽')     AS avatar_emoji,
                   COALESCE(a.couleur, '#6366f1') AS avatar_couleur,
                   a.nom AS avatar_nom
            FROM utilisateur u
            LEFT JOIN avatars a ON u.id_avatar_actif = a.id_avatar
            WHERE u.id_user = $1`, [req.user.id]);

        if (result.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        const u = result.rows[0];
        res.json({
            id:       u.id_user,
            name:     u.nom,
            email:    u.email,
            bankroll: u.bankroll,
            joinDate: u.dateinscription,
            is_admin: u.is_admin || false,
            avatar: {
                emoji:  u.avatar_emoji,
                couleur: u.avatar_couleur,
                nom:    u.avatar_nom || 'Rookie'
            }
        });
    } catch (err) {
        console.error("Erreur profil:", err.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = { getLeaderboard, getProfile };

const pool = require('../config/db');
const { checkAndUnlockAvatars } = require('../utils/avatarUnlock');

// Find or create a team by name, return its id_equipe
async function findOrCreateTeam(client, name) {
    const existing = await client.query(
        'SELECT id_equipe FROM equipe WHERE nom = $1 LIMIT 1',
        [name]
    );
    if (existing.rows.length > 0) return existing.rows[0].id_equipe;

    const inserted = await client.query(
        "INSERT INTO equipe (nom, pays) VALUES ($1, 'International') RETURNING id_equipe",
        [name]
    );
    return inserted.rows[0].id_equipe;
}

// Find or create a match by external event ID, return its id_match
async function findOrCreateMatch(client, { event_id, home_team, away_team, date }) {
    const existing = await client.query(
        'SELECT id_match FROM match WHERE id_external = $1',
        [event_id]
    );
    if (existing.rows.length > 0) return existing.rows[0].id_match;

    const homeId = await findOrCreateTeam(client, home_team);
    const awayId = await findOrCreateTeam(client, away_team);
    const sportId = 1; // Football

    const inserted = await client.query(
        `INSERT INTO match (id_sport, id_equipedomicile, id_equipeexterieur, dateheure, id_external)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_match`,
        [sportId, homeId, awayId, date || new Date(), event_id]
    );
    return inserted.rows[0].id_match;
}

async function placeBet(req, res) {
    const { event_id, home_team, away_team, date, pronostic, mise, cote } = req.body;
    const userId = req.user.id;

    if (!event_id || pronostic === undefined || !mise) {
        return res.status(400).json({ message: "Données manquantes (event_id, pronostic, mise)" });
    }
    if (![0, 1, 2].includes(Number(pronostic))) {
        return res.status(400).json({ message: "Pronostic invalide (0=Nul, 1=Domicile, 2=Extérieur)" });
    }
    const miseInt = parseInt(mise);
    if (isNaN(miseInt) || miseInt <= 0) {
        return res.status(400).json({ message: "La mise doit être un entier positif" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Lock user row and check bankroll
        const userResult = await client.query(
            'SELECT bankroll FROM utilisateur WHERE id_user = $1 FOR UPDATE',
            [userId]
        );
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const bankroll = userResult.rows[0].bankroll;
        if (bankroll < miseInt) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: `Solde insuffisant (${bankroll} pts disponibles)` });
        }

        const matchId = await findOrCreateMatch(client, { event_id, home_team, away_team, date });

        // Check for duplicate bet
        const dupCheck = await client.query(
            'SELECT 1 FROM parii WHERE id_user = $1 AND id_match = $2',
            [userId, matchId]
        );
        if (dupCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Vous avez déjà parié sur ce match" });
        }

        // Deduct mise from bankroll
        await client.query(
            'UPDATE utilisateur SET bankroll = bankroll - $1 WHERE id_user = $2',
            [miseInt, userId]
        );

        // Insert bet
        await client.query(
            'INSERT INTO parii (id_user, id_match, pronostic, mise, cote) VALUES ($1, $2, $3, $4, $5)',
            [userId, matchId, Number(pronostic), miseInt, parseFloat(cote) || 1.0]
        );

        await client.query('COMMIT');

        // Vérifier les déblocages d'avatars après le pari (async, non bloquant)
        checkAndUnlockAvatars(userId).catch(() => {});

        res.status(201).json({
            message: "Pari enregistré !",
            newBankroll: bankroll - miseInt
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Erreur pari:", err.message);
        res.status(500).json({ message: "Erreur serveur lors du pari." });
    } finally {
        client.release();
    }
}

async function getBetHistory(req, res) {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT p.id_match, p.pronostic, p.mise, p.cote, p.statut, p.datepari,
                    e1.nom AS equipe_domicile, e2.nom AS equipe_exterieur,
                    m.dateheure, m.scorefinal, m.id_external
             FROM parii p
             JOIN match m ON p.id_match = m.id_match
             JOIN equipe e1 ON m.id_equipedomicile = e1.id_equipe
             JOIN equipe e2 ON m.id_equipeexterieur = e2.id_equipe
             WHERE p.id_user = $1
             ORDER BY p.datepari DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur historique:", err.message);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des paris." });
    }
}

module.exports = { placeBet, getBetHistory };

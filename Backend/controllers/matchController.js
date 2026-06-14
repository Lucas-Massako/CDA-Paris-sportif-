const pool = require('../config/db');

async function getUpcomingMatches(req, res) {
    try {
        const result = await pool.query(`
            SELECT m.id_match, m.id_external, m.dateheure, m.scorefinal,
                   e1.nom AS equipe_domicile, e2.nom AS equipe_exterieur
            FROM match m
            JOIN equipe e1 ON m.id_equipedomicile = e1.id_equipe
            JOIN equipe e2 ON m.id_equipeexterieur = e2.id_equipe
            WHERE m.scorefinal IS NULL AND m.dateheure >= NOW()
            ORDER BY m.dateheure ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur matchs:", err.message);
        res.status(500).json({ message: "Erreur BDD: " + err.message });
    }
}

module.exports = { getUpcomingMatches };

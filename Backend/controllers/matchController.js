const pool = require('../config/db');

function genCotes() {
    const r = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
    return { cote_1: r(1.10, 2.50), cote_n: r(2.50, 4.50), cote_2: r(1.50, 3.50) };
}

async function getUpcomingMatches(req, res) {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT m.id_match, m.id_external, m.dateheure, m.scorefinal,
                   m.cote_1, m.cote_n, m.cote_2,
                   e1.nom AS equipe_domicile, e2.nom AS equipe_exterieur
            FROM match m
            JOIN equipe e1 ON m.id_equipedomicile = e1.id_equipe
            JOIN equipe e2 ON m.id_equipeexterieur = e2.id_equipe
            WHERE m.scorefinal IS NULL AND m.dateheure >= NOW()
            ORDER BY m.dateheure ASC
        `);

        const matches = result.rows;

        // Générer et persister les cotes manquantes en une seule requête batch
        const toUpdate = matches.filter(m => m.cote_1 === null);
        if (toUpdate.length > 0) {
            await Promise.all(toUpdate.map(m => {
                const c = genCotes();
                m.cote_1 = c.cote_1;
                m.cote_n = c.cote_n;
                m.cote_2 = c.cote_2;
                return client.query(
                    'UPDATE match SET cote_1 = $1, cote_n = $2, cote_2 = $3 WHERE id_match = $4',
                    [c.cote_1, c.cote_n, c.cote_2, m.id_match]
                );
            }));
        }

        res.json(matches);
    } catch (err) {
        console.error("Erreur matchs:", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des matchs." });
    } finally {
        client.release();
    }
}

// Cotes pour les matchs TheSportsDB (identifiés par idEvent externe)
async function getExternalCotes(req, res) {
    const { ids } = req.body; // tableau de strings (idEvent TheSportsDB)
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Liste d'ids requise." });
    }

    const client = await pool.connect();
    try {
        // Récupérer les cotes déjà en base
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
        const existing = await client.query(
            `SELECT id_external, cote_1, cote_n, cote_2 FROM cotes_externes WHERE id_external IN (${placeholders})`,
            ids
        );

        const cotesMap = {};
        existing.rows.forEach(r => { cotesMap[r.id_external] = r; });

        // Créer les cotes manquantes
        const missing = ids.filter(id => !cotesMap[id]);
        if (missing.length > 0) {
            await Promise.all(missing.map(id => {
                const c = genCotes();
                cotesMap[id] = { id_external: id, ...c };
                return client.query(
                    'INSERT INTO cotes_externes (id_external, cote_1, cote_n, cote_2) VALUES ($1, $2, $3, $4) ON CONFLICT (id_external) DO NOTHING',
                    [id, c.cote_1, c.cote_n, c.cote_2]
                );
            }));
        }

        res.json(cotesMap);
    } catch (err) {
        console.error("Erreur cotes externes:", err.message);
        res.status(500).json({ message: "Erreur lors de la récupération des cotes." });
    } finally {
        client.release();
    }
}

module.exports = { getUpcomingMatches, getExternalCotes };

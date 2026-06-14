const pool = require('../config/db');
const https = require('https');
const { checkAndUnlockAvatars } = require('../utils/avatarUnlock');

// Utilitaire : fetch HTTPS simple sans dépendance externe
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
        }).on('error', reject);
    });
}

// Logique de résolution partagée (utilisée par resolveMatch ET autoResolve)
async function resolveMatchById(client, matchId, homeScore, awayScore) {
    let resultat;
    if (homeScore > awayScore)       resultat = 1;
    else if (awayScore > homeScore)  resultat = 2;
    else                             resultat = 0;

    const scoreStr = `${homeScore}-${awayScore}`;

    const betsRes = await client.query(
        'SELECT id_user, pronostic, mise, cote FROM parii WHERE id_match = $1 AND statut = $2',
        [matchId, 'EN_COURS']
    );

    let nbGagnes = 0, nbPerdus = 0;
    for (const bet of betsRes.rows) {
        if (parseInt(bet.pronostic) === resultat) {
            const gain = Math.round(bet.mise * parseFloat(bet.cote));
            await client.query(
                'UPDATE utilisateur SET bankroll = bankroll + $1 WHERE id_user = $2',
                [gain, bet.id_user]
            );
            await client.query(
                'UPDATE parii SET statut = $1 WHERE id_match = $2 AND id_user = $3 AND statut = $4',
                ['GAGNE', matchId, bet.id_user, 'EN_COURS']
            );
            nbGagnes++;
        } else {
            await client.query(
                'UPDATE parii SET statut = $1 WHERE id_match = $2 AND id_user = $3 AND statut = $4',
                ['PERDU', matchId, bet.id_user, 'EN_COURS']
            );
            nbPerdus++;
        }
    }

    await client.query('UPDATE match SET scorefinal = $1 WHERE id_match = $2', [scoreStr, matchId]);

    // Débloquer avatars pour tous les joueurs concernés
    const userIds = [...new Set(betsRes.rows.map(b => b.id_user))];
    userIds.forEach(uid => checkAndUnlockAvatars(uid).catch(() => {}));

    return { scoreStr, nbGagnes, nbPerdus, totalParis: betsRes.rows.length };
}

// GET /api/admin/matches — tous les matchs avec leur statut de résolution
async function getMatches(req, res) {
    try {
        const result = await pool.query(`
            SELECT m.id_match, m.id_external, m.dateheure, m.scorefinal,
                   e1.nom AS equipe_domicile,
                   e2.nom AS equipe_exterieur,
                   COUNT(p.id_match)                                           AS total_paris,
                   SUM(CASE WHEN p.statut = 'EN_COURS' THEN 1 ELSE 0 END)     AS paris_en_cours,
                   SUM(CASE WHEN p.statut = 'GAGNE'    THEN 1 ELSE 0 END)     AS paris_gagnes,
                   SUM(CASE WHEN p.statut = 'PERDU'    THEN 1 ELSE 0 END)     AS paris_perdus
            FROM match m
            JOIN equipe e1 ON m.id_equipedomicile  = e1.id_equipe
            JOIN equipe e2 ON m.id_equipeexterieur = e2.id_equipe
            LEFT JOIN parii p ON m.id_match = p.id_match
            GROUP BY m.id_match, e1.nom, e2.nom
            ORDER BY m.dateheure DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur admin getMatches:", err.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// PUT /api/admin/matches/:id/resolve — résoudre un match et distribuer les gains
async function resolveMatch(req, res) {
    const matchId   = parseInt(req.params.id);
    const { score_domicile, score_exterieur } = req.body;

    // Validation
    const home = parseInt(score_domicile);
    const away = parseInt(score_exterieur);
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
        return res.status(400).json({ message: "Scores invalides." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Vérifier que le match existe et n'est pas déjà résolu
        const matchRes = await client.query(
            'SELECT id_match, scorefinal FROM match WHERE id_match = $1 FOR UPDATE',
            [matchId]
        );
        if (matchRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Match introuvable." });
        }
        if (matchRes.rows[0].scorefinal !== null) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Ce match a déjà été résolu." });
        }

        const { scoreStr, nbGagnes, nbPerdus, totalParis } =
            await resolveMatchById(client, matchId, home, away);

        await client.query('COMMIT');

        res.json({
            message:      `Match résolu : ${scoreStr}`,
            score:        scoreStr,
            paris_gagnes: nbGagnes,
            paris_perdus: nbPerdus,
            total_paris:  totalParis
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Erreur résolution:", err.message);
        res.status(500).json({ message: "Erreur serveur lors de la résolution." });
    } finally {
        client.release();
    }
}

// POST /api/admin/auto-resolve — résolution automatique via TheSportsDB
async function autoResolve(req, res) {
    const TSDB = 'https://www.thesportsdb.com/api/v1/json/123';

    try {
        // Matchs non résolus avec un id_external TheSportsDB (pas nos matchs WC internes)
        // On attend au moins 2h après l'heure prévue avant de tenter la résolution
        const pending = await pool.query(`
            SELECT m.id_match, m.id_external, e1.nom AS domicile, e2.nom AS exterieur
            FROM match m
            JOIN equipe e1 ON m.id_equipedomicile  = e1.id_equipe
            JOIN equipe e2 ON m.id_equipeexterieur = e2.id_equipe
            WHERE m.scorefinal IS NULL
              AND m.id_external IS NOT NULL
              AND m.id_external NOT LIKE 'wc2026-%'
              AND m.dateheure < NOW() - INTERVAL '2 hours'
        `);

        if (pending.rows.length === 0) {
            return res.json({ message: "Aucun match en attente de résolution automatique.", resolved: 0, skipped: 0 });
        }

        let resolved = 0, skipped = 0, errors = 0;
        const details = [];

        for (const match of pending.rows) {
            try {
                const data = await fetchJSON(`${TSDB}/lookupevent.php?id=${match.id_external}`);
                const event = data.events?.[0];

                if (!event || event.strStatus !== 'Match Finished' ||
                    event.intHomeScore === null || event.intAwayScore === null) {
                    skipped++;
                    details.push({ match: `${match.domicile} vs ${match.exterieur}`, status: 'skip', reason: 'Score non disponible' });
                    continue;
                }

                const homeScore = parseInt(event.intHomeScore);
                const awayScore = parseInt(event.intAwayScore);

                const client = await pool.connect();
                try {
                    await client.query('BEGIN');
                    // Vérifier qu'il n'a pas déjà été résolu entre temps
                    const check = await client.query(
                        'SELECT scorefinal FROM match WHERE id_match = $1 FOR UPDATE', [match.id_match]
                    );
                    if (check.rows[0]?.scorefinal !== null) {
                        await client.query('ROLLBACK');
                        skipped++;
                        continue;
                    }
                    const result = await resolveMatchById(client, match.id_match, homeScore, awayScore);
                    await client.query('COMMIT');
                    resolved++;
                    details.push({
                        match:  `${match.domicile} vs ${match.exterieur}`,
                        status: 'resolved',
                        score:  result.scoreStr,
                        gagnes: result.nbGagnes,
                        perdus: result.nbPerdus
                    });
                } catch (err) {
                    await client.query('ROLLBACK');
                    errors++;
                } finally {
                    client.release();
                }
            } catch {
                errors++;
            }
        }

        res.json({
            message:  `Synchronisation terminée : ${resolved} résolu(s), ${skipped} ignoré(s)`,
            resolved, skipped, errors, details
        });

    } catch (err) {
        console.error("Erreur auto-resolve:", err.message);
        res.status(500).json({ message: "Erreur serveur lors de la synchronisation." });
    }
}

module.exports = { getMatches, resolveMatch, autoResolve };

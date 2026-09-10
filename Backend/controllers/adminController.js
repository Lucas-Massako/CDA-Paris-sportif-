const pool = require('../config/db');
const https = require('https');
const { checkAndUnlockAvatars } = require('../utils/avatarUnlock');
const { matchOutcome, computeGain } = require('../utils/betRules');
const { classifyEvent } = require('../utils/matchStatus');

const TSDB            = 'https://www.thesportsdb.com/api/v1/json/123';
const FETCH_TIMEOUT_MS = 8000;  // au-delà, on abandonne : l'API tierce ne doit pas bloquer la synchro
const MAX_PARALLEL     = 4;     // requêtes simultanées vers TheSportsDB (politesse + quotas)

// Utilitaire : fetch HTTPS sans dépendance externe, avec délai maximal
function fetchJSON(url, timeoutMs = FETCH_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
        });
        req.on('error', reject);
        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`Délai dépassé (${timeoutMs} ms)`));
        });
    });
}

// Exécute une tâche asynchrone sur une liste, `limit` éléments à la fois
async function mapWithLimit(items, limit, task) {
    const results = [];
    let cursor = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const i = cursor++;
            results[i] = await task(items[i], i);
        }
    });
    await Promise.all(workers);
    return results;
}

// Logique de résolution partagée (utilisée par resolveMatch ET autoResolve)
async function resolveMatchById(client, matchId, homeScore, awayScore) {
    const resultat = matchOutcome(homeScore, awayScore);
    const scoreStr = `${homeScore}-${awayScore}`;

    const betsRes = await client.query(
        'SELECT id_user, pronostic, mise, cote FROM parii WHERE id_match = $1 AND statut = $2',
        [matchId, 'EN_COURS']
    );

    // Le calcul du gain reste en JavaScript (règle métier unique, couverte par les tests) ;
    // le crédit est ensuite appliqué en une seule requête plutôt qu'une par gagnant.
    const gagnants = betsRes.rows
        .filter(b => parseInt(b.pronostic) === resultat)
        .map(b => ({ id_user: b.id_user, gain: computeGain(b.mise, b.cote) }));

    if (gagnants.length > 0) {
        const values = gagnants.map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`).join(', ');
        await client.query(
            `UPDATE utilisateur u SET bankroll = bankroll + v.gain
             FROM (VALUES ${values}) AS v(id_user, gain)
             WHERE u.id_user = v.id_user`,
            gagnants.flatMap(g => [g.id_user, g.gain])
        );
    }

    // Bascule des tickets en une requête (GAGNE si le pronostic correspond, PERDU sinon)
    await client.query(
        `UPDATE parii SET statut = CASE WHEN pronostic = $2 THEN 'GAGNE' ELSE 'PERDU' END
         WHERE id_match = $1 AND statut = 'EN_COURS'`,
        [matchId, resultat]
    );

    const nbGagnes = gagnants.length;
    const nbPerdus = betsRes.rows.length - nbGagnes;

    await client.query('UPDATE match SET scorefinal = $1 WHERE id_match = $2', [scoreStr, matchId]);

    // Débloquer avatars pour tous les joueurs concernés
    const userIds = [...new Set(betsRes.rows.map(b => b.id_user))];
    userIds.forEach(uid => checkAndUnlockAvatars(uid).catch(() => {}));

    return { scoreStr, nbGagnes, nbPerdus, totalParis: betsRes.rows.length };
}

// Match reporté / annulé : on rembourse les mises et on clôt les tickets en ANNULE.
// Le match reste non résolu (scorefinal NULL) pour pouvoir être reprogrammé.
async function refundMatchById(client, matchId) {
    const refund = await client.query(
        `UPDATE parii SET statut = 'ANNULE'
         WHERE id_match = $1 AND statut = 'EN_COURS'
         RETURNING id_user, mise`,
        [matchId]
    );

    if (refund.rows.length > 0) {
        const values = refund.rows.map((_, i) => `($${i * 2 + 1}::int, $${i * 2 + 2}::int)`).join(', ');
        await client.query(
            `UPDATE utilisateur u SET bankroll = bankroll + v.mise
             FROM (VALUES ${values}) AS v(id_user, mise)
             WHERE u.id_user = v.id_user`,
            refund.rows.flatMap(r => [r.id_user, r.mise])
        );
    }

    return { nbRembourses: refund.rows.length };
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

// Traite un match en attente : interroge TheSportsDB, puis résout ou rembourse.
// Chaque match a sa propre transaction, pour qu'un échec isolé n'annule pas les autres.
async function processPendingMatch(match) {
    const libelle = `${match.domicile} vs ${match.exterieur}`;

    const data  = await fetchJSON(`${TSDB}/lookupevent.php?id=${match.id_external}`);
    const event = data.events?.[0];
    const etat  = classifyEvent(event);

    if (etat === 'pending') {
        return { match: libelle, status: 'skip', reason: 'Score officiel non disponible' };
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verrou : le match a pu être résolu à la main entre-temps
        const check = await client.query(
            'SELECT scorefinal FROM match WHERE id_match = $1 FOR UPDATE',
            [match.id_match]
        );
        if (check.rows.length === 0 || check.rows[0].scorefinal !== null) {
            await client.query('ROLLBACK');
            return { match: libelle, status: 'skip', reason: 'Déjà résolu' };
        }

        if (etat === 'cancelled') {
            const { nbRembourses } = await refundMatchById(client, match.id_match);
            await client.query('COMMIT');
            return { match: libelle, status: 'cancelled', rembourses: nbRembourses };
        }

        const result = await resolveMatchById(
            client,
            match.id_match,
            parseInt(event.intHomeScore),
            parseInt(event.intAwayScore)
        );
        await client.query('COMMIT');
        return {
            match:  libelle,
            status: 'resolved',
            score:  result.scoreStr,
            gagnes: result.nbGagnes,
            perdus: result.nbPerdus
        };
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Synchronisation des résultats. Appelée par la route admin et par le planificateur.
 * @returns {{resolved:number, cancelled:number, skipped:number, errors:number, details:Array}}
 */
async function runAutoResolve() {
    // Matchs non résolus portant un identifiant TheSportsDB (les matchs WC internes,
    // absents de l'API, restent réservés à la résolution manuelle).
    // Marge de 2 h après le coup d'envoi avant d'interroger l'API.
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
        return { resolved: 0, cancelled: 0, skipped: 0, errors: 0, details: [] };
    }

    const outcomes = await mapWithLimit(pending.rows, MAX_PARALLEL, async match => {
        try {
            return await processPendingMatch(match);
        } catch (err) {
            console.error(`Synchro ${match.id_external} :`, err.message);
            return { match: `${match.domicile} vs ${match.exterieur}`, status: 'error', reason: err.message };
        }
    });

    const count = s => outcomes.filter(o => o.status === s).length;
    return {
        resolved:  count('resolved'),
        cancelled: count('cancelled'),
        skipped:   count('skip'),
        errors:    count('error'),
        details:   outcomes
    };
}

// POST /api/admin/auto-resolve — résolution automatique via TheSportsDB
async function autoResolve(req, res) {
    try {
        const r = await runAutoResolve();

        if (r.details.length === 0) {
            return res.json({ message: "Aucun match en attente de résolution automatique.", ...r });
        }

        const parts = [`${r.resolved} résolu(s)`];
        if (r.cancelled) parts.push(`${r.cancelled} remboursé(s)`);
        parts.push(`${r.skipped} ignoré(s)`);
        if (r.errors) parts.push(`${r.errors} en erreur`);

        res.json({ message: `Synchronisation terminée : ${parts.join(', ')}`, ...r });
    } catch (err) {
        console.error("Erreur auto-resolve:", err.message);
        res.status(500).json({ message: "Erreur serveur lors de la synchronisation." });
    }
}

// DELETE /api/admin/matches/cleanup — supprimer les matchs passés sans aucun pari
async function cleanupMatches(req, res) {
    try {
        const result = await pool.query(`
            DELETE FROM match m
            WHERE m.dateheure < NOW()
              AND NOT EXISTS (SELECT 1 FROM parii p WHERE p.id_match = m.id_match)
            RETURNING m.id_match
        `);
        res.json({
            message: result.rowCount > 0
                ? `${result.rowCount} match(s) passé(s) sans pari supprimé(s).`
                : "Aucun match passé sans pari à supprimer.",
            deleted: result.rowCount
        });
    } catch (err) {
        console.error("Erreur cleanup matchs:", err.message);
        res.status(500).json({ message: "Erreur serveur lors du nettoyage." });
    }
}

module.exports = {
    getMatches, resolveMatch, autoResolve, cleanupMatches,
    runAutoResolve, resolveMatchById, refundMatchById
};

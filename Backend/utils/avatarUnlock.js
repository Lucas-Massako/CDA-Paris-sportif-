const pool = require('../config/db');

async function checkAndUnlockAvatars(userId) {
    try {
        const [betRes, rankRes, totalRes, wcRes, highOddsRes] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total FROM parii WHERE id_user = $1', [userId]),
            pool.query(`
                SELECT rank FROM (
                    SELECT id_user, RANK() OVER (ORDER BY bankroll DESC) AS rank
                    FROM utilisateur
                ) r WHERE id_user = $1`, [userId]),
            pool.query('SELECT COUNT(*) AS total FROM utilisateur'),
            pool.query(`
                SELECT 1 FROM parii p
                JOIN match m ON p.id_match = m.id_match
                WHERE p.id_user = $1 AND m.id_external LIKE 'wc2026-%' LIMIT 1`, [userId]),
            pool.query(`
                SELECT 1 FROM parii WHERE id_user = $1 AND statut = 'GAGNE' AND cote > 3.0 LIMIT 1`,
                [userId])
        ]);

        const betCount   = parseInt(betRes.rows[0].total);
        const rank       = rankRes.rows.length > 0 ? parseInt(rankRes.rows[0].rank) : 9999;
        const totalUsers = parseInt(totalRes.rows[0].total);
        const pct        = totalUsers > 0 ? rank / totalUsers : 1;
        const hasWcBet      = wcRes.rows.length > 0;
        const hasHighOddsWin = highOddsRes.rows.length > 0;

        const toUnlock = [1]; // DEFAULT toujours débloqué

        if (betCount >= 1)  toUnlock.push(2); // BETS_1
        if (betCount >= 5)  toUnlock.push(3); // BETS_5
        if (betCount >= 20) toUnlock.push(4); // BETS_20
        if (hasHighOddsWin) toUnlock.push(5); // WIN_HIGH_ODDS
        if (pct <= 0.25)    toUnlock.push(6); // TOP_25PCT
        if (pct <= 0.10)    toUnlock.push(7); // TOP_10PCT
        if (rank === 1)     toUnlock.push(8); // RANK_1
        if (pct >= 0.80)    toUnlock.push(9); // BOT_20PCT
        if (hasWcBet)       toUnlock.push(10); // WC_BET

        const inserts = toUnlock.map(id =>
            pool.query(
                'INSERT INTO user_avatars (id_user, id_avatar) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [userId, id]
            )
        );
        await Promise.all(inserts);

        // Avatar actif par défaut si non défini
        await pool.query(
            'UPDATE utilisateur SET id_avatar_actif = 1 WHERE id_user = $1 AND id_avatar_actif IS NULL',
            [userId]
        );

        return toUnlock;
    } catch (err) {
        console.error('avatarUnlock error:', err.message);
        return [];
    }
}

module.exports = { checkAndUnlockAvatars };

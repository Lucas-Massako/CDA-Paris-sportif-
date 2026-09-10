const cron = require('node-cron');
const { runAutoResolve } = require('../controllers/adminController');

// Toutes les 30 minutes. Surchargeable par variable d'environnement
// (ex. AUTO_RESOLVE_CRON="*/5 * * * *" pour une démonstration).
const CRON_EXPR = process.env.AUTO_RESOLVE_CRON || '*/30 * * * *';
const ENABLED   = process.env.AUTO_RESOLVE_ENABLED !== 'false';

// Empêche deux synchronisations simultanées : si l'API tierce est lente,
// le déclenchement suivant est ignoré plutôt que de se superposer.
let enCours = false;

async function tick(origine = 'planificateur') {
    if (enCours) {
        console.log(`[synchro] ${origine} ignoré : une synchronisation est déjà en cours`);
        return null;
    }
    enCours = true;
    const debut = Date.now();
    try {
        const r = await runAutoResolve();
        if (r.details.length > 0) {
            console.log(
                `[synchro] ${r.resolved} résolu(s), ${r.cancelled} remboursé(s), ` +
                `${r.skipped} ignoré(s), ${r.errors} erreur(s) en ${Date.now() - debut} ms`
            );
        }
        return r;
    } catch (err) {
        console.error('[synchro] échec :', err.message);
        return null;
    } finally {
        enCours = false;
    }
}

function startScheduler() {
    if (!ENABLED) {
        console.log('[synchro] planificateur désactivé (AUTO_RESOLVE_ENABLED=false)');
        return null;
    }
    if (!cron.validate(CRON_EXPR)) {
        console.error(`[synchro] expression cron invalide : "${CRON_EXPR}" — planificateur non démarré`);
        return null;
    }

    const task = cron.schedule(CRON_EXPR, () => tick(), { timezone: 'Europe/Paris' });
    console.log(`[synchro] planificateur actif (${CRON_EXPR}, Europe/Paris)`);
    return task;
}

module.exports = { startScheduler, tick };

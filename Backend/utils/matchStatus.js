// Interprétation des statuts renvoyés par TheSportsDB (logique pure, testable)

// Match effectivement joué et scoré
const FINISHED_STATUSES  = ['Match Finished', 'FT', 'AET', 'PEN'];
// Match qui n'aura pas lieu à la date prévue : les mises doivent être remboursées
const CANCELLED_STATUSES = ['Postponed', 'PST', 'Cancelled', 'Canc', 'CANC', 'Abandoned', 'ABD'];

const norm = s => String(s ?? '').trim().toLowerCase();

/**
 * Classe un évènement TheSportsDB.
 * @returns {'finished'|'cancelled'|'pending'}
 *   finished  : score officiel disponible → résolution des paris
 *   cancelled : match reporté ou annulé   → remboursement des mises
 *   pending   : pas encore jouable        → on retente plus tard
 */
function classifyEvent(event) {
    if (!event) return 'pending';

    const status = norm(event.strStatus);
    if (CANCELLED_STATUSES.some(s => norm(s) === status)) return 'cancelled';

    const hasScore = event.intHomeScore != null && event.intAwayScore != null;
    if (FINISHED_STATUSES.some(s => norm(s) === status) && hasScore) return 'finished';

    return 'pending';
}

module.exports = { classifyEvent, FINISHED_STATUSES, CANCELLED_STATUSES };

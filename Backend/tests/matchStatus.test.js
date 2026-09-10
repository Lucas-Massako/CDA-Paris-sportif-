const { classifyEvent } = require('../utils/matchStatus');

const fini     = (s, h = 2, a = 1) => ({ strStatus: s, intHomeScore: h, intAwayScore: a });

describe('classifyEvent — interprétation des statuts TheSportsDB', () => {
    test('match terminé avec score → finished (toutes les variantes)', () => {
        for (const s of ['Match Finished', 'FT', 'AET', 'PEN']) {
            expect(classifyEvent(fini(s))).toBe('finished');
        }
    });

    test('la casse et les espaces ne changent pas le résultat', () => {
        expect(classifyEvent(fini('  ft  '))).toBe('finished');
        expect(classifyEvent({ strStatus: 'POSTPONED' })).toBe('cancelled');
    });

    test('match reporté ou annulé → cancelled', () => {
        for (const s of ['Postponed', 'PST', 'Cancelled', 'CANC', 'Abandoned', 'ABD']) {
            expect(classifyEvent({ strStatus: s })).toBe('cancelled');
        }
    });

    test('match non commencé ou en cours → pending', () => {
        expect(classifyEvent({ strStatus: 'Not Started' })).toBe('pending');
        expect(classifyEvent({ strStatus: '1H', intHomeScore: 1, intAwayScore: 0 })).toBe('pending');
    });

    test('statut terminé mais score manquant → pending (on ne résout pas à l\'aveugle)', () => {
        expect(classifyEvent({ strStatus: 'FT', intHomeScore: null, intAwayScore: null })).toBe('pending');
        expect(classifyEvent({ strStatus: 'FT', intHomeScore: 2, intAwayScore: null })).toBe('pending');
    });

    test('score 0-0 est un score valide, pas une absence de score', () => {
        expect(classifyEvent(fini('FT', 0, 0))).toBe('finished');
    });

    test('évènement absent de la réponse API → pending', () => {
        expect(classifyEvent(undefined)).toBe('pending');
        expect(classifyEvent(null)).toBe('pending');
    });

    test('un match annulé reste annulé même si un score traîne', () => {
        expect(classifyEvent({ strStatus: 'Postponed', intHomeScore: 0, intAwayScore: 0 })).toBe('cancelled');
    });
});

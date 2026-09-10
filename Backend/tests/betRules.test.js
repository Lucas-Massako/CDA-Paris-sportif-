const { matchOutcome, computeGain } = require('../utils/betRules');

describe('matchOutcome — résultat 1N2 d\'un match', () => {
    test('victoire domicile → 1', () => {
        expect(matchOutcome(2, 0)).toBe(1);
        expect(matchOutcome(3, 2)).toBe(1);
    });

    test('victoire extérieur → 2', () => {
        expect(matchOutcome(0, 2)).toBe(2);
        expect(matchOutcome(1, 4)).toBe(2);
    });

    test('match nul → 0', () => {
        expect(matchOutcome(0, 0)).toBe(0);
        expect(matchOutcome(2, 2)).toBe(0);
    });
});

describe('computeGain — calcul du gain (mise × cote, arrondi entier)', () => {
    // Cas du jeu d'essai du dossier : mise 50 pts, cote 2,43 → 121,50 arrondi à 122
    test('cas du jeu d\'essai : 50 × 2,43 = 121,5 → 122 pts', () => {
        expect(computeGain(50, 2.43)).toBe(122);
    });

    test('produit entier : 100 × 1,85 = 185 pts', () => {
        expect(computeGain(100, 1.85)).toBe(185);
    });

    test('arrondi vers le bas : 10 × 1,34 = 13,4 → 13 pts', () => {
        expect(computeGain(10, 1.34)).toBe(13);
    });

    test('accepte une cote au format texte renvoyé par PostgreSQL (DECIMAL)', () => {
        expect(computeGain(50, '2.43')).toBe(122);
    });

    test('le gain est toujours un entier (contrainte bankroll INT)', () => {
        for (const [mise, cote] of [[7, 3.33], [13, 1.07], [999, 2.51]]) {
            expect(Number.isInteger(computeGain(mise, cote))).toBe(true);
        }
    });
});

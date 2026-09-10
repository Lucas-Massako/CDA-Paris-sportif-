const { computeUnlocks } = require('../utils/avatarUnlock');

// Rappel des IDs : 1 Rookie, 2 Parieur, 3 Assidu, 4 Parieur Fou, 5 Chanceux,
// 6 Stratège (top 25%), 7 Élite (top 10%), 8 Champion (1er), 9 Footix (20% derniers), 10 Globe-Trotter
const base = { betCount: 0, rank: 50, totalUsers: 100, hasWcBet: false, hasHighOddsWin: false };

describe('computeUnlocks — les 9 règles de déblocage d\'avatars', () => {
    test('Rookie (1) est toujours débloqué', () => {
        expect(computeUnlocks(base)).toContain(1);
    });

    test('paliers de paris : 1 pari → Parieur, 5 → Assidu, 20 → Parieur Fou', () => {
        expect(computeUnlocks({ ...base, betCount: 0 })).not.toContain(2);
        expect(computeUnlocks({ ...base, betCount: 1 })).toContain(2);
        expect(computeUnlocks({ ...base, betCount: 4 })).not.toContain(3);
        expect(computeUnlocks({ ...base, betCount: 5 })).toEqual(expect.arrayContaining([2, 3]));
        expect(computeUnlocks({ ...base, betCount: 20 })).toEqual(expect.arrayContaining([2, 3, 4]));
    });

    test('Chanceux (5) : gagner un pari avec une cote > 3.0', () => {
        expect(computeUnlocks({ ...base, hasHighOddsWin: true })).toContain(5);
        expect(computeUnlocks(base)).not.toContain(5);
    });

    test('Stratège (6) : top 25 % du classement', () => {
        expect(computeUnlocks({ ...base, rank: 25 })).toContain(6);   // 25/100 = 25 %
        expect(computeUnlocks({ ...base, rank: 26 })).not.toContain(6);
    });

    test('Élite (7) : top 10 % du classement', () => {
        expect(computeUnlocks({ ...base, rank: 10 })).toContain(7);
        expect(computeUnlocks({ ...base, rank: 11 })).not.toContain(7);
    });

    test('Champion (8) : uniquement le 1er du classement', () => {
        expect(computeUnlocks({ ...base, rank: 1 })).toContain(8);
        expect(computeUnlocks({ ...base, rank: 2 })).not.toContain(8);
    });

    test('Footix (9) : les 20 % les moins bien classés', () => {
        expect(computeUnlocks({ ...base, rank: 80 })).toContain(9);   // 80/100 = 80 %
        expect(computeUnlocks({ ...base, rank: 79 })).not.toContain(9);
    });

    test('Globe-Trotter (10) : avoir parié sur la Coupe du Monde 2026', () => {
        expect(computeUnlocks({ ...base, hasWcBet: true })).toContain(10);
        expect(computeUnlocks(base)).not.toContain(10);
    });

    test('cas limite : aucun autre utilisateur (totalUsers = 0) ne débloque que Rookie/Footix', () => {
        const result = computeUnlocks({ ...base, totalUsers: 0 });
        expect(result).toContain(1);
        expect(result).not.toContain(6);
        expect(result).not.toContain(7);
    });
});

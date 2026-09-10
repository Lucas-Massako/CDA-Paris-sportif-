const { validateRegister, isValidTeamName } = require('../utils/validators');

describe('validateRegister — validation des entrées d\'inscription', () => {
    test('accepte des données valides', () => {
        expect(validateRegister('Test Jury', 'jury@test.com', 'motdepasse')).toBeNull();
    });

    test('refuse un pseudo trop court (< 2 caractères)', () => {
        expect(validateRegister('A', 'jury@test.com', 'motdepasse')).toMatch(/pseudo/i);
    });

    test('refuse un pseudo trop long (> 50 caractères)', () => {
        expect(validateRegister('A'.repeat(51), 'jury@test.com', 'motdepasse')).toMatch(/pseudo/i);
    });

    test('refuse un pseudo manquant', () => {
        expect(validateRegister(undefined, 'jury@test.com', 'motdepasse')).toMatch(/pseudo/i);
    });

    test('refuse un email sans @', () => {
        expect(validateRegister('Test Jury', 'jurytest.com', 'motdepasse')).toBe('Email invalide.');
    });

    test('refuse un email sans domaine', () => {
        expect(validateRegister('Test Jury', 'jury@', 'motdepasse')).toBe('Email invalide.');
    });

    test('refuse une tentative d\'injection SQL dans l\'email', () => {
        expect(validateRegister('Test Jury', "' OR 1=1 --", 'motdepasse')).toBe('Email invalide.');
    });

    test('refuse un mot de passe trop court (< 6 caractères)', () => {
        expect(validateRegister('Test Jury', 'jury@test.com', '12345')).toMatch(/mot de passe/i);
    });

    test('refuse un mot de passe trop long (> 100 caractères)', () => {
        expect(validateRegister('Test Jury', 'jury@test.com', 'x'.repeat(101))).toMatch(/mot de passe/i);
    });
});

describe('isValidTeamName — validation anti-XSS des noms d\'équipe', () => {
    test('accepte les noms simples et accentués', () => {
        expect(isValidTeamName('France')).toBe(true);
        expect(isValidTeamName('Fenerbahçe')).toBe(true);
        expect(isValidTeamName("Inter Club d'Escaldes")).toBe(true);
        expect(isValidTeamName('Paris Saint-Germain')).toBe(true);
        expect(isValidTeamName('Bodø/Glimt')).toBe(true);
        expect(isValidTeamName('Brighton & Hove Albion')).toBe(true);
    });

    test('refuse une balise HTML (tentative XSS)', () => {
        expect(isValidTeamName('<script>alert(1)</script>')).toBe(false);
        expect(isValidTeamName('France<img src=x onerror=alert(1)>')).toBe(false);
    });

    test('refuse une chaîne vide ou non-string', () => {
        expect(isValidTeamName('')).toBe(false);
        expect(isValidTeamName('   ')).toBe(false);
        expect(isValidTeamName(null)).toBe(false);
        expect(isValidTeamName(42)).toBe(false);
    });

    test('refuse un nom de plus de 100 caractères', () => {
        expect(isValidTeamName('A'.repeat(101))).toBe(false);
    });
});

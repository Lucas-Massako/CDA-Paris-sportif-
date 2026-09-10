const bcrypt = require('bcrypt');

describe('Hachage des mots de passe (bcrypt, 10 rounds)', () => {
    const plain = 'MotDePasseSecret123!';

    test('le hash n\'est jamais le mot de passe en clair et utilise 10 rounds', async () => {
        const hash = await bcrypt.hash(plain, 10);
        expect(hash).not.toBe(plain);
        expect(hash).toMatch(/^\$2b\$10\$/); // format bcrypt, cost factor 10
    });

    test('le bon mot de passe est accepté par bcrypt.compare', async () => {
        const hash = await bcrypt.hash(plain, 10);
        await expect(bcrypt.compare(plain, hash)).resolves.toBe(true);
    });

    test('un mauvais mot de passe est refusé', async () => {
        const hash = await bcrypt.hash(plain, 10);
        await expect(bcrypt.compare('mauvais-mdp', hash)).resolves.toBe(false);
    });

    test('deux hachages du même mot de passe diffèrent (sel aléatoire)', async () => {
        const h1 = await bcrypt.hash(plain, 10);
        const h2 = await bcrypt.hash(plain, 10);
        expect(h1).not.toBe(h2);
    });
});

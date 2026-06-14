const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const rateLimit  = require('express-rate-limit');
const pool       = require('../config/db');
const { checkAndUnlockAvatars } = require('../utils/avatarUnlock');

// Rate limiter : max 10 tentatives par IP sur 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Trop de tentatives, réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false
});

// Validation basique des inputs
function validateRegister(name, email, password) {
    if (!name || name.trim().length < 2 || name.trim().length > 50)
        return "Le pseudo doit faire entre 2 et 50 caractères.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100)
        return "Email invalide.";
    if (!password || password.length < 6 || password.length > 100)
        return "Le mot de passe doit faire entre 6 et 100 caractères.";
    return null;
}

// --- ROUTE INSCRIPTION ---
router.post('/register', authLimiter, async (req, res) => {
    const { name, email, password } = req.body;
    const validationError = validateRegister(name, email, password);
    if (validationError) return res.status(400).json({ message: validationError });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO utilisateur (nom, email, motdepasse) 
            VALUES ($1, $2, $3) 
            RETURNING id_user, nom, email`;
        
        const result = await pool.query(query, [name, email, hashedPassword]);
        
        const newUser = result.rows[0];
        // Débloquer l'avatar Rookie dès l'inscription
        await checkAndUnlockAvatars(newUser.id_user);

        res.status(201).json({ message: "Utilisateur créé avec succès !", user: newUser });
    } catch (err) {
        console.error("Erreur Inscription:", err.message);
        if (err.code === '23505') return res.status(409).json({ message: "Cet email est déjà utilisé." });
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
});

// --- ROUTE CONNEXION (AVEC JWT) ---
router.post('/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || email.length > 100 || password.length > 100)
        return res.status(400).json({ message: "Données invalides." });
    try {
        const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.motdepasse);

        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        // --- GÉNÉRATION DU TOKEN JWT ---
        // On signe un token avec l'ID et l'email, valable 2 heures
        const token = jwt.sign(
            { id: user.id_user, email: user.email }, 
            process.env.JWT_SECRET || 'footix_jwt_fallback_change_in_prod',
            { expiresIn: '2h' }
        );

        // Vérifie les déblocages d'avatars à chaque connexion
        checkAndUnlockAvatars(user.id_user).catch(() => {});

        // ── Recharge automatique ──────────────────────────────
        // Si bankroll < 100 ET bonus pas encore donné aujourd'hui → +500 pts
        let bonusRecharge = 0;
        const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const dernierBonus = user.dernier_bonus
            ? new Date(user.dernier_bonus).toISOString().split('T')[0]
            : null;

        if (user.bankroll < 100 && dernierBonus !== today) {
            await pool.query(
                'UPDATE utilisateur SET bankroll = bankroll + 500, dernier_bonus = CURRENT_DATE WHERE id_user = $1',
                [user.id_user]
            );
            bonusRecharge = 500;
        }

        res.json({
            message:       "Connexion réussie !",
            token,
            bonusRecharge, // 0 si pas de recharge, 500 si recharge accordée
            user: { name: user.nom, email: user.email }
        });
    } catch (err) {
        console.error("Erreur Connexion:", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
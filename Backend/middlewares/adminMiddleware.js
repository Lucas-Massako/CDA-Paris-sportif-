const pool = require('../config/db');

async function requireAdmin(req, res, next) {
    try {
        const result = await pool.query(
            'SELECT is_admin FROM utilisateur WHERE id_user = $1',
            [req.user.id]
        );
        if (result.rows.length === 0 || !result.rows[0].is_admin) {
            return res.status(403).json({ message: "Accès réservé aux administrateurs." });
        }
        next();
    } catch (err) {
        console.error("Erreur admin middleware:", err.message);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

module.exports = { requireAdmin };

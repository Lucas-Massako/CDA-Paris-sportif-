const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db'); // On va chercher le pool dans le fichier central

// --- ROUTE INSCRIPTION ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING id, nom, email';
        const result = await pool.query(query, [name, email, hashedPassword]);
        
        res.status(201).json({ 
            message: "Utilisateur créé avec succès !", 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error("Erreur Inscription:", err.message);
        res.status(500).json({ message: "Erreur : Cet email est peut-être déjà utilisé." });
    }
});

// --- ROUTE CONNEXION ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        res.json({ 
            message: "Connexion réussie !", 
            user: { name: user.nom, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
});

module.exports = router;
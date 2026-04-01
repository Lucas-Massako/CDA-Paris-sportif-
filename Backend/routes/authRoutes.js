const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- Nouvel import
const pool = require('../config/db'); 

// --- ROUTE INSCRIPTION ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO utilisateur (nom, email, mot_de_passe) 
            VALUES ($1, $2, $3) 
            RETURNING id_user, nom, email`;
        
        const result = await pool.query(query, [name, email, hashedPassword]);
        
        res.status(201).json({ 
            message: "Utilisateur créé avec succès !", 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error("Erreur Inscription:", err.message);
        res.status(500).json({ message: "Erreur BDD : " + err.message });
    }
});

// --- ROUTE CONNEXION (AVEC JWT) ---
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

        // --- GÉNÉRATION DU TOKEN JWT ---
        // On signe un token avec l'ID et l'email, valable 2 heures
        const token = jwt.sign(
            { id: user.id_user, email: user.email }, 
            process.env.JWT_SECRET || 'ma_cle_secrete_test', // Clé de secours si .env n'est pas lu
            { expiresIn: '2h' }
        );

        res.json({ 
            message: "Connexion réussie !", 
            token: token, // On envoie le token au Front
            user: { 
                name: user.nom, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error("Erreur Connexion:", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); 

// --- ROUTE INSCRIPTION ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Noms exacts de ta colonne Name sur pgAdmin : nom, email, mot_de_passe
        const query = `
            INSERT INTO utilisateur (nom, email, mot_de_passe) 
            VALUES ($1, $2, $3) 
            RETURNING id_utilisateur, nom, email`;
        
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

// --- ROUTE CONNEXION ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // On cherche dans la colonne "email"
        const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = result.rows[0];
        // On compare avec la colonne "mot_de_passe"
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);

        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        res.json({ 
            message: "Connexion réussie !", 
            user: { 
                name: user.nom, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error("Erreur Login:", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
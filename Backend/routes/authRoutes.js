const express = require('express');
const router = express.Router(); // <--- CRUCIAL : On crée l'objet router
const bcrypt = require('bcrypt'); // <--- CRUCIAL : Pour le hachage
const pool = require('../config/db.js');    // <--- Vérifie que ton fichier de config BDD est bien là

// --- ROUTE INSCRIPTION ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // On utilise 'mot_de_passe' car tu l'as renommé avec l'underscore tout à l'heure !
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

// --- ROUTE CONNEXION ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const user = result.rows[0];
        // On utilise user.mot_de_passe (le nom exact dans ta BDD avec underscore)
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
        console.error("Erreur Connexion:", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// --- EXPORT DU ROUTER ---
module.exports = router; // <--- CRUCIAL : Pour que index.js puisse l'utiliser
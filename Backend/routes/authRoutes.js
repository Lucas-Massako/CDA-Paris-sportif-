const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// On crée la connexion (elle utilise l'URL définie dans ton docker-compose)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Cette route correspond à : POST http://localhost:8000/api/auth/register
router.post('/register', async (req, res) => {
    // On récupère les données envoyées par le Frontend
    const { name, email, password } = req.body;

    try {
        console.log("Tentative d'enregistrement en BDD pour :", email);

        // LA REQUÊTE SQL : 
        // /!\ Attention : vérifie bien que tes colonnes s'appellent nom, email et mot_de_passe dans ta table utilisateur
        const query = 'INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, password];

        const result = await pool.query(query, values);

        // Si ça réussit, on renvoie l'utilisateur créé
        res.status(201).json({ 
            message: "Utilisateur enregistré avec succès !",
            user: result.rows[0] 
        });

    } catch (err) {
        console.error("Erreur SQL détaillée :", err.message);
        
        // Gestion d'erreur (ex: email déjà utilisé)
        res.status(500).json({ 
            error: "Erreur lors de l'inscription en base de données",
            details: err.message 
        });
    }
});

module.exports = router;
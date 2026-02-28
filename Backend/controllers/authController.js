const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fonction pour s'inscrire
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // REQUÊTE SQL : On insère l'utilisateur et on demande à SQL de nous renvoyer la ligne créée
        const query = 'INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, password];
        
        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Utilisateur créé avec succès en base de données !",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Erreur BDD:", err.message);
        res.status(500).json({ error: "Erreur lors de l'enregistrement." });
    }
};
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
// 2. On dit à Express d'utiliser ces routes avec le préfixe /api/auth
app.use('/api/auth', authRoutes);
// Connexion à PostgreSQL via l'URL définie dans le docker-compose
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', async (req, res) => {
  try {
    // Petit test pour voir si la BDD répond
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: "API Footix en ligne 🚀", 
      db_time: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur BDD : " + err.message });
  }
});

app.listen(8000, () => {
  console.log('Serveur API lancé sur le port 8000');
});
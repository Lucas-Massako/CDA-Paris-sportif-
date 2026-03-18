const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const pool = require('./db'); // On importe le pool UNIQUE depuis db.js

const app = express();
app.use(cors());
app.use(express.json());

// On branche les routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', async (req, res) => {
  try {
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
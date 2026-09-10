const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const betRoutes = require('./routes/betRoutes');
const matchRoutes = require('./routes/matchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pool = require('./config/db');
const { startScheduler } = require('./utils/scheduler');

const app = express();

// Derrière le proxy Railway, l'IP réelle du client arrive dans X-Forwarded-For.
// Sans cette ligne, express-rate-limit voit une IP unique pour tout le trafic :
// le quota anti-brute-force deviendrait global au lieu d'être appliqué par IP.
// La valeur 1 ne fait confiance qu'au premier relais (pas d'usurpation possible).
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: "API Footix en ligne", db_time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: "Erreur BDD: " + err.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Serveur API lancé sur le port ${PORT}`);
    // Synchronisation périodique des résultats de matchs (résolution des paris)
    startScheduler();
});

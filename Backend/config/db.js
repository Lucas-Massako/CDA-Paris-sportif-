const { Pool } = require('pg');

// C'est ici que la magie opère ! 
// process.env.DATABASE_URL est une variable "cachée" que Docker injecte dans ton code.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// On teste la connexion une fois au démarrage
pool.on('connect', () => {
  console.log('✅ Connecté à la base de données PostgreSQL');
});

module.exports = pool; // On exporte la connexion prête à l'emploi
// db.js
const { Pool } = require('pg');

// Replace the following connection string with your PostgreSQL connection string
const connectionString = 'postgresql://postgres:root@localhost:5432/nium_db';
const pool = new Pool({
  connectionString: connectionString,
});

module.exports = pool;
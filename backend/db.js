const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // It's recommended to use SSL in production
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// A simple query function
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

// The 'run' function is specific to sqlite's API.
// With node-postgres, you use `query` for all operations.
// We can create a helper for insert/update if we want to get the row count,
// but for now, the standard query function should suffice for most uses.
// For example, an INSERT can be `query('INSERT INTO users... RETURNING id')`
// to get the new ID.

module.exports = {
  pool,
  query
};

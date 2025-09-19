const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../db');

const initializeDatabase = async () => {
  const sql = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
  console.log('Initializing database...');

  try {
    // Use the pool to execute the initialization script
    await pool.query(sql);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
    // Re-throw the error to be caught by the server startup logic
    throw err;
  }
};

module.exports = { initializeDatabase };

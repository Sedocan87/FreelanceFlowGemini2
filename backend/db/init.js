const fs = require('fs').promises;
const path = require('path');
const { db } = require('../db'); // Corrected path, although previous one worked

const initializeDatabase = async () => {
  const sql = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
  console.log('Initializing database...');

  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error('Error initializing database:', err);
        return reject(err);
      }
      console.log('Database initialized successfully.');
      resolve();
    });
  });
};

// Export the function
module.exports = { initializeDatabase };

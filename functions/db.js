const sqlite3 = require('sqlite3').verbose();
const logger = require('./logger');

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    logger.error(err.message);
    throw err;
  }
  logger.info('Connected to the in-memory SQLite database.');
});

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        logger.error(err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        logger.error(err.message);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

module.exports = {
  query,
  run,
};

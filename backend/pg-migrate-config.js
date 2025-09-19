// backend/pg-migrate-config.js
require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  dir: 'migrations',
  migrationsTable: 'pgmigrations',
  // It's recommended to use SSL in production
  // The `pg` library automatically handles SSL connections
  // if the DATABASE_URL starts with postgres://...?...&ssl=true
};

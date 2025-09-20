require('dotenv').config();
const logger = require('./logger');

// Initialize Firebase Admin SDK
require('./firebaseAdmin');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;

// --- Middlewares ---

// Set security HTTP headers
app.use(helmet());

// Enable CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const stripeRoutes = require('./routes/stripe');

// Stripe webhook needs raw body, so we must register it before express.json()
app.use('/api/stripe', stripeRoutes);

// Parse JSON bodies
app.use(express.json());

const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');
const timeRoutes = require('./routes/time');
const invoiceRoutes = require('./routes/invoices');
const expenseRoutes = require('./routes/expenses');
const settingsRoutes = require('./routes/settings');
const teamRoutes = require('./routes/team');
const recurringInvoicesRoutes = require('./routes/recurringInvoices');

const authMiddleware = require('./middleware/authMiddleware');

// --- API routes ---
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/time', authMiddleware, timeRoutes);
app.use('/api/invoices', authMiddleware, invoiceRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/team', authMiddleware, teamRoutes);
app.use('/api/recurring-invoices', authMiddleware, recurringInvoicesRoutes);
app.use('/api/auth', authRoutes);

const functions = require('firebase-functions');

// --- Centralized Error Handling ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const fs = require('fs');
const path = require('path');
const { run } = require('./db');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (file.endsWith('.js')) {
      const migration = require(path.join(migrationsDir, file));
      if (typeof migration.up === 'function') {
        const fileContents = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        const sqlMatch = fileContents.match(/pgm\.sql\(`([\s\S]*)`\);/);
        if (sqlMatch && sqlMatch[1]) {
          const sql = sqlMatch[1];
          // SQLite doesn't support the SERIAL PRIMARY KEY syntax directly in the same way as PostgreSQL.
          // We'll replace it with a more compatible version for SQLite.
          const sqliteSql = sql.replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT');
          await run(sqliteSql);
          logger.info(`Migration ${file} executed.`);
        }
      }
    }
  }
};

runMigrations().catch(err => {
    logger.error('Migration failed:', err);
    process.exit(1);
});

// Expose the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

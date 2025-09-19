require('dotenv').config();
const logger = require('./logger');

// Initialize Firebase Admin SDK
require('./firebaseAdmin');

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const stripeRoutes = require('./routes/stripe');

// Stripe webhook needs raw body, so we must register it before express.json()
app.use('/api/stripe', stripeRoutes);

app.use(express.json());

const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');
const authRoutes = require('./routes/auth');

const authMiddleware = require('./middleware/authMiddleware');

// API routes
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/auth', authRoutes);

const { exec } = require('child_process');

const runMigrations = () => {
    return new Promise((resolve, reject) => {
        // We need to be in the backend directory to run this command
        const migrate = exec(
            'npm run db:migrate up',
            { cwd: __dirname, env: process.env },
            (err, stdout, stderr) => {
                if (err) {
                    logger.error('Migration stderr:', stderr);
                    reject(err);
                } else {
                    resolve(stdout);
                }
            }
        );

        // Forward stdout+stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });
};

const startServer = async () => {
    try {
        logger.info('Running database migrations...');
        await runMigrations();
        logger.info('Migrations finished.');
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (err) {
        logger.error('Failed to run migrations or start server.', err);
        process.exit(1);
    }
};

startServer();

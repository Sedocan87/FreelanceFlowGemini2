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

const authMiddleware = require('./middleware/authMiddleware');

// --- API routes ---
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/clients', authMiddleware, clientRoutes);
app.use('/api/auth', authRoutes);

// --- Centralized Error Handling ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const startServer = async () => {
    try {
        // --- Database Migrations ---
        // It's recommended to run database migrations as a separate step in your deployment process
        // For example, you can add a script to your package.json: "migrate": "npm run db:migrate up"
        // and run it before starting the server.
        // This prevents issues in production environments with multiple server instances.
        logger.info('Starting server...');
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (err) {
        logger.error('Failed to start server.', err);
        process.exit(1);
    }
};

startServer();

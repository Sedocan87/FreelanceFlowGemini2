require('dotenv').config();

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

const { initializeDatabase } = require('./db/init');

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to initialize database. Server not started.', err);
    process.exit(1);
});

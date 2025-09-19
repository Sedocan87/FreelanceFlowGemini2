const admin = require('firebase-admin');
const logger = require('./logger');

try {
  if (!process.env.FIREBASE_ADMIN_SDK_JSON) {
    throw new Error('FIREBASE_ADMIN_SDK_JSON environment variable is not set.');
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  logger.info('Firebase Admin SDK initialized successfully.');

} catch (error) {
  logger.error('Failed to initialize Firebase Admin SDK:', error);
  // We don't want the app to run without firebase admin, so we exit
  process.exit(1);
}

module.exports = admin;

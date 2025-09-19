const express = require('express');
const router = express.Router();
const { query } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/sync
// This endpoint is called after a user authenticates with Firebase on the client.
// It ensures that a corresponding user record exists in our application's database.
router.post('/sync', authMiddleware, async (req, res) => {
  // The user info is attached to req.user by the authMiddleware
  const { uid, email, name } = req.user;

  if (!uid || !email) {
    return res.status(400).json({ error: 'Firebase UID and email are required.' });
  }

  try {
    // Check if the user already exists in our database
    let userResult = await query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);

    if (userResult.rows.length > 0) {
      // User exists, return the user's data
      res.status(200).json({ user: userResult.rows[0] });
    } else {
      // User does not exist, create a new user record
      // The name might not always be available from the token, handle that case.
      const userName = name || email.split('@')[0];

      const newUserResult = await query(
        'INSERT INTO users (firebase_uid, email, name) VALUES ($1, $2, $3) RETURNING *',
        [uid, email, userName]
      );

      res.status(201).json({ user: newUserResult.rows[0] });
    }
  } catch (err) {
    console.error('Error during user sync:', err);
    // Check for unique constraint violation, just in case
    if (err.code === '23505') { // PostgreSQL unique violation error code
        return res.status(409).json({ error: 'User with this email or Firebase UID already exists.' });
    }
    res.status(500).json({ error: 'Failed to sync user with database.' });
  }
});

module.exports = router;

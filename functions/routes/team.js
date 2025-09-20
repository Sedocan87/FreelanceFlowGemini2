const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/team
router.get('/', async (req, res) => {
  try {
    // First, get the current user's company ID
    const userCompany = await query('SELECT company_id FROM users WHERE id = ?', [req.user.id]);
    if (userCompany.length === 0 || !userCompany[0].company_id) {
      return res.status(404).json({ error: 'User or company not found' });
    }
    const companyId = userCompany[0].company_id;

    // Then, get all users with that company ID
    const teamMembers = await query('SELECT id, name, email, role, rate FROM users WHERE company_id = ?', [companyId]);
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Note: For POST, PUT, and DELETE, we would need a more robust system for inviting users,
// which is beyond the scope of this initial implementation. For now, we will just have the GET endpoint.

module.exports = router;

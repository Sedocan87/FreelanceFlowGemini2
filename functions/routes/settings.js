const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const user = await query('SELECT company_name, company_email, company_address, logo_url, tax_rate, default_currency FROM users WHERE id = ?', [req.user.id]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  const { companyName, companyEmail, companyAddress, logoUrl, taxRate, defaultCurrency } = req.body;
  const sql = `UPDATE users SET
                 company_name = ?,
                 company_email = ?,
                 company_address = ?,
                 logo_url = ?,
                 tax_rate = ?,
                 default_currency = ?
               WHERE id = ?`;
  const params = [companyName, companyEmail, companyAddress, logoUrl, taxRate, defaultCurrency, req.user.id];

  try {
    await run(sql, params);
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

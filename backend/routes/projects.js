const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects WHERE user_id = ?', [req.user.id]);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  const { name, clientId, status, tracked, assignedTo, billingType, billingRate, budget, currency } = req.body;
  const sql = `INSERT INTO projects (name, client_id, user_id, status, tracked, assigned_to, billing_type, billing_rate, budget, currency)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, clientId, req.user.id, status, tracked, assignedTo, billingType, billingRate, budget, currency];

  try {
    const result = await run(sql, params);
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  const { name, clientId, userId, status, tracked, assignedTo, billingType, billingRate, budget, currency } = req.body;
  const sql = `UPDATE projects SET
                 name = ?,
                 client_id = ?,
                 user_id = ?,
                 status = ?,
                 tracked = ?,
                 assigned_to = ?,
                 billing_type = ?,
                 billing_rate = ?,
                 budget = ?,
                 currency = ?
               WHERE id = ?`;
  const params = [name, clientId, userId, status, tracked, assignedTo, billingType, billingRate, budget, currency, req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const sql = 'DELETE FROM projects WHERE id = ?';
  const params = [req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

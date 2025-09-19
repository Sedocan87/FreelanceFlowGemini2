const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const clients = await query('SELECT * FROM clients WHERE user_id = ?', [req.user.id]);
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const sql = `INSERT INTO clients (name, email, user_id) VALUES (?, ?, ?)`;
  const params = [name, email, req.user.id];

  try {
    const result = await run(sql, params);
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;
  const sql = `UPDATE clients SET name = ?, email = ? WHERE id = ?`;
  const params = [name, email, req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  const sql = 'DELETE FROM clients WHERE id = ?';
  const params = [req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

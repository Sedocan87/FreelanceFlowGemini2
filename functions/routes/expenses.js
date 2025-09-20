const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await query('SELECT * FROM expenses WHERE user_id = ?', [req.user.id]);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  const { projectId, description, amount, date, isBilled, isBillable } = req.body;
  const sql = `INSERT INTO expenses (project_id, user_id, description, amount, date, is_billed, is_billable)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [projectId, req.user.id, description, amount, date, isBilled, isBillable];

  try {
    const result = await run(sql, params);
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  const { projectId, description, amount, date, isBilled, isBillable } = req.body;
  const sql = `UPDATE expenses SET
                 project_id = ?,
                 description = ?,
                 amount = ?,
                 date = ?,
                 is_billed = ?,
                 is_billable = ?
               WHERE id = ? AND user_id = ?`;
  const params = [projectId, description, amount, date, isBilled, isBillable, req.params.id, req.user.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const sql = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
  const params = [req.params.id, req.user.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

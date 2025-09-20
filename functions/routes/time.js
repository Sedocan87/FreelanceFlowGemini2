const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/time
router.get('/', async (req, res) => {
  try {
    const timeEntries = await query('SELECT * FROM time_entries WHERE user_id = ?', [req.user.id]);
    res.json(timeEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/time
router.post('/', async (req, res) => {
  const { projectId, hours, date, description, memberId, isBilled } = req.body;
  const sql = `INSERT INTO time_entries (project_id, user_id, hours, date, description, member_id, is_billed)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [projectId, req.user.id, hours, date, description, memberId, isBilled];

  try {
    const result = await run(sql, params);
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/time/:id
router.put('/:id', async (req, res) => {
  const { projectId, hours, date, description, memberId, isBilled } = req.body;
  const sql = `UPDATE time_entries SET
                 project_id = ?,
                 hours = ?,
                 date = ?,
                 description = ?,
                 member_id = ?,
                 is_billed = ?
               WHERE id = ?`;
  const params = [projectId, hours, date, description, memberId, isBilled, req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Time entry not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/time/:id
router.delete('/:id', async (req, res) => {
  const sql = 'DELETE FROM time_entries WHERE id = ?';
  const params = [req.params.id];

  try {
    const result = await run(sql, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Time entry not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

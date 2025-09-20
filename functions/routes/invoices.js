const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await query(`
      SELECT i.*, c.name as clientName
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.user_id = ?
    `, [req.user.id]);

    for (const invoice of invoices) {
      invoice.items = await query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoice.id]);
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices
router.post('/', async (req, res) => {
  const { clientId, issueDate, dueDate, status, currency, items } = req.body;

  try {
    const amount = items.reduce((sum, item) => sum + item.amount, 0);

    const invoiceSql = `INSERT INTO invoices (client_id, user_id, issue_date, due_date, amount, status, currency)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const invoiceParams = [clientId, req.user.id, issueDate, dueDate, amount, status, currency];

    const result = await run(invoiceSql, invoiceParams);
    const invoiceId = result.lastID;

    if (items && items.length > 0) {
      const itemsSql = `INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)`;
      for (const item of items) {
        await run(itemsSql, [invoiceId, item.description, item.amount]);
      }
    }

    res.status(201).json({ id: invoiceId, ...req.body, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/invoices/:id
router.put('/:id', async (req, res) => {
  const { clientId, issueDate, dueDate, status, currency, items } = req.body;
  const { id } = req.params;

  try {
    const amount = items.reduce((sum, item) => sum + item.amount, 0);

    const invoiceSql = `UPDATE invoices SET client_id = ?, issue_date = ?, due_date = ?, amount = ?, status = ?, currency = ?
                        WHERE id = ? AND user_id = ?`;
    const invoiceParams = [clientId, issueDate, dueDate, amount, status, currency, id, req.user.id];

    await run(invoiceSql, invoiceParams);

    // Easiest way to handle items is to delete all and re-insert
    await run('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);

    if (items && items.length > 0) {
      const itemsSql = `INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)`;
      for (const item of items) {
        await run(itemsSql, [id, item.description, item.amount]);
      }
    }

    res.json({ id, ...req.body, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // The database will cascade delete the invoice_items
    const result = await run('DELETE FROM invoices WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { query, run } = require('../db');

// GET /api/recurring-invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await query(`
      SELECT ri.*, c.name as clientName
      FROM recurring_invoices ri
      JOIN clients c ON ri.client_id = c.id
      WHERE ri.user_id = ?
    `, [req.user.id]);

    for (const invoice of invoices) {
      invoice.items = await query('SELECT * FROM recurring_invoice_items WHERE recurring_invoice_id = ?', [invoice.id]);
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recurring-invoices
router.post('/', async (req, res) => {
  const { clientId, frequency, nextDueDate, currency, items } = req.body;

  try {
    const amount = items.reduce((sum, item) => sum + item.amount, 0);

    const invoiceSql = `INSERT INTO recurring_invoices (client_id, user_id, frequency, next_due_date, amount, currency)
                        VALUES (?, ?, ?, ?, ?, ?)`;
    const invoiceParams = [clientId, req.user.id, frequency, nextDueDate, amount, currency];

    const result = await run(invoiceSql, invoiceParams);
    const invoiceId = result.lastID;

    if (items && items.length > 0) {
      const itemsSql = `INSERT INTO recurring_invoice_items (recurring_invoice_id, description, amount) VALUES (?, ?, ?)`;
      for (const item of items) {
        await run(itemsSql, [invoiceId, item.description, item.amount]);
      }
    }

    res.status(201).json({ id: invoiceId, ...req.body, amount });
  } catch (err)
    {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/recurring-invoices/:id
router.put('/:id', async (req, res) => {
    const { clientId, frequency, nextDueDate, currency, items } = req.body;
    const { id } = req.params;

    try {
        const amount = items.reduce((sum, item) => sum + item.amount, 0);

        const invoiceSql = `UPDATE recurring_invoices SET client_id = ?, frequency = ?, next_due_date = ?, amount = ?, currency = ?
                            WHERE id = ? AND user_id = ?`;
        const invoiceParams = [clientId, frequency, nextDueDate, amount, currency, id, req.user.id];

        await run(invoiceSql, invoiceParams);

        await run('DELETE FROM recurring_invoice_items WHERE recurring_invoice_id = ?', [id]);

        if (items && items.length > 0) {
            const itemsSql = `INSERT INTO recurring_invoice_items (recurring_invoice_id, description, amount) VALUES (?, ?, ?)`;
            for (const item of items) {
                await run(itemsSql, [id, item.description, item.amount]);
            }
        }

        res.json({ id, ...req.body, amount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/recurring-invoices/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await run('DELETE FROM recurring_invoices WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Recurring invoice not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

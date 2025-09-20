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

// Invite a new team member
router.post('/invite', async (req, res) => {
    const { email, rate } = req.body;
    const inviterId = req.user.id;

    if (!email || !rate) {
        return res.status(400).json({ error: 'Email and rate are required' });
    }

    try {
        const inviterResult = await query('SELECT company_id FROM users WHERE id = ?', [inviterId]);
        if (inviterResult.length === 0) {
            return res.status(404).json({ error: 'Inviter not found' });
        }
        const companyId = inviterResult[0].company_id;

        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            const existingUserInCompany = await query('SELECT id FROM users WHERE email = ? AND company_id = ?', [email, companyId]);
            if (existingUserInCompany.length > 0) {
                return res.status(409).json({ error: 'User with this email already exists in the company' });
            }
            // Logic to invite an existing user to a new company can be added here
            // For now, we'll just return an error
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const result = await run(
            'INSERT INTO users (name, email, role, rate, company_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            ['Pending Invitation', email, 'Member', rate, companyId, 'pending']
        );

        const newUser = {
            id: result.lastID,
            name: 'Pending Invitation',
            email,
            role: 'Member',
            rate: parseFloat(rate),
        };

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a team member's rate
router.put('/:memberId', async (req, res) => {
    const { memberId } = req.params;
    const { rate } = req.body;
    const userId = req.user.id;

    if (!rate) {
        return res.status(400).json({ error: 'Rate is required' });
    }

    try {
        const userCompany = await query('SELECT company_id FROM users WHERE id = ?', [userId]);
        const memberCompany = await query('SELECT company_id FROM users WHERE id = ?', [memberId]);

        if (userCompany.length === 0 || memberCompany.length === 0 || userCompany[0].company_id !== memberCompany[0].company_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await run('UPDATE users SET rate = ? WHERE id = ?', [rate, memberId]);

        res.json({ id: memberId, rate: parseFloat(rate) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a team member
router.delete('/:memberId', async (req, res) => {
    const { memberId } = req.params;
    const userId = req.user.id;

    try {
        const userCompany = await query('SELECT company_id FROM users WHERE id = ?', [userId]);
        const memberCompany = await query('SELECT company_id, role FROM users WHERE id = ?', [memberId]);

        if (userCompany.length === 0 || memberCompany.length === 0 || userCompany[0].company_id !== memberCompany[0].company_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (memberCompany[0].role === 'Admin') {
            return res.status(403).json({ error: 'Cannot delete an admin' });
        }

        // Before deleting the user, unassign them from any projects
        await run('UPDATE projects SET assigned_to = NULL WHERE assigned_to = ?', [memberId]);

        await run('DELETE FROM users WHERE id = ?', [memberId]);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

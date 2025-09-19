const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');
const { query } = require('../db');

// POST /api/stripe/create-checkout-session
// Creates a Stripe Checkout session for a subscription.
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;
  const firebaseUid = req.user.uid;

  if (!priceId || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'priceId, successUrl, and cancelUrl are required.' });
  }

  try {
    // Get the user from our database
    const userResult = await query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in our database.' });
    }
    const user = userResult.rows[0];

    // Here you might want to check if the user is already a paying customer.
    // You would typically have a stripe_customer_id column on your users table.
    // For this example, we'll assume we create a new customer each time if one doesn't exist.
    // A more robust implementation would check for an existing stripe_customer_id.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // We can pass the user's internal ID in the metadata
      client_reference_id: user.id,
      // Or, better, pre-create a Stripe Customer and pass its ID
      // customer: stripe_customer_id,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ error: 'Failed to create Stripe session.' });
  }
});

module.exports = router;

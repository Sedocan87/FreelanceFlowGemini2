const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');
const { query } = require('../db');

// POST /api/stripe/create-checkout-session
// Creates a Stripe Checkout session for a subscription.
router.post('/create-checkout-session', express.json(), authMiddleware, async (req, res) => {
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

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          firebaseUid: firebaseUid,
        },
      });
      stripeCustomerId = customer.id;

      // Update our database with the new stripe_customer_id
      await query('UPDATE users SET stripe_customer_id = $1 WHERE firebase_uid = $2', [stripeCustomerId, firebaseUid]);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: stripeCustomerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ error: 'Failed to create Stripe session.' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerId = session.customer;
      // Note: It's better to use the customer ID from the event
      await query(
        "UPDATE users SET subscription_status = 'active' WHERE stripe_customer_id = $1",
        [customerId]
      );
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      await query(
        "UPDATE users SET subscription_status = 'active' WHERE stripe_customer_id = $1",
        [customerId]
      );
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      // You might want more sophisticated logic here, e.g., for dunning
      await query(
        "UPDATE users SET subscription_status = 'past_due' WHERE stripe_customer_id = $1",
        [customerId]
      );
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      await query(
        "UPDATE users SET subscription_status = 'canceled' WHERE stripe_customer_id = $1",
        [customerId]
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

module.exports = router;

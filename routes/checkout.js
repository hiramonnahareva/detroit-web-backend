const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;
  if (!priceId) return res.status(400).json({ error: 'Price ID is required.' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://detroit-web.web.app/success',
      cancel_url: 'https://detroit-web.web.app/cancel',
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

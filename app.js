
// const express = require('express');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
// const app = express();
// const cors = require('cors');

// const axios = require('axios');


// const uri = process.env.MONGO_URI;

// // Middleware
// app.use(cors()); // Allow CORS for all origins (adjust as necessary)
// app.use(express.json()); // Parse JSON bodies

// // Create checkout session
// app.post('/create-checkout-session', async (req, res) => {
//   const { priceId } = req.body; // Get the priceId from the request body

//   // Validate priceId
//   if (!priceId) {
//     return res.status(400).json({ error: 'Price ID is required.' });
//   }

//   try {
//     // Create a new checkout session for subscriptions
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price: priceId, // Ensure this is a subscription price ID
//         quantity: 1,
//       }],
//       mode: 'subscription', // Set to subscription mode
//       success_url: 'http://localhost:5173/success',
//       cancel_url: 'http://localhost:5173/cancel',
//     });

//     // Return the session ID
//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);

//     // Provide more specific error messages based on error type
//     if (error.type === 'StripeCardError') {
//       return res.status(402).json({ error: 'Your card was declined.' });
//     } else if (error.type === 'StripeInvalidRequestError') {
//       return res.status(400).json({ error: 'Invalid request. Please check your parameters.' });
//     } else {
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// });


// // Route to handle successful payment
// app.get('/success', (req, res) => {
//   res.send(`
//     <h1>Payment Successful!</h1>
//     <p>Thank you for your purchase. Your payment was processed successfully.</p>
//     <a href="/">Return to Home</a>
//   `);
// });

// // Route to handle canceled payment
// app.get('/cancel', (req, res) => {
//   res.send(`
//     <h1>Payment Canceled</h1>
//     <p>Your payment has been canceled. If this was a mistake, please try again.</p>
//     <a href="/">Return to Home</a>
//   `);
// });;




// const mongoose = require('mongoose');

// // import OpenAI from 'openai';

// // const app = express();
// app.use(express.json()); // Middleware to parse JSON bodies

// const OpenAI = require('openai');
// // User Schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   preferences: {
//     type: Object, // Define this more specifically if needed
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const User = mongoose.model('User', userSchema);




// // Connect to MongoDB
// mongoose.connect(uri, {
//   // useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // User Preferences Schema (move this to a separate model file if needed)
// const userPreferencesSchema = new mongoose.Schema({
//   purpose: String,
//   duration: String,
//   interests: [String],
//   budget: Number,
//   diningPreferences: [String],
//   activityPreferences: [String],
// });

// const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

// // Save User Preferences Route 
// app.post('/preferences', async (req, res) => {
//   try {
//     const preferences = new UserPreferences(req.body);
//     await preferences.save();
//     res.status(201).json(preferences);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// // OpenAI configuration
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Use your actual API key
// });



// app.post('/generate-itinerary', async (req, res) => {
//   try {
//     const { preferences } = req.body; // User preferences from the frontend

//     // Construct OpenAI prompt
//     const prompt = `
//       Generate a custom itinerary including:
//       - Restaurants based on dining preferences: ${preferences.diningPreferences.join(', ')}.
//       - Entertainment (concerts, sports events, nightlife) based on activity preferences: ${preferences.activityPreferences.join(', ')}.
//       - Local attractions.
//       - Lodging options within a budget of ${preferences.budget}.
//     `;

//     // Call OpenAI API
//     const response = await openai.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       prompt,
//       max_tokens: 500
//     });

//     // Extract response
//     const itinerary = response.data.choices[0].text;
//     res.status(200).json({ itinerary });
//   } catch (error) {
//     console.error('Error generating itinerary:', error);
//     res.status(500).json({ message: 'Failed to generate itinerary.' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const preferencesRoutes = require('./routes/preferences');
const checkoutRoutes = require('./routes/checkout');
const { generateItinerary } = require('./services/openaiService');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/preferences', preferencesRoutes);
app.use('/checkout', checkoutRoutes);

// OpenAI Itinerary Generation Route
app.post('/generate-itinerary', async (req, res) => {
  try {
    const { preferences } = req.body;
    const itinerary = await generateItinerary(preferences);
    res.status(200).json({ itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ message: 'Failed to generate itinerary.' });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});










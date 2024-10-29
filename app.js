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










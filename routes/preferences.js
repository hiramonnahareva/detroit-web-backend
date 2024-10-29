const express = require('express');
const UserPreferences = require('../models/userPreferences');
const router = express.Router();

// Save User Preferences
router.post('/', async (req, res) => {
  try {
    const preferences = new UserPreferences(req.body);
    await preferences.save();
    res.status(201).json(preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Failed to save preferences.' });
  }
});

module.exports = router;

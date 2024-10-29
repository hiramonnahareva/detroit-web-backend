const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  purpose: String,
  duration: String,
  interests: [String],
  budget: Number,
  diningPreferences: [String],
  activityPreferences: [String],
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
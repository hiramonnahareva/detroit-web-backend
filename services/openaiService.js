const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateItinerary(preferences) {
  const prompt = `
    Generate a custom itinerary including:
    - Restaurants based on dining preferences: ${preferences.diningPreferences.join(', ')}.
    - Entertainment (concerts, sports events, nightlife) based on activity preferences: ${preferences.activityPreferences.join(', ')}.
    - Local attractions.
    - Lodging options within a budget of ${preferences.budget}.
  `;

  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    max_tokens: 500,
  });

  return response.data.choices[0].text;
}

module.exports = { generateItinerary };
require('dotenv').config();
const { GenerativeAI } = require('@google/generative-ai');

const ai = new GenerativeAI({
  apiKey: process.env.API_KEY, // Use the API key from environment variables
});

// Example function to generate a response
async function generateResponse(prompt) {
  try {
    const response = await ai.generateText({ prompt });
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
  }
}

module.exports = {
  generateResponse,
};

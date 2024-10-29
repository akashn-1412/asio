// api.js
const { GenerativeAI } = require('@google/generative-ai');

const ai = new GenerativeAI({
  apiKey: 'AIzaSyCJLrNXNg5tQULSEmrpDfevXIObPxKEcv0', // Replace with your actual API key
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

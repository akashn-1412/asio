const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Setup directories
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Google Generative AI setup
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
});

// Middleware settings
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint to fetch and analyze webpage content
app.post('/fetch', async (req, res) => {
  const url = req.body.url;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Remove internal and external CSS and JS
    $('style').remove();
    $('link[rel="stylesheet"]').remove();
    $('script').remove();

    // Fetch the cleaned HTML and truncate if too long
    let cleanedHtml = $.html();
    if (cleanedHtml.length > 5000) { // Limit length to avoid exceeding API token limits
      cleanedHtml = cleanedHtml.slice(0, 5000) + '...';
    }

    // Analyze the cleaned HTML content
    const prompt = `Analyze the following web page content: ${cleanedHtml}. Provide SEO optimization suggestions, improvement ideas, and note any mistakes.`;

    const result = await geminiModel.generateContent(prompt);
    const insights = result.response.text();

    res.json({ insights });
  } catch (error) {
    console.error(`Error processing the URL: ${error.message}`);
    res.status(500).json({ error: 'An error occurred while processing the URL.' });
  }
});

// New endpoint for generating responses based on user prompts
app.post('/generate', async (req, res) => {
  const { prompt } = req.body; // Extract prompt from request body

  try {
    const result = await geminiModel.generateContent(prompt);
    const generatedResponse = result.response.text();

    res.json({ response: generatedResponse });
  } catch (error) {
    console.error(`Error generating response: ${error.message}`);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

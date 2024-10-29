const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

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

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const url = req.body.url;

        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            $('style').remove();
            $('link[rel="stylesheet"]').remove();
            $('script').remove();

            let cleanedHtml = $.html();
            if (cleanedHtml.length > 5000) {
                cleanedHtml = cleanedHtml.slice(0, 5000) + '...';
            }

            const prompt = `Analyze the following web page content: ${cleanedHtml}. Provide SEO optimization suggestions, improvement ideas, and note any mistakes.`;
            const result = await geminiModel.generateContent(prompt);
            const insights = result.response.text();

            res.json({ insights });
        } catch (error) {
            console.error(`Error processing the URL: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while processing the URL.' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

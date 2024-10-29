const axios = require('axios');

// Serverless function to fetch SEO insights
module.exports = async (req, res) => {
    // Check if the request method is POST
    if (req.method === 'POST') {
        try {
            // Extract data from the request body if needed
            const { url } = req.body;

            // Replace with your actual API endpoint or logic to fetch insights
            const response = await axios.get(`https://api.example.com/seo?url=${encodeURIComponent(url)}`);

            // Send the fetched data as a response
            return res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching SEO insights:', error);
            return res.status(500).json({ error: 'Failed to fetch SEO insights' });
        }
    } else {
        // Handle unsupported request methods
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

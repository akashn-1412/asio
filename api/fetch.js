app.post('/fetch', async (req, res) => {
    const url = req.body.url;

    try {
        const response = await axios.get(url);
        console.log('Axios response status:', response.status); // Check the status code
        if (response.status !== 200) {
            throw new Error(`Failed to fetch the URL. Status code: ${response.status}`);
        }

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove internal and external CSS and JS
        $('style').remove();
        $('link[rel="stylesheet"]').remove();
        $('script').remove();

        // Fetch the cleaned HTML and truncate if too long
        let cleanedHtml = $.html();
        if (cleanedHtml.length > 5000) {
            cleanedHtml = cleanedHtml.slice(0, 5000) + '...';
        }

        console.log('Cleaned HTML:', cleanedHtml); // Debug log

        // Analyze the cleaned HTML content
        const prompt = `Analyze the following web page content: ${cleanedHtml}. Provide SEO optimization suggestions, improvement ideas, and note any mistakes.`;
        const result = await geminiModel.generateContent(prompt);
        console.log('Full result from Google AI:', result); // Log the entire result

        const insights = result.response?.text(); // Safely access insights
        if (!insights) {
            throw new Error('No insights generated.'); // Throw an error if insights are not available
        }

        res.json({ insights });
    } catch (error) {
        console.error(`Error processing the URL: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while processing the URL.' });
    }
});

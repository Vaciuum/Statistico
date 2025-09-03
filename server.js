require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GoogleSearchService = require('./google-search');
const PageScraper = require('./scraper'); 
const GeminiProcessor = require('./gemini-processor');

const app = express();
const PORT = 8082;

app.use(cors());
app.use(express.json());

// Initialize services
const googleSearch = new GoogleSearchService();
const scraper = new PageScraper();
const gemini = new GeminiProcessor();

app.post('/research', async (req, res) => {
  try {
    const { query } = req.body;
    console.log(`🔍 Researching: "${query}"`);
    
    // 1. Google search → get 5 real URLs
    console.log('Starting Google search...');
    const urls = await googleSearch.searchQuery(query);
    console.log(`📊 Found ${urls.length} URLs:`, urls.map(u => u.url));
    
    // 2. Process each URL sequentially
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      const urlData = urls[i];
      console.log(`📄 Processing ${i+1}/${urls.length}: ${urlData.url}`);
      
      try {
        // Scrape page content
        const pageData = await scraper.scrapePage(urlData.url);
        
        if (pageData.content.length > 100) {
          // Send to Gemini for analysis
          const extracted = await gemini.extractData(pageData.content, urlData.url, query);
          
          // Add any found statistics
          if (extracted && extracted.length > 0) {
            results.push(...extracted);
            console.log(`✅ Found ${extracted.length} statistics from ${urlData.url}`);
          }
        } else {
          console.log(`⚠️ Page too short, skipping: ${urlData.url}`);
        }
        
      } catch (error) {
        console.error(`❌ Failed processing ${urlData.url}:`, error.message);
        // Continue with next URL
      }
    }
    
    // 3. Return all found statistics
    res.json({
      success: true,
      query,
      totalUrls: urls.length,
      statisticsFound: results.length,
      data: results
    });
    
  } catch (error) {
    console.error('Research failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Automated Research System' });
});

app.listen(PORT, () => {
  console.log(`🚀 Research service running on port ${PORT}`);
});
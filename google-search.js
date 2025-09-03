const axios = require('axios');

class GoogleSearchService {
  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  }

  async searchQuery(query) {
    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Search API key and Search Engine ID required');
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.apiKey,
          cx: this.searchEngineId,
          q: query,
          num: 5
        }
      });

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet
      }));

    } catch (error) {
      console.error('Google Search failed:', error.message);
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}

module.exports = GoogleSearchService;
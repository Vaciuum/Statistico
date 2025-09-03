# Statistico 📊

A powerful automated research system that searches Google, scrapes web content, and uses AI to extract statistics with real source URLs.

## What It Does

Statistico solves the problem of Google AI returning redirect URLs instead of real article links. It:

1. **Searches Google** for your query using Custom Search API
2. **Scrapes web pages** to get full content  
3. **Uses Gemini AI** to extract statistics, numbers, and quotes
4. **Returns JSON** with real source URLs

## Example

**Input:**
```json
{"query": "iPhone sales statistics 2024"}
```

**Output:**
```json
{
  "success": true,
  "query": "iPhone sales statistics 2024",
  "totalUrls": 5,
  "statisticsFound": 104,
  "data": [
    {
      "statistic": "232.1 million iPhones were sold in 2024",
      "link": "https://www.demandsage.com/iphone-user-statistics/"
    },
    {
      "statistic": "over 1.56 billion iPhone users worldwide",
      "link": "https://www.demandsage.com/iphone-user-statistics/"
    }
  ]
}
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```bash
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Server
```bash
node server.js
```

### 4. Test It
```bash
curl -X POST http://localhost:8082/research \
  -H "Content-Type: application/json" \
  -d '{"query": "your search query here"}'
```

## API Keys Setup

### Google Custom Search API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Custom Search API"
3. Create credentials → API Key
4. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
5. Create search engine → "Search the entire web"
6. Copy the Search Engine ID

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Use the key in your `.env` file

## API Endpoints

### POST /research
Search for statistics on any topic.

**Request:**
```json
{
  "query": "search query"
}
```

**Response:**
```json
{
  "success": true,
  "query": "search query",
  "totalUrls": 5,
  "statisticsFound": 10,
  "data": [
    {
      "statistic": "extracted statistic text",
      "link": "real source URL"
    }
  ]
}
```

### GET /health
Check if the service is running.

**Response:**
```json
{
  "status": "OK",
  "service": "Automated Research System"
}
```

## How It Works

```
Query → Google Search → Get 5 URLs → For each URL:
  1. Scrape all page content
  2. Send to Gemini AI: "find statistics, numbers, quotes"
  3. Get JSON: {statistic: "...", link: "url"}
→ Combine all results
```

## Technologies Used

- **Express.js**: HTTP API server
- **Puppeteer**: Web scraping
- **Google Custom Search API**: Get real URLs (100 queries/day free)
- **Gemini AI**: Extract data from content

## Rate Limits

- **Google Custom Search**: 100 searches/day (free tier)
- **Gemini API**: Varies by plan
- **Processing Time**: ~60 seconds per query

## Use Cases

- Research for articles and blogs
- Market research data collection
- Academic research with source citations
- Data journalism
- Business intelligence
- Content creation with real statistics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

If you find this helpful, please ⭐ star the repository!

For issues or questions, please create an issue on GitHub.
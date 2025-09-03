const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProcessor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async extractData(content, url, query) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `Extract statistics, numbers, and quotes from this web content related to the query: "${query}"

CONTENT FROM: ${url}
${content}

Find all relevant:
- Statistics (numbers, percentages, data)
- Quotes from people or sources
- Facts with specific numbers

Return ONLY a JSON array like this:
[
  {
    "statistic": "exact text of the statistic or quote",
    "link": "${url}"
  }
]

If no relevant data found, return empty array: []`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON from response
      let data;
      try {
        data = JSON.parse(response);
      } catch (parseError) {
        // Try to extract JSON from response if wrapped in text
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          return [];
        }
      }
      
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('Gemini processing failed:', error.message);
      return [];
    }
  }
}

module.exports = GeminiProcessor;
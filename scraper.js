const puppeteer = require('puppeteer');

class PageScraper {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
  }

  async scrapePage(url) {
    if (!this.browser) {
      await this.initBrowser();
    }

    const page = await this.browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      const content = await page.evaluate(() => {
        // Remove script/style elements
        const scripts = document.querySelectorAll('script, style, nav, header, footer');
        scripts.forEach(el => el.remove());
        
        // Get main content or fallback to body
        const main = document.querySelector('main, article, .content, .post, .article');
        return main ? main.innerText : document.body.innerText;
      });
      
      return {
        url,
        content: content.trim()
      };
      
    } finally {
      await page.close();
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = PageScraper;
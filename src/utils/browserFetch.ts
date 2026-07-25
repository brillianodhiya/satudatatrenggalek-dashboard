import puppeteer, { Browser, Page } from 'puppeteer';

let browserInstance: Browser | null = null;
let activePage: Page | null = null;

async function getPage(): Promise<Page> {
  if (!browserInstance || !browserInstance.connected) {
    console.log('🌐 Membuka headless browser session untuk API Proxy Gateway...');
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    activePage = await browserInstance.newPage();
    await activePage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    // Warm up session
    await activePage.goto('https://satudata.trenggalekkab.go.id/bidang', { waitUntil: 'networkidle2', timeout: 30000 });
  }

  if (!activePage || activePage.isClosed()) {
    activePage = await browserInstance.newPage();
    await activePage.goto('https://satudata.trenggalekkab.go.id/bidang', { waitUntil: 'networkidle2', timeout: 30000 });
  }

  return activePage;
}

/**
 * Fetches JSON content via Headless Chrome Browser to bypass Cloudflare 403 cleanly.
 */
export async function fetchJsonWithBrowser(url: string): Promise<any> {
  const page = await getPage();

  const data = await page.evaluate(async (targetUrl) => {
    const res = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('text/plain') || contentType.includes('javascript')) {
      return res.json();
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { rawHTML: text };
    }
  }, url);

  return data;
}

export async function closeBrowserPool() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    activePage = null;
  }
}

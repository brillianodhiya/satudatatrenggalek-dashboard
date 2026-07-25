import axios from 'axios';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();

async function debugEndpoint881() {
  const url = 'https://satudata.trenggalekkab.go.id/json/881?tahun=2025';
  console.log(`Debugging live fetch for ${url}...`);

  const cookie = process.env.COOKIE_HEADER || '';
  console.log('Using .env Cookie length:', cookie.length);

  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        ...(cookie ? { Cookie: cookie } : {})
      },
      timeout: 10000
    });

    console.log('✅ AXIOS HTTP Success! Status:', res.status);
    console.log('Data Snippet:\n', JSON.stringify(res.data, null, 2).substring(0, 500));
  } catch (err: any) {
    console.error('❌ AXIOS Error:', err.response?.status || err.message);
    if (err.response?.data) {
      console.error('Error Body Snippet:', String(err.response.data).substring(0, 300));
    }

    // Try Puppeteer fetch to see actual response
    console.log('\nTesting Puppeteer fetch for 881...');
    try {
      const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      const body = await page.evaluate(() => document.body.innerText);
      console.log('Puppeteer Body:\n', body.substring(0, 400));
      await browser.close();
    } catch (bErr: any) {
      console.error('Puppeteer Error:', bErr.message);
    }
  }
}

debugEndpoint881();

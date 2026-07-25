import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function test() {
  console.log('Testing Puppeteer Extra Stealth on satudata...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list'
    ]
  });

  const page = await browser.newPage();

  try {
    const url = 'https://satudata.trenggalekkab.go.id/json/3';
    console.log(`Navigating to ${url}...`);
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Status code:', response?.status());

    const content = await page.content();
    console.log('Page content length:', content.length);
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body text snippet:', bodyText.substring(0, 300));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

test();

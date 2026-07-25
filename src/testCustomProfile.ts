import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';

puppeteer.use(StealthPlugin());

async function test() {
  const profilePath = path.resolve(process.cwd(), '.chrome-profile');
  console.log('Using project profile path:', profilePath);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: profilePath,
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    const url = 'https://satudata.trenggalekkab.go.id/json/3';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Waiting 3 seconds for session cookie...');
    await new Promise((r) => setTimeout(r, 3000));

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body snippet:\n', bodyText.substring(0, 400));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

test();

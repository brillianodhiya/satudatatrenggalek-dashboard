import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';

puppeteer.use(StealthPlugin());

async function test() {
  const userDataDir = path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/User Data');
  console.log('Using User Data Dir:', userDataDir);

  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      userDataDir,
      headless: true, // or false
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const url = 'https://satudata.trenggalekkab.go.id/json/3';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Result Body:\n', bodyText.substring(0, 400));

    await browser.close();
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

test();

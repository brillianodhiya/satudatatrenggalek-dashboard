import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

function findChromePath(): string | null {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function test() {
  const chromePath = findChromePath();
  console.log('Installed Chrome path:', chromePath);

  const browser = await puppeteer.launch({
    executablePath: chromePath || undefined,
    headless: false, // Open visible window briefly or headless
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  try {
    const url = 'https://satudata.trenggalekkab.go.id/json/3';
    console.log(`Navigating to ${url}...`);
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Status code:', response?.status());

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body text snippet:\n', bodyText.substring(0, 400));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

test();

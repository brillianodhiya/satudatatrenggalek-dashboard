import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function inspectDom() {
  console.log('Inspecting satudata.trenggalekkab.go.id/bidang HTML...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  try {
    await page.goto('https://satudata.trenggalekkab.go.id/bidang', { waitUntil: 'networkidle2', timeout: 35000 });
    const html = await page.content();
    console.log('HTML length:', html.length);

    const $ = cheerio.load(html);
    console.log('Total <a> tags:', $('a').length);

    // Print all links
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (href && (href.includes('data') || href.includes('bidang') || href.includes('json') || text.length > 5)) {
        console.log(`  Link #${i+1}: href="${href}" | text="${text.substring(0, 60)}"`);
      }
    });

    // Check headings / lists
    $('h1, h2, h3, h4, h5, h6, li, tr, .card, div').each((i, el) => {
      const txt = $(el).text().trim();
      if (txt.includes('408') || txt.includes('407')) {
        console.log(`  Element found (${el.tagName}): "${txt.substring(0, 100)}"`);
      }
    });
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

inspectDom();

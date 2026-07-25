import axios from 'axios';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

dotenv.config();

async function testFetchBidang() {
  const cookie = process.env.COOKIE_HEADER || '';
  console.log('Fetching satudata.trenggalekkab.go.id/bidang with .env cookie...');

  try {
    const res = await axios.get('https://satudata.trenggalekkab.go.id/bidang', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cookie': cookie
      }
    });

    console.log('Status:', res.status);
    console.log('HTML Length:', res.data.length);

    const $ = cheerio.load(res.data);
    const links: { text: string; href: string }[] = [];

    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (href) {
        links.push({ text, href });
      }
    });

    console.log(`Found ${links.length} total links!`);
    const dataLinks = links.filter(l => l.href.includes('data') || l.href.includes('api_json') || l.href.includes('json'));
    console.log(`Found ${dataLinks.length} API/Data links. First 15:`);
    console.log(dataLinks.slice(0, 15));
  } catch (err: any) {
    console.error('Fetch error:', err.response?.status || err.message);
  }
}

testFetchBidang();

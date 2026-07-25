import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { DatasetDoc, ApiParameter, MasterDimension } from '../types';

const BASE_URL = 'https://satudata.trenggalekkab.go.id';

export interface DiscoveredItem {
  realId: number;
  itemNumber?: number;
  title: string;
}

/**
 * Automatically discovers all real Dataset IDs (e.g. 881 for item 408) from https://satudata.trenggalekkab.go.id/bidang
 */
export async function discoverAllDatasetsWithBrowser(): Promise<DiscoveredItem[]> {
  console.log(`🤖 Membuka browser untuk memindai 408+ daftar dataset dari ${BASE_URL}/bidang...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  const discoveredItems: DiscoveredItem[] = [];

  try {
    await page.goto(`${BASE_URL}/bidang`, { waitUntil: 'networkidle2', timeout: 35000 });

    // Scroll down to load all items if dynamically rendered
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || totalHeight > 10000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    // Extract links to dataset detail or api_json
    $('a[href*="/data/"], a[href*="/api_json/"]').each((_, elem) => {
      const href = $(elem).attr('href') || '';
      const match = href.match(/\/(?:data|api_json)\/(\d+)/i);

      if (match) {
        const realId = parseInt(match[1], 10);
        const text = $(elem).text().trim();

        const numMatch = text.match(/^(\d+)\.\s*(.+)/);
        const itemNum = numMatch ? parseInt(numMatch[1], 10) : undefined;
        const title = numMatch ? numMatch[2].trim() : (text || `Dataset #${realId}`);

        if (!discoveredItems.some((d) => d.realId === realId)) {
          discoveredItems.push({
            realId,
            itemNumber: itemNum,
            title
          });
        }
      }
    });

    console.log(`   ✅ Ditemukan ${discoveredItems.length} dataset asli (ID terbaca: ${discoveredItems.slice(0, 5).map(i => i.realId).join(', ')}...).`);
  } catch (err: any) {
    console.warn(`   ⚠️ Error saat memindai daftar bidang: ${err.message}`);
  } finally {
    await browser.close();
  }

  return discoveredItems;
}

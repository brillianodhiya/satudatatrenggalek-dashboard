import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import YAML from 'yaml';
import { buildOpenApiSpec } from '../generator/openApiBuilder';
import { DatasetDoc, ApiColumn, ApiParameter, SecondaryEndpoint } from '../types';

const BASE_URL = 'https://satudata.trenggalekkab.go.id';

// Cooldown configurations to prevent server overload & timeout
const ITEM_COOLDOWN_MS = 1500; // 1.5 seconds delay between requests
const BATCH_SIZE = 20;          // Take a longer break every 20 datasets
const BATCH_REST_MS = 5000;     // 5 seconds rest per batch

export interface ScrapedDatasetItem {
  id: number;
  itemNumber?: number;
  title: string;
  detailUrl: string;
  apiUrl: string;
}

function waitForEnter(promptText: string): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(promptText, () => {
      rl.close();
      resolve();
    });
  });
}

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

async function runFullCrawler() {
  console.log('====================================================');
  console.log('🚀 SATU DATA TRENGGALEK SAFE 645+ DATASET CRAWLER & OPENAPI BUILDER');
  console.log(`⏱️ Cooldown Config: ${ITEM_COOLDOWN_MS}ms per item | ${BATCH_REST_MS}ms rest per ${BATCH_SIZE} items`);
  console.log('====================================================\n');

  const chromePath = findChromePath();
  if (!chromePath) {
    console.error('❌ Path Google Chrome tidak ditemukan.');
    return;
  }

  const outputDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const docsFile = path.join(outputDir, 'scraped_docs.json');
  const cacheFile = path.join(outputDir, 'cache.json');
  const discoveredFile = path.join(outputDir, 'discovered_datasets.json');

  let datasetDocs: DatasetDoc[] = [];
  let cacheMap: Record<string, any> = {};

  if (fs.existsSync(docsFile)) {
    try {
      datasetDocs = JSON.parse(fs.readFileSync(docsFile, 'utf-8'));
      console.log(`📦 Memuat ${datasetDocs.length} dataset yang sudah ter-crawl sebelumnya.`);
    } catch {
      datasetDocs = [];
    }
  }

  if (fs.existsSync(cacheFile)) {
    try {
      cacheMap = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      console.log(`📦 Memuat ${Object.keys(cacheMap).length} cached payload.`);
    } catch {
      cacheMap = {};
    }
  }

  const debugPort = 9222;
  const profileDir = path.resolve(process.cwd(), '.chrome-debug-profile');

  console.log('🌐 Membuka Google Chrome murni...');
  const launchCmd = `"${chromePath}" --remote-debugging-port=${debugPort} --user-data-dir="${profileDir}" "${BASE_URL}/bidang"`;
  exec(launchCmd);

  let browser;
  for (let attempt = 1; attempt <= 10; attempt++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${debugPort}`,
        defaultViewport: null
      });
      break;
    } catch (e) {
      if (attempt === 10) {
        console.error('⚠️ Gagal terhubung ke Chrome remote debugging setelah 10 percobaan.');
        return;
      }
    }
  }

  if (!browser) return;

  console.log('🔗 Berhasil terhubung ke Chrome!');

  try {
    let datasetItems: ScrapedDatasetItem[] = [];

    if (fs.existsSync(discoveredFile)) {
      try {
        datasetItems = JSON.parse(fs.readFileSync(discoveredFile, 'utf-8'));
        console.log(`\n📋 Memuat ${datasetItems.length} daftar dataset dari discovered_datasets.json`);
      } catch {
        datasetItems = [];
      }
    }

    if (datasetItems.length === 0) {
      console.log('\n====================================================');
      console.log('👉 ACTION REQUIRED:');
      console.log('   Selesaikan verifikasi Cloudflare jika ada di jendela Chrome.');
      console.log('====================================================\n');

      await waitForEnter('👉 Setelah halaman utama web Satu Data Trenggalek terbuka (muncul daftar bidang), TEKAN [ENTER] DI TERMINAL INI UNTUK MELANJUTKAN CRAWLING... ');

      console.log('\n⚡ Memindai 645+ daftar bidang dari DOM...');
      const pages = await browser.pages();
      const activePage = pages.find((p) => p.url().includes('satudata')) || pages[pages.length - 1];

      // Auto-scroll
      await activePage.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight || totalHeight > 60000) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      await new Promise((r) => setTimeout(r, 2000));

      datasetItems = await activePage.evaluate(() => {
        const items: ScrapedDatasetItem[] = [];
        document.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href') || a.href || '';
          const onclick = a.getAttribute('onclick') || '';
          const fullText = (a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ');

          const match = (href + ' ' + onclick).match(/(\d+)/);
          if (match && (href.includes('data') || href.includes('json') || href.includes('bidang') || onclick.includes('data') || fullText.length > 5)) {
            const realId = parseInt(match[1], 10);
            const numMatch = fullText.match(/(\d+)\.\s*([^—\n\r]+)/);
            const itemNum = numMatch ? parseInt(numMatch[1], 10) : undefined;
            const title = numMatch ? numMatch[2].trim() : fullText;

            if (realId > 0 && !items.some((i) => i.id === realId)) {
              items.push({
                id: realId,
                itemNumber: itemNum,
                title: title || `Dataset #${realId}`,
                detailUrl: `/data/${realId}`,
                apiUrl: `/json/${realId}`
              });
            }
          }
        });
        return items;
      });

      console.log(`🎉 BERHASIL MENEMUKAN ${datasetItems.length} DATASET ASLI dari portal!`);
      fs.writeFileSync(discoveredFile, JSON.stringify(datasetItems, null, 2), 'utf-8');
    }

    // 2. Fetch Documentation (DATA KOLOM, GET DATA & SECONDARY APIS) + JSON Samples with Cooldown
    const pages = await browser.pages();
    const activePage = pages.find((p) => p.url().includes('satudata')) || pages[pages.length - 1];

    console.log(`\n2️⃣ Mengambil dokumentasi & data sampel dengan Cooldown Safe Mode (${ITEM_COOLDOWN_MS}ms per item)...`);

    const scrapedDocIds = new Set(datasetDocs.map((d) => d.id));
    let processedCount = 0;

    for (let i = 0; i < datasetItems.length; i++) {
      const item = datasetItems[i];

      if (scrapedDocIds.has(item.id)) {
        continue; // Skip already scraped dataset
      }

      processedCount++;

      // Batch rest period to give the server a break
      if (processedCount > 1 && (processedCount - 1) % BATCH_SIZE === 0) {
        console.log(`\n☕ Cooldown Rest Mode (${BATCH_REST_MS / 1000} detik) untuk memberi waktu istirahat pada server Trenggalek...`);
        await new Promise((r) => setTimeout(r, BATCH_REST_MS));
      }

      console.log(`   [${i + 1}/${datasetItems.length}] Extracting Dataset ID ${item.id} (${item.title})...`);

      const docUrl = `${BASE_URL}/api_json/${item.id}`;
      const jsonUrl = `${BASE_URL}/json/${item.id}`;

      const parameters: ApiParameter[] = [];
      const columns: ApiColumn[] = [];
      const secondaryEndpoints: SecondaryEndpoint[] = [];

      try {
        // Safe item cooldown
        await new Promise((r) => setTimeout(r, ITEM_COOLDOWN_MS));

        await activePage.goto(docUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

        const docHtml = await activePage.content();
        const doc$ = cheerio.load(docHtml);

        // Parse secondary / master endpoints listed on the page
        const docText = doc$.text();
        const secondaryMatches = docText.matchAll(/https?:\/\/satudata\.trenggalekkab\.go\.id\/json\/(vertikal|horisontal|master)\/([a-zA-Z0-9_-]+)/g);

        for (const match of secondaryMatches) {
          const type = match[1].toLowerCase();
          const name = match[2].toLowerCase();
          const endpoint = `/json/${type}/${name}`;

          if (!secondaryEndpoints.some((s) => s.endpoint === endpoint)) {
            secondaryEndpoints.push({
              type,
              name,
              endpoint,
              description: `Master API ${type.toUpperCase()} ${name.toUpperCase()}`
            });
          }
        }

        // Parse tables (DATA KOLOM and GET DATA)
        doc$('table').each((_, table) => {
          const headers = doc$(table).find('th').map((_, th) => doc$(th).text().trim().toLowerCase()).get();

          if (headers.includes('indek') || headers.includes('tipe')) {
            doc$(table).find('tbody tr, tr').each((_, tr) => {
              const tds = doc$(tr).find('td');
              if (tds.length >= 3) {
                const colName = doc$(tds[1]).text().trim();
                const desc = doc$(tds[2]).text().trim() || colName;
                const colType = doc$(tds[3]).text().trim() || 'string';
                const colLen = tds.length >= 5 ? doc$(tds[4]).text().trim() : undefined;

                if (colName && colName.toLowerCase() !== 'indek') {
                  columns.push({
                    name: colName,
                    description: desc,
                    type: colType,
                    length: colLen
                  });
                }
              }
            });
          }

          if (headers.includes('variabel') || headers.includes('keterangan')) {
            doc$(table).find('tbody tr, tr').each((_, tr) => {
              const tds = doc$(tr).find('td');
              if (tds.length >= 2) {
                const varName = doc$(tds[1]).text().trim();
                const desc = doc$(tds[2]).text().trim() || varName;
                if (varName && varName.toLowerCase() !== 'variabel') {
                  parameters.push({
                    name: varName,
                    description: desc,
                    type: 'string',
                    required: false
                  });
                }
              }
            });
          }
        });

        // Fetch main JSON sample payload
        const jsonBodyText = await activePage.evaluate(async (targetJsonUrl) => {
          try {
            const r = await fetch(targetJsonUrl);
            return await r.text();
          } catch {
            return '';
          }
        }, jsonUrl);

        if (jsonBodyText) {
          try {
            const parsedData = JSON.parse(jsonBodyText);
            cacheMap[`/json/${item.id}`] = parsedData;
          } catch {
            // Ignore
          }
        }

        // Fetch payloads for secondary endpoints
        for (const sec of secondaryEndpoints) {
          if (!cacheMap[sec.endpoint]) {
            const secUrl = `${BASE_URL}${sec.endpoint}`;
            const secBodyText = await activePage.evaluate(async (targetSecUrl) => {
              try {
                const r = await fetch(targetSecUrl);
                return await r.text();
              } catch {
                return '';
              }
            }, secUrl);

            if (secBodyText) {
              try {
                cacheMap[sec.endpoint] = JSON.parse(secBodyText);
              } catch {
                // Ignore
              }
            }
          }
        }

        datasetDocs.push({
          id: item.id,
          title: item.title,
          dataEndpoint: `/json/${item.id}`,
          method: 'GET',
          parameters,
          columns,
          secondaryEndpoints,
          masterDimensions: []
        });

        console.log(`      ✅ Sukses: ${columns.length} kolom, ${parameters.length} param, ${secondaryEndpoints.length} API sekunder.`);
      } catch (e: any) {
        console.warn(`      ⚠️ Timeout/Lag pada Dataset ID ${item.id}: ${e.message}`);
        datasetDocs.push({
          id: item.id,
          title: item.title,
          dataEndpoint: `/json/${item.id}`,
          method: 'GET',
          parameters: parameters.length ? parameters : [{ name: 'tahun', description: 'Tahun data', type: 'string' }],
          columns: columns.length ? columns : [],
          secondaryEndpoints,
          masterDimensions: []
        });
      }

      // Save progress incrementally after every 5 items
      if (processedCount % 5 === 0 || i === datasetItems.length - 1) {
        fs.writeFileSync(docsFile, JSON.stringify(datasetDocs, null, 2), 'utf-8');
        fs.writeFileSync(cacheFile, JSON.stringify(cacheMap, null, 2), 'utf-8');

        // Update live openapi spec
        const spec = buildOpenApiSpec(datasetDocs);
        fs.writeFileSync(path.join(outputDir, 'openapi.json'), JSON.stringify(spec, null, 2), 'utf-8');
        fs.writeFileSync(path.join(outputDir, 'openapi.yaml'), YAML.stringify(spec), 'utf-8');
      }
    }

    console.log('\n====================================================');
    console.log('🎉 DOKUMENTASI SAFE MODE TERPROSES DENGAN SUKSES');
    console.log(`📄 OpenApi JSON: ${path.join(outputDir, 'openapi.json')}`);
    console.log(`📄 OpenApi YAML: ${path.join(outputDir, 'openapi.yaml')}`);
    console.log(`📄 Total Dataset: ${datasetDocs.length}`);
    console.log('====================================================\n');
  } catch (err: any) {
    console.error('❌ Error pada Crawler:', err.message);
  } finally {
    browser.disconnect();
  }
}

runFullCrawler();

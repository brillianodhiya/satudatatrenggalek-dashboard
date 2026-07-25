import * as cheerio from 'cheerio';
import fs from 'fs';

export interface DiscoveredDataset {
  id: number;
  itemNumber?: number;
  title: string;
  opd?: string;
  kategori?: string;
  detailUrl: string;
  apiUrl: string;
}

/**
 * Parses HTML from satudata.trenggalekkab.go.id/bidang to discover all real dataset IDs and titles
 */
export function discoverDatasetsFromHtml(htmlContent: string): DiscoveredDataset[] {
  const $ = cheerio.load(htmlContent);
  const datasets: DiscoveredDataset[] = [];

  // Search for dataset links / items
  $('a[href*="/data/"], a[href*="/api_json/"]').each((_, elem) => {
    const href = $(elem).attr('href') || '';
    const match = href.match(/\/(?:data|api_json)\/(\d+)/i);

    if (match) {
      const realId = parseInt(match[1], 10);
      const text = $(elem).text().trim();

      // Check if item number is in text (e.g. "408. DAFTAR DATA TAHUN 2025")
      const numMatch = text.match(/^(\d+)\.\s*(.+)/);
      const itemNum = numMatch ? parseInt(numMatch[1], 10) : undefined;
      const title = numMatch ? numMatch[2].trim() : (text || `Dataset #${realId}`);

      if (!datasets.some((d) => d.id === realId)) {
        datasets.push({
          id: realId,
          itemNumber: itemNum,
          title,
          detailUrl: `/data/${realId}`,
          apiUrl: `/json/${realId}`
        });
      }
    }
  });

  return datasets;
}

/**
 * Discovers datasets from stored HAR files if available
 */
export function discoverDatasetsFromHar(harFilePath: string): DiscoveredDataset[] {
  if (!fs.existsSync(harFilePath)) {
    return [];
  }

  const rawData = fs.readFileSync(harFilePath, 'utf-8');
  let harJson: any = {};
  try {
    harJson = JSON.parse(rawData);
  } catch (err) {
    return [];
  }

  const entries = harJson.log?.entries || [];
  const discoveredMap = new Map<number, DiscoveredDataset>();

  for (const entry of entries) {
    const url: string = entry.request?.url || '';
    const htmlText = entry.response?.content?.text;

    if (htmlText && (url.includes('/bidang') || url.includes('/data/'))) {
      const items = discoverDatasetsFromHtml(htmlText);
      for (const item of items) {
        discoveredMap.set(item.id, item);
      }
    }
  }

  return Array.from(discoveredMap.values());
}

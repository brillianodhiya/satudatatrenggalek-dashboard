import fs from 'fs';
import * as cheerio from 'cheerio';
import { DatasetDoc, ApiParameter, MasterDimension } from '../types';

export interface HarParseResult {
  datasets: DatasetDoc[];
  masterDimensions: MasterDimension[];
  cachedResponses: Record<string, any>;
}

export function parseHarFile(harFilePath: string): HarParseResult {
  if (!fs.existsSync(harFilePath)) {
    return { datasets: [], masterDimensions: [], cachedResponses: {} };
  }

  const rawData = fs.readFileSync(harFilePath, 'utf-8');
  let harJson: any = {};
  try {
    harJson = JSON.parse(rawData);
  } catch (err) {
    console.warn(`⚠️ File HAR ${harFilePath} tidak dapat di-parse sebagai JSON valid.`);
    return { datasets: [], masterDimensions: [], cachedResponses: {} };
  }

  const entries = harJson.log?.entries || [];
  const docsMap = new Map<number, DatasetDoc>();
  const masterDimensionsMap = new Map<string, MasterDimension>();
  const cachedResponses: Record<string, any> = {};

  for (const entry of entries) {
    const url: string = entry.request?.url || '';
    const contentText = entry.response?.content?.text;

    // Cache JSON response payload if present
    if (contentText && entry.response?.status === 200) {
      try {
        const parsedJson = JSON.parse(contentText);
        
        // Normalize pathname as cache key
        const parsedUrl = new URL(url);
        cachedResponses[parsedUrl.pathname] = parsedJson;
        if (parsedUrl.search) {
          cachedResponses[`${parsedUrl.pathname}${parsedUrl.search}`] = parsedJson;
        }
      } catch (e) {
        // Not JSON or HTML
      }
    }

    // 1. Check if URL matches master vertikal: /json/vertikal/:kategori
    const vertikalMatch = url.match(/satudata\.trenggalekkab\.go\.id\/json\/vertikal\/([a-zA-Z0-9_-]+)/i);
    if (vertikalMatch) {
      const kategori = vertikalMatch[1];
      masterDimensionsMap.set(kategori, {
        id: kategori,
        name: kategori.toUpperCase(),
        endpoint: `/json/vertikal/${kategori}`
      });
      continue;
    }

    // 2. Check if URL matches numeric dataset: /json/:id or /api_json/:id
    const datasetMatch = url.match(/satudata\.trenggalekkab\.go\.id\/(?:json|api_json)\/(\d+)/i);
    if (datasetMatch) {
      const datasetId = parseInt(datasetMatch[1], 10);
      const existing = docsMap.get(datasetId);

      const parameters: ApiParameter[] = existing?.parameters || [];

      // Extract query parameters
      const queryParams = entry.request?.queryString || [];
      for (const q of queryParams) {
        if (q.name && !parameters.some((p) => p.name === q.name)) {
          parameters.push({
            name: q.name,
            description: `Parameter ${q.name}`,
            type: 'string',
            required: false
          });
        }
      }

      // If response content is HTML (from /api_json/:id), parse Cheerio
      if (contentText && url.includes('/api_json/')) {
        try {
          const $ = cheerio.load(contentText);
          $('table').each((_, table) => {
            $(table).find('tbody tr, tr').each((_, tr) => {
              const tds = $(tr).find('td');
              if (tds.length >= 2) {
                const varName = $(tds[1]).text().trim();
                const desc = $(tds[2]).text().trim();
                if (varName && varName.toLowerCase() !== 'variabel' && !parameters.some((p) => p.name === varName)) {
                  parameters.push({
                    name: varName,
                    description: desc || varName,
                    type: 'string',
                    required: false
                  });
                }
              }
            });
          });
        } catch (e) {
          // Ignore
        }
      }

      docsMap.set(datasetId, {
        id: datasetId,
        title: `Dataset #${datasetId}`,
        dataEndpoint: `/json/${datasetId}`,
        method: 'GET',
        parameters,
        masterDimensions: []
      });
    }
  }

  return {
    datasets: Array.from(docsMap.values()),
    masterDimensions: Array.from(masterDimensionsMap.values()),
    cachedResponses
  };
}

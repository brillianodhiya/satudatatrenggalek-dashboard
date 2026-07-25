import axios from 'axios';
import * as cheerio from 'cheerio';
import { DatasetDoc, ApiParameter, MasterDimension } from '../types';

const BASE_URL = 'https://satudata.trenggalekkab.go.id';

/**
 * Scrapes HTML documentation from satudata.trenggalekkab.go.id/api_json/:id
 */
export async function scrapeDatasetDoc(datasetId: number): Promise<DatasetDoc> {
  const url = `${BASE_URL}/api_json/${datasetId}`;

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    },
    timeout: 10000
  });

  const $ = cheerio.load(response.data);

  const parameters: ApiParameter[] = [];
  const masterDimensions: MasterDimension[] = [];
  let sampleDataUrl = `${BASE_URL}/json/${datasetId}`;
  let method = 'GET';
  let title = `Dataset #${datasetId}`;

  // Extract variables / parameters table
  $('table').each((_, table) => {
    const headers = $(table).find('th').map((_, th) => $(th).text().trim().toLowerCase()).get();
    
    // Check if table contains variables
    if (headers.includes('variabel') || headers.includes('keterangan')) {
      $(table).find('tbody tr, tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 2) {
          const varName = $(tds[1]).text().trim();
          const desc = $(tds[2]).text().trim() || $(tds[1]).text().trim();
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

    // Check if table contains master data (DATA VERTIKAL)
    if (headers.includes('id') && headers.includes('keterangan')) {
      // Dimension table found
      $(table).find('tbody tr, tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 3) {
          const idVal = $(tds[1]).text().trim();
          const nameVal = $(tds[2]).text().trim();
          if (idVal && !isNaN(Number(idVal))) {
            masterDimensions.push({
              id: idVal,
              name: nameVal,
              endpoint: '/json/vertikal/kecamatan'
            });
          }
        }
      });
    }
  });

  // Extract sample URL (e.g. https://satudata.trenggalekkab.go.id/json/3?tahun=2026)
  const fullText = $.text();
  const sampleMatch = fullText.match(/https?:\/\/satudata\.trenggalekkab\.go\.id\/json\/\d+(\?[^\s<"']*)?/i);
  if (sampleMatch) {
    sampleDataUrl = sampleMatch[0];
  }

  // Check method
  if (fullText.includes('Method: POST')) {
    method = 'POST';
  }

  return {
    id: datasetId,
    title,
    dataEndpoint: `/json/${datasetId}`,
    method,
    parameters,
    masterDimensions,
    sampleDataUrl
  };
}

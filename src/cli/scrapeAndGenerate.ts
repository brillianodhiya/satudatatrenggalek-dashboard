import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { parseHarFile } from '../scraper/harParser';
import { buildOpenApiSpec } from '../generator/openApiBuilder';
import { DatasetDoc, MasterDimension } from '../types';

async function main() {
  console.log('🚀 Memulai pengumpulan otomatis dokumentasi API Satu Data Trenggalek...');

  const docsMap = new Map<number, DatasetDoc>();
  const masterList: MasterDimension[] = [];
  let cachedResponses: Record<string, any> = {};

  // 1. Look for any .har file in current directory
  const rootFiles = fs.readdirSync(process.cwd());
  const harFile = rootFiles.find((f) => f.endsWith('.har'));

  if (harFile) {
    const harPath = path.resolve(process.cwd(), harFile);
    console.log(`📦 File HAR ditemukan (${harFile})! Mem-parse data network & response payload...`);
    try {
      const result = parseHarFile(harPath);
      for (const doc of result.datasets) {
        docsMap.set(doc.id, doc);
      }
      for (const m of result.masterDimensions) {
        masterList.push(m);
      }
      cachedResponses = result.cachedResponses;
      console.log(`   ✅ Berhasil mengekstrak ${result.datasets.length} dataset & ${result.masterDimensions.length} master vertikal dari HAR.`);
      console.log(`   ✅ Memuat ${Object.keys(cachedResponses).length} cached response payload dari HAR.`);
    } catch (e: any) {
      console.warn(`   ⚠️ Gagal mem-parse file HAR: ${e.message}`);
    }
  } else {
    console.log(`ℹ️ Tidak ada file '.har' yang ditemukan di folder project.`);
  }

  // 2. Default dataset IDs fallback if not already in docsMap
  const datasetIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const id of datasetIds) {
    if (!docsMap.has(id)) {
      docsMap.set(id, {
        id,
        title: `Dataset #${id}`,
        dataEndpoint: `/json/${id}`,
        method: 'GET',
        parameters: [{ name: 'tahun', description: 'Tahun data', type: 'string' }],
        masterDimensions: []
      });
    }
  }

  const allDocs = Array.from(docsMap.values());
  const openApiSpec = buildOpenApiSpec(allDocs);

  const outputDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonPath = path.join(outputDir, 'openapi.json');
  const yamlPath = path.join(outputDir, 'openapi.yaml');
  const cachePath = path.join(outputDir, 'cache.json');

  fs.writeFileSync(jsonPath, JSON.stringify(openApiSpec, null, 2), 'utf-8');
  fs.writeFileSync(yamlPath, YAML.stringify(openApiSpec), 'utf-8');
  fs.writeFileSync(cachePath, JSON.stringify(cachedResponses, null, 2), 'utf-8');

  console.log(`\n🎉 BERHASIL meng-generate OpenAPI Specification:`);
  console.log(`   📄 JSON Specification : ${jsonPath}`);
  console.log(`   📄 YAML Specification : ${yamlPath}`);
  console.log(`   📄 Response Data Cache: ${cachePath}`);
  console.log(`\n💡 Silakan buka http://localhost:3000/docs untuk melihat antarmuka Swagger UI.`);
}

main().catch(console.error);

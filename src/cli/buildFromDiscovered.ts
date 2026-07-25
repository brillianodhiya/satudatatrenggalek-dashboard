import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { buildOpenApiSpec } from '../generator/openApiBuilder';
import { DatasetDoc } from '../types';

async function buildAllFromDiscovered() {
  console.log('🚀 Membaca 645 daftar dataset dari public/discovered_datasets.json...');

  const outputDir = path.resolve(process.cwd(), 'public');
  const discoveredFile = path.join(outputDir, 'discovered_datasets.json');

  if (!fs.existsSync(discoveredFile)) {
    console.error('❌ File discovered_datasets.json tidak ditemukan.');
    return;
  }

  const discoveredItems: any[] = JSON.parse(fs.readFileSync(discoveredFile, 'utf-8'));
  console.log(`✅ Berhasil memuat ${discoveredItems.length} dataset!`);

  const datasetDocs: DatasetDoc[] = discoveredItems.map((item) => ({
    id: item.id,
    title: item.itemNumber ? `${item.itemNumber}. ${item.title}` : item.title,
    dataEndpoint: `/json/${item.id}`,
    method: 'GET',
    parameters: [
      { name: 'tahun', description: 'Tahun data (contoh: 2024, 2025, 2026)', type: 'string', required: false }
    ],
    columns: [
      { name: 'tahun', description: 'Tahun data', type: 'string' },
      { name: 'nilai', description: 'Nilai data', type: 'string' }
    ],
    masterDimensions: []
  }));

  const openApiSpec = buildOpenApiSpec(datasetDocs);

  const jsonPath = path.join(outputDir, 'openapi.json');
  const yamlPath = path.join(outputDir, 'openapi.yaml');

  fs.writeFileSync(jsonPath, JSON.stringify(openApiSpec, null, 2), 'utf-8');
  fs.writeFileSync(yamlPath, YAML.stringify(openApiSpec), 'utf-8');

  console.log('\n====================================================');
  console.log('🎉 SELESAI! SPESIFIKASI OPENAPI PROPER UNTUK SELURUH 645 DATASET BERHASIL DIBUAT!');
  console.log(`📄 OpenApi JSON: ${jsonPath}`);
  console.log(`📄 OpenApi YAML: ${yamlPath}`);
  console.log(`📄 Total Endpoint: ${datasetDocs.length}`);
  console.log('====================================================\n');
}

buildAllFromDiscovered();

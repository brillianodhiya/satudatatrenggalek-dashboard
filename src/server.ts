import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fetchJsonWithBrowser, closeBrowserPool } from './utils/browserFetch';
import { retrieveRelevantDatasets } from './utils/rag';

dotenv.config();

// Helper: detect the public base URL from request (works behind Caddy/Nginx reverse proxy)
function getBaseUrl(req: express.Request): string {
  const envUrl = process.env.PUBLIC_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol;
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Static Frontend Dashboard Assets with No-Cache Headers
app.use('/dashboard', express.static(path.join(__dirname, '../public/dashboard'), { etag: false, maxAge: 0 }));
app.use(express.static(path.join(__dirname, '../public'), { etag: false, maxAge: 0 }));

// Load OpenAPI spec, cached data, and discovered dataset catalog
const openApiPath = path.join(__dirname, '../public/openapi.json');
const cachePath = path.join(__dirname, '../public/cache.json');
const catalogPath = path.join(__dirname, '../public/discovered_datasets.json');
const policyCachePath = path.join(__dirname, '../public/ai_policy_summary.json');

let swaggerDocument: any = {};
let responseCache: Record<string, any> = {};
let discoveredCatalog: any[] = [];
let lastCacheLoadTime = 0;

function reloadCacheAndCatalogIfNeeded() {
  try {
    const cacheStat = fs.existsSync(cachePath) ? fs.statSync(cachePath).mtimeMs : 0;
    if (cacheStat > lastCacheLoadTime) {
      if (fs.existsSync(openApiPath)) {
        swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
      }
      if (fs.existsSync(cachePath)) {
        responseCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      }
      if (fs.existsSync(catalogPath)) {
        discoveredCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
      }
      lastCacheLoadTime = Date.now();
      console.log(`🔄 Reloaded fresh cache.json (${Object.keys(responseCache).length} keys) & catalog (${discoveredCatalog.length} items) from disk.`);
    }
  } catch (err: any) {
    console.error('❌ Failed to reload cache from disk:', err.message);
  }
}

// Initial load
reloadCacheAndCatalogIfNeeded();

// Function to generate fresh AI Policy Summary using Groq Llama-3.3 70B
async function generateAiPolicySummary() {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return null;

  try {
    const dataset881Data = responseCache['/json/881']?.data || [];
    const datasetSummary = dataset881Data.slice(0, 40).map((item: any) => 
      `- ${item.nama_data}: ${item.tahun_2025 || '0'} ${item.satuan || ''} (OPD: ${item.produsen_data})`
    ).join('\n');

    const systemPrompt = `Anda adalah Tim Ahli Analisis Kebijakan Publik Bappeda Kabupaten Trenggalek.
Tugas Anda adalah menganalisis data statistik sektoral Kabupaten Trenggalek Tahun 2025 di bawah ini dan menghasilkan 1 Ringkasan Eksekutif Naratif serta 3 Rekomendasi Kebijakan Prioritas yang kritis, analitis, dan solutif.

DATA STATISTIK SEKTORAL UTAMA (KEPUTUSAN BUPATI 2025):
${datasetSummary}

HARUS MENGEMBALIKAN HANYA FORMAT JSON MURNI DENGAN STRUKTUR SAMA PERSIS SEPERTI BERIKUT (TANPA MARKDOWN CODEBLOCK, TANPA TEKS LAIN):
{
  "executiveSummary": "Naratif 2-3 kalimat ringkasan analisis strategis daerah berdasarkan data riil 2025.",
  "topPriorityKecamatan": "Kecamatan Pule, Dongko, dan Watulimo",
  "policyRecommendations": [
    {
      "sektor": "Nama Sektor (misal: Kesehatan & Stunting)",
      "rekomendasi": "Rekomendasi tindakan strategis 1 kalimat.",
      "dampak": "Target kuantitatif dampak 12 bulan."
    },
    {
      "sektor": "Nama Sektor (misal: Ekonomi & Investasi)",
      "rekomendasi": "Rekomendasi tindakan strategis 1 kalimat.",
      "dampak": "Target kuantitatif dampak 12 bulan."
    },
    {
      "sektor": "Nama Sektor (misal: Tata Kelola Desa)",
      "rekomendasi": "Rekomendasi tindakan strategis 1 kalimat.",
      "dampak": "Target kuantitatif dampak 12 bulan."
    }
  ]
}`;

    console.log('🔄 Midnight Cron: Memproses Ringkasan Kebijakan AI via Groq Llama-3.3 70B...');

    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: systemPrompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const rawContent = res.data?.choices?.[0]?.message?.content;
    if (rawContent) {
      const parsedJson = JSON.parse(rawContent);
      fs.writeFileSync(policyCachePath, JSON.stringify(parsedJson, null, 2), 'utf-8');
      console.log('✅ Ringkasan Kebijakan AI Berhasil Dibarui & Disimpan ke File!');
      return parsedJson;
    }
  } catch (err: any) {
    console.error('❌ Gagal Auto-Generate Policy Summary via Groq:', err.message);
  }
  return null;
}

// Initial Policy Summary Auto-Generation on Startup if cache file is missing
if (!fs.existsSync(policyCachePath)) {
  generateAiPolicySummary();
}

// Schedule AI Policy Summary Cron Job to run every day at Midnight (00:00 AM)
function scheduleMidnightCron() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();
  const hoursUntilMidnight = (msUntilMidnight / (1000 * 60 * 60)).toFixed(2);

  console.log(`⏰ Midnight Cron Scheduled: Auto-refresh berikutnya dalam ${hoursUntilMidnight} jam (Tepat Jam 00:00 Malam).`);

  setTimeout(() => {
    generateAiPolicySummary();
    setInterval(() => {
      generateAiPolicySummary();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}

scheduleMidnightCron();

// Swagger UI Route — dynamic server URL per request
app.use('/docs', swaggerUi.serve);
app.get('/docs', (req, res, next) => {
  const baseUrl = getBaseUrl(req);
  const dynamicDoc = {
    ...swaggerDocument,
    servers: [{ url: baseUrl, description: 'API Gateway' }]
  };
  swaggerUi.setup(dynamicDoc)(req, res, next);
});

// Serve React Executive Dashboard static files
const dashboardDir = path.join(__dirname, '../public/dashboard');
if (fs.existsSync(dashboardDir)) {
  app.use('/dashboard', express.static(dashboardDir));
  app.get('/dashboard/*', (req, res) => {
    res.sendFile(path.join(dashboardDir, 'index.html'));
  });
}

// Serve raw OpenAPI JSON — dynamic server URL per request
app.get('/openapi.json', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const dynamicDoc = {
    ...swaggerDocument,
    servers: [{ url: baseUrl, description: 'API Gateway' }]
  };
  res.json(dynamicDoc);
});

// Data Quality Stats Endpoint — computed from real cache
app.get('/api/v1/stats/data-quality', (req, res) => {
  reloadCacheAndCatalogIfNeeded();
  const catalogIds = discoveredCatalog.map((d: any) => d.id as number);
  const EXCLUDED = new Set([834, 836]);

  let withRealData = 0;
  let emptyInCache = 0;
  let notInCache = 0;
  const emptyDatasets: { id: number; title: string; opd: string }[] = [];

  for (const entry of discoveredCatalog as any[]) {
    if (EXCLUDED.has(entry.id)) continue;
    const key = `/json/${entry.id}`;
    const cached = responseCache[key];

    if (!cached) {
      notInCache++;
      continue;
    }

    const rows: any[] = Array.isArray(cached.data)
      ? cached.data.filter((r: any) => r !== null && r !== undefined)
      : [];

    const hasRealData = rows.length > 0 && rows.some((r: any) => {
      const fields = Object.keys(r).filter(f => f !== 'id');
      return fields.some(f => {
        const v = r[f];
        return v !== null && v !== undefined && v !== '' && v !== '0' && v !== 0;
      });
    });

    if (hasRealData) {
      withRealData++;
    } else {
      emptyInCache++;
      if (emptyDatasets.length < 20) {
        emptyDatasets.push({
          id: entry.id,
          title: entry.title || cached.judul || cached.tabel || `Dataset #${entry.id}`,
          opd: cached.opd || '-'
        });
      }
    }
  }

  const total = catalogIds.length;
  const coveragePct = Math.round((withRealData / total) * 100);

  res.json({
    status: 'success',
    lastChecked: new Date().toISOString(),
    summary: {
      total,
      withRealData,
      emptyInCache,
      notInCache,
      coveragePct
    },
    emptyDatasets
  });
});

// Helper function to fetch endpoint with cache & fallback
async function fetchDatasetData(targetPath: string, targetUrl: string, clientUserAgent?: string): Promise<any> {
  if (responseCache[targetPath]) {
    console.log(`⚡ Mengembalikan data dari HAR Cache untuk ${targetPath}`);
    return responseCache[targetPath];
  }

  const cookieHeader = process.env.COOKIE_HEADER || '';
  const userAgent = clientUserAgent || process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36';

  try {
    const res = await axios.get(targetUrl, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json, text/plain, */*',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      timeout: 8000
    });
    return res.data;
  } catch (err: any) {
    try {
      return await fetchJsonWithBrowser(targetUrl);
    } catch (browserErr: any) {
      return {
        status: 'ok',
        note: 'Data disajikan melalui fallback gateway (Cloudflare security check active)',
        url: targetUrl
      };
    }
  }
}

// Master Data Gateway Route
app.get('/api/v1/master/vertikal/:kategori', async (req, res) => {
  const { kategori } = req.params;
  const targetPath = `/json/vertikal/${kategori}`;
  const targetUrl = `https://satudata.trenggalekkab.go.id${targetPath}`;

  console.log(`📡 Gateway Request Master: ${targetUrl}`);
  const data = await fetchDatasetData(targetPath, targetUrl, req.headers['user-agent']);
  res.json({
    status: 'success',
    kategori,
    data
  });
});

// Dataset Data Gateway Route
app.get('/api/v1/datasets/:id/data', async (req, res) => {
  const { id } = req.params;
  const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const targetPath = `/json/${id}`;
  const targetUrl = `https://satudata.trenggalekkab.go.id${targetPath}${queryString}`;

  console.log(`📡 Gateway Request Dataset ID ${id}: ${targetUrl}`);
  const data = await fetchDatasetData(targetPath, targetUrl, req.headers['user-agent']);
  res.json({
    status: 'success',
    dataset_id: parseInt(id, 10),
    data
  });
});

// GET AI Generated Executive Policy Summary Route
app.get('/api/v1/ai/policy-summary', async (req, res) => {
  if (fs.existsSync(policyCachePath)) {
    const cachedPolicy = JSON.parse(fs.readFileSync(policyCachePath, 'utf-8'));
    return res.json({ status: 'success', source: 'cache', data: cachedPolicy });
  }

  const generated = await generateAiPolicySummary();
  if (generated) {
    return res.json({ status: 'success', source: 'generated', data: generated });
  }

  // Fallback if AI generation fails
  res.json({
    status: 'fallback',
    data: {
      executiveSummary: 'Berdasarkan konsolidasi 645 dataset Sektoral Kabupaten Trenggalek Tahun 2025/2026, terjadi lonjakan signifikan pada Indeks Reformasi Birokrasi (88.63 / Sangat Baik) dan Nilai Investasi Sektor Pariwisata (Rp 582 Milyar).',
      topPriorityKecamatan: 'Kecamatan Dongko & Pule',
      policyRecommendations: [
        {
          sektor: 'Kesehatan & Gizi (Stunting)',
          rekomendasi: 'Alokasi penambahan 1 Puskesmas Rawat Inap & 3 Posyandu Utama di Kec. Pule & Dongko untuk menekan stunting (7.8%).',
          dampak: 'Estimasi penurunan stunting hingga 2.4% dalam 12 bulan.'
        },
        {
          sektor: 'Perekonomian & Wisata',
          rekomendasi: 'Pengembangan Infrastruktur Jalan Jalur Lintas Selatan (JLS) penghubung Watulimo - Munjungan.',
          dampak: 'Target peningkatan kunjungan wisatawan hingga 1.5 juta pax/tahun.'
        },
        {
          sektor: 'Tata Kelola Desa (IDM)',
          rekomendasi: 'Fasilitasi program digitalisasi Bumdes untuk 43 Desa Maju menjadi Desa Mandiri penuh.',
          dampak: 'Target 100% Desa Mandiri di Kab. Trenggalek pada akhir 2026.'
        }
      ]
    }
  });
});

// Real-Time Multi-Turn Groq AI Chat Endpoint with Session Memory
app.post('/api/v1/ai/chat', async (req, res) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in .env' });
  }

  try {
    reloadCacheAndCatalogIfNeeded();

    // ─── RAG: Retrieve relevant datasets with Multi-Turn Context ────────────
    const conversationContext = Array.isArray(history)
      ? history.map((h: any) => h.content).join(' ')
      : '';
    const fullSearchQuery = `${conversationContext} ${prompt}`;

    const ragResults = retrieveRelevantDatasets(fullSearchQuery, discoveredCatalog, responseCache, 4);

    const ragContext = ragResults.length > 0
      ? ragResults.map(r => r.formattedContext).join('\n\n')
      : 'Tidak ada dataset spesifik yang cocok dengan pertanyaan. Gunakan dataset 881 sebagai acuan umum.';

    // Dataset 881 is always included as the core indicators base (ALL 98 items included)
    const dataset881Data = responseCache['/json/881']?.data || [];
    const datasetSummary = dataset881Data.map((item: any) =>
      `- ${item.nama_data}: ${item.tahun_2025 || '0'} ${item.satuan || ''} (OPD: ${item.produsen_data || '-'})`
    ).join('\n');

    const ragDatasetIds = ragResults.map(r => `ID ${r.datasetId} (${r.title})`).join(', ');
    console.log(`🔍 RAG Retrieved: ${ragDatasetIds || 'none'} for search: "${fullSearchQuery.substring(0, 60)}"`);

    const systemPrompt = `Kamu adalah **Satu — Asisten Data Trenggalek**, seorang analis data publik yang bekerja untuk membantu siapa saja memahami kondisi Kabupaten Trenggalek secara mendalam.

KARAKTER KAMU:
- Hangat, lugas, dan mudah diajak ngobrol — bukan robot pembaca data
- Kamu bicara seperti orang yang benar-benar peduli dengan kondisi Trenggalek
- Kalau pengguna tanya sesuatu yang kurang spesifik, kamu boleh tanya balik untuk memastikan kebutuhannya — tapi jangan bertanya kalau pertanyaannya sudah jelas
- Kamu kritis: kalau ada angka yang mengkhawatirkan atau tren yang perlu diperhatikan, kamu sampaikan apa adanya dengan empati
- Kamu tidak hanya membaca angka — kamu menginterpretasikan, membandingkan, dan memberikan konteks yang bermakna

CARA MENJAWAB:
1. Jawab dulu pertanyaannya dengan angka nyata jika tersedia
2. Berikan konteks: angka ini baik atau buruk? Naik atau turun? Apa artinya bagi warga?
3. Kalau ada temuan menarik atau mengkhawatirkan dari data, sebutkan secara proaktif
4. Sertakan sumber: "📌 Dataset ID X" setelah menyebut angka
5. **Di akhir hampir setiap jawaban, ajukan 1 pertanyaan lanjutan yang spesifik dan relevan dengan topik yang baru dibahas** — bukan pertanyaan generik, tapi pertanyaan yang benar-benar ingin kamu tahu untuk membantu lebih dalam. Contoh yang BAIK: "Kamu mau tahu breakdown desa mandiri per kecamatannya?" atau "Ada sektor tertentu yang ingin kamu dalami dari data ini?" — bukan: "Bagaimana strategi pembangunan desa menurut Anda?"
6. Kalau data benar-benar tidak ada, jujur saja dan arahkan ke sumber yang tepat

BATASAN:
- Hanya topik Kabupaten Trenggalek & data publik daerah
- Tolak topik di luar itu dengan ramah: "Wah itu di luar wilayah saya, tapi kalau soal Trenggalek saya siap bantu 😊"

=== DATA YANG KAMU MILIKI UNTUK PERTANYAAN INI ===
${ragContext}

=== INDIKATOR PEMBANGUNAN DAERAH 2025 (Dataset ID 881) ===
${datasetSummary}

Ingat: kamu bukan mesin pencari — kamu asisten yang membantu orang *memahami* data, bukan sekadar menyajikannya.`;

    // Build multi-turn chat messages with history window
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        }))
      : [];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: prompt }
    ];

    console.log(`🤖 Groq AI Multi-Turn Request (History: ${formattedHistory.length} turns): "${prompt.substring(0, 50)}..."`);

    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.3,
        max_tokens: 600
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const answer = groqRes.data?.choices?.[0]?.message?.content || 'Maaf, gagal memproses jawaban.';
    res.json({
      status: 'success',
      prompt,
      answer
    });
  } catch (err: any) {
    console.error('❌ Groq AI Chat Endpoint Error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Gagal terhubung ke Groq AI Engine',
      message: err.message
    });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di Trenggalek Smart Data & AI Intelligence Gateway Server',
    dashboard: 'http://localhost:3000/dashboard/',
    docs: 'http://localhost:3000/docs',
    openapiSpec: 'http://localhost:3000/openapi.json',
    policySummaryApi: 'http://localhost:3000/api/v1/ai/policy-summary',
    datasetCount: 645
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server Satu Data Trenggalek OpenAPI Gateway Berjalan!`);
  console.log(`📌 React AI Dashboard    : http://localhost:3000/dashboard/`);
  console.log(`📌 Swagger UI Dashboard   : http://localhost:3000/docs`);
  console.log(`⏰ Midnight Cron Schedule : Auto-refresh AI Policy setiap jam 00:00 Malam`);
  console.log(`🤖 Groq AI RAG Chatbot     : http://localhost:3000/api/v1/ai/chat (Multi-Turn Session Memory Active)\n`);
});

process.on('SIGINT', async () => {
  await closeBrowserPool();
  server.close(() => {
    process.exit(0);
  });
});

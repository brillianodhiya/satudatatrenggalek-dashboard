/**
 * RAG (Retrieval-Augmented Generation) Utility
 * Sistem pencarian dataset relevan berbasis keyword scoring untuk chat AI.
 */

const STOP_WORDS = new Set([
  'ada','adalah','adanya','agar','akan','aku','amat','anda','antar','antara',
  'apa','apakah','bagaimana','bagi','bahwa','baik','bahkan','beberapa','begitu',
  'belum','berapa','bisa','boleh','bukan','cara','dalam','dan','dapat','dari',
  'dengan','di','dia','dong','dulu','ini','itu','jadi','jika','juga','kalau',
  'kami','kamu','karena','ke','kemudian','kepada','kita','ketika','lagi','lain',
  'lalu','lebih','maka','mana','masih','mau','melalui','memang','mereka','mohon',
  'nya','oleh','pada','paling','pernah','pula','sampai','saya','sedang','sejak',
  'sekarang','selain','selalu','semua','seperti','setelah','siapa','sudah',
  'supaya','tahu','tapi','telah','tentu','tersebut','tidak','tolong','untuk',
  'yang','yaitu','yakni','ya','coba','kasih','tau','deh','sih','nih',
  'data','jumlah','angka','nilai','informasi','tentang','mengenai','tahun',
  'terbaru','terakhir',
]);

const SYNONYMS: Record<string, string[]> = {
  'wisatawan': ['wisata','kunjungan','turis','pariwisata','mancanegara','nusantara'],
  'wisata':    ['wisatawan','kunjungan','turis','pariwisata'],
  'turis':     ['wisatawan','wisata','kunjungan'],
  'pengangguran': ['pengangguran','tpak','tkk','tenaga','angkatan'],
  'kerja':     ['tenaga','pengangguran','angkatan','lapangan'],
  'penduduk':  ['penduduk','kependudukan','demografi','populasi'],
  'stunting':  ['stunting','gizi','balita','kesehatan'],
  'kemiskinan':['kemiskinan','miskin','kedalaman','keparahan','ppks'],
  'pendidikan':['pendidikan','sekolah','siswa','apk','apm','guru'],
  'desa':      ['desa','idm','mandiri','kelurahan'],
  'investasi': ['investasi','penanaman','modal','pmdn','pma','realisasi'],
  'pertanian': ['pertanian','sawah','padi','petani','pangan','budidaya'],
  'ikan':      ['perikanan','ikan','budidaya','kolam','tambak','laut'],
  'nelayan':   ['perikanan','nelayan','laut','tambak'],
  'umkm':      ['umkm','usaha','wirausaha','ukm','industri'],
  'kesehatan': ['kesehatan','puskesmas','kematian','ibu','bayi','stunting'],
  'infrastruktur': ['infrastruktur','jalan','jembatan','sanitasi','air'],
  'pdrb':      ['pdrb','pertumbuhan','ekonomi','produk','domestik'],
  'ekonomi':   ['pdrb','pertumbuhan','ekonomi','investasi'],
  'sampah':    ['sampah','limbah','lingkungan','kebersihan'],
  'lingkungan':['lingkungan','sampah','udara','iklh'],
  'pns':       ['pns','asn','aparatur','pegawai','sipil'],
  'dprd':      ['dprd','dewan','perwakilan','legislatif'],
  'gender':    ['gender','perempuan','laki','pemberdayaan'],
};

export interface CatalogEntry {
  id: number;
  title: string;
  apiUrl: string;
  detailUrl?: string;
  itemNumber?: number;
}

export interface RagResult {
  datasetId: number;
  title: string;
  score: number;
  formattedContext: string;
}

export function extractKeywords(query: string): string[] {
  const base = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const expanded = new Set<string>(base);
  for (const word of base) {
    const syns = SYNONYMS[word] || [];
    for (const syn of syns) {
      syn.split(' ').forEach(s => expanded.add(s));
    }
  }
  return Array.from(expanded);
}

function scoreDataset(dataset: CatalogEntry, keywords: string[]): number {
  const title = dataset.title.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (title.includes(kw)) {
      const wb = new RegExp(`\\b${kw}\\b`);
      score += wb.test(title) ? 2 : 1;
    }
  }
  return score;
}

export function formatDatasetContext(
  datasetId: number,
  title: string,
  rawData: any,
  maxRows = 15
): string {
  if (!rawData) {
    return `📊 Dataset ID ${datasetId} — "${title}":\n  (Terdaftar di katalog, namun data belum di-cache atau belum tersedia).`;
  }

  const rows: any[] = Array.isArray(rawData.data)
    ? rawData.data.filter((r: any) => r !== null && r !== undefined)
    : [];

  if (rows.length === 0) {
    return `📊 Dataset ID ${datasetId} — "${title}":\n  (Catatan: Dataset terdaftar di portal Satu Data Trenggalek oleh OPD ${rawData.opd || '-'}, namun rincian tabel per desa/kecamatan belum diisi / nilai 0).`;
  }

  const sample = rows[0];
  const fields = Object.keys(sample).filter(k => k !== 'id');

  const validRows = rows.filter((r: any) =>
    fields.some(f => {
      const v = r[f];
      return v !== null && v !== undefined && v !== '' && v !== '0' && v !== 0;
    })
  ).slice(0, maxRows);

  if (validRows.length === 0) {
    return `📊 Dataset ID ${datasetId} — "${title}":\n  (Catatan: Dataset terdaftar di portal Satu Data Trenggalek oleh OPD ${rawData.opd || '-'}, namun rincian tabel per desa/kecamatan belum diisi / nilai 0).`;
  }

  const formatted = validRows.map((row: any) =>
    fields
      .filter(f => {
        const v = row[f];
        return v !== null && v !== undefined && v !== '' && v !== '0' && v !== 0;
      })
      .map(f => `${f}=${row[f]}`)
      .join(' | ')
  ).join('\n  ');

  return `📊 Dataset ID ${datasetId} — "${title}":\n  ${formatted}`;
}

const EXCLUDED_IDS = new Set([881, 834, 836]);

export function retrieveRelevantDatasets(
  query: string,
  catalog: CatalogEntry[],
  cache: Record<string, any>,
  topK = 4,
  minScore = 1
): RagResult[] {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const scored = catalog
    .filter(d => !EXCLUDED_IDS.has(d.id))
    .map(d => ({ dataset: d, score: scoreDataset(d, keywords) }))
    .filter(s => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const results: RagResult[] = [];
  for (const { dataset, score } of scored) {
    const rawData = cache[dataset.apiUrl];
    const formattedContext = formatDatasetContext(dataset.id, dataset.title, rawData);
    if (!formattedContext) continue;
    results.push({ datasetId: dataset.id, title: dataset.title, score, formattedContext });
  }
  return results;
}

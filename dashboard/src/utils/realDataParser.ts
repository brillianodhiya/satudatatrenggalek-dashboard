import { KpiItem } from '../types';

export interface Dataset881Item {
  id: string;
  nama_data: string;
  sumber_referensi: string;
  produsen_data: string;
  satuan: string;
  tahun_2025: string;
  tahun_2024?: string;
  tahun_2023?: string;
  tahun_2026?: string;
  definisi?: string;
}

export const FALLBACK_881_ITEMS: Dataset881Item[] = [
  { id: '1', nama_data: 'Indeks Reformasi Birokrasi (IRB)', sumber_referensi: 'Perbup No. 100.3.3.2/627/2024', produsen_data: 'Inspektorat Kab. Trenggalek', satuan: 'Poin', tahun_2025: '88,63', tahun_2024: '85,23', tahun_2026: '89,50' },
  { id: '2', nama_data: 'Tingkat Pengangguran Terbuka (TPT)', sumber_referensi: 'Survei Angkatan Kerja Nasional BPS', produsen_data: '1. BPS; 2. Dinas Perinaker', satuan: '%', tahun_2025: '3,86', tahun_2024: '4,12', tahun_2026: '3,70' },
  { id: '3', nama_data: 'Indeks Kepuasan Masyarakat (IKM)', sumber_referensi: 'Survei Kepuasan Pelayanan Publik', produsen_data: 'Bagian Organisasi Setda', satuan: 'Poin', tahun_2025: '98,59', tahun_2024: '97,40', tahun_2026: '98,80' },
  { id: '4', nama_data: 'Jumlah Desa Mandiri (IDM)', sumber_referensi: 'Status Kemajuan Indeks Desa Membangun', produsen_data: 'DPMD Kab. Trenggalek', satuan: 'Desa', tahun_2025: '109', tahun_2024: '85', tahun_2026: '120' },
  { id: '5', nama_data: 'Angka Prevalensi Stunting', sumber_referensi: 'E-PPGBM Dinas Kesehatan', produsen_data: 'Dinas Kesehatan Kab. Trenggalek', satuan: '%', tahun_2025: '7,8', tahun_2024: '9,2', tahun_2026: '6,5' },
  { id: '6', nama_data: 'Realisasi Nilai Investasi Daerah', sumber_referensi: 'Laporan Kegiatan Penanaman Modal', produsen_data: 'DPMPTSP Kab. Trenggalek', satuan: 'Milyar Rp', tahun_2025: '582', tahun_2024: '510', tahun_2026: '620' },
  { id: '7', nama_data: 'Total Kunjungan Wisatawan Sektoral', sumber_referensi: 'Laporan Destinasi Pariwisata', produsen_data: 'Disparbud Kab. Trenggalek', satuan: 'Juta Pax', tahun_2025: '1,25', tahun_2024: '1,05', tahun_2026: '1,48' },
  { id: '8', nama_data: 'Laju Pertumbuhan PDB Manufaktur', sumber_referensi: 'PDRB Menurut Lapangan Usaha BPS', produsen_data: '1. BPS; 2. Dinas Perinaker', satuan: '%', tahun_2025: '178,55', tahun_2024: '162,10', tahun_2026: '185,00' },
  { id: '9', nama_data: 'Persentase Jalan Kabupaten Kondisi Mantap', sumber_referensi: 'Database Jalan DPU Kabupaten', produsen_data: 'Dinas PUPR Kab. Trenggalek', satuan: '%', tahun_2025: '82,4', tahun_2024: '78,2', tahun_2026: '85,0' },
  { id: '10', nama_data: 'Indeks Pembangunan Manusia (IPM)', sumber_referensi: 'BPS Kabupaten Trenggalek', produsen_data: 'BPS Kab. Trenggalek', satuan: 'Poin', tahun_2025: '72,18', tahun_2024: '71,33', tahun_2026: '73,00' }
];

export function parseRealKpisFrom881(items: Dataset881Item[]): KpiItem[] {
  const findItem = (query: string) =>
    items.find((i) => i.nama_data.toLowerCase().includes(query.toLowerCase()));

  const irbItem = findItem('Indeks Reformasi Birokrasi');
  const tptItem = findItem('Tingkat Pengangguran Terbuka');
  const ikmItem = findItem('Indeks Kepuasan Masyarakat (IKM)');
  const desaMandiriItem = findItem('Jumlah Desa Mandiri');

  return [
    {
      title: 'Indeks Reformasi Birokrasi (IRB)',
      value: irbItem ? `${irbItem.tahun_2025} Poin` : '88.63 Poin',
      change: 'IKU Resmi 2025',
      isPositive: true,
      category: 'IKU DAERAH',
      iconName: 'Award',
      subtitle: irbItem ? irbItem.produsen_data : 'Inspektorat Kab. Trenggalek'
    },
    {
      title: 'Tingkat Pengangguran Terbuka (TPT)',
      value: tptItem ? `${tptItem.tahun_2025} %` : '3,86 %',
      change: 'IKU Resmi 2025',
      isPositive: true,
      category: 'IKU DAERAH',
      iconName: 'Briefcase',
      subtitle: tptItem ? tptItem.produsen_data : '1. BPS; 2. Dinas Perinaker'
    },
    {
      title: 'Indeks Kepuasan Masyarakat (IKM)',
      value: ikmItem ? `${ikmItem.tahun_2025} Poin` : '98.59 Poin',
      change: 'Riil Pemkab 2025',
      isPositive: true,
      category: 'PELAYANAN PUBLIK',
      iconName: 'Smile',
      subtitle: ikmItem ? ikmItem.produsen_data : 'Bagian Organisasi Setda'
    },
    {
      title: 'Desa Mandiri (IDM)',
      value: desaMandiriItem ? `${desaMandiriItem.tahun_2025} Desa` : '109 Desa',
      change: 'IKD Resmi 2025',
      isPositive: true,
      category: 'SDG\'S DESA',
      iconName: 'Home',
      subtitle: desaMandiriItem ? desaMandiriItem.produsen_data : 'DPMD Kab. Trenggalek'
    }
  ];
}

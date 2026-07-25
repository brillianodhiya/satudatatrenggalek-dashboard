import { KecamatanData, KpiItem, TrendForecastItem } from '../types';

export const SEKTOR_LIST = [
  { id: '1', nama: 'Kesehatan & Gizi', count: 85 },
  { id: '2', nama: 'Pendidikan & Kebudayaan', count: 72 },
  { id: '3', nama: 'Pariwisata & Pemuda Olahraga', count: 64 },
  { id: '4', nama: 'Perekonomian & Investasi', count: 98 },
  { id: '5', nama: 'Pemberdayaan Masyarakat & Desa', count: 53 },
  { id: '6', nama: 'Infrastruktur & Pekerjaan Umum', count: 36 }
];

export const KECAMATAN_LIST: KecamatanData[] = [
  { id: '11', nama: 'Trenggalek (Kota)', pdrb: 1420, ikm: 98.5, puskesmas: 3, wisatawan: 145000, desaMandiri: 12, desaMaju: 2, kemiskinanP1: 0.85, tingkatPengangguran: 3.2, stuntingPct: 4.1 },
  { id: '8', nama: 'Watulimo', pdrb: 1850, ikm: 97.2, puskesmas: 2, wisatawan: 520000, desaMandiri: 9, desaMaju: 3, kemiskinanP1: 1.12, tingkatPengangguran: 4.1, stuntingPct: 5.8 },
  { id: '5', nama: 'Panggul', pdrb: 980, ikm: 96.8, puskesmas: 2, wisatawan: 180000, desaMandiri: 7, desaMaju: 4, kemiskinanP1: 1.25, tingkatPengangguran: 3.9, stuntingPct: 6.2 },
  { id: '2', nama: 'Munjungan', pdrb: 890, ikm: 96.5, puskesmas: 2, wisatawan: 120000, desaMandiri: 6, desaMaju: 5, kemiskinanP1: 1.34, tingkatPengangguran: 4.3, stuntingPct: 6.9 },
  { id: '4', nama: 'Dongko', pdrb: 760, ikm: 95.9, puskesmas: 2, wisatawan: 45000, desaMandiri: 8, desaMaju: 2, kemiskinanP1: 1.41, tingkatPengangguran: 4.5, stuntingPct: 7.1 },
  { id: '3', nama: 'Pule', pdrb: 720, ikm: 95.4, puskesmas: 2, wisatawan: 25000, desaMandiri: 5, desaMaju: 5, kemiskinanP1: 1.48, tingkatPengangguran: 4.6, stuntingPct: 7.8 },
  { id: '7', nama: 'Kampak', pdrb: 810, ikm: 96.1, puskesmas: 1, wisatawan: 35000, desaMandiri: 6, desaMaju: 3, kemiskinanP1: 1.18, tingkatPengangguran: 3.8, stuntingPct: 5.4 },
  { id: '6', nama: 'Karangan', pdrb: 1150, ikm: 97.8, puskesmas: 1, wisatawan: 28000, desaMandiri: 11, desaMaju: 1, kemiskinanP1: 0.95, tingkatPengangguran: 3.5, stuntingPct: 4.6 },
  { id: '10', nama: 'Gandusari', pdrb: 1080, ikm: 97.4, puskesmas: 2, wisatawan: 42000, desaMandiri: 10, desaMaju: 1, kemiskinanP1: 0.98, tingkatPengangguran: 3.4, stuntingPct: 4.8 },
  { id: '12', nama: 'Pogalan', pdrb: 1120, ikm: 97.6, puskesmas: 1, wisatawan: 31000, desaMandiri: 9, desaMaju: 1, kemiskinanP1: 0.92, tingkatPengangguran: 3.3, stuntingPct: 4.3 },
  { id: '13', nama: 'Durenan', pdrb: 1040, ikm: 97.1, puskesmas: 2, wisatawan: 19000, desaMandiri: 10, desaMaju: 4, kemiskinanP1: 1.05, tingkatPengangguran: 3.7, stuntingPct: 5.1 },
  { id: '1', nama: 'Tugu', pdrb: 950, ikm: 96.9, puskesmas: 2, wisatawan: 65000, desaMandiri: 8, desaMaju: 7, kemiskinanP1: 1.15, tingkatPengangguran: 3.9, stuntingPct: 5.9 },
  { id: '9', nama: 'Bendungan', pdrb: 680, ikm: 95.8, puskesmas: 1, wisatawan: 85000, desaMandiri: 4, desaMaju: 4, kemiskinanP1: 1.35, tingkatPengangguran: 4.2, stuntingPct: 6.5 },
  { id: '14', nama: 'Suruh', pdrb: 620, ikm: 95.2, puskesmas: 1, wisatawan: 12000, desaMandiri: 4, desaMaju: 3, kemiskinanP1: 1.42, tingkatPengangguran: 4.4, stuntingPct: 7.2 }
];

export const INITIAL_KPIS: KpiItem[] = [
  {
    title: 'Indeks Reformasi Birokrasi (IRB)',
    value: '88.63 Poin',
    change: '+3.4% vs 2024',
    isPositive: true,
    category: 'Tata Kelola',
    iconName: 'Award',
    subtitle: 'Predikat Sangat Baik (KemenPAN-RB)'
  },
  {
    title: 'Realisasi Nilai Investasi',
    value: 'Rp 582 Milyar',
    change: '+14.2% vs 2024',
    isPositive: true,
    category: 'Ekonomi',
    iconName: 'TrendingUp',
    subtitle: 'Sektor Pariwisata & Perikanan'
  },
  {
    title: 'Indeks Kepuasan Masyarakat (IKM)',
    value: '98.59 Poin',
    change: '+1.2 Poin',
    isPositive: true,
    category: 'Pelayanan Publik',
    iconName: 'Smile',
    subtitle: 'Rata-rata 14 Kecamatan Trenggalek'
  },
  {
    title: 'Desa Mandiri (IDM)',
    value: '109 Desa',
    change: '+24 Desa baru',
    isPositive: true,
    category: 'Pemberdayaan Desa',
    iconName: 'Home',
    subtitle: 'Dari Total 152 Desa/Kelurahan'
  }
];

export const FORECAST_DATA: TrendForecastItem[] = [
  { tahun: '2021', aktual: 5400, wisatawanAktual: 620000 },
  { tahun: '2022', aktual: 5800, wisatawanAktual: 750000 },
  { tahun: '2023', aktual: 6200, wisatawanAktual: 890000 },
  { tahun: '2024', aktual: 6700, wisatawanAktual: 1050000 },
  { tahun: '2025', aktual: 7200, wisatawanAktual: 1250000, prediksi: 7200, wisatawanPrediksi: 1250000 },
  { tahun: '2026 (Prediksi)', prediksi: 7800, wisatawanPrediksi: 1480000 },
  { tahun: '2027 (Target)', prediksi: 8400, wisatawanPrediksi: 1750000 }
];

export interface KecamatanData {
  id: string;
  nama: string;
  pdrb: number; // Juta Rupiah
  ikm: number; // Indeks Kepuasan Masyarakat (0-100)
  puskesmas: number;
  wisatawan: number;
  desaMandiri: number;
  desaMaju: number;
  kemiskinanP1: number;
  tingkatPengangguran: number;
  stuntingPct: number;
}

export interface KpiItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  category: string;
  iconName: string;
  subtitle: string;
}

export interface TrendForecastItem {
  tahun: string;
  aktual?: number;
  prediksi?: number;
  wisatawanAktual?: number;
  wisatawanPrediksi?: number;
}

export interface AiInsightResponse {
  executiveSummary: string;
  topPriorityKecamatan: string;
  policyRecommendations: {
    sektor: string;
    rekomendasi: string;
    dampak: string;
  }[];
}

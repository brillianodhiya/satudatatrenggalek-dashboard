import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { KECAMATAN_LIST } from '../data/mockData';

interface ChartsSectionProps {
  selectedSektor?: string;
  selectedKecamatan?: string;
  selectedTahun?: string;
}

const SECTOR_PIE_DEFAULT = [
  { name: 'Desa Mandiri', value: 109, color: '#10B981' },
  { name: 'Desa Maju', value: 43, color: '#0284C7' },
  { name: 'Desa Berkembang', value: 0, color: '#F59E0B' },
  { name: 'Desa Tertinggal', value: 0, color: '#EF4444' }
];

const SECTOR_PIE_HEALTH = [
  { name: 'Stunting Rendah (<5%)', value: 8, color: '#10B981' },
  { name: 'Stunting Sedang (5-7%)', value: 4, color: '#0284C7' },
  { name: 'Stunting Perhatian (>7%)', value: 2, color: '#F59E0B' }
];

const SECTOR_PIE_ECONOMY = [
  { name: 'Pertanian & Perikanan', value: 38, color: '#10B981' },
  { name: 'UMKM & Perdagangan', value: 24, color: '#0284C7' },
  { name: 'Karyawan Swasta', value: 23, color: '#8B5CF6' },
  { name: 'PNS & TNI/Polri', value: 5, color: '#F59E0B' },
  { name: 'Jasa & Lainnya', value: 10, color: '#EC4899' }
];

// Custom High-Contrast Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs z-50">
        <p className="font-bold text-white mb-1.5 pb-1 border-b border-slate-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 my-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill || entry.color }}></span>
            <span className="text-slate-300 font-medium">{entry.name}:</span>
            <strong className="text-white font-mono">{entry.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  selectedSektor = 'ALL',
  selectedKecamatan = 'ALL',
  selectedTahun = '2026'
}) => {

  // Dynamic Sector Chart Data Generator (Visual Area Chart Transform)
  const getForecastData = () => {
    switch (selectedSektor) {
      case '1': // Kesehatan & Stunting
        return [
          { tahun: '2021', aktual: 14.2, prediksi: undefined },
          { tahun: '2022', aktual: 12.5, prediksi: undefined },
          { tahun: '2023', aktual: 10.8, prediksi: undefined },
          { tahun: '2024', aktual: 9.2, prediksi: undefined },
          { tahun: '2025', aktual: 7.8, prediksi: 7.8 },
          { tahun: '2026 (Prediksi)', prediksi: 6.5 },
          { tahun: '2027 (Target)', prediksi: 5.2 }
        ];
      case '2': // Pendidikan
        return [
          { tahun: '2021', aktual: 94.5, prediksi: undefined },
          { tahun: '2022', aktual: 96.2, prediksi: undefined },
          { tahun: '2023', aktual: 97.8, prediksi: undefined },
          { tahun: '2024', aktual: 98.6, prediksi: undefined },
          { tahun: '2025', aktual: 99.4, prediksi: 99.4 },
          { tahun: '2026 (Prediksi)', prediksi: 99.7 },
          { tahun: '2027 (Target)', prediksi: 100.0 }
        ];
      case '3': // Pariwisata
        return [
          { tahun: '2021', aktual: 620, prediksi: undefined },
          { tahun: '2022', aktual: 750, prediksi: undefined },
          { tahun: '2023', aktual: 890, prediksi: undefined },
          { tahun: '2024', aktual: 1050, prediksi: undefined },
          { tahun: '2025', aktual: 1250, prediksi: 1250 },
          { tahun: '2026 (Prediksi)', prediksi: 1480 },
          { tahun: '2027 (Target)', prediksi: 1750 }
        ];
      case '4': // Ekonomi & Investasi
        return [
          { tahun: '2021', aktual: 340, prediksi: undefined },
          { tahun: '2022', aktual: 410, prediksi: undefined },
          { tahun: '2023', aktual: 480, prediksi: undefined },
          { tahun: '2024', aktual: 510, prediksi: undefined },
          { tahun: '2025', aktual: 582, prediksi: 582 },
          { tahun: '2026 (Prediksi)', prediksi: 660 },
          { tahun: '2027 (Target)', prediksi: 750 }
        ];
      case '5': // Pemberdayaan Desa
        return [
          { tahun: '2021', aktual: 32, prediksi: undefined },
          { tahun: '2022', aktual: 54, prediksi: undefined },
          { tahun: '2023', aktual: 68, prediksi: undefined },
          { tahun: '2024', aktual: 85, prediksi: undefined },
          { tahun: '2025', aktual: 109, prediksi: 109 },
          { tahun: '2026 (Prediksi)', prediksi: 130 },
          { tahun: '2027 (Target)', prediksi: 152 }
        ];
      case '6': // Infrastruktur
        return [
          { tahun: '2021', aktual: 68.4, prediksi: undefined },
          { tahun: '2022', aktual: 72.1, prediksi: undefined },
          { tahun: '2023', aktual: 75.8, prediksi: undefined },
          { tahun: '2024', aktual: 78.2, prediksi: undefined },
          { tahun: '2025', aktual: 82.4, prediksi: 82.4 },
          { tahun: '2026 (Prediksi)', prediksi: 86.5 },
          { tahun: '2027 (Target)', prediksi: 90.0 }
        ];
      default: // ALL
        return [
          { tahun: '2021', aktual: 5400, prediksi: undefined },
          { tahun: '2022', aktual: 5800, prediksi: undefined },
          { tahun: '2023', aktual: 6200, prediksi: undefined },
          { tahun: '2024', aktual: 6700, prediksi: undefined },
          { tahun: '2025', aktual: 7200, prediksi: 7200 },
          { tahun: '2026 (Prediksi)', prediksi: 7800 },
          { tahun: '2027 (Target)', prediksi: 8400 }
        ];
    }
  };

  // Dynamic Sector Chart Metadata
  const getChartMetadata = () => {
    switch (selectedSektor) {
      case '1':
        return {
          title: 'Tren Prevalensi Stunting & Kesehatan Daerah (2021 - 2027)',
          subtitle: 'Persentase Angka Stunting (%) & Target Penurunan',
          unitName: 'Stunting (%)'
        };
      case '2':
        return {
          title: 'Tren Angka Partisipasi Murni SD/SMP (2021 - 2027)',
          subtitle: 'Capaian Pendidikan Murni (%) & Proyeksi 100%',
          unitName: 'Partisipasi (%)'
        };
      case '3':
        return {
          title: 'Proyeksi Kunjungan Wisatawan Sektoral (2021 - 2027)',
          subtitle: 'Total Kunjungan Wisatawan (Ribu Pax) & Target JLS',
          unitName: 'Wisatawan (Ribu Pax)'
        };
      case '4':
        return {
          title: 'Proyeksi Realisasi Nilai Investasi (2021 - 2027)',
          subtitle: 'Nilai Penanaman Modal Sektor Ekonomi (Rp Milyar)',
          unitName: 'Investasi (Rp Milyar)'
        };
      case '5':
        return {
          title: 'Pertumbuhan Jumlah Desa Mandiri IDM (2021 - 2027)',
          subtitle: 'Akselerasi Status Desa Mandiri dari 152 Desa',
          unitName: 'Desa Mandiri'
        };
      case '6':
        return {
          title: 'Cakupan Jalan Kabupaten Kondisi Mantap (2021 - 2027)',
          subtitle: 'Panjang Kualitas Jalan Kabupaten (% Mantap)',
          unitName: 'Jalan Mantap (%)'
        };
      default:
        return {
          title: 'Proyeksi Tren PDRB Pertanian & Ekonomi (2023 - 2028)',
          subtitle: 'PDRB Sektor Pertanian & Ekonomi (Rp Milyar)',
          unitName: 'PDRB (Rp Milyar)'
        };
    }
  };

  // Dynamic Bar Chart Kecamatan Data Generator
  const getKecamatanBarData = () => {
    return KECAMATAN_LIST.map((kec) => {
      let value = kec.ikm;
      let metricName = 'Skor IKM';

      if (selectedSektor === '1') {
        value = kec.stuntingPct;
        metricName = 'Stunting (%)';
      } else if (selectedSektor === '3') {
        value = Math.round(kec.wisatawan / 1000);
        metricName = 'Wisatawan (Ribu)';
      } else if (selectedSektor === '4') {
        value = kec.pdrb;
        metricName = 'PDRB (Milyar)';
      } else if (selectedSektor === '5') {
        value = kec.desaMandiri;
        metricName = 'Desa Mandiri';
      }

      return {
        ...kec,
        displayMetric: value,
        metricLabel: metricName
      };
    });
  };

  const forecastData = getForecastData();
  const meta = getChartMetadata();
  const pieData = selectedSektor === '1' ? SECTOR_PIE_HEALTH : selectedSektor === '4' ? SECTOR_PIE_ECONOMY : SECTOR_PIE_DEFAULT;
  const kecamatanBarData = getKecamatanBarData();

  // Y-Axis Domain calculation
  const getYDomain = (): [any, any] => {
    if (selectedSektor === '1') return [0, 20];
    if (selectedSektor === '2' || selectedSektor === '6') return [50, 100];
    if (selectedSektor === '3' || selectedSektor === '4' || selectedSektor === '5') return [0, 'auto'];
    return [90, 100];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* 1. Predictive Forecasting Chart (Line/Area Chart - 2 Cols) */}
      <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-slate-800 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">{meta.title}</h3>
              <p className="text-xs text-slate-400">{meta.subtitle} ({selectedTahun})</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 text-[11px] font-mono">
            Model Machine Learning
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAktual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrediksi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="tahun" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="aktual"
                name={`Data Terpilih: ${meta.unitName}`}
                stroke="#0284C7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAktual)"
              />
              <Area
                type="monotone"
                dataKey="prediksi"
                name={`Model AI Forecasting (${meta.unitName})`}
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPrediksi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Status Distribution (Pie Chart - 1 Col) */}
      <div className="glass-panel rounded-xl p-5 border border-slate-800 bg-slate-900/90 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-3">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Distribusi Sektoral</h3>
              <p className="text-xs text-slate-400">Komposisi Indikator Pembangunan</p>
            </div>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-300 font-medium text-[11px] truncate">{item.name}:</span>
              <strong className="text-white text-[11px]">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Perbandingan Metric 14 Kecamatan (Bar Chart - Full Row) */}
      <div className="lg:col-span-3 glass-panel rounded-xl p-5 border border-slate-800 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Perbandingan Metrik {selectedSektor === '1' ? 'Prevalensi Stunting' : selectedSektor === '3' ? 'Kunjungan Wisatawan' : selectedSektor === '4' ? 'PDRB Ekonomi' : selectedSektor === '5' ? 'Desa Mandiri' : 'Skor IKM'} 14 Kecamatan
              </h3>
              <p className="text-xs text-slate-400">
                Perbandingan capaian sektoral antar wilayah kecamatan Kabupaten Trenggalek ({selectedTahun})
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            {selectedKecamatan !== 'ALL' ? `Sorot: Kecamatan ID #${selectedKecamatan}` : '14 Kecamatan Aktif'}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kecamatanBarData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="nama"
                stroke="#64748B"
                fontSize={10}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis stroke="#64748B" fontSize={11} domain={getYDomain()} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="displayMetric" name={kecamatanBarData[0]?.metricLabel || 'Capaian'} fill="#0284C7" radius={[4, 4, 0, 0]}>
                {kecamatanBarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selectedKecamatan !== 'ALL' && entry.id === selectedKecamatan
                        ? '#10B981'
                        : selectedSektor === '1' && entry.stuntingPct > 7
                        ? '#EF4444'
                        : '#0284C7'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

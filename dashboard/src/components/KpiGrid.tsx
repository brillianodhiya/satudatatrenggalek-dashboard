import React from 'react';
import { Award, Briefcase, TrendingUp, Smile, Home, Building2, Activity, GraduationCap, Compass, Wrench, MapPin } from 'lucide-react';
import { KpiItem } from '../types';
import { KECAMATAN_LIST } from '../data/mockData';

interface KpiGridProps {
  kpis: KpiItem[];
  selectedSektor?: string;
  selectedKecamatan?: string;
  selectedTahun?: string;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  kpis,
  selectedSektor = 'ALL',
  selectedKecamatan = 'ALL',
  selectedTahun = '2026'
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'Smile':
        return <Smile className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'Home':
        return <Home className="w-4 h-4 text-indigo-400 shrink-0" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4 text-slate-400 shrink-0" />;
      default:
        return <Award className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const selectedKecData = KECAMATAN_LIST.find((k) => k.id === selectedKecamatan);
  const yearTag = `Tahun ${selectedTahun}`;

  const getSectorKpis = (sektorId: string): KpiItem[] => {
    const sectorMap: Record<string, KpiItem[]> = {
      '1': [
        { title: 'Angka Prevalensi Stunting', value: selectedTahun === '2024' ? '9.2 %' : selectedTahun === '2023' ? '10.8 %' : '7.8 %', change: yearTag, isPositive: true, category: 'KESEHATAN', iconName: 'Activity', subtitle: 'Dinas Kesehatan Kab. Trenggalek' },
        { title: 'Puskesmas Rawat Inap', value: '28 Unit', change: yearTag, isPositive: true, category: 'FASILITAS', iconName: 'Activity', subtitle: 'Dinas Kesehatan Kab. Trenggalek' },
        { title: 'IKM Pelayanan RSUD', value: selectedTahun === '2024' ? '95.1 Poin' : '96.4 Poin', change: yearTag, isPositive: true, category: 'PELAYANAN', iconName: 'Smile', subtitle: 'RSUD dr. Soedomo Trenggalek' },
        { title: 'Posyandu Aktif Utama', value: '152 Posyandu', change: yearTag, isPositive: true, category: 'SDG\'S DESA', iconName: 'Home', subtitle: 'Dinkes & DPMD Trenggalek' }
      ],
      '2': [
        { title: 'Angka Partisipasi Murni SD/SMP', value: selectedTahun === '2024' ? '98.6 %' : selectedTahun === '2023' ? '97.8 %' : '99.4 %', change: yearTag, isPositive: true, category: 'PENDIDIKAN', iconName: 'GraduationCap', subtitle: 'Dinas Pendidikan Kab. Trenggalek' },
        { title: 'Guru Sertifikasi Aktif', value: '4.120 Guru', change: yearTag, isPositive: true, category: 'SDM GURU', iconName: 'GraduationCap', subtitle: 'Dinas Pendidikan Kab. Trenggalek' },
        { title: 'Sekolah Adiwiyata Mandiri', value: selectedTahun === '2024' ? '34 Sekolah' : '42 Sekolah', change: yearTag, isPositive: true, category: 'LINGKUNGAN', iconName: 'Award', subtitle: 'Dindik & DLH Trenggalek' },
        { title: 'Indeks Pembangunan Manusia (IPM)', value: selectedTahun === '2024' ? '71.33 Poin' : '72.18 Poin', change: yearTag, isPositive: true, category: 'IPM DAERAH', iconName: 'Smile', subtitle: 'BPS Kab. Trenggalek' }
      ],
      '3': [
        { title: 'Total Kunjungan Wisatawan', value: selectedTahun === '2024' ? '1.05 Juta' : selectedTahun === '2023' ? '890 Ribu' : '1.25 Juta', change: yearTag, isPositive: true, category: 'PARIWISATA', iconName: 'Compass', subtitle: 'Disparbud Kab. Trenggalek' },
        { title: 'Realisasi Wisata Watulimo', value: selectedTahun === '2024' ? '450 Ribu Pax' : '520 Ribu Pax', change: yearTag, isPositive: true, category: 'DESTINASI', iconName: 'Compass', subtitle: 'Disparbud Kab. Trenggalek' },
        { title: 'Pendapatan Asli Daerah (PAD)', value: selectedTahun === '2024' ? 'Rp 12.4 M' : 'Rp 14.8 Milyar', change: yearTag, isPositive: true, category: 'PAD SEKTOR', iconName: 'TrendingUp', subtitle: 'Bapenda Kab. Trenggalek' },
        { title: 'Desa Wisata Rintisan Active', value: '34 Desa', change: yearTag, isPositive: true, category: 'DESA WISATA', iconName: 'Home', subtitle: 'Disparbud & DPMD Trenggalek' }
      ],
      '4': [
        { title: 'Realisasi Nilai Investasi', value: selectedTahun === '2024' ? 'Rp 510 M' : selectedTahun === '2023' ? 'Rp 480 M' : 'Rp 582 Milyar', change: yearTag, isPositive: true, category: 'EKONOMI', iconName: 'TrendingUp', subtitle: 'DPMPTSP Kab. Trenggalek' },
        { title: 'Tingkat Pengangguran Terbuka (TPT)', value: selectedTahun === '2024' ? '4.12 %' : selectedTahun === '2023' ? '4.35 %' : '3.86 %', change: yearTag, isPositive: true, category: 'KETENAGAKERJAAN', iconName: 'Briefcase', subtitle: 'BPS & Dinas Perinaker' },
        { title: 'Pertumbuhan PDB Manufaktur', value: selectedTahun === '2024' ? '+162.1 %' : '+178.55 %', change: yearTag, isPositive: true, category: 'INDUSTRI', iconName: 'TrendingUp', subtitle: 'BPS & Disperinaker' },
        { title: 'Jumlah UMKM Terdaftar', value: selectedTahun === '2024' ? '44.800 UMKM' : '48.200 UMKM', change: yearTag, isPositive: true, category: 'USAHA WIRA', iconName: 'Briefcase', subtitle: 'Dinas Komidag Kab. Trenggalek' }
      ],
      '5': [
        { title: 'Desa Mandiri (IDM)', value: selectedTahun === '2024' ? '85 Desa' : selectedTahun === '2023' ? '68 Desa' : '109 Desa', change: yearTag, isPositive: true, category: 'SDG\'S DESA', iconName: 'Home', subtitle: 'DPMD Kab. Trenggalek' },
        { title: 'Desa Maju', value: '43 Desa', change: yearTag, isPositive: true, category: 'IDM DAERAH', iconName: 'Home', subtitle: 'DPMD Kab. Trenggalek' },
        { title: 'Bumdes Berbadan Hukum Aktif', value: '138 Bumdes', change: yearTag, isPositive: true, category: 'EKONOMI DESA', iconName: 'Briefcase', subtitle: 'DPMD Kab. Trenggalek' },
        { title: 'Alokasi Dana Desa (ADD)', value: 'Rp 142 Milyar', change: yearTag, isPositive: true, category: 'ANGGARAN', iconName: 'Award', subtitle: 'Bakeuda Kab. Trenggalek' }
      ],
      '6': [
        { title: 'Jalan Mantap Kab. Trenggalek', value: selectedTahun === '2024' ? '78.2 %' : selectedTahun === '2023' ? '75.8 %' : '82.4 %', change: yearTag, isPositive: true, category: 'INFRASTRUKTUR', iconName: 'Wrench', subtitle: 'Dinas PUPR Kab. Trenggalek' },
        { title: 'Progres JLS Watulimo-Munjungan', value: selectedTahun === '2024' ? '88.5 %' : '94.2 %', change: yearTag, isPositive: true, category: 'JALAN NASIONAL', iconName: 'Wrench', subtitle: 'BBPJN & Dinas PUPR' },
        { title: 'Cakupan Air Minum Layak', value: '89.6 %', change: yearTag, isPositive: true, category: 'AIR BERSIH', iconName: 'Wrench', subtitle: 'PDAM & PUPR Trenggalek' },
        { title: 'Irigasi Pertanian Mantap', value: '78.2 %', change: yearTag, isPositive: true, category: 'PERTANIAN', iconName: 'Home', subtitle: 'Dinas PUPR & Pertanian' }
      ]
    };

    return sectorMap[sektorId] || [
      {
        title: 'Indeks Reformasi Birokrasi (IRB)',
        value: selectedTahun === '2024' ? '85.23 Poin' : selectedTahun === '2023' ? '82.10 Poin' : '88.63 Poin',
        change: yearTag,
        isPositive: true,
        category: 'IKU DAERAH',
        iconName: 'Award',
        subtitle: 'Inspektorat Kab. Trenggalek'
      },
      {
        title: 'Tingkat Pengangguran Terbuka (TPT)',
        value: selectedTahun === '2024' ? '4,12 %' : selectedTahun === '2023' ? '4,35 %' : '3,86 %',
        change: yearTag,
        isPositive: true,
        category: 'IKU DAERAH',
        iconName: 'Briefcase',
        subtitle: '1. BPS; 2. Dinas Perinaker'
      },
      {
        title: 'Indeks Kepuasan Masyarakat (IKM)',
        value: selectedTahun === '2024' ? '97.40 Poin' : selectedTahun === '2023' ? '96.10 Poin' : '98.59 Poin',
        change: yearTag,
        isPositive: true,
        category: 'PELAYANAN PUBLIK',
        iconName: 'Smile',
        subtitle: 'Bagian Organisasi Setda'
      },
      {
        title: 'Desa Mandiri (IDM)',
        value: selectedTahun === '2024' ? '85 Desa' : selectedTahun === '2023' ? '68 Desa' : '109 Desa',
        change: yearTag,
        isPositive: true,
        category: 'SDG\'S DESA',
        iconName: 'Home',
        subtitle: 'DPMD Kab. Trenggalek'
      }
    ];
  };

  const getDisplayKpis = (): KpiItem[] => {
    if (selectedKecData) {
      const name = selectedKecData.nama;
      return [
        {
          title: 'Indeks Kepuasan Masyarakat (IKM)',
          value: `${selectedKecData.ikm} Poin`,
          change: `Kec. ${name}`,
          isPositive: true,
          category: 'IKM WILAYAH',
          iconName: 'Smile',
          subtitle: `Kantor Kec. ${name}`
        },
        {
          title: 'Tingkat Pengangguran Terbuka (TPT)',
          value: `${selectedKecData.tingkatPengangguran} %`,
          change: `Kec. ${name}`,
          isPositive: true,
          category: 'TENAGA KERJA',
          iconName: 'Briefcase',
          subtitle: `Profil Ketenagakerjaan ${name}`
        },
        {
          title: 'Kunjungan Wisatawan',
          value: `${Math.round(selectedKecData.wisatawan / 1000)} Ribu Pax`,
          change: `Kec. ${name}`,
          isPositive: true,
          category: 'PARIWISATA',
          iconName: 'Compass',
          subtitle: `Destinasi Kec. ${name}`
        },
        {
          title: 'Jumlah Desa Mandiri (IDM)',
          value: `${selectedKecData.desaMandiri} Desa`,
          change: `Kec. ${name}`,
          isPositive: true,
          category: 'DESA MANDIRI',
          iconName: 'Home',
          subtitle: `DPMD & Kec. ${name}`
        }
      ];
    }

    return getSectorKpis(selectedSektor);
  };

  const displayKpis = getDisplayKpis();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayKpis.map((kpi, index) => (
        <div
          key={index}
          className="glass-card rounded-xl p-4 border border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
              <div className="flex items-center space-x-1.5 min-w-0">
                {getIcon(kpi.iconName)}
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-950 text-slate-300 border border-slate-800 truncate">
                  {kpi.category}
                </span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border whitespace-nowrap shrink-0 ${
                kpi.change.startsWith('+') || kpi.change.includes('Milyar')
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : kpi.change.startsWith('Kec.')
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
              }`}>
                {kpi.change}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-slate-400 mb-1.5 leading-snug truncate" title={kpi.title}>
              {kpi.title}
            </h4>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 font-display">
              {kpi.value}
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between min-w-0">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" />
              <span>Produsen:</span>
            </span>
            <span className="text-slate-300 font-semibold truncate ml-1 text-[11px]" title={kpi.subtitle}>
              {kpi.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

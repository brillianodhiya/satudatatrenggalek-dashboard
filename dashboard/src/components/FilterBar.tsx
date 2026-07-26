import React from 'react';
import { SlidersHorizontal, Layers, MapPin, Calendar, Link2 } from 'lucide-react';
import { KECAMATAN_LIST, SEKTOR_LIST } from '../data/mockData';
import smartRegion from '../assets/smart_region.png';

interface FilterBarProps {
  selectedSektor: string;
  setSelectedSektor: (s: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (k: string) => void;
  selectedTahun: string;
  setSelectedTahun: (t: string) => void;
  isLiveApiConnected?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedSektor,
  setSelectedSektor,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedTahun,
  setSelectedTahun,
  isLiveApiConnected = false
}) => {
  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md mb-6 relative overflow-hidden">
      
      {/* Header Title & Subtitle + Integrated Live API Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0 shadow-2xs mt-0.5">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex flex-wrap items-center gap-1.5 leading-snug">
              <span>Panel Kontrol & Filter Data</span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-mono">
                Master Filter
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-normal mt-0.5">
              Saring seluruh KPI, Grafik Analitik, dan Tabel Indikator Pembangunan secara terpadu.
            </p>
          </div>
        </div>

        {/* Integrated Live API Gateway Connection Pill */}
        {isLiveApiConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] shadow-2xs shrink-0 self-start sm:self-auto">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200">Live API Gateway (881)</span>
            </div>
            <a
              href="https://satudata.trenggalekkab.go.id/api_json/881"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-700 dark:text-cyan-400 font-mono text-[10px] underline hover:text-cyan-900 dark:hover:text-cyan-300 ml-1 flex items-center gap-0.5 font-extrabold"
            >
              <span>json/881</span>
              <Link2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            </a>
          </div>
        )}
      </div>

      {/* Select Filter Inputs (Responsive 1 Column on Mobile, 3 Columns on Tablet/Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        
        {/* Filter 1: Sektor / Bidang */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs">
          <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Sektor Pembangunan</label>
            <select
              value={selectedSektor}
              onChange={(e) => setSelectedSektor(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semua Sektor (408 Bidang)
              </option>
              {SEKTOR_LIST.map((sektor) => (
                <option key={sektor.id} value={sektor.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {sektor.nama} ({sektor.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter 2: Kecamatan */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Wilayah Kecamatan</label>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Seluruh 14 Kecamatan
              </option>
              {KECAMATAN_LIST.map((kec) => (
                <option key={kec.id} value={kec.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  Kec. {kec.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter 3: Periode Tahun */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs">
          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Periode Tahun Data</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="2026" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tahun 2026 (Terbaru)</option>
              <option value="2025" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tahun 2025</option>
              <option value="2024" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tahun 2024</option>
              <option value="2023" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Tahun 2023</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};

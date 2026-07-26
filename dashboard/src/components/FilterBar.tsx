import React from 'react';
import { SlidersHorizontal, Layers, MapPin, Calendar, Link2 } from 'lucide-react';
import { KECAMATAN_LIST, SEKTOR_LIST } from '../data/mockData';

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
    <div className="rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xs mb-4">
      
      {/* Header Title & Subtitle + Integrated Live API Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Panel Kontrol & Filter Data
              </h3>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-mono whitespace-nowrap shrink-0">
                Master Filter
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Filter KPI, Grafik, dan Tabel Indikator secara terpadu.
            </p>
          </div>
        </div>

        {/* Integrated Live API Gateway Connection Pill */}
        {isLiveApiConnected && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] shrink-0">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200">Live API (881)</span>
            </div>
            <a
              href="https://satudata.trenggalekkab.go.id/api_json/881"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-700 dark:text-cyan-400 font-mono text-[9px] underline hover:text-cyan-900 dark:hover:text-cyan-300 flex items-center gap-0.5 font-extrabold"
            >
              <span>json/881</span>
              <Link2 className="w-2.5 h-2.5" />
            </a>
          </div>
        )}
      </div>

      {/* Select Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        
        {/* Filter 1: Sektor / Bidang */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Sektor Pembangunan</label>
            <select
              value={selectedSektor}
              onChange={(e) => setSelectedSektor(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-[11px]"
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
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Wilayah Kecamatan</label>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-[11px]"
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
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono block font-bold">Periode Tahun</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none w-full cursor-pointer truncate text-[11px]"
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

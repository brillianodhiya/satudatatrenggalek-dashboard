import React from 'react';
import { SlidersHorizontal, Layers, MapPin, Calendar } from 'lucide-react';
import { KECAMATAN_LIST, SEKTOR_LIST } from '../data/mockData';

interface FilterBarProps {
  selectedSektor: string;
  setSelectedSektor: (s: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (k: string) => void;
  selectedTahun: string;
  setSelectedTahun: (t: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedSektor,
  setSelectedSektor,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedTahun,
  setSelectedTahun,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 mb-6 bg-slate-900/90 shadow-xl relative overflow-hidden">
      
      {/* Header Title & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Panel Kontrol & Filter Data Eksekutif</span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Master Filter
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Filter di bawah ini akan menyaring seluruh KPI, Grafik Analitik, dan Tabel Indikator Pembangunan secara serentak.
            </p>
          </div>
        </div>
      </div>

      {/* Select Filter Inputs (Responsive 1 Column on Mobile, 3 Columns on Tablet/Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Filter 1: Sektor / Bidang */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs hover:border-slate-700 transition-colors">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 uppercase font-mono block">Sektor Pembangunan</label>
            <select
              value={selectedSektor}
              onChange={(e) => setSelectedSektor(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                Semua Sektor (408 Bidang)
              </option>
              {SEKTOR_LIST.map((sektor) => (
                <option key={sektor.id} value={sektor.id} className="bg-slate-900 text-slate-200">
                  {sektor.nama} ({sektor.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter 2: Kecamatan */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs hover:border-slate-700 transition-colors">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 uppercase font-mono block">Wilayah Kecamatan</label>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                Seluruh 14 Kecamatan
              </option>
              {KECAMATAN_LIST.map((kec) => (
                <option key={kec.id} value={kec.id} className="bg-slate-900 text-slate-200">
                  Kecamatan {kec.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter 3: Tahun Data */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs hover:border-slate-700 transition-colors">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="w-full min-w-0">
            <label className="text-[9px] text-slate-500 uppercase font-mono block">Periode Tahun Data</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none w-full cursor-pointer truncate text-xs"
            >
              <option value="2026" className="bg-slate-900 text-slate-200">Tahun 2026 (Terbaru)</option>
              <option value="2025" className="bg-slate-900 text-slate-200">Tahun 2025 (Perbup Bupati)</option>
              <option value="2024" className="bg-slate-900 text-slate-200">Tahun 2024</option>
              <option value="2023" className="bg-slate-900 text-slate-200">Tahun 2023</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};

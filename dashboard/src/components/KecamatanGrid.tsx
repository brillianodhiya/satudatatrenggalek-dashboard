import React from 'react';
import { MapPin, TrendingUp, Users, HeartPulse, Home } from 'lucide-react';
import { KECAMATAN_LIST } from '../data/mockData';

interface KecamatanGridProps {
  selectedKecamatan: string;
}

export const KecamatanGrid: React.FC<KecamatanGridProps> = ({ selectedKecamatan }) => {
  const filteredKecamatan = selectedKecamatan === 'ALL'
    ? KECAMATAN_LIST
    : KECAMATAN_LIST.filter(k => k.id === selectedKecamatan);

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Profil 14 Kecamatan Kab. Trenggalek</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ringkasan skor IKM, PDRB, desa mandiri, dan fasilitas kesehatan</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{filteredKecamatan.length} Kec.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredKecamatan.map((kec) => (
          <div key={kec.id} className="rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs hover:shadow-sm">
            
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                Kec. {kec.nama}
              </h4>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                IKM: {kec.ikm}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/70 dark:border-slate-700/70">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5 mb-0.5 font-medium">
                  <TrendingUp className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                  PDRB Pertanian
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-[11px]">Rp {kec.pdrb} M</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/70 dark:border-slate-700/70">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5 mb-0.5 font-medium">
                  <Users className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400" />
                  Wisatawan
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-[11px]">{kec.wisatawan.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                <Home className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                {kec.desaMandiri} Desa Mandiri
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                <HeartPulse className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                {kec.stuntingPct}%
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
            <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Profil 14 Kecamatan Kab. Trenggalek</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ringkasan skor IKM, PDRB, status desa mandiri, dan fasilitas kesehatan</p>
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Menampilkan {filteredKecamatan.length} Kecamatan</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKecamatan.map((kec) => (
          <div key={kec.id} className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md">
            
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Kec. {kec.nama}
              </h4>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                IKM: {kec.ikm}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5 font-medium">
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  PDRB Pertanian
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">Rp {kec.pdrb} M</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5 font-medium">
                  <Users className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  Wisatawan
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">{kec.wisatawan.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                <Home className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                {kec.desaMandiri} Desa Mandiri
              </span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                Stunting: {kec.stuntingPct}%
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

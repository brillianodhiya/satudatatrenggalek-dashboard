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
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Profil 14 Kecamatan Kab. Trenggalek</h3>
            <p className="text-xs text-slate-400">Ringkasan skor IKM, PDRB, status desa mandiri, dan fasilitas kesehatan</p>
          </div>
        </div>
        <span className="text-xs text-slate-400">Menampilkan {filteredKecamatan.length} Kecamatan</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKecamatan.map((kec) => (
          <div key={kec.id} className="glass-card rounded-xl p-4 border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-colors">
            
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Kec. {kec.nama}
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-950 text-emerald-400 border border-slate-800">
                IKM: {kec.ikm}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  PDRB Pertanian
                </span>
                <span className="font-bold text-slate-200 text-xs">Rp {kec.pdrb} M</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                  <Users className="w-3 h-3 text-cyan-400" />
                  Wisatawan
                </span>
                <span className="font-bold text-slate-200 text-xs">{kec.wisatawan.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <Home className="w-3 h-3 text-indigo-400" />
                {kec.desaMandiri} Desa Mandiri
              </span>
              <span className="flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-rose-400" />
                Stunting: {kec.stuntingPct}%
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

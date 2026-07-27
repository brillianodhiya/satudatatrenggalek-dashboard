import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface DataQualitySummary {
  total: number;
  withRealData: number;
  emptyInCache: number;
  notInCache: number;
  coveragePct: number;
}

interface EmptyDataset {
  id: number;
  title: string;
  opd: string;
}

interface DataQualityResponse {
  status: string;
  lastChecked: string;
  summary: DataQualitySummary;
  emptyDatasets: EmptyDataset[];
}

export const DataQualityPanel: React.FC = () => {
  const [data, setData] = useState<DataQualityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/stats/data-quality')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;
  const coveragePct = summary?.coveragePct ?? 0;
  const lastChecked = data?.lastChecked
    ? new Date(data.lastChecked).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : '-';

  return (
    <div className="rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Status Audit & Kualitas Data OPD</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Monitoring kelengkapan data real dari 645 dataset portal Satu Data Trenggalek
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {loading && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold whitespace-nowrap ${
            coveragePct >= 30
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}>
            Coverage: <strong>{coveragePct}% Berdata</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">

        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">Data Tersedia</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Aktif</span>
          </div>
          <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 mb-0.5">
            {loading ? '...' : (summary?.withRealData ?? '-')} Dataset
          </div>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Berisi data nyata & bisa dibaca AI.</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono">Data Kosong</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">Perlu Isi</span>
          </div>
          <div className="text-base font-extrabold text-amber-900 dark:text-amber-200 mb-0.5">
            {loading ? '...' : (summary?.emptyInCache ?? '-')} Dataset
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">Terdaftar tapi belum diisi OPD di portal asal.</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Belum Ter-crawl</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">Tidak Diketahui</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mb-0.5">
            {loading ? '...' : (summary?.notInCache ?? '-')} Dataset
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Diblokir Cloudflare atau belum pernah berhasil diakses.</p>
        </div>

      </div>

      <h4 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
        Dataset Terdaftar tapi Kosong di Portal Asal (sample):
      </h4>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {loading ? (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 py-4 text-center">Memuat data...</div>
        ) : (data?.emptyDatasets || []).length === 0 ? (
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 py-4 text-center">Semua dataset berdata</div>
        ) : (
          (data?.emptyDatasets || []).map((item) => (
            <div key={item.id} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[9px] font-bold">ID #{item.id}</span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px] truncate max-w-[200px]" title={item.title}>{item.title}</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">OPD: <strong className="text-slate-800 dark:text-slate-200">{item.opd || '-'}</strong></span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">Nilai Kosong</span>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-[9px] text-slate-400 dark:text-slate-600 font-mono mt-2 text-right">
        Dicek: {lastChecked} · Pembaruan Cache Berkala
      </p>

    </div>
  );
};

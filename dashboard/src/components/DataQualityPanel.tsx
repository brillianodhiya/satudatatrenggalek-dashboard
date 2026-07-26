import React from 'react';

interface DataQualityPanelProps {
  totalDatasets?: number;
  completeCount?: number;
  incompleteCount?: number;
  terbukaCount?: number;
}

export const DataQualityPanel: React.FC<DataQualityPanelProps> = ({
  totalDatasets = 645,
  completeCount = 98,
  incompleteCount = 4,
  terbukaCount = 645
}) => {
  const completenessPct = Math.round((completeCount / (completeCount + incompleteCount)) * 100);

  const missingAuditItems = [
    { id: '34', nama: 'Jumlah Fasilitas Kebugaran Jasmani', opd: 'Disparbud Kab. Trenggalek', status: 'Nilai 2025 Kosong (Belum Diisi OPD)' },
    { id: '41', nama: 'Persentase Kebutuhan Air Bersih Terpenuhi', opd: 'Dinas PUPR Kab. Trenggalek', status: 'Nilai 2025 Kosong (Proses Verifikasi)' },
    { id: '62', nama: 'Rasio APK Perguruan Tinggi', opd: 'Disdikpora Kab. Trenggalek', status: 'Data Parsial (Memerlukan Pemutakhiran BPS)' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 mb-6 bg-white/90 dark:bg-slate-900/90 shadow-sm">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Status Audit & Kualitas Data OPD</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitoring integritas data, klasifikasi risiko keterbukaan, dan deteksi nilai kosong per OPD</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
          Skor Kualitas: <strong className="text-emerald-700 dark:text-emerald-400">{completenessPct}% Valid</strong>
        </div>
      </div>

      {/* Grid Status Klasifikasi Risiko & Kelengkapan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        
        {/* Card 1: Klasifikasi Risiko */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Klasifikasi Risiko Data
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              Terbuka
            </span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white mb-0.5">{terbukaCount} Dataset Terbuka</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Kriteria Publik/Terbuka UU KIP & Keputusan Bupati.</p>
        </div>

        {/* Card 2: Kelengkapan Data */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Kelengkapan Isian OPD
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {completenessPct}% Lengkap
            </span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white mb-0.5">{completeCount} Indikator Terisi</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Melalui tahap verifikasi produsen data daerah.</p>
        </div>

        {/* Card 3: Alert Data Kosong / Di-audit */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-mono">
              Audit Nilai Kosong
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              {incompleteCount} Item
            </span>
          </div>
          <div className="text-lg font-extrabold text-amber-900 dark:text-amber-200 mb-0.5">{incompleteCount} Perlu Pemutakhiran</div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Daftar indikator tindak lanjut OPD 2025/2026.</p>
        </div>

      </div>

      {/* Daftar Indikator yang Belum Terisi / Di-Audit */}
      <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 font-mono">
        Catatan Audit Nilai Belum Terisi per OPD:
      </h4>

      <div className="space-y-2">
        {missingAuditItems.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] font-bold">ID #{item.id}</span>
              <span className="font-bold text-slate-900 dark:text-white">{item.nama}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Produsen: <strong className="text-slate-800 dark:text-slate-200 font-bold">{item.opd}</strong></span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

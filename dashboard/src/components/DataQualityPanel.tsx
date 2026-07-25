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
    <div className="glass-panel rounded-xl p-5 border border-slate-800 mb-6">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Status Audit & Kualitas Data OPD</h3>
          <p className="text-xs text-slate-400">Monitoring integritas data, klasifikasi risiko keterbukaan, dan deteksi nilai kosong per OPD</p>
        </div>

        <div className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
          Skor Kualitas: <strong className="text-emerald-400">{completenessPct}% Valid</strong>
        </div>
      </div>

      {/* Grid Status Klasifikasi Risiko & Kelengkapan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        
        {/* Card 1: Klasifikasi Risiko */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Klasifikasi Risiko Data
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
              Terbuka
            </span>
          </div>
          <div className="text-lg font-bold text-white mb-0.5">{terbukaCount} Dataset Terbuka</div>
          <p className="text-[11px] text-slate-400">Kriteria Publik/Terbuka UU KIP & Keputusan Bupati.</p>
        </div>

        {/* Card 2: Kelengkapan Data */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kelengkapan Isian OPD
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
              {completenessPct}% Lengkap
            </span>
          </div>
          <div className="text-lg font-bold text-white mb-0.5">{completeCount} Indikator Terisi</div>
          <p className="text-[11px] text-slate-400">Melalui tahap verifikasi produsen data daerah.</p>
        </div>

        {/* Card 3: Alert Data Kosong / Di-audit */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Audit Nilai Kosong
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {incompleteCount} Item
            </span>
          </div>
          <div className="text-lg font-bold text-amber-300 mb-0.5">{incompleteCount} Perlu Pemutakhiran</div>
          <p className="text-[11px] text-slate-400">Daftar indikator tindak lanjut OPD 2025/2026.</p>
        </div>

      </div>

      {/* Daftar Indikator yang Belum Terisi / Di-Audit */}
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
        Catatan Audit Nilai Belum Terisi per OPD:
      </h4>

      <div className="space-y-2">
        {missingAuditItems.map((item) => (
          <div key={item.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">ID #{item.id}</span>
              <span className="font-medium text-slate-200">{item.nama}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-slate-400">Produsen: <strong className="text-slate-300 font-normal">{item.opd}</strong></span>
              <span className="text-amber-400 font-medium">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

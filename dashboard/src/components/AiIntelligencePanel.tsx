import React, { useState, useEffect } from 'react';
import { Target, Brain, Lightbulb, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { AiInsightResponse } from '../types';

interface AiIntelligencePanelProps {
  isCompact?: boolean;
  onExploreMore?: () => void;
}

export const AiIntelligencePanel: React.FC<AiIntelligencePanelProps> = ({
  isCompact = false,
  onExploreMore
}) => {
  const [insight, setInsight] = useState<AiInsightResponse>({
    executiveSummary:
      'Berdasarkan konsolidasi 645 dataset Sektoral Kabupaten Trenggalek Tahun 2025/2026, terjadi lonjakan signifikan pada Indeks Reformasi Birokrasi (88.63 / Sangat Baik) dan Nilai Investasi Sektor Pariwisata (Rp 582 Milyar). Sektor Perikanan & Pariwisata di Kec. Watulimo serta Panggul menjadi kontributor utama PDRB.',
    topPriorityKecamatan: 'Kecamatan Dongko & Kecamatan Pule',
    policyRecommendations: [
      {
        sektor: 'Kesehatan & Gizi (Stunting)',
        rekomendasi: 'Percepatan intervensi gizi terpadu dan penambahan fasilitas Puskesmas Rawat Inap di wilayah prioritas (Kec. Pule & Dongko).',
        dampak: 'Menekan prevalensi stunting hingga 7.8% pada akhir 2026.'
      },
      {
        sektor: 'Infrastruktur & Pariwisata',
        rekomendasi: 'Akselerasi penuntasan Jalur Lintas Selatan (JLS) Watulimo-Munjungan dan integrasi promosi wisata bahari terpadu.',
        dampak: 'Target peningkatan kunjungan wisatawan hingga 1.5 Juta Pax/tahun.'
      },
      {
        sektor: 'Pemberdayaan SDM & Ekonomi Desa',
        rekomendasi: 'Pendampingan literasi digital Bumdes serta fasilitasi sertifikasi halal & legalitas produk UMKM olahan lokal.',
        dampak: 'Transformasi 43 Desa Maju menjadi Desa Mandiri penuh.'
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Analisis AI (Llama-3.3 70B)');

  const fetchAiPolicy = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai/policy-summary');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setInsight(json.data);
          setLastUpdated(json.source === 'cache' ? 'Terbarui via Cache Cron' : 'Terbarui Secara Live');
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiPolicy();
  }, []);

  // ── Compact Banner (shown on Dashboard tab) ──────────────────────────────
  if (isCompact) {
    return (
      <div className="mb-4 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-wider uppercase">Analisis Ringkasan Eksekutif</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  Llama-3.3 70B AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-snug line-clamp-2">
                {insight.executiveSummary}
              </p>
            </div>
          </div>

          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="shrink-0 text-[11px] font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Full Panel (Analisis Kebijakan tab / Modal) ───────────────────────────
  return (
    <div className="space-y-4 mb-4">
      <div className="rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Ringkasan Analisis Kebijakan Eksekutif</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Rekomendasi strategis dari konsolidasi 645 dataset sektoral 2025/2026</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {lastUpdated}
            </span>
            <button
              onClick={fetchAiPolicy}
              disabled={isLoading}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              title="Perbarui Analisis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 mb-3 space-y-1.5">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="uppercase tracking-wider font-mono">Executive Summary Narrative</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
            {insight.executiveSummary}
          </p>
        </div>

        {/* Policy Recommendations Header */}
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Rekomendasi Kebijakan Prioritas:</span>
        </h4>

        {/* Grid Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {insight.policyRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                  <span
                    className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 border border-slate-300/70 dark:border-slate-600 truncate max-w-[65%]"
                    title={rec.sektor}
                  >
                    {rec.sektor}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0">
                    Prioritas #{idx + 1}
                  </span>
                </div>

                <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-relaxed mb-3">
                  {rec.rekomendasi}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 font-bold flex items-start gap-1.5 mt-auto">
                <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Target: {rec.dampak}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

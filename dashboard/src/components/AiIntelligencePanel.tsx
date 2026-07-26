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

  if (isCompact) {
    return (
      <div className="mb-6 p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-4 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-wider uppercase">Analisis Ringkasan Eksekutif</span>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Llama-3.3 70B AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
                {insight.executiveSummary}
              </p>
            </div>
          </div>

          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="shrink-0 text-xs font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer self-end md:self-auto flex items-center gap-1.5"
            >
              <span>Detail Kebijakan & Audit</span>
              <ChevronRight className="w-4 h-4 text-white dark:text-slate-900" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Executive Policy Summary Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
        
        {/* Card Header with Responsive Flex Wrap */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Ringkasan Analisis Kebijakan Eksekutif</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rekomendasi strategis otomatis dari konsolidasi 645 dataset sektoral 2025/2026</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {lastUpdated}
            </span>
            <button
              onClick={fetchAiPolicy}
              disabled={isLoading}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              title="Perbarui Analisis Kebijakan AI"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 mb-6 shadow-2xs relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-200 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="uppercase tracking-wider font-mono">Executive Summary Narrative</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
            {insight.executiveSummary}
          </p>
        </div>

        {/* Policy Recommendations Header */}
        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono relative z-10">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Rekomendasi Kebijakan Prioritas:</span>
        </h4>

        {/* Fully Responsive Grid (1 Column on Mobile/Tablet, 3 Columns on Large Screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
          {insight.policyRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-2xs hover:shadow-sm group"
            >
              <div>
                {/* Sector Badge + Priority Rank */}
                <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                  <span
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 border border-slate-300/70 dark:border-slate-600 truncate max-w-[70%]"
                    title={rec.sektor}
                  >
                    {rec.sektor}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0">
                    Prioritas #{idx + 1}
                  </span>
                </div>

                {/* Recommendation Text */}
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
                  {rec.rekomendasi}
                </p>
              </div>

              {/* Target Impact Callout Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-start gap-2 mt-auto shadow-2xs">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Target: {rec.dampak}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


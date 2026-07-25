import React, { useState, useEffect } from 'react';
import { Target, FileText, Brain, Lightbulb, RefreshCw } from 'lucide-react';
import { AiInsightResponse } from '../types';

export const AiIntelligencePanel: React.FC = () => {
  const [insight, setInsight] = useState<AiInsightResponse>({
    executiveSummary:
      'Berdasarkan konsolidasi 645 dataset Sektoral Kabupaten Trenggalek Tahun 2025/2026, terjadi lonjakan signifikan pada Indeks Reformasi Birokrasi (88.63 / Sangat Baik) dan Nilai Investasi Sektor Pariwisata (Rp 582 Milyar). Sektor Perikanan & Pariwisata di Kec. Watulimo serta Panggul menjadi kontributor utama PDRB.',
    topPriorityKecamatan: 'Kecamatan Dongko & Kecamatan Pule',
    policyRecommendations: [
      {
        sektor: 'Pemberdayaan Perempuan & Anak',
        rekomendasi: 'Meningkatkan keterwakilan perempuan di DPR dan DPRD melalui pelatihan dan pendampingan bagi calon perempuan.',
        dampak: 'Meningkatkan persentase keterwakilan perempuan di DPR dan DPRD menjadi 15% dalam 12 bulan.'
      },
      {
        sektor: 'Pengembangan Ekonomi & Investasi',
        rekomendasi: 'Mengembangkan program pengembangan usaha mikro, kecil, dan menengah (UMKM) untuk meningkatkan kesempatan kerja.',
        dampak: 'Meningkatkan jumlah UMKM menjadi 500 unit & meningkatkan pendapatan 10%.'
      },
      {
        sektor: 'Pengembangan SDM & Digitalisasi',
        rekomendasi: 'Mengembangkan program pelatihan dan pendidikan untuk meningkatkan kemampuan dan keterampilan masyarakat.',
        dampak: 'Meningkatkan jumlah masyarakat berteknologi menjadi 2.000 orang dalam 12 bulan.'
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Otomatis (Llama-3.3 70B)');

  const fetchAiPolicy = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai/policy-summary');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setInsight(json.data);
          setLastUpdated(json.source === 'cache' ? 'Terbarui via Cron (Llama-3.3 70B)' : 'Terbarui Secara Live');
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

  return (
    <div className="space-y-6 mb-8">
      {/* Executive Policy Summary Card */}
      <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-slate-800 bg-slate-900/90 shadow-md">
        
        {/* Card Header with Responsive Flex Wrap */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Brain className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Ringkasan Analisis Kebijakan Eksekutif</h3>
              <p className="text-xs text-slate-400">Rekomendasi strategis berbasis AI Groq Llama-3.3 70B dari data statistik 2025</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-950 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {lastUpdated}
            </span>
            <button
              onClick={fetchAiPolicy}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              title="Perbarui Analisis Kebijakan AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Summary Narrative Text */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
          <p>{insight.executiveSummary}</p>
        </div>

        {/* Policy Recommendations Header */}
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Rekomendasi Kebijakan Prioritas AI (Groq Llama-3.3 70B):</span>
        </h4>

        {/* Fully Responsive Grid (1 Column on Mobile/Tablet, 3 Columns on Large Screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {insight.policyRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors min-w-0"
            >
              <div>
                {/* Sector Badge + Priority Rank with Clean Alignment & Truncation */}
                <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                  <span
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-slate-900 text-cyan-300 border border-cyan-500/20 truncate max-w-[70%]"
                    title={rec.sektor}
                  >
                    {rec.sektor}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono font-semibold shrink-0">
                    Prioritas #{idx + 1}
                  </span>
                </div>

                {/* Recommendation Text */}
                <p className="text-xs font-medium text-slate-200 leading-relaxed mb-4">
                  {rec.rekomendasi}
                </p>
              </div>

              {/* Target Impact Callout Box */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-emerald-400 font-medium flex items-start gap-2 mt-auto">
                <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Target: {rec.dampak}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

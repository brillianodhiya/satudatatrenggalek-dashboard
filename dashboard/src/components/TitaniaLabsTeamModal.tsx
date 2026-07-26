import React from 'react';
import { X, Linkedin, ExternalLink, Code2, LineChart, Sparkles, Building2 } from 'lucide-react';

interface TitaniaLabsTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TitaniaLabsTeamModal: React.FC<TitaniaLabsTeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // You can place images in dashboard/src/assets/brilliano.jpg and dashboard/src/assets/aulia.jpg
  // If images exist, they will render; otherwise, the styled fallback avatars will display automatically.
  const brillianoPhoto = null; // Replace with imported image or path when available
  const auliaPhoto = null; // Replace with imported image or path when available

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tim Pengembang TitaniaLabs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Inovator di balik Trenggalek Smart Data & API Gateway System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 bg-[#F3F4F8]/50 dark:bg-[#0B0F19]">
          
          {/* About TitaniaLabs Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 text-slate-300 leading-relaxed">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Tentang TitaniaLabs</span>
            </div>
            <p className="text-slate-300">
              <strong className="text-white">TitaniaLabs</strong> adalah inisiatif riset dan pengembang teknologi independen yang berfokus pada modernisasi arsitektur data publik, otomatisasi OpenAPI, serta integrasi Artificial Intelligence (AI) untuk tata kelola pemerintahan daerah yang transparan dan akuntabel.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Member 1: Brilliano Dhiya Ul-Haq */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                {/* Photo / Avatar & Header */}
                <div className="flex items-center space-x-3.5 mb-4">
                  {brillianoPhoto ? (
                    <img
                      src={brillianoPhoto}
                      alt="Brilliano Dhiya Ul-Haq"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md font-mono shrink-0">
                      BD
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">Brilliano Dhiya Ul-Haq</h3>
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold mt-1">
                      <Code2 className="w-3 h-3" />
                      <span>Lead Developer & Architect</span>
                    </div>
                  </div>
                </div>

                {/* Description & Responsibilities */}
                <p className="text-slate-400 leading-relaxed mb-4 text-[11px]">
                  Bertanggung jawab atas arsitektur API Gateway, reverse proxy, scraping engine otomatis, pembuatan standar OpenAPI 3.0, serta integrasi Groq Llama-3.3 AI.
                </p>
              </div>

              {/* LinkedIn Button */}
              <a
                href="https://www.linkedin.com/in/brilliano-dhiya-ulhaq/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-cyan-500/20 transition-colors mt-auto"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

            {/* Member 2: Aulia Zulfaa */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                {/* Photo / Avatar & Header */}
                <div className="flex items-center space-x-3.5 mb-4">
                  {auliaPhoto ? (
                    <img
                      src={auliaPhoto}
                      alt="Aulia Zulfaa"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md font-mono shrink-0">
                      AZ
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">Aulia Zulfaa</h3>
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-semibold mt-1">
                      <LineChart className="w-3 h-3" />
                      <span>UI/UX Designer & QA</span>
                    </div>
                  </div>
                </div>

                {/* Description & Responsibilities */}
                <p className="text-slate-400 leading-relaxed mb-4 text-[11px]">
                  Bertanggung jawab atas perancangan desain antarmuka (UI/UX), penataan estetika tata letak visual dashboard, serta pengujian kualitas & kelayakan sistem (Quality Assurance).
                </p>
              </div>

              {/* LinkedIn Button */}
              <a
                href="https://www.linkedin.com/in/aulia-zulfaa-144b78259/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-amber-500/20 transition-colors mt-auto"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

          </div>

          {/* Footer note */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
            Dikembangkan secara independen untuk mendukung keterbukaan informasi & inovasi data statistik sektoral Kabupaten Trenggalek.
          </div>

        </div>

      </div>
    </div>
  );
};

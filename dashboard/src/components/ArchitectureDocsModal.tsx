import React from 'react';
import { ShieldCheck, Server, AlertTriangle, Zap, Lock, Cpu, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Arsitektur Keamanan & Proteksi Gateway
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Bagaimana API Gateway memproteksi kerentanan server asal Pemkab Trenggalek
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

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-[#F3F4F8]/50 dark:bg-[#0B0F19]">
          
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 flex items-start space-x-3">
            <Server className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Mengapa API Gateway Ini Diperlukan?</h3>
              <p className="text-xs text-cyan-200/90">
                Portal resmi <strong className="text-white">satudata.trenggalekkab.go.id</strong> menyediakan ratusan dataset publik, namun server asalnya sering menghadapi kendala stabilitas, kerentanan timeout, dan ketiadaan CORS header standar. API Gateway ini bertindak sebagai <strong className="text-white">Shield & Normalization Layer</strong>.
              </p>
            </div>
          </div>

          {/* 4 Pillars of Protection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pillar 1: Smart Caching & Anti-Timeout */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>1. Proteksi HTTP 408 & Request Timeout</span>
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">Kerentanan Asli:</strong> Server origin publik sering mengalami <em>Request Timeout (HTTP 408)</em> saat diakses oleh lalu lintas banyak secara bersamaan.
              </p>
              <p className="text-slate-300">
                <strong className="text-emerald-400">Solusi Gateway:</strong> Dilengkapi dengan <em>Smart Caching System & Retry Mechanism</em>. Request client direspons dalam <strong className="text-white font-mono">&lt; 50ms</strong> tanpa membebani server origin.
              </p>
            </div>

            {/* Pillar 2: CORS & Reverse Proxy */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
                <Lock className="w-4 h-4 shrink-0" />
                <span>2. CORS Sanitizer & Origin Shield</span>
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">Kerentanan Asli:</strong> Browser memblokir panggilan AJAX langsung ke server Pemkab karena kendala header CORS (Cross-Origin Resource Sharing).
              </p>
              <p className="text-slate-300">
                <strong className="text-emerald-400">Solusi Gateway:</strong> Menyediakan Reverse Proxy bersih dengan header CORS terstandarisasi sehingga aman dikonsumsi oleh Web/Mobile App eksternal.
              </p>
            </div>

            {/* Pillar 3: Data Normalization */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs">
                <Zap className="w-4 h-4 shrink-0" />
                <span>3. Sanitasi & Normalisasi OpenAPI 3.0</span>
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">Kerentanan Asli:</strong> Format JSON origin kadang menyisipkan tag HTML, string tidak konsisten, atau struktur data mentah.
              </p>
              <p className="text-slate-300">
                <strong className="text-emerald-400">Solusi Gateway:</strong> Mengonversi otomatis 645 dataset ke dalam standar **OpenAPI 3.0 (Swagger)** siap pakai oleh developer.
              </p>
            </div>

            {/* Pillar 4: Rate Limiting & DDoS Prevention */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
                <Cpu className="w-4 h-4 shrink-0" />
                <span>4. Throttling & DDoS Absorption</span>
              </div>
              <p className="text-slate-400">
                <strong className="text-slate-200">Kerentanan Asli:</strong> Server origin dapat mengalami *crash* jika menerima *scraping* / bot otomatis beruntun.
              </p>
              <p className="text-slate-300">
                <strong className="text-emerald-400">Solusi Gateway:</strong> Gateway menyerap ribuan request berulang di layer proxy, menjaga server origin Pemkab tetap aman dan stabil.
              </p>
            </div>

          </div>

          {/* Before vs After Comparison Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Perbandingan: Direct Public API vs Protected API Gateway</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                    <th className="p-3">Parameter</th>
                    <th className="p-3 text-rose-400">API Publik Origin (Direct)</th>
                    <th className="p-3 text-emerald-400">API Gateway Terproteksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-[11px]">
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Respon Time</td>
                    <td className="p-3 text-slate-400">2.5s - 10s (Sering 408 Timeout)</td>
                    <td className="p-3 text-emerald-400 font-mono font-bold">&lt; 50ms (Cached Proxy)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Dukungan CORS Web</td>
                    <td className="p-3 text-slate-400">Terbatas / Diblokir Browser</td>
                    <td className="p-3 text-emerald-400 font-bold">Full CORS Enabled (Any Origin)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Skema Dokumentasi</td>
                    <td className="p-3 text-slate-400">JSON Unstructured Raw</td>
                    <td className="p-3 text-emerald-400 font-bold">OpenAPI 3.0 / Swagger Interactive</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Integrasi AI / LLM</td>
                    <td className="p-3 text-slate-400">Tidak Ada Endpoint AI</td>
                    <td className="p-3 text-emerald-400 font-bold">Native Groq Llama-3.3 70B Engine</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Keamanan Origin Server</td>
                    <td className="p-3 text-slate-400">Rentan Overload Saat Web Traffic Naik</td>
                    <td className="p-3 text-emerald-400 font-bold">Terproteksi 100% dari Direct Load</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">Security Architecture Status: Active Protection</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Tutup Dokumentasi
          </button>
        </div>

      </div>
    </div>
  );
};

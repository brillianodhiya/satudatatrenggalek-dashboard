import React from 'react';
import { X, Brain, ShieldCheck } from 'lucide-react';
import { AiIntelligencePanel } from './AiIntelligencePanel';
import { DataQualityPanel } from './DataQualityPanel';
import { Dataset881Item } from '../utils/realDataParser';

interface AiQualityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset881Items?: Dataset881Item[];
}

export const AiQualityAuditModal: React.FC<AiQualityAuditModalProps> = ({
  isOpen,
  onClose,
  dataset881Items = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 shrink-0 gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Analisis Kebijakan AI & Audit Kualitas Data OPD
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0">
                  Llama-3.3 70B
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                Rekomendasi strategis kecerdasan buatan & audit kelengkapan 645 dataset daerah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 bg-[#F3F4F8]/50 dark:bg-[#0B0F19]">
          
          {/* Section 1: AI Policy Intelligence */}
          <AiIntelligencePanel isCompact={false} />

          {/* Section 2: Data Quality & Integrity Audit */}
          <DataQualityPanel
            totalDatasets={645}
            completeCount={dataset881Items.length > 0 ? dataset881Items.length : 98}
            incompleteCount={4}
            terbukaCount={645}
          />

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">Audit Otomatis Portal Satu Data Kabupaten Trenggalek</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Tutup Audit
          </button>
        </div>

      </div>
    </div>
  );
};

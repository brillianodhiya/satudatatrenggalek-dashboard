import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface OpenApiTabProps {
  datasetCount: number;
}

export const OpenApiTab: React.FC<OpenApiTabProps> = ({ datasetCount }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 mb-8 bg-white/90 dark:bg-slate-900/90 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">OpenAPI 3.0 Documentation & Developer Portal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dokumentasi API terstandarisasi untuk seluruh {datasetCount} dataset portal Satu Data Trenggalek</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold flex items-center space-x-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 transition-colors shadow-2xs"
          >
            <span>Buka Swagger Fullscreen</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center space-x-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <span>Raw OpenAPI JSON Spec</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded Swagger UI Iframe */}
      <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <iframe
          src="/docs"
          title="OpenAPI Swagger UI"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

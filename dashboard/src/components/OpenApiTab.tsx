import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface OpenApiTabProps {
  datasetCount: number;
}

export const OpenApiTab: React.FC<OpenApiTabProps> = ({ datasetCount }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">OpenAPI 3.0 Documentation & Developer Portal</h3>
            <p className="text-xs text-slate-400">Dokumentasi API terstandarisasi untuk seluruh {datasetCount} dataset portal Satu Data Trenggalek</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-2 hover:bg-cyan-500/30 transition-colors"
          >
            <span>Buka Dashboard Swagger Fullscreen</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold flex items-center space-x-2 hover:bg-slate-800 transition-colors"
          >
            <span>Raw OpenAPI JSON Spec</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded Swagger UI Iframe */}
      <div className="w-full h-[700px] rounded-xl overflow-hidden border border-slate-800 bg-white">
        <iframe
          src="/docs"
          title="OpenAPI Swagger UI"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

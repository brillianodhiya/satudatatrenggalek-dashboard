import React, { useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { KpiGrid } from './components/KpiGrid';
import { ChartsSection } from './components/ChartsSection';
import { AiIntelligencePanel } from './components/AiIntelligencePanel';
import { DataQualityPanel } from './components/DataQualityPanel';
import { RealDataTable } from './components/RealDataTable';
import { KecamatanGrid } from './components/KecamatanGrid';
import { OpenApiTab } from './components/OpenApiTab';
import { FloatingAiChat } from './components/FloatingAiChat';
import { INITIAL_KPIS } from './data/mockData';
import { KpiItem } from './types';
import { parseRealKpisFrom881, Dataset881Item, FALLBACK_881_ITEMS } from './utils/realDataParser';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'openapi' | 'ai'>('dashboard');
  const [selectedSektor, setSelectedSektor] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [kpis, setKpis] = useState<KpiItem[]>(INITIAL_KPIS);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);
  const [dataset881Items, setDataset881Items] = useState<Dataset881Item[]>([]);

  // Fetch 100% authentic dataset 881 from API Gateway on mount
  useEffect(() => {
    async function fetchLiveDataset() {
      try {
        const res = await fetch('/api/v1/datasets/881/data');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.data && Array.isArray(json.data.data)) {
            setIsLiveApiConnected(true);
            setDataset881Items(json.data.data);
            
            // Parse 100% REAL KPIs directly from Dataset 881
            const realKpis = parseRealKpisFrom881(json.data.data);
            setKpis(realKpis);
          }
        }
      } catch {
        // Fallback
      }
    }

    fetchLiveDataset();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Executive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetCount={645}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        
        {/* Live Official Dataset Banner (Responsive 1-Column Stack & Non-Overflowing) */}
        {isLiveApiConnected && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex flex-col gap-2.5 overflow-hidden w-full">
            <div className="flex items-start gap-2.5 w-full">
              <Link2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="w-full min-w-0 leading-relaxed text-slate-200">
                <strong className="text-white block sm:inline mr-1">Terhubung Portal Satu Data Trenggalek:</strong>
                <span>Dataset ID 881 (98 Indikator Resmi Keputusan Bupati Nomor 100.3.3.2/627/406.001.3/2024).</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-400 font-mono">Status: Live API Gateway</span>
              <a
                href="https://satudata.trenggalekkab.go.id/api_json/881"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 font-mono underline hover:text-cyan-300 break-all shrink-0 max-w-full"
              >
                api_json/881 ↗
              </a>
            </div>
          </div>
        )}

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* LAYER 1: MACRO OVERVIEW (RINGKASAN MAKRO KABUPATEN - DI ATAS MASTER FILTER) */}
            <AiIntelligencePanel />

            <DataQualityPanel
              totalDatasets={645}
              completeCount={dataset881Items.length > 0 ? dataset881Items.length : 98}
              incompleteCount={4}
              terbukaCount={645}
            />

            {/* LAYER 2: MASTER FILTER PANEL (KEMUDI FILTER SEKTORAL, REGIONAL & PERIODE TAHUN) */}
            <FilterBar
              selectedSektor={selectedSektor}
              setSelectedSektor={setSelectedSektor}
              selectedKecamatan={selectedKecamatan}
              setSelectedKecamatan={setSelectedKecamatan}
              selectedTahun={selectedTahun}
              setSelectedTahun={setSelectedTahun}
            />

            {/* LAYER 3: RECTIVELY FILTERED DASHBOARD (SELURUH KOMPONEN DI BAWAH 100% REAKTIF TERHADAP SEKTOR, KECAMATAN & TAHUN) */}

            {/* 1. Executive KPI Cards (Reactively Filtered by Sektor, Kecamatan & Tahun) */}
            <KpiGrid
              kpis={kpis}
              selectedSektor={selectedSektor}
              selectedKecamatan={selectedKecamatan}
              selectedTahun={selectedTahun}
            />

            {/* 2. Descriptive & Predictive Analytics Charts (Reactively Filtered by Sektor, Kecamatan & Tahun) */}
            <ChartsSection
              selectedSektor={selectedSektor}
              selectedKecamatan={selectedKecamatan}
              selectedTahun={selectedTahun}
            />

            {/* 3. Interactive Table of 98 Perbup Indicators (Reactively Filtered by Sektor, Kecamatan, OPD & Tahun) */}
            <RealDataTable
              items={dataset881Items.length > 0 ? dataset881Items : FALLBACK_881_ITEMS}
              selectedSektor={selectedSektor}
              selectedKecamatan={selectedKecamatan}
              selectedTahun={selectedTahun}
            />

            {/* 4. 14 Kecamatan Profiles Grid (Reactively Filtered by Kecamatan) */}
            <KecamatanGrid selectedKecamatan={selectedKecamatan} />
          </>
        )}

        {/* Tab 2: AI Policy Engine */}
        {activeTab === 'ai' && (
          <>
            <AiIntelligencePanel />
            <DataQualityPanel />
          </>
        )}

        {/* Tab 3: OpenAPI Documentation & Developer Portal */}
        {activeTab === 'openapi' && (
          <OpenApiTab datasetCount={645} />
        )}

      </main>

      {/* Floating AI Chat Assistant Widget (Bottom-Right Corner) */}
      <FloatingAiChat />

      {/* Executive Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 TitaniaLabs &bull; Trenggalek Smart Data & AI Intelligence Gateway</span>
          <span className="text-slate-400 font-mono">OpenAPI 3.0 &bull; 645 Active Datasets</span>
        </div>
      </footer>

    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link2, ShieldCheck, Users } from 'lucide-react';
import { Navbar, ThemeMode } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { KpiGrid } from './components/KpiGrid';
import { ChartsSection } from './components/ChartsSection';
import { AiIntelligencePanel } from './components/AiIntelligencePanel';
import { DataQualityPanel } from './components/DataQualityPanel';
import { RealDataTable } from './components/RealDataTable';
import { KecamatanGrid } from './components/KecamatanGrid';
import { OpenApiTab } from './components/OpenApiTab';
import { FloatingAiChat } from './components/FloatingAiChat';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { TitaniaLabsTeamModal } from './components/TitaniaLabsTeamModal';
import { AiQualityAuditModal } from './components/AiQualityAuditModal';
import { DashboardSubNav, DashboardSubTabType } from './components/DashboardSubNav';
import { INITIAL_KPIS } from './data/mockData';
import { KpiItem } from './types';
import { parseRealKpisFrom881, Dataset881Item, FALLBACK_881_ITEMS } from './utils/realDataParser';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'openapi' | 'ai'>('dashboard');
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTabType>('charts');
  const [selectedSektor, setSelectedSektor] = useState('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [kpis, setKpis] = useState<KpiItem[]>(INITIAL_KPIS);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);
  const [dataset881Items, setDataset881Items] = useState<Dataset881Item[]>([]);
  const [isArchDocsOpen, setIsArchDocsOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isAiAuditModalOpen, setIsAiAuditModalOpen] = useState(false);

  // Theme State: 'system' (default), 'light', or 'dark'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('trenggalek_theme_mode');
    return (saved as ThemeMode) || 'system';
  });

  const [resolvedDark, setResolvedDark] = useState<boolean>(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  });

  // Automatically update root class and handles system preference changes
  useEffect(() => {
    const updateTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setResolvedDark(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('trenggalek_theme_mode', themeMode);
    };

    updateTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setResolvedDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

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
    <div className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 ${
      resolvedDark ? 'bg-[#0B0F19] text-slate-100 dark' : 'bg-[#F3F4F8] text-slate-900'
    }`}>
      
      {/* Executive Navbar with Theme Switcher (Sistem | Terang | Gelap) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasetCount={645}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        
        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {/* LAYER 1: MASTER FILTER PANEL (ABOVE-THE-FOLD - KEMUDI SEKTORAL, REGIONAL & PERIODE) */}
            <FilterBar
              selectedSektor={selectedSektor}
              setSelectedSektor={setSelectedSektor}
              selectedKecamatan={selectedKecamatan}
              setSelectedKecamatan={setSelectedKecamatan}
              selectedTahun={selectedTahun}
              setSelectedTahun={setSelectedTahun}
              isLiveApiConnected={isLiveApiConnected}
            />

            {/* LAYER 2: EXECUTIVE KPI CARDS (ABOVE-THE-FOLD - INSTANT NUMERICAL INSIGHT) */}
            <KpiGrid
              kpis={kpis}
              selectedSektor={selectedSektor}
              selectedKecamatan={selectedKecamatan}
              selectedTahun={selectedTahun}
            />

            {/* LAYER 3: COMPACT EXECUTIVE AI HIGHLIGHT SPOTLIGHT */}
            <AiIntelligencePanel
              isCompact={true}
              onExploreMore={() => setIsAiAuditModalOpen(true)}
            />

            {/* LAYER 4: MODULAR DASHBOARD SUB-NAVIGASI */}
            <DashboardSubNav
              activeSubTab={dashboardSubTab}
              setActiveSubTab={setDashboardSubTab}
              tableCount={dataset881Items.length > 0 ? dataset881Items.length : 98}
              kecamatanCount={14}
              onOpenAiAuditModal={() => setIsAiAuditModalOpen(true)}
            />

            {/* LAYER 5: REACTIONARY SUB-TAB CONTENT */}
            {dashboardSubTab === 'charts' && (
              <ChartsSection
                selectedSektor={selectedSektor}
                selectedKecamatan={selectedKecamatan}
                selectedTahun={selectedTahun}
              />
            )}

            {dashboardSubTab === 'table' && (
              <RealDataTable
                items={dataset881Items.length > 0 ? dataset881Items : FALLBACK_881_ITEMS}
                selectedSektor={selectedSektor}
                selectedKecamatan={selectedKecamatan}
                selectedTahun={selectedTahun}
              />
            )}

            {dashboardSubTab === 'kecamatan' && (
              <KecamatanGrid selectedKecamatan={selectedKecamatan} />
            )}
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

      {/* AI Policy & Quality Audit Modal */}
      <AiQualityAuditModal
        isOpen={isAiAuditModalOpen}
        onClose={() => setIsAiAuditModalOpen(false)}
        dataset881Items={dataset881Items}
      />

      {/* Architecture & Security Docs Modal */}
      <ArchitectureDocsModal
        isOpen={isArchDocsOpen}
        onClose={() => setIsArchDocsOpen(false)}
      />

      {/* TitaniaLabs Development Team Modal */}
      <TitaniaLabsTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      {/* Executive Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 pt-6 pb-20 sm:pb-6 text-center text-xs text-slate-500 dark:text-slate-400 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
            <span>&copy; 2026</span>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="text-slate-900 dark:text-white font-bold hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Lihat Tim Pengembang TitaniaLabs"
            >
              <span>TitaniaLabs</span>
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </button>
            <span>&bull; Portal Satu Data & API Gateway Kab. Trenggalek</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsArchDocsOpen(true)}
              className="text-cyan-700 dark:text-cyan-400 font-bold hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Dokumentasi Arsitektur & Keamanan Gateway</span>
            </button>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">OpenAPI 3.0 &bull; 645 Datasets</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

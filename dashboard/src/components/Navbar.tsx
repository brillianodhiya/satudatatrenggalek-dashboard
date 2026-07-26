import React, { useState } from 'react';
import { LayoutDashboard, FileText, Code2, Server, Menu, X } from 'lucide-react';
import logoTrenggalek from '../assets/logo_trenggalek.png';

interface NavbarProps {
  activeTab: 'dashboard' | 'openapi' | 'ai';
  setActiveTab: (tab: 'dashboard' | 'openapi' | 'ai') => void;
  datasetCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, datasetCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'dashboard' | 'openapi' | 'ai') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Logo & Branding Header */}
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <img
              src={logoTrenggalek}
              alt="Lambang Kabupaten Trenggalek"
              className="w-8 h-10 sm:w-11 sm:h-13 object-contain shrink-0 drop-shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xs sm:text-base font-extrabold text-white tracking-tight truncate font-display">
                  PEMKAB TRENGGALEK
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                  Satu Data Trenggalek
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                Portal Statistik Sektoral & Gateway
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard Eksekutif</span>
            </button>

            <button
              onClick={() => handleTabClick('ai')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'ai'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Analisis Kebijakan</span>
            </button>

            <button
              onClick={() => handleTabClick('openapi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'openapi'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Dokumentasi API</span>
            </button>
          </nav>

          {/* Gateway Status Badge & Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-mono font-medium">{datasetCount} Datasets Active</span>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white transition-colors shrink-0"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Dashboard Eksekutif</span>
          </button>

          <button
            onClick={() => handleTabClick('ai')}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors ${
              activeTab === 'ai'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Analisis Kebijakan</span>
          </button>

          <button
            onClick={() => handleTabClick('openapi')}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-colors ${
              activeTab === 'openapi'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Dokumentasi API</span>
          </button>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Gateway Status: Active</span>
            <span className="text-emerald-400 font-bold">{datasetCount} Datasets</span>
          </div>
        </div>
      )}
    </header>
  );
};

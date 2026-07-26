import React, { useState } from 'react';
import { LayoutDashboard, FileText, Code2, Server, Menu, X, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import logoTrenggalek from '../assets/logo_trenggalek.png';

export type ThemeMode = 'system' | 'light' | 'dark';

interface NavbarProps {
  activeTab: 'dashboard' | 'openapi' | 'ai';
  setActiveTab: (tab: 'dashboard' | 'openapi' | 'ai') => void;
  datasetCount: number;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  datasetCount,
  themeMode,
  setThemeMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleTabClick = (tab: 'dashboard' | 'openapi' | 'ai') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Logo & Branding Header */}
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <img
              src={logoTrenggalek}
              alt="Lambang Kabupaten Trenggalek"
              className="w-8 h-10 sm:w-10 sm:h-12 object-contain shrink-0 drop-shadow-sm"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate font-display">
                  PEMKAB TRENGGALEK
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase tracking-wider">
                  Satu Data Trenggalek
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                Portal Statistik Sektoral & Gateway
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Pill Shaped */}
          <nav className="hidden md:flex items-center space-x-2 bg-slate-100/70 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/70 dark:border-slate-700/80">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-cyan-400 dark:text-cyan-600' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Dashboard Eksekutif</span>
            </button>

            <button
              onClick={() => handleTabClick('ai')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 transition-all ${
                activeTab === 'ai'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'ai' ? 'text-amber-400 dark:text-amber-600' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Analisis Kebijakan</span>
            </button>

            <button
              onClick={() => handleTabClick('openapi')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 transition-all ${
                activeTab === 'openapi'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Code2 className={`w-4 h-4 ${activeTab === 'openapi' ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Dokumentasi API</span>
            </button>
          </nav>

          {/* Theme Dropdown Switcher Button & Gateway Status Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Compact Theme Dropdown Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
                aria-label="Toggle Theme Menu"
              >
                {themeMode === 'system' && <Monitor className="w-3.5 h-3.5 text-cyan-500" />}
                {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="capitalize text-[11px] font-bold">
                  {themeMode === 'system' ? 'Sistem' : themeMode === 'light' ? 'Terang' : 'Gelap'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Dropdown Menu */}
              {themeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <button
                      onClick={() => {
                        setThemeMode('system');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Sistem OS</span>
                      </div>
                      {themeMode === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>}
                    </button>

                    <button
                      onClick={() => {
                        setThemeMode('light');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Terang</span>
                      </div>
                      {themeMode === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                    </button>

                    <button
                      onClick={() => {
                        setThemeMode('dark');
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Moon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Gelap</span>
                      </div>
                      {themeMode === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{datasetCount} Datasets Active</span>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 transition-colors shadow-lg">
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full px-4 py-2.5 rounded-full text-xs flex items-center space-x-3 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-cyan-400 dark:text-cyan-600' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Dashboard Eksekutif</span>
          </button>

          <button
            onClick={() => handleTabClick('ai')}
            className={`w-full px-4 py-2.5 rounded-full text-xs flex items-center space-x-3 transition-colors ${
              activeTab === 'ai'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'ai' ? 'text-amber-400 dark:text-amber-600' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Analisis Kebijakan</span>
          </button>

          <button
            onClick={() => handleTabClick('openapi')}
            className={`w-full px-4 py-2.5 rounded-full text-xs flex items-center space-x-3 transition-colors ${
              activeTab === 'openapi'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <Code2 className={`w-4 h-4 ${activeTab === 'openapi' ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Dokumentasi API</span>
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Gateway Status: Active</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{datasetCount} Datasets</span>
          </div>
        </div>
      )}
    </header>
  );
};

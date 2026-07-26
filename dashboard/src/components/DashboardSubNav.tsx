import React from 'react';
import { BarChart3, Table, MapPin } from 'lucide-react';

export type DashboardSubTabType = 'charts' | 'table' | 'kecamatan';

interface DashboardSubNavProps {
  activeSubTab: DashboardSubTabType;
  setActiveSubTab: (tab: DashboardSubTabType) => void;
  tableCount?: number;
  kecamatanCount?: number;
  onOpenAiAuditModal?: () => void;
}

export const DashboardSubNav: React.FC<DashboardSubNavProps> = ({
  activeSubTab,
  setActiveSubTab,
  tableCount = 98,
  kecamatanCount = 14,
  onOpenAiAuditModal
}) => {
  const tabs: { id: DashboardSubTabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'charts',
      label: 'Visualisasi & Grafik Analitik',
      icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'table',
      label: 'Tabel Indikator Perbup 881',
      icon: <Table className="w-3.5 h-3.5 shrink-0" />,
      badge: `${tableCount} Data`
    },
    {
      id: 'kecamatan',
      label: 'Profil 14 Kecamatan',
      icon: <MapPin className="w-3.5 h-3.5 shrink-0" />,
      badge: `${kecamatanCount} Wilayah`
    }
  ];

  return (
    <div className="sticky top-[56px] z-20 backdrop-blur-md bg-[#F3F4F8]/90 dark:bg-[#0B0F19]/90 border-b border-slate-200/80 dark:border-slate-800 py-2 mb-4 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 transition-all">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {tabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <span className={`${isActive ? 'text-cyan-400 dark:text-cyan-600' : 'text-slate-400 dark:text-slate-500'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 px-1.5 py-0.5 text-[9px] font-bold font-mono rounded-full border ${
                    isActive
                      ? 'bg-slate-800 dark:bg-slate-200 text-cyan-300 dark:text-cyan-800 border-slate-700 dark:border-slate-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

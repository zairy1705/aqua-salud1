import React from 'react';
import { Droplets, Calculator, Eye, Database, ClipboardList, BookOpen, PlusCircle, RotateCcw } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'dosage' | 'photometer' | 'systems' | 'logbook' | 'normative';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickDose: () => void;
  onOpenNewRecord: () => void;
  onResetToOriginal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickDose,
  onOpenNewRecord,
  onResetToOriginal,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Inicio', icon: Droplets },
    { id: 'dosage' as ActiveTab, label: 'Dosificación', icon: Calculator, badge: '7 PASOS' },
    { id: 'photometer' as ActiveTab, label: 'Fotómetro DPD', icon: Eye },
    { id: 'systems' as ActiveTab, label: 'Sistemas', icon: Database },
    { id: 'logbook' as ActiveTab, label: 'Bitácora', icon: ClipboardList },
    { id: 'normative' as ActiveTab, label: 'Normativa', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                  CLOR<span className="text-teal-600">AGUA</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                  D.S. 031
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Asistente de Dosificación y Vigilancia Sanitaria
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onResetToOriginal && (
              <button
                id="btn-reset-to-original"
                onClick={onResetToOriginal}
                title="Recuperar configuración y datos originales de Cloragua"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-teal-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-teal-600" />
                <span>Restaurar Datos</span>
              </button>
            )}

            <button
              id="btn-quick-sample"
              onClick={onOpenNewRecord}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Medición</span>
            </button>
            <button
              id="btn-quick-dose"
              onClick={onOpenQuickDose}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg shadow-sm shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <Calculator className="w-4 h-4" />
              <span>Calcular Dosis</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={`mob-${item.id}`}
                id={`mob-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

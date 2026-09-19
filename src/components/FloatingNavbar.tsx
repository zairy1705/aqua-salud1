import React, { useState, useEffect, useRef } from 'react';

export type TabType =
  | 'inicio'
  | 'dashboard'
  | 'territorio'
  | 'planes'
  | 'data'
  | 'ia'
  | 'crm'
  | 'jass'
  | 'lab'
  | 'metals'
  | 'risk'
  | 'alert'
  | 'dosis'
  | 'hud'
  | 'sistemas'
  | 'registro'
  | 'manuales';

interface FloatingNavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onReturnToPublic?: () => void;
  activeAlertCount?: number;
  systemCount?: number;
}

interface NavModule {
  id: TabType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  badge?: string;
  category: 'monitoreo' | 'laboratorio' | 'territorio' | 'inteligencia' | 'herramientas';
}

const ALL_MODULES: NavModule[] = [
  // Núcleo de Monitoreo de Sistemas de Agua
  {
    id: 'jass',
    label: 'AQUA-JASS',
    shortLabel: 'JASS Cloro',
    description: 'Vigilancia de cloro residual libre y registro rápido en campo',
    icon: 'water_drop',
    category: 'monitoreo',
  },
  {
    id: 'sistemas',
    label: 'Sistemas de Agua',
    shortLabel: 'Sistemas',
    description: 'Gestión y estado de reservorios y sistemas de agua ingresados',
    icon: 'water',
    category: 'monitoreo',
  },
  {
    id: 'alert',
    label: 'Alertas Sanitarias',
    shortLabel: 'Alertas',
    description: 'Desvíos de cloro y alertas operativas prioritarias',
    icon: 'notifications_active',
    category: 'monitoreo',
  },
  {
    id: 'dashboard',
    label: 'Dashboard General',
    shortLabel: 'Dashboard',
    description: 'Indicadores globales y resumen ejecutivo de cumplimiento',
    icon: 'monitoring',
    category: 'monitoreo',
  },

  // Calidad y Laboratorio
  {
    id: 'lab',
    label: 'AQUA-LAB',
    shortLabel: 'Laboratorio',
    description: 'Ensayos físico-químicos y microbiológicos (D.S. N.° 031-2010-SA)',
    icon: 'biotech',
    category: 'laboratorio',
  },
  {
    id: 'metals',
    label: 'Metales Pesados',
    shortLabel: 'Metales',
    description: 'Cuantificación por ICP-MS (Arsénico, Plomo, Mercurio, Cadmio)',
    icon: 'science',
    category: 'laboratorio',
  },
  {
    id: 'risk',
    label: 'Matriz de Riesgo',
    shortLabel: 'Riesgo',
    description: 'Evaluación epidemiológica y priorización de riesgo sanitario',
    icon: 'warning',
    badge: 'FASE 6',
    category: 'laboratorio',
  },

  // Territorio y Gestión
  {
    id: 'territorio',
    label: 'Territorio ATM',
    shortLabel: 'Territorio',
    description: 'Mapa cartográfico y distribución comunal de sistemas',
    icon: 'map',
    badge: 'FASE 7',
    category: 'territorio',
  },
  {
    id: 'planes',
    label: 'Planes de Acción',
    shortLabel: 'Planes',
    description: 'Planes de contingencia, mitigación y respuesta sanitaria',
    icon: 'assignment',
    badge: 'FASE 8',
    category: 'territorio',
  },
  {
    id: 'registro',
    label: 'Bitácora Oficial',
    shortLabel: 'Bitácora',
    description: 'Historial diario de desinfección y trazabilidad',
    icon: 'description',
    category: 'territorio',
  },

  // Inteligencia y Gestión
  {
    id: 'ia',
    label: 'AQUA-IA',
    shortLabel: 'AQUA-IA',
    description: 'Asistente técnico sanitario con inteligencia artificial',
    icon: 'smart_toy',
    badge: 'FASE 9',
    category: 'inteligencia',
  },
  {
    id: 'data',
    label: 'AQUA-DATA',
    shortLabel: 'Analítica',
    description: 'Reportes estadísticos, tendencias y exportación certificada',
    icon: 'analytics',
    badge: 'FASE 8',
    category: 'inteligencia',
  },
  {
    id: 'crm',
    label: 'AQUA-CRM',
    shortLabel: 'CRM',
    description: 'Gestión de cotizaciones, solicitudes y soporte técnico',
    icon: 'chat_bubble',
    badge: 'FASE 10',
    category: 'inteligencia',
  },

  // Herramientas de Campo
  {
    id: 'dosis',
    label: 'Calculadora de Dosis',
    shortLabel: 'Dosis',
    description: 'Cálculo estequiométrico de hipoclorito de calcio y solución madre',
    icon: 'calculate',
    category: 'herramientas',
  },
  {
    id: 'manuales',
    label: 'Manuales de Agua Segura',
    shortLabel: 'Manuales',
    description: 'Guías didácticas, DPD, cloración y descarga de instructivo PDF',
    icon: 'menu_book',
    category: 'herramientas',
  },
  {
    id: 'hud',
    label: 'Fotómetro Digital HUD',
    shortLabel: 'Fotómetro',
    description: 'Lectura colorimétrica DPD con escala digital en tiempo real',
    icon: 'grid_view',
    category: 'herramientas',
  },
];

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  currentTab,
  onTabChange,
  onReturnToPublic,
  activeAlertCount = 0,
  systemCount = 0,
}) => {
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aqua_salud_navbar_mode') === 'expanded';
    } catch {
      return false;
    }
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModulesMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleNavbarMode = () => {
    const nextMode = !isExpandedMode;
    setIsExpandedMode(nextMode);
    try {
      localStorage.setItem('aqua_salud_navbar_mode', nextMode ? 'expanded' : 'simplified');
    } catch {
      // ignore
    }
  };

  // Primary monitoring items for simplified view
  const primaryTabs: TabType[] = ['sistemas', 'jass', 'dosis', 'lab', 'manuales'];
  const isCurrentTabInPrimary = primaryTabs.includes(currentTab);

  // Active module information if current tab is a secondary module
  const currentSecondaryModule = ALL_MODULES.find((m) => m.id === currentTab);

  const handleSelectModule = (id: TabType) => {
    onTabChange(id);
    setIsModulesMenuOpen(false);
  };

  return (
    <>
      {/* Popover Menu: Más Módulos Especializados */}
      {isModulesMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            ref={menuRef}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-cyan-100 p-4 sm:p-6 mb-16 sm:mb-0 animate-in zoom-in-95 slide-in-from-bottom-6 duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00677d]/10 text-[#00677d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">apps</span>
                </div>
                <div>
                  <h3 className="font-hud font-black text-base sm:text-lg text-[#003440] leading-tight">
                    Módulos y Herramientas Especializadas
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accede a análisis de laboratorio, gestión territorial, IA y herramientas de campo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModulesMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar menú"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Content Categories */}
            <div className="mt-4 space-y-5">
              {/* Category 1: Laboratorio y Calidad */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-hud font-bold text-[#00677d] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base text-[#00b4d8]">science</span>
                  <span>Calidad de Agua & Laboratorio</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ALL_MODULES.filter((m) => m.category === 'laboratorio').map((m) => {
                    const isSelected = currentTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModule(m.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 group ${
                          isSelected
                            ? 'bg-[#00677d] text-white border-[#00677d] shadow-md'
                            : 'bg-slate-50 hover:bg-cyan-50/70 border-slate-200 hover:border-cyan-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl p-1.5 rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-100 text-[#00677d] group-hover:bg-[#00677d] group-hover:text-white transition-colors'
                          }`}
                        >
                          {m.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-hud font-bold text-xs leading-tight truncate">
                              {m.label}
                            </span>
                            {m.badge && (
                              <span
                                className={`text-[8px] font-black px-1 py-0.2 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-cyan-200 text-[#004e5f]'
                                }`}
                              >
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[10.5px] mt-0.5 line-clamp-2 ${
                              isSelected ? 'text-cyan-100' : 'text-slate-500'
                            }`}
                          >
                            {m.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Territorio y Planes */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-hud font-bold text-[#00677d] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base text-[#00b4d8]">map</span>
                  <span>Territorio ATM & Planes de Acción</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ALL_MODULES.filter((m) => m.category === 'territorio').map((m) => {
                    const isSelected = currentTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModule(m.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 group ${
                          isSelected
                            ? 'bg-[#00677d] text-white border-[#00677d] shadow-md'
                            : 'bg-slate-50 hover:bg-cyan-50/70 border-slate-200 hover:border-cyan-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl p-1.5 rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-100 text-[#00677d] group-hover:bg-[#00677d] group-hover:text-white transition-colors'
                          }`}
                        >
                          {m.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-hud font-bold text-xs leading-tight truncate">
                              {m.label}
                            </span>
                            {m.badge && (
                              <span
                                className={`text-[8px] font-black px-1 py-0.2 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-cyan-200 text-[#004e5f]'
                                }`}
                              >
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[10.5px] mt-0.5 line-clamp-2 ${
                              isSelected ? 'text-cyan-100' : 'text-slate-500'
                            }`}
                          >
                            {m.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 3: Inteligencia y Gestión */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-hud font-bold text-[#00677d] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base text-[#00b4d8]">psychology</span>
                  <span>Inteligencia & Gestión Sanitaria</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ALL_MODULES.filter((m) => m.category === 'inteligencia').map((m) => {
                    const isSelected = currentTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModule(m.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 group ${
                          isSelected
                            ? 'bg-[#00677d] text-white border-[#00677d] shadow-md'
                            : 'bg-slate-50 hover:bg-cyan-50/70 border-slate-200 hover:border-cyan-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl p-1.5 rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-100 text-[#00677d] group-hover:bg-[#00677d] group-hover:text-white transition-colors'
                          }`}
                        >
                          {m.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-hud font-bold text-xs leading-tight truncate">
                              {m.label}
                            </span>
                            {m.badge && (
                              <span
                                className={`text-[8px] font-black px-1 py-0.2 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-cyan-200 text-[#004e5f]'
                                }`}
                              >
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[10.5px] mt-0.5 line-clamp-2 ${
                              isSelected ? 'text-cyan-100' : 'text-slate-500'
                            }`}
                          >
                            {m.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 4: Herramientas de Campo */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-hud font-bold text-[#00677d] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base text-[#00b4d8]">handyman</span>
                  <span>Herramientas Técnicas de Campo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_MODULES.filter((m) => m.category === 'herramientas').map((m) => {
                    const isSelected = currentTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModule(m.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 group ${
                          isSelected
                            ? 'bg-[#00677d] text-white border-[#00677d] shadow-md'
                            : 'bg-slate-50 hover:bg-cyan-50/70 border-slate-200 hover:border-cyan-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl p-1.5 rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-100 text-[#00677d] group-hover:bg-[#00677d] group-hover:text-white transition-colors'
                          }`}
                        >
                          {m.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-hud font-bold text-xs leading-tight block">
                            {m.label}
                          </span>
                          <p
                            className={`text-[10.5px] mt-0.5 line-clamp-2 ${
                              isSelected ? 'text-cyan-100' : 'text-slate-500'
                            }`}
                          >
                            {m.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Options */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={toggleNavbarMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-slate-500">
                  {isExpandedMode ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>
                  {isExpandedMode
                    ? 'Modo: Barra Completa (16 botones)'
                    : 'Modo: Simplificado (5 botones recomendados)'}
                </span>
              </button>

              {onReturnToPublic && (
                <button
                  type="button"
                  onClick={() => {
                    setIsModulesMenuOpen(false);
                    onReturnToPublic();
                  }}
                  className="flex items-center gap-1.5 text-[#00677d] hover:text-[#004e5f] font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  <span>Ir al Portal Público AQUA-SALUD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none px-2 sm:px-4 mb-2 sm:mb-3">
        {isExpandedMode ? (
          /* MODO EXPANDIDO (para usuarios avanzados que deseen ver los 16 botones en línea) */
          <nav className="pointer-events-auto mx-auto max-w-4xl bg-white/95 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-6px_rgba(0,103,125,0.28)] border border-cyan-100 p-1 sm:p-1.5 flex items-center justify-start sm:justify-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none">
            {ALL_MODULES.map((item) => {
              const isSelected = currentTab === item.id;
              const isAlertTab = item.id === 'alert' && activeAlertCount > 0;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative shrink-0 min-w-[42px] sm:min-w-[48px] min-h-[42px] px-1.5 sm:px-2 py-1 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#00b4d8] to-[#009bb8] text-white shadow-[0_0_16px_1px_rgba(0,180,216,0.45)] scale-105'
                      : 'text-[#3d494d] hover:text-[#00677d] hover:bg-cyan-50 active:scale-95'
                  }`}
                  type="button"
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-[17px] sm:text-[19px]">{item.icon}</span>
                  <span className="font-hud text-[8px] sm:text-[9px] tracking-tight uppercase font-bold whitespace-nowrap">
                    {item.shortLabel}
                  </span>
                  {item.id === 'alert' && activeAlertCount > 0 && !isSelected && (
                    <span className="absolute -top-0.5 right-0.5 px-1 min-w-[15px] h-[15px] rounded-full text-[8.5px] font-hud font-black flex items-center justify-center bg-rose-500 text-white animate-bounce shadow-[0_0_6px_rgba(244,63,94,0.6)]">
                      {activeAlertCount}
                    </span>
                  )}
                  {item.badge && item.id !== 'alert' && !isSelected && (
                    <span className="absolute -top-0.5 right-0.5 px-1 min-w-[15px] h-[15px] rounded-full text-[8px] font-hud font-bold flex items-center justify-center bg-[#10e7b2] text-[#002b1f]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={toggleNavbarMode}
              className="shrink-0 min-w-[36px] min-h-[36px] rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Volver al modo simplificado de monitoreo"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">unfold_less</span>
            </button>
          </nav>
        ) : (
          /* MODO SIMPLIFICADO Y AMIGABLE (Los 4 Módulos Solicitados por el Usuario) */
          <nav className="pointer-events-auto mx-auto max-w-lg sm:max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-[0_12px_32px_-6px_rgba(0,103,125,0.28)] border border-cyan-100 p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-1.5">
            {/* 1. Monitoreo de Sistemas de Agua */}
            <button
              type="button"
              onClick={() => onTabChange('sistemas')}
              className={`relative flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                currentTab === 'sistemas' || currentTab === 'jass'
                  ? 'bg-gradient-to-r from-[#00677d] to-[#009bb8] text-white shadow-[0_4px_14px_rgba(0,103,125,0.35)] scale-[1.02]'
                  : 'text-slate-700 hover:text-[#00677d] hover:bg-cyan-50/80 active:scale-95'
              }`}
              title="Monitorear Sistemas de Agua Ingresados"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[21px]">water_drop</span>
              <span className="font-hud text-[9px] sm:text-[9.5px] font-bold uppercase tracking-tight mt-0.5 whitespace-nowrap">
                Sistemas
              </span>
              {systemCount > 0 && currentTab !== 'sistemas' && currentTab !== 'jass' && (
                <span className="absolute top-0.5 right-1 sm:right-2 px-1 min-w-[15px] h-[15px] rounded-full text-[8.5px] font-hud font-bold flex items-center justify-center bg-cyan-100 text-[#00677d] border border-cyan-300">
                  {systemCount}
                </span>
              )}
            </button>

            {/* 2. Dosificación de Cloro */}
            <button
              type="button"
              onClick={() => onTabChange('dosis')}
              className={`flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                currentTab === 'dosis'
                  ? 'bg-gradient-to-r from-[#00677d] to-[#009bb8] text-white shadow-[0_4px_14px_rgba(0,103,125,0.35)] scale-[1.02]'
                  : 'text-slate-700 hover:text-[#00677d] hover:bg-cyan-50/80 active:scale-95'
              }`}
              title="Módulo para dosificar el cloro"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[21px]">calculate</span>
              <span className="font-hud text-[9px] sm:text-[9.5px] font-bold uppercase tracking-tight mt-0.5 whitespace-nowrap">
                Dosificar
              </span>
            </button>

            {/* 3. Resultados de Laboratorio */}
            <button
              type="button"
              onClick={() => onTabChange('lab')}
              className={`flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                currentTab === 'lab'
                  ? 'bg-gradient-to-r from-[#00677d] to-[#009bb8] text-white shadow-[0_4px_14px_rgba(0,103,125,0.35)] scale-[1.02]'
                  : 'text-slate-700 hover:text-[#00677d] hover:bg-cyan-50/80 active:scale-95'
              }`}
              title="Ingresar y consultar resultados de laboratorio de sistemas de agua"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[21px]">science</span>
              <span className="font-hud text-[9px] sm:text-[9.5px] font-bold uppercase tracking-tight mt-0.5 whitespace-nowrap">
                Laboratorio
              </span>
            </button>

            {/* 4. Manuales de Agua Segura */}
            <button
              type="button"
              onClick={() => onTabChange('manuales')}
              className={`flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                currentTab === 'manuales'
                  ? 'bg-gradient-to-r from-[#00677d] to-[#009bb8] text-white shadow-[0_4px_14px_rgba(0,103,125,0.35)] scale-[1.02]'
                  : 'text-slate-700 hover:text-[#00677d] hover:bg-cyan-50/80 active:scale-95'
              }`}
              title="Manuales de ayuda para un consumo de agua segura"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[21px]">menu_book</span>
              <span className="font-hud text-[9px] sm:text-[9.5px] font-bold uppercase tracking-tight mt-0.5 whitespace-nowrap">
                Manuales
              </span>
            </button>

            {/* 5. Más Módulos / Active Secondary Module */}
            <button
              type="button"
              onClick={() => setIsModulesMenuOpen(!isModulesMenuOpen)}
              className={`relative flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer border ${
                !isCurrentTabInPrimary
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-500 shadow-[0_4px_14px_rgba(0,155,184,0.35)] scale-[1.02]'
                  : isModulesMenuOpen
                  ? 'bg-cyan-50 text-[#00677d] border-[#00b4d8]'
                  : 'border-slate-200/80 bg-slate-50/90 text-slate-700 hover:text-[#00677d] hover:bg-cyan-50 active:scale-95'
              }`}
              title="Ver más herramientas y módulos (Dashboard, Alertas, Territorio)"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[21px]">
                {!isCurrentTabInPrimary && currentSecondaryModule
                  ? currentSecondaryModule.icon
                  : 'apps'}
              </span>
              <span className="font-hud text-[9px] sm:text-[9.5px] font-bold uppercase tracking-tight mt-0.5 flex items-center gap-0.5 whitespace-nowrap">
                {!isCurrentTabInPrimary && currentSecondaryModule
                  ? currentSecondaryModule.shortLabel
                  : 'Más'}
                <span className="material-symbols-outlined text-[10px] leading-none">
                  {isModulesMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </span>
              {!isCurrentTabInPrimary && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10e7b2] ring-2 ring-white" />
              )}
            </button>
          </nav>
        )}
      </div>
    </>
  );
};

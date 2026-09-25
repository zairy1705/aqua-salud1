import React from 'react';

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
  // Hoja Principal
  {
    id: 'inicio',
    label: 'AQUA-SALUD (Hoja Principal)',
    shortLabel: 'Inicio',
    description: 'Portada científica, accesos rápidos y centro de mando institucional',
    icon: 'home',
    badge: 'PRINCIPAL',
    category: 'monitoreo',
  },
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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none px-2 sm:px-4 mb-2 sm:mb-3">
      <nav className="pointer-events-auto mx-auto max-w-md sm:max-w-xl glass-title-panel rounded-2xl sm:rounded-full p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-2">
        {/* 0. Hoja Principal AQUA-SALUD */}
        <button
          type="button"
          onClick={() => onTabChange('inicio')}
          className={`relative flex-1 min-h-[46px] sm:min-h-[48px] px-1.5 sm:px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            currentTab === 'inicio'
              ? 'glass-option-btn-primary scale-[1.02]'
              : 'glass-option-btn'
          }`}
          title="Hoja Principal de AQUA SALUD"
        >
          <span className="material-symbols-outlined text-[19px] sm:text-[21px]">home</span>
          <span className="font-hud text-[9px] sm:text-[9.5px] font-black uppercase tracking-tight mt-0.5 whitespace-nowrap">
            INICIO
          </span>
        </button>

        {/* 1. Monitoreo de Sistemas de Agua */}
        <button
          type="button"
          onClick={() => onTabChange('sistemas')}
          className={`relative flex-1 min-h-[46px] sm:min-h-[48px] px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            currentTab === 'sistemas' || currentTab === 'jass'
              ? 'glass-option-btn-primary scale-[1.02]'
              : 'glass-option-btn'
          }`}
          title="Monitorear Sistemas de Agua Ingresados"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">water_drop</span>
          <span className="font-hud text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight mt-0.5 whitespace-nowrap">
            SISTEMAS
          </span>
          {systemCount > 0 && currentTab !== 'sistemas' && currentTab !== 'jass' && (
            <span className="absolute top-0.5 right-2 px-1 min-w-[15px] h-[15px] rounded-full text-[8.5px] font-hud font-bold flex items-center justify-center bg-cyan-100 text-[#00677d] border border-cyan-300">
              {systemCount}
            </span>
          )}
        </button>

        {/* 2. Dosificación de Cloro */}
        <button
          type="button"
          onClick={() => onTabChange('dosis')}
          className={`flex-1 min-h-[46px] sm:min-h-[48px] px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            currentTab === 'dosis'
              ? 'glass-option-btn-primary scale-[1.02]'
              : 'glass-option-btn'
          }`}
          title="Módulo para dosificar el cloro"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">calculate</span>
          <span className="font-hud text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight mt-0.5 whitespace-nowrap">
            DOSIFICAR
          </span>
        </button>

        {/* 3. Resultados de Laboratorio */}
        <button
          type="button"
          onClick={() => onTabChange('lab')}
          className={`flex-1 min-h-[46px] sm:min-h-[48px] px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            currentTab === 'lab'
              ? 'glass-option-btn-primary scale-[1.02]'
              : 'glass-option-btn'
          }`}
          title="Ingresar y consultar resultados de laboratorio de sistemas de agua"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">science</span>
          <span className="font-hud text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight mt-0.5 whitespace-nowrap">
            LABORATORIO
          </span>
        </button>

        {/* 4. Manuales de Agua Segura */}
        <button
          type="button"
          onClick={() => onTabChange('manuales')}
          className={`flex-1 min-h-[46px] sm:min-h-[48px] px-2 py-1 rounded-xl sm:rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            currentTab === 'manuales'
              ? 'glass-option-btn-primary scale-[1.02]'
              : 'glass-option-btn'
          }`}
          title="Manuales de ayuda para un consumo de agua segura"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">menu_book</span>
          <span className="font-hud text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight mt-0.5 whitespace-nowrap">
            MANUALES
          </span>
        </button>
      </nav>
    </div>
  );
};

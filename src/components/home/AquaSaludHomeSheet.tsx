import React, { useState, useRef } from 'react';
import { WaterSystem, OperatorProfile, SamplingRecord } from '../../types';
import { TabType } from '../FloatingNavbar';
import { OperatorProfileBanner } from '../OperatorProfileBanner';
import { PriorityReservoirsSection } from '../PriorityReservoirsSection';
import { AuxiliaryToolsSection } from '../AuxiliaryToolsSection';

interface AquaSaludHomeSheetProps {
  systems: WaterSystem[];
  records?: SamplingRecord[];
  activeProfile: OperatorProfile;
  activeAlertCount?: number;
  onNavigateTab: (tab: TabType) => void;
  onNavigatePublicSection?: (section: any) => void;
  onOpenDpdCamera: () => void;
  onOpenSolutionPrep: () => void;
  onOpenCalibrate: () => void;
  onOpenNormative: () => void;
  onOpenVolumeCalc?: () => void;
  onOpenRegisterProfile: () => void;
  onOpenSwitchAccount: () => void;
  onSelectSystemForDosage: (systemId: string) => void;
  onOpenUserManual?: () => void;
  onOpenQuoteModal?: () => void;
}

export const AquaSaludHomeSheet: React.FC<AquaSaludHomeSheetProps> = ({
  systems,
  activeProfile,
  activeAlertCount = 0,
  onNavigateTab,
  onNavigatePublicSection,
  onOpenDpdCamera,
  onOpenSolutionPrep,
  onOpenCalibrate,
  onOpenNormative,
  onOpenVolumeCalc,
  onOpenRegisterProfile,
  onOpenSwitchAccount,
  onSelectSystemForDosage,
  onOpenUserManual,
  onOpenQuoteModal,
}) => {
  // Video and tips drawer state (preserves full video capabilities)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [adviceIndex, setAdviceIndex] = useState(0);
  const [isAdviceOpen, setIsAdviceOpen] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const adviceSteps = [
    {
      tag: 'PASO 1 • SEGURIDAD',
      speech: 'Antes de manipular hipoclorito de calcio, utiliza siempre guantes de nitrilo, mascarilla para polvo y gafas de seguridad.',
      actionLabel: 'Ver Manual',
      action: onOpenUserManual,
    },
    {
      tag: 'PASO 2 • CLORO RESIDUAL',
      speech: 'La norma peruana D.S. N.° 031-2010-SA exige cloro residual libre entre 0.5 y 2.0 mg/L en todo punto de la red.',
      actionLabel: 'Ver Norma',
      action: onOpenNormative,
    },
    {
      tag: 'PASO 3 • FOTOMETRÍA DPD',
      speech: 'Mide con tableta DPD N.° 1 fotométrico en la red de distribución. Usa la cámara de bio-telemetría si tienes dudas de color.',
      actionLabel: 'Cámara DPD',
      action: onOpenDpdCamera,
    },
    {
      tag: 'PASO 4 • DOSIFICACIÓN',
      speech: 'Calcula los gramos exactos según el volumen del reservorio y la concentración de tu producto (65% o 70%).',
      actionLabel: 'Calcular Dosis',
      tab: 'dosis' as TabType,
    },
  ];

  const currentAdvice = adviceSteps[adviceIndex];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto gap-6 pb-28 pt-1">
      {/* =========================================================================
          SECCIÓN HERO PRINCIPAL DE AQUA SALUD (HOJA PRINCIPAL)
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f0f9ff] via-[#e6f4f8] to-[#f8fafc] text-slate-900 border border-cyan-200/80 shadow-[0_12px_40px_rgba(0,103,125,0.08)]">
        {/* Luces sutiles y mallas de fondo */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-sky-100/70 blur-3xl" />

          <svg
            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveCyanHomeSheet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0077b6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M-100,450 C300,200 600,600 1000,320 C1250,150 1400,400 1600,300"
              fill="none"
              stroke="url(#waveCyanHomeSheet)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <path
              d="M-50,480 C320,240 620,630 1020,350 C1270,180 1420,430 1620,330"
              fill="none"
              stroke="url(#waveCyanHomeSheet)"
              strokeWidth="1.2"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Contenido Central del Hero */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-14 relative z-10">
          <div className="text-center space-y-5 flex flex-col items-center">
            {/* Badge Superior Oficial */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-200 shadow-sm text-[#005f73] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[17px] text-[#0077b6]">security</span>
                <span>PLATAFORMA CIENTÍFICA & TECNOLÓGICA</span>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              </div>
            </div>

            {/* Subtítulo: CIENCIA · AQUA · SALUD */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-0.5 w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#00b4d8] inline-block rounded-full" />
              <span className="font-hud font-extrabold text-[12px] sm:text-[14px] tracking-[0.24em] text-[#0077b6] uppercase">
                CIENCIA · AQUA · SALUD
              </span>
              <span className="h-0.5 w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#10b981] inline-block rounded-full" />
            </div>

            {/* Título Gigante Oficial: AQUA SALUD */}
            <h1 className="font-hud font-black text-[46px] sm:text-[64px] lg:text-[76px] leading-[0.95] tracking-tight">
              <span className="text-[#0077b6]">AQUA </span>
              <span className="text-[#059669]">SALUD</span>
            </h1>

            {/* Titular descriptivo */}
            <h2 className="font-hud font-bold text-[22px] sm:text-[28px] lg:text-[34px] text-slate-900 tracking-tight leading-snug max-w-3xl">
              Tecnología para garantizar agua segura
            </h2>

            {/* Párrafo explicativo */}
            <p className="text-[14.5px] sm:text-[16px] text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Soluciones digitales, análisis y herramientas inteligentes para la gestión integral de la calidad del agua, conectando operadores rurales, laboratorios analíticos y gobiernos locales.
            </p>

            {/* Tres Botones de Acción Oficiales */}
            <div className="flex flex-col items-center gap-3.5 pt-3 max-w-2xl mx-auto w-full">
              {/* Fila 1: Dos botones */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
                {/* Botón 1: Verde CALCULAR CLORACIÓN (CLORAGUA) */}
                <button
                  type="button"
                  onClick={() => onNavigateTab('dosis')}
                  className="px-5 sm:px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-hud text-[11.5px] sm:text-[12.5px] font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(5,150,105,0.28)] hover:shadow-[0_10px_25px_rgba(4,120,87,0.38)] active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">calculate</span>
                  <span>CALCULAR CLORACIÓN (CLORAGUA)</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>

                {/* Botón 2: Blanco con borde EXPLORAR SERVICIOS */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigatePublicSection) {
                      onNavigatePublicSection('servicios');
                    } else {
                      onNavigateTab('lab');
                    }
                  }}
                  className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white hover:bg-cyan-50/80 text-[#004e60] border-2 border-cyan-300 font-hud text-[11.5px] sm:text-[12.5px] font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px] text-[#0077b6]">science</span>
                  <span>EXPLORAR SERVICIOS</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>
              </div>

              {/* Fila 2: Botón 3 azul institucional centrado abajo */}
              <button
                type="button"
                onClick={() => onNavigateTab('sistemas')}
                className="px-8 py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-hud text-[11.5px] sm:text-[12px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(2,132,199,0.25)] hover:shadow-[0_10px_25px_rgba(3,105,161,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-cyan-100">lock</span>
                <span>INGRESAR A LA PLATAFORMA</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </div>

            {/* Tres Tarjetas Blancas Destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 w-full max-w-3xl mx-auto">
              <button
                type="button"
                onClick={() => onNavigateTab('sistemas')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 border border-cyan-200/80 shadow-xs hover:shadow-sm transition-all hover:translate-y-[-2px] cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#0077b6] flex items-center justify-center shrink-0 border border-cyan-100">
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                </div>
                <div>
                  <span className="text-[12.5px] font-bold text-slate-800 leading-tight block">
                    Agua segura para comunidades
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">Red de {systems.length} sistemas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('lab')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 border border-cyan-200/80 shadow-xs hover:shadow-sm transition-all hover:translate-y-[-2px] cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center shrink-0 border border-sky-100">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div>
                  <span className="text-[12.5px] font-bold text-slate-800 leading-tight block">
                    Ciencia y tecnología al servicio
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">Ensayos & Trazabilidad</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('manuales')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 border border-cyan-200/80 shadow-xs hover:shadow-sm transition-all hover:translate-y-[-2px] cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
                  <span className="material-symbols-outlined text-[20px]">eco</span>
                </div>
                <div>
                  <span className="text-[12.5px] font-bold text-slate-800 leading-tight block">
                    Futuro hídrico sostenible
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">Manuales & Guías DPD</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BANNER DEL OPERADOR ACTIVO Y PERFILES
          ========================================================================= */}
      <OperatorProfileBanner
        profile={activeProfile}
        onOpenRegisterProfile={onOpenRegisterProfile}
        onOpenSwitchAccount={onOpenSwitchAccount}
      />

      {/* =========================================================================
          PANEL DE ACCESO RÁPIDO A MÓDULOS DE CONTROL (CENTRO DE MANDO)
          ========================================================================= */}
      <section className="bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-cyan-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#0077b6]">grid_view</span>
              <h3 className="font-hud font-extrabold text-[18px] text-[#063B4A] tracking-tight">
                Centro de Operaciones y Módulos
              </h3>
            </div>
            <p className="text-[12px] text-slate-600 mt-0.5">
              Acceso directo a las herramientas de campo, laboratorio y supervisión de AQUA-SALUD
            </p>
          </div>

          {activeAlertCount > 0 && (
            <button
              onClick={() => onNavigateTab('alert')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-hud text-[11px] font-bold cursor-pointer hover:bg-rose-100 transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-600 animate-pulse">
                notifications_active
              </span>
              <span>{activeAlertCount} Alertas Sanitarias Pendientes</span>
            </button>
          )}
        </div>

        {/* Tarjetas de Navegación de Módulos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* 1. Vigilancia JASS */}
          <button
            type="button"
            onClick={() => onNavigateTab('sistemas')}
            className="p-3.5 rounded-2xl bg-cyan-50/60 hover:bg-cyan-100/70 border border-cyan-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-[#0077b6]">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-cyan-800 bg-cyan-200/60 px-2 py-0.5 rounded-full">
                {systems.length} SISTEMAS
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-[#063B4A] group-hover:text-[#0077b6]">
                AQUA-JASS
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Monitoreo de cloro en reservorios
              </div>
            </div>
          </button>

          {/* 2. Dosificación */}
          <button
            type="button"
            onClick={() => onNavigateTab('dosis')}
            className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-emerald-700">
                <span className="material-symbols-outlined text-[18px]">calculate</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                DOSIFICAR
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-emerald-950 group-hover:text-emerald-700">
                Calculadora Cloragua
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Hipoclorito de calcio 65% / 70%
              </div>
            </div>
          </button>

          {/* 3. Laboratorio */}
          <button
            type="button"
            onClick={() => onNavigateTab('lab')}
            className="p-3.5 rounded-2xl bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-sky-700">
                <span className="material-symbols-outlined text-[18px]">science</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded-full">
                ENSAYOS
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-sky-950 group-hover:text-sky-700">
                AQUA-LAB
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Físico-químicos y microbiología
              </div>
            </div>
          </button>

          {/* 4. Manuales */}
          <button
            type="button"
            onClick={() => onNavigateTab('manuales')}
            className="p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-amber-700">
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                DIDÁCTICO
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-amber-950 group-hover:text-amber-700">
                Manuales de Agua
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Guías de cloración y cartillas DPD
              </div>
            </div>
          </button>

          {/* 5. Dashboard Territorial */}
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#063B4A] text-white flex items-center justify-center shadow-2xs group-hover:bg-[#0077b6]">
                <span className="material-symbols-outlined text-[18px]">monitoring</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-full">
                EJECUTIVO
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-[#063B4A] group-hover:text-[#0077b6]">
                Dashboard General
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Indicadores y cumplimiento ATM
              </div>
            </div>
          </button>

          {/* 6. Territorio GIS */}
          <button
            type="button"
            onClick={() => onNavigateTab('territorio')}
            className="p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-teal-700">
                <span className="material-symbols-outlined text-[18px]">map</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-full">
                MAPA GIS
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-teal-950 group-hover:text-teal-700">
                AQUA-TERRITORIO
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Cartografía y redes comunales
              </div>
            </div>
          </button>

          {/* 7. AQUA-IA */}
          <button
            type="button"
            onClick={() => onNavigateTab('ia')}
            className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-purple-700">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-purple-800 bg-purple-200/60 px-2 py-0.5 rounded-full">
                INTELIGENCIA
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-purple-950 group-hover:text-purple-700">
                AQUA-IA
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Asistente normativo inteligente
              </div>
            </div>
          </button>

          {/* 8. Cotizaciones CRM */}
          <button
            type="button"
            onClick={() => onNavigateTab('crm')}
            className="p-3.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-200/70 text-left transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between min-h-[110px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs group-hover:bg-indigo-700">
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              </div>
              <span className="text-[10px] font-hud font-bold text-indigo-800 bg-indigo-200/60 px-2 py-0.5 rounded-full">
                SOPORTE
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-[13px] text-indigo-950 group-hover:text-indigo-700">
                AQUA-CRM
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1">
                Cotizaciones & Asesoría técnica
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SISTEMAS Y RESERVORIOS PRIORITARIOS
          ========================================================================= */}
      <PriorityReservoirsSection
        systems={systems}
        onSelectSystemForDosage={onSelectSystemForDosage}
        onNavigateSystems={() => onNavigateTab('sistemas')}
      />

      {/* =========================================================================
          HERRAMIENTAS AUXILIARES DE CAMPO
          ========================================================================= */}
      <AuxiliaryToolsSection
        onOpenDpdCamera={onOpenDpdCamera}
        onOpenSolutionPrep={onOpenSolutionPrep}
        onOpenCalibrate={onOpenCalibrate}
        onOpenNormative={onOpenNormative}
        onOpenVolumeCalc={onOpenVolumeCalc || onOpenSolutionPrep}
      />

      {/* =========================================================================
          SECCIÓN COLAPSABLE: VIDEO EDUCATIVO Y CONSEJOS CIENTÍFICOS CLORAGUA
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-cyan-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#063B4A] text-[#10e7b2] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">play_circle</span>
          </div>
          <div>
            <span className="font-hud font-bold text-[13.5px] text-[#063B4A] block">
              Video Animado & Consejos de la Científica Cloragua
            </span>
            <span className="text-[11.5px] text-slate-600">
              Aprende el protocolo de cloración segura con consejos paso a paso
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVideoModalOpen(!isVideoModalOpen)}
          className="px-4 py-2 rounded-xl bg-[#00677d] hover:bg-[#005264] text-white font-hud text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[17px]">
            {isVideoModalOpen ? 'visibility_off' : 'smart_display'}
          </span>
          <span>{isVideoModalOpen ? 'Ocultar Video' : 'Ver Video y Consejos'}</span>
        </button>
      </div>

      {/* Modal / Acordeón Desplegable del Video */}
      {isVideoModalOpen && (
        <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-cyan-400/40 bg-[#00141a] text-white animate-in fade-in duration-200">
          <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center bg-[#00141a]">
            <video
              ref={videoRef}
              src="/cloragua_scientist_animated.mp4"
              poster="/cloragua_scientist_animated_poster.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover object-center block"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Scientist Advice Floating Popover */}
            {isAdviceOpen && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 max-w-[290px] sm:max-w-xs bg-[#001f27]/90 backdrop-blur-md rounded-2xl border border-cyan-400/40 p-3 shadow-xl text-white animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/30 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#10e7b2] text-[16px]">
                      science
                    </span>
                    <span className="font-hud text-[11px] font-extrabold uppercase text-[#10e7b2]">
                      {currentAdvice.tag}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAdviceOpen(false)}
                    className="text-cyan-300 hover:text-white transition-colors cursor-pointer"
                    title="Ocultar consejos"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <p className="text-[11px] sm:text-[11.5px] leading-relaxed text-cyan-100/90 mb-3">
                  {currentAdvice.speech}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20">
                  <div className="flex items-center gap-1 text-[10px] text-cyan-300/80 font-hud">
                    <span>
                      {adviceIndex + 1}/{adviceSteps.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentAdvice.action ? (
                      <button
                        onClick={currentAdvice.action}
                        className="px-2.5 py-1 rounded-full bg-[#10e7b2] hover:bg-[#00d4a0] text-[#002116] font-hud text-[10px] font-bold uppercase transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        {currentAdvice.actionLabel}
                      </button>
                    ) : currentAdvice.tab ? (
                      <button
                        onClick={() => onNavigateTab(currentAdvice.tab!)}
                        className="px-2.5 py-1 rounded-full bg-[#10e7b2] hover:bg-[#00d4a0] text-[#002116] font-hud text-[10px] font-bold uppercase transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        {currentAdvice.actionLabel}
                      </button>
                    ) : null}
                    <button
                      onClick={() => setAdviceIndex((prev) => (prev + 1) % adviceSteps.length)}
                      className="px-2 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/30 text-cyan-200 font-hud text-[10px] font-semibold transition-all cursor-pointer active:scale-95"
                    >
                      Siguiente ▶
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isAdviceOpen && (
              <button
                type="button"
                onClick={() => setIsAdviceOpen(true)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00212b]/95 hover:bg-[#002f3d] backdrop-blur-md border border-cyan-400/50 text-[#10e7b2] font-hud text-[11px] font-extrabold uppercase shadow-lg transition-all active:scale-95 cursor-pointer"
                title="Abrir presentación y consejos de la Científica"
              >
                <span className="material-symbols-outlined text-[15px] text-[#10e7b2]">science</span>
                <span>Consejos Científica</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10e7b2] animate-pulse" />
              </button>
            )}

            {/* Video Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#001f27]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/30 shadow-lg z-10">
              <button
                type="button"
                onClick={togglePlay}
                className="text-cyan-300 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pausar Video' : 'Reproducir Video'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="text-cyan-300 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

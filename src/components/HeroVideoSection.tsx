import React, { useState, useRef } from 'react';
import { WaterSystem, OperatorProfile } from '../types';
import { TabType } from './FloatingNavbar';
import { OperatorProfileBanner } from './OperatorProfileBanner';
import { AuxiliaryToolsSection } from './AuxiliaryToolsSection';
import { PriorityReservoirsSection } from './PriorityReservoirsSection';
import { ModuleCardWithVideo } from './ModuleCardWithVideo';

interface HeroVideoSectionProps {
  systems: WaterSystem[];
  activeProfile: OperatorProfile;
  onNavigateTab: (tab: TabType) => void;
  onOpenDpdCamera: () => void;
  onOpenSolutionPrep: () => void;
  onOpenCalibrate: () => void;
  onOpenNormative: () => void;
  onOpenRegisterProfile: () => void;
  onOpenSwitchAccount: () => void;
  onSelectSystemForDosage: (systemId: string) => void;
  onOpenUserManual?: () => void;
}

export const HeroVideoSection: React.FC<HeroVideoSectionProps> = ({
  systems,
  activeProfile,
  onNavigateTab,
  onOpenDpdCamera,
  onOpenSolutionPrep,
  onOpenCalibrate,
  onOpenNormative,
  onOpenRegisterProfile,
  onOpenSwitchAccount,
  onSelectSystemForDosage,
  onOpenUserManual,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isAdviceOpen, setIsAdviceOpen] = useState(true);
  const [adviceIndex, setAdviceIndex] = useState(0);

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
      tag: 'Presentación Oficial',
      speech:
        '«¡Hola! Soy la Científica CLORAGUA, tu asistente técnica y guardiana del agua. Te acompaño paso a paso en el cálculo de dosis de hipoclorito, calibración de equipos y vigilancia de cloro libre residual (0.50 a 2.00 ppm) según la norma D.S. 031-2010-SA.»',
      actionLabel: 'Ver Consejos',
    },
    {
      tag: 'Consejo 1: Registro de Tanque',
      speech:
        '«En la pestaña "Sistemas" puedes registrar tus reservorios, captaciones o tanques comunitarios con sus dimensiones en metros o volumen en litros para tener los cálculos listos.»',
      actionLabel: 'Ver Sistemas',
      tab: 'sistemas' as TabType,
    },
    {
      tag: 'Consejo 2: Dosificación Exacta',
      speech:
        '«En "Dosificación" calculas los gramos exactos de hipoclorito de calcio (al 65% o 70%) o solución líquida. Evitas la sub-cloración bacteriana y el exceso organoléptico.»',
      actionLabel: 'Calcular Dosis',
      tab: 'dosis' as TabType,
    },
    {
      tag: 'Consejo 3: Escáner de Fotómetro',
      speech:
        '«¡Usa el botón "Escanear Fotómetro" o "Cámara DPD"! Al reaccionar tu muestra de agua con la pastilla DPD-1, la cámara escanea el tono rosado y valida si está en el rango seguro de 0.5 a 2.0 ppm.»',
      actionLabel: 'Abrir Cámara DPD',
      action: onOpenDpdCamera,
    },
    {
      tag: 'Consejo 4: Solución Madre y Gotero',
      speech:
        '«Usa el botón "Solución Madre" para calcular cuántos kilos de hipoclorito diluir en tu tanque de carga, y "Calibrar Gotero" para medir el caudal por goteo en mililitros o gotas por minuto.»',
      actionLabel: 'Solución Madre',
      action: onOpenSolutionPrep,
    },
  ];

  const currentAdvice = adviceSteps[adviceIndex];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto gap-6 pb-28 pt-1">
      {/* Operator Profile Banner (Registered Profile & Switch Account) */}
      <OperatorProfileBanner
        profile={activeProfile}
        onOpenRegisterProfile={onOpenRegisterProfile}
        onOpenSwitchAccount={onOpenSwitchAccount}
      />

      {/* Main Hero Card with Video */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,103,125,0.4)] border border-cyan-400/40 bg-[#00141a] text-white">
        {/* Video Player Container */}
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
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00212b]/95 hover:bg-[#002f3d] backdrop-blur-md border border-cyan-400/50 text-[#10e7b2] font-hud text-[11px] font-extrabold uppercase shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all active:scale-95 cursor-pointer"
              title="Abrir presentación y consejos de la Científica"
            >
              <span className="material-symbols-outlined text-[15px] text-[#10e7b2]">science</span>
              <span>Consejos Científica</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10e7b2] animate-pulse"></span>
            </button>
          )}

          {/* Top-Right Video Controls (Pause, Mute) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#001f27]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/30 shadow-lg z-10">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-[#10e7b2] transition-colors flex items-center justify-center cursor-pointer p-0.5"
              title={isPlaying ? 'Pausar video' : 'Reproducir video'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="w-[1px] h-3.5 bg-white/20" />

            <button
              type="button"
              onClick={toggleMute}
              className="text-white hover:text-[#10e7b2] transition-colors flex items-center justify-center cursor-pointer p-0.5"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Quick Access Navigation Action Buttons below video */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-[#001b22] border-t border-cyan-500/20">
          <button
            type="button"
            onClick={() => onNavigateTab('dosis')}
            className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#002833]/90 hover:bg-gradient-to-r hover:from-[#003d4c] hover:to-[#005a70] border border-cyan-500/30 hover:border-[#10e7b2]/70 hover:shadow-[0_4px_18px_rgba(0,180,216,0.3)] text-left transition-all duration-300 group cursor-pointer active:scale-95"
            title="Ir a Dosificación y Cloración Segura"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 group-hover:bg-[#10e7b2]/25 border border-cyan-400/40 group-hover:border-[#10e7b2] flex items-center justify-center text-[#10e7b2] shrink-0 group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-[11.5px] font-hud font-bold text-white group-hover:text-[#10e7b2] transition-colors truncate">
                Cloración Segura
              </div>
              <div className="text-[9.5px] text-cyan-300/80 group-hover:text-cyan-200 transition-colors truncate">Dosis D.S. 031-SA</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('sistemas')}
            className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#002833]/90 hover:bg-gradient-to-r hover:from-[#003d4c] hover:to-[#005a70] border border-cyan-500/30 hover:border-[#10e7b2]/70 hover:shadow-[0_4px_18px_rgba(0,180,216,0.3)] text-left transition-all duration-300 group cursor-pointer active:scale-95"
            title="Ir a Red de Sistemas Comunitarios"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 group-hover:bg-[#10e7b2]/25 border border-cyan-400/40 group-hover:border-[#10e7b2] flex items-center justify-center text-[#10e7b2] shrink-0 group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-[11.5px] font-hud font-bold text-white group-hover:text-[#10e7b2] transition-colors truncate">
                Comunidades
              </div>
              <div className="text-[9.5px] text-cyan-300/80 group-hover:text-cyan-200 transition-colors truncate">Red de Reservorios</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('hud')}
            className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#002833]/90 hover:bg-gradient-to-r hover:from-[#003d4c] hover:to-[#005a70] border border-cyan-500/30 hover:border-[#10e7b2]/70 hover:shadow-[0_4px_18px_rgba(0,180,216,0.3)] text-left transition-all duration-300 group cursor-pointer active:scale-95"
            title="Ir a Bio-Telemetría y Calidad del Agua"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 group-hover:bg-[#10e7b2]/25 border border-cyan-400/40 group-hover:border-[#10e7b2] flex items-center justify-center text-[#10e7b2] shrink-0 group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-[11.5px] font-hud font-bold text-white group-hover:text-[#10e7b2] transition-colors truncate">
                Calidad del Agua
              </div>
              <div className="text-[9.5px] text-cyan-300/80 group-hover:text-cyan-200 transition-colors truncate">0.50 - 2.00 PPM</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('registro')}
            className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#002833]/90 hover:bg-gradient-to-r hover:from-[#003d4c] hover:to-[#005a70] border border-cyan-500/30 hover:border-[#10e7b2]/70 hover:shadow-[0_4px_18px_rgba(0,180,216,0.3)] text-left transition-all duration-300 group cursor-pointer active:scale-95"
            title="Ir a Bitácora Oficial y Futuro Sostenible"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 group-hover:bg-[#10e7b2]/25 border border-cyan-400/40 group-hover:border-[#10e7b2] flex items-center justify-center text-[#10e7b2] shrink-0 group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-[18px]">eco</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-[11.5px] font-hud font-bold text-white group-hover:text-[#10e7b2] transition-colors truncate">
                Futuro Sostenible
              </div>
              <div className="text-[9.5px] text-cyan-300/80 group-hover:text-cyan-200 transition-colors truncate">Bitácora & Reportes</div>
            </div>
          </button>
        </div>

        {/* Banner with Title and Direct Action Launchers */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#002833] border-t border-cyan-500/30">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#002833] rounded-[10px] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-[#10e7b2]">
                      water_drop
                    </span>
                  </div>
                </div>
                <span className="text-[26px] sm:text-[30px] font-black tracking-tight text-white font-hud bg-gradient-to-r from-white via-cyan-100 to-[#10e7b2] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(0,180,216,0.6)]">
                  CLORAGUA
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#10e7b2]/20 border border-[#10e7b2]/60 text-[#10e7b2] font-hud text-[11px] font-extrabold uppercase tracking-wider">
                D.S. 031-2010-SA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 text-[10px] font-hud font-bold">
                Agua Segura para Comunidades
              </span>
            </div>
            <p className="text-[12px] sm:text-[12.5px] text-cyan-100/90 max-w-xl leading-relaxed">
              Plataforma oficial guiada para cálculo de volumen, dosificación teórica de hipoclorito, control fotométrico de cloro libre residual (0.5 a 2.0 ppm) y emisión de reportes técnicos oficiales.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-cyan-900/60 hover:bg-[#00b4d8] text-cyan-200 hover:text-white border border-cyan-400/40 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Dashboard Territorial de Vigilancia Sanitaria"
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigateTab('jass')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#10e7b2]/20 hover:bg-[#10e7b2] text-[#10e7b2] hover:text-[#002b1f] border border-[#10e7b2]/60 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Módulo de Vigilancia Comunitaria AQUA-JASS"
            >
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
              <span>AQUA-JASS</span>
            </button>
            <button
              onClick={() => onNavigateTab('territorio')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-teal-950/50 hover:bg-teal-600 text-teal-200 hover:text-white border border-teal-500/50 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Visualización Territorial y Cartografía GIS AQUA-TERRITORIO"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>AQUA-TERRITORIO</span>
            </button>
            <button
              onClick={() => onNavigateTab('lab')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-cyan-900/40 hover:bg-[#00677d] text-cyan-200 hover:text-white border border-cyan-400/40 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Módulo de Laboratorio AQUA-LAB"
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>AQUA-LAB</span>
            </button>
            <button
              onClick={() => onNavigateTab('risk')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-amber-950/40 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Matriz Sanitaria AQUA-RISK"
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>AQUA-RISK</span>
            </button>
            <button
              onClick={() => onNavigateTab('alert')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Sistema de Alertas Automáticas AQUA-ALERT"
            >
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>AQUA-ALERT</span>
            </button>
            <button
              onClick={onOpenDpdCamera}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-cyan-950/80 hover:bg-gradient-to-r hover:from-cyan-900 hover:to-teal-900 text-cyan-200 hover:text-white border border-cyan-400/50 hover:border-cyan-300 font-hud text-[12px] font-extrabold uppercase shadow-sm hover:shadow-[0_0_18px_rgba(0,180,216,0.4)] active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
              title="Abrir Cámara Escáner DPD"
            >
              <span className="material-symbols-outlined text-[18px] text-[#10e7b2] group-hover/btn:scale-110 transition-transform">
                photo_camera
              </span>
              <span>Escanear Fotómetro</span>
            </button>
            <button
              onClick={() => onNavigateTab('dosis')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002116] font-hud text-[12px] font-extrabold uppercase shadow-[0_4px_16px_rgba(0,180,216,0.35)] hover:shadow-[0_4px_22px_rgba(16,231,178,0.55)] active:scale-95 transition-all duration-300 cursor-pointer group/btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-0.5 transition-transform">play_arrow</span>
              <span>Calcular Dosis</span>
            </button>
            {onOpenUserManual && (
              <button
                onClick={onOpenUserManual}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-lime-500/20 to-emerald-500/20 hover:from-[#10e7b2] hover:to-[#caf300] text-cyan-100 hover:text-[#002116] border border-amber-400/50 hover:border-transparent font-hud text-[12px] font-extrabold uppercase shadow-sm hover:shadow-[0_4px_20px_rgba(16,231,178,0.4)] active:scale-95 transition-all duration-300 cursor-pointer group/btn"
                type="button"
                title="Abrir Instructivo Didáctico Oficial (Descargar en PDF)"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400 group-hover/btn:text-[#002116] group-hover/btn:scale-110 transition-transform">
                  menu_book
                </span>
                <span>Instructivo PDF</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3 Laboratorio & Operaciones Cards with Real Photos */}
      <section className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00b4d8] to-[#00677d] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <div>
              <h2 className="font-extrabold text-[16px] text-[#151d22] font-hud">
                Laboratorio & Operaciones de la Científica CLORAGUA
              </h2>
              <p className="text-[11.5px] text-[#3d494d]">
                Inspección fotométrica in situ, dosificación continua en reservorios y vigilancia sanitaria
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-cyan-100/70 text-[#00677d] font-hud text-[10px] font-extrabold uppercase tracking-wide">
            3 Módulos de Operación
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Control Fotométrico Digital (Análisis Colorimétrico) */}
          <ModuleCardWithVideo
            title="Control Fotométrico Digital"
            category="Análisis Colorimétrico"
            categoryIcon="biotech"
            badgeText="0.50 - 2.00 PPM"
            badgeClass="bg-gradient-to-r from-pink-500 to-rose-600"
            imageSrc="/cloragua_photometer_chemist.jpg"
            videoSrc="/cloragua_video_photometer.mp4"
            description="Lectura directa en pantalla de cloro libre residual (mg/L). Previene sub-cloración y exceso organoléptico en redes públicas."
            actionText="Escanear Muestra"
            actionIcon="photo_camera"
            onAction={onOpenDpdCamera}
          />

          {/* Card 2: Columna de Cloración Constante (Cámara de Carga y Goteo) */}
          <ModuleCardWithVideo
            title="Columna de Cloración Constante"
            category="Cámara de Carga y Goteo"
            categoryIcon="water"
            badgeText="DESINFECCIÓN CONTINUA"
            badgeClass="bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002116]"
            imageSrc="/cloragua_purification_column.jpg"
            videoSrc="/cloragua_video_column.mp4"
            description="Sistema dosificador por gravedad para reservorios apoyados y elevados. Calibra gotas/minuto según caudal de ingreso."
            actionText="Calibrar Gotero"
            actionIcon="tune"
            onAction={onOpenCalibrate}
          />

          {/* Card 3: Vigilancia Sanitaria Comunitaria (Salud Pública y JASS) */}
          <ModuleCardWithVideo
            title="Vigilancia Sanitaria Comunitaria"
            category="Salud Pública y JASS"
            categoryIcon="shield_person"
            badgeText="JASS / DIGESA"
            badgeClass="bg-gradient-to-r from-[#93b100] to-[#caf300] text-[#243000]"
            imageSrc="/cloragua_guardian_greeting.jpg"
            videoSrc="/cloragua_video_guardian.mp4"
            description="Registro diario e inspección en puntos críticos (salida de reservorio, primer predio y punto más alejado de la red)."
            actionText="Ver Bitácora Oficial"
            actionIcon="description"
            onAction={() => onNavigateTab('registro')}
          />
        </div>
      </section>

      {/* Herramientas Técnicas Auxiliares (Colocado por debajo de los 3 Módulos de Operación) */}
      <AuxiliaryToolsSection
        onOpenSolutionPrep={onOpenSolutionPrep}
        onOpenCalibrate={onOpenCalibrate}
        onOpenNormative={onOpenNormative}
        onOpenUserManual={onOpenUserManual}
      />

      {/* Reservorios con Prioridad de Atención (Colocado por debajo de las herramientas técnicas) */}
      <PriorityReservoirsSection
        systems={systems}
        onSelectSystemForDosage={onSelectSystemForDosage}
        onViewAllSystems={() => onNavigateTab('sistemas')}
        onAddNewSystem={() => onNavigateTab('sistemas')}
      />
    </div>
  );
};

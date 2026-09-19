import React from 'react';

interface AquaSaludHeroProps {
  onLearnMore: () => void;
  onOurServices: () => void;
  onEnterPlatform: () => void;
  onOpenDashboard?: () => void;
}

export const AquaSaludHero: React.FC<AquaSaludHeroProps> = ({
  onLearnMore,
  onOurServices,
  onEnterPlatform,
  onOpenDashboard,
}) => {
  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-100/50 via-teal-50/30 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Institutional Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00677d]/10 border border-[#00677d]/20 text-[#00677d] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-5 shadow-2xs">
          <span className="material-symbols-outlined text-[16px] text-[#00b4d8]">health_and_safety</span>
          <span>Plataforma Oficial de Vigilancia Sanitaria y Calidad Hídrica</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-hud font-extrabold text-[36px] sm:text-[54px] md:text-[62px] text-[#003440] leading-[1.08] tracking-tight mb-3">
          💧 AQUA-SALUD
        </h1>

        {/* Slogan */}
        <p className="font-hud text-[18px] sm:text-[24px] md:text-[28px] font-bold text-[#00677d] tracking-normal mb-5">
          "Del control del agua a la protección de la salud."
        </p>

        {/* Presentation Text */}
        <p className="text-[15px] sm:text-[17px] md:text-[18px] text-[#334155] max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
          Plataforma inteligente para la vigilancia, análisis y gestión territorial de la calidad del agua, conectando comunidades, JASS, laboratorios, autoridades e instituciones.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 mb-10 flex-wrap">
          <button
            type="button"
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[13px] sm:text-[14px] font-black uppercase tracking-wider shadow-[0_8px_25px_rgba(16,231,178,0.4)] hover:shadow-[0_10px_30px_rgba(16,231,178,0.55)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
            <span>INGRESAR A AQUA-JASS</span>
          </button>

          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#002833] hover:bg-[#003d4c] text-white font-hud text-[13px] sm:text-[14px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-cyan-400/40"
            >
              <span className="material-symbols-outlined text-[19px] text-[#10e7b2]">monitoring</span>
              <span>DASHBOARD TERRITORIAL</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOurServices}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-[#004e5f] border border-cyan-300 font-hud text-[13px] sm:text-[14px] font-bold uppercase tracking-wider shadow-2xs hover:shadow-sm active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] text-[#009bb8]">biotech</span>
            <span>SERVICIOS</span>
          </button>

          <button
            type="button"
            onClick={onLearnMore}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-50/70 hover:bg-cyan-100/70 text-[#003d4c] font-hud text-[13px] sm:text-[14px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">explore</span>
            <span>CONOCER MÁS</span>
          </button>
        </div>

        {/* Visual Story 1: Physical Water Cycle Management */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-cyan-100 shadow-[0_12px_36px_rgba(0,103,125,0.08)] mb-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
            <span className="font-hud font-extrabold text-[12px] sm:text-[13px] text-[#00677d] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00b4d8]">account_tree</span>
              Cadena de Gestión Territorial del Agua
            </span>
            <span className="text-[11px] font-bold text-slate-500 font-hud">
              Vigilancia Integral de Extremo a Extremo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {[
              { step: '01', name: 'FUENTE', desc: 'Captación y Cuenca', icon: 'landscape' },
              { step: '02', name: 'TRATAMIENTO', desc: 'Floculación / Filtro', icon: 'filter_alt' },
              { step: '03', name: 'RESERVORIO', desc: 'Desinfección y Cloro', icon: 'water_bottle' },
              { step: '04', name: 'DISTRIBUCIÓN', desc: 'Red y Presiones', icon: 'alt_route' },
              { step: '05', name: 'CONSUMO', desc: 'Puntos y Hogares', icon: 'family_restroom' },
            ].map((node, i) => (
              <div
                key={node.name}
                className="relative p-3.5 rounded-2xl bg-gradient-to-b from-cyan-50/60 to-white border border-cyan-100/90 flex flex-col items-center text-center shadow-2xs hover:border-cyan-300 transition-all"
              >
                <span className="text-[10px] font-hud font-extrabold text-[#00b4d8] mb-1">
                  ETAPA {node.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-cyan-200 flex items-center justify-center text-[#00677d] mb-1.5">
                  <span className="material-symbols-outlined text-[20px]">{node.icon}</span>
                </div>
                <h4 className="font-hud font-black text-[12px] text-[#003440] uppercase">
                  {node.name}
                </h4>
                <p className="text-[10.5px] text-slate-500 font-medium">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Story 2: Sanitary Risk Cycle + Principle Badge */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#002f3a] to-[#004e5f] text-white shadow-xl text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
            <div>
              <span className="text-[11px] font-hud font-bold text-[#10e7b2] uppercase tracking-widest block">
                Principio Central de Vigilancia
              </span>
              <h3 className="font-hud font-black text-[18px] sm:text-[22px] text-white">
                "El agua segura se gestiona, no solo se analiza."
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#10e7b2]/20 border border-[#10e7b2]/40 text-[#10e7b2] font-hud text-[11px] font-bold uppercase tracking-wider">
              Enfoque Preventivo de Riesgo
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { action: 'MEDICIÓN', desc: 'Cloro libre y turbidez', icon: 'speed' },
              { action: 'LABORATORIO', desc: 'Ensayos analíticos', icon: 'biotech' },
              { action: 'RIESGO', desc: 'Evaluación sanitaria', icon: 'warning' },
              { action: 'ACCIÓN', desc: 'Medida correctiva JASS', icon: 'build_circle' },
              { action: 'VERIFICACIÓN', desc: 'Garantía de inocuidad', icon: 'verified' },
            ].map((cycle, i) => (
              <div
                key={cycle.action}
                className="p-3 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center text-center backdrop-blur-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#10e7b2]/20 border border-[#10e7b2]/40 flex items-center justify-center text-[#10e7b2] mb-1.5">
                  <span className="material-symbols-outlined text-[18px]">{cycle.icon}</span>
                </div>
                <span className="font-hud font-extrabold text-[11.5px] text-white uppercase">
                  {cycle.action}
                </span>
                <span className="text-[10px] text-cyan-200/80 mt-0.5">{cycle.desc}</span>
              </div>
            ))}
          </div>

          {/* Slogan Banner at bottom of card */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-center text-center">
            <span className="font-hud text-[12px] sm:text-[13px] text-cyan-100 font-bold tracking-wide">
              MEDIR → ANALIZAR → EVALUAR → ACTUAR → VERIFICAR → <span className="text-[#10e7b2] font-black">AGUA SEGURA</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

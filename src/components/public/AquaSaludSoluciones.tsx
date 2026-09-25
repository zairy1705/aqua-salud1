import React, { useState, useRef } from 'react';

interface AquaSaludSolucionesProps {
  onOpenJassPlatform: () => void;
  onOpenLabPlatform: () => void;
  onOpenDashboardPlatform: () => void;
  onOpenQuoteModal: (serviceName?: string) => void;
}

type SolutionTab = 'municipios' | 'jass' | 'laboratorios';

export const AquaSaludSoluciones: React.FC<AquaSaludSolucionesProps> = ({
  onOpenJassPlatform,
  onOpenLabPlatform,
  onOpenDashboardPlatform,
  onOpenQuoteModal,
}) => {
  const [activeSolution, setActiveSolution] = useState<SolutionTab>('municipios');
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="soluciones" className="py-16 sm:py-24 relative overflow-hidden border-b border-cyan-100">
      {/* =========================================================================
          VIDEO DE FONDO ANIMADO DE LA SECCIÓN (PIN 585819864077196940)
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/tecnologia_gestion_poster.jpg"
          className="w-full h-full object-cover object-center scale-105 filter brightness-95 saturate-110"
        >
          <source src="/tecnologia_gestion_bg.mp4" type="video/mp4" />
        </video>

        {/* Velo estético translúcido de integración institucional y desenfoque sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/90 via-[#f0f9ff]/75 to-[#e0f2fe]/85 backdrop-blur-[1.5px]" />
        
        {/* Destellos de luz y cáusticas */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      {/* Control discreto de reproducción del video */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleVideo}
          className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-cyan-200/80 text-[#00677d] font-hud text-[11px] font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          title={isPlaying ? 'Pausar video de fondo' : 'Reanudar video de fondo'}
        >
          <span className="material-symbols-outlined text-[15px] text-[#0284c7]">
            {isPlaying ? 'pause_circle' : 'play_circle'}
          </span>
          <span className="hidden sm:inline">
            {isPlaying ? 'Video activo' : 'Pausado'}
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Heading con contenedor de vidrio suave */}
        <div className="text-center max-w-3xl mx-auto mb-10 backdrop-blur-md bg-white/60 p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(6,59,74,0.06)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#063B4A] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px] text-[#10B981]">workspace_premium</span>
            <span>SOLUCIONES ESPECIALIZADAS POR SECTOR</span>
          </div>

          <h2 className="font-hud font-extrabold text-[28px] sm:text-[40px] text-[#063B4A] tracking-tight leading-tight mb-4 drop-shadow-xs">
            Tecnología Adaptada a Cada Nivel de Gestión
          </h2>

          <p className="text-[15px] sm:text-[17px] text-slate-700 leading-relaxed font-normal">
            Desde la supervisión territorial y metas de incentivos para gobiernos locales, hasta la operativa directa en caseríos rurales y el rigor analítico de laboratorio.
          </p>
        </div>

        {/* Segment Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-2xl mx-auto p-1.5 bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm">
          {[
            { id: 'municipios' as SolutionTab, label: 'MUNICIPALIDADES (ATM)', icon: 'apartment' },
            { id: 'jass' as SolutionTab, label: 'JASS & OPERADORES', icon: 'water_drop' },
            { id: 'laboratorios' as SolutionTab, label: 'LABORATORIOS', icon: 'biotech' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSolution(tab.id)}
              className={`flex-1 py-3 px-3 rounded-xl font-hud text-[12px] sm:text-[13px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSolution === tab.id
                  ? 'bg-[#063B4A] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#063B4A] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* SOLUTION 1: MUNICIPALIDADES (ATM) */}
        {activeSolution === 'municipios' && (
          <div className="bg-gradient-to-br from-[#063B4A]/95 to-[#087E98]/95 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-cyan-300/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/25 text-[#8BE6C2] text-[11px] font-hud font-black uppercase tracking-wider border border-[#10B981]/40">
                  <span>ÁREAS TÉCNICAS MUNICIPALES (ATM) • ALCALDÍA</span>
                </div>

                <h3 className="font-hud font-black text-[26px] sm:text-[34px] leading-tight text-white">
                  Transforma los datos del agua en información útil para la gestión territorial
                </h3>

                <p className="text-[14px] sm:text-[15.5px] text-cyan-100 leading-relaxed">
                  Permite a los funcionarios del ATM monitorear la totalidad de sistemas de agua potable del distrito, asegurar la cloración efectiva en cada caserío y sustentar el cumplimiento de metas de incentivos presupuestarios ante el MEF y MVCS.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { title: 'Supervisión en Tiempo Real', desc: 'Monitoreo de niveles de cloro residual en todos los centros poblados.' },
                    { title: 'Cumplimiento de Metas (MEF)', desc: 'Reportes listos para sustentar incentivos municipales de agua clorada.' },
                    { title: 'Georreferenciación GIS', desc: 'Mapeo distrital de captaciones, redes y reservorios en estado crítico.' },
                    { title: 'Expedientes Oficiales', desc: 'Descarga de informes consolidados de gestión sanitaria en PDF.' },
                  ].map((feat) => (
                    <div key={feat.title} className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                      <div className="flex items-center gap-1.5 font-hud font-extrabold text-[12.5px] text-[#8BE6C2] mb-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-200">{feat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onOpenDashboardPlatform}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#10B981] hover:bg-[#8BE6C2] text-[#031E26] font-hud text-[13px] font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">dashboard</span>
                    <span>VER DASHBOARD TERRITORIAL ATM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal('AQUA-MUNICIPIOS (ATM)')}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-hud text-[12.5px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[17px]">request_quote</span>
                    <span>Solicitar Demo para mi Distrito</span>
                  </button>
                </div>
              </div>

              {/* Graphic stats callout */}
              <div className="lg:col-span-5 bg-black/25 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
                <span className="text-[11px] font-hud font-bold text-cyan-200 uppercase tracking-widest block">
                  Indicadores Típicos de Impacto
                </span>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[26px] font-mono font-black text-[#8BE6C2] block leading-none">
                      +94%
                    </span>
                    <span className="text-[11px] text-slate-200 mt-1 block">
                      Cobertura de cloración permanente en redes
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[26px] font-mono font-black text-[#39C6DD] block leading-none">
                      -78%
                    </span>
                    <span className="text-[11px] text-slate-200 mt-1 block">
                      Reducción de incidencias diarreicas infantiles
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[26px] font-mono font-black text-[#10B981] block leading-none">
                      100%
                    </span>
                    <span className="text-[11px] text-slate-200 mt-1 block">
                      Trazabilidad de cloración para metas MEF
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                    <span className="text-[26px] font-mono font-black text-amber-300 block leading-none">
                      &lt; 24h
                    </span>
                    <span className="text-[11px] text-slate-200 mt-1 block">
                      Atención inmediata a fallas operativas
                    </span>
                  </div>
                </div>

                <p className="text-[11.5px] text-cyan-200 font-mono italic">
                  * Diseñado en cumplimiento de la Resolución Ministerial N.° 050-2020-VIVIENDA y directivas SUNASS.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SOLUTION 2: JASS & OPERADORES RURALES */}
        {activeSolution === 'jass' && (
          <div className="bg-gradient-to-br from-[#063B4A]/95 to-[#10B981]/95 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-teal-300/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#8BE6C2] text-[11px] font-hud font-black uppercase tracking-wider border border-white/30">
                  <span>JASS COMUNALES • OPERADORES DE CAMPO</span>
                </div>

                <h3 className="font-hud font-black text-[26px] sm:text-[34px] leading-tight text-white">
                  Herramientas intuitivas para garantizar agua clorada en cada comunidad
                </h3>

                <p className="text-[14px] sm:text-[15.5px] text-teal-100 leading-relaxed">
                  Desarrollado específicamente para el operador rural: interfaces táctiles con botones grandes, sin terminología innecesariamente compleja, con cálculo guiado de cloro y bitácora fotográfica que funciona sin conexión permanente.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { title: 'Calculador CLORAGUA', desc: 'Dosis exacta en gramos o mililitros con un solo toque.' },
                    { title: 'Bitácora Digital de Cloro', desc: 'Registro diario con foto del comparador DPD para evitar adulteraciones.' },
                    { title: 'Alertas Didácticas', desc: 'Semaforización visual verde/rojo que indica si el agua es apta.' },
                    { title: 'Manuales Paso a Paso', desc: 'Guías ilustradas de seguridad química, dilución y lavado de tanques.' },
                  ].map((feat) => (
                    <div key={feat.title} className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                      <div className="flex items-center gap-1.5 font-hud font-extrabold text-[12.5px] text-[#8BE6C2] mb-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-200">{feat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onOpenJassPlatform}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-[#063B4A] hover:bg-[#8BE6C2] font-hud text-[13px] font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px] text-[#087E98]">phone_iphone</span>
                    <span>INGRESAR AL MÓDULO RURAL AQUA-JASS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal('AQUA-JASS Rural')}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-hud text-[12.5px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[17px]">support_agent</span>
                    <span>Capacitación a Operadores</span>
                  </button>
                </div>
              </div>

              {/* JASS card visual preview */}
              <div className="lg:col-span-5 bg-black/25 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3">
                <span className="text-[11px] font-hud font-bold text-[#8BE6C2] uppercase tracking-widest block text-center">
                  Flujo del Operador en 3 Pasos
                </span>

                <div className="space-y-2 text-left">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#10B981] text-[#031E26] font-mono font-black text-sm flex items-center justify-center shrink-0">1</span>
                    <div>
                      <span className="font-hud font-bold text-[13px] text-white block">Mide con comparador DPD</span>
                      <span className="text-[11px] text-teal-200">Verifica el color rosado de cloro libre.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#10B981] text-[#031E26] font-mono font-black text-sm flex items-center justify-center shrink-0">2</span>
                    <div>
                      <span className="font-hud font-bold text-[13px] text-white block">Ingresa a CLORAGUA</span>
                      <span className="text-[11px] text-teal-200">Obtén la dosis exacta en gramos de hipoclorito.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#10B981] text-[#031E26] font-mono font-black text-sm flex items-center justify-center shrink-0">3</span>
                    <div>
                      <span className="font-hud font-bold text-[13px] text-white block">Guarda en Bitácora</span>
                      <span className="text-[11px] text-teal-200">El reporte se sincroniza con el ATM automáticamente.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOLUTION 3: LABORATORIOS ANALÍTICOS */}
        {activeSolution === 'laboratorios' && (
          <div className="bg-gradient-to-br from-[#031E26]/95 to-[#087E98]/95 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-cyan-400/30 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39C6DD]/20 text-[#39C6DD] text-[11px] font-hud font-black uppercase tracking-wider border border-[#39C6DD]/30">
                  <span>LABORATORIOS SANITARIOS • QUÍMICOS • TOXICOLÓGICOS</span>
                </div>

                <h3 className="font-hud font-black text-[26px] sm:text-[34px] leading-tight text-white">
                  Rigor metrológico, cadena de custodia y emisión de informes certificados
                </h3>

                <p className="text-[14px] sm:text-[15.5px] text-cyan-100 leading-relaxed">
                  Módulo especializado para laboratorios de ensayo de calidad del agua: control de muestras, trazabilidad desde la toma en campo hasta la validación analítica, contraste contra límites máximos permisibles (LMP) y emisión de reportes inmutables.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { title: 'Cadena de Custodia 5 Fases', desc: 'Toma → Transporte → Recepción → Ensayo → Validación formal.' },
                    { title: 'Metales Pesados Críticos', desc: 'Evaluación de As, Pb, Hg, Cd, Fe, Mn según D.S. N.° 031-2010-SA.' },
                    { title: 'Ensayos Microbiológicos', desc: 'Coliformes totales, E. coli, bacterias heterotróficas y parásitos.' },
                    { title: 'Cálculo de Incertidumbre', desc: 'Registro de método estandarizado SMEWW, blanco y duplicados.' },
                  ].map((feat) => (
                    <div key={feat.title} className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                      <div className="flex items-center gap-1.5 font-hud font-extrabold text-[12.5px] text-[#39C6DD] mb-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-200">{feat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onOpenLabPlatform}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#39C6DD] hover:bg-[#8BE6C2] text-[#031E26] font-hud text-[13px] font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">biotech</span>
                    <span>INGRESAR A AQUA-LAB & AQUA-METALS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal('Servicios de Laboratorio AQUA-LAB')}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-hud text-[12.5px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <span className="material-symbols-outlined text-[17px]">request_quote</span>
                    <span>Cotizar Ensayos de Agua</span>
                  </button>
                </div>
              </div>

              {/* Lab protocol checklist visual */}
              <div className="lg:col-span-5 bg-black/25 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3 text-left">
                <span className="text-[11px] font-hud font-bold text-[#39C6DD] uppercase tracking-widest block text-center">
                  Matriz Normativa Incorporada
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-white">D.S. N.° 031-2010-SA</span>
                    <span className="text-[#8BE6C2] font-mono font-bold">LMP Sanitarios</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-white">Standard Methods (SMEWW)</span>
                    <span className="text-[#39C6DD] font-mono font-bold">23rd Edition</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-white">EPA Water Quality Protocols</span>
                    <span className="text-cyan-200 font-mono font-bold">Espectrofotometría</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-white">Guías OMS Agua de Consumo</span>
                    <span className="text-emerald-300 font-mono font-bold">4ta Edición</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-400/30 text-center">
                  <span className="text-[11px] text-cyan-200 block font-medium">
                    Todos los informes incluyen hash criptográfico de inmutabilidad y firma del responsable técnico.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

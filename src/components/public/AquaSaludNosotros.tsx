import React from 'react';

interface AquaSaludNosotrosProps {
  onEnterPlatform?: () => void;
  onOpenQuoteModal?: () => void;
}

export const AquaSaludNosotros: React.FC<AquaSaludNosotrosProps> = ({
  onEnterPlatform,
  onOpenQuoteModal,
}) => {
  const workflowSteps = [
    {
      action: 'ANALIZAMOS',
      icon: 'science',
      desc: 'Ensayos físico-químicos, microbiológicos y metales pesados en laboratorio y campo.',
      badgeColor: 'from-[#00b4d8] to-[#007791]',
    },
    {
      action: 'EVALUAMOS',
      icon: 'fact_check',
      desc: 'Contraste riguroso con D.S. N.° 031-2010-SA y límites máximos permisibles (LMP).',
      badgeColor: 'from-[#007791] to-[#005f73]',
    },
    {
      action: 'CONTROLAMOS',
      icon: 'tune',
      desc: 'Cálculo estequiométrico de dosis de desinfectante y calibración de reservorios.',
      badgeColor: 'from-[#0a9396] to-[#009bb8]',
    },
    {
      action: 'PROTEGEMOS',
      icon: 'health_and_safety',
      desc: 'Garantía de agua segura en el punto de consumo y resguardo de la salud pública.',
      badgeColor: 'from-[#10e7b2] to-[#008f6b]',
    },
  ];

  const specialtyAreas = [
    {
      title: 'Laboratorio Especializado',
      desc: 'Determinación confiable de turbiedad, pH, coliformes termotolerantes, metales pesados (Arsénico, Plomo, Hierro) y parámetros críticos.',
      icon: 'biotech',
    },
    {
      title: 'Asistencia Técnica en Campo',
      desc: 'Acompañamiento a operadores JASS, municipios y comités de agua en limpieza, desinfección y dosificación continua.',
      icon: 'support_agent',
    },
    {
      title: 'Gestión y Control de Calidad',
      desc: 'Vigilancia sanitaria permanente, trazabilidad analítica y planes de contingencia para la continuidad del servicio.',
      icon: 'verified',
    },
    {
      title: 'Tecnología e Innovación Digital',
      desc: 'Desarrollo de software y algoritmos especializados para modelar dosificaciones, telemetría DPD y alertas epidemiológicas.',
      icon: 'memory',
    },
  ];

  return (
    <section id="nosotros" className="py-12 sm:py-16 border-t border-cyan-100/80 bg-gradient-to-b from-white via-cyan-50/20 to-white text-[#151d22]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* =========================================================================
            1. ENCABEZADO INSTITUCIONAL / QUIÉNES SOMOS
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200/90 text-[#00677d] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-[#008ba3]">science</span>
            <span>Laboratorio • Agua Segura • Tecnología de Control</span>
          </div>

          <h2 className="font-hud font-extrabold text-[30px] sm:text-[40px] text-[#003440] tracking-tight leading-tight mb-4">
            QUIÉNES SOMOS
          </h2>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-cyan-100 shadow-[0_10px_30px_rgba(0,103,125,0.06)] relative overflow-hidden text-left sm:text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b4d8] via-[#10e7b2] to-[#007791]" />
            <p className="text-[16px] sm:text-[18px] text-[#334155] leading-relaxed font-medium">
              <strong className="text-[#003440] font-bold">AQUA SALUD</strong> es una iniciativa especializada en la calidad y seguridad del agua para consumo humano. Integramos <strong className="text-[#00677d]">análisis de laboratorio, asistencia técnica y tecnología digital</strong> para apoyar la gestión y control de los sistemas de agua.
            </p>
          </div>
        </div>

        {/* 4 Pilares de Especialidad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {specialtyAreas.map((area) => (
            <div
              key={area.title}
              className="p-5 rounded-2xl bg-white border border-cyan-100/90 shadow-[0_4px_16px_rgba(0,103,125,0.04)] hover:border-cyan-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-[#00677d] mb-3">
                  <span className="material-symbols-outlined text-[22px]">{area.icon}</span>
                </div>
                <h4 className="font-hud font-bold text-[14px] text-[#003440] mb-2 leading-snug">
                  {area.title}
                </h4>
                <p className="text-[12.5px] text-[#475569] leading-relaxed">
                  {area.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            2. MISIÓN Y VISIÓN
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 sm:mb-14">
          {/* Tarjeta Misión */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-cyan-100 shadow-[0_8px_26px_rgba(0,103,125,0.06)] relative overflow-hidden group hover:border-cyan-300 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-100/30 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white shadow-sm p-3">
                  <span className="material-symbols-outlined text-[28px]">flag</span>
                </div>
                <span className="text-[11px] font-hud font-bold uppercase tracking-wider text-[#007791] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                  Propósito en Acción
                </span>
              </div>
              <h3 className="font-hud font-black text-[22px] text-[#003440] uppercase tracking-wide mb-3">
                MISIÓN
              </h3>
              <p className="text-[15px] text-[#334155] leading-relaxed">
                Brindar soluciones técnicas y tecnológicas para la <strong className="text-[#00677d]">gestión de la calidad del agua</strong>, mediante análisis físico-químicos, microbiológicos y de metales, apoyo en la desinfección y herramientas digitales que contribuyan al acceso a <strong className="text-[#003440]">agua segura</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-50 flex items-center gap-2 text-[12.5px] text-[#00677d] font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#00b4d8]">verified</span>
              <span>Análisis certificados • Rigor normativo D.S. N.° 031-2010-SA</span>
            </div>
          </div>

          {/* Tarjeta Visión */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-cyan-100 shadow-[0_8px_26px_rgba(0,103,125,0.06)] relative overflow-hidden group hover:border-cyan-300 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-100/30 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#10e7b2] to-[#008f6b] flex items-center justify-center text-[#002b1f] shadow-sm p-3">
                  <span className="material-symbols-outlined text-[28px]">visibility</span>
                </div>
                <span className="text-[11px] font-hud font-bold uppercase tracking-wider text-[#008f6b] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Horizonte Estratégico
                </span>
              </div>
              <h3 className="font-hud font-black text-[22px] text-[#003440] uppercase tracking-wide mb-3">
                VISIÓN
              </h3>
              <p className="text-[15px] text-[#334155] leading-relaxed">
                Ser un referente en <strong className="text-[#00677d]">gestión y control de la calidad del agua para consumo humano</strong>, integrando ciencia, laboratorio y tecnología para lograr sistemas de agua más <strong className="text-[#003440]">seguros, eficientes y sostenibles</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-50 flex items-center gap-2 text-[12.5px] text-[#008f6b] font-medium">
              <span className="material-symbols-outlined text-[18px] text-[#10e7b2]">eco</span>
              <span>Sostenibilidad • Cobertura rural y urbana • Innovación continua</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. BLOQUE VISUAL DESTACADO: TECNOLOGÍA CLORAGUA 💧
        ========================================================================= */}
        <div className="mb-12 sm:mb-14">
          <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#002b36] via-[#003d4d] to-[#004f63] text-white shadow-[0_16px_40px_rgba(0,43,54,0.18)] relative overflow-hidden border border-cyan-500/30">
            {/* Elementos decorativos acuáticos de fondo */}
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#00b4d8]/15 blur-3xl pointer-events-none" />
            <div className="absolute right-1/4 -bottom-10 w-48 h-48 rounded-full bg-[#10e7b2]/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 text-[11px] sm:text-[12px] font-hud font-bold uppercase tracking-wider mb-3">
                  <span className="material-symbols-outlined text-[15px] text-[#43fec7]">water_drop</span>
                  <span>Destacar Tecnología</span>
                </div>

                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="font-hud font-black text-[26px] sm:text-[34px] tracking-tight text-white flex items-center gap-2">
                    <span>CLORAGUA</span>
                    <span className="text-[26px] sm:text-[32px]">💧</span>
                  </h3>
                </div>

                <p className="font-hud text-[15px] sm:text-[17px] text-[#43fec7] font-semibold italic mb-3">
                  Tecnología para la gestión de la cloración
                </p>

                <p className="text-[14.5px] sm:text-[16px] text-cyan-100/90 leading-relaxed max-w-xl">
                  Aplicativo para calcular la dosificación de cloro y facilitar el control de la desinfección de los sistemas de agua.
                </p>
              </div>

              {/* Botón / Característica de la tecnología */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#43fec7]/20 flex items-center justify-center text-[#43fec7] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">calculate</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-hud font-semibold">Dosificación</div>
                    <div className="text-[13px] font-bold text-white">Hipoclorito 65% y 70%</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center text-[#00b4d8] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">timer</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-hud font-semibold">Desinfección</div>
                    <div className="text-[13px] font-bold text-white">Monitoreo continuo 24/7</div>
                  </div>
                </div>

                {onEnterPlatform && (
                  <button
                    onClick={onEnterPlatform}
                    className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#10e7b2] hover:bg-[#43fec7] text-[#002b1f] font-hud font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#10e7b2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Abrir Plataforma CLORAGUA</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. MENSAJE VISUAL DEBAJO: ANALIZAMOS → EVALUAMOS → CONTROLAMOS → PROTEGEMOS
        ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-cyan-100/90 shadow-[0_8px_30px_rgba(0,103,125,0.06)] text-center">
          <div className="mb-6">
            <span className="text-[11px] font-hud font-bold uppercase tracking-widest text-[#007791] bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-100">
              Ciclo Integral de Seguridad Hídrica
            </span>
          </div>

          {/* Secuencia visual con flechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.action}
                className="relative p-5 rounded-2xl bg-gradient-to-b from-cyan-50/50 to-white border border-cyan-100 hover:border-cyan-300 transition-all flex flex-col items-center text-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.badgeColor} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <span className="material-symbols-outlined text-[24px]">{step.icon}</span>
                </div>

                <div className="font-hud font-black text-[16px] text-[#003440] tracking-wider mb-2">
                  {step.action}
                </div>

                <p className="text-[12.5px] text-[#475569] leading-relaxed">
                  {step.desc}
                </p>

                {/* Flecha conectora entre pasos (visible en pantallas grandes) */}
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-cyan-200 items-center justify-center text-[#007791] z-20 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cadena textual destacada */}
          <div className="mt-8 pt-6 border-t border-cyan-100/70 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[#003440] font-hud font-extrabold text-[13px] sm:text-[15px] tracking-wide">
            <span className="px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-100/80 text-[#00677d]">ANALIZAMOS</span>
            <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">east</span>
            <span className="px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-100/80 text-[#00677d]">EVALUAMOS</span>
            <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">east</span>
            <span className="px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-100/80 text-[#00677d]">CONTROLAMOS</span>
            <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">east</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#008f6b]">PROTEGEMOS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

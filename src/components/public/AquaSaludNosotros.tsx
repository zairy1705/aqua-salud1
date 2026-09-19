import React from 'react';

export const AquaSaludNosotros: React.FC = () => {
  const principles = [
    {
      title: 'Rigor Científico',
      desc: 'Métodos estandarizados, calibración rigurosa de equipos y estricto apego a normas sanitarias oficiales.',
      icon: 'psychology',
    },
    {
      title: 'Agua Segura',
      desc: 'Enfoque integral que garantiza agua libre de patógenos y contaminantes en el punto de consumo.',
      icon: 'water_drop',
    },
    {
      title: 'Protección de la Salud',
      desc: 'Prevención activa de enfermedades diarreicas agudas (EDAs) y afecciones de origen hídrico.',
      icon: 'health_and_safety',
    },
    {
      title: 'Decisiones Basadas en Datos',
      desc: 'Sustento técnico en telemetría de campo, ensayos analíticos trazables y tendencias estadísticas.',
      icon: 'analytics',
    },
    {
      title: 'Articulación Multisectorial',
      desc: 'Integración fluida entre operadores JASS, Áreas Técnicas Municipales (ATM), laboratorios y salud.',
      icon: 'hub',
    },
    {
      title: 'Gestión Sostenible',
      desc: 'Uso racional de insumos desinfectantes, protección de cuencas e infraestructura hidráulica duradera.',
      icon: 'eco',
    },
  ];

  return (
    <section id="nosotros" className="py-12 sm:py-16 border-t border-cyan-100/80 bg-gradient-to-b from-white to-cyan-50/30">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 border border-cyan-200 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">info</span>
            <span>Identidad y Propósito Institucional</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[36px] text-[#003440] tracking-tight">
            ¿QUIÉNES SOMOS?
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#334155] leading-relaxed mt-3">
            <strong>AQUA-SALUD</strong> es una plataforma orientada a fortalecer la vigilancia, análisis y gestión de la calidad del agua mediante la integración de información de campo, laboratorio, territorio y gestión sanitaria.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Misión */}
          <div className="p-7 rounded-3xl bg-white border border-cyan-100 shadow-[0_8px_24px_rgba(0,103,125,0.06)] relative overflow-hidden group hover:border-cyan-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">flag</span>
            </div>
            <h3 className="font-hud font-black text-[20px] text-[#003440] uppercase mb-2">
              MISIÓN
            </h3>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">
              Contribuir a la protección de la salud mediante herramientas que permitan generar información confiable, identificar riesgos y facilitar decisiones oportunas para una gestión segura del agua.
            </p>
          </div>

          {/* Visión */}
          <div className="p-7 rounded-3xl bg-white border border-cyan-100 shadow-[0_8px_24px_rgba(0,103,125,0.06)] relative overflow-hidden group hover:border-cyan-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10e7b2] to-[#009bb8] flex items-center justify-center text-[#002b1f] mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">visibility</span>
            </div>
            <h3 className="font-hud font-black text-[20px] text-[#003440] uppercase mb-2">
              VISIÓN
            </h3>
            <p className="text-[14.5px] text-[#475569] leading-relaxed">
              Ser una plataforma referente para la gestión inteligente y territorial del agua, integrando tecnologías accesibles y acompañamiento técnico a los prestadores de servicios de saneamiento.
            </p>
          </div>
        </div>

        {/* Principios */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-cyan-100/90 shadow-[0_8px_28px_rgba(0,103,125,0.06)]">
          <h3 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#003440] uppercase tracking-wide mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00b4d8] text-[22px]">verified_user</span>
            NUESTROS PRINCIPIOS GUÍA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((p) => (
              <div
                key={p.title}
                className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-100/80 hover:bg-cyan-50/80 transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="material-symbols-outlined text-[#00677d] text-[20px]">{p.icon}</span>
                  <h4 className="font-hud font-bold text-[14px] text-[#003440]">{p.title}</h4>
                </div>
                <p className="text-[12.5px] text-[#475569] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

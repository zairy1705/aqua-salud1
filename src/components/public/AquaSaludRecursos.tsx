import React from 'react';

interface AquaSaludRecursosProps {
  onOpenUserManual: () => void;
  onOpenNormative: () => void;
}

export const AquaSaludRecursos: React.FC<AquaSaludRecursosProps> = ({
  onOpenUserManual,
  onOpenNormative,
}) => {
  const resourceCards = [
    {
      title: 'Instructivo Didáctico Oficial de Cloración',
      tag: 'Descarga PDF A4 • Impresión',
      desc: 'Manual pedagógico ilustrado de 7 fases para operadores rurales y miembros de JASS. Incluye cálculos de volumen, dosificación y calibración.',
      icon: 'picture_as_pdf',
      actionText: 'Ver y Descargar PDF',
      onClick: onOpenUserManual,
      highlight: true,
    },
    {
      title: 'Marco Normativo D.S. N.° 031-2010-SA',
      tag: 'Reglamento Nacional MINSA',
      desc: 'Límites Máximos Permisibles (LMP) de parámetros microbiológicos, organolépticos y fisicoquímicos en agua para consumo humano.',
      icon: 'gavel',
      actionText: 'Consultar Normativa',
      onClick: onOpenNormative,
      highlight: false,
    },
    {
      title: 'Protocolo de Muestreo de Cloro Libre (DPD-1)',
      tag: 'Guía Técnica DIGESA',
      desc: 'Procedimiento paso a paso para la lectura colorimétrica visual y fotométrica en puntos críticos de la red de distribución.',
      icon: 'colorize',
      actionText: 'Abrir Guía Rápida',
      onClick: onOpenUserManual,
      highlight: false,
    },
    {
      title: 'Fichas de Seguridad de Insumos Químicos',
      tag: 'Bioseguridad y EPP',
      desc: 'Hojas de datos de seguridad (MSDS) para hipoclorito de calcio (65-70%) e hipoclorito de sodio con medidas de primeros auxilios.',
      icon: 'security',
      actionText: 'Revisar Fichas',
      onClick: onOpenUserManual,
      highlight: false,
    },
  ];

  return (
    <section id="recursos" className="py-12 sm:py-16 bg-white border-t border-cyan-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 border border-cyan-200 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">menu_book</span>
            <span>Documentación y Asistencia Técnica</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[36px] text-[#003440] tracking-tight">
            📚 CENTRO DE RECURSOS
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-relaxed mt-2">
            Materiales pedagógicos, protocolos técnicos e instrumentos normativos para el fortalecimiento de capacidades comunales.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resourceCards.map((res) => (
            <div
              key={res.title}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                res.highlight
                  ? 'bg-gradient-to-br from-cyan-50/70 to-teal-50/50 border-cyan-300 shadow-[0_10px_28px_rgba(0,103,125,0.08)]'
                  : 'bg-slate-50/60 border-slate-200 hover:border-cyan-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      res.highlight
                        ? 'bg-gradient-to-br from-[#00b4d8] to-[#00677d] text-white shadow-xs'
                        : 'bg-white text-[#00677d] border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{res.icon}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#00677d] text-[10.5px] font-hud font-bold border border-cyan-200">
                    {res.tag}
                  </span>
                </div>

                <h3 className="font-hud font-bold text-[16px] sm:text-[17px] text-[#003440] mb-2 leading-snug">
                  {res.title}
                </h3>
                <p className="text-[13px] text-[#475569] leading-relaxed mb-5">{res.desc}</p>
              </div>

              <button
                type="button"
                onClick={res.onClick}
                className={`w-full py-2.5 px-4 rounded-xl font-hud text-[12px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  res.highlight
                    ? 'bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002b1f] shadow-xs hover:shadow-md active:scale-95'
                    : 'bg-white hover:bg-slate-100 text-[#004e5f] border border-slate-200 shadow-2xs active:scale-95'
                }`}
              >
                <span>{res.actionText}</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

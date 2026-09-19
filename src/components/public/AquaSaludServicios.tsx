import React, { useState } from 'react';

interface AquaSaludServiciosProps {
  onOpenAquaLab?: () => void;
  onOpenAquaMetals?: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const AquaSaludServicios: React.FC<AquaSaludServiciosProps> = ({
  onOpenAquaLab,
  onOpenAquaMetals,
  onOpenQuoteModal,
}) => {
  const [activeTab, setActiveTab] = useState<'fisicoquimico' | 'microbiologico' | 'metales'>(
    'fisicoquimico'
  );

  const services = {
    fisicoquimico: {
      category: 'Análisis Fisicoquímico',
      badge: 'Ensayos In Situ y Laboratorio',
      desc: 'Evaluación de las propiedades organolépticas, físico-químicas e iónicas del agua para verificar cumplimiento según D.S. N.° 031-2010-SA.',
      status: 'Disponible con Acreditación Progresiva',
      parameters: [
        { name: 'pH', unit: 'Unidades pH', norm: '6.5 a 8.5' },
        { name: 'Turbidez', unit: 'NTU', norm: '< 5.0 NTU' },
        { name: 'Conductividad', unit: 'µS/cm', norm: '< 1500 µS/cm' },
        { name: 'Temperatura', unit: '°C', norm: 'In situ' },
        { name: 'Sólidos Disueltos Totales (TDS)', unit: 'mg/L', norm: '< 1000 mg/L' },
        { name: 'Color Aparente', unit: 'UCV', norm: '< 15 UCV' },
        { name: 'Dureza Total', unit: 'mg/L CaCO₃', norm: '< 500 mg/L' },
        { name: 'Alcalinidad Total', unit: 'mg/L CaCO₃', norm: 'Referencial' },
        { name: 'Cloruros (Cl⁻)', unit: 'mg/L', norm: '< 250 mg/L' },
        { name: 'Sulfatos (SO₄²⁻)', unit: 'mg/L', norm: '< 250 mg/L' },
        { name: 'Nitratos (NO₃⁻)', unit: 'mg/L', norm: '< 50 mg/L' },
        { name: 'Nitritos (NO₂⁻)', unit: 'mg/L', norm: '< 3.0 mg/L' },
        { name: 'Amonio (NH₄⁺)', unit: 'mg/L', norm: '< 1.5 mg/L' },
        { name: 'Fluoruros (F⁻)', unit: 'mg/L', norm: '< 1.5 mg/L' },
        { name: 'Hierro (Fe)', unit: 'mg/L', norm: '< 0.3 mg/L' },
        { name: 'Manganeso (Mn)', unit: 'mg/L', norm: '< 0.4 mg/L' },
      ],
    },
    microbiologico: {
      category: 'Análisis Microbiológico',
      badge: 'Biológico e Inocuidad',
      desc: 'Identificación y cuantificación de microorganismos indicadores de contaminación fecal e higiene del sistema de distribución.',
      status: 'Disponible para JASS y Redes',
      parameters: [
        { name: 'Escherichia coli (E. coli)', unit: 'UFC/100 mL o NMP', norm: '0 (Ausencia total)' },
        { name: 'Coliformes Totales', unit: 'UFC/100 mL o NMP', norm: '0 (Ausencia total)' },
        { name: 'Bacterias Heterotróficas', unit: 'UFC/mL a 35°C', norm: '< 500 UFC/mL' },
        { name: 'Coliformes Termotolerantes', unit: 'UFC/100 mL', norm: '0 (Ausencia total)' },
        { name: 'Huevos de Helmintos', unit: 'N°/Litro', norm: '0 (Ausencia)' },
      ],
    },
    metales: {
      category: 'Metales Pesados y Elementos Traza',
      badge: 'Espectrofotometría / Absorción Atómica',
      desc: 'Detección cuantitativa de elementos inorgánicos de alta toxicidad que representan riesgo crónico para la salud comunitaria.',
      status: 'FASE 5 • Activo en Plataforma AQUA-METALS',
      parameters: [
        { name: 'Arsénico (As)', unit: 'mg/L', norm: '< 0.010 mg/L' },
        { name: 'Plomo (Pb)', unit: 'mg/L', norm: '< 0.010 mg/L' },
        { name: 'Cadmio (Cd)', unit: 'mg/L', norm: '< 0.003 mg/L' },
        { name: 'Mercurio (Hg)', unit: 'mg/L', norm: '< 0.001 mg/L' },
        { name: 'Cromo Total (Cr)', unit: 'mg/L', norm: '< 0.05 mg/L' },
        { name: 'Níquel (Ni)', unit: 'mg/L', norm: '< 0.02 mg/L' },
        { name: 'Cobre (Cu)', unit: 'mg/L', norm: '< 2.0 mg/L' },
        { name: 'Zinc (Zn)', unit: 'mg/L', norm: '< 3.0 mg/L' },
        { name: 'Hierro Total (Fe)', unit: 'mg/L', norm: '< 0.3 mg/L' },
        { name: 'Manganeso (Mn)', unit: 'mg/L', norm: '< 0.4 mg/L' },
      ],
    },
  };

  const current = services[activeTab];

  return (
    <section id="servicios" className="py-12 sm:py-16 bg-white border-t border-cyan-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 border border-cyan-200 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">biotech</span>
            <span>Laboratorio de Vigilancia Sanitaria</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[36px] text-[#003440] tracking-tight">
            🧪 SERVICIOS DE ANÁLISIS DE AGUA
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-relaxed mt-2">
            Metodologías estandarizadas conforme a la normativa peruana D.S. N.° 031-2010-SA y directivas de DIGESA.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'fisicoquimico', label: 'Fisicoquímico', icon: 'science' },
            { id: 'microbiologico', label: 'Microbiológico', icon: 'coronavirus' },
            { id: 'metales', label: 'Metales Pesados', icon: 'blur_on' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-2.5 rounded-2xl font-hud text-[12.5px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#00677d] text-white shadow-md'
                  : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Active Service Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-cyan-100 shadow-[0_8px_30px_rgba(0,103,125,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hud font-black text-[20px] sm:text-[22px] text-[#003440]">
                  {current.category}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-[#00677d] text-[10px] font-hud font-bold border border-cyan-200">
                  {current.badge}
                </span>
              </div>
              <p className="text-[13px] text-[#475569] mt-1">{current.desc}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-hud font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                {current.status}
              </span>
            </div>
          </div>

          {/* Table of parameters */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[#004e5f] font-hud text-[11px] uppercase">
                  <th className="py-2.5 px-3">Parámetro</th>
                  <th className="py-2.5 px-3">Unidad</th>
                  <th className="py-2.5 px-3">Límite Normativo (D.S. 031)</th>
                  <th className="py-2.5 px-3 text-right">Método Analítico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {current.parameters.map((param, idx) => (
                  <tr key={idx} className="hover:bg-white/80 transition-colors">
                    <td className="py-2 px-3 font-semibold text-[#1e293b]">{param.name}</td>
                    <td className="py-2 px-3 text-[#475569] font-mono text-[11.5px]">{param.unit}</td>
                    <td className="py-2 px-3 font-hud font-bold text-[#00677d]">{param.norm}</td>
                    <td className="py-2 px-3 text-right text-slate-500 text-[11px]">Standard Methods / EPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Principle of Transparency Note */}
          <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-[12px] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">
              gavel
            </span>
            <p className="leading-relaxed">
              <strong>Principio de Rigor y Transparencia:</strong> Los análisis analíticos se confirman únicamente con ensayos validados y cadena de custodia certificada. No se reportan resultados sin el debido soporte de calibración técnica.
            </p>
          </div>

          {(onOpenAquaLab || onOpenAquaMetals || onOpenQuoteModal) && (
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[12.5px] text-[#004e5f] font-medium text-center sm:text-left">
                {activeTab === 'metales'
                  ? '¿Desea cotizar monitoreo de metales pesados o explorar la vigilancia toxicológica?'
                  : '¿Desea solicitar una cotización formal para análisis de agua D.S. N.° 031-2010-SA?'}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {onOpenQuoteModal && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenQuoteModal(
                        activeTab === 'metales'
                          ? 'Monitoreo de Metales Pesados (ICP-MS: As, Pb, Cd, Hg, Fe)'
                          : 'Análisis Bacteriológico y Fisicoquímico D.S. N.° 031-2010-SA'
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-300 font-hud text-[12px] font-extrabold uppercase shadow-2xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">request_quote</span>
                    <span>Solicitar Cotización</span>
                  </button>
                )}
                {onOpenAquaMetals && activeTab === 'metales' && (
                  <button
                    type="button"
                    onClick={onOpenAquaMetals}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">science</span>
                    <span>Abrir AQUA-METALS ☣️</span>
                  </button>
                )}
                {onOpenAquaLab && (
                  <button
                    type="button"
                    onClick={onOpenAquaLab}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00677d] to-[#00b4d8] hover:from-[#004e5f] hover:to-[#009bb8] text-white font-hud text-[12px] font-extrabold uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">biotech</span>
                    <span>Ingresar al Módulo AQUA-LAB</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

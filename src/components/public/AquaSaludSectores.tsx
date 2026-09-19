import React from 'react';

interface AquaSaludSectoresProps {
  onSelectJassSector: () => void;
}

export const AquaSaludSectores: React.FC<AquaSaludSectoresProps> = ({ onSelectJassSector }) => {
  const sectors = [
    {
      name: 'Agua y Saneamiento',
      sub: 'AQUA-JASS',
      icon: 'water',
      badge: 'Prioritario • Activo',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Herramientas móviles y simplificadas para Juntas Administradoras de Servicios de Saneamiento y operadores rurales.',
      actionable: true,
    },
    {
      name: 'Salud Pública',
      sub: 'AQUA-SALUD',
      icon: 'local_hospital',
      badge: 'Vigilancia Activa',
      statusColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      desc: 'Epidemiología hídrica, correlación con enfermedades diarreicas agudas (EDAs) y prevención comunitaria.',
      actionable: false,
    },
    {
      name: 'Educación',
      sub: 'AQUA-ESCUELA',
      icon: 'school',
      badge: 'Despliegue Progresivo',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Vigilancia de cisternas escolares, quioscos saludables y formación de brigadas infantiles del agua.',
      actionable: false,
    },
    {
      name: 'Gobiernos Locales',
      sub: 'AQUA-MUNICIPAL',
      icon: 'apartment',
      badge: 'ATM / Supervisión',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'Áreas Técnicas Municipales (ATM) para fiscalización del incentivo de cloración y metas del sector.',
      actionable: false,
    },
    {
      name: 'Medio Ambiente',
      sub: 'AQUA-AMBIENTE',
      icon: 'park',
      badge: 'En Integración',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Conservación de fuentes hídricas, recarga de acuíferos y monitoreo de vertimientos en microcuencas.',
      actionable: false,
    },
    {
      name: 'Agricultura y Riego',
      sub: 'AQUA-RIEGO',
      icon: 'grass',
      badge: 'En Integración',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Comisiones de regantes, calidad de agua para cultivos de consumo directo e inocuidad agropecuaria.',
      actionable: false,
    },
    {
      name: 'Industria y Agroexportación',
      sub: 'AQUA-INDUSTRIA',
      icon: 'factory',
      badge: 'En Integración',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
      desc: 'Monitoreo de aguas de proceso, tratamiento de efluentes y cumplimiento de Estándares de Calidad Ambiental (ECA).',
      actionable: false,
    },
    {
      name: 'Laboratorios de Ensayo',
      sub: 'AQUA-LAB',
      icon: 'biotech',
      badge: 'Fase 2 Preparada',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
      desc: 'Cadena de custodia digital, emisión de informes analíticos y gestión de muestras con trazabilidad.',
      actionable: false,
    },
  ];

  return (
    <section id="sectores" className="py-12 sm:py-16 bg-slate-50/60 border-t border-cyan-100">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 border border-cyan-200 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">domain</span>
            <span>Articulación Multisectorial</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[36px] text-[#003440] tracking-tight">
            SECTORES INTEGRADOS
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-relaxed mt-2">
            La plataforma conecta progresivamente a todos los actores clave del territorio para garantizar agua segura y sostenible.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((sec) => (
            <div
              key={sec.name}
              className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                sec.actionable
                  ? 'border-[#10e7b2]/80 shadow-[0_8px_24px_rgba(16,231,178,0.2)] ring-1 ring-[#10e7b2]/40'
                  : 'border-slate-200 shadow-2xs hover:border-cyan-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      sec.actionable ? 'bg-[#10e7b2]/20 text-[#002b1f]' : 'bg-cyan-50 text-[#00677d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{sec.icon}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold uppercase border ${sec.statusColor}`}
                  >
                    {sec.badge}
                  </span>
                </div>

                <span className="font-hud text-[11px] font-extrabold text-[#00b4d8] uppercase tracking-wider block mb-0.5">
                  {sec.sub}
                </span>
                <h3 className="font-hud font-bold text-[15px] text-[#003440] leading-snug mb-2">
                  {sec.name}
                </h3>
                <p className="text-[12px] text-[#475569] leading-relaxed mb-4">{sec.desc}</p>
              </div>

              {sec.actionable ? (
                <button
                  type="button"
                  onClick={onSelectJassSector}
                  className="w-full py-2 px-3 rounded-xl bg-[#00677d] hover:bg-[#004e5f] text-white font-hud text-[11.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Abrir AQUA-JASS</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ) : (
                <div className="text-[10.5px] font-hud font-bold text-slate-400 uppercase tracking-wide pt-2 border-t border-slate-100 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Habilitación progresiva</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

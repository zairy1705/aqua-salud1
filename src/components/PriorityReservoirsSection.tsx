import React from 'react';
import { WaterSystem } from '../types';

interface PriorityReservoirsSectionProps {
  systems: WaterSystem[];
  onSelectSystemForDosage: (systemId: string) => void;
  onViewAllSystems: () => void;
  onAddNewSystem?: () => void;
}

export const PriorityReservoirsSection: React.FC<PriorityReservoirsSectionProps> = ({
  systems,
  onSelectSystemForDosage,
  onViewAllSystems,
  onAddNewSystem,
}) => {
  // Sort or pick systems to display: e.g. first 3 or systems with priority attention
  const displaySystems = systems.slice(0, 3);

  return (
    <section className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,103,125,0.06)] border border-[#bcc9ce]/40 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[24px] text-[#00677d]">
            home_work
          </span>
          <h2 className="font-hud font-extrabold text-[16px] sm:text-[18px] text-[#151d22] tracking-tight">
            Reservorios con Prioridad de Atención
          </h2>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={onAddNewSystem || onViewAllSystems}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#00677d]/35 hover:border-transparent text-[#00677d] hover:text-white font-hud font-bold text-[11.5px] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 hover:shadow-[0_4px_16px_rgba(0,180,216,0.35)] transition-all duration-300 cursor-pointer active:scale-95 shadow-2xs"
            title="Crear nuevo sistema o reservorio"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Nuevo Sistema</span>
          </button>

          <button
            type="button"
            onClick={onViewAllSystems}
            className="text-[#00677d] hover:text-[#00b4d8] hover:bg-cyan-50/80 px-2.5 py-1 rounded-full font-hud font-bold text-[12px] transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <span>Ver todos ({systems.length})</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Reservoir Rows */}
      <div className="divide-y divide-slate-100">
        {displaySystems.map((sys) => {
          const isLow = sys.lastChlorinePpm < 0.5;
          const isHigh = sys.lastChlorinePpm > 2.0;
          const isCompliant = !isLow && !isHigh;

          const badgeBg = isLow
            ? 'bg-[#ffe8ec] text-[#d90429] border border-rose-200'
            : isHigh
            ? 'bg-[#fef3c7] text-[#b45309] border border-amber-200'
            : 'bg-[#d7f9ef] text-[#006c51] border border-[#10e7b2]/40';

          return (
            <div
              key={sys.id}
              className="py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-gradient-to-r hover:from-cyan-50/40 hover:to-teal-50/40 -mx-2 px-2 rounded-xl transition-all duration-200"
            >
              {/* Left: Badge + System Details */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-hud text-[14px] sm:text-[15px] font-black shrink-0 shadow-2xs ${badgeBg}`}
                  title={`Última lectura: ${sys.lastChlorinePpm.toFixed(1)} ppm Cl₂`}
                >
                  {sys.lastChlorinePpm.toFixed(1)}
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-hud font-extrabold text-[14px] sm:text-[15px] text-[#151d22] tracking-tight truncate">
                    {sys.name}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-[#5f747e] truncate mt-0.5">
                    {sys.location} • {sys.capacityLiters.toLocaleString()} L • {sys.operator}
                  </p>
                </div>
              </div>

              {/* Right: Action Button */}
              <button
                type="button"
                onClick={() => onSelectSystemForDosage(sys.id)}
                className="bg-gradient-to-r from-[#00a6c0] to-[#008ea6] hover:from-[#10e7b2] hover:to-[#00b4d8] text-white hover:text-[#002116] font-hud font-black text-[11px] sm:text-[11.5px] uppercase tracking-wider px-4 sm:px-5 py-2 rounded-full shadow-xs hover:shadow-[0_4px_16px_rgba(16,231,178,0.45)] active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
                title={`Calcular dosificación de hipoclorito para ${sys.name}`}
              >
                DOSIFICAR
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

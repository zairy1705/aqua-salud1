import React, { useState, useMemo } from 'react';
import { WaterSystem } from '../types';

interface PriorityReservoirsSectionProps {
  systems: WaterSystem[];
  onSelectSystemForDosage: (systemId: string) => void;
  onViewAllSystems?: () => void;
  onNavigateSystems?: () => void;
  onAddNewSystem?: () => void;
}

type FilterOption = 'todos' | 'requiere_dosis' | 'optimos';

export const PriorityReservoirsSection: React.FC<PriorityReservoirsSectionProps> = ({
  systems,
  onSelectSystemForDosage,
  onViewAllSystems,
  onNavigateSystems,
  onAddNewSystem,
}) => {
  const [filter, setFilter] = useState<FilterOption>('todos');
  const [showAll, setShowAll] = useState(false);

  const handleViewAll = onViewAllSystems || onNavigateSystems;

  // Clasificación sanitaria de cada reservorio según D.S. N.° 031-2010-SA
  const getSystemChlorineEvaluation = (ppm: number) => {
    if (ppm < 0.5) {
      return {
        status: 'critical_low',
        category: 'needs_dosage',
        priorityOrder: 1, // Máxima prioridad
        label: 'REQUIERE DOSIFICAR',
        badgeTitle: 'Sub-clorado crítico (< 0.50 mg/L)',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        dotColor: 'bg-rose-600',
        textColor: 'text-rose-700',
        diagnostico: '¡Nivel crítico por debajo de la norma (mín. 0.50 mg/L)! Riesgo bacteriológico. Requiere cálculo y recarga de cloro urgente.',
        buttonLabel: '⚡ DOSIFICAR AHORA',
        buttonClass: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_3px_12px_rgba(225,29,72,0.35)] ring-2 ring-rose-400/40 animate-pulse',
      };
    }
    if (ppm < 0.8) {
      return {
        status: 'warning_low',
        category: 'needs_dosage',
        priorityOrder: 2, // Segunda prioridad
        label: 'PRÓXIMO A DOSIFICAR',
        badgeTitle: 'Cloro bajo (0.50 a 0.79 mg/L)',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-800',
        diagnostico: 'Cloro en descenso, próximo al límite reglamentario de 0.50 mg/L. Conviene calcular recarga preventiva para mantener la protección.',
        buttonLabel: '⚡ CALCULAR DOSIS',
        buttonClass: 'bg-gradient-to-r from-amber-500 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white shadow-[0_3px_12px_rgba(245,158,11,0.3)]',
      };
    }
    if (ppm > 2.0) {
      return {
        status: 'excess',
        category: 'excess',
        priorityOrder: 3,
        label: 'SOBRE-CLORADO',
        badgeTitle: 'Exceso de cloro (> 2.00 mg/L)',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        dotColor: 'bg-purple-600',
        textColor: 'text-purple-700',
        diagnostico: 'Supera el límite máximo permisible de 2.00 mg/L. No agregar más cloro; esperar evaporación y recircular agua.',
        buttonLabel: 'REVISAR DOSIS',
        buttonClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs',
      };
    }
    return {
      status: 'optimal',
      category: 'optimal',
      priorityOrder: 4, // Óptimo
      label: 'CLORO ÓPTIMO',
      badgeTitle: 'Conforme D.S. N.° 031-2010-SA (0.80 a 2.00 mg/L)',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-800',
      diagnostico: 'Desinfección conforme según D.S. N.° 031-2010-SA (0.50 a 2.00 mg/L). Agua protegida sin necesidad de recarga inmediata.',
      buttonLabel: 'DOSIFICAR',
      buttonClass: 'bg-gradient-to-r from-[#00a6c0] to-[#008ea6] hover:from-[#10e7b2] hover:to-[#00b4d8] text-white hover:text-[#002116] shadow-2xs',
    };
  };

  // Contadores para filtros
  const counts = useMemo(() => {
    let needingDosage = 0;
    let optimal = 0;
    systems.forEach((s) => {
      const evalData = getSystemChlorineEvaluation(s.lastChlorinePpm);
      if (evalData.category === 'needs_dosage') needingDosage++;
      else if (evalData.category === 'optimal') optimal++;
    });
    return { needingDosage, optimal, total: systems.length };
  }, [systems]);

  // Ordenar inteligentemente: primero los que necesitan dosificación urgente
  const sortedSystems = useMemo(() => {
    const list = [...systems].sort((a, b) => {
      const evalA = getSystemChlorineEvaluation(a.lastChlorinePpm);
      const evalB = getSystemChlorineEvaluation(b.lastChlorinePpm);
      if (evalA.priorityOrder !== evalB.priorityOrder) {
        return evalA.priorityOrder - evalB.priorityOrder;
      }
      // Dentro de la misma categoría, ordenar por menor cloro
      return a.lastChlorinePpm - b.lastChlorinePpm;
    });

    if (filter === 'requiere_dosis') {
      return list.filter((s) => getSystemChlorineEvaluation(s.lastChlorinePpm).category === 'needs_dosage');
    }
    if (filter === 'optimos') {
      return list.filter((s) => getSystemChlorineEvaluation(s.lastChlorinePpm).category === 'optimal');
    }
    return list;
  }, [systems, filter]);

  // Mostrar los primeros 3 o todos según estado
  const displaySystems = showAll ? sortedSystems : sortedSystems.slice(0, 4);

  return (
    <section className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,103,125,0.08)] border border-[#bcc9ce]/50 transition-all">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-[#00677d] shrink-0">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <div>
              <h2 className="font-hud font-black text-[16px] sm:text-[18px] text-[#151d22] tracking-tight">
                Reservorios con Prioridad de Atención
              </h2>
            </div>
          </div>
          <p className="text-[11.5px] sm:text-[12px] text-[#5f747e] mt-1 pl-10 flex items-center gap-1.5 flex-wrap">
            <span>Medición de <strong>Cloro Residual Libre</strong> (Norma D.S. N.° 031-2010-SA: <strong>0.50 - 2.00 mg/L</strong>).</span>
            <span className="text-[#00677d] font-bold">Identifique cuál requiere cálculo de dosificación.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={onAddNewSystem || handleViewAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#00677d]/35 hover:border-transparent text-[#00677d] hover:text-white font-hud font-bold text-[11.5px] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 hover:shadow-[0_4px_16px_rgba(0,180,216,0.35)] transition-all duration-300 cursor-pointer active:scale-95 shadow-2xs"
            title="Registrar nuevo reservorio o cisterna"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Nuevo Sistema</span>
          </button>

          {handleViewAll && (
            <button
              type="button"
              onClick={handleViewAll}
              className="text-[#00677d] hover:text-[#00b4d8] hover:bg-cyan-50/80 px-2.5 py-1.5 rounded-full font-hud font-bold text-[11.5px] transition-all duration-200 cursor-pointer flex items-center gap-1"
            >
              <span>Ver todos ({systems.length})</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros rápidos y Leyenda de Dosificación */}
      <div className="mt-3.5 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/70">
        {/* Filtros rápidos por estado */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-hud font-bold text-slate-500 uppercase tracking-wider mr-1">
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setFilter('todos')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-hud font-bold transition-all cursor-pointer ${
              filter === 'todos'
                ? 'bg-[#00677d] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todos ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('requiere_dosis')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-hud font-bold transition-all cursor-pointer ${
              filter === 'requiere_dosis'
                ? 'bg-rose-600 text-white shadow-2xs'
                : counts.needingDosage > 0
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Requieren Dosificar ({counts.needingDosage})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('optimos')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-hud font-bold transition-all cursor-pointer ${
              filter === 'optimos'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Óptimos ({counts.optimal})</span>
          </button>
        </div>

        {/* Leyenda Guía rápida */}
        <div className="flex items-center gap-3 text-[10.5px] font-hud text-slate-600 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>&lt; 0.50: Dosis urgente</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>0.50 - 0.79: Preventivo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>0.80 - 2.00: Conforme</span>
          </div>
        </div>
      </div>

      {/* Listado de Reservorios */}
      <div className="divide-y divide-slate-100">
        {displaySystems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-hud text-[13px]">
            No hay reservorios en esta categoría.
          </div>
        ) : (
          displaySystems.map((sys) => {
            const evalData = getSystemChlorineEvaluation(sys.lastChlorinePpm);

            return (
              <div
                key={sys.id}
                className={`py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-slate-50/70 -mx-2 px-3 rounded-2xl transition-all duration-200 border-l-4 ${
                  evalData.status === 'critical_low'
                    ? 'border-l-rose-500 bg-rose-50/20'
                    : evalData.status === 'warning_low'
                    ? 'border-l-amber-500 bg-amber-50/15'
                    : 'border-l-emerald-500'
                }`}
              >
                {/* Lado Izquierdo: Medición Clara de Cloro + Identificación del Reservorio */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  {/* Tarjeta de Medición de Cloro Destacada */}
                  <div
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl font-hud shrink-0 border shadow-2xs min-w-[76px] sm:min-w-[84px] text-center ${evalData.badgeBg}`}
                    title={evalData.badgeTitle}
                  >
                    <span className="text-[8.5px] uppercase font-bold tracking-wider opacity-85 leading-tight">
                      CLORO LIBRE
                    </span>
                    <span className="text-[18px] sm:text-[20px] font-black leading-none my-0.5 tracking-tight">
                      {sys.lastChlorinePpm.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-bold opacity-80 leading-none">
                      mg/L (ppm)
                    </span>
                  </div>

                  {/* Datos del Reservorio y Diagnóstico de Dosificación */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-hud font-extrabold text-[14px] sm:text-[15.5px] text-[#151d22] tracking-tight">
                        {sys.name}
                      </h3>
                      {/* Badge de necesidad de dosificación */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-hud font-black uppercase tracking-wider border ${evalData.badgeBg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${evalData.dotColor}`}></span>
                        <span>{evalData.label}</span>
                      </span>
                    </div>

                    {/* Ubicación, capacidad y operador */}
                    <p className="text-[11px] sm:text-[12px] text-[#5f747e] truncate mt-0.5">
                      <span className="font-semibold text-slate-700">{sys.location}</span> • {sys.capacityLiters.toLocaleString()} L • Operador: {sys.operator}
                    </p>

                    {/* Explicación Técnica Sanitaria: Diagnóstico de por qué dosificar */}
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-sans">
                      <span className="material-symbols-outlined text-[15px] shrink-0 text-slate-400">
                        info
                      </span>
                      <span className={`${evalData.textColor} font-medium leading-tight`}>
                        {evalData.diagnostico}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lado Derecho: Botón de Acción para Dosificar */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-1 md:pt-0 pl-12 md:pl-0">
                  <button
                    type="button"
                    onClick={() => onSelectSystemForDosage(sys.id)}
                    className={`font-hud font-black text-[11.5px] sm:text-[12px] uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${evalData.buttonClass}`}
                    title={`Abrir calculadora de dosificación de cloro para ${sys.name}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">calculate</span>
                    <span>{evalData.buttonLabel}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botón inferior si hay más de 4 reservorios y no se muestran todos */}
      {sortedSystems.length > 4 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-[#00677d] hover:text-[#00b4d8] font-hud font-bold text-[12px] flex items-center gap-1 px-3 py-1 rounded-full hover:bg-cyan-50/70 transition-all cursor-pointer"
          >
            <span>{showAll ? 'Mostrar menos' : `Mostrar los ${sortedSystems.length} reservorios`}</span>
            <span className="material-symbols-outlined text-[16px]">
              {showAll ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};


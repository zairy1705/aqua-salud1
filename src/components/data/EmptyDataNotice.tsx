import React from 'react';

interface EmptyDataNoticeProps {
  title?: string;
  moduleName: string;
  filterDescription?: string;
  suggestion?: string;
  onResetFilters?: () => void;
}

export const EmptyDataNotice: React.FC<EmptyDataNoticeProps> = ({
  title = 'Sin datos suficientes',
  moduleName,
  filterDescription,
  suggestion = 'Pruebe ampliando el rango de fechas, seleccionando "Todos los distritos" o verificando los puntos de muestreo en el sistema.',
  onResetFilters,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-3 animate-in fade-in duration-200">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
        ⚠️
      </div>
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-hud font-bold text-slate-800 tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          No existen registros analíticos u observaciones suficientes para el módulo de{' '}
          <strong className="text-slate-700">{moduleName}</strong>
          {filterDescription ? ` bajo los criterios actuales (${filterDescription})` : ''}.
        </p>
      </div>

      <div className="text-[11px] text-slate-400 max-w-md mx-auto italic">
        {suggestion}
      </div>

      {onResetFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-hud font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  );
};

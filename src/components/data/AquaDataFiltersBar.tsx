import React from 'react';
import { AquaDataFilters } from '../../types';

interface AquaDataFiltersBarProps {
  filters: AquaDataFilters;
  onChangeFilters: (newFilters: AquaDataFilters) => void;
  availableRegions: string[];
  availableProvincias: string[];
  availableDistritos: string[];
  availableJass: string[];
  availableSistemas: string[];
  activeCount: number;
}

export const AquaDataFiltersBar: React.FC<AquaDataFiltersBarProps> = ({
  filters,
  onChangeFilters,
  availableRegions,
  availableProvincias,
  availableDistritos,
  availableJass,
  availableSistemas,
  activeCount,
}) => {
  const handleChange = (field: keyof AquaDataFilters, value: any) => {
    const updated = { ...filters, [field]: value };

    // Cascading resets
    if (field === 'region' && value === 'todos') {
      updated.provincia = 'todos';
      updated.distrito = 'todos';
    }
    if (field === 'provincia' && value === 'todos') {
      updated.distrito = 'todos';
    }

    onChangeFilters(updated);
  };

  const resetAll = () => {
    onChangeFilters({
      region: 'todos',
      provincia: 'todos',
      distrito: 'todos',
      jass: 'todos',
      sistema: 'todos',
      fechaPreset: 'todos',
      fechaInicio: '',
      fechaFin: '',
      parametro: 'todos',
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-sm font-bold">
            🔍
          </span>
          <span className="font-hud text-xs font-bold uppercase tracking-wider text-slate-900">
            Filtros Analíticos Territoriales
          </span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-hud font-bold">
              {activeCount} activo(s)
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="text-[11px] font-hud font-bold text-teal-700 hover:text-teal-900 hover:underline transition-colors cursor-pointer"
          >
            Limpiar Todos los Filtros
          </button>
        )}
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {/* 1. Región */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            1. Región
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todas las Regiones</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Provincia */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            2. Provincia
          </label>
          <select
            value={filters.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todas las Provincias</option>
            {availableProvincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Distrito */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            3. Distrito
          </label>
          <select
            value={filters.distrito}
            onChange={(e) => handleChange('distrito', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todos los Distritos</option>
            {availableDistritos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 4. JASS */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            4. JASS (Comunal)
          </label>
          <select
            value={filters.jass}
            onChange={(e) => handleChange('jass', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todas las JASS</option>
            {availableJass.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Sistema */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            5. Sistema de Agua
          </label>
          <select
            value={filters.sistema}
            onChange={(e) => handleChange('sistema', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todos los Sistemas</option>
            {availableSistemas.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Fecha */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            6. Período / Fecha
          </label>
          <select
            value={filters.fechaPreset}
            onChange={(e) => handleChange('fechaPreset', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todo el Histórico</option>
            <option value="ultimos_7_dias">Últimos 7 días</option>
            <option value="ultimos_30_dias">Últimos 30 días</option>
            <option value="ultimos_90_dias">Últimos 90 días</option>
            <option value="ano_actual">Año 2026</option>
            <option value="personalizado">Personalizado...</option>
          </select>
        </div>

        {/* 7. Parámetro */}
        <div>
          <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase mb-1 truncate">
            7. Parámetro
          </label>
          <select
            value={filters.parametro}
            onChange={(e) => handleChange('parametro', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-hud"
          >
            <option value="todos">Todos los Parámetros</option>
            <optgroup label="Desinfección">
              <option value="cloro">Cloro Residual Libre (DPD)</option>
            </optgroup>
            <optgroup label="Microbiológicos">
              <option value="ecoli">Escherichia coli</option>
              <option value="coliformes">Coliformes Totales</option>
            </optgroup>
            <optgroup label="Fisicoquímicos">
              <option value="turbidez">Turbidez (NTU)</option>
              <option value="ph">pH</option>
              <option value="conductividad">Conductividad Eléctrica</option>
              <option value="dureza">Dureza Total</option>
            </optgroup>
            <optgroup label="Metales Pesados">
              <option value="arsenico">Arsénico Total (As)</option>
              <option value="plomo">Plomo Total (Pb)</option>
              <option value="cadmio">Cadmio Total (Cd)</option>
              <option value="mercurio">Mercurio Total (Hg)</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Custom Date Range if selected */}
      {filters.fechaPreset === 'personalizado' && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-500 font-hud font-bold">Rango de Fechas:</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Desde:</span>
            <input
              type="date"
              value={filters.fechaInicio || ''}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Hasta:</span>
            <input
              type="date"
              value={filters.fechaFin || ''}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};

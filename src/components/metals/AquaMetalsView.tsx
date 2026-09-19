import React, { useState, useMemo } from 'react';
import {
  WaterSample,
  LabResultEntry,
  MetalParameterDefinition,
  WaterSystem,
} from '../../types';
import {
  getMetalsCatalog,
  computeMetalAlerts,
} from '../../data/metalsData';
import { RegisterMetalResultModal } from './RegisterMetalResultModal';
import { MetalsConfigModal } from './MetalsConfigModal';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface AquaMetalsViewProps {
  samples: WaterSample[];
  systems: WaterSystem[];
  onUpdateSamples: (updated: WaterSample[]) => void;
  onNavigateToLab?: () => void;
  onNavigateToRisk?: () => void;
  onNavigateToAlerts?: () => void;
  activeOperatorName?: string;
}

type MetalsSubTab = 'tendencia' | 'sistemas' | 'territorial' | 'alertas' | 'resultados';

export const AquaMetalsView: React.FC<AquaMetalsViewProps> = ({
  samples,
  systems,
  onUpdateSamples,
  onNavigateToLab,
  onNavigateToRisk,
  onNavigateToAlerts,
  activeOperatorName = 'Ing. Químico Fernando Rojas',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MetalsSubTab>('tendencia');
  const [catalog, setCatalog] = useState<MetalParameterDefinition[]>(() => getMetalsCatalog());
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [selectedSampleForNew, setSelectedSampleForNew] = useState<string | undefined>(undefined);

  // Filters for sub-views
  const [selectedParamId, setSelectedParamId] = useState<string>('arsenico');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [complianceFilter, setComplianceFilter] = useState<string>('all');

  // Compute metal alerts
  const metalAlerts = useMemo(() => {
    return computeMetalAlerts(samples, catalog);
  }, [samples, catalog]);

  // Extract all metal results from samples
  const allMetalResults = useMemo(() => {
    const list: {
      sample: WaterSample;
      result: LabResultEntry;
      paramDef?: MetalParameterDefinition;
    }[] = [];

    samples.forEach((sample) => {
      sample.results.forEach((res) => {
        if (res.category === 'inorganico_metales') {
          const paramDef = catalog.find(
            (p) =>
              p.id.toLowerCase() === res.parameter.toLowerCase() ||
              p.name.toLowerCase() === res.parameter.toLowerCase() ||
              res.parameter.toLowerCase().includes(p.name.toLowerCase()) ||
              res.parameter.toLowerCase().includes(p.symbol.toLowerCase())
          );
          list.push({ sample, result: res, paramDef });
        }
      });
    });

    return list.sort((a, b) => new Date(b.sample.date).getTime() - new Date(a.sample.date).getTime());
  }, [samples, catalog]);

  // Currently selected parameter definition
  const currentParamDef = useMemo(() => {
    return catalog.find((p) => p.id === selectedParamId) || catalog[0];
  }, [catalog, selectedParamId]);

  // Filtered results for historical trend of selected parameter
  const trendData = useMemo(() => {
    const pId = currentParamDef.id.toLowerCase();
    const pName = currentParamDef.name.toLowerCase();
    const pSymbol = currentParamDef.symbol.toLowerCase();

    return allMetalResults
      .filter((item) => {
        const matchesParam =
          item.paramDef?.id === currentParamDef.id ||
          item.result.parameter.toLowerCase().includes(pName) ||
          item.result.parameter.toLowerCase().includes(pSymbol) ||
          item.result.parameter.toLowerCase() === pId;

        const matchesSystem =
          selectedSystemFilter === 'all' || item.sample.systemId === selectedSystemFilter;

        return matchesParam && matchesSystem;
      })
      .sort((a, b) => new Date(a.sample.date).getTime() - new Date(b.sample.date).getTime())
      .map((item) => {
        let val = item.result.numericValue;
        if (val === undefined || isNaN(val)) {
          const parsed = parseFloat(item.result.result.replace(',', '.'));
          val = isNaN(parsed) ? 0 : parsed;
        }
        return {
          date: item.sample.date,
          value: val,
          sampleCode: item.sample.code,
          systemName: item.sample.systemName,
          jassName: item.sample.jassName,
          point: item.sample.point,
          compliance: item.result.compliance,
          limit: currentParamDef.maxVal,
        };
      });
  }, [allMetalResults, currentParamDef, selectedSystemFilter]);

  // Statistics for selected parameter trend
  const trendStats = useMemo(() => {
    if (trendData.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, nonCompliantCount: 0 };
    }
    const vals = trendData.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const sum = vals.reduce((acc, v) => acc + v, 0);
    const avg = sum / vals.length;
    const nonCompliant = trendData.filter((d) => d.compliance === 'no_cumple').length;
    return {
      count: trendData.length,
      min,
      max,
      avg,
      nonCompliantCount: nonCompliant,
    };
  }, [trendData]);

  // Cross-system comparison data for selected parameter
  const systemsComparisonData = useMemo(() => {
    const pName = currentParamDef.name.toLowerCase();
    const pSymbol = currentParamDef.symbol.toLowerCase();

    // Map each system to its latest measurement
    return systems.map((sys) => {
      // Find latest result for this system and this metal
      const sysResults = allMetalResults.filter(
        (item) =>
          item.sample.systemId === sys.id &&
          (item.paramDef?.id === currentParamDef.id ||
            item.result.parameter.toLowerCase().includes(pName) ||
            item.result.parameter.toLowerCase().includes(pSymbol))
      );

      const latest = sysResults[0]; // sorted descending by date
      let numVal: number | null = null;
      let compliance: string = 'sin_datos';
      let date: string = 'Sin registro';

      if (latest) {
        let val = latest.result.numericValue;
        if (val === undefined || isNaN(val)) {
          const parsed = parseFloat(latest.result.result.replace(',', '.'));
          val = isNaN(parsed) ? 0 : parsed;
        }
        numVal = val;
        compliance = latest.result.compliance;
        date = latest.sample.date;
      }

      return {
        systemId: sys.id,
        systemName: sys.name,
        jassName: sys.jassName,
        value: numVal,
        compliance,
        date,
        limit: currentParamDef.maxVal,
      };
    });
  }, [systems, allMetalResults, currentParamDef]);

  // Territorial aggregation by JASS
  const territorialData = useMemo(() => {
    // Unique JASSes across samples
    const jassMap = new Map<
      string,
      {
        jassName: string;
        origin: string;
        totalMetalTests: number;
        compliantTests: number;
        nonCompliantTests: number;
        unregulatedTests: number;
        detectedMetals: Set<string>;
        highestRiskSeverity: string;
        criticalAlertsCount: number;
      }
    >();

    allMetalResults.forEach(({ sample, result, paramDef }) => {
      const key = sample.jassName;
      if (!jassMap.has(key)) {
        jassMap.set(key, {
          jassName: sample.jassName,
          origin: sample.origin,
          totalMetalTests: 0,
          compliantTests: 0,
          nonCompliantTests: 0,
          unregulatedTests: 0,
          detectedMetals: new Set(),
          highestRiskSeverity: 'sin_riesgo',
          criticalAlertsCount: 0,
        });
      }

      const rec = jassMap.get(key)!;
      rec.totalMetalTests++;
      if (result.compliance === 'cumple') rec.compliantTests++;
      else if (result.compliance === 'no_cumple') {
        rec.nonCompliantTests++;
        rec.criticalAlertsCount++;
      } else if (result.compliance === 'sin_norma') {
        rec.unregulatedTests++;
      }

      if (paramDef) {
        rec.detectedMetals.add(paramDef.symbol);
      }
    });

    return Array.from(jassMap.values());
  }, [allMetalResults]);

  // Overall compliance rate (respecting rule: exclude unconfigured params)
  const complianceStats = useMemo(() => {
    const regulatedResults = allMetalResults.filter(
      (item) => item.result.compliance === 'cumple' || item.result.compliance === 'no_cumple'
    );
    const totalRegulated = regulatedResults.length;
    const compliant = regulatedResults.filter((item) => item.result.compliance === 'cumple').length;
    const rate = totalRegulated > 0 ? (compliant / totalRegulated) * 100 : 100;
    const unregulated = allMetalResults.filter((item) => item.result.compliance === 'sin_norma').length;

    return {
      totalTests: allMetalResults.length,
      totalRegulated,
      compliant,
      rate,
      unregulated,
      criticalAlerts: metalAlerts.filter((a) => a.alertType === 'critica').length,
      preventiveAlerts: metalAlerts.filter((a) => a.alertType === 'preventiva').length,
    };
  }, [allMetalResults, metalAlerts]);

  // Handler to save new metal test
  const handleSaveMetalResult = (sampleId: string, resultEntry: LabResultEntry) => {
    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          results: [...s.results, resultEntry],
        };
      }
      return s;
    });

    onUpdateSamples(updated);
    try {
      localStorage.setItem('cloragua_lab_samples', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error persisting samples:', e);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-cyan-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide">
              <span className="material-symbols-outlined text-sm text-cyan-400">science</span>
              FASE 5 • AQUA-METALS • VIGILANCIA TOXICOLÓGICA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Vigilancia de Metales y Elementos Traza
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Monitoreo analítico y toxicológico de 10 parámetros inorgánicos (As, Pb, Cd, Hg, Cr, Ni, Cu, Zn, Fe, Mn) y elementos configurables. Cumplimiento estricto del D.S. N.° 031-2010-SA.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              onClick={() => {
                setSelectedSampleForNew(samples[0]?.id);
                setIsRegisterOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-cyan-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Registrar Ensayo de Metal
            </button>

            <button
              onClick={() => setIsConfigOpen(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white text-xs sm:text-sm font-semibold rounded-xl border border-cyan-400/30 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Configurar Parámetros
            </button>

            {onNavigateToLab && (
              <button
                onClick={onNavigateToLab}
                className="px-3 py-2.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-all flex items-center gap-1"
                title="Ir al Laboratorio Digital AQUA-LAB"
              >
                <span className="material-symbols-outlined text-sm">biotech</span>
                AQUA-LAB
              </button>
            )}
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-700/80">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Parámetros en Catálogo
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {catalog.length}
              </span>
              <span className="text-[10.5px] text-cyan-300">
                (10 Estándar + {catalog.length - 10} Custom)
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Ensayos Ejecutados
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {complianceStats.totalTests}
              </span>
              <span className="text-[10.5px] text-slate-400">
                analizados
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Alertas Toxicológicas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-xl sm:text-2xl font-black font-mono ${
                  complianceStats.criticalAlerts > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {metalAlerts.length}
              </span>
              <span className="text-[10.5px] text-rose-300">
                ({complianceStats.criticalAlerts} Críticas / {complianceStats.preventiveAlerts} Prev.)
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              Conformidad LMP Legal
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {complianceStats.rate.toFixed(1)}%
              </span>
              <span className="text-[10.5px] text-slate-400">
                ({complianceStats.unregulated} sin norma)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('tendencia')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'tendencia'
              ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">show_chart</span>
          Tendencia Histórica
        </button>

        <button
          onClick={() => setActiveSubTab('sistemas')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'sistemas'
              ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">compare_arrows</span>
          Comparación por Sistemas
        </button>

        <button
          onClick={() => setActiveSubTab('territorial')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'territorial'
              ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">map</span>
          Comparación Territorial
        </button>

        <button
          onClick={() => setActiveSubTab('alertas')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'alertas'
              ? 'bg-white text-rose-700 shadow-sm border border-rose-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span className="material-symbols-outlined text-base text-rose-600">notifications_active</span>
          Alertas ({metalAlerts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('resultados')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'resultados'
              ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <span className="material-symbols-outlined text-base">table_chart</span>
          Registro Maestro ({allMetalResults.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: TENDENCIA HISTÓRICA */}
      {/* ========================================================================= */}
      {activeSubTab === 'tendencia' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Parámetro de Ensayo
                </label>
                <select
                  value={selectedParamId}
                  onChange={(e) => setSelectedParamId(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {catalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.symbol}) {p.isCustom ? '★' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Filtrar por Sistema
                </label>
                <select
                  value={selectedSystemFilter}
                  onChange={(e) => setSelectedSystemFilter(e.target.value)}
                  className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="all">Todos los Sistemas Hidráulicos</option>
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.jassName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parameter Info Chip */}
            <div className="text-right text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-700">Límite Legal (LMP): </span>
              {currentParamDef.hasConfiguredNorm && currentParamDef.normativeLimit ? (
                <span className="font-mono font-extrabold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  {currentParamDef.normativeLimit}
                </span>
              ) : (
                <span className="text-blue-700 italic font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Sin norma configurada (No regulado)
                </span>
              )}
              <div className="text-[10px] text-slate-500 mt-1">
                Método Oficial: {currentParamDef.defaultMethod.split('/')[0]}
              </div>
            </div>
          </div>

          {/* Rule Reminder if no standard is configured */}
          {!currentParamDef.hasConfiguredNorm && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-base">info</span>
              <span>
                <strong>Regla de Estatus Neutral:</strong> No existe una norma legal configurada para{' '}
                <strong>{currentParamDef.name}</strong>; por lo tanto, la gráfica histórica muestra los resultados analíticos reales sin asumir umbrales arbitrarios de legalidad ni ilegalidad.
              </span>
            </div>
          )}

          {/* Trend Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                  Evolución Cronológica de {currentParamDef.name} ({currentParamDef.symbol})
                </h3>
                <p className="text-xs text-slate-500">
                  Valores expresados en {currentParamDef.defaultUnit} a través de las fechas de muestreo
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {trendData.length} mediciones registradas
              </span>
            </div>

            {trendData.length > 0 ? (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, (currentParamDef.maxVal || 0) * 1.25)]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                              <p className="font-bold text-cyan-300">
                                {data.jassName} - {data.systemName}
                              </p>
                              <p className="text-slate-300">Fecha: {data.date}</p>
                              <p className="text-slate-300">Punto: {data.point}</p>
                              <p className="font-mono text-sm font-black text-white">
                                {data.value} {currentParamDef.defaultUnit}
                              </p>
                              {currentParamDef.hasConfiguredNorm && (
                                <p
                                  className={`text-[10.5px] font-bold ${
                                    data.compliance === 'cumple'
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                                  }`}
                                >
                                  {data.compliance === 'cumple'
                                    ? '✓ CUMPLE LMP'
                                    : '⚠️ SUPERA LMP'}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {currentParamDef.hasConfiguredNorm && currentParamDef.maxVal !== undefined && (
                      <ReferenceLine
                        y={currentParamDef.maxVal}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          value: `LMP: ${currentParamDef.maxVal} ${currentParamDef.defaultUnit}`,
                          fill: '#ef4444',
                          fontSize: 11,
                          position: 'top',
                        }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0891b2"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#06b6d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">science</span>
                <p>No se registran ensayos para {currentParamDef.name} en el filtro seleccionado.</p>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="mt-3 text-cyan-600 font-bold hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <span className="material-symbols-outlined text-sm">add</span> Registrar primera medición
                </button>
              </div>
            )}
          </div>

          {/* Statistical KPI Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Mínimo Medido</span>
              <p className="text-lg font-black text-slate-800 font-mono mt-0.5">
                {trendStats.count > 0 ? `${trendStats.min} ${currentParamDef.defaultUnit}` : '—'}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Máximo Medido</span>
              <p className="text-lg font-black text-slate-800 font-mono mt-0.5">
                {trendStats.count > 0 ? `${trendStats.max} ${currentParamDef.defaultUnit}` : '—'}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Promedio Aritmético</span>
              <p className="text-lg font-black text-slate-800 font-mono mt-0.5">
                {trendStats.count > 0 ? `${trendStats.avg.toFixed(4)} ${currentParamDef.defaultUnit}` : '—'}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Superaciones LMP</span>
              <p
                className={`text-lg font-black font-mono mt-0.5 ${
                  trendStats.nonCompliantCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {currentParamDef.hasConfiguredNorm
                  ? `${trendStats.nonCompliantCount} (${trendStats.count > 0 ? ((trendStats.nonCompliantCount / trendStats.count) * 100).toFixed(0) : 0}%)`
                  : 'No aplica (Sin LMP)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: COMPARACIÓN POR SISTEMAS */}
      {/* ========================================================================= */}
      {activeSubTab === 'sistemas' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Comparativa Simultánea de Sistemas de Agua
              </h3>
              <p className="text-xs text-slate-500">
                Concentración del metal en la última medición efectuada en cada sistema hidráulico
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Parámetro:</span>
              <select
                value={selectedParamId}
                onChange={(e) => setSelectedParamId(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {catalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Systems Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nivel de {currentParamDef.name} por Sistema (Última Medición)
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={systemsComparisonData.filter((d) => d.value !== null)}
                  margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="systemName"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow text-xs space-y-1">
                            <p className="font-bold text-cyan-300">{d.systemName}</p>
                            <p className="text-slate-300">JASS: {d.jassName}</p>
                            <p className="font-mono text-sm font-black">
                              {d.value} {currentParamDef.defaultUnit}
                            </p>
                            <p className="text-[10px] text-slate-400">Fecha: {d.date}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {currentParamDef.hasConfiguredNorm && currentParamDef.maxVal !== undefined && (
                    <ReferenceLine
                      y={currentParamDef.maxVal}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      label={{
                        value: `LMP (${currentParamDef.maxVal})`,
                        fill: '#ef4444',
                        fontSize: 10,
                        position: 'top',
                      }}
                    />
                  )}
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {systemsComparisonData.map((entry, index) => {
                      let color = '#0891b2'; // default cyan
                      if (entry.compliance === 'no_cumple') color = '#ef4444'; // red
                      else if (entry.compliance === 'cumple') color = '#10b981'; // green
                      else if (entry.compliance === 'sin_norma') color = '#3b82f6'; // blue neutral
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Systems Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3.5">Sistema Hidráulico</th>
                  <th className="py-3 px-3">JASS Responsable</th>
                  <th className="py-3 px-3">Último Ensayo</th>
                  <th className="py-3 px-3">Concentración</th>
                  <th className="py-3 px-3">Criterio Normativo</th>
                  <th className="py-3 px-3">Estatus de Cumplimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {systemsComparisonData.map((item) => (
                  <tr key={item.systemId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {item.systemName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {item.jassName}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {item.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {item.value !== null ? `${item.value} ${currentParamDef.defaultUnit}` : 'Sin ensayo'}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {currentParamDef.normativeLimit || 'Sin norma configurada'}
                    </td>
                    <td className="py-3 px-3">
                      {item.compliance === 'cumple' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          CUMPLE LMP
                        </span>
                      )}
                      {item.compliance === 'no_cumple' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          EXCEDE LMP
                        </span>
                      )}
                      {item.compliance === 'sin_norma' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-xs">info</span>
                          SIN NORMA (No Calificado)
                        </span>
                      )}
                      {item.compliance === 'sin_datos' && (
                        <span className="text-slate-400 italic text-[11px]">Pendiente de muestreo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: COMPARACIÓN TERRITORIAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'territorial' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              Matriz de Vulnerabilidad Territorial y Elementos Traza
            </h3>
            <p className="text-xs text-slate-500">
              Evaluación geoespacial por jurisdicción comunal (JASS) y estratos hidrogeológicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territorialData.map((t) => {
              const complianceRate =
                t.totalMetalTests > 0
                  ? ((t.compliantTests / (t.compliantTests + t.nonCompliantTests || 1)) * 100).toFixed(0)
                  : '100';

              return (
                <div
                  key={t.jassName}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{t.jassName}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-cyan-600">location_on</span>
                        {t.origin}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        t.criticalAlertsCount > 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.criticalAlertsCount > 0 ? `${t.criticalAlertsCount} Alerta Crítica` : 'Conforme'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Ensayos</span>
                      <p className="text-sm font-black text-slate-800 font-mono">{t.totalMetalTests}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Conformidad</span>
                      <p className="text-sm font-black text-emerald-600 font-mono">{complianceRate}%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sin Norma</span>
                      <p className="text-sm font-black text-blue-600 font-mono">{t.unregulatedTests}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Elementos Caracterizados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(t.detectedMetals).map((sym) => (
                        <span
                          key={sym}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[11px] font-mono font-bold rounded-lg border border-slate-200"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Vulnerabilidad Geoespacial:</span>{' '}
                    {t.criticalAlertsCount > 0
                      ? 'Zona de mineralización andina con riesgo de arsénico geogénico. Requiere monitoreo continuo.'
                      : 'Zona con matriz basal estable y baja lixiviación de metales pesados.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: ALERTAS TOXICOLÓGICAS (AQUA-ALERT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'alertas' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-lg">emergency</span>
                Panel de Alertas Toxicológicas • AQUA-ALERT Metales
              </h3>
              <p className="text-xs text-slate-500">
                Detección automática de superaciones de LMP y concentraciones en umbral preventivo (≥ 80% LMP)
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              {metalAlerts.length} Eventos Detectados
            </span>
          </div>

          {metalAlerts.length > 0 ? (
            <div className="space-y-3.5">
              {metalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition-all ${
                    alert.alertType === 'critica'
                      ? 'bg-gradient-to-br from-rose-50/90 to-white border-rose-200'
                      : alert.alertType === 'preventiva'
                      ? 'bg-gradient-to-br from-amber-50/90 to-white border-amber-200'
                      : 'bg-gradient-to-br from-slate-50 to-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            alert.alertType === 'critica'
                              ? 'bg-rose-600 text-white'
                              : alert.alertType === 'preventiva'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          {alert.alertType === 'critica'
                            ? 'ALERTA CRÍTICA'
                            : alert.alertType === 'preventiva'
                            ? 'VIGILANCIA PREVENTIVA'
                            : 'ALERTA ORGANOLÉPTICA'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          [{alert.sampleCode}]
                        </span>
                        <span className="text-xs text-slate-500">{alert.date}</span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900">
                        {alert.parameterName} ({alert.symbol}): {alert.resultValue} {alert.unit} vs LMP {alert.limitText}
                      </h4>

                      <p className="text-xs text-slate-600">
                        <strong>Ubicación:</strong> {alert.jassName} • {alert.systemName} ({alert.point})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                        Exceso:{' '}
                        {alert.limitValue
                          ? `${(((alert.resultValue / alert.limitValue) - 1) * 100).toFixed(1)}%`
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Impact & Protocol */}
                  <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900">Mecanismo Toxicológico:</strong>{' '}
                      {alert.description}
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <strong className="text-cyan-900 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-cyan-700">healing</span>
                        Protocolo de Mitigación y Acción Inmediata:
                      </strong>
                      <p className="text-slate-600">{alert.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-500">verified_user</span>
              <h4 className="text-sm font-bold text-slate-800">
                Sin Alertas Toxicológicas por Metales
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Todos los parámetros ensayados con norma legal configurada cumplen con los Límites Máximos Permisibles del D.S. N.° 031-2010-SA.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: REGISTRO MAESTRO DE RESULTADOS */}
      {/* ========================================================================= */}
      {activeSubTab === 'resultados' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar por muestra, metal, analista o JASS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
                  search
                </span>
              </div>

              <select
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
                className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="all">Todos los Cumplimientos</option>
                <option value="cumple">Cumple LMP</option>
                <option value="no_cumple">No Cumple (Excede)</option>
                <option value="sin_norma">Sin Norma Configurada</option>
              </select>
            </div>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nuevo Ensayo
            </button>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Muestra / Origen</th>
                    <th className="py-3 px-3">Parámetro</th>
                    <th className="py-3 px-2">Resultado</th>
                    <th className="py-3 px-2">Unidad</th>
                    <th className="py-3 px-3">Método / Equipo</th>
                    <th className="py-3 px-3">Analista</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3">Criterio</th>
                    <th className="py-3 px-3">Cumplimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allMetalResults
                    .filter(({ sample, result }) => {
                      const matchSearch =
                        !searchTerm ||
                        sample.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sample.jassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.analyst.toLowerCase().includes(searchTerm.toLowerCase());

                      const matchCompliance =
                        complianceFilter === 'all' || result.compliance === complianceFilter;

                      return matchSearch && matchCompliance;
                    })
                    .map(({ sample, result, paramDef }) => (
                      <tr key={result.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 font-mono text-[11px]">
                            {sample.code}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {sample.jassName}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {result.parameter}
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-900">
                          {result.result}
                        </td>
                        <td className="py-3 px-2 font-mono text-[11px] text-slate-600">
                          {result.unit}
                        </td>
                        <td className="py-3 px-3 text-[10.5px] text-slate-600 max-w-[180px] truncate" title={`${result.method} | ${result.equipment}`}>
                          <div>{result.method}</div>
                          <div className="text-slate-400 truncate">{result.equipment}</div>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600">
                          {result.analyst}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {result.date.slice(0, 10)}
                        </td>
                        <td className="py-3 px-3 text-[10.5px] text-slate-600 font-mono">
                          {result.configuredCriteria}
                        </td>
                        <td className="py-3 px-3">
                          {result.compliance === 'cumple' && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              ✓ CUMPLE
                            </span>
                          )}
                          {result.compliance === 'no_cumple' && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full animate-pulse">
                              ⚠️ SUPERA LMP
                            </span>
                          )}
                          {result.compliance === 'sin_norma' && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                              ℹ️ SIN NORMA
                            </span>
                          )}
                          {result.compliance === 'referencial' && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              REFERENCIAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <RegisterMetalResultModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        samples={samples}
        preselectedSampleId={selectedSampleForNew}
        onSaveResult={handleSaveMetalResult}
        defaultAnalystName={activeOperatorName}
      />

      <MetalsConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onCatalogUpdated={(newCat) => setCatalog(newCat)}
      />
    </div>
  );
};

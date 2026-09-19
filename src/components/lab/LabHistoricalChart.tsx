import React, { useState, useMemo } from 'react';
import { WaterSample, LabResultEntry } from '../../types';
import { STANDARD_LAB_PARAMETERS } from '../../data/mockLabData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

interface LabHistoricalChartProps {
  samples: WaterSample[];
  selectedJassId?: string;
  selectedSystemId?: string;
}

export const LabHistoricalChart: React.FC<LabHistoricalChartProps> = ({
  samples,
  selectedJassId,
  selectedSystemId,
}) => {
  // Available parameters for historical charts
  const availableParameters = useMemo(() => {
    const set = new Set<string>();
    samples.forEach((s) => {
      s.results.forEach((r) => {
        set.add(r.parameter);
      });
    });

    // Default primary parameters always included
    const defaults = [
      'Cloro Residual Libre',
      'Potencial de Hidrógeno (pH)',
      'Turbiedad',
      'Conductividad Eléctrica (25°C)',
      'Coliformes Totales',
      'Escherichia coli (E. coli)',
      'Dureza Total (como CaCO3)',
      'Bacterias Heterotróficas',
    ];

    defaults.forEach((d) => set.add(d));
    return Array.from(set);
  }, [samples]);

  const [selectedParamName, setSelectedParamName] = useState<string>('Cloro Residual Libre');
  const [jassFilter, setJassFilter] = useState<string>(selectedJassId || 'all');
  const [pointFilter, setPointFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Param definition from standards catalogue
  const paramDef = useMemo(() => {
    return (
      STANDARD_LAB_PARAMETERS.find(
        (p) => p.name.toLowerCase() === selectedParamName.toLowerCase() || p.id === selectedParamName
      ) || STANDARD_LAB_PARAMETERS[0]
    );
  }, [selectedParamName]);

  // Unique JASSes and sampling points
  const uniqueJasses = useMemo(() => {
    const map = new Map<string, string>();
    samples.forEach((s) => {
      if (s.jassId && s.jassName) map.set(s.jassId, s.jassName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [samples]);

  const availablePoints = useMemo(() => {
    const points = new Set<string>();
    samples.forEach((s) => {
      if (jassFilter === 'all' || s.jassId === jassFilter) {
        if (s.point) points.add(s.point);
      }
    });
    return Array.from(points);
  }, [samples, jassFilter]);

  // Extract all points for the selected parameter across timeline
  const historicalData = useMemo(() => {
    interface PointItem {
      date: string;
      rawDate: string;
      sampleCode: string;
      jassName: string;
      systemName: string;
      point: string;
      resultRaw: string;
      value: number | null;
      compliance: string;
      complianceNote: string;
      healthRisk: string;
      healthRiskDescription: string;
      analyst: string;
      unit: string;
    }

    const items: PointItem[] = [];

    // Filter samples chronologically
    const sortedSamples = [...samples].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateA - dateB;
    });

    sortedSamples.forEach((sample) => {
      if (jassFilter !== 'all' && sample.jassId !== jassFilter) return;
      if (pointFilter !== 'all' && sample.point !== pointFilter) return;

      const matchingResult = sample.results.find(
        (r) => r.parameter.toLowerCase() === selectedParamName.toLowerCase()
      );

      if (matchingResult) {
        let num: number | null = null;
        if (matchingResult.numericValue !== undefined && !isNaN(matchingResult.numericValue)) {
          num = matchingResult.numericValue;
        } else {
          const parsed = parseFloat(matchingResult.result.replace(',', '.'));
          if (!isNaN(parsed)) {
            num = parsed;
          } else if (matchingResult.result.toLowerCase().includes('ausente')) {
            num = 0;
          }
        }

        items.push({
          date: `${sample.date.substring(5)}`, // MM-DD for chart
          rawDate: sample.date,
          sampleCode: sample.code,
          jassName: sample.jassName,
          systemName: sample.systemName,
          point: sample.point,
          resultRaw: matchingResult.result,
          value: num,
          compliance: matchingResult.compliance || (matchingResult.compliant ? 'cumple' : 'no_cumple'),
          complianceNote: matchingResult.complianceNote || (matchingResult.compliant ? 'Cumple D.S. N.° 031-2010-SA' : 'Excede o no cumple norma'),
          healthRisk: matchingResult.healthRisk || (matchingResult.compliant ? 'sin_riesgo' : 'riesgo_alto'),
          healthRiskDescription: matchingResult.healthRiskDescription || '',
          analyst: matchingResult.analyst,
          unit: matchingResult.unit,
        });
      }
    });

    return items;
  }, [samples, selectedParamName, jassFilter, pointFilter]);

  // Summary statistics
  const stats = useMemo(() => {
    const validValues = historicalData
      .map((d) => d.value)
      .filter((v): v is number => v !== null && !isNaN(v));

    const total = historicalData.length;
    const compliantCount = historicalData.filter((d) => d.compliance === 'cumple').length;
    const nonCompliantCount = historicalData.filter((d) => d.compliance === 'no_cumple').length;
    const complianceRate = total > 0 ? Math.round((compliantCount / total) * 100) : 0;

    const avg = validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
    const min = validValues.length > 0 ? Math.min(...validValues) : 0;
    const max = validValues.length > 0 ? Math.max(...validValues) : 0;

    const last = historicalData[historicalData.length - 1];

    return {
      total,
      compliantCount,
      nonCompliantCount,
      complianceRate,
      avg: Number(avg.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      last,
    };
  }, [historicalData]);

  // Reference lines & areas based on parameter
  const thresholdConfig = useMemo(() => {
    if (paramDef.id === 'cloro_libre') {
      return {
        min: 0.5,
        max: 2.0,
        yDomain: [0, 2.5],
        unit: 'mg/L',
        safeArea: { y1: 0.5, y2: 2.0, color: 'rgba(16, 231, 178, 0.12)' },
      };
    }
    if (paramDef.id === 'ph') {
      return {
        min: 6.5,
        max: 8.5,
        yDomain: [5.5, 9.5],
        unit: 'Unidades pH',
        safeArea: { y1: 6.5, y2: 8.5, color: 'rgba(16, 231, 178, 0.12)' },
      };
    }
    if (paramDef.id === 'turbiedad') {
      return {
        max: 5.0,
        yDomain: [0, 6.5],
        unit: 'NTU',
        safeArea: { y1: 0, y2: 5.0, color: 'rgba(16, 231, 178, 0.12)' },
      };
    }
    if (paramDef.id === 'conductividad') {
      return {
        max: 1500,
        yDomain: [0, 1800],
        unit: 'µS/cm',
        safeArea: { y1: 0, y2: 1500, color: 'rgba(16, 231, 178, 0.12)' },
      };
    }
    if (paramDef.id === 'coliformes_totales' || paramDef.id === 'ecoli') {
      return {
        max: 0,
        yDomain: [0, 5],
        unit: 'NMP/100mL',
        safeArea: { y1: 0, y2: 0, color: 'rgba(16, 231, 178, 0.12)' },
      };
    }
    return {
      min: paramDef.minVal,
      max: paramDef.maxVal,
      yDomain: ['auto', 'auto'],
      unit: paramDef.defaultUnit,
    };
  }, [paramDef]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 material-symbols-outlined text-[20px]">
              monitoring
            </span>
            <div>
              <h2 className="font-hud font-black text-[18px] sm:text-[20px] text-slate-900 tracking-tight flex items-center gap-2">
                <span>VIGILANCIA HISTÓRICA & TENDENCIA ANALÍTICA</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  FASE 4
                </span>
              </h2>
              <p className="text-[12px] text-slate-500">
                Trazabilidad temporal: <strong className="text-slate-700">JASS → Sistema → Punto → Muestra</strong> con criterio normativo (D.S. N.° 031-2010-SA).
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Parameter selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-hud mb-1">
              Parámetro Analítico:
            </label>
            <select
              value={selectedParamName}
              onChange={(e) => setSelectedParamName(e.target.value)}
              className="px-3 py-1.5 text-[12px] font-bold rounded-xl border border-cyan-300 bg-cyan-50/50 text-[#003440] focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <optgroup label="Microbiología">
                {availableParameters
                  .filter((p) => {
                    const def = STANDARD_LAB_PARAMETERS.find((s) => s.name === p);
                    return def?.category === 'microbiologico';
                  })
                  .map((p) => (
                    <option key={p} value={p}>
                      🦠 {p}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Fisicoquímica">
                {availableParameters
                  .filter((p) => {
                    const def = STANDARD_LAB_PARAMETERS.find((s) => s.name === p);
                    return def?.category === 'fisicoquimico' || !def;
                  })
                  .map((p) => (
                    <option key={p} value={p}>
                      ⚗️ {p}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Inorgánicos y Metales">
                {availableParameters
                  .filter((p) => {
                    const def = STANDARD_LAB_PARAMETERS.find((s) => s.name === p);
                    return def?.category === 'inorganico_metales';
                  })
                  .map((p) => (
                    <option key={p} value={p}>
                      🔬 {p}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* JASS filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-hud mb-1">
              JASS Territorial:
            </label>
            <select
              value={jassFilter}
              onChange={(e) => {
                setJassFilter(e.target.value);
                setPointFilter('all');
              }}
              className="px-3 py-1.5 text-[12px] rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="all">Todas las JASS ({uniqueJasses.length})</option>
              {uniqueJasses.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sampling point filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-hud mb-1">
              Punto de Muestreo:
            </label>
            <select
              value={pointFilter}
              onChange={(e) => setPointFilter(e.target.value)}
              className="px-3 py-1.5 text-[12px] rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none max-w-[200px] truncate"
            >
              <option value="all">Todos los Puntos</option>
              {availablePoints.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* THREE PILLARS BANNER (Requested explicitly by Phase 4) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800">
        <div className="text-[11px] font-hud font-bold uppercase text-cyan-300 tracking-wider mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#10e7b2]">account_tree</span>
          <span>ARQUITECTURA DE EVALUACIÓN OFICIAL (SEPARACIÓN DE CRITERIOS):</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          {/* Pillar 1 */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-cyan-300 font-hud font-bold text-[11px] uppercase mb-1">
              <span className="material-symbols-outlined text-[15px]">biotech</span>
              <span>1. Resultado Analítico</span>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              Medición directa del laboratorio: <strong>{selectedParamName}</strong>. Registro cuantitativo en <strong>{paramDef.defaultUnit}</strong> mediante {paramDef.defaultMethod}.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-emerald-400 font-hud font-bold text-[11px] uppercase mb-1">
              <span className="material-symbols-outlined text-[15px]">gavel</span>
              <span>2. Cumplimiento Normativo</span>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              Criterio legal estricto: <strong className="text-white">{paramDef.normativeLimit}</strong>. Reglamentado por {paramDef.normativeArticle}.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-amber-400 font-hud font-bold text-[11px] uppercase mb-1">
              <span className="material-symbols-outlined text-[15px]">health_and_safety</span>
              <span>3. Riesgo Sanitario</span>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              {paramDef.healthRiskAlert ? (
                <span>Alerta Sanitaria: {paramDef.healthRiskAlert}</span>
              ) : (
                <span>Inocuidad garantizada en cumplimiento de parámetros de control.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards for Selected Series */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase font-hud block">
            Muestras Ensayadas
          </span>
          <div className="font-hud font-black text-[20px] text-slate-900 mt-0.5">
            {stats.total}
          </div>
          <span className="text-[10px] text-slate-400">Puntos registrados</span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[10px] font-bold text-emerald-800 uppercase font-hud block">
            Tasa Cumplimiento
          </span>
          <div className="font-hud font-black text-[20px] text-emerald-700 mt-0.5">
            {stats.complianceRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {stats.compliantCount} de {stats.total} conformes
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
          <span className="text-[10px] font-bold text-rose-800 uppercase font-hud block">
            No Cumplimientos
          </span>
          <div className="font-hud font-black text-[20px] text-rose-700 mt-0.5">
            {stats.nonCompliantCount}
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Alertas sanitarias</span>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-200">
          <span className="text-[10px] font-bold text-cyan-800 uppercase font-hud block">
            Valor Promedio
          </span>
          <div className="font-hud font-black text-[20px] text-cyan-900 mt-0.5">
            {stats.avg} <span className="text-[10.5px] font-normal">{paramDef.defaultUnit}</span>
          </div>
          <span className="text-[10px] text-cyan-700">Muestreo histórico</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase font-hud block">
            Rango Min - Max
          </span>
          <div className="font-hud font-black text-[17px] text-slate-800 mt-0.5">
            {stats.min} – {stats.max}
          </div>
          <span className="text-[10px] text-slate-400">{paramDef.defaultUnit}</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase font-hud block">
            Último Resultado
          </span>
          <div className="font-hud font-black text-[18px] text-slate-900 mt-0.5 flex items-center gap-1.5">
            <span>{stats.last ? stats.last.resultRaw : '—'}</span>
            {stats.last && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-hud font-bold ${
                  stats.last.compliance === 'cumple'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {stats.last.compliance === 'cumple' ? '✓' : '✗'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {stats.last ? stats.last.rawDate : 'Sin datos'}
          </span>
        </div>
      </div>

      {/* Recharts Historical Chart */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-hud font-bold text-[14px] text-slate-800 uppercase flex items-center gap-2">
              <span>Evolución Temporal: {selectedParamName}</span>
              <span className="text-[11px] font-normal text-slate-500 font-mono">
                ({paramDef.defaultUnit})
              </span>
            </h3>
            <span className="text-[11px] text-slate-500">
              LMP Configurado en Normativa: <strong className="text-slate-700">{paramDef.normativeLimit}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#00b4d8]" />
              <span className="text-slate-600">Resultado Medido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-emerald-500 border-dashed" />
              <span className="text-slate-600">Límite Normativo (LMP)</span>
            </div>
          </div>
        </div>

        {historicalData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2">
              show_chart
            </span>
            <p className="text-[13px] font-bold text-slate-600">
              No hay datos registrados para este parámetro en el filtro seleccionado.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Registre nuevos ensayos en las muestras para ver la curva histórica.
            </p>
          </div>
        ) : (
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={thresholdConfig.yDomain as any}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  unit={` ${paramDef.defaultUnit.split(' ')[0]}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-[11.5px] space-y-1.5 min-w-[240px]">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                            <span className="font-hud font-bold text-[#10e7b2] text-[12px]">
                              {data.sampleCode}
                            </span>
                            <span className="font-mono text-[10.5px] text-slate-400">
                              {data.rawDate}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase">JASS & Punto:</span>
                            <span className="font-semibold text-slate-200">
                              {data.jassName} • {data.point}
                            </span>
                          </div>

                          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-slate-400 text-[10.5px]">Resultado Analítico:</span>
                            <span className="font-mono font-bold text-cyan-300 text-[13px]">
                              {data.resultRaw} {data.unit}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[10.5px]">Cumplimiento:</span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-hud font-bold uppercase ${
                                data.compliance === 'cumple'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {data.compliance === 'cumple' ? '✓ CUMPLE' : '✗ NO CUMPLE'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[10.5px]">Riesgo Sanitario:</span>
                            <span
                              className={`text-[10px] font-bold uppercase ${
                                data.healthRisk === 'sin_riesgo'
                                  ? 'text-emerald-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {data.healthRisk.replace('_', ' ')}
                            </span>
                          </div>

                          {data.healthRiskDescription && (
                            <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-800 leading-tight">
                              {data.healthRiskDescription}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Normative thresholds */}
                {thresholdConfig.min !== undefined && (
                  <ReferenceLine
                    y={thresholdConfig.min}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: `LMP Mín: ${thresholdConfig.min}`,
                      fill: '#059669',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />
                )}
                {thresholdConfig.max !== undefined && (
                  <ReferenceLine
                    y={thresholdConfig.max}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: `LMP Máx: ${thresholdConfig.max}`,
                      fill: '#dc2626',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00b4d8"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: '#00677d', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#10e7b2', stroke: '#002b1f', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Relational Table: JASS -> Sistema -> Punto -> Muestra -> Resultado */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-hud font-bold text-[13px] uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">hub</span>
            <span>Trazabilidad Relacional del Parámetro (JASS → Sistema → Punto → Muestra)</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {historicalData.length} registros cronológicos
          </span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-hud text-[10.5px] uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3">Fecha & Muestra</th>
                  <th className="py-2.5 px-3">JASS & Comunidad</th>
                  <th className="py-2.5 px-3">Sistema de Agua</th>
                  <th className="py-2.5 px-3">Punto de Muestreo</th>
                  <th className="py-2.5 px-3">Resultado Analítico</th>
                  <th className="py-2.5 px-3 text-center">Cumplimiento</th>
                  <th className="py-2.5 px-3">Riesgo Sanitario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historicalData.map((item, idx) => (
                  <tr key={`${item.sampleCode}-${idx}`} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-cyan-800 text-[12px]">
                        {item.sampleCode}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.rawDate}</div>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {item.jassName}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 text-[11.5px]">
                      {item.systemName}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      {item.point}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-bold text-[13px] text-slate-900">
                      {item.resultRaw} <span className="text-[10.5px] font-normal text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {item.compliance === 'cumple' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ CUMPLE
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                          ✗ NO CUMPLE
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold uppercase ${
                          item.healthRisk === 'sin_riesgo'
                            ? 'bg-emerald-50 text-emerald-800'
                            : item.healthRisk === 'riesgo_bajo'
                            ? 'bg-amber-100 text-amber-900'
                            : item.healthRisk === 'riesgo_medio'
                            ? 'bg-orange-100 text-orange-900'
                            : 'bg-rose-100 text-rose-900 font-black'
                        }`}
                      >
                        {item.healthRisk.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[220px]" title={item.healthRiskDescription}>
                        {item.healthRiskDescription}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

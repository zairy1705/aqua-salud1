import React, { useState } from 'react';
import { 
  Droplet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calculator, 
  Eye, 
  Plus, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Activity,
  Gauge,
  Sparkles,
  Zap
} from 'lucide-react';
import { WaterSystem, SamplingRecord } from '../types';
import { evaluateChlorineNormative, getDpdColorHex } from '../utils/waterMath';

interface DashboardViewProps {
  systems: WaterSystem[];
  records: SamplingRecord[];
  onNavigateTab: (tab: any) => void;
  onOpenQuickDose: () => void;
  onOpenNewRecord: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  systems,
  records,
  onNavigateTab,
  onOpenQuickDose,
  onOpenNewRecord,
}) => {
  // Quick express calculation state
  const [expressVolM3, setExpressVolM3] = useState<number>(10);
  const [expressTargetPpm, setExpressTargetPpm] = useState<number>(1.5);
  const [expressType, setExpressType] = useState<'hth' | 'bleach'>('hth');

  // Express math
  const expressVolLiters = expressVolM3 * 1000;
  const expressPureGrams = (expressVolLiters * expressTargetPpm) / 1000;
  const expressCommercial = expressType === 'hth' 
    ? (expressPureGrams / 0.65).toFixed(1) // 65%
    : (expressPureGrams / 0.10).toFixed(0); // 10%

  // Aggregate metrics
  const totalVolumeCapacity = systems.reduce((acc, s) => acc + s.capacityLiters, 0);
  const compliantCount = records.filter((r) => r.status === 'compliant').length;
  const complianceRate = records.length > 0 ? ((compliantCount / records.length) * 100).toFixed(1) : '100.0';
  
  const avgChlorine = records.length > 0 
    ? (records.reduce((acc, r) => acc + r.freeChlorinePpm, 0) / records.length).toFixed(2)
    : '1.20';

  const avgPh = records.length > 0
    ? (records.reduce((acc, r) => acc + r.ph, 0) / records.length).toFixed(1)
    : '7.3';

  const avgTurbidity = records.length > 0
    ? (records.reduce((acc, r) => acc + r.turbidityNtu, 0) / records.length).toFixed(1)
    : '0.6';

  const latestEvaluation = evaluateChlorineNormative(parseFloat(avgChlorine));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner / Hero Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold tracking-wider bg-teal-400/20 text-teal-300 border border-teal-400/30">
                Vigilancia Sanitaria Activa
              </span>
              <span className="text-xs text-slate-300">
                Reglamento D.S. N.° 031-2010-SA
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sistema de Dosificación y Control de Calidad del Agua
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Herramienta técnica para calcular la dosificación exacta de hipoclorito de calcio o sodio en reservorios y vigilar el cloro residual libre en redes de distribución según guías MINSA/DIGESA.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                id="btn-hero-calc-dose"
                onClick={onOpenQuickDose}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Calcular Dosificación de Cloro</span>
              </button>
              <button
                id="btn-hero-hud"
                onClick={() => onNavigateTab('photometer')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 shadow-xs transition-colors"
              >
                <Eye className="w-4 h-4 text-pink-400" />
                <span>Fotómetro DPD en Vivo</span>
              </button>
            </div>
          </div>

          {/* Real-time Status Badge Box */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-700/80 shrink-0 w-full sm:w-72">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Diagnóstico Sanitario Promedio
            </span>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                latestEvaluation.status === 'compliant' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className="text-base font-extrabold text-white">
                {latestEvaluation.badgeLabel}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-baseline justify-between">
              <span className="text-xs text-slate-300">Cloro Promedio:</span>
              <span className="font-mono text-xl font-extrabold text-teal-300">
                {avgChlorine} <span className="text-xs font-normal">mg/L</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              {latestEvaluation.healthImpact}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Compliance Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cumplimiento
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {complianceRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            {compliantCount} de {records.length} conformes
          </span>
        </div>

        {/* Free Chlorine */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cloro Libre
            </span>
            <Droplet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {avgChlorine} <span className="text-xs font-normal text-slate-500">ppm</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Rango LMP: 0.5 - 2.0 ppm
          </span>
        </div>

        {/* Total Treated Volume */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Capacidad
            </span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {(totalVolumeCapacity / 1000).toFixed(0)} <span className="text-xs font-normal text-slate-500">m³</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {totalVolumeCapacity.toLocaleString()} Litros
          </span>
        </div>

        {/* Average pH */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              pH Medio
            </span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {avgPh}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Rango LMP: 6.5 – 8.5
          </span>
        </div>

        {/* Turbidity */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Turbiedad
            </span>
            <Gauge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {avgTurbidity} <span className="text-xs font-normal text-slate-500">NTU</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Límite Máx: &lt; 5.0 NTU
          </span>
        </div>
      </div>

      {/* Two Column Layout: Quick Dosage + Recent Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Express Fast Chlorination Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Calculadora Exprés de Cloración
                </h2>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Rápido</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Volumen de Agua a Clorar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={expressVolM3}
                      onChange={(e) => setExpressVolM3(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-bold"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-bold">m³</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 px-2 font-mono">
                    = {(expressVolM3 * 1000).toLocaleString()} L
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Dosis Cloro Objetivo:
                  </label>
                  <select
                    value={expressTargetPpm}
                    onChange={(e) => setExpressTargetPpm(parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value={1.0}>1.0 ppm (Estándar)</option>
                    <option value={1.5}>1.5 ppm (Salida Tanque)</option>
                    <option value={2.0}>2.0 ppm (LMP Máximo)</option>
                    <option value={50.0}>50 ppm (Limpieza Choque)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Producto Químico:
                  </label>
                  <select
                    value={expressType}
                    onChange={(e) => setExpressType(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 font-medium bg-white"
                  >
                    <option value="hth">Hipoclorito Calcio 65%</option>
                    <option value="bleach">Hipoclorito Sodio 10%</option>
                  </select>
                </div>
              </div>

              {/* Express Calculation Output Box */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">
                    Cantidad a Adicionar:
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {expressCommercial}
                    </span>
                    <span className="text-sm font-bold text-teal-300">
                      {expressType === 'hth' ? 'gramos' : 'mL'}
                    </span>
                  </div>
                </div>
                <button
                  id="btn-open-full-calculator"
                  onClick={onOpenQuickDose}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Asistente Avanzado</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Fórmula: Masa = (Volumen × Dosis) / (% Cloro Activo)</span>
          </div>
        </div>

        {/* Right: Recent Logbook Records (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Últimas Mediciones en Red y Reservorios
                </h2>
              </div>
              <button
                id="btn-view-all-logbook"
                onClick={() => onNavigateTab('logbook')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>Ver Bitácora ({records.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {records.slice(0, 4).map((rec) => {
                const hex = getDpdColorHex(rec.freeChlorinePpm);
                return (
                  <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* DPD Sample Color Dot */}
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: hex }}
                        title={`Color DPD representativo para ${rec.freeChlorinePpm} ppm`}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {rec.systemName}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {rec.measurementPoint} • {rec.dateStr}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                        rec.status === 'compliant'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.status === 'low'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {rec.freeChlorinePpm.toFixed(2)} ppm
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        pH: {rec.ph.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              ¿Nueva toma de muestra en campo?
            </span>
            <button
              id="btn-quick-add-sample"
              onClick={onOpenNewRecord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Registrar Medición</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

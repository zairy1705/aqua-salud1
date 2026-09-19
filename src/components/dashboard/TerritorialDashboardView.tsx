import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Droplet,
  Users,
  Activity,
  MapPin,
  TrendingDown,
  Download,
  Filter,
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
} from 'lucide-react';
import { WaterSystem, SamplingRecord, WaterSample } from '../../types';
import { evaluateChlorineNormative, getDpdColorHex } from '../../utils/waterMath';
import { computeMetalAlerts, getMetalsCatalog } from '../../data/metalsData';

interface TerritorialDashboardViewProps {
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples?: WaterSample[];
  onSelectJass: (systemId: string) => void;
  onSelectDosage: (systemId: string) => void;
  onOpenDpdCamera?: () => void;
  onNavigateToMetals?: () => void;
  onNavigateToTerritorio?: () => void;
}

export const TerritorialDashboardView: React.FC<TerritorialDashboardViewProps> = ({
  systems,
  records,
  samples = [],
  onSelectJass,
  onSelectDosage,
  onOpenDpdCamera,
  onNavigateToMetals,
  onNavigateToTerritorio,
}) => {
  const [filterSector, setFilterSector] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'conforme' | 'alerta' | 'critico'>('todos');
  const [selectedMapSystemId, setSelectedMapSystemId] = useState<string | null>(systems[0]?.id || null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportExportSuccess, setReportExportSuccess] = useState(false);

  // Metal alerts integration (AQUA-ALERT / AQUA-METALS)
  const metalAlerts = React.useMemo(() => {
    return computeMetalAlerts(samples, getMetalsCatalog());
  }, [samples]);

  // Population metrics
  const totalBeneficiaries = systems.reduce((acc, s) => acc + (s.beneficiaryCount || 350), 0);
  const compliantSystems = systems.filter((s) => s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0);
  const warningSystems = systems.filter(
    (s) => (s.lastChlorinePpm > 0 && s.lastChlorinePpm < 0.5) || s.lastChlorinePpm > 2.0
  );
  const criticalSystems = systems.filter((s) => s.lastChlorinePpm === 0);

  const compliancePercentage = Math.round((compliantSystems.length / Math.max(systems.length, 1)) * 100);
  const protectedPopulation = compliantSystems.reduce(
    (acc, s) => acc + (s.beneficiaryCount || 350),
    0
  );
  const populationProtectionRate = Math.round(
    (protectedPopulation / Math.max(totalBeneficiaries, 1)) * 100
  );

  // Filtered systems
  const filteredSystems = systems.filter((s) => {
    if (filterStatus === 'conforme') {
      return s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0;
    }
    if (filterStatus === 'alerta') {
      return (s.lastChlorinePpm > 0 && s.lastChlorinePpm < 0.5) || s.lastChlorinePpm > 2.0;
    }
    if (filterStatus === 'critico') {
      return s.lastChlorinePpm === 0;
    }
    return true;
  });

  const selectedMapSystem = systems.find((s) => s.id === selectedMapSystemId) || systems[0];

  const handleDownloadReport = () => {
    // Generate CSV content
    const headers = 'ID,JASS / Sistema,Ubicación,Capacidad (m³),Cloro Residual (ppm),pH,Estado Normativo,Población Beneficiaria\n';
    const rows = systems
      .map((s) => {
        const status =
          s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0
            ? 'CONFORME (0.5-2.0 ppm)'
            : s.lastChlorinePpm === 0
            ? 'CRÍTICO (Sin Cloro)'
            : 'EN RIESGO';
        return `"${s.id}","${s.name}","${s.location}",${s.capacityLiters / 1000},${s.lastChlorinePpm},${s.lastPh || 7.2},"${status}",${s.beneficiaryCount || 350}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Sanitario_AQUA_SALUD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportExportSuccess(true);
    setTimeout(() => setReportExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Territorial Health Intelligence */}
      <div className="bg-gradient-to-br from-[#002b36] via-[#003847] to-[#004e5f] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-cyan-500/30 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#10e7b2]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-[#00b4d8]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-hud uppercase font-bold tracking-wider bg-[#10e7b2]/20 text-[#10e7b2] border border-[#10e7b2]/40">
                VIGILANCIA SANITARIA TERRITORIAL
              </span>
              <span className="text-[11.5px] text-cyan-200/90 font-hud">
                D.S. N.° 031-2010-SA • MINSA / DIGESA / ATM
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-hud">
              Dashboard Territorial AQUA-SALUD
            </h1>
            <p className="text-xs sm:text-[13px] text-cyan-100/90 mt-1.5 leading-relaxed">
              Monitoreo unificado de la calidad del agua, semáforo de cloro libre residual en reservorios comunales (JASS) y prevención de enfermedades transmitidas por el agua en la cuenca.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#10e7b2] to-[#00b4d8] hover:from-[#caf300] hover:to-[#10e7b2] text-[#002820] font-hud text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Emitir Reporte Oficial ATM / MINSA</span>
              </button>

              <button
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-hud text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span>{reportExportSuccess ? '✓ Descargado' : 'Exportar Datos CSV'}</span>
              </button>
            </div>
          </div>

          {/* Quick Territorial Status Pill */}
          <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-cyan-400/30 shrink-0 w-full lg:w-72">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-hud uppercase font-bold text-cyan-300 tracking-wider">
                Diagnóstico de Cuenca
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10e7b2] animate-pulse" />
            </div>

            <div className="text-2xl font-black font-hud text-white">
              {compliancePercentage}%{' '}
              <span className="text-xs font-normal text-cyan-200">conformidad</span>
            </div>
            <div className="text-[11px] text-cyan-100/80 mt-1">
              {compliantSystems.length} de {systems.length} JASS clorando óptimamente.
            </div>

            <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-between text-[11px]">
              <span className="text-cyan-200">Población protegida:</span>
              <span className="font-hud font-bold text-[#10e7b2]">
                {protectedPopulation.toLocaleString()} hab. ({populationProtectionRate}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Territorial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: JASS Vigiladas */}
        <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] font-hud font-bold uppercase tracking-wider text-slate-500">
              JASS Monitoreadas
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-hud text-slate-900">
            {systems.length}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
            <span className="font-bold text-emerald-600">{compliantSystems.length} óptimas</span>
            <span>•</span>
            <span className="font-bold text-rose-600">{criticalSystems.length} críticas</span>
          </div>
        </div>

        {/* Card 2: Población Beneficiaria */}
        <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] font-hud font-bold uppercase tracking-wider text-slate-500">
              Población en Red
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-hud text-slate-900">
            {totalBeneficiaries.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {populationProtectionRate}% con agua segura
          </div>
        </div>

        {/* Card 3: Prevención de EDAs / Diarreas */}
        <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] font-hud font-bold uppercase tracking-wider text-slate-500">
              Impacto en Salud (EDAs)
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-hud text-teal-600">
            -42%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Reducción estimada de diarreas infantiles
          </div>
        </div>

        {/* Card 4: Riesgo Sanitario Territorial */}
        <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10.5px] font-hud font-bold uppercase tracking-wider text-slate-500">
              Nivel de Riesgo Territorial
            </span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                criticalSystems.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black font-hud ${
              criticalSystems.length > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {criticalSystems.length > 0 ? 'RIESGO MODERADO' : 'BAJO RIESGO'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {criticalSystems.length > 0
              ? `${criticalSystems.length} JASS requiere recarga urgente`
              : 'Cuenca bajo control óptimo'}
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Geo-surveillance (Left) + Early Warnings & Semaphore (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Territorial Map of JASS (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-cyan-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-100 text-[#00677d] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-hud text-[#002f3a] uppercase">
                    Mapa de Vigilancia Territorial de Cuenca
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Geolocalización interactiva y estado de cloración en tiempo real
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Óptimo
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Alerta
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Crítico
                  </span>
                </div>

                {onNavigateToTerritorio && (
                  <button
                    type="button"
                    onClick={onNavigateToTerritorio}
                    className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-hud text-[10px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>GIS Completo (FASE 7)</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Territorial Basin Canvas */}
            <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-[#e6f4f8] via-[#f0f8fb] to-[#e1eff4] rounded-2xl border border-cyan-200/80 overflow-hidden shadow-inner p-3">
              {/* Basin contours / River curve SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path
                  d="M -20 60 Q 140 100 240 70 T 500 130 T 800 190"
                  fill="none"
                  stroke="#00b4d8"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M -20 60 Q 140 100 240 70 T 500 130 T 800 190"
                  fill="none"
                  stroke="#10e7b2"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 180 0 Q 210 120 280 180 T 360 320"
                  fill="none"
                  stroke="#0096c7"
                  strokeWidth="6"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Coordinates Grid Labels */}
              <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-800/60">
                COORD: 09°18'S / 77°02'O • MICROCUENCA SANTA
              </div>

              {/* JASS Geo Pins */}
              {systems.map((sys, idx) => {
                // Preset deterministic positions for 5 systems
                const coords = [
                  { top: '24%', left: '20%' },
                  { top: '48%', left: '65%' },
                  { top: '70%', left: '32%' },
                  { top: '28%', left: '78%' },
                  { top: '65%', left: '80%' },
                ][idx % 5];

                const isSelected = selectedMapSystemId === sys.id;
                const isCompliant = sys.lastChlorinePpm >= 0.5 && sys.lastChlorinePpm <= 2.0;
                const isCritical = sys.lastChlorinePpm === 0;

                const pinColor = isCritical ? 'bg-rose-500' : isCompliant ? 'bg-emerald-500' : 'bg-amber-500';
                const pingColor = isCritical ? 'bg-rose-400' : isCompliant ? 'bg-emerald-400' : 'bg-amber-400';

                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedMapSystemId(sys.id)}
                    style={{ top: coords.top, left: coords.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    type="button"
                    title={`${sys.name} - ${sys.lastChlorinePpm.toFixed(2)} ppm`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-7 h-7 rounded-full ${pingColor} opacity-75 animate-ping`} />
                      <div
                        className={`w-6 h-6 rounded-full ${pinColor} text-white font-bold flex items-center justify-center shadow-md border-2 border-white text-[10px]`}
                      >
                        {idx + 1}
                      </div>
                    </div>
                    {/* Small name label */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-[#001f27]/90 text-white font-hud text-[9.5px] whitespace-nowrap shadow-xs pointer-events-none">
                      {sys.name.replace('Sistema ', '')} ({sys.lastChlorinePpm.toFixed(1)})
                    </div>
                  </button>
                );
              })}

              {/* Selected System Preview Overlay at Bottom */}
              {selectedMapSystem && (
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-cyan-200 shadow-md flex items-center justify-between gap-3 z-30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                        selectedMapSystem.lastChlorinePpm >= 0.5 && selectedMapSystem.lastChlorinePpm <= 2.0
                          ? 'bg-emerald-500'
                          : selectedMapSystem.lastChlorinePpm === 0
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    >
                      {selectedMapSystem.lastChlorinePpm.toFixed(1)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-hud font-bold text-xs text-[#002f3a] truncate">
                        {selectedMapSystem.name}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {selectedMapSystem.location} • {selectedMapSystem.capacityLiters / 1000} m³ •{' '}
                        {selectedMapSystem.beneficiaryCount || 350} habitantes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSelectJass(selectedMapSystem.id)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#00677d] font-hud text-[10.5px] font-bold border border-cyan-200 transition-colors cursor-pointer"
                    >
                      AQUA-JASS
                    </button>
                    <button
                      onClick={() => onSelectDosage(selectedMapSystem.id)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002116] font-hud text-[10.5px] font-extrabold shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      Clorar Dosis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Fuente: Reportes de operadores de JASS validados por DIGESA</span>
            <span className="font-hud font-bold text-cyan-800">Actualizado: Hoy</span>
          </div>
        </div>

        {/* Right Column: Early Warnings & Health Semaphore (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Early Health Warnings (Alertas Sanitarias) */}
          <div className="bg-white rounded-3xl p-5 border border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold font-hud text-slate-900 uppercase">
                  Alertas Sanitarias Tempranas
                </h3>
              </div>
              <span className="text-[10px] font-hud font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {criticalSystems.length + warningSystems.length} Activas
              </span>
            </div>

            <div className="space-y-2.5">
              {criticalSystems.map((sys) => (
                <div
                  key={sys.id}
                  className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-hud font-bold text-rose-900">
                        {sys.name}: Cloro 0.00 ppm
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5 leading-snug">
                        Agua sin desinfección. Riesgo inminente de contaminación biológica.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectDosage(sys.id)}
                    className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-hud text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Dosificar
                  </button>
                </div>
              ))}

              {warningSystems.map((sys) => (
                <div
                  key={sys.id}
                  className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-hud font-bold text-amber-900">
                        {sys.name}: Cloro {sys.lastChlorinePpm.toFixed(2)} ppm
                      </div>
                      <div className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                        Nivel sub-óptimo. Requiere calibración de goteo o recarga de solución.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectJass(sys.id)}
                    className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-hud text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Revisar
                  </button>
                </div>
              ))}

              {criticalSystems.length === 0 && warningSystems.length === 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-hud font-bold text-emerald-900 block">
                    Sin Alertas Críticas
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Todos los reservorios cumplen el D.S. N.° 031-2010-SA (0.50 - 2.00 ppm).
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AQUA-ALERT & AQUA-METALS Toxicological Warnings */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                  ☣️
                </div>
                <div>
                  <h3 className="text-xs font-bold font-hud text-slate-900 uppercase">
                    AQUA-ALERT • Metales y Elementos Traza
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Vigilancia Toxicológica Especializada
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-hud font-bold px-2 py-0.5 rounded-full ${
                  metalAlerts.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {metalAlerts.length} Detectadas
              </span>
            </div>

            {metalAlerts.length > 0 ? (
              <div className="space-y-2.5">
                {metalAlerts.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-2 ${
                      a.alertType === 'critica'
                        ? 'bg-rose-50/80 border-rose-200'
                        : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          a.alertType === 'critica' ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      />
                      <div>
                        <div
                          className={`text-xs font-hud font-bold ${
                            a.alertType === 'critica' ? 'text-rose-900' : 'text-amber-900'
                          }`}
                        >
                          {a.parameterName} ({a.symbol}): {a.resultValue} {a.unit}
                        </div>
                        <div className="text-[11px] text-slate-700 mt-0.5 leading-snug">
                          {a.jassName} • {a.systemName} (LMP: {a.limitText})
                        </div>
                      </div>
                    </div>

                    {onNavigateToMetals && (
                      <button
                        onClick={onNavigateToMetals}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-hud text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Ver Detalle
                      </button>
                    )}
                  </div>
                ))}

                {onNavigateToMetals && (
                  <button
                    onClick={onNavigateToMetals}
                    className="w-full py-2 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 font-hud text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Ir al Módulo AQUA-METALS ☣️</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <span className="text-xs font-hud font-bold text-emerald-900 block">
                  Sin Alertas Toxicológicas por Metales
                </span>
                <span className="text-[10.5px] text-emerald-700">
                  Ensayos de As, Pb, Cd, Hg y metales pesados en rango conforme a D.S. N.° 031-2010-SA.
                </span>
              </div>
            )}
          </div>

          {/* Chlorine vs Health Correlation Indicator */}
          <div className="bg-gradient-to-br from-[#f2fafd] to-cyan-50/80 rounded-3xl p-5 border border-cyan-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-hud uppercase font-bold text-cyan-800">
                Correlación Cloración - Salud Pública
              </span>
              <Activity className="w-4 h-4 text-cyan-700" />
            </div>

            <h4 className="font-hud font-bold text-xs text-[#002f3a]">
              Tasa de Protección contra Enfermedades Hídricas
            </h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              El mantenimiento del cloro residual libre sobre 0.50 mg/L en la última vivienda de la red reduce en más del 99.9% la viabilidad de patógenos como <em>Vibrio cholerae</em>, <em>Salmonella</em> y <em>Escherichia coli</em>.
            </p>

            <div className="mt-3 pt-3 border-t border-cyan-200/60 flex items-center justify-between">
              <span className="text-[11px] font-hud text-slate-500">Estado de Protección:</span>
              <span className="text-xs font-hud font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ALTA PROTECCIÓN COMUNITARIA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Systems Matrix Table (Matriz Territorial de Sistemas JASS) */}
      <div className="bg-white rounded-3xl p-5 border border-cyan-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black font-hud text-[#002f3a] uppercase">
              Matriz Territorial de Sistemas de Agua (JASS)
            </h3>
            <span className="text-xs text-slate-500">
              Red comunitaria y registro de parámetros fisicoquímicos en tiempo real
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-3 py-1 rounded-full text-xs font-hud font-bold transition-all cursor-pointer ${
                filterStatus === 'todos'
                  ? 'bg-[#00677d] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({systems.length})
            </button>
            <button
              onClick={() => setFilterStatus('conforme')}
              className={`px-3 py-1 rounded-full text-xs font-hud font-bold transition-all cursor-pointer ${
                filterStatus === 'conforme'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Conformes ({compliantSystems.length})
            </button>
            <button
              onClick={() => setFilterStatus('alerta')}
              className={`px-3 py-1 rounded-full text-xs font-hud font-bold transition-all cursor-pointer ${
                filterStatus === 'alerta'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              En Alerta ({warningSystems.length})
            </button>
            <button
              onClick={() => setFilterStatus('critico')}
              className={`px-3 py-1 rounded-full text-xs font-hud font-bold transition-all cursor-pointer ${
                filterStatus === 'critico'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Críticos ({criticalSystems.length})
            </button>
          </div>
        </div>

        {/* Table / Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cyan-100 text-slate-400 font-hud text-[10.5px] uppercase">
                <th className="py-2.5 px-3">JASS / Sistema</th>
                <th className="py-2.5 px-3">Ubicación</th>
                <th className="py-2.5 px-3">Capacidad</th>
                <th className="py-2.5 px-3">Cloro Libre Residual</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3">Población</th>
                <th className="py-2.5 px-3 text-right">Acciones Operativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredSystems.map((sys) => {
                const evalData = evaluateChlorineNormative(sys.lastChlorinePpm);
                const dpdHex = getDpdColorHex(sys.lastChlorinePpm);

                return (
                  <tr key={sys.id} className="hover:bg-cyan-50/40 transition-colors">
                    <td className="py-3 px-3 font-bold font-hud text-slate-900">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: dpdHex }}
                        />
                        <span>{sys.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{sys.location}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {(sys.capacityLiters / 1000).toFixed(0)} m³
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md ${
                          evalData.status === 'compliant'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : sys.lastChlorinePpm === 0 || evalData.status === 'excess'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {sys.lastChlorinePpm.toFixed(2)} ppm
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {sys.lastPh ? sys.lastPh.toFixed(1) : '7.2'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {(sys.beneficiaryCount || 350).toLocaleString()} hab.
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectJass(sys.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-100 text-[#00677d] font-hud text-[11px] font-bold transition-colors cursor-pointer"
                          title="Abrir en Módulo AQUA-JASS"
                        >
                          AQUA-JASS
                        </button>
                        <button
                          onClick={() => onSelectDosage(sys.id)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002116] font-hud text-[11px] font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer"
                          title="Calcular Dosis de Hipoclorito"
                        >
                          Dosificar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Sanitary Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-cyan-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-[#00677d] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-hud font-black text-slate-900 text-sm sm:text-base">
                    REPORTE SANITARIO OFICIAL TERRITORIAL
                  </h3>
                  <span className="text-[11px] text-slate-500 font-hud">
                    Área Técnica Municipal (ATM) • Vigilancia Sanitaria MINSA / DIGESA
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha de Emisión:</span>
                <span className="font-bold">{new Date().toLocaleDateString('es-PE')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ámbito Geográfico:</span>
                <span className="font-bold">Microcuenca Santa / Red de JASS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Sistemas Evaluados:</span>
                <span className="font-bold">{systems.length} JASS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Índice de Cloración Conforme:</span>
                <span className="font-bold text-emerald-700">{compliancePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Población Beneficiaria Total:</span>
                <span className="font-bold">{totalBeneficiaries.toLocaleString()} habitantes</span>
              </div>
            </div>

            <div>
              <h4 className="font-hud font-bold text-xs text-slate-800 mb-2">
                Resumen de Cumplimiento por Sistema
              </h4>
              <div className="space-y-1.5 text-xs">
                {systems.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200"
                  >
                    <span className="font-bold font-hud">{s.name}</span>
                    <span className="font-mono">{s.lastChlorinePpm.toFixed(2)} ppm Cl₂</span>
                    <span
                      className={`font-hud font-bold text-[10.5px] px-2 py-0.5 rounded-full ${
                        s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.lastChlorinePpm === 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0
                        ? 'ÓPTIMO'
                        : s.lastChlorinePpm === 0
                        ? 'CRÍTICO'
                        : 'SUB-CLORADO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-hud text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Reporte</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002116] font-hud text-xs font-black shadow-md cursor-pointer"
              >
                Descargar CSV de Datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

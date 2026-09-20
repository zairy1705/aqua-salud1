import React, { useState, useMemo } from 'react';
import {
  AquaAlertItem,
  AquaAlertStatus,
  AquaAlertType,
  AquaAlertLevel,
} from '../../types';
import { getAlertStatusBadge, getRiskLevelBadge } from '../../data/riskAlertEngine';
import { AlertActionModal } from './AlertActionModal';
import { GlassTitlePanel } from '../GlassTitlePanel';

interface AquaAlertViewProps {
  alerts: AquaAlertItem[];
  onUpdateAlerts: (updated: AquaAlertItem[]) => void;
  onNavigateToRiskMatrix?: (riskId?: string) => void;
  onOpenDosageAssistant?: (systemId?: string) => void;
  onOpenAquaLab?: (sampleId?: string) => void;
  onConvertToPlan?: (alert: AquaAlertItem) => void;
  activeOperatorName?: string;
  focusedAlertCode?: string;
}

export const AquaAlertView: React.FC<AquaAlertViewProps> = ({
  alerts,
  onUpdateAlerts,
  onNavigateToRiskMatrix,
  onOpenDosageAssistant,
  onOpenAquaLab,
  onConvertToPlan,
  activeOperatorName = 'Ing. Zaira Salvador Amaya',
  focusedAlertCode,
}) => {
  const [filterType, setFilterType] = useState<AquaAlertType | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<AquaAlertStatus | 'todos'>('todos');
  const [filterLevel, setFilterLevel] = useState<AquaAlertLevel | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState(focusedAlertCode || '');
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<AquaAlertItem | null>(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: alerts.length,
      pendientes: alerts.filter((a) => a.status === 'PENDIENTE').length,
      enProceso: alerts.filter((a) => a.status === 'EN PROCESO').length,
      resueltas: alerts.filter((a) => a.status === 'RESUELTA').length,
      verificadas: alerts.filter((a) => a.status === 'VERIFICADA').length,
      criticas: alerts.filter((a) => a.level === 'Crítico').length,
      altas: alerts.filter((a) => a.level === 'Alto').length,
      // By types
      micro: alerts.filter((a) => a.type === 'Microbiológica').length,
      quim: alerts.filter((a) => a.type === 'Química').length,
      desinf: alerts.filter((a) => a.type === 'Desinfección').length,
      oper: alerts.filter((a) => a.type === 'Operativa').length,
      jass: alerts.filter((a) => a.type === 'JASS').length,
      terr: alerts.filter((a) => a.type === 'Territorial').length,
    };
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filterType !== 'todos' && a.type !== filterType) return false;
      if (filterStatus !== 'todos' && a.status !== filterStatus) return false;
      if (filterLevel !== 'todos' && a.level !== filterLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          a.code.toLowerCase().includes(q) ||
          a.system.toLowerCase().includes(q) ||
          a.parameter.toLowerCase().includes(q) ||
          a.responsible.toLowerCase().includes(q) ||
          a.point.toLowerCase().includes(q) ||
          a.origin.details.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [alerts, filterType, filterStatus, filterLevel, searchQuery]);

  const handleUpdateSingleAlert = (updated: AquaAlertItem) => {
    const nextAlerts = alerts.map((a) => (a.code === updated.code ? updated : a));
    onUpdateAlerts(nextAlerts);
  };

  const getCategoryIcon = (type: AquaAlertType) => {
    switch (type) {
      case 'Microbiológica':
        return '🦠';
      case 'Química':
        return '⚗️';
      case 'Desinfección':
        return '🧪';
      case 'Operativa':
        return '⚙️';
      case 'JASS':
        return '👥';
      case 'Territorial':
        return '🗺️';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 6 • SISTEMA DE ALERTA TEMPRANA • D.S. N.° 031-2010-SA"
        icon="notifications_active"
        title="AQUA-ALERT • MONITOREO AUTOMÁTICO DE INCIDENCIAS"
        subtitle="Generación de alertas basada estrictamente en datos reales existentes. Trazabilidad absoluta: Resultado → Riesgo → Alerta → Acción → Verificación."
        stats={[
          {
            label: 'ALERTAS PENDIENTES',
            value: stats.pendientes,
            subtext: 'Sin intervención iniciada',
            highlight: stats.pendientes > 0,
          },
          {
            label: 'EN PROCESO',
            value: stats.enProceso,
            subtext: 'Acción correctiva en curso',
          },
          {
            label: 'RESUELTAS',
            value: stats.resueltas,
            subtext: 'Conforme en verificación',
          },
          {
            label: 'TOTAL REGISTRADAS',
            value: stats.total,
            subtext: 'Trazabilidad y fidelidad 100%',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToRiskMatrix && (
              <button
                type="button"
                onClick={() => onNavigateToRiskMatrix()}
                className="glass-option-btn text-xs font-black uppercase tracking-wider text-amber-700"
              >
                <span className="material-symbols-outlined text-sm text-amber-600">warning</span>
                <span>VER MATRIZ AQUA-RISK</span>
              </button>
            )}
          </div>
        }
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setFilterStatus(filterStatus === 'PENDIENTE' ? 'todos' : 'PENDIENTE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'PENDIENTE'
              ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-400'
              : 'bg-white border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-rose-900 uppercase">1. PENDIENTES</span>
            <span className="text-lg">⏳</span>
          </div>
          <div className="text-2xl font-hud font-black text-rose-700">{stats.pendientes}</div>
          <p className="text-[10.5px] text-rose-800/80 mt-0.5">Sin intervención iniciada</p>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'EN PROCESO' ? 'todos' : 'EN PROCESO')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'EN PROCESO'
              ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400'
              : 'bg-white border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-amber-900 uppercase">2. EN PROCESO</span>
            <span className="text-lg">⚙️</span>
          </div>
          <div className="text-2xl font-hud font-black text-amber-700">{stats.enProceso}</div>
          <p className="text-[10.5px] text-amber-800/80 mt-0.5">Acción correctiva en curso</p>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'RESUELTA' ? 'todos' : 'RESUELTA')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'RESUELTA'
              ? 'bg-sky-50 border-sky-400 shadow-md ring-2 ring-sky-400'
              : 'bg-white border-sky-200 hover:bg-sky-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-sky-900 uppercase">3. RESUELTAS</span>
            <span className="text-lg">🛠️</span>
          </div>
          <div className="text-2xl font-hud font-black text-sky-700">{stats.resueltas}</div>
          <p className="text-[10.5px] text-sky-800/80 mt-0.5">Solución técnica completada</p>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'VERIFICADA' ? 'todos' : 'VERIFICADA')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterStatus === 'VERIFICADA'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400'
              : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-emerald-900 uppercase">4. VERIFICADAS</span>
            <span className="text-lg">✅</span>
          </div>
          <div className="text-2xl font-hud font-black text-emerald-700">{stats.verificadas}</div>
          <p className="text-[10.5px] text-emerald-800/80 mt-0.5">Contra-ensayo de calidad conforme</p>
        </div>
      </div>

      {/* FILTER TABS BY ALERT TYPE */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          onClick={() => setFilterType('todos')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
            filterType === 'todos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todas ({alerts.length})
        </button>

        <button
          onClick={() => setFilterType('Microbiológica')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'Microbiológica'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
          }`}
        >
          <span>🦠 Microbiológica</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.micro}</span>
        </button>

        <button
          onClick={() => setFilterType('Química')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'Química'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          <span>⚗️ Química / Metales</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.quim}</span>
        </button>

        <button
          onClick={() => setFilterType('Desinfección')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'Desinfección'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          <span>🧪 Desinfección / Cloro</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.desinf}</span>
        </button>

        <button
          onClick={() => setFilterType('Operativa')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'Operativa'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
          }`}
        >
          <span>⚙️ Operativa</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.oper}</span>
        </button>

        <button
          onClick={() => setFilterType('JASS')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'JASS'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
          }`}
        >
          <span>👥 JASS / Vigilancia</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.jass}</span>
        </button>

        <button
          onClick={() => setFilterType('Territorial')}
          className={`px-3 py-2 rounded-xl text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            filterType === 'Territorial'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
          }`}
        >
          <span>🗺️ Territorial</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{stats.terr}</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as any)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-hud font-bold text-slate-700 bg-white"
          >
            <option value="todos">Todos los Niveles</option>
            <option value="Crítico">🔴 Crítico ({stats.criticas})</option>
            <option value="Alto">🟠 Alto ({stats.altas})</option>
            <option value="Moderado">🟡 Moderado</option>
            <option value="Bajo">🟢 Bajo</option>
          </select>

          {/* Reset active filters */}
          {(filterStatus !== 'todos' || filterLevel !== 'todos' || filterType !== 'todos') && (
            <button
              onClick={() => {
                setFilterStatus('todos');
                setFilterLevel('todos');
                setFilterType('todos');
                setSearchQuery('');
              }}
              className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-hud font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Restablecer Filtros</span>
              <span>✕</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar código, sistema, parámetro..."
            className="w-full pl-8 pr-3 py-2 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 text-xs hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ALERT CARDS LIST */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const statusBadge = getAlertStatusBadge(alert.status);
            const levelBadge = getRiskLevelBadge(alert.level);
            const catIcon = getCategoryIcon(alert.type);

            return (
              <div
                key={alert.code}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* TOP BAR */}
                <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-xl bg-slate-900 text-white shadow-xs">
                      {alert.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-hud font-bold border ${levelBadge.badgeClass}`}
                    >
                      <span>{levelBadge.icon}</span>
                      <span>Nivel {levelBadge.label}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-hud font-bold flex items-center gap-1">
                      <span>{catIcon}</span>
                      <span>{alert.type}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-hud font-bold border ${statusBadge.badgeClass}`}>
                      {statusBadge.label}
                    </span>
                    {onConvertToPlan && (
                      <button
                        type="button"
                        onClick={() => onConvertToPlan(alert)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-hud font-bold uppercase transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                        title="Transformar esta alerta en un Plan de Acción Correctiva (Fase 8)"
                      >
                        <span>📋</span>
                        <span className="hidden sm:inline">Plan de Acción</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedAlertForAction(alert)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-hud font-bold uppercase transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Gestionar Alerta →
                    </button>
                  </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* System and Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                        Sistema Hídrico
                      </span>
                      <span className="text-xs font-hud font-bold text-slate-900 block mt-0.5">
                        {alert.system}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                        Punto de Muestreo / Componente
                      </span>
                      <span className="text-xs font-sans text-slate-700 block mt-0.5">
                        {alert.point}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                        Fecha de Registro
                      </span>
                      <span className="text-xs font-mono text-slate-700 block mt-0.5">
                        {alert.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                        Responsable Asignado
                      </span>
                      <span className="text-xs font-medium text-slate-800 block mt-0.5">
                        {alert.responsible}
                      </span>
                    </div>
                  </div>

                  {/* Parameter, Result, Criterion */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] font-hud font-bold text-rose-800 uppercase block">
                        Parámetro Observado
                      </span>
                      <span className="text-sm font-hud font-black text-rose-950 block mt-0.5">
                        {alert.parameter}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-rose-800 uppercase block">
                        Resultado Analítico Obtenido
                      </span>
                      <span className="text-sm font-mono font-black text-rose-700 block mt-0.5">
                        {alert.result}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block">
                        Criterio Normativo Exigido
                      </span>
                      <span className="text-xs font-sans text-slate-700 block mt-0.5">
                        {alert.criterion}
                      </span>
                    </div>
                  </div>

                  {/* Required Action */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <span className="text-[11px] font-hud font-extrabold text-amber-900 uppercase block mb-1">
                      ⚡ Acción Requerida:
                    </span>
                    <p className="text-xs text-amber-950 font-sans leading-relaxed">
                      {alert.requiredAction}
                    </p>
                  </div>

                  {/* PROVENANCE CARD (Strict non-invention rule) */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10.5px] font-hud font-bold text-slate-700 uppercase">
                          Origen del Hallazgo:
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                          {alert.origin.referenceCode}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 font-sans">
                        {alert.origin.details}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {alert.origin.type === 'muestra_laboratorio' && onOpenAquaLab && (
                        <button
                          type="button"
                          onClick={() => onOpenAquaLab(alert.origin.referenceId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-hud text-[10.5px] font-bold transition-colors cursor-pointer"
                        >
                          🔬 Ver Muestra
                        </button>
                      )}

                      {alert.riskId && onNavigateToRiskMatrix && (
                        <button
                          type="button"
                          onClick={() => onNavigateToRiskMatrix(alert.riskId)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-hud text-[10.5px] font-bold transition-colors cursor-pointer"
                        >
                          ⚠️ Matriz de Riesgo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* LIFECYCLE PROGRESS BAR (Resultado → Riesgo → Alerta → Acción → Verificación) */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-hud mb-1.5 text-slate-600">
                      <span className="font-bold uppercase text-slate-700">
                        Estado del Ciclo Sanitario:
                      </span>
                      <span className="font-mono text-slate-500">
                        {alert.status === 'VERIFICADA'
                          ? 'Ciclo 100% Completado y Verificado'
                          : alert.status === 'RESUELTA'
                          ? 'Acción ejecutada • Pendiente de verificación'
                          : alert.status === 'EN PROCESO'
                          ? 'Intervención en progreso'
                          : 'Pendiente de inicio'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-hud font-bold">
                      <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        1. Resultado ✓
                      </div>
                      <div className="p-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                        2. Riesgo ✓
                      </div>
                      <div className="p-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                        3. Alerta ✓
                      </div>
                      <div
                        className={`p-1 rounded-lg border ${
                          alert.status === 'RESUELTA' || alert.status === 'VERIFICADA'
                            ? 'bg-sky-100 text-sky-800 border-sky-200 font-bold'
                            : alert.status === 'EN PROCESO'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        4. Acción {alert.status === 'RESUELTA' || alert.status === 'VERIFICADA' ? '✓' : ''}
                      </div>
                      <div
                        className={`p-1 rounded-lg border ${
                          alert.status === 'VERIFICADA'
                            ? 'bg-emerald-600 text-white font-extrabold border-emerald-700'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        5. Verificación {alert.status === 'VERIFICADA' ? '✓' : ''}
                      </div>
                    </div>

                    {/* Show action/verification evidence if exists */}
                    {alert.actionTaken && (
                      <div className="mt-2 text-xs text-sky-900 bg-sky-50/80 p-2.5 rounded-xl border border-sky-200 flex items-start gap-2">
                        <span>🛠️</span>
                        <div>
                          <strong>Acción Ejecutada ({alert.actionDate} por {alert.actionBy}):</strong> {alert.actionTaken}
                        </div>
                      </div>
                    )}

                    {alert.verificationEvidence && (
                      <div className="mt-1.5 text-xs text-emerald-950 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-2">
                        <span>✅</span>
                        <div>
                          <strong>Verificación Técnica ({alert.verifiedDate} por {alert.verifiedBy}):</strong> {alert.verificationEvidence}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl mb-3">
              🛡️
            </div>
            <h4 className="text-base font-hud font-bold text-slate-900 uppercase">
              No hay alertas con los filtros seleccionados
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Todos los parámetros evaluados se encuentran conformes o los filtros no coinciden con ningún registro.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE GESTIÓN DE ACCIÓN Y VERIFICACIÓN */}
      <AlertActionModal
        alert={selectedAlertForAction}
        isOpen={Boolean(selectedAlertForAction)}
        onClose={() => setSelectedAlertForAction(null)}
        onUpdateAlert={handleUpdateSingleAlert}
        onOpenDosageAssistant={onOpenDosageAssistant}
        onOpenAquaLab={onOpenAquaLab}
        onNavigateToRisks={onNavigateToRiskMatrix}
        activeOperatorName={activeOperatorName}
      />
    </div>
  );
};

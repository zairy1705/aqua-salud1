import React, { useState, useMemo } from 'react';
import {
  ActionPlanItem,
  ActionPlanFlowStage,
  AquaAlertItem,
} from '../../types';
import {
  ACTION_PLAN_STAGES,
  getStageMeta,
  getNextStage,
  getPreviousStage,
  createActionPlanFromAlert,
} from '../../data/actionPlanStore';
import { ActionPlanModal } from './ActionPlanModal';

interface ActionPlanViewProps {
  plans: ActionPlanItem[];
  onUpdatePlans: (plans: ActionPlanItem[]) => void;
  alerts: AquaAlertItem[];
  onUpdateAlerts: (alerts: AquaAlertItem[]) => void;
  onNavigateToAlerts?: () => void;
  onNavigateToAquaData?: () => void;
  operatorName?: string;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  plans,
  onUpdatePlans,
  alerts,
  onUpdateAlerts,
  onNavigateToAlerts,
  onNavigateToAquaData,
  operatorName = 'Ing. Zaira Salvador Amaya',
}) => {
  const [filterStage, setFilterStage] = useState<ActionPlanFlowStage | 'todos'>('todos');
  const [filterPriority, setFilterPriority] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<ActionPlanItem | null>(null);
  const [alertToConvert, setAlertToConvert] = useState<AquaAlertItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Pending alerts that don't yet have an action plan
  const pendingAlertsToConvert = useMemo(() => {
    const existingAlertCodes = new Set(plans.map((p) => p.alertCode).filter(Boolean));
    return alerts.filter((a) => a.status === 'PENDIENTE' && !existingAlertCodes.has(a.code));
  }, [alerts, plans]);

  // Statistics across the 6-stage lifecycle
  const stats = useMemo(() => {
    const total = plans.length;
    const stageCounts: Record<ActionPlanFlowStage, number> = {
      ALERTA: 0,
      'PLAN DE ACCIÓN': 0,
      IMPLEMENTACIÓN: 0,
      EVIDENCIA: 0,
      VERIFICACIÓN: 0,
      CIERRE: 0,
    };
    let criticos = 0;
    let vencidos = 0;
    const nowStr = new Date().toISOString().split('T')[0];

    plans.forEach((p) => {
      if (stageCounts[p.estado] !== undefined) {
        stageCounts[p.estado]++;
      }
      if (p.prioridad === 'Crítica') criticos++;
      if (p.estado !== 'CIERRE' && p.fechaLimite < nowStr) {
        vencidos++;
      }
    });

    return {
      total,
      stageCounts,
      criticos,
      vencidos,
      cerrados: stageCounts['CIERRE'],
      enProceso: total - stageCounts['CIERRE'],
    };
  }, [plans]);

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      if (filterStage !== 'todos' && p.estado !== filterStage) return false;
      if (filterPriority !== 'todos' && p.prioridad !== filterPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.id.toLowerCase().includes(q) ||
          p.problema.toLowerCase().includes(q) ||
          p.causaProbable.toLowerCase().includes(q) ||
          p.accion.toLowerCase().includes(q) ||
          p.responsable.toLowerCase().includes(q) ||
          p.systemName.toLowerCase().includes(q) ||
          (p.alertCode && p.alertCode.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [plans, filterStage, filterPriority, searchQuery]);

  const handleSavePlan = (updatedOrNewPlan: ActionPlanItem) => {
    const exists = plans.some((p) => p.id === updatedOrNewPlan.id);
    let nextPlans: ActionPlanItem[];

    if (exists) {
      nextPlans = plans.map((p) => (p.id === updatedOrNewPlan.id ? updatedOrNewPlan : p));
    } else {
      nextPlans = [updatedOrNewPlan, ...plans];
    }

    onUpdatePlans(nextPlans);

    // If linked to an alert, sync alert status
    if (updatedOrNewPlan.alertCode) {
      const updatedAlerts = alerts.map((a) => {
        if (a.code === updatedOrNewPlan.alertCode) {
          if (updatedOrNewPlan.estado === 'CIERRE') {
            return {
              ...a,
              status: 'VERIFICADA' as const,
              actionTaken: updatedOrNewPlan.accion,
              actionDate: updatedOrNewPlan.fechaLimite,
              actionBy: updatedOrNewPlan.responsable,
              verifiedDate: updatedOrNewPlan.verificacion?.fechaVerificacion,
              verifiedBy: updatedOrNewPlan.verificacion?.verificadoPor,
              verificationEvidence: updatedOrNewPlan.evidencia?.descripcion,
            };
          } else if (updatedOrNewPlan.estado === 'VERIFICACIÓN') {
            return {
              ...a,
              status: 'RESUELTA' as const,
              actionTaken: updatedOrNewPlan.accion,
            };
          } else {
            return {
              ...a,
              status: 'EN PROCESO' as const,
            };
          }
        }
        return a;
      });
      onUpdateAlerts(updatedAlerts);
    }
  };

  const handleAdvanceStage = (plan: ActionPlanItem) => {
    const nextStage = getNextStage(plan.estado);
    if (!nextStage) return;

    const updated: ActionPlanItem = {
      ...plan,
      estado: nextStage,
      updatedAt: new Date().toISOString(),
    };
    handleSavePlan(updated);
  };

  const handleRegressStage = (plan: ActionPlanItem) => {
    const prevStage = getPreviousStage(plan.estado);
    if (!prevStage) return;

    const updated: ActionPlanItem = {
      ...plan,
      estado: prevStage,
      updatedAt: new Date().toISOString(),
    };
    handleSavePlan(updated);
  };

  const handleConvertAlertQuick = (alert: AquaAlertItem) => {
    const newPlan = createActionPlanFromAlert(alert, operatorName);
    setSelectedPlanForEdit(newPlan);
    setAlertToConvert(alert);
    setIsModalOpen(true);
  };

  const exportPlansSummary = () => {
    const textData = JSON.stringify(plans, null, 2);
    const blob = new Blob([textData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AQUA_SALUD_Planes_Accion_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[11px] font-hud font-extrabold uppercase tracking-wider">
                FASE 8 • PLANES DE ACCIÓN
              </span>
              <span className="text-xs text-teal-200/80 font-mono">D.S. N.° 031-2010-SA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-hud font-black tracking-tight text-white flex items-center gap-2.5">
              <span>📋 GESTIÓN DE ACCIONES CORRECTIVAS</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transformación de alertas sanitarias en planes de intervención técnica con trazabilidad de ciclo completo:
              <strong> ALERTA → PLAN DE ACCIÓN → IMPLEMENTACIÓN → EVIDENCIA → VERIFICACIÓN → CIERRE</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPlanForEdit(null);
                setAlertToConvert(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-hud text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02]"
            >
              <span>+ Nuevo Plan Manual</span>
            </button>

            {onNavigateToAlerts && (
              <button
                type="button"
                onClick={onNavigateToAlerts}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 font-hud text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>🚨 Ver Alertas ({alerts.filter((a) => a.status === 'PENDIENTE').length})</span>
              </button>
            )}

            {onNavigateToAquaData && (
              <button
                type="button"
                onClick={onNavigateToAquaData}
                className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-hud text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>📊 AQUA-DATA Analytics</span>
              </button>
            )}
          </div>
        </div>

        {/* WORKFLOW LIFECYCLE BANNER */}
        <div className="mt-6 pt-4 border-t border-teal-500/20">
          <div className="text-[11px] font-hud uppercase tracking-wider text-teal-300 font-bold mb-2 flex items-center justify-between">
            <span>Flujo Operativo Normativo de Trazabilidad:</span>
            <span className="text-slate-400 font-sans font-normal">
              Haga clic en una etapa para filtrar los planes correspondientes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ACTION_PLAN_STAGES.map((st, idx) => {
              const isSelected = filterStage === st.id;
              const count = stats.stageCounts[st.id] || 0;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFilterStage(filterStage === st.id ? 'todos' : st.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md ring-2 ring-teal-400'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-hud font-bold ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-teal-400/20 text-teal-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm font-mono font-bold">{count}</span>
                  </div>
                  <div className="mt-2 text-xs font-hud font-bold tracking-tight truncate">
                    {st.label}
                  </div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {st.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PENDING ALERTS CALLOUT BANNER (Transform Alert to Action Plan) */}
      {pendingAlertsToConvert.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-300 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
                ⚠️
              </span>
              <div>
                <h3 className="text-sm font-hud font-bold text-amber-950">
                  {pendingAlertsToConvert.length} Alerta(s) Sanitaria(s) Pendiente(s) de Plan de Acción
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Transforme cualquier alerta detectada en una intervención correctiva con un solo clic:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {pendingAlertsToConvert.slice(0, 3).map((al) => (
                <button
                  key={al.code}
                  type="button"
                  onClick={() => handleConvertAlertQuick(al)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-hud font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{al.code} ({al.parameter}) → Plan</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FILTER AND SEARCH CONTROLS */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, problema, causa, acción, sistema o responsable..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-hud font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="todos">Todos los Estados ({plans.length})</option>
              {ACTION_PLAN_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({stats.stageCounts[s.id] || 0})
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-hud font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="todos">Todas las Prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
                title="Vista de Tarjetas Detalladas"
              >
                Tarjetas
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
                title="Vista de Tabla Resumida"
              >
                Tabla
              </button>
            </div>

            <button
              type="button"
              onClick={exportPlansSummary}
              className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-hud font-bold transition-colors cursor-pointer"
              title="Descargar respaldo en JSON"
            >
              📥 Exportar
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filterStage !== 'todos' || filterPriority !== 'todos' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-hud text-[11px]">Filtros activos:</span>
            {filterStage !== 'todos' && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-hud font-bold flex items-center gap-1">
                Etapa: {filterStage}
                <button type="button" onClick={() => setFilterStage('todos')}>✕</button>
              </span>
            )}
            {filterPriority !== 'todos' && (
              <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-hud font-bold flex items-center gap-1">
                Prioridad: {filterPriority}
                <button type="button" onClick={() => setFilterPriority('todos')}>✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-hud font-bold flex items-center gap-1">
                Texto: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setFilterStage('todos');
                setFilterPriority('todos');
                setSearchQuery('');
              }}
              className="text-teal-700 hover:underline text-[11px] font-bold ml-auto"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* PLANS LISTING */}
      {filteredPlans.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="text-4xl">📋</div>
          <h3 className="text-base font-hud font-bold text-slate-900">
            No se encontraron planes de acción
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No existen registros que coincidan con los filtros seleccionados o aún no se han formulado planes correctivos para esta selección.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterStage('todos');
              setFilterPriority('todos');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-hud font-bold cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW */
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const stageMeta = getStageMeta(plan.estado);
            const isOverdue =
              plan.estado !== 'CIERRE' &&
              plan.fechaLimite < new Date().toISOString().split('T')[0];
            const nextStage = getNextStage(plan.estado);
            const prevStage = getPreviousStage(plan.estado);

            return (
              <div
                key={plan.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* CARD HEADER */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                          {plan.id}
                        </span>
                        {plan.alertCode && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-mono font-bold">
                            Alerta: {plan.alertCode}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-hud font-bold border ${
                            plan.prioridad === 'Crítica'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : plan.prioridad === 'Alta'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          Prioridad {plan.prioridad}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-slate-800">{plan.systemName}</strong>
                        {plan.punto && ` • ${plan.punto}`}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE STAGE BADGE & ACTIONS */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-hud font-bold border ${stageMeta.badgeClass}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>{stageMeta.number}. {plan.estado}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanForEdit(plan);
                        setAlertToConvert(null);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-hud font-bold transition-all cursor-pointer"
                    >
                      Editar Ficha ✏️
                    </button>
                  </div>
                </div>

                {/* 6-STEP PROGRESS PIPELINE */}
                <div className="px-5 py-3 bg-slate-50/60 border-b border-slate-100 overflow-x-auto">
                  <div className="flex items-center justify-between min-w-[500px] gap-2">
                    {ACTION_PLAN_STAGES.map((s, idx) => {
                      const isCurrent = plan.estado === s.id;
                      const isCompleted =
                        ACTION_PLAN_STAGES.findIndex((st) => st.id === plan.estado) > idx;

                      return (
                        <div
                          key={s.id}
                          className={`flex items-center gap-1.5 text-xs font-hud ${
                            isCurrent
                              ? 'font-bold text-teal-800'
                              : isCompleted
                              ? 'font-bold text-emerald-700'
                              : 'text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCurrent
                                ? 'bg-teal-600 text-white shadow-2xs'
                                : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </span>
                          <span className="text-[11px] whitespace-nowrap">{s.label}</span>
                          {idx < ACTION_PLAN_STAGES.length - 1 && (
                            <span className="text-slate-300 ml-1">→</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* MAIN CONTENT: The required registered fields */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Field 1: Problema */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                    <span className="text-[10px] font-hud font-extrabold uppercase tracking-wider text-rose-800 block">
                      1. Problema Identificado
                    </span>
                    <p className="text-xs sm:text-sm text-rose-950 font-medium mt-1 leading-relaxed">
                      {plan.problema}
                    </p>
                  </div>

                  {/* Field 2 & 3: Causa Probable & Acción */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                      <span className="text-[10px] font-hud font-extrabold uppercase tracking-wider text-amber-800 block">
                        2. Causa Probable
                      </span>
                      <p className="text-xs sm:text-sm text-amber-950 mt-1 leading-relaxed">
                        {plan.causaProbable}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80">
                      <span className="text-[10px] font-hud font-extrabold uppercase tracking-wider text-teal-800 block">
                        3. Acción Correctiva
                      </span>
                      <p className="text-xs sm:text-sm text-teal-950 font-medium mt-1 leading-relaxed">
                        {plan.accion}
                      </p>
                    </div>
                  </div>

                  {/* Field 4, 5, 6: Responsable, Fecha, Fecha Límite */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block">
                        4. Responsable
                      </span>
                      <span className="font-hud font-bold text-slate-900 mt-0.5 block truncate">
                        👤 {plan.responsable}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block">
                        5. Fecha de Inicio
                      </span>
                      <span className="font-mono text-slate-800 mt-0.5 block">
                        📅 {plan.fecha}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block flex items-center justify-between">
                        <span>6. Fecha Límite</span>
                        {isOverdue && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold">
                            VENCIDO
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-mono font-bold mt-0.5 block ${
                          isOverdue ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        ⏰ {plan.fechaLimite}
                      </span>
                    </div>
                  </div>

                  {/* Field 7: Evidencia */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-hud font-extrabold uppercase tracking-wider text-purple-800">
                        7. Evidencia de Ejecución
                      </span>
                      {plan.evidencia?.fechaRegistro && (
                        <span className="text-[10px] font-mono text-purple-700">
                          {plan.evidencia.fechaRegistro}
                        </span>
                      )}
                    </div>

                    {plan.evidencia ? (
                      <div className="text-xs text-purple-950 space-y-1">
                        <p className="leading-relaxed">{plan.evidencia.descripcion}</p>
                        {plan.evidencia.archivoNombre && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-purple-900 text-[11px] font-mono font-bold">
                            <span>📎 {plan.evidencia.archivoNombre}</span>
                            <span className="text-[9px] text-purple-600">
                              ({plan.evidencia.tipoEvidencia || 'doc'})
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-purple-600/80">
                        <span>Sin evidencia adjunta aún.</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanForEdit(plan);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-200 hover:bg-purple-300 text-purple-900 text-[11px] font-hud font-bold transition-all cursor-pointer"
                        >
                          + Adjuntar Evidencia
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Field 8: Verificación & Cierre */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-hud font-extrabold uppercase tracking-wider text-teal-800">
                        8. Verificación y Dictamen Técnico
                      </span>
                      {plan.verificacion && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                            plan.verificacion.conforme
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {plan.verificacion.conforme ? '✓ CONFORME' : '⚠ REQUIERE REAJUSTE'}
                        </span>
                      )}
                    </div>

                    {plan.verificacion ? (
                      <div className="text-xs text-teal-950 space-y-1">
                        {plan.verificacion.resultadoMedicion && (
                          <div className="font-bold text-teal-900 font-mono text-[11.5px]">
                            📊 {plan.verificacion.resultadoMedicion}
                          </div>
                        )}
                        <p className="leading-relaxed">{plan.verificacion.notas}</p>
                        <div className="text-[10px] text-teal-700 font-mono pt-0.5">
                          Verificado por: {plan.verificacion.verificadoPor} ({plan.verificacion.fechaVerificacion})
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-teal-600/80">
                        <span>Pendiente de verificación e inspección post-intervención.</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanForEdit(plan);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-200 hover:bg-teal-300 text-teal-900 text-[11px] font-hud font-bold transition-all cursor-pointer"
                        >
                          🔍 Registrar Verificación
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD FOOTER: STAGE TRANSITION BUTTONS */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {prevStage && (
                      <button
                        type="button"
                        onClick={() => handleRegressStage(plan)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-hud font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                        title={`Retroceder a ${prevStage}`}
                      >
                        ← Volver a {prevStage}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {nextStage ? (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(plan)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-hud font-bold uppercase transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Avanzar a {nextStage}</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-hud font-bold border border-emerald-300 flex items-center gap-1">
                        <span>✓</span>
                        <span>Expediente Cerrado y Archivador</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-hud uppercase tracking-wider text-slate-700">
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Sistema</th>
                  <th className="py-3 px-4">Problema & Acción</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4">Plazo</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Verificación</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => {
                  const stageMeta = getStageMeta(plan.estado);
                  const isOverdue =
                    plan.estado !== 'CIERRE' &&
                    plan.fechaLimite < new Date().toISOString().split('T')[0];

                  return (
                    <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {plan.id}
                        {plan.alertCode && (
                          <div className="text-[10px] text-rose-600 font-normal">
                            Alerta: {plan.alertCode}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-hud font-bold text-slate-800">
                        {plan.systemName}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 truncate" title={plan.problema}>
                          {plan.problema}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5" title={plan.accion}>
                          Acción: {plan.accion}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {plan.responsable}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          {plan.fechaLimite}
                        </div>
                        {isOverdue && (
                          <span className="text-[9px] text-rose-600 font-bold">VENCIDO</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-bold border ${stageMeta.badgeClass}`}
                        >
                          {plan.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {plan.verificacion ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                              plan.verificacion.conforme
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {plan.verificacion.conforme ? 'Conforme' : 'Reajuste'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pendiente</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanForEdit(plan);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-hud font-bold transition-all cursor-pointer"
                        >
                          Gestionar →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTION PLAN MODAL */}
      <ActionPlanModal
        isOpen={isModalOpen}
        plan={selectedPlanForEdit}
        alertToConvert={alertToConvert}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlanForEdit(null);
          setAlertToConvert(null);
        }}
        onSave={handleSavePlan}
        operatorName={operatorName}
        systemsList={[]}
      />
    </div>
  );
};

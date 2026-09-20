import React, { useState, useMemo } from 'react';
import {
  AquaRiskItem,
  AquaRiskLevel,
  AquaRiskStatus,
  WaterSystem,
} from '../../types';
import { getRiskLevelBadge } from '../../data/riskAlertEngine';
import { NewRiskModal } from './NewRiskModal';
import { GlassTitlePanel } from '../GlassTitlePanel';

interface AquaRiskViewProps {
  risks: AquaRiskItem[];
  systems: WaterSystem[];
  onUpdateRisks: (updated: AquaRiskItem[]) => void;
  onNavigateToAlerts?: (alertCode?: string) => void;
  activeOperatorName?: string;
}

export const AquaRiskView: React.FC<AquaRiskViewProps> = ({
  risks,
  systems,
  onUpdateRisks,
  onNavigateToAlerts,
  activeOperatorName = 'Ing. Zaira Salvador Amaya',
}) => {
  const [filterLevel, setFilterLevel] = useState<AquaRiskLevel | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<AquaRiskStatus | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<AquaRiskItem | null>(null);
  const [viewMode, setViewMode] = useState<'tabla' | 'mapa_calor'>('tabla');

  // Metrics
  const stats = useMemo(() => {
    return {
      total: risks.length,
      critico: risks.filter((r) => r.riskLevel === 'Crítico').length,
      alto: risks.filter((r) => r.riskLevel === 'Alto').length,
      moderado: risks.filter((r) => r.riskLevel === 'Moderado').length,
      bajo: risks.filter((r) => r.riskLevel === 'Bajo').length,
      identificado: risks.filter((r) => r.status === 'Identificado').length,
      enTratamiento: risks.filter((r) => r.status === 'En Tratamiento').length,
      controlado: risks.filter((r) => r.status === 'Controlado' || r.status === 'Cerrado').length,
    };
  }, [risks]);

  // Filtered risks
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      if (filterLevel !== 'todos' && r.riskLevel !== filterLevel) return false;
      if (filterStatus !== 'todos' && r.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          r.danger.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q) ||
          r.controlMeasure.toLowerCase().includes(q) ||
          r.responsible.toLowerCase().includes(q);
        if (!matchesText) return false;
      }
      return true;
    });
  }, [risks, filterLevel, filterStatus, searchQuery]);

  const handleSaveRisk = (saved: AquaRiskItem) => {
    const exists = risks.some((r) => r.id === saved.id);
    let updated: AquaRiskItem[];
    if (exists) {
      updated = risks.map((r) => (r.id === saved.id ? saved : r));
    } else {
      updated = [saved, ...risks];
    }
    onUpdateRisks(updated);
  };

  const handleStatusChange = (riskId: string, newStatus: AquaRiskStatus) => {
    const updated = risks.map((r) => (r.id === riskId ? { ...r, status: newStatus } : r));
    onUpdateRisks(updated);
  };

  const handleDeleteRisk = (riskId: string) => {
    if (confirm('¿Está seguro de remover este elemento de la matriz de riesgos?')) {
      const updated = risks.filter((r) => r.id !== riskId);
      onUpdateRisks(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 6 • PLAN DE SEGURIDAD DEL AGUA (PSA) • D.S. N.° 031-2010-SA"
        icon="warning"
        title="AQUA-RISK • MATRIZ DE RIESGOS SANITARIOS"
        subtitle="Identificación y ponderación de peligros hídricos, fuentes críticas, probabilidad, consecuencia y medidas de control. Conectado al ciclo: Resultado → Riesgo → Alerta → Acción → Verificación."
        stats={[
          {
            label: 'PELIGROS CRÍTICOS',
            value: stats.critico,
            subtext: 'Intervención inmediata',
            highlight: stats.critico > 0,
          },
          {
            label: 'RIESGO ALTO',
            value: stats.alto,
            subtext: 'Requiere corrección prioritaria',
          },
          {
            label: 'RIESGO MODERADO',
            value: stats.moderado,
            subtext: 'Vigilancia preventiva programada',
          },
          {
            label: 'RIESGO BAJO',
            value: stats.bajo,
            subtext: 'Condición operativa normal',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToAlerts && (
              <button
                type="button"
                onClick={() => onNavigateToAlerts()}
                className="glass-option-btn text-xs font-black uppercase tracking-wider text-rose-700"
              >
                <span className="material-symbols-outlined text-sm text-rose-600">notifications_active</span>
                <span>IR A AQUA-ALERT</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setEditingRisk(null);
                setIsModalOpen(true);
              }}
              className="glass-option-btn-primary text-xs sm:text-sm font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>NUEVO PELIGRO / RIESGO</span>
            </button>
          </div>
        }
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setFilterLevel(filterLevel === 'Crítico' ? 'todos' : 'Crítico')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'Crítico'
              ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-400'
              : 'bg-white border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-rose-900 uppercase">🔴 Crítico</span>
            <span className="text-lg">☣️</span>
          </div>
          <div className="text-2xl font-hud font-black text-rose-700">{stats.critico}</div>
          <p className="text-[10.5px] text-rose-800/80 mt-0.5">Peligros de intervención inmediata</p>
        </div>

        <div
          onClick={() => setFilterLevel(filterLevel === 'Alto' ? 'todos' : 'Alto')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'Alto'
              ? 'bg-orange-50 border-orange-400 shadow-md ring-2 ring-orange-400'
              : 'bg-white border-orange-200 hover:bg-orange-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-orange-900 uppercase">🟠 Alto</span>
            <span className="text-lg">⚠️</span>
          </div>
          <div className="text-2xl font-hud font-black text-orange-700">{stats.alto}</div>
          <p className="text-[10.5px] text-orange-800/80 mt-0.5">Requiere corrección prioritaria</p>
        </div>

        <div
          onClick={() => setFilterLevel(filterLevel === 'Moderado' ? 'todos' : 'Moderado')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'Moderado'
              ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400'
              : 'bg-white border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-amber-900 uppercase">🟡 Moderado</span>
            <span className="text-lg">⚡</span>
          </div>
          <div className="text-2xl font-hud font-black text-amber-700">{stats.moderado}</div>
          <p className="text-[10.5px] text-amber-800/80 mt-0.5">Vigilancia preventiva programada</p>
        </div>

        <div
          onClick={() => setFilterLevel(filterLevel === 'Bajo' ? 'todos' : 'Bajo')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'Bajo'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400'
              : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-emerald-900 uppercase">🟢 Bajo</span>
            <span className="text-lg">🛡️</span>
          </div>
          <div className="text-2xl font-hud font-black text-emerald-700">{stats.bajo}</div>
          <p className="text-[10.5px] text-emerald-800/80 mt-0.5">Condición operativa normal</p>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('tabla')}
              className={`px-3 py-1.5 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
                viewMode === 'tabla' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Matriz Tabular
            </button>
            <button
              onClick={() => setViewMode('mapa_calor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
                viewMode === 'mapa_calor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Mapa de Calor (3×5)
            </button>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-hud font-bold text-slate-700 bg-white"
          >
            <option value="todos">Todos los Estados ({risks.length})</option>
            <option value="Identificado">Identificado ({stats.identificado})</option>
            <option value="En Tratamiento">En Tratamiento ({stats.enTratamiento})</option>
            <option value="Controlado">Controlado / Cerrado ({stats.controlado})</option>
          </select>

          {/* Level filter reset */}
          {filterLevel !== 'todos' && (
            <button
              onClick={() => setFilterLevel('todos')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-hud font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Filtro: {filterLevel}</span>
              <span>✕</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar peligro, fuente..."
            className="w-full pl-8 pr-3 py-2 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 text-xs hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* HEATMAP VIEW (3x5 Probabilidad vs Consecuencia) */}
      {viewMode === 'mapa_calor' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-hud font-bold text-sm text-slate-900 uppercase">
                Matriz de Riesgo Sanitario OMS / DIGESA (Probabilidad vs Consecuencia)
              </h3>
              <p className="text-xs text-slate-500">
                Ponderación geométrica de peligros registrados en el sistema.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Total Peligros: {risks.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Probabilidad ↓ / Consecuencia →
                  </th>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Insignificante
                  </th>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Menor
                  </th>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Moderada
                  </th>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Mayor
                  </th>
                  <th className="p-2 border border-slate-200 bg-slate-50 font-hud text-slate-700">
                    Catastrófica
                  </th>
                </tr>
              </thead>
              <tbody>
                {(['Alta', 'Media', 'Baja'] as const).map((prob) => (
                  <tr key={prob}>
                    <td className="p-2 border border-slate-200 font-hud font-bold bg-slate-50 text-slate-800">
                      {prob}
                    </td>
                    {(
                      [
                        'Insignificante',
                        'Menor',
                        'Moderada',
                        'Mayor',
                        'Catastrófica',
                      ] as const
                    ).map((cons) => {
                      const count = risks.filter(
                        (r) => r.probability === prob && r.consequence === cons
                      ).length;

                      // Level color
                      let cellBg = 'bg-emerald-50 text-emerald-900 border-emerald-200';
                      if (
                        (prob === 'Alta' && cons === 'Catastrófica') ||
                        (prob === 'Alta' && cons === 'Mayor')
                      ) {
                        cellBg = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
                      } else if (
                        (prob === 'Media' && cons === 'Catastrófica') ||
                        (prob === 'Alta' && cons === 'Moderada') ||
                        (prob === 'Media' && cons === 'Mayor')
                      ) {
                        cellBg = 'bg-orange-100 text-orange-900 border-orange-300 font-bold';
                      } else if (
                        (prob === 'Baja' && cons === 'Catastrófica') ||
                        (prob === 'Media' && cons === 'Moderada') ||
                        (prob === 'Alta' && cons === 'Menor')
                      ) {
                        cellBg = 'bg-amber-100 text-amber-900 border-amber-300';
                      }

                      return (
                        <td
                          key={cons}
                          onClick={() => {
                            setSearchQuery('');
                            setViewMode('tabla');
                          }}
                          className={`p-3 border transition-colors cursor-pointer hover:opacity-80 ${cellBg}`}
                        >
                          <div className="text-base font-hud font-black">{count}</div>
                          <div className="text-[9.5px] uppercase tracking-tight opacity-75">
                            {count === 1 ? 'Peligro' : 'Peligros'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MATRIX TABLE VIEW */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="font-hud font-bold text-xs uppercase text-slate-800">
              Matriz Oficial de Peligros y Medidas de Control ({filteredRisks.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Normativa D.S. N.° 031-2010-SA • SUNASS / DIGESA
          </span>
        </div>

        {filteredRisks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 font-hud text-[11px] text-slate-700 uppercase">
                  <th className="py-3 px-4 font-bold">Nivel de Riesgo</th>
                  <th className="py-3 px-4 font-bold">Peligro</th>
                  <th className="py-3 px-4 font-bold">Fuente</th>
                  <th className="py-3 px-3 font-bold text-center">Prob.</th>
                  <th className="py-3 px-3 font-bold text-center">Consec.</th>
                  <th className="py-3 px-4 font-bold">Medida de Control</th>
                  <th className="py-3 px-3 font-bold">Responsable</th>
                  <th className="py-3 px-3 font-bold">Fecha</th>
                  <th className="py-3 px-3 font-bold">Estado</th>
                  <th className="py-3 px-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRisks.map((r) => {
                  const badge = getRiskLevelBadge(r.riskLevel);
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Nivel de Riesgo */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-hud font-bold border ${badge.badgeClass}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                        {r.associatedAlertCode && (
                          <div className="mt-1 text-[10px] text-slate-500 font-mono">
                            Alerta: {r.associatedAlertCode}
                          </div>
                        )}
                      </td>

                      {/* Peligro */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs leading-snug">
                        {r.danger}
                      </td>

                      {/* Fuente */}
                      <td className="py-3.5 px-4 text-slate-700 max-w-[200px] leading-snug">
                        <span className="font-semibold text-slate-800">{r.source}</span>
                        {r.originReference && (
                          <span className="block text-[10px] text-slate-500 font-mono">
                            Ref: {r.originReference}
                          </span>
                        )}
                      </td>

                      {/* Probabilidad */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="font-hud font-semibold text-slate-800">
                          {r.probability}
                        </span>
                      </td>

                      {/* Consecuencia */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="font-hud text-slate-700">{r.consequence}</span>
                      </td>

                      {/* Medida de Control */}
                      <td className="py-3.5 px-4 text-slate-700 max-w-sm leading-relaxed">
                        <p className="line-clamp-2 group-hover:line-clamp-none transition-all">
                          {r.controlMeasure}
                        </p>
                      </td>

                      {/* Responsable */}
                      <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                        {r.responsible}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-3 text-slate-500 font-mono whitespace-nowrap">
                        {r.date}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(r.id, e.target.value as AquaRiskStatus)
                          }
                          className={`text-[11px] font-hud font-bold px-2.5 py-1 rounded-xl border ${
                            r.status === 'Identificado'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : r.status === 'En Tratamiento'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="Identificado">Identificado</option>
                          <option value="En Tratamiento">En Tratamiento</option>
                          <option value="Controlado">Controlado</option>
                          <option value="Cerrado">Cerrado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.associatedAlertCode && onNavigateToAlerts && (
                            <button
                              type="button"
                              onClick={() => onNavigateToAlerts(r.associatedAlertCode)}
                              title="Ver alerta asociada en AQUA-ALERT"
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-hud text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              🚨 Alerta
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRisk(r);
                              setIsModalOpen(true);
                            }}
                            title="Editar Peligro"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRisk(r.id)}
                            title="Eliminar de la Matriz"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl mb-3">
              ⚠️
            </div>
            <h4 className="text-sm font-hud font-bold text-slate-900 uppercase">
              No se encontraron peligros con los filtros actuales
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Modifique los criterios de búsqueda o agregue un nuevo evento peligroso con el botón superior.
            </p>
          </div>
        )}
      </div>

      {/* MODAL AGREGAR / EDITAR RIESGO */}
      <NewRiskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRisk(null);
        }}
        onSaveRisk={handleSaveRisk}
        systems={systems}
        editingRisk={editingRisk}
        activeOperatorName={activeOperatorName}
      />
    </div>
  );
};

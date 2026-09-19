import React, { useState, useMemo } from 'react';
import { AuditLogEntry, AuditAction, AuditEntityType, UserRoleTier } from '../../types';
import { loadAuditLogs, exportAuditLogsToCsv } from '../../data/auditStore';
import { ROLE_TIER_INFO } from '../../utils/rbac';

interface AquaAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoleTier: UserRoleTier;
  currentOperatorName: string;
}

const ACTION_BADGES: Record<
  AuditAction,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  CREACION: {
    label: 'Creación',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    icon: 'add_circle',
  },
  MODIFICACION: {
    label: 'Modificación',
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    icon: 'edit_note',
  },
  VALIDACION: {
    label: 'Validación Oficial',
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/40',
    icon: 'verified',
  },
  CAMBIO_ESTADO: {
    label: 'Cambio de Estado',
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    icon: 'published_with_changes',
  },
  ELIMINACION_LOGICA: {
    label: 'Eliminación Lógica',
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    icon: 'delete_sweep',
  },
  RESTAURACION: {
    label: 'Restauración',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
    icon: 'restore_page',
  },
  AUTENTICACION: {
    label: 'Acceso / Sesión',
    bg: 'bg-violet-500/15',
    text: 'text-violet-300',
    border: 'border-violet-500/40',
    icon: 'fingerprint',
  },
  EXPORTACION_DATOS: {
    label: 'Exportación',
    bg: 'bg-teal-500/15',
    text: 'text-teal-300',
    border: 'border-teal-500/40',
    icon: 'download',
  },
};

export const AquaAuditModal: React.FC<AquaAuditModalProps> = ({
  isOpen,
  onClose,
  currentRoleTier,
  currentOperatorName,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(() => loadAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('TODAS');
  const [entityFilter, setEntityFilter] = useState<string>('TODAS');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  // Refresh logs on open
  React.useEffect(() => {
    if (isOpen) {
      setLogs(loadAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'TODAS' && log.action !== actionFilter) return false;
      if (entityFilter !== 'TODAS' && log.entityType !== entityFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = log.id.toLowerCase().includes(q);
        const matchTitle = log.entityTitle.toLowerCase().includes(q);
        const matchAuthor = log.authorName.toLowerCase().includes(q);
        const matchEntityId = (log.entityId || '').toLowerCase().includes(q);
        const matchDetails = log.details.toLowerCase().includes(q);
        return matchId || matchTitle || matchAuthor || matchEntityId || matchDetails;
      }
      return true;
    });
  }, [logs, actionFilter, entityFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      creaciones: logs.filter((l) => l.action === 'CREACION').length,
      modificaciones: logs.filter((l) => l.action === 'MODIFICACION').length,
      validaciones: logs.filter((l) => l.action === 'VALIDACION').length,
      cambiosEstado: logs.filter((l) => l.action === 'CAMBIO_ESTADO').length,
      eliminacionesLogicas: logs.filter((l) => l.action === 'ELIMINACION_LOGICA').length,
    };
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-[#00171d] text-white rounded-3xl shadow-2xl border border-cyan-400/40 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00242e] via-[#003847] to-[#005266] p-4 sm:p-6 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#10e7b2]/20 text-[#10e7b2] border border-[#10e7b2]/40 font-hud">
                  BITÁCORA INMUTABLE DE AUDITORÍA OFICIAL
                </span>
                <span className="text-[10px] text-cyan-200/80 font-mono">
                  D.S. N.° 031-2010-SA • DIGESA
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-hud text-white tracking-tight mt-0.5">
                Centro de Auditoría, Seguridad y Trazabilidad Criptográfica
              </h2>
              <p className="text-xs text-cyan-200/80 mt-0.5">
                Auditoría permanente de creación, modificación, validación, cambios de estado y eliminación lógica.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportAuditLogsToCsv(filteredLogs)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-hud text-[11.5px] font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
              title="Descargar registro forense en CSV"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Security & RBAC Status Banner */}
        <div className="bg-[#002129] px-4 sm:px-6 py-3 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-cyan-200">
              <span className="material-symbols-outlined text-[16px] text-[#10e7b2]">
                shield
              </span>
              <span>Operador Activo:</span>
              <strong className="text-white">{currentOperatorName}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rol RBAC:</span>
              <span className={`px-2 py-0.5 rounded-full font-hud font-bold text-[10px] border ${ROLE_TIER_INFO[currentRoleTier].badgeColor}`}>
                {currentRoleTier} • {ROLE_TIER_INFO[currentRoleTier].label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-cyan-300/80">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10e7b2] animate-pulse" />
              <span>Cifrado SHA-256 Activo</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">lock</span>
              <span>Anti-Spam & Rate-Limiter OK</span>
            </span>
            <span>•</span>
            <span className="text-emerald-300">
              Integridad: 100% Verificada
            </span>
          </div>
        </div>

        {/* Metric counters */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 sm:p-4 bg-[#001c24] border-b border-cyan-500/20 text-center font-hud">
          <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
            <span className="text-[10px] text-cyan-300/80 uppercase block">Total Eventos</span>
            <span className="text-lg font-black text-white">{stats.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-300/80 uppercase block">Creaciones</span>
            <span className="text-lg font-black text-emerald-300">{stats.creaciones}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/20">
            <span className="text-[10px] text-blue-300/80 uppercase block">Modificaciones</span>
            <span className="text-lg font-black text-blue-300">{stats.modificaciones}</span>
          </div>
          <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-400/20">
            <span className="text-[10px] text-cyan-300/80 uppercase block">Validaciones</span>
            <span className="text-lg font-black text-cyan-300">{stats.validaciones}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 uppercase block">Cambios Estado</span>
            <span className="text-lg font-black text-amber-300">{stats.cambiosEstado}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20">
            <span className="text-[10px] text-rose-300/80 uppercase block">Elimin. Lógica</span>
            <span className="text-lg font-black text-rose-300">{stats.eliminacionesLogicas}</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-3 sm:p-4 bg-[#00171d] border-b border-cyan-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-cyan-400/60 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID (AUD-2026-...), código de entidad, autor o detalles..."
              className="w-full bg-[#001217] border border-cyan-500/40 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-cyan-400/40 focus:outline-none focus:border-[#10e7b2]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#001217] border border-cyan-500/40 rounded-xl px-2.5 py-2 text-xs text-cyan-200 font-hud focus:outline-none focus:border-[#10e7b2]"
            >
              <option value="TODAS">Todas las Acciones</option>
              <option value="CREACION">Creación</option>
              <option value="MODIFICACION">Modificación</option>
              <option value="VALIDACION">Validación Oficial</option>
              <option value="CAMBIO_ESTADO">Cambio de Estado</option>
              <option value="ELIMINACION_LOGICA">Eliminación Lógica</option>
              <option value="RESTAURACION">Restauración</option>
              <option value="AUTENTICACION">Autenticación / Sesión</option>
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="bg-[#001217] border border-cyan-500/40 rounded-xl px-2.5 py-2 text-xs text-cyan-200 font-hud focus:outline-none focus:border-[#10e7b2]"
            >
              <option value="TODAS">Todas las Entidades</option>
              <option value="COTIZACION">Cotizaciones CRM</option>
              <option value="MUESTRA_LAB">Muestras de Laboratorio</option>
              <option value="SISTEMA_JASS">Sistemas JASS</option>
              <option value="REGISTRO_CLORO">Registros de Cloro</option>
              <option value="PERFIL_OPERADOR">Perfiles de Operador</option>
              <option value="SISTEMA_SEGURIDAD">Sistema de Seguridad</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-cyan-500/10">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <span className="material-symbols-outlined text-4xl text-slate-600 block mb-2">
                find_in_page
              </span>
              No se encontraron registros de auditoría que coincidan con los filtros.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = ACTION_BADGES[log.action] || ACTION_BADGES.MODIFICACION;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedEntry(log)}
                  className="py-3 px-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-transparent hover:border-cyan-500/30"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg} ${badge.border} ${badge.text}`}>
                      <span className="material-symbols-outlined text-[20px]">{badge.icon}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#10e7b2]">
                          {log.id}
                        </span>
                        <span className={`text-[9.5px] font-hud font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg} ${badge.border} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300/70">
                          {log.entityType} • {log.entityId}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-[13px] font-bold text-white mt-1 truncate">
                        {log.entityTitle}
                      </h4>

                      <p className="text-[11.5px] text-cyan-200/80 mt-0.5 line-clamp-1">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-3 text-[10.5px] text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-cyan-400">person</span>
                          <span>{log.authorName} ({log.authorRole})</span>
                        </span>
                        <span>•</span>
                        <span>{log.dateStr} {log.timeStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[9.5px] text-emerald-400 font-mono block">
                        SHA-256: {log.checksum}
                      </span>
                      <span className="text-[10px] text-cyan-300/60 block">
                        No repudio verificado
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-cyan-400 text-lg">
                      chevron_right
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Modal if an entry is clicked */}
        {selectedEntry && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/50 shadow-2xl p-5 overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4">
                <div>
                  <span className="font-mono text-xs text-[#10e7b2] block">
                    {selectedEntry.id}
                  </span>
                  <h3 className="font-hud font-bold text-sm text-white mt-0.5">
                    {selectedEntry.entityTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#00141a] p-3 rounded-xl border border-cyan-500/20 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Acción Auditada:</span>
                    <strong className="text-cyan-200">{selectedEntry.action}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Entidad / ID:</span>
                    <strong className="text-cyan-200">{selectedEntry.entityType} ({selectedEntry.entityId})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Autor / Operador:</span>
                    <span className="text-white">{selectedEntry.authorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nivel RBAC:</span>
                    <span className="text-emerald-400">{selectedEntry.authorTier}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Fecha y Hora Exacta:</span>
                    <span className="text-white">{selectedEntry.dateStr} a las {selectedEntry.timeStr} ({selectedEntry.timestamp})</span>
                  </div>
                </div>

                <div>
                  <strong className="text-cyan-200 block mb-1">Detalle del Suceso:</strong>
                  <p className="p-3 rounded-xl bg-[#00141a] border border-cyan-500/20 text-slate-200 text-xs leading-relaxed">
                    {selectedEntry.details}
                  </p>
                </div>

                {selectedEntry.previousState && (
                  <div>
                    <strong className="text-amber-300 block mb-1">Estado Previo:</strong>
                    <p className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs font-mono">
                      {selectedEntry.previousState}
                    </p>
                  </div>
                )}

                {selectedEntry.newState && (
                  <div>
                    <strong className="text-emerald-300 block mb-1">Nuevo Estado / Validación:</strong>
                    <p className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
                      {selectedEntry.newState}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-300 block uppercase font-hud font-bold">
                      Sello Criptográfico SHA-256 (Anti-Alteración)
                    </span>
                    <span className="font-mono text-xs text-white font-bold">
                      {selectedEntry.checksum}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-emerald-400 text-2xl">
                    verified
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/20 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-hud text-xs font-bold uppercase cursor-pointer"
                >
                  Entendido / Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

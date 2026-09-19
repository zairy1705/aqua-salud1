import React, { useState } from 'react';
import {
  AquaAlertItem,
  AquaAlertStatus,
} from '../../types';
import { getAlertStatusBadge, getRiskLevelBadge } from '../../data/riskAlertEngine';

interface AlertActionModalProps {
  alert: AquaAlertItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAlert: (updated: AquaAlertItem) => void;
  onOpenDosageAssistant?: (systemId?: string) => void;
  onOpenAquaLab?: (sampleId?: string) => void;
  onNavigateToRisks?: (riskId?: string) => void;
  activeOperatorName?: string;
}

export const AlertActionModal: React.FC<AlertActionModalProps> = ({
  alert,
  isOpen,
  onClose,
  onUpdateAlert,
  onOpenDosageAssistant,
  onOpenAquaLab,
  onNavigateToRisks,
  activeOperatorName = 'Ing. Zaira Salvador Amaya',
}) => {
  if (!isOpen || !alert) return null;

  const statusBadge = getAlertStatusBadge(alert.status);
  const levelBadge = getRiskLevelBadge(alert.level);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState<AquaAlertStatus>(alert.status);
  const [actionNotes, setActionNotes] = useState(
    alert.actionTaken || ''
  );
  const [actionBy, setActionBy] = useState(alert.actionBy || activeOperatorName);
  const [actionDate, setActionDate] = useState(
    alert.actionDate || new Date().toISOString().split('T')[0]
  );
  const [verificationEvidence, setVerificationEvidence] = useState(
    alert.verificationEvidence || ''
  );
  const [verifiedBy, setVerifiedBy] = useState(
    alert.verifiedBy || 'Blgo. Roberto Valdivia (Director Técnico / ATM)'
  );
  const [verifiedDate, setVerifiedDate] = useState(
    alert.verifiedDate || new Date().toISOString().split('T')[0]
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AquaAlertItem = {
      ...alert,
      status: selectedStatus,
      actionTaken: actionNotes.trim() || undefined,
      actionBy: actionBy.trim() || undefined,
      actionDate: actionDate || undefined,
      verificationEvidence:
        selectedStatus === 'VERIFICADA' ? verificationEvidence.trim() || undefined : alert.verificationEvidence,
      verifiedBy:
        selectedStatus === 'VERIFICADA' ? verifiedBy.trim() || undefined : alert.verifiedBy,
      verifiedDate:
        selectedStatus === 'VERIFICADA' ? verifiedDate || undefined : alert.verifiedDate,
    };

    onUpdateAlert(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center text-2xl">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {alert.code}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-hud font-bold border ${levelBadge.badgeClass}`}>
                  {levelBadge.icon} Nivel {levelBadge.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-hud font-bold">
                  Tipo: {alert.type}
                </span>
              </div>
              <h3 className="font-hud font-black text-lg text-slate-900 mt-1 uppercase">
                Gestión de Alerta e Incidencia Sanitaria
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* PROVENANCE AND ORIGIN SECTION */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-hud font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <span>📍 Trazabilidad y Origen del Dato:</span>
              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verificado • No generado sobre datos inexistentes
              </span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Detectado: {alert.origin.detectedAt}
            </span>
          </div>

          <p className="text-xs text-slate-800 font-sans leading-relaxed">
            {alert.origin.details}
          </p>

          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600">
            <div>
              <strong>Sistema:</strong> {alert.system} • <strong>Punto:</strong> {alert.point}
            </div>
            <div>
              <strong>Referencia:</strong> {alert.origin.referenceCode}
            </div>
          </div>
        </div>

        {/* PARAMETER & RESULT DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-white border border-slate-200">
            <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
              Parámetro Evaluado
            </span>
            <span className="text-xs font-hud font-black text-slate-900 block mt-0.5">
              {alert.parameter}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200">
            <span className="text-[10px] font-hud font-bold text-rose-700 uppercase block">
              Resultado Obtenido
            </span>
            <span className="text-sm font-mono font-black text-rose-800 block mt-0.5">
              {alert.result}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block">
              Criterio Normativo
            </span>
            <span className="text-xs font-sans text-slate-700 block mt-0.5 leading-tight">
              {alert.criterion}
            </span>
          </div>
        </div>

        {/* REQUIRED ACTION PROTOCOL */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-hud font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <span>⚡ Acción Requerida Inmediata:</span>
            </span>
            <span className="text-[11px] font-medium text-amber-800">
              Resp: {alert.responsible}
            </span>
          </div>
          <p className="text-xs text-amber-950 font-sans leading-relaxed">
            {alert.requiredAction}
          </p>

          {/* Quick links to actions */}
          <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex flex-wrap gap-2">
            {alert.type === 'Desinfección' && onOpenDosageAssistant && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDosageAssistant();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-hud font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🧪 Abrir Asistente de Dosificación (7 Pasos)</span>
              </button>
            )}

            {alert.origin.type === 'muestra_laboratorio' && onOpenAquaLab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAquaLab(alert.origin.referenceId);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-hud font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🔬 Inspeccionar Muestra en AQUA-LAB</span>
              </button>
            )}

            {alert.riskId && onNavigateToRisks && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToRisks(alert.riskId);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-amber-300 text-xs font-hud font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>⚠️ Ver en Matriz AQUA-RISK</span>
              </button>
            )}
          </div>
        </div>

        {/* WORKFLOW: ACCIÓN → VERIFICACIÓN */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-hud font-bold text-slate-800 uppercase block">
              Actualizar Ciclo de Atención (Acción → Verificación)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estado Actual del Caso *
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as AquaAlertStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-hud font-bold bg-white"
                >
                  <option value="PENDIENTE">1. PENDIENTE (Sin intervención iniciada)</option>
                  <option value="EN PROCESO">2. EN PROCESO (Medida correctiva en curso)</option>
                  <option value="RESUELTA">3. RESUELTA (Intervención técnica completada)</option>
                  <option value="VERIFICADA">4. VERIFICADA (Confirmación analítica aprobada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Operador / Responsable de Acción
                </label>
                <input
                  type="text"
                  value={actionBy}
                  onChange={(e) => setActionBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                />
              </div>
            </div>

            {/* Acción Ejecutada */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bitácora de Acción Ejecutada (Medida Correctiva Aplicada)
              </label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Detalle los trabajos efectuados: ej. Calibración de goteo a 18 gotas/min, recarga de solución madre con 2 kg de hipoclorito..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Verificación Sanitaria (si está RESUELTA o VERIFICADA) */}
            {(selectedStatus === 'RESUELTA' || selectedStatus === 'VERIFICADA') && (
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <span className="text-xs font-hud font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <span>🛡️ Protocolo de Verificación Sanitaria (Cierre Normativo)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Verificado / Fiscalizado por
                    </label>
                    <input
                      type="text"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Fecha de Contra-Ensayo o Inspección
                    </label>
                    <input
                      type="date"
                      value={verifiedDate}
                      onChange={(e) => setVerifiedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Evidencia de Conformidad / Resultado de Verificación
                  </label>
                  <input
                    type="text"
                    value={verificationEvidence}
                    onChange={(e) => setVerificationEvidence(e.target.value)}
                    placeholder="Ej: Contra-ensayo DPD en extremo terminal arrojó 1.10 mg/L Cl₂ Libre. Acta de conformidad firmada."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-hud font-bold uppercase transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-hud font-extrabold uppercase shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Guardar Cambios de Alerta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
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
} from '../../data/actionPlanStore';

interface ActionPlanModalProps {
  plan?: ActionPlanItem | null;
  alertToConvert?: AquaAlertItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: ActionPlanItem) => void;
  operatorName?: string;
  systemsList?: { id: string; name: string }[];
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  plan,
  alertToConvert,
  isOpen,
  onClose,
  onSave,
  operatorName = 'Ing. Zaira Salvador Amaya',
  systemsList = [],
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(plan);
  const nowStr = new Date().toISOString().split('T')[0];

  // Initialize form state
  const [problema, setProblema] = useState<string>(() => {
    if (plan) return plan.problema;
    if (alertToConvert) {
      return `[Alerta ${alertToConvert.code}] ${alertToConvert.parameter}: ${alertToConvert.result} (Criterio: ${alertToConvert.criterion}) en ${alertToConvert.system} - ${alertToConvert.point}`;
    }
    return '';
  });

  const [causaProbable, setCausaProbable] = useState<string>(() => {
    if (plan) return plan.causaProbable;
    if (alertToConvert) {
      const p = alertToConvert.parameter.toLowerCase();
      if (p.includes('coli') || p.includes('bacter')) {
        return 'Interrupción de la cloración continua en reservorio y probable filtración de escorrentía en tramo terminal de red.';
      }
      if (p.includes('cloro')) {
        return 'Agotamiento de solución clorada en tanque dosificador o atasco en el conducto de goteo.';
      }
      if (p.includes('metal') || p.includes('arsénico') || p.includes('plomo')) {
        return 'Aporte mineral hidrogeológico natural en la cuenca de recarga o pasivos mineros aguas arriba.';
      }
      return 'Falla operativa en sistema de tratamiento / desinfección.';
    }
    return '';
  });

  const [accion, setAccion] = useState<string>(() => {
    if (plan) return plan.accion;
    if (alertToConvert) {
      return alertToConvert.requiredAction || '';
    }
    return '';
  });

  const [responsable, setResponsable] = useState<string>(() => {
    if (plan) return plan.responsable;
    if (alertToConvert) return alertToConvert.responsible || operatorName;
    return operatorName;
  });

  const [systemName, setSystemName] = useState<string>(() => {
    if (plan) return plan.systemName;
    if (alertToConvert) return alertToConvert.system;
    return systemsList[0]?.name || 'Sistema Huamachuco Norte';
  });

  const [punto, setPunto] = useState<string>(() => {
    if (plan) return plan.punto || '';
    if (alertToConvert) return alertToConvert.point;
    return 'Red de Distribución';
  });

  const [fecha, setFecha] = useState<string>(() => {
    if (plan) return plan.fecha;
    return nowStr;
  });

  const [fechaLimite, setFechaLimite] = useState<string>(() => {
    if (plan) return plan.fechaLimite;
    // Default 3 days from now
    const d = new Date(Date.now() + 3 * 864e5);
    return d.toISOString().split('T')[0];
  });

  const [prioridad, setPrioridad] = useState<ActionPlanItem['prioridad']>(() => {
    if (plan) return plan.prioridad;
    if (alertToConvert) {
      if (alertToConvert.level === 'Crítico') return 'Crítica';
      if (alertToConvert.level === 'Alto') return 'Alta';
      if (alertToConvert.level === 'Moderado') return 'Media';
      return 'Baja';
    }
    return 'Alta';
  });

  const [categoria, setCategoria] = useState<ActionPlanItem['categoria']>(() => {
    if (plan) return plan.categoria;
    if (alertToConvert) return alertToConvert.type;
    return 'Desinfección';
  });

  const [estado, setEstado] = useState<ActionPlanFlowStage>(() => {
    if (plan) return plan.estado;
    return 'PLAN DE ACCIÓN';
  });

  // Implementation details
  const [notasImplementacion, setNotasImplementacion] = useState(plan?.notasImplementacion || '');
  const [fechaImplementacion, setFechaImplementacion] = useState(plan?.fechaImplementacion || '');

  // Evidence details
  const [evidenciaDesc, setEvidenciaDesc] = useState(plan?.evidencia?.descripcion || '');
  const [evidenciaTipo, setEvidenciaTipo] = useState(plan?.evidencia?.tipoEvidencia || 'fotografia');
  const [evidenciaArchivo, setEvidenciaArchivo] = useState(plan?.evidencia?.archivoNombre || '');

  // Verification details
  const [verifConforme, setVerifConforme] = useState<boolean>(plan?.verificacion?.conforme ?? true);
  const [verificadoPor, setVerificadoPor] = useState(plan?.verificacion?.verificadoPor || operatorName);
  const [verifNotas, setVerifNotas] = useState(plan?.verificacion?.notas || '');
  const [verifResultado, setVerifResultado] = useState(plan?.verificacion?.resultadoMedicion || '');
  const [verifEntidad, setVerifEntidad] = useState(plan?.verificacion?.entidadVerificadora || 'Área Técnica Municipal (ATM)');

  const [activeTabSection, setActiveTabSection] = useState<'general' | 'implementacion' | 'evidencia' | 'verificacion'>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problema.trim() || !accion.trim() || !responsable.trim()) {
      alert('Por favor complete los campos obligatorios: Problema, Acción y Responsable.');
      return;
    }

    const planId = plan?.id || `PLA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const savedPlan: ActionPlanItem = {
      id: planId,
      alertCode: plan?.alertCode || alertToConvert?.code,
      systemName,
      punto,
      categoria,
      prioridad,
      problema: problema.trim(),
      causaProbable: causaProbable.trim() || 'Por determinar en inspección preliminar.',
      accion: accion.trim(),
      responsable: responsable.trim(),
      fecha,
      fechaLimite,
      estado,
      notasImplementacion: notasImplementacion.trim() || undefined,
      fechaImplementacion: fechaImplementacion || undefined,
      evidencia: evidenciaDesc.trim()
        ? {
            descripcion: evidenciaDesc.trim(),
            tipoEvidencia: evidenciaTipo as any,
            archivoNombre: evidenciaArchivo.trim() || 'Evidencia_Operativa.jpg',
            fechaRegistro: plan?.evidencia?.fechaRegistro || `${nowStr} 12:00`,
            registradoPor: plan?.evidencia?.registradoPor || operatorName,
          }
        : plan?.evidencia,
      verificacion: verifNotas.trim() || verifResultado.trim()
        ? {
            conforme: verifConforme,
            verificadoPor: verificadoPor.trim() || operatorName,
            fechaVerificacion: plan?.verificacion?.fechaVerificacion || `${nowStr} 10:00`,
            notas: verifNotas.trim(),
            resultadoMedicion: verifResultado.trim() || undefined,
            entidadVerificadora: verifEntidad.trim() || undefined,
          }
        : plan?.verificacion,
      createdAt: plan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedPlan);
    onClose();
  };

  const currentStageMeta = getStageMeta(estado);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[10px] font-hud font-bold uppercase tracking-wider">
                FASE 8 • GESTIÓN DE ACCIONES CORRECTIVAS
              </span>
              {alertToConvert && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-mono font-bold">
                  Desde Alerta {alertToConvert.code}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-hud font-bold text-white mt-1 flex items-center gap-2">
              <span>📋</span>
              <span>{isEditing ? `Editar Plan: ${plan?.id}` : 'Nuevo Plan de Acción'}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* WORKFLOW PROGRESS TRACKER */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[580px] gap-2">
            {ACTION_PLAN_STAGES.map((s, idx) => {
              const isCurrent = estado === s.id;
              const isPast =
                ACTION_PLAN_STAGES.findIndex((st) => st.id === estado) > idx;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setEstado(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-hud font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? `${s.badgeClass} ring-2 ring-teal-600 shadow-xs scale-105`
                      : isPast
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 opacity-90'
                      : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'
                  }`}
                  title={`Cambiar estado a ${s.label}`}
                >
                  <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB NAVIGATION INSIDE MODAL */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabSection('general')}
            className={`pb-2.5 px-3 text-xs font-hud font-bold transition-all border-b-2 cursor-pointer ${
              activeTabSection === 'general'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Definición y Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('implementacion')}
            className={`pb-2.5 px-3 text-xs font-hud font-bold transition-all border-b-2 cursor-pointer ${
              activeTabSection === 'implementacion'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Implementación
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('evidencia')}
            className={`pb-2.5 px-3 text-xs font-hud font-bold transition-all border-b-2 cursor-pointer ${
              activeTabSection === 'evidencia'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Evidencia
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('verificacion')}
            className={`pb-2.5 px-3 text-xs font-hud font-bold transition-all border-b-2 cursor-pointer ${
              activeTabSection === 'verificacion'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Verificación y Cierre
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {activeTabSection === 'general' && (
            <div className="space-y-4">
              {/* Row 1: System and Point */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Sistema Hídrico *
                  </label>
                  <input
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ej. Acuífero Alfa - Tanque Central"
                  />
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Punto de Muestreo / Componente
                  </label>
                  <input
                    type="text"
                    value={punto}
                    onChange={(e) => setPunto(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ej. Red Domiciliaria - Extremo terminal"
                  />
                </div>
              </div>

              {/* Row 2: Priority and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Categoría *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Microbiológica">Microbiológica</option>
                    <option value="Desinfección">Desinfección</option>
                    <option value="Química">Química / Metales</option>
                    <option value="Operativa">Operativa</option>
                    <option value="JASS">JASS / Gestión Comunal</option>
                    <option value="Territorial">Territorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Prioridad *
                  </label>
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  >
                    <option value="Crítica" className="text-rose-600">Crítica (24-48h)</option>
                    <option value="Alta" className="text-amber-600">Alta (72h)</option>
                    <option value="Media" className="text-blue-600">Media (7 días)</option>
                    <option value="Baja" className="text-slate-600">Baja (15 días)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Estado Actual *
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-300 text-sm font-hud font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {ACTION_PLAN_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.number}. {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problema (Exigido) */}
              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>1. Problema Identificado *</span>
                  <span className="text-[11px] text-slate-400 font-normal">Descripción clara de la no conformidad</span>
                </label>
                <textarea
                  rows={2}
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  required
                  placeholder="Detallar el parámetro alterado, concentración observada y límite sobrepasado..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Causa Probable (Exigido) */}
              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>2. Causa Probable *</span>
                  <span className="text-[11px] text-slate-400 font-normal">Origen técnico o ambiental de la falla</span>
                </label>
                <textarea
                  rows={2}
                  value={causaProbable}
                  onChange={(e) => setCausaProbable(e.target.value)}
                  required
                  placeholder="Explicar por qué ocurrió: falla de dosificador, lluvia torrencial, agotamiento de reactivo..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Acción (Exigido) */}
              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>3. Acción Correctiva a Ejecutar *</span>
                  <span className="text-[11px] text-slate-400 font-normal">Medidas concretas a implementar</span>
                </label>
                <textarea
                  rows={2}
                  value={accion}
                  onChange={(e) => setAccion(e.target.value)}
                  required
                  placeholder="Pasos específicos: purga de red, shock con 50 ppm de cloro, recalibración de dosificador a 18 mL/min..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Responsable, Fecha, Fecha Límite (Exigidos) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    4. Responsable *
                  </label>
                  <input
                    type="text"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nombre del técnico u operador"
                  />
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    5. Fecha de Registro *
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    6. Fecha Límite *
                  </label>
                  <input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-sm font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTabSection === 'implementacion' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900 font-hud font-bold text-sm">
                  <span>⚙️ Etapa 3: IMPLEMENTACIÓN</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Registre los detalles operativos de los trabajos ejecutados en campo por el operador o cuadrilla técnica.
                </p>
              </div>

              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                  Fecha de Ejecución en Campo
                </label>
                <input
                  type="date"
                  value={fechaImplementacion}
                  onChange={(e) => setFechaImplementacion(e.target.value)}
                  className="w-full sm:w-1/2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                  Bitácora de Implementación y Trabajos Realizados
                </label>
                <textarea
                  rows={4}
                  value={notasImplementacion}
                  onChange={(e) => setNotasImplementacion(e.target.value)}
                  placeholder="Detallar: 'Se desarmó y limpió inyector de hipoclorito, se prepararon 150 litros de solución madre al 2.5%, se realizó purga de 15 minutos en 4 grifos de purga terminal...'"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEstado('IMPLEMENTACIÓN')}
                  className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all ${
                    estado === 'IMPLEMENTACIÓN'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  ✓ Marcar Plan en Estado IMPLEMENTACIÓN
                </button>
              </div>
            </div>
          )}

          {activeTabSection === 'evidencia' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-900 font-hud font-bold text-sm">
                  <span>📸 Etapa 4: EVIDENCIA</span>
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  Adjunte el sustento verificable que demuestre la ejecución de la acción correctiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Tipo de Evidencia
                  </label>
                  <select
                    value={evidenciaTipo}
                    onChange={(e) => setEvidenciaTipo(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="fotografia">Fotografía de Campo / Georreferenciada</option>
                    <option value="acta_comunal">Acta de Faena Comunal / JASS</option>
                    <option value="boleta_dosificacion">Boleta de Calibración / Dosificación</option>
                    <option value="informe_laboratorio">Informe de Ensayo de Laboratorio</option>
                    <option value="otro">Otro Documento Técnico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Nombre o Referencia del Archivo
                  </label>
                  <input
                    type="text"
                    value={evidenciaArchivo}
                    onChange={(e) => setEvidenciaArchivo(e.target.value)}
                    placeholder="ej. Foto_Reparacion_TanqueDosificador.jpg"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                  Descripción Detallada de la Evidencia
                </label>
                <textarea
                  rows={3}
                  value={evidenciaDesc}
                  onChange={(e) => setEvidenciaDesc(e.target.value)}
                  placeholder="Detallar lo que muestra la evidencia: 'Fotografía donde se observa el nuevo dosificador de goteo instalado operando a 18 mL/min y constancia de lectura DPD de 1.20 ppm...'"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEstado('EVIDENCIA')}
                  className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all ${
                    estado === 'EVIDENCIA'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  ✓ Marcar Plan en Estado EVIDENCIA
                </button>
              </div>
            </div>
          )}

          {activeTabSection === 'verificacion' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                <div className="flex items-center gap-2 text-teal-900 font-hud font-bold text-sm">
                  <span>🔍 Etapa 5 y 6: VERIFICACIÓN Y CIERRE</span>
                </div>
                <p className="text-xs text-teal-700 mt-1">
                  Validación técnica de la efectividad de la acción correctiva mediante remuestreo y conformidad normativa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Evaluador / Supervisor Técnico *
                  </label>
                  <input
                    type="text"
                    value={verificadoPor}
                    onChange={(e) => setVerificadoPor(e.target.value)}
                    placeholder="Nombre del inspector o director"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                    Entidad Verificadora
                  </label>
                  <input
                    type="text"
                    value={verifEntidad}
                    onChange={(e) => setVerifEntidad(e.target.value)}
                    placeholder="ej. Área Técnica Municipal (ATM) / DIRESA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                  Resultado de Medición Post-Intervención
                </label>
                <input
                  type="text"
                  value={verifResultado}
                  onChange={(e) => setVerifResultado(e.target.value)}
                  placeholder="ej. Cloro libre residual: 1.25 ppm (Óptimo) • E. coli: 0 NMP/100 mL"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                  Dictamen Técnico y Notas de Verificación
                </label>
                <textarea
                  rows={3}
                  value={verifNotas}
                  onChange={(e) => setVerifNotas(e.target.value)}
                  placeholder="Detallar el análisis de cumplimiento: 'Se verificó restablecimiento de parámetros dentro de norma D.S. 031-2010-SA...'"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-hud font-bold text-slate-900 block">
                    Conformidad Técnica Sanitaria
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {verifConforme
                      ? 'La acción resolvió la causa y los parámetros cumplen el D.S. N.° 031-2010-SA.'
                      : 'Requiere reajuste operativo o mayor tiempo de contacto.'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setVerifConforme(!verifConforme)}
                  className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all cursor-pointer ${
                    verifConforme
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {verifConforme ? '✓ CONFORME' : '⚠ REQUIERE REAJUSTE'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEstado('VERIFICACIÓN')}
                  className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all ${
                    estado === 'VERIFICACIÓN'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  }`}
                >
                  Pase a VERIFICACIÓN
                </button>

                <button
                  type="button"
                  onClick={() => setEstado('CIERRE')}
                  className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all ${
                    estado === 'CIERRE'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  🏁 APROBAR Y CERRAR EXPEDIENTE
                </button>
              </div>
            </div>
          )}

          {/* MODAL FOOTER */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-hud font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-hud font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Guardar Plan de Acción →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

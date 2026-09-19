import React, { useState } from 'react';
import {
  AquaRiskItem,
  AquaRiskProbability,
  AquaRiskConsequence,
  AquaRiskStatus,
  WaterSystem,
} from '../../types';
import { calculateRiskLevel, getRiskLevelBadge } from '../../data/riskAlertEngine';

interface NewRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRisk: (risk: AquaRiskItem) => void;
  systems: WaterSystem[];
  editingRisk?: AquaRiskItem | null;
  activeOperatorName?: string;
}

export const NewRiskModal: React.FC<NewRiskModalProps> = ({
  isOpen,
  onClose,
  onSaveRisk,
  systems,
  editingRisk,
  activeOperatorName = 'Ing. Zaira Salvador Amaya',
}) => {
  const [danger, setDanger] = useState(editingRisk?.danger || '');
  const [source, setSource] = useState(editingRisk?.source || (systems[0]?.name || 'Reservorio Principal'));
  const [probability, setProbability] = useState<AquaRiskProbability>(
    editingRisk?.probability || 'Media'
  );
  const [consequence, setConsequence] = useState<AquaRiskConsequence>(
    editingRisk?.consequence || 'Moderada'
  );
  const [controlMeasure, setControlMeasure] = useState(editingRisk?.controlMeasure || '');
  const [responsible, setResponsible] = useState(editingRisk?.responsible || activeOperatorName);
  const [date, setDate] = useState(
    editingRisk?.date || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<AquaRiskStatus>(editingRisk?.status || 'Identificado');

  // Dynamically calculated risk level
  const calculatedLevel = calculateRiskLevel(probability, consequence);
  const badgeInfo = getRiskLevelBadge(calculatedLevel);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!danger.trim()) {
      alert('Por favor describa el Peligro identificado.');
      return;
    }
    if (!source.trim()) {
      alert('Por favor especifique la Fuente del peligro.');
      return;
    }
    if (!controlMeasure.trim()) {
      alert('Por favor defina la Medida de Control correspondiente.');
      return;
    }

    const item: AquaRiskItem = {
      id: editingRisk?.id || `rsk-${Date.now()}`,
      danger: danger.trim(),
      source: source.trim(),
      probability,
      consequence,
      riskLevel: calculatedLevel,
      controlMeasure: controlMeasure.trim(),
      responsible: responsible.trim(),
      date,
      status,
      originType: editingRisk?.originType || 'auditoria_campo',
      originReference: editingRisk?.originReference || 'Inspección Sanitaria Directa',
      associatedAlertCode: editingRisk?.associatedAlertCode,
    };

    onSaveRisk(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-hud font-bold text-base sm:text-lg text-slate-900 uppercase">
                {editingRisk ? 'Editar Peligro en Matriz' : 'Nuevo Peligro en Matriz AQUA-RISK'}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Plan de Seguridad del Agua (PSA) • Evaluación Sanitaria de Riesgos
              </p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Peligro */}
          <div>
            <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
              Peligro Sanitario / Evento Peligroso *
            </label>
            <input
              type="text"
              required
              value={danger}
              onChange={(e) => setDanger(e.target.value)}
              placeholder="Ej: Infiltración de aguas de escorrentía en cámara de cloración..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Fuente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                Fuente / Componente del Sistema *
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Ej: Reservorio R-01, Captación Manantial..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                Vincular a Sistema Registrado
              </label>
              <select
                onChange={(e) => {
                  const s = systems.find((sys) => sys.id === e.target.value);
                  if (s) setSource(`${s.name} (${s.location})`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              >
                <option value="">Seleccionar sistema existente...</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Probabilidad & Consecuencia -> Nivel de Riesgo Calculado */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-hud font-bold text-amber-900 uppercase">
                Evaluación Matricial de Riesgo (Probabilidad × Consecuencia)
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-hud font-bold border ${badgeInfo.badgeClass}`}
              >
                <span>{badgeInfo.icon}</span>
                <span>Nivel Calculado: {badgeInfo.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Probabilidad de Ocurrencia
                </label>
                <select
                  value={probability}
                  onChange={(e) => setProbability(e.target.value as AquaRiskProbability)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Baja">Baja (Rara vez ocurre / evento infrecuente)</option>
                  <option value="Media">Media (Ocurre ocasionalmente durante el año)</option>
                  <option value="Alta">Alta (Ocurre con frecuencia / recurrente)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Consecuencia / Severidad Sanitaria
                </label>
                <select
                  value={consequence}
                  onChange={(e) => setConsequence(e.target.value as AquaRiskConsequence)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Insignificante">Insignificante (Sin afección a la salud)</option>
                  <option value="Menor">Menor (Afección organoléptica leve, sin enfermedad)</option>
                  <option value="Moderada">Moderada (Molestias gastrointestinales leves)</option>
                  <option value="Mayor">Mayor (Brote de EDA / enfermedad diarreica aguda)</option>
                  <option value="Catastrófica">
                    Catastrófica (Riesgo letal, cáncer o intoxicación severa)
                  </option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-amber-800 italic">
              {badgeInfo.description}
            </p>
          </div>

          {/* Medida de Control */}
          <div>
            <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
              Medida de Control / Acción Preventiva y Correctiva *
            </label>
            <textarea
              required
              rows={2}
              value={controlMeasure}
              onChange={(e) => setControlMeasure(e.target.value)}
              placeholder="Ej: Reemplazo de empaquetadura de la tapa de inspección y desinfección preventiva con 5 ppm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Responsable, Fecha, Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                Responsable *
              </label>
              <input
                type="text"
                required
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-hud font-bold text-slate-700 uppercase mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AquaRiskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              >
                <option value="Identificado">Identificado</option>
                <option value="En Tratamiento">En Tratamiento</option>
                <option value="Controlado">Controlado</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-hud font-bold uppercase transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-hud font-extrabold uppercase shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {editingRisk ? 'Actualizar en Matriz' : 'Guardar en Matriz de Riesgo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

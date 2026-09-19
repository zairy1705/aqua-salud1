import React, { useState, useEffect } from 'react';
import {
  WaterSample,
  LabResultEntry,
  MetalParameterDefinition,
  ComplianceStatus,
} from '../../types';
import {
  getMetalsCatalog,
  evaluateMetalResultStrict,
} from '../../data/metalsData';

interface RegisterMetalResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: WaterSample[];
  preselectedSampleId?: string;
  onSaveResult: (sampleId: string, resultEntry: LabResultEntry) => void;
  defaultAnalystName?: string;
}

export const RegisterMetalResultModal: React.FC<RegisterMetalResultModalProps> = ({
  isOpen,
  onClose,
  samples,
  preselectedSampleId,
  onSaveResult,
  defaultAnalystName = 'Ing. Químico Fernando Rojas',
}) => {
  const catalog = getMetalsCatalog();

  const [selectedSampleId, setSelectedSampleId] = useState<string>(
    preselectedSampleId || samples[0]?.id || ''
  );
  const [selectedParamId, setSelectedParamId] = useState<string>('arsenico');
  const [resultVal, setResultVal] = useState<string>('');
  const [unit, setUnit] = useState<string>('mg/L');
  const [method, setMethod] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [analyst, setAnalyst] = useState<string>(defaultAnalystName);
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16).replace('T', ' ');
  });
  const [observations, setObservations] = useState<string>('');

  // Auto-fill fields when selected parameter changes
  useEffect(() => {
    const p = catalog.find((item) => item.id === selectedParamId) || catalog[0];
    if (p) {
      setUnit(p.defaultUnit);
      setMethod(p.defaultMethod);
      setEquipment(p.defaultEquipment);
    }
  }, [selectedParamId]);

  useEffect(() => {
    if (preselectedSampleId) {
      setSelectedSampleId(preselectedSampleId);
    } else if (samples.length > 0 && !selectedSampleId) {
      setSelectedSampleId(samples[0].id);
    }
  }, [preselectedSampleId, samples]);

  if (!isOpen) return null;

  const currentParam = catalog.find((p) => p.id === selectedParamId) || catalog[0];
  const currentSample = samples.find((s) => s.id === selectedSampleId) || samples[0];

  // Dynamic strict evaluation respecting: "No asumir que un resultado es legal o ilegal si no existe una norma configurada."
  const evaluation = evaluateMetalResultStrict(currentParam, resultVal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSampleId) {
      alert('Debe seleccionar una muestra válida.');
      return;
    }
    if (!resultVal.trim()) {
      alert('Por favor ingrese el resultado analítico.');
      return;
    }

    const newResult: LabResultEntry = {
      id: `res-metal-${Date.now()}`,
      parameter: `${currentParam.name} (${currentParam.symbol})`,
      category: 'inorganico_metales',
      result: evaluation.resultClean || resultVal.trim(),
      numericValue: evaluation.numericValue,
      unit: unit.trim() || currentParam.defaultUnit,
      method: method.trim() || currentParam.defaultMethod,
      equipment: equipment.trim() || currentParam.defaultEquipment,
      analyst: analyst.trim() || 'Analista de Metales',
      date: date.trim() || new Date().toISOString().slice(0, 16).replace('T', ' '),
      configuredCriteria: evaluation.configuredCriteria,
      compliance: evaluation.compliance,
      complianceNote: evaluation.complianceNote,
      healthRisk: evaluation.healthRisk,
      healthRiskDescription: evaluation.healthRiskDescription,
      observations: observations.trim() || 'Ensayo espectrométrico conforme a protocolo.',
      compliant: evaluation.compliance === 'cumple' ? true : evaluation.compliance === 'no_cumple' ? false : null,
      normativeLimit: currentParam.normativeLimit || 'Sin norma configurada',
    };

    onSaveResult(selectedSampleId, newResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-cyan-800/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">science</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Registrar Ensayo de Metales y Elementos Traza
              </h2>
              <p className="text-xs text-cyan-200/80">
                AQUA-METALS • Registro Analítico y Evaluación Normativa Estricta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Muestra selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Muestra de Agua (AQUA-LAB) *
            </label>
            <select
              value={selectedSampleId}
              onChange={(e) => setSelectedSampleId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              required
            >
              {samples.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.jassName} - {s.point} ({s.date})
                </option>
              ))}
            </select>
            {currentSample && (
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-cyan-600">place</span>
                {currentSample.systemName} • {currentSample.origin}
              </p>
            )}
          </div>

          {/* Grid: Parámetro & Símbolo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Parámetro Metálico *
              </label>
              <select
                value={selectedParamId}
                onChange={(e) => setSelectedParamId(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
              >
                {catalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.symbol}) {p.isCustom ? '★ Personalizado' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Resultado Analítico *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej. 0.005 o < 0.001"
                  value={resultVal}
                  onChange={(e) => setResultVal(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-mono font-bold text-slate-800 pr-16"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                  {unit}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Acepta decimales o mención cualitativa (ej: "No detectable", "&lt; LDO").
              </p>
            </div>
          </div>

          {/* Regulatory & Compliance Live Preview Banner */}
          <div className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Criterio Normativo Configurado:</span>
              <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentParam.hasConfiguredNorm && currentParam.normativeLimit
                  ? `${currentParam.normativeLimit}`
                  : 'Sin norma configurada (No regulado)'}
              </span>
            </div>

            {/* Compliance Badge & Explicit Rule */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-600">Calificación:</span>
              {evaluation.compliance === 'cumple' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  CUMPLE NORMA
                </span>
              )}
              {evaluation.compliance === 'no_cumple' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full animate-pulse">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  NO CUMPLE (EXCEDE LMP)
                </span>
              )}
              {evaluation.compliance === 'sin_norma' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">info</span>
                  SIN NORMA CONFIGURADA (No se califica legalidad ni ilegalidad)
                </span>
              )}
              {evaluation.compliance === 'referencial' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">help</span>
                  REFERENCIAL
                </span>
              )}
            </div>

            {/* Compliance Note */}
            <p className="text-xs text-slate-600 italic">
              {evaluation.complianceNote}
            </p>

            {/* Toxicological note */}
            {currentParam.toxicologyInfo && (
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 text-[11px] text-amber-900 flex items-start gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5">health_and_safety</span>
                <div>
                  <span className="font-bold">Impacto en Salud / Órgano Blanco:</span>{' '}
                  {currentParam.toxicologyInfo.organTarget}
                  {currentParam.toxicologyInfo.iarcClassification && (
                    <span className="block text-[10px] text-amber-800 font-semibold mt-0.5">
                      Clasificación IARC: {currentParam.toxicologyInfo.iarcClassification}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grid: Método, Equipo, Analista, Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                4. Método de Ensayo *
              </label>
              <input
                type="text"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                placeholder="ej. SMEWW 3114 B"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                5. Equipo Analítico *
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                placeholder="ej. Espectrómetro ICP-MS"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                6. Analista Responsable *
              </label>
              <input
                type="text"
                value={analyst}
                onChange={(e) => setAnalyst(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none"
                placeholder="Nombre del analista"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                7. Fecha y Hora del Ensayo *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                placeholder="YYYY-MM-DD HH:mm"
                required
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              8. Observaciones Técnicas / Cadena de Custodia
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none"
              placeholder="Detalles del blanco de reactivos, duplicados analíticos, % de recuperación..."
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Guardar Resultado de Metal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

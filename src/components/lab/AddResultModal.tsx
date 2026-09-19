import React, { useState, useMemo } from 'react';
import { LabResultEntry, LabParameterCategory } from '../../types';
import { STANDARD_LAB_PARAMETERS, evaluateLabResult } from '../../data/mockLabData';

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveResult: (newResult: LabResultEntry) => void;
  sampleCode: string;
  defaultAnalystName?: string;
}

export const AddResultModal: React.FC<AddResultModalProps> = ({
  isOpen,
  onClose,
  onSaveResult,
  sampleCode,
  defaultAnalystName,
}) => {
  if (!isOpen) return null;

  const [selectedStandardId, setSelectedStandardId] = useState(STANDARD_LAB_PARAMETERS[0].id);
  const [parameter, setParameter] = useState(STANDARD_LAB_PARAMETERS[0].name);
  const [category, setCategory] = useState<LabParameterCategory>(STANDARD_LAB_PARAMETERS[0].category);
  const [result, setResult] = useState('');
  const [unit, setUnit] = useState(STANDARD_LAB_PARAMETERS[0].defaultUnit);
  const [method, setMethod] = useState(STANDARD_LAB_PARAMETERS[0].defaultMethod);
  const [equipment, setEquipment] = useState(STANDARD_LAB_PARAMETERS[0].defaultEquipment);
  const [analyst, setAnalyst] = useState(defaultAnalystName || 'Blga. Andrea Solano (Analista de Laboratorio)');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().substring(0, 5);
  const [date, setDate] = useState(`${todayStr} ${nowTime}`);
  const [observations, setObservations] = useState('');
  const [configuredCriteria, setConfiguredCriteria] = useState(STANDARD_LAB_PARAMETERS[0].normativeLimit);

  const handleStandardParamChange = (id: string) => {
    setSelectedStandardId(id);
    if (id === 'otro') {
      setParameter('');
      setCategory('fisicoquimico');
      setUnit('mg/L');
      setMethod('');
      setEquipment('');
      setConfiguredCriteria('Referencial D.S. N.° 031-2010-SA');
      return;
    }

    const found = STANDARD_LAB_PARAMETERS.find((p) => p.id === id);
    if (found) {
      setParameter(found.name);
      setCategory(found.category);
      setUnit(found.defaultUnit);
      setMethod(found.defaultMethod);
      setEquipment(found.defaultEquipment);
      setConfiguredCriteria(found.normativeLimit);
    }
  };

  // Evaluation: Strictly separates 1. Resultado Analítico, 2. Cumplimiento, 3. Riesgo Sanitario
  const evaluation = useMemo(() => {
    return evaluateLabResult(parameter, result, configuredCriteria);
  }, [parameter, result, configuredCriteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parameter.trim() || !result.trim() || !analyst.trim()) return;

    const evalResult = evaluateLabResult(parameter, result, configuredCriteria);
    const numeric = parseFloat(result.replace(',', '.'));

    const newResult: LabResultEntry = {
      id: `res-${Date.now()}`,
      parameter: parameter.trim(),
      category,
      result: result.trim(),
      numericValue: evalResult.numericValue ?? (isNaN(numeric) ? undefined : numeric),
      unit: unit.trim(),
      method: method.trim() || 'Método Estandarizado SMEWW',
      equipment: equipment.trim() || 'Equipo de Medición Calibrado',
      analyst: analyst.trim(),
      date: date.trim(),
      observations: observations.trim() || evalResult.complianceNote,
      // Separated fields:
      configuredCriteria: configuredCriteria.trim(),
      compliance: evalResult.compliance,
      complianceNote: evalResult.complianceNote,
      healthRisk: evalResult.healthRisk,
      healthRiskDescription: evalResult.healthRiskDescription,
      compliant: evalResult.compliance === 'cumple' ? true : evalResult.compliance === 'no_cumple' ? false : null,
      normativeLimit: configuredCriteria.trim(),
    };

    onSaveResult(newResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002b35] via-[#004e5f] to-[#00677d] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10e7b2]/20 border border-[#10e7b2]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#10e7b2] text-[22px]">biotech</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hud font-extrabold text-[16px] sm:text-[18px] text-white">
                  REGISTRAR RESULTADO DE ENSAYO
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10e7b2]/20 text-[#10e7b2] border border-[#10e7b2]/30">
                  FASE 4
                </span>
              </div>
              <p className="text-[12px] text-cyan-200">
                Muestra: <span className="font-mono font-bold text-white">{sampleCode}</span> • AQUA-LAB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
          {/* Preset selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud">
                Catálogo Oficial de Parámetros (D.S. N.° 031-2010-SA) *
              </label>
              <span className="text-[10.5px] text-[#00677d] font-semibold">
                Límites configurados en normativa
              </span>
            </div>
            <select
              value={selectedStandardId}
              onChange={(e) => handleStandardParamChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-cyan-300 bg-cyan-50/40 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
            >
              <optgroup label="🦠 Microbiología (Inocuidad Biológica)">
                {STANDARD_LAB_PARAMETERS.filter((p) => p.category === 'microbiologico').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (LMP: {p.normativeLimit})
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚗️ Fisicoquímica (Parámetros Físico-Químicos y Desinfección)">
                {STANDARD_LAB_PARAMETERS.filter((p) => p.category === 'fisicoquimico').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (LMP: {p.normativeLimit})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔬 Inorgánicos y Metales Pesados">
                {STANDARD_LAB_PARAMETERS.filter((p) => p.category === 'inorganico_metales').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (LMP: {p.normativeLimit})
                  </option>
                ))}
              </optgroup>
              <option value="otro">➕ Otro Parámetro Configurable Personalizado...</option>
            </select>
          </div>

          {selectedStandardId === 'otro' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
              <div>
                <label className="block text-[11px] font-bold text-amber-900 uppercase font-hud mb-1">
                  Nombre del Parámetro Configurable *
                </label>
                <input
                  type="text"
                  value={parameter}
                  onChange={(e) => setParameter(e.target.value)}
                  placeholder="Ej: Sulfatos (SO4=)"
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-900 uppercase font-hud mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-amber-300 bg-white"
                >
                  <option value="microbiologico">🦠 Microbiológico</option>
                  <option value="fisicoquimico">⚗️ Físico-químico</option>
                  <option value="inorganico_metales">🔬 Inorgánico / Metales</option>
                </select>
              </div>
            </div>
          )}

          {/* Resultado Analítico & Criterio Configurado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div>
              <label className="block text-[11px] font-bold text-[#00677d] uppercase font-hud mb-1">
                1. Resultado Analítico Obtenido *
              </label>
              <input
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Ej: 1.20 ó Ausente"
                className="w-full px-3 py-2 font-mono font-bold text-[16px] text-[#003440] rounded-xl border border-cyan-400 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
              <span className="text-[10.5px] text-slate-500 mt-1 block">
                Dato analítico directo (ej. 7.35, 1.20, Ausente, 0, &lt;1).
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#00677d] uppercase font-hud mb-1">
                Unidad de Medida *
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="mg/L, NTU, NMP/100mL..."
                className="w-full px-3 py-2 font-mono text-[13px] rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
              <span className="text-[10.5px] text-slate-500 mt-1 block">
                Unidad según método analítico utilizado.
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-200/80">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                Criterio Configurado en Normativa (D.S. N.° 031-2010-SA) *
              </label>
              <input
                type="text"
                value={configuredCriteria}
                onChange={(e) => setConfiguredCriteria(e.target.value)}
                className="w-full px-3 py-1.5 text-[12.5px] font-mono rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none text-slate-700"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Límite Máximo Permisible configurado. No se inventan límites.
              </span>
            </div>
          </div>

          {/* THREE PILLARS VISUAL SEPARATION: 1. Resultado Analítico | 2. Cumplimiento | 3. Riesgo Sanitario */}
          {result.trim() && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-hud font-bold text-slate-700 uppercase">
                <span>Evaluación Técnica Automática (Separación de Criterios)</span>
                <span className="text-cyan-700 font-mono text-[10px]">D.S. 031-2010-SA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-[11.5px] bg-white">
                {/* 1. Resultado Analítico */}
                <div className="p-3 bg-slate-50/50">
                  <div className="text-[10px] font-bold uppercase font-hud text-slate-500 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-cyan-600">biotech</span>
                    <span>1. Resultado Analítico</span>
                  </div>
                  <div className="font-mono font-bold text-[16px] text-slate-900">
                    {result} <span className="text-[11.5px] font-normal text-slate-600">{unit}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-1">
                    Parámetro: <strong>{parameter}</strong>
                  </div>
                </div>

                {/* 2. Cumplimiento */}
                <div
                  className={`p-3 ${
                    evaluation.compliance === 'cumple'
                      ? 'bg-emerald-50/70'
                      : evaluation.compliance === 'no_cumple'
                      ? 'bg-rose-50/70'
                      : 'bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase font-hud text-slate-500 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      {evaluation.compliance === 'cumple'
                        ? 'check_circle'
                        : evaluation.compliance === 'no_cumple'
                        ? 'cancel'
                        : 'info'}
                    </span>
                    <span>2. Cumplimiento</span>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-hud font-extrabold text-[11px] tracking-wider uppercase ${
                        evaluation.compliance === 'cumple'
                          ? 'bg-emerald-600 text-white'
                          : evaluation.compliance === 'no_cumple'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {evaluation.compliance === 'cumple'
                        ? '✓ CUMPLE'
                        : evaluation.compliance === 'no_cumple'
                        ? '✗ NO CUMPLE'
                        : 'REFERENCIAL'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 mt-1 leading-tight">
                    {evaluation.complianceNote}
                  </p>
                </div>

                {/* 3. Riesgo Sanitario */}
                <div
                  className={`p-3 ${
                    evaluation.healthRisk === 'sin_riesgo'
                      ? 'bg-emerald-50/40'
                      : evaluation.healthRisk === 'riesgo_bajo'
                      ? 'bg-amber-50/60'
                      : evaluation.healthRisk === 'riesgo_medio'
                      ? 'bg-orange-50/70'
                      : 'bg-rose-50/80'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase font-hud text-slate-500 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      {evaluation.healthRisk === 'sin_riesgo'
                        ? 'health_and_safety'
                        : 'warning'}
                    </span>
                    <span>3. Riesgo Sanitario</span>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-hud font-bold text-[10px] tracking-wider uppercase ${
                        evaluation.healthRisk === 'sin_riesgo'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : evaluation.healthRisk === 'riesgo_bajo'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : evaluation.healthRisk === 'riesgo_medio'
                          ? 'bg-orange-100 text-orange-900 border border-orange-300 font-bold'
                          : 'bg-rose-100 text-rose-900 border border-rose-400 font-extrabold'
                      }`}
                    >
                      {evaluation.healthRisk.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 mt-1 leading-tight">
                    {evaluation.healthRiskDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Método y Equipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                Método Analítico Estandarizado *
              </label>
              <input
                type="text"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Ej: SMEWW 4500-Cl G"
                className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                Equipo Utilizado y Calibrado *
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="Ej: Espectrofotómetro Hach DR900"
                className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                required
              />
            </div>
          </div>

          {/* Analista y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                Analista Responsable *
              </label>
              <input
                type="text"
                value={analyst}
                onChange={(e) => setAnalyst(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                Fecha y Hora del Ensayo *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-[12.5px] font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
              Observaciones Analíticas / Hallazgos de Ensayo
            </label>
            <input
              type="text"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Detalles sobre curva de calibración, duplicados RPD, coloración, interferencias..."
              className="w-full px-3 py-2 text-[12px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-hud text-[12px] font-bold uppercase hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#009bb8] hover:to-[#0fd1a1] text-[#002b1f] font-hud text-[12px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Guardar Resultado Oficial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

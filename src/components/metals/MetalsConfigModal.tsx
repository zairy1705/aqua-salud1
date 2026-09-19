import React, { useState } from 'react';
import { MetalParameterDefinition, HealthRiskLevel } from '../../types';
import {
  getMetalsCatalog,
  saveCustomMetalParameter,
  deleteCustomMetalParameter,
} from '../../data/metalsData';

interface MetalsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCatalogUpdated: (newCatalog: MetalParameterDefinition[]) => void;
}

export const MetalsConfigModal: React.FC<MetalsConfigModalProps> = ({
  isOpen,
  onClose,
  onCatalogUpdated,
}) => {
  const [catalog, setCatalog] = useState<MetalParameterDefinition[]>(() => getMetalsCatalog());
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New parameter form fields
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [defaultUnit, setDefaultUnit] = useState<string>('mg/L');
  const [defaultMethod, setDefaultMethod] = useState<string>('EPA 200.8 (ICP-MS) / SMEWW 3113 B');
  const [defaultEquipment, setDefaultEquipment] = useState<string>('Espectrómetro ICP-MS / EAA Horno Grafito');
  const [hasConfiguredNorm, setHasConfiguredNorm] = useState<boolean>(true);
  const [maxVal, setMaxVal] = useState<string>('0.050');
  const [normativeArticle, setNormativeArticle] = useState<string>('D.S. N.° 031-2010-SA, Anexo III');
  const [alertSeverity, setAlertSeverity] = useState<HealthRiskLevel>('riesgo_alto');
  const [organTarget, setOrganTarget] = useState<string>('');
  const [mitigationProtocol, setMitigationProtocol] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveNewParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim()) {
      alert('Por favor ingrese el nombre y el símbolo del elemento.');
      return;
    }

    const id = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

    const parsedMaxVal = hasConfiguredNorm && maxVal.trim() ? parseFloat(maxVal.replace(',', '.')) : undefined;

    const newParam: MetalParameterDefinition = {
      id: `param_${id}_${Date.now()}`,
      name: name.trim(),
      symbol: symbol.trim(),
      category: 'inorganico_metales',
      defaultUnit: defaultUnit.trim() || 'mg/L',
      defaultMethod: defaultMethod.trim() || 'SMEWW 3113 B',
      defaultEquipment: defaultEquipment.trim() || 'EAA / ICP-MS',
      hasConfiguredNorm,
      maxVal: parsedMaxVal,
      normativeLimit: hasConfiguredNorm && parsedMaxVal !== undefined ? `≤ ${parsedMaxVal} ${defaultUnit}` : 'Sin norma configurada',
      normativeArticle: hasConfiguredNorm ? normativeArticle.trim() || 'D.S. N.° 031-2010-SA' : undefined,
      isCustom: true,
      alertSeverity,
      healthRiskNormal: `Concentración de ${name.trim()} dentro de niveles basales seguros.`,
      healthRiskAlert: hasConfiguredNorm
        ? `ALERTA TOXICOLÓGICA: ${name.trim()} supera el límite normativo. Posible impacto en la salud de la población abastecida.`
        : `Determinación cuantitativa de ${name.trim()} registrada. Sin norma legal configurada para calificar infracción.`,
      toxicologyInfo: {
        organTarget: organTarget.trim() || 'No especificado en el registro inicial',
        chronicEffects: 'Monitoreo preventivo de elementos traza.',
        mitigationProtocol: mitigationProtocol.trim() || 'Evaluar fuente hidrogeológica y coordinar monitoreo con el laboratorio acreditado.',
      },
    };

    const updated = saveCustomMetalParameter(newParam);
    setCatalog(updated);
    onCatalogUpdated(updated);
    setShowAddForm(false);

    // Reset fields
    setName('');
    setSymbol('');
    setMaxVal('0.050');
    setOrganTarget('');
    setMitigationProtocol('');
  };

  const handleDeleteCustom = (paramId: string) => {
    if (confirm('¿Está seguro de eliminar este parámetro configurado?')) {
      const updated = deleteCustomMetalParameter(paramId);
      setCatalog(updated);
      onCatalogUpdated(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-cyan-800/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">tune</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Configuración de Parámetros • AQUA-METALS
              </h2>
              <p className="text-xs text-cyan-200/80">
                10 Parámetros Iniciales + Elementos Traza Personalizados
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Top Info Banner */}
          <div className="p-3.5 bg-cyan-50/80 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-cyan-700 text-lg shrink-0 mt-0.5">policy</span>
            <div className="space-y-1">
              <span className="font-bold">Regla de Cumplimiento Normativo Estricto:</span>
              <p>
                Los límites de los 10 metales iniciales corresponden al <strong>D.S. N.° 031-2010-SA</strong> (Reglamento de la Calidad del Agua para Consumo Humano). Si agrega un parámetro sin norma configurada, el sistema registrará los resultados analíticos <strong>sin asumir que el resultado es legal o ilegal</strong>.
              </p>
            </div>
          </div>

          {/* Action to Toggle Add Form */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Catálogo de Parámetros ({catalog.length})
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-100/70 hover:bg-cyan-200/80 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                {showAddForm ? 'close' : 'add'}
              </span>
              {showAddForm ? 'Cancelar Nuevo' : 'Agregar Nuevo Parámetro'}
            </button>
          </div>

          {/* Form to Add New Parameter */}
          {showAddForm && (
            <form
              onSubmit={handleSaveNewParam}
              className="p-4 bg-slate-50 border border-cyan-200 rounded-xl space-y-4 animate-in fade-in duration-150"
            >
              <div className="border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Nuevo Parámetro Metálico o Elemento Traza
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Elemento *
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Selenio Total, Antimonio, Bario"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Símbolo Químico *
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Se, Sb, Ba, Al"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={defaultUnit}
                    onChange={(e) => setDefaultUnit(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
                  >
                    <option value="mg/L">mg/L (miligramos por litro)</option>
                    <option value="µg/L">µg/L (microgramos por litro)</option>
                    <option value="ppm">ppm (partes por millón)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Equipo de Medición Típico
                  </label>
                  <input
                    type="text"
                    value={defaultEquipment}
                    onChange={(e) => setDefaultEquipment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggle: Has Configured Standard */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      ¿Tiene Norma Legal Configurada (LMP)?
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Si se desmarca, el parámetro se registrará con estatus legal neutral (Sin norma configurada).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasConfiguredNorm}
                      onChange={(e) => setHasConfiguredNorm(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {hasConfiguredNorm ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Límite Máximo Permisible (LMP) *
                      </label>
                      <input
                        type="text"
                        placeholder="ej. 0.050"
                        value={maxVal}
                        onChange={(e) => setMaxVal(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Artículo / Marco Legal
                      </label>
                      <input
                        type="text"
                        value={normativeArticle}
                        onChange={(e) => setNormativeArticle(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Nivel de Alerta si Excede
                      </label>
                      <select
                        value={alertSeverity}
                        onChange={(e) => setAlertSeverity(e.target.value as HealthRiskLevel)}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1.5"
                      >
                        <option value="riesgo_critico">Riesgo Crítico</option>
                        <option value="riesgo_alto">Riesgo Alto</option>
                        <option value="riesgo_medio">Riesgo Medio</option>
                        <option value="riesgo_bajo">Riesgo Bajo / Organoléptico</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-blue-50/70 border border-blue-200/60 rounded text-[11px] text-blue-900">
                    ℹ️ <strong>Estatus No Regulado:</strong> Las muestras con este parámetro registrarán concentraciones analíticas reales sin marcarse como legal o ilegal.
                  </div>
                )}
              </div>

              {/* Toxicology info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Órganos Blanco / Toxicología (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Hígado, riñones, tiroides"
                    value={organTarget}
                    onChange={(e) => setOrganTarget(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Protocolo de Mitigación Recomendado
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Filtración por ósmosis, resina selectiva..."
                    value={mitigationProtocol}
                    onChange={(e) => setMitigationProtocol(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Guardar en Catálogo de Metales
                </button>
              </div>
            </form>
          )}

          {/* Catalog Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Parámetro</th>
                  <th className="py-2.5 px-2">Símbolo</th>
                  <th className="py-2.5 px-3">Criterio / LMP</th>
                  <th className="py-2.5 px-3">Marco Legal</th>
                  <th className="py-2.5 px-3">Estatus</th>
                  <th className="py-2.5 px-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {catalog.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-cyan-800">
                      {p.symbol}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {p.hasConfiguredNorm ? (
                        <span className="font-bold text-slate-800">{p.normativeLimit}</span>
                      ) : (
                        <span className="text-slate-400 italic">Sin norma configurada</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
                      {p.normativeArticle || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      {p.hasConfiguredNorm ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          Normado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                          No Regulado
                        </span>
                      )}
                      {p.isCustom && (
                        <span className="ml-1 text-[10px] text-amber-700 font-bold">★ Personalizado</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {p.isCustom ? (
                        <button
                          onClick={() => handleDeleteCustom(p.id)}
                          title="Eliminar parámetro personalizado"
                          className="w-7 h-7 rounded-lg text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Estándar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
          >
            Cerrar Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};

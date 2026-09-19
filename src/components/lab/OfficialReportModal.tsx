import React from 'react';
import { WaterSample } from '../../types';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: WaterSample;
  onEmitReport?: (sampleId: string, reportNumber: string, recipient: string) => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  sample,
  onEmitReport,
}) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const reportNumber = sample.reportNumber || `INF-LAB-${currentYear}-${sample.code.replace('LAB-', '')}`;
  const reportDateStr = sample.reportIssuedAt
    ? new Date(sample.reportIssuedAt).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const allCompliant = sample.results.length > 0 && sample.results.every((r) => r.compliant !== false);

  const handlePrint = () => {
    window.print();
  };

  const handleEmit = () => {
    if (onEmitReport && sample.status !== 'informe_emitido') {
      onEmitReport(sample.id, reportNumber, `${sample.jassName} y Área Técnica Municipal`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:rounded-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-[#002b35] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10e7b2] text-[20px]">verified</span>
            <span className="font-hud font-bold text-[13px] uppercase tracking-wider text-cyan-100">
              INFORME OFICIAL DE ENSAYO DE LABORATORIO
            </span>
          </div>

          <div className="flex items-center gap-2">
            {sample.status === 'validada' && onEmitReport && (
              <button
                type="button"
                onClick={handleEmit}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002b1f] font-hud text-[11px] font-extrabold uppercase shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Emitir Informe Oficial</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-hud text-[11px] font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto text-left text-slate-900 print:overflow-visible print:p-8" id="printable-report">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[24px]">💧</span>
                  <span className="font-hud font-black text-[22px] tracking-wider text-[#003440]">
                    AQUA-SALUD
                  </span>
                  <span className="text-[12px] font-bold font-hud px-2 py-0.5 rounded bg-cyan-100 text-[#00677d]">
                    AQUA-LAB
                  </span>
                </div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#00677d]">
                  Red Digital de Vigilancia y Laboratorios de Calidad de Agua
                </p>
                <p className="text-[11px] text-slate-500">
                  Conforme al Reglamento de la Calidad del Agua para Consumo Humano (D.S. N.° 031-2010-SA)
                </p>
              </div>

              <div className="sm:text-right border-l-2 sm:border-l-0 sm:border-r-0 border-cyan-400 pl-3 sm:pl-0">
                <div className="font-hud font-extrabold text-[15px] text-slate-900">
                  INFORME DE ENSAYO N.°
                </div>
                <div className="font-mono font-black text-[18px] text-[#00677d] tracking-wider">
                  {reportNumber}
                </div>
                <div className="text-[11.5px] text-slate-600 mt-1">
                  Fecha de Emisión: <strong>{reportDateStr}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Metadata Box */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 text-[12px]">
            <div className="font-hud font-bold text-[12px] text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between">
              <span>1. DATOS GENERALES DE LA MUESTRA</span>
              <span className="font-mono text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                Código Lab: {sample.code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Organización Comunal / JASS:</span>
                <span className="font-semibold text-slate-900">{sample.jassName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Sistema Hídrico:</span>
                <span className="font-semibold text-slate-900">{sample.systemName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Punto de Muestreo:</span>
                <span className="font-semibold text-slate-900">{sample.point}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Procedencia / Ubicación:</span>
                <span className="font-semibold text-slate-900">{sample.origin}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Fecha y Hora de Toma:</span>
                <span className="font-semibold text-slate-900">{sample.date} a las {sample.time} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10.5px] uppercase font-bold">Tomador / Solicitante:</span>
                <span className="font-semibold text-slate-900">{sample.responsible}</span>
              </div>
            </div>

            {sample.observations && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11.5px] text-slate-600">
                <strong>Observaciones de campo:</strong> {sample.observations}
              </div>
            )}
          </div>

          {/* Chain of Custody Summary */}
          <div className="mb-6">
            <div className="font-hud font-bold text-[12px] text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-teal-700">verified_user</span>
              <span>2. TRAZABILIDAD Y CADENA DE CUSTODIA</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10.5px]">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-700 uppercase font-hud mb-1">1. Toma</div>
                <div className="text-emerald-700 font-bold">✓ Conforme</div>
                <div className="text-slate-500">{sample.chainOfCustody.toma.date || sample.date}</div>
                <div className="text-slate-500">T: {sample.chainOfCustody.toma.temperatureC ?? 18}°C</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-700 uppercase font-hud mb-1">2. Transporte</div>
                <div className="text-emerald-700 font-bold">✓ Cadena Frío</div>
                <div className="text-slate-500">Cooler a ≤ 4.2°C</div>
                <div className="text-slate-500 font-mono">{sample.chainOfCustody.toma.sealNumber || 'PREC-OK'}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-700 uppercase font-hud mb-1">3. Recepción</div>
                <div className="text-emerald-700 font-bold">✓ Verificado</div>
                <div className="text-slate-500">{sample.chainOfCustody.recepcion.date || sample.date}</div>
                <div className="text-slate-500">Frasco Íntegro</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="font-bold text-slate-700 uppercase font-hud mb-1">4. Análisis</div>
                <div className="text-emerald-700 font-bold">✓ Ejecutado</div>
                <div className="text-slate-500">{sample.results.length} Ensayos</div>
                <div className="text-slate-500">SMEWW Estándar</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-teal-50/60 col-span-2 sm:col-span-1">
                <div className="font-bold text-teal-800 uppercase font-hud mb-1">5. Validación</div>
                <div className="text-emerald-700 font-bold">✓ Aprobado</div>
                <div className="text-slate-600 truncate">{sample.validatedBy || 'Dir. Técnico'}</div>
                <div className="text-teal-700 font-mono font-bold">Autorizado</div>
              </div>
            </div>
          </div>

          {/* Analytical Results Table */}
          <div className="mb-6">
            <div className="font-hud font-bold text-[12px] text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
              <span>3. RESULTADOS DE ENSAYOS ANALÍTICOS</span>
              <span className="text-[11px] font-normal text-slate-500">
                Norma de Referencia: D.S. N.° 031-2010-SA
              </span>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-[11px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-hud text-[10px] uppercase">
                    <th className="py-2 px-3">Parámetro / Ensayo</th>
                    <th className="py-2 px-3 bg-cyan-50/50">1. Resultado Analítico</th>
                    <th className="py-2 px-3 bg-emerald-50/50">2. Cumplimiento (LMP)</th>
                    <th className="py-2 px-3 bg-amber-50/50">3. Riesgo Sanitario</th>
                    <th className="py-2 px-3">Método / Equipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sample.results.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                        No se han registrado resultados analíticos para esta muestra.
                      </td>
                    </tr>
                  ) : (
                    sample.results.map((res) => {
                      const complianceVal = res.compliance || (res.compliant ? 'cumple' : 'no_cumple');
                      const healthRiskVal = res.healthRisk || (res.compliant ? 'sin_riesgo' : 'riesgo_alto');

                      return (
                        <tr key={res.id} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 font-semibold text-slate-900">
                            <div>{res.parameter}</div>
                            <div className="text-[9.5px] text-slate-500 font-mono">
                              {res.category === 'microbiologico' ? 'Microbiológico' : res.category === 'inorganico_metales' ? 'Metales/Inorgánico' : 'Fisicoquímico'}
                            </div>
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-[12px] text-cyan-950 bg-cyan-50/20">
                            {res.result} <span className="text-[10px] font-normal text-slate-600">{res.unit}</span>
                          </td>
                          <td className="py-2 px-3 bg-emerald-50/20">
                            <div className="flex items-center gap-1">
                              {complianceVal === 'cumple' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-hud font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ✓ CUMPLE
                                </span>
                              ) : complianceVal === 'no_cumple' ? (
                                <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-hud font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  ✗ NO CUMPLE
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-hud font-bold bg-slate-100 text-slate-600">
                                  REFERENCIAL
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] text-slate-600 mt-0.5">
                              LMP: {res.configuredCriteria || res.normativeLimit || 'D.S. 031-2010-SA'}
                            </div>
                          </td>
                          <td className="py-2 px-3 bg-amber-50/20">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-hud font-bold uppercase ${
                                healthRiskVal === 'sin_riesgo'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-900 border border-rose-300 font-extrabold'
                              }`}
                            >
                              {healthRiskVal.replace('_', ' ')}
                            </span>
                            {res.healthRiskDescription && (
                              <div className="text-[9px] text-slate-600 mt-0.5 line-clamp-1" title={res.healthRiskDescription}>
                                {res.healthRiskDescription}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 text-[10px]">
                            <div>{res.method}</div>
                            <div className="text-slate-400 font-mono text-[9px]">{res.equipment}</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Conclusion / Dictamen Sanitario */}
          <div className={`p-4 rounded-xl border mb-6 text-[12px] ${
            allCompliant
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}>
            <div className="font-hud font-bold text-[12.5px] uppercase tracking-wide mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {allCompliant ? 'verified' : 'gavel'}
              </span>
              <span>4. DICTAMEN TÉCNICO SANITARIO</span>
            </div>
            <p className="leading-relaxed">
              {allCompliant ? (
                <>
                  La muestra identificada con código <strong>{sample.code}</strong> procedente del sistema{' '}
                  <strong>{sample.systemName}</strong> ({sample.jassName}), evaluada en el punto{' '}
                  <strong>{sample.point}</strong>, <strong>CUMPLE SATISFACTORIAMENTE</strong> con los Límites Máximos Permisibles (LMP) microbiológicos y fisicoquímicos establecidos en el <strong>Reglamento de la Calidad del Agua para Consumo Humano (D.S. N.° 031-2010-SA)</strong> para los parámetros evaluados.
                </>
              ) : (
                <>
                  La muestra identificada con código <strong>{sample.code}</strong> presenta uno o más parámetros que <strong>NO CUMPLEN</strong> con los Límites Máximos Permisibles según el <strong>D.S. N.° 031-2010-SA</strong>. Se requiere acción correctiva inmediata en la estación de desinfección / cloración por parte de la JASS y la asistencia técnica de la ATM.
                </>
              )}
            </p>
            {sample.validationRemarks && (
              <p className="mt-2 pt-2 border-t border-current/20 text-[11.5px] italic">
                <strong>Observaciones de Validación:</strong> "{sample.validationRemarks}"
              </p>
            )}
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-slate-300 mt-8 text-center text-[11px]">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-slate-700 pb-1 mb-2 font-mono text-[10px] text-slate-500">
                [ FIRMA DIGITAL REGISTRADA ]
              </div>
              <div className="font-bold text-slate-900 font-hud text-[12px]">
                {sample.results[0]?.analyst || 'Analista de Laboratorio'}
              </div>
              <div className="text-slate-600">Analista Responsable de Ensayos</div>
              <div className="text-slate-400 text-[10px]">AQUA-LAB • Área Técnica</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-slate-700 pb-1 mb-2 font-mono text-[10px] text-teal-700 font-bold">
                {sample.chainOfCustody.validacion.signatureOrAuthCode || 'DIR-TEC-VAL-2026-CBP4512'}
              </div>
              <div className="font-bold text-slate-900 font-hud text-[12px]">
                {sample.validatedBy || 'Blgo. Roberto Valdivia'}
              </div>
              <div className="text-slate-600">{sample.validatorRole || 'Director Técnico de Laboratorio'}</div>
              <div className="text-teal-700 text-[10px] font-bold">VALIDACIÓN AUTORIZADA OFICIAL</div>
            </div>
          </div>

          {/* Institutional Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Documento emitido por la Plataforma AQUA-SALUD (AQUA-LAB). La validez de este informe se sustenta en el estricto cumplimiento de la Cadena de Custodia y validación del Director Técnico.
          </div>
        </div>
      </div>
    </div>
  );
};

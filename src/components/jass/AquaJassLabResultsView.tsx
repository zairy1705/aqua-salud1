import React, { useState, useMemo } from 'react';
import { WaterSystem, WaterSample, LabResultEntry } from '../../types';

interface AquaJassLabResultsViewProps {
  systems: WaterSystem[];
  samples: WaterSample[];
  selectedSystemId?: string;
  onSelectSystem?: (id: string) => void;
  onSaveSample: (newSample: WaterSample) => void;
  operatorName?: string;
}

export const AquaJassLabResultsView: React.FC<AquaJassLabResultsViewProps> = ({
  systems,
  samples,
  selectedSystemId,
  onSelectSystem,
  onSaveSample,
  operatorName = 'Operador Sanitario JASS',
}) => {
  const [activeSysId, setActiveSysId] = useState<string>(
    selectedSystemId || systems[0]?.id || ''
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WaterSample | null>(null);

  // Form State
  const [reportCode, setReportCode] = useState(`INF-LAB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [labEntity, setLabEntity] = useState('Laboratorio de Control de Calidad de Agua - AQUA-SALUD');
  const [samplingDate, setSamplingDate] = useState(new Date().toISOString().split('T')[0]);
  const [samplePoint, setSamplePoint] = useState('Red de Distribución - Grifo más alejado (Punto Crítico)');
  
  // Parámetros Físico-Químicos
  const [ph, setPh] = useState<string>('7.2');
  const [turbidity, setTurbidity] = useState<string>('1.5');
  const [conductivity, setConductivity] = useState<string>('420');
  const [freeChlorine, setFreeChlorine] = useState<string>('1.1');

  // Parámetros Microbiológicos
  const [coliforms, setColiforms] = useState<string>('0');
  const [ecoli, setEcoli] = useState<string>('0');

  // Metales Pesados
  const [arsenic, setArsenic] = useState<string>('0.003');
  const [lead, setLead] = useState<string>('0.002');
  const [cadmium, setCadmium] = useState<string>('0.0005');
  const [mercury, setMercury] = useState<string>('0.0001');

  const [observations, setObservations] = useState('');

  // Active System
  const activeSystem = useMemo(() => {
    return systems.find((s) => s.id === activeSysId) || systems[0];
  }, [systems, activeSysId]);

  // Filtered samples for this system
  const systemSamples = useMemo(() => {
    return samples.filter(
      (s) => s.systemId === activeSysId || (activeSystem && s.systemName === activeSystem.name)
    );
  }, [samples, activeSysId, activeSystem]);

  // Evaluador en tiempo real según D.S. N.° 031-2010-SA
  const validationStatus = useMemo(() => {
    const numPh = parseFloat(ph) || 7.0;
    const numTurb = parseFloat(turbidity) || 0;
    const numCond = parseFloat(conductivity) || 0;
    const numCl = parseFloat(freeChlorine) || 0;
    const numColi = parseFloat(coliforms) || 0;
    const numEcoli = parseFloat(ecoli) || 0;
    const numAs = parseFloat(arsenic) || 0;
    const numPb = parseFloat(lead) || 0;
    const numCd = parseFloat(cadmium) || 0;
    const numHg = parseFloat(mercury) || 0;

    const failures: string[] = [];

    if (numPh < 6.5 || numPh > 8.5) failures.push(`pH fuera de rango (6.5 - 8.5)`);
    if (numTurb > 5.0) failures.push(`Turbiedad excede 5.0 UNT`);
    if (numCond > 1500) failures.push(`Conductividad excede 1500 µS/cm`);
    if (numCl < 0.5) failures.push(`Cloro libre inferior al mínimo sanitario (0.5 mg/L)`);
    if (numCl > 5.0) failures.push(`Cloro libre superior al máximo permitido (5.0 mg/L)`);
    if (numColi > 0) failures.push(`Presencia de Coliformes Totales (${numColi} UFC/100mL)`);
    if (numEcoli > 0) failures.push(`Presencia de E. coli (${numEcoli} UFC/100mL)`);
    if (numAs > 0.010) failures.push(`Arsénico excede LMP (0.010 mg/L)`);
    if (numPb > 0.010) failures.push(`Plomo excede LMP (0.010 mg/L)`);
    if (numCd > 0.003) failures.push(`Cadmio excede LMP (0.003 mg/L)`);
    if (numHg > 0.001) failures.push(`Mercurio excede LMP (0.001 mg/L)`);

    const isApto = failures.length === 0;
    return { isApto, failures };
  }, [ph, turbidity, conductivity, freeChlorine, coliforms, ecoli, arsenic, lead, cadmium, mercury]);

  const handleOpenNewResult = () => {
    setReportCode(`INF-LAB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setSamplingDate(new Date().toISOString().split('T')[0]);
    setPh('7.2');
    setTurbidity('1.4');
    setConductivity('420');
    setFreeChlorine('1.0');
    setColiforms('0');
    setEcoli('0');
    setArsenic('0.003');
    setLead('0.002');
    setCadmium('0.0005');
    setMercury('0.0001');
    setObservations('');
    setIsModalOpen(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSystem) return;

    const numPh = parseFloat(ph) || 7.0;
    const numTurb = parseFloat(turbidity) || 0;
    const numCl = parseFloat(freeChlorine) || 0;
    const numColi = parseFloat(coliforms) || 0;
    const numEcoli = parseFloat(ecoli) || 0;
    const numAs = parseFloat(arsenic) || 0;
    const numPb = parseFloat(lead) || 0;
    const numCd = parseFloat(cadmium) || 0;
    const numHg = parseFloat(mercury) || 0;

    const resultsList: LabResultEntry[] = [
      {
        id: `res-ph-${Date.now()}`,
        parameter: 'pH',
        category: 'fisicoquimico',
        result: numPh.toFixed(2),
        numericValue: numPh,
        unit: 'Unidades pH',
        method: 'SMEWW 4500-H+ B',
        equipment: 'Multiparámetro Digital Portátil',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '6.5 - 8.5 pH',
        compliance: numPh >= 6.5 && numPh <= 8.5 ? 'cumple' : 'no_cumple',
        healthRisk: numPh >= 6.5 && numPh <= 8.5 ? 'sin_riesgo' : 'riesgo_medio',
        healthRiskDescription: numPh >= 6.5 && numPh <= 8.5 ? 'Rango óptimo para consumo' : 'pH fuera del estándar D.S. N.° 031-2010-SA',
        observations: 'Determinación directa in-situ',
        compliant: numPh >= 6.5 && numPh <= 8.5,
      },
      {
        id: `res-turb-${Date.now()}`,
        parameter: 'Turbiedad',
        category: 'fisicoquimico',
        result: numTurb.toFixed(2),
        numericValue: numTurb,
        unit: 'UNT',
        method: 'SMEWW 2130 B',
        equipment: 'Turbidímetro Digital Hach 2100Q',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '≤ 5.0 UNT',
        compliance: numTurb <= 5.0 ? 'cumple' : 'no_cumple',
        healthRisk: numTurb <= 5.0 ? 'sin_riesgo' : 'riesgo_medio',
        healthRiskDescription: numTurb <= 5.0 ? 'Agua con claridad conforme' : 'Turbiedad elevada compromete la eficacia de la desinfección',
        observations: 'Lectura nefelométrica',
        compliant: numTurb <= 5.0,
      },
      {
        id: `res-cl-${Date.now()}`,
        parameter: 'Cloro Residual Libre',
        category: 'fisicoquimico',
        result: numCl.toFixed(2),
        numericValue: numCl,
        unit: 'mg/L',
        method: 'SMEWW 4500-Cl G (DPD-1)',
        equipment: 'Colorímetro Digital / Comparador DPD',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '0.50 - 5.00 mg/L',
        compliance: numCl >= 0.5 && numCl <= 5.0 ? 'cumple' : 'no_cumple',
        healthRisk: numCl >= 0.5 && numCl <= 5.0 ? 'sin_riesgo' : 'riesgo_alto',
        healthRiskDescription: numCl >= 0.5 && numCl <= 5.0 ? 'Desinfección activa garantizada' : 'Cloro residual fuera del rango sanitario obligatorio',
        observations: 'Monitoreo en grifo intradomiciliario',
        compliant: numCl >= 0.5 && numCl <= 5.0,
      },
      {
        id: `res-colitot-${Date.now()}`,
        parameter: 'Coliformes Totales',
        category: 'microbiologico',
        result: numColi.toString(),
        numericValue: numColi,
        unit: 'UFC / 100 mL',
        method: 'SMEWW 9222 B (Membrana Filtrante)',
        equipment: 'Incubadora Memmert 35.0 °C',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '0 UFC / 100 mL (Ausencia)',
        compliance: numColi === 0 ? 'cumple' : 'no_cumple',
        healthRisk: numColi === 0 ? 'sin_riesgo' : 'riesgo_alto',
        healthRiskDescription: numColi === 0 ? 'Ausencia microbiológica conforme' : 'Presencia de bacterias indicadoras de contaminación en red',
        observations: 'Incubación 24 horas',
        compliant: numColi === 0,
      },
      {
        id: `res-ecoli-${Date.now()}`,
        parameter: 'Escherichia coli',
        category: 'microbiologico',
        result: numEcoli.toString(),
        numericValue: numEcoli,
        unit: 'UFC / 100 mL',
        method: 'SMEWW 9222 G (M-TEC)',
        equipment: 'Incubadora Baño María 44.5 °C',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '0 UFC / 100 mL (Ausencia)',
        compliance: numEcoli === 0 ? 'cumple' : 'no_cumple',
        healthRisk: numEcoli === 0 ? 'sin_riesgo' : 'riesgo_critico',
        healthRiskDescription: numEcoli === 0 ? 'Inocuidad fecal asegurada' : 'Contaminación fecal inminente. Riesgo de diarrea y gastroenteritis infantil',
        observations: 'Filtración y lectura fluorogénica',
        compliant: numEcoli === 0,
      },
      {
        id: `res-as-${Date.now()}`,
        parameter: 'Arsénico Total (As)',
        category: 'inorganico_metales',
        result: numAs.toFixed(4),
        numericValue: numAs,
        unit: 'mg/L',
        method: 'EPA 200.8 ICP-MS',
        equipment: 'Espectrómetro ICP-MS',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '≤ 0.010 mg/L',
        compliance: numAs <= 0.010 ? 'cumple' : 'no_cumple',
        healthRisk: numAs <= 0.010 ? 'sin_riesgo' : 'riesgo_critico',
        healthRiskDescription: numAs <= 0.010 ? 'Conforme a LMP metal' : 'Exceso de arsénico. Metal tóxico bioacumulable',
        observations: 'Lectura analítica certificada',
        compliant: numAs <= 0.010,
      },
      {
        id: `res-pb-${Date.now()}`,
        parameter: 'Plomo Total (Pb)',
        category: 'inorganico_metales',
        result: numPb.toFixed(4),
        numericValue: numPb,
        unit: 'mg/L',
        method: 'EPA 200.8 ICP-MS',
        equipment: 'Espectrómetro ICP-MS',
        analyst: operatorName,
        date: samplingDate,
        configuredCriteria: '≤ 0.010 mg/L',
        compliance: numPb <= 0.010 ? 'cumple' : 'no_cumple',
        healthRisk: numPb <= 0.010 ? 'sin_riesgo' : 'riesgo_critico',
        healthRiskDescription: numPb <= 0.010 ? 'Conforme a LMP metal' : 'Exceso de plomo. Neurotóxico severo infantil',
        observations: 'Lectura analítica certificada',
        compliant: numPb <= 0.010,
      },
    ];

    const finalSample: WaterSample = {
      id: `sample-${Date.now()}`,
      code: reportCode.trim() || `INF-LAB-${Date.now()}`,
      date: samplingDate,
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      origin: activeSystem.location || 'JASS Comunal',
      jassId: activeSystem.id,
      jassName: activeSystem.location || 'JASS Local',
      systemId: activeSystem.id,
      systemName: activeSystem.name,
      point: samplePoint,
      responsible: operatorName,
      observations: observations.trim() || (validationStatus.isApto ? 'Cumple D.S. N.° 031-2010-SA' : validationStatus.failures.join('. ')),
      sampleType: 'vigilancia_sanitaria',
      chainOfCustody: {
        toma: {
          completed: true,
          date: samplingDate,
          time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          responsible: operatorName,
          locationOrEntity: samplePoint,
        },
        transporte: {
          completed: true,
          date: samplingDate,
          time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          responsible: operatorName,
        },
        recepcion: {
          completed: true,
          date: samplingDate,
          time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          responsible: labEntity,
        },
        analisis: {
          completed: true,
          date: samplingDate,
          time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          responsible: labEntity,
        },
        validacion: {
          completed: true,
          date: samplingDate,
          time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          responsible: operatorName,
        },
      },
      status: validationStatus.isApto ? 'validada' : 'pendiente_validacion',
      results: resultsList,
    };

    onSaveSample(finalSample);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Header del Módulo de Laboratorio */}
      <div className="bg-gradient-to-br from-[#003d4c] via-[#005a70] to-[#002833] rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#10e7b2] text-[#002b1f] text-[10px] font-hud font-black uppercase tracking-wider">
              Control Sanitario Oficial
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-cyan-200 text-[10px] font-hud font-bold uppercase">
              D.S. N.° 031-2010-SA
            </span>
          </div>
          <h2 className="font-hud font-black text-xl sm:text-2xl text-white tracking-tight">
            Resultados de Laboratorio de Sistemas de Agua
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
            Ingreso y registro de informes de ensayo físico-químicos, microbiológicos y de metales pesados para cada sistema de agua y reservorio rural.
          </p>
        </div>

        {/* Botón Acción Principal */}
        <button
          type="button"
          onClick={handleOpenNewResult}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002833] font-hud font-black text-xs uppercase shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Ingresar Nuevo Resultado</span>
        </button>
      </div>

      {/* Selector de Sistema de Agua */}
      <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00677d] text-xl">water_damage</span>
          <span className="font-hud font-bold text-xs text-slate-800 uppercase">
            Seleccionar Sistema de Agua a Consultar:
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={activeSysId}
            onChange={(e) => {
              setActiveSysId(e.target.value);
              onSelectSystem?.(e.target.value);
            }}
            className="w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {systems.map((sys) => (
              <option key={sys.id} value={sys.id}>
                {sys.name} ({sys.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumen del Sistema Seleccionado */}
      {activeSystem && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10.5px] text-slate-500 uppercase font-bold block">Capacidad del Tanque</span>
            <span className="text-base font-hud font-black text-[#00677d]">
              {activeSystem.capacityLiters.toLocaleString()} L
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10.5px] text-slate-500 uppercase font-bold block">Nivel Actual</span>
            <span className="text-base font-hud font-black text-emerald-600">
              {activeSystem.currentLevelPercent}%
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10.5px] text-slate-500 uppercase font-bold block">Informes de Lab</span>
            <span className="text-base font-hud font-black text-slate-800">
              {systemSamples.length} registrados
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10.5px] text-slate-500 uppercase font-bold block">Último Cloro Lab</span>
            <span className="text-base font-hud font-black text-cyan-700">
              {activeSystem.lastChlorinePpm.toFixed(2)} ppm
            </span>
          </div>
        </div>
      )}

      {/* Historial de Ensayos / Informes de Laboratorio del Sistema */}
      <div className="bg-white rounded-3xl p-5 border border-cyan-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#00677d]">
            <span className="material-symbols-outlined text-2xl text-[#00b4d8]">biotechnology</span>
            <div>
              <h3 className="font-hud font-black text-sm sm:text-base text-[#003440] uppercase">
                Historial de Análisis de Laboratorio para: {activeSystem?.name}
              </h3>
              <p className="text-xs text-slate-500">
                Dictamen normativo de aptitud según Reglamento D.S. N.° 031-2010-SA
              </p>
            </div>
          </div>
        </div>

        {systemSamples.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">science</span>
            <h4 className="font-hud font-bold text-sm text-slate-700">
              Aún no hay resultados de laboratorio registrados para este sistema
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haga clic en el botón superior "Ingresar Nuevo Resultado" para registrar el informe analítico de agua emitido por el laboratorio.
            </p>
            <button
              type="button"
              onClick={handleOpenNewResult}
              className="px-4 py-2 rounded-xl bg-[#00677d] text-white text-xs font-hud font-bold hover:bg-[#005264] transition-colors cursor-pointer"
            >
              + Ingresar Primer Resultado
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-[#003d4c] text-white font-hud text-[11px] uppercase">
                <tr>
                  <th className="p-3">Código Informe</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Punto de Muestra</th>
                  <th className="p-3">pH / Turbiedad</th>
                  <th className="p-3">Cloro Libre</th>
                  <th className="p-3">Coliformes / E. coli</th>
                  <th className="p-3">Dictamen Sanitario</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11.5px] text-slate-700">
                {systemSamples.map((sample) => {
                  const getParamValue = (name: string) => {
                    const r = sample.results?.find((item) =>
                      item.parameter.toLowerCase().includes(name.toLowerCase())
                    );
                    if (!r) return undefined;
                    return r.numericValue ?? parseFloat(r.result);
                  };

                  const phVal = getParamValue('ph');
                  const turbVal = getParamValue('turbiedad');
                  const clVal = getParamValue('cloro');
                  const coliVal = getParamValue('coliformes');
                  const ecoliVal = getParamValue('coli');

                  const isApto =
                    sample.status === 'validada' ||
                    (clVal !== undefined && clVal >= 0.5 && coliVal === 0);

                  return (
                    <tr key={sample.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#00677d]">{sample.code}</td>
                      <td className="p-3 whitespace-nowrap">{sample.date}</td>
                      <td className="p-3 max-w-[160px] truncate text-slate-600" title={sample.point}>
                        {sample.point}
                      </td>
                      <td className="p-3 font-medium">
                        pH {phVal !== undefined ? phVal : '-'} | {turbVal !== undefined ? `${turbVal} UNT` : '-'}
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-black ${clVal !== undefined && clVal >= 0.5 && clVal <= 5.0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {clVal !== undefined ? `${clVal} mg/L` : '-'}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        {coliVal !== undefined ? `${coliVal} UFC` : '0'} / {ecoliVal !== undefined ? `${ecoliVal} UFC` : '0'}
                      </td>
                      <td className="p-3">
                        {isApto ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            <span>APTO D.S. 031</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-900 font-extrabold text-[10px] uppercase">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            <span>NO APTO</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(sample)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#00677d] font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: INGRESO DE NUEVO RESULTADO DE LABORATORIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-cyan-200 max-w-2xl w-full p-5 sm:p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#00677d]">
                <span className="material-symbols-outlined text-2xl">science</span>
                <h3 className="font-hud font-black text-base uppercase text-slate-900">
                  Ingreso de Resultados de Laboratorio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
              {/* Datos de Identificación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sistema de Agua Asignado
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeSystem?.name || ''}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    N.° de Informe / Código Ensayo
                  </label>
                  <input
                    type="text"
                    required
                    value={reportCode}
                    onChange={(e) => setReportCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fecha de Toma de Muestra
                  </label>
                  <input
                    type="date"
                    required
                    value={samplingDate}
                    onChange={(e) => setSamplingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Punto de Muestreo
                  </label>
                  <select
                    value={samplePoint}
                    onChange={(e) => setSamplePoint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Salida de Reservorio">Salida de Reservorio</option>
                    <option value="Red de Distribución - Grifo Inicial">Red de Distribución - Grifo Inicial</option>
                    <option value="Red de Distribución - Grifo Intermedio">Red de Distribución - Grifo Intermedio</option>
                    <option value="Red de Distribución - Grifo más alejado (Punto Crítico)">Red - Grifo más alejado (Punto Crítico)</option>
                  </select>
                </div>
              </div>

              {/* Parámetros Físico-Químicos */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-hud font-bold text-slate-800 text-[11px] uppercase block">
                  1. Parámetros Físico-Químicos (D.S. N.° 031-2010-SA)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      pH (LMP: 6.5 - 8.5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={ph}
                      onChange={(e) => setPh(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      Turbiedad UNT (≤ 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={turbidity}
                      onChange={(e) => setTurbidity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      Conductividad µS/cm (≤ 1500)
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={conductivity}
                      onChange={(e) => setConductivity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      Cloro Libre mg/L (0.5 - 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={freeChlorine}
                      onChange={(e) => setFreeChlorine(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold text-[#00677d]"
                    />
                  </div>
                </div>
              </div>

              {/* Parámetros Microbiológicos */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-hud font-bold text-slate-800 text-[11px] uppercase block">
                  2. Parámetros Microbiológicos (UFC / 100 mL)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      Coliformes Totales (LMP: 0 UFC)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={coliforms}
                      onChange={(e) => setColiforms(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">
                      Escherichia coli (LMP: 0 UFC)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={ecoli}
                      onChange={(e) => setEcoli(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Dictamen Preliminar Automático */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${validationStatus.isApto ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">
                    {validationStatus.isApto ? 'verified' : 'report'}
                  </span>
                  <div>
                    <strong className="block text-xs uppercase">
                      {validationStatus.isApto
                        ? 'Dictamen Sanitario: APTO PARA CONSUMO HUMANO'
                        : 'Dictamen Sanitario: NO APTO PARA CONSUMO HUMANO'}
                    </strong>
                    {!validationStatus.isApto && (
                      <span className="text-[11px] text-red-700">
                        Observaciones: {validationStatus.failures.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002833] font-hud font-black uppercase shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Guardar Resultado en Historial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER DETALLE DEL INFORME DE LABORATORIO */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-cyan-200 max-w-lg w-full p-5 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#00677d]">
                <span className="material-symbols-outlined text-2xl">description</span>
                <h3 className="font-hud font-black text-sm sm:text-base uppercase text-slate-900">
                  Informe: {selectedReport.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                <p><strong>Sistema:</strong> {selectedReport.systemName}</p>
                <p><strong>Punto de Muestra:</strong> {selectedReport.point}</p>
                <p><strong>Fecha de Muestreo:</strong> {selectedReport.date} ({selectedReport.time})</p>
                <p><strong>Responsable:</strong> {selectedReport.responsible}</p>
              </div>

              <div className="space-y-1.5">
                <strong className="block font-hud uppercase text-[11px] text-slate-800">Parámetros Analizados:</strong>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedReport.results?.map((res, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between bg-white text-[11.5px]">
                      <span>{res.parameter}</span>
                      <span className="font-mono font-bold text-[#00677d]">
                        {res.numericValue !== undefined ? res.numericValue : res.result} {res.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.observations && (
                <div className="p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-xl text-[11px]">
                  <strong>Notas del Ensayo:</strong> {selectedReport.observations}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-[#00677d] text-white font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

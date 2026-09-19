import {
  MetalParameterDefinition,
  MetalAlert,
  WaterSample,
  LabResultEntry,
  ComplianceStatus,
  HealthRiskLevel,
} from '../types';

export const INITIAL_METALS_PARAMETERS: MetalParameterDefinition[] = [
  {
    id: 'arsenico',
    name: 'Arsénico Total',
    symbol: 'As',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3114 B (EAA-Generador de Hidruros) / EPA 200.8 (ICP-MS)',
    defaultEquipment: 'Espectrómetro ICP-MS Agilent 7850 / EAA 240FS',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.010 mg/L (10 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.010,
    healthRiskNormal: 'Inocuidad garantizada. Concentración dentro del estándar toxicológico de protección a la salud humana.',
    healthRiskAlert: 'EMERGENCIA TOXICOLÓGICA: Carcinógeno humano de Clase 1 (IARC). Causa hidroarsenicismo crónico regional endémico (HACRE), cáncer de piel, vejiga y pulmón, neuropatía periférica y lesiones vasculares.',
    alertSeverity: 'riesgo_critico',
    toxicologyInfo: {
      organTarget: 'Piel, pulmones, vejiga, sistema cardiovascular y nervioso.',
      iarcClassification: 'Grupo 1 (Carcinógeno comprobado en humanos)',
      chronicEffects: 'Hiperqueratosis palmo-plantar, melanodermia, alteraciones neurovasculares y carcinogénesis.',
      mitigationProtocol: 'Suspender fuente inmediata o aplicar coagulación con FeCl3 y filtración rápida, o adsorción sobre alúmina activada.',
    },
  },
  {
    id: 'plomo',
    name: 'Plomo Total',
    symbol: 'Pb',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3113 B (EAA-Horno de Grafito con Corrección Zeeman) / EPA 200.8',
    defaultEquipment: 'EAA PerkinElmer PinAAcle 900T con Horno Grafito',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.010 mg/L (10 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.010,
    healthRiskNormal: 'Agua inocua respecto a metales neurotóxicos.',
    healthRiskAlert: 'ALTO RIESGO NEUROTÓXICO: Causa saturnismo, déficit cognitivo y conductual irreversible en niños, retardo del neurodesarrollo, anemia, hipertensión arterial y nefropatía tubular.',
    alertSeverity: 'riesgo_critico',
    toxicologyInfo: {
      organTarget: 'Sistema nervioso central, médula ósea, riñones y sistema vascular.',
      iarcClassification: 'Grupo 2A (Probablemente carcinógeno en humanos)',
      chronicEffects: 'Disminución del cociente intelectual infantil, daño renal crónico y anemia por inhibición de la síntesis de hemo.',
      mitigationProtocol: 'Monitorear corrosión de griferías y tuberías de plomo/bronce; ajustar pH a 7.5–8.2 con alcalinizante y dosificar ortofosfato pasivador.',
    },
  },
  {
    id: 'cadmio',
    name: 'Cadmio Total',
    symbol: 'Cd',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3113 B (EAA-Horno Grafito) / EPA 200.8',
    defaultEquipment: 'EAA Zeeman / Espectrómetro ICP-MS',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.003 mg/L (3 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.003,
    healthRiskNormal: 'Concentración de cadmio en niveles basales no detectables.',
    healthRiskAlert: 'RIESGO TÓXICO SEVERO: Bioacumulación renal progresiva con vida media biológica de 20 a 30 años. Provoca proteinuria tubular, osteomalacia y fracturas por fragilidad ósea (enfermedad de Itai-Itai).',
    alertSeverity: 'riesgo_critico',
    toxicologyInfo: {
      organTarget: 'Túbulos renales proximales, matriz ósea y sistema esquelético.',
      iarcClassification: 'Grupo 1 (Carcinógeno humano)',
      chronicEffects: 'Insuficiencia renal crónica, desmineralización ósea severa y enfisema.',
      mitigationProtocol: 'Precipitación alcalina con hidróxido a pH > 9.5 o intercambio iónico con resinas quelantes selectivas.',
    },
  },
  {
    id: 'mercurio',
    name: 'Mercurio Total',
    symbol: 'Hg',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3112 B (EAA-Técnica de Vapor Frío) / EPA 245.1',
    defaultEquipment: 'Analizador Automático de Mercurio Milestone DMA-80 / EAA Vapor Frío',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.001 mg/L (1 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.001,
    healthRiskNormal: 'Agua completamente libre de mercurio.',
    healthRiskAlert: 'EMERGENCIA TOXICOLÓGICA AGUDA Y CRÓNICA: Neurotóxico extremo. Provoca temblores eréticos, ataxia cerebelosa, ceguera cortical, pérdida auditiva y efectos teratogénicos devastadores en gestantes.',
    alertSeverity: 'riesgo_critico',
    toxicologyInfo: {
      organTarget: 'Cerebro, cerebelo, corteza visual y túbulos renales.',
      iarcClassification: 'Grupo 2B / 3 (Metilmercurio Grupo 2B)',
      chronicEffects: 'Síndrome neurológico de Minamata, eretismo mercurial, daño cerebral perinatal permanente.',
      mitigationProtocol: 'Clausura inmediata de la fuente afectada; adsorción sobre carbón activado sulfurado o resinas tioladas.',
    },
  },
  {
    id: 'cromo',
    name: 'Cromo Total',
    symbol: 'Cr',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3113 B (EAA-Horno de Grafito) / EPA 200.8',
    defaultEquipment: 'EAA Horno de Grafito / ICP-MS',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.050 mg/L (50 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.050,
    healthRiskNormal: 'Ausencia de especies de cromo tóxicas.',
    healthRiskAlert: 'PELIGRO TOXICOLÓGICO: Irritación severa del tracto gastrointestinal, úlceras mucosas y dermatitis alérgica. Si existe Cr(VI) hexavalente, riesgo carcinogénico estomacal e intestinal.',
    alertSeverity: 'riesgo_alto',
    toxicologyInfo: {
      organTarget: 'Mucosa gástrica, piel, hígado y vías respiratorias.',
      iarcClassification: 'Compuestos de Cr(VI) Grupo 1 / Cr metal Grupo 3',
      chronicEffects: 'Ulceraciones digestivas, rinitis atrófica, dermatitis eccematosa y riesgo oncológico.',
      mitigationProtocol: 'Reducción de Cr(VI) a Cr(III) con sulfito o sulfato ferroso y precipitación como hidróxido de cromo a pH neutro.',
    },
  },
  {
    id: 'niquel',
    name: 'Níquel Total',
    symbol: 'Ni',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3113 B (EAA-Horno Grafito) / EPA 200.8',
    defaultEquipment: 'EAA Horno de Grafito PerkinElmer / ICP-MS',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.070 mg/L (70 µg/L)',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 0.070,
    healthRiskNormal: 'Concentración de níquel dentro del rango seguro.',
    healthRiskAlert: 'RIESGO SANITARIO: Causa hipersensibilidad alérgica cutánea (eccema vesicular por níquel), nefrotoxicidad tubular moderada y estrés oxidativo hepático.',
    alertSeverity: 'riesgo_medio',
    toxicologyInfo: {
      organTarget: 'Sistema inmunitario (alergia tipo IV), riñón e hígado.',
      iarcClassification: 'Grupo 1 (Compuestos de níquel) / Níquel metálico Grupo 2B',
      chronicEffects: 'Dermatitis alérgica crónica refractaria, daño oxidativo celular.',
      mitigationProtocol: 'Precipitación como hidróxido alcalino a pH > 9.0 o intercambio catiónico en resinas.',
    },
  },
  {
    id: 'cobre',
    name: 'Cobre Total',
    symbol: 'Cu',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3111 B (EAA-Llama Aire-Acetileno) / EPA 200.7 (ICP-OES)',
    defaultEquipment: 'Espectrómetro EAA Llama Agilent / ICP-OES',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 2.00 mg/L',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Inorgánicos)',
    maxVal: 2.00,
    healthRiskNormal: 'Niveles basales inocuos de cobre.',
    healthRiskAlert: 'RIESGO GASTROINTESTINAL: Sabor metálico astringente perceptible (> 1.0 mg/L). Concentraciones elevadas originan náuseas, vómitos, dolor epigástrico agudo y riesgo hepatotóxico en personas con enfermedad de Wilson.',
    alertSeverity: 'riesgo_medio',
    toxicologyInfo: {
      organTarget: 'Estómago, duodeno, mucosa intestinal e hígado.',
      iarcClassification: 'Grupo 3 (No clasificable como carcinógeno)',
      chronicEffects: 'Irritación gastrointestinal recurrente, hepatotoxicidad por sobrecarga de cobre.',
      mitigationProtocol: 'Ajustar la agresividad del agua aumentando el pH (> 7.4) para evitar la corrosión de cañerías domiciliarias de cobre.',
    },
  },
  {
    id: 'zinc',
    name: 'Zinc Total',
    symbol: 'Zn',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3111 B (EAA-Llama) / EPA 200.7 (ICP-OES)',
    defaultEquipment: 'Espectrómetro EAA Llama / ICP-OES',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 3.00 mg/L',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    maxVal: 3.00,
    healthRiskNormal: 'Nutriente esencial en concentraciones fisiológicas normales.',
    healthRiskAlert: 'DETERIORO ORGANOLÉPTICO: Sabor astringente metálico desagradable, aspecto opalescente con película grasa en reposo. En concentraciones extremas produce cólicos y vómitos.',
    alertSeverity: 'riesgo_bajo',
    toxicologyInfo: {
      organTarget: 'Tracto digestivo y propiedades organolépticas del agua.',
      iarcClassification: 'No clasificado como carcinógeno',
      chronicEffects: 'Rechazo comunitario del agua que induce consumo de fuentes no tratadas.',
      mitigationProtocol: 'Sustituir accesorios de fontanería galvanizados corroídos o neutralizar aguas ácidas que lixivian tuberías.',
    },
  },
  {
    id: 'hierro',
    name: 'Hierro Total',
    symbol: 'Fe',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3500-Fe B (Método de la 1,10-Fenantrolina) / SMEWW 3111 B',
    defaultEquipment: 'Espectrofotómetro UV-VIS Hach DR6000 / EAA Llama',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.30 mg/L',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    maxVal: 0.30,
    healthRiskNormal: 'Concentración inocua. Agua transparente y sin interferencias.',
    healthRiskAlert: 'IMPACTO ORGANOLÉPTICO Y OPERATIVO: Tinte pardo-rojizo ("agua herrumbrosa"), sabor metálico áspero, manchas irreversibles en ropa blanca y proliferación de ferrobacterias que colmatan redes y válvulas.',
    alertSeverity: 'riesgo_bajo',
    toxicologyInfo: {
      organTarget: 'Calidad estética y organoléptica; infraestructura hidráulica.',
      iarcClassification: 'No carcinógeno',
      chronicEffects: 'Obstrucción física de redes y rechazo poblacional del sistema clorador.',
      mitigationProtocol: 'Oxidación previa con aireador de bandejas o cascada para formar Fe(OH)3 insoluble seguido de filtración sobre lecho de arena Birm.',
    },
  },
  {
    id: 'manganeso',
    name: 'Manganeso Total',
    symbol: 'Mn',
    category: 'inorganico_metales',
    defaultUnit: 'mg/L',
    defaultMethod: 'SMEWW 3500-Mn B (Método del Persulfato / Periodato) / SMEWW 3111 B',
    defaultEquipment: 'Espectrofotómetro UV-VIS / EAA Llama',
    hasConfiguredNorm: true,
    normativeLimit: '≤ 0.40 mg/L',
    normativeArticle: 'D.S. N.° 031-2010-SA, Anexo II y III (Organoléptico y Químico)',
    maxVal: 0.40,
    healthRiskNormal: 'Concentración dentro de parámetros inocuos.',
    healthRiskAlert: 'AFECCIÓN ESTÉTICA Y RIESGO NEUROLÓGICO: Manchas oscuras o violáceas en accesorios y ropa. En exposición crónica de altas concentraciones, riesgo de bioacumulación con efectos neurotóxicos extrapiramidales (manganismo).',
    alertSeverity: 'riesgo_medio',
    toxicologyInfo: {
      organTarget: 'Ganglios basales cerebrales, sistema dopaminérgico y tuberías.',
      iarcClassification: 'No clasificado como carcinógeno',
      chronicEffects: 'Déficits psicomotores y motores sutiles en consumo infantil prolongado.',
      mitigationProtocol: 'Oxidación forzada con cloro libre (NaOCl) a pH > 8.0 o permanganato de potasio (KMnO4) y filtración en arena verde manganizada (Greensand).',
    },
  },
];

const LOCAL_STORAGE_METALS_KEY = 'aqua_metals_parameters_catalog';

export function getMetalsCatalog(): MetalParameterDefinition[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_METALS_KEY);
    if (saved) {
      const parsed: MetalParameterDefinition[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge initial with any custom ones
        const customOnes = parsed.filter((p) => p.isCustom);
        const map = new Map<string, MetalParameterDefinition>();
        INITIAL_METALS_PARAMETERS.forEach((p) => map.set(p.id, p));
        customOnes.forEach((c) => map.set(c.id, c));
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Error reading metals catalog:', e);
  }
  return INITIAL_METALS_PARAMETERS;
}

export function saveCustomMetalParameter(newParam: MetalParameterDefinition): MetalParameterDefinition[] {
  const current = getMetalsCatalog();
  const existingIdx = current.findIndex((p) => p.id === newParam.id);
  let updated: MetalParameterDefinition[];
  if (existingIdx >= 0) {
    updated = current.map((p, i) => (i === existingIdx ? newParam : p));
  } else {
    updated = [...current, newParam];
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_METALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving custom metal parameter:', e);
  }
  return updated;
}

export function deleteCustomMetalParameter(paramId: string): MetalParameterDefinition[] {
  const current = getMetalsCatalog();
  const updated = current.filter((p) => p.id !== paramId || !p.isCustom);
  try {
    localStorage.setItem(LOCAL_STORAGE_METALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting custom metal parameter:', e);
  }
  return updated;
}

/**
 * Evaluates a metal result strictly adhering to the prompt mandate:
 * "No inventar resultados."
 * "No asumir que un resultado es legal o ilegal si no existe una norma configurada."
 */
export function evaluateMetalResultStrict(
  param: MetalParameterDefinition,
  rawResult: string,
  customConfiguredCriteria?: string
): {
  numericValue?: number;
  resultClean: string;
  configuredCriteria: string;
  compliance: ComplianceStatus;
  complianceNote: string;
  healthRisk: HealthRiskLevel;
  healthRiskDescription: string;
} {
  const clean = rawResult.trim();
  const lower = clean.toLowerCase();

  const criteriaToUse =
    customConfiguredCriteria?.trim() ||
    (param.hasConfiguredNorm && param.normativeLimit
      ? `${param.normativeLimit} (${param.normativeArticle || 'D.S. N.° 031-2010-SA'})`
      : 'Sin norma configurada');

  if (!clean) {
    return {
      resultClean: '',
      configuredCriteria: criteriaToUse,
      compliance: param.hasConfiguredNorm ? 'referencial' : 'sin_norma',
      complianceNote: 'Sin resultado ingresado',
      healthRisk: 'sin_riesgo',
      healthRiskDescription: 'Pendiente de determinación analítica de laboratorio.',
    };
  }

  // Qualitative absence
  const isAbsent =
    lower === '0' ||
    lower.includes('no detect') ||
    lower.includes('ausente') ||
    lower === '< 0.001' ||
    lower === '<0.001' ||
    lower === '< 0.002' ||
    lower === '<0.002' ||
    lower === '< 0.005' ||
    lower === '<0.005' ||
    lower === '< 0.01' ||
    lower === '<0.01' ||
    lower === '< ldo' ||
    lower === '<ldo';

  const num = parseFloat(clean.replace(',', '.'));

  // CRITICAL RULE:
  // "No asumir que un resultado es legal o ilegal si no existe una norma configurada."
  if (!param.hasConfiguredNorm || !param.normativeLimit || criteriaToUse === 'Sin norma configurada' || param.maxVal === undefined) {
    return {
      numericValue: isNaN(num) ? 0 : num,
      resultClean: clean,
      configuredCriteria: 'Sin norma configurada (No regulado)',
      compliance: 'sin_norma',
      complianceNote: `Resultado analítico: ${clean} ${param.defaultUnit}. ATENCIÓN: No existe norma legal configurada para este parámetro en este perfil; por lo tanto, el sistema NO asume legalidad ni ilegalidad.`,
      healthRisk: 'sin_riesgo',
      healthRiskDescription: 'Parámetro reportado únicamente con fines exploratorios de elementos traza. Sin estándar normativo de evaluación.',
    };
  }

  if (isAbsent) {
    return {
      numericValue: 0,
      resultClean: clean,
      configuredCriteria: criteriaToUse,
      compliance: 'cumple',
      complianceNote: `CUMPLE: Ausencia / No detectable (< Límite de Detección Óptico). Conforme con ${criteriaToUse}.`,
      healthRisk: 'sin_riesgo',
      healthRiskDescription: param.healthRiskNormal,
    };
  }

  if (isNaN(num)) {
    return {
      resultClean: clean,
      configuredCriteria: criteriaToUse,
      compliance: 'referencial',
      complianceNote: `Resultado cualitativo registrado: "${clean}". No es posible comparar matemáticamente con el LMP numérico.`,
      healthRisk: 'sin_riesgo',
      healthRiskDescription: 'Reporte cualitativo referencial.',
    };
  }

  // Quantitative check against configured standard
  if (num > param.maxVal) {
    const excessFactor = ((num / param.maxVal) - 1) * 100;
    return {
      numericValue: num,
      resultClean: clean,
      configuredCriteria: criteriaToUse,
      compliance: 'no_cumple',
      complianceNote: `NO CUMPLE ${param.normativeArticle || 'D.S. N.° 031-2010-SA'}: Concentración medida de ${num} ${param.defaultUnit} supera el Límite Máximo Permisible de ${param.maxVal} ${param.defaultUnit} (+${excessFactor.toFixed(1)}% de exceso).`,
      healthRisk: param.alertSeverity,
      healthRiskDescription: param.healthRiskAlert,
    };
  }

  // Compliant
  return {
    numericValue: num,
    resultClean: clean,
    configuredCriteria: criteriaToUse,
    compliance: 'cumple',
    complianceNote: `CUMPLE ${param.normativeArticle || 'D.S. N.° 031-2010-SA'}: ${num} ${param.defaultUnit} ≤ ${param.maxVal} ${param.defaultUnit}. Concentración dentro del estándar legal configurado.`,
    healthRisk: 'sin_riesgo',
    healthRiskDescription: param.healthRiskNormal,
  };
}

/**
 * Generates structured toxicological and regulatory alerts from samples and metals catalog.
 */
export function computeMetalAlerts(samples: WaterSample[], catalog: MetalParameterDefinition[]): MetalAlert[] {
  const alerts: MetalAlert[] = [];

  samples.forEach((sample) => {
    sample.results.forEach((res) => {
      // Find matching metal definition
      const paramDef = catalog.find(
        (p) =>
          p.id.toLowerCase() === res.parameter.toLowerCase() ||
          p.name.toLowerCase() === res.parameter.toLowerCase() ||
          res.parameter.toLowerCase().includes(p.name.toLowerCase()) ||
          res.parameter.toLowerCase().includes(p.symbol.toLowerCase())
      );

      if (!paramDef) return;

      // Extract numeric value
      let numVal = res.numericValue;
      if (numVal === undefined || isNaN(numVal)) {
        const parsed = parseFloat(res.result.replace(',', '.'));
        if (!isNaN(parsed)) numVal = parsed;
      }

      if (numVal === undefined || isNaN(numVal)) return;

      // Rule: Do NOT alert if there is no configured norm!
      if (!paramDef.hasConfiguredNorm || paramDef.maxVal === undefined) {
        return;
      }

      const limit = paramDef.maxVal;

      // Critical alert: Exceeds configured limit!
      if (numVal > limit) {
        const isOrganoleptic = paramDef.alertSeverity === 'riesgo_bajo';
        alerts.push({
          id: `alert-metal-${sample.id}-${paramDef.id}`,
          sampleId: sample.id,
          sampleCode: sample.code,
          systemId: sample.systemId,
          systemName: sample.systemName,
          jassName: sample.jassName,
          point: sample.point,
          parameterId: paramDef.id,
          parameterName: paramDef.name,
          symbol: paramDef.symbol,
          resultValue: numVal,
          unit: res.unit || paramDef.defaultUnit,
          limitValue: limit,
          limitText: paramDef.normativeLimit || `${limit} ${paramDef.defaultUnit}`,
          alertType: isOrganoleptic ? 'organoleptica' : 'critica',
          date: sample.date,
          healthRisk: paramDef.alertSeverity,
          description: `${paramDef.name} (${paramDef.symbol}) excede el límite legal: medido ${numVal} ${paramDef.defaultUnit} vs LMP ${limit} ${paramDef.defaultUnit}. ${paramDef.healthRiskAlert}`,
          suggestedAction:
            paramDef.toxicologyInfo?.mitigationProtocol ||
            'Suspender inmediatamente el consumo directo y activar protocolo de tratamiento de metales o cambio de fuente.',
        });
      } else if (numVal >= limit * 0.8 && numVal <= limit) {
        // Preventive warning: within 80% to 100% of LMP
        alerts.push({
          id: `alert-preventive-${sample.id}-${paramDef.id}`,
          sampleId: sample.id,
          sampleCode: sample.code,
          systemId: sample.systemId,
          systemName: sample.systemName,
          jassName: sample.jassName,
          point: sample.point,
          parameterId: paramDef.id,
          parameterName: paramDef.name,
          symbol: paramDef.symbol,
          resultValue: numVal,
          unit: res.unit || paramDef.defaultUnit,
          limitValue: limit,
          limitText: paramDef.normativeLimit || `${limit} ${paramDef.defaultUnit}`,
          alertType: 'preventiva',
          date: sample.date,
          healthRisk: 'riesgo_medio',
          description: `Vigilancia preventiva: ${paramDef.name} (${paramDef.symbol}) alcanzó el ${Math.round((numVal / limit) * 100)}% del límite normativo (${numVal} de ${limit} ${paramDef.defaultUnit}).`,
          suggestedAction:
            'Aumentar la frecuencia de monitoreo analítico en la captación y revisar posibles fuentes de lixiviación o intrusión mineral.',
        });
      }
    });
  });

  return alerts.sort((a, b) => (b.alertType === 'critica' ? 1 : 0) - (a.alertType === 'critica' ? 1 : 0));
}

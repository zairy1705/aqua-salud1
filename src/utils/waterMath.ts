import { DosageCalculationParams, DosageCalculationResult, SamplingStatus } from '../types';
import { CHLORINE_PRODUCTS } from '../data/mockInitialData';

export function calculateVolumeLiters(params: DosageCalculationParams): number {
  switch (params.geometry) {
    case 'rectangular': {
      const length = params.length || 0;
      const width = params.width || 0;
      const depth = params.waterDepth ?? params.height ?? 0;
      // m³ = L * W * H, 1 m³ = 1000 Liters
      const volumeM3 = length * width * depth;
      return Math.max(0, Math.round(volumeM3 * 1000));
    }
    case 'cylindrical_vert': {
      const diameter = params.diameter || 0;
      const radius = diameter / 2;
      const depth = params.waterDepth ?? params.height ?? 0;
      // V = π * r² * h
      const volumeM3 = Math.PI * Math.pow(radius, 2) * depth;
      return Math.max(0, Math.round(volumeM3 * 1000));
    }
    case 'cylindrical_horiz': {
      const diameter = params.diameter || 0;
      const radius = diameter / 2;
      const length = params.length || 0;
      const volumeM3 = Math.PI * Math.pow(radius, 2) * length;
      return Math.max(0, Math.round(volumeM3 * 1000));
    }
    case 'direct_volume':
    default:
      return Math.max(0, Math.round(params.directVolumeLiters || 0));
  }
}

export function calculateDosage(params: DosageCalculationParams): DosageCalculationResult {
  const volumeLiters = calculateVolumeLiters(params);
  const volumeM3 = volumeLiters / 1000;

  const product = CHLORINE_PRODUCTS.find((p) => p.id === params.productId) || CHLORINE_PRODUCTS[0];
  const activePercent = params.customActivePercent ?? product.activeChlorinePercent;

  // If shock disinfection, target is typically 50 ppm for tank cleaning
  const isShock = !!params.isShockDisinfection;
  const targetPpm = isShock ? Math.max(params.targetChlorinePpm, 50) : params.targetChlorinePpm;
  const currentPpm = isShock ? 0 : params.currentChlorinePpm;
  const demandPpm = isShock ? 0 : params.chlorineDemandPpm;

  // Delta required in mg/L (ppm)
  const netDeltaPpm = Math.max(0, targetPpm - currentPpm);
  const totalNeedPpm = netDeltaPpm + demandPpm;

  // Pure chlorine required:
  // Volume (L) * Concentration (mg/L) = total mg
  // total mg / 1000 = Grams of pure Cl2
  const pureChlorineGrams = (volumeLiters * totalNeedPpm) / 1000;

  // Commercial product calculation:
  // pureGrams / (activePercent / 100)
  const commercialGrams = activePercent > 0 ? (pureChlorineGrams / (activePercent / 100)) : 0;

  let finalAmount = commercialGrams;
  let finalUnit: 'g' | 'kg' | 'mL' | 'L' = 'g';

  if (product.form === 'solid' || product.form === 'tablet') {
    if (commercialGrams >= 1000) {
      finalAmount = Number((commercialGrams / 1000).toFixed(2));
      finalUnit = 'kg';
    } else {
      finalAmount = Number(commercialGrams.toFixed(1));
      finalUnit = 'g';
    }
  } else if (product.form === 'liquid') {
    // Density of 5-10% hypochlorite is approx 1.15 to 1.2 g/mL, for field practical use 1g approx 1mL
    // or standard Peruvian DIGESA guide: V (mL) = (Vol m³ * C ppm) / (% * 10)
    const liquidVolumeMl = commercialGrams;
    if (liquidVolumeMl >= 1000) {
      finalAmount = Number((liquidVolumeMl / 1000).toFixed(2));
      finalUnit = 'L';
    } else {
      finalAmount = Math.round(liquidVolumeMl);
      finalUnit = 'mL';
    }
  } else if (product.form === 'gas') {
    finalAmount = Number((pureChlorineGrams / 1000).toFixed(3));
    finalUnit = 'kg';
  }

  // Stock solution dilution recommendation
  const recommendedDilutionWaterLiters = Math.max(10, Math.min(200, Math.round(volumeLiters / 2000) || 20));

  const safetyAdvice = [
    'Utilizar siempre Guantes de Nitrilo, Lentes con protección lateral y Mascarilla adecuada.',
    product.form === 'solid'
      ? 'Añadir SIEMPRE el cloro al agua para disolver, NUNCA el agua directamente sobre el cloro seco (peligro de reacción térmica violenta).'
      : 'Manipular el bidón en un área bien ventilada. Evitar inhalación directa de vapores.',
    'Dejar reposar la solución madre 15 a 30 minutos para asentar el precipitado de cal antes de verter el sobrenadante claro.',
    'Garantizar un tiempo mínimo de contacto de 30 minutos antes de liberar el agua a la red pública.',
  ];

  return {
    waterVolumeLiters: volumeLiters,
    waterVolumeM3: Number(volumeM3.toFixed(2)),
    effectiveChlorineNeedPpm: Number(totalNeedPpm.toFixed(2)),
    pureChlorineGrams: Number(pureChlorineGrams.toFixed(1)),
    commercialDoseAmount: finalAmount,
    commercialDoseUnit: finalUnit,
    productName: product.name,
    concentrationPercent: activePercent,
    contactTimeMinutes: isShock ? 120 : 30,
    recommendedDilutionWaterLiters,
    safetyAdvice,
    normativeReference: isShock
      ? 'Desinfección de Choque y Limpieza de Reservorios (Guía Técnica MINSA)'
      : 'D.S. N.° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
  };
}

export function evaluateChlorineNormative(ppm: number): {
  status: SamplingStatus;
  badgeLabel: string;
  verdictText: string;
  healthImpact: string;
  recommendation: string;
  badgeColorClass: string;
  textColorClass: string;
} {
  if (ppm < 0.5) {
    return {
      status: 'low',
      badgeLabel: 'NO CONFORME — BAJO',
      verdictText: 'Agua No Apta (Riesgo Microbiológico)',
      healthImpact:
        'Cloro insuficiente para neutralizar bacterias, virus o parásitos (Escherichia coli, Salmonella, Cryptosporidium). Peligro inminente de diarreas y enfermedades gastrointestinales.',
      recommendation:
        'Aumentar dosificación inmediatamente en reservorio/fuente. Verificar si existe consumo de cloro por alta turbiedad o materia orgánica. Realizar purga y refuerzo de cloración.',
      badgeColorClass: 'bg-amber-100 text-amber-900 border-amber-300',
      textColorClass: 'text-amber-600',
    };
  } else if (ppm <= 2.0) {
    return {
      status: 'compliant',
      badgeLabel: 'CONFORME — ÓPTIMO',
      verdictText: 'Agua Apta para Consumo Humano',
      healthImpact:
        'Nivel seguro y normativo conforme al Art. 62 del D.S. N.° 031-2010-SA. Mantiene poder desinfectante residual protegiendo la red contra recontaminación sin riesgos toxicológicos.',
      recommendation:
        'Mantener régimen continuo de dosificación. Continuar con el muestreo y monitoreo sistemático en los puntos representativos de la red.',
      badgeColorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      textColorClass: 'text-emerald-600',
    };
  } else {
    return {
      status: 'excess',
      badgeLabel: 'NO CONFORME — EXCESO',
      verdictText: 'Supera Límite Máximo Permisible (LMP)',
      healthImpact:
        'Nivel excesivo (> 2.0 mg/L). Provoca fuerte olor y sabor a cloro, rechazo de consumo por la población y fomenta la formación de subproductos de desinfección (Trihalometanos).',
      recommendation:
        'Reducir inmediatamente el caudal de dosificación o inyección. Permitir dilución con ingreso de agua cruda o renovar el almacenamiento. Monitorear hasta estabilizar < 2.0 ppm.',
      badgeColorClass: 'bg-rose-100 text-rose-900 border-rose-300',
      textColorClass: 'text-rose-600',
    };
  }
}

export function getDpdColorHex(ppm: number): string {
  if (ppm <= 0.05) return '#f8fafc'; // colorless
  if (ppm <= 0.2) return '#fce7f3';  // very light pink
  if (ppm <= 0.5) return '#fbcfe8';  // light pink (min normativo)
  if (ppm <= 0.8) return '#f9a8d4';  // rose
  if (ppm <= 1.2) return '#f472b6';  // classic DPD magenta pink
  if (ppm <= 1.6) return '#ec4899';  // deep pink
  if (ppm <= 2.0) return '#db2777';  // dark magenta
  if (ppm <= 2.8) return '#be185d';  // strong magenta
  return '#9d174d';                  // high purple/excess
}

export const DPD_SCALE_STEPS = [
  { ppm: 0.0, label: '0.0 ppm', desc: 'Incoloro (Sin cloro)', hex: '#f8fafc', textColor: 'text-slate-700' },
  { ppm: 0.2, label: '0.2 ppm', desc: 'Rosa tenue (Insuficiente)', hex: '#fce7f3', textColor: 'text-pink-900' },
  { ppm: 0.5, label: '0.5 ppm', desc: 'Mínimo Legal D.S. 031', hex: '#fbcfe8', textColor: 'text-pink-900' },
  { ppm: 1.0, label: '1.0 ppm', desc: 'Óptimo para Red', hex: '#f472b6', textColor: 'text-white' },
  { ppm: 1.5, label: '1.5 ppm', desc: 'Óptimo Reservorio', hex: '#ec4899', textColor: 'text-white' },
  { ppm: 2.0, label: '2.0 ppm', desc: 'Máximo LMP D.S. 031', hex: '#db2777', textColor: 'text-white' },
  { ppm: 3.5, label: '3.5+ ppm', desc: 'Exceso Crítico', hex: '#9d174d', textColor: 'text-white' },
];

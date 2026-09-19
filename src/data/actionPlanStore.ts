import { ActionPlanItem, ActionPlanFlowStage, AquaAlertItem, AquaAlertLevel } from '../types';

export const ACTION_PLAN_STAGES: {
  id: ActionPlanFlowStage;
  number: number;
  label: string;
  icon: string;
  badgeClass: string;
  bgClass: string;
  description: string;
}[] = [
  {
    id: 'ALERTA',
    number: 1,
    label: 'ALERTA',
    icon: 'notifications_active',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    bgClass: 'bg-rose-50',
    description: 'Detección inicial de no conformidad o riesgo sanitario',
  },
  {
    id: 'PLAN DE ACCIÓN',
    number: 2,
    label: 'PLAN DE ACCIÓN',
    icon: 'assignment',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    bgClass: 'bg-amber-50',
    description: 'Definición de causa, medidas correctivas, responsable y plazos',
  },
  {
    id: 'IMPLEMENTACIÓN',
    number: 3,
    label: 'IMPLEMENTACIÓN',
    icon: 'construction',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    bgClass: 'bg-blue-50',
    description: 'Ejecución técnica en campo, reparación, purga o dosificación',
  },
  {
    id: 'EVIDENCIA',
    number: 4,
    label: 'EVIDENCIA',
    icon: 'photo_camera',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    bgClass: 'bg-purple-50',
    description: 'Carga de sustento documental, registro fotográfico o acta comunal',
  },
  {
    id: 'VERIFICACIÓN',
    number: 5,
    label: 'VERIFICACIÓN',
    icon: 'fact_check',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    bgClass: 'bg-teal-50',
    description: 'Control analítico in situ y evaluación técnica por supervisor/ATM',
  },
  {
    id: 'CIERRE',
    number: 6,
    label: 'CIERRE',
    icon: 'check_circle',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgClass: 'bg-emerald-50',
    description: 'Conformidad total alcanzada y archivo de expediente correctivo',
  },
];

export function getStageMeta(stage: ActionPlanFlowStage) {
  return (
    ACTION_PLAN_STAGES.find((s) => s.id === stage) || {
      id: stage,
      number: 1,
      label: stage,
      icon: 'info',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      bgClass: 'bg-slate-50',
      description: '',
    }
  );
}

export function getNextStage(current: ActionPlanFlowStage): ActionPlanFlowStage | null {
  const index = ACTION_PLAN_STAGES.findIndex((s) => s.id === current);
  if (index >= 0 && index < ACTION_PLAN_STAGES.length - 1) {
    return ACTION_PLAN_STAGES[index + 1].id;
  }
  return null;
}

export function getPreviousStage(current: ActionPlanFlowStage): ActionPlanFlowStage | null {
  const index = ACTION_PLAN_STAGES.findIndex((s) => s.id === current);
  if (index > 0) {
    return ACTION_PLAN_STAGES[index - 1].id;
  }
  return null;
}

/**
 * Intelligent root cause inference based on observed parameter and actual lab/field results
 */
export function inferProbableCause(parameter: string, result: string): string {
  const paramLower = parameter.toLowerCase();
  const resLower = result.toLowerCase();

  if (paramLower.includes('coli') || paramLower.includes('microbiol')) {
    return 'Pérdida de barrera sanitaria de desinfección por interrupción de cloración continua y posible infiltración pluvial o rotura de red en tramo no presurizado.';
  }
  if (paramLower.includes('cloro')) {
    if (resLower.includes('0.0') || resLower.includes('0 ppm') || resLower.includes('sin cloro')) {
      return 'Tanque dosificador vacío por agotamiento de solución madre o atascamiento por precipitación calcárea en llave de control de goteo.';
    }
    if (resLower.includes('0.') && !resLower.includes('0.0')) {
      return 'Demanda de cloro incrementada en la captación por aumento de turbidez/materia orgánica post-precipitaciones o dosificación insuficiente para el caudal aforado.';
    }
    return 'Sobre-dosificación por apertura excesiva de válvula reguladora o recarga de solución madre sin aforo previo.';
  }
  if (paramLower.includes('turbidez')) {
    return 'Arrastre de sedimentos finos en captación superficial durante avenida de lluvias o falla en desarenador preliminar.';
  }
  if (paramLower.includes('arsénico') || paramLower.includes('plomo') || paramLower.includes('metal')) {
    return 'Mineralización natural del macizo rocoso en la cuenca hidrogeológica de recarga o aporte antrópico minero pasivo aguas arriba.';
  }
  if (paramLower.includes('ph')) {
    return 'Acuífero con presencia de formaciones ácidas o disolución de carbonatos en tránsito subterráneo.';
  }

  return 'Falla operativa o condición hidrológica atípica detectada en punto de monitoreo.';
}

export function mapAlertLevelToPriority(level: AquaAlertLevel): 'Baja' | 'Media' | 'Alta' | 'Crítica' {
  switch (level) {
    case 'Crítico':
      return 'Crítica';
    case 'Alto':
      return 'Alta';
    case 'Moderado':
      return 'Media';
    case 'Bajo':
    default:
      return 'Baja';
  }
}

/**
 * Generates an ActionPlanItem directly from an existing AquaAlertItem
 */
export function createActionPlanFromAlert(
  alert: AquaAlertItem,
  operatorName: string = 'Ing. Zaira Salvador Amaya'
): ActionPlanItem {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // Default deadline: 48 hours for critical/high, 7 days for moderate/low
  const deadlineDays = alert.level === 'Crítico' ? 2 : alert.level === 'Alto' ? 4 : 7;
  const deadlineDate = new Date(now.getTime() + deadlineDays * 864e5).toISOString().split('T')[0];

  const probableCause = inferProbableCause(alert.parameter, alert.result);

  const planId = `PLA-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id: planId,
    alertCode: alert.code,
    systemName: alert.system,
    punto: alert.point,
    categoria: alert.type,
    prioridad: mapAlertLevelToPriority(alert.level),
    problema: `[Alerta ${alert.code}] ${alert.parameter}: ${alert.result} (Criterio: ${alert.criterion}) detectado en ${alert.system} (${alert.point}).`,
    causaProbable: probableCause,
    accion: alert.requiredAction || 'Intervención inmediata en sistema de cloración y desinfección preventiva.',
    responsable: alert.responsible || operatorName,
    fecha: dateStr,
    fechaLimite: deadlineDate,
    estado: 'PLAN DE ACCIÓN', // Transitioned from ALERTA to PLAN DE ACCIÓN
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Initial real action plans with full traceability
 */
export const INITIAL_ACTION_PLANS: ActionPlanItem[] = [
  {
    id: 'PLA-2026-001',
    alertCode: 'ALT-MIC-2026-001',
    systemName: 'Sistema Huamachuco Norte',
    jassName: 'JASS Huamachuco Norte',
    punto: 'Red Domiciliaria - Sector 2 (Extremo terminal)',
    categoria: 'Microbiológica',
    prioridad: 'Crítica',
    problema: 'Detección confirmada de 18 NMP/100 mL de Escherichia coli en punto terminal de red.',
    causaProbable: 'Interrupción del goteo de hipoclorito de calcio por colmatación de inyector e infiltración en cámara rompe-presión CRP-6.',
    accion: 'Desinfección de shock del reservorio y red con 50 ppm de cloro libre, reparación de sello en CRP-6 y reinstalación de goteo calibrado a 22 mL/min.',
    responsable: 'Blgo. Roberto Valdivia / Tec. Marina Quispe',
    fecha: '2026-09-12',
    fechaLimite: '2026-09-15',
    estado: 'EVIDENCIA',
    notasImplementacion: 'Se ejecutó la hipercloración de shock durante 4 horas de tiempo de contacto. Se purgó toda la red terminal.',
    fechaImplementacion: '2026-09-13',
    evidencia: {
      descripcion: 'Acta de hipercloración firmada por fiscal comunal JASS y registro fotográfico de purga en grifo terminal.',
      archivoNombre: 'Acta_Desinfeccion_Shock_CRP6.pdf',
      tipoEvidencia: 'acta_comunal',
      fechaRegistro: '2026-09-13 16:45',
      registradoPor: 'Tec. Marina Quispe',
    },
    verificacion: {
      conforme: true,
      verificadoPor: 'Blgo. Roberto Valdivia (Director Lab)',
      fechaVerificacion: '2026-09-14 09:30',
      notas: 'Contramuestra tomada tras purga completa arroja 0 NMP/100 mL de E. coli y Cloro Libre Residual de 1.30 ppm. Se aprueba pase a verificación.',
      resultadoMedicion: 'E. coli: 0 NMP/100 mL • Cloro Libre: 1.30 ppm (Conforme)',
      entidadVerificadora: 'Laboratorio Regional de Salud Ambiental',
    },
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-14T09:30:00Z',
  },
  {
    id: 'PLA-2026-002',
    alertCode: 'ALT-DES-2026-002',
    systemName: 'Cisterna Escolar San Martín',
    jassName: 'JASS San Martín',
    punto: 'Grifo de Patio Escolar',
    categoria: 'Desinfección',
    prioridad: 'Alta',
    problema: 'Cloro residual libre en 0.00 ppm en grifo de consumo escolar. Ausencia total de desinfección activa.',
    causaProbable: 'Agotamiento del tambor de hipoclorito de calcio al 65% y falta de recarga de solución madre por operador escolar.',
    accion: 'Preparar 200 L de solución madre al 2% con 5.8 kg de HTH 70% y calibrar dosificador a 14 mL/min para demanda de 0.8 L/s.',
    responsable: 'Prof. Luis Alva / Operador Comunal',
    fecha: '2026-09-13',
    fechaLimite: '2026-09-15',
    estado: 'IMPLEMENTACIÓN',
    notasImplementacion: 'Se adquirió balde de HTH 70% certificado con lote vigente. Operador inició preparación de solución madre.',
    fechaImplementacion: '2026-09-14',
    createdAt: '2026-09-13T11:00:00Z',
    updatedAt: '2026-09-14T08:00:00Z',
  },
  {
    id: 'PLA-2026-003',
    alertCode: 'ALT-QUI-LAB2026002-res204',
    systemName: 'Pozo Artesiano No. 4',
    jassName: 'JASS Los Laureles',
    punto: 'Salida de Caseta de Bombeo',
    categoria: 'Química',
    prioridad: 'Crítica',
    problema: 'Concentración de Arsénico Total de 0.018 mg/L excede el LMP normativo de 0.010 mg/L del D.S. N.° 031-2010-SA.',
    causaProbable: 'Formación geológica con lixiviación natural de minerales arsenicales en estrato freático profundo.',
    accion: 'Diseño e instalación de filtro modular de adsorción con arena recubierta de óxido de hierro (IOCS) y aviso de restricción de consumo directo no hervido.',
    responsable: 'ATM Simbal / Dirección Ejecutiva de Salud Ambiental (DESA)',
    fecha: '2026-09-10',
    fechaLimite: '2026-09-24',
    estado: 'PLAN DE ACCIÓN',
    createdAt: '2026-09-10T14:30:00Z',
    updatedAt: '2026-09-10T14:30:00Z',
  },
  {
    id: 'PLA-2026-004',
    systemName: 'Acuífero Alfa - Tanque Central',
    jassName: 'JASS El Molino',
    punto: 'Cámara de Válvulas de Entrada',
    categoria: 'Operativa',
    prioridad: 'Media',
    problema: 'Goteo y pérdida por empaque desgastado en macro-medidor de entrada al reservorio.',
    causaProbable: 'Desgaste por fricción de empaque de jebe neopreno de 3 pulgadas con más de 2 años de servicio continuo.',
    accion: 'Cambio de empaquetadura de brida, calibración de lectura volumétrica y ajuste con pernos inoxidables.',
    responsable: 'Ing. Carlos Mendoza (JASS)',
    fecha: '2026-09-08',
    fechaLimite: '2026-09-11',
    estado: 'CIERRE',
    notasImplementacion: 'Se reemplazó el empaque con junta de estanqueidad NBR reforzada. Fuga erradicada al 100%.',
    fechaImplementacion: '2026-09-09',
    evidencia: {
      descripcion: 'Fotografía de la brida reparada con sellado hidrostático sin fuga y reporte de macro-medición.',
      tipoEvidencia: 'fotografia',
      archivoNombre: 'Foto_Reparacion_MacroMedidor.jpg',
      fechaRegistro: '2026-09-09 15:30',
      registradoPor: 'Ing. Carlos Mendoza',
    },
    verificacion: {
      conforme: true,
      verificadoPor: 'Ing. Zaira Salvador Amaya (Supervisora ATM)',
      fechaVerificacion: '2026-09-10 10:00',
      notas: 'Inspección física en caseta comprobó cero goteo a presión nominal de 4.2 bar. Macro-medidor calibrado y operando.',
      resultadoMedicion: 'Presión: 4.2 bar • Caudal medido: 3.45 L/s continuo',
      entidadVerificadora: 'ATM Gran Chimú',
    },
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-10T10:30:00Z',
  },
];

export function loadPersistedActionPlans(): ActionPlanItem[] {
  try {
    const saved = localStorage.getItem('aqua_action_plans');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error loading action plans from localStorage', e);
  }
  return INITIAL_ACTION_PLANS;
}

export function savePersistedActionPlans(plans: ActionPlanItem[]): void {
  try {
    localStorage.setItem('aqua_action_plans', JSON.stringify(plans));
  } catch (e) {
    console.warn('Error saving action plans to localStorage', e);
  }
}

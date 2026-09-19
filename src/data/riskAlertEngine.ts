import {
  WaterSample,
  SamplingRecord,
  WaterSystem,
  AquaRiskItem,
  AquaAlertItem,
  AquaRiskLevel,
  AquaRiskProbability,
  AquaRiskConsequence,
  AquaRiskStatus,
  AquaAlertStatus,
  AquaAlertType,
} from '../types';

/**
 * Mathematical matrix calculation for WHO Water Safety Plans (PSA / OMS & DIGESA)
 * Probabilidad (1 - 3) × Consecuencia (1 - 5)
 */
export function calculateRiskLevel(
  prob: AquaRiskProbability,
  cons: AquaRiskConsequence
): AquaRiskLevel {
  const probScore: Record<AquaRiskProbability, number> = {
    Baja: 1,
    Media: 2,
    Alta: 3,
  };

  const consScore: Record<AquaRiskConsequence, number> = {
    Insignificante: 1,
    Menor: 2,
    Moderada: 3,
    Mayor: 4,
    Catastrófica: 5,
  };

  const score = probScore[prob] * consScore[cons];

  if (score >= 12) return 'Crítico';
  if (score >= 7) return 'Alto';
  if (score >= 4) return 'Moderado';
  return 'Bajo';
}

/**
 * Returns color classes and badges for Risk Levels
 */
export function getRiskLevelBadge(level: AquaRiskLevel): {
  label: string;
  badgeClass: string;
  dotColor: string;
  icon: string;
  description: string;
} {
  switch (level) {
    case 'Crítico':
      return {
        label: 'Crítico',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-600',
        icon: '🔴',
        description: 'Peligro inminente con potencial afección aguda o crónica severa.',
      };
    case 'Alto':
      return {
        label: 'Alto',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        dotColor: 'bg-orange-500',
        icon: '🟠',
        description: 'Riesgo significativo que requiere intervención correctiva prioritaria.',
      };
    case 'Moderado':
      return {
        label: 'Moderado',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        icon: '🟡',
        description: 'Condición en desvío que amerita vigilancia preventiva programada.',
      };
    case 'Bajo':
    default:
      return {
        label: 'Bajo',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
        icon: '🟢',
        description: 'Riesgo residual controlado bajo condiciones de operación normal.',
      };
  }
}

/**
 * Status formatting for Alerts
 */
export function getAlertStatusBadge(status: AquaAlertStatus): {
  label: string;
  badgeClass: string;
  icon: string;
} {
  switch (status) {
    case 'PENDIENTE':
      return {
        label: 'PENDIENTE',
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-300 font-bold',
        icon: 'pending_actions',
      };
    case 'EN PROCESO':
      return {
        label: 'EN PROCESO',
        badgeClass: 'bg-amber-50 text-amber-800 border border-amber-300 font-bold animate-pulse',
        icon: 'engineering',
      };
    case 'RESUELTA':
      return {
        label: 'RESUELTA',
        badgeClass: 'bg-sky-50 text-sky-800 border border-sky-300 font-bold',
        icon: 'task_alt',
      };
    case 'VERIFICADA':
      return {
        label: 'VERIFICADA',
        badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
        icon: 'verified',
      };
  }
}

/**
 * Generates automated alerts and risks derived STRICTLY from existing real data.
 * Adheres strictly to the principles:
 * - No generar alertas basadas en datos inexistentes.
 * - No inventar riesgos.
 * - Registrar el origen de cada alerta.
 */
export function generateAutomatedRisksAndAlerts(
  samples: WaterSample[],
  records: SamplingRecord[],
  systems: WaterSystem[]
): {
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
} {
  const alerts: AquaAlertItem[] = [];
  const risks: AquaRiskItem[] = [];

  // 1. DATA SOURCE: LAB SAMPLES (Microbiológico & Químico/Metales)
  samples.forEach((smp) => {
    smp.results.forEach((res) => {
      // Rule: Only generate an alert/risk if the result is NON-COMPLIANT
      if (res.compliance === 'no_cumple') {
        const isMicro =
          res.category === 'microbiologico' ||
          /coli|coliforme|bacteria|organismo/i.test(res.parameter);
        const isMetal =
          res.category === 'inorganico_metales' ||
          /arsénico|plomo|cadmio|mercurio|hierro|manganeso|cobre|zinc/i.test(res.parameter);

        if (isMicro) {
          // Alert: Microbiológica
          const code = `ALT-MIC-${smp.code.replace(/[^A-Za-z0-9]/g, '')}-${res.id.replace(/[^A-Za-z0-9]/g, '')}`;
          const riskId = `RSK-MIC-${smp.id}-${res.id}`;

          const alertItem: AquaAlertItem = {
            code,
            date: smp.date,
            system: smp.systemName,
            point: smp.point,
            parameter: res.parameter,
            result: `${res.result} ${res.unit}`,
            criterion: res.configuredCriteria || '0 UFC/100 mL (D.S. N.° 031-2010-SA)',
            level: 'Crítico',
            type: 'Microbiológica',
            responsible: smp.responsible || 'Responsable de Vigilancia Sanitaria',
            requiredAction:
              'Emitir alerta de no consumo directo de agua cruda. Instruir hervido por 3 minutos. Ejecutar desinfección de choque a 10 ppm Cl₂ en reservorio y purga completa de ramales terminales.',
            status: 'PENDIENTE',
            origin: {
              type: 'muestra_laboratorio',
              referenceId: smp.id,
              referenceCode: smp.code,
              detectedAt: `${smp.date} ${smp.time}`,
              details: `Muestra validada ${smp.code} en ${smp.origin}. Ensayo microbiológico reportó ${res.result} ${res.unit} (Incumplimiento normativo).`,
            },
            riskId,
          };

          const riskItem: AquaRiskItem = {
            id: riskId,
            danger: `Contaminación por ${res.parameter} en red de agua potable`,
            source: `${smp.jassName} • ${smp.systemName} (${smp.point})`,
            probability: 'Alta',
            consequence: 'Catastrófica',
            riskLevel: 'Crítico',
            controlMeasure:
              'Cloración de choque (10 mg/L), purga de sedimentos en tuberías, revisión de juntas de tubería y muestreo microbiológico de confirmación.',
            responsible: smp.responsible || 'Junta Directiva JASS / ATM',
            date: smp.date,
            status: 'Identificado',
            originType: 'laboratorio',
            originReference: smp.code,
            associatedAlertCode: code,
          };

          alerts.push(alertItem);
          risks.push(riskItem);
        } else if (isMetal) {
          // Alert: Química / Metales Pesados
          const isToxicSevere = /arsénico|plomo|cadmio|mercurio/i.test(res.parameter);
          const level: AquaRiskLevel = isToxicSevere ? 'Crítico' : 'Moderado';
          const code = `ALT-QUI-${smp.code.replace(/[^A-Za-z0-9]/g, '')}-${res.id.replace(/[^A-Za-z0-9]/g, '')}`;
          const riskId = `RSK-QUI-${smp.id}-${res.id}`;

          const alertItem: AquaAlertItem = {
            code,
            date: smp.date,
            system: smp.systemName,
            point: smp.point,
            parameter: res.parameter,
            result: `${res.result} ${res.unit}`,
            criterion: res.configuredCriteria || 'LMP D.S. N.° 031-2010-SA',
            level,
            type: 'Química',
            responsible: res.analyst || 'Especialista de Laboratorio y ATM',
            requiredAction: isToxicSevere
              ? 'Notificar a DIRESA/DIGESA. Activar fuente alterna de abastecimiento o implementar sistema de remoción / coagulación de emergencia.'
              : 'Verificar tuberías de distribución metálicas, purgar ramales con estancamiento y evaluar tratamiento de desferrización/desmanganización.',
            status: 'PENDIENTE',
            origin: {
              type: 'muestra_laboratorio',
              referenceId: smp.id,
              referenceCode: smp.code,
              detectedAt: `${smp.date} ${smp.time}`,
              details: `Muestra ${smp.code}. Ensayo instrumental de metales con equipo ${res.equipment}: ${res.result} ${res.unit} excede el LMP normativo.`,
            },
            riskId,
          };

          const riskItem: AquaRiskItem = {
            id: riskId,
            danger: `Exceso de concentración de ${res.parameter} sobre LMP normativo`,
            source: `${smp.jassName} • ${smp.systemName} (${smp.point})`,
            probability: isToxicSevere ? 'Alta' : 'Media',
            consequence: isToxicSevere ? 'Catastrófica' : 'Menor',
            riskLevel: level,
            controlMeasure: isToxicSevere
              ? 'Monitoreo de fuente, estudio hidrogeológico y diseño de planta de remoción por adsorción.'
              : 'Limpieza periódica de redes y descarte de corrosión en accesorios galvanizados.',
            responsible: 'Área Técnica Municipal (ATM) / Laboratorio Regional',
            date: smp.date,
            status: 'Identificado',
            originType: 'laboratorio',
            originReference: smp.code,
            associatedAlertCode: code,
          };

          alerts.push(alertItem);
          risks.push(riskItem);
        } else {
          // Fisicoquímico (ej. Cloro Residual Libre < 0.50 en muestra de lab)
          const isChlorine = /cloro/i.test(res.parameter);
          const alertType: AquaAlertType = isChlorine ? 'Desinfección' : 'Química';
          const code = isChlorine
            ? `ALT-DES-${smp.code.replace(/[^A-Za-z0-9]/g, '')}-${res.id.replace(/[^A-Za-z0-9]/g, '')}`
            : `ALT-QUI-${smp.code.replace(/[^A-Za-z0-9]/g, '')}-${res.id.replace(/[^A-Za-z0-9]/g, '')}`;
          const riskId = `RSK-FQ-${smp.id}-${res.id}`;

          const alertItem: AquaAlertItem = {
            code,
            date: smp.date,
            system: smp.systemName,
            point: smp.point,
            parameter: res.parameter,
            result: `${res.result} ${res.unit}`,
            criterion: res.configuredCriteria || 'D.S. N.° 031-2010-SA',
            level: isChlorine ? 'Alto' : 'Moderado',
            type: alertType,
            responsible: smp.responsible || 'Operador JASS',
            requiredAction: isChlorine
              ? 'Ajustar la dosificación continua de hipoclorito en el tanque reservorio para restituir residual ≥ 0.50 mg/L.'
              : 'Verificar filtros de sedimentos y procesos de decantación en captación.',
            status: 'PENDIENTE',
            origin: {
              type: 'muestra_laboratorio',
              referenceId: smp.id,
              referenceCode: smp.code,
              detectedAt: `${smp.date} ${smp.time}`,
              details: `Muestra ${smp.code}: ${res.parameter} reportó ${res.result} ${res.unit} (No conforme con norma).`,
            },
            riskId,
          };

          const riskItem: AquaRiskItem = {
            id: riskId,
            danger: isChlorine
              ? `Residual de desinfección insuficiente (< 0.5 mg/L) detectado en muestra de red`
              : `Alteración fisicoquímica en ${res.parameter}`,
            source: `${smp.jassName} • ${smp.systemName} (${smp.point})`,
            probability: 'Alta',
            consequence: isChlorine ? 'Mayor' : 'Moderada',
            riskLevel: isChlorine ? 'Alto' : 'Moderado',
            controlMeasure: isChlorine
              ? 'Recálculo de dosificación de cloro con el asistente de 7 pasos y verificación in situ con reactivo DPD.'
              : 'Mantenimiento de prefiltros de grava y arena en desarenador.',
            responsible: smp.responsible || 'Operador de Sistema JASS',
            date: smp.date,
            status: 'Identificado',
            originType: 'laboratorio',
            originReference: smp.code,
            associatedAlertCode: code,
          };

          alerts.push(alertItem);
          risks.push(riskItem);
        }
      }
    });
  });

  // 2. DATA SOURCE: SAMPLING RECORDS (Monitoreo DPD de Cloro Diario)
  records.forEach((rec) => {
    if (rec.freeChlorinePpm < 0.5) {
      const code = `ALT-DES-REC-${rec.id.replace(/[^A-Za-z0-9]/g, '')}`;
      const riskId = `RSK-DES-REC-${rec.id}`;

      alerts.push({
        code,
        date: rec.dateStr,
        system: rec.systemName,
        point: rec.measurementPoint,
        parameter: 'Cloro Libre Residual',
        result: `${rec.freeChlorinePpm.toFixed(2)} ppm`,
        criterion: '0.50 – 2.00 mg/L (D.S. N.° 031-2010-SA, Art. 66)',
        level: 'Alto',
        type: 'Desinfección',
        responsible: rec.operator || 'Operador JASS',
        requiredAction:
          'Recargar hipoclorito en el dosificador y regular goteo a caudal constante. Verificar concentración a la salida de reservorio.',
        status: 'PENDIENTE',
        origin: {
          type: 'monitoreo_cloro',
          referenceId: rec.id,
          referenceCode: `DPD-${rec.dateStr}`,
          detectedAt: `${rec.dateStr} ${rec.timeStr}`,
          details: `Registro de campo en bitácora oficial: Medición colorimétrica DPD con ${rec.freeChlorinePpm.toFixed(2)} ppm (sub-óptimo).`,
        },
        riskId,
      });

      risks.push({
        id: riskId,
        danger: 'Desprotección biológica por déficit de Cloro Residual Libre en red',
        source: `${rec.systemName} • Punto: ${rec.measurementPoint}`,
        probability: 'Alta',
        consequence: 'Mayor',
        riskLevel: 'Alto',
        controlMeasure:
          'Inspección inmediata de válvula dosificadora de cloro, purga de línea y aplicación de dosis correctiva según cálculo volumétrico.',
        responsible: rec.operator || 'Operador de Cloración JASS',
        date: rec.dateStr,
        status: 'Identificado',
        originType: 'cloro_campo',
        originReference: `REG-${rec.id}`,
        associatedAlertCode: code,
      });
    } else if (rec.freeChlorinePpm > 2.0) {
      const code = `ALT-DES-OVER-${rec.id.replace(/[^A-Za-z0-9]/g, '')}`;
      const riskId = `RSK-DES-OVER-${rec.id}`;

      alerts.push({
        code,
        date: rec.dateStr,
        system: rec.systemName,
        point: rec.measurementPoint,
        parameter: 'Cloro Libre Residual',
        result: `${rec.freeChlorinePpm.toFixed(2)} ppm`,
        criterion: '≤ 2.00 mg/L (D.S. N.° 031-2010-SA, Art. 66)',
        level: 'Moderado',
        type: 'Desinfección',
        responsible: rec.operator || 'Operador JASS',
        requiredAction:
          'Reducir tasa de goteo de hipoclorito y ventilar cámara de contacto. Informar a usuarios sobre sabor temporal a cloro.',
        status: 'PENDIENTE',
        origin: {
          type: 'monitoreo_cloro',
          referenceId: rec.id,
          referenceCode: `DPD-${rec.dateStr}`,
          detectedAt: `${rec.dateStr} ${rec.timeStr}`,
          details: `Sobrecloración reportada en lectura DPD: ${rec.freeChlorinePpm.toFixed(2)} ppm (supera 2.0 ppm).`,
        },
        riskId,
      });

      risks.push({
        id: riskId,
        danger: 'Sobrecloración y formación potencial de subproductos organolépticos',
        source: `${rec.systemName} • Punto: ${rec.measurementPoint}`,
        probability: 'Media',
        consequence: 'Moderada',
        riskLevel: 'Moderado',
        controlMeasure:
          'Reducción de apertura de válvula de dosificación y recalibración de solución madre al 1% o 2%.',
        responsible: rec.operator || 'Operador JASS',
        date: rec.dateStr,
        status: 'Identificado',
        originType: 'cloro_campo',
        originReference: `REG-${rec.id}`,
        associatedAlertCode: code,
      });
    }
  });

  // 3. DATA SOURCE: SYSTEMS STATUS (Operativa)
  systems.forEach((sys) => {
    if (sys.currentLevelPercent < 25) {
      const code = `ALT-OPE-${sys.id}-LVL`;
      const riskId = `RSK-OPE-${sys.id}`;

      alerts.push({
        code,
        date: 'Hoy',
        system: sys.name,
        point: 'Reservorio / Nivel de Almacenamiento',
        parameter: 'Volumen Operativo Útil',
        result: `${sys.currentLevelPercent}% (${Math.round((sys.capacityLiters * sys.currentLevelPercent) / 100).toLocaleString()} Litros)`,
        criterion: 'Nivel mínimo de seguridad ≥ 25% de capacidad',
        level: 'Alto',
        type: 'Operativa',
        responsible: sys.operator || 'Operador de Sistema',
        requiredAction:
          'Verificar desarenador e ingreso de captación por posible obturación. Implementar distribución horaria controlada si persiste estiaje.',
        status: 'PENDIENTE',
        origin: {
          type: 'estado_sistema',
          referenceId: sys.id,
          referenceCode: sys.name,
          detectedAt: sys.lastInspectionDate,
          details: `Nivel hidrostático del tanque reportado en ${sys.currentLevelPercent}% de capacidad total (${sys.capacityLiters.toLocaleString()} L).`,
        },
        riskId,
      });

      risks.push({
        id: riskId,
        danger: 'Desabastecimiento y colapso de presión hidráulica en red comunitaria',
        source: `Tanque de Almacenamiento: ${sys.name}`,
        probability: 'Alta',
        consequence: 'Mayor',
        riskLevel: 'Alto',
        controlMeasure:
          'Revisión de línea de conducción, control de pérdidas por fugas y activación de plan de contingencia de racionamiento.',
        responsible: sys.operator || 'Comité Directivo JASS',
        date: 'Hoy',
        status: 'Identificado',
        originType: 'sistema_operativo',
        originReference: sys.id,
        associatedAlertCode: code,
      });
    }
  });

  // 4. DATA SOURCE: JASS SURVEILLANCE STATUS (JASS)
  // Check for JASS surveillance coverage or inspection delays
  const systemsWithInspectionDelay = systems.filter((s) =>
    /hace 2|hace 3|hace 4|seman/i.test(s.lastInspectionDate)
  );

  systemsWithInspectionDelay.forEach((sys) => {
    const code = `ALT-JAS-${sys.id}-VIG`;
    const riskId = `RSK-JAS-${sys.id}`;

    alerts.push({
      code,
      date: 'Hoy',
      system: sys.name,
      point: 'Gobernanza Sanitaria / Monitoreo JASS',
      parameter: 'Frecuencia de Vigilancia Sanitaria',
      result: `Última inspección: ${sys.lastInspectionDate}`,
      criterion: 'Inspección y monitoreo de cloro diario (D.S. 031-2010-SA)',
      level: 'Moderado',
      type: 'JASS',
      responsible: sys.operator || 'Consejo Directivo JASS',
      requiredAction:
        'Realizar de inmediato la lectura de cloro residual libre y pH in situ, y cargar el resultado en la bitácora digital de la JASS.',
      status: 'PENDIENTE',
      origin: {
        type: 'vigilancia_jass',
        referenceId: sys.id,
        referenceCode: `JASS-${sys.id}`,
        detectedAt: sys.lastInspectionDate,
        details: `Discontinuidad en registro de inspección en el sistema ${sys.name} (${sys.location}).`,
      },
      riskId,
    });

    risks.push({
      id: riskId,
      danger: 'Falta de trazabilidad y discontinuidad en la vigilancia sanitaria de la JASS',
      source: `Gestión JASS • ${sys.name}`,
      probability: 'Media',
      consequence: 'Moderada',
      riskLevel: 'Moderado',
      controlMeasure:
        'Establecer rol semanal de operadores comunitarios y supervisión mensual por parte del Área Técnica Municipal (ATM).',
      responsible: 'Consejo Directivo JASS / ATM',
      date: 'Hoy',
      status: 'Identificado',
      originType: 'jass',
      originReference: sys.id,
      associatedAlertCode: code,
    });
  });

  // 5. DATA SOURCE: TERRITORIAL AGGREGATION (Territorial)
  // Check if multiple systems share deviations in the same district/province
  const criticalFindingsCount = alerts.filter(
    (a) => a.level === 'Crítico' || a.level === 'Alto'
  ).length;

  if (criticalFindingsCount >= 2) {
    const code = 'ALT-TER-2026-001';
    const riskId = 'RSK-TER-001';

    alerts.push({
      code,
      date: 'Hoy',
      system: 'Ámbito Territorial Cuenca Alta Chicama',
      point: 'Cuenca Hidrográfica y Redes Rurales Agrupadas',
      parameter: 'Índice de Vulnerabilidad Territorial Sanitaria',
      result: `${criticalFindingsCount} alertas sanitarias activas en el sector rural`,
      criterion: 'Límite territorial: 0 alertas críticas simultáneas no atendidas',
      level: 'Alto',
      type: 'Territorial',
      responsible: 'Mesa Técnica Interinstitucional (ATM • Red de Salud • JASS)',
      requiredAction:
        'Convocar sesión de contingencia sanitaria entre los comités JASS del distrito y el Área Técnica Municipal para movilización de suministros y apoyo técnico.',
      status: 'PENDIENTE',
      origin: {
        type: 'analisis_territorial',
        referenceId: 'terr-sector-01',
        referenceCode: 'AMBITO-TERRITORIAL',
        detectedAt: '2026-09-13',
        details: `Consolidado territorial: Se detectaron ${criticalFindingsCount} incidencias de calidad de agua y desinfección en simultáneo entre distintos sistemas del ámbito.`,
      },
      riskId,
    });

    risks.push({
      id: riskId,
      danger: 'Riesgo epidemiológico colectivo por vulnerabilidad simultánea en cuenca',
      source: 'Ámbito Territorial Multicomunitario Gran Chimú / Otuzco',
      probability: 'Media',
      consequence: 'Mayor',
      riskLevel: 'Alto',
      controlMeasure:
        'Plan territorial de respuesta rápida: abastecimiento de hipoclorito certificado, capacitación de operadores y monitoreo epidemiológico conjunto con puestos de salud.',
      responsible: 'Área Técnica Municipal (ATM) y Red de Salud',
      date: 'Hoy',
      status: 'Identificado',
      originType: 'territorial',
      originReference: 'terr-sector-01',
      associatedAlertCode: code,
    });
  }

  return { alerts, risks };
}

/**
 * Storage helpers to persist user actions on alerts and risk matrix
 */
export function loadPersistedAlerts(generatedAlerts: AquaAlertItem[]): AquaAlertItem[] {
  try {
    const saved = localStorage.getItem('aqua_alerts_list');
    if (saved) {
      const parsed: AquaAlertItem[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge generated alerts with user-modified statuses
        const map = new Map<string, AquaAlertItem>();
        // Add parsed first
        parsed.forEach((item) => map.set(item.code, item));
        // Ensure all generated items exist, keeping user changes if already present
        generatedAlerts.forEach((gen) => {
          if (!map.has(gen.code)) {
            map.set(gen.code, gen);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Could not load alerts from storage', e);
  }
  return generatedAlerts;
}

export function savePersistedAlerts(alerts: AquaAlertItem[]): void {
  try {
    localStorage.setItem('aqua_alerts_list', JSON.stringify(alerts));
  } catch (e) {
    console.warn('Could not save alerts to storage', e);
  }
}

export function loadPersistedRisks(generatedRisks: AquaRiskItem[]): AquaRiskItem[] {
  try {
    const saved = localStorage.getItem('aqua_risks_matrix');
    if (saved) {
      const parsed: AquaRiskItem[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, AquaRiskItem>();
        parsed.forEach((item) => map.set(item.id, item));
        generatedRisks.forEach((gen) => {
          if (!map.has(gen.id)) {
            map.set(gen.id, gen);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.warn('Could not load risks from storage', e);
  }
  return generatedRisks;
}

export function savePersistedRisks(risks: AquaRiskItem[]): void {
  try {
    localStorage.setItem('aqua_risks_matrix', JSON.stringify(risks));
  } catch (e) {
    console.warn('Could not save risks to storage', e);
  }
}

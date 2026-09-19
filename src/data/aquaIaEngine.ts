import {
  WaterSystem,
  SamplingRecord,
  WaterSample,
  AquaAlertItem,
  AquaRiskItem,
  ActionPlanItem,
} from '../types';

export interface AquaIAContextData {
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples: WaterSample[];
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
  plans: ActionPlanItem[];
}

export interface AquaIAParsedResponse {
  raw: string;
  datos: string;
  interpretacion: string;
  recomendacion: string;
  disclaimer: string;
  isNoData: boolean;
}

const MANDATORY_DISCLAIMER =
  'Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente.';

/**
 * Helper to determine chlorine compliance status for a WaterSystem
 */
function getSystemChlorineStatus(ppm: number): string {
  if (ppm >= 0.5 && ppm <= 2.0) return 'CONFORME';
  if (ppm > 0) return 'SUB-CLORADO';
  return 'SIN CLORACIÓN';
}

/**
 * Parses markdown text into the three required sections:
 * ### DATOS
 * ### INTERPRETACIÓN
 * ### RECOMENDACIÓN
 */
export function parseAquaIAResponse(text: string): AquaIAParsedResponse {
  const isNoData = text.includes('No existen datos suficientes para realizar esta evaluación');

  let datos = '';
  let interpretacion = '';
  let recomendacion = '';

  const datosMatch = text.match(/###\s*DATOS([\s\S]*?)(?=###\s*INTERPRETACIÓN|$)/i);
  const interpMatch = text.match(/###\s*INTERPRETACIÓN([\s\S]*?)(?=###\s*RECOMENDACIÓN|$)/i);
  const recomMatch = text.match(/###\s*RECOMENDACIÓN([\s\S]*?)(?=\*Nota técnica|\*Disclaimer|$)/i);

  if (datosMatch) datos = datosMatch[1].trim();
  if (interpMatch) interpretacion = interpMatch[1].trim();
  if (recomMatch) recomendacion = recomMatch[1].trim();

  // If standard headings were not detected, distribute cleanly
  if (!datos && !interpretacion && !recomendacion) {
    if (isNoData) {
      datos = 'No existen registros analíticos o de campo que satisfagan el criterio de la consulta.';
      interpretacion = 'No existen datos suficientes para realizar esta evaluación.';
      recomendacion = 'Completar el registro de muestras de laboratorio o monitoreo de cloro en la plataforma.';
    } else {
      interpretacion = text;
    }
  }

  return {
    raw: text,
    datos,
    interpretacion,
    recomendacion,
    disclaimer: MANDATORY_DISCLAIMER,
    isNoData,
  };
}

/**
 * Summarizes the current operational datasets into a clean, concise context prompt
 * to feed into Gemini 3.8-flash without hallucination.
 */
export function buildAquaIASystemPrompt(context: AquaIAContextData): string {
  const { systems, records, samples, alerts, risks, plans } = context;

  const systemSummary = systems.map((s) => ({
    id: s.id,
    nombre: s.name,
    tipo: s.type,
    ubicacion: s.location,
    operador: s.operator,
    capacidadLitros: s.capacityLiters,
    cloroPpm: s.lastChlorinePpm,
    ultimaInspeccion: s.lastInspectionDate,
    estadoCloracion: getSystemChlorineStatus(s.lastChlorinePpm),
  }));

  const recordsSummary = records.slice(0, 15).map((r) => ({
    sistema: r.systemName,
    fecha: r.dateStr,
    hora: r.timeStr,
    punto: r.measurementPoint,
    cloroPpm: r.freeChlorinePpm,
    ph: r.ph,
    turbidezNtu: r.turbidityNtu,
    estado: r.status,
    operador: r.operator,
  }));

  const samplesSummary = samples.slice(0, 10).map((s) => ({
    codigo: s.code,
    fecha: s.date,
    sistema: s.systemName,
    jass: s.jassName,
    punto: s.point,
    resultados: s.results.map((r) => ({
      parametro: r.parameter,
      resultado: r.result,
      unidad: r.unit,
      limite: r.normativeLimit || r.configuredCriteria,
      cumplimiento: r.compliance,
      riesgo: r.healthRisk,
    })),
  }));

  const alertsSummary = alerts.map((a) => ({
    codigo: a.code,
    fecha: a.date,
    sistema: a.system,
    punto: a.point,
    parametro: a.parameter,
    resultado: a.result,
    criterio: a.criterion,
    nivel: a.level,
    tipo: a.type,
    estado: a.status,
    responsable: a.responsible,
    accionRequerida: a.requiredAction,
  }));

  const risksSummary = risks.map((r) => ({
    id: r.id,
    peligro: r.danger,
    fuente: r.source,
    probabilidad: r.probability,
    consecuencia: r.consequence,
    nivelRiesgo: r.riskLevel,
    medidaControl: r.controlMeasure,
    responsable: r.responsible,
    estado: r.status,
  }));

  const plansSummary = plans.map((p) => ({
    id: p.id,
    alertaOrigen: p.alertCode,
    sistema: p.systemName,
    problema: p.problema,
    causaProbable: p.causaProbable,
    accion: p.accion,
    responsable: p.responsable,
    fechaLimite: p.fechaLimite,
    estado: p.estado,
    verificado: !!p.verificacion?.conforme,
  }));

  return `Eres AQUA-IA, el asistente inteligente especializado de la plataforma de vigilancia sanitaria de agua potable AQUA-SALUD / CLORAGUA (Perú, bajo normativa D.S. N.° 031-2010-SA de DIGESA / MINSA).

REGLAS CRÍTICAS E INQUEBRANTABLES:
1. Debes responder basándote EXCLUSIVAMENTE en los datos provistos a continuación.
2. NO debes inventar datos, resultados, muestras, ubicaciones, normas ni acciones.
3. NO debes afirmar cumplimiento sin evidencia en los datos.
4. Cuando no existan datos suficientes para responder la consulta del usuario, responde exactamente:
"No existen datos suficientes para realizar esta evaluación."
5. La respuesta DEBE estructurarse SIEMPRE y OBLIGATORIAMENTE en tres secciones con encabezados exactos:
### DATOS
(Presenta los datos numéricos y hechos comprobados extraídos estrictamente de la plataforma, mencionando sistemas, fechas, parámetros o JASS correspondientes).

### INTERPRETACIÓN
(Analiza el significado sanitario, legal y operativo de los datos expuestos según la normativa de agua potable D.S. N.° 031-2010-SA: rango óptimo 0.5 - 2.0 ppm Cl₂ libre, límites de metales, E. coli = 0 UFC/100 mL, etc.).

### RECOMENDACIÓN
(Proporciona recomendaciones técnicas, preventivas o correctivas concretas dirigidas a los operadores de JASS, ATM o inspectores de salud).

6. Al final, incluye siempre esta nota técnica:
"Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente."

DATOS OFICIALES DISPONIBLES EN LA PLATAFORMA CLORAGUA:
- Sistemas de Agua (${systemSummary.length} registrados):
${JSON.stringify(systemSummary, null, 2)}

- Últimos Controles de Cloro (${recordsSummary.length} en bitácora):
${JSON.stringify(recordsSummary, null, 2)}

- Muestras de Laboratorio (${samplesSummary.length} registradas):
${JSON.stringify(samplesSummary, null, 2)}

- Alertas Sanitarias Registradas (${alertsSummary.length} alertas):
${JSON.stringify(alertsSummary, null, 2)}

- Matriz de Riesgos Sanitarios (${risksSummary.length} riesgos evaluados):
${JSON.stringify(risksSummary, null, 2)}

- Planes de Acción Correctiva (${plansSummary.length} planes en trazabilidad):
${JSON.stringify(plansSummary, null, 2)}
`;
}

/**
 * Deterministic fallback generator when offline or if Gemini API key is unavailable.
 * Strictly adheres to the real platform datasets and the exact requested structure.
 */
export function generateDeterministicAquaIAResponse(
  query: string,
  context: AquaIAContextData
): string {
  const q = query.toLowerCase().trim();
  const { systems, records, samples, alerts, plans } = context;

  // 1. "¿Qué JASS tienen más alertas?"
  if (q.includes('jass') && (q.includes('alerta') || q.includes('alertas'))) {
    if (alerts.length === 0) {
      return `### DATOS\nActualmente no se registran alertas sanitarias activas en la plataforma.\n\n### INTERPRETACIÓN\nNo existen datos suficientes para realizar esta evaluación de distribución de alertas por JASS.\n\n### RECOMENDACIÓN\nContinuar con el monitoreo diario de cloro residual y vigilancia mensual para sostener la trazabilidad.\n\n*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
    }

    // Group alerts by system / location
    const alertCountByOrg: Record<string, { total: number; criticas: number; altas: number; sistemas: Set<string> }> = {};

    alerts.forEach((a) => {
      const sys = systems.find((s) => s.name === a.system || s.id === a.system);
      const orgName = sys ? `JASS / Sistema ${sys.name} (${sys.location})` : `JASS ${a.system}`;

      if (!alertCountByOrg[orgName]) {
        alertCountByOrg[orgName] = { total: 0, criticas: 0, altas: 0, sistemas: new Set() };
      }
      alertCountByOrg[orgName].total += 1;
      if (a.level === 'Crítico') alertCountByOrg[orgName].criticas += 1;
      if (a.level === 'Alto') alertCountByOrg[orgName].altas += 1;
      alertCountByOrg[orgName].sistemas.add(a.system);
    });

    const sorted = Object.entries(alertCountByOrg).sort((a, b) => b[1].total - a[1].total);

    const datosList = sorted
      .map(
        ([org, stat]) =>
          `• **${org}**: ${stat.total} alerta(s) registrada(s) (${stat.criticas} críticas, ${stat.altas} de riesgo alto).`
      )
      .join('\n');

    const topOrg = sorted[0];

    return `### DATOS
Se han analizado ${alerts.length} alertas sanitarias registradas en la plataforma:
${datosList}

### INTERPRETACIÓN
La organización con mayor número de alertas registradas es **${topOrg[0]}** con ${topOrg[1].total} incidencias acumuladas (${topOrg[1].criticas} críticas y ${topOrg[1].altas} altas). De acuerdo al D.S. N.° 031-2010-SA, los parámetros críticos comprometen la calidad bacteriológica o químico-toxicológica del agua distribuida.

### RECOMENDACIÓN
1. Priorizar visita técnica y supervisión de emergencia del Área Técnica Municipal (ATM) a **${topOrg[0]}**.
2. Verificar el stock de hipoclorito de calcio al 65-70% y el estado del sistema dosificador.
3. Aperturar planes de acción correctiva con plazos perentorios no mayores a 48 horas para las alertas críticas identificadas.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // 2. "¿Qué sistemas tienen controles de cloro pendientes?"
  if (q.includes('cloro') && (q.includes('pendiente') || q.includes('pendientes') || q.includes('control') || q.includes('falta'))) {
    const pendingSystems = systems.filter(
      (s) => s.lastInspectionDate !== 'Hoy' || s.lastChlorinePpm === 0 || !s.lastChlorinePpm
    );

    if (pendingSystems.length === 0) {
      return `### DATOS
Todos los sistemas registrados (${systems.length} sistemas) cuentan con registro de cloro libre actualizado al día de hoy en la bitácora oficial.

### INTERPRETACIÓN
Existe una adecuada cobertura de control diario de cloro residual según lo establecido por el Reglamento de la Calidad del Agua para Consumo Humano.

### RECOMENDACIÓN
Mantener el registro rutinario matutino en reservorio y puntos distales de la red de distribución.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
    }

    const datosList = pendingSystems
      .map(
        (s) =>
          `• **${s.name}** (${s.location}): Última inspección reportada: "${s.lastInspectionDate || 'Sin registro'}", último cloro registrado: ${s.lastChlorinePpm.toFixed(2)} ppm.`
      )
      .join('\n');

    return `### DATOS
Se identificaron ${pendingSystems.length} de ${systems.length} sistemas de agua con necesidad de control de cloro actualizado:
${datosList}

### INTERPRETACIÓN
La falta de verificación diaria del cloro residual libre impide garantizar la barrera de desinfección sanitaria exigida (0.5 a 2.0 ppm Cl₂ libre según D.S. N.° 031-2010-SA). En sistemas rurales sin medición confirmada hoy, existe incertidumbre sobre la protección microbiológica ante agentes patógenos.

### RECOMENDACIÓN
1. Disponer que el operador local efectúe de inmediato la medición de cloro libre con comparador o fotómetro DPD en reservorio y el punto más alejado de la red.
2. Ingresar la lectura en la bitácora oficial de CLORAGUA para regularizar el estado de vigilancia territorial.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // 3. "¿Qué parámetros presentan más incumplimientos?"
  if (q.includes('parámetro') || q.includes('parametro') || q.includes('incumplimiento') || q.includes('supera') || q.includes('norma')) {
    const paramNonCompliance: Record<string, { count: number; maxFound: string; limit: string }> = {};

    samples.forEach((s) => {
      s.results.forEach((r) => {
        if (r.compliance === 'no_cumple' || r.healthRisk === 'riesgo_alto' || r.healthRisk === 'riesgo_critico') {
          if (!paramNonCompliance[r.parameter]) {
            paramNonCompliance[r.parameter] = { count: 0, maxFound: r.result, limit: r.normativeLimit || r.configuredCriteria || 'LMP' };
          }
          paramNonCompliance[r.parameter].count += 1;
        }
      });
    });

    const entries = Object.entries(paramNonCompliance).sort((a, b) => b[1].count - a[1].count);

    if (entries.length === 0) {
      return `### DATOS
No se registran parámetros con incumplimiento normativo en las ${samples.length} muestras de laboratorio analizadas en la plataforma.

### INTERPRETACIÓN
Los resultados analíticos vigentes se encuentran dentro de los Límites Máximos Permisibles (LMP) del D.S. N.° 031-2010-SA.

### RECOMENDACIÓN
Mantener el cronograma trimestral de muestreo para control microbiológico y semestral para metales pesados.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
    }

    const datosList = entries
      .map(
        ([param, info]) =>
          `• **${param}**: ${info.count} reporte(s) fuera de límite (LMP normativo: ${info.limit}).`
      )
      .join('\n');

    return `### DATOS
Parámetros con incumplimiento comprobado en laboratorio:
${datosList}

### INTERPRETACIÓN
El parámetro con mayor recurrencia de no conformidad es **${entries[0][0]}** (${entries[0][1].count} casos). Superar los límites establecidos para parámetros microbiológicos o químicos (como metales pesados) constituye un factor de riesgo para la salud pública de la población abastecida.

### RECOMENDACIÓN
1. Realizar un muestreo confirmatorio de verificación inmediata.
2. Si el parámetro es microbiológico (Coliformes / E. coli), proceder a la desinfección de choque y ajuste de dosis de cloro.
3. Si el parámetro es físico-químico o metales pesados (Arsénico/Plomo), evaluar fuentes alternas y comunicar a la DIRESA/MINSA.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // 4. "¿Qué sistemas presentan tendencia desfavorable?"
  if (q.includes('tendencia') || q.includes('desfavorable') || q.includes('decae') || q.includes('empeora')) {
    const criticalSystems = systems.filter((s) => {
      const hasCriticalAlert = alerts.some((a) => a.system === s.name && (a.level === 'Crítico' || a.level === 'Alto'));
      const isSubChlorinated = s.lastChlorinePpm > 0 && s.lastChlorinePpm < 0.5;
      const isZeroChlorine = s.lastChlorinePpm === 0;
      return hasCriticalAlert || isSubChlorinated || isZeroChlorine;
    });

    if (criticalSystems.length === 0) {
      return `### DATOS
Todos los sistemas registrados presentan valores de cloro residual en rango conforme (0.50 - 2.00 ppm) y sin alertas críticas activas.

### INTERPRETACIÓN
No se evidencia tendencia sanitaria desfavorable en los sistemas monitoreados.

### RECOMENDACIÓN
Continuar con el régimen de dosificación constante y calibración periódica del sistema por goteo o pastillas.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
    }

    const datosList = criticalSystems
      .map((s) => {
        const sysAlerts = alerts.filter((a) => a.system === s.name);
        return `• **${s.name}** (${s.location}): Cloro actual: ${s.lastChlorinePpm.toFixed(2)} ppm (${getSystemChlorineStatus(s.lastChlorinePpm)}), ${sysAlerts.length} alerta(s) asociada(s).`;
      })
      .join('\n');

    return `### DATOS
Sistemas con comportamiento sanitario desfavorable en la plataforma:
${datosList}

### INTERPRETACIÓN
Los sistemas identificados registran concentraciones de cloro libre por debajo de la norma sanitaria (sub-cloración crítica < 0.5 ppm) o presentan alertas microbiológicas/químicas sin resolver, incrementando el riesgo de enfermedades diarreicas agudas (EDAs).

### RECOMENDACIÓN
1. Ajustar el caudal de dosificación de solución clorada en cámara de mezcla.
2. Limpiar y purgar sedimentos en el reservorio de almacenamiento.
3. Ejecutar seguimiento analítico en las siguientes 24 horas.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // 5. "¿Qué acciones correctivas están pendientes?"
  if (q.includes('acción') || q.includes('accion') || q.includes('correctiva') || q.includes('plan') || q.includes('planes')) {
    const pendingPlans = plans.filter((p) => p.estado !== 'CIERRE');

    if (pendingPlans.length === 0) {
      return `### DATOS
No existen planes de acción correctiva pendientes en la plataforma; todos los planes registrados se encuentran cerrados y verificados.

### INTERPRETACIÓN
El ciclo de resolución de incidentes sanitarios se encuentra al día respecto a los planes formulados.

### RECOMENDACIÓN
Mantener la vigilancia periódica y formular nuevos planes de acción en cuanto se generen alertas en AQUA-ALERT.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
    }

    const datosList = pendingPlans
      .map(
        (p) =>
          `• **Plan ${p.id}** (${p.systemName}): Etapa actual **${p.estado}**. Acción requerida: "${p.accion}". Responsable: ${p.responsable}. Vencimiento: ${p.fechaLimite}.`
      )
      .join('\n');

    return `### DATOS
Se registran ${pendingPlans.length} planes de acción en proceso de cumplimiento:
${datosList}

### INTERPRETACIÓN
Existen intervenciones técnicas que aún no han alcanzado las fases finales de Evidencia y Verificación técnica. El retraso en la implementación de estas acciones prolonga la exposición de la población a riesgos sanitarios identificados.

### RECOMENDACIÓN
1. Coordinar con los responsables designados para acelerar las tareas de campo.
2. Adjuntar las actas comunales y mediciones fotométricas como evidencia digital en el módulo Planes de Acción.
3. Programar la verificación analítica in situ para proceder al cierre formal del expediente.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // 6. "Genera un resumen mensual."
  if (q.includes('resumen') || q.includes('mensual') || q.includes('informe') || q.includes('consolidado')) {
    const totalSistemas = systems.length;
    const conformes = systems.filter((s) => s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0).length;
    const subClorados = systems.filter((s) => s.lastChlorinePpm > 0 && s.lastChlorinePpm < 0.5).length;
    const sinCloro = systems.filter((s) => s.lastChlorinePpm === 0).length;
    const alertasPendientes = alerts.filter((a) => a.status === 'PENDIENTE' || a.status === 'EN PROCESO').length;
    const planesActivos = plans.filter((p) => p.estado !== 'CIERRE').length;

    return `### DATOS
Consolidado operativo territorial del periodo:
• **Sistemas Vigilados**: ${totalSistemas} sistemas rurales de agua potable.
• **Cumplimiento de Cloro Libre (0.5 - 2.0 ppm)**: ${conformes} de ${totalSistemas} sistemas (${Math.round((conformes / (totalSistemas || 1)) * 100)}%).
• **Sistemas en Sub-cloración (<0.5 ppm)**: ${subClorados} sistema(s).
• **Sistemas sin Cloración (0.0 ppm)**: ${sinCloro} sistema(s).
• **Alertas Sanitarias Activas**: ${alertasPendientes} alertas en curso.
• **Planes de Acción en Ejecución**: ${planesActivos} planes correctivos.

### INTERPRETACIÓN
El índice territorial de desinfección efectiva alcanza el ${Math.round((conformes / (totalSistemas || 1)) * 100)}%. Si bien la mayoría de los sistemas cumple con la barrera desinfectante mínima, los sistemas con sub-cloración y sin cloración demandan asistencia técnica inmediata del ATM para evitar brotes epidemiológicos por consumo de agua no desinfectada.

### RECOMENDACIÓN
1. Realizar inspecciones técnicas prioritarias en los sistemas en sub-cloración y sin cloración.
2. Asegurar el abastecimiento continuo de insumos químicos (hipoclorito) para las JASS de la jurisdicción.
3. Dar seguimiento estricto a las ${alertasPendientes} alertas y ${planesActivos} planes de acción en curso hasta su cierre verificado.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // Check if query is asking about a specific system
  const matchedSys = systems.find(
    (s) => q.includes(s.name.toLowerCase()) || q.includes(s.location.toLowerCase())
  );

  if (matchedSys) {
    const sysAlerts = alerts.filter((a) => a.system === matchedSys.name);
    const sysRecords = records.filter((r) => r.systemId === matchedSys.id || r.systemName === matchedSys.name);

    return `### DATOS
Información registrada para el sistema **${matchedSys.name}** (${matchedSys.location}):
• Tipo de sistema: ${matchedSys.type}
• Capacidad: ${matchedSys.capacityLiters.toLocaleString('es-PE')} L
• Operador a cargo: ${matchedSys.operator}
• Último control de cloro: ${matchedSys.lastChlorinePpm.toFixed(2)} ppm (${getSystemChlorineStatus(matchedSys.lastChlorinePpm)})
• Última inspección: ${matchedSys.lastInspectionDate}
• Alertas registradas: ${sysAlerts.length}
• Registros en bitácora: ${sysRecords.length}

### INTERPRETACIÓN
El sistema registra un estado de cloración ${matchedSys.lastChlorinePpm >= 0.5 && matchedSys.lastChlorinePpm <= 2.0 ? 'CONFORME' : 'NO CONFORME'} según el D.S. N.° 031-2010-SA (rango reglamentario: 0.50 a 2.00 ppm Cl₂ libre).

### RECOMENDACIÓN
1. Mantener las mediciones diarias de cloro libre en la red de distribución.
2. Registrar cualquier observación operativa en la bitácora oficial de CLORAGUA.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
  }

  // Fallback for general or unsupported query with real summary
  return `### DATOS
La plataforma CLORAGUA tiene actualmente registrados:
• ${systems.length} sistemas de agua rurales.
• ${records.length} controles de cloro en bitácora oficial.
• ${samples.length} muestras de laboratorio validadas.
• ${alerts.length} alertas sanitarias generadas.
• ${plans.length} planes de acción en trazabilidad.

### INTERPRETACIÓN
No existen datos suficientes para realizar esta evaluación específica sobre "${query}" sin filtros adicionales de sistema, parámetro o fecha.

### RECOMENDACIÓN
Especificar el nombre del sistema de agua o parámetro deseado, o seleccionar una de las consultas recomendadas en el panel.

*Nota técnica: ${MANDATORY_DISCLAIMER}*`;
}

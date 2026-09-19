import React, { useState, useEffect } from 'react';
import {
  SamplingRecord,
  WaterSample,
  AquaAlertItem,
  AquaRiskItem,
  ActionPlanItem,
  WaterSystem,
} from '../../types';
import { TabType } from '../FloatingNavbar';

interface AquaE2ETestModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples: WaterSample[];
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
  actionPlans: ActionPlanItem[];
  onAddRecord: (rec: SamplingRecord) => void;
  onUpdateRecord?: (rec: SamplingRecord) => void;
  onAddSample: (sample: WaterSample) => void;
  onUpdateSample: (sample: WaterSample) => void;
  onAddAlert: (alert: AquaAlertItem) => void;
  onUpdateAlert: (alert: AquaAlertItem) => void;
  onAddRisk: (risk: AquaRiskItem) => void;
  onUpdateRisk: (risk: AquaRiskItem) => void;
  onAddPlan: (plan: ActionPlanItem) => void;
  onUpdatePlan: (plan: ActionPlanItem) => void;
  onPurgeAllDemoData: () => void;
  onNavigateTab: (tab: TabType) => void;
  operatorName: string;
}

export interface SimulationStep {
  stepNumber: number;
  phase: 'JASS & CLORACIÓN' | 'ALERTA & ACCIÓN' | 'CIERRE & VERIFICACIÓN' | 'LABORATORIO & RIESGO' | 'DASHBOARD & MAPA';
  title: string;
  description: string;
  targetModule: TabType;
  status: 'pending' | 'active' | 'completed';
  badge: string;
  details: {
    label: string;
    value: string;
    subtext?: string;
    highlight?: boolean;
    warning?: boolean;
  }[];
}

export const AquaE2ETestModal: React.FC<AquaE2ETestModalProps> = ({
  isOpen,
  onClose,
  systems,
  records,
  samples,
  alerts,
  risks,
  actionPlans,
  onAddRecord,
  onAddSample,
  onUpdateSample,
  onAddAlert,
  onUpdateAlert,
  onAddRisk,
  onUpdateRisk,
  onAddPlan,
  onUpdatePlan,
  onPurgeAllDemoData,
  onNavigateTab,
  operatorName,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunningAuto, setIsRunningAuto] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'stepper' | 'audit' | 'cleanup'>('stepper');

  // Specific IDs used across the demo flow
  const DEMO_SYSTEM_ID = systems[0]?.id || 'SYS-01';
  const DEMO_SYSTEM_NAME = systems[0]?.name || 'Sistema Central Grau';
  const DEMO_JASS_NAME = systems[0]?.jassName || 'JASS Central';

  const DEMO_RECORD_FAIL_ID = 'REC-DEMO-001';
  const DEMO_RECORD_RESOLVE_ID = 'REC-DEMO-002';
  const DEMO_ALERT_CODE = 'ALT-DEMO-DES-001';
  const DEMO_PLAN_ID = 'PLAN-DEMO-2026-001';
  const DEMO_RISK_ID = 'RSK-DEMO-001';
  const DEMO_SAMPLE_ID = 'SMP-DEMO-2026-001';
  const DEMO_SAMPLE_CODE = 'MUE-DEMO-2026-001';

  // Check which steps are completed in state
  const hasRecordFail = records.some((r) => r.id === DEMO_RECORD_FAIL_ID);
  const hasAlert = alerts.some((a) => a.code === DEMO_ALERT_CODE);
  const hasPlan = actionPlans.some((p) => p.id === DEMO_PLAN_ID);
  const planIsClosed = actionPlans.some((p) => p.id === DEMO_PLAN_ID && p.estado === 'CIERRE');
  const alertIsResolved = alerts.some(
    (a) => a.code === DEMO_ALERT_CODE && (a.status === 'RESUELTA' || a.status === 'VERIFICADA')
  );
  const hasRecordResolve = records.some((r) => r.id === DEMO_RECORD_RESOLVE_ID);

  const hasLabSample = samples.some((s) => s.id === DEMO_SAMPLE_ID);
  const sampleHasMicro = samples.some(
    (s) => s.id === DEMO_SAMPLE_ID && s.results.some((r) => r.category === 'microbiologico')
  );
  const sampleHasFisico = samples.some(
    (s) => s.id === DEMO_SAMPLE_ID && s.results.some((r) => r.category === 'fisicoquimico')
  );
  const sampleHasMetales = samples.some(
    (s) => s.id === DEMO_SAMPLE_ID && s.results.some((r) => r.category === 'inorganico_metales')
  );
  const sampleIsValidated = samples.some(
    (s) => s.id === DEMO_SAMPLE_ID && s.status === 'VALIDADA'
  );
  const hasDemoRisk = risks.some((r) => r.id === DEMO_RISK_ID);

  // Count total DEMO items currently in memory
  const totalDemoItems =
    records.filter((r) => r.isDemo).length +
    samples.filter((s) => s.isDemo).length +
    alerts.filter((a) => a.isDemo).length +
    risks.filter((r) => r.isDemo).length +
    actionPlans.filter((p) => p.isDemo).length;

  // Execute a single step
  const executeStep = (stepIdx: number) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    switch (stepIdx) {
      case 0: {
        // Step 1 & 2: JASS registra control de cloro (0.18 ppm, sub-óptimo)
        if (!hasRecordFail) {
          const recFail: SamplingRecord = {
            id: DEMO_RECORD_FAIL_ID,
            timestamp: new Date().toISOString(),
            dateStr: today,
            timeStr: nowTime,
            systemId: DEMO_SYSTEM_ID,
            systemName: DEMO_SYSTEM_NAME,
            measurementPoint: 'Salida de Reservorio Principal [DEMO / PRUEBA]',
            freeChlorinePpm: 0.18,
            ph: 7.2,
            turbidityNtu: 0.9,
            temperatureC: 19.1,
            status: 'low',
            operator: `${operatorName} [DEMO-TEST]`,
            observations: '[DEMO / PRUEBA]: Medición de prueba E2E de campo con déficit crítico de cloro.',
            correctiveAction: 'Sub-cloración crítica detectada. Requiere purga y ajuste de goteo.',
            isDemo: true,
          };
          onAddRecord(recFail);
        }
        break;
      }

      case 1: {
        // Step 3, 4, 5: Evaluación de criterio normativo, generación de estado y ALERTA
        if (!hasAlert) {
          const alertItem: AquaAlertItem = {
            code: DEMO_ALERT_CODE,
            date: today,
            system: DEMO_SYSTEM_NAME,
            point: 'Salida de Reservorio Principal [DEMO / PRUEBA]',
            parameter: 'Cloro Libre Residual [DEMO]',
            result: '0.18 ppm Cl₂',
            criterion: '0.50 – 2.00 mg/L (D.S. N.° 031-2010-SA, Art. 66)',
            level: 'Crítico',
            type: 'Desinfección',
            responsible: `${operatorName} (Supervisor ATM)`,
            requiredAction:
              'Ejecutar recarga inmediata de solución de hipoclorito al 70%, purga de sedimentos y ajuste de válvula de goteo en cámara de carga.',
            status: 'PENDIENTE',
            origin: {
              type: 'monitoreo_cloro',
              referenceId: DEMO_RECORD_FAIL_ID,
              referenceCode: `DPD-DEMO-${today}`,
              detectedAt: `${today} ${nowTime}`,
              details:
                '[DEMO / PRUEBA]: Alerta generada automáticamente por evaluación de criterio normativo D.S. 031.',
            },
            riskId: DEMO_RISK_ID,
            isDemo: true,
          };
          onAddAlert(alertItem);
        }
        break;
      }

      case 2: {
        // Step 6 & 7: Autoridad visualiza y se crea Plan de Acción
        if (!hasPlan) {
          const newPlan: ActionPlanItem = {
            id: DEMO_PLAN_ID,
            alertCode: DEMO_ALERT_CODE,
            systemId: DEMO_SYSTEM_ID,
            systemName: DEMO_SYSTEM_NAME,
            jassName: DEMO_JASS_NAME,
            punto: 'Salida de Reservorio Principal [DEMO / PRUEBA]',
            problema: 'Déficit severo de desinfección: Cloro Libre Residual a 0.18 ppm en salida de reservorio.',
            causaProbable: 'Obstrucción parcial en el tubo dosificador de goteo y agotamiento de solución madre.',
            accion: 'Limpieza de dosificador, preparación de solución madre de hipoclorito al 70% y purga de red troncal.',
            responsable: `${operatorName} (Área Técnica Municipal)`,
            fecha: today,
            fechaLimite: today,
            estado: 'PLAN DE ACCIÓN',
            prioridad: 'Crítica',
            categoria: 'Desinfección',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDemo: true,
          };
          onAddPlan(newPlan);

          // Update alert to EN PROCESO
          const existingAlert = alerts.find((a) => a.code === DEMO_ALERT_CODE);
          if (existingAlert) {
            onUpdateAlert({ ...existingAlert, status: 'EN PROCESO' });
          }
        }
        break;
      }

      case 3: {
        // Step 8: Se registra la acción correctiva e implementación con evidencia
        const existingPlan = actionPlans.find((p) => p.id === DEMO_PLAN_ID);
        if (existingPlan) {
          const updatedPlan: ActionPlanItem = {
            ...existingPlan,
            estado: 'IMPLEMENTACIÓN',
            notasImplementacion:
              '[DEMO / PRUEBA]: Se desobstruyó la aguja de goteo del dosificador tipo Constant Head. Se dosificó solución al 1.5% de cloro activo.',
            fechaImplementacion: today,
            evidencia: {
              descripcion:
                'Acta de intervención técnica y fotografía de cámara de dosificación operativa con caudal de 28 gotas/min.',
              tipoEvidencia: 'boleta_dosificacion',
              archivoNombre: 'acta_intervencion_cloracion_demo.pdf',
              fechaRegistro: today,
              registradoPor: operatorName,
            },
            updatedAt: new Date().toISOString(),
          };
          onUpdatePlan(updatedPlan);
        }
        break;
      }

      case 4: {
        // Step 9 & 10: Nueva medición de verificación en campo (1.15 ppm Cl₂, óptimo)
        if (!hasRecordResolve) {
          const recResolve: SamplingRecord = {
            id: DEMO_RECORD_RESOLVE_ID,
            timestamp: new Date().toISOString(),
            dateStr: today,
            timeStr: nowTime,
            systemId: DEMO_SYSTEM_ID,
            systemName: DEMO_SYSTEM_NAME,
            measurementPoint: 'Primera Vivienda & Red de Distribución [DEMO / PRUEBA]',
            freeChlorinePpm: 1.15,
            ph: 7.35,
            turbidityNtu: 0.65,
            temperatureC: 18.8,
            status: 'compliant',
            operator: `${operatorName} [DEMO-TEST]`,
            observations:
              '[DEMO / PRUEBA]: Medición de verificación post-acción correctiva. Concentración en rango óptimo normativo.',
            correctiveAction: 'Parámetro en rango óptimo según D.S. N.° 031-2010-SA (1.15 ppm Cl₂).',
            isDemo: true,
          };
          onAddRecord(recResolve);
        }

        // Advance plan to VERIFICACIÓN
        const plan = actionPlans.find((p) => p.id === DEMO_PLAN_ID);
        if (plan) {
          onUpdatePlan({
            ...plan,
            estado: 'VERIFICACIÓN',
            verificacion: {
              conforme: true,
              verificadoPor: `${operatorName} (Inspector Sanitario)`,
              fechaVerificacion: today,
              resultadoMedicion: '1.15 ppm Cl₂ Libre (Conforme Art. 66 D.S. 031)',
              notas:
                'Medición in situ confirma restablecimiento de la barrera de desinfección en toda la red comunal.',
            },
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 5: {
        // Step 11: Se cierra la alerta y el plan de acción
        const plan = actionPlans.find((p) => p.id === DEMO_PLAN_ID);
        if (plan) {
          onUpdatePlan({
            ...plan,
            estado: 'CIERRE',
            updatedAt: new Date().toISOString(),
          });
        }
        const existingAlert = alerts.find((a) => a.code === DEMO_ALERT_CODE);
        if (existingAlert) {
          onUpdateAlert({
            ...existingAlert,
            status: 'VERIFICADA',
            actionTaken:
              'Calibración de dosificador y restablecimiento de residual de cloro a 1.15 ppm verificado en campo.',
            actionDate: today,
            actionBy: operatorName,
            verifiedDate: today,
            verifiedBy: `${operatorName} (ATM)`,
            verificationEvidence: 'Medición in situ 1.15 ppm Cl₂ (Conforme D.S. 031)',
          });
        }
        break;
      }

      // -------------------------------------------------------------
      // PARALLEL LABORATORY PIPELINE
      // -------------------------------------------------------------
      case 6: {
        // Step 12: Crear muestra de laboratorio DEMO
        if (!hasLabSample) {
          const newSample: WaterSample = {
            id: DEMO_SAMPLE_ID,
            code: DEMO_SAMPLE_CODE,
            date: today,
            time: nowTime,
            origin: 'Grifo de Escuela Primaria [DEMO / PRUEBA]',
            jassId: systems[0]?.jassId || 'JASS-01',
            jassName: DEMO_JASS_NAME,
            systemId: DEMO_SYSTEM_ID,
            systemName: DEMO_SYSTEM_NAME,
            point: 'Punto Crítico Vulnerable (Red Escolar) [DEMO / PRUEBA]',
            responsible: `${operatorName} (Muestreador Certificado)`,
            observations:
              '[DEMO / PRUEBA]: Muestra para validación integral de inocuidad microbiológica, fisicoquímica y metales.',
            sampleType: 'vigilancia_sanitaria',
            chainOfCustody: {
              toma: {
                completed: true,
                date: today,
                time: nowTime,
                responsible: `${operatorName} (Muestreador Certificado)`,
                locationOrEntity: 'Punto Crítico Vulnerable (Red Escolar)',
                temperatureC: 18.2,
                sealNumber: 'PREC-DEMO-99',
                preservationNotes: 'Frascos estériles con tiosulfato y polietileno acidificado',
              },
              transporte: {
                completed: true,
                date: today,
                time: nowTime,
                responsible: 'Transporte refrigerado DEMO',
                locationOrEntity: 'Ruta Vigilancia',
                temperatureC: 4.5,
                preservationNotes: 'Refrigeración 4°C en hielera con hielo gel',
                sealNumber: 'PREC-DEMO-99',
              },
              recepcion: {
                completed: true,
                date: today,
                time: nowTime,
                responsible: 'Dra. María Elena Quispe (Analista Lab)',
                locationOrEntity: 'Laboratorio de Calidad del Agua',
                temperatureC: 4.5,
                preservationNotes: 'Cadena de frío conservada. Muestra sin turbidez aparente.',
                sealNumber: 'PREC-DEMO-99',
              },
              analisis: {
                completed: false,
                date: today,
                time: nowTime,
                responsible: 'Equipo de Laboratorio DEMO',
              },
              validacion: {
                completed: false,
                date: today,
                time: nowTime,
                responsible: 'Director de Laboratorio DEMO',
              },
            },
            results: [],
            status: 'recibida',
            isDemo: true,
          };
          onAddSample(newSample);
        }
        break;
      }

      case 7: {
        // Step 13: Registrar Microbiología (E. coli: 4 UFC/100 mL - No Cumple)
        const sample = samples.find((s) => s.id === DEMO_SAMPLE_ID);
        if (sample) {
          const microResult = {
            id: 'RES-DEMO-MIC-01',
            parameter: 'Escherichia coli [DEMO]',
            category: 'microbiologico' as const,
            result: '4',
            numericValue: 4,
            unit: 'UFC/100 mL',
            method: 'Filtración por Membrana (SMEWW 9222-G)',
            equipment: 'Incubadora microbiológica 44.5°C',
            analyst: 'Bióloga Carolina Rivas',
            date: today,
            configuredCriteria: '0 UFC/100 mL (D.S. N.° 031-2010-SA, Anexo I)',
            compliance: 'no_cumple' as const,
            complianceNote: 'Presencia bacteriana incompatible con agua apta para consumo humano.',
            healthRisk: 'riesgo_critico' as const,
            healthRiskDescription: 'Riesgo inminente de Enfermedades Diarreicas Agudas (EDA) en población escolar.',
            observations: '[DEMO / PRUEBA]: Colonias azul-verdosas fluorescentes confirmadas.',
          };

          const coliformesResult = {
            id: 'RES-DEMO-MIC-02',
            parameter: 'Coliformes Totales [DEMO]',
            category: 'microbiologico' as const,
            result: '12',
            numericValue: 12,
            unit: 'UFC/100 mL',
            method: 'Filtración por Membrana (SMEWW 9222-B)',
            equipment: 'Incubadora microbiológica 35°C',
            analyst: 'Bióloga Carolina Rivas',
            date: today,
            configuredCriteria: '0 UFC/100 mL (D.S. N.° 031-2010-SA, Anexo I)',
            compliance: 'no_cumple' as const,
            healthRisk: 'riesgo_alto' as const,
            healthRiskDescription: 'Evidencia de vulnerabilidad en la red o falta de residual desinfectante.',
            observations: '[DEMO / PRUEBA]: Colonias atípicas confirmadas.',
          };

          const existingOthers = sample.results.filter((r) => r.category !== 'microbiologico');
          onUpdateSample({
            ...sample,
            status: 'en_analisis',
            results: [...existingOthers, microResult, coliformesResult],
          });
        }
        break;
      }

      case 8: {
        // Step 14: Registrar Fisicoquímica (pH 7.15, Turbidez 1.20 UNT, Cloro 0.18 ppm)
        const sample = samples.find((s) => s.id === DEMO_SAMPLE_ID);
        if (sample) {
          const fqResults = [
            {
              id: 'RES-DEMO-FQ-01',
              parameter: 'Potencial de Hidrógeno (pH) [DEMO]',
              category: 'fisicoquimico' as const,
              result: '7.15',
              numericValue: 7.15,
              unit: 'Unidades de pH',
              method: 'Potenciometría directa (SMEWW 4500-H+ B)',
              equipment: 'Multiparámetro digital calibrado con buffers 4.01 y 7.00',
              analyst: 'Ing. Químico Roberto Campos',
              date: today,
              configuredCriteria: '6.50 – 8.50 (D.S. N.° 031-2010-SA)',
              compliance: 'cumple' as const,
              healthRisk: 'sin_riesgo' as const,
              healthRiskDescription: 'pH dentro del rango óptimo para desinfección con cloro.',
              observations: '[DEMO / PRUEBA]: Medición conforme.',
            },
            {
              id: 'RES-DEMO-FQ-02',
              parameter: 'Turbidez [DEMO]',
              category: 'fisicoquimico' as const,
              result: '1.20',
              numericValue: 1.20,
              unit: 'UNT',
              method: 'Nefelometría (SMEWW 2130-B)',
              equipment: 'Turbidímetro de sobremesa',
              analyst: 'Ing. Químico Roberto Campos',
              date: today,
              configuredCriteria: '≤ 5.0 UNT (D.S. N.° 031-2010-SA)',
              compliance: 'cumple' as const,
              healthRisk: 'sin_riesgo' as const,
              healthRiskDescription: 'Claridad aceptable para la acción bactericida del cloro.',
              observations: '[DEMO / PRUEBA]: Turbidez dentro de norma.',
            },
            {
              id: 'RES-DEMO-FQ-03',
              parameter: 'Cloro Libre Residual [DEMO Lab]',
              category: 'fisicoquimico' as const,
              result: '0.18',
              numericValue: 0.18,
              unit: 'mg/L Cl₂',
              method: 'Colorimetría DPD Fotométrica (SMEWW 4500-Cl G)',
              equipment: 'Fotómetro Digital Palintest 7100',
              analyst: 'Ing. Químico Roberto Campos',
              date: today,
              configuredCriteria: '0.50 – 2.00 mg/L (D.S. N.° 031-2010-SA)',
              compliance: 'no_cumple' as const,
              healthRisk: 'riesgo_alto' as const,
              healthRiskDescription: 'Déficit de desinfectante en red escolar.',
              observations: '[DEMO / PRUEBA]: Concentración sub-óptima detectada en laboratorio.',
            },
          ];

          const existingOthers = sample.results.filter((r) => r.category !== 'fisicoquimico');
          onUpdateSample({
            ...sample,
            results: [...existingOthers, ...fqResults],
          });
        }
        break;
      }

      case 9: {
        // Step 15: Registrar Metales Pesados (Arsénico: 0.018 mg/L - Excede LMP 0.010 mg/L)
        const sample = samples.find((s) => s.id === DEMO_SAMPLE_ID);
        if (sample) {
          const metalsResults = [
            {
              id: 'RES-DEMO-MET-01',
              parameter: 'Arsénico Total (As) [DEMO]',
              category: 'inorganico_metales' as const,
              result: '0.018',
              numericValue: 0.018,
              unit: 'mg/L',
              method: 'Espectrometría de Masas ICP-MS (EPA 200.8)',
              equipment: 'Espectrómetro Agilent 7900 ICP-MS',
              analyst: 'Dr. Alejandro Mendoza (Toxicólogo)',
              date: today,
              configuredCriteria: '0.010 mg/L (D.S. N.° 031-2010-SA, Anexo II)',
              compliance: 'no_cumple' as const,
              complianceNote: 'Concentración de Arsénico excede en 80% el Límite Máximo Permisible.',
              healthRisk: 'riesgo_critico' as const,
              healthRiskDescription:
                'Bioacumulación crónica; riesgo de hidroarsenicismo crónico regional endémico (HACRE).',
              observations:
                '[DEMO / PRUEBA]: Análisis por duplicado con recuperación de patrón del 98.4%.',
            },
            {
              id: 'RES-DEMO-MET-02',
              parameter: 'Plomo Total (Pb) [DEMO]',
              category: 'inorganico_metales' as const,
              result: '0.004',
              numericValue: 0.004,
              unit: 'mg/L',
              method: 'Espectrometría ICP-MS (EPA 200.8)',
              equipment: 'Espectrómetro Agilent 7900 ICP-MS',
              analyst: 'Dr. Alejandro Mendoza (Toxicólogo)',
              date: today,
              configuredCriteria: '0.010 mg/L (D.S. N.° 031-2010-SA)',
              compliance: 'cumple' as const,
              healthRisk: 'sin_riesgo' as const,
              healthRiskDescription: 'Por debajo del LMP normativo.',
              observations: '[DEMO / PRUEBA]: Concentración conforme.',
            },
          ];

          const existingOthers = sample.results.filter((r) => r.category !== 'inorganico_metales');
          onUpdateSample({
            ...sample,
            results: [...existingOthers, ...metalsResults],
          });
        }
        break;
      }

      case 10: {
        // Step 16: Validar resultados con firma y sello de integridad
        const sample = samples.find((s) => s.id === DEMO_SAMPLE_ID);
        if (sample) {
          onUpdateSample({
            ...sample,
            status: 'validada',
            validatedBy: `${operatorName} (Director de Calidad Analítica)`,
            validatorRole: 'Especialista en Vigilancia Sanitaria del Agua',
            validatedAt: new Date().toISOString(),
            reportNumber: 'CERT-DEMO-2026-99',
            reportIssuedAt: today,
            reportRecipient: 'Junta Directiva JASS & Área Técnica Municipal (ATM)',
            validationRemarks:
              '[DEMO / PRUEBA]: Ensayo validado bajo controles de calidad analítica. No conforme por E. coli y Arsénico.',
          });
        }
        break;
      }

      case 11: {
        // Step 17: Actualizar Matriz de Riesgos (AQUA-RISK)
        if (!hasDemoRisk) {
          const demoRisk: AquaRiskItem = {
            id: DEMO_RISK_ID,
            danger: 'Presencia simultánea de E. coli (4 UFC) y Arsénico (0.018 mg/L) en red escolar [DEMO / PRUEBA]',
            source: `${DEMO_JASS_NAME} • Punto Crítico Red Escolar`,
            probability: 'Alta',
            consequence: 'Catastrófica',
            riskLevel: 'Crítico',
            controlMeasure:
              'Suministro provisional de agua segura con bidones, cloración de choque a 5 ppm y estudio hidrogeológico para adsorción de arsénico.',
            responsible: 'Área Técnica Municipal (ATM) y Red de Salud',
            date: today,
            status: 'En Tratamiento',
            originType: 'laboratorio',
            originReference: DEMO_SAMPLE_CODE,
            associatedAlertCode: DEMO_ALERT_CODE,
            isDemo: true,
          };
          onAddRisk(demoRisk);
        }
        break;
      }

      case 12: {
        // Step 18 & 19: Actualizar Dashboard Territorial y Mapa Cartográfico
        // All views receive the live updated records, samples, risks and alerts!
        break;
      }

      default:
        break;
    }
  };

  // Run full automated sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunningAuto && currentStepIndex < 12) {
      timer = setTimeout(() => {
        executeStep(currentStepIndex);
        setCurrentStepIndex((prev) => prev + 1);
      }, 700);
    } else if (isRunningAuto && currentStepIndex >= 12) {
      setIsRunningAuto(false);
    }
    return () => clearTimeout(timer);
  }, [isRunningAuto, currentStepIndex]);

  const handleRunFullDemo = () => {
    setCurrentStepIndex(0);
    setIsRunningAuto(true);
  };

  const handleStepForward = () => {
    if (currentStepIndex <= 12) {
      executeStep(currentStepIndex);
      setCurrentStepIndex((prev) => Math.min(prev + 1, 12));
    }
  };

  const handleResetToStep0 = () => {
    setIsRunningAuto(false);
    setCurrentStepIndex(0);
  };

  // Simulation Steps Definition
  const stepsList: SimulationStep[] = [
    {
      stepNumber: 1,
      phase: 'JASS & CLORACIÓN',
      title: '1. Registro de Control de Cloro en Campo (JASS)',
      description: 'El operador de la JASS realiza la medición colorimétrica con reactivo DPD en el reservorio.',
      targetModule: 'jass',
      status: hasRecordFail ? 'completed' : currentStepIndex === 0 ? 'active' : 'pending',
      badge: '0.18 ppm Cl₂',
      details: [
        { label: 'Sistema', value: DEMO_SYSTEM_NAME },
        { label: 'Punto de Muestreo', value: 'Salida de Reservorio Principal [DEMO]' },
        { label: 'Valor Obtenido', value: '0.18 ppm Cl₂ Libre', warning: true },
        { label: 'Operador', value: operatorName },
      ],
    },
    {
      stepNumber: 2,
      phase: 'JASS & CLORACIÓN',
      title: '2. Registro del Resultado y Evaluación de Criterio Normativo',
      description: 'El sistema contrasta el valor con el Art. 66 del D.S. N.° 031-2010-SA (Rango: 0.50 – 2.00 ppm).',
      targetModule: 'jass',
      status: hasRecordFail ? 'completed' : currentStepIndex === 1 ? 'active' : 'pending',
      badge: 'Evaluación Normativa',
      details: [
        { label: 'Criterio Normativo', value: '0.50 – 2.00 mg/L (D.S. 031-2010-SA)' },
        { label: 'Evaluación Automática', value: 'NO CUMPLE (0.18 < 0.50 ppm)', warning: true },
        { label: 'Estado del Sistema', value: 'Sub-cloración Crítica / Desprotegido', warning: true },
      ],
    },
    {
      stepNumber: 3,
      phase: 'ALERTA & ACCIÓN',
      title: '3. Generación y Visualización de Alerta Sanitaria (AQUA-ALERT)',
      description: 'El motor analítico dispara automáticamente la alerta sanitaria para la autoridad municipal y de salud.',
      targetModule: 'alert',
      status: hasAlert ? 'completed' : currentStepIndex === 2 ? 'active' : 'pending',
      badge: 'Alerta Crítica',
      details: [
        { label: 'Código de Alerta', value: DEMO_ALERT_CODE, highlight: true },
        { label: 'Nivel / Tipo', value: 'Crítico • Desinfección', warning: true },
        { label: 'Estado Inicial', value: 'PENDIENTE', warning: true },
        { label: 'Autoridad Notificada', value: 'Área Técnica Municipal (ATM) y DIGESA' },
      ],
    },
    {
      stepNumber: 4,
      phase: 'ALERTA & ACCIÓN',
      title: '4. Creación del Plan de Acción y Trazabilidad (FASE 8)',
      description: 'La autoridad convierte la alerta en un Plan de Acción con causa raíz y responsables designados.',
      targetModule: 'planes',
      status: hasPlan ? 'completed' : currentStepIndex === 3 ? 'active' : 'pending',
      badge: 'Plan de Acción',
      details: [
        { label: 'Código de Plan', value: DEMO_PLAN_ID, highlight: true },
        { label: 'Problema', value: 'Déficit severo de desinfección a 0.18 ppm' },
        { label: 'Causa Probable', value: 'Obstrucción en dosificador y agotamiento de solución' },
        { label: 'Etapa del Flujo', value: 'PLAN DE ACCIÓN' },
      ],
    },
    {
      stepNumber: 5,
      phase: 'ALERTA & ACCIÓN',
      title: '5. Registro de la Acción Correctiva e Implementación con Evidencia',
      description: 'El operador limpia el dosificador de goteo, prepara nueva solución madre y registra el acta.',
      targetModule: 'planes',
      status: planIsClosed || actionPlans.some((p) => p.id === DEMO_PLAN_ID && p.estado !== 'PLAN DE ACCIÓN')
        ? 'completed'
        : currentStepIndex === 4
        ? 'active'
        : 'pending',
      badge: 'Implementación',
      details: [
        { label: 'Acción Ejecutada', value: 'Desobstrucción de aguja y recarga de hipoclorito al 70%' },
        { label: 'Evidencia Adjunta', value: 'Acta técnica y boleta de dosificación' },
        { label: 'Nueva Etapa', value: 'IMPLEMENTACIÓN / EVIDENCIA' },
      ],
    },
    {
      stepNumber: 6,
      phase: 'CIERRE & VERIFICACIÓN',
      title: '6. Nueva Medición en Campo y Verificación Sanitaria',
      description: 'Se toma nueva lectura in situ en la red de distribución para verificar la restitución de la barrera bactericida.',
      targetModule: 'jass',
      status: hasRecordResolve ? 'completed' : currentStepIndex === 5 ? 'active' : 'pending',
      badge: '1.15 ppm Cl₂ (Óptimo)',
      details: [
        { label: 'ID Nuevo Registro', value: DEMO_RECORD_RESOLVE_ID, highlight: true },
        { label: 'Resultado de Verificación', value: '1.15 ppm Cl₂ Libre (ÓPTIMO)', highlight: true },
        { label: 'Criterio Normativo', value: 'Cumple Art. 66 D.S. N.° 031-2010-SA' },
        { label: 'Estado de Conformidad', value: 'CONFORME (Protección Restaurada)' },
      ],
    },
    {
      stepNumber: 7,
      phase: 'CIERRE & VERIFICACIÓN',
      title: '7. Cierre Oficial de la Alerta y Plan de Acción Auditado',
      description: 'Con la evidencia y medición conforme, la autoridad aprueba el cierre definitivo de la alerta.',
      targetModule: 'alert',
      status: alertIsResolved && planIsClosed ? 'completed' : currentStepIndex === 6 ? 'active' : 'pending',
      badge: 'Alerta Cerrada',
      details: [
        { label: 'Estado Final Alerta', value: 'RESUELTA / VERIFICADA', highlight: true },
        { label: 'Estado Final Plan', value: 'CIERRE AUDITADO', highlight: true },
        { label: 'Verificado Por', value: `${operatorName} (ATM)` },
      ],
    },
    {
      stepNumber: 8,
      phase: 'LABORATORIO & RIESGO',
      title: '8. Creación de Muestra de Laboratorio Digital (AQUA-LAB)',
      description: 'Muestra formal con cadena de custodia para descarte toxicológico e inocuidad microbiológica.',
      targetModule: 'lab',
      status: hasLabSample ? 'completed' : currentStepIndex === 7 ? 'active' : 'pending',
      badge: 'Muestra Lab',
      details: [
        { label: 'Código de Muestra', value: DEMO_SAMPLE_CODE, highlight: true },
        { label: 'Punto de Muestreo', value: 'Grifo de Escuela Primaria [DEMO]' },
        { label: 'Cadena de Custodia', value: 'Refrigerada a 4.5°C con tiosulfato' },
      ],
    },
    {
      stepNumber: 9,
      phase: 'LABORATORIO & RIESGO',
      title: '9. Ensayos Microbiológicos: E. coli y Coliformes Totales',
      description: 'Detección por filtración por membrana según métodos estandarizados SMEWW.',
      targetModule: 'lab',
      status: sampleHasMicro ? 'completed' : currentStepIndex === 8 ? 'active' : 'pending',
      badge: 'E. coli: 4 UFC',
      details: [
        { label: 'Escherichia coli', value: '4 UFC/100 mL (LMP: 0 UFC/100 mL)', warning: true },
        { label: 'Coliformes Totales', value: '12 UFC/100 mL (LMP: 0 UFC/100 mL)', warning: true },
        { label: 'Diagnóstico Sanitario', value: 'Contaminación Fecal Activa en Red Escolar', warning: true },
      ],
    },
    {
      stepNumber: 10,
      phase: 'LABORATORIO & RIESGO',
      title: '10. Ensayos Fisicoquímicos y Metales Pesados (ICP-MS)',
      description: 'Medición de pH, Turbidez y espectrometría de masas para metales pesados toxicológicos.',
      targetModule: 'metals',
      status: sampleHasMetales && sampleHasFisico ? 'completed' : currentStepIndex === 9 ? 'active' : 'pending',
      badge: 'Arsénico: 0.018 mg/L',
      details: [
        { label: 'Arsénico Total (As)', value: '0.018 mg/L (LMP: 0.010 mg/L • +80%)', warning: true },
        { label: 'Plomo Total (Pb)', value: '0.004 mg/L (LMP: 0.010 mg/L • Conforme)' },
        { label: 'pH / Turbidez', value: 'pH 7.15 • Turbidez 1.20 UNT (Conformes)' },
      ],
    },
    {
      stepNumber: 11,
      phase: 'LABORATORIO & RIESGO',
      title: '11. Validación Oficial y Actualización de Matriz de Riesgos (AQUA-RISK)',
      description: 'Firma electrónica del informe de ensayo y actualización del Índice de Exposición al Riesgo (IER).',
      targetModule: 'risk',
      status: sampleIsValidated && hasDemoRisk ? 'completed' : currentStepIndex === 10 ? 'active' : 'pending',
      badge: 'Riesgo Crítico IER',
      details: [
        { label: 'Estado Muestra', value: 'VALIDADA CON SELLO DIGITAL', highlight: true },
        { label: 'Certificado', value: 'CERT-DEMO-2026-99', highlight: true },
        { label: 'Riesgo Sanitario (AQUA-RISK)', value: 'Nivel Crítico (Arsénico + E. coli)', warning: true },
        { label: 'Medida de Control', value: 'Suministro alterno seguro y adsorción de metales' },
      ],
    },
    {
      stepNumber: 12,
      phase: 'DASHBOARD & MAPA',
      title: '12. Sincronización Integral: Dashboard Territorial y Mapa GIS',
      description: 'Los indicadores del Dashboard y los puntos cartográficos de AQUA-TERRITORIO se actualizan en vivo.',
      targetModule: 'territorio',
      status: currentStepIndex >= 11 ? 'completed' : 'pending',
      badge: 'Mapa GIS & Dashboard',
      details: [
        { label: 'Dashboard Territorial', value: 'Métricas recalculadas en tiempo real' },
        { label: 'AQUA-TERRITORIO', value: 'Marcador en mapa con semáforo y detalle analítico' },
        { label: 'AQUA-DATA', value: 'Curvas de tendencias históricas sincronizadas' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Simulación E2E de Flujo Completo DEMO"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-5xl bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-700 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-hud font-bold tracking-tight">
                  Simulación E2E: Flujo Integral de Prueba [DEMO]
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Datos de Prueba
                </span>
              </div>
              <p className="text-xs text-slate-300">
                JASS Cloración → Criterio D.S. 031 → Alerta → Plan → Medición → Cierre ⟷ Laboratorio &amp; Territorio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Top Controls Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Subtabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('stepper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'stepper'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Secuencia E2E (12 Pasos)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'audit'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Datos Activos DEMO ({totalDemoItems})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('cleanup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'cleanup'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              Limpieza / Purga DEMO
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunFullDemo}
              disabled={isRunningAuto}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isRunningAuto ? 'sync' : 'play_arrow'}
              </span>
              <span>{isRunningAuto ? 'Ejecutando...' : 'Ejecutar Flujo Completo'}</span>
            </button>

            <button
              type="button"
              onClick={handleStepForward}
              disabled={isRunningAuto || currentStepIndex >= 12}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-semibold text-xs transition-all cursor-pointer disabled:opacity-40"
            >
              <span>Paso Siguiente</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={handleResetToStep0}
              className="p-1.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
              title="Reiniciar índice de simulación"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeSubTab === 'stepper' && (
            <div className="space-y-4">
              {/* Progress Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {stepsList.filter((s) => s.status === 'completed').length}/12
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Progreso de la Prueba E2E
                    </h3>
                    <p className="text-xs text-slate-600">
                      {stepsList.filter((s) => s.status === 'completed').length === 12
                        ? '✓ Simulación completada al 100%. Todos los módulos sincronizados y conectados.'
                        : `Paso actual: ${stepsList[currentStepIndex]?.title || 'Finalizado'}`}
                    </p>
                  </div>
                </div>

                {totalDemoItems > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      {totalDemoItems} registros DEMO en memoria
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onPurgeAllDemoData();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                      title="Eliminar todos los datos de prueba"
                    >
                      Limpiar
                    </button>
                  </div>
                )}
              </div>

              {/* Steps Accordion / List */}
              <div className="space-y-3">
                {stepsList.map((step, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isDone = step.status === 'completed';

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-white border-emerald-300 shadow-2xs'
                          : isCurrent
                          ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start sm:items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                ? 'bg-indigo-600 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? '✓' : step.stepNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                                {step.phase}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  isDone
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isCurrent
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {step.badge}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                              {step.title}
                            </h4>
                          </div>
                        </div>

                        {/* Navigation button to jump to that module */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateTab(step.targetModule);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            title={`Ir a la pestaña ${step.targetModule.toUpperCase()}`}
                          >
                            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                            <span>Ver en {step.targetModule.toUpperCase()}</span>
                          </button>

                          {!isDone && (
                            <button
                              type="button"
                              onClick={() => {
                                executeStep(idx);
                                setCurrentStepIndex(idx + 1);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                            >
                              Ejecutar
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 pl-9">
                        {step.description}
                      </p>

                      {/* Details pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3 pl-9">
                        {step.details.map((dt, dIdx) => (
                          <div
                            key={dIdx}
                            className={`p-2 rounded-lg border text-xs ${
                              dt.warning
                                ? 'bg-rose-50 border-rose-200 text-rose-900 font-medium'
                                : dt.highlight
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-100/80 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="block text-[10px] text-slate-500 uppercase tracking-tight">
                              {dt.label}
                            </span>
                            <span className="block font-sans break-words">{dt.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSubTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  Inventario de Entidades DEMO Generadas
                </h3>
                <p className="text-xs text-slate-600">
                  Todas las entidades de prueba están estrictamente etiquetadas con la bandera{' '}
                  <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[11px]">
                    isDemo: true
                  </code>{' '}
                  y el prefijo <span className="font-bold text-amber-800">[DEMO / PRUEBA]</span> para aislar los datos operativos reales.
                </p>
              </div>

              {/* Records table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
                  <span>Registros de Monitoreo Cloro (AQUA-JASS)</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[11px]">
                    {records.filter((r) => r.isDemo).length} items
                  </span>
                </div>
                <div className="p-3 overflow-x-auto">
                  {records.filter((r) => r.isDemo).length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No hay registros de cloro DEMO activos.</p>
                  ) : (
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-1.5 px-2">ID</th>
                          <th className="py-1.5 px-2">Punto</th>
                          <th className="py-1.5 px-2">Cloro Libre</th>
                          <th className="py-1.5 px-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records
                          .filter((r) => r.isDemo)
                          .map((r) => (
                            <tr key={r.id} className="border-b border-slate-100">
                              <td className="py-1.5 px-2 font-mono font-bold text-indigo-700">{r.id}</td>
                              <td className="py-1.5 px-2">{r.measurementPoint}</td>
                              <td className="py-1.5 px-2 font-bold">
                                <span
                                  className={
                                    r.freeChlorinePpm < 0.5
                                      ? 'text-rose-600'
                                      : 'text-emerald-600'
                                  }
                                >
                                  {r.freeChlorinePpm.toFixed(2)} ppm
                                </span>
                              </td>
                              <td className="py-1.5 px-2 uppercase font-semibold text-[11px]">{r.status}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Alerts & Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
                    <span>Alertas Sanitarias (AQUA-ALERT)</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[11px]">
                      {alerts.filter((a) => a.isDemo).length} items
                    </span>
                  </div>
                  <div className="p-3 text-xs space-y-2">
                    {alerts.filter((a) => a.isDemo).length === 0 ? (
                      <p className="text-slate-400 italic">Sin alertas DEMO activas.</p>
                    ) : (
                      alerts
                        .filter((a) => a.isDemo)
                        .map((a) => (
                          <div key={a.code} className="p-2 rounded bg-slate-50 border border-slate-200">
                            <div className="flex justify-between font-mono font-bold text-slate-800">
                              <span>{a.code}</span>
                              <span className="text-amber-700">{a.status}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">{a.requiredAction}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
                    <span>Planes de Acción (FASE 8)</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[11px]">
                      {actionPlans.filter((p) => p.isDemo).length} items
                    </span>
                  </div>
                  <div className="p-3 text-xs space-y-2">
                    {actionPlans.filter((p) => p.isDemo).length === 0 ? (
                      <p className="text-slate-400 italic">Sin planes de acción DEMO activos.</p>
                    ) : (
                      actionPlans
                        .filter((p) => p.isDemo)
                        .map((p) => (
                          <div key={p.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                            <div className="flex justify-between font-mono font-bold text-slate-800">
                              <span>{p.id}</span>
                              <span className="text-indigo-700 font-bold">{p.estado}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">{p.accion}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Lab Samples */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-700 flex justify-between items-center">
                  <span>Muestras de Laboratorio (AQUA-LAB / METALS)</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[11px]">
                    {samples.filter((s) => s.isDemo).length} items
                  </span>
                </div>
                <div className="p-3 text-xs space-y-2">
                  {samples.filter((s) => s.isDemo).length === 0 ? (
                    <p className="text-slate-400 italic">Sin muestras de laboratorio DEMO activas.</p>
                  ) : (
                    samples
                      .filter((s) => s.isDemo)
                      .map((s) => (
                        <div key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-blue-800">{s.code}</span>
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                              {s.status}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{s.point}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.results.map((res) => (
                              <span
                                key={res.id}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                  res.compliance === 'no_cumple'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}
                              >
                                {res.parameter}: {res.result} {res.unit}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'cleanup' && (
            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">delete_sweep</span>
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-rose-950">
                  Separar y Eliminar Todos los Datos de Prueba (DEMO)
                </h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Esta acción purga de inmediato todas las mediciones de campo, muestras de laboratorio, alertas, riesgos y planes de acción que contengan la etiqueta{' '}
                  <strong>[DEMO / PRUEBA]</strong>. Los datos reales permanecerán 100% intactos.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-rose-200 max-w-xs mx-auto text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Registros de Cloro DEMO:</span>
                  <span className="font-bold">{records.filter((r) => r.isDemo).length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Alertas DEMO:</span>
                  <span className="font-bold">{alerts.filter((a) => a.isDemo).length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Planes de Acción DEMO:</span>
                  <span className="font-bold">{actionPlans.filter((p) => p.isDemo).length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Muestras de Lab DEMO:</span>
                  <span className="font-bold">{samples.filter((s) => s.isDemo).length}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-rose-900">
                  <span>Total a eliminar:</span>
                  <span>{totalDemoItems}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    onPurgeAllDemoData();
                    setActiveSubTab('stepper');
                    setCurrentStepIndex(0);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Confirmar Eliminación de Datos DEMO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-indigo-600">verified</span>
            <span>Normativa auditada: D.S. N.° 031-2010-SA • DIGESA / MINSA</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
          >
            Cerrar Modal
          </button>
        </div>
      </div>
    </div>
  );
};

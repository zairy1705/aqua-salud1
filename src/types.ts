export type { TabType } from './components/FloatingNavbar';

export type WaterSystemType =
  | 'reservorio_apoyado'
  | 'reservorio_elevado'
  | 'cisterna'
  | 'red_distribucion'
  | 'pozo_subterraneo'
  | 'otro';

export type TankGeometry =
  | 'rectangular'
  | 'cylindrical_vert'
  | 'cylindrical_horiz'
  | 'direct_volume';

export interface WaterSystem {
  id: string;
  name: string;
  type: WaterSystemType;
  capacityLiters: number;
  currentLevelPercent: number;
  location: string;
  operator: string;
  lastInspectionDate: string;
  lastChlorinePpm: number;
  // Geometría y dimensiones para cálculo volumétrico y dosificación de cloro
  geometry?: TankGeometry;
  length?: number; // metros (largo para rectangular)
  width?: number; // metros (ancho para rectangular)
  height?: number; // metros (altura total)
  waterDepth?: number; // metros (tirante o nivel de agua)
  diameter?: number; // metros (diámetro para cilíndrico)
}

export type ProductForm = 'solid' | 'liquid' | 'tablet' | 'gas';

export interface ChlorineProduct {
  id: string;
  name: string;
  form: ProductForm;
  activeChlorinePercent: number;
  defaultUnit: 'g' | 'kg' | 'mL' | 'L';
  description: string;
  standardPackaging: string;
  safetyRating: string;
}

export type SamplingStatus = 'compliant' | 'low' | 'excess';

export interface SamplingRecord {
  id: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  systemId: string;
  systemName: string;
  measurementPoint: string;
  freeChlorinePpm: number;
  ph: number;
  turbidityNtu: number;
  temperatureC: number;
  status: SamplingStatus;
  operator: string;
  observations: string;
  correctiveAction?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
  isDemo?: boolean;
}

export interface DosageCalculationParams {
  geometry: TankGeometry;
  // Dimensions in meters
  length?: number;
  width?: number;
  height?: number;
  waterDepth?: number;
  diameter?: number;
  // Or direct volume
  directVolumeLiters?: number;
  
  // Product info
  productId: string;
  customActivePercent?: number;

  // Water parameters
  currentChlorinePpm: number;
  targetChlorinePpm: number;
  chlorineDemandPpm: number;
  isShockDisinfection?: boolean;
}

export interface DosageCalculationResult {
  waterVolumeLiters: number;
  waterVolumeM3: number;
  effectiveChlorineNeedPpm: number;
  pureChlorineGrams: number;
  commercialDoseAmount: number;
  commercialDoseUnit: 'g' | 'kg' | 'mL' | 'L';
  productName: string;
  concentrationPercent: number;
  contactTimeMinutes: number;
  recommendedDilutionWaterLiters: number;
  safetyAdvice: string[];
  normativeReference: string;
}

export type UserRoleTier = 'ADMIN' | 'SUPERVISOR' | 'OPERADOR' | 'AUDITOR';

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  roleTier: UserRoleTier;
  badge: string;
  guardianTitle: string;
  email: string;
  community: string;
  passwordHash?: string;
  avatarLetter?: string;
  permissions?: string[];
}

// -------------------------------------------------------------
// AQUA-SALUD & AQUA-JASS Ecosystem Types (Phase 1)
// -------------------------------------------------------------

export type PublicNavSection =
  | 'inicio'
  | 'nosotros'
  | 'ecosistema'
  | 'servicios'
  | 'soluciones'
  | 'diagnostico'
  | 'sectores'
  | 'recursos'
  | 'contacto';

export type AppViewMode = 'portal_publico' | 'plataforma_jass';

export type JassRiskLevel = 'adequate' | 'surveillance' | 'high_risk' | 'critical';

export interface JassWaterSystem extends WaterSystem {
  jassName: string;
  communityCenter: string;
  district: string;
  province: string;
  department: string;
  populationServed: number;
  riskStatus: JassRiskLevel;
  pendingControlsCount: number;
  totalControlsCount: number;
  activeAlertsCount: number;
  trend: 'stable' | 'improving' | 'declining';
  syncStatus?: 'synced' | 'pending';
}

export interface JassChlorineRecord {
  id: string;
  systemId: string;
  systemName: string;
  jassName: string;
  point: string;
  dateStr: string;
  timeStr: string;
  timestamp: string;
  freeChlorinePpm: number;
  turbidityNtu?: number;
  observations: string;
  photoDataUrl?: string;
  riskStatus: JassRiskLevel;
  evalDescription: string;
  safeAction: string;
  operator: string;
  isOfflineDraft?: boolean;
}

// -------------------------------------------------------------
// AQUA-LAB: Gestión Digital del Laboratorio de Agua (Fase 3)
// -------------------------------------------------------------

export type SampleStatus =
  | 'recibida'
  | 'en_analisis'
  | 'pendiente_validacion'
  | 'validada'
  | 'informe_emitido';

export type LabParameterCategory =
  | 'fisicoquimico'
  | 'microbiologico'
  | 'inorganico_metales';

export interface ChainOfCustodyStage {
  completed: boolean;
  date: string;
  time: string;
  responsible: string;
  locationOrEntity?: string;
  temperatureC?: number;
  preservationNotes?: string;
  sealNumber?: string;
  signatureOrAuthCode?: string;
  observations?: string;
}

export interface SampleChainOfCustody {
  toma: ChainOfCustodyStage;
  transporte: ChainOfCustodyStage;
  recepcion: ChainOfCustodyStage;
  analisis: ChainOfCustodyStage;
  validacion: ChainOfCustodyStage;
}

export type HealthRiskLevel =
  | 'sin_riesgo'
  | 'riesgo_bajo'
  | 'riesgo_medio'
  | 'riesgo_alto'
  | 'riesgo_critico';

export type ComplianceStatus = 'cumple' | 'no_cumple' | 'referencial' | 'sin_norma';

export interface MetalParameterDefinition {
  id: string;
  name: string;
  symbol: string;
  category: 'inorganico_metales';
  defaultUnit: string;
  defaultMethod: string;
  defaultEquipment: string;
  hasConfiguredNorm: boolean;
  normativeLimit?: string;
  normativeArticle?: string;
  maxVal?: number;
  minVal?: number;
  isCustom?: boolean;
  healthRiskNormal: string;
  healthRiskAlert: string;
  alertSeverity: HealthRiskLevel;
  toxicologyInfo?: {
    organTarget: string;
    iarcClassification?: string;
    chronicEffects: string;
    mitigationProtocol: string;
  };
}

export type MetalAlertType = 'critica' | 'preventiva' | 'organoleptica';

export interface MetalAlert {
  id: string;
  sampleId: string;
  sampleCode: string;
  systemId: string;
  systemName: string;
  jassName: string;
  point: string;
  parameterId: string;
  parameterName: string;
  symbol: string;
  resultValue: number;
  unit: string;
  limitValue?: number;
  limitText: string;
  alertType: MetalAlertType;
  date: string;
  healthRisk: HealthRiskLevel;
  description: string;
  suggestedAction: string;
  resolved?: boolean;
}

export interface LabResultEntry {
  id: string;
  parameter: string;
  category: LabParameterCategory;
  // 1. RESULTADO ANALÍTICO
  result: string;
  numericValue?: number;
  unit: string;
  method: string;
  equipment: string;
  analyst: string;
  date: string;
  // CRITERIO CONFIGURADO (Normativa D.S. N.° 031-2010-SA)
  configuredCriteria: string;
  // 2. CUMPLIMIENTO
  compliance: ComplianceStatus;
  complianceNote?: string;
  // 3. RIESGO SANITARIO
  healthRisk: HealthRiskLevel;
  healthRiskDescription: string;
  // Observaciones
  observations: string;
  // Backward compatibility helpers
  compliant?: boolean | null;
  normativeLimit?: string;
}

export interface WaterSample {
  id: string;
  code: string;
  date: string;
  time: string;
  origin: string;
  jassId: string;
  jassName: string;
  systemId: string;
  systemName: string;
  point: string;
  responsible: string;
  observations: string;
  sampleType?: 'rutina' | 'vigilancia_sanitaria' | 'control_calidad' | 'emergencia';
  chainOfCustody: SampleChainOfCustody;
  results: LabResultEntry[];
  status: SampleStatus;
  validatedBy?: string;
  validatorRole?: string;
  validatedAt?: string;
  validationRemarks?: string;
  reportNumber?: string;
  reportIssuedAt?: string;
  reportRecipient?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
  isDemo?: boolean;
}

// -------------------------------------------------------------
// FASE 6: AQUA-RISK & AQUA-ALERT Types
// -------------------------------------------------------------

export type AquaRiskLevel = 'Bajo' | 'Moderado' | 'Alto' | 'Crítico';

export type AquaRiskProbability = 'Baja' | 'Media' | 'Alta';

export type AquaRiskConsequence =
  | 'Insignificante'
  | 'Menor'
  | 'Moderada'
  | 'Mayor'
  | 'Catastrófica';

export type AquaRiskStatus = 'Identificado' | 'En Tratamiento' | 'Controlado' | 'Cerrado';

export interface AquaRiskItem {
  id: string;
  danger: string; // Peligro
  source: string; // Fuente
  probability: AquaRiskProbability; // Probabilidad
  consequence: AquaRiskConsequence; // Consecuencia
  riskLevel: AquaRiskLevel; // Nivel de riesgo
  controlMeasure: string; // Medida de control
  responsible: string; // Responsable
  date: string; // Fecha
  status: AquaRiskStatus; // Estado
  // Provenance and connection
  originType?: 'laboratorio' | 'cloro_campo' | 'sistema_operativo' | 'jass' | 'territorial' | 'auditoria_campo';
  originReference?: string;
  associatedAlertCode?: string;
  isDemo?: boolean;
}

export type AquaAlertType =
  | 'Microbiológica'
  | 'Química'
  | 'Desinfección'
  | 'Operativa'
  | 'JASS'
  | 'Territorial';

export type AquaAlertLevel = 'Bajo' | 'Moderado' | 'Alto' | 'Crítico';

export type AquaAlertStatus = 'PENDIENTE' | 'EN PROCESO' | 'RESUELTA' | 'VERIFICADA';

export interface AquaAlertOrigin {
  type: 'muestra_laboratorio' | 'monitoreo_cloro' | 'estado_sistema' | 'vigilancia_jass' | 'analisis_territorial';
  referenceId: string;
  referenceCode: string;
  detectedAt: string;
  details: string;
}

export interface AquaAlertItem {
  code: string; // código (ej: ALT-MIC-2026-001)
  date: string; // fecha
  system: string; // sistema
  point: string; // punto
  parameter: string; // parámetro
  result: string; // resultado
  criterion: string; // criterio
  level: AquaAlertLevel; // nivel (Bajo, Moderado, Alto, Crítico)
  type: AquaAlertType; // tipo
  responsible: string; // responsable
  requiredAction: string; // acción requerida
  status: AquaAlertStatus; // estado (PENDIENTE, EN PROCESO, RESUELTA, VERIFICADA)
  origin: AquaAlertOrigin; // Origen real registrado (No inventar riesgos, no alertas basadas en datos inexistentes)
  // Tracking the lifecycle: Acción → Verificación
  actionTaken?: string;
  actionDate?: string;
  actionBy?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  verificationEvidence?: string;
  riskId?: string; // Vínculo a la matriz AQUA-RISK
  isDemo?: boolean;
}

// -------------------------------------------------------------
// FASE 7: AQUA-TERRITORIO (GIS & Territorial Visualization Types)
// -------------------------------------------------------------

export type TerritorialSemaphore = 'adecuado' | 'vigilancia' | 'riesgo_alto' | 'critico';

export type TerritorialComponentType =
  | 'jass'
  | 'sistema'
  | 'fuente'
  | 'captacion'
  | 'planta'
  | 'reservorio'
  | 'punto_muestreo'
  | 'alerta';

export interface GeoCoordinates {
  lat: number;
  lng: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  utmEast?: number;
  utmNorth?: number;
  utmZone?: string;
}

export interface TerritorialComponent {
  id: string;
  systemId: string;
  systemName: string;
  name: string;
  type: TerritorialComponentType;
  description?: string;
  coordinates?: GeoCoordinates; // Si no existen coordenadas, undefined (no inventar)
  status: 'operativo' | 'en_mantenimiento' | 'paralizado' | 'alerta';
  semaphore: TerritorialSemaphore;
  details?: string;
  samplingPointType?: 'reservorio' | 'primera_vivienda' | 'punto_intermedio' | 'red_final';
  alertCode?: string;
}

export type WaterSourceType =
  | 'manantial_ladera'
  | 'manantial_fondo'
  | 'rio_superficial'
  | 'quebrada'
  | 'pozo_profundo'
  | 'galeria_filtrante';

export interface WaterSystemTerritorialProfile {
  systemId: string;
  systemName: string;
  jassName: string;
  jassPresident?: string;
  jassOperator?: string;
  cuenca: string;
  microcuenca: string;
  fuenteNombre: string;
  fuenteTipo: WaterSourceType;
  fuenteCaudalLs?: number;
  captacionNombre: string;
  plantaTratamiento?: string;
  coordinates?: GeoCoordinates; // Puede ser undefined si no hay levantamiento GIS
  components: TerritorialComponent[];
  beneficiaryCount: number;
  connectionsCount: number;
}

// -------------------------------------------------------------
// FASE 8: PLANES DE ACCIÓN Y AQUA-DATA (Types)
// -------------------------------------------------------------

export type ActionPlanFlowStage =
  | 'ALERTA'
  | 'PLAN DE ACCIÓN'
  | 'IMPLEMENTACIÓN'
  | 'EVIDENCIA'
  | 'VERIFICACIÓN'
  | 'CIERRE';

export interface ActionPlanEvidence {
  descripcion: string;
  tipoEvidencia?: 'fotografia' | 'acta_comunal' | 'boleta_dosificacion' | 'informe_laboratorio' | 'otro';
  archivoNombre?: string;
  archivoUrl?: string;
  fechaRegistro: string;
  registradoPor: string;
  observaciones?: string;
}

export interface ActionPlanVerification {
  conforme: boolean;
  verificadoPor: string;
  fechaVerificacion: string;
  notas: string;
  resultadoMedicion?: string;
  entidadVerificadora?: string;
}

export interface ActionPlanItem {
  id: string;
  alertCode?: string;
  systemId?: string;
  systemName: string;
  jassName?: string;
  punto?: string;

  // Campos exigidos por la FASE 8:
  problema: string;
  causaProbable: string;
  accion: string;
  responsable: string;
  fecha: string;
  fechaLimite: string;
  evidencia?: ActionPlanEvidence;
  estado: ActionPlanFlowStage;
  verificacion?: ActionPlanVerification;

  // Metadata operacional:
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  categoria: 'Microbiológica' | 'Química' | 'Desinfección' | 'Operativa' | 'JASS' | 'Territorial';
  notasImplementacion?: string;
  fechaImplementacion?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface AquaDataFilters {
  region: string;
  provincia: string;
  distrito: string;
  jass: string;
  sistema: string;
  fechaPreset: 'ultimos_7_dias' | 'ultimos_30_dias' | 'ultimos_90_dias' | 'ano_actual' | 'todos' | 'personalizado';
  fechaInicio?: string;
  fechaFin?: string;
  parametro: string;
}

// -------------------------------------------------------------
// FASE 10: CRM AQUA-SALUD (Sistema de Cotizaciones y Comercial)
// -------------------------------------------------------------

export type CrmQuoteStatus =
  | 'Nueva'
  | 'En revisión'
  | 'Contactada'
  | 'Cotización enviada'
  | 'En negociación'
  | 'Aceptada'
  | 'Rechazada'
  | 'Cerrada';

export type CrmClientSector =
  | 'JASS Comunal'
  | 'Municipalidad / ATM'
  | 'Empresa / Agroindustria'
  | 'Sector Minero / Industrial'
  | 'Institución Educativa / Salud'
  | 'Particular / Otro';

export interface CrmHistoryEntry {
  id: string;
  date: string;
  time: string;
  timestamp: string;
  author: string;
  action: string;
  note: string;
  fromStatus?: CrmQuoteStatus;
  toStatus?: CrmQuoteStatus;
}

export interface CrmInternalNote {
  id: string;
  date: string;
  time: string;
  author: string;
  text: string;
}

export interface CrmEmailDelivery {
  recipient: string;
  sent: boolean;
  sentAt?: string;
  messageId?: string;
  method: 'smtp' | 'resend' | 'server_relay' | 'cliente_mailto';
  error?: string;
  mailtoUrl?: string;
}

export interface CrmQuoteItem {
  id: string; // AS-2026-000001
  correlative: number;
  createdAt: string; // ISO
  dateStr: string;
  timeStr: string;
  clientName: string;
  organization: string;
  phone: string;
  email: string;
  service: string;
  sector: CrmClientSector;
  message: string;
  status: CrmQuoteStatus;
  responsible: string;
  estimatedBudgetPen?: number;
  nextFollowUpDate?: string; // YYYY-MM-DD
  nextFollowUpReminder?: string;
  history: CrmHistoryEntry[];
  internalNotes: CrmInternalNote[];
  emailDelivery: CrmEmailDelivery;
  firstContactDate?: string;
  quoteSentDate?: string;
  decisionDate?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
}

export interface CrmIndicators {
  solicitudes: number;
  cotizaciones: number;
  aceptaciones: number;
  rechazadas: number;
  enProceso: number;
  tasaConversionPercent: number;
  tiempoRespuestaPromedioHoras: number;
  serviciosMasSolicitados: { servicio: string; cantidad: number; porcentaje: number }[];
  sectoresMayorDemanda: { sector: string; cantidad: number; porcentaje: number }[];
  montoTotalCotizadoPen: number;
  montoTotalAceptadoPen: number;
}

// -------------------------------------------------------------
// FASE 11: AUDITORÍA DE SEGURIDAD & REGISTRO INMUTABLE
// -------------------------------------------------------------

export type AuditAction =
  | 'CREACION'
  | 'MODIFICACION'
  | 'VALIDACION'
  | 'CAMBIO_ESTADO'
  | 'ELIMINACION_LOGICA'
  | 'RESTAURACION'
  | 'AUTENTICACION'
  | 'EXPORTACION_DATOS';

export type AuditEntityType =
  | 'COTIZACION'
  | 'MUESTRA_LAB'
  | 'SISTEMA_JASS'
  | 'REGISTRO_CLORO'
  | 'PLAN_ACCION'
  | 'ALERTA'
  | 'PERFIL_OPERADOR'
  | 'SISTEMA_SEGURIDAD';

export interface AuditLogEntry {
  id: string; // AUD-2026-000001
  timestamp: string; // ISO
  dateStr: string;
  timeStr: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityTitle: string;
  authorName: string;
  authorRole: string;
  authorTier: UserRoleTier;
  details: string;
  previousState?: string;
  newState?: string;
  ipAddress?: string;
  checksum: string;
}



import { AuditLogEntry, AuditAction, AuditEntityType, UserRoleTier } from '../types';
import { generateAuditChecksum } from '../utils/cryptoSecurity';

export const AUDIT_STORAGE_KEY = 'cloragua_audit_logs_v1';
export const AUDIT_COUNTER_KEY = 'cloragua_audit_counter_v1';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-000001',
    timestamp: '2026-09-15T08:00:00.000Z',
    dateStr: '15/09/2026',
    timeStr: '08:00:00',
    action: 'CREACION',
    entityType: 'SISTEMA_SEGURIDAD',
    entityId: 'SYS-SEC-01',
    entityTitle: 'Inicialización de Módulos de Seguridad y RBAC',
    authorName: 'Ing. Zaira Salvador Amaya',
    authorRole: 'Administrador de Sistema Hídrico',
    authorTier: 'ADMIN',
    details: 'Arranque del motor criptográfico SHA-256, políticas de acceso por roles y protección contra spam.',
    checksum: 'A9B48E21C45F710D',
  },
  {
    id: 'AUD-2026-000002',
    timestamp: '2026-09-15T08:30:00.000Z',
    dateStr: '15/09/2026',
    timeStr: '08:30:00',
    action: 'VALIDACION',
    entityType: 'MUESTRA_LAB',
    entityId: 'LAB-2026-001',
    entityTitle: 'Validación de Ensayo Bacteriológico y Fisicoquímico',
    authorName: 'Ing. Carlos Mendoza',
    authorRole: 'Supervisor Regional DIGESA',
    authorTier: 'SUPERVISOR',
    details: 'Validación formal de cumplimiento D.S. 031-2010-SA para muestra de agua en Tanque Central Cascas.',
    previousState: 'Estado: En análisis',
    newState: 'Estado: Validado / Cumple (Cloro Residual 1.8 ppm)',
    checksum: '3DF9810AEB552719',
  },
  {
    id: 'AUD-2026-000003',
    timestamp: '2026-09-15T09:15:00.000Z',
    dateStr: '15/09/2026',
    timeStr: '09:15:00',
    action: 'CREACION',
    entityType: 'COTIZACION',
    entityId: 'AS-2026-000001',
    entityTitle: 'Recepción y Trazabilidad de Solicitud de Cotización',
    authorName: 'Sistema Web AQUA-SALUD',
    authorRole: 'Despachador Transaccional',
    authorTier: 'ADMIN',
    details: 'Solicitud para "Análisis Bacteriológico D.S. 031-2010-SA" despachada por correo a aqua.salud.lab@gmail.com.',
    checksum: '8E4C19A075BF2391',
  },
  {
    id: 'AUD-2026-000004',
    timestamp: '2026-09-15T10:00:00.000Z',
    dateStr: '15/09/2026',
    timeStr: '10:00:00',
    action: 'CAMBIO_ESTADO',
    entityType: 'COTIZACION',
    entityId: 'AS-2026-000001',
    entityTitle: 'Transición de Pipeline Comercial',
    authorName: 'Ing. Carlos Mendoza',
    authorRole: 'Supervisor Regional DIGESA',
    authorTier: 'SUPERVISOR',
    details: 'Prospecto contactado vía WhatsApp con propuesta de aforo y muestreo.',
    previousState: 'Estado: Nueva',
    newState: 'Estado: Contactada (Responsable asignado: Ing. Sanitario Marco Valdivia)',
    checksum: '5F29A4108CD7104E',
  },
  {
    id: 'AUD-2026-000005',
    timestamp: '2026-09-15T10:45:00.000Z',
    dateStr: '15/09/2026',
    timeStr: '10:45:00',
    action: 'MODIFICACION',
    entityType: 'SISTEMA_JASS',
    entityId: 'sys-01',
    entityTitle: 'Calibración de Dosificador de Cloro',
    authorName: 'Tec. Marina Quispe',
    authorRole: 'Área Técnica Municipal (ATM)',
    authorTier: 'SUPERVISOR',
    details: 'Ajuste de caudal de goteo en reservorio apoyado para mantener rango normado 0.5 - 2.0 ppm.',
    checksum: 'E7B10429C58AF128',
  },
];

export function loadAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      saveAuditLogs(INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_AUDIT_LOGS;
  } catch (e) {
    console.warn('Error loading audit logs from storage:', e);
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn('Error saving audit logs to storage:', e);
  }
}

export async function logAuditEvent(params: {
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
}): Promise<AuditLogEntry> {
  const existing = loadAuditLogs();
  const nextNum = existing.length + 1;
  const id = `AUD-2026-${String(nextNum).padStart(6, '0')}`;
  const now = new Date();
  const timestamp = now.toISOString();
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const checksum = await generateAuditChecksum(
    id,
    timestamp,
    params.action,
    params.entityId,
    params.authorName
  );

  const newEntry: AuditLogEntry = {
    id,
    timestamp,
    dateStr,
    timeStr,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    entityTitle: params.entityTitle,
    authorName: params.authorName,
    authorRole: params.authorRole,
    authorTier: params.authorTier,
    details: params.details,
    previousState: params.previousState,
    newState: params.newState,
    checksum,
  };

  const updated = [newEntry, ...existing];
  saveAuditLogs(updated);

  // Also send event to backend server audit log endpoint asynchronously
  try {
    fetch('/api/audit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    }).catch(() => {
      // Background non-blocking
    });
  } catch {
    // Ignore server sync failure in offline mode
  }

  return newEntry;
}

export function exportAuditLogsToCsv(logs: AuditLogEntry[]): void {
  const headers = [
    'ID_AUDITORIA',
    'FECHA',
    'HORA',
    'ACCION',
    'TIPO_ENTIDAD',
    'ID_ENTIDAD',
    'TITULO',
    'AUTOR',
    'ROL',
    'NIVEL_RBAC',
    'DETALLES',
    'ESTADO_ANTERIOR',
    'ESTADO_NUEVO',
    'CHECKSUM_CRIPTO',
  ];

  const rows = logs.map((l) => [
    l.id,
    l.dateStr,
    l.timeStr,
    l.action,
    l.entityType,
    `"${(l.entityId || '').replace(/"/g, '""')}"`,
    `"${(l.entityTitle || '').replace(/"/g, '""')}"`,
    `"${(l.authorName || '').replace(/"/g, '""')}"`,
    `"${(l.authorRole || '').replace(/"/g, '""')}"`,
    l.authorTier,
    `"${(l.details || '').replace(/"/g, '""')}"`,
    `"${(l.previousState || '').replace(/"/g, '""')}"`,
    `"${(l.newState || '').replace(/"/g, '""')}"`,
    l.checksum,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AQUA_SALUD_AUDITORIA_OFICIAL_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

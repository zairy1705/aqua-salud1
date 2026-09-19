import { UserRoleTier, OperatorProfile } from '../types';

export interface RolePermissions {
  canViewAudit: boolean;
  canValidateLab: boolean;
  canSoftDelete: boolean;
  canRestoreDeleted: boolean;
  canEditCrmStatus: boolean;
  canViewConfidentialClients: boolean;
  canModifyJassSystems: boolean;
  canCreateChlorineRecords: boolean;
  canExportReports: boolean;
  canManageProfiles: boolean;
}

export const PERMISSIONS_BY_TIER: Record<UserRoleTier, RolePermissions> = {
  ADMIN: {
    canViewAudit: true,
    canValidateLab: true,
    canSoftDelete: true,
    canRestoreDeleted: true,
    canEditCrmStatus: true,
    canViewConfidentialClients: true,
    canModifyJassSystems: true,
    canCreateChlorineRecords: true,
    canExportReports: true,
    canManageProfiles: true,
  },
  SUPERVISOR: {
    canViewAudit: true,
    canValidateLab: true,
    canSoftDelete: false, // Only ADMIN can delete
    canRestoreDeleted: false,
    canEditCrmStatus: true,
    canViewConfidentialClients: true,
    canModifyJassSystems: true,
    canCreateChlorineRecords: true,
    canExportReports: true,
    canManageProfiles: false,
  },
  OPERADOR: {
    canViewAudit: false, // Operators cannot view sensitive audit logs
    canValidateLab: false, // Only certified supervisors or admins can validate lab results
    canSoftDelete: false,
    canRestoreDeleted: false,
    canEditCrmStatus: false,
    canViewConfidentialClients: false, // Client contacts masked
    canModifyJassSystems: false, // Can only log measurements
    canCreateChlorineRecords: true,
    canExportReports: false,
    canManageProfiles: false,
  },
  AUDITOR: {
    canViewAudit: true, // Auditors have full audit visibility
    canValidateLab: false,
    canSoftDelete: false,
    canRestoreDeleted: false,
    canEditCrmStatus: false,
    canViewConfidentialClients: false,
    canModifyJassSystems: false,
    canCreateChlorineRecords: false,
    canExportReports: true, // Can export for regulatory compliance
    canManageProfiles: false,
  },
};

export function getRolePermissions(tier: UserRoleTier): RolePermissions {
  return PERMISSIONS_BY_TIER[tier] || PERMISSIONS_BY_TIER.OPERADOR;
}

export function detectRoleTier(roleStr: string): UserRoleTier {
  const lower = (roleStr || '').toLowerCase();
  if (lower.includes('admin') || lower.includes('jefe') || lower.includes('gerente') || lower.includes('directivo')) {
    return 'ADMIN';
  }
  if (lower.includes('supervisor') || lower.includes('atm') || lower.includes('digesa') || lower.includes('especialista') || lower.includes('técnico') || lower.includes('tecnico')) {
    return 'SUPERVISOR';
  }
  if (lower.includes('auditor') || lower.includes('fiscalizador') || lower.includes('consulta')) {
    return 'AUDITOR';
  }
  return 'OPERADOR';
}

export const ROLE_TIER_INFO: Record<
  UserRoleTier,
  { label: string; badgeColor: string; textColor: string; icon: string; description: string }
> = {
  ADMIN: {
    label: 'Administrador Hídrico',
    badgeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    textColor: 'text-emerald-400',
    icon: 'admin_panel_settings',
    description: 'Control total de la plataforma, auditorías, aprobaciones, eliminación lógica y configuración.',
  },
  SUPERVISOR: {
    label: 'Supervisor Técnico ATM / DIGESA',
    badgeColor: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    textColor: 'text-cyan-400',
    icon: 'verified_user',
    description: 'Validación de análisis de laboratorio, gestión de planes de acción y seguimiento comercial.',
  },
  OPERADOR: {
    label: 'Operador de Campo JASS',
    badgeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    textColor: 'text-amber-400',
    icon: 'engineering',
    description: 'Registro de cloro residual libre, monitoreo de reservorios y envío de muestras.',
  },
  AUDITOR: {
    label: 'Auditor Sanitario (Sólo Lectura)',
    badgeColor: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    textColor: 'text-purple-400',
    icon: 'policy',
    description: 'Acceso de inspección y trazabilidad a la bitácora inmutable de auditoría oficial.',
  },
};

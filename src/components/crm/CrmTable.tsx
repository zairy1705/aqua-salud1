import React, { useState, useMemo } from 'react';
import { CrmQuoteItem, CrmQuoteStatus, UserRoleTier } from '../../types';
import {
  CRM_STATUS_CONFIG,
  CRM_SECTORS_LIST,
  CRM_SERVICES_CATALOG,
  buildWhatsAppContactUrl,
} from '../../data/crmStore';
import { maskSensitiveText } from '../../utils/cryptoSecurity';
import { PERMISSIONS_BY_TIER } from '../../utils/rbac';

interface CrmTableProps {
  quotes: CrmQuoteItem[];
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  onViewQuoteDetail: (quote: CrmQuoteItem) => void;
  onQuickChangeStatus: (quoteId: string, newStatus: CrmQuoteStatus) => void;
  onSoftDeleteQuote?: (quoteId: string, reason: string) => void;
  onRestoreQuote?: (quoteId: string) => void;
  currentUserTier?: UserRoleTier;
}

export const CrmTable: React.FC<CrmTableProps> = ({
  quotes,
  selectedStatusFilter,
  onSelectStatusFilter,
  onViewQuoteDetail,
  onQuickChangeStatus,
  onSoftDeleteQuote,
  onRestoreQuote,
  currentUserTier = 'OPERADOR',
}) => {
  const userTier: UserRoleTier = (currentUserTier as UserRoleTier) || 'OPERADOR';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('TODOS');
  const [selectedService, setSelectedService] = useState('TODOS');
  const [sortBy, setSortBy] = useState<'recientes' | 'antiguos' | 'presupuesto' | 'codigo'>('recientes');
  const [showDeleted, setShowDeleted] = useState(false);

  // Logical Deletion Modal State
  const [quoteToDelete, setQuoteToDelete] = useState<CrmQuoteItem | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const permissions = PERMISSIONS_BY_TIER[userTier];
  const canViewFullData = permissions.canViewConfidentialClients;
  const canDelete = permissions.canSoftDelete;

  // Count active vs soft-deleted
  const activeCount = quotes.filter((q) => !q.isDeleted).length;
  const deletedCount = quotes.filter((q) => q.isDeleted).length;

  // Filtered & Sorted Quotes
  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((item) => {
        // Soft delete filter: unless user explicitly toggled showDeleted
        if (showDeleted) {
          if (!item.isDeleted) return false;
        } else {
          if (item.isDeleted) return false;
        }

        // Status filter
        if (selectedStatusFilter !== 'TODAS' && item.status !== selectedStatusFilter) {
          return false;
        }

        // Sector filter
        if (selectedSector !== 'TODOS' && item.sector !== selectedSector) {
          return false;
        }

        // Service filter
        if (selectedService !== 'TODOS' && item.service !== selectedService) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchCode = item.id.toLowerCase().includes(q);
          const matchName = item.clientName.toLowerCase().includes(q);
          const matchOrg = item.organization.toLowerCase().includes(q);
          const matchPhone = item.phone.toLowerCase().includes(q);
          const matchEmail = item.email.toLowerCase().includes(q);
          const matchMsg = item.message.toLowerCase().includes(q);
          return matchCode || matchName || matchOrg || matchPhone || matchEmail || matchMsg;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recientes') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'antiguos') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'presupuesto') {
          return (b.estimatedBudgetPen || 0) - (a.estimatedBudgetPen || 0);
        }
        if (sortBy === 'codigo') {
          return (b.correlative || 0) - (a.correlative || 0);
        }
        return 0;
      });
  }, [quotes, showDeleted, selectedStatusFilter, selectedSector, selectedService, searchTerm, sortBy]);

  const handleConfirmSoftDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteReason.trim() || deleteReason.trim().length < 5) {
      setDeleteError('Por favor ingrese un motivo justificatorio detallado (mínimo 5 caracteres).');
      return;
    }
    if (quoteToDelete && onSoftDeleteQuote) {
      onSoftDeleteQuote(quoteToDelete.id, deleteReason.trim());
      setQuoteToDelete(null);
      setDeleteReason('');
      setDeleteError('');
    }
  };

  const exportToCsv = () => {
    const headers = [
      'Código',
      'Fecha',
      'Hora',
      'Cliente',
      'Organización',
      'Teléfono',
      'Correo',
      'Sector',
      'Servicio',
      'Estado',
      'Responsable',
      'Presupuesto PEN',
      'Próximo Seguimiento',
      'Eliminado Lógicamente',
      'Motivo Eliminación',
    ];

    const rows = filteredQuotes.map((q) => [
      q.id,
      q.dateStr,
      q.timeStr,
      `"${q.clientName.replace(/"/g, '""')}"`,
      `"${q.organization.replace(/"/g, '""')}"`,
      `"${canViewFullData ? q.phone : maskSensitiveText(q.phone, userTier, 'phone')}"`,
      `"${canViewFullData ? q.email : maskSensitiveText(q.email, userTier, 'email')}"`,
      `"${q.sector}"`,
      `"${q.service.replace(/"/g, '""')}"`,
      `"${q.status}"`,
      `"${q.responsible}"`,
      q.estimatedBudgetPen || 0,
      `"${q.nextFollowUpDate || ''}"`,
      q.isDeleted ? 'SÍ' : 'NO',
      `"${q.deleteReason || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aqua_salud_cotizaciones_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código AS-2026-..., cliente, organización..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
              </button>
            )}
          </div>

          {/* Quick Stats & Toggles & Export */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Active vs Deleted Toggle (Logical Deletion inspection) */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShowDeleted(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !showDeleted
                    ? 'bg-white text-[#00677d] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Activas ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setShowDeleted(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  showDeleted
                    ? 'bg-rose-50 text-rose-700 shadow-2xs font-bold border border-rose-200'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                <span>Archivadas / Eliminadas ({deletedCount})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={exportToCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              title="Descargar reporte en formato CSV"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Filtrar por Estado:
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => onSelectStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none focus:border-[#00677d]"
            >
              <option value="TODAS">Todos los Estados</option>
              {(Object.keys(CRM_STATUS_CONFIG) as CrmQuoteStatus[]).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Filtrar por Sector:
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none focus:border-[#00677d]"
            >
              <option value="TODOS">Todos los Sectores</option>
              {CRM_SECTORS_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Filtrar por Servicio:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none focus:border-[#00677d] truncate"
            >
              <option value="TODOS">Todos los Servicios</option>
              {CRM_SERVICES_CATALOG.map((svc) => (
                <option key={svc.id} value={svc.name}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none focus:border-[#00677d]"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
              <option value="presupuesto">Mayor presupuesto (S/.)</option>
              <option value="codigo">Código correlativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3 pl-4">Código / Fecha</th>
                <th className="p-3">Cliente / Entidad</th>
                <th className="p-3">Servicio Requerido</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Presupuesto</th>
                <th className="p-3">Responsable</th>
                <th className="p-3">Próximo Seg.</th>
                <th className="p-3 pr-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        find_in_page
                      </span>
                      <p className="font-semibold">
                        {showDeleted
                          ? 'No hay solicitudes archivadas o eliminadas lógicamente.'
                          : 'No se encontraron cotizaciones con los filtros actuales.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          onSelectStatusFilter('TODAS');
                          setSelectedSector('TODOS');
                          setSelectedService('TODOS');
                          setShowDeleted(false);
                        }}
                        className="text-xs text-[#00677d] font-bold hover:underline cursor-pointer"
                      >
                        Restablecer todos los filtros
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => {
                  const cfg = CRM_STATUS_CONFIG[q.status] || CRM_STATUS_CONFIG.Nueva;
                  const waUrl = buildWhatsAppContactUrl(
                    q.phone,
                    q.clientName,
                    q.id,
                    q.service,
                    q.organization,
                    q.responsible
                  );

                  // Data Protection: Mask phone & email if not authorized
                  const displayPhone = canViewFullData
                    ? q.phone
                    : maskSensitiveText(q.phone, userTier, 'phone');
                  const displayEmail = canViewFullData
                    ? q.email
                    : maskSensitiveText(q.email, userTier, 'email');

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        q.isDeleted ? 'bg-rose-50/30' : ''
                      }`}
                      onClick={() => onViewQuoteDetail(q)}
                    >
                      {/* Código / Fecha */}
                      <td className="p-3 pl-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#00677d] block">
                            {q.id}
                          </span>
                          {q.isDeleted && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                              Archivado
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {q.dateStr} • {q.timeStr}
                        </span>
                      </td>

                      {/* Cliente / Organización */}
                      <td className="p-3 max-w-[200px]">
                        <span className="font-bold text-slate-800 block truncate" title={q.clientName}>
                          {q.clientName}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate" title={q.organization}>
                          {q.organization || 'Particular'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                          <span>{displayPhone}</span>
                          {!canViewFullData && (
                            <span
                              className="material-symbols-outlined text-[13px] text-amber-500"
                              title="Dato protegido por política de confidencialidad RBAC"
                            >
                              lock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Servicio */}
                      <td className="p-3 max-w-[220px]">
                        <span className="font-medium text-slate-700 block line-clamp-2" title={q.service}>
                          {q.service}
                        </span>
                      </td>

                      {/* Sector */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                          {q.sector}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="p-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={q.status}
                          disabled={q.isDeleted}
                          onChange={(e) => onQuickChangeStatus(q.id, e.target.value as CrmQuoteStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${cfg.colorBg} ${cfg.colorText} ${cfg.borderColor} disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {(Object.keys(CRM_STATUS_CONFIG) as CrmQuoteStatus[]).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Presupuesto */}
                      <td className="p-3 whitespace-nowrap text-right font-mono font-bold text-slate-800">
                        {q.estimatedBudgetPen && q.estimatedBudgetPen > 0 ? (
                          <span>S/. {q.estimatedBudgetPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        ) : (
                          <span className="text-slate-400 font-normal text-[11px]">Por cotizar</span>
                        )}
                      </td>

                      {/* Responsable */}
                      <td className="p-3 max-w-[150px]">
                        <span className="text-[11px] text-slate-600 block truncate" title={q.responsible}>
                          {q.responsible.split('(')[0].trim()}
                        </span>
                      </td>

                      {/* Próximo Seguimiento */}
                      <td className="p-3 whitespace-nowrap">
                        {q.nextFollowUpDate ? (
                          <span className="text-[11px] font-mono text-slate-600 block">
                            {q.nextFollowUpDate}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Sin programar</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="p-3 pr-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          {/* WhatsApp (Solo si no está archivada) */}
                          {!q.isDeleted && canViewFullData && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-colors"
                              title="Contactar al cliente por WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[17px]">chat</span>
                            </a>
                          )}

                          {/* Ficha Detail */}
                          <button
                            type="button"
                            onClick={() => onViewQuoteDetail(q)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#00677d] hover:text-white transition-colors cursor-pointer"
                            title="Abrir Ficha de Detalle y Seguimiento"
                          >
                            <span className="material-symbols-outlined text-[17px]">visibility</span>
                          </button>

                          {/* Logical Deletion / Restore Buttons */}
                          {canDelete && (
                            <>
                              {q.isDeleted ? (
                                <button
                                  type="button"
                                  onClick={() => onRestoreQuote?.(q.id)}
                                  className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                                  title="Restaurar registro archivado (con auditoría)"
                                >
                                  <span className="material-symbols-outlined text-[17px]">restore_from_trash</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuoteToDelete(q);
                                    setDeleteReason('');
                                    setDeleteError('');
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                                  title="Eliminación lógica / Archivar con motivo justificatorio"
                                >
                                  <span className="material-symbols-outlined text-[17px]">delete</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logical Deletion Confirmation Modal */}
      {quoteToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-200 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">delete_sweep</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Eliminación Lógica de Cotización
                </h3>
                <span className="font-mono text-xs font-bold text-[#00677d]">
                  {quoteToDelete.id} • {quoteToDelete.clientName}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              <strong>Regla de Integridad Histórica:</strong> Los datos nunca se eliminan físicamente. La solicitud será archivada lógicamente y quedará asentada en la bitácora criptográfica de auditoría.
            </p>

            <form onSubmit={handleConfirmSoftDelete} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo Justificatorio de Eliminación Lógica <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    setDeleteError('');
                  }}
                  placeholder="Ej. Duplicado involuntario remitido por el mismo usuario / Cancelación a solicitud expresa del cliente..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none resize-none"
                />
                {deleteError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{deleteError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">done</span>
                  <span>Confirmar Eliminación Lógica</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

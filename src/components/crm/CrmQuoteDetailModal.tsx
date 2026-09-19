import React, { useState } from 'react';
import {
  CrmQuoteItem,
  CrmQuoteStatus,
  CrmHistoryEntry,
  CrmInternalNote,
  UserRoleTier,
} from '../../types';
import {
  CRM_STATUS_CONFIG,
  CRM_RESPONSIBLES,
  CRM_PRIMARY_EMAIL,
  buildWhatsAppContactUrl,
  buildMailtoUrl,
} from '../../data/crmStore';
import { maskSensitiveText } from '../../utils/cryptoSecurity';
import { PERMISSIONS_BY_TIER } from '../../utils/rbac';
import { logAuditEvent } from '../../data/auditStore';

interface CrmQuoteDetailModalProps {
  quote: CrmQuoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (updated: CrmQuoteItem) => void;
  onSoftDeleteQuote?: (quoteId: string, reason: string) => void;
  onRestoreQuote?: (quoteId: string) => void;
  currentUserTier?: UserRoleTier;
  currentOperatorName?: string;
}

export const CrmQuoteDetailModal: React.FC<CrmQuoteDetailModalProps> = ({
  quote,
  isOpen,
  onClose,
  onSaveQuote,
  onSoftDeleteQuote,
  onRestoreQuote,
  currentUserTier = 'OPERADOR',
  currentOperatorName = 'Operador del Sistema',
}) => {
  if (!isOpen || !quote) return null;

  const userTier: UserRoleTier = (currentUserTier as UserRoleTier) || 'OPERADOR';
  const permissions = PERMISSIONS_BY_TIER[userTier];
  const canViewFullData = permissions.canViewConfidentialClients;
  const canDelete = permissions.canSoftDelete;

  const [currentStatus, setCurrentStatus] = useState<CrmQuoteStatus>(quote.status);
  const [responsible, setResponsible] = useState(quote.responsible || CRM_RESPONSIBLES[0]);
  const [estimatedBudget, setEstimatedBudget] = useState(quote.estimatedBudgetPen || 0);
  const [nextFollowUpDate, setNextFollowUpDate] = useState(quote.nextFollowUpDate || '');
  const [nextFollowUpReminder, setNextFollowUpReminder] = useState(
    quote.nextFollowUpReminder || ''
  );

  const [newNoteText, setNewNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'ficha' | 'historial' | 'notas'>('ficha');
  const [statusChangeNote, setStatusChangeNote] = useState('');
  const [showStatusNotePrompt, setShowStatusNotePrompt] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CrmQuoteStatus | null>(null);

  // Soft delete state
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const statusConfig = CRM_STATUS_CONFIG[currentStatus];

  const handleStatusChangeClick = (newStatus: CrmQuoteStatus) => {
    if (newStatus === currentStatus) return;
    setPendingStatus(newStatus);
    setStatusChangeNote(`Cambio de fase comercial a: ${newStatus}`);
    setShowStatusNotePrompt(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const newHistoryEntry: CrmHistoryEntry = {
      id: `hist-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      timestamp: now.toISOString(),
      author: `${currentOperatorName} (${currentUserTier})`,
      action: `Cambio de Estado: ${pendingStatus}`,
      note: statusChangeNote || `Fase actualizada de ${currentStatus} a ${pendingStatus}`,
      fromStatus: currentStatus,
      toStatus: pendingStatus,
    };

    const updated: CrmQuoteItem = {
      ...quote,
      status: pendingStatus,
      responsible,
      estimatedBudgetPen: estimatedBudget,
      nextFollowUpDate,
      nextFollowUpReminder,
      firstContactDate:
        pendingStatus === 'Contactada' && !quote.firstContactDate
          ? now.toISOString()
          : quote.firstContactDate,
      quoteSentDate:
        pendingStatus === 'Cotización enviada' && !quote.quoteSentDate
          ? now.toISOString()
          : quote.quoteSentDate,
      decisionDate:
        ['Aceptada', 'Rechazada', 'Cerrada'].includes(pendingStatus) && !quote.decisionDate
          ? now.toISOString()
          : quote.decisionDate,
      history: [newHistoryEntry, ...(quote.history || [])],
    };

    // Log official immutable audit event
    await logAuditEvent({
      action: 'CAMBIO_ESTADO',
      entityType: 'COTIZACION',
      entityId: quote.id,
      entityTitle: `Cotización ${quote.id}: ${quote.clientName}`,
      authorName: currentOperatorName,
      authorRole: `${responsible} / ${userTier}`,
      authorTier: userTier,
      previousState: `Estado: ${currentStatus}`,
      newState: `Estado: ${pendingStatus}`,
      details: statusChangeNote || `Transición de estado comercial de ${currentStatus} a ${pendingStatus}.`,
    });

    setCurrentStatus(pendingStatus);
    setPendingStatus(null);
    setShowStatusNotePrompt(false);
    onSaveQuote(updated);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const noteItem: CrmInternalNote = {
      id: `note-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      author: `${currentOperatorName} (${currentUserTier})`,
      text: newNoteText.trim(),
    };

    const updated: CrmQuoteItem = {
      ...quote,
      internalNotes: [noteItem, ...(quote.internalNotes || [])],
    };

    await logAuditEvent({
      action: 'MODIFICACION',
      entityType: 'COTIZACION',
      entityId: quote.id,
      entityTitle: `Cotización ${quote.id}: ${quote.clientName}`,
      authorName: currentOperatorName,
      authorRole: userTier,
      authorTier: userTier,
      details: `Nota interna registrada: "${newNoteText.trim().slice(0, 80)}..."`,
    });

    onSaveQuote(updated);
    setNewNoteText('');
  };

  const handleSaveChanges = async () => {
    const updated: CrmQuoteItem = {
      ...quote,
      responsible,
      estimatedBudgetPen: Number(estimatedBudget) || 0,
      nextFollowUpDate,
      nextFollowUpReminder,
    };

    await logAuditEvent({
      action: 'MODIFICACION',
      entityType: 'COTIZACION',
      entityId: quote.id,
      entityTitle: `Cotización ${quote.id}: ${quote.clientName}`,
      authorName: currentOperatorName,
      authorRole: userTier,
      authorTier: userTier,
      details: `Actualización de asignación comercial. Presupuesto S/. ${estimatedBudget}, Responsable: ${responsible}, Próximo seguimiento: ${nextFollowUpDate || 'Sin programar'}`,
    });

    onSaveQuote(updated);
    onClose();
  };

  const handleConfirmSoftDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteReason.trim() || deleteReason.trim().length < 5) {
      setDeleteError('Por favor ingrese un motivo justificatorio detallado (mínimo 5 caracteres).');
      return;
    }

    if (onSoftDeleteQuote) {
      onSoftDeleteQuote(quote.id, deleteReason.trim());
      setShowDeletePrompt(false);
      onClose();
    }
  };

  const handleRestore = async () => {
    if (onRestoreQuote) {
      onRestoreQuote(quote.id);
      onClose();
    }
  };

  // Data Protection
  const displayPhone = canViewFullData
    ? quote.phone
    : maskSensitiveText(quote.phone, userTier, 'phone');
  const displayEmail = canViewFullData
    ? quote.email
    : maskSensitiveText(quote.email, userTier, 'email');

  const whatsappLink = buildWhatsAppContactUrl(
    quote.phone,
    quote.clientName,
    quote.id,
    quote.service,
    quote.organization,
    responsible
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400">
                {quote.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.colorBg} ${statusConfig.colorText} ${statusConfig.borderColor}`}
              >
                <span className="material-symbols-outlined text-[14px]">{statusConfig.icon}</span>
                <span>{quote.status}</span>
              </span>
              {quote.isDeleted && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-900/80 text-rose-200 border border-rose-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">delete_sweep</span>
                  <span>Archivado Lógicamente</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Registrado el {quote.dateStr} a las {quote.timeStr} • Correlativo #{quote.correlative}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!quote.isDeleted && canViewFullData && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>WhatsApp</span>
              </a>
            )}

            <a
              href={buildMailtoUrl(quote)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">mail</span>
              <span>Email</span>
            </a>

            {/* Logical Deletion or Restore Button */}
            {canDelete && (
              <>
                {quote.isDeleted ? (
                  <button
                    type="button"
                    onClick={handleRestore}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Restaurar registro archivado"
                  >
                    <span className="material-symbols-outlined text-[16px]">restore_from_trash</span>
                    <span>Restaurar</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeletePrompt(true);
                      setDeleteReason('');
                      setDeleteError('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Eliminación Lógica con motivo justificado"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Archivar</span>
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Status Pipeline Step Switcher */}
        <div className="bg-slate-100/90 border-b border-slate-200 p-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] font-bold uppercase text-slate-500 mr-2 tracking-wider">
              Estado Comercial:
            </span>
            {(Object.keys(CRM_STATUS_CONFIG) as CrmQuoteStatus[]).map((st) => {
              const cfg = CRM_STATUS_CONFIG[st];
              const isCurrent = currentStatus === st;

              return (
                <button
                  key={st}
                  type="button"
                  disabled={quote.isDeleted}
                  onClick={() => handleStatusChangeClick(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrent
                      ? `${cfg.colorBg} ${cfg.colorText} ${cfg.borderColor} border-2 shadow-xs scale-105`
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{cfg.icon}</span>
                  <span>{st}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt when changing status */}
        {showStatusNotePrompt && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold w-full sm:w-auto">
              <span className="material-symbols-outlined text-amber-600 text-lg">edit_note</span>
              <span>Motivo / Detalle del cambio a &quot;{pendingStatus}&quot;:</span>
            </div>
            <input
              type="text"
              value={statusChangeNote}
              onChange={(e) => setStatusChangeNote(e.target.value)}
              placeholder="Ej. Se conversó por teléfono, se acordó envío de cotización para mañana..."
              className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-300 outline-none w-full"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={confirmStatusChange}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStatusNotePrompt(false);
                  setPendingStatus(null);
                }}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-4 px-5 border-b border-slate-200 text-xs font-bold text-slate-600 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('ficha')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'ficha'
                ? 'border-[#00677d] text-[#00677d]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">description</span>
            <span>Ficha & Requerimiento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historial')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'historial'
                ? 'border-[#00677d] text-[#00677d]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">history</span>
            <span>Historial de Acciones ({quote.history?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notas')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'notas'
                ? 'border-[#00677d] text-[#00677d]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">note_alt</span>
            <span>Notas Internas ({quote.internalNotes?.length || 0})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'ficha' && (
            <div className="space-y-5">
              {/* Client & Organization Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Datos del Solicitante</span>
                    {!canViewFullData && (
                      <span className="text-[10px] text-amber-600 font-normal flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        <span>Protección de Datos RBAC</span>
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-800 text-sm">{quote.clientName}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-cyan-700">
                      domain
                    </span>
                    <span>{quote.organization || 'Particular'}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">
                      call
                    </span>
                    <span className="font-mono">{displayPhone}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-blue-600">
                      mail
                    </span>
                    <span>{displayEmail}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Servicio & Sector
                  </div>
                  <div className="font-bold text-[#00677d] text-sm">{quote.service}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-slate-500">
                      category
                    </span>
                    <span>Sector: <strong>{quote.sector}</strong></span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">
                      mark_email_read
                    </span>
                    <span>Entrega: Remitido a <strong>{CRM_PRIMARY_EMAIL}</strong></span>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-200/80">
                <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Requerimiento / Mensaje del Cliente</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic bg-white p-3 rounded-lg border border-cyan-100">
                  &quot;{quote.message}&quot;
                </p>
              </div>

              {/* Commercial Assignment & Follow Up */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsable Asignado:
                  </label>
                  <select
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 outline-none focus:border-[#00677d]"
                  >
                    {CRM_RESPONSIBLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Presupuesto Estimado (PEN):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                      S/.
                    </span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={estimatedBudget || ''}
                      onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold text-slate-800 outline-none focus:border-[#00677d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha Próximo Seguimiento:
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-700 outline-none focus:border-[#00677d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recordatorio / Acción de Próximo Seguimiento:
                </label>
                <input
                  type="text"
                  value={nextFollowUpReminder}
                  onChange={(e) => setNextFollowUpReminder(e.target.value)}
                  placeholder="Ej. Llamar al presidente de JASS para coordinar visita técnica..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-[#00677d]"
                />
              </div>

              {/* If soft-deleted, show deletion record banner */}
              {quote.isDeleted && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>Registro Archivado / Eliminado Lógicamente</span>
                  </div>
                  <div>
                    <strong>Eliminado por:</strong> {quote.deletedBy || 'Administrador'} en {quote.deletedAt}
                  </div>
                  <div>
                    <strong>Motivo:</strong> {quote.deleteReason || 'No especificado'}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'historial' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Registro cronológico inmutable de interacciones y avances comerciales para la cotización{' '}
                <strong className="text-slate-800">{quote.id}</strong>.
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(quote.history || []).map((h) => (
                  <div key={h.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#00677d] border-2 border-white shadow-xs" />
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{h.action}</span>
                        <span className="text-slate-400 font-mono">
                          {h.date} {h.time}
                        </span>
                      </div>
                      <p className="text-slate-700">{h.note}</p>
                      <div className="text-[10px] text-slate-500">
                        Por: <strong className="text-slate-700">{h.author}</strong>
                        {h.toStatus && (
                          <span className="ml-2 font-semibold text-[#00677d]">
                            → {h.toStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notas' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Agregar Nota Interna de Seguimiento:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Escribe comentarios privados sobre requerimiento, llamadas o acuerdos..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-[#00677d]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00677d] hover:bg-[#005264] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span>Añadir</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                {(!quote.internalNotes || quote.internalNotes.length === 0) ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    No hay notas internas registradas aún.
                  </p>
                ) : (
                  quote.internalNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span className="font-bold text-amber-900">{n.author}</span>
                        <span>
                          {n.date} {n.time}
                        </span>
                      </div>
                      <p className="text-slate-800">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="px-5 py-2 rounded-xl bg-[#00677d] hover:bg-[#005264] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Logical Delete Confirmation prompt */}
      {showDeletePrompt && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-200 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <span className="material-symbols-outlined text-3xl">delete_sweep</span>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Archivar Lógicamente</h3>
                <span className="font-mono text-xs text-[#00677d]">{quote.id}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              El registro se archivará lógicamente preservando la trazabilidad histórica de auditoría.
            </p>
            <form onSubmit={handleConfirmSoftDelete} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo Justificatorio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    setDeleteError('');
                  }}
                  placeholder="Indique el motivo por el cual se archiva esta solicitud..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:border-rose-500 outline-none resize-none"
                />
                {deleteError && (
                  <p className="text-[11px] text-rose-600 mt-1">{deleteError}</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeletePrompt(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Confirmar Archivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

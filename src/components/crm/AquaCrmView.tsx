import React, { useState, useEffect } from 'react';
import { CrmQuoteItem, CrmQuoteStatus, OperatorProfile, UserRoleTier } from '../../types';
import {
  loadStoredQuotes,
  saveStoredQuotes,
  CRM_PRIMARY_EMAIL,
} from '../../data/crmStore';
import { CrmDashboard } from './CrmDashboard';
import { CrmTable } from './CrmTable';
import { CrmQuoteDetailModal } from './CrmQuoteDetailModal';
import { PublicQuoteModal } from '../public/PublicQuoteModal';
import { logAuditEvent } from '../../data/auditStore';
import { detectRoleTier } from '../../utils/rbac';

interface AquaCrmViewProps {
  activeProfile?: OperatorProfile;
  onOpenAuditModal?: () => void;
}

export const AquaCrmView: React.FC<AquaCrmViewProps> = ({
  activeProfile,
  onOpenAuditModal,
}) => {
  const [quotes, setQuotes] = useState<CrmQuoteItem[]>(() => loadStoredQuotes());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tabla'>('dashboard');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('TODAS');

  const [selectedQuote, setSelectedQuote] = useState<CrmQuoteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);

  const currentUserTier: UserRoleTier = activeProfile?.roleTier || detectRoleTier(activeProfile?.role || '');
  const operatorName = activeProfile?.name || 'Operador de Laboratorio';

  // Sync quotes with local storage and fetch any backend server quotes
  useEffect(() => {
    const localQuotes = loadStoredQuotes();
    setQuotes(localQuotes);

    // Fetch server quotes to merge
    fetch('/api/crm/quotes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
          setQuotes((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newFromServer = data.quotes.filter((sq: any) => !existingIds.has(sq.id));
            if (newFromServer.length > 0) {
              const merged = [...newFromServer, ...prev];
              saveStoredQuotes(merged);
              return merged;
            }
            return prev;
          });
        }
      })
      .catch((err) => console.log('Notice: server quotes fetch optional check:', err));
  }, []);

  const handleSaveQuote = (updatedQuote: CrmQuoteItem) => {
    const updatedList = quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
    setQuotes(updatedList);
    saveStoredQuotes(updatedList);
    setSelectedQuote(updatedQuote);
  };

  const handleQuickChangeStatus = async (quoteId: string, newStatus: CrmQuoteStatus) => {
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote || targetQuote.status === newStatus) return;

    const previousStatus = targetQuote.status;
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const newHistory = {
      id: `hist-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      timestamp: now.toISOString(),
      author: `${operatorName} (${currentUserTier})`,
      action: `Cambio rápido a ${newStatus}`,
      note: `Estado modificado directamente desde la tabla de cotizaciones.`,
      fromStatus: previousStatus,
      toStatus: newStatus,
    };

    const updatedList = quotes.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: newStatus,
          history: [newHistory, ...(q.history || [])],
        };
      }
      return q;
    });

    setQuotes(updatedList);
    saveStoredQuotes(updatedList);

    // Audit log
    await logAuditEvent({
      action: 'CAMBIO_ESTADO',
      entityType: 'COTIZACION',
      entityId: targetQuote.id,
      entityTitle: `Cotización ${targetQuote.id}: ${targetQuote.clientName}`,
      authorName: operatorName,
      authorRole: currentUserTier,
      authorTier: currentUserTier,
      previousState: `Estado: ${previousStatus}`,
      newState: `Estado: ${newStatus}`,
      details: `Cambio rápido de estado en tabla comercial a "${newStatus}".`,
    });
  };

  const handleSoftDeleteQuote = async (quoteId: string, reason: string) => {
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote) return;

    const now = new Date().toISOString();
    const updatedList = quotes.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          isDeleted: true,
          deletedAt: now,
          deletedBy: operatorName,
          deleteReason: reason,
        };
      }
      return q;
    });

    setQuotes(updatedList);
    saveStoredQuotes(updatedList);

    await logAuditEvent({
      action: 'ELIMINACION_LOGICA',
      entityType: 'COTIZACION',
      entityId: targetQuote.id,
      entityTitle: `Cotización ${targetQuote.id}: ${targetQuote.clientName}`,
      authorName: operatorName,
      authorRole: currentUserTier,
      authorTier: currentUserTier,
      details: `Eliminación lógica / Archivo efectuado. Motivo obligatorio: "${reason}"`,
    });
  };

  const handleRestoreQuote = async (quoteId: string) => {
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote) return;

    const updatedList = quotes.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          isDeleted: false,
          deleteReason: undefined,
        };
      }
      return q;
    });

    setQuotes(updatedList);
    saveStoredQuotes(updatedList);

    await logAuditEvent({
      action: 'RESTAURACION',
      entityType: 'COTIZACION',
      entityId: targetQuote.id,
      entityTitle: `Cotización ${targetQuote.id}: ${targetQuote.clientName}`,
      authorName: operatorName,
      authorRole: currentUserTier,
      authorTier: currentUserTier,
      details: `Restauración de registro de cotización archivado a estado activo.`,
    });
  };

  const handleQuoteCreated = (newQuote: CrmQuoteItem) => {
    const updated = [newQuote, ...quotes.filter((q) => q.id !== newQuote.id)];
    setQuotes(updated);
    saveStoredQuotes(updated);
  };

  const handleSelectStatusFromDashboard = (status: string) => {
    setSelectedStatusFilter(status);
    setActiveTab('tabla');
  };

  const handleViewQuoteDetail = (quote: CrmQuoteItem) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-[#00677d] material-symbols-outlined text-2xl">
              chat_bubble
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>CRM AQUA-SALUD</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-[#00677d] font-bold">
                  FASE 10
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                  RBAC: {currentUserTier}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Gestión de cotizaciones, pipeline de ventas, seguimiento comercial e indicadores de laboratorio.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Navigation Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#00677d] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>Dashboard & Métricas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tabla')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tabla'
                  ? 'bg-white text-[#00677d] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">table_chart</span>
              <span>Tabla de Solicitudes ({quotes.filter(q => !q.isDeleted).length})</span>
            </button>
          </div>

          {/* Open Audit Center Button */}
          {onOpenAuditModal && (
            <button
              type="button"
              onClick={onOpenAuditModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-cyan-300 hover:bg-slate-800 text-xs font-bold border border-cyan-500/40 transition-all cursor-pointer"
              title="Abrir bitácora oficial inmutable de auditoría (D.S. N.° 031-2010-SA)"
            >
              <span className="material-symbols-outlined text-base text-[#10e7b2]">verified_user</span>
              <span>Auditoría SHA-256</span>
            </button>
          )}

          {/* New Quote button */}
          <button
            type="button"
            onClick={() => setIsNewQuoteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00677d] to-[#00b4d8] text-white text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* Main View Mode */}
      {activeTab === 'dashboard' ? (
        <CrmDashboard
          quotes={quotes}
          onSelectStatusFilter={handleSelectStatusFromDashboard}
        />
      ) : (
        <CrmTable
          quotes={quotes}
          selectedStatusFilter={selectedStatusFilter}
          onSelectStatusFilter={setSelectedStatusFilter}
          onViewQuoteDetail={handleViewQuoteDetail}
          onQuickChangeStatus={handleQuickChangeStatus}
          onSoftDeleteQuote={handleSoftDeleteQuote}
          onRestoreQuote={handleRestoreQuote}
          currentUserTier={currentUserTier}
        />
      )}

      {/* Detail Modal */}
      <CrmQuoteDetailModal
        quote={selectedQuote}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSaveQuote={handleSaveQuote}
        onSoftDeleteQuote={handleSoftDeleteQuote}
        onRestoreQuote={handleRestoreQuote}
        currentUserTier={currentUserTier}
        currentOperatorName={operatorName}
      />

      {/* Public / New Quote Modal */}
      <PublicQuoteModal
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onQuoteCreated={handleQuoteCreated}
      />
    </div>
  );
};

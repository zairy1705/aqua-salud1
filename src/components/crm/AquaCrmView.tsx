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
import { GlassTitlePanel } from '../GlassTitlePanel';

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
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge={`FASE 10 • CRM AQUA-SALUD • RBAC: ${currentUserTier}`}
        icon="support_agent"
        title="CRM COMERCIAL Y ATENCIÓN TÉCNICA"
        subtitle="Gestión de cotizaciones, pipeline de ventas, seguimiento comercial e indicadores de laboratorio. Trazabilidad rigurosa y atención comunitaria."
        stats={[
          {
            label: 'SOLICITUDES ACTIVAS',
            value: quotes.filter(q => !q.isDeleted).length,
            subtext: 'En cartera comercial',
          },
          {
            label: 'NUEVAS COTIZACIONES',
            value: quotes.filter(q => q.status === 'NUEVA' && !q.isDeleted).length,
            subtext: 'Por revisar',
            highlight: quotes.filter(q => q.status === 'NUEVA' && !q.isDeleted).length > 0,
          },
          {
            label: 'APROBADAS',
            value: quotes.filter(q => q.status === 'APROBADA' && !q.isDeleted).length,
            subtext: 'En ejecución',
          },
          {
            label: 'VOLUMEN COTIZADO',
            value: `S/ ${quotes.filter(q => !q.isDeleted).reduce((acc, q) => acc + (q.totalAmount || 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            subtext: 'Monto total proyectado',
          },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Open Audit Center Button */}
            {onOpenAuditModal && (
              <button
                type="button"
                onClick={onOpenAuditModal}
                className="glass-option-btn text-xs font-black uppercase tracking-wider text-cyan-700"
                title="Abrir bitácora oficial inmutable de auditoría (D.S. N.° 031-2010-SA)"
              >
                <span className="material-symbols-outlined text-base text-[#10e7b2]">verified_user</span>
                <span>AUDITORÍA SHA-256</span>
              </button>
            )}

            {/* New Quote button */}
            <button
              type="button"
              onClick={() => setIsNewQuoteModalOpen(true)}
              className="glass-option-btn-primary text-xs sm:text-sm font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>NUEVA SOLICITUD</span>
            </button>
          </div>
        }
      />

      {/* Navigation Tabs in Glass Style */}
      <div className="flex items-center gap-2 p-1.5 glass-title-panel rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'dashboard'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>DASHBOARD & MÉTRICAS</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tabla')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tabla'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <span className="material-symbols-outlined text-base">table_chart</span>
          <span>TABLA DE SOLICITUDES ({quotes.filter(q => !q.isDeleted).length})</span>
        </button>
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

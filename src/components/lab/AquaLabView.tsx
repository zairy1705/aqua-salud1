import React, { useState, useMemo } from 'react';
import { WaterSample, SampleStatus, WaterSystem, LabResultEntry } from '../../types';
import { logAuditEvent } from '../../data/auditStore';
import { NewSampleModal } from './NewSampleModal';
import { AddResultModal } from './AddResultModal';
import { ValidateSampleModal } from './ValidateSampleModal';
import { OfficialReportModal } from './OfficialReportModal';
import { LabHistoricalChart } from './LabHistoricalChart';
import { GlassTitlePanel } from '../GlassTitlePanel';

interface AquaLabViewProps {
  samples: WaterSample[];
  systems: WaterSystem[];
  onUpdateSamples: (updated: WaterSample[]) => void;
  onNavigateToJass?: (systemId: string) => void;
  onNavigateToMetals?: () => void;
  activeOperatorName?: string;
}

type LabViewTab = 'samples' | 'historical' | 'microbiology' | 'physicochemistry';

export const AquaLabView: React.FC<AquaLabViewProps> = ({
  samples,
  systems,
  onUpdateSamples,
  onNavigateToJass,
  onNavigateToMetals,
  activeOperatorName,
}) => {
  const [activeTab, setActiveTab] = useState<LabViewTab>('samples');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(samples[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jassFilter, setJassFilter] = useState<string>('all');
  const [dossierCategoryFilter, setDossierCategoryFilter] = useState<string>('all');

  // Modals
  const [isNewSampleOpen, setIsNewSampleOpen] = useState(false);
  const [isAddResultOpen, setIsAddResultOpen] = useState(false);
  const [isValidateOpen, setIsValidateOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Selected sample
  const selectedSample = useMemo(() => {
    return samples.find((s) => s.id === selectedSampleId) || samples[0] || null;
  }, [samples, selectedSampleId]);

  // Filtered samples
  const filteredSamples = useMemo(() => {
    return samples.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (jassFilter !== 'all' && s.jassName !== jassFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = s.code.toLowerCase().includes(q);
        const matchJass = s.jassName.toLowerCase().includes(q);
        const matchSys = s.systemName.toLowerCase().includes(q);
        const matchPoint = s.point.toLowerCase().includes(q);
        const matchResp = s.responsible.toLowerCase().includes(q);
        if (!matchCode && !matchJass && !matchSys && !matchPoint && !matchResp) {
          return false;
        }
      }
      return true;
    });
  }, [samples, statusFilter, jassFilter, searchQuery]);

  // Unique JASS list for filter
  const uniqueJassList = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.jassName)));
  }, [samples]);

  // Metrics
  const metrics = useMemo(() => {
    const total = samples.length;
    const recibidas = samples.filter((s) => s.status === 'recibida').length;
    const enAnalisis = samples.filter((s) => s.status === 'en_analisis').length;
    const pendientes = samples.filter((s) => s.status === 'pendiente_validacion').length;
    const validadas = samples.filter((s) => s.status === 'validada').length;
    const emitidas = samples.filter((s) => s.status === 'informe_emitido').length;

    const totalWithResults = samples.filter((s) => s.results.length > 0);
    const compliantCount = totalWithResults.filter((s) =>
      s.results.every((r) => r.compliant !== false)
    ).length;
    const complianceRate = totalWithResults.length > 0
      ? Math.round((compliantCount / totalWithResults.length) * 100)
      : 100;

    return { total, recibidas, enAnalisis, pendientes, validadas, emitidas, complianceRate };
  }, [samples]);

  // Handlers
  const handleSaveNewSample = (newSample: WaterSample) => {
    const updated = [newSample, ...samples];
    onUpdateSamples(updated);
    setSelectedSampleId(newSample.id);

    logAuditEvent({
      action: 'CREACION',
      entityType: 'MUESTRA_LAB',
      entityId: newSample.id,
      entityTitle: `Muestra ${newSample.code}: ${newSample.jassName}`,
      authorName: activeOperatorName || 'Analista de Laboratorio',
      authorRole: 'Analista de Laboratorio',
      authorTier: 'OPERADOR',
      details: `Recepción e ingreso de muestra analítica matriz agua de ${newSample.jassName} (${newSample.origin}). Punto de muestreo: ${newSample.point}.`,
    }).catch((err) => console.warn('Audit error:', err));
  };

  const handleStartAnalysis = (sampleId: string) => {
    const targetSample = samples.find((s) => s.id === sampleId);
    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          status: 'en_analisis' as SampleStatus,
          chainOfCustody: {
            ...s.chainOfCustody,
            analisis: {
              completed: true,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toTimeString().substring(0, 5),
              responsible: activeOperatorName || 'Blga. Andrea Solano (Analista de Laboratorio)',
              locationOrEntity: 'Laboratorio Central de Ensayo',
              observations: 'Ensayos analíticos iniciados.',
            },
          },
        };
      }
      return s;
    });
    onUpdateSamples(updated);

    if (targetSample) {
      logAuditEvent({
        action: 'CAMBIO_ESTADO',
        entityType: 'MUESTRA_LAB',
        entityId: targetSample.id,
        entityTitle: `Muestra ${targetSample.code}: ${targetSample.jassName}`,
        authorName: activeOperatorName || 'Analista de Laboratorio',
        authorRole: 'Analista de Laboratorio',
        authorTier: 'OPERADOR',
        previousState: `Estado: ${targetSample.status}`,
        newState: 'Estado: en_analisis',
        details: 'Inicio de ensayos de laboratorio y custodia analítica.',
      }).catch((err) => console.warn('Audit error:', err));
    }
  };

  const handleSaveResult = (newResult: any) => {
    if (!selectedSample) return;
    const updated = samples.map((s) => {
      if (s.id === selectedSample.id) {
        const nextResults = [...s.results, newResult];
        return {
          ...s,
          results: nextResults,
          // If was in 'recibida', entering a result naturally puts it into 'en_analisis'
          status: s.status === 'recibida' ? ('en_analisis' as SampleStatus) : s.status,
        };
      }
      return s;
    });
    onUpdateSamples(updated);

    logAuditEvent({
      action: 'MODIFICACION',
      entityType: 'MUESTRA_LAB',
      entityId: selectedSample.id,
      entityTitle: `Muestra ${selectedSample.code}: ${selectedSample.jassName}`,
      authorName: activeOperatorName || 'Analista de Laboratorio',
      authorRole: 'Analista de Laboratorio',
      authorTier: 'OPERADOR',
      details: `Parámetro analítico registrado: ${newResult.parameter} = ${newResult.value} ${newResult.unit} (${newResult.compliant ? 'Conforme' : 'No Conforme'}).`,
    }).catch((err) => console.warn('Audit error:', err));
  };

  const handleDeleteResult = (resultId: string) => {
    if (!selectedSample) return;
    const targetResult = selectedSample.results.find((r) => r.id === resultId);
    const updated = samples.map((s) => {
      if (s.id === selectedSample.id) {
        return {
          ...s,
          results: s.results.filter((r) => r.id !== resultId),
        };
      }
      return s;
    });
    onUpdateSamples(updated);

    logAuditEvent({
      action: 'MODIFICACION',
      entityType: 'MUESTRA_LAB',
      entityId: selectedSample.id,
      entityTitle: `Muestra ${selectedSample.code}: ${selectedSample.jassName}`,
      authorName: activeOperatorName || 'Analista de Laboratorio',
      authorRole: 'Analista de Laboratorio',
      authorTier: 'OPERADOR',
      details: `Resultado eliminado: ${targetResult?.parameter || resultId}.`,
    }).catch((err) => console.warn('Audit error:', err));
  };

  const handleSendToValidation = (sampleId: string) => {
    const targetSample = samples.find((s) => s.id === sampleId);
    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          status: 'pendiente_validacion' as SampleStatus,
        };
      }
      return s;
    });
    onUpdateSamples(updated);

    if (targetSample) {
      logAuditEvent({
        action: 'CAMBIO_ESTADO',
        entityType: 'MUESTRA_LAB',
        entityId: targetSample.id,
        entityTitle: `Muestra ${targetSample.code}: ${targetSample.jassName}`,
        authorName: activeOperatorName || 'Analista de Laboratorio',
        authorRole: 'Analista de Laboratorio',
        authorTier: 'OPERADOR',
        previousState: `Estado: ${targetSample.status}`,
        newState: 'Estado: pendiente_validacion',
        details: 'Ensayos concluidos. Solicitud de validación técnica formal emitida a QA/QC.',
      }).catch((err) => console.warn('Audit error:', err));
    }
  };

  const handleConfirmValidation = (
    sampleId: string,
    validatorName: string,
    validatorRole: string,
    remarks: string,
    authCode: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().substring(0, 5);

    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          status: 'validada' as SampleStatus,
          validatedBy: validatorName,
          validatorRole: validatorRole,
          validatedAt: new Date().toISOString(),
          validationRemarks: remarks,
          chainOfCustody: {
            ...s.chainOfCustody,
            validacion: {
              completed: true,
              date: today,
              time: nowTime,
              responsible: validatorName,
              signatureOrAuthCode: authCode,
              observations: remarks,
            },
          },
        };
      }
      return s;
    });
    onUpdateSamples(updated);
  };

  const handleEmitReport = (sampleId: string, reportNumber: string, recipient: string) => {
    const targetSample = samples.find((s) => s.id === sampleId);
    const updated = samples.map((s) => {
      if (s.id === sampleId) {
        return {
          ...s,
          status: 'informe_emitido' as SampleStatus,
          reportNumber,
          reportIssuedAt: new Date().toISOString(),
          reportRecipient: recipient,
        };
      }
      return s;
    });
    onUpdateSamples(updated);

    if (targetSample) {
      logAuditEvent({
        action: 'CAMBIO_ESTADO',
        entityType: 'MUESTRA_LAB',
        entityId: targetSample.id,
        entityTitle: `Muestra ${targetSample.code}: ${targetSample.jassName}`,
        authorName: activeOperatorName || 'Director Técnico',
        authorRole: 'Director Técnico de Laboratorio',
        authorTier: 'SUPERVISOR',
        previousState: `Estado: ${targetSample.status}`,
        newState: 'Estado: informe_emitido',
        details: `Informe oficial de ensayo emitido: Nº ${reportNumber}, destinatario: ${recipient}.`,
      }).catch((err) => console.warn('Audit error:', err));
    }
  };

  const getStatusBadge = (status: SampleStatus) => {
    switch (status) {
      case 'recibida':
        return {
          label: 'Muestra Recibida',
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: 'inbox',
        };
      case 'en_analisis':
        return {
          label: 'En Análisis',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: 'science',
        };
      case 'pendiente_validacion':
        return {
          label: 'Pendiente de Validación',
          bg: 'bg-orange-100 text-orange-900 border-orange-300 font-bold',
          icon: 'pending',
        };
      case 'validada':
        return {
          label: 'Validada',
          bg: 'bg-teal-100 text-teal-900 border-teal-300 font-bold',
          icon: 'verified',
        };
      case 'informe_emitido':
        return {
          label: 'Informe Emitido',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          icon: 'assignment_turned_in',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 3 • LABORATORIO OFICIAL • D.S. N.° 031-2010-SA • SMEWW"
        icon="biotech"
        title="AQUA-LAB • GESTIÓN DE LABORATORIO Y CADENA DE CUSTODIA"
        subtitle="Gestión digital del laboratorio de agua conectado a AQUA-JASS. Trazabilidad integral de muestras, 5 etapas de cadena de custodia, registro de ensayos analíticos y validación técnica formal conforme al D.S. N.° 031-2010-SA."
        stats={[
          {
            label: 'TOTAL MUESTRAS',
            value: metrics.total,
            subtext: 'En bitácora analítica',
          },
          {
            label: 'RECIBIDAS',
            value: metrics.recibidas,
            subtext: 'Mesa de entrada',
          },
          {
            label: 'EN ANÁLISIS',
            value: metrics.enAnalisis,
            subtext: 'Ensayos en ejecución',
          },
          {
            label: 'PENDIENTE VALIDACIÓN',
            value: metrics.pendientes,
            subtext: 'Revisión Dir. Técnico',
            highlight: metrics.pendientes > 0,
          },
          {
            label: 'INFORMES EMITIDOS',
            value: metrics.emitidas,
            subtext: 'Certificación oficial',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewSampleOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-[#004e5f] font-hud text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ NUEVA MUESTRA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className="px-4 py-2.5 rounded-xl bg-[#10e7b2]/20 hover:bg-[#10e7b2]/30 border border-[#10e7b2]/40 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#10e7b2]">verified_user</span>
              <span>CADENA DE CUSTODIA (5 ETAPAS)</span>
            </button>

            {onNavigateToMetals && (
              <button
                type="button"
                onClick={onNavigateToMetals}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
                title="Abrir Módulo de Metales Pesados y Elementos Traza"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-300">science</span>
                <span>AQUA-METALS</span>
              </button>
            )}
          </div>
        }
      />

      {/* Chain Connection Architecture Diagram in Glass Style */}
      <div className="glass-title-panel rounded-2xl p-4">
        <div className="flex items-center gap-2 text-[11px] font-black text-cyan-900 uppercase tracking-wider mb-2.5">
          <span className="material-symbols-outlined text-[16px] text-cyan-700">hub</span>
          <span>TRAZABILIDAD TERRITORIAL CONECTADA:</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10.5px]">
          {[
            { step: '1', title: 'JASS', desc: 'Comunidad Rural', icon: 'holiday_village' },
            { step: '2', title: 'SISTEMA', desc: 'Reservorio / Pozo', icon: 'water' },
            { step: '3', title: 'PUNTO', desc: 'Grifo / Salida', icon: 'pin_drop' },
            { step: '4', title: 'MUESTRA', desc: 'Código & Custodia', icon: 'science' },
            { step: '5', title: 'ANÁLISIS', desc: 'Ensayos SMEWW', icon: 'biotech' },
            { step: '6', title: 'RESULTADO', desc: 'Validación & Dictamen', icon: 'verified' },
          ].map((node, i) => (
            <div
              key={node.title}
              className="p-2.5 rounded-xl bg-white/70 border border-white/90 shadow-xs flex flex-col items-center justify-center"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-800 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[14px]">{node.icon}</span>
              </div>
              <span className="font-hud font-black text-[10.5px] text-slate-900 tracking-wider">
                {node.title}
              </span>
              <span className="text-[9.5px] text-slate-500">{node.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase font-hud block mb-1">
            Total Muestras
          </span>
          <div className="font-hud font-black text-[22px] text-slate-800">
            {metrics.total}
          </div>
          <span className="text-[10px] text-slate-400">En bitácora lab</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-[10.5px] font-bold text-blue-700 uppercase font-hud block mb-1">
            Recibidas
          </span>
          <div className="font-hud font-black text-[22px] text-blue-600">
            {metrics.recibidas}
          </div>
          <span className="text-[10px] text-blue-400">En mesa de entrada</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-[10.5px] font-bold text-amber-700 uppercase font-hud block mb-1">
            En Análisis
          </span>
          <div className="font-hud font-black text-[22px] text-amber-600">
            {metrics.enAnalisis}
          </div>
          <span className="text-[10px] text-amber-500">En ejecución técnica</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-orange-200 shadow-xs">
          <span className="text-[10.5px] font-bold text-orange-700 uppercase font-hud block mb-1">
            Pendiente Val.
          </span>
          <div className="font-hud font-black text-[22px] text-orange-600">
            {metrics.pendientes}
          </div>
          <span className="text-[10px] text-orange-500">Por Dir. Técnico</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-teal-100 shadow-xs">
          <span className="text-[10.5px] font-bold text-teal-700 uppercase font-hud block mb-1">
            Validadas
          </span>
          <div className="font-hud font-black text-[22px] text-teal-600">
            {metrics.validadas}
          </div>
          <span className="text-[10px] text-teal-500">Aprobación técnica</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[10.5px] font-bold text-emerald-700 uppercase font-hud block mb-1">
            Informes Emitidos
          </span>
          <div className="font-hud font-black text-[22px] text-emerald-600">
            {metrics.emitidas}
          </div>
          <span className="text-[10px] text-emerald-500">Con certificación</span>
        </div>
      </div>

      {/* Tab Navigation: Muestras / Históricos / Microbiología / Fisicoquímica */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 glass-title-panel rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'samples'
                ? 'glass-option-btn-primary'
                : 'glass-option-btn'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">inventory_2</span>
            <span>MUESTRAS & CUSTODIA ({samples.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historical')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'historical'
                ? 'glass-option-btn-primary'
                : 'glass-option-btn'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">monitoring</span>
            <span>GRÁFICOS HISTÓRICOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('microbiology')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'microbiology'
                ? 'glass-option-btn-primary'
                : 'glass-option-btn'
            }`}
          >
            <span className="text-[14px]">🦠</span>
            <span>MICROBIOLOGÍA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('physicochemistry')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'physicochemistry'
                ? 'glass-option-btn-primary'
                : 'glass-option-btn'
            }`}
          >
            <span className="text-[14px]">⚗️</span>
            <span>FISICOQUÍMICA</span>
          </button>

          {onNavigateToMetals && (
            <button
              type="button"
              onClick={onNavigateToMetals}
              className="glass-option-btn text-xs font-black uppercase tracking-wider"
            >
              <span className="text-[14px]">☣️</span>
              <span>AQUA-METALS</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden md:block">
          D.S. N.° 031-2010-SA • Relación: <strong>JASS → Sistema → Punto → Muestra</strong>
        </div>
      </div>

      {/* Conditional Content by Active Tab */}
      {activeTab === 'historical' && (
        <LabHistoricalChart samples={samples} />
      )}

      {activeTab === 'microbiology' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 material-symbols-outlined text-[20px]">
                  coronavirus
                </span>
                <div>
                  <h2 className="font-hud font-black text-[18px] sm:text-[20px] text-slate-900">
                    🦠 VIGILANCIA MICROBIOLÓGICA (INOCUIDAD BIOLÓGICA)
                  </h2>
                  <p className="text-[12px] text-slate-500">
                    Control estricto de E. coli, Coliformes Totales y Bacterias Heterotróficas según <strong>D.S. N.° 031-2010-SA (LMP = 0 NMP/100mL)</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('samples');
                if (selectedSample) setIsAddResultOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-hud text-[11px] font-bold uppercase transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Nuevo Ensayo Microbiológico</span>
            </button>
          </div>

          {/* Three Pillars Explanation Banner */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-[12px] space-y-2">
            <div className="font-hud font-bold text-[11.5px] uppercase tracking-wider text-purple-950 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-700 text-[16px]">shield</span>
              <span>Criterio Sanitario Obligatorio en Microbiología</span>
            </div>
            <p className="text-purple-900 leading-relaxed">
              La presencia de <strong>Escherichia coli</strong> o <strong>Coliformes totales</strong> representa una contaminación de origen fecal reciente y genera un <strong>RIESGO SANITARIO ALTO O CRÍTICO</strong> para la población (EDA, parasitosis, brotes hídricos). El límite regulatorio es absoluto (<strong>0 / 100 mL</strong>).
            </p>
          </div>

          {/* All microbiological results table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-hud text-[10.5px] uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Muestra & Fecha</th>
                    <th className="py-2.5 px-3">JASS → Sistema → Punto</th>
                    <th className="py-2.5 px-3">Parámetro</th>
                    <th className="py-2.5 px-3 bg-purple-50/50">1. Resultado Analítico</th>
                    <th className="py-2.5 px-3 bg-emerald-50/50">2. Cumplimiento Normativo</th>
                    <th className="py-2.5 px-3 bg-amber-50/50">3. Riesgo Sanitario</th>
                    <th className="py-2.5 px-3">Método & Equipo</th>
                    <th className="py-2.5 px-3 text-center">Expediente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {samples.flatMap((smp) =>
                    smp.results
                      .filter((r) => r.category === 'microbiologico' || r.parameter.toLowerCase().includes('coli') || r.parameter.toLowerCase().includes('bacteria'))
                      .map((res) => {
                        const complianceVal = res.compliance || (res.compliant ? 'cumple' : 'no_cumple');
                        const healthRiskVal = res.healthRisk || (res.compliant ? 'sin_riesgo' : 'riesgo_critico');

                        return (
                          <tr key={`${smp.id}-${res.id}`} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-mono">
                              <span className="font-bold text-cyan-800 text-[12px] block">{smp.code}</span>
                              <span className="text-[10px] text-slate-400">{smp.date}</span>
                            </td>

                            <td className="py-2.5 px-3 text-slate-700">
                              <div className="font-bold text-slate-900">{smp.jassName}</div>
                              <div className="text-[11px] text-slate-600">{smp.systemName}</div>
                              <div className="text-[10.5px] text-slate-400">{smp.point}</div>
                            </td>

                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              <span className="mr-1">🦠</span>
                              <span>{res.parameter}</span>
                            </td>

                            <td className="py-2.5 px-3 bg-purple-50/20 font-mono font-bold text-[13px] text-slate-900">
                              {res.result} <span className="text-[10.5px] font-normal text-slate-600">{res.unit}</span>
                            </td>

                            <td className="py-2.5 px-3 bg-emerald-50/20">
                              <div className="flex items-center gap-1.5">
                                {complianceVal === 'cumple' ? (
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    ✓ CUMPLE
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    ✗ NO CUMPLE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                LMP: {res.configuredCriteria || res.normativeLimit || '0 / 100 mL'}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 bg-amber-50/20">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-hud font-bold uppercase ${
                                  healthRiskVal === 'sin_riesgo'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-900 border border-rose-400 font-extrabold'
                                }`}
                              >
                                {healthRiskVal.replace('_', ' ')}
                              </span>
                              <div className="text-[10px] text-slate-600 mt-0.5 truncate max-w-[180px]" title={res.healthRiskDescription}>
                                {res.healthRiskDescription}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-[10.5px] text-slate-500">
                              <div>{res.method}</div>
                              <div className="text-[9.5px] text-slate-400">{res.equipment}</div>
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSampleId(smp.id);
                                  setActiveTab('samples');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-hud font-bold uppercase transition-colors cursor-pointer"
                              >
                                Ver
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'physicochemistry' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 material-symbols-outlined text-[20px]">
                  science
                </span>
                <div>
                  <h2 className="font-hud font-black text-[18px] sm:text-[20px] text-slate-900">
                    ⚗️ VIGILANCIA FISICOQUÍMICA & DESINFECCIÓN
                  </h2>
                  <p className="text-[12px] text-slate-500">
                    pH, Turbidez, Conductividad, Cloro libre residual, Metales e Inorgánicos según <strong>D.S. N.° 031-2010-SA</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('samples');
                if (selectedSample) setIsAddResultOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-hud text-[11px] font-bold uppercase transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>+ Nuevo Ensayo Fisicoquímico</span>
            </button>
          </div>

          {/* Three Pillars Explanation Banner */}
          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-[12px] space-y-2">
            <div className="font-hud font-bold text-[11.5px] uppercase tracking-wider text-cyan-950 flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-700 text-[16px]">science</span>
              <span>Evaluación de Ensayos Físico-Químicos</span>
            </div>
            <p className="text-cyan-900 leading-relaxed">
              Comprende parámetros de control operacional y organoléptico (pH 6.5–8.5, Turbidez ≤ 5 NTU, Cloro 0.5–2.0 mg/L) e inorgánicos de significancia para la salud (Nitratos, Sulfatos, Hierro, Manganeso). Los límites aplicados provienen de la normativa técnica vigente.
            </p>
          </div>

          {/* All physicochemical results table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-hud text-[10.5px] uppercase border-b border-slate-200">
                    <th className="py-2.5 px-3">Muestra & Fecha</th>
                    <th className="py-2.5 px-3">JASS → Sistema → Punto</th>
                    <th className="py-2.5 px-3">Parámetro</th>
                    <th className="py-2.5 px-3 bg-cyan-50/50">1. Resultado Analítico</th>
                    <th className="py-2.5 px-3 bg-emerald-50/50">2. Cumplimiento Normativo</th>
                    <th className="py-2.5 px-3 bg-amber-50/50">3. Riesgo Sanitario</th>
                    <th className="py-2.5 px-3">Método & Equipo</th>
                    <th className="py-2.5 px-3 text-center">Expediente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {samples.flatMap((smp) =>
                    smp.results
                      .filter((r) => r.category !== 'microbiologico' && !r.parameter.toLowerCase().includes('coli') && !r.parameter.toLowerCase().includes('bacteria'))
                      .map((res) => {
                        const complianceVal = res.compliance || (res.compliant ? 'cumple' : 'no_cumple');
                        const healthRiskVal = res.healthRisk || (res.compliant ? 'sin_riesgo' : 'riesgo_medio');

                        return (
                          <tr key={`${smp.id}-${res.id}`} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-mono">
                              <span className="font-bold text-cyan-800 text-[12px] block">{smp.code}</span>
                              <span className="text-[10px] text-slate-400">{smp.date}</span>
                            </td>

                            <td className="py-2.5 px-3 text-slate-700">
                              <div className="font-bold text-slate-900">{smp.jassName}</div>
                              <div className="text-[11px] text-slate-600">{smp.systemName}</div>
                              <div className="text-[10.5px] text-slate-400">{smp.point}</div>
                            </td>

                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              <span className="mr-1">{res.category === 'inorganico_metales' ? '🔬' : '⚗️'}</span>
                              <span>{res.parameter}</span>
                            </td>

                            <td className="py-2.5 px-3 bg-cyan-50/20 font-mono font-bold text-[13px] text-slate-900">
                              {res.result} <span className="text-[10.5px] font-normal text-slate-600">{res.unit}</span>
                            </td>

                            <td className="py-2.5 px-3 bg-emerald-50/20">
                              <div className="flex items-center gap-1.5">
                                {complianceVal === 'cumple' ? (
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    ✓ CUMPLE
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    ✗ NO CUMPLE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                LMP: {res.configuredCriteria || res.normativeLimit}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 bg-amber-50/20">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-hud font-bold uppercase ${
                                  healthRiskVal === 'sin_riesgo'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : healthRiskVal === 'riesgo_bajo'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-orange-100 text-orange-900 border border-orange-300'
                                }`}
                              >
                                {healthRiskVal.replace('_', ' ')}
                              </span>
                              <div className="text-[10px] text-slate-600 mt-0.5 truncate max-w-[180px]" title={res.healthRiskDescription}>
                                {res.healthRiskDescription}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-[10.5px] text-slate-500">
                              <div>{res.method}</div>
                              <div className="text-[9.5px] text-slate-400">{res.equipment}</div>
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSampleId(smp.id);
                                  setActiveTab('samples');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-hud font-bold uppercase transition-colors cursor-pointer"
                              >
                                Ver
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace: Left Sample Browser & Right Sample Dossier */}
      {activeTab === 'samples' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Samples List & Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código, JASS, sistema o responsable..."
                className="w-full pl-9 pr-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-hud mb-1">
                  Filtrar Estado:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-[11.5px] rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Todos los Estados ({samples.length})</option>
                  <option value="recibida">Muestra recibida</option>
                  <option value="en_analisis">En análisis</option>
                  <option value="pendiente_validacion">Pendiente de validación</option>
                  <option value="validada">Validada</option>
                  <option value="informe_emitido">Informe emitido</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-hud mb-1">
                  Filtrar JASS:
                </label>
                <select
                  value={jassFilter}
                  onChange={(e) => setJassFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-[11.5px] rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Todas las JASS</option>
                  {uniqueJassList.map((jass) => (
                    <option key={jass} value={jass}>
                      {jass}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sample Cards List */}
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredSamples.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400">
                <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2 block">
                  science
                </span>
                <p className="text-[13px] font-bold">No se encontraron muestras</p>
                <p className="text-[11.5px] mt-1">Pruebe ajustando los filtros o registre una nueva muestra.</p>
              </div>
            ) : (
              filteredSamples.map((smp) => {
                const isSelected = smp.id === selectedSample?.id;
                const statusInfo = getStatusBadge(smp.status);
                const hasNonCompliant = smp.results.some((r) => r.compliant === false);

                return (
                  <button
                    key={smp.id}
                    onClick={() => setSelectedSampleId(smp.id)}
                    type="button"
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50/80 border-[#00b4d8] shadow-md ring-2 ring-[#00b4d8]/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono font-black text-[13.5px] text-[#00677d]">
                        {smp.code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-hud px-2 py-0.5 rounded-full border ${statusInfo.bg}`}
                      >
                        <span className="material-symbols-outlined text-[12px]">{statusInfo.icon}</span>
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div className="font-hud font-bold text-[13px] text-slate-900 truncate mb-1">
                      {smp.jassName}
                    </div>

                    <div className="text-[11.5px] text-slate-600 truncate mb-2">
                      <span className="text-slate-400 font-semibold">Sistema:</span> {smp.systemName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{smp.date}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-teal-600">biotech</span>
                        <span>{smp.results.length} ensayos</span>
                        {hasNonCompliant && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" title="Excede LMP" />
                        )}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Sample Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedSample ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono font-black text-[20px] text-[#00677d]">
                      {selectedSample.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-hud px-2.5 py-0.5 rounded-full border ${
                        getStatusBadge(selectedSample.status).bg
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {getStatusBadge(selectedSample.status).icon}
                      </span>
                      <span>{getStatusBadge(selectedSample.status).label}</span>
                    </span>

                    {selectedSample.reportNumber && (
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {selectedSample.reportNumber}
                      </span>
                    )}
                  </div>

                  <h2 className="font-hud font-bold text-[16px] text-slate-900">
                    {selectedSample.jassName}
                  </h2>
                  <p className="text-[12px] text-slate-500">
                    {selectedSample.systemName} • {selectedSample.origin}
                  </p>
                </div>

                {/* Primary Action Buttons depending on status */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedSample.status === 'recibida' && (
                    <button
                      type="button"
                      onClick={() => handleStartAnalysis(selectedSample.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-800 hover:bg-cyan-900 text-white font-hud text-[11.5px] font-bold uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      <span>Iniciar Análisis</span>
                    </button>
                  )}

                  {selectedSample.status === 'en_analisis' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsAddResultOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-300 font-hud text-[11px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>+ Ensayo</span>
                      </button>

                      {selectedSample.results.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSendToValidation(selectedSample.id)}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-hud text-[11.5px] font-bold uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>Enviar a Validación</span>
                        </button>
                      )}
                    </>
                  )}

                  {selectedSample.status === 'pendiente_validacion' && (
                    <button
                      type="button"
                      onClick={() => setIsValidateOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-hud text-[11.5px] font-extrabold uppercase shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>Validar Muestra</span>
                    </button>
                  )}

                  {(selectedSample.status === 'validada' || selectedSample.status === 'informe_emitido') && (
                    <button
                      type="button"
                      onClick={() => setIsReportOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00677d] to-[#004e5f] hover:from-[#004e5f] hover:to-[#003440] text-white font-hud text-[11.5px] font-bold uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>Ver Informe Oficial</span>
                    </button>
                  )}

                  {onNavigateToJass && (
                    <button
                      type="button"
                      onClick={() => onNavigateToJass(selectedSample.systemId)}
                      title="Ver sistema en AQUA-JASS"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-hud font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#00b4d8]">water_drop</span>
                      <span>Ir a AQUA-JASS</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Identification details */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <h3 className="font-hud font-bold text-[12px] uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00b4d8] text-[16px]">info</span>
                  <span>Ficha de Identificación de Muestra</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
                  <div>
                    <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Punto de Muestreo:</span>
                    <span className="font-semibold text-slate-800">{selectedSample.point}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Fecha y Hora de Toma:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedSample.date} • {selectedSample.time} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Tomador / Responsable:</span>
                    <span className="font-semibold text-slate-800">{selectedSample.responsible}</span>
                  </div>
                  <div className="sm:col-span-3 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Observaciones de Campo:</span>
                    <span className="text-slate-700">{selectedSample.observations || 'Sin observaciones.'}</span>
                  </div>
                </div>
              </div>

              {/* Cadena de Custodia (5 Etapas) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-hud font-bold text-[12px] uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-teal-600 text-[18px]">verified_user</span>
                    <span>Cadena de Custodia (5 Etapas Estándar)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Precinto: <strong>{selectedSample.chainOfCustody.toma.sealNumber || 'N/A'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                  {/* Etapa 1: Toma */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      selectedSample.chainOfCustody.toma.completed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hud font-bold text-[11px] uppercase text-slate-700">1. Toma</span>
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{selectedSample.chainOfCustody.toma.date || selectedSample.date}</div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                      {selectedSample.chainOfCustody.toma.responsible}
                    </div>
                    <div className="text-[9.5px] text-emerald-800 font-mono mt-1">
                      T: {selectedSample.chainOfCustody.toma.temperatureC ?? 18.0}°C
                    </div>
                  </div>

                  {/* Etapa 2: Transporte */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      selectedSample.chainOfCustody.transporte.completed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hud font-bold text-[11px] uppercase text-slate-700">2. Transporte</span>
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Cadena de Frío</div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                      {selectedSample.chainOfCustody.transporte.responsible}
                    </div>
                    <div className="text-[9.5px] text-teal-700 font-mono mt-1">Cooler ≤ 4°C</div>
                  </div>

                  {/* Etapa 3: Recepción */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      selectedSample.chainOfCustody.recepcion.completed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hud font-bold text-[11px] uppercase text-slate-700">3. Recepción</span>
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{selectedSample.chainOfCustody.recepcion.date || selectedSample.date}</div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                      {selectedSample.chainOfCustody.recepcion.responsible}
                    </div>
                    <div className="text-[9.5px] text-slate-600 mt-1">Frasco Verificado</div>
                  </div>

                  {/* Etapa 4: Análisis */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      selectedSample.chainOfCustody.analisis.completed || selectedSample.results.length > 0
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : selectedSample.status === 'en_analisis'
                        ? 'bg-amber-50 border-amber-300 animate-pulse'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hud font-bold text-[11px] uppercase text-slate-700">4. Análisis</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {selectedSample.results.length > 0 ? 'check_circle' : 'science'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {selectedSample.results.length} Ensayos
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                      {selectedSample.results[0]?.analyst || selectedSample.chainOfCustody.analisis.responsible}
                    </div>
                    <div className="text-[9.5px] text-cyan-800 font-mono mt-1">SMEWW Calibrado</div>
                  </div>

                  {/* Etapa 5: Validación */}
                  <div
                    className={`p-3 rounded-2xl border ${
                      selectedSample.chainOfCustody.validacion.completed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : selectedSample.status === 'pendiente_validacion'
                        ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-200 animate-pulse'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-hud font-bold text-[11px] uppercase text-slate-700">5. Validación</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {selectedSample.chainOfCustody.validacion.completed ? 'check_circle' : 'gavel'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {selectedSample.chainOfCustody.validacion.completed ? 'Aprobado' : 'Pendiente'}
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                      {selectedSample.validatedBy || 'Dir. Técnico'}
                    </div>
                    <div className="text-[9.5px] text-teal-800 font-mono mt-1">
                      {selectedSample.chainOfCustody.validacion.signatureOrAuthCode || 'Firma Oficial'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados de Ensayos Analíticos */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-hud font-bold text-[13px] uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">biotech</span>
                      <span>Resultados de Ensayos Analíticos</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Evaluación técnica contra D.S. N.° 031-2010-SA • No se inventan resultados
                    </span>
                  </div>

                  {(selectedSample.status === 'en_analisis' || selectedSample.status === 'recibida') && (
                    <button
                      type="button"
                      onClick={() => setIsAddResultOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-hud text-[11px] font-bold uppercase transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Registrar Resultado</span>
                    </button>
                  )}
                </div>

                {selectedSample.results.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-500">
                    <span className="material-symbols-outlined text-[32px] text-slate-400 mb-1.5 block">
                      hourglass_top
                    </span>
                    <p className="font-bold text-[13px] text-slate-700">
                      {selectedSample.status === 'recibida'
                        ? 'Muestra Recibida en Laboratorio'
                        : 'Muestra En Proceso de Análisis'}
                    </p>
                    <p className="text-[12px] max-w-md mx-auto mt-1">
                      Esta muestra no posee resultados inventados. Inicie los ensayos fisicoquímicos o microbiológicos y registre los valores obtenidos con sus respectivos equipos y métodos normalizados.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddResultOpen(true)}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#00b4d8] hover:bg-[#009bb8] text-white font-hud text-[11px] font-bold uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>Registrar Primer Parámetro</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Category Filter Pills inside dossier */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-[11px] font-hud">
                      <button
                        type="button"
                        onClick={() => setDossierCategoryFilter('all')}
                        className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                          dossierCategoryFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Todos ({selectedSample.results.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDossierCategoryFilter('microbiologico')}
                        className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                          dossierCategoryFilter === 'microbiologico'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🦠 Microbiología</span>
                        <span className="font-mono text-[10px] opacity-75">
                          ({selectedSample.results.filter((r) => r.category === 'microbiologico').length})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDossierCategoryFilter('fisicoquimico')}
                        className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                          dossierCategoryFilter === 'fisicoquimico'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>⚗️ Fisicoquímica</span>
                        <span className="font-mono text-[10px] opacity-75">
                          ({selectedSample.results.filter((r) => r.category === 'fisicoquimico').length})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDossierCategoryFilter('inorganico_metales')}
                        className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                          dossierCategoryFilter === 'inorganico_metales'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🔬 Metales / Otros</span>
                        <span className="font-mono text-[10px] opacity-75">
                          ({selectedSample.results.filter((r) => r.category === 'inorganico_metales').length})
                        </span>
                      </button>
                    </div>

                    {/* Three Pillars Table */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-[12px] border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-hud text-[10.5px] uppercase">
                              <th className="py-2.5 px-3">Parámetro & Ensayo</th>
                              <th className="py-2.5 px-3 bg-cyan-50/60 text-cyan-950">
                                1. Resultado Analítico
                              </th>
                              <th className="py-2.5 px-3 bg-emerald-50/60 text-emerald-950">
                                2. Cumplimiento Normativo
                              </th>
                              <th className="py-2.5 px-3 bg-amber-50/60 text-amber-950">
                                3. Riesgo Sanitario
                              </th>
                              <th className="py-2.5 px-3">Observación</th>
                              {(selectedSample.status === 'recibida' || selectedSample.status === 'en_analisis') && (
                                <th className="py-2.5 px-3 text-center">Acción</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedSample.results
                              .filter((r) => dossierCategoryFilter === 'all' || r.category === dossierCategoryFilter)
                              .map((res) => {
                                const complianceVal = res.compliance || (res.compliant ? 'cumple' : 'no_cumple');
                                const healthRiskVal = res.healthRisk || (res.compliant ? 'sin_riesgo' : 'riesgo_alto');

                                return (
                                  <tr key={res.id} className="hover:bg-slate-50/80">
                                    {/* Parámetro & Ensayo */}
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                        <span>
                                          {res.category === 'microbiologico' ? '🦠' : res.category === 'inorganico_metales' ? '🔬' : '⚗️'}
                                        </span>
                                        <span>{res.parameter}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        {res.method}
                                      </div>
                                      <div className="text-[9.5px] text-slate-400 font-mono">
                                        Eq: {res.equipment}
                                      </div>
                                    </td>

                                    {/* 1. Resultado Analítico */}
                                    <td className="py-2.5 px-3 bg-cyan-50/20">
                                      <div className="font-mono font-black text-[14px] text-cyan-950">
                                        {res.result} <span className="text-[11px] font-normal text-cyan-700">{res.unit}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        Por: <strong>{res.analyst}</strong>
                                      </div>
                                      <div className="text-[9.5px] text-slate-400 font-mono">
                                        {res.date}
                                      </div>
                                    </td>

                                    {/* 2. Cumplimiento */}
                                    <td className="py-2.5 px-3 bg-emerald-50/20">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        {complianceVal === 'cumple' ? (
                                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            ✓ CUMPLE
                                          </span>
                                        ) : complianceVal === 'no_cumple' ? (
                                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                                            ✗ NO CUMPLE
                                          </span>
                                        ) : (
                                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                            REFERENCIAL
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10.5px] text-slate-600 font-medium">
                                        LMP: <strong className="text-slate-800">{res.configuredCriteria || res.normativeLimit || 'D.S. 031-2010-SA'}</strong>
                                      </div>
                                      {res.complianceNote && (
                                        <div className="text-[10px] text-slate-500 mt-0.5 italic">
                                          {res.complianceNote}
                                        </div>
                                      )}
                                    </td>

                                    {/* 3. Riesgo Sanitario */}
                                    <td className="py-2.5 px-3 bg-amber-50/20">
                                      <span
                                        className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] font-hud font-extrabold uppercase tracking-wide ${
                                          healthRiskVal === 'sin_riesgo'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : healthRiskVal === 'riesgo_bajo'
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : healthRiskVal === 'riesgo_medio'
                                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                                        }`}
                                      >
                                        {healthRiskVal.replace('_', ' ')}
                                      </span>
                                      {res.healthRiskDescription && (
                                        <div className="text-[10px] text-slate-600 mt-1 leading-tight max-w-[200px]">
                                          {res.healthRiskDescription}
                                        </div>
                                      )}
                                    </td>

                                    {/* Observación */}
                                    <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-[160px]">
                                      {res.observations || 'Sin observaciones.'}
                                    </td>

                                    {/* Acciones */}
                                    {(selectedSample.status === 'recibida' || selectedSample.status === 'en_analisis') && (
                                      <td className="py-2.5 px-3 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteResult(res.id)}
                                          title="Eliminar este ensayo"
                                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Note */}
                      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[10.5px] text-slate-500 flex items-center justify-between">
                        <span>
                          Norma rectora: <strong>D.S. N.° 031-2010-SA</strong> • Criterios normativos configurados sin límites inventados.
                        </span>
                        <span className="font-mono text-cyan-700">AQUA-LAB • FASE 4</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Gate / Status Notice */}
              {selectedSample.status === 'pendiente_validacion' && (
                <div className="bg-orange-50 border border-orange-300 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-orange-600 text-[24px] shrink-0 mt-0.5">
                      lock_clock
                    </span>
                    <div>
                      <h4 className="font-hud font-bold text-[13.5px] text-orange-950 uppercase">
                        PENDIENTE DE VALIDACIÓN POR USUARIO AUTORIZADO
                      </h4>
                      <p className="text-[12px] text-orange-900 leading-relaxed mt-0.5">
                        Esta muestra contiene {selectedSample.results.length} resultados de ensayo. Conforme a las normas de buenas prácticas de laboratorio, no puede emitirse ni considerarse validada hasta que el Director Técnico o personal acreditado revise y firme los ensayos.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsValidateOpen(true)}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-hud text-[12px] font-extrabold uppercase shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Validar Ahora</span>
                  </button>
                </div>
              )}

              {selectedSample.status === 'validada' && (
                <div className="bg-teal-50 border border-teal-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-teal-700 text-[22px]">verified</span>
                    <div className="text-[12px] text-teal-950">
                      <strong>Muestra Validada Técnicamente por:</strong> {selectedSample.validatedBy} ({selectedSample.validatorRole})
                      <div className="text-[11px] text-teal-800/80 font-mono">
                        Fecha: {new Date(selectedSample.validatedAt || '').toLocaleString('es-PE')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:brightness-110 text-[#002b1f] font-hud text-[11.5px] font-extrabold uppercase shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">assignment</span>
                    <span>Emitir Informe Oficial</span>
                  </button>
                </div>
              )}

              {selectedSample.status === 'informe_emitido' && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-emerald-700 text-[22px]">verified_user</span>
                    <div className="text-[12px] text-emerald-950">
                      <strong>Informe Oficial Emitido:</strong> {selectedSample.reportNumber}
                      <div className="text-[11px] text-emerald-800">
                        Destinatario: {selectedSample.reportRecipient || selectedSample.jassName}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-hud text-[11.5px] font-bold uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Ver / Imprimir Certificado</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2 block">
                biotech
              </span>
              <p className="font-bold text-[14px]">Seleccione una muestra para ver su expediente analítico</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modals */}
      <NewSampleModal
        isOpen={isNewSampleOpen}
        onClose={() => setIsNewSampleOpen(false)}
        onSaveSample={handleSaveNewSample}
        systems={systems}
        existingSamplesCount={samples.length}
      />

      {selectedSample && (
        <>
          <AddResultModal
            isOpen={isAddResultOpen}
            onClose={() => setIsAddResultOpen(false)}
            onSaveResult={handleSaveResult}
            sampleCode={selectedSample.code}
            defaultAnalystName={activeOperatorName}
          />

          <ValidateSampleModal
            isOpen={isValidateOpen}
            onClose={() => setIsValidateOpen(false)}
            sample={selectedSample}
            onConfirmValidation={handleConfirmValidation}
          />

          <OfficialReportModal
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            sample={selectedSample}
            onEmitReport={handleEmitReport}
          />
        </>
      )}
    </div>
  );
};

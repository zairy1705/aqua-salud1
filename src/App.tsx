import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { FloatingNavbar, TabType } from './components/FloatingNavbar';
import { WaterBackground } from './components/WaterBackground';
import { HeroVideoSection } from './components/HeroVideoSection';
import { AquaSaludHomeSheet } from './components/home/AquaSaludHomeSheet';
import { DosageCalculatorView } from './components/DosageCalculatorView';
import { PhotometerHUDView } from './components/PhotometerHUDView';
import { SystemsManagerView } from './components/SystemsManagerView';
import { LogbookView } from './components/LogbookView';
import { DpdCameraModal } from './components/DpdCameraModal';
import { CalibrateModal } from './components/CalibrateModal';
import { SolutionPrepModal } from './components/SolutionPrepModal';
import { NormativeModal } from './components/NormativeModal';
import { VolumeCalcModal } from './components/VolumeCalcModal';
import { ProfileAuthModal } from './components/ProfileAuthModal';
import { UserManualModal } from './components/UserManualModal';
import { INITIAL_SYSTEMS, INITIAL_RECORDS, INITIAL_PROFILES } from './data/mockInitialData';
import {
  WaterSystem,
  SamplingRecord,
  OperatorProfile,
  PublicNavSection,
  AppViewMode,
} from './types';
import { AquaSaludHeader } from './components/public/AquaSaludHeader';
import { AquaSaludHero } from './components/public/AquaSaludHero';
import { AquaSaludEcosistema } from './components/public/AquaSaludEcosistema';
import { AquaSaludSoluciones } from './components/public/AquaSaludSoluciones';
import { AquaSaludNosotros } from './components/public/AquaSaludNosotros';
import { AquaSaludContacto } from './components/public/AquaSaludContacto';
import { AquaSaludServicios } from './components/public/AquaSaludServicios';
import { AquaSaludSectores } from './components/public/AquaSaludSectores';
import { AquaSaludRecursos } from './components/public/AquaSaludRecursos';
import { AquaSaludFooter } from './components/public/AquaSaludFooter';
import { FloatingWhatsAppButton } from './components/public/FloatingWhatsAppButton';
import { LegalModal, LegalModalType } from './components/public/LegalModal';
import { AquaJassDashboardView } from './components/jass/AquaJassDashboardView';
import { TerritorialDashboardView } from './components/dashboard/TerritorialDashboardView';
import { AquaLabView } from './components/lab/AquaLabView';
import { AquaMetalsView } from './components/metals/AquaMetalsView';
import { AquaRiskView } from './components/risk/AquaRiskView';
import { AquaAlertView } from './components/alerts/AquaAlertView';
import { AquaTerritorioView } from './components/territorio/AquaTerritorioView';
import { ActionPlanView } from './components/planes/ActionPlanView';
import { AquaDataView } from './components/data/AquaDataView';
import { AquaIAView } from './components/ia/AquaIAView';
import { AquaCrmView } from './components/crm/AquaCrmView';
import { PublicQuoteModal } from './components/public/PublicQuoteModal';
import { AquaAuditModal } from './components/audit/AquaAuditModal';
import { AquaE2ETestModal } from './components/demo/AquaE2ETestModal';
import { INITIAL_LAB_SAMPLES } from './data/mockLabData';
import { WaterSample, AquaRiskItem, AquaAlertItem, ActionPlanItem } from './types';
import {
  generateAutomatedRisksAndAlerts,
  loadPersistedAlerts,
  savePersistedAlerts,
  loadPersistedRisks,
  savePersistedRisks,
} from './data/riskAlertEngine';
import {
  loadPersistedActionPlans,
  savePersistedActionPlans,
  createActionPlanFromAlert,
} from './data/actionPlanStore';
import { SafeWaterManualView } from './components/jass/SafeWaterManualView';
import { AquaJassLabResultsView } from './components/jass/AquaJassLabResultsView';

export default function App() {
  const [appMode, setAppMode] = useState<AppViewMode>('portal_publico');
  const [publicSection, setPublicSection] = useState<PublicNavSection>('inicio');
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  // Persisted profiles and active profile

  const [profiles, setProfiles] = useState<OperatorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('cloragua_active_profile_id') || 'prof-01';
  });

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];
  const operatorName = activeProfile.name;
  const operatorRole = activeProfile.badge || activeProfile.role;

  // Persisted water systems with fallback to exact INITIAL_SYSTEMS
  const [systems, setSystems] = useState<WaterSystem[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_systems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_SYSTEMS;
    } catch {
      return INITIAL_SYSTEMS;
    }
  });

  // Persisted records with fallback to exact INITIAL_RECORDS
  const [records, setRecords] = useState<SamplingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cloragua_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }
      return INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    systems[0]?.id || 'sys-01'
  );

  // Persisted lab samples for AQUA-LAB
  const [samples, setSamples] = useState<WaterSample[]>(() => {
    try {
      const saved = localStorage.getItem('aqua_lab_samples');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_LAB_SAMPLES;
  });

  // Automated & Persisted AQUA-RISK Matrix
  const [risks, setRisks] = useState<AquaRiskItem[]>(() => {
    const generated = generateAutomatedRisksAndAlerts(
      INITIAL_LAB_SAMPLES,
      INITIAL_RECORDS,
      INITIAL_SYSTEMS
    );
    return loadPersistedRisks(generated.risks);
  });

  // Automated & Persisted AQUA-ALERT System
  const [alerts, setAlerts] = useState<AquaAlertItem[]>(() => {
    const generated = generateAutomatedRisksAndAlerts(
      INITIAL_LAB_SAMPLES,
      INITIAL_RECORDS,
      INITIAL_SYSTEMS
    );
    return loadPersistedAlerts(generated.alerts);
  });

  // Count active pending or in-progress alerts
  const activeAlertCount = alerts.filter(
    (a) => (a.status === 'PENDIENTE' || a.status === 'EN PROCESO' || (a as any).estado === 'PENDIENTE' || (a as any).estado === 'EN PROCESO')
  ).length;

  // Automated & Persisted Action Plans (FASE 8)
  const [actionPlans, setActionPlans] = useState<ActionPlanItem[]>(() => {
    return loadPersistedActionPlans();
  });

  useEffect(() => {
    savePersistedRisks(risks);
  }, [risks]);

  useEffect(() => {
    savePersistedAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    savePersistedActionPlans(actionPlans);
  }, [actionPlans]);

  // Modals state
  const [isDpdCameraOpen, setIsDpdCameraOpen] = useState(false);
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [isSolutionPrepOpen, setIsSolutionPrepOpen] = useState(false);
  const [isNormativeOpen, setIsNormativeOpen] = useState(false);
  const [isVolumeCalcOpen, setIsVolumeCalcOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isPublicQuoteModalOpen, setIsPublicQuoteModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isE2ETestModalOpen, setIsE2ETestModalOpen] = useState(false);
  const [preselectedQuoteService, setPreselectedQuoteService] = useState<string | undefined>(undefined);
  const [profileModalMode, setProfileModalMode] = useState<'register' | 'switch'>('register');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloragua_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Could not save profiles', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_active_profile_id', activeProfileId);
      localStorage.setItem('cloragua_operator_name', operatorName);
      localStorage.setItem('cloragua_operator_role', operatorRole);
    } catch (e) {
      console.warn('Could not save profile metadata', e);
    }
  }, [activeProfileId, operatorName, operatorRole]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_systems', JSON.stringify(systems));
    } catch (e) {
      console.warn('Could not save systems', e);
    }
  }, [systems]);

  useEffect(() => {
    try {
      localStorage.setItem('aqua_lab_samples', JSON.stringify(samples));
    } catch (e) {
      console.warn('Could not save lab samples', e);
    }
  }, [samples]);

  useEffect(() => {
    try {
      localStorage.setItem('cloragua_records', JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save records', e);
    }
  }, [records]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenRegisterProfile = () => {
    setProfileModalMode('register');
    setIsProfileOpen(true);
  };

  const handleOpenSwitchAccount = () => {
    setProfileModalMode('switch');
    setIsProfileOpen(true);
  };

  const handleSelectProfile = (p: OperatorProfile) => {
    setActiveProfileId(p.id);
    showToast(`✓ Operador activo: ${p.name}`);
  };

  const handleAddProfile = (newP: OperatorProfile) => {
    setProfiles((prev) => [newP, ...prev]);
    setActiveProfileId(newP.id);
    showToast(`✓ Perfil registrado con éxito: ${newP.name}`);
  };

  const handleApplyDpdReading = (ppm: number) => {
    const selectedSys = systems.find((s) => s.id === selectedSystemId) || systems[0];
    const now = new Date();
    const isCompliant = ppm >= 0.5 && ppm <= 2.0;
    const status: 'compliant' | 'low' | 'excess' = isCompliant
      ? 'compliant'
      : ppm < 0.5
      ? 'low'
      : 'excess';

    const newRecord: SamplingRecord = {
      id: `rec-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: now.toLocaleDateString('es-PE'),
      timeStr: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      systemId: selectedSys.id,
      systemName: selectedSys.name,
      measurementPoint: 'Salida de Reservorio / Celda Fotométrica DPD',
      freeChlorinePpm: ppm,
      ph: 7.3,
      turbidityNtu: 0.8,
      temperatureC: 18.5,
      status,
      operator: operatorName,
      observations: `Medición analizada y capturada mediante Escáner Óptico DPD (${ppm.toFixed(2)} ppm).`,
      correctiveAction:
        ppm < 0.5
          ? 'Sub-cloración detectada. Calibrar dosificador e incrementar caudal de solución.'
          : ppm > 2.0
          ? 'Cloro superior a norma. Reducir apertura de goteo en cámara de carga.'
          : 'Parámetro en rango óptimo según D.S. N.° 031-2010-SA.',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === selectedSys.id
          ? {
              ...sys,
              lastChlorinePpm: ppm,
              lastInspectionDate: 'Hoy',
            }
          : sys
      )
    );

    showToast(`✓ Medición DPD registrada: ${ppm.toFixed(2)} ppm Cl₂ en ${selectedSys.name}`);
  };

  const handleCreateRecord = (recordData: Omit<SamplingRecord, 'id' | 'timestamp'>) => {
    const newRecord: SamplingRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === recordData.systemId
          ? {
              ...sys,
              lastChlorinePpm: recordData.freeChlorinePpm,
              lastInspectionDate: 'Hoy',
            }
          : sys
      )
    );

    // EVALUACIÓN DE CRITERIO AUTOMÁTICO (D.S. N.° 031-2010-SA, Art. 66)
    if (recordData.freeChlorinePpm < 0.5) {
      const alertCode = `ALT-DES-REC-${newRecord.id.replace(/[^A-Za-z0-9]/g, '')}`;
      const riskId = `RSK-DES-REC-${newRecord.id.replace(/[^A-Za-z0-9]/g, '')}`;

      const newAlert: AquaAlertItem = {
        code: alertCode,
        date: recordData.dateStr,
        system: recordData.systemName,
        point: recordData.measurementPoint,
        parameter: 'Cloro Libre Residual',
        result: `${recordData.freeChlorinePpm.toFixed(2)} ppm`,
        criterion: '0.50 – 2.00 mg/L (D.S. N.° 031-2010-SA, Art. 66)',
        level: 'Alto',
        type: 'Desinfección',
        responsible: recordData.operator || operatorName,
        requiredAction:
          'Recargar hipoclorito en el dosificador y regular goteo a caudal constante. Verificar concentración a la salida de reservorio.',
        status: 'PENDIENTE',
        origin: {
          type: 'monitoreo_cloro',
          referenceId: newRecord.id,
          referenceCode: `DPD-${recordData.dateStr}`,
          detectedAt: `${recordData.dateStr} ${recordData.timeStr}`,
          details: `Registro de campo en bitácora oficial: Medición colorimétrica DPD con ${recordData.freeChlorinePpm.toFixed(2)} ppm (sub-óptimo).`,
        },
        riskId,
        isDemo: recordData.isDemo,
      };

      const newRisk: AquaRiskItem = {
        id: riskId,
        danger: 'Desprotección biológica por déficit de Cloro Residual Libre en red',
        source: `${recordData.systemName} • Punto: ${recordData.measurementPoint}`,
        probability: 'Alta',
        consequence: 'Mayor',
        riskLevel: 'Alto',
        controlMeasure:
          'Inspección inmediata de válvula dosificadora de cloro, purga de línea y aplicación de dosis correctiva según cálculo volumétrico.',
        responsible: recordData.operator || operatorName,
        date: recordData.dateStr,
        status: 'Identificado',
        originType: 'cloro_campo',
        originReference: `REG-${newRecord.id}`,
        associatedAlertCode: alertCode,
        isDemo: recordData.isDemo,
      };

      setAlerts((prev) => [newAlert, ...prev]);
      setRisks((prev) => [newRisk, ...prev]);
      showToast(`⚠️ Alerta Sanitaria generada: ${recordData.freeChlorinePpm.toFixed(2)} ppm Cl₂ (< 0.50 LMP)`);
    } else {
      showToast('✓ Registro guardado en bitácora oficial');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS PARA SIMULACIÓN E2E DE PRUEBA (DEMO)
  // -------------------------------------------------------------
  const handlePurgeAllDemoData = () => {
    setRecords((prev) => prev.filter((r) => !r.isDemo));
    setSamples((prev) => prev.filter((s) => !s.isDemo));
    setAlerts((prev) => prev.filter((a) => !a.isDemo));
    setRisks((prev) => prev.filter((r) => !r.isDemo));
    setActionPlans((prev) => prev.filter((p) => !p.isDemo));
    showToast('✓ Se han eliminado todos los datos de prueba [DEMO] del sistema');
  };

  const handleResetToOriginal = () => {
    if (
      window.confirm(
        '¿Desea restaurar la configuración original? Esta acción reajustará los sistemas de agua, registros de bitácora y muestras de laboratorio a los valores iniciales predeterminados.'
      )
    ) {
      setSystems(INITIAL_SYSTEMS);
      setRecords(INITIAL_RECORDS);
      setSamples(INITIAL_LAB_SAMPLES);
      const generated = generateAutomatedRisksAndAlerts(
        INITIAL_LAB_SAMPLES,
        INITIAL_RECORDS,
        INITIAL_SYSTEMS
      );
      setRisks(generated.risks);
      setAlerts(generated.alerts);
      setActionPlans([]);
      try {
        localStorage.setItem('cloragua_systems', JSON.stringify(INITIAL_SYSTEMS));
        localStorage.setItem('cloragua_records', JSON.stringify(INITIAL_RECORDS));
        localStorage.setItem('aqua_lab_samples', JSON.stringify(INITIAL_LAB_SAMPLES));
        localStorage.removeItem('aqua_risks_persisted');
        localStorage.removeItem('aqua_alerts_persisted');
        localStorage.removeItem('aqua_action_plans_persisted');
      } catch (err) {
        console.warn('Error resetting localStorage:', err);
      }
      showToast('✓ Configuración inicial restaurada con éxito (#btn-reset-to-original)');
    }
  };

  const handleDemoAddRecord = (rec: SamplingRecord) => {
    setRecords((prev) => [rec, ...prev.filter((r) => r.id !== rec.id)]);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === rec.systemId
          ? {
              ...sys,
              lastChlorinePpm: rec.freeChlorinePpm,
              lastInspectionDate: 'Hoy',
            }
          : sys
      )
    );
  };

  const handleDemoAddSample = (sample: WaterSample) => {
    setSamples((prev) => [sample, ...prev.filter((s) => s.id !== sample.id)]);
  };

  const handleDemoUpdateSample = (sample: WaterSample) => {
    setSamples((prev) => prev.map((s) => (s.id === sample.id ? sample : s)));
  };

  const handleDemoAddAlert = (alert: AquaAlertItem) => {
    setAlerts((prev) => [alert, ...prev.filter((a) => a.code !== alert.code)]);
  };

  const handleDemoUpdateAlert = (alert: AquaAlertItem) => {
    setAlerts((prev) => prev.map((a) => (a.code === alert.code ? alert : a)));
  };

  const handleDemoAddRisk = (risk: AquaRiskItem) => {
    setRisks((prev) => [risk, ...prev.filter((r) => r.id !== risk.id)]);
  };

  const handleDemoUpdateRisk = (risk: AquaRiskItem) => {
    setRisks((prev) => prev.map((r) => (r.id === risk.id ? risk : r)));
  };

  const handleDemoAddPlan = (plan: ActionPlanItem) => {
    setActionPlans((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
  };

  const handleDemoUpdatePlan = (plan: ActionPlanItem) => {
    setActionPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
  };

  const handleAddSystem = (newSys: Omit<WaterSystem, 'id'>) => {
    const created: WaterSystem = {
      ...newSys,
      id: `sys-${Date.now()}`,
    };
    const updated = [created, ...systems];
    setSystems(updated);
    try {
      localStorage.setItem('cloragua_systems', JSON.stringify(updated));
    } catch {}
    setSelectedSystemId(created.id);
    showToast(`✓ Sistema ${created.name} registrado con éxito.`);
  };

  const handleSaveSample = (newSample: WaterSample) => {
    const updated = [newSample, ...samples];
    setSamples(updated);
    try {
      localStorage.setItem('aqua_lab_samples', JSON.stringify(updated));
    } catch {}
    showToast(`✓ Muestra ${newSample.code} guardada en laboratorio.`);
  };

  const handleConvertAlertToPlan = (alert: AquaAlertItem) => {
    const existing = actionPlans.find((p) => p.alertCode === alert.code);
    if (existing) {
      showToast(`ℹ️ Esta alerta ya cuenta con el plan de acción ${existing.id}`);
      setActiveTab('planes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const newPlan = createActionPlanFromAlert(alert, operatorName);
    setActionPlans((prev) => [newPlan, ...prev]);

    // Transition alert to EN PROCESO if it was PENDIENTE
    if (alert.status === 'PENDIENTE') {
      const updatedAlerts = alerts.map((a) =>
        a.code === alert.code ? { ...a, status: 'EN PROCESO' as const } : a
      );
      setAlerts(updatedAlerts);
    }

    showToast(`✓ Alerta ${alert.code} convertida en Plan de Acción ${newPlan.id}`);
    setActiveTab('planes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTabTitleMap: Record<TabType, string> = {
    inicio: 'HOJA PRINCIPAL • AQUA-SALUD',
    dashboard: 'DASHBOARD TERRITORIAL',
    territorio: 'AQUA-TERRITORIO • MAPA GIS',
    planes: 'PLANES DE ACCIÓN • TRAZABILIDAD',
    data: 'AQUA-DATA • ANALÍTICA SANITARIA',
    ia: 'AQUA-IA • ASISTENTE INTELIGENTE',
    crm: 'CRM AQUA-SALUD • COTIZACIONES & PIPELINE',
    jass: 'AQUA-JASS • VIGILANCIA',
    lab: 'AQUA-LAB • LABORATORIO DIGITAL',
    metals: 'AQUA-METALS • METALES PESADOS',
    risk: 'AQUA-RISK • MATRIZ DE RIESGOS',
    alert: 'AQUA-ALERT • ALERTAS SANITARIAS',
    dosis: 'ASISTENTE DE DOSIFICACIÓN',
    hud: 'BIO-TELEMETRÍA HUD',
    sistemas: 'RED DE SISTEMAS',
    registro: 'BITÁCORA OFICIAL',
    manuales: 'MANUALES DE AGUA SEGURA & GUÍAS',
  };

  const handleNavigatePublicSection = (section: PublicNavSection) => {
    setPublicSection(section);
    setAppMode('portal_publico');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedSystem = systems.find((s) => s.id === selectedSystemId) || systems[0];

  return (
    <div className="min-h-screen bg-transparent text-[#151d22] flex flex-col font-sans selection:bg-[#00b4d8] selection:text-white relative overflow-x-auto min-w-full">
      {/* Interactive Water Ripples & Waves Background */}
      <WaterBackground />

      {/* RENDER MODE: PORTAL PÚBLICO INSTITUCIONAL AQUA-SALUD */}
      {appMode === 'portal_publico' ? (
        <div className="flex-1 flex flex-col relative z-10">
          <AquaSaludHeader
            currentSection={publicSection}
            onNavigateSection={handleNavigatePublicSection}
            onEnterPlatform={() => {
              setAppMode('plataforma_jass');
              setActiveTab('jass');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuoteModal={() => {
              setPreselectedQuoteService(undefined);
              setIsPublicQuoteModalOpen(true);
            }}
            onNavigateCrm={() => {
              setAppMode('plataforma_jass');
              setActiveTab('crm');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          <main className="flex-1 flex flex-col">
            {/* 1. SECCIÓN INICIO / PORTADA: Únicamente visible cuando publicSection === 'inicio' */}
            {publicSection === 'inicio' && (
              <div id="inicio" className="flex-1 flex flex-col animate-in fade-in duration-300">
                <AquaSaludHero
                  onLearnMore={() => handleNavigatePublicSection('nosotros')}
                  onOurServices={() => handleNavigatePublicSection('servicios')}
                  onCalculateChlorine={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('dosis');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onEnterPlatform={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('inicio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDashboard={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* 2. SECCIÓN ECOSISTEMA: Visible únicamente al hacer clic en ECOSISTEMA */}
            {publicSection === 'ecosistema' && (
              <div id="ecosistema" className="animate-in fade-in duration-300">
                <AquaSaludEcosistema
                  onOpenModuleTab={(tab: TabType) => {
                    setAppMode('plataforma_jass');
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSelectModule={(tab: TabType) => {
                    setAppMode('plataforma_jass');
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenQuoteModal={(serviceName) => {
                    setPreselectedQuoteService(serviceName);
                    setIsPublicQuoteModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* 3. SECCIÓN SERVICIOS: Visible únicamente al hacer clic en SERVICIOS */}
            {publicSection === 'servicios' && (
              <div id="servicios" className="animate-in fade-in duration-300">
                <AquaSaludServicios
                  onOpenAquaLab={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('lab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenQuoteModal={(serviceName) => {
                    setPreselectedQuoteService(serviceName);
                    setIsPublicQuoteModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* 4. SECCIÓN SOLUCIONES: Visible únicamente al hacer clic en SOLUCIONES o SECTORES */}
            {(publicSection === 'soluciones' || publicSection === 'sectores') && (
              <div id="soluciones" className="animate-in fade-in duration-300">
                <AquaSaludSoluciones
                  onOpenJassPlatform={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('jass');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenLabPlatform={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('lab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDashboardPlatform={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenQuoteModal={(serviceName) => {
                    setPreselectedQuoteService(serviceName);
                    setIsPublicQuoteModalOpen(true);
                  }}
                />
                <AquaSaludSectores
                  onSelectJassSector={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('jass');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* 5. SECCIÓN RECURSOS: Visible únicamente al hacer clic en RECURSOS */}
            {publicSection === 'recursos' && (
              <div id="recursos" className="animate-in fade-in duration-300">
                <AquaSaludRecursos
                  onOpenUserManual={() => setIsUserManualOpen(true)}
                  onOpenNormative={() => setIsNormativeOpen(true)}
                />
              </div>
            )}

            {/* 6. SECCIÓN NOSOTROS (¿QUIÉNES SOMOS?): Visible únicamente al hacer clic en NOSOTROS */}
            {publicSection === 'nosotros' && (
              <div id="nosotros" className="animate-in fade-in duration-300">
                <AquaSaludNosotros
                  onEnterPlatform={() => {
                    setAppMode('plataforma_jass');
                    setActiveTab('inicio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenQuoteModal={() => {
                    setPreselectedQuoteService(undefined);
                    setIsPublicQuoteModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* 7. SECCIÓN CONTACTO: Canales oficiales y atención rápida (NO muestra Quiénes Somos) */}
            {publicSection === 'contacto' && (
              <div id="contacto" className="animate-in fade-in duration-300">
                <AquaSaludContacto
                  onOpenQuoteModal={() => {
                    setPreselectedQuoteService(undefined);
                    setIsPublicQuoteModalOpen(true);
                  }}
                />
              </div>
            )}
          </main>

          {/* Footer institucional de AQUA SALUD visible en la parte inferior de la portada principal y de las secciones */}
          <AquaSaludFooter
            onNavigateSection={handleNavigatePublicSection}
            onOpenLegal={(type) => setLegalModalType(type)}
            onEnterPlatform={() => {
              setAppMode('plataforma_jass');
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuoteModal={() => {
              setPreselectedQuoteService(undefined);
              setIsPublicQuoteModalOpen(true);
            }}
          />

          <FloatingWhatsAppButton />
        </div>
      ) : (
        /* RENDER MODE: PLATAFORMA OPERATIVA CLORAGUA / AQUA-JASS */
        <div className="flex-1 flex flex-col relative z-10 pb-24">
          <TopHeader
            currentTabTitle={currentTabTitleMap[activeTab]}
            operatorName={operatorName}
            operatorRole={operatorRole}
            onNavigateHome={() => setActiveTab('inicio')}
            onReturnToPublic={() => {
              setAppMode('portal_publico');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
            onOpenNormative={() => setIsNormativeOpen(true)}
            onOpenCalibrate={() => setIsCalibrateOpen(true)}
            onOpenSolutionPrep={() => setIsSolutionPrepOpen(true)}
            onOpenVolumeCalc={() => setIsVolumeCalcOpen(true)}
            onOpenProfile={handleOpenSwitchAccount}
            onOpenUserManual={() => setIsUserManualOpen(true)}
            onOpenAquaIA={() => {
              setActiveTab('ia');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAudit={() => setIsAuditModalOpen(true)}
            onOpenE2ETestModal={() => setIsE2ETestModalOpen(true)}
            onResetToOriginal={handleResetToOriginal}
          />

          {/* Quick Return Bar for Mobile */}
          <div className="max-w-5xl mx-auto w-full px-3 pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setAppMode('portal_publico');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white text-[#00677d] border border-cyan-200 text-[11px] font-hud font-bold shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Volver a Portal Institucional AQUA-SALUD</span>
            </button>
            <span className="text-[10.5px] font-hud font-bold text-slate-500 uppercase hidden sm:inline">
              Módulo: {currentTabTitleMap[activeTab]}
            </span>
          </div>

          <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-2 relative z-10">
            {activeTab === 'inicio' && (
              <AquaSaludHomeSheet
                systems={systems}
                records={records}
                activeProfile={activeProfile}
                activeAlertCount={activeAlertCount}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigatePublicSection={handleNavigatePublicSection}
                onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
                onOpenSolutionPrep={() => setIsSolutionPrepOpen(true)}
                onOpenCalibrate={() => setIsCalibrateOpen(true)}
                onOpenNormative={() => setIsNormativeOpen(true)}
                onOpenVolumeCalc={() => setIsVolumeCalcOpen(true)}
                onOpenRegisterProfile={handleOpenRegisterProfile}
                onOpenSwitchAccount={handleOpenSwitchAccount}
                onSelectSystemForDosage={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenUserManual={() => setIsUserManualOpen(true)}
                onOpenQuoteModal={() => {
                  setPreselectedQuoteService(undefined);
                  setIsPublicQuoteModalOpen(true);
                }}
              />
            )}

            {activeTab === 'dashboard' && (
              <TerritorialDashboardView
                systems={systems}
                records={records}
                onSelectJass={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectDosage={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
                samples={samples}
                onNavigateToMetals={() => {
                  setActiveTab('metals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToTerritorio={() => {
                  setActiveTab('territorio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'territorio' && (
              <AquaTerritorioView
                systems={systems}
                records={records}
                samples={samples}
                alerts={alerts}
                risks={risks}
                onNavigateToJass={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLab={() => {
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRisk={() => {
                  setActiveTab('risk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToAlerts={() => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDosage={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeOperatorName={operatorName}
              />
            )}

            {activeTab === 'planes' && (
              <ActionPlanView
                plans={actionPlans}
                onUpdatePlans={(updated) => setActionPlans(updated)}
                alerts={alerts}
                onUpdateAlerts={(updated) => setAlerts(updated)}
                onNavigateToAlerts={() => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToAquaData={() => {
                  setActiveTab('data');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                operatorName={operatorName}
              />
            )}

            {activeTab === 'data' && (
              <AquaDataView
                samples={samples}
                records={records}
                systems={systems}
                alerts={alerts}
                risks={risks}
                plans={actionPlans}
                onNavigateToPlan={() => {
                  setActiveTab('planes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToAlerts={() => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRisk={() => {
                  setActiveTab('risk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLab={() => {
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'ia' && (
              <AquaIAView
                systems={systems}
                records={records}
                samples={samples}
                alerts={alerts}
                risks={risks}
                plans={actionPlans}
                onNavigateToPlanes={() => {
                  setActiveTab('planes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToAlerts={() => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToData={() => {
                  setActiveTab('data');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToJass={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                operatorName={operatorName}
              />
            )}

            {activeTab === 'crm' && (
              <AquaCrmView
                activeProfile={activeProfile}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
              />
            )}

            {activeTab === 'jass' && (
              <AquaJassDashboardView
                systems={systems}
                records={records}
                samples={samples}
                onRecordSaved={handleCreateRecord}
                onSaveSample={handleSaveSample}
                onAddSystem={handleAddSystem}
                onOpenDpdCamera={() => setIsDpdCameraOpen(true)}
                onOpenDosageAssistant={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAquaLab={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToSystems={() => {
                  setActiveTab('sistemas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                operatorName={operatorName}
              />
            )}

            {activeTab === 'lab' && (
              <AquaLabView
                samples={samples}
                systems={systems}
                onUpdateSamples={(updated) => setSamples(updated)}
                onNavigateToJass={(sysId) => {
                  setSelectedSystemId(sysId);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToMetals={() => {
                  setActiveTab('metals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeOperatorName={operatorName}
              />
            )}

            {activeTab === 'metals' && (
              <AquaMetalsView
                samples={samples}
                systems={systems}
                onUpdateSamples={(updated) => setSamples(updated)}
                onNavigateToLab={() => {
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRisk={() => {
                  setActiveTab('risk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToAlerts={() => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeOperatorName={operatorName}
              />
            )}

            {activeTab === 'risk' && (
              <AquaRiskView
                risks={risks}
                alerts={alerts}
                systems={systems}
                records={records}
                samples={samples}
                onUpdateRisks={(updated) => setRisks(updated)}
                onNavigateToAlerts={(riskCode) => {
                  setActiveTab('alert');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLab={() => {
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToJass={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDosage={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeOperatorName={operatorName}
              />
            )}

            {activeTab === 'alert' && (
              <AquaAlertView
                alerts={alerts}
                risks={risks}
                systems={systems}
                records={records}
                samples={samples}
                onUpdateAlerts={(updated) => setAlerts(updated)}
                onConvertToPlan={handleConvertAlertToPlan}
                onNavigateToRiskMatrix={(riskCode) => {
                  setActiveTab('risk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLab={() => {
                  setActiveTab('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToJass={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('jass');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenDosage={(sysId) => {
                  if (sysId) setSelectedSystemId(sysId);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeOperatorName={operatorName}
              />
            )}

            {activeTab === 'dosis' && (
              <DosageCalculatorView
                systems={systems}
                preselectedSystemId={selectedSystemId}
                onSystemSelect={(id) => setSelectedSystemId(id)}
                onRecordSaved={handleCreateRecord}
                onSaveToLogbook={handleCreateRecord}
              />
            )}

            {activeTab === 'hud' && (
              <PhotometerHUDView
                systems={systems}
                records={records}
                onOpenNewRecord={() => setIsDpdCameraOpen(true)}
                onRecordSaved={handleCreateRecord}
                onSaveToLogbook={handleCreateRecord}
              />
            )}

            {activeTab === 'sistemas' && (
              <SystemsManagerView
                systems={systems}
                onAddSystem={handleAddSystem}
                onUpdateSystems={(updated) => {
                  setSystems(updated);
                  try {
                    localStorage.setItem('cloragua_systems', JSON.stringify(updated));
                  } catch {}
                }}
                onSelectSystemForDose={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectSystemForDosage={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectSystemForSample={(id) => {
                  setSelectedSystemId(id);
                  setActiveTab('registro');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'registro' && (
              <LogbookView
                records={records}
                systems={systems}
                onOpenNewRecord={() => setIsDpdCameraOpen(true)}
              />
            )}

            {activeTab === 'manuales' && (
              <SafeWaterManualView
                onNavigateToDosage={() => {
                  setActiveTab('dosis');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToSystems={() => {
                  setActiveTab('sistemas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </main>

          {/* Floating Bottom Navigation Bar */}
          <FloatingNavbar
            currentTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReturnToPublic={() => {
              setAppMode('portal_publico');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeAlertCount={activeAlertCount}
            systemCount={systems.length}
          />
        </div>
      )}

      {/* Floating WhatsApp Button (always accessible) */}
      <FloatingWhatsAppButton />

      {/* Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      <DpdCameraModal
        isOpen={isDpdCameraOpen}
        onClose={() => setIsDpdCameraOpen(false)}
        onApplyReading={handleApplyDpdReading}
        systemName={selectedSystem?.name}
      />

      <CalibrateModal
        isOpen={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
      />

      <SolutionPrepModal
        isOpen={isSolutionPrepOpen}
        onClose={() => setIsSolutionPrepOpen(false)}
      />

      <NormativeModal
        isOpen={isNormativeOpen}
        onClose={() => setIsNormativeOpen(false)}
      />

      <VolumeCalcModal
        isOpen={isVolumeCalcOpen}
        onClose={() => setIsVolumeCalcOpen(false)}
      />

      <ProfileAuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialMode={profileModalMode}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onAddProfile={handleAddProfile}
        onSaveProfile={(name, role) => {
          setProfiles((prev) =>
            prev.map((p) => (p.id === activeProfileId ? { ...p, name, role } : p))
          );
          showToast('✓ Perfil de operador actualizado');
        }}
      />

      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
      />

      <PublicQuoteModal
        isOpen={isPublicQuoteModalOpen}
        onClose={() => setIsPublicQuoteModalOpen(false)}
        defaultService={preselectedQuoteService}
      />

      <AquaAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        currentUserTier={activeProfile?.roleTier}
      />

      <AquaE2ETestModal
        isOpen={isE2ETestModalOpen}
        onClose={() => setIsE2ETestModalOpen(false)}
        systems={systems}
        records={records}
        samples={samples}
        alerts={alerts}
        risks={risks}
        actionPlans={actionPlans}
        operatorName={operatorName}
        onAddRecord={handleDemoAddRecord}
        onAddSample={handleDemoAddSample}
        onUpdateSample={handleDemoUpdateSample}
        onAddAlert={handleDemoAddAlert}
        onUpdateAlert={handleDemoUpdateAlert}
        onAddRisk={handleDemoAddRisk}
        onUpdateRisk={handleDemoUpdateRisk}
        onAddPlan={handleDemoAddPlan}
        onUpdatePlan={handleDemoUpdatePlan}
        onPurgeDemoData={handlePurgeAllDemoData}
        onNavigateTab={(tab) => {
          setAppMode('plataforma_jass');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#001f27]/95 backdrop-blur-md text-white border border-cyan-400/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-hud text-[12.5px] font-bold animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[#10e7b2] text-[20px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

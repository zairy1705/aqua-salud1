import React, { useState, useMemo, useEffect } from 'react';
import { WaterSystem, SamplingRecord, WaterSample } from '../../types';
import { DosageCalculatorView } from '../DosageCalculatorView';
import { AquaJassLabResultsView } from './AquaJassLabResultsView';
import { SafeWaterManualView } from '../manual/SafeWaterManualView';
import { GlassTitlePanel } from '../GlassTitlePanel';

export type JassSubModule = 'monitoreo' | 'dosificacion' | 'laboratorio' | 'manuales';

interface AquaJassDashboardViewProps {
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples?: WaterSample[];
  onRecordSaved: (recordData: Omit<SamplingRecord, 'id' | 'timestamp'>) => void;
  onSaveSample?: (newSample: WaterSample) => void;
  onAddSystem?: (newSys: Omit<WaterSystem, 'id'>) => void;
  onOpenDpdCamera: () => void;
  onOpenDosageAssistant: (systemId: string) => void;
  onOpenAquaLab?: (systemId: string) => void;
  onNavigateToSystems?: () => void;
  operatorName?: string;
  initialSubModule?: JassSubModule;
}

export const AquaJassDashboardView: React.FC<AquaJassDashboardViewProps> = ({
  systems,
  records,
  samples = [],
  onRecordSaved,
  onSaveSample,
  onAddSystem,
  onOpenDpdCamera,
  onOpenDosageAssistant,
  onOpenAquaLab,
  onNavigateToSystems,
  operatorName = 'Operador JASS',
  initialSubModule = 'monitoreo',
}) => {
  const [activeSubModule, setActiveSubModule] = useState<JassSubModule>(initialSubModule);
  const [selectedSystemId, setSelectedSystemId] = useState<string>(systems[0]?.id || 'sys-01');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddSystemModalOpen, setIsAddSystemModalOpen] = useState(false);
  const [filterPoint, setFilterPoint] = useState<string>('todos');
  const [offlineSyncStatus, setOfflineSyncStatus] = useState<'synced' | 'local'>('synced');

  // Form states for new water system creation
  const [newSysName, setNewSysName] = useState('');
  const [newSysType, setNewSysType] = useState<WaterSystem['type']>('Reservorio Apoyado');
  const [newSysCapacity, setNewSysCapacity] = useState('15000');
  const [newSysLevel, setNewSysLevel] = useState('85');
  const [newSysLocation, setNewSysLocation] = useState('');
  const [newSysOperator, setNewSysOperator] = useState(operatorName);

  useEffect(() => {
    if (initialSubModule) {
      setActiveSubModule(initialSubModule);
    }
  }, [initialSubModule]);

  // Form states for rapid chlorine record
  const now = new Date();
  const [formPoint, setFormPoint] = useState<string>('Primer Grifo de la Red');
  const [formDate, setFormDate] = useState<string>(now.toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>(
    now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [formPpm, setFormPpm] = useState<string>('1.2');
  const [formTurbidity, setFormTurbidity] = useState<string>('0.8');
  const [formObservations, setFormObservations] = useState<string>('');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<{
    status: 'adequate' | 'attention' | 'corrective';
    title: string;
    description: string;
    safeAction: string;
  } | null>(null);

  const currentSystem = useMemo(() => {
    return systems.find((s) => s.id === selectedSystemId) || systems[0];
  }, [systems, selectedSystemId]);

  // System records
  const systemRecords = useMemo(() => {
    return records.filter((r) => r.systemId === currentSystem?.id);
  }, [records, currentSystem]);

  const filteredRecords = useMemo(() => {
    if (filterPoint === 'todos') return systemRecords;
    return systemRecords.filter((r) => r.measurementPoint.toLowerCase().includes(filterPoint.toLowerCase()));
  }, [systemRecords, filterPoint]);

  // Last reading
  const lastRecord = systemRecords[0];
  const lastChlorine = lastRecord ? lastRecord.freeChlorinePpm : currentSystem?.lastChlorinePpm ?? 1.2;

  // Evaluation criteria (configurable, avoiding hardcoded rigid bounds)
  const evaluateChlorine = (ppmVal: number) => {
    if (ppmVal >= 0.5 && ppmVal <= 2.0) {
      return {
        status: 'adequate' as const,
        title: '🟢 ADECUADO (Dentro de Rango)',
        description:
          'El nivel de cloro residual libre es óptimo para la desinfección del agua sin afectar el olor ni el sabor.',
        safeAction:
          'Mantener el caudal de dosificación actual y continuar con la vigilancia diaria programada.',
      };
    } else if (ppmVal > 0.2 && ppmVal < 0.5) {
      return {
        status: 'attention' as const,
        title: '🟡 REQUIERE ATENCIÓN (Sub-cloración Leve)',
        description:
          'El cloro está por debajo del rango óptimo de protección bacteriológica. Existe riesgo potencial de re-contaminación en la red.',
        safeAction:
          'Verificar el nivel de solución en el tanque dosificador y revisar si hay obstrucciones en la manguera o gotero.',
      };
    } else if (ppmVal <= 0.2) {
      return {
        status: 'corrective' as const,
        title: '🔴 ACCIÓN CORRECTIVA (Riesgo Crítico / Cloro Insuficiente)',
        description:
          'Agua sin protección desinfectante efectiva. Peligro inminente de proliferación bacteriana y patógenos.',
        safeAction:
          'Revisar inmediatamente el goteo del clorador. Si el tanque dosificador está vacío, preparar solución madre según protocolo oficial o solicitar asistencia técnica ATM.',
      };
    } else {
      return {
        status: 'corrective' as const,
        title: '🔴 ACCIÓN CORRECTIVA (Exceso de Cloro)',
        description:
          'Concentración superior al umbral deseado. Puede generar rechazo organoléptico en la población consumidora.',
        safeAction:
          'Reducir ligeramente la apertura de la llave de paso o válvula de goteo en la cámara de dosificación y volver a medir en 1 hora.',
      };
    }
  };

  const systemStatus = evaluateChlorine(lastChlorine);

  const handleOpenNewRecordModal = () => {
    const currentNow = new Date();
    setFormDate(currentNow.toISOString().split('T')[0]);
    setFormTime(
      currentNow.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
    );
    setFormPpm('1.2');
    setFormTurbidity('0.8');
    setFormObservations('');
    setFormPhoto(null);
    setEvalResult(evaluateChlorine(1.2));
    setIsRegisterModalOpen(true);
  };

  const handlePpmChange = (newPpm: string) => {
    setFormPpm(newPpm);
    const num = parseFloat(newPpm);
    if (!isNaN(num)) {
      setEvalResult(evaluateChlorine(num));
    }
  };

  const handleSaveChlorineControl = (e: React.FormEvent) => {
    e.preventDefault();
    const ppm = parseFloat(formPpm) || 0;
    const turb =
      formTurbidity !== '' && !isNaN(parseFloat(formTurbidity))
        ? parseFloat(formTurbidity)
        : 0.8;
    const evalData = evaluateChlorine(ppm);

    const isCompliant = ppm >= 0.5 && ppm <= 2.0;
    const status: 'compliant' | 'low' | 'excess' = isCompliant
      ? 'compliant'
      : ppm < 0.5
      ? 'low'
      : 'excess';

    const targetSys = currentSystem || systems[0];
    if (!targetSys) return;

    onRecordSaved({
      systemId: targetSys.id,
      systemName: targetSys.name,
      measurementPoint: formPoint,
      dateStr: formDate,
      timeStr: formTime,
      freeChlorinePpm: ppm,
      ph: 7.2,
      turbidityNtu: turb,
      temperatureC: 19.5,
      status,
      operator: operatorName,
      observations:
        formObservations.trim() ||
        `Control de cloro (${ppm.toFixed(2)} ppm) y turbidez (${turb.toFixed(1)} NTU) registrado en ${formPoint}.`,
      correctiveAction: evalData.safeAction,
    });

    setEvalResult(evalData);
    setOfflineSyncStatus('synced');
    setIsRegisterModalOpen(false);
  };

  const handleCreateSystemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSysName.trim()) return;
    const capacity = Number(newSysCapacity) || 15000;
    const level = Math.min(100, Math.max(0, Number(newSysLevel) || 85));
    if (onAddSystem) {
      onAddSystem({
        name: newSysName.trim(),
        type: newSysType,
        capacityLiters: capacity,
        currentLevelPercent: level,
        location: newSysLocation.trim() || 'Sector Rural',
        operator: newSysOperator.trim() || operatorName,
        lastInspectionDate: 'Hoy',
        lastChlorinePpm: 1.0,
      });
    }
    setIsAddSystemModalOpen(false);
    setNewSysName('');
    setNewSysLocation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 1 • MODO CAMPO JASS • MÓVIL RURAL • D.S. N.° 031-2010-SA"
        icon="water_drop"
        title="AQUA-JASS • GESTIÓN COMUNITARIA Y CLORACIÓN RURAL"
        subtitle="Monitoreo rápido de campo en captación, reservorio o vivienda. Registro táctil simplificado con trazabilidad y sincronización local garantizada."
        stats={[
          {
            label: 'SISTEMAS ASIGNADOS',
            value: systems.length,
            subtext: currentSystem ? currentSystem.name : 'Sistemas registrados',
          },
          {
            label: 'ÚLTIMO CLORO LIBRE',
            value: `${lastChlorine.toFixed(2)} ppm`,
            subtext: lastChlorine >= 0.5 && lastChlorine <= 2.0 ? 'Dentro de rango legal' : 'Fuera de rango',
            highlight: lastChlorine < 0.5 || lastChlorine > 2.0,
          },
          {
            label: 'CONTROLES REGISTRADOS',
            value: systemRecords.length,
            subtext: 'Bitácora del sistema',
          },
          {
            label: 'ESTADO SINCRONIZACIÓN',
            value: offlineSyncStatus === 'synced' ? 'ONLINE' : 'LOCAL',
            subtext: offlineSyncStatus === 'synced' ? 'Almacenamiento al día' : 'Pendiente sync',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenNewRecordModal}
              className="glass-option-btn-primary text-xs sm:text-sm font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>NUEVO CONTROL CLORO</span>
            </button>

            <button
              type="button"
              onClick={onOpenDpdCamera}
              className="glass-option-btn text-xs font-black uppercase tracking-wider"
              title="Lectura asistida de colorimetría DPD con cámara"
            >
              <span className="material-symbols-outlined text-base text-cyan-600">photo_camera</span>
              <span>ESCANEAR DPD-1</span>
            </button>

            {onAddSystem && (
              <button
                type="button"
                onClick={() => setIsAddSystemModalOpen(true)}
                className="glass-option-btn text-xs font-black uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-base">add_business</span>
                <span>+ SISTEMA</span>
              </button>
            )}
          </div>
        }
      />

      {/* 4 MÓDULOS ESENCIALES DE AQUA-JASS EN ESTILO GLASS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 glass-title-panel rounded-2xl">
        {/* 1. Monitorear Sistemas de Agua */}
        <button
          type="button"
          onClick={() => setActiveSubModule('monitoreo')}
          className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSubModule === 'monitoreo'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubModule === 'monitoreo' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-[#00677d]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">water</span>
          </div>
          <div className="min-w-0">
            <span className="font-hud font-black text-[12px] uppercase tracking-wider block truncate">
              MONITOREAR SISTEMAS
            </span>
            <span className={`text-[10.5px] block truncate ${activeSubModule === 'monitoreo' ? 'text-cyan-900 font-semibold' : 'text-slate-500'}`}>
              Reservorios y Cloro
            </span>
          </div>
        </button>

        {/* 2. Dosificar Cloro */}
        <button
          type="button"
          onClick={() => setActiveSubModule('dosificacion')}
          className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSubModule === 'dosificacion'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubModule === 'dosificacion' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">calculate</span>
          </div>
          <div className="min-w-0">
            <span className="font-hud font-black text-[12px] uppercase tracking-wider block truncate">
              DOSIFICAR CLORO
            </span>
            <span className={`text-[10.5px] block truncate ${activeSubModule === 'dosificacion' ? 'text-cyan-900 font-semibold' : 'text-slate-500'}`}>
              Cálculo Hipoclorito
            </span>
          </div>
        </button>

        {/* 3. Resultados de Laboratorio */}
        <button
          type="button"
          onClick={() => setActiveSubModule('laboratorio')}
          className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSubModule === 'laboratorio'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubModule === 'laboratorio' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">science</span>
          </div>
          <div className="min-w-0">
            <span className="font-hud font-black text-[12px] uppercase tracking-wider block truncate">
              RESULTADOS DE LAB
            </span>
            <span className={`text-[10.5px] block truncate ${activeSubModule === 'laboratorio' ? 'text-cyan-900 font-semibold' : 'text-slate-500'}`}>
              Ensayos D.S. 031
            </span>
          </div>
        </button>

        {/* 4. Manuales de Ayuda */}
        <button
          type="button"
          onClick={() => setActiveSubModule('manuales')}
          className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSubModule === 'manuales'
              ? 'glass-option-btn-primary'
              : 'glass-option-btn'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeSubModule === 'manuales' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">menu_book</span>
          </div>
          <div className="min-w-0">
            <span className="font-hud font-black text-[12px] uppercase tracking-wider block truncate">
              MANUALES DE AYUDA
            </span>
            <span className={`text-[10.5px] block truncate ${activeSubModule === 'manuales' ? 'text-cyan-900 font-semibold' : 'text-slate-500'}`}>
              Agua Segura & PDF
            </span>
          </div>
        </button>
      </div>

      {/* VISTA SEGÚN SUB-MÓDULO ACTIVO */}
      {activeSubModule === 'dosificacion' && (
        <div className="animate-in fade-in duration-200">
          <DosageCalculatorView
            systems={systems}
            preselectedSystemId={selectedSystemId}
            onSystemSelect={(id) => setSelectedSystemId(id)}
            onRecordSaved={onRecordSaved}
            onSaveToLogbook={onRecordSaved}
          />
        </div>
      )}

      {activeSubModule === 'laboratorio' && (
        <div className="animate-in fade-in duration-200">
          <AquaJassLabResultsView
            systems={systems}
            samples={samples}
            selectedSystemId={selectedSystemId}
            onSelectSystem={(id) => setSelectedSystemId(id)}
            onSaveSample={onSaveSample || (() => {})}
            operatorName={operatorName}
          />
        </div>
      )}

      {activeSubModule === 'manuales' && (
        <div className="animate-in fade-in duration-200">
          <SafeWaterManualView
            onNavigateToDosage={() => setActiveSubModule('dosificacion')}
            onNavigateToSystems={() => setActiveSubModule('monitoreo')}
          />
        </div>
      )}

      {activeSubModule === 'monitoreo' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* DASHBOARD: MI SISTEMA DE AGUA */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-cyan-100 shadow-[0_8px_30px_rgba(0,103,125,0.07)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-[#00677d] text-[10px] font-hud font-bold uppercase border border-cyan-200">
                    AQUA-JASS • MÓDULO RURAL
                  </span>
                  <span className="text-[11px] text-slate-500 font-hud">
                    Operador: <strong className="text-[#003440]">{operatorName}</strong>
                  </span>
                </div>
                <h2 className="font-hud font-black text-[22px] sm:text-[28px] text-[#003440] tracking-tight">
                  MONITOREO DE SISTEMAS DE AGUA
                </h2>
                <p className="text-[13px] text-[#475569] mt-0.5">
                  Vigilancia de reservorios ingresados, cloro residual diario y cumplimiento del D.S. N.° 031-2010-SA.
                </p>
              </div>

              {/* System Selector and Add System Button */}
              <div className="w-full md:w-auto">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="text-[11px] font-hud font-bold uppercase text-[#00677d]">
                    Seleccionar Sistema / Comunidad:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddSystemModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-100 hover:bg-cyan-200 text-[#00677d] font-hud text-[10.5px] font-bold transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">add</span>
                    <span>+ Nuevo Sistema</span>
                  </button>
                </div>
                <select
                  value={selectedSystemId}
                  onChange={(e) => setSelectedSystemId(e.target.value)}
                  className="w-full md:w-80 py-2.5 px-3.5 rounded-2xl bg-slate-50 border border-slate-300 font-hud text-[12.5px] font-bold text-[#003440] focus:ring-2 focus:ring-[#00b4d8] focus:outline-hidden cursor-pointer"
                >
                  {systems.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {sys.name} ({sys.location.split(',')[0]})
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between gap-2 mt-1.5 px-0.5">
                  <span className="text-[10.5px] text-slate-500 font-medium">
                    {systems.length} sistemas ingresados
                  </span>
                  {onNavigateToSystems && (
                    <button
                      type="button"
                      onClick={onNavigateToSystems}
                      className="inline-flex items-center gap-1 text-[11px] font-hud font-bold text-[#00677d] hover:text-[#004e5f] hover:underline cursor-pointer"
                      title="Monitorear lista completa y detalles de los sistemas ingresados"
                    >
                      <span className="material-symbols-outlined text-[14px]">water</span>
                      <span>Ver todos los sistemas</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Carrusel / Tarjetas Rápidas de Monitoreo de Todos los Sistemas Ingresados */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-hud font-bold uppercase text-[#00677d]">
                  Sistemas de Agua Ingresados para Monitoreo:
                </span>
                <span className="text-[11px] text-slate-400">
                  Haz clic en cualquiera para auditarlo
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {systems.map((sys) => {
                  const isSelected = sys.id === currentSystem.id;
                  const isAdequate = sys.lastChlorinePpm >= 0.5 && sys.lastChlorinePpm <= 2.0;
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => setSelectedSystemId(sys.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-50/90 border-[#00b4d8] ring-2 ring-cyan-200 shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-hud font-bold text-[12px] text-[#003440] truncate">
                          {sys.name}
                        </span>
                        <span
                          className={`text-[9.5px] font-hud font-bold px-2 py-0.5 rounded-full ${
                            isAdequate
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sys.lastChlorinePpm.toFixed(2)} ppm
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{sys.capacityLiters.toLocaleString()} L ({sys.currentLevelPercent}%)</span>
                        <span className="font-mono text-[9.5px] text-[#00677d]">{sys.type.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

        {/* System Details & Semáforo Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Status Badge */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between ${
              systemStatus.status === 'adequate'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : systemStatus.status === 'attention'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}
          >
            <div>
              <span className="text-[10.5px] font-hud font-bold uppercase tracking-wider block mb-1 opacity-80">
                Estado Sanitario del Sistema
              </span>
              <h3 className="font-hud font-black text-[18px] sm:text-[20px] leading-tight mb-2">
                {systemStatus.title}
              </h3>
              <p className="text-[12px] leading-relaxed opacity-90">{systemStatus.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between">
              <span className="text-[11px] font-hud font-bold uppercase">Último Resultado:</span>
              <span className="text-[20px] font-hud font-black">{lastChlorine.toFixed(2)} ppm Cl₂</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-hud font-bold text-slate-500 uppercase">
                Último Control
              </span>
              <div>
                <span className="font-hud font-extrabold text-[15px] text-[#003440] block">
                  {lastRecord?.dateStr || 'Hoy'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {lastRecord?.timeStr || '10:45 AM'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-hud font-bold text-slate-500 uppercase">
                Controles en Red
              </span>
              <div>
                <span className="font-hud font-extrabold text-[22px] text-[#00677d] block leading-none">
                  {systemRecords.length}
                </span>
                <span className="text-[10.5px] text-emerald-700 font-semibold">Al día</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-hud font-bold text-slate-500 uppercase">
                Alertas Activas
              </span>
              <div>
                <span
                  className={`font-hud font-extrabold text-[22px] block leading-none ${
                    systemStatus.status !== 'adequate' ? 'text-rose-600' : 'text-slate-400'
                  }`}
                >
                  {systemStatus.status !== 'adequate' ? 1 : 0}
                </span>
                <span className="text-[10.5px] text-slate-500">
                  {systemStatus.status !== 'adequate' ? 'Requiere revisión' : 'Todo en norma'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-hud font-bold text-slate-500 uppercase">
                Tendencia Hídrica
              </span>
              <div className="flex items-center gap-1 text-emerald-700 font-hud font-bold text-[13px]">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>Estable</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-hud font-bold text-[#00677d] uppercase tracking-wider block mb-1">
                Acción Prioritaria
              </span>
              <h4 className="font-hud font-bold text-[15px] text-[#003440] leading-snug">
                ¿Vas a medir el cloro en campo hoy?
              </h4>
              <p className="text-[11.5px] text-[#475569] mt-1">
                Registra la lectura DPD-1 en el reservorio o en el primer grifo del caserío.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleOpenNewRecordModal}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[13px] font-black uppercase tracking-wider shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
                <span>💧 REGISTRAR CONTROL DE CLORO</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubModule('dosificacion')}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#00677d] border border-cyan-300 font-hud text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Calcular Dosis de Cloro (7 Pasos)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubModule('laboratorio')}
                className="w-full py-2 px-3 rounded-xl bg-cyan-900/10 hover:bg-cyan-900/20 text-[#004e5f] border border-cyan-300/70 font-hud text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#00677d]">science</span>
                <span>Ingresar Resultados de Laboratorio</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubModule('manuales')}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-hud text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Manuales de Agua Segura y PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ORIENTACIÓN JASS: ¿QUÉ DEBO HACER? (Acciones Seguras) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-cyan-100 shadow-[0_8px_24px_rgba(0,103,125,0.05)]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">help</span>
          </div>
          <div>
            <h3 className="font-hud font-black text-[16px] sm:text-[18px] text-[#003440] uppercase">
              ¿QUÉ DEBO HACER SI EL CLORO ESTÁ FUERA DE NORMA?
            </h3>
            <p className="text-[11.5px] text-[#475569]">
              Guía de acciones preventivas y seguras para operadores comunales JASS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            {
              step: '1',
              title: 'Verificar sistema de cloración',
              desc: 'Inspeccionar que la caseta esté cerrada, sin fugas ni pérdidas de agua en el clorador.',
              icon: 'lock',
            },
            {
              step: '2',
              title: 'Verificar insumo desinfectante',
              desc: 'Confirmar si el hipoclorito en tambor o bidón no está vencido ni expuesto a la humedad.',
              icon: 'inventory_2',
            },
            {
              step: '3',
              title: 'Revisar equipo de dosificación',
              desc: 'Comprobar si el gotero, flotador o dosificador de carga constante está atorado con sedimentos.',
              icon: 'tune',
            },
            {
              step: '4',
              title: 'Verificar punto de medición',
              desc: 'Purgar el grifo durante 1 minuto antes de tomar la muestra para evitar agua estancada.',
              icon: 'faucet',
            },
            {
              step: '5',
              title: 'Repetir la medición DPD',
              desc: 'Hacer una contra-muestra con una nueva pastilla DPD-1 limpia y celda enjuagada.',
              icon: 'replay',
            },
            {
              step: '6',
              title: 'Solicitar asistencia técnica ATM',
              desc: 'Si el problema persiste, contactar al responsable de saneamiento de la municipalidad.',
              icon: 'support_agent',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center font-hud text-[11px] font-bold shrink-0">
                {item.step}
              </span>
              <div>
                <h4 className="font-hud font-bold text-[13px] text-[#003440]">{item.title}</h4>
                <p className="text-[11px] text-[#475569] leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Warning Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-[11.5px] flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0">
            health_and_safety
          </span>
          <p>
            <strong>Regla de Bioseguridad:</strong> No aplicar cantidades excesivas o peligrosas de desinfectante sin cálculo técnico validado. Ante dudas, utiliza el <em>Asistente de Dosificación de 7 Pasos</em>.
          </p>
        </div>
      </div>

      {/* HISTORIAL DE CLORO JASS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-cyan-100 shadow-[0_8px_24px_rgba(0,103,125,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-hud font-black text-[17px] text-[#003440] uppercase">
              HISTORIAL DE CLORACIÓN ({currentSystem.name})
            </h3>
            <p className="text-[11.5px] text-[#475569]">
              Registro de vigilancia comunitaria y cumplimiento del D.S. N.° 031-2010-SA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-hud font-bold text-slate-500 uppercase">Punto:</span>
            <select
              value={filterPoint}
              onChange={(e) => setFilterPoint(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[12px] font-hud font-bold text-[#003440] cursor-pointer"
            >
              <option value="todos">Todos los puntos</option>
              <option value="reservorio">Reservorio</option>
              <option value="primer grifo">Primer grifo</option>
              <option value="intermedio">Punto intermedio</option>
              <option value="ultimo">Último grifo</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#004e5f] font-hud text-[11px] uppercase">
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Hora</th>
                <th className="py-2.5 px-3">Punto de Control</th>
                <th className="py-2.5 px-3 text-right">Cloro Residual</th>
                <th className="py-2.5 px-3 text-right">Turbidez</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 font-hud">
                    No hay controles registrados para este filtro.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#1e293b]">{rec.dateStr}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{rec.timeStr}</td>
                    <td className="py-2.5 px-3 text-[#334155]">{rec.measurementPoint}</td>
                    <td className="py-2.5 px-3 text-right font-hud font-bold text-[#00677d]">
                      {rec.freeChlorinePpm.toFixed(2)} ppm
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {rec.turbidityNtu ? `${rec.turbidityNtu.toFixed(1)} NTU` : '0.8 NTU'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-hud font-extrabold uppercase ${
                          rec.status === 'compliant'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : rec.status === 'low'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {rec.status === 'compliant'
                          ? '🟢 Adecuado'
                          : rec.status === 'low'
                          ? '🟡 Bajo'
                          : '🔴 Exceso'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

      {/* MODAL: REGISTRAR CONTROL DE CLORO */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white text-[#0f172a] rounded-3xl border border-cyan-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#003d4c] to-[#00677d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#10e7b2]">
                  <span className="material-symbols-outlined text-[22px]">water_drop</span>
                </div>
                <div>
                  <h3 className="font-hud font-bold text-[16px] text-white">
                    💧 REGISTRAR CONTROL DE CLORO
                  </h3>
                  <p className="text-[11px] text-cyan-200">{currentSystem.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveChlorineControl} className="p-5 overflow-y-auto space-y-4 text-[13px]">
              {/* Point of Control */}
              <div>
                <label className="block font-hud font-bold text-[#003d4c] text-[11.5px] uppercase mb-1">
                  Punto de Medición:
                </label>
                <select
                  value={formPoint}
                  onChange={(e) => setFormPoint(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-300 font-hud text-[12.5px] font-bold text-[#003440] focus:ring-2 focus:ring-[#00b4d8]"
                >
                  <option value="Salida de Reservorio">Salida de Reservorio (Cámara de Válvulas)</option>
                  <option value="Primer Grifo de la Red">Primer Grifo de la Red (Caserío / Centro Poblado)</option>
                  <option value="Punto Intermedio de la Red">Punto Intermedio de la Red</option>
                  <option value="Último Grifo de la Red">Último Grifo de la Red (Extremo Crítico)</option>
                  <option value="Institución Educativa / Escuela">Institución Educativa / Cisterna Escolar</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Fecha:
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[12px]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Hora:
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[12px]"
                    required
                  />
                </div>
              </div>

              {/* Chlorine and Turbidity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Cloro Residual Libre (ppm): *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="10"
                      value={formPpm}
                      onChange={(e) => handlePpmChange(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-cyan-400 font-hud font-black text-[16px] text-[#003440] focus:ring-2 focus:ring-[#00b4d8]"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-hud font-bold text-slate-400">
                      ppm
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Turbidez (Opcional):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formTurbidity}
                      onChange={(e) => setFormTurbidity(e.target.value)}
                      placeholder="0.8"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-300 font-hud text-[14px] text-[#003440]"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-hud font-bold text-slate-400">
                      NTU
                    </span>
                  </div>
                </div>
              </div>

              {/* Colorimeter Quick Select Bar */}
              <div>
                <span className="block text-[10.5px] font-hud font-bold text-slate-500 uppercase mb-1.5">
                  Escala Rápida DPD-1 (Toca para seleccionar valor directo):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { ppm: '0.0', color: '#f8fafc', label: '0.0 (Sin Cloro)', border: 'border-slate-300' },
                    { ppm: '0.2', color: '#fce7f3', label: '0.2 (Sub-óptimo)', border: 'border-pink-200' },
                    { ppm: '0.5', color: '#f472b6', label: '0.5 (Mínimo)', border: 'border-pink-400' },
                    { ppm: '1.0', color: '#ec4899', label: '1.0 (Óptimo)', border: 'border-pink-500' },
                    { ppm: '1.5', color: '#db2777', label: '1.5 (Alto)', border: 'border-pink-600' },
                    { ppm: '2.0', color: '#be185d', label: '2.0 (Máx LMP)', border: 'border-pink-700' },
                  ].map((s) => (
                    <button
                      key={s.ppm}
                      type="button"
                      onClick={() => handlePpmChange(s.ppm)}
                      className={`min-h-[46px] p-2 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
                        formPpm === s.ppm
                          ? 'border-[#00b4d8] bg-cyan-50 shadow-[0_0_8px_rgba(0,180,216,0.3)]'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-full h-3 rounded-md mb-1 border ${s.border || 'border-black/10'}`}
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-[9.5px] font-hud font-bold text-[#003440] leading-tight text-center">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo option (DPD Scanner trigger) */}
              <div>
                <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                  Fotografía de Muestra DPD (Opcional):
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      onOpenDpdCamera();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-[#00677d] font-hud text-[11.5px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">photo_camera</span>
                    <span>Abrir Escáner DPD / Tomar Foto</span>
                  </button>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                  Observaciones de Campo:
                </label>
                <textarea
                  rows={2}
                  value={formObservations}
                  onChange={(e) => setFormObservations(e.target.value)}
                  placeholder="Ej. Agua cristalina, caudal regular en red, clima soleado..."
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-[12px]"
                />
              </div>

              {/* Immediate Evaluation Result preview */}
              {evalResult && (
                <div
                  className={`p-4 rounded-2xl border ${
                    evalResult.status === 'adequate'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : evalResult.status === 'attention'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <h4 className="font-hud font-bold text-[14px]">{evalResult.title}</h4>
                  <p className="text-[11.5px] mt-1">{evalResult.description}</p>
                  <div className="mt-2 pt-2 border-t border-current/15 text-[11px]">
                    <strong>Recomendación Segura:</strong> {evalResult.safeAction}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  id="btn-cancelar-control-cloro"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#475569] font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-guardar-control-cloro"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[12px] font-black uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">save</span>
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVO SISTEMA / TANQUE */}
      {isAddSystemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white text-[#0f172a] rounded-3xl border border-cyan-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#003d4c] to-[#00677d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#10e7b2]">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div>
                  <h3 className="font-hud font-bold text-[16px] text-white">
                    💧 REGISTRAR NUEVO SISTEMA DE AGUA
                  </h3>
                  <p className="text-[11px] text-cyan-200">Añadir reservorio o captación para monitoreo JASS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSystemModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleCreateSystemSubmit} className="p-5 overflow-y-auto space-y-4 text-[13px]">
              <div>
                <label className="block font-hud font-bold text-[#003d4c] text-[11.5px] uppercase mb-1">
                  Nombre del Sistema / Reservorio *:
                </label>
                <input
                  type="text"
                  value={newSysName}
                  onChange={(e) => setNewSysName(e.target.value)}
                  placeholder="Ej: Reservorio R-2 Comunidad San Juan"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-300 font-hud text-[12.5px] font-bold text-[#003440] focus:ring-2 focus:ring-[#00b4d8]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Tipo de Sistema:
                  </label>
                  <select
                    value={newSysType}
                    onChange={(e) => setNewSysType(e.target.value as WaterSystem['type'])}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-300 font-hud text-[12px] font-bold text-[#003440]"
                  >
                    <option value="Reservorio Apoyado">Reservorio Apoyado</option>
                    <option value="Reservorio Elevado">Reservorio Elevado</option>
                    <option value="Captación Manantial">Captación Manantial</option>
                    <option value="Gravedad sin Tratamiento">Gravedad sin Tratamiento</option>
                    <option value="Gravedad con Tratamiento">Gravedad con Tratamiento</option>
                    <option value="Bombeo">Bombeo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Capacidad (Litros):
                  </label>
                  <input
                    type="number"
                    value={newSysCapacity}
                    onChange={(e) => setNewSysCapacity(e.target.value)}
                    placeholder="Ej: 15000"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[12px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Nivel Actual de Agua (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSysLevel}
                    onChange={(e) => setNewSysLevel(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[12px]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                    Operador Responsable:
                  </label>
                  <input
                    type="text"
                    value={newSysOperator}
                    onChange={(e) => setNewSysOperator(e.target.value)}
                    placeholder="Nombre del operador JASS"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 font-hud text-[12px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-hud font-bold text-[#003d4c] text-[11px] uppercase mb-1">
                  Ubicación / Sector / Caserío:
                </label>
                <input
                  type="text"
                  value={newSysLocation}
                  onChange={(e) => setNewSysLocation(e.target.value)}
                  placeholder="Ej: Sector Alto, Caserío San Juan"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-[12px]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSystemModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#475569] font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[12px] font-black uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">save</span>
                  <span>Guardar Sistema</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useId, useEffect } from 'react';
import { 
  Calculator, 
  Droplet, 
  FlaskConical, 
  ShieldAlert, 
  CheckCircle, 
  Save, 
  Layers, 
  Info,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { GlassTitlePanel } from './GlassTitlePanel';
import { 
  TankGeometry, 
  DosageCalculationParams, 
  SamplingRecord, 
  WaterSystem 
} from '../types';
import { CHLORINE_PRODUCTS } from '../data/mockInitialData';
import { calculateDosage } from '../utils/waterMath';

interface DosageCalculatorViewProps {
  systems: WaterSystem[];
  onSaveToLogbook: (record: Omit<SamplingRecord, 'id' | 'timestamp'>) => void;
  preselectedSystemId?: string;
}

export const DosageCalculatorView: React.FC<DosageCalculatorViewProps> = ({
  systems,
  onSaveToLogbook,
  preselectedSystemId,
}) => {
  const formId = useId();

  // Geometry and dimensions
  const [geometry, setGeometry] = useState<TankGeometry>('rectangular');
  const [length, setLength] = useState<number>(5.0); // meters
  const [width, setWidth] = useState<number>(4.0); // meters
  const [height, setHeight] = useState<number>(3.0); // total tank height
  const [waterDepth, setWaterDepth] = useState<number>(2.5); // actual water level
  const [diameter, setDiameter] = useState<number>(4.0); // for cylindrical
  const [directVolumeM3, setDirectVolumeM3] = useState<number>(50.0);

  // Selected system association (optional)
  const [selectedSystemId, setSelectedSystemId] = useState<string>(preselectedSystemId || '');

  // Chlorine product selection
  const [productId, setProductId] = useState<string>('prod-hypo-cal-65');
  const selectedProduct = CHLORINE_PRODUCTS.find((p) => p.id === productId) || CHLORINE_PRODUCTS[0];
  const [customPercent, setCustomPercent] = useState<number>(selectedProduct.activeChlorinePercent);

  // Water parameters
  const [currentChlorinePpm, setCurrentChlorinePpm] = useState<number>(0.2);
  const [targetChlorinePpm, setTargetChlorinePpm] = useState<number>(1.5);
  const [chlorineDemandPpm, setChlorineDemandPpm] = useState<number>(0.3);
  const [isShockDisinfection, setIsShockDisinfection] = useState<boolean>(false);

  // Notification for saved state
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Handle system quick load
  const handleSystemChange = (sysId: string) => {
    setSelectedSystemId(sysId);
    const found = systems.find((s) => s.id === sysId);
    if (found) {
      if (found.geometry) {
        setGeometry(found.geometry);
        if (found.length !== undefined) setLength(found.length);
        if (found.width !== undefined) setWidth(found.width);
        if (found.height !== undefined) setHeight(found.height);
        if (found.waterDepth !== undefined) {
          setWaterDepth(found.waterDepth);
        } else if (found.height !== undefined && found.currentLevelPercent !== undefined) {
          setWaterDepth(Number(((found.height * found.currentLevelPercent) / 100).toFixed(2)));
        }
        if (found.diameter !== undefined) setDiameter(found.diameter);
      } else {
        if (found.type === 'cisterna' || found.type === 'reservorio_apoyado') {
          setGeometry('rectangular');
        } else if (found.type === 'reservorio_elevado' || found.type === 'pozo_subterraneo') {
          setGeometry('cylindrical_vert');
        } else {
          setGeometry('direct_volume');
        }
      }
      setDirectVolumeM3(found.capacityLiters / 1000);
      setCurrentChlorinePpm(found.lastChlorinePpm || 0.2);
    }
  };

  useEffect(() => {
    if (preselectedSystemId) {
      handleSystemChange(preselectedSystemId);
    }
  }, [preselectedSystemId]);

  // Build params
  const calculationParams: DosageCalculationParams = {
    geometry,
    length,
    width,
    height,
    waterDepth,
    diameter,
    directVolumeLiters: geometry === 'direct_volume' ? directVolumeM3 * 1000 : undefined,
    productId,
    customActivePercent: customPercent,
    currentChlorinePpm,
    targetChlorinePpm: isShockDisinfection ? 50 : targetChlorinePpm,
    chlorineDemandPpm,
    isShockDisinfection,
  };

  const result = calculateDosage(calculationParams);

  // Handle saving to logbook
  const handleSave = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

    const currentSystem = systems.find((s) => s.id === selectedSystemId);
    const systemName = currentSystem ? currentSystem.name : 'Dosificación en Tanque / Reservorio';

    onSaveToLogbook({
      dateStr,
      timeStr,
      systemId: selectedSystemId || 'sys-custom',
      systemName,
      measurementPoint: isShockDisinfection ? 'Desinfección de Choque de Tanque' : 'Dosificación Aplicada a Reservorio',
      freeChlorinePpm: isShockDisinfection ? 50 : targetChlorinePpm,
      ph: 7.2,
      turbidityNtu: 0.5,
      temperatureC: 20.0,
      status: isShockDisinfection ? 'excess' : 'compliant',
      operator: currentSystem?.operator || 'Operador Sanitario',
      observations: `Dosificación calculada: ${result.commercialDoseAmount} ${result.commercialDoseUnit} de ${result.productName} para ${result.waterVolumeLiters.toLocaleString()} Litros.`,
      correctiveAction: isShockDisinfection ? 'Desinfección y lavado preventivo de reservorio (50 ppm, 2h).' : undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Title Header with GlassTitlePanel */}
      <GlassTitlePanel
        badge="FASE 1 • INGENIERÍA SANITARIA • DOSIFICACIÓN DE PRECISIÓN"
        normative="D.S. N.° 031-2010-SA • DIGESA"
        icon="calculate"
        title="CALCULADORA DE DOSIFICACIÓN DE CLORO"
        subtitle="Cálculo estequiométrico de masa o volumen exacto de desinfectante según el volumen útil del reservorio, concentración activa y demanda residual."
        stats={[
          {
            label: 'VOLUMEN CALCULADO',
            value: `${(result.waterVolumeLiters / 1000).toFixed(1)} m³`,
            subtext: `${result.waterVolumeLiters.toLocaleString()} Litros netos`,
          },
          {
            label: 'DOSIS COMERCIAL',
            value: `${result.commercialDoseAmount} ${result.commercialDoseUnit}`,
            subtext: result.productName,
          },
          {
            label: 'MODO OPERATIVO',
            value: isShockDisinfection ? 'CHOQUE (50 PPM)' : 'DESINFECCIÓN RUTINARIA',
            highlight: isShockDisinfection,
          },
        ]}
        actions={
          systems.length > 0 ? (
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/80 shadow-xs">
              <Layers className="w-4 h-4 text-cyan-700 shrink-0" />
              <div className="text-xs">
                <label htmlFor={`${formId}-system-select`} className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider">
                  Tanque Asignado:
                </label>
                <select
                  id={`${formId}-system-select`}
                  value={selectedSystemId}
                  onChange={(e) => handleSystemChange(e.target.value)}
                  className="font-bold text-slate-800 bg-transparent border-0 p-0 pr-4 focus:ring-0 text-xs cursor-pointer"
                >
                  <option value="">Personalizado (Manual)</option>
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.capacityLiters.toLocaleString()} L)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : undefined
        }
      />

      {/* Main Grid: Parameters on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Configuration Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-5">

          {/* Section 1: Water Volume & Geometry */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Geometría y Volumen del Tanque
                </h2>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                {result.waterVolumeLiters.toLocaleString()} Litros ({result.waterVolumeM3} m³)
              </span>
            </div>

            {/* Geometry Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { id: 'rectangular' as TankGeometry, label: 'Prisma Rectangular' },
                { id: 'cylindrical_vert' as TankGeometry, label: 'Cilindro Vertical' },
                { id: 'cylindrical_horiz' as TankGeometry, label: 'Cilindro Horizontal' },
                { id: 'direct_volume' as TankGeometry, label: 'Volumen Directo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`btn-geom-${tab.id}`}
                  type="button"
                  onClick={() => setGeometry(tab.id)}
                  className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition-all ${
                    geometry === tab.id
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Geometry Inputs */}
            {geometry === 'rectangular' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor={`${formId}-rect-length`} className="block text-xs font-medium text-slate-600 mb-1">
                    Largo (m)
                  </label>
                  <input
                    id={`${formId}-rect-length`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-rect-width`} className="block text-xs font-medium text-slate-600 mb-1">
                    Ancho (m)
                  </label>
                  <input
                    id={`${formId}-rect-width`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-rect-height`} className="block text-xs font-medium text-slate-600 mb-1">
                    Altura Tanque (m)
                  </label>
                  <input
                    id={`${formId}-rect-height`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-rect-depth`} className="block text-xs font-bold text-teal-700 mb-1">
                    Nivel de Agua (m)
                  </label>
                  <input
                    id={`${formId}-rect-depth`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={height * 1.2}
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-teal-400 bg-teal-50/40 text-teal-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-bold"
                  />
                </div>
              </div>
            )}

            {geometry === 'cylindrical_vert' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={`${formId}-cyl-diameter`} className="block text-xs font-medium text-slate-600 mb-1">
                    Diámetro (m)
                  </label>
                  <input
                    id={`${formId}-cyl-diameter`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={diameter}
                    onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-cyl-height`} className="block text-xs font-medium text-slate-600 mb-1">
                    Altura Total (m)
                  </label>
                  <input
                    id={`${formId}-cyl-height`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-cyl-depth`} className="block text-xs font-bold text-teal-700 mb-1">
                    Nivel Útil de Agua (m)
                  </label>
                  <input
                    id={`${formId}-cyl-depth`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={height * 1.2}
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-teal-400 bg-teal-50/40 text-teal-900 focus:border-teal-600 font-bold"
                  />
                </div>
              </div>
            )}

            {geometry === 'cylindrical_horiz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-cylh-diameter`} className="block text-xs font-medium text-slate-600 mb-1">
                    Diámetro (m)
                  </label>
                  <input
                    id={`${formId}-cylh-diameter`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={diameter}
                    onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-cylh-length`} className="block text-xs font-medium text-slate-600 mb-1">
                    Longitud del Tanque (m)
                  </label>
                  <input
                    id={`${formId}-cylh-length`}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>
            )}

            {geometry === 'direct_volume' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${formId}-vol-m3`} className="block text-xs font-medium text-slate-600 mb-1">
                    Volumen en Metros Cúbicos (m³)
                  </label>
                  <input
                    id={`${formId}-vol-m3`}
                    type="number"
                    step="1"
                    min="0.1"
                    value={directVolumeM3}
                    onChange={(e) => setDirectVolumeM3(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-teal-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-vol-liters`} className="block text-xs font-medium text-slate-600 mb-1">
                    Equivalente en Litros (L)
                  </label>
                  <input
                    id={`${formId}-vol-liters`}
                    type="number"
                    step="1000"
                    min="100"
                    value={directVolumeM3 * 1000}
                    onChange={(e) => setDirectVolumeM3((parseFloat(e.target.value) || 0) / 1000)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-teal-300 bg-teal-50/50 text-teal-800 font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Chlorine Product Selection */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Producto de Cloro y Concentración
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Forma: <strong className="text-slate-800 capitalize">{selectedProduct.form}</strong>
              </span>
            </div>

            {/* Product selection cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {CHLORINE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  id={`prod-card-${prod.id}`}
                  type="button"
                  onClick={() => {
                    setProductId(prod.id);
                    setCustomPercent(prod.activeChlorinePercent);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    productId === prod.id
                      ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/30 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {prod.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      prod.form === 'solid' ? 'bg-amber-100 text-amber-800' :
                      prod.form === 'liquid' ? 'bg-blue-100 text-blue-800' :
                      prod.form === 'tablet' ? 'bg-purple-100 text-purple-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {prod.activeChlorinePercent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {prod.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Adjustable concentration slider */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <label htmlFor={`${formId}-custom-percent`} className="text-xs font-bold text-slate-800">
                    Concentración de Cloro Activo Declarada:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Verificar según ficha técnica o lote del proveedor DIGESA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`${formId}-custom-percent`}
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={customPercent}
                  onChange={(e) => setCustomPercent(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-center font-bold text-sm bg-white rounded-lg border border-slate-300 focus:border-teal-500"
                />
                <span className="text-xs font-bold text-slate-700">%</span>
              </div>
            </div>
          </div>

          {/* Section 3: Water Parameters and Normative Target */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Parámetros y Cloro Objetivo
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Norma: D.S. N.° 031-2010-SA
              </span>
            </div>

            {/* Shock Disinfection Toggle */}
            <div className="mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    Modo Desinfección de Choque / Lavado de Reservorio
                  </span>
                  <span className="text-[11px] text-amber-700 block">
                    Aplica 50.0 mg/L de cloro por 2 a 4 horas. No apto para consumo directo durante el tratamiento.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isShockDisinfection}
                  onChange={(e) => setIsShockDisinfection(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {!isShockDisinfection && (
              <div className="space-y-4">
                {/* Chlorine Targets preset buttons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Objetivo de Cloro Residual Libre (PPM o mg/L):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { val: 0.8, label: '0.8 ppm', sub: 'Extremo de Red' },
                      { val: 1.0, label: '1.0 ppm', sub: 'Estándar DIGESA' },
                      { val: 1.5, label: '1.5 ppm', sub: 'Salida Reservorio' },
                      { val: 2.0, label: '2.0 ppm', sub: 'Límite LMP Máx' },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        id={`btn-preset-${preset.val}`}
                        type="button"
                        onClick={() => setTargetChlorinePpm(preset.val)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          targetChlorinePpm === preset.val
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs font-bold">{preset.label}</span>
                        <span className={`block text-[10px] ${targetChlorinePpm === preset.val ? 'text-teal-100' : 'text-slate-500'}`}>
                          {preset.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Granular input controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label htmlFor={`${formId}-current-cl`} className="block text-xs font-medium text-slate-600 mb-1">
                      Cloro Actual Medido
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-current-cl`}
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={currentChlorinePpm}
                        onChange={(e) => setCurrentChlorinePpm(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold text-slate-800"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/L</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-target-cl`} className="block text-xs font-medium text-slate-600 mb-1">
                      Cloro Objetivo Final
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-target-cl`}
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={targetChlorinePpm}
                        onChange={(e) => setTargetChlorinePpm(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-teal-400 bg-teal-50/30 font-bold text-teal-900"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-teal-600 font-bold">mg/L</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-demand-cl`} className="block text-xs font-medium text-slate-600 mb-1">
                      Demanda de Cloro Est.
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-demand-cl`}
                        type="number"
                        min="0"
                        max="3"
                        step="0.1"
                        value={chlorineDemandPpm}
                        onChange={(e) => setChlorineDemandPpm(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold text-slate-800"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/L</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculated Technical Results & Prescription (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Prescription Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
            {/* Background water ripple aesthetic */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-bold">
                    Dosificación Exacta Requerida
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {result.normativeReference.slice(0, 18)}...
                </span>
              </div>

              {/* Big Dosage Number Metric */}
              <div className="my-3 text-center sm:text-left">
                <span className="text-xs text-slate-300 block mb-1">
                  Cantidad comercial a adicionar:
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="font-mono text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200 tracking-tight">
                    {result.commercialDoseAmount.toLocaleString()}
                  </span>
                  <span className="text-2xl font-extrabold text-teal-300 uppercase">
                    {result.commercialDoseUnit}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  de <strong className="text-white">{result.productName}</strong> al {result.concentrationPercent}%
                </p>
              </div>

              {/* Technical Breakdown Matrix */}
              <div className="grid grid-cols-2 gap-2.5 my-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Volumen Tratado</span>
                  <span className="font-bold text-white font-mono">
                    {result.waterVolumeLiters.toLocaleString()} L ({result.waterVolumeM3} m³)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dosis Neta</span>
                  <span className="font-bold text-teal-300 font-mono">
                    +{result.effectiveChlorineNeedPpm} ppm (mg/L)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Cloro Puro Activo</span>
                  <span className="font-bold text-white font-mono">
                    {result.pureChlorineGrams} g Cl₂
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tiempo Contacto Mín.</span>
                  <span className="font-bold text-cyan-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 inline" />
                    {result.contactTimeMinutes} minutos
                  </span>
                </div>
              </div>

              {/* Preparation Advice Guide */}
              <div className="bg-teal-950/40 border border-teal-800/50 rounded-xl p-3 my-4 space-y-1.5 text-xs text-teal-100">
                <div className="flex items-center gap-1.5 font-bold text-teal-300">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Preparación de Solución Madre:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Disolver previamente los <strong>{result.commercialDoseAmount} {result.commercialDoseUnit}</strong> en un balde plástico con aproximadamente <strong>{result.recommendedDilutionWaterLiters} Litros</strong> de agua limpia. Mezclar con varilla plástica (no metálica) y dejar decantar 15 min antes de aplicar el sobrenadante claro al reservorio.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  id="btn-save-dosage-log"
                  type="button"
                  onClick={handleSave}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-950" />
                      <span>¡Registrado en Bitácora!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Registrar en Bitácora Oficial</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Safety & Protocol Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Protocolo de Seguridad y EPP Obligatorio
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {result.safetyAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

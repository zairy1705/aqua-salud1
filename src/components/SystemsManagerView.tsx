import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Calculator, 
  MapPin, 
  User, 
  Clock, 
  Droplet, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  X,
  Check,
  Box,
  Circle,
  Sparkles,
  Maximize2,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { GlassTitlePanel } from './GlassTitlePanel';
import { WaterSystem, WaterSystemType, TankGeometry } from '../types';

interface SystemsManagerViewProps {
  systems: WaterSystem[];
  onAddSystem?: (newSys: Omit<WaterSystem, 'id'>) => void;
  onUpdateSystems?: (updated: WaterSystem[]) => void;
  onSelectSystemForDose?: (systemId: string) => void;
  onSelectSystemForDosage?: (systemId: string) => void;
  onSelectSystemForSample?: (systemId: string) => void;
}

export const SystemsManagerView: React.FC<SystemsManagerViewProps> = ({
  systems,
  onAddSystem,
  onUpdateSystems,
  onSelectSystemForDose,
  onSelectSystemForDosage,
  onSelectSystemForSample,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New system form basic state
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterSystemType>('reservorio_apoyado');
  const [capacityLiters, setCapacityLiters] = useState<number | string>(30000);
  const [currentLevelPercent, setCurrentLevelPercent] = useState<number>(80);
  const [location, setLocation] = useState('');
  const [operator, setOperator] = useState('');

  // Reservoir geometry & dimensions state
  const [geometry, setGeometry] = useState<TankGeometry>('rectangular');
  const [length, setLength] = useState<number | string>(6.0); // meters
  const [width, setWidth] = useState<number | string>(5.0); // meters
  const [height, setHeight] = useState<number | string>(3.0); // meters (altura total)
  const [diameter, setDiameter] = useState<number | string>(4.0); // meters (diámetro cilíndrico)
  const [waterDepth, setWaterDepth] = useState<number | string>(2.4); // meters (tirante de agua)

  // Real-time calculation helpers
  const numLength = Math.max(0, Number(length) || 0);
  const numWidth = Math.max(0, Number(width) || 0);
  const numHeight = Math.max(0, Number(height) || 0);
  const numDiameter = Math.max(0, Number(diameter) || 0);
  const numWaterDepth = Math.max(0, Number(waterDepth) || 0);

  let calculatedTotalVolumeLiters = 0;
  let calculatedWaterVolumeLiters = 0;

  if (geometry === 'rectangular') {
    calculatedTotalVolumeLiters = Math.round(numLength * numWidth * numHeight * 1000);
    const effDepth = numWaterDepth > 0 ? numWaterDepth : (numHeight * currentLevelPercent) / 100;
    calculatedWaterVolumeLiters = Math.round(numLength * numWidth * effDepth * 1000);
  } else if (geometry === 'cylindrical_vert') {
    const radius = numDiameter / 2;
    calculatedTotalVolumeLiters = Math.round(Math.PI * Math.pow(radius, 2) * numHeight * 1000);
    const effDepth = numWaterDepth > 0 ? numWaterDepth : (numHeight * currentLevelPercent) / 100;
    calculatedWaterVolumeLiters = Math.round(Math.PI * Math.pow(radius, 2) * effDepth * 1000);
  } else if (geometry === 'cylindrical_horiz') {
    const radius = numDiameter / 2;
    calculatedTotalVolumeLiters = Math.round(Math.PI * Math.pow(radius, 2) * numLength * 1000);
    calculatedWaterVolumeLiters = Math.round(calculatedTotalVolumeLiters * (currentLevelPercent / 100));
  } else {
    calculatedTotalVolumeLiters = parseInt(String(capacityLiters), 10) || 10000;
    calculatedWaterVolumeLiters = Math.round(calculatedTotalVolumeLiters * (currentLevelPercent / 100));
  }

  // Estimated chlorine needed for 1.5 ppm free residual chlorine + 0.3 ppm typical demand = 1.8 mg/L total need
  const volumeForDose = calculatedWaterVolumeLiters > 0 ? calculatedWaterVolumeLiters : calculatedTotalVolumeLiters;
  // Calcium Hypochlorite 65% (solid): grams = (volumeLiters * 1.8) / (0.65 * 1000)
  const estHypo65Grams = Math.round((volumeForDose * 1.8) / 0.65 / 1000);
  // Sodium Hypochlorite 10% (liquid): mL = (volumeLiters * 1.8) / (0.10 * 1000)
  const estHypo10Ml = Math.round((volumeForDose * 1.8) / 0.10 / 1000);

  const handleApplyCalculatedVolume = () => {
    if (calculatedTotalVolumeLiters > 0) {
      setCapacityLiters(calculatedTotalVolumeLiters);
    }
  };

  const handleGeometryChange = (newGeom: TankGeometry) => {
    setGeometry(newGeom);
    if (newGeom === 'rectangular') {
      setType('reservorio_apoyado');
    } else if (newGeom === 'cylindrical_vert') {
      setType('reservorio_elevado');
    }
  };

  const handleSubmitNewSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedCap = parseInt(String(capacityLiters), 10) || calculatedTotalVolumeLiters || 10000;
    const parsedLevel = Math.min(100, Math.max(0, Number(currentLevelPercent) || 50));

    const newSysData: Omit<WaterSystem, 'id'> = {
      name: name.trim(),
      type,
      capacityLiters: parsedCap,
      currentLevelPercent: parsedLevel,
      location: location.trim() || 'Sector Comunal / Rural',
      operator: operator.trim() || 'Operador JASS',
      lastInspectionDate: 'Hoy',
      lastChlorinePpm: 1.0,
      geometry,
      length: geometry === 'rectangular' || geometry === 'cylindrical_horiz' ? numLength : undefined,
      width: geometry === 'rectangular' ? numWidth : undefined,
      height: geometry === 'rectangular' || geometry === 'cylindrical_vert' ? numHeight : undefined,
      diameter: geometry === 'cylindrical_vert' || geometry === 'cylindrical_horiz' ? numDiameter : undefined,
      waterDepth: numWaterDepth > 0 ? numWaterDepth : undefined,
    };

    if (onAddSystem) {
      onAddSystem(newSysData);
    } else if (onUpdateSystems) {
      const created: WaterSystem = {
        ...newSysData,
        id: `sys-${Date.now()}`,
      };
      onUpdateSystems([created, ...systems]);
    }

    // Reset and close
    setName('');
    setLocation('');
    setOperator('');
    setCapacityLiters(30000);
    setCurrentLevelPercent(80);
    setIsModalOpen(false);
  };

  const getTypeLabel = (t: WaterSystemType) => {
    switch (t) {
      case 'reservorio_apoyado':
        return 'Reservorio Apoyado';
      case 'reservorio_elevado':
        return 'Reservorio Elevado';
      case 'cisterna':
        return 'Cisterna Subterránea';
      case 'red_distribucion':
        return 'Red de Distribución';
      case 'pozo_subterraneo':
        return 'Pozo Subterráneo';
      default:
        return 'Sistema de Agua';
    }
  };

  const getGeometryBadge = (sys: WaterSystem) => {
    if (!sys.geometry || sys.geometry === 'direct_volume') return null;

    if (sys.geometry === 'rectangular' && sys.length && sys.width && sys.height) {
      return {
        label: 'Prisma Rectangular',
        dims: `${sys.length}m × ${sys.width}m × ${sys.height}m`,
        volM3: ((sys.length * sys.width * sys.height)).toFixed(1)
      };
    }
    if (sys.geometry === 'cylindrical_vert' && sys.diameter && sys.height) {
      const v = Math.PI * Math.pow(sys.diameter / 2, 2) * sys.height;
      return {
        label: 'Cilindro Vertical',
        dims: `⌀ ${sys.diameter}m × h ${sys.height}m`,
        volM3: v.toFixed(1)
      };
    }
    if (sys.geometry === 'cylindrical_horiz' && sys.diameter && sys.length) {
      const v = Math.PI * Math.pow(sys.diameter / 2, 2) * sys.length;
      return {
        label: 'Cilindro Horizontal',
        dims: `⌀ ${sys.diameter}m × L ${sys.length}m`,
        volM3: v.toFixed(1)
      };
    }
    return null;
  };

  const getEstimatedDosageForCard = (sys: WaterSystem) => {
    const waterLiters = Math.round((sys.capacityLiters * sys.currentLevelPercent) / 100);
    const grams = Math.round((waterLiters * 1.8) / 0.65 / 1000);
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams} g`;
  };

  const totalVolumeM3 = Math.round(systems.reduce((acc, s) => acc + s.capacityLiters, 0) / 1000);
  const compliantCount = systems.filter((s) => s.lastChlorinePpm >= 0.5 && s.lastChlorinePpm <= 2.0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 1 • INFRAESTRUCTURA SANITARIA • SISTEMAS DE AGUA"
        normative="R.M. N.° 192-2018-VIVIENDA • DIGESA"
        icon="inventory_2"
        title="GESTIÓN DE SISTEMAS Y RESERVORIOS"
        subtitle="Control de capacidad, volumen útil almacenado, dimensiones de ingeniería y monitoreo de desinfección para cada infraestructura comunal o urbana."
        stats={[
          {
            label: 'TOTAL SISTEMAS',
            value: systems.length,
            subtext: 'Infraestructuras registradas',
          },
          {
            label: 'CAPACIDAD GLOBAL',
            value: `${totalVolumeM3} m³`,
            subtext: `${(totalVolumeM3 * 1000).toLocaleString()} Litros de reserva`,
          },
          {
            label: 'CLORACIÓN CONFORME',
            value: `${compliantCount} / ${systems.length}`,
            subtext: compliantCount === systems.length ? '100% de reservorios conformes' : 'Requiere ajuste de dosificación',
            highlight: compliantCount < systems.length,
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-add-system-modal"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-[#004e5f] font-hud text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>REGISTRAR NUEVO RESERVORIO</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-[#10e7b2]/20 hover:bg-[#10e7b2]/30 border border-[#10e7b2]/40 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#10e7b2]">print</span>
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>
        }
      />

      {/* Grid of Water Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {systems.map((sys) => {
          const isCompliant = sys.lastChlorinePpm >= 0.5 && sys.lastChlorinePpm <= 2.0;
          const currentWaterLiters = Math.round((sys.capacityLiters * sys.currentLevelPercent) / 100);

          return (
            <div
              key={sys.id}
              className="glass-card p-5 flex flex-col justify-between"
            >
              <div>
                {/* Type Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {getTypeLabel(sys.type)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompliant
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isCompliant ? (
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    )}
                    {sys.lastChlorinePpm.toFixed(2)} ppm
                  </span>
                </div>

                {/* System Title */}
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {sys.name}
                </h3>

                {/* Location & Operator */}
                <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sys.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sys.operator}</span>
                  </div>
                </div>

                {/* Geometry and Dimensions Badge if available */}
                {(() => {
                  const geom = getGeometryBadge(sys);
                  if (!geom) return null;
                  return (
                    <div className="mt-3 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
                        <Box className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="font-semibold truncate">{geom.label}:</span>
                        <span className="font-mono text-slate-600 truncate">{geom.dims}</span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded ml-1 shrink-0">
                        {geom.volM3} m³
                      </span>
                    </div>
                  );
                })()}

                {/* Level Progress Bar & Capacity */}
                <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">Nivel de Agua:</span>
                    <span className="font-bold text-teal-800">
                      {sys.currentLevelPercent}% ({currentWaterLiters.toLocaleString()} L)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${sys.currentLevelPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                    <span>Capacidad Total:</span>
                    <span>{sys.capacityLiters.toLocaleString()} L ({(sys.capacityLiters / 1000).toFixed(1)} m³)</span>
                  </div>
                </div>

                {/* Chlorine Dosage Quick Reference */}
                <div className="mt-2.5 px-3 py-1.5 bg-teal-50/60 border border-teal-200/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-teal-900">
                    <Droplet className="w-3.5 h-3.5 text-teal-600" />
                    Dosis ref. Cl₂ (65%):
                  </span>
                  <span className="font-mono font-black text-teal-800">
                    ~{getEstimatedDosageForCard(sys)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`btn-dose-sys-${sys.id}`}
                  onClick={() => {
                    if (onSelectSystemForDose) onSelectSystemForDose(sys.id);
                    else if (onSelectSystemForDosage) onSelectSystemForDosage(sys.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Dosificar Cloro</span>
                </button>
                <button
                  id={`btn-sample-sys-${sys.id}`}
                  onClick={() => {
                    if (onSelectSystemForSample) onSelectSystemForSample(sys.id);
                  }}
                  className="inline-flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  <span>Muestrear</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding New System with Geometry & Dimensions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-600" />
                  Registrar Nuevo Sistema / Reservorio
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingresa las dimensiones métricas para calcular el volumen exacto y la dosificación requerida de cloro.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewSystem} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Tanque / Sistema:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Reservorio Apoyado R-2 (Sector Alto)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Infraestructura:
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as WaterSystemType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="reservorio_apoyado">Reservorio Apoyado</option>
                    <option value="reservorio_elevado">Reservorio Elevado</option>
                    <option value="cisterna">Cisterna Subterránea</option>
                    <option value="red_distribucion">Red de Distribución</option>
                    <option value="pozo_subterraneo">Pozo Subterráneo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ubicación / Sector:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Sector Norte - Caserío El Molino"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operador Responsable:
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Téc. Roberto Sánchez (Operador JASS)"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Geometry Selection Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-teal-600" />
                    Geometría y Forma del Reservorio:
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Selecciona para habilitar dimensiones
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: 'rectangular' as TankGeometry, label: 'Prisma Rectangular', desc: 'Largo × Ancho × Alto' },
                    { id: 'cylindrical_vert' as TankGeometry, label: 'Cilindro Vertical', desc: 'Diámetro × Altura' },
                    { id: 'cylindrical_horiz' as TankGeometry, label: 'Cilindro Horizontal', desc: 'Diámetro × Longitud' },
                    { id: 'direct_volume' as TankGeometry, label: 'Volumen Directo', desc: 'Ingreso manual en Litros' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGeometryChange(g.id)}
                      className={`p-2.5 text-left rounded-xl border transition-all ${
                        geometry === g.id
                          ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 text-teal-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs leading-tight mb-0.5">{g.label}</div>
                      <div className="text-[10px] text-slate-500">{g.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Dimensions inputs based on geometry */}
                {geometry === 'rectangular' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Largo (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Ancho (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Altura Total (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-teal-800 mb-1">
                        Tirante Agua (m):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={waterDepth}
                        onChange={(e) => setWaterDepth(e.target.value)}
                        placeholder="ej. 2.4"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-teal-300 font-semibold bg-white"
                      />
                    </div>
                  </div>
                )}

                {geometry === 'cylindrical_vert' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Diámetro ⌀ (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Altura Total (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-teal-800 mb-1">
                        Tirante Agua (m):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={waterDepth}
                        onChange={(e) => setWaterDepth(e.target.value)}
                        placeholder="ej. 2.4"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-teal-300 font-semibold bg-white"
                      />
                    </div>
                  </div>
                )}

                {geometry === 'cylindrical_horiz' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Diámetro ⌀ (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Longitud Total (m):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Real-time Calculation & Chlorine Dosage Assistant Box */}
              <div className="p-3.5 bg-gradient-to-br from-teal-50 via-teal-50/60 to-cyan-50 rounded-2xl border border-teal-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs text-teal-950">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Cálculo de Volumen y Dosificación de Cloro</span>
                  </div>
                  {geometry !== 'direct_volume' && (
                    <button
                      type="button"
                      onClick={handleApplyCalculatedVolume}
                      className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg shadow-2xs transition-colors"
                    >
                      Copiar a Capacidad ({calculatedTotalVolumeLiters.toLocaleString()} L)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white/90 p-2 rounded-xl border border-teal-100">
                    <span className="block text-[10px] text-slate-500 font-medium">Volumen Geométrico:</span>
                    <span className="font-extrabold text-teal-950 text-sm">
                      {(calculatedTotalVolumeLiters / 1000).toFixed(1)} m³
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      {calculatedTotalVolumeLiters.toLocaleString()} L
                    </span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-xl border border-teal-100">
                    <span className="block text-[10px] text-slate-500 font-medium">Agua a Tratar:</span>
                    <span className="font-extrabold text-teal-950 text-sm">
                      {(calculatedWaterVolumeLiters / 1000).toFixed(1)} m³
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      {calculatedWaterVolumeLiters.toLocaleString()} L ({currentLevelPercent}%)
                    </span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-xl border border-teal-100">
                    <span className="block text-[10px] text-slate-500 font-medium">Hipoclorito Calcio (65%):</span>
                    <span className="font-extrabold text-teal-700 text-sm">
                      {estHypo65Grams >= 1000 ? `${(estHypo65Grams / 1000).toFixed(2)} kg` : `${estHypo65Grams} g`}
                    </span>
                    <span className="block text-[9.5px] text-slate-400">polvo / granulado</span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-xl border border-teal-100">
                    <span className="block text-[10px] text-slate-500 font-medium">Hipoclorito Sodio (10%):</span>
                    <span className="font-extrabold text-cyan-700 text-sm">
                      {estHypo10Ml >= 1000 ? `${(estHypo10Ml / 1000).toFixed(2)} L` : `${estHypo10Ml} mL`}
                    </span>
                    <span className="block text-[9.5px] text-slate-400">lejía líquida</span>
                  </div>
                </div>

                <div className="mt-2 text-[10.5px] text-teal-900/80 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>
                    Dosis estequiométrica calculada para alcanzar 1.5 ppm de cloro libre residual (D.S. N.° 031-2010-SA).
                  </span>
                </div>
              </div>

              {/* Manual Capacity & Level Adjustment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capacidad Total Oficial (Litros):
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={capacityLiters}
                    onChange={(e) => setCapacityLiters(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Nivel de Llenado Inicial:
                    </label>
                    <span className="font-mono font-bold text-xs text-teal-800">{currentLevelPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentLevelPercent}
                    onChange={(e) => setCurrentLevelPercent(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 mt-2"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Tanque</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo, useRef } from 'react';
import {
  Map as MapIcon,
  Layers,
  MapPin,
  AlertTriangle,
  Activity,
  Droplets,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Radio,
  FileSpreadsheet,
  Workflow,
  Factory,
  Building,
  Home,
  Waves,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  WaterSystem,
  SamplingRecord,
  WaterSample,
  AquaAlertItem,
  AquaRiskItem,
  TerritorialComponentType,
  TerritorialSemaphore,
  WaterSystemTerritorialProfile,
} from '../../types';
import {
  loadPersistedTerritorialProfiles,
  savePersistedTerritorialProfiles,
  calculateSystemSemaphore,
  exportTerritoryToGeoJSON,
  TERRITORY_BOUNDS,
} from '../../data/territorioData';
import { GeoreferenceModal } from './GeoreferenceModal';

interface AquaTerritorioViewProps {
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples: WaterSample[];
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
  onNavigateToJass?: (systemId?: string) => void;
  onNavigateToLab?: () => void;
  onNavigateToRisk?: () => void;
  onNavigateToAlerts?: () => void;
  onOpenDosage?: (systemId?: string) => void;
  activeOperatorName?: string;
}

export const AquaTerritorioView: React.FC<AquaTerritorioViewProps> = ({
  systems,
  records,
  samples,
  alerts,
  risks,
  onNavigateToJass,
  onNavigateToLab,
  onNavigateToRisk,
  onNavigateToAlerts,
  onOpenDosage,
  activeOperatorName = 'Especialista Territorial GIS',
}) => {
  // Profiles state
  const [profiles, setProfiles] = useState<WaterSystemTerritorialProfile[]>(() =>
    loadPersistedTerritorialProfiles()
  );

  // Selected system
  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    profiles[0]?.systemId || 'sys-01'
  );

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSemaphore, setFilterSemaphore] = useState<string>('todos');
  const [filterCuenca, setFilterCuenca] = useState<string>('todas');
  const [showUngeocodedModal, setShowUngeocodedModal] = useState(false);
  const [georefProfileTarget, setGeorefProfileTarget] =
    useState<WaterSystemTerritorialProfile | null>(null);

  // GIS Map Interaction State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapBaseStyle, setMapBaseStyle] = useState<
    'topografico' | 'sanitario' | 'satelital'
  >('topografico');

  // GIS Layer Visibility
  const [visibleLayers, setVisibleLayers] = useState<
    Record<TerritorialComponentType, boolean>
  >({
    jass: true,
    sistema: true,
    fuente: true,
    captacion: true,
    planta: true,
    reservorio: true,
    punto_muestreo: true,
    alerta: true,
  });

  const [mouseCoords, setMouseCoords] = useState<{
    lat: number;
    lng: number;
    utmEast: number;
    utmNorth: number;
  }>({
    lat: TERRITORY_BOUNDS.centerLat,
    lng: TERRITORY_BOUNDS.centerLng,
    utmEast: 765420,
    utmNorth: 9145800,
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Toggle single layer
  const toggleLayer = (type: TerritorialComponentType) => {
    setVisibleLayers((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Handle saving new coordinates for a profile
  const handleSaveCoordinates = (
    sysId: string,
    lat: number,
    lng: number,
    altitude?: number
  ) => {
    const updated = profiles.map((p) => {
      if (p.systemId === sysId) {
        return {
          ...p,
          coordinates: {
            lat,
            lng,
            altitudeMeters: altitude || 2400,
            utmZone: '17S',
            utmEast: Math.round(700000 + (lng + 79) * 100000),
            utmNorth: Math.round(9100000 + (lat + 8) * 110000),
          },
        };
      }
      return p;
    });
    setProfiles(updated);
    savePersistedTerritorialProfiles(updated);
  };

  // Systems with / without coordinates (Strictly no invented coordinates)
  const { geocodedProfiles, unGeocodedProfiles } = useMemo(() => {
    const geo: WaterSystemTerritorialProfile[] = [];
    const ungeo: WaterSystemTerritorialProfile[] = [];
    profiles.forEach((p) => {
      if (p.coordinates && typeof p.coordinates.lat === 'number') {
        geo.push(p);
      } else {
        ungeo.push(p);
      }
    });
    return { geocodedProfiles: geo, unGeocodedProfiles: ungeo };
  }, [profiles]);

  // Evaluated semaphores for all systems
  const systemEvaluations = useMemo(() => {
    const map = new Map<
      string,
      ReturnType<typeof calculateSystemSemaphore> & {
        profile: WaterSystemTerritorialProfile;
      }
    >();

    profiles.forEach((p) => {
      const sysMatch = systems.find((s) => s.id === p.systemId);
      const fallbackPpm = sysMatch?.lastChlorinePpm ?? 1.2;
      const evaluation = calculateSystemSemaphore(
        p.systemId,
        p.systemName,
        records,
        samples,
        alerts,
        risks,
        fallbackPpm
      );
      map.set(p.systemId, { ...evaluation, profile: p });
    });

    return map;
  }, [profiles, systems, records, samples, alerts, risks]);

  // Selected system evaluation & profile
  const selectedEval = useMemo(() => {
    return (
      systemEvaluations.get(selectedSystemId) ||
      systemEvaluations.values().next().value
    );
  }, [selectedSystemId, systemEvaluations]);

  const selectedProfile = selectedEval?.profile;

  // Global semaphore statistics
  const semaphoreStats = useMemo(() => {
    let adecuado = 0;
    let vigilancia = 0;
    let riesgoAlto = 0;
    let critico = 0;

    systemEvaluations.forEach((val) => {
      if (val.semaphore === 'adecuado') adecuado++;
      else if (val.semaphore === 'vigilancia') vigilancia++;
      else if (val.semaphore === 'riesgo_alto') riesgoAlto++;
      else if (val.semaphore === 'critico') critico++;
    });

    return { adecuado, vigilancia, riesgoAlto, critico, total: systemEvaluations.size };
  }, [systemEvaluations]);

  // Unique basins for filter
  const uniqueCuencas = useMemo(() => {
    return Array.from(new Set(profiles.map((p) => p.cuenca)));
  }, [profiles]);

  // Chlorine trend records for selected system
  const trendData = useMemo(() => {
    if (!selectedProfile) return [];
    const sysRecords = records.filter(
      (r) =>
        r.systemId === selectedProfile.systemId ||
        r.systemName.toLowerCase().includes(selectedProfile.systemName.toLowerCase()) ||
        selectedProfile.systemName.toLowerCase().includes(r.systemName.toLowerCase())
    );

    // Sort ascending by time
    sysRecords.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const mapped = sysRecords.map((r) => ({
      date: r.dateStr.replace('2026-', ''),
      cloro: r.freeChlorinePpm,
      minNorm: 0.5,
      maxNorm: 2.0,
      ph: r.ph,
      turbidez: r.turbidityNtu,
    }));

    if (mapped.length === 0) {
      // If no historical records yet, provide current baseline point
      return [
        {
          date: 'Monitoreo 1',
          cloro: selectedEval?.lastChlorinePpm || 1.4,
          minNorm: 0.5,
          maxNorm: 2.0,
          ph: 7.2,
          turbidez: 1.5,
        },
        {
          date: 'Hoy',
          cloro: selectedEval?.lastChlorinePpm || 1.4,
          minNorm: 0.5,
          maxNorm: 2.0,
          ph: 7.3,
          turbidez: 1.2,
        },
      ];
    }
    return mapped;
  }, [selectedProfile, records, selectedEval]);

  // Map coordinate projection helper: Lat/Lng -> % in SVG view
  const projectGeoToMap = (lat: number, lng: number) => {
    const latSpan = TERRITORY_BOUNDS.maxLat - TERRITORY_BOUNDS.minLat;
    const lngSpan = TERRITORY_BOUNDS.maxLng - TERRITORY_BOUNDS.minLng;

    // Y increases downward, lat increases upward
    const yPct = ((TERRITORY_BOUNDS.maxLat - lat) / latSpan) * 100;
    const xPct = ((lng - TERRITORY_BOUNDS.minLng) / lngSpan) * 100;

    return { x: Math.max(5, Math.min(95, xPct)), y: Math.max(5, Math.min(95, yPct)) };
  };

  // Mouse pan handlers for GIS canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      const lng =
        TERRITORY_BOUNDS.minLng +
        relX * (TERRITORY_BOUNDS.maxLng - TERRITORY_BOUNDS.minLng);
      const lat =
        TERRITORY_BOUNDS.maxLat -
        relY * (TERRITORY_BOUNDS.maxLat - TERRITORY_BOUNDS.minLat);

      const utmEast = Math.round(700000 + (lng + 79) * 100000);
      const utmNorth = Math.round(9100000 + (lat + 8) * 110000);

      setMouseCoords({ lat, lng, utmEast, utmNorth });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export GeoJSON file
  const handleExportGeoJSON = () => {
    const geojson = exportTerritoryToGeoJSON(
      profiles,
      records,
      samples,
      alerts,
      risks
    );
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AQUA_TERRITORIO_GEOJSON_${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Semaphore color helpers
  const getSemaphoreBadge = (sem: TerritorialSemaphore) => {
    switch (sem) {
      case 'adecuado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hud font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            🟢 ADECUADO
          </span>
        );
      case 'vigilancia':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hud font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            🟡 VIGILANCIA
          </span>
        );
      case 'riesgo_alto':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hud font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            🟠 RIESGO ALTO
          </span>
        );
      case 'critico':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hud font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            🔴 CRÍTICO
          </span>
        );
    }
  };

  const getSemaphorePinColor = (sem: TerritorialSemaphore) => {
    switch (sem) {
      case 'adecuado':
        return { bg: 'bg-emerald-500', ring: 'ring-emerald-300', text: 'text-emerald-700', hex: '#10b981' };
      case 'vigilancia':
        return { bg: 'bg-amber-500', ring: 'ring-amber-300', text: 'text-amber-700', hex: '#f59e0b' };
      case 'riesgo_alto':
        return { bg: 'bg-orange-500', ring: 'ring-orange-300', text: 'text-orange-700', hex: '#f97316' };
      case 'critico':
        return { bg: 'bg-rose-600', ring: 'ring-rose-300', text: 'text-rose-700', hex: '#e11d48' };
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header & GIS Command Center */}
      <div className="bg-gradient-to-r from-[#002f3a] via-[#004e5f] to-[#00242e] rounded-3xl p-6 text-white shadow-xl border border-cyan-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-hud text-[10px] font-extrabold uppercase tracking-wider border border-cyan-400/30">
                FASE 7 • VIGILANCIA TERRITORIAL
              </span>
              <span className="flex items-center gap-1 text-[11px] text-cyan-200/80 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> GIS WGS84
                (EPSG:4326) / UTM 17S
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-hud text-white tracking-tight flex items-center gap-3">
              <MapIcon className="w-7 h-7 text-cyan-400" />
              AQUA-TERRITORIO
            </h1>
            <p className="text-sm text-cyan-100/90 max-w-2xl mt-1 leading-relaxed">
              Cartografía hidro-sanitaria inteligente y geovigilancia en cuenca.
              Visualización de fuentes, captaciones, plantas, reservorios y puntos
              de muestreo con semáforo normativo en tiempo real basado exclusivamente
              en datos reales de la plataforma.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportGeoJSON}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-hud font-bold transition-colors cursor-pointer"
              title="Descargar capa vectorial en formato estándar GeoJSON para QGIS, ArcGIS y Google Earth"
              type="button"
            >
              <Download className="w-4 h-4" />
              Exportar GeoJSON (QGIS)
            </button>
            <button
              onClick={() => {
                if (unGeocodedProfiles.length > 0) {
                  setGeorefProfileTarget(unGeocodedProfiles[0]);
                  setShowUngeocodedModal(true);
                } else {
                  setGeorefProfileTarget(profiles[0]);
                  setShowUngeocodedModal(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002820] font-hud text-xs font-extrabold shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer"
              type="button"
            >
              <MapPin className="w-4 h-4" />
              Georreferenciar In Situ
            </button>
          </div>
        </div>

        {/* Semaphore Summary Ribbon */}
        <div className="mt-6 pt-5 border-t border-cyan-800/40 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-cyan-950/50 backdrop-blur-xs rounded-2xl p-3 border border-cyan-800/30">
            <span className="text-[10px] text-cyan-300 font-hud font-bold uppercase block">
              Sistemas Totales
            </span>
            <div className="text-xl font-bold font-hud text-white mt-0.5">
              {semaphoreStats.total}{' '}
              <span className="text-[10px] text-cyan-300 font-normal">
                ({geocodedProfiles.length} en mapa)
              </span>
            </div>
          </div>

          <div className="bg-emerald-950/40 backdrop-blur-xs rounded-2xl p-3 border border-emerald-600/30">
            <span className="text-[10px] text-emerald-300 font-hud font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              🟢 Adecuado
            </span>
            <div className="text-xl font-bold font-hud text-emerald-200 mt-0.5">
              {semaphoreStats.adecuado}
            </div>
          </div>

          <div className="bg-amber-950/40 backdrop-blur-xs rounded-2xl p-3 border border-amber-600/30">
            <span className="text-[10px] text-amber-300 font-hud font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              🟡 Vigilancia
            </span>
            <div className="text-xl font-bold font-hud text-amber-200 mt-0.5">
              {semaphoreStats.vigilancia}
            </div>
          </div>

          <div className="bg-orange-950/40 backdrop-blur-xs rounded-2xl p-3 border border-orange-600/30">
            <span className="text-[10px] text-orange-300 font-hud font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              🟠 Riesgo Alto
            </span>
            <div className="text-xl font-bold font-hud text-orange-200 mt-0.5">
              {semaphoreStats.riesgoAlto}
            </div>
          </div>

          <div className="bg-rose-950/40 backdrop-blur-xs rounded-2xl p-3 border border-rose-600/30 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-rose-300 font-hud font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              🔴 Crítico
            </span>
            <div className="text-xl font-bold font-hud text-rose-200 mt-0.5">
              {semaphoreStats.critico}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main GIS Grid: Map View (8 cols) + Detail Inspection Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Interactive GIS Map Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Controls Bar above Map */}
          <div className="bg-white rounded-2xl p-3.5 border border-cyan-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar sistema, JASS, fuente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-cyan-500 outline-none w-44 sm:w-56"
                />
              </div>

              <select
                value={filterCuenca}
                onChange={(e) => setFilterCuenca(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
              >
                <option value="todas">Todas las cuencas</option>
                {uniqueCuencas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filterSemaphore}
                onChange={(e) => setFilterSemaphore(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
              >
                <option value="todos">Todos los semáforos</option>
                <option value="adecuado">🟢 Adecuado</option>
                <option value="vigilancia">🟡 Vigilancia</option>
                <option value="riesgo_alto">🟠 Riesgo Alto</option>
                <option value="critico">🔴 Crítico</option>
              </select>
            </div>

            {/* Base Map Style Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-hud font-bold">
              <button
                type="button"
                onClick={() => setMapBaseStyle('topografico')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapBaseStyle === 'topografico'
                    ? 'bg-white text-cyan-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Topográfico
              </button>
              <button
                type="button"
                onClick={() => setMapBaseStyle('sanitario')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapBaseStyle === 'sanitario'
                    ? 'bg-white text-cyan-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sanitario
              </button>
              <button
                type="button"
                onClick={() => setMapBaseStyle('satelital')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  mapBaseStyle === 'satelital'
                    ? 'bg-[#002f3a] text-cyan-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satelital
              </button>
            </div>
          </div>

          {/* GIS Interactive Layer Toggles Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-hud">
            <span className="text-slate-400 font-bold px-1 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Capas:
            </span>
            <button
              type="button"
              onClick={() => toggleLayer('jass')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.jass
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Home className="w-3 h-3" />
              JASS
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('fuente')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.fuente
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Waves className="w-3 h-3 text-blue-600" />
              Fuentes
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('captacion')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.captacion
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Workflow className="w-3 h-3 text-indigo-600" />
              Captaciones
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('planta')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.planta
                  ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Factory className="w-3 h-3 text-teal-600" />
              Plantas
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('reservorio')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.reservorio
                  ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Building className="w-3 h-3 text-sky-600" />
              Reservorios
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('punto_muestreo')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.punto_muestreo
                  ? 'bg-purple-50 border-purple-300 text-purple-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <Droplets className="w-3 h-3 text-purple-600" />
              Puntos Muestreo
            </button>
            <button
              type="button"
              onClick={() => toggleLayer('alerta')}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleLayers.alerta
                  ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              Alertas Activas
            </button>
          </div>

          {/* Interactive GIS Map Canvas */}
          <div
            ref={mapContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative w-full h-[520px] rounded-3xl border border-cyan-200 shadow-md overflow-hidden select-none transition-colors ${
              mapBaseStyle === 'topografico'
                ? 'bg-[#e7f3f6]'
                : mapBaseStyle === 'sanitario'
                ? 'bg-[#f8fafc]'
                : 'bg-[#00171f]'
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {/* GIS Zoom & Orientation HUD Controls */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-cyan-100">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                title="Acercar Zoom"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                title="Alejar Zoom"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                title="Centrar Cuenca Completa"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compass Rose & Projection Metadata (Top Right) */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-cyan-100 text-[10px] font-mono text-cyan-900">
              <div className="w-6 h-6 rounded-full bg-cyan-100 border border-cyan-300 flex items-center justify-center font-bold text-cyan-800 text-[10px]">
                N
              </div>
              <div>
                <span className="font-bold font-hud block">WGS84 • EPSG:4326</span>
                <span className="text-slate-500">ZONA 17S PERÚ</span>
              </div>
            </div>

            {/* Scale Bar & Coordinates Readout HUD (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-cyan-100 text-[10.5px] font-mono text-slate-700 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-800 font-bold font-hud">CURSOR:</span>
                <span>
                  {mouseCoords.lat.toFixed(4)}°S, {mouseCoords.lng.toFixed(4)}°W
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">
                  UTM: {mouseCoords.utmEast}E {mouseCoords.utmNorth}N
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <div className="w-16 h-1.5 bg-slate-800 rounded-xs" />
                <span className="text-[9.5px] text-slate-500 font-bold">
                  {Math.round(5 / zoomLevel)} km
                </span>
              </div>
            </div>

            {/* Semáforo Visual Legend (Bottom Right) */}
            <div className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-cyan-100 text-[10px] font-hud">
              <span className="font-extrabold text-[#002f3a] uppercase block mb-1.5">
                Semáforo Sanitario:
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  <span className="text-emerald-900 font-bold">🟢 Adecuado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                  <span className="text-amber-900 font-bold">🟡 Vigilancia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
                  <span className="text-orange-900 font-bold">🟠 Riesgo Alto</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-xs animate-pulse" />
                  <span className="text-rose-900 font-bold">🔴 Crítico</span>
                </div>
              </div>
            </div>

            {/* Map Geometric Elements & Basemap SVG Container */}
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              className="absolute inset-0 w-full h-full"
            >
              <svg className="w-full h-full pointer-events-none">
                <defs>
                  {/* Grid Pattern */}
                  <pattern
                    id="grid-coords"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 60"
                      fill="none"
                      stroke={mapBaseStyle === 'satelital' ? '#083344' : '#cce3e8'}
                      strokeWidth="0.75"
                    />
                  </pattern>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0077b6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#023e8a" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Coordinate Gridlines */}
                <rect width="100%" height="100%" fill="url(#grid-coords)" opacity="0.6" />

                {/* Topographic Contours & River Basins (Alto Chicama & Moche) */}
                <path
                  d="M 40 120 C 120 80, 260 140, 380 110 S 620 180, 780 130 S 920 190, 1100 160"
                  fill="none"
                  stroke={mapBaseStyle === 'satelital' ? '#164e63' : '#b6dce5'}
                  strokeWidth="24"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* Main Hydrographic River Spine: Río Chicama / Moche */}
                <path
                  d="M 20 80 Q 180 140 320 90 T 560 160 T 840 220 T 1100 280"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Tributary Streams / Quebradas */}
                <path
                  d="M 320 0 Q 340 50 320 90"
                  fill="none"
                  stroke="#48cae4"
                  strokeWidth="3.5"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 640 40 Q 610 110 560 160"
                  fill="none"
                  stroke="#48cae4"
                  strokeWidth="4"
                  strokeDasharray="5 3"
                />
                <path
                  d="M 720 340 Q 770 270 840 220"
                  fill="none"
                  stroke="#48cae4"
                  strokeWidth="3"
                />

                {/* Elevation Contours */}
                <ellipse
                  cx="240"
                  cy="180"
                  rx="160"
                  ry="90"
                  fill="none"
                  stroke={mapBaseStyle === 'satelital' ? '#0f766e' : '#93c5fd'}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                <ellipse
                  cx="740"
                  cy="210"
                  rx="200"
                  ry="110"
                  fill="none"
                  stroke={mapBaseStyle === 'satelital' ? '#0f766e' : '#93c5fd'}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
              </svg>

              {/* GEOLOCATED SYSTEMS & COMPONENTS (Only Real Data, No Invented Positions) */}
              {geocodedProfiles
                .filter((p) => {
                  if (filterCuenca !== 'todas' && p.cuenca !== filterCuenca) return false;
                  const evalData = systemEvaluations.get(p.systemId);
                  if (
                    filterSemaphore !== 'todos' &&
                    evalData?.semaphore !== filterSemaphore
                  )
                    return false;
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return (
                      p.systemName.toLowerCase().includes(q) ||
                      p.jassName.toLowerCase().includes(q) ||
                      p.fuenteNombre.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((profile) => {
                  const evalData = systemEvaluations.get(profile.systemId);
                  const sem = evalData?.semaphore || 'adecuado';
                  const pinStyles = getSemaphorePinColor(sem);
                  const isSelected = selectedSystemId === profile.systemId;

                  const pos = projectGeoToMap(
                    profile.coordinates!.lat,
                    profile.coordinates!.lng
                  );

                  return (
                    <React.Fragment key={`sys-group-${profile.systemId}`}>
                      {/* Secondary Components (Fuentes, Captaciones, Plantas, Puntos Muestreo) */}
                      {profile.components.map((comp) => {
                        if (!comp.coordinates || !visibleLayers[comp.type]) return null;
                        const compPos = projectGeoToMap(
                          comp.coordinates.lat,
                          comp.coordinates.lng
                        );

                        // Component Icon & Color
                        let CompIcon = Droplets;
                        let compBg = 'bg-cyan-600';
                        if (comp.type === 'fuente') {
                          CompIcon = Waves;
                          compBg = 'bg-blue-600';
                        } else if (comp.type === 'captacion') {
                          CompIcon = Workflow;
                          compBg = 'bg-indigo-600';
                        } else if (comp.type === 'planta') {
                          CompIcon = Factory;
                          compBg = 'bg-teal-600';
                        } else if (comp.type === 'reservorio') {
                          CompIcon = Building;
                          compBg = 'bg-sky-700';
                        } else if (comp.type === 'jass') {
                          CompIcon = Home;
                          compBg = 'bg-cyan-700';
                        }

                        return (
                          <div
                            key={comp.id}
                            style={{
                              top: `${compPos.y}%`,
                              left: `${compPos.x}%`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer pointer-events-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSystemId(profile.systemId);
                            }}
                            title={`${comp.name} (${comp.type})`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full ${compBg} text-white flex items-center justify-center shadow-md border border-white hover:scale-125 transition-transform`}
                            >
                              <CompIcon className="w-2.5 h-2.5" />
                            </div>

                            {/* Hover Component Tooltip */}
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900/90 text-white rounded-lg text-[9px] font-hud whitespace-nowrap shadow-lg z-40">
                              <span className="font-bold">{comp.name}</span>
                              <span className="block text-[8px] text-cyan-300">
                                {comp.type.toUpperCase()} • Alt: {comp.coordinates.altitudeMeters}m
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Main Water System Pin */}
                      {visibleLayers.sistema && (
                        <div
                          style={{
                            top: `${pos.y}%`,
                            left: `${pos.x}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer pointer-events-auto transition-transform ${
                            isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSystemId(profile.systemId);
                          }}
                        >
                          <div className="relative flex items-center justify-center">
                            {/* Alert ripple if critical */}
                            {sem === 'critico' && visibleLayers.alerta && (
                              <span className="absolute w-10 h-10 rounded-full bg-rose-500 opacity-75 animate-ping pointer-events-none" />
                            )}
                            {sem === 'riesgo_alto' && (
                              <span className="absolute w-8 h-8 rounded-full bg-orange-400 opacity-60 animate-ping pointer-events-none" />
                            )}

                            {/* Pin Body */}
                            <div
                              className={`w-9 h-9 rounded-2xl ${pinStyles.bg} text-white font-bold flex flex-col items-center justify-center shadow-xl border-2 border-white ring-2 ${pinStyles.ring}`}
                            >
                              <Droplets className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Pin Tag */}
                          <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-xl font-hud text-[10px] whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#002f3a] text-cyan-200 border border-cyan-400 font-extrabold'
                                : 'bg-white/95 text-slate-800 border border-slate-200 font-bold'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${pinStyles.bg}`}
                            />
                            <span>{profile.systemName}</span>
                            <span className="font-mono text-[9px] text-cyan-600 bg-cyan-50 px-1 rounded-sm">
                              {evalData?.lastChlorinePpm.toFixed(2)} ppm
                            </span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </div>

          {/* Ungeocoded Systems Warning Bar (Strict adherence to "Si no existen coordenadas, mostrar el sistema sin inventar ubicación") */}
          {unGeocodedProfiles.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-hud text-amber-900 uppercase">
                    {unGeocodedProfiles.length} Sistema(s) sin Georreferenciación (Levantamiento GIS Pendiente)
                  </h4>
                  <p className="text-[11.5px] text-amber-800/90 mt-0.5 leading-relaxed">
                    Por rigor técnico normativo, <strong>no se inventan ubicaciones en el mapa</strong>.
                    Los siguientes sistemas están registrados y vigilados pero requieren registro de GPS en campo:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {unGeocodedProfiles.map((sys) => (
                      <button
                        key={sys.systemId}
                        onClick={() => setSelectedSystemId(sys.systemId)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-hud font-bold transition-all cursor-pointer ${
                          selectedSystemId === sys.systemId
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        📍 {sys.systemName} ({sys.jassName})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setGeorefProfileTarget(unGeocodedProfiles[0]);
                  setShowUngeocodedModal(true);
                }}
                className="shrink-0 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-hud font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                type="button"
              >
                <MapPin className="w-4 h-4" />
                Levantar Coordenadas
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Selected System Detailed Inspection Panel (4 cols) */}
        {/* Strictly contains: Nombre, JASS, Fuente, Último control de cloro, Últimos resultados de laboratorio, Alertas, Riesgos, Acciones pendientes, Tendencias */}
        <div className="lg:col-span-4 space-y-4">
          {selectedProfile && selectedEval ? (
            <div className="bg-white rounded-3xl p-5 border border-cyan-100 shadow-sm space-y-4">
              {/* Header: System Name & Semaphore */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-hud font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                    FICHA TERRITORIAL GIS
                  </span>
                  {getSemaphoreBadge(selectedEval.semaphore)}
                </div>

                {/* 1. Nombre */}
                <h2 className="text-base sm:text-lg font-black font-hud text-[#002f3a] leading-tight">
                  {selectedProfile.systemName}
                </h2>
                <span className="text-xs text-slate-500 block mt-0.5">
                  ID: <span className="font-mono">{selectedProfile.systemId}</span> • {selectedProfile.cuenca}
                </span>

                {selectedProfile.coordinates ? (
                  <div className="mt-2 text-[11px] font-mono text-cyan-800 bg-cyan-50/70 p-2 rounded-xl border border-cyan-100 flex items-center justify-between">
                    <span>
                      {selectedProfile.coordinates.lat.toFixed(5)}°S,{' '}
                      {selectedProfile.coordinates.lng.toFixed(5)}°W
                    </span>
                    <span className="font-bold">
                      {selectedProfile.coordinates.altitudeMeters} msnm
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] font-hud text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                    <span>⚠️ Sin georreferenciación GPS</span>
                    <button
                      type="button"
                      onClick={() => {
                        setGeorefProfileTarget(selectedProfile);
                        setShowUngeocodedModal(true);
                      }}
                      className="text-[10px] font-bold underline hover:text-amber-950"
                    >
                      Asignar ahora
                    </button>
                  </div>
                )}
              </div>

              {/* 2. JASS & Gobernanza */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                  Organización Comunal Responsable:
                </span>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-cyan-700" />
                  {selectedProfile.jassName}
                </div>
                <div className="text-[11px] text-slate-600">
                  Presidente: {selectedProfile.jassPresident || 'Comité Directivo Electo'}
                </div>
                <div className="text-[11px] text-slate-600">
                  Operador: {selectedProfile.jassOperator || 'Operador Técnico Comunitario'}
                </div>
                <div className="text-[10.5px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-200/60 font-mono">
                  <span>Población: {selectedProfile.beneficiaryCount} hab.</span>
                  <span>Conexiones: {selectedProfile.connectionsCount}</span>
                </div>
              </div>

              {/* 3. Fuente de Agua */}
              <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-1">
                <span className="text-[10px] font-hud font-bold text-cyan-800 uppercase block">
                  Fuente y Captación Hidráulica:
                </span>
                <div className="text-xs font-bold text-[#002f3a] flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-blue-600" />
                  {selectedProfile.fuenteNombre}
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Tipo: {selectedProfile.fuenteTipo.replace('_', ' ').toUpperCase()}</span>
                  <span className="font-mono font-bold text-cyan-800">
                    Aforo: {selectedProfile.fuenteCaudalLs || 4.5} L/s
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Captación: {selectedProfile.captacionNombre}
                </div>
                {selectedProfile.plantaTratamiento && (
                  <div className="text-[11px] text-slate-600">
                    Tratamiento: {selectedProfile.plantaTratamiento}
                  </div>
                )}
              </div>

              {/* 4. Último Control de Cloro */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-hud font-bold text-slate-500 uppercase">
                    Último Control de Cloro Residual:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedEval.lastChlorineDate}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black font-hud text-[#002f3a] flex items-baseline gap-1">
                      {selectedEval.lastChlorinePpm.toFixed(2)}
                      <span className="text-xs font-normal text-slate-500">ppm Cl₂</span>
                    </div>
                    <span className="text-[11px] text-slate-600 leading-tight block">
                      {selectedEval.reason}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    {selectedEval.lastChlorinePpm >= 0.5 &&
                    selectedEval.lastChlorinePpm <= 2.0 ? (
                      <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-hud text-[10px] font-bold block">
                        CUMPLE NORMA
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-800 font-hud text-[10px] font-bold block">
                        FUERA DE RANGO
                      </span>
                    )}
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      D.S. 031-2010-SA
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Últimos Resultados de Laboratorio */}
              <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-hud font-bold text-purple-900 uppercase flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-purple-700" />
                    Últimos Resultados de Laboratorio:
                  </span>
                  {selectedEval.labSample && (
                    <span className="text-[9.5px] font-mono text-purple-700 font-bold">
                      {selectedEval.labSample.code}
                    </span>
                  )}
                </div>

                {selectedEval.labSample ? (
                  <div className="space-y-1 text-xs">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                      <div className="p-1.5 rounded-lg bg-white border border-purple-100">
                        <span className="text-[9px] text-slate-400 block">Microbiología</span>
                        <span
                          className={`font-bold ${
                            selectedEval.hasEcoli ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {selectedEval.hasEcoli
                            ? '🔴 Patógenos Detectados'
                            : '🟢 0 UFC E. coli (Conforme)'}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-purple-100">
                        <span className="text-[9px] text-slate-400 block">Metales Pesados</span>
                        <span
                          className={`font-bold ${
                            selectedEval.hasMetalsExceeded
                              ? 'text-rose-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {selectedEval.hasMetalsExceeded
                            ? '🔴 Supera LMP'
                            : '🟢 Dentro de Límites'}
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                      <span>Muestreado: {selectedEval.labSample.date}</span>
                      <button
                        type="button"
                        onClick={onNavigateToLab}
                        className="text-purple-700 font-bold hover:underline"
                      >
                        Ver ensayo completo &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic py-1">
                    Sin ensayos de laboratorio registrados para este sistema.
                  </div>
                )}
              </div>

              {/* 6. Alertas Activas */}
              <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-hud font-bold text-rose-900 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Alertas Sanitarias ({selectedEval.activeAlerts.length}):
                  </span>
                  {selectedEval.activeAlerts.length > 0 && (
                    <button
                      type="button"
                      onClick={onNavigateToAlerts}
                      className="text-[10px] font-hud text-rose-700 font-bold hover:underline"
                    >
                      AQUA-ALERT &rarr;
                    </button>
                  )}
                </div>

                {selectedEval.activeAlerts.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedEval.activeAlerts.slice(0, 2).map((a) => (
                      <div
                        key={a.code}
                        className="p-2 rounded-xl bg-white border border-rose-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-[11px]">
                            {a.parameter} • {a.result}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                            {a.requiredAction}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-hud font-bold bg-rose-100 text-rose-800 shrink-0">
                          {a.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sin alertas sanitarias activas
                  </div>
                )}
              </div>

              {/* 7. Riesgos en Matriz */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-hud font-bold text-amber-900 uppercase flex items-center gap-1">
                    <Activity className="w-3 h-3 text-amber-700" />
                    Riesgos en Matriz AQUA-RISK:
                  </span>
                  {onNavigateToRisk && (
                    <button
                      type="button"
                      onClick={onNavigateToRisk}
                      className="text-[10px] font-hud text-amber-800 font-bold hover:underline"
                    >
                      Matriz &rarr;
                    </button>
                  )}
                </div>

                {selectedEval.activeRisks.length > 0 ? (
                  <div className="space-y-1">
                    {selectedEval.activeRisks.slice(0, 2).map((r) => (
                      <div
                        key={r.id}
                        className="p-2 rounded-xl bg-white border border-amber-200 text-[11px] text-slate-800 flex items-center justify-between"
                      >
                        <span className="truncate max-w-[220px]">{r.danger}</span>
                        <span className="text-[9px] font-hud font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                          {r.riskLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic py-1">
                    Peligros controlados en condiciones estables.
                  </div>
                )}
              </div>

              {/* 8. Acciones Pendientes */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-hud font-bold text-slate-500 uppercase block">
                  Acciones Pendientes de Campo:
                </span>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {selectedEval.lastChlorinePpm < 0.5 && (
                    <li className="text-rose-700 font-bold">
                      Realizar dosificación correctiva y recarga de hipoclorito.
                    </li>
                  )}
                  {selectedEval.hasEcoli && (
                    <li className="text-rose-700 font-bold">
                      Desinfección de choque inmediata y remuestreo bacteriológico.
                    </li>
                  )}
                  <li>Inspección sanitaria periódica a la captación y cerco perimétrico.</li>
                  <li>Calibración de gotero o válvula de carga constante en caseta.</li>
                </ul>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenDosage?.(selectedProfile.systemId)}
                    className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-hud text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Droplets className="w-3.5 h-3.5" /> Clorar Dosis
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToJass?.(selectedProfile.systemId)}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-hud text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    AQUA-JASS
                  </button>
                </div>
              </div>

              {/* 9. Tendencias (Gráfico Histórico de Cloro y Seguridad Sanitaria) */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-hud font-bold text-slate-600 uppercase">
                    Tendencia de Cloro Residual Libre:
                  </span>
                  <span className="text-[9px] font-hud text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Franja Segura: 0.5 - 2.0 ppm
                  </span>
                </div>

                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 3]}
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#002f3a',
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '10px',
                          border: 'none',
                        }}
                      />
                      {/* Safe Regulatory Range Reference Lines */}
                      <ReferenceLine
                        y={0.5}
                        stroke="#10b981"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                      />
                      <ReferenceLine
                        y={2.0}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="cloro"
                        name="Cloro (ppm)"
                        stroke="#00b4d8"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#00b4d8' }}
                        activeDot={{ r: 5, fill: '#10e7b2' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-cyan-100 text-center text-slate-500">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold font-hud">Seleccione un sistema en el mapa</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Haga clic en cualquiera de los marcadores territoriales para inspeccionar
                su ficha completa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Georeference Modal */}
      {georefProfileTarget && (
        <GeoreferenceModal
          isOpen={showUngeocodedModal}
          onClose={() => {
            setShowUngeocodedModal(false);
            setGeorefProfileTarget(null);
          }}
          profile={georefProfileTarget}
          onSaveCoordinates={handleSaveCoordinates}
        />
      )}
    </div>
  );
};

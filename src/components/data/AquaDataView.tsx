import React, { useState, useMemo } from 'react';
import {
  WaterSample,
  SamplingRecord,
  WaterSystem,
  AquaAlertItem,
  AquaRiskItem,
  ActionPlanItem,
  AquaDataFilters,
} from '../../types';
import { AquaDataFiltersBar } from './AquaDataFiltersBar';
import { EmptyDataNotice } from './EmptyDataNotice';
import { GlassTitlePanel } from '../GlassTitlePanel';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export type AquaDataSubTab =
  | 'resumen'
  | 'cloro'
  | 'microbiologia'
  | 'fisicoquimica'
  | 'metales'
  | 'alertas'
  | 'riesgos'
  | 'sistemas'
  | 'jass';

interface AquaDataViewProps {
  samples: WaterSample[];
  records: SamplingRecord[];
  systems: WaterSystem[];
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
  plans?: ActionPlanItem[];
  onNavigateToPlan?: () => void;
  onNavigateToAlerts?: () => void;
  onNavigateToRisk?: () => void;
  onNavigateToLab?: () => void;
}

export const AquaDataView: React.FC<AquaDataViewProps> = ({
  samples,
  records,
  systems,
  alerts,
  risks,
  plans = [],
  onNavigateToPlan,
  onNavigateToAlerts,
  onNavigateToRisk,
  onNavigateToLab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AquaDataSubTab>('resumen');
  const [filters, setFilters] = useState<AquaDataFilters>({
    region: 'todos',
    provincia: 'todos',
    distrito: 'todos',
    jass: 'todos',
    sistema: 'todos',
    fechaPreset: 'todos',
    fechaInicio: '',
    fechaFin: '',
    parametro: 'todos',
  });

  // Extract real geographic options without inventing data
  const geoMetadata = useMemo(() => {
    const regions = new Set<string>();
    const provincias = new Set<string>();
    const distritos = new Set<string>();
    const jassSet = new Set<string>();
    const sistemasSet = new Set<string>();

    systems.forEach((s) => {
      sistemasSet.add(s.name);
      // parse location e.g. "Sector 1 - Red Principal, Lucma, Gran Chimú, La Libertad"
      const parts = s.location.split(',').map((p) => p.trim());
      if (parts.length >= 4) {
        distritos.add(parts[1]);
        provincias.add(parts[2]);
        regions.add(parts[3]);
      }
    });

    samples.forEach((smp) => {
      if (smp.jassName) jassSet.add(smp.jassName);
      if (smp.systemName) sistemasSet.add(smp.systemName);
      const parts = smp.origin.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        distritos.add(parts[1]);
        provincias.add(parts[2]);
      }
    });

    return {
      regions: Array.from(regions),
      provincias: Array.from(provincias),
      distritos: Array.from(distritos),
      jass: Array.from(jassSet),
      sistemas: Array.from(sistemasSet),
    };
  }, [systems, samples]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.region !== 'todos') count++;
    if (filters.provincia !== 'todos') count++;
    if (filters.distrito !== 'todos') count++;
    if (filters.jass !== 'todos') count++;
    if (filters.sistema !== 'todos') count++;
    if (filters.fechaPreset !== 'todos') count++;
    if (filters.parametro !== 'todos') count++;
    return count;
  }, [filters]);

  const activeFilterDescription = useMemo(() => {
    const parts: string[] = [];
    if (filters.region !== 'todos') parts.push(`Región: ${filters.region}`);
    if (filters.provincia !== 'todos') parts.push(`Provincia: ${filters.provincia}`);
    if (filters.distrito !== 'todos') parts.push(`Distrito: ${filters.distrito}`);
    if (filters.jass !== 'todos') parts.push(`JASS: ${filters.jass}`);
    if (filters.sistema !== 'todos') parts.push(`Sistema: ${filters.sistema}`);
    if (filters.fechaPreset !== 'todos') parts.push(`Período: ${filters.fechaPreset}`);
    if (filters.parametro !== 'todos') parts.push(`Parámetro: ${filters.parametro}`);
    return parts.join(' • ');
  }, [filters]);

  // Filter helper functions
  const isMatchGeo = (text: string) => {
    if (filters.region !== 'todos' && !text.includes(filters.region)) return false;
    if (filters.provincia !== 'todos' && !text.includes(filters.provincia)) return false;
    if (filters.distrito !== 'todos' && !text.includes(filters.distrito)) return false;
    return true;
  };

  const isMatchSystem = (sysName?: string) => {
    if (filters.sistema === 'todos') return true;
    if (!sysName) return false;
    return sysName.toLowerCase().includes(filters.sistema.toLowerCase());
  };

  const isMatchJass = (jassName?: string) => {
    if (filters.jass === 'todos') return true;
    if (!jassName) return false;
    return jassName.toLowerCase().includes(filters.jass.toLowerCase());
  };

  // 1. FILTERED CHLORINE OBSERVATIONS (from records + lab chlorine results)
  const chlorineObservations = useMemo(() => {
    const list: {
      id: string;
      date: string;
      system: string;
      point: string;
      ppm: number;
      compliance: 'optimo' | 'bajo' | 'cero' | 'alto';
      source: 'bitacora' | 'laboratorio';
    }[] = [];

    // From logbook records
    records.forEach((r) => {
      const matchSys = isMatchSystem(r.systemName);
      if (!matchSys) return;

      const ppm = r.freeChlorinePpm;
      let comp: 'optimo' | 'bajo' | 'cero' | 'alto' = 'optimo';
      if (ppm === 0) comp = 'cero';
      else if (ppm < 0.5) comp = 'bajo';
      else if (ppm > 2.0) comp = 'alto';

      list.push({
        id: r.id,
        date: r.dateStr === 'Hoy' ? '2026-09-14' : r.dateStr === 'Ayer' ? '2026-09-13' : '2026-09-11',
        system: r.systemName,
        point: r.measurementPoint,
        ppm,
        compliance: comp,
        source: 'bitacora',
      });
    });

    // From lab samples
    samples.forEach((smp) => {
      if (!isMatchSystem(smp.systemName) || !isMatchJass(smp.jassName) || !isMatchGeo(smp.origin)) {
        return;
      }
      smp.results.forEach((res) => {
        if (/cloro.*residual.*libre/i.test(res.parameter)) {
          const ppm = res.numericValue ?? parseFloat(res.result);
          if (!isNaN(ppm)) {
            let comp: 'optimo' | 'bajo' | 'cero' | 'alto' = 'optimo';
            if (ppm === 0) comp = 'cero';
            else if (ppm < 0.5) comp = 'bajo';
            else if (ppm > 2.0) comp = 'alto';

            list.push({
              id: `${smp.id}-${res.id}`,
              date: smp.date,
              system: smp.systemName,
              point: smp.point,
              ppm,
              compliance: comp,
              source: 'laboratorio',
            });
          }
        }
      });
    });

    // Sort chronologically
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [records, samples, filters]);

  // 2. FILTERED MICROBIOLOGY DATA
  const microObservations = useMemo(() => {
    const list: {
      id: string;
      date: string;
      sampleCode: string;
      system: string;
      point: string;
      parameter: string;
      result: string;
      numericValue?: number;
      unit: string;
      compliance: boolean;
      method: string;
    }[] = [];

    samples.forEach((smp) => {
      if (!isMatchSystem(smp.systemName) || !isMatchJass(smp.jassName) || !isMatchGeo(smp.origin)) {
        return;
      }
      smp.results.forEach((res) => {
        if (
          res.category === 'microbiologico' ||
          /coli|coliforme|bacteria/i.test(res.parameter)
        ) {
          if (filters.parametro === 'ecoli' && !/escherichia|e\. *coli/i.test(res.parameter)) return;
          if (filters.parametro === 'coliformes' && !/coliformes/i.test(res.parameter)) return;

          const isCompliant = res.compliance === 'cumple' || res.compliant === true;
          list.push({
            id: `${smp.id}-${res.id}`,
            date: smp.date,
            sampleCode: smp.code,
            system: smp.systemName,
            point: smp.point,
            parameter: res.parameter,
            result: res.result,
            numericValue: res.numericValue,
            unit: res.unit,
            compliance: isCompliant,
            method: res.method,
          });
        }
      });
    });

    return list;
  }, [samples, filters]);

  // 3. FILTERED PHYSICOCHEMICAL DATA
  const physicoObservations = useMemo(() => {
    const list: {
      id: string;
      date: string;
      sampleCode: string;
      system: string;
      point: string;
      parameter: string;
      result: string;
      numericValue?: number;
      unit: string;
      limit: string;
      compliance: boolean;
    }[] = [];

    samples.forEach((smp) => {
      if (!isMatchSystem(smp.systemName) || !isMatchJass(smp.jassName) || !isMatchGeo(smp.origin)) {
        return;
      }
      smp.results.forEach((res) => {
        if (res.category === 'fisicoquimico' && !/cloro/i.test(res.parameter)) {
          if (filters.parametro === 'turbidez' && !/turbidez/i.test(res.parameter)) return;
          if (filters.parametro === 'ph' && !/ph|potencial/i.test(res.parameter)) return;
          if (filters.parametro === 'conductividad' && !/conductividad/i.test(res.parameter)) return;
          if (filters.parametro === 'dureza' && !/dureza/i.test(res.parameter)) return;

          const isCompliant = res.compliance === 'cumple' || res.compliant === true;
          list.push({
            id: `${smp.id}-${res.id}`,
            date: smp.date,
            sampleCode: smp.code,
            system: smp.systemName,
            point: smp.point,
            parameter: res.parameter,
            result: res.result,
            numericValue: res.numericValue,
            unit: res.unit,
            limit: res.configuredCriteria || res.normativeLimit || 'D.S. 031-2010-SA',
            compliance: isCompliant,
          });
        }
      });
    });

    return list;
  }, [samples, filters]);

  // 4. FILTERED HEAVY METALS DATA
  const metalsObservations = useMemo(() => {
    const list: {
      id: string;
      date: string;
      sampleCode: string;
      system: string;
      point: string;
      metalName: string;
      resultMgL: number;
      lmpMgL: number;
      exceedsLmp: boolean;
      instrument: string;
    }[] = [];

    const lmpMap: Record<string, number> = {
      arsénico: 0.01,
      plomo: 0.01,
      cadmio: 0.003,
      mercurio: 0.001,
      cromo: 0.05,
      níquel: 0.07,
      cobre: 2.0,
      zinc: 3.0,
    };

    samples.forEach((smp) => {
      if (!isMatchSystem(smp.systemName) || !isMatchJass(smp.jassName) || !isMatchGeo(smp.origin)) {
        return;
      }
      smp.results.forEach((res) => {
        if (res.category === 'inorganico_metales') {
          if (filters.parametro === 'arsenico' && !/arsénico/i.test(res.parameter)) return;
          if (filters.parametro === 'plomo' && !/plomo/i.test(res.parameter)) return;
          if (filters.parametro === 'cadmio' && !/cadmio/i.test(res.parameter)) return;
          if (filters.parametro === 'mercurio' && !/mercurio/i.test(res.parameter)) return;

          const val = res.numericValue ?? parseFloat(res.result.replace(',', '.'));
          if (!isNaN(val)) {
            let lmp = 0.01;
            for (const key of Object.keys(lmpMap)) {
              if (res.parameter.toLowerCase().includes(key)) {
                lmp = lmpMap[key];
                break;
              }
            }
            list.push({
              id: `${smp.id}-${res.id}`,
              date: smp.date,
              sampleCode: smp.code,
              system: smp.systemName,
              point: smp.point,
              metalName: res.parameter,
              resultMgL: val,
              lmpMgL: lmp,
              exceedsLmp: val > lmp,
              instrument: res.equipment,
            });
          }
        }
      });
    });

    return list;
  }, [samples, filters]);

  // 5. FILTERED ALERTS
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (!isMatchSystem(a.system)) return false;
      return true;
    });
  }, [alerts, filters]);

  // 6. FILTERED RISKS
  const filteredRisks = useMemo(() => {
    return risks.filter((r) => {
      if (filters.sistema !== 'todos' && !r.source.toLowerCase().includes(filters.sistema.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [risks, filters]);

  // 7. FILTERED SYSTEMS
  const filteredSystems = useMemo(() => {
    return systems.filter((s) => {
      if (!isMatchSystem(s.name)) return false;
      if (!isMatchGeo(s.location)) return false;
      return true;
    });
  }, [systems, filters]);

  // 8. FILTERED JASS
  const filteredJass = useMemo(() => {
    const jassList = [
      {
        id: 'jass-01',
        name: 'JASS El Molino',
        district: 'Cascas',
        province: 'Gran Chimú',
        operator: 'Ing. Carlos Mendoza',
        systemsCount: 1,
        continuityChlorinePercent: 94,
        feeCollectionPercent: 88,
        status: 'operativo',
      },
      {
        id: 'jass-02',
        name: 'JASS Huamachuco Norte',
        district: 'Huamachuco',
        province: 'Sánchez Carrión',
        operator: 'Tec. Marina Quispe',
        systemsCount: 1,
        continuityChlorinePercent: 82,
        feeCollectionPercent: 76,
        status: 'alerta',
      },
      {
        id: 'jass-03',
        name: 'JASS San Martín',
        district: 'Otuzco',
        province: 'Otuzco',
        operator: 'Prof. Luis Alva',
        systemsCount: 1,
        continuityChlorinePercent: 65,
        feeCollectionPercent: 90,
        status: 'alerta',
      },
      {
        id: 'jass-04',
        name: 'JASS Los Laureles',
        district: 'Simbal',
        province: 'Trujillo',
        operator: 'Rosa Benites',
        systemsCount: 1,
        continuityChlorinePercent: 90,
        feeCollectionPercent: 92,
        status: 'operativo',
      },
      {
        id: 'jass-05',
        name: 'JASS Alto Moche',
        district: 'Moche',
        province: 'Trujillo',
        operator: 'Juan Pérez',
        systemsCount: 1,
        continuityChlorinePercent: 96,
        feeCollectionPercent: 95,
        status: 'operativo',
      },
    ];

    return jassList.filter((j) => {
      if (!isMatchJass(j.name)) return false;
      if (filters.distrito !== 'todos' && j.district !== filters.distrito) return false;
      if (filters.provincia !== 'todos' && j.province !== filters.provincia) return false;
      return true;
    });
  }, [filters]);

  // Sub-tabs list
  const subTabs = [
    { id: 'resumen', label: 'Resumen 360°', icon: 'dashboard' },
    { id: 'cloro', label: 'Evolución de Cloro', icon: 'water_drop', count: chlorineObservations.length },
    { id: 'microbiologia', label: 'Microbiología', icon: 'biotech', count: microObservations.length },
    { id: 'fisicoquimica', label: 'Fisicoquímica', icon: 'science', count: physicoObservations.length },
    { id: 'metales', label: 'Metales Pesados', icon: 'scatter_plot', count: metalsObservations.length },
    { id: 'alertas', label: 'Alertas', icon: 'notifications_active', count: filteredAlerts.length },
    { id: 'riesgos', label: 'Riesgos', icon: 'warning', count: filteredRisks.length },
    { id: 'sistemas', label: 'Sistemas', icon: 'water', count: filteredSystems.length },
    { id: 'jass', label: 'JASS', icon: 'groups', count: filteredJass.length },
  ];

  // CSV Exporter for active view
  const handleExportData = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeSubTab === 'cloro') {
      csvContent += 'Fecha,Sistema,Punto,Cloro_ppm,Estado,Origen\n';
      chlorineObservations.forEach((c) => {
        csvContent += `"${c.date}","${c.system}","${c.point}",${c.ppm},"${c.compliance}","${c.source}"\n`;
      });
    } else if (activeSubTab === 'microbiologia') {
      csvContent += 'Fecha,Muestra,Sistema,Punto,Parametro,Resultado,Unidad,Cumple,Metodo\n';
      microObservations.forEach((m) => {
        csvContent += `"${m.date}","${m.sampleCode}","${m.system}","${m.point}","${m.parameter}","${m.result}","${m.unit}","${m.compliance}","${m.method}"\n`;
      });
    } else if (activeSubTab === 'metales') {
      csvContent += 'Fecha,Muestra,Sistema,Punto,Metal,Resultado_mgL,LMP_mgL,SuperaLMP,Instrumento\n';
      metalsObservations.forEach((mt) => {
        csvContent += `"${mt.date}","${mt.sampleCode}","${mt.system}","${mt.point}","${mt.metalName}",${mt.resultMgL},${mt.lmpMgL},"${mt.exceedsLmp}","${mt.instrument}"\n`;
      });
    } else {
      csvContent += 'ID,Sistema,Fecha\n';
      filteredSystems.forEach((s) => {
        csvContent += `"${s.id}","${s.name}","${s.lastInspectionDate}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AQUA_DATA_${activeSubTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 8 • DASHBOARD ANALÍTICO • D.S. N.° 031-2010-SA"
        icon="analytics"
        title="AQUA-DATA • ANALÍTICA HIDROSANITARIA TERRITORIAL"
        subtitle="Consolidación analítica in situ de calidad del agua potable rural: evolución temporal de cloro residual, microbiología, fisicoquímica, metales pesados, gestión de alertas y vigilancia comunal JASS."
        stats={[
          {
            label: 'ENSAYOS TOTALES',
            value: records.length + samples.length,
            subtext: `${chlorineObservations.length} mediciones cloro`,
          },
          {
            label: 'SISTEMAS AUDITADOS',
            value: systems.length,
            subtext: 'Monitoreo territorial',
          },
          {
            label: 'ALERTAS VIGENTES',
            value: filteredAlerts.filter(a => a.status === 'PENDIENTE').length,
            subtext: 'Seguimiento de riesgo',
            highlight: filteredAlerts.filter(a => a.status === 'PENDIENTE').length > 0,
          },
          {
            label: 'PLANES DE ACCIÓN',
            value: plans.length,
            subtext: 'En ejecución técnica',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportData}
              className="glass-option-btn-primary text-xs sm:text-sm font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>EXPORTAR DATOS (CSV)</span>
            </button>

            {onNavigateToPlan && (
              <button
                type="button"
                onClick={onNavigateToPlan}
                className="glass-option-btn text-xs font-black uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                <span>PLANES DE ACCIÓN ({plans.length})</span>
              </button>
            )}
          </div>
        }
      />

      {/* FILTER BAR */}
      <AquaDataFiltersBar
        filters={filters}
        onChangeFilters={setFilters}
        availableRegions={geoMetadata.regions}
        availableProvincias={geoMetadata.provincias}
        availableDistritos={geoMetadata.distritos}
        availableJass={geoMetadata.jass}
        availableSistemas={geoMetadata.sistemas}
        activeCount={activeFiltersCount}
      />

      {/* ANALYTICAL TOPIC NAVIGATION TABS IN GLASS STYLE */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 glass-title-panel rounded-2xl scrollbar-none">
        {subTabs.map((st) => {
          const isActive = activeSubTab === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveSubTab(st.id as AquaDataSubTab)}
              className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'glass-option-btn-primary'
                  : 'glass-option-btn'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{st.icon}</span>
              <span>{st.label}</span>
              {st.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-cyan-200/40 text-cyan-900 font-bold' : 'bg-slate-200/70 text-slate-800'
                  }`}
                >
                  {st.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. RESUMEN 360° INTEGRAL */}
      {/* ========================================================= */}
      {activeSubTab === 'resumen' && (
        <div className="space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div
              onClick={() => setActiveSubTab('cloro')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                Cloro Residual Libre
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-1 flex items-baseline gap-1">
                <span>
                  {chlorineObservations.length > 0
                    ? (
                        chlorineObservations.reduce((acc, c) => acc + c.ppm, 0) /
                        chlorineObservations.length
                      ).toFixed(2)
                    : '--'}
                </span>
                <span className="text-xs text-slate-500 font-sans">ppm prom.</span>
              </div>
              <div className="text-[11px] text-teal-700 font-bold mt-1">
                {chlorineObservations.filter((c) => c.compliance === 'optimo').length} de{' '}
                {chlorineObservations.length} conformes
              </div>
            </div>

            <div
              onClick={() => setActiveSubTab('microbiologia')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                Conformidad Microbiológica
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
                {microObservations.length > 0
                  ? `${Math.round(
                      (microObservations.filter((m) => m.compliance).length /
                        microObservations.length) *
                        100
                    )}%`
                  : '100%'}
              </div>
              <div className="text-[11px] text-rose-600 font-bold mt-1">
                {microObservations.filter((m) => !m.compliance).length} positivo(s) E. coli / coliformes
              </div>
            </div>

            <div
              onClick={() => setActiveSubTab('metales')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                Metales Pesados Evaluados
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
                {metalsObservations.length}
              </div>
              <div className="text-[11px] text-amber-700 font-bold mt-1">
                {metalsObservations.filter((m) => m.exceedsLmp).length} exceso(s) sobre LMP
              </div>
            </div>

            <div
              onClick={() => setActiveSubTab('alertas')}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-cyan-400 transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-hud font-bold text-slate-400 uppercase block">
                Alertas Activas
              </span>
              <div className="text-2xl font-mono font-bold text-rose-600 mt-1">
                {filteredAlerts.filter((a) => a.status === 'PENDIENTE' || a.status === 'EN PROCESO').length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {filteredAlerts.length} total histórico
              </div>
            </div>
          </div>

          {/* TWO MAIN CHARTS PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Cloro Residual */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hud font-bold text-sm text-slate-900">
                    Evolución de Cloro Residual Libre (ppm)
                  </h3>
                  <p className="text-xs text-slate-500">Rango normativo: 0.50 – 2.00 ppm</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('cloro')}
                  className="text-xs font-hud font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  Ver Detalle →
                </button>
              </div>

              {chlorineObservations.length === 0 ? (
                <EmptyDataNotice
                  moduleName="Evolución de Cloro"
                  filterDescription={activeFilterDescription}
                />
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chlorineObservations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 2.5]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          border: 'none',
                        }}
                      />
                      <ReferenceLine y={0.5} stroke="#10b981" strokeWidth={1.5} label={{ value: 'Mín 0.5', fill: '#10b981', fontSize: 10 }} />
                      <ReferenceLine y={2.0} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Máx 2.0', fill: '#10b981', fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="ppm"
                        name="Cloro Libre (ppm)"
                        stroke="#00838f"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#00838f' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Chart 2: Distribución de Alertas y Riesgos */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hud font-bold text-sm text-slate-900">
                    Distribución de Alertas Sanitarias
                  </h3>
                  <p className="text-xs text-slate-500">Por nivel de severidad</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('alertas')}
                  className="text-xs font-hud font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  Ver Detalle →
                </button>
              </div>

              {filteredAlerts.length === 0 ? (
                <EmptyDataNotice
                  moduleName="Alertas Sanitarias"
                  filterDescription={activeFilterDescription}
                />
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { nivel: 'Crítico', total: filteredAlerts.filter((a) => a.level === 'Crítico').length, fill: '#e11d48' },
                        { nivel: 'Alto', total: filteredAlerts.filter((a) => a.level === 'Alto').length, fill: '#f59e0b' },
                        { nivel: 'Moderado', total: filteredAlerts.filter((a) => a.level === 'Moderado').length, fill: '#3b82f6' },
                        { nivel: 'Bajo', total: filteredAlerts.filter((a) => a.level === 'Bajo').length, fill: '#10b981' },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="nivel" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          border: 'none',
                        }}
                      />
                      <Bar dataKey="total" name="Número de Alertas" radius={[8, 8, 0, 0]}>
                        <Cell fill="#e11d48" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EVOLUCIÓN DE CLORO */}
      {/* ========================================================= */}
      {activeSubTab === 'cloro' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-hud font-bold text-slate-900">
                  🧪 Evolución Temporal del Cloro Residual Libre
                </h3>
                <p className="text-xs text-slate-500">
                  Cumplimiento del Artículo 66 del D.S. N.° 031-2010-SA (Rango óptimo: 0.50 – 2.00 ppm).
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-hud font-bold">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Óptimo (0.5–2.0)
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Insuficiente (&lt;0.5)
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Cloro Cero (0.0)
                </span>
              </div>
            </div>

            {chlorineObservations.length === 0 ? (
              <EmptyDataNotice
                moduleName="Evolución de Cloro"
                filterDescription={activeFilterDescription}
                onResetFilters={() =>
                  setFilters({ ...filters, region: 'todos', sistema: 'todos', parametro: 'todos' })
                }
              />
            ) : (
              <>
                {/* Time Series Chart */}
                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chlorineObservations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 2.5]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl">
                                <div className="font-bold text-cyan-300">{data.system}</div>
                                <div>Punto: {data.point}</div>
                                <div>Fecha: {data.date}</div>
                                <div className="font-mono text-emerald-400 font-bold text-sm">
                                  Cloro: {data.ppm} ppm
                                </div>
                                <div className="text-[10px] text-slate-400">Origen: {data.source}</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ReferenceLine
                        y={0.5}
                        stroke="#10b981"
                        strokeWidth={2}
                        label={{ value: 'Límite Mínimo (0.50 ppm)', fill: '#10b981', fontSize: 11 }}
                      />
                      <ReferenceLine
                        y={2.0}
                        stroke="#10b981"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{ value: 'Límite Máximo (2.00 ppm)', fill: '#10b981', fontSize: 11 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ppm"
                        stroke="#00838f"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#00838f' }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-hud font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
                    Tabla de Registros de Cloro Residual Libre ({chlorineObservations.length} observaciones)
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                        <tr>
                          <th className="py-2.5 px-3">Fecha</th>
                          <th className="py-2.5 px-3">Sistema Hídrico</th>
                          <th className="py-2.5 px-3">Punto de Muestreo</th>
                          <th className="py-2.5 px-3">Cloro (ppm)</th>
                          <th className="py-2.5 px-3">Estado Normativo</th>
                          <th className="py-2.5 px-3">Origen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {chlorineObservations.map((obs) => (
                          <tr key={obs.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono text-slate-800">{obs.date}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{obs.system}</td>
                            <td className="py-2.5 px-3 text-slate-600">{obs.point}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {obs.ppm.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                                  obs.compliance === 'optimo'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : obs.compliance === 'cero'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {obs.compliance === 'optimo'
                                  ? 'Óptimo (0.5–2.0)'
                                  : obs.compliance === 'cero'
                                  ? 'Crítico: Cloro Cero'
                                  : obs.compliance === 'alto'
                                  ? 'Sobreclorado (>2.0)'
                                  : 'Insuficiente (<0.5)'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 capitalize">{obs.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MICROBIOLOGÍA */}
      {/* ========================================================= */}
      {activeSubTab === 'microbiologia' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-hud font-bold text-slate-900">
                  🦠 Vigilancia Bacteriológica y Microbiológica
                </h3>
                <p className="text-xs text-slate-500">
                  Anexo I del D.S. N.° 031-2010-SA (Límite normativo: 0 NMP/100 mL de Escherichia coli y Coliformes Totales).
                </p>
              </div>

              {onNavigateToLab && (
                <button
                  type="button"
                  onClick={onNavigateToLab}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-hud font-bold transition-all cursor-pointer"
                >
                  Abrir Laboratorio AQUA-LAB →
                </button>
              )}
            </div>

            {microObservations.length === 0 ? (
              <EmptyDataNotice
                moduleName="Microbiología"
                filterDescription={activeFilterDescription}
                suggestion="No se encontraron ensayos microbiológicos para el filtro actual. Seleccione 'Todos los distritos' o verifique muestras procesadas."
              />
            ) : (
              <>
                {/* Microbiological compliance summary card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-hud font-bold text-emerald-800 uppercase block">
                      Ausencia Total (Conforme)
                    </span>
                    <div className="text-2xl font-mono font-bold text-emerald-950 mt-1">
                      {microObservations.filter((m) => m.compliance).length} ensayos
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      0 NMP/100 mL de E. coli / Coliformes
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <span className="text-[10px] font-hud font-bold text-rose-800 uppercase block">
                      Presencia Detectada (Alerta)
                    </span>
                    <div className="text-2xl font-mono font-bold text-rose-950 mt-1">
                      {microObservations.filter((m) => !m.compliance).length} ensayos
                    </div>
                    <div className="text-[11px] text-rose-700 mt-0.5">
                      Riesgo de contaminación fecal in situ
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-hud font-bold text-slate-600 uppercase block">
                      Tasa de Conformidad Sanitaria
                    </span>
                    <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
                      {Math.round(
                        (microObservations.filter((m) => m.compliance).length /
                          microObservations.length) *
                          100
                      )}%
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Bacteriológicamente inocua
                    </div>
                  </div>
                </div>

                {/* Table of microbiological assays */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Muestra</th>
                        <th className="py-2.5 px-3">Sistema / Punto</th>
                        <th className="py-2.5 px-3">Parámetro</th>
                        <th className="py-2.5 px-3">Resultado Obtenido</th>
                        <th className="py-2.5 px-3">Dictamen Normativo</th>
                        <th className="py-2.5 px-3">Método Analítico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {microObservations.map((obs) => (
                        <tr key={obs.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-700">{obs.date}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{obs.sampleCode}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-900">{obs.system}</div>
                            <div className="text-[11px] text-slate-500">{obs.point}</div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{obs.parameter}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {obs.result} {obs.unit}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                                obs.compliance
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {obs.compliance ? 'CUMPLE (Ausencia)' : 'NO CUMPLE (Presencia)'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={obs.method}>
                            {obs.method}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FISICOQUÍMICA */}
      {/* ========================================================= */}
      {activeSubTab === 'fisicoquimica' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-hud font-bold text-slate-900">
                ⚗️ Parámetros Fisicoquímicos y Organolépticos
              </h3>
              <p className="text-xs text-slate-500">
                Turbidez (máx 5 NTU), pH (6.5 – 8.5), Conductividad Eléctrica, Dureza Total (máx 500 mg/L) y Alcalinidad.
              </p>
            </div>

            {physicoObservations.length === 0 ? (
              <EmptyDataNotice
                moduleName="Fisicoquímica"
                filterDescription={activeFilterDescription}
              />
            ) : (
              <div className="space-y-4">
                {/* Summary Table */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Sistema</th>
                        <th className="py-2.5 px-3">Parámetro</th>
                        <th className="py-2.5 px-3">Valor Analítico</th>
                        <th className="py-2.5 px-3">Límite Normativo</th>
                        <th className="py-2.5 px-3">Conformidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {physicoObservations.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-700">{p.date}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{p.system}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{p.parameter}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {p.result} {p.unit}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">{p.limit}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                                p.compliance
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.compliance ? 'Conforme' : 'Excede Norma'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. METALES PESADOS */}
      {/* ========================================================= */}
      {activeSubTab === 'metales' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-hud font-bold text-slate-900">
                🔬 Monitoreo de Metales Pesados e Inorgánicos
              </h3>
              <p className="text-xs text-slate-500">
                Límites Máximos Permisibles del D.S. N.° 031-2010-SA: Arsénico (0.010 mg/L), Plomo (0.010 mg/L), Cadmio (0.003 mg/L), Mercurio (0.001 mg/L).
              </p>
            </div>

            {metalsObservations.length === 0 ? (
              <EmptyDataNotice
                moduleName="Metales Pesados"
                filterDescription={activeFilterDescription}
                suggestion="No se registran determinaciones de metales pesados para este filtro. Seleccione 'Todos los parámetros' o 'Todos los distritos'."
              />
            ) : (
              <div className="space-y-4">
                {/* Bar chart comparison */}
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metalsObservations.slice(0, 8).map((m) => ({
                        nombre: `${m.metalName.split(' ')[0]} (${m.sampleCode})`,
                        resultado: m.resultMgL,
                        lmp: m.lmpMgL,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          border: 'none',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="resultado" name="Concentración Medida (mg/L)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="lmp" name="LMP Normativo (mg/L)" fill="#e11d48" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Metals Table */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Muestra</th>
                        <th className="py-2.5 px-3">Sistema / Punto</th>
                        <th className="py-2.5 px-3">Elemento Metálico</th>
                        <th className="py-2.5 px-3">Concentración (mg/L)</th>
                        <th className="py-2.5 px-3">LMP Normativo</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3">Equipo Instrumental</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metalsObservations.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-700">{m.date}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.sampleCode}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-900">{m.system}</div>
                            <div className="text-[11px] text-slate-500">{m.point}</div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{m.metalName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {m.resultMgL} mg/L
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            ≤ {m.lmpMgL} mg/L
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                                m.exceedsLmp
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {m.exceedsLmp ? 'EXCEDE LMP' : 'CUMPLE'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={m.instrument}>
                            {m.instrument}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ALERTAS */}
      {/* ========================================================= */}
      {activeSubTab === 'alertas' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-hud font-bold text-slate-900">
                  🚨 Análisis de Alertas Sanitarias Registradas
                </h3>
                <p className="text-xs text-slate-500">
                  Total de no conformidades derivadas de resultados reales de laboratorio y monitoreo in situ.
                </p>
              </div>

              {onNavigateToAlerts && (
                <button
                  type="button"
                  onClick={onNavigateToAlerts}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-hud font-bold transition-all cursor-pointer"
                >
                  Ir a AQUA-ALERT →
                </button>
              )}
            </div>

            {filteredAlerts.length === 0 ? (
              <EmptyDataNotice
                moduleName="Alertas Sanitarias"
                filterDescription={activeFilterDescription}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                    <tr>
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3">Sistema</th>
                      <th className="py-2.5 px-3">Parámetro Observado</th>
                      <th className="py-2.5 px-3">Nivel</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3">Responsable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAlerts.map((al) => (
                      <tr key={al.code} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{al.code}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{al.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{al.system}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900">{al.parameter}</span>
                          <span className="text-slate-500 text-[11px] block">{al.result} ({al.criterion})</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                              al.level === 'Crítico'
                                ? 'bg-rose-100 text-rose-800'
                                : al.level === 'Alto'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {al.level}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-hud text-[10px] font-bold">
                            {al.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{al.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. RIESGOS */}
      {/* ========================================================= */}
      {activeSubTab === 'riesgos' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-hud font-bold text-slate-900">
                  ⚠️ Matriz de Riesgos Sanitaria (Planes de Seguridad del Agua - PSA/OMS)
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluación matricial de peligros, probabilidad de falla y severidad de consecuencias.
                </p>
              </div>

              {onNavigateToRisk && (
                <button
                  type="button"
                  onClick={onNavigateToRisk}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-hud font-bold transition-all cursor-pointer"
                >
                  Abrir AQUA-RISK →
                </button>
              )}
            </div>

            {filteredRisks.length === 0 ? (
              <EmptyDataNotice
                moduleName="Matriz de Riesgos"
                filterDescription={activeFilterDescription}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                    <tr>
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Peligro Identificado</th>
                      <th className="py-2.5 px-3">Fuente / Componente</th>
                      <th className="py-2.5 px-3">Probabilidad</th>
                      <th className="py-2.5 px-3">Consecuencia</th>
                      <th className="py-2.5 px-3">Nivel de Riesgo</th>
                      <th className="py-2.5 px-3">Medida de Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRisks.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">{r.danger}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.source}</td>
                        <td className="py-2.5 px-3 font-hud">{r.probability}</td>
                        <td className="py-2.5 px-3 font-hud">{r.consequence}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                              r.riskLevel === 'Crítico'
                                ? 'bg-rose-100 text-rose-800'
                                : r.riskLevel === 'Alto'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {r.riskLevel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs truncate" title={r.controlMeasure}>
                          {r.controlMeasure}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. SISTEMAS DE AGUA */}
      {/* ========================================================= */}
      {activeSubTab === 'sistemas' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-hud font-bold text-slate-900">
                💧 Red de Sistemas Hídricos y Componentes
              </h3>
              <p className="text-xs text-slate-500">
                Capacidad volumétrica, estado de reserva, cloro actual y fecha de última inspección técnica.
              </p>
            </div>

            {filteredSystems.length === 0 ? (
              <EmptyDataNotice
                moduleName="Sistemas de Agua"
                filterDescription={activeFilterDescription}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSystems.map((sys) => (
                  <div
                    key={sys.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-800">{sys.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[10px] font-hud font-bold capitalize">
                        {sys.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-hud font-bold text-sm text-slate-900">{sys.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{sys.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-hud uppercase">Capacidad</span>
                        <span className="font-mono font-bold text-slate-800">
                          {sys.capacityLiters.toLocaleString()} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-hud uppercase">Último Cloro</span>
                        <span className="font-mono font-bold text-teal-700">
                          {sys.lastChlorinePpm !== undefined ? `${sys.lastChlorinePpm} ppm` : 'Pendiente'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1">
                      Operador: <strong className="text-slate-700">{sys.operator}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. JASS (ORGANIZACIONES COMUNALES) */}
      {/* ========================================================= */}
      {activeSubTab === 'jass' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-hud font-bold text-slate-900">
                👥 Organizaciones Comunales (JASS)
              </h3>
              <p className="text-xs text-slate-500">
                Indicadores de gestión comunal, continuidad de cloración, recaudación de cuota familiar y operadores designados.
              </p>
            </div>

            {filteredJass.length === 0 ? (
              <EmptyDataNotice
                moduleName="Organizaciones JASS"
                filterDescription={activeFilterDescription}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-hud">
                    <tr>
                      <th className="py-2.5 px-3">Organización Comunal</th>
                      <th className="py-2.5 px-3">Distrito / Provincia</th>
                      <th className="py-2.5 px-3">Operador Responsable</th>
                      <th className="py-2.5 px-3">Continuidad Cloración</th>
                      <th className="py-2.5 px-3">Recaudación Cuota</th>
                      <th className="py-2.5 px-3">Estado Operativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJass.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-hud font-bold text-slate-900">{j.name}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {j.district}, {j.province}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{j.operator}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800">
                              {j.continuityChlorinePercent}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full ${
                                  j.continuityChlorinePercent >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${j.continuityChlorinePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {j.feeCollectionPercent}%
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-hud font-bold ${
                              j.status === 'operativo'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {j.status === 'operativo' ? 'Operativo Conforme' : 'En Vigilancia'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

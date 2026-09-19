import React, { useState } from 'react';
import { 
  Eye, 
  Sparkles, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  RefreshCw,
  Droplet,
  FileCheck
} from 'lucide-react';
import { SamplingRecord, WaterSystem } from '../types';
import { 
  getDpdColorHex, 
  DPD_SCALE_STEPS, 
  evaluateChlorineNormative 
} from '../utils/waterMath';

interface PhotometerHUDViewProps {
  systems: WaterSystem[];
  onSaveToLogbook: (record: Omit<SamplingRecord, 'id' | 'timestamp'>) => void;
}

export const PhotometerHUDView: React.FC<PhotometerHUDViewProps> = ({
  systems,
  onSaveToLogbook,
}) => {
  const [readingPpm, setReadingPpm] = useState<number>(1.2);
  const [selectedSystemId, setSelectedSystemId] = useState<string>(systems[0]?.id || '');
  const [isSimulatingTest, setIsSimulatingTest] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const evaluation = evaluateChlorineNormative(readingPpm);
  const liquidHex = getDpdColorHex(readingPpm);

  // Trigger test simulation animation
  const handleSimulateReaction = () => {
    setIsSimulatingTest(true);
    setTimeout(() => {
      setIsSimulatingTest(false);
    }, 1200);
  };

  const handleSaveToLog = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

    const currentSystem = systems.find((s) => s.id === selectedSystemId);

    onSaveToLogbook({
      dateStr,
      timeStr,
      systemId: selectedSystemId || 'sys-dpd',
      systemName: currentSystem ? currentSystem.name : 'Punto de Muestreo DPD',
      measurementPoint: 'Lectura Fotométrica DPD N° 1 de Campo',
      freeChlorinePpm: readingPpm,
      ph: 7.3,
      turbidityNtu: 0.6,
      temperatureC: 19.5,
      status: evaluation.status,
      operator: currentSystem?.operator || 'Inspector de Calidad',
      observations: `Verificación colorimétrica DPD: ${readingPpm} mg/L. ${evaluation.verdictText}.`,
      correctiveAction: evaluation.status !== 'compliant' ? evaluation.recommendation : undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-pink-100 text-pink-800 border border-pink-200">
            Método Estándar 4500-Cl G
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Reactivo DPD #1 (N,N-dietil-p-fenilendiamina)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Fotómetro y Comparador Digital DPD en Vivo
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evalúa el color del reactivo de campo o calibra tu fotómetro digital para verificar si el agua cumple estrictamente con el rango de <strong>0.50 a 2.00 mg/L</strong> exigido por el D.S. N.° 031-2010-SA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visual Colorimeter & Cuvette Interactive Stage (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-teal-600" />
              Celda Espectrofotométrica Virtual (10 mL)
            </span>
            <button
              id="btn-simulate-dpd"
              onClick={handleSimulateReaction}
              disabled={isSimulatingTest}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTest ? 'animate-spin' : ''}`} />
              <span>Simular Reacción DPD</span>
            </button>
          </div>

          {/* Realistic Cuvette Graphic with animated colored liquid */}
          <div className="relative my-4 flex flex-col items-center justify-center p-8 bg-slate-900/5 rounded-2xl border border-slate-200/60 w-full max-w-sm">
            {/* Cuvette Cap */}
            <div className="w-20 h-5 bg-slate-700 rounded-t-md shadow-inner border-b-2 border-slate-800" />

            {/* Glass Tube Container */}
            <div className="relative w-28 h-64 border-x-4 border-b-4 border-slate-300/80 rounded-b-3xl bg-white/70 backdrop-blur-xs shadow-lg overflow-hidden flex flex-col justify-end p-1">
              
              {/* Meniscus / Volume Markers */}
              <div className="absolute top-10 right-1 border-b border-slate-400/60 w-3" />
              <div className="absolute top-20 right-1 border-b border-slate-400/60 w-5">
                <span className="text-[9px] font-mono text-slate-500 absolute -left-8 -top-2">10 mL</span>
              </div>
              <div className="absolute top-32 right-1 border-b border-slate-400/60 w-3" />
              <div className="absolute top-44 right-1 border-b border-slate-400/60 w-4">
                <span className="text-[9px] font-mono text-slate-500 absolute -left-7 -top-2">5 mL</span>
              </div>

              {/* Liquid Level with reactive background */}
              <div
                className="w-full h-52 rounded-b-2xl transition-all duration-700 relative overflow-hidden flex items-center justify-center shadow-inner"
                style={{
                  backgroundColor: isSimulatingTest ? '#f1f5f9' : liquidHex,
                  boxShadow: `inset 0 4px 12px rgba(0,0,0,0.1), 0 0 20px ${liquidHex}40`,
                }}
              >
                {/* Surface Meniscus Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-3 bg-white/40 rounded-full blur-[1px]"
                />

                {/* Glass reflections */}
                <div className="absolute top-2 left-2 bottom-2 w-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                <div className="absolute top-2 right-2 bottom-2 w-0.5 bg-white/30 rounded-full" />

                {/* Bubbles / simulation effect */}
                {isSimulatingTest && (
                  <div className="text-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-pink-500 mx-auto animate-spin" />
                    <span className="text-[10px] font-bold text-pink-700 bg-white/80 px-2 py-0.5 rounded-full mt-1 block">
                      Disolviendo reactivo...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reading Display Box */}
            <div className="mt-5 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Concentración Detectada
              </span>
              <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                <span className="text-4xl font-extrabold font-mono text-slate-900">
                  {readingPpm.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-slate-600 uppercase">
                  ppm (mg/L)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="w-full max-w-md mt-2 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
              <span>0.0 ppm</span>
              <span className="text-teal-700 font-bold">Ajuste de Lectura DPD</span>
              <span>4.0+ ppm</span>
            </div>
            <input
              id="slider-dpd-reading"
              type="range"
              min="0.0"
              max="4.0"
              step="0.05"
              value={readingPpm}
              onChange={(e) => setReadingPpm(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
          </div>

          {/* Official DPD Color Palette Scale Chips */}
          <div className="w-full max-w-md mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Escala Graduada Oficial DPD #1:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {DPD_SCALE_STEPS.map((step) => (
                <button
                  key={step.ppm}
                  id={`btn-dpd-step-${step.ppm}`}
                  type="button"
                  onClick={() => setReadingPpm(step.ppm)}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    Math.abs(readingPpm - step.ppm) < 0.1
                      ? 'ring-2 ring-slate-900 border-transparent shadow-xs scale-105'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: step.hex }}
                >
                  <span className={`block text-[11px] font-extrabold ${step.textColor}`}>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic, Sanitary Evaluation & Action Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Normative Status Card */}
          <div className={`p-6 rounded-2xl border ${
            evaluation.status === 'compliant'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : evaluation.status === 'low'
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-rose-50/70 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {evaluation.status === 'compliant' && (
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                {evaluation.status === 'low' && (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                )}
                {evaluation.status === 'excess' && (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
                    {evaluation.badgeLabel}
                  </span>
                  <h3 className="text-xl font-extrabold mt-1">
                    {evaluation.verdictText}
                  </h3>
                </div>
              </div>
            </div>

            {/* Impact Details */}
            <div className="mt-4 space-y-3 text-xs leading-relaxed">
              <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">
                  Evaluación de Riesgo Sanitario:
                </span>
                <p className="text-slate-700">
                  {evaluation.healthImpact}
                </p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">
                  Acción Operacional Inmediata Requerida:
                </span>
                <p className="text-slate-700">
                  {evaluation.recommendation}
                </p>
              </div>
            </div>

            {/* Regulatory Reference Notice */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
              <span>Marco Legal: <strong>D.S. N.° 031-2010-SA Art. 62</strong></span>
              <span>LMP: <strong>0.5 – 2.0 mg/L</strong></span>
            </div>
          </div>

          {/* Quick Save to Official Logbook */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>Registrar Muestreo Oficial en Bitácora</span>
            </div>

            <div>
              <label htmlFor="select-system-photometer" className="block text-xs font-semibold text-slate-600 mb-1">
                Punto / Sistema de Muestreo:
              </label>
              <select
                id="select-system-photometer"
                value={selectedSystemId}
                onChange={(e) => setSelectedSystemId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-save-photometer-log"
              type="button"
              onClick={handleSaveToLog}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>¡Medición Guardada en la Bitácora!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Certificar y Guardar Lectura ({readingPpm} ppm)</span>
                </>
              )}
            </button>
          </div>

          {/* Sampling Best Practice Tips */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 block">
              Instrucciones de Toma de Muestra DPD:
            </span>
            <p>1. Dejar correr el agua del grifo durante 2 a 3 minutos para purgar agua estancada.</p>
            <p>2. Enjuagar la celda 3 veces con el agua a analizar antes del llenado definitivo.</p>
            <p>3. Agregar 1 pastilla DPD #1 o sachet y mezclar sin agitar vigorosamente.</p>
            <p>4. Realizar la lectura colorimétrica antes de 1 minuto para evitar interferencia de cloraminas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

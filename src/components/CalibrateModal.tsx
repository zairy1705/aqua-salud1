import React, { useState } from 'react';

interface CalibrateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalibrateModal: React.FC<CalibrateModalProps> = ({ isOpen, onClose }) => {
  const [testTimeSeconds, setTestTimeSeconds] = useState<number>(60);
  const [collectedMl, setCollectedMl] = useState<number>(45);
  const [tankCapacityLiters, setTankCapacityLiters] = useState<number>(200);

  if (!isOpen) return null;

  const flowMlPerMin = testTimeSeconds > 0 ? (collectedMl / testTimeSeconds) * 60 : 0;
  const flowLitersPerHour = (flowMlPerMin * 60) / 1000;
  const flowLitersPerDay = flowLitersPerHour * 24;
  const autonomyDays = flowLitersPerDay > 0 ? tankCapacityLiters / flowLitersPerDay : 0;
  const dropsPerMinute = Math.round(flowMlPerMin * 20); // standard 20 drops = 1 mL

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#10e7b2]">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[15px] text-white">
                Calibración de Dosificador por Goteo
              </h3>
              <p className="text-[11px] text-cyan-300/80">Prueba de aforo y gasto volumétrico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-[13px]">
          <div className="bg-[#002833] p-3.5 rounded-2xl border border-cyan-500/30">
            <h4 className="font-hud font-bold text-white text-[13px] mb-2 flex items-center gap-1.5 text-cyan-300">
              <span className="material-symbols-outlined text-[17px]">science</span>
              Datos de Prueba de Aforo (Probeta Graduada)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                  Tiempo de Aforo (segundos):
                </label>
                <input
                  type="number"
                  value={testTimeSeconds}
                  onChange={(e) => setTestTimeSeconds(Number(e.target.value) || 1)}
                  className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                />
              </div>
              <div>
                <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                  Volumen Recolectado (mL):
                </label>
                <input
                  type="number"
                  value={collectedMl}
                  onChange={(e) => setCollectedMl(Number(e.target.value) || 0)}
                  className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                Capacidad del Tanque de Solución Madre (Litros):
              </label>
              <input
                type="number"
                value={tankCapacityLiters}
                onChange={(e) => setTankCapacityLiters(Number(e.target.value) || 1)}
                className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#00212b] p-3 rounded-2xl border border-cyan-500/30">
              <span className="text-[10px] uppercase font-hud text-cyan-300 font-bold block">
                Caudal de Goteo
              </span>
              <span className="text-[20px] font-hud font-extrabold text-[#10e7b2]">
                {flowMlPerMin.toFixed(1)} <span className="text-[12px]">mL/min</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ≈ {dropsPerMinute} gotas/min
              </span>
            </div>

            <div className="bg-[#00212b] p-3 rounded-2xl border border-cyan-500/30">
              <span className="text-[10px] uppercase font-hud text-cyan-300 font-bold block">
                Consumo Diario
              </span>
              <span className="text-[20px] font-hud font-extrabold text-cyan-200">
                {flowLitersPerDay.toFixed(1)} <span className="text-[12px]">L/día</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Gasto en 24 horas continuas
              </span>
            </div>

            <div className="col-span-2 bg-[#00212b] p-3 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-hud text-cyan-300 font-bold block">
                  Autonomía del Tanque Solución
                </span>
                <span className="text-[22px] font-hud font-extrabold text-white">
                  {autonomyDays.toFixed(1)} días
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-900/60 text-[#10e7b2] border border-[#10e7b2]/40 font-hud text-[11px] font-bold">
                {autonomyDays >= 7 ? 'Autonomía Óptima (≥ 7 días)' : 'Requiere recarga frecuente'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#00212b] border-t border-cyan-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#10e7b2] hover:bg-gradient-to-r hover:from-[#10e7b2] hover:to-[#caf300] text-[#002116] font-hud text-[12px] font-extrabold uppercase transition-all duration-300 shadow-sm hover:shadow-[0_0_18px_rgba(16,231,178,0.5)] active:scale-95 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

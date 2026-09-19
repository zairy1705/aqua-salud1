import React, { useState } from 'react';

interface SolutionPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolutionPrepModal: React.FC<SolutionPrepModalProps> = ({ isOpen, onClose }) => {
  const [tankVolumeLiters, setTankVolumeLiters] = useState<number>(250);
  const [desiredConcentrationPpm, setDesiredConcentrationPpm] = useState<number>(5000); // 5000 ppm = 0.5%
  const [productConcentration, setProductConcentration] = useState<number>(70); // 70% calcium hypochlorite

  if (!isOpen) return null;

  // Formula: Grams of product = (Volume in liters * Target ppm) / (Concentration% * 10)
  const productGrams = (tankVolumeLiters * desiredConcentrationPpm) / (productConcentration * 10);
  const productKilos = productGrams / 1000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#10e7b2]">
              <span className="material-symbols-outlined text-[22px]">science</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[15px] text-white">
                Preparación de Solución Madre
              </h3>
              <p className="text-[11px] text-cyan-300/80">
                Dilución C₁·V₁ = C₂·V₂ para tanque dosificador
              </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                  Volumen del Tanque de Solución (L):
                </label>
                <input
                  type="number"
                  value={tankVolumeLiters}
                  onChange={(e) => setTankVolumeLiters(Number(e.target.value) || 1)}
                  className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                />
              </div>

              <div>
                <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                  Pureza del Hipoclorito (%):
                </label>
                <select
                  value={productConcentration}
                  onChange={(e) => setProductConcentration(Number(e.target.value))}
                  className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                >
                  <option value={70}>70% (Hipoclorito de Calcio granular)</option>
                  <option value={65}>65% (Hipoclorito de Calcio estándar)</option>
                  <option value={8}>8% (Lejía comercial concentrada)</option>
                  <option value={5}>5% (Lejía comercial común)</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                  Concentración Deseada de Solución Madre (mg/L o ppm):
                </label>
                <input
                  type="number"
                  value={desiredConcentrationPpm}
                  onChange={(e) => setDesiredConcentrationPpm(Number(e.target.value) || 100)}
                  className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                />
                <span className="text-[10px] text-cyan-300/70 block mt-1">
                  Recomendado para sistemas de goteo constante: 2,500 a 5,000 ppm
                </span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-[#00212b] p-4 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center text-center gap-1">
            <span className="text-[11px] uppercase font-hud text-cyan-300 font-bold">
              Cantidad Requerida de Hipoclorito
            </span>
            <span className="text-[32px] font-hud font-black text-[#10e7b2] leading-tight">
              {productKilos >= 1 ? `${productKilos.toFixed(2)} kg` : `${Math.round(productGrams)} g`}
            </span>
            <p className="text-[11.5px] text-cyan-100/80 max-w-sm mt-1">
              Disolver esta cantidad en {tankVolumeLiters} L de agua limpia en el tanque dosificador, mezclar y dejar sedimentar los sólidos inertes por 4 horas antes de abrir la llave de paso.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#00212b] border-t border-cyan-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#10e7b2] hover:bg-gradient-to-r hover:from-[#10e7b2] hover:to-[#caf300] text-[#002116] font-hud text-[12px] font-extrabold uppercase transition-all duration-300 shadow-sm hover:shadow-[0_0_18px_rgba(16,231,178,0.5)] active:scale-95 cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

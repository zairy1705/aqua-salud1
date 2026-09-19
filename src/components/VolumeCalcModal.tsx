import React, { useState } from 'react';

interface VolumeCalcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVolume?: (liters: number) => void;
}

export const VolumeCalcModal: React.FC<VolumeCalcModalProps> = ({
  isOpen,
  onClose,
  onApplyVolume,
}) => {
  const [tankShape, setTankShape] = useState<'cylinder' | 'box'>('cylinder');
  const [diameter, setDiameter] = useState<number>(6);
  const [height, setHeight] = useState<number>(4);
  const [length, setLength] = useState<number>(8);
  const [width, setWidth] = useState<number>(6);

  if (!isOpen) return null;

  let calculatedVolumeLiters = 0;
  if (tankShape === 'cylinder') {
    const radius = diameter / 2;
    calculatedVolumeLiters = Math.PI * Math.pow(radius, 2) * height * 1000;
  } else {
    calculatedVolumeLiters = length * width * height * 1000;
  }

  const roundedLiters = Math.round(calculatedVolumeLiters);
  const cubicMeters = (roundedLiters / 1000).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#00b4d8]">
              <span className="material-symbols-outlined text-[22px]">view_in_ar</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[15px] text-white">
                Cálculo de Volumen de Tanque
              </h3>
              <p className="text-[11px] text-cyan-300/80">
                Geometría en metros a Litros y Metros Cúbicos
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
          <div className="flex gap-2 p-1 bg-[#00171d] rounded-2xl border border-cyan-500/30">
            <button
              onClick={() => setTankShape('cylinder')}
              className={`flex-1 py-2 rounded-xl font-hud text-[12px] font-bold transition-all cursor-pointer ${
                tankShape === 'cylinder'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-cyan-300 hover:text-white'
              }`}
            >
              Cilíndrico (Vertical/Elevado)
            </button>
            <button
              onClick={() => setTankShape('box')}
              className={`flex-1 py-2 rounded-xl font-hud text-[12px] font-bold transition-all cursor-pointer ${
                tankShape === 'box'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-cyan-300 hover:text-white'
              }`}
            >
              Rectangular (Cisterna/Cubo)
            </button>
          </div>

          <div className="bg-[#002833] p-4 rounded-2xl border border-cyan-500/30">
            {tankShape === 'cylinder' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                    Diámetro (metros):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={diameter}
                    onChange={(e) => setDiameter(Number(e.target.value) || 0)}
                    className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                    Altura / Tirante de Agua (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value) || 0)}
                    className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                    Largo (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value) || 0)}
                    className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                    Ancho (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value) || 0)}
                    className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-hud text-cyan-200 block mb-1">
                    Altura Agua (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value) || 0)}
                    className="w-full bg-[#00171d] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#00212b] p-4 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] uppercase font-hud text-cyan-300 font-bold">
              Volumen Calculado
            </span>
            <span className="text-[34px] font-hud font-black text-[#10e7b2] leading-tight">
              {roundedLiters.toLocaleString()} <span className="text-[18px]">Litros</span>
            </span>
            <span className="text-[13px] font-hud text-cyan-200 font-bold mt-1">
              ≈ {cubicMeters} m³ de agua
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#00212b] border-t border-cyan-500/20 flex justify-end gap-2">
          {onApplyVolume && (
            <button
              onClick={() => {
                onApplyVolume(roundedLiters);
                onClose();
              }}
              className="px-5 py-2 rounded-full bg-[#10e7b2] hover:bg-[#00d4a0] text-[#002116] font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
            >
              Usar {roundedLiters.toLocaleString()} L
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { OfficialNormativaModal } from './public/OfficialNormativaModal';

interface NormativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NormativeModal: React.FC<NormativeModalProps> = ({ isOpen, onClose }) => {
  const [isFullViewerOpen, setIsFullViewerOpen] = useState(false);
  const [viewerAction, setViewerAction] = useState<'view' | 'download' | 'print'>('view');

  if (!isOpen && !isFullViewerOpen) return null;

  if (isFullViewerOpen) {
    return (
      <OfficialNormativaModal
        isOpen={true}
        onClose={() => {
          setIsFullViewerOpen(false);
          onClose();
        }}
        documentId="ds-031-2010-sa"
        initialAction={viewerAction}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#caf300]">
              <span className="material-symbols-outlined text-[22px]">gavel</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[15px] text-white">
                Normativa D.S. N.° 031-2010-SA
              </h3>
              <p className="text-[11px] text-cyan-300/80">
                Reglamento de la Calidad del Agua para Consumo Humano (DIGESA / MINSA)
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

        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-[13px] leading-relaxed">
          <div className="bg-[#002833] p-4 rounded-2xl border border-cyan-500/30">
            <h4 className="font-hud font-bold text-[#10e7b2] text-[14px] mb-1">
              Artículo 66.° — Parámetro de Cloro Residual Libre
            </h4>
            <p className="text-cyan-100/90 text-[12.5px]">
              Toda agua destinada al consumo humano suministrada por red pública o sistema comunal debe contener en el 100% de muestras tomadas en la red de distribución una concentración de <strong>Cloro Libre Residual de al menos 0.5 mg/L (ppm)</strong> y no mayor a <strong>2.0 mg/L (ppm)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#00212b] p-3.5 rounded-2xl border border-cyan-500/30">
              <span className="text-[11px] font-hud font-bold text-[#10e7b2] uppercase block mb-1">
                Límites Físico-Químicos
              </span>
              <ul className="space-y-1.5 text-[12px] text-cyan-100/80">
                <li>• Cloro Libre: 0.5 a 2.0 mg/L (ppm)</li>
                <li>• pH reglamentario: 6.5 a 8.5</li>
                <li>• Turbiedad máxima: ≤ 5.0 NTU (óptimo &lt; 1 NTU)</li>
                <li>• Conductividad: 1500 µS/cm máx.</li>
              </ul>
            </div>

            <div className="bg-[#00212b] p-3.5 rounded-2xl border border-cyan-500/30">
              <span className="text-[11px] font-hud font-bold text-[#caf300] uppercase block mb-1">
                Puntos de Monitoreo Obligatorio
              </span>
              <ul className="space-y-1.5 text-[12px] text-cyan-100/80">
                <li>• Punto 1: Salida del Reservorio / Desinfección</li>
                <li>• Punto 2: Primer predio o vivienda conectada</li>
                <li>• Punto 3: Punto intermedio de mayor consumo</li>
                <li>• Punto 4: Extremo más alejado o cota crítica de la red</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#00212b] border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewerAction('download');
                setIsFullViewerOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-hud font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={() => {
                setViewerAction('print');
                setIsFullViewerOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-hud font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewerAction('view');
                setIsFullViewerOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#00b4d8] hover:bg-[#0096b4] text-[#001f28] font-hud text-[11.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">menu_book</span>
              <span>Ver Documento Completo</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-hud text-[11.5px] font-bold uppercase transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';

interface AuxiliaryToolsSectionProps {
  onOpenSolutionPrep: () => void;
  onOpenCalibrate: () => void;
  onOpenNormative: () => void;
  onOpenUserManual?: () => void;
}

export const AuxiliaryToolsSection: React.FC<AuxiliaryToolsSectionProps> = ({
  onOpenSolutionPrep,
  onOpenCalibrate,
  onOpenNormative,
  onOpenUserManual,
}) => {
  return (
    <section className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,103,125,0.06)] border border-[#bcc9ce]/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0f7fa] flex items-center justify-center text-[#00677d] shrink-0">
            <span className="material-symbols-outlined text-[22px]">build</span>
          </div>
          <div>
            <h2 className="font-hud font-extrabold text-[16px] sm:text-[18px] text-[#151d22] tracking-tight">
              Herramientas Técnicas y Manual Didáctico
            </h2>
            <p className="text-[12px] sm:text-[12.5px] text-[#5f747e] mt-0.5">
              Módulos de apoyo para preparación de reactivos, aforo y guía oficial en PDF
            </p>
          </div>
        </div>

        {onOpenUserManual && (
          <button
            type="button"
            onClick={onOpenUserManual}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#10e7b2]/20 to-[#00b4d8]/20 hover:from-[#10e7b2] hover:to-[#00b4d8] text-[#00677d] hover:text-[#002116] border border-[#10e7b2]/60 hover:border-transparent font-hud text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow-2xs hover:shadow-[0_4px_16px_rgba(0,180,216,0.35)] transition-all duration-300 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[17px] group-hover:scale-110 transition-transform">
              menu_book
            </span>
            <span>Ver Instructivo Completo</span>
          </button>
        )}
      </div>

      {/* 4 Interactive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Card 1: Preparación Solución Madre */}
        <button
          type="button"
          onClick={onOpenSolutionPrep}
          className="bg-[#f4fbfc] hover:bg-gradient-to-br hover:from-cyan-50 hover:to-teal-50 border border-[#d2ebf0] hover:border-[#00b4d8] rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group shadow-2xs hover:shadow-[0_8px_25px_rgba(0,180,216,0.22)] active:scale-98 cursor-pointer"
          title="Abrir módulo de Preparación de Solución Madre"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[24px] text-[#00677d] group-hover:text-[#00b4d8] group-hover:scale-115 transition-all duration-300">
                science
              </span>
              <span className="font-hud font-bold text-[11px] text-[#00677d] group-hover:text-[#00b4d8] tracking-wide font-mono transition-colors">
                C₁·V₁ = C₂·V₂
              </span>
            </div>
            <h3 className="font-hud font-extrabold text-[14px] text-[#151d22] group-hover:text-[#00677d] transition-colors mt-3">
              Preparación Solución Madre
            </h3>
            <p className="text-[11.5px] text-[#5f747e] group-hover:text-[#3d494d] mt-1 leading-relaxed transition-colors">
              Tanques de 100L a 1000L con tiempo de sedimentación para hipoclorito de calcio.
            </p>
          </div>
        </button>

        {/* Card 2: Calibración de Dosificador */}
        <button
          type="button"
          onClick={onOpenCalibrate}
          className="bg-[#f4fbfc] hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 border border-[#d2ebf0] hover:border-[#10e7b2] rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group shadow-2xs hover:shadow-[0_8px_25px_rgba(16,231,178,0.22)] active:scale-98 cursor-pointer"
          title="Abrir módulo de Calibración de Dosificador"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[24px] text-[#00677d] group-hover:text-[#006c51] group-hover:scale-115 transition-all duration-300">
                tune
              </span>
              <span className="font-hud font-bold text-[11px] text-[#00677d] group-hover:text-[#006c51] tracking-wide uppercase transition-colors">
                AFORO 60S
              </span>
            </div>
            <h3 className="font-hud font-extrabold text-[14px] text-[#151d22] group-hover:text-[#006c51] transition-colors mt-3">
              Calibración de Dosificador
            </h3>
            <p className="text-[11.5px] text-[#5f747e] group-hover:text-[#3d494d] mt-1 leading-relaxed transition-colors">
              Prueba con probeta graduada, cronómetro integrado y recomendación de ajuste.
            </p>
          </div>
        </button>

        {/* Card 3: Guía D.S. N.° 031-2010-SA */}
        <button
          type="button"
          onClick={onOpenNormative}
          className="bg-[#f4fbfc] hover:bg-gradient-to-br hover:from-amber-50 hover:to-lime-50 border border-[#d2ebf0] hover:border-[#93b100] rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group shadow-2xs hover:shadow-[0_8px_25px_rgba(147,177,0,0.22)] active:scale-98 cursor-pointer"
          title="Abrir Guía Normativa D.S. N.° 031-2010-SA"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[24px] text-[#708a00] group-hover:text-[#93b100] group-hover:scale-115 transition-all duration-300">
                verified
              </span>
              <span className="font-hud font-bold text-[11px] text-[#708a00] group-hover:text-[#93b100] tracking-wide uppercase transition-colors">
                MINSA / DIGESA
              </span>
            </div>
            <h3 className="font-hud font-extrabold text-[14px] text-[#151d22] group-hover:text-[#708a00] transition-colors mt-3">
              Guía D.S. N.° 031-2010-SA
            </h3>
            <p className="text-[11.5px] text-[#5f747e] group-hover:text-[#3d494d] mt-1 leading-relaxed transition-colors">
              Límites Máximos Permisibles (LMP), protocolo de muestreo y bioseguridad EPP.
            </p>
          </div>
        </button>

        {/* Card 4: Instructivo Didáctico en PDF */}
        <button
          type="button"
          onClick={onOpenUserManual}
          className="bg-gradient-to-br from-cyan-50/70 via-teal-50/70 to-emerald-50/70 hover:from-[#00b4d8]/15 hover:via-[#10e7b2]/20 hover:to-[#caf300]/20 border border-cyan-300 hover:border-[#10e7b2] rounded-2xl p-4 transition-all duration-300 text-left flex flex-col justify-between group shadow-2xs hover:shadow-[0_8px_25px_rgba(16,231,178,0.3)] active:scale-98 cursor-pointer relative overflow-hidden"
          title="Abrir e imprimir el Instructivo Didáctico Oficial de CLORAGUA (Descargar en PDF)"
        >
          <div className="absolute -top-1 -right-1">
            <span className="bg-[#10e7b2] text-[#002b1f] text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg font-hud shadow-2xs">
              DESCARGAR PDF
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[24px] text-[#00677d] group-hover:text-[#002b1f] group-hover:scale-115 transition-all duration-300">
                menu_book
              </span>
              <span className="font-hud font-bold text-[10px] text-[#00677d] group-hover:text-[#002b1f] tracking-wide uppercase transition-colors mr-14">
                GUÍA DIDÁCTICA
              </span>
            </div>
            <h3 className="font-hud font-extrabold text-[14px] text-[#004e5f] group-hover:text-[#002b1f] transition-colors mt-3">
              Instructivo de Uso (PDF)
            </h3>
            <p className="text-[11.5px] text-[#475569] group-hover:text-[#1e293b] mt-1 leading-relaxed transition-colors">
              Paso a paso ilustrado de cloración, DPD y seguridad sanitaria rural. Descargable en PDF.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
};

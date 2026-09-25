import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MASTER_SLIDES_PRESENTATION, PresentationSlide } from '../../data/slidesPresentationData';

interface DiapositivaEducativaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAction?: 'view' | 'download' | 'print';
  initialSlideNumber?: number;
}

export const DiapositivaEducativaModal: React.FC<DiapositivaEducativaModalProps> = ({
  isOpen,
  onClose,
  initialAction = 'view',
  initialSlideNumber = 1,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideNumber - 1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = MASTER_SLIDES_PRESENTATION.slides.length;
  const currentSlide: PresentationSlide = MASTER_SLIDES_PRESENTATION.slides[currentSlideIndex] || MASTER_SLIDES_PRESENTATION.slides[0];

  useEffect(() => {
    if (initialSlideNumber >= 1 && initialSlideNumber <= totalSlides) {
      setCurrentSlideIndex(initialSlideNumber - 1);
    }
  }, [initialSlideNumber, totalSlides]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialAction === 'print') {
      const timer = setTimeout(() => {
        handlePrint();
      }, 500);
      return () => clearTimeout(timer);
    } else if (initialAction === 'download') {
      const timer = setTimeout(() => {
        handleDownloadPdf();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialAction]);

  // Teclado para navegar entre diapositivas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  if (!isOpen) return null;

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const element = printContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.save(`DIAPOSITIVA_${currentSlide.slideNumber}_METALES_PESADOS_Y_SANEAMIENTO.pdf`);
    } catch (err) {
      console.error('Error al generar PDF de la diapositiva:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todas (28)' },
    { id: 'Metales Pesados', label: '1. Metales Pesados (10)' },
    { id: 'Saneamiento Ambiental', label: '2. Saneamiento (8)' },
    { id: 'Manejo de Residuos', label: '3. Residuos (3)' },
    { id: 'Control de Vectores', label: '4. Vectores (3)' },
    { id: 'Higiene del Entorno', label: '5. Higiene (3)' },
  ];

  const filteredSlides = filterCategory === 'all'
    ? MASTER_SLIDES_PRESENTATION.slides
    : MASTER_SLIDES_PRESENTATION.slides.filter(s => s.category === filterCategory || (filterCategory === 'all'));

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Estilos específicos de impresión directa en formato A4 Horizontal */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body * {
            visibility: hidden !important;
          }
          #slide-printable-area, #slide-printable-area * {
            visibility: visible !important;
          }
          #slide-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            background: #ffffff !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Cabecera del visor de la presentación */}
      <header className="no-print bg-[#00242e] border-b border-cyan-800/60 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] flex items-center justify-center text-[#00242e] shadow-sm shrink-0 font-bold">
            <span className="material-symbols-outlined text-[24px]">co_present</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[#10e7b2] text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-400/30">
                PRESENTACIÓN OFICIAL (28 DIAPOSITIVAS)
              </span>
              <span className="text-[11px] text-cyan-200 hidden md:inline truncate max-w-md">
                Expositora: {MASTER_SLIDES_PRESENTATION.author} • {MASTER_SLIDES_PRESENTATION.area}
              </span>
            </div>
            <h2 className="text-[13px] sm:text-[15px] font-hud font-bold text-white truncate max-w-xl">
              {MASTER_SLIDES_PRESENTATION.title}
            </h2>
          </div>
        </div>

        {/* Acciones principales: Controles de navegación y descarga */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Navegador de diapositivas anterior / siguiente */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
            <button
              type="button"
              onClick={goToPrev}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white cursor-pointer transition-colors"
              title="Diapositiva anterior (Flecha Izquierda)"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="px-2.5 text-[12px] font-mono font-bold text-cyan-200">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
            <button
              type="button"
              onClick={goToNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white cursor-pointer transition-colors"
              title="Diapositiva siguiente (Flecha Derecha)"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:opacity-95 text-[#002b36] font-hud text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            title="Descargar diapositiva en formato PDF (A4)"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isGeneratingPdf ? 'hourglass_top' : 'download'}
            </span>
            <span className="hidden sm:inline">
              {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-hud text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            title="Imprimir diapositiva actual en A4 apaisado"
          >
            <span className="material-symbols-outlined text-[16px] text-[#10e7b2]">print</span>
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/80 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            title="Cerrar presentación"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Barra de Filtros Temáticos */}
      <nav aria-label="Navegación de temas de la presentación" className="no-print bg-[#001b22] px-4 py-2 border-b border-cyan-900/40 flex items-center gap-2 overflow-x-auto text-[11.5px] font-hud shrink-0">
        <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider shrink-0">
          Temas:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-cyan-500 text-[#00242e] font-bold shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Área Central: Visualizador de la Diapositiva Activa */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start gap-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        
        {/* Lienzo A4 / 16:9 de la Diapositiva Imprimible */}
        <div
          id="slide-printable-area"
          ref={printContainerRef}
          className="w-full max-w-5xl aspect-[16/9] min-h-[460px] bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-cyan-300/80 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden text-slate-800"
        >
          {/* Adornos gráficos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Si es Slide 1: renderizar la portada oficial de alta definición */}
          {currentSlide.slideNumber === 1 ? (
            <div className="flex-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between border-b border-cyan-200 pb-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider border border-cyan-200">
                  Capacitación Oficial Comunitaria
                </span>
                <span className="font-mono text-[11px] text-slate-500 font-bold">
                  Diapositiva 1 / 28
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center flex-1 my-auto">
                <div className="flex-1 space-y-4">
                  <div className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-hud text-[13px] font-black uppercase tracking-wider shadow-sm">
                    TEMA PRINCIPAL
                  </div>
                  <h1 className="font-hud font-black text-[26px] sm:text-[34px] text-[#003440] leading-tight">
                    METALES PESADOS, SANEAMIENTO AMBIENTAL Y PRÁCTICAS DE HIGIENE
                  </h1>
                  
                  <div className="p-4 rounded-2xl bg-white/90 border border-cyan-200/80 shadow-xs space-y-1.5">
                    <p className="text-[13px] text-[#00677d] font-bold">
                      👤 Expositora: <span className="text-slate-800 font-semibold">{MASTER_SLIDES_PRESENTATION.author}</span>
                    </p>
                    <p className="text-[12px] text-slate-600">
                      📍 Área: <span className="text-slate-800 font-semibold">{MASTER_SLIDES_PRESENTATION.area}</span>
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-5/12 aspect-video rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-md">
                  <img
                    src="/diapositiva_metales_pesados_saneamiento.jpg"
                    alt="Portada Oficial"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 4 Ejes inferiores de la portada */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-cyan-200 mt-4">
                <div className="p-2.5 rounded-xl bg-white border border-cyan-100 text-center shadow-2xs">
                  <span className="material-symbols-outlined text-[#00b4d8] text-[20px] block mb-0.5">water_drop</span>
                  <span className="font-hud font-bold text-[11px] text-[#003440] block">Agua Segura</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-cyan-100 text-center shadow-2xs">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px] block mb-0.5">eco</span>
                  <span className="font-hud font-bold text-[11px] text-[#003440] block">Saneamiento</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-cyan-100 text-center shadow-2xs">
                  <span className="material-symbols-outlined text-amber-500 text-[20px] block mb-0.5">delete</span>
                  <span className="font-hud font-bold text-[11px] text-[#003440] block">Manejo Residuos</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-cyan-100 text-center shadow-2xs">
                  <span className="material-symbols-outlined text-blue-600 text-[20px] block mb-0.5">health_and_safety</span>
                  <span className="font-hud font-bold text-[11px] text-[#003440] block">Prácticas Higiene</span>
                </div>
              </div>
            </div>
          ) : (
            /* Renderizado de las diapositivas 2 a 28 */
            <div className="flex-1 flex flex-col justify-between z-10">
              {/* Header de la diapositiva */}
              <div className="flex items-center justify-between border-b border-cyan-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  {currentSlide.tema && (
                    <span className="px-2.5 py-0.5 rounded-md bg-[#00677d] text-white font-hud text-[11px] font-black uppercase">
                      {currentSlide.tema}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-[#004e5f] font-hud text-[10.5px] font-bold uppercase border border-cyan-200">
                    {currentSlide.category}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-slate-500 font-bold">
                  Página {currentSlide.slideNumber} de {totalSlides}
                </span>
              </div>

              {/* Título de la diapositiva */}
              <div className="mb-4">
                <h2 className="font-hud font-black text-[22px] sm:text-[27px] text-[#003440] leading-snug">
                  {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                  <p className="text-[13px] font-medium text-cyan-800">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Contenido en viñetas estructuradas */}
              <div className="flex-1 space-y-2.5 my-auto">
                {currentSlide.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-cyan-100">
                    <span className="material-symbols-outlined text-[18px] text-[#00b4d8] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Elementos destacados si existen (metales, tachos, etc.) */}
              {currentSlide.elements && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2">
                  {currentSlide.elements.map((elem, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-cyan-200/90 shadow-2xs">
                      <span className="font-hud font-bold text-[12px] block text-[#003440]" style={{ color: elem.color }}>
                        {elem.label}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        {elem.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Callout destacado de cierre si existe */}
              {currentSlide.callout && (
                <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border-l-4 border-[#00b4d8] text-[12px] font-hud font-bold text-[#003440] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#00b4d8] shrink-0">
                    lightbulb
                  </span>
                  <span>{currentSlide.callout}</span>
                </div>
              )}

              {/* Footer de la diapositiva */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-hud pt-3 border-t border-cyan-200 mt-3">
                <span>AQUA-SALUD • Gestión Territorial del Agua Segura</span>
                <span>Expositora: {MASTER_SLIDES_PRESENTATION.author}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tira inferior de miniaturas para navegación rápida */}
        <div className="no-print w-full max-w-5xl bg-[#001f28] p-3 rounded-2xl border border-cyan-900/60 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-hud text-slate-400 mb-2 px-1">
            <span>Navegador de Miniaturas ({filteredSlides.length} diapositivas)</span>
            <span>Usa las flechas ← y → del teclado para avanzar o retroceder</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filteredSlides.map((slide) => {
              const isActive = slide.slideNumber === currentSlide.slideNumber;
              return (
                <button
                  key={slide.slideNumber}
                  type="button"
                  onClick={() => setCurrentSlideIndex(slide.slideNumber - 1)}
                  className={`w-28 h-18 shrink-0 rounded-xl p-2 text-left flex flex-col justify-between transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] text-[#002b36] border-white shadow-md scale-102 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                  title={`Ir a Diapositiva ${slide.slideNumber}: ${slide.title}`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span>Pág {slide.slideNumber}</span>
                    <span className="truncate max-w-[50px]">{slide.category}</span>
                  </div>
                  <p className="text-[10px] font-hud line-clamp-2 leading-tight">
                    {slide.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
};

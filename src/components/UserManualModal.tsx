import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'all' | 'basics' | 'dpd' | 'dosage' | 'tank' | 'logbook' | 'safety' | 'faq'>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const manualContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!manualContentRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress('Preparando contenido didáctico para compilar...');

    try {
      const element = manualContentRef.current;

      // Ensure all sections are active during PDF export
      const previousSection = activeSection;
      setActiveSection('all');
      await new Promise((r) => setTimeout(r, 250));

      setPdfProgress('Procesando gráficos y tipografía en alta definición...');

      // Save scroll & styling to temporarily remove scroll constraints for full capture
      const originalOverflow = element.style.overflow;
      const originalMaxHeight = element.style.maxHeight;
      const originalHeight = element.style.height;
      const originalScrollTop = element.scrollTop;

      element.style.overflow = 'visible';
      element.style.maxHeight = 'none';
      element.style.height = 'auto';
      element.scrollTop = 0;

      const canvas = await html2canvas(element, {
        scale: 2, // 2x retina scale for crisp text & badges
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollY: 0,
        scrollX: 0,
      });

      // Restore element styles
      element.style.overflow = originalOverflow;
      element.style.maxHeight = originalMaxHeight;
      element.style.height = originalHeight;
      element.scrollTop = originalScrollTop;

      setPdfProgress('Dividiendo páginas en formato A4 estándar...');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const printableWidth = pageWidth - margin * 2; // 190 mm
      const printableHeight = pageHeight - margin * 2 - 10; // 267 mm (reserving space for header/footer)

      // Calculate slice height in source canvas pixels
      const pxPageWidth = canvas.width;
      const pxPageHeight = Math.floor((pxPageWidth * printableHeight) / printableWidth);
      const totalPages = Math.max(1, Math.ceil(canvas.height / pxPageHeight));

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = pxPageWidth;
        const currentSliceHeight = Math.min(pxPageHeight, canvas.height - i * pxPageHeight);
        pageCanvas.height = currentSliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            i * pxPageHeight,
            pxPageWidth,
            currentSliceHeight,
            0,
            0,
            pxPageWidth,
            currentSliceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const renderHeight = (currentSliceHeight * printableWidth) / pxPageWidth;
          pdf.addImage(pageImgData, 'JPEG', margin, margin + 4, printableWidth, renderHeight, undefined, 'FAST');
        }

        // Header line on every page
        pdf.setFontSize(8);
        pdf.setTextColor(0, 103, 125);
        pdf.text('CLORAGUA — Plataforma Oficial de Vigilancia Sanitaria y Cloración Rural', margin, 7);

        // Footer line on every page
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `Instructivo Didáctico (D.S. N.° 031-2010-SA) | Página ${i + 1} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      }

      pdf.save('Instructivo_Didactico_CLORAGUA_Agua_Segura.pdf');
      setPdfProgress('¡Archivo PDF descargado exitosamente!');
      setTimeout(() => {
        setIsGeneratingPdf(false);
        setPdfProgress('');
      }, 1500);
      setActiveSection(previousSection);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setIsGeneratingPdf(false);
      setPdfProgress('');
      // Fallback: trigger print dialog if canvas generation had issues
      handlePrint();
    }
  };

  const handlePrint = () => {
    // Expand all sections so the complete document prints
    setActiveSection('all');

    setTimeout(() => {
      try {
        // Create an isolated print iframe to prevent modal backdrop clipping
        const oldFrame = document.getElementById('cloragua-print-frame');
        if (oldFrame) oldFrame.remove();

        const printFrame = document.createElement('iframe');
        printFrame.id = 'cloragua-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const content = manualContentRef.current?.innerHTML || '';
        const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;

        if (frameDoc) {
          frameDoc.open();
          frameDoc.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="utf-8" />
              <title>Instructivo Didáctico de Cloración - CLORAGUA</title>
              <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
              <style>
                * { box-sizing: border-box; }
                body {
                  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                  color: #0f172a;
                  background: #ffffff;
                  margin: 0;
                  padding: 20px;
                  font-size: 13px;
                  line-height: 1.55;
                }
                .font-hud { font-family: 'Space Grotesk', monospace; }
                .material-symbols-outlined {
                  font-family: 'Material Symbols Outlined';
                  font-size: 18px;
                  vertical-align: middle;
                  display: inline-block;
                }
                @page {
                  size: A4 portrait;
                  margin: 14mm 12mm 14mm 12mm;
                }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none !important; }
                  section { break-inside: avoid; page-break-inside: avoid; margin-bottom: 22px; }
                }
                section { margin-bottom: 22px; }
              </style>
            </head>
            <body>
              <div style="max-width: 820px; margin: 0 auto;">
                ${content}
              </div>
            </body>
            </html>
          `);
          frameDoc.close();

          setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          }, 400);
        } else {
          window.print();
        }
      } catch (e) {
        console.warn('Fallback print:', e);
        window.print();
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-[#151d22] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#bcc9ce]/40 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#003d4c] via-[#005a70] to-[#002833] text-white flex items-center justify-between gap-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] flex items-center justify-center text-[#002116] shadow-[0_0_16px_rgba(0,180,216,0.4)] shrink-0">
              <span className="material-symbols-outlined text-[26px]">menu_book</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-extrabold text-[16px] sm:text-[18px] text-white tracking-wide truncate">
                  INSTRUCTIVO DE USO DIDÁCTICO
                </h2>
                <span className="bg-[#caf300] text-[#002b1f] text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0">
                  D.S. 031-SA
                </span>
              </div>
              <p className="text-[11.5px] text-cyan-200/90 truncate">
                Guía ilustrada paso a paso para el operador de agua rural (JASS y Gobiernos Locales)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#10e7b2] to-[#caf300] hover:from-[#00b4d8] hover:to-[#10e7b2] text-[#002b1f] font-hud text-[11px] sm:text-[12px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
              title="Descargar este manual en archivo PDF imprimible"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGeneratingPdf ? 'hourglass_top' : 'download'}
              </span>
              <span className="hidden sm:inline">
                {isGeneratingPdf ? 'Generando...' : 'Descargar en PDF'}
              </span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-hud text-[11px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer border border-white/20"
              title="Imprimir instructivo directamente"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Cerrar ventana"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner for PDF generation */}
        {isGeneratingPdf && (
          <div className="bg-cyan-50 border-b border-cyan-200 px-4 py-2.5 text-center flex items-center justify-center gap-2 text-cyan-800 text-[12px] font-medium animate-pulse">
            <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">sync</span>
            <span>{pdfProgress}</span>
          </div>
        )}

        {/* Quick Navigation Filter Bar */}
        <div className="bg-[#f0f7f9] border-b border-[#bcc9ce]/40 p-2 sm:px-4 flex items-center gap-1.5 overflow-x-auto text-[11.5px] font-hud font-bold text-[#5f747e] shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeSection === 'all'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            Ver Todo (Completo)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('basics')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'basics'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>🌊 1. El Cloro & Semáforo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('dpd')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'dpd'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>🧪 2. Escáner DPD</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('dosage')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'dosage'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>⚖️ 3. Dosificación</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('tank')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'tank'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>🚰 4. Solución & Aforo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('logbook')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'logbook'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>📋 5. Bitácora</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('safety')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'safety'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>🛡️ 6. EPP & Seguridad</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('faq')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeSection === 'faq'
                ? 'bg-[#00677d] text-white shadow-xs'
                : 'bg-white hover:bg-cyan-50 text-[#00677d]'
            }`}
          >
            <span>❓ 7. Preguntas</span>
          </button>
        </div>

        {/* Scrollable Printable Content Area */}
        <div
          ref={manualContentRef}
          id="cloragua-printable-manual"
          className="p-4 sm:p-8 overflow-y-auto space-y-8 bg-white text-[#1e293b] leading-relaxed text-[13.5px]"
        >
          {/* Cover / Title banner inside document */}
          <div className="border-b-2 border-cyan-500 pb-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#00677d] font-hud">
                  SISTEMA OFICIAL DE DESINFECCIÓN Y VIGILANCIA SANITARIA
                </span>
                <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#002b36] font-hud mt-0.5">
                  MANUAL OPERATIVO DEL GUARDIÁN DEL AGUA
                </h1>
                <p className="text-[12.5px] text-[#475569] mt-1">
                  Guía pedagógica de desinfección, cálculo de hipoclorito, aforo y control de cloro residual conforme al Reglamento de la Calidad del Agua para Consumo Humano (D.S. N.° 031-2010-SA).
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="px-3 py-1 rounded-md bg-[#00677d] text-white font-mono font-bold text-[11px]">
                  JASS / MINSA
                </span>
                <span className="text-[10px] text-[#64748b] mt-1">Versión 2026</span>
              </div>
            </div>

            {/* Quick Action Box for PDF Download and Direct Print (visible on screen, hidden on physical print) */}
            <div className="no-print mt-4 p-3.5 bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 rounded-2xl border border-cyan-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00677d] text-[#10e7b2] flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                </div>
                <div>
                  <div className="font-hud font-bold text-[13px] text-[#003d4c] flex items-center gap-2">
                    <span>Opciones de Descarga e Impresión</span>
                    <span className="text-[10px] bg-[#10e7b2] text-[#002b1f] font-black px-1.5 py-0.2 rounded font-hud">
                      A4 OFICIAL
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#475569]">
                    Descargue el archivo .PDF para compartir por WhatsApp o imprímalo para la caseta comunal.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#10e7b2] to-[#caf300] hover:from-[#00b4d8] hover:to-[#10e7b2] text-[#002b1f] font-hud text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  title="Generar y descargar archivo PDF en su dispositivo"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isGeneratingPdf ? 'hourglass_top' : 'download'}
                  </span>
                  <span>{isGeneratingPdf ? 'Compilando...' : 'Descargar PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#004e5f] border border-cyan-300 font-hud text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all duration-300 cursor-pointer"
                  title="Imprimir o guardar como PDF mediante la ventana del navegador"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#00677d]">print</span>
                  <span>Imprimir / Guardar</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 1: Conceptos Básicos y Semáforo */}
          {(activeSection === 'all' || activeSection === 'basics') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  ¿Por qué cloramos el agua y qué es el Cloro Residual Libre?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80">
                  <div className="flex items-center gap-2 text-[#00677d] font-bold font-hud text-[13px] mb-1.5">
                    <span className="material-symbols-outlined text-[19px]">health_and_safety</span>
                    <span>El Objetivo Sanitario</span>
                  </div>
                  <p className="text-[12px] text-[#334155]">
                    El cloro destruye bacterias, virus y microorganismos causantes de diarreas agudas, cólera y parasitosis. Clorar el agua protege la salud y nutrición de niños, ancianos y familias rurales.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                  <div className="flex items-center gap-2 text-[#006c51] font-bold font-hud text-[13px] mb-1.5">
                    <span className="material-symbols-outlined text-[19px]">shield</span>
                    <span>El Escudo Protector (Cloro Residual)</span>
                  </div>
                  <p className="text-[12px] text-[#334155]">
                    Es la pequeña cantidad de cloro activo que permanece en el agua después de desinfectarla. Este remanente viaja por las tuberías hasta el grifo de cada vivienda, impidiendo que el agua vuelva a contaminarse en el trayecto.
                  </p>
                </div>
              </div>

              {/* El Semáforo del Cloro */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-hud font-bold text-[13px] text-[#1e293b] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">traffic</span>
                  <span>EL SEMÁFORO SANITARIO DEL CLORO (Valores según D.S. 031-2010-SA)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-red-700 font-hud text-[14px]">🔴 SUB-CLORADO</span>
                        <span className="text-[11px] font-mono font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                          &lt; 0.50 PPM
                        </span>
                      </div>
                      <p className="text-[11.5px] text-red-800 font-medium leading-snug">
                        <strong>¡PELIGRO BIOLÓGICO!</strong> El agua no tiene protección suficiente. Las bacterias pueden proliferar.
                      </p>
                    </div>
                    <div className="mt-2 text-[10.5px] text-red-700 bg-white/70 p-1.5 rounded">
                      <strong>Acción:</strong> Aumentar goteo del dosificador o reforzar dosis.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-emerald-800 font-hud text-[14px]">🟢 RANGO ÓPTIMO</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-150 px-1.5 py-0.5 rounded">
                          0.50 - 2.00 PPM
                        </span>
                      </div>
                      <p className="text-[11.5px] text-emerald-900 font-medium leading-snug">
                        <strong>¡AGUA SEGURA Y SALUDABLE!</strong> Cumple 100% con la norma nacional. Protegida y con sabor neutro.
                      </p>
                    </div>
                    <div className="mt-2 text-[10.5px] text-emerald-800 bg-white/70 p-1.5 rounded">
                      <strong>Acción:</strong> Mantener goteo y registrar en bitácora.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-amber-800 font-hud text-[14px]">🟡 SOBRE-CLORADO</span>
                        <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          &gt; 2.00 PPM
                        </span>
                      </div>
                      <p className="text-[11.5px] text-amber-900 font-medium leading-snug">
                        <strong>¡ALERTA DE SABOR/OLOR!</strong> Fuerte olor a lejía. La población puede rechazar el agua tratada.
                      </p>
                    </div>
                    <div className="mt-2 text-[10.5px] text-amber-800 bg-white/70 p-1.5 rounded">
                      <strong>Acción:</strong> Reducir el goteo de solución inmediatamente.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: Escáner DPD y Medición */}
          {(activeSection === 'all' || activeSection === 'dpd') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  Cómo medir el cloro con reactivo DPD y usar el Escáner Óptico
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center mb-1 text-[13px]">
                    1
                  </div>
                  <span className="font-bold text-[12px] text-[#0f172a]">Purgar el Grifo</span>
                  <p className="text-[11px] text-[#64748b] mt-1">
                    Abra el grifo de agua durante 1 a 2 minutos para evacuar agua estancada en el tubo.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center mb-1 text-[13px]">
                    2
                  </div>
                  <span className="font-bold text-[12px] text-[#0f172a]">Llenar Celda (10mL)</span>
                  <p className="text-[11px] text-[#64748b] mt-1">
                    Enjuague 3 veces la probeta y llénela exactamente hasta la marca de 10 mililitros.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center mb-1 text-[13px]">
                    3
                  </div>
                  <span className="font-bold text-[12px] text-[#0f172a]">Agregar DPD N° 1</span>
                  <p className="text-[11px] text-[#64748b] mt-1">
                    Añada la pastilla o sobre de reactivo DPD 1. Agite suavemente 15 segundos hasta disolver.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center mb-1 text-[13px]">
                    4
                  </div>
                  <span className="font-bold text-[12px] text-[#0f172a]">Lectura Fotométrica</span>
                  <p className="text-[11px] text-[#64748b] mt-1">
                    El agua tomará tono rosa/magenta. Más intenso = mayor PPM de cloro libre disponible.
                  </p>
                </div>
              </div>

              {/* Cómo usar la Cámara Escáner DPD de la Web */}
              <div className="p-4 rounded-2xl bg-cyan-950 text-white border border-cyan-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#10e7b2] text-[22px]">photo_camera</span>
                  <h3 className="font-hud font-bold text-[14px] text-white">
                    Instrucciones para usar el "Escáner Óptico DPD" en la App
                  </h3>
                </div>
                <ul className="space-y-1.5 text-[12px] text-cyan-100/90 list-disc list-inside">
                  <li>Haga clic en el botón <strong>"CÁMARA DPD"</strong> en el encabezado de CLORAGUA.</li>
                  <li>Coloque el tubo de ensayo con agua teñida frente a la cámara de su celular o computadora, con fondo blanco o luz natural difusa.</li>
                  <li>Alinee el líquido dentro del recuadro objetivo en pantalla. El sistema analizará los componentes cromáticos RGB/HSV.</li>
                  <li>Presione <strong>«Capturar & Aplicar Lectura»</strong>. El valor en PPM se guardará directamente en la bitácora del reservorio seleccionado sin errores manuales.</li>
                </ul>
              </div>
            </section>
          )}

          {/* SECTION 3: Dosificación Matemática */}
          {(activeSection === 'all' || activeSection === 'dosage') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  3
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  Cálculo y Dosificación de Hipoclorito (Pestaña "Dosis")
                </h2>
              </div>

              <p className="text-[12.5px] text-[#334155]">
                Para no desperdiciar químico ni intoxicar la red, la cantidad exacta de desinfectante se calcula con la fórmula de balance de masa sanitaria:
              </p>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-center">
                <div className="font-mono font-black text-[15px] sm:text-[17px] text-[#004e5f]">
                  Peso (gramos) = [ Volumen (Litros) × Dosis deseada (PPM) ] ÷ [ % Pureza del cloro × 10 ]
                </div>
                <div className="text-[11px] text-[#556987] mt-1">
                  Donde: 1 PPM = 1 mg/Litro | Hipoclorito de Calcio = 70% | Hipoclorito de Sodio = 8% a 10%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-hud font-bold text-[12.5px] text-[#00677d] uppercase">
                  Ejemplo Práctico de Campo:
                </span>
                <p className="text-[12px] text-[#334155] mt-1">
                  Usted tiene un reservorio de <strong>20,000 Litros</strong> (20 m³) y desea alcanzar una concentración de <strong>1.00 PPM</strong> utilizando <strong>Hipoclorito de Calcio al 70%</strong>:
                </p>
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-[12px] text-[#0f172a]">
                  Peso = (20,000 L × 1.0 mg/L) ÷ (70 × 10) = 20,000 ÷ 700 = <strong>28.57 gramos de cloro</strong>
                </div>
                <p className="text-[11.5px] text-emerald-700 font-medium mt-2">
                  ✓ El asistente de la pestaña <strong>"Dosis"</strong> hace este cálculo en 1 segundo y le indica exactamente la masa requerida.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 4: Solución Madre y Calibración */}
          {(activeSection === 'all' || activeSection === 'tank') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  4
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  Preparación de Solución Madre y Aforo del Dosificador
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <h3 className="font-hud font-bold text-[13px] text-amber-900 mb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[19px]">science</span>
                    <span>Preparación de Solución Madre</span>
                  </h3>
                  <ol className="space-y-1.5 text-[11.5px] text-amber-950 list-decimal list-inside">
                    <li>Disuelva el hipoclorito calculado en un balde con agua limpia usando paleta plástica (nunca metal).</li>
                    <li>Vierta la mezcla en el tanque de solución madre (ej. 250 L, 600 L o 1000 L).</li>
                    <li>Complete el tanque con agua y mezcle durante 5 a 10 minutos.</li>
                    <li><strong>¡REGLA DE ORO! Deje reposar 4 a 6 horas.</strong> La cal insoluble debe asentarse en el fondo (sedimentación) para no obstruir mangueras ni llaves de paso.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                  <h3 className="font-hud font-bold text-[13px] text-cyan-900 mb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[19px]">tune</span>
                    <span>Calibración por Aforo (60 Segundos)</span>
                  </h3>
                  <ol className="space-y-1.5 text-[11.5px] text-cyan-950 list-decimal list-inside">
                    <li>Abra la herramienta <strong>"Calibrar Dosificador"</strong> en el menú de CLORAGUA.</li>
                    <li>Coloque una probeta graduada bajo el gotero o manguera de dosificación.</li>
                    <li>Active el <strong>cronómetro de 60 segundos</strong> integrado en la app.</li>
                    <li>Mida los mililitros capturados al cumplirse el minuto: ese volumen exacto corresponde al caudal en <strong>mL/minuto</strong>.</li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: Bitácora Oficial */}
          {(activeSection === 'all' || activeSection === 'logbook') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  5
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  Gestión de la Bitácora Oficial y Respaldo Sanitario
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-[12px] text-[#334155]">
                <p>
                  El Ministerio de Salud (MINSA/DIGESA) y la SUNASS exigen que cada sistema de agua potable cuente con registros diarios y verificables de calidad.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-[#00677d] block mb-1">1. Salida de Reservorio</strong>
                    Mide el cloro que ingresa a la red principal inmediatamente después de la desinfección.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-[#00677d] block mb-1">2. Primera Vivienda</strong>
                    Verifica que no exista sobre-cloración en los domicilios más cercanos al reservorio.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-[#00677d] block mb-1">3. Última Vivienda (Punto Crítico)</strong>
                    Punto más lejano de la red. Debe marcar como mínimo <strong>0.50 PPM</strong> para garantizar agua segura a toda la comunidad.
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6: Bioseguridad y EPP */}
          {(activeSection === 'all' || activeSection === 'safety') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  6
                </span>
                <h2 className="text-[17px] font-bold text-rose-900 font-hud uppercase tracking-wide">
                  Seguridad, Salud del Operador y Equipos de Protección (EPP)
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <h3 className="font-hud font-bold text-[13px] text-rose-800 mb-2">
                  EQUIPO DE PROTECCIÓN PERSONAL OBLIGATORIO (EPP):
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11.5px] font-semibold text-rose-950">
                  <div className="p-2 rounded-xl bg-white border border-rose-200">
                    😷 Mascarilla con filtro para gases/polvo
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-rose-200">
                    🧤 Guantes de nitrilo o neopreno resistentes
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-rose-200">
                    🥽 Lentes herméticos antisalpicadura
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-rose-200">
                    🥾 Botas de jebe y delantal plástico
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-rose-800 bg-white/60 p-2.5 rounded-xl border border-rose-200 leading-snug">
                  <strong>⚠️ En caso de contacto accidental:</strong> Lave inmediatamente con abundante agua limpia durante 15 minutos en ojos o piel. Nunca mezcle hipoclorito con ácidos o detergentes, pues produce gas cloro altamente tóxico.
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: Preguntas Frecuentes */}
          {(activeSection === 'all' || activeSection === 'faq') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black font-hud text-[14px] flex items-center justify-center shrink-0">
                  7
                </span>
                <h2 className="text-[17px] font-bold text-[#003d4c] font-hud uppercase tracking-wide">
                  Preguntas Frecuentes y Solución Rápida de Problemas
                </h2>
              </div>

              <div className="space-y-2.5 text-[12px]">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#004e5f] block font-hud text-[12.5px]">
                    ¿Por qué el cloro marca 0.00 PPM a pesar de que puse hipoclorito?
                  </strong>
                  <p className="text-[#334155] mt-1">
                    Puede deberse a tres factores: (1) Manguera de goteo obstruida con sarro o cal; (2) Demanda de cloro muy alta por materia orgánica en el reservorio; o (3) El reactivo DPD está vencido o húmedo.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#004e5f] block font-hud text-[12.5px]">
                    ¿Cómo guardo el hipoclorito sobrante?
                  </strong>
                  <p className="text-[#334155] mt-1">
                    En su envase original herméticamente cerrado, en un lugar seco, fresco, con ventilación y fuera del alcance de la luz solar directa y de niños.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-[#004e5f] block font-hud text-[12.5px]">
                    ¿Se pierden mis registros si cierro el navegador?
                  </strong>
                  <p className="text-[#334155] mt-1">
                    No. CLORAGUA guarda automáticamente los perfiles, reservorios y bitácoras en el almacenamiento persistente local de su navegador.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Document Footer Signatures */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748b]">
            <div>
              <strong>Plataforma CLORAGUA</strong> — Desarrollada para la gestión hídrica y vigilancia sanitaria rural.
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold font-hud">
                DOCUMENTO OFICIAL AUDITABLE
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11.5px] text-[#556987] hidden sm:block">
            Tip: Puede imprimir directamente o descargar el PDF para plastificarlo y colocarlo en la caseta de cloración.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-white hover:bg-slate-200 border border-slate-300 text-[#004e5f] font-hud text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Abrir ventana de impresión para impresora o Guardar como PDF"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00677d]">print</span>
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isGeneratingPdf ? 'hourglass_top' : 'download'}
              </span>
              <span>{isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-200 border border-slate-300 text-[#334155] font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

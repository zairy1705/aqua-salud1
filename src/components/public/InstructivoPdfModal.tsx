import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  OFFICIAL_INSTRUCTIVOS_PDFS,
  InstructivoPdfDocument,
  InstructivoPage,
  InstructivoSection,
} from '../../data/officialInstructivosPdfs';

interface InstructivoPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  initialAction?: 'view' | 'download' | 'print';
}

export const InstructivoPdfModal: React.FC<InstructivoPdfModalProps> = ({
  isOpen,
  onClose,
  documentId = 'cloracion-consumo-humano',
  initialAction = 'view',
}) => {
  const [activeDocId, setActiveDocId] = useState<string>(documentId);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [viewMode, setViewMode] = useState<'all' | number>('all');
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    if (documentId) {
      setActiveDocId(documentId);
    }
  }, [documentId]);

  // Handle initial action (print or download) when opened
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
  }, [isOpen, initialAction, activeDocId]);

  if (!isOpen) return null;

  const currentDoc =
    OFFICIAL_INSTRUCTIVOS_PDFS.find((d) => d.id === activeDocId) ||
    OFFICIAL_INSTRUCTIVOS_PDFS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage('Generando documento en formato PDF de alta resolución...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageElements = printContainerRef.current.querySelectorAll<HTMLElement>(
        '.instructivo-page-a4'
      );

      if (pageElements.length === 0) {
        throw new Error('No se encontraron páginas para exportar');
      }

      for (let i = 0; i < pageElements.length; i++) {
        const el = pageElements[i];
        setExportMessage(`Renderizando página ${i + 1} de ${pageElements.length}...`);

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // A4 standard: 210 x 297 mm
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setExportMessage('Finalizando descarga...');
      const cleanFileName = `${currentDoc.code}_${currentDoc.title
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 50)}.pdf`;

      pdf.save(cleanFileName);
    } catch (err) {
      console.error('Error al generar PDF del instructivo:', err);
      // Fallback a print
      window.print();
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-900/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Estilos dedicados para impresión directa */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #instructivo-printable-area, #instructivo-printable-area * {
            visibility: visible !important;
          }
          #instructivo-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .instructivo-page-a4 {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20mm !important;
            min-height: 297mm !important;
            max-width: 100% !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Barra superior de control del visor */}
      <header className="no-print bg-[#002b36] border-b border-cyan-800/50 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] flex items-center justify-center text-[#002b36] shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[#10e7b2] text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-400/30">
                {currentDoc.code}
              </span>
              <span className="text-[11px] text-cyan-200 hidden sm:inline">
                {currentDoc.totalPages} Páginas Oficiales
              </span>
            </div>
            <h2 className="text-[13px] sm:text-[15px] font-hud font-bold text-white truncate max-w-xl">
              {currentDoc.title}
            </h2>
          </div>
        </div>

        {/* Acciones principales: Descargar, Imprimir, Cerrar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:opacity-95 text-[#002b36] font-hud text-[11.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            title="Descargar este documento en archivo PDF original"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-hud text-[11.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title="Imprimir documento en hojas A4 o Guardar como PDF del sistema"
          >
            <span className="material-symbols-outlined text-[17px] text-[#10e7b2]">print</span>
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/80 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            title="Cerrar visor"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Barra de pestañas para cambiar rápidamente entre los 3 PDFs oficiales */}
      <nav aria-label="Instructivos oficiales" className="no-print bg-[#001f28] border-b border-cyan-900/60 px-4 py-2 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[11px] font-hud font-bold text-cyan-400 uppercase mr-1 hidden md:inline">
            Documentos Oficiales:
          </span>
          {OFFICIAL_INSTRUCTIVOS_PDFS.map((doc) => {
            const isActive = doc.id === currentDoc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setActiveDocId(doc.id);
                  setViewMode('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-hud font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#00b4d8] text-[#002b36] shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {doc.id.includes('seguridad') ? 'security' : 'menu_book'}
                </span>
                <span className="truncate max-w-[200px] sm:max-w-none">{doc.code} • {doc.category}</span>
              </button>
            );
          })}
        </div>

        {/* Selector de vista: Todas las páginas o página individual */}
        <div className="flex items-center gap-1 min-w-max text-[11px] text-cyan-200">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 rounded text-[10.5px] font-bold uppercase transition-all ${
              viewMode === 'all'
                ? 'bg-cyan-500/30 text-white border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ver Todas ({currentDoc.totalPages})
          </button>
        </div>
      </nav>

      {/* Banner de progreso de exportación */}
      {isExporting && (
        <div className="no-print bg-cyan-600 text-white px-4 py-2 text-center text-xs font-hud font-bold flex items-center justify-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Contenedor desplazable con las páginas A4 */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 bg-slate-900/60">
        <div
          id="instructivo-printable-area"
          ref={printContainerRef}
          className="w-full flex flex-col items-center gap-8 max-w-[850px]"
        >
          {currentDoc.pages
            .filter((p) => viewMode === 'all' || viewMode === p.pageNumber)
            .map((page) => (
              <article
                key={`doc-${currentDoc.id}-page-${page.pageNumber}`}
                className="instructivo-page-a4 w-full bg-white text-slate-800 rounded-lg shadow-2xl p-8 sm:p-14 min-h-[1100px] flex flex-col justify-between border border-slate-200 relative text-[13px] leading-relaxed select-text"
                style={{
                  fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
                }}
              >
                {/* Encabezado formal de la página */}
                <header className="pb-3 mb-5 border-b-2 border-[#00677d]/30 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00677d]">{currentDoc.code}</span>
                    <span>•</span>
                    <span className="uppercase text-slate-600 truncate max-w-[320px] sm:max-w-none">
                      {currentDoc.title}
                    </span>
                  </div>
                  <div className="text-right font-bold text-slate-600">
                    Pág. {page.pageNumber} de {currentDoc.totalPages}
                  </div>
                </header>

                {/* Contenido de la página */}
                <div className="flex-1 space-y-4">
                  {page.sections.map((section, sIdx) => (
                    <RenderSection
                      key={`sec-${page.pageNumber}-${sIdx}`}
                      section={section}
                      isCoverPage={page.pageNumber === 1}
                    />
                  ))}
                </div>

                {/* Pie de página oficial */}
                <footer className="pt-3 mt-6 border-t border-slate-200 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                  <div>
                    AQUA-SALUD • DIGESA / MINSA • D.S. N° 031-2010-SA
                  </div>
                  <div>
                    Documento Oficial de Referencia Sanitaria
                  </div>
                </footer>
              </article>
            ))}
        </div>
      </main>
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTE: RENDERIZADOR DE SECCIONES CON MÁXIMA FIDELIDAD AL PDF
// =============================================================================
interface RenderSectionProps {
  section: InstructivoSection;
  isCoverPage?: boolean;
}

const RenderSection: React.FC<RenderSectionProps> = ({ section, isCoverPage }) => {
  return (
    <div className="space-y-2.5">
      {/* Título de portada o título de sección */}
      {section.title && (
        <h2
          className={`${
            isCoverPage
              ? 'text-center font-serif font-black text-2xl sm:text-3xl text-[#003440] tracking-tight uppercase border-b-2 border-[#00677d] pb-2 mb-3'
              : 'font-serif font-bold text-[15px] sm:text-[16px] text-[#003440] uppercase border-b border-slate-200 pb-1 mt-4'
          }`}
        >
          {section.title}
        </h2>
      )}

      {/* Subtítulo */}
      {section.subtitle && (
        <h3
          className={`${
            isCoverPage
              ? 'text-center font-serif font-extrabold text-lg sm:text-xl text-[#00677d] tracking-wide uppercase'
              : 'font-sans font-bold text-[13px] text-[#004e5f] mt-2'
          }`}
        >
          {section.subtitle}
        </h3>
      )}

      {/* Párrafos */}
      {section.paragraphs && (
        <div className="space-y-1.5 text-slate-700 text-justify text-[12.5px] sm:text-[13px]">
          {section.paragraphs.map((p, idx) => (
            <p key={idx} className={isCoverPage ? 'text-center text-slate-600' : ''}>
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Lista con viñetas */}
      {section.bullets && (
        <ul className="space-y-1.5 pl-5 list-disc text-slate-700 text-[12px] sm:text-[12.5px]">
          {section.bullets.map((b, idx) => (
            <li key={idx} className="leading-snug">
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Pasos numerados */}
      {section.numberedSteps && (
        <ol className="space-y-1.5 pl-5 list-decimal text-slate-700 text-[12px] sm:text-[12.5px]">
          {section.numberedSteps.map((step, idx) => (
            <li key={idx} className="leading-snug">
              {step}
            </li>
          ))}
        </ol>
      )}

      {/* Alertas destacadas en rojo/ámbar */}
      {section.alert && (
        <div className="p-3 my-2 rounded-lg bg-rose-50 border-l-4 border-rose-600 text-rose-900 text-[12px] font-medium flex items-start gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="leading-relaxed">{section.alert}</div>
        </div>
      )}

      {/* Notas al pie o notas aclaratorias */}
      {section.note && (
        <div className="p-2.5 my-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600 italic text-[11px] leading-relaxed">
          {section.note}
        </div>
      )}

      {/* Fórmulas matemáticas */}
      {section.formula && (
        <div className="p-3 my-2 rounded-xl bg-cyan-50/80 border border-cyan-200 text-center">
          <div className="font-mono font-bold text-[14px] sm:text-[15px] text-[#004e5f] py-1">
            {section.formula.expression}
          </div>
          {section.formula.description && (
            <div className="mt-2 text-left text-[11.5px] text-slate-600 space-y-0.5 max-w-md mx-auto pl-4">
              {section.formula.description.map((d, idx) => (
                <div key={idx} className="leading-tight">
                  • {d}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tablas de datos técnicos y normativos */}
      {section.table && (
        <div className="overflow-x-auto my-3 border border-slate-300 rounded-lg">
          <table className="w-full text-left text-[11px] sm:text-[11.5px] border-collapse">
            <thead>
              <tr className="bg-[#004e5f] text-white">
                {section.table.headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="p-2.5 font-bold uppercase tracking-wider border-r border-cyan-800 last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {section.table.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 hover:bg-cyan-50/30'}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="p-2 border-r border-slate-200 last:border-r-0 text-slate-700 leading-snug align-top"
                    >
                      {cell || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {section.table.caption && (
            <div className="p-1.5 text-[10px] text-slate-500 text-right bg-slate-50 italic">
              {section.table.caption}
            </div>
          )}
        </div>
      )}

      {/* Rombo NFPA 704 exacto */}
      {section.nfpa && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 my-3 bg-slate-50 rounded-xl border border-slate-200">
          {/* Gráfico SVG del Rombo NFPA 704 */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-36 h-36 drop-shadow-sm">
              {/* Cuadrante Rojo (Inflamabilidad - Arriba) */}
              <polygon points="50,2 98,50 50,50 50,2" transform="rotate(45 50 50)" fill="#e53e3e" />
              {/* Cuadrante Azul (Salud - Izquierda) */}
              <polygon points="2,50 50,2 50,50 2,50" transform="rotate(45 50 50)" fill="#3182ce" />
              {/* Cuadrante Amarillo (Reactividad - Derecha) */}
              <polygon points="50,50 98,50 50,98 50,50" transform="rotate(45 50 50)" fill="#ecc94b" />
              {/* Cuadrante Blanco (Especial - Abajo) */}
              <polygon points="2,50 50,50 50,98 2,50" transform="rotate(45 50 50)" fill="#ffffff" stroke="#cbd5e0" strokeWidth="0.5" />

              {/* Borde exterior del rombo */}
              <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" fill="none" stroke="#2d3748" strokeWidth="2.5" />
              {/* Cruz divisoria */}
              <line x1="50" y1="2" x2="50" y2="98" stroke="#2d3748" strokeWidth="2" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="#2d3748" strokeWidth="2" />

              {/* Números y símbolos */}
              {/* Arriba: Inflamabilidad */}
              <text x="50" y="32" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">
                {section.nfpa.flammability}
              </text>
              {/* Izquierda: Salud */}
              <text x="28" y="55" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="sans-serif">
                {section.nfpa.health}
              </text>
              {/* Derecha: Reactividad */}
              <text x="72" y="55" textAnchor="middle" fill="#1a202c" fontWeight="bold" fontSize="16" fontFamily="sans-serif">
                {section.nfpa.reactivity}
              </text>
              {/* Abajo: Especial (OX) */}
              <text x="50" y="77" textAnchor="middle" fill="#1a202c" fontWeight="bold" fontSize="13" fontFamily="sans-serif">
                {section.nfpa.special}
              </text>
            </svg>
          </div>

          <div className="text-left text-xs space-y-1">
            <div className="font-bold text-[#003440] text-sm">
              Rombo NFPA 704 — {section.nfpa.chemical} ({section.nfpa.formula})
            </div>
            <div className="text-slate-600 font-mono text-[11px]">
              • <strong className="text-blue-600">Azul (Salud):</strong> {section.nfpa.health} (Riesgo alto / mortal en exposición)
            </div>
            <div className="text-slate-600 font-mono text-[11px]">
              • <strong className="text-rose-600">Rojo (Inflamabilidad):</strong> {section.nfpa.flammability} (No combustible)
            </div>
            <div className="text-slate-600 font-mono text-[11px]">
              • <strong className="text-amber-600">Amarillo (Reactividad):</strong> {section.nfpa.reactivity} (Inestable al calor/humedad)
            </div>
            <div className="text-slate-600 font-mono text-[11px]">
              • <strong className="text-slate-800">Blanco (Especial):</strong> {section.nfpa.special} (Agente Oxidante Fuerte)
            </div>
          </div>
        </div>
      )}

      {/* Flujogramas o cajas secuenciales */}
      {section.diagram && (
        <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          {section.diagram.type === 'flow' ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
              {section.diagram.items.map((it, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-1.5 rounded-lg bg-white border border-cyan-300 font-bold text-[#004e5f] shadow-2xs text-center">
                    {it}
                  </div>
                  {idx < section.diagram!.items.length - 1 && (
                    <span className="material-symbols-outlined text-[#00b4d8] text-[16px]">
                      arrow_forward
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
              {section.diagram.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                >
                  {it}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

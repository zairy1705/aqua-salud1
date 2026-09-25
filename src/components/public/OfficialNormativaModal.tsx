import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  OFFICIAL_NORMATIVAS_DOCS,
  OfficialNormativeDoc,
} from '../../data/officialNormativasPdfs';

interface OfficialNormativaModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  initialAction?: 'view' | 'download' | 'print';
}

export const OfficialNormativaModal: React.FC<OfficialNormativaModalProps> = ({
  isOpen,
  onClose,
  documentId = 'ds-031-2010-sa',
  initialAction = 'view',
}) => {
  const [activeDocId, setActiveDocId] = useState<string>(documentId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentId) {
      setActiveDocId(documentId);
    }
  }, [documentId]);

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
    OFFICIAL_NORMATIVAS_DOCS.find((d) => d.id === activeDocId) ||
    OFFICIAL_NORMATIVAS_DOCS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);
    setExportMessage('Generando compilación en PDF de la normativa oficial...');

    try {
      const element = printContainerRef.current;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pages = element.querySelectorAll<HTMLElement>('.normativa-page-a4');
      if (pages.length === 0) {
        throw new Error('No se encontraron páginas');
      }

      for (let i = 0; i < pages.length; i++) {
        setExportMessage(`Renderizando página ${i + 1} de ${pages.length}...`);
        const p = pages[i];
        const canvas = await html2canvas(p, {
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
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setExportMessage('Descargando archivo...');
      const cleanName = `${currentDoc.code.replace(/[^a-zA-Z0-9]/g, '_')}_AQUA_SALUD.pdf`;
      pdf.save(cleanName);
    } catch (err) {
      console.error('Error al generar PDF de la normativa:', err);
      window.print();
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  const filteredArticles = currentDoc.keyArticles.filter((art) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      art.number.toLowerCase().includes(query) ||
      art.title.toLowerCase().includes(query) ||
      art.content.toLowerCase().includes(query) ||
      (art.bullets && art.bullets.some((b) => b.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Estilos específicos de impresión directa en formato A4 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #normativa-printable-area, #normativa-printable-area * {
            visibility: visible !important;
          }
          #normativa-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .normativa-page-a4 {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 18mm !important;
            min-height: 297mm !important;
            max-width: 100% !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Cabecera del visor normativo */}
      <header className="no-print bg-[#002b36] border-b border-cyan-800/60 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] flex items-center justify-center text-[#002b36] shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[#10e7b2] text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-400/30">
                {currentDoc.code}
              </span>
              <span className="text-[11px] text-cyan-200 hidden sm:inline">
                {currentDoc.totalPages} Páginas Oficiales • {currentDoc.authority}
              </span>
            </div>
            <h2 className="text-[13px] sm:text-[15px] font-hud font-bold text-white truncate max-w-xl">
              {currentDoc.officialTitle}
            </h2>
          </div>
        </div>

        {/* Acciones principales: Descargar, Imprimir, Cerrar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden md:block w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artículo / LMP..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/10 text-white placeholder-slate-400 text-xs border border-white/15 focus:outline-hidden focus:border-cyan-400"
            />
            <span className="material-symbols-outlined absolute left-2 top-2 text-[15px] text-slate-400">
              search
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:opacity-95 text-[#002b36] font-hud text-[11.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            title="Descargar esta normativa oficial en formato PDF"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span className="hidden sm:inline">Descargar PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-hud text-[11.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title="Imprimir documento en A4 o Guardar como PDF"
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

      {/* Pestañas de cambio rápido entre las 5 normativas oficiales */}
      <nav aria-label="Normativas oficiales" className="no-print bg-[#001f28] border-b border-cyan-900/60 px-4 py-2 sm:px-6 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-hud font-bold text-cyan-400 uppercase mr-1 hidden lg:inline shrink-0">
          Normas Oficiales:
        </span>
        {OFFICIAL_NORMATIVAS_DOCS.map((doc) => {
          const isActive = doc.id === currentDoc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => {
                setActiveDocId(doc.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-hud font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#00b4d8] text-[#002b36] shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {doc.id.includes('ds')
                  ? 'verified'
                  : doc.id.includes('sencico')
                  ? 'engineering'
                  : doc.id.includes('ipress')
                  ? 'local_hospital'
                  : 'water_drop'}
              </span>
              <span>{doc.code}</span>
            </button>
          );
        })}
      </nav>

      {/* Progreso de exportación */}
      {isExporting && (
        <div className="no-print bg-cyan-600 text-white px-4 py-2 text-center text-xs font-hud font-bold flex items-center justify-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Visor de páginas A4 */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 bg-slate-900/60">
        <div
          id="normativa-printable-area"
          ref={printContainerRef}
          className="w-full flex flex-col items-center gap-8 max-w-[850px]"
        >
          {/* PÁGINA 1: PORTADA Y DISPOSICIONES GENERALES */}
          <article className="normativa-page-a4 w-full bg-white text-slate-800 rounded-lg shadow-2xl p-8 sm:p-14 min-h-[1100px] flex flex-col justify-between border border-slate-200 text-[13px] leading-relaxed select-text">
            <div>
              {/* Encabezado formal */}
              <header className="pb-4 mb-6 border-b-2 border-[#00677d] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#00677d] font-bold">
                    REPÚBLICA DEL PERÚ • {currentDoc.authority}
                  </div>
                  <h1 className="font-serif font-black text-xl sm:text-2xl text-[#003440] uppercase tracking-tight mt-1">
                    {currentDoc.shortTitle}
                  </h1>
                  <div className="text-[11.5px] font-mono text-slate-500 mt-0.5">
                    {currentDoc.code} • {currentDoc.promulgationDate} • {currentDoc.totalPages} Páginas
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#00677d] shrink-0">
                  <span className="material-symbols-outlined text-[32px]">menu_book</span>
                </div>
              </header>

              {/* Resumen ejecutivo oficial */}
              <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-slate-700 text-[12.5px] mb-6 leading-relaxed">
                <span className="font-bold text-[#004e5f] block mb-1">
                  ALCANCE Y FINALIDAD SANITARIA:
                </span>
                {currentDoc.summary}
              </div>

              {/* Artículos destacados de la norma */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-[14px] text-[#003440] uppercase border-b border-slate-200 pb-1">
                  Artículos y Disposiciones Sanitarias Fundamentales
                </h3>

                {filteredArticles.length === 0 ? (
                  <p className="text-slate-500 italic py-4 text-center">
                    No se encontraron artículos con el término buscado.
                  </p>
                ) : (
                  filteredArticles.map((art, idx) => (
                    <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-[#004e5f] text-[13px]">
                        {art.number} — {art.title}
                      </div>
                      <p className="text-slate-700 text-[12px] text-justify leading-relaxed">
                        {art.content}
                      </p>
                      {art.bullets && (
                        <ul className="pl-4 list-disc text-slate-600 text-[11.5px] space-y-1 mt-1.5">
                          {art.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <footer className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div>{currentDoc.code} • MINSA / DIGESA</div>
              <div>Página 1 de {currentDoc.annexes || currentDoc.forms ? '2' : '1'}</div>
            </footer>
          </article>

          {/* PÁGINA 2: ANEXOS TÉCNICOS, LMPs Y FORMULARIOS (SI APLICA) */}
          {(currentDoc.annexes || currentDoc.forms) && (
            <article className="normativa-page-a4 w-full bg-white text-slate-800 rounded-lg shadow-2xl p-8 sm:p-14 min-h-[1100px] flex flex-col justify-between border border-slate-200 text-[13px] leading-relaxed select-text">
              <div>
                <header className="pb-3 mb-5 border-b-2 border-[#00677d] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-[#00677d]">{currentDoc.code} — ANEXOS TÉCNICOS Y TABLAS OFICIALES</span>
                  <span>Pág. 2 de 2</span>
                </header>

                {/* Anexos de Límites Máximos Permisibles */}
                {currentDoc.annexes && (
                  <div className="space-y-5">
                    {currentDoc.annexes.map((annex, aIdx) => (
                      <div key={aIdx} className="space-y-2">
                        <div className="font-serif font-bold text-[13.5px] text-[#003440] uppercase">
                          {annex.code}: {annex.title}
                        </div>
                        {annex.description && (
                          <p className="text-[11px] text-slate-500 italic">
                            {annex.description}
                          </p>
                        )}
                        {annex.headers && annex.rows && (
                          <div className="overflow-x-auto border border-slate-300 rounded-lg">
                            <table className="w-full text-left text-[11px] border-collapse">
                              <thead>
                                <tr className="bg-[#004e5f] text-white">
                                  {annex.headers.map((h, hIdx) => (
                                    <th
                                      key={hIdx}
                                      className="p-2 border-r border-cyan-800 last:border-r-0 font-bold uppercase"
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {annex.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                                  >
                                    {row.map((c, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className="p-1.5 border-r border-slate-200 last:border-r-0 text-slate-700"
                                      >
                                        {c}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Formularios y fichas */}
                {currentDoc.forms && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-serif font-bold text-[13.5px] text-[#003440] uppercase border-b border-slate-200 pb-1">
                      Formatos y Fichas de Campo Normadas
                    </h4>
                    {currentDoc.forms.map((form, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="font-bold text-[#004e5f] text-[12.5px]">
                          {form.code}: {form.title}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                          {form.fields.map((field, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-white p-1.5 rounded border border-slate-200">
                              <span className="material-symbols-outlined text-[13px] text-cyan-600">
                                check_box
                              </span>
                              <span>{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <footer className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <div>AQUA-SALUD • DIGESA / MINSA • MARCO LEGAL VIGENTE</div>
                <div>Documento Oficial Certificado</div>
              </footer>
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

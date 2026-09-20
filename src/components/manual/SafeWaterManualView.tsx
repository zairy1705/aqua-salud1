import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { GlassTitlePanel } from '../GlassTitlePanel';

interface SafeWaterManualViewProps {
  onNavigateToDosage?: () => void;
  onNavigateToSystems?: () => void;
}

export const SafeWaterManualView: React.FC<SafeWaterManualViewProps> = ({
  onNavigateToDosage,
  onNavigateToSystems,
}) => {
  const [activeSection, setActiveSection] = useState<
    'all' | 'basics' | 'cloracion' | 'dpd' | 'limpieza' | 'normativa'
  >('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const manualRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!manualRef.current) return;
    setIsGeneratingPdf(true);
    setPdfProgress('Preparando manual didáctico...');

    try {
      const element = manualRef.current;
      const prevSection = activeSection;
      setActiveSection('all');
      await new Promise((r) => setTimeout(r, 200));

      setPdfProgress('Generando páginas en alta definición...');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      setPdfProgress('Compilando archivo PDF formato A4...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Manual_Agua_Segura_AQUA_SALUD_${new Date().toISOString().split('T')[0]}.pdf`);
      setActiveSection(prevSection);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Glassmorphism Title Panel */}
      <GlassTitlePanel
        badge="FASE 6 • GUÍA OFICIAL DE CAMPO • D.S. N.° 031-2010-SA"
        icon="menu_book"
        title="MANUALES DE AYUDA • CONSUMO DE AGUA SEGURA"
        subtitle="Pautas técnicas, operativas y comunitarias para garantizar la desinfección, el control de cloro residual y la inocuidad del agua para el consumo humano en comunidades y sistemas rurales."
        stats={[
          {
            label: 'ESTÁNDAR CLORO RESIDUAL',
            value: '≥ 0.5 mg/L',
            subtext: 'Límite legal en grifo',
          },
          {
            label: 'NORMATIVA APLICABLE',
            value: 'D.S. 031',
            subtext: 'Reglamento DIGESA / MINSA',
          },
          {
            label: 'MÉTODO DE ANÁLISIS',
            value: 'DPD-1',
            subtext: 'Colorimetría en campo',
          },
          {
            label: 'FRECUENCIA LIMPIEZA',
            value: '2 veces/año',
            subtext: 'Desinfección de reservorios',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="glass-option-btn-primary text-xs sm:text-sm font-black uppercase tracking-wider disabled:opacity-50"
              title="Descargar versión completa para imprimir o consultar sin internet"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>{isGeneratingPdf ? 'GENERANDO PDF...' : 'DESCARGAR INSTRUCTIVO PDF'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="glass-option-btn text-xs font-black uppercase tracking-wider"
              title="Imprimir guía rápida"
            >
              <span className="material-symbols-outlined text-[17px]">print</span>
              <span>IMPRIMIR GUÍA</span>
            </button>
          </div>
        }
      />

      {isGeneratingPdf && (
        <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-[#00677d] font-bold flex items-center gap-2 animate-pulse">
          <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
          <span>{pdfProgress}</span>
        </div>
      )}

      {/* Barra de Filtros de Secciones con Estilo Glassmorphism */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 glass-title-panel rounded-2xl scrollbar-none">
        {[
          { id: 'all', label: '📖 TODO EL MANUAL', icon: 'menu_book' },
          { id: 'basics', label: '💧 CONSUMO DE AGUA SEGURA', icon: 'water_drop' },
          { id: 'cloracion', label: '⚖️ PASOS DE CLORACIÓN', icon: 'calculate' },
          { id: 'dpd', label: '🔬 MEDICIÓN CON DPD-1', icon: 'colorize' },
          { id: 'limpieza', label: '🚰 LIMPIEZA DE RESERVORIOS', icon: 'cleaning_services' },
          { id: 'normativa', label: '📜 NORMATIVA D.S. 031', icon: 'gavel' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSection === sec.id
                ? 'glass-option-btn-primary'
                : 'glass-option-btn'
            }`}
          >
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Contenedor del Contenido Didáctico */}
      <div ref={manualRef} className="space-y-6">
        {/* SECCIÓN 1: CONSUMO DE AGUA SEGURA EN EL HOGAR */}
        {(activeSection === 'all' || activeSection === 'basics') && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#00677d] border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl text-[#00b4d8]">verified</span>
              <div>
                <h3 className="font-hud font-black text-base text-[#003440] uppercase">
                  1. ¿Qué es Agua Segura y por qué es vital para la salud?
                </h3>
                <p className="text-xs text-slate-500">
                  Fundamentos de inocuidad y prevención sanitaria para familias y operadores JASS
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#00677d]">
                  <span className="material-symbols-outlined text-base">health_and_safety</span>
                  <span>Protección contra Enfermedades</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  El agua sin cloro puede contener bacterias (como <em>Escherichia coli</em>), virus y parásitos que causan Enfermedades Diarreicas Agudas (EDA), anemia y desnutrición crónica en niños menores de 5 años.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-teal-800">
                  <span className="material-symbols-outlined text-base">shield</span>
                  <span>Efecto Protector Residual</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  El cloro residual libre (mínimo <strong>0.5 mg/L</strong> en el grifo más alejado) garantiza que el agua se mantenga desinfectada durante su recorrido por las tuberías y dentro de los recipientes domiciliarios.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <span className="material-symbols-outlined text-base">home</span>
                  <span>Higiene en el Hogar</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  Almacenar el agua en recipientes limpios, con tapa hermética y caño para evitar meter las manos o jarras contaminadas. Lavarse las manos con agua y jabón antes de cocinar y comer.
                </p>
              </div>
            </div>

            {/* Buenas Prácticas Comunales */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <h4 className="font-hud font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                <span>Decálogo de Agua Segura para las Familias:</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11.5px]">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#00677d]">1.</span>
                  <span>Consumir siempre agua de la red pública clorada por la JASS.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#00677d]">2.</span>
                  <span>Lavar y desinfectar los baldes y tachos familiares cada semana.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#00677d]">3.</span>
                  <span>Mantener los recipientes tapados y alejados de animales y polvo.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#00677d]">4.</span>
                  <span>Si el agua sale turbia o sin cloro, hervirla durante 1 minuto a borbotones.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: PASOS DE CLORACIÓN Y DOSIFICACIÓN */}
        {(activeSection === 'all' || activeSection === 'cloracion') && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#00677d]">
                <span className="material-symbols-outlined text-2xl text-[#00b4d8]">calculate</span>
                <div>
                  <h3 className="font-hud font-black text-base text-[#003440] uppercase">
                    2. Procedimiento Oficial de Cloración por Goteo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preparación de solución madre con hipoclorito de calcio al 65-70%
                  </p>
                </div>
              </div>

              {onNavigateToDosage && (
                <button
                  type="button"
                  onClick={onNavigateToDosage}
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-200 text-xs font-hud font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir Calculadora</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-[#00677d] text-white font-bold flex items-center justify-center text-xs mb-2">
                    1
                  </span>
                  <h5 className="font-bold text-slate-800 text-xs">Aforar el Caudal</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Medir con un balde graduado y cronómetro el caudal de ingreso al reservorio en litros por segundo (L/s).
                  </p>
                </div>
                <div className="mt-3 p-1.5 bg-cyan-50 text-[10.5px] font-mono text-[#00677d] rounded-lg">
                  Q = Volumen / Tiempo
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-[#00677d] text-white font-bold flex items-center justify-center text-xs mb-2">
                    2
                  </span>
                  <h5 className="font-bold text-slate-800 text-xs">Pesar el Hipoclorito</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Calcular la cantidad requerida para el volumen del tanque de solución según los días de recarga (7 o 15 días).
                  </p>
                </div>
                <div className="mt-3 p-1.5 bg-cyan-50 text-[10.5px] font-mono text-[#00677d] rounded-lg">
                  Usar guantes y mascarilla
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-[#00677d] text-white font-bold flex items-center justify-center text-xs mb-2">
                    3
                  </span>
                  <h5 className="font-bold text-slate-800 text-xs">Diluir y Sedimentar</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Disolver primero en un balde con agua limpia. Dejar reposar 4-6 horas para que la cal decante en el fondo.
                  </p>
                </div>
                <div className="mt-3 p-1.5 bg-cyan-50 text-[10.5px] font-mono text-[#00677d] rounded-lg">
                  Verter solo líquido claro
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-[#00677d] text-white font-bold flex items-center justify-center text-xs mb-2">
                    4
                  </span>
                  <h5 className="font-bold text-slate-800 text-xs">Calibrar el Gotero</h5>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Ajustar la llave de paso o gotero de la cámara para que dosifique el flujo exacto de solución en ml/minuto.
                  </p>
                </div>
                <div className="mt-3 p-1.5 bg-cyan-50 text-[10.5px] font-mono text-[#00677d] rounded-lg">
                  Medir cloro residual a las 2h
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: MEDICIÓN CON PASTILLAS DPD-1 */}
        {(activeSection === 'all' || activeSection === 'dpd') && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#00677d] border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl text-[#00b4d8]">colorize</span>
              <div>
                <h3 className="font-hud font-black text-base text-[#003440] uppercase">
                  3. Medición Diaria de Cloro Residual con DPD-1
                </h3>
                <p className="text-xs text-slate-500">
                  Protocolo colorimétrico para el operador JASS en los 3 puntos de muestreo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 text-xs text-slate-700">
                <h5 className="font-hud font-bold text-slate-900 uppercase tracking-tight">
                  Puntos de Medición Obligatorios:
                </h5>
                <div className="space-y-2 text-[11.5px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <span className="material-symbols-outlined text-cyan-600 text-base mt-0.5">water</span>
                    <div>
                      <strong>Punto 1: Primer Grifo de la Red:</strong>
                      <p className="text-slate-500">Verifica la concentración inicial al salir del reservorio (óptimo 1.0 - 1.5 ppm).</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <span className="material-symbols-outlined text-cyan-600 text-base mt-0.5">home</span>
                    <div>
                      <strong>Punto 2: Grifo Intermedio / Escuela / Centro de Salud:</strong>
                      <p className="text-slate-500">Control en puntos de alta afluencia infantil y comunitaria.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <span className="material-symbols-outlined text-cyan-600 text-base mt-0.5">share_location</span>
                    <div>
                      <strong>Punto 3: Grifo Más Alejado de la Red:</strong>
                      <p className="text-slate-500">Punto crítico. Debe tener como mínimo <strong>0.5 mg/L</strong> para certificar agua segura.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escala Visual Colorimétrica */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-hud font-bold text-slate-900 text-xs uppercase tracking-tight">
                  Escala de Interpretación DPD-1 (D.S. 031):
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-400" />
                      <span className="font-bold">0.0 - 0.4 mg/L</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                      🔴 RIESGO (Sub-clorado)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-pink-400 border border-pink-500" />
                      <span className="font-bold">0.5 - 2.0 mg/L</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                      🟢 ÓPTIMO / AGUA SEGURA
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-fuchsia-600 border border-fuchsia-700" />
                      <span className="font-bold">&gt; 5.0 mg/L</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                      ⚠️ EXCESO (Regule gotero)
                    </span>
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 italic mt-2">
                  *Dejar correr el agua del grifo por 1 minuto antes de tomar la muestra en el tubo comparador.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 4: LIMPIEZA Y DESINFECCIÓN DE RESERVORIOS */}
        {(activeSection === 'all' || activeSection === 'limpieza') && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#00677d] border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl text-[#00b4d8]">cleaning_services</span>
              <div>
                <h3 className="font-hud font-black text-base text-[#003440] uppercase">
                  4. Limpieza y Desinfección Periódica del Reservorio
                </h3>
                <p className="text-xs text-slate-500">
                  Mantenimiento semestral obligatorio (mínimo 2 veces al año)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#00677d] block text-[12px]">Paso 1: Vaciado y Lavado</span>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Cerrar la válvula de entrada. Abrir desagüe y limpiar paredes y piso con escobilla plástica (no metálica) y agua a presión para retirar sedimentos.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#00677d] block text-[12px]">Paso 2: Desinfección de Choque</span>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Preparar solución concentrada de hipoclorito a <strong>150 - 200 mg/L</strong>. Escobillar paredes y accesorios internos y dejar actuar durante 2 a 4 horas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[#00677d] block text-[12px]">Paso 3: Enjuague y Llenado</span>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Abrir la válvula de desagüe para botar toda el agua con cloro concentrado. Enjuagar abundantemente con agua limpia antes de iniciar la cloración de servicio.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 5: NORMATIVA D.S. N.° 031-2010-SA */}
        {(activeSection === 'all' || activeSection === 'normativa') && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#00677d] border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-2xl text-[#00b4d8]">gavel</span>
              <div>
                <h3 className="font-hud font-black text-base text-[#003440] uppercase">
                  5. Límites Máximos Permisibles Oficiales (D.S. N.° 031-2010-SA)
                </h3>
                <p className="text-xs text-slate-500">
                  Reglamento de la Calidad del Agua para Consumo Humano en el Perú
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-[#003d4c] text-white font-hud text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Parámetro Sanitario</th>
                    <th className="p-2.5">Límite Máximo Permisible (LMP)</th>
                    <th className="p-2.5">Impacto en la Salud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11.5px] text-slate-700">
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold">Cloro Residual Libre</td>
                    <td className="p-2.5 text-[#00677d] font-bold">0.5 - 5.0 mg/L</td>
                    <td className="p-2.5">Garantiza desinfección frente a coliformes y patógenos.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 font-bold">pH</td>
                    <td className="p-2.5 font-bold">6.5 a 8.5</td>
                    <td className="p-2.5">Evita corrosión de tuberías y optimiza la eficacia del cloro.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold">Turbiedad</td>
                    <td className="p-2.5 font-bold">Menor a 5.0 UNT</td>
                    <td className="p-2.5">El agua turbia protege a las bacterias frente al cloro.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 font-bold">Coliformes Totales / E. coli</td>
                    <td className="p-2.5 text-red-600 font-bold">0 UFC / 100 mL</td>
                    <td className="p-2.5">Ausencia total obligatoria. Indicador de contaminación fecal.</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold">Arsénico (As)</td>
                    <td className="p-2.5 font-bold">0.010 mg/L</td>
                    <td className="p-2.5">Metal tóxico acumulativo; causa hidroarsenicismo crónico.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 font-bold">Plomo (Pb)</td>
                    <td className="p-2.5 font-bold">0.010 mg/L</td>
                    <td className="p-2.5">Causa saturnismo y daño en el neurodesarrollo infantil.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

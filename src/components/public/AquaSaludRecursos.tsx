import React, { useState } from 'react';
import { OFFICIAL_INSTRUCTIVOS_PDFS } from '../../data/officialInstructivosPdfs';
import { InstructivoPdfModal } from './InstructivoPdfModal';
import { OFFICIAL_NORMATIVAS_DOCS } from '../../data/officialNormativasPdfs';
import { OfficialNormativaModal } from './OfficialNormativaModal';
import { DiapositivaEducativaModal } from './DiapositivaEducativaModal';

interface AquaSaludRecursosProps {
  onOpenUserManual: () => void;
  onOpenNormative: () => void;
}

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  keyPoints: string[];
  operationalRule: string;
  icon: string;
}

interface EducationalVideo {
  id: string;
  title: string;
  topic: string;
  duration: string;
  videoSrc: string;
  poster: string;
  desc: string;
  keySteps: string[];
}

export const AquaSaludRecursos: React.FC<AquaSaludRecursosProps> = ({
  onOpenUserManual,
  onOpenNormative,
}) => {
  // Modal states for Diapositivas & Videos Educativos
  const [isSlidesModalOpen, setIsSlidesModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string>('video-dpd');

  // Estados para Instructivos Oficiales PDF (Abrir, Descargar, Imprimir)
  const [selectedInstructivoId, setSelectedInstructivoId] = useState<string | null>(null);
  const [instructivoAction, setInstructivoAction] = useState<'view' | 'download' | 'print'>('view');

  const handleOpenPdf = (docId: string, action: 'view' | 'download' | 'print' = 'view') => {
    setSelectedInstructivoId(docId);
    setInstructivoAction(action);
  };

  // Estados para Normativas Oficiales PDF (D.S. 031-2010-SA y Conexas: Abrir, Descargar, Imprimir)
  const [selectedNormativaId, setSelectedNormativaId] = useState<string | null>(null);
  const [normativaAction, setNormativaAction] = useState<'view' | 'download' | 'print'>('view');

  const handleOpenNormativa = (docId: string, action: 'view' | 'download' | 'print' = 'view') => {
    setSelectedNormativaId(docId);
    setNormativaAction(action);
  };

  // Estados para Diapositiva Educativa Oficial (Abrir, Descargar, Imprimir)
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideAction, setSlideAction] = useState<'view' | 'download' | 'print'>('view');

  const handleOpenSlide = (action: 'view' | 'download' | 'print' = 'view') => {
    setSlideAction(action);
    setIsSlideModalOpen(true);
  };

  // Datos pedagógicos para Diapositivas de Capacitación
  const slidesData: SlideItem[] = [
    {
      id: 1,
      title: 'Módulo 1: El Derecho al Agua Segura y la Función de la JASS',
      subtitle: 'Fortalecimiento de la Gestión Comunal de los Servicios de Saneamiento',
      category: 'Gobernanza Comunal',
      icon: 'groups',
      operationalRule: 'Art. 13 D.S. N.° 031-2010-SA: Todo prestador de servicios de agua debe garantizar agua apta para consumo en todo momento.',
      keyPoints: [
        'Diferencia técnica vital entre agua cruda (entubada) y agua potable desinfectada.',
        'Rol de la directiva de la JASS: presidente, tesorero, secretario y fiscal en la vigilancia del servicio.',
        'Articulación obligatoria con el Área Técnica Municipal (ATM) y la Microred de Salud para supervisión.',
        'Rendición de cuentas periódica y sostenibilidad de la cuota familiar para insumos químicos.',
      ],
    },
    {
      id: 2,
      title: 'Módulo 2: Barrera Sanitaria y Dinámica del Cloro Residual',
      subtitle: 'Parámetros Sanitarios en Red de Distribución según D.S. N.° 031-2010-SA',
      category: 'Calidad & Salud',
      icon: 'science',
      operationalRule: 'Límite Normativo: Entre 0.5 mg/L y 2.0 mg/L de cloro libre residual en el 100% de puntos de la red domiciliaria.',
      keyPoints: [
        'Destrucción de bacterias patógenas, coliformes termotolerantes y virus mediante oxidación química.',
        'El tiempo mínimo de contacto del cloro con el agua en el reservorio debe ser de al menos 30 minutos.',
        'Prevención de enfermedades diarreicas agudas (EDA), parasitosis y desnutrición crónica infantil.',
        'El pH del agua debe mantenerse en el rango de 6.5 a 8.5 para garantizar la eficacia del ácido hipocloroso (HOCl).',
      ],
    },
    {
      id: 3,
      title: 'Módulo 3: Sistemas de Cloración por Goteo y Aforo de Caudales',
      subtitle: 'Operación Técnica del Tanque de Carga Constante y Cámara de Regulación',
      category: 'Operación Hidráulica',
      icon: 'water_drop',
      operationalRule: 'Norma Técnica OS.020: La dosificación debe calibrarse acorde al caudal de ingreso (Q en L/s) en la época seca y de lluvia.',
      keyPoints: [
        'Aforo volumétrico del caudal de ingreso al reservorio utilizando recipiente graduado y cronómetro.',
        'Cálculo de la masa exacta de hipoclorito de calcio al 65-70% según el volumen del reservorio y tiempo de recarga.',
        'Regulación milimétrica de la válvula de goteo o aguja para mantener el número de gotas por minuto requerido.',
        'Purga y limpieza del sedimentador de la solución madre para evitar obstrucciones por sarro calcáreo.',
      ],
    },
    {
      id: 4,
      title: 'Módulo 4: Protocolo Oficial de Muestreo Colorimétrico (DPD-1)',
      subtitle: 'Vigilancia Diaria en Puntos Críticos: Reservorio, Primera y Última Vivienda',
      category: 'Control de Calidad',
      icon: 'colorize',
      operationalRule: 'Directiva Sanitaria DIGESA: Registrar lecturas diarias de cloro libre y turbidez en el cuaderno de campo.',
      keyPoints: [
        'Purgar el grifo domiciliario durante 1 a 2 minutos antes de recolectar la alícuota de agua.',
        'Enjuagar la celda comparadora tres veces con el agua a analizar antes de colocar la pastilla DPD-1.',
        'Disolver completamente la tableta DPD-1 sin tocarla con los dedos para evitar contaminación.',
        'Comparar visualmente contra el disco patrón dentro de los primeros 60 segundos bajo luz natural indirecta.',
      ],
    },
    {
      id: 5,
      title: 'Módulo 5: Bioseguridad y Manejo Seguro de Insumos Químicos',
      subtitle: 'Equipos de Protección Personal (EPP) y Primeros Auxilios en Caseta de Cloración',
      category: 'Seguridad y Salud',
      icon: 'security',
      operationalRule: 'Ficha Técnica MSDS: El hipoclorito es un oxidante enérgico que debe almacenarse en lugar seco, fresco y ventilado.',
      keyPoints: [
        'Uso obligatorio de EPP: guantes de nitrilo, mascarilla para vapores químicos/polvo, gafas y delantal impermeable.',
        'Prohibido mezclar hipoclorito de calcio con ácidos, aceites, combustibles o materia orgánica inflamable.',
        'Almacenar los baldes plásticos cerrados sobre parihuelas de madera, protegidos del sol directo y la humedad.',
        'Protocolo ante salpicaduras accidentales: lavado inmediato con abundante agua corriente durante 15 minutos.',
      ],
    },
    {
      id: 6,
      title: 'Módulo 6: Limpieza y Desinfección Sanitaria de Reservorios',
      subtitle: 'Procedimiento Semestral de Lavado, Refregado y Cloración de Choque',
      category: 'Mantenimiento Preventivo',
      icon: 'cleaning_services',
      operationalRule: 'Guía Técnica MVCS: Realizar desinfección preventiva del reservorio al menos 2 veces al año o tras emergencias.',
      keyPoints: [
        'Coordinación previa con la comunidad comunicando el corte temporal del servicio para el mantenimiento.',
        'Vaciado y remoción mecánica de sedimentos y lodos del fondo utilizando escobillas plásticas de cerda dura.',
        'Preparación de solución concentrada para desinfección de paredes y losa de fondo (150 a 200 mg/L de cloro).',
        'Enjuague exhaustivo y eliminación del agua de lavado por la tubería de purga antes de reiniciar el llenado normal.',
      ],
    },
  ];

  // Videos educativos reales disponibles en la plataforma
  const educationalVideos: EducationalVideo[] = [
    {
      id: 'video-dpd',
      title: 'Medición de Cloro Residual Libre con Pastilla DPD-1 y Fotómetro',
      topic: 'Control Analítico',
      duration: '0:35 min • HD',
      videoSrc: '/cloragua_video_photometer.mp4',
      poster: '/cloragua_photometer_chemist.jpg',
      desc: 'Demostración técnica del procedimiento de lectura colorimétrica y fotométrica en laboratorio y campo para asegurar valores entre 0.5 y 2.0 mg/L según normativa.',
      keySteps: [
        'Toma de muestra en probeta graduada',
        'Disolución de tableta reactiva DPD-1',
        'Lectura de absorbancia e interpretación digital',
      ],
    },
    {
      id: 'video-columna',
      title: 'Operación de la Columna de Purificación y Desinfección',
      topic: 'Tecnología Hidráulica',
      duration: '0:30 min • HD',
      videoSrc: '/cloragua_video_column.mp4',
      poster: '/cloragua_purification_column.jpg',
      desc: 'Inspección de las columnas de contacto y filtración para remoción de turbidez y acondicionamiento previo a la dosificación de cloro desinfectante.',
      keySteps: [
        'Verificación de presión y manómetros',
        'Filtración en lecho empacado',
        'Monitoreo del flujo constante de tratamiento',
      ],
    },
    {
      id: 'video-guardian',
      title: 'Protocolo de Asistencia Técnica y Vigilancia Sanitaria en Caseta',
      topic: 'Gestión Operativa',
      duration: '0:32 min • HD',
      videoSrc: '/cloragua_video_guardian.mp4',
      poster: '/cloragua_guardian_greeting.jpg',
      desc: 'Directrices para la inspección periódica de los sistemas de abastecimiento, cuaderno de registro comunal y articulación con el Área Técnica Municipal.',
      keySteps: [
        'Inspección de válvulas y sellos de seguridad',
        'Anotación de caudales y dosificación en registro',
        'Reporte de incidencias y abastecimiento continuo',
      ],
    },
  ];

  const currentSlide = slidesData[currentSlideIndex];
  const activeVideo = educationalVideos.find((v) => v.id === activeVideoId) || educationalVideos[0];

  return (
    <section id="recursos" className="py-14 sm:py-20 bg-gradient-to-b from-white via-cyan-50/25 to-white border-t border-cyan-100/80 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =====================================================================
            ENCABEZADO DE LA SECCIÓN
            ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/70 border border-cyan-200 text-[#00677d] font-hud text-[11px] font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Documentación, Capacitación y Asistencia Técnica</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[36px] text-[#003440] tracking-tight flex items-center justify-center gap-2.5">
            <span>📚</span>
            <span>CENTRO DE RECURSOS</span>
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-relaxed mt-2.5">
            Materiales pedagógicos, marco normativo oficial, presentaciones interactivas y tutoriales audiovisuales para el fortalecimiento de capacidades de fontaneros, JASS y operadores sanitarios.
          </p>
        </div>

        {/* =====================================================================
            REJILLA DE LAS 4 TARJETAS REQUERIDAS:
            1. INSTRUCTIVOS
            2. NORMATIVAS
            3. DIAPOSITIVAS
            4. VIDEOS EDUCATIVOS
            ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* -------------------------------------------------------------------
              TARJETA 1: INSTRUCTIVOS (DOCUMENTOS TÉCNICOS OFICIALES EN PDF)
              ------------------------------------------------------------------- */}
          <div className="p-6 sm:p-7 rounded-3xl border border-cyan-300 bg-gradient-to-br from-cyan-50/70 via-white to-teal-50/40 shadow-[0_10px_28px_rgba(0,103,125,0.08)] flex flex-col justify-between hover:border-cyan-400 hover:shadow-lg transition-all group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#00b4d8] to-[#00677d] text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">menu_book</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#00677d] text-[11px] font-hud font-bold border border-cyan-200 shadow-2xs">
                  Documentos Técnicos Oficiales • 3 Manuales PDF
                </span>
              </div>

              <h3 className="font-hud font-extrabold text-[22px] sm:text-[24px] text-[#003440] mb-2 leading-snug">
                Instructivos
              </h3>
              
              <p className="text-[13.5px] text-[#475569] leading-relaxed mb-5">
                Manuales técnicos y de seguridad normados por el Ministerio de Salud (DIGESA) y el MVCS para la operación, cloración y vigilancia sanitaria en sistemas de agua. Haga clic en cualquiera de los instructivos para abrirlo, descargarlo o imprimirlo.
              </p>

              {/* Lista de los 3 PDFs subidos con sus nombres exactos y acciones directas */}
              <div className="space-y-3.5 mb-6">
                {OFFICIAL_INSTRUCTIVOS_PDFS.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-white/95 border border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all duration-200 group/item flex flex-col justify-between gap-3"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => handleOpenPdf(doc.id, 'view')}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-[#00677d] font-mono text-[10.5px] font-black uppercase">
                          <span className="material-symbols-outlined text-[15px] text-cyan-600">
                            {doc.id === 'cloracion-consumo-humano'
                              ? 'water_drop'
                              : doc.id === 'medicion-cloro-residual'
                              ? 'science'
                              : 'health_and_safety'}
                          </span>
                          {doc.code}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {doc.totalPages} págs • PDF Oficial
                        </span>
                      </div>

                      {/* Nombre oficial del PDF */}
                      <h4 className="font-hud font-black text-[14px] sm:text-[15px] text-[#003440] leading-snug group-hover/item:text-[#00b4d8] transition-colors">
                        {doc.title}
                      </h4>

                      <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
                        {doc.subtitle}
                      </p>
                    </div>

                    {/* Acciones directas: Abrir, Descargar, Imprimir */}
                    <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleOpenPdf(doc.id, 'view')}
                        className="px-3 py-1.5 rounded-lg bg-[#00677d] hover:bg-[#004e5f] text-white font-hud text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
                        title={`Abrir y leer ${doc.title}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Abrir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPdf(doc.id, 'download')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-200 font-hud text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        title={`Descargar ${doc.title} en PDF`}
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Descargar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPdf(doc.id, 'print')}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-hud text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        title={`Imprimir ${doc.title} en tamaño A4`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#10e7b2]">print</span>
                        <span>Imprimir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPdf(OFFICIAL_INSTRUCTIVOS_PDFS[0].id, 'view')}
              className="w-full py-3.5 px-4 rounded-xl font-hud text-[13px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002b1f] shadow-xs hover:shadow-md active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              <span>Abrir Visor de Instructivos Técnicos</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>

          {/* -------------------------------------------------------------------
              TARJETA 2: NORMATIVAS
              ------------------------------------------------------------------- */}
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-cyan-300 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-[#00677d] border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform group-hover:border-cyan-300 group-hover:text-[#087E98]">
                  <span className="material-symbols-outlined text-[26px]">balance</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#00677d] text-[11px] font-hud font-bold border border-slate-200 shadow-2xs">
                  Marco Legal • D.S. N.° 031-2010-SA
                </span>
              </div>

              <h3 className="font-hud font-extrabold text-[20px] sm:text-[22px] text-[#003440] mb-2 leading-snug">
                Marco Normativo y LMPs
              </h3>
              <p className="text-[13.5px] text-[#475569] leading-relaxed mb-4">
                Compendio oficial de la legislación sanitaria peruana e internacional para agua de consumo humano, con los Límites Máximos Permisibles (LMP) actualizados.
              </p>

              {/* Elementos destacados incluidos */}
              <div className="space-y-2 mb-6">
                <div 
                  onClick={() => handleOpenNormativa('ds-031-2010-sa', 'view')}
                  className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 hover:bg-cyan-50/80 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <span className="text-[#087E98] font-bold text-[14px]">⚖</span>
                  <span><strong>D.S. N.° 031-2010-SA (MINSA):</strong> Reglamento de la calidad del agua para consumo humano.</span>
                </div>
                <div 
                  onClick={() => handleOpenNormativa('rd-160-2015-digesa', 'view')}
                  className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 hover:bg-cyan-50/80 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <span className="text-[#087E98] font-bold text-[14px]">⚖</span>
                  <span><strong>R.D. N.° 160-2015/DIGESA/SA:</strong> Protocolo oficial de toma de muestras y cadena de custodia.</span>
                </div>
                <div 
                  onClick={() => handleOpenNormativa('directiva-132-minsa-2021', 'view')}
                  className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 hover:bg-cyan-50/80 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <span className="text-[#087E98] font-bold text-[14px]">⚖</span>
                  <span><strong>Directiva Sanitaria N.° 132 (MINSA):</strong> Vigilancia sanitaria de calidad de agua en IPRESS.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenNormativa('ds-031-2010-sa', 'view')}
              className="w-full py-3 px-4 rounded-xl font-hud text-[12.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer bg-white hover:bg-slate-100 text-[#004e5f] border border-slate-200 shadow-2xs active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">policy</span>
              <span>Consultar Normativas Sanitarias</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* -------------------------------------------------------------------
              TARJETA 3: DIAPOSITIVAS
              ------------------------------------------------------------------- */}
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-cyan-300 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-[#087E98] border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform group-hover:border-cyan-300">
                  <span className="material-symbols-outlined text-[26px]">co_present</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#087E98] text-[11px] font-hud font-bold border border-slate-200 shadow-2xs">
                  Capacitación Comunal • 6 Módulos
                </span>
              </div>

              <h3 className="font-hud font-extrabold text-[20px] sm:text-[22px] text-[#003440] mb-2 leading-snug">
                Diapositivas
              </h3>
              <p className="text-[13.5px] text-[#475569] leading-relaxed mb-4">
                Presentaciones estructuradas para talleres de capacitación a directivos de JASS, asambleas comunales y cursos dictados por Áreas Técnicas Municipales (ATM).
              </p>

              {/* Elementos destacados incluidos */}
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[#00b4d8] font-bold text-[14px]">📊</span>
                  <span><strong>Módulos 1 & 2:</strong> Gobernanza comunal, rol de la JASS y barreras sanitarias del cloro.</span>
                </div>
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[#00b4d8] font-bold text-[14px]">📊</span>
                  <span><strong>Módulos 3 & 4:</strong> Hidráulica de cloración por goteo y muestreo colorimétrico diario.</span>
                </div>
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/90 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[#00b4d8] font-bold text-[14px]">📊</span>
                  <span><strong>Módulos 5 & 6:</strong> Bioseguridad en caseta, manejo de hipoclorito y lavado de reservorios.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleOpenSlide('view')}
                className="flex-1 py-3 px-3 rounded-xl font-hud text-[11.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002b1f] shadow-xs hover:shadow-md active:scale-98"
              >
                <span className="material-symbols-outlined text-[17px]">co_present</span>
                <span>Presentación 28 Diaps</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSlidesModalOpen(true)}
                className="flex-1 py-3 px-3 rounded-xl font-hud text-[11.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white hover:bg-slate-100 text-[#004e5f] border border-slate-200 shadow-2xs active:scale-98"
              >
                <span className="material-symbols-outlined text-[17px]">slideshow</span>
                <span>Módulos JASS</span>
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              TARJETA 4: VIDEOS EDUCATIVOS
              ------------------------------------------------------------------- */}
          <div className="p-6 sm:p-7 rounded-3xl border border-cyan-300 bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/60 shadow-[0_10px_28px_rgba(0,103,125,0.08)] flex flex-col justify-between hover:border-cyan-400 hover:shadow-lg transition-all group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#10B981] to-[#00677d] text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">smart_display</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-[#00677d] text-[11px] font-hud font-bold border border-cyan-200 shadow-2xs">
                  Video HD • Demostración en Vivo
                </span>
              </div>

              <h3 className="font-hud font-extrabold text-[20px] sm:text-[22px] text-[#003440] mb-2 leading-snug">
                Videos Educativos
              </h3>
              <p className="text-[13.5px] text-[#475569] leading-relaxed mb-4">
                Tutoriales audiovisuales grabados en entornos reales de laboratorio y casetas de cloración para visualizar los procedimientos operativos y buenas prácticas.
              </p>

              {/* Elementos destacados incluidos */}
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/80 p-2.5 rounded-xl border border-cyan-100">
                  <span className="text-[#10B981] font-bold text-[14px]">▶</span>
                  <span><strong>Muestreo Fotométrico con DPD-1:</strong> Lectura exacta de concentración y comparación óptica.</span>
                </div>
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/80 p-2.5 rounded-xl border border-cyan-100">
                  <span className="text-[#10B981] font-bold text-[14px]">▶</span>
                  <span><strong>Columna de Purificación & Filtro:</strong> Funcionamiento del tren de tratamiento y desinfección.</span>
                </div>
                <div className="flex items-start gap-2 text-[12.5px] text-[#1e293b] font-medium bg-white/80 p-2.5 rounded-xl border border-cyan-100">
                  <span className="text-[#10B981] font-bold text-[14px]">▶</span>
                  <span><strong>Vigilancia y Cuaderno de Operación:</strong> Rutinas de control en reservorios y redes rurales.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl font-hud text-[12.5px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#10B981] to-[#00b4d8] text-white shadow-xs hover:shadow-md active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Reproducir Videos Educativos</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODAL INTERACTIVO: VISOR DE DIAPOSITIVAS DE CAPACITACIÓN
          ========================================================================= */}
      {isSlidesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-cyan-200">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#003440] via-[#004e5f] to-[#00677d] text-white flex items-center justify-between border-b border-cyan-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#8BE6C2]">
                  <span className="material-symbols-outlined text-[24px]">co_present</span>
                </div>
                <div>
                  <h3 className="font-hud font-bold text-[16px] sm:text-[18px] text-white leading-tight">
                    Diapositivas de Capacitación Sanitaria JASS & ATM
                  </h3>
                  <p className="text-[11.5px] text-cyan-200 font-hud">
                    Módulo pedagógico ilustrado • Diapositiva {currentSlideIndex + 1} de {slidesData.length}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSlidesModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar visor de diapositivas"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Slide Navigation Strip */}
            <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {slidesData.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-hud font-bold transition-all cursor-pointer whitespace-nowrap ${
                      currentSlideIndex === idx
                        ? 'bg-[#00677d] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Módulo {s.id}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-hud text-slate-500 whitespace-nowrap font-medium">
                {currentSlide.category}
              </div>
            </div>

            {/* Slide Body (Presentation Canvas) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#F8FAFC]">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                
                {/* Slide Header Tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#00677d] text-[11px] font-hud font-bold">
                    <span className="material-symbols-outlined text-[15px]">{currentSlide.icon}</span>
                    <span>{currentSlide.category}</span>
                  </div>
                  <span className="text-[12px] font-hud text-slate-400 font-semibold">
                    Diapositiva #{currentSlide.id}
                  </span>
                </div>

                {/* Slide Title */}
                <h4 className="font-hud font-extrabold text-[22px] sm:text-[26px] text-[#003440] leading-snug mb-2">
                  {currentSlide.title}
                </h4>
                <p className="text-[14px] text-[#087E98] font-hud font-semibold mb-6">
                  {currentSlide.subtitle}
                </p>

                {/* Key Points */}
                <div className="space-y-3 mb-6">
                  <h5 className="font-hud font-bold text-[12px] text-slate-400 uppercase tracking-wider">
                    Conceptos Clave del Módulo:
                  </h5>
                  {currentSlide.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-[13.5px] text-[#1e293b] leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Operational Directive Box */}
                <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00677d] text-[22px] shrink-0 mt-0.5">
                    verified
                  </span>
                  <div>
                    <h6 className="font-hud font-bold text-[12px] text-[#003440] uppercase tracking-wide mb-1">
                      Directiva Técnica Obligatoria:
                    </h6>
                    <p className="text-[12.5px] text-[#004e5f] leading-relaxed">
                      {currentSlide.operationalRule}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 rounded-xl text-[12px] font-hud font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">arrow_back</span>
                <span>Anterior</span>
              </button>

              <span className="text-[12px] font-hud text-slate-500 font-semibold">
                {currentSlideIndex + 1} / {slidesData.length}
              </span>

              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1))}
                disabled={currentSlideIndex === slidesData.length - 1}
                className="px-4 py-2 rounded-xl text-[12px] font-hud font-bold bg-[#00677d] text-white hover:bg-[#087E98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>Siguiente</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL INTERACTIVO: REPRODUCTOR DE VIDEOS EDUCATIVOS
          ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-cyan-500/30">
            
            {/* Video Modal Header */}
            <div className="px-5 py-4 bg-slate-950/90 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[#10e7b2] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">smart_display</span>
                </div>
                <div>
                  <h3 className="font-hud font-bold text-[16px] sm:text-[18px] text-white leading-tight">
                    Videoteca Educativa AQUA SALUD
                  </h3>
                  <p className="text-[11.5px] text-cyan-300 font-hud">
                    Tutoriales audiovisuales de capacitación práctica en saneamiento
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar reproductor"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Video Player Canvas + Playlist */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Player & Active Details */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
                  <video
                    key={activeVideo.videoSrc}
                    controls
                    autoPlay
                    playsInline
                    poster={activeVideo.poster}
                    className="w-full h-full object-cover"
                  >
                    <source src={activeVideo.videoSrc} type="video/mp4" />
                    Tu navegador no soporta reproducción de video HTML5.
                  </video>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10.5px] font-hud font-bold border border-cyan-800">
                      {activeVideo.topic}
                    </span>
                    <span className="text-[11px] font-hud text-slate-400">
                      Duración: {activeVideo.duration}
                    </span>
                  </div>
                  <h4 className="font-hud font-bold text-[18px] sm:text-[20px] text-white mb-2 leading-snug">
                    {activeVideo.title}
                  </h4>
                  <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
                    {activeVideo.desc}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
                    <h5 className="font-hud font-bold text-[11px] text-cyan-300 uppercase tracking-wider mb-2">
                      Pasos del Procedimiento Visualizado:
                    </h5>
                    <ul className="space-y-1.5">
                      {activeVideo.keySteps.map((step, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[12px] text-slate-200">
                          <span className="text-[#10e7b2] font-bold">▸</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Video Playlist */}
              <div className="flex flex-col gap-3">
                <h5 className="font-hud font-bold text-[12px] text-slate-400 uppercase tracking-wider">
                  Tutoriales Disponibles ({educationalVideos.length}):
                </h5>

                <div className="space-y-3">
                  {educationalVideos.map((vid) => {
                    const isSelected = vid.id === activeVideoId;
                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                            : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                          <img
                            src={vid.poster}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[20px]">
                              {isSelected ? 'play_arrow' : 'play_circle'}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-hud font-semibold text-cyan-400 truncate">
                              {vid.topic}
                            </span>
                            <span className="text-[9.5px] text-slate-400 shrink-0">
                              {vid.duration}
                            </span>
                          </div>
                          <h6 className="font-hud font-bold text-[12px] text-white line-clamp-2 leading-snug">
                            {vid.title}
                          </h6>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#10e7b2] text-[16px] shrink-0 mt-0.5">
                    verified
                  </span>
                  <span>
                    Material didáctico verificado acorde al D.S. N.° 031-2010-SA y las Guías Técnicas de DIGESA / MVCS.
                  </span>
                </div>
              </div>

            </div>

            {/* Video Modal Footer */}
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11.5px] text-slate-400 font-hud">
                Reproduciendo: <span className="text-white font-medium">{activeVideo.title}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-[11.5px] font-hud font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Visor de Instructivos Oficiales PDF (Abrir, Descargar, Imprimir) */}
      <InstructivoPdfModal
        isOpen={!!selectedInstructivoId}
        onClose={() => setSelectedInstructivoId(null)}
        documentId={selectedInstructivoId || undefined}
        initialAction={instructivoAction}
      />

      {/* Modal Visor de Normativas Oficiales Sanitarias (D.S. 031-2010-SA y Conexas: Abrir, Descargar, Imprimir) */}
      <OfficialNormativaModal
        isOpen={!!selectedNormativaId}
        onClose={() => setSelectedNormativaId(null)}
        documentId={selectedNormativaId || undefined}
        initialAction={normativaAction}
      />

      {/* Modal Diapositiva Educativa Oficial (Abrir, Descargar, Imprimir) */}
      <DiapositivaEducativaModal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
        initialAction={slideAction}
      />

    </section>
  );
};

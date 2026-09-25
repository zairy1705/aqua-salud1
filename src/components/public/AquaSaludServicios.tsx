import React, { useState } from 'react';
import {
  WaterParameterDetail,
  getParametersByCategory,
} from '../../data/waterParametersDetailData';
import { ParameterDetailView } from './ParameterDetailView';

interface AquaSaludServiciosProps {
  onOpenAquaLab?: () => void;
  onOpenAquaMetals?: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

type ServiceKey = 'fisicoquimico' | 'microbiologico' | 'metales';

export const AquaSaludServicios: React.FC<AquaSaludServiciosProps> = ({
  onOpenAquaLab,
  onOpenAquaMetals,
  onOpenQuoteModal,
}) => {
  const [activeTab, setActiveTab] = useState<ServiceKey>('fisicoquimico');
  const [selectedParameter, setSelectedParameter] = useState<WaterParameterDetail | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Enlace oficial de WhatsApp de AQUA SALUD
  const whatsappUrl =
    'https://wa.me/51920221581?text=Hola%20AQUA%20SALUD,%20deseo%20informaci%C3%B3n%20y%20asesor%C3%ADa%20para%20analizar%20muestras%20de%20agua.';

  const mainCards: {
    id: ServiceKey;
    icon: string;
    emoji: string;
    title: string;
    shortDesc: string;
    targetUser?: string;
    colorScheme: {
      activeBorder: string;
      activeBg: string;
      iconColor: string;
      iconBg: string;
      btnActive: string;
      tagColor: string;
      accent: string;
    };
  }[] = [
    {
      id: 'fisicoquimico',
      icon: 'science',
      emoji: '🧪',
      title: 'FISICOQUÍMICO',
      shortDesc: 'Evaluamos las características físicas y químicas del agua: transparencia, sabor, olor, pH y minerales.',
      targetUser: 'Recomendado para juntas vecinales, JASS y hogares',
      colorScheme: {
        activeBorder: 'border-[#087E98]',
        activeBg: 'bg-cyan-50/60',
        iconColor: 'text-[#087E98]',
        iconBg: 'bg-cyan-100/80',
        btnActive: 'bg-[#087E98] text-white',
        tagColor: 'bg-cyan-100 text-[#063B4A]',
        accent: '#087E98',
      },
    },
    {
      id: 'microbiologico',
      icon: 'coronavirus',
      emoji: '🦠',
      title: 'MICROBIOLÓGICO',
      shortDesc: 'Detectamos bacterias e indicadores como E. coli y coliformes para prevenir enfermedades estomacales.',
      targetUser: 'Fundamental para verificar si el agua es apta para beber',
      colorScheme: {
        activeBorder: 'border-[#10b981]',
        activeBg: 'bg-emerald-50/60',
        iconColor: 'text-[#10b981]',
        iconBg: 'bg-emerald-100/80',
        btnActive: 'bg-[#059669] text-white',
        tagColor: 'bg-emerald-100 text-[#065f46]',
        accent: '#10B981',
      },
    },
    {
      id: 'metales',
      icon: 'blur_on',
      emoji: '⚛️',
      title: 'METALES PESADOS',
      shortDesc: 'Análisis de alta precisión para arsénico, plomo, mercurio y cadmio mediante tecnología ICP-MS.',
      targetUser: 'Vital en zonas mineras o con sospecha de fuentes subterráneas',
      colorScheme: {
        activeBorder: 'border-[#063B4A]',
        activeBg: 'bg-sky-50/60',
        iconColor: 'text-[#063B4A]',
        iconBg: 'bg-sky-100/80',
        btnActive: 'bg-[#063B4A] text-white',
        tagColor: 'bg-sky-100 text-[#063B4A]',
        accent: '#063B4A',
      },
    },
  ];

  const servicesInfo = {
    fisicoquimico: {
      title: '🧪 Análisis Fisicoquímico',
      desc: 'Evaluamos parámetros como pH, turbidez, conductividad, temperatura, sólidos disueltos, dureza y aniones.',
      badge: '16 Parámetros Ensayados In Situ y Laboratorio',
      status: 'Disponible con Acreditación Progresiva',
      quoteName: 'Análisis Fisicoquímico D.S. N.° 031-2010-SA',
    },
    microbiologico: {
      title: '🦠 Análisis Microbiológico',
      desc: 'Evaluamos microorganismos e indicadores patógenos de la calidad sanitaria e inocuidad del agua.',
      badge: '5 Ensayos de Biología e Inocuidad Sanitaria',
      status: 'Disponible para JASS y Redes Comunales',
      quoteName: 'Análisis Microbiológico e Inocuidad D.S. N.° 031-2010-SA',
    },
    metales: {
      title: '⚛️ Metales Pesados y Elementos Traza',
      desc: 'Evaluamos elementos tóxicos como arsénico, plomo, cadmio, mercurio, cromo y níquel mediante ICP-MS.',
      badge: '10 Metales Cuantificados por Espectrometría / ICP-MS',
      status: 'FASE 5 • Activo en Plataforma AQUA-METALS',
      quoteName: 'Monitoreo de Metales Pesados (ICP-MS: As, Pb, Cd, Hg, Fe)',
    },
  };

  const currentService = servicesInfo[activeTab];
  const currentParameters = getParametersByCategory(activeTab);

  const handleSelectTab = (key: ServiceKey) => {
    setActiveTab(key);
    // Si estaba viendo un parámetro de otra categoría, cerrar detalle para ver la lista de la nueva categoría
    setSelectedParameter(null);
  };

  const handleOpenDetail = (param: WaterParameterDetail) => {
    setSelectedParameter(param);
  };

  const handleCloseDetail = () => {
    setSelectedParameter(null);
    // Regresar la vista con scroll suave al inicio de servicios
    setTimeout(() => {
      const el = document.getElementById('servicios-parametros');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <section id="servicios" className="relative py-14 sm:py-20 border-t border-cyan-100/60 scroll-mt-20 overflow-hidden">
      {/* =========================================================================
          FONDO DE OLAS DE MAR EN MOVIMIENTO CONTINUO (Referencia Pinterest)
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/servicios_water_waves_poster.jpg"
          className="w-full h-full object-cover object-center scale-105"
        >
          <source src="/servicios_water_waves.mp4" type="video/mp4" />
        </video>
        {/* Velo acuático de luminosidad para preservar contraste y legibilidad óptima de los textos y tarjetas */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/78 to-white/90 backdrop-blur-[1.5px]" />
      </div>

      {/* Contenido en capa z-10 */}
      <div className="relative z-10">
        {/* =========================================================================
            CONDICIONAL: SI HAY UN PARÁMETRO SELECCIONADO, RENDERIZAR LA VISTA DE DETALLE
            COMO UNA NUEVA HOJA/PANTALLA INTEGRADA DENTRO DE AQUA SALUD
            ========================================================================= */}
        {selectedParameter ? (
          <ParameterDetailView
            parameter={selectedParameter}
            onBack={handleCloseDetail}
            onOpenQuoteModal={onOpenQuoteModal}
          />
        ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* =====================================================================
              1. ENCABEZADO AMIGABLE, CLARO Y CON IDENTIDAD DE MARCA
              ===================================================================== */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 via-white to-emerald-50 border border-cyan-200/90 text-[#087E98] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <span className="material-symbols-outlined text-[17px] text-[#10B981]">water_drop</span>
              <span>CUIDAMOS EL AGUA QUE CONSUME TU COMUNIDAD</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>

            <h2 className="font-hud font-black text-[32px] sm:text-[42px] lg:text-[46px] tracking-tight leading-tight mb-3">
              <span className="text-[#063B4A]">SERVICIOS DE </span>
              <span className="text-[#087E98]">ANÁLISIS DE </span>
              <span className="text-[#10B981]">AGUA</span>
            </h2>

            <p className="text-[15.5px] sm:text-[17px] text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Te mostramos cómo analizamos cada parámetro en el laboratorio mediante ensayos certificados y tecnología científica. Selecciona una categoría y explora cada parámetro en acción:
            </p>
          </div>

          {/* =====================================================================
              2. TRES TARJETAS PRINCIPALES DE CATEGORÍAS (FISICOQUÍMICO, MICROBIOLÓGICO, METALES)
              ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {mainCards.map((card) => {
              const isSelected = activeTab === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectTab(card.id)}
                  className={`group relative rounded-3xl p-6 sm:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? `${card.colorScheme.activeBorder} ${card.colorScheme.activeBg} shadow-[0_12px_32px_rgba(8,126,152,0.12)] ring-2 ring-[#39C6DD]/30`
                      : 'bg-white border-slate-200/90 hover:border-[#39C6DD] hover:shadow-[0_8px_24px_rgba(6,59,74,0.06)]'
                  }`}
                >
                  <div>
                    {/* Icono Grande */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                          isSelected ? card.colorScheme.iconBg : 'bg-slate-100'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[30px] ${
                            isSelected ? card.colorScheme.iconColor : 'text-slate-600'
                          }`}
                        >
                          {card.icon}
                        </span>
                      </div>

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-hud font-bold uppercase bg-white border border-cyan-200 text-[#087E98] shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                          Seleccionado
                        </span>
                      ) : (
                        <span className="text-[11px] font-hud font-semibold text-slate-400 group-hover:text-[#087E98] transition-colors">
                          Toca para ver
                        </span>
                      )}
                    </div>

                    {/* Título */}
                    <h3 className="font-hud font-extrabold text-[19px] sm:text-[21px] text-[#063B4A] mb-2 flex items-center gap-2">
                      <span>{card.emoji}</span>
                      <span>{card.title}</span>
                    </h3>

                    {/* Descripción Corta */}
                    <p className="text-[14px] text-slate-600 leading-relaxed font-normal">
                      {card.shortDesc}
                    </p>

                    {/* Etiqueta amigable de orientación */}
                    <div className="mt-3.5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-slate-600 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200/70">
                      <span className="material-symbols-outlined text-[15px] text-[#10B981]">check_circle</span>
                      <span>{card.targetUser}</span>
                    </div>
                  </div>

                  {/* Botón EXPLORAR PARÁMETROS */}
                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTab(card.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-hud text-[12.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${card.colorScheme.btnActive} shadow-xs`
                          : 'bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-[#087E98]'
                      }`}
                    >
                      <span>{isSelected ? 'PARÁMETROS ACTIVOS' : 'EXPLORAR PARÁMETROS'}</span>
                      <span className="material-symbols-outlined text-[17px]">
                        {isSelected ? 'expand_more' : 'arrow_forward'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =====================================================================
              3. PANEL PRINCIPAL DE PARÁMETROS DE LA CATEGORÍA ACTIVA
              ===================================================================== */}
          <div
            id="servicios-parametros"
            className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_36px_rgba(6,59,74,0.04)] p-6 sm:p-8 lg:p-10 mb-14 scroll-mt-24"
          >
            {/* Cabecera del Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h3 className="font-hud font-black text-[22px] sm:text-[26px] text-[#063B4A]">
                    {currentService.title}
                  </h3>
                  <span className="px-3 py-0.5 rounded-full bg-cyan-50 text-[#087E98] text-[11px] font-hud font-bold border border-cyan-200">
                    {currentService.badge}
                  </span>
                </div>
                <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-3xl leading-relaxed">
                  {currentService.desc} Cada tarjeta muestra el ensayo real de laboratorio. Toca cualquiera para ingresar a su ficha técnica completa:
                </p>
              </div>

              {/* Selector de visualización (Tarjetas vs Tabla) */}
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg font-hud text-[11.5px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-white text-[#063B4A] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    <span>Tarjetas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg font-hud text-[11.5px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white text-[#063B4A] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">table_rows</span>
                    <span>Tabla</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Píldoras Rápidas de Orientación y Respaldo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-cyan-50/50 border border-cyan-200/70 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-cyan-100 text-[#087E98] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">biotech</span>
                </span>
                <div className="text-left">
                  <span className="text-[10.5px] font-hud font-bold text-[#063B4A] uppercase block leading-none mb-0.5">
                    Ensayos con Imagen Real
                  </span>
                  <span className="text-[12px] text-slate-600 font-medium">Laboratorio en operación</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#10B981] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </span>
                <div className="text-left">
                  <span className="text-[10.5px] font-hud font-bold text-[#065f46] uppercase block leading-none mb-0.5">
                    Normativa Sanitaria
                  </span>
                  <span className="text-[12px] text-slate-600 font-medium">D.S. N.° 031-2010-SA</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/70 flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-sky-100 text-[#0077b6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </span>
                <div className="text-left">
                  <span className="text-[10.5px] font-hud font-bold text-[#005f73] uppercase block leading-none mb-0.5">
                    Acompañamiento Técnico
                  </span>
                  <span className="text-[12px] text-slate-600 font-medium">Interpretación de resultados</span>
                </div>
              </div>
            </div>

            {/* =================================================================
                VISTA 1: PARÁMETROS COMO TARJETAS CON FOTOGRAFÍA DE LABORATORIO
                ================================================================= */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
                {currentParameters.map((param) => (
                  <div
                    key={param.id}
                    onClick={() => handleOpenDetail(param)}
                    className="group relative rounded-2xl bg-white border border-slate-200 hover:border-[#39C6DD] hover:shadow-[0_12px_28px_rgba(8,126,152,0.14)] transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-98 overflow-hidden"
                  >
                    <div>
                      {/* IMAGEN DE LABORATORIO EN ACCIÓN */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={param.labImage}
                          alt={`Ensayo de laboratorio para ${param.name}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                        {/* Insignia superior flotante */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#063B4A]/85 backdrop-blur-md text-[10.5px] font-hud font-bold text-white border border-white/20 shadow-xs">
                          <span className="material-symbols-outlined text-[13px] text-[#39C6DD]">
                            biotech
                          </span>
                          <span>LABORATORIO</span>
                        </div>

                        {/* Badge Emoji */}
                        <div className="absolute top-3 right-3 text-[17px] bg-white/20 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center border border-white/30">
                          {param.badgeEmoji}
                        </div>

                        {/* Nombre del parámetro sobre el degradado inferior */}
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                          <span className="text-[10.5px] font-mono text-cyan-200 block truncate leading-tight">
                            {param.technicalName}
                          </span>
                          <h4 className="font-hud font-extrabold text-[18px] text-white leading-tight drop-shadow-sm flex items-center justify-between">
                            <span>{param.name}</span>
                            {param.symbol && (
                              <span className="text-[11px] font-mono bg-white/25 px-1.5 py-0.5 rounded text-cyan-100 font-normal">
                                {param.symbol}
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>

                      {/* CUERPO DE LA TARJETA */}
                      <div className="p-4 pt-3.5">
                        {/* Caja de Límite y Unidad */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-cyan-50/50 group-hover:border-cyan-200/60 transition-colors">
                          <span className="block text-[10px] font-hud uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                            Límite Seguro (D.S. 031)
                          </span>
                          <div className="font-hud font-bold text-[14.5px] text-[#087E98]">
                            {param.limit}
                          </div>
                          <div className="text-[11.5px] font-mono text-slate-600 mt-0.5">
                            {param.unit}
                          </div>
                        </div>

                        {/* Resumen del ensayo de laboratorio */}
                        <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug line-clamp-2">
                          <span className="material-symbols-outlined text-[13px] text-[#087E98] shrink-0 mt-0.5">
                            science
                          </span>
                          <span>{param.labImageCaption}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botón VER DETALLE → */}
                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[#087E98] font-hud text-[11.5px] font-extrabold uppercase tracking-wider group-hover:text-[#063B4A]">
                        <span>VER FICHA COMPLETA</span>
                        <span className="material-symbols-outlined text-[17px] transition-transform group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* VISTA 2: TABLA TÉCNICA TRADICIONAL CON FOTOGRAFÍA DE LABORATORIO */
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13.5px] border-collapse min-w-[620px]">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-[#063B4A] font-hud text-[11.5px] uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold">Laboratorio / Parámetro</th>
                        <th className="py-3.5 px-4 font-bold">Unidad</th>
                        <th className="py-3.5 px-4 font-bold">Límite Normativo Seguro (D.S. 031)</th>
                        <th className="py-3.5 px-4 font-bold">Ensayo en Laboratorio</th>
                        <th className="py-3.5 px-4 text-right font-bold">Ficha / Detalle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {currentParameters.map((param) => (
                        <tr
                          key={param.id}
                          onClick={() => handleOpenDetail(param)}
                          className="hover:bg-cyan-50/50 transition-colors duration-150 cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            <div className="flex items-center gap-3">
                              <img
                                src={param.labImage}
                                alt={param.name}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                              />
                              <div>
                                <span className="block font-hud font-bold text-[14px] text-[#063B4A]">
                                  {param.name}
                                </span>
                                <span className="block text-[11.5px] text-slate-500 font-normal">
                                  {param.technicalName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[12px]">
                            {param.unit}
                          </td>
                          <td className="py-3 px-4 font-hud font-bold text-[#087E98]">
                            {param.limit}
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[12px] max-w-xs truncate" title={param.labImageCaption}>
                            {param.labImageCaption}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(param);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-[#087E98] group-hover:text-white text-[#063B4A] font-hud text-[11.5px] font-bold uppercase transition-all cursor-pointer shadow-2xs"
                            >
                              <span>VER FICHA</span>
                              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Principio de Confianza y Calidad */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-slate-800 text-[13px] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#087E98] text-[24px] shrink-0 mt-0.5">
                handshake
              </span>
              <p className="leading-relaxed">
                <strong className="text-[#063B4A]">Compromiso de Exactitud y Acompañamiento:</strong> Todos los ensayos se ejecutan con cadena de custodia formal y patrones de calibración verificados. Toca cualquier parámetro para comprender qué significa, su relevancia para la salud y cómo interpretar los valores obtenidos en campo.
              </p>
            </div>

            {/* Accesos Rápidos Complementarios a los Módulos Técnicos */}
            {(onOpenAquaLab || onOpenAquaMetals) && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[12.5px] text-slate-600 text-center sm:text-left">
                  {activeTab === 'metales'
                    ? '¿Deseas ingresar muestras de metales pesados en el módulo ICP-MS de AQUA-METALS?'
                    : '¿Deseas registrar o validar análisis de agua en la plataforma técnica?'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {onOpenAquaLab && (
                    <button
                      type="button"
                      onClick={onOpenAquaLab}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#063B4A] font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">biotech</span>
                      <span>Ingresar a AQUA-LAB</span>
                    </button>
                  )}
                  {onOpenAquaMetals && activeTab === 'metales' && (
                    <button
                      type="button"
                      onClick={onOpenAquaMetals}
                      className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#087E98] border border-cyan-200 font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">blur_on</span>
                      <span>Módulo AQUA-METALS</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =====================================================================
              4. SECCIÓN "¿QUÉ RECIBES CON TU SERVICIO?"
              ===================================================================== */}
          <div className="mb-14">
            <div className="text-center mb-8">
              <h3 className="font-hud font-extrabold text-[22px] sm:text-[26px] text-[#063B4A] tracking-tight">
                ¿QUÉ RECIBES CON TU ANÁLISIS?
              </h3>
              <p className="text-slate-500 text-[14.5px] mt-1 max-w-xl mx-auto">
                Un proceso transparente, sencillo y con acompañamiento de principio a fin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Elemento 1: ENSAYO PRECISO */}
              <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 text-center flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-13 h-13 rounded-2xl bg-cyan-100 text-[#087E98] flex items-center justify-center mb-4 shadow-2xs">
                  <span className="material-symbols-outlined text-[28px]">science</span>
                </div>
                <h4 className="font-hud font-bold text-[16px] sm:text-[17px] text-[#063B4A] mb-2 uppercase tracking-wide">
                  🔬 1. ENSAYO PRECISO
                </h4>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Evaluación rigurosa de cada parámetro con equipos calibrados y tecnología analítica de laboratorio.
                </p>
              </div>

              {/* Elemento 2: RESULTADOS CLAROS */}
              <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 text-center flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-[#10B981] flex items-center justify-center mb-4 shadow-2xs">
                  <span className="material-symbols-outlined text-[28px]">bar_chart</span>
                </div>
                <h4 className="font-hud font-bold text-[16px] sm:text-[17px] text-[#063B4A] mb-2 uppercase tracking-wide">
                  📊 2. RESULTADOS CLAROS
                </h4>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Te entregamos datos explicados de forma amigable y comprensible, comparados contra los límites seguros de salud.
                </p>
              </div>

              {/* Elemento 3: INFORME Y ASESORÍA */}
              <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 text-center flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-13 h-13 rounded-2xl bg-sky-100 text-[#0077b6] flex items-center justify-center mb-4 shadow-2xs">
                  <span className="material-symbols-outlined text-[28px]">description</span>
                </div>
                <h4 className="font-hud font-bold text-[16px] sm:text-[17px] text-[#063B4A] mb-2 uppercase tracking-wide">
                  📄 3. INFORME & ASESORÍA
                </h4>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Informe formal con recomendaciones prácticas para tratamiento, cloración, desinfección y mejora del sistema.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================================
              5. SECCIÓN FINAL "¿TIENES DUDAS SOBRE QUÉ ANÁLISIS NECESITAS?"
              ===================================================================== */}
          <div className="rounded-3xl bg-gradient-to-r from-[#063B4A] via-[#087E98] to-[#10B981] p-8 sm:p-10 text-white shadow-xl text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-13 h-13 rounded-2xl bg-white/15 text-cyan-200 flex items-center justify-center mx-auto mb-4 backdrop-blur-xs">
                <span className="material-symbols-outlined text-[28px]">contact_support</span>
              </div>

              <h3 className="font-hud font-extrabold text-[24px] sm:text-[32px] tracking-tight mb-2">
                ¿TIENES DUDAS SOBRE QUÉ ANÁLISIS NECESITAS?
              </h3>

              <p className="text-cyan-100 text-[15px] sm:text-[16.5px] mb-8 font-normal leading-relaxed">
                Conversa directamente con nuestros especialistas. Te orientamos sin compromiso sobre la mejor alternativa para tu fuente de agua, pozo o sistema comunal.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Botón SOLICITAR COTIZACIÓN */}
                {onOpenQuoteModal ? (
                  <button
                    type="button"
                    id="servicios-btn-cotizar"
                    onClick={() => onOpenQuoteModal(currentService.quoteName)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[#063B4A] hover:bg-cyan-50 font-hud text-[13px] font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px] text-[#087E98]">
                      request_quote
                    </span>
                    <span>SOLICITAR COTIZACIÓN</span>
                  </button>
                ) : null}

                {/* Botón WHATSAPP */}
                <a
                  id="servicios-btn-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-hud text-[13px] font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">chat</span>
                  <span>ESCRIBIR POR WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}
      </div>
    </section>
  );
};

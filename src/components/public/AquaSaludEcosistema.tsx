import React, { useState } from 'react';
import { TabType } from '../../types';

interface AquaSaludEcosistemaProps {
  onOpenModuleTab?: (tab: TabType) => void;
  onSelectModule?: (tab: TabType) => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

interface EcosystemModule {
  id: string;
  name: string;
  tag: string;
  category: 'OPERACIÓN' | 'LABORATORIO' | 'GESTIÓN' | 'INTELIGENCIA';
  shortDesc: string;
  keyFeature: string;
  targetTab: TabType;
  icon: string;
  accentColor: string;
  badge: string;
  normative: string;
  stats: string;
}

export const AquaSaludEcosistema: React.FC<AquaSaludEcosistemaProps> = ({
  onOpenModuleTab,
  onSelectModule,
  onOpenQuoteModal,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('cloragua');

  const handleOpenModule = (tab: TabType) => {
    if (typeof onOpenModuleTab === 'function') {
      onOpenModuleTab(tab);
    } else if (typeof onSelectModule === 'function') {
      onSelectModule(tab);
    }
  };

  const modules: EcosystemModule[] = [
    {
      id: 'cloragua',
      name: 'CLORAGUA',
      tag: 'Calculador Inteligente de Dosificación',
      category: 'OPERACIÓN',
      shortDesc: 'Cálculo estequiométrico preciso de desinfección con cloro según geometría de tanques y concentraciones comerciales.',
      keyFeature: 'Fórmula estequiométrica automatizada para hipoclorito de calcio (65-70%) y lejía comercial.',
      targetTab: 'dosis',
      icon: 'colorize',
      accentColor: '#087E98',
      badge: 'MOTOR PRINCIPAL',
      normative: 'D.S. N.° 031-2010-SA • Art. 66',
      stats: 'Cálculo en < 3 seg',
    },
    {
      id: 'aqua-territorio',
      name: 'AQUA-TERRITORIO',
      tag: 'Georreferenciación GIS y Mapa de Cuencas',
      category: 'GESTIÓN',
      shortDesc: 'Visualización geoespacial de captaciones, reservorios, redes y puntos críticos sobre capas territoriales.',
      keyFeature: 'Mapa GIS interactivo con semáforos de inocuidad por caserío, cuenca y microcuenca.',
      targetTab: 'territorio',
      icon: 'map',
      accentColor: '#10B981',
      badge: 'CARTOGRAFÍA GIS',
      normative: 'Coordenadas WGS84 / UTM',
      stats: 'Visión multi-sistema',
    },
    {
      id: 'aqua-ia',
      name: 'AQUA-IA',
      tag: 'Asistente Experto en Agua y Saneamiento',
      category: 'INTELIGENCIA',
      shortDesc: 'Asesor inteligente basado en IA generativa entrenado en normatividad peruana y guías internacionales.',
      keyFeature: 'Interpretación de análisis complejos, auditoría de dosificación y redacción de planes de contingencia.',
      targetTab: 'ia',
      icon: 'psychology',
      accentColor: '#39C6DD',
      badge: 'GOOGLE GENAI',
      normative: 'Entrenado en D.S. N.° 031-2010-SA',
      stats: 'Respuestas contextuales',
    },
    {
      id: 'aqua-jass',
      name: 'AQUA-JASS',
      tag: 'Gestión Rural Simplificada para Operadores',
      category: 'OPERACIÓN',
      shortDesc: 'Interfaz táctil optimizada para operadores comunitarios: bitácora de campo, control de cloro y alertas.',
      keyFeature: 'Registro rápido con validación fotográfica y asistencia paso a paso sin complicaciones.',
      targetTab: 'jass',
      icon: 'water_drop',
      accentColor: '#10B981',
      badge: 'CAMPO RURAL',
      normative: 'Manual de Operación MVCS / JASS',
      stats: 'Operación 100% móvil',
    },
    {
      id: 'aqua-municipios',
      name: 'AQUA-MUNICIPIOS (ATM)',
      tag: 'Supervisión Municipal y Metas de Incentivos',
      category: 'GESTIÓN',
      shortDesc: 'Tablero consolidado para Áreas Técnicas Municipales: monitoreo de cloración distrital y cumplimiento de metas.',
      keyFeature: 'Fiscalización distrital con generación de expedientes consolidados para el MEF y SUNASS.',
      targetTab: 'dashboard',
      icon: 'apartment',
      accentColor: '#063B4A',
      badge: 'ATM MUNICIPAL',
      normative: 'Meta 5 MEF / Guía ATM MVCS',
      stats: 'Control multi-comunidad',
    },
  ];

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  return (
    <section id="ecosistema" className="py-16 sm:py-24 bg-gradient-to-b from-[#E8F1F4]/50 via-white to-[#E8F1F4]/30 relative overflow-hidden">
      {/* Decorative molecular orbit background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-cyan-200/40 rounded-full pointer-events-none -z-10 animate-spin-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-dashed border-teal-200/40 rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087E98]/10 border border-[#087E98]/20 text-[#087E98] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>ARQUITECTURA MODULAR INTEGRADA</span>
          </div>

          <h2 className="font-hud font-extrabold text-[28px] sm:text-[40px] text-[#063B4A] tracking-tight leading-tight mb-4">
            Un Ecosistema Completo para el Agua Segura
          </h2>

          <p className="text-[15px] sm:text-[17px] text-slate-600 leading-relaxed font-normal">
            AQUA SALUD integra en una sola plataforma la dosificación operativa, la gestión comunal de saneamiento, el monitoreo territorial municipal y la inteligencia artificial preventiva.
          </p>
        </div>

        {/* Interactive Hub Grid: Module Pills + Dynamic Focus Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Module Selector (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m) => {
              const isSelected = m.id === selectedModuleId;
              const isPrimary = m.id === 'cloragua';
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
                    isPrimary ? 'sm:col-span-2' : ''
                  } ${
                    isSelected
                      ? 'bg-white border-[#087E98] shadow-[0_8px_24px_rgba(8,126,152,0.15)] ring-2 ring-[#087E98]/20 translate-x-1'
                      : 'bg-white/70 hover:bg-white border-slate-200/90 hover:border-cyan-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: isSelected ? `${m.accentColor}18` : '#E8F1F4',
                        color: m.accentColor,
                      }}
                    >
                      <span className="material-symbols-outlined text-[22px]">{m.icon}</span>
                    </div>

                    <span
                      className={`text-[9.5px] font-hud font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[#063B4A] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-hud font-extrabold text-[15px] leading-snug transition-colors ${
                        isSelected ? 'text-[#063B4A]' : 'text-slate-800 group-hover:text-[#087E98]'
                      }`}
                    >
                      {m.name}
                    </h3>
                    <p className="text-[12px] font-medium text-slate-500 line-clamp-1 mt-0.5">
                      {m.tag}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-hud text-slate-500">
                    <span className="font-semibold text-slate-700">{m.stats}</span>
                    <span className="text-[#087E98] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Explorar
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Focus Highlight Card of Selected Module (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-gradient-to-br from-[#063B4A] via-[#087E98] to-[#031E26] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-cyan-400/20 relative overflow-hidden">
              {/* Glow accents */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#39C6DD]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#10B981]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-[#8BE6C2] text-[10.5px] font-hud font-black uppercase tracking-wider border border-white/15">
                    {activeModule.category} • {activeModule.badge}
                  </span>
                  <span className="text-[11.5px] font-mono text-cyan-200">
                    {activeModule.normative}
                  </span>
                </div>

                {/* Module Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#39C6DD] shadow-inner">
                    <span className="material-symbols-outlined text-[32px]">{activeModule.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-hud font-black text-[24px] sm:text-[28px] text-white leading-tight">
                      {activeModule.name}
                    </h3>
                    <p className="text-[13px] text-[#8BE6C2] font-semibold font-hud">
                      {activeModule.tag}
                    </p>
                  </div>
                </div>

                {/* Descriptions */}
                <p className="text-[14px] text-slate-200 leading-relaxed mb-5">
                  {activeModule.shortDesc}
                </p>

                {/* Key feature callout */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 mb-6">
                  <div className="flex items-center gap-2 text-[#8BE6C2] font-hud text-[11px] font-black uppercase tracking-wider mb-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Capacidad Clave del Sistema:</span>
                  </div>
                  <p className="text-[12.5px] text-white font-medium leading-normal">
                    {activeModule.keyFeature}
                  </p>
                </div>

                {/* Direct action buttons */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenModule(activeModule.targetTab)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#39C6DD] to-[#10B981] hover:from-[#10B981] hover:to-[#8BE6C2] text-[#031E26] font-hud text-[13px] font-black uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">launch</span>
                    <span>PROBAR {activeModule.name} EN LA PLATAFORMA</span>
                  </button>

                  {onOpenQuoteModal && (
                    <button
                      type="button"
                      onClick={() => onOpenQuoteModal(activeModule.name)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#8BE6C2]">request_quote</span>
                      <span>Solicitar Implementación para mi Entidad</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Ribbon */}
        <div className="mt-14 p-5 rounded-2xl bg-[#063B4A] text-white text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#8BE6C2]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <span className="text-[13px] sm:text-[14px] font-hud font-bold text-white text-left">
              Integración total con la normatividad sanitaria peruana (D.S. N.° 031-2010-SA y SUNASS).
            </span>
          </div>

          <span className="text-[12px] font-mono text-[#39C6DD] font-bold shrink-0">
            Módulos Especializados • 100% Interoperables
          </span>
        </div>
      </div>
    </section>
  );
};

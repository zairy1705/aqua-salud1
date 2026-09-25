import React, { useEffect } from 'react';
import { WaterParameterDetail } from '../../data/waterParametersDetailData';

interface ParameterDetailViewProps {
  parameter: WaterParameterDetail;
  onBack: () => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const ParameterDetailView: React.FC<ParameterDetailViewProps> = ({
  parameter,
  onBack,
  onOpenQuoteModal,
}) => {
  // Al entrar a la ficha, realizar scroll suave a la parte superior de la vista
  useEffect(() => {
    const serviciosEl = document.getElementById('servicios');
    if (serviciosEl) {
      serviciosEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [parameter.id]);

  // Enlace oficial de WhatsApp con mensaje contextualizado al parámetro
  const whatsappUrl = `https://wa.me/51920221581?text=${encodeURIComponent(
    `Hola AQUA SALUD, deseo solicitar análisis e información técnica sobre el parámetro: ${parameter.name} (${parameter.technicalName}).`
  )}`;

  // Colores por categoría según la identidad visual de AQUA-SALUD
  const categoryConfig = {
    fisicoquimico: {
      badgeBg: 'bg-cyan-50',
      badgeBorder: 'border-cyan-200',
      badgeText: 'text-[#0077b6]',
      gradient: 'from-[#063B4A] via-[#087E98] to-[#0077b6]',
      accentColor: '#087E98',
      categoryLabel: 'ANÁLISIS FISICOQUÍMICO',
    },
    microbiologico: {
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-200',
      badgeText: 'text-[#059669]',
      gradient: 'from-[#063B4A] via-[#047857] to-[#10B981]',
      accentColor: '#10B981',
      categoryLabel: 'ANÁLISIS MICROBIOLÓGICO',
    },
    metales: {
      badgeBg: 'bg-sky-50',
      badgeBorder: 'border-sky-200',
      badgeText: 'text-[#005f73]',
      gradient: 'from-[#063B4A] via-[#005f73] to-[#087E98]',
      accentColor: '#087E98',
      categoryLabel: 'METALES PESADOS (ICP-MS)',
    },
  }[parameter.category];

  return (
    <div className="w-full py-4 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* =====================================================================
            1. BOTÓN SUPERIOR: VOLVER A PARÁMETROS
            ===================================================================== */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[#063B4A] hover:bg-cyan-50 hover:border-[#39C6DD] hover:text-[#087E98] font-hud text-[12.5px] font-bold uppercase tracking-wider transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[19px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>VOLVER A PARÁMETROS</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 font-hud text-[11px] font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>FICHA CIENTÍFICA DIGITAL • AQUA-SALUD</span>
          </div>
        </div>

        {/* =====================================================================
            2. TARJETA PRINCIPAL DEL PARÁMETRO
            ===================================================================== */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_12px_40px_rgba(6,59,74,0.06)] overflow-hidden mb-8 transition-all">
          
          {/* Cabecera visual con degradado suave y acento */}
          <div className={`bg-gradient-to-r ${categoryConfig.gradient} p-6 sm:p-8 text-white relative`}>
            {/* Patrón sutil de fondo */}
            <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                {/* Contenedor del Icono Científico */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[36px] sm:text-[44px] text-white">
                    {parameter.icon}
                  </span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-hud font-bold tracking-wider uppercase mb-2 text-cyan-100">
                    <span>{parameter.badgeEmoji}</span>
                    <span>{categoryConfig.categoryLabel}</span>
                  </div>

                  <h1 className="font-hud font-black text-[28px] sm:text-[38px] tracking-tight leading-none text-white">
                    {parameter.name}
                  </h1>

                  <p className="text-[14px] sm:text-[16px] text-cyan-100 font-medium mt-1">
                    {parameter.technicalName}
                    {parameter.symbol && (
                      <span className="ml-2 font-mono text-[13px] bg-white/20 px-2 py-0.5 rounded text-white font-normal">
                        {parameter.symbol}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Límite rápido en la cabecera */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:text-right shrink-0">
                <span className="block text-[11px] font-hud uppercase tracking-wider text-cyan-200">
                  Límite Seguro (D.S. 031)
                </span>
                <span className="font-hud font-extrabold text-[18px] sm:text-[20px] text-white">
                  {parameter.limit}
                </span>
                <span className="block text-[11px] text-cyan-200/90 font-mono">
                  {parameter.unit}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              FOTOGRAFÍA REAL: ENSAYO DE ESTE PARÁMETRO EN EL LABORATORIO
              ================================================================= */}
          <div className="relative border-b border-slate-100 bg-slate-900 group overflow-hidden">
            <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden relative">
              <img
                src={parameter.labImage}
                alt={`Ensayo de laboratorio para ${parameter.name}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-95"
              />
              {/* Degradado inferior para legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Ficha superpuesta descriptiva del trabajo de laboratorio */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-md text-[11px] font-hud font-bold uppercase tracking-wider mb-2 text-white border border-cyan-300/40 shadow-xs">
                <span className="material-symbols-outlined text-[15px]">biotech</span>
                <span>TRABAJO EN LABORATORIO • {parameter.name}</span>
              </div>
              <p className="text-[13.5px] sm:text-[15px] text-slate-100 font-medium leading-relaxed max-w-3xl drop-shadow-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#39C6DD] shrink-0 mt-0.5">
                  science
                </span>
                <span>{parameter.labImageCaption}</span>
              </p>
            </div>
          </div>

          {/* Cuerpo de la Tarjeta Principal */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            
            {/* =================================================================
                3. SECCIÓN: ¿QUÉ ES?
                ================================================================= */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100/80 text-[#087E98] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">help</span>
                </div>
                <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                  ¿QUÉ ES?
                </h2>
              </div>
              <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed pl-0 sm:pl-10">
                {parameter.whatIs}
              </p>
            </div>

            {/* =================================================================
                4. SECCIÓN: ¿PARA QUÉ SIRVE?
                ================================================================= */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#10B981] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">troubleshoot</span>
                </div>
                <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                  ¿PARA QUÉ SIRVE EN LA DETERMINACIÓN DE LA CALIDAD DEL AGUA?
                </h2>
              </div>
              <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed pl-0 sm:pl-10">
                {parameter.whatIsFor}
              </p>
            </div>

            {/* =================================================================
                5. SECCIÓN: ¿POR QUÉ ES IMPORTANTE?
                ================================================================= */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100/80 text-[#0077b6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">verified</span>
                </div>
                <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                  ¿POR QUÉ ES IMPORTANTE?
                </h2>
              </div>
              <div className="pl-0 sm:pl-10">
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 text-slate-700 text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  {parameter.whyImportant}
                </div>
              </div>
            </div>

            {/* =================================================================
                6. SECCIÓN: INFORMACIÓN DEL ANÁLISIS
                ================================================================= */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#063B4A] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">fact_check</span>
                </div>
                <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                  INFORMACIÓN DEL ANÁLISIS
                </h2>
              </div>

              {/* Tarjeta de Información Estructurada */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-200/90 bg-white text-[13.5px] sm:text-[14.5px]">
                  
                  {/* Fila: Unidad */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                    <span className="font-hud font-bold text-[#063B4A] uppercase text-[12px] sm:text-[13px] self-center">
                      Unidad
                    </span>
                    <span className="sm:col-span-2 font-mono font-medium text-slate-800 mt-1 sm:mt-0">
                      {parameter.unit}
                    </span>
                  </div>

                  {/* Fila: Límite / Referencia */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors bg-cyan-50/30">
                    <span className="font-hud font-bold text-[#087E98] uppercase text-[12px] sm:text-[13px] self-center">
                      Límite / Referencia
                    </span>
                    <span className="sm:col-span-2 font-hud font-bold text-[#063B4A] mt-1 sm:mt-0">
                      {parameter.limit}
                    </span>
                  </div>

                  {/* Fila: Método Analítico */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                    <span className="font-hud font-bold text-[#063B4A] uppercase text-[12px] sm:text-[13px] self-center">
                      Método Analítico
                    </span>
                    <span className="sm:col-span-2 text-slate-700 mt-1 sm:mt-0">
                      {parameter.method}
                    </span>
                  </div>

                  {/* Fila: Norma Sanitaria */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors bg-slate-50/40">
                    <span className="font-hud font-bold text-slate-600 uppercase text-[12px] sm:text-[13px] self-center">
                      Normativa Oficial
                    </span>
                    <span className="sm:col-span-2 text-slate-600 text-[13px] mt-1 sm:mt-0">
                      {parameter.normativeRef}
                    </span>
                  </div>

                  {/* Fila: Tecnología / Equipo */}
                  {parameter.equipment && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                      <span className="font-hud font-bold text-slate-600 uppercase text-[12px] sm:text-[13px] self-center">
                        Equipo de Laboratorio
                      </span>
                      <span className="sm:col-span-2 text-slate-600 text-[13px] mt-1 sm:mt-0">
                        {parameter.equipment}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* =================================================================
                7. SECCIÓN: INTERPRETACIÓN GENERAL (CUANDO CORRESPONDE)
                ================================================================= */}
            {parameter.interpretation && (
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#8BE6C2]/60 text-[#063B4A] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[19px]">insights</span>
                  </div>
                  <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                    INTERPRETACIÓN GENERAL
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* VALOR BAJO (si aplica al parámetro) */}
                  {parameter.interpretation.low && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-slate-800">
                      <div className="flex items-center gap-2 mb-1.5 text-amber-800 font-hud font-bold text-[13px] uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[18px]">trending_down</span>
                        <span>{parameter.interpretation.lowLabel || 'VALOR BAJO'}</span>
                      </div>
                      <p className="text-[13.5px] sm:text-[14.5px] text-slate-700 leading-relaxed pl-6">
                        {parameter.interpretation.low}
                      </p>
                    </div>
                  )}

                  {/* VALOR DENTRO DEL RANGO DE REFERENCIA */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-slate-800">
                    <div className="flex items-center gap-2 mb-1.5 text-emerald-800 font-hud font-bold text-[13px] uppercase tracking-wide">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>
                        {parameter.interpretation.normalLabel || 'VALOR DENTRO DEL RANGO DE REFERENCIA'}
                      </span>
                    </div>
                    <p className="text-[13.5px] sm:text-[14.5px] text-slate-700 leading-relaxed pl-6">
                      {parameter.interpretation.normal}
                    </p>
                  </div>

                  {/* VALOR ELEVADO */}
                  {parameter.interpretation.high && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200/90 text-slate-800">
                      <div className="flex items-center gap-2 mb-1.5 text-rose-800 font-hud font-bold text-[13px] uppercase tracking-wide">
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        <span>{parameter.interpretation.highLabel || 'VALOR ELEVADO'}</span>
                      </div>
                      <p className="text-[13.5px] sm:text-[14.5px] text-slate-700 leading-relaxed pl-6">
                        {parameter.interpretation.high}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================================
                8. SECCIÓN: DATOS DEL PARÁMETRO (FICHA SÍNTESIS)
                ================================================================= */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#063B4A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[19px]">badge</span>
                </div>
                <h2 className="font-hud font-extrabold text-[18px] sm:text-[20px] text-[#063B4A] tracking-tight">
                  DATOS DEL PARÁMETRO
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                <div className="p-2.5">
                  <span className="block text-[11px] font-hud uppercase tracking-wider text-slate-400 font-bold mb-1">
                    PARÁMETRO
                  </span>
                  <span className="font-hud font-extrabold text-[15px] text-[#063B4A]">
                    {parameter.name}
                  </span>
                </div>

                <div className="p-2.5">
                  <span className="block text-[11px] font-hud uppercase tracking-wider text-slate-400 font-bold mb-1">
                    UNIDAD
                  </span>
                  <span className="font-mono text-[13.5px] text-slate-700 font-medium">
                    {parameter.unit}
                  </span>
                </div>

                <div className="p-2.5">
                  <span className="block text-[11px] font-hud uppercase tracking-wider text-slate-400 font-bold mb-1">
                    LÍMITE / REFERENCIA
                  </span>
                  <span className="font-hud font-bold text-[14px] text-[#087E98]">
                    {parameter.limit}
                  </span>
                </div>

                <div className="p-2.5">
                  <span className="block text-[11px] font-hud uppercase tracking-wider text-slate-400 font-bold mb-1">
                    MÉTODO ANALÍTICO
                  </span>
                  <span className="text-[12.5px] text-slate-600 line-clamp-2" title={parameter.method}>
                    Standard Methods / EPA
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* =====================================================================
              9. ACCIÓN DE CONTACTO RÁPIDO PARA ESTE PARÁMETRO
              ===================================================================== */}
          <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-hud font-bold text-[15px] sm:text-[16px] text-[#063B4A]">
                ¿Necesitas analizar {parameter.name} en tu fuente o red de agua?
              </h3>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Emisión de reporte técnico oficial con cadena de custodia y asesoría personalizada.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {onOpenQuoteModal && (
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(`Análisis de ${parameter.name} (${parameter.technicalName})`)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#063B4A] hover:bg-[#087E98] text-white font-hud text-[12px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#39C6DD]">
                    request_quote
                  </span>
                  <span>COTIZAR ANÁLISIS</span>
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-hud text-[12px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>CONSULTAR POR WHATSAPP</span>
              </a>
            </div>
          </div>

        </div>

        {/* =====================================================================
            10. BOTÓN FINAL: VOLVER A SERVICIOS DE ANÁLISIS
            ===================================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:border-[#087E98] text-[#063B4A] hover:text-[#087E98] font-hud text-[13px] font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[19px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>VOLVER A SERVICIOS DE ANÁLISIS</span>
          </button>
        </div>

      </div>
    </div>
  );
};

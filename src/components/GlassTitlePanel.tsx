import React from 'react';

export interface GlassTitlePanelProps {
  /**
   * Title displayed in modern uppercase typography with high contrast
   */
  title: string;
  /**
   * Optional category or functional badge (e.g. "VIGILANCIA SANITARIA", "AQUA-JASS")
   */
  badge?: string;
  /**
   * Optional regulatory or normative reference (e.g. "D.S. N.° 031-2010-SA • DIGESA")
   */
  normative?: string;
  /**
   * Explanatory subtitle
   */
  subtitle?: string;
  /**
   * Material symbol icon name
   */
  icon?: string;
  /**
   * Action buttons, controls, or filters rendered as beveled glass options
   */
  options?: React.ReactNode;
  /**
   * Alias for options
   */
  actions?: React.ReactNode;
  /**
   * Highlighted stats or metrics
   */
  stats?: Array<{
    label: string;
    value: string | number;
    badge?: string;
    subtext?: string;
    highlight?: boolean;
  }>;
  /**
   * Custom CSS classes for the container
   */
  className?: string;
}

export const GlassTitlePanel: React.FC<GlassTitlePanelProps> = ({
  title,
  badge,
  normative,
  subtitle,
  icon = 'water_drop',
  options,
  actions,
  stats,
  className = '',
}) => {
  const renderedActions = options || actions;

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#003d4c] via-[#00677d] to-[#00b4d8] text-white shadow-xl relative overflow-hidden border border-cyan-400/25 transition-all duration-300 ${className}`}
    >
      {/* Luces y brillos de fondo ambientales */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#10e7b2]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Marca de agua decorativa semitransparente en la esquina inferior derecha */}
      <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none select-none text-white">
        <span className="material-symbols-outlined text-[200px] sm:text-[240px] leading-none">
          {icon}
        </span>
      </div>

      {/* Contenido principal del banner */}
      <div className="relative z-10 max-w-4xl">
        {/* Badge / Chip superior estilo pill oficial con icono y normativa */}
        {(badge || normative) && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#10e7b2] text-[11px] font-hud font-bold uppercase mb-3 backdrop-blur-xs">
            <span className="material-symbols-outlined text-[16px] text-[#10e7b2] shrink-0">
              {icon}
            </span>
            <span>{badge || 'SISTEMA OFICIAL'}</span>
            {normative && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10e7b2]" />
                <span className="text-cyan-200">{normative}</span>
              </>
            )}
          </div>
        )}

        {/* Título en tipografía font-hud font-black mayúscula de alto impacto */}
        <h1 className="font-hud font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight uppercase drop-shadow-xs">
          {title}
        </h1>

        {/* Subtítulo descriptivo en tono cian claro legible */}
        {subtitle && (
          <p className="text-cyan-100 text-[13px] sm:text-[14.5px] mt-2 leading-relaxed max-w-3xl font-normal">
            {subtitle}
          </p>
        )}

        {/* Botones de acción / Opciones interactivas */}
        {renderedActions && (
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            {renderedActions}
          </div>
        )}

        {/* Barra de métricas e indicadores de impacto (stats) si están definidos */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-white/15">
            {stats.map((st, idx) => (
              <div
                key={idx}
                className={`p-2.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md transition-all border ${
                  st.highlight
                    ? 'bg-amber-400/25 border-amber-300/50 text-amber-100'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-cyan-200 font-extrabold uppercase tracking-wider">
                    {st.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[13px] sm:text-[14px] font-mono font-black ${st.highlight ? 'text-amber-200' : 'text-white'}`}>
                      {st.value}
                    </span>
                    {st.badge && (
                      <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-white/20 text-white font-black uppercase">
                        {st.badge}
                      </span>
                    )}
                  </div>
                  {st.subtext && (
                    <span className="text-[8.5px] text-cyan-100/80 font-medium">
                      {st.subtext}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

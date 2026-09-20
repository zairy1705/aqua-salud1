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
      className={`glass-title-panel p-5 sm:p-7 relative transition-all duration-300 ${className}`}
    >
      {/* Background ambient light prism effect */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#10e7b2]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glass Header Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="max-w-3xl">
          {/* Header Metadata Chips / Badges */}
          {(badge || normative) && (
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              {badge && (
                <span className="glass-badge text-[#00677d] border-cyan-200/90 shadow-xs font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
                  <span>{badge}</span>
                </span>
              )}
              {normative && (
                <span className="text-[11px] font-hud font-bold text-slate-700 tracking-wide flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-md border border-white/80">
                  <span className="material-symbols-outlined text-[14px] text-[#00b4d8]">
                    verified
                  </span>
                  <span>{normative}</span>
                </span>
              )}
            </div>
          )}

          {/* Title with Glass Icon and Modern Uppercase High-Contrast Typography */}
          <div className="flex items-start sm:items-center gap-3.5">
            {icon && (
              <div className="glass-icon-box w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0 text-[#00677d]">
                <span className="material-symbols-outlined text-[26px] sm:text-[30px] leading-none">
                  {icon}
                </span>
              </div>
            )}
            <div>
              <h1 className="glass-title-heading text-xl sm:text-2xl lg:text-3xl leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-[13px] text-slate-700 mt-1 leading-relaxed font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar if provided */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-4 pt-3.5 border-t border-cyan-900/10">
              {stats.map((st, idx) => (
                <div
                  key={idx}
                  className={`glass-badge py-1.5 px-3 transition-all ${
                    st.highlight
                      ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-sm'
                      : 'bg-white/85 text-slate-800'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                      {st.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[12px] font-hud font-black ${st.highlight ? 'text-amber-950' : 'text-[#003d4c]'}`}>
                        {st.value}
                      </span>
                      {st.badge && (
                        <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-cyan-100/90 text-[#00677d] font-black uppercase">
                          {st.badge}
                        </span>
                      )}
                    </div>
                    {st.subtext && (
                      <span className="text-[8.5px] text-slate-500 font-medium">
                        {st.subtext}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options / Action Buttons */}
        {renderedActions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start lg:self-center shrink-0">
            {renderedActions}
          </div>
        )}
      </div>
    </div>
  );
};

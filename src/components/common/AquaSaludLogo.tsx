import React, { useState } from 'react';

export type LogoVariant = 'principal' | 'horizontal' | 'isotipo' | 'completo' | 'monocromatico' | 'favicon';

interface AquaSaludLogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDescriptor?: boolean;
  lightMode?: boolean; // If true on dark backgrounds (e.g. footer)
  preferImage?: boolean; // If true, uses the high-res official emblem image
}

export const AquaSaludLogo: React.FC<AquaSaludLogoProps> = ({
  variant = 'principal',
  className = '',
  size = 'md',
  showDescriptor = true,
  lightMode = false,
  preferImage = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimension tokens
  const sizeMap = {
    xs: { icon: 24, imgSize: 'w-6 h-6', text: 'text-xs', sub: 'text-[8px]' },
    sm: { icon: 32, imgSize: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 44, imgSize: 'w-11 h-11', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 56, imgSize: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 76, imgSize: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // SVG Isotipo Vectorial Oficial: Gota de Agua Cristalina + Figura Humana de Salud / Yoga + Planta Verde + Isla Facetada + Red Científica de 6 Nodos
  const renderSvgIsotype = (pxSize: number) => {
    const isMono = variant === 'monocromatico';
    const dropGradId = `aqua-drop-grad-${size}-${variant}-${lightMode ? 'dark' : 'light'}`;
    const plantGradId = `aqua-plant-grad-${size}-${variant}`;
    const crystalGradId = `aqua-crystal-grad-${size}-${variant}`;

    return (
      <svg
        width={pxSize}
        height={pxSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        role="img"
        aria-label="Nuevo Logotipo Oficial AQUA SALUD: Gota de Vida, Salud Humana, Naturaleza y Red Científica"
      >
        <defs>
          {/* Degradado principal de la gota de agua */}
          <linearGradient id={dropGradId} x1="48" y1="6" x2="48" y2="108" gradientUnits="userSpaceOnUse">
            {isMono ? (
              <>
                <stop offset="0%" stopColor={lightMode ? '#FFFFFF' : '#031E26'} />
                <stop offset="100%" stopColor={lightMode ? '#E8F1F4' : '#063B4A'} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="25%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0284c7" />
                <stop offset="90%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </>
            )}
          </linearGradient>

          {/* Degradado de la planta verde */}
          <linearGradient id={plantGradId} x1="30" y1="50" x2="42" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Degradado de la isla geométrica facetada */}
          <linearGradient id={crystalGradId} x1="25" y1="75" x2="70" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Filtro de brillo y sombra */}
          <filter id={`aqua-glow-${size}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#0284c7" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ========================================================
            1. RED CIENTÍFICA DE 6 NODOS A LA DERECHA DE LA GOTA
            ======================================================== */}
        <g opacity={isMono ? "0.6" : "0.9"}>
          {/* Líneas conectivas de la red */}
          <line x1="68" y1="36" x2="88" y2="28" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="1 1" />
          <line x1="88" y1="28" x2="104" y2="34" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="88" y1="28" x2="94" y2="52" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="104" y1="34" x2="108" y2="56" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="94" y1="52" x2="108" y2="56" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="94" y1="52" x2="98" y2="76" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="108" y1="56" x2="110" y2="80" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="98" y1="76" x2="110" y2="80" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="98" y1="76" x2="92" y2="98" stroke="#38bdf8" strokeWidth="1.2" />

          {/* Nodo 1: Planeta Tierra / Mundo (arriba izquierda) */}
          <circle cx="88" cy="28" r="6" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.2" />
          <circle cx="88" cy="28" r="3.2" fill="#38bdf8" />
          <ellipse cx="88" cy="28" rx="5" ry="1.5" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.8" />

          {/* Nodo 2: Sol / Energía (arriba derecha) */}
          <circle cx="104" cy="34" r="5" fill="#0369a1" stroke="#e0f2fe" strokeWidth="1.2" />
          <circle cx="104" cy="34" r="2.5" fill="#facc15" />

          {/* Nodo 3: Gota de Agua Segura (medio derecha) */}
          <circle cx="108" cy="56" r="5.5" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.2" />
          <path d="M108 53 C106.5 55 105.5 56.5 105.5 57.5 C105.5 58.8 106.6 59.8 108 59.8 C109.4 59.8 110.5 58.8 110.5 57.5 C110.5 56.5 109.5 55 108 53 Z" fill="#ffffff" />

          {/* Nodo 4: Árbol / Cuenca / Naturaleza (centro red) */}
          <circle cx="94" cy="52" r="5.5" fill="#0d9488" stroke="#e0f2fe" strokeWidth="1.2" />
          <circle cx="94" cy="50.5" r="2" fill="#34d399" />
          <path d="M93 54 L95 54 L94 51 Z" fill="#ffffff" />

          {/* Nodo 5: Átomo / Molécula / Ciencia (abajo centro) */}
          <circle cx="98" cy="76" r="6" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.2" />
          <circle cx="98" cy="76" r="2" fill="#ffffff" />
          <ellipse cx="98" cy="76" rx="4.5" ry="1.8" stroke="#38bdf8" strokeWidth="0.8" fill="none" transform="rotate(30 98 76)" />
          <ellipse cx="98" cy="76" rx="4.5" ry="1.8" stroke="#38bdf8" strokeWidth="0.8" fill="none" transform="rotate(-30 98 76)" />

          {/* Nodo 6: Célula / Microorganismo / Salud (abajo) */}
          <circle cx="92" cy="98" r="5.5" fill="#0369a1" stroke="#e0f2fe" strokeWidth="1.2" />
          <circle cx="92" cy="98" r="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
          <circle cx="92" cy="98" r="1.2" fill="#34d399" />
        </g>

        {/* ========================================================
            2. GOTA PRINCIPAL DE AGUA CRISTALINA
            ======================================================== */}
        {/* Cuerpo exterior de la gota */}
        <path
          d="M48 8 C46 11 14 54 14 74 C14 93 29 108 48 108 C67 108 82 93 82 74 C82 54 50 11 48 8 Z"
          fill={`url(#${dropGradId})`}
          filter={`url(#aqua-glow-${size})`}
        />

        {/* Borde biselado interior transparente */}
        <path
          d="M48 12 C46.5 15 18 56 18 74 C18 90.5 31.5 104 48 104 C64.5 104 78 90.5 78 74 C78 56 49.5 15 48 12 Z"
          fill="#ffffff"
          fillOpacity="0.12"
          stroke="#e0f2fe"
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* Reflejo curvado de cristal en el lateral izquierdo */}
        <path
          d="M26 50 C23 60 22 72 26 84 C27 87 25 89 23 87 C20 74 20 60 24 46 C25 43 27 46 26 50 Z"
          fill="#ffffff"
          fillOpacity="0.55"
        />

        {/* ========================================================
            3. ISLA FACETADA DE CRISTAL / AGUA EN LA BASE
            ======================================================== */}
        <path
          d="M26 82 L42 78 L54 84 L70 80 L66 88 L48 94 L30 89 Z"
          fill={`url(#${crystalGradId})`}
          stroke="#bae6fd"
          strokeWidth="0.75"
        />
        {/* Facetas poligonales interiores */}
        <path d="M42 78 L48 94 L54 84 Z" fill="#0284c7" fillOpacity="0.6" />
        <path d="M26 82 L30 89 L42 78 Z" fill="#38bdf8" fillOpacity="0.5" />
        <path d="M54 84 L66 88 L70 80 Z" fill="#0d9488" fillOpacity="0.7" />

        {/* ========================================================
            4. PLANTA VIBRANTE CON HOJAS EN EL LADO IZQUIERDO
            ======================================================== */}
        {/* Tallo */}
        <path d="M38 80 Q36 68 34 58" stroke={`url(#${plantGradId})`} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Hoja 1 (superior izquierda) */}
        <path d="M34 58 C30 54 26 56 26 60 C26 64 32 64 34 58 Z" fill={`url(#${plantGradId})`} />
        {/* Hoja 2 (superior derecha) */}
        <path d="M35 60 C38 56 43 57 43 61 C43 64 37 64 35 60 Z" fill={`url(#${plantGradId})`} />
        {/* Hoja 3 (media izquierda) */}
        <path d="M36 68 C31 66 27 68 28 72 C29 75 35 74 36 68 Z" fill={`url(#${plantGradId})`} />
        {/* Hoja 4 (media derecha) */}
        <path d="M37 70 C41 67 45 69 44 73 C43 76 38 75 37 70 Z" fill={`url(#${plantGradId})`} />

        {/* ========================================================
            5. SILUETA HUMANA ESTILIZADA DE BIENESTAR Y SALUD (YOGA)
            ======================================================== */}
        <g fill="#ffffff">
          {/* Cabeza */}
          <circle cx="53" cy="48" r="3.2" />
          {/* Brazos abiertos hacia el cielo en V de victoria/bienestar */}
          <path
            d="M44 46 C47 52 50 55 53 58 C56 55 59 52 62 46 C60 45 58 48 53 54 C48 48 46 45 44 46 Z"
            fill="#ffffff"
          />
          {/* Torso esbelto */}
          <path d="M51.8 56 L54.2 56 L53.6 70 L52.4 70 Z" fill="#ffffff" />
          {/* Pierna de apoyo vertical */}
          <path d="M52.3 70 L53.7 70 L53.2 82 L52.8 82 Z" fill="#ffffff" />
          {/* Pierna flexionada en postura de árbol / equilibrio */}
          <path d="M53 71 L60 76 L53 78 Z" fill="#ffffff" fillOpacity="0.9" />
        </g>

        {/* Destellos de luz en la gota */}
        <g fill="#ffffff">
          {/* Destello 1 (superior izquierdo) */}
          <path d="M32 30 Q33 33 36 34 Q33 35 32 38 Q31 35 28 34 Q31 33 32 30 Z" opacity="0.9" />
          {/* Destello 2 (inferior) */}
          <path d="M34 88 Q35 90 37 91 Q35 92 34 94 Q33 92 31 91 Q33 90 34 88 Z" opacity="0.8" />
        </g>
      </svg>
    );
  };

  // Renderizado del isotipo: usa la imagen oficial de alta resolución o el SVG si falla
  const renderEmblem = () => {
    if (preferImage && !imageError) {
      return (
        <div className={`relative ${currentSize.imgSize} shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-xs border ${lightMode ? 'border-cyan-400/40 bg-white/10' : 'border-cyan-300/60 bg-white'}`}>
          <img
            src="/aquasalud_official_logo.jpg"
            alt="Logo Oficial AQUA SALUD"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }
    return renderSvgIsotype(currentSize.icon);
  };

  // 1. ISOTIPO ÚNICAMENTE
  if (variant === 'isotipo') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // 2. FAVICON
  if (variant === 'favicon') {
    return (
      <div className="inline-flex items-center justify-center">
        {renderEmblem()}
      </div>
    );
  }

  // 3. COMPLETO (Imagen Oficial Completa con Insignia y Tipografía)
  if (variant === 'completo') {
    return (
      <div className={`inline-flex items-center gap-2 select-none group cursor-pointer ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-cyan-200/80 bg-white">
          <img
            src="/aquasalud_official_logo.jpg"
            alt="AQUA SALUD - Logo Oficial"
            className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    );
  }

  // 4. PRINCIPAL / HORIZONTAL
  return (
    <div
      className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {renderEmblem()}
      </div>

      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-2 leading-none">
          <span
            className={`font-hud font-extrabold tracking-tight ${currentSize.text} ${
              lightMode ? 'text-white' : 'text-[#063B4A]'
            } group-hover:text-[#087E98] transition-colors`}
          >
            AQUA SALUD
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[9px] font-hud font-black uppercase tracking-wider ${
              lightMode
                ? 'bg-cyan-900/60 text-[#8BE6C2] border border-cyan-500/40'
                : 'bg-[#E8F1F4] text-[#087E98] border border-cyan-200'
            }`}
          >
            PRO
          </span>
        </div>

        {showDescriptor && (
          <div className="flex items-center gap-1.5 mt-1 leading-none">
            <span
              className={`font-hud font-bold tracking-widest uppercase ${currentSize.sub} ${
                lightMode ? 'text-[#39C6DD]' : 'text-[#087E98]'
              }`}
            >
              CIENCIA · AGUA · SALUD
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

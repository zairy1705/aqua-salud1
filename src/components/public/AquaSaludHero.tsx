import React, { useRef, useEffect } from 'react';

interface AquaSaludHeroProps {
  onLearnMore: () => void;
  onOurServices: () => void;
  onEnterPlatform: () => void;
  onOpenDashboard?: () => void;
  onCalculateChlorine?: () => void;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
}

export const AquaSaludHero: React.FC<AquaSaludHeroProps> = ({
  onOurServices,
  onEnterPlatform,
  onCalculateChlorine,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const handleCloracionClick = () => {
    if (onCalculateChlorine) {
      onCalculateChlorine();
    } else {
      onEnterPlatform();
    }
  };

  // Ajustar la velocidad de reproducción del video a movimiento sutil
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
  }, []);

  // Canvas para ondas sutiles y microburbujas translúcidas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Burbujas sutiles y reducidas
    bubblesRef.current = [];
    for (let i = 0; i < 12; i++) {
      bubblesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 0.4 + 0.2, // Ascenso suave y tranquilo
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.35 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar y actualizar ondas sutiles
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha -= 0.007; // Desvanecimiento más suave

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Onda interior muy ligera
        if (r.radius > 20) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14, 165, 233, ${r.alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Dibujar y actualizar microburbujas
      for (const b of bubblesRef.current) {
        b.y -= b.speedY;
        b.x += b.speedX;

        if (b.y < -15) {
          b.y = height + 15;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${b.alpha * 0.6})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(186, 230, 253, ${b.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Brillo puntual sutil
        ctx.beginPath();
        ctx.arc(b.x - b.size * 0.28, b.y - b.size * 0.28, b.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Interacción suave: ondas delicadas
  const handleInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 75 + Math.random() * 30,
      alpha: 0.5, // Mucho más sutil
      speed: 1.4 + Math.random() * 0.8,
    });
  };

  return (
    <section
      onMouseMove={(e) => {
        // Ondulación ocasional y muy delicada
        if (Math.random() < 0.02) {
          handleInteraction(e.clientX, e.clientY);
        }
      }}
      onClick={(e) => {
        handleInteraction(e.clientX, e.clientY);
      }}
      className="relative overflow-hidden text-slate-900 border-b border-cyan-100 min-h-[calc(100vh-100px)] flex flex-col justify-center items-center py-12 sm:py-16 select-none cursor-default"
    >
      {/* =========================================================================
          1. FONDO DE VIDEO: AGUA TURQUESA CON MOVIMIENTO ULTRA SUTIL Y SERENO
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 0.45;
            }
          }}
          poster="/aqua_swirling_water_poster.jpg"
          className="w-full h-full object-cover object-center scale-102 filter brightness-[0.98] saturate-[1.05] opacity-85 transition-opacity duration-1000"
        >
          <source src="/aqua_swirling_water.mp4" type="video/mp4" />
        </video>

        {/* Capa de atmósfera sedosa y filtro de agua sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9ff]/75 via-[#e0f2fe]/45 to-[#f8fafc]/80 backdrop-blur-[1px]" />
        
        {/* Luces etéreas sutiles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      {/* =========================================================================
          2. CANVAS DE ONDAS Y BURBUJAS LIGERAS
          ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      />

      {/* =========================================================================
          3. CONTENIDO PRINCIPAL: TARJETA CRISTALINA GLASSMORPHISM DE ALTO CONTRASTE
          ========================================================================= */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 relative z-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="backdrop-blur-xl bg-white/92 sm:bg-white/95 border border-white/90 shadow-[0_20px_50px_rgba(6,59,74,0.14)] rounded-3xl p-6 sm:p-10 text-center space-y-6 flex flex-col items-center transition-all hover:shadow-[0_25px_60px_rgba(6,59,74,0.18)]"
        >
          {/* Badge Superior Oficial */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50/90 border border-cyan-200 shadow-2xs text-[#005f73] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[17px] text-[#0077b6]">security</span>
              <span>PLATAFORMA CIENTÍFICA & TECNOLÓGICA</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            </div>
          </div>

          {/* Subtítulo: CIENCIA · AQUA · SALUD con líneas degradadas a los lados */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-0.5 w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#00b4d8] inline-block rounded-full" />
            <span className="font-hud font-extrabold text-[12px] sm:text-[14px] tracking-[0.24em] text-[#0077b6] uppercase">
              CIENCIA · AQUA · SALUD
            </span>
            <span className="h-0.5 w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#10b981] inline-block rounded-full" />
          </div>

          {/* Título Gigante Oficial: AQUA (celeste/cian) SALUD (verde esmeralda) */}
          <h1 className="font-hud font-black text-[50px] sm:text-[68px] lg:text-[76px] leading-[0.95] tracking-tight">
            <span className="text-[#0077b6]">AQUA </span>
            <span className="text-[#059669]">SALUD</span>
          </h1>

          {/* Titular descriptivo oscuro de alto contraste */}
          <h2 className="font-hud font-bold text-[24px] sm:text-[32px] lg:text-[36px] text-slate-900 tracking-tight leading-snug max-w-2xl">
            Tecnología para garantizar agua segura
          </h2>

          {/* Párrafo explicativo con excelente legibilidad */}
          <p className="text-[15.5px] sm:text-[17px] text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Soluciones digitales, análisis y herramientas inteligentes para la gestión integral de la calidad del agua, conectando operadores rurales, laboratorios analíticos y gobiernos locales.
          </p>

          {/* BOTONES DE ACCIÓN (Exacto diseño de la portada institucional) */}
          <div className="flex flex-col items-center gap-3.5 pt-2 max-w-2xl mx-auto w-full">
            {/* Fila 1: Dos botones horizontales */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
              {/* Botón 1: Verde CALCULAR CLORACIÓN (CLORAGUA) */}
              <button
                type="button"
                onClick={handleCloracionClick}
                className="px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-hud text-[12px] sm:text-[12.5px] font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(5,150,105,0.28)] hover:shadow-[0_10px_25px_rgba(4,120,87,0.38)] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">calculate</span>
                <span>CALCULAR CLORACIÓN (CLORAGUA)</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>

              {/* Botón 2: Blanco con borde EXPLORAR SERVICIOS */}
              <button
                type="button"
                onClick={onOurServices}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-cyan-50 text-[#004e60] border-2 border-cyan-300 font-hud text-[12px] sm:text-[12.5px] font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px] text-[#0077b6]">science</span>
                <span>EXPLORAR SERVICIOS</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </div>

            {/* Fila 2: Botón institucional azul centrado abajo */}
            <button
              type="button"
              onClick={onEnterPlatform}
              className="px-8 py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-hud text-[11.5px] sm:text-[12px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(2,132,199,0.25)] hover:shadow-[0_10px_25px_rgba(3,105,161,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-cyan-100">lock</span>
              <span>INGRESAR A LA PLATAFORMA</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

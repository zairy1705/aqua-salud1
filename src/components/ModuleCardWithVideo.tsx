import React, { useRef, useState } from 'react';

interface ModuleCardWithVideoProps {
  title: string;
  category: string;
  categoryIcon: string;
  badgeText: string;
  badgeClass: string;
  imageSrc: string;
  videoSrc: string;
  description: string;
  actionText: string;
  actionIcon: string;
  onAction: () => void;
}

export const ModuleCardWithVideo: React.FC<ModuleCardWithVideoProps> = ({
  title,
  category,
  categoryIcon,
  badgeText,
  badgeClass,
  imageSrc,
  videoSrc,
  description,
  actionText,
  actionIcon,
  onAction,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Play request interrupted or browser prevented auto-play
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTogglePlayTouch = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsHovered(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsHovered(true);
        })
        .catch(() => {});
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-[#bcc9ce]/40 hover:border-[#00b4d8] transition-all duration-300 flex flex-col justify-between"
    >
      {/* Visual Container with Image & Hover Animated Video */}
      <div
        onClick={handleTogglePlayTouch}
        className="relative aspect-4/3 overflow-hidden bg-slate-950 cursor-pointer select-none"
        title="Pasa el cursor para animar con video interactivo"
      >
        {/* Base Static Poster Image */}
        <img
          src={imageSrc}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
          loading="lazy"
        />

        {/* Hover Loop Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={imageSrc}
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Top-Left Category / Status Badge */}
        <span
          className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white font-hud text-[10px] font-extrabold shadow-md pointer-events-none ${badgeClass}`}
        >
          {badgeText}
        </span>

        {/* Top-Right Video Indicator Badge */}
        <div
          className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-hud font-extrabold uppercase tracking-wider backdrop-blur-md transition-all duration-200 pointer-events-none ${
            isHovered
              ? 'bg-[#10e7b2]/90 text-[#002b1f] shadow-md scale-105'
              : 'bg-black/50 text-white/90 border border-white/20'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isHovered ? 'bg-[#002b1f] animate-ping' : 'bg-cyan-400'
            }`}
          />
          <span>{isHovered ? 'ANIMACIÓN EN VIVO' : 'HOVER VÍDEO'}</span>
        </div>

        {/* Subtle Bottom Hover Cue */}
        <div
          className={`absolute bottom-2 inset-x-3 z-10 py-1 px-2.5 rounded-lg bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-hud font-bold flex items-center justify-between transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#10e7b2]">
              play_circle
            </span>
            <span>Laboratorio Activo</span>
          </span>
          <span className="text-[9px] text-cyan-300 font-mono">30 FPS • CLORAGUA</span>
        </div>
      </div>

      {/* Card Content & Action Button */}
      <div className="p-4 sm:p-4.5 flex flex-col gap-2.5 flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[#00677d]">
            <span className="material-symbols-outlined text-[16px]">{categoryIcon}</span>
            <span className="text-[11px] font-hud font-extrabold uppercase tracking-wide">
              {category}
            </span>
          </div>

          <h3 className="font-extrabold text-[15px] text-[#151d22] mt-0.5 group-hover:text-[#00677d] transition-colors tracking-tight">
            {title}
          </h3>

          <p className="text-[12px] text-[#3d494d] mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-[#00b4d8] hover:to-[#10e7b2] text-[#00677d] hover:text-[#002b1f] border border-cyan-200/60 hover:border-transparent font-hud text-[11.5px] font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-[0_4px_16px_rgba(0,180,216,0.35)] active:scale-98 cursor-pointer group/btn"
        >
          <span className="material-symbols-outlined text-[16px] group-hover/btn:scale-110 transition-transform">{actionIcon}</span>
          <span>{actionText}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PublicNavSection } from '../../types';
import { AquaSaludLogo } from '../common/AquaSaludLogo';
import {
  subscribeCalypso,
  toggleCalypso as toggleCalypsoAudio,
  soundService,
} from '../../utils/audioSystem';

interface AquaSaludHeaderProps {
  currentSection: PublicNavSection;
  onNavigateSection: (section: PublicNavSection) => void;
  onEnterPlatform: () => void;
  isInsidePlatform?: boolean;
  onReturnToPublic?: () => void;
  onOpenQuoteModal?: () => void;
  onNavigateCrm?: () => void;
  onOpenE2ETestModal?: () => void;
}

export const AquaSaludHeader: React.FC<AquaSaludHeaderProps> = ({
  currentSection,
  onNavigateSection,
  onEnterPlatform,
  isInsidePlatform = false,
  onReturnToPublic,
  onOpenQuoteModal,
  onNavigateCrm,
  onOpenE2ETestModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCalypsoPlaying, setIsCalypsoPlaying] = useState(false);
  const [isGameSoundActive, setIsGameSoundActive] = useState(true);

  useEffect(() => {
    const unsubCalypso = subscribeCalypso((active) => {
      setIsCalypsoPlaying(active);
    });
    const unsubSound = soundService.subscribe((muted) => {
      setIsGameSoundActive(!muted);
    });
    return () => {
      unsubCalypso();
      unsubSound();
    };
  }, []);

  const navItems: { id: PublicNavSection; label: string; icon: string }[] = [
    { id: 'inicio', label: 'INICIO', icon: 'home' },
    { id: 'nosotros', label: 'NOSOTROS', icon: 'groups' },
    { id: 'ecosistema', label: 'ECOSISTEMA', icon: 'hub' },
    { id: 'servicios', label: 'SERVICIOS', icon: 'science' },
    { id: 'soluciones', label: 'SOLUCIONES', icon: 'domain' },
    { id: 'recursos', label: 'RECURSOS', icon: 'menu_book' },
    { id: 'contacto', label: 'CONTACTO', icon: 'contact_support' },
  ];

  const whatsappUrl =
    'https://wa.me/51920221581?text=Hola%20AQUA%20SALUD,%20solicito%20apoyo%20t%C3%A9cnico%20y%20asesor%C3%ADa%20en%20gesti%C3%B3n%20de%20agua%20segura.';
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61594489960322';
  const instagramUrl = 'https://www.instagram.com/aqua.salud.lab/';

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-cyan-900/10 shadow-[0_4px_24px_rgba(6,59,74,0.06)]">
      {/* Top Banner with Social Media (Facebook, Instagram), WhatsApp & Slogan */}
      <div className="bg-gradient-to-r from-[#063B4A] via-[#087E98] to-[#031E26] text-white py-1.5 px-4 text-[11px] sm:text-[12px] font-hud">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <span className="font-semibold text-[#8BE6C2] hidden sm:inline shrink-0">
              AQUA SALUD:
            </span>
            <span className="font-medium text-white tracking-wide truncate">
              Tecnología para el agua segura • CIENCIA · AGUA · SALUD
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Facebook Link */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1877F2]/25 hover:bg-[#1877F2]/40 border border-[#1877F2]/60 text-white font-bold transition-all text-[11px] shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Síguenos en Facebook: AQUA SALUD"
              aria-label="Facebook de AQUA SALUD"
            >
              <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="hidden md:inline">Facebook</span>
            </a>

            {/* Instagram Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/30 to-[#F77737]/30 hover:from-[#833AB4]/50 hover:via-[#FD1D1D]/50 hover:to-[#F77737]/50 border border-pink-400/50 text-white font-bold transition-all text-[11px] shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Síguenos en Instagram: @aqua.salud.lab"
              aria-label="Instagram de AQUA SALUD"
            >
              <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="hidden md:inline">Instagram</span>
            </a>

            {/* WhatsApp Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white font-bold transition-all text-[11px]"
              title="Abrir WhatsApp oficial de soporte técnico"
            >
              <span className="material-symbols-outlined text-[15px] text-[#25D366]">chat</span>
              <span className="hidden lg:inline">Soporte directo:</span>
              <span className="text-[#25D366] font-extrabold tracking-wider">920221581</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Official Brand Identity */}
        <div
          onClick={() => {
            if (isInsidePlatform && onReturnToPublic) {
              onReturnToPublic();
            } else {
              onNavigateSection('inicio');
            }
          }}
          className="cursor-pointer select-none"
          title="Ir al inicio de AQUA SALUD"
        >
          <AquaSaludLogo variant="principal" size="md" showDescriptor={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navItems.map((item) => {
            const isActive = !isInsidePlatform && currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isInsidePlatform && onReturnToPublic) {
                    onReturnToPublic();
                  }
                  onNavigateSection(item.id);
                }}
                className={`px-2 xl:px-3 py-1.5 xl:py-2 rounded-xl font-hud text-[11px] xl:text-[11.5px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#063B4A] bg-[#E8F1F4] border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-[#087E98] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Calypso BGM Tropical Synth Button */}
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => toggleCalypsoAudio()}
              className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-full border flex items-center gap-1.5 transition-all duration-300 shadow-2xs active:scale-95 cursor-pointer select-none ${
                isCalypsoPlaying
                  ? 'bg-gradient-to-r from-[#10e7b2]/30 via-[#00b4d8]/25 to-[#caf300]/25 hover:from-[#10e7b2]/50 hover:to-[#00b4d8]/40 border-[#10e7b2] text-[#004e5f] shadow-[0_0_16px_rgba(16,231,178,0.45)]'
                  : 'bg-[#edf5fc] hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 border-[#bcc9ce]/50 hover:border-[#00b4d8] text-[#486572] hover:text-[#00677d] hover:shadow-[0_2px_12px_rgba(0,180,216,0.25)]'
              }`}
              title={
                isCalypsoPlaying
                  ? 'Pausar música Calypso Tropical'
                  : 'Reproducir música Calypso Tropical (Sintetizador en Vivo)'
              }
              aria-label="Control BGM Calypso Tropical"
            >
              <span
                className={`material-symbols-outlined text-[18px] sm:text-[19px] ${
                  isCalypsoPlaying ? 'animate-bounce text-[#00b4d8]' : 'text-slate-500 hover:text-[#00b4d8]'
                }`}
              >
                {isCalypsoPlaying ? 'music_note' : 'music_off'}
              </span>
              <span className="font-hud text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider hidden md:inline">
                CALYPSO
              </span>
              {isCalypsoPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-[#10e7b2] rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2.5"></span>
                  <span className="w-1 bg-[#00b4d8] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5"></span>
                  <span className="w-1 bg-[#caf300] rounded-full animate-[pulse_0.3s_ease-in-out_infinite] h-2"></span>
                </div>
              )}
            </button>
          </div>

          {/* Game sounds / SFX toggle */}
          <button
            type="button"
            onClick={() => soundService.toggleSound()}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 shadow-2xs active:scale-95 cursor-pointer relative ${
              !isGameSoundActive
                ? 'bg-[#edf5fc] hover:bg-[#ffe8ec] border-[#bcc9ce]/50 hover:border-rose-400 text-[#71828a] hover:text-rose-600'
                : 'bg-[#10e7b2]/20 hover:bg-[#10e7b2]/40 border-[#10e7b2] hover:border-[#00b4d8] text-[#006c51] hover:text-[#004e5f] shadow-[0_0_12px_rgba(16,231,178,0.4)]'
            }`}
            title={
              !isGameSoundActive
                ? 'Sonidos de interfaz desactivados (Clic para activar)'
                : 'Sonidos de interfaz activados (Clic para silenciar)'
            }
            aria-label="Control Efectos de Sonido"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {!isGameSoundActive ? 'volume_off' : 'sports_esports'}
            </span>
            {isGameSoundActive && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10e7b2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b4d8]"></span>
              </span>
            )}
          </button>

          {onOpenQuoteModal && (
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-[#E8F1F4] hover:bg-cyan-100 text-[#063B4A] border border-cyan-200 font-hud text-[11px] sm:text-[11.5px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#087E98]">request_quote</span>
              <span className="hidden sm:inline">Cotizar Servicio</span>
            </button>
          )}

          {isInsidePlatform ? (
            <button
              type="button"
              onClick={onReturnToPublic}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#063B4A] font-hud text-[11.5px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span className="hidden sm:inline">Portal Público</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onEnterPlatform}
              className="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#087E98] to-[#10B981] hover:from-[#063B4A] hover:to-[#087E98] text-white font-hud text-[12px] sm:text-[12.5px] font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(8,126,152,0.3)] hover:shadow-[0_6px_20px_rgba(8,126,152,0.45)] active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#8BE6C2]">verified</span>
              <span>INGRESAR A LA PLATAFORMA</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#063B4A] cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isInsidePlatform && onReturnToPublic) {
                  onReturnToPublic();
                }
                onNavigateSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-hud text-[13px] font-bold text-left cursor-pointer ${
                !isInsidePlatform && currentSection === item.id
                  ? 'bg-cyan-50 text-[#087E98] border border-cyan-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-[#087E98]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {onOpenQuoteModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenQuoteModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#E8F1F4] border border-cyan-200 text-[#063B4A] font-hud text-[12.5px] font-bold uppercase text-center flex items-center justify-center gap-2 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px] text-[#087E98]">request_quote</span>
                <span>Solicitar Cotización de Servicios</span>
              </button>
            )}

            {/* Social Media Links in Mobile Drawer */}
            <div className="pt-2 pb-1">
              <span className="block text-[11px] font-hud font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
                Síguenos en Redes Sociales:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1877F2] text-white text-[12px] font-hud font-bold shadow-xs hover:bg-[#166fe5] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-[12px] font-hud font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Audio Controls in Mobile Drawer */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="block text-[11px] font-hud font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
                Ambiente Sonoro y Música:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCalypsoAudio()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-[11.5px] font-hud font-bold transition-all cursor-pointer ${
                    isCalypsoPlaying
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400 text-teal-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isCalypsoPlaying ? 'animate-bounce text-[#00b4d8]' : 'text-slate-500'}`}>
                    {isCalypsoPlaying ? 'music_note' : 'music_off'}
                  </span>
                  <span>{isCalypsoPlaying ? 'Pausar Calypso BGM' : 'Música Calypso'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => soundService.toggleSound()}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center text-[11.5px] font-hud font-bold transition-all cursor-pointer ${
                    isGameSoundActive
                      ? 'bg-cyan-50 border-cyan-300 text-[#00677d]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                  title={isGameSoundActive ? 'Silenciar Efectos' : 'Activar Efectos'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isGameSoundActive ? 'sports_esports' : 'volume_off'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onEnterPlatform();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#087E98] to-[#10B981] text-white font-hud text-[13px] font-black uppercase text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#8BE6C2]">verified</span>
              <span>INGRESAR A LA PLATAFORMA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

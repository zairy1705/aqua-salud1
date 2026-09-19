import React, { useState } from 'react';
import { PublicNavSection } from '../../types';

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

  const navItems: { id: PublicNavSection; label: string; icon: string }[] = [
    { id: 'inicio', label: 'INICIO', icon: 'home' },
    { id: 'nosotros', label: 'NOSOTROS', icon: 'groups' },
    { id: 'servicios', label: 'SERVICIOS', icon: 'science' },
    { id: 'sectores', label: 'SECTORES', icon: 'domain' },
    { id: 'recursos', label: 'RECURSOS', icon: 'menu_book' },
    { id: 'contacto', label: 'CONTACTO', icon: 'contact_support' },
  ];

  const whatsappUrl =
    'https://wa.me/51920221581?text=Hola%20Aqua-salud,%20estoy%20interesado%20en%20apoyo%20t%C3%A9cnico.%20Me%20gustar%C3%ADa%20solicitar%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios.';

  return (
    <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-cyan-900/10 shadow-[0_4px_24px_rgba(0,103,125,0.06)]">
      {/* Top Banner with WhatsApp direct link */}
      <div className="bg-gradient-to-r from-[#003d4c] via-[#00677d] to-[#004e5f] text-white py-1.5 px-4 text-[11px] sm:text-[12px] font-hud flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10e7b2] animate-pulse"></span>
            <span className="font-medium text-cyan-100 hidden sm:inline">
              Vigilancia Sanitaria y Gestión Territorial del Agua
            </span>
            <span className="font-bold text-white tracking-wide">
              "Del control del agua a la protección de la salud."
            </span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white font-bold transition-all"
            title="Abrir WhatsApp oficial"
          >
            <span className="material-symbols-outlined text-[15px] text-[#25D366]">chat</span>
            <span className="hidden md:inline">WhatsApp — Soporte técnico:</span>
            <span className="text-[#25D366] font-extrabold tracking-wider">920221581</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div
          onClick={() => {
            if (isInsidePlatform && onReturnToPublic) {
              onReturnToPublic();
            } else {
              onNavigateSection('inicio');
            }
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Ir al inicio de AQUA-SALUD"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(0,180,216,0.35)] group-hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[26px]">water_drop</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10e7b2] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#002b1f]">
              ✓
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-hud font-extrabold text-[20px] sm:text-[23px] text-[#003d4c] tracking-tight group-hover:text-[#00677d] transition-colors leading-none">
                AQUA-SALUD
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100/80 text-[#00677d] text-[10px] font-hud font-bold border border-cyan-200">
                TERRITORIAL
              </span>
            </div>
            <span className="text-[11px] text-[#00677d] font-semibold mt-1 leading-none font-hud">
              Sistema Inteligente de Vigilancia
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = !isInsidePlatform && currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isInsidePlatform && onReturnToPublic) {
                    onReturnToPublic();
                  }
                  onNavigateSection(item.id);
                }}
                className={`px-3.5 py-2 rounded-xl font-hud text-[12px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#00677d] bg-cyan-50 border border-cyan-200 shadow-xs'
                    : 'text-[#475569] hover:text-[#00677d] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">


          {onOpenQuoteModal && (
            <button
              onClick={onOpenQuoteModal}
              className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#00677d] border border-cyan-200 font-hud text-[11.5px] sm:text-[12px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[17px] text-[#00677d]">request_quote</span>
              <span className="hidden sm:inline">Cotizar Servicio</span>
            </button>
          )}

          {isInsidePlatform ? (
            <button
              onClick={onReturnToPublic}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#004e5f] font-hud text-[11.5px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span className="hidden sm:inline">Portal Público</span>
            </button>
          ) : (
            <button
              onClick={onEnterPlatform}
              className="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#002b1f] font-hud text-[12px] sm:text-[13px] font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(16,231,178,0.35)] hover:shadow-[0_6px_20px_rgba(16,231,178,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>ACCEDER A AQUA-SALUD</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#003d4c] cursor-pointer"
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (isInsidePlatform && onReturnToPublic) {
                  onReturnToPublic();
                }
                onNavigateSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-hud text-[13px] font-bold text-left cursor-pointer ${
                !isInsidePlatform && currentSection === item.id
                  ? 'bg-cyan-50 text-[#00677d] border border-cyan-200'
                  : 'text-[#475569] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] text-[#00677d]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {onOpenQuoteModal && (
              <button
                onClick={() => {
                  onOpenQuoteModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-[#00677d] font-hud text-[12.5px] font-bold uppercase text-center flex items-center justify-center gap-2 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px]">request_quote</span>
                <span>Solicitar Cotización de Servicios</span>
              </button>
            )}

            <button
              onClick={() => {
                onEnterPlatform();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#002b1f] font-hud text-[13px] font-black uppercase text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Acceder a la Plataforma Operativa</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

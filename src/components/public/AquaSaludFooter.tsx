import React from 'react';
import { PublicNavSection } from '../../types';
import { LegalModalType } from './LegalModal';
import { AquaSaludLogo } from '../common/AquaSaludLogo';

interface AquaSaludFooterProps {
  onNavigateSection: (section: PublicNavSection) => void;
  onOpenLegal: (type: LegalModalType) => void;
  onEnterPlatform: () => void;
  onOpenQuoteModal?: () => void;
}

export const AquaSaludFooter: React.FC<AquaSaludFooterProps> = ({
  onNavigateSection,
  onOpenLegal,
  onEnterPlatform,
  onOpenQuoteModal,
}) => {
  const whatsappNumber = '920221581';
  const whatsappFullNumber = '51920221581';
  const exactWhatsappMessage =
    'Hola Aqua-salud, estoy interesado en apoyo técnico. Me gustaría solicitar más información sobre sus servicios.';
  const whatsappUrl = `https://wa.me/${whatsappFullNumber}?text=${encodeURIComponent(exactWhatsappMessage)}`;
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61594489960322';
  const instagramUrl = 'https://www.instagram.com/aqua.salud.lab/';

  return (
    <footer id="contacto" className="bg-[#031E26] text-white border-t border-cyan-900/50 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Brand Title & Isotype + Social Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-cyan-800/40">
          <div className="flex items-center gap-3">
            <AquaSaludLogo variant="principal" size="lg" lightMode={true} showDescriptor={true} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Social Buttons in Header */}
            <div className="flex items-center gap-2 pr-2 border-r border-cyan-800/50">
              <span className="text-[11.5px] font-hud font-bold text-cyan-300 uppercase tracking-wider hidden md:inline">
                Redes:
              </span>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] text-white border border-[#1877F2]/40 hover:border-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Síguenos en Facebook: AQUA SALUD"
                aria-label="Facebook de AQUA SALUD"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-pink-500/20 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-white border border-pink-400/40 hover:border-transparent flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Síguenos en Instagram: @aqua.salud.lab"
                aria-label="Instagram de AQUA SALUD"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            <button
              type="button"
              onClick={onEnterPlatform}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#087E98] to-[#10B981] hover:from-[#10B981] hover:to-[#8BE6C2] text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#8BE6C2]">verified</span>
              <span>Ingresar a la Plataforma Operativa</span>
            </button>
          </div>
        </div>

        {/* 4 Main Grid Columns: CONTACTO | NAVEGACIÓN | PIDE TU COTIZACIÓN | WHATSAPP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: CONTACTO */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#39C6DD] text-[18px]">location_on</span>
              <span>CONTACTO</span>
            </h3>

            <div className="space-y-3 text-[13px] text-cyan-100/90 leading-relaxed">
              <div>
                <span className="block font-hud font-bold text-white text-[11.5px] uppercase tracking-wider text-cyan-300">
                  Dirección:
                </span>
                <p className="text-[13px] text-cyan-100/90 mt-0.5">
                  Semi Rustica la Merced N 14, Trujillo, Trujillo
                </p>
              </div>

              <div>
                <span className="block font-hud font-bold text-white text-[11.5px] uppercase tracking-wider text-cyan-300">
                  Teléfono:
                </span>
                <a
                  href="tel:044271558"
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#10B981] font-hud font-bold text-[14px] transition-colors mt-0.5 underline underline-offset-2"
                  title="Llamar al laboratorio"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#10B981]">call</span>
                  <span>044 271558</span>
                </a>
              </div>

              <div>
                <span className="block font-hud font-bold text-white text-[11.5px] uppercase tracking-wider text-cyan-300">
                  Correo:
                </span>
                <a
                  href="mailto:aqua.salud.lab@gmail.com"
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#10B981] font-medium text-[13px] transition-colors mt-0.5 underline underline-offset-2 break-all"
                  title="Enviar correo a aqua.salud.lab@gmail.com"
                >
                  <span className="material-symbols-outlined text-[16px] text-cyan-400">mail</span>
                  <span>aqua.salud.lab@gmail.com</span>
                </a>
              </div>

              <div className="pt-1">
                <span className="block font-hud font-bold text-white text-[11.5px] uppercase tracking-wider text-cyan-300 mb-1.5">
                  Redes Sociales:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] text-white border border-[#1877F2]/50 text-[11.5px] font-hud font-bold transition-all cursor-pointer"
                    title="Facebook: AQUA SALUD"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] text-white border border-pink-400/50 text-[11.5px] font-hud font-bold transition-all cursor-pointer"
                    title="Instagram: @aqua.salud.lab"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: NAVEGACIÓN */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#39C6DD] text-[18px]">explore</span>
              <span>NAVEGACIÓN</span>
            </h3>

            <ul className="space-y-2 text-[13px] text-cyan-200/90 font-hud">
              {[
                { id: 'inicio' as PublicNavSection, label: 'Inicio' },
                { id: 'ecosistema' as PublicNavSection, label: 'Ecosistema Modular' },
                { id: 'servicios' as PublicNavSection, label: 'Servicios de Calidad' },
                { id: 'soluciones' as PublicNavSection, label: 'Soluciones ATM & JASS' },
                { id: 'nosotros' as PublicNavSection, label: 'Nosotros & Misión' },
                { id: 'recursos' as PublicNavSection, label: 'Manuales & Normativa' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateSection(link.id)}
                    className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 py-0.5 text-left"
                  >
                    <span className="text-[#10B981] text-[11px] font-bold">▸</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: PIDE TU COTIZACIÓN */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">request_quote</span>
              <span>PIDE TU COTIZACIÓN</span>
            </h3>

            <p className="text-[12.5px] text-cyan-100/80 leading-relaxed">
              Solicite cotización para análisis de agua, calibración de dosificadores y vigilancia según D.S. N.° 031-2010-SA.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#087E98] to-[#10B981] hover:from-[#10B981] hover:to-[#8BE6C2] text-[#031E26] font-hud text-[12px] sm:text-[12.5px] font-black uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
                <span>Solicitar Cotización</span>
              </button>
              <span className="block mt-2 text-[11px] text-cyan-300/70 text-center font-hud">
                Envío oficial directo a aqua.salud.lab@gmail.com
              </span>
            </div>
          </div>

          {/* Col 4: WHATSAPP */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#25D366] text-[18px]">chat</span>
              <span>WHATSAPP</span>
            </h3>

            <div className="space-y-2 text-[12.5px] text-cyan-100/85 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="font-hud font-bold text-cyan-300 text-[11.5px] uppercase">
                  Número:
                </span>
                <span className="font-hud font-extrabold text-white text-[14px]">
                  {whatsappNumber}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-cyan-800/50 text-[11.5px] text-cyan-100/90 italic">
                "{exactWhatsappMessage}"
              </div>

              <div className="pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-hud text-[12px] font-extrabold uppercase tracking-wide shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Contactar WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DESTACADA: REDES SOCIALES OFICIALES (FACEBOOK & INSTAGRAM) */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-[#063B4A] to-slate-900 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-[#8BE6C2] font-hud text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                <span className="material-symbols-outlined text-[15px]">share</span>
                <span>Canales Oficiales & Redes</span>
              </div>
              <h4 className="font-hud font-extrabold text-[20px] sm:text-[23px] text-white tracking-tight leading-snug">
                Síguenos en Redes Sociales
              </h4>
              <p className="text-[13px] text-cyan-100/85 mt-1.5 leading-relaxed font-normal">
                Conoce nuestras actividades técnicas en campo, capacitaciones a operadores JASS, infografías de calidad de agua y avisos normativos en Facebook e Instagram.
              </p>
            </div>

            {/* Tarjetas Interactivas de Facebook e Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto">
              {/* Tarjeta Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#1877F2]/40 hover:border-[#1877F2] transition-all duration-200 group flex flex-col justify-between sm:min-w-[270px] shadow-sm hover:shadow-[0_8px_24px_rgba(24,119,242,0.3)] hover:-translate-y-0.5 cursor-pointer"
                title="Visitar Facebook oficial de AQUA SALUD"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-hud font-extrabold text-white text-[14.5px] leading-tight block group-hover:text-cyan-200 transition-colors">
                        Facebook Oficial
                      </span>
                      <span className="text-[11.5px] text-cyan-300/90 font-mono">
                        AQUA SALUD
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[18px]">
                    open_in_new
                  </span>
                </div>
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11.5px]">
                  <span className="text-cyan-200/80 font-hud">Comunidad & Noticias</span>
                  <span className="text-[#39C6DD] font-hud font-bold group-hover:underline flex items-center gap-1">
                    <span>Visitar Facebook</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              </a>

              {/* Tarjeta Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-pink-400/40 hover:border-pink-400 transition-all duration-200 group flex flex-col justify-between sm:min-w-[270px] shadow-sm hover:shadow-[0_8px_24px_rgba(238,42,123,0.3)] hover:-translate-y-0.5 cursor-pointer"
                title="Visitar Instagram oficial de AQUA SALUD (@aqua.salud.lab)"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-hud font-extrabold text-white text-[14.5px] leading-tight block group-hover:text-pink-200 transition-colors">
                        Instagram Oficial
                      </span>
                      <span className="text-[11.5px] text-pink-300 font-mono">
                        @aqua.salud.lab
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[18px]">
                    open_in_new
                  </span>
                </div>
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11.5px]">
                  <span className="text-cyan-200/80 font-hud">Fotometría & Trabajo Rural</span>
                  <span className="text-pink-300 font-hud font-bold group-hover:underline flex items-center gap-1">
                    <span>Visitar Instagram</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA (Strict text formatting) */}
        <div className="pt-8 text-center text-[12px] sm:text-[12.5px] text-cyan-200/80 space-y-2">
          {/* Quick social bar in copyright */}
          <div className="flex items-center justify-center gap-3 pb-2">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-white transition-colors flex items-center gap-1 text-[12px] font-hud"
              title="Facebook oficial"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
            <span className="text-cyan-700">•</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-white transition-colors flex items-center gap-1 text-[12px] font-hud"
              title="Instagram oficial"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
            <span className="text-cyan-700">•</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-white transition-colors flex items-center gap-1 text-[12px] font-hud font-bold"
              title="WhatsApp oficial"
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
          <p className="font-hud font-bold text-white text-[13px] tracking-wide">
            © 2026 AQUA SALUD LABORATORIO
          </p>
          <p className="text-cyan-200/90">
            Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[12px]">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#10B981] transition-colors underline cursor-pointer"
            >
              Política de Privacidad
            </button>
            <span className="text-cyan-600">|</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#10B981] transition-colors underline cursor-pointer"
            >
              Términos de Uso
            </button>
            <span className="text-cyan-600">|</span>
            <button
              type="button"
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-[#10B981] transition-colors underline cursor-pointer"
            >
              Política de Cookies
            </button>
          </div>

          <p className="pt-3 text-[12px] text-cyan-300/90 font-medium">
            Diseñado y desarrollado por Ing. Zaira Salvador Amaya - Casa SERPENTIS.
          </p>
        </div>
      </div>
    </footer>
  );
};

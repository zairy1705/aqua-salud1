import React from 'react';
import { PublicNavSection } from '../../types';
import { LegalModalType } from './LegalModal';

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

  return (
    <footer id="contacto" className="bg-[#00242e] text-white border-t border-cyan-900/50 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Brand Title: 💧 AQUA-SALUD LABORATORIO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-cyan-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#10e7b2] flex items-center justify-center text-[#002116] shadow-md font-bold shrink-0">
              <span className="material-symbols-outlined text-[26px]">water_drop</span>
            </div>
            <div>
              <h2 className="font-hud font-extrabold text-[22px] sm:text-[26px] text-white tracking-tight flex items-center gap-2">
                <span>💧</span>
                <span>AQUA-SALUD LABORATORIO</span>
              </h2>
              <p className="text-[12px] sm:text-[13px] text-cyan-300 font-hud font-medium">
                Vigilancia analítica, control sanitario y certificación fisicoquímica y microbiológica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onEnterPlatform}
              className="px-4 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#10e7b2]">speed</span>
              <span>Consola Operativa JASS</span>
            </button>
          </div>
        </div>

        {/* 4 Main Grid Columns: CONTACTO | NAVEGACIÓN | PIDE TU COTIZACIÓN | WHATSAPP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: CONTACTO */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">location_on</span>
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
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#10e7b2] font-hud font-bold text-[14px] transition-colors mt-0.5 underline underline-offset-2"
                  title="Llamar al laboratorio"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#10e7b2]">call</span>
                  <span>044 271558</span>
                </a>
              </div>

              <div>
                <span className="block font-hud font-bold text-white text-[11.5px] uppercase tracking-wider text-cyan-300">
                  Correo:
                </span>
                <a
                  href="mailto:aqua.salud.lab@gmail.com"
                  className="inline-flex items-center gap-1.5 text-white hover:text-[#10e7b2] font-medium text-[13px] transition-colors mt-0.5 underline underline-offset-2 break-all"
                  title="Enviar correo a aqua.salud.lab@gmail.com"
                >
                  <span className="material-symbols-outlined text-[16px] text-cyan-400">mail</span>
                  <span>aqua.salud.lab@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: NAVEGACIÓN */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">explore</span>
              <span>NAVEGACIÓN</span>
            </h3>

            <ul className="space-y-2.5 text-[13.5px] text-cyan-200/90 font-hud">
              {[
                { id: 'inicio' as PublicNavSection, label: 'Inicio' },
                { id: 'nosotros' as PublicNavSection, label: 'Nosotros' },
                { id: 'servicios' as PublicNavSection, label: 'Servicios' },
                { id: 'sectores' as PublicNavSection, label: 'Sectores' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateSection(link.id)}
                    className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 py-0.5"
                  >
                    <span className="text-[#10e7b2] text-[11px] font-bold">▸</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: PIDE TU COTIZACIÓN */}
          <div className="space-y-3.5">
            <h3 className="font-hud font-extrabold text-[14px] text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-800/40 pb-2">
              <span className="material-symbols-outlined text-[#10e7b2] text-[18px]">request_quote</span>
              <span>PIDE TU COTIZACIÓN</span>
            </h3>

            <p className="text-[12.5px] text-cyan-100/80 leading-relaxed">
              Solicite cotización para análisis de agua, calibración de dosificadores y vigilancia según D.S. N.° 031-2010-SA.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#00242e] font-hud text-[12px] sm:text-[12.5px] font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

        {/* PIE DE PÁGINA (Strict text formatting) */}
        <div className="pt-8 text-center text-[12px] sm:text-[12.5px] text-cyan-200/80 space-y-2">
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
              className="hover:text-[#10e7b2] transition-colors underline cursor-pointer"
            >
              Política de Privacidad
            </button>
            <span className="text-cyan-600">|</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#10e7b2] transition-colors underline cursor-pointer"
            >
              Términos de Uso
            </button>
            <span className="text-cyan-600">|</span>
            <button
              type="button"
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-[#10e7b2] transition-colors underline cursor-pointer"
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

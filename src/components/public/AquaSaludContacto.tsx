import React, { useState } from 'react';

interface AquaSaludContactoProps {
  onOpenQuoteModal?: () => void;
}

export const AquaSaludContacto: React.FC<AquaSaludContactoProps> = ({ onOpenQuoteModal }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    organizacion: '',
    telefono: '',
    asunto: 'Soporte Técnico en Cloración y Monitoreo',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const whatsappNumber = '920221581';
  const whatsappFull = '51920221581';
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61594489960322';
  const instagramUrl = 'https://www.instagram.com/aqua.salud.lab/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = `Hola AQUA-SALUD, mi nombre es ${formData.nombre}${formData.organizacion ? ` de ${formData.organizacion}` : ''}. Teléfono: ${formData.telefono}. Asunto: ${formData.asunto}. Consulta: ${formData.mensaje}`;
    const url = `https://wa.me/${whatsappFull}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setEnviado(true);
  };

  return (
    <section id="contacto-view" className="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#f0f9ff] to-white border-t border-cyan-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Encabezado de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-[#00677d] font-hud text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#0077b6]">contact_support</span>
            <span>Atención & Soporte Técnico Oficial</span>
          </div>
          <h2 className="font-hud font-extrabold text-[28px] sm:text-[38px] text-[#003440] tracking-tight">
            CANALES DE CONTACTO
          </h2>
          <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed mt-3">
            Comunícate directamente con el equipo técnico de <strong>AQUA SALUD</strong> para asesoría en dosificación de cloro, análisis de laboratorio, gestión de reservorios y proyectos de agua segura.
          </p>
        </div>

        {/* Canales Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Tarjeta WhatsApp */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-[0_8px_24px_rgba(16,185,129,0.08)] flex flex-col justify-between hover:border-emerald-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">chat</span>
              </div>
              <h3 className="font-hud font-bold text-[18px] text-slate-900 mb-1">
                WhatsApp Directo
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                Atención rápida a operadores JASS, personal técnico de municipalidades y directivos.
              </p>
              <div className="text-[20px] font-hud font-black text-emerald-600 tracking-wide mb-1">
                {whatsappNumber}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Lunes a Sábado: 8:00 AM - 7:00 PM
              </span>
            </div>
            <a
              href={`https://wa.me/${whatsappFull}?text=${encodeURIComponent('Hola AQUA-SALUD, deseo comunicarme con el equipo de soporte técnico.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-hud font-bold text-[12.5px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Abrir Chat de WhatsApp</span>
            </a>
          </div>

          {/* Tarjeta Redes Sociales */}
          <div className="p-6 rounded-3xl bg-white border border-cyan-200/80 shadow-[0_8px_24px_rgba(6,182,212,0.08)] flex flex-col justify-between hover:border-cyan-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#0077b6] border border-cyan-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">share</span>
              </div>
              <h3 className="font-hud font-bold text-[18px] text-slate-900 mb-1">
                Redes Sociales Oficiales
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                Sigue nuestras publicaciones sobre tips de cloración, tecnología del agua e innovaciones analíticas.
              </p>
              <div className="space-y-2 mb-4">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-[#1877F2]/10 border border-slate-200 hover:border-[#1877F2]/40 text-slate-700 hover:text-[#1877F2] text-[12px] font-hud font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook: AQUA SALUD</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-600 text-[12px] font-hud font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 fill-[#E1306C]" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram: @aqua.salud.lab</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
              Contenido técnico, infografías y novedades
            </div>
          </div>

          {/* Tarjeta Cotización y Proyectos */}
          <div className="p-6 rounded-3xl bg-white border border-sky-200/80 shadow-[0_8px_24px_rgba(2,132,199,0.08)] flex flex-col justify-between hover:border-sky-400 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] border border-sky-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">request_quote</span>
              </div>
              <h3 className="font-hud font-bold text-[18px] text-slate-900 mb-1">
                Cotizaciones & Ensayos
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                Solicita cotización formal para análisis de agua (microbiología, fisicoquímico, metales pesados) o planes de acción comunal.
              </p>
              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-[12px] text-slate-700 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-[#00677d]">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Ensayos D.S. N.° 031-2010-SA</span>
                </div>
                <div className="text-[11.5px] text-slate-600">
                  Cadena de custodia y trazabilidad analítica garantizada.
                </div>
              </div>
            </div>
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="w-full py-3 rounded-2xl bg-[#0077b6] hover:bg-[#0284c7] text-white font-hud font-bold text-[12.5px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Cotizar Servicios en Línea</span>
              </button>
            ) : (
              <a
                href={`https://wa.me/${whatsappFull}?text=${encodeURIComponent('Hola AQUA-SALUD, deseo cotizar servicios analíticos de agua.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-[#0077b6] hover:bg-[#0284c7] text-white font-hud font-bold text-[12.5px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Solicitar Cotización</span>
              </a>
            )}
          </div>
        </div>

        {/* Formulario de Mensaje Directo */}
        <div className="bg-white rounded-3xl border border-cyan-200/90 shadow-[0_10px_30px_rgba(0,103,125,0.06)] p-6 sm:p-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-100">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0077b6] flex items-center justify-center border border-cyan-200">
              <span className="material-symbols-outlined text-[22px]">mail</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[19px] text-slate-900">
                Envíanos tu consulta técnica
              </h3>
              <p className="text-[12.5px] text-slate-500">
                Un especialista de AQUA SALUD responderá de forma prioritaria.
              </p>
            </div>
          </div>

          {enviado && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span>¡Gracias! Se abrió tu chat con los datos de tu consulta. Te responderemos de inmediato.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-hud font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0077b6] focus:ring-2 focus:ring-cyan-200 outline-none text-[13.5px] font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-hud font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organización / Entidad / JASS
                </label>
                <input
                  type="text"
                  value={formData.organizacion}
                  onChange={(e) => setFormData({ ...formData, organizacion: e.target.value })}
                  placeholder="Ej. JASS San Pedro / ATM Municipal"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0077b6] focus:ring-2 focus:ring-cyan-200 outline-none text-[13.5px] font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-hud font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teléfono / Celular de Contacto *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej. 920 221 581"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0077b6] focus:ring-2 focus:ring-cyan-200 outline-none text-[13.5px] font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-hud font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Motivo de la Consulta
                </label>
                <select
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0077b6] focus:ring-2 focus:ring-cyan-200 outline-none text-[13px] font-medium transition-all bg-white"
                >
                  <option value="Soporte Técnico en Cloración y Monitoreo">Soporte Técnico en Cloración y Monitoreo</option>
                  <option value="Cotización de Análisis de Laboratorio">Cotización de Análisis de Laboratorio</option>
                  <option value="Asesoría para JASS o ATM">Asesoría para JASS o ATM</option>
                  <option value="Calibración y Preparación de Soluciones">Calibración y Preparación de Soluciones</option>
                  <option value="Otra Consulta Institucional">Otra Consulta Institucional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-hud font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detalle de tu Consulta o Mensaje *
              </label>
              <textarea
                required
                rows={3}
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                placeholder="Describe tu sistema, reservorio, duda analítica o necesidad técnica..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0077b6] focus:ring-2 focus:ring-cyan-200 outline-none text-[13.5px] font-medium transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00677d] to-[#0077b6] hover:from-[#005263] hover:to-[#005f73] text-white font-hud font-extrabold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(0,103,125,0.22)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">send</span>
              <span>Enviar Consulta a Soporte Técnico</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

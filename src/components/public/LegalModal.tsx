import React from 'react';

export type LegalModalType = 'privacy' | 'terms' | 'cookies' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const titles: Record<string, { title: string; subtitle: string; icon: string }> = {
    privacy: {
      title: 'Política de Privacidad',
      subtitle: 'Tratamiento responsable y protección de datos institucionales',
      icon: 'shield',
    },
    terms: {
      title: 'Términos de Uso',
      subtitle: 'Condiciones de operación técnica y acceso a la plataforma',
      icon: 'gavel',
    },
    cookies: {
      title: 'Política de Cookies',
      subtitle: 'Uso de almacenamiento local para persistencia de datos de campo',
      icon: 'cookie',
    },
  };

  const info = titles[type] || titles.privacy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-[#0f172a] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#003d4c] to-[#00677d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#10e7b2]">
              <span className="material-symbols-outlined text-[22px]">{info.icon}</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[17px] leading-tight text-white">{info.title}</h3>
              <p className="text-[12px] text-cyan-200/90">{info.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-[13.5px] leading-relaxed text-[#334155]">
          {type === 'privacy' && (
            <>
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-[#004e5f] text-[12.5px]">
                <strong>Aviso Institucional:</strong> AQUA-SALUD LABORATORIO garantiza la confidencialidad de los registros de muestreo, información comunal de JASS y resultados analíticos.
              </div>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">1. Identidad y Responsable</h4>
              <p>
                AQUA-SALUD LABORATORIO, con domicilio en Semi Rustica la Merced N 14, Trujillo, Perú, es responsable del tratamiento de los datos operativos y sanitarios ingresados en la plataforma.
              </p>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">2. Finalidad del Tratamiento</h4>
              <p>
                Los datos recolectados (registros de cloro residual, turbidez, georreferenciación de fuentes y puntos de muestreo) se utilizan exclusivamente para la vigilancia sanitaria, control de calidad del agua potable, soporte técnico a JASS y prevención de riesgos para la salud pública.
              </p>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">3. Protección de Datos Sensibles</h4>
              <p>
                No se comercializa ni se divulga información confidencial de clientes o comunidades sin autorización expresa. Los códigos QR y enlaces públicos solo exhiben el estado general del sistema sin exponer datos personales.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-[#004e5f] text-[12.5px]">
                <strong>Marco Normativo:</strong> Los lineamientos técnicos se sustentan en el Reglamento de Calidad del Agua para Consumo Humano (D.S. N.° 031-2010-SA) y directivas del Ministerio de Salud (MINSA / DIGESA).
              </div>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">1. Objeto de la Plataforma</h4>
              <p>
                AQUA-SALUD es un sistema inteligente de vigilancia y gestión territorial del agua. Brinda herramientas de cálculo estequiométrico, telemetría y orientación sanitaria para la toma de decisiones informadas.
              </p>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">2. Responsabilidad Operativa</h4>
              <p>
                Los cálculos de dosificación deben ser ejecutados y verificados en campo por personal capacitado utilizando los implementos de protección personal (EPP) correspondientes. La plataforma orienta sobre procedimientos validados y desaconseja la aplicación de dosis químicas sin sustento técnico.
              </p>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">3. Propiedad Intelectual</h4>
              <p>
                Diseñado y desarrollado por Ing. Zaira Salvador Amaya - Casa SERPENTIS. © 2026 AQUA SALUD LABORATORIO. Todos los derechos reservados.
              </p>
            </>
          )}

          {type === 'cookies' && (
            <>
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-[#004e5f] text-[12.5px]">
                <strong>Almacenamiento Local (Modo Campo Offline):</strong> La aplicación utiliza tecnologías de almacenamiento local del navegador (LocalStorage) para garantizar la disponibilidad de datos de campo sin conexión a internet.
              </div>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">1. ¿Qué información se almacena localmente?</h4>
              <p>
                Se almacenan temporalmente los perfiles de operador, registros de muestreo de cloro residual no sincronizados y la lista de sistemas de agua configurados por la comunidad.
              </p>
              <h4 className="font-hud font-bold text-[#003d4c] text-[15px]">2. Cookies de Terceros</h4>
              <p>
                No se emplean cookies de rastreo comercial invasivas. El almacenamiento se destina con exclusividad a la persistencia operativa y preferencias de interfaz (modo día/noche, volumen de audio y estado de sincronización).
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#00677d] hover:bg-[#004e5f] text-white font-hud text-[12px] font-bold uppercase transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

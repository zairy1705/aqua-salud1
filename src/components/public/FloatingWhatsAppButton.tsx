import React, { useState, useEffect, useRef } from 'react';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  options?: { label: string; action: string }[];
}

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const whatsappNumber = '51920221581';
  const whatsappMessage =
    'Hola Aqua-salud, estoy interesado en apoyo técnico. Me gustaría solicitar más información sobre sus servicios.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: '¡Hola! 👋 Soy el asistente virtual automatizado de **AQUA-SALUD & CLORAGUA**.',
      time: timeStr,
    },
    {
      id: 'm-2',
      sender: 'bot',
      text: '¿En qué podemos apoyarte hoy para la calidad y vigilancia del agua en tu comunidad o institución?',
      time: timeStr,
      options: [
        { label: '💧 Cotizar Análisis D.S. 031', action: 'cotizar' },
        { label: '🚨 Emergencia de Cloro Residual', action: 'cloro' },
        { label: '🧪 Monitoreo de Metales Pesados', action: 'metales' },
        { label: '📲 Contactar con Especialista', action: 'humano' },
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setHasUnreadNotice(false);
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSelectOption = (action: string, label: string) => {
    const userTime = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const newMsg: BotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: label,
      time: userTime,
    };

    let botResponseText = '';
    let nextOptions: { label: string; action: string }[] | undefined = undefined;

    if (action === 'cotizar') {
      botResponseText =
        'Realizamos ensayos microbiológicos (E. coli, Coliformes), fisicoquímicos y metales pesados acreditados bajo D.S. N.° 031-2010-SA. Las cotizaciones se remiten a **aqua.salud.lab@gmail.com** con trazabilidad oficial.';
      nextOptions = [
        { label: '💬 Solicitar Cotización por WhatsApp', action: 'humano' },
        { label: '🔙 Menú Principal', action: 'menu' },
      ];
    } else if (action === 'cloro') {
      botResponseText =
        '⚠️ **Protocolo Inmediato de Cloración:** Según D.S. 031-2010-SA, el cloro libre debe estar entre **0.5 y 2.0 ppm**. Si está por debajo de 0.5 ppm, verificar el caudal de ingreso al reservorio y recalibrar el dosificador de goteo.';
      nextOptions = [
        { label: '📲 Consultar Urgencia con Ingeniero', action: 'humano' },
        { label: '🔙 Menú Principal', action: 'menu' },
      ];
    } else if (action === 'metales') {
      botResponseText =
        'Analizamos Arsénico (LMP 0.01 mg/L), Plomo (LMP 0.01 mg/L), Cadmio, Mercurio y Hierro con espectrometría de masas ICP-MS.';
      nextOptions = [
        { label: '💬 Cotizar Metales por WhatsApp', action: 'humano' },
        { label: '🔙 Menú Principal', action: 'menu' },
      ];
    } else if (action === 'humano') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    } else {
      botResponseText = 'Por favor selecciona una de las opciones para orientarte rápidamente:';
      nextOptions = [
        { label: '💧 Cotizar Análisis D.S. 031', action: 'cotizar' },
        { label: '🚨 Emergencia de Cloro Residual', action: 'cloro' },
        { label: '🧪 Monitoreo de Metales Pesados', action: 'metales' },
        { label: '📲 Contactar con Especialista', action: 'humano' },
      ];
    }

    setMessages((prev) => [
      ...prev,
      newMsg,
      {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        time: userTime,
        options: nextOptions,
      },
    ]);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    const userTime = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const userMsg: BotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: userTime,
    };

    const botMsg: BotMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text: `He recibido tu mensaje: "${query}". Para una atención personalizada con nuestro equipo de ingenieros sanitarios, continuemos por nuestro canal oficial de WhatsApp.`,
      time: userTime,
      options: [
        { label: '📲 Abrir WhatsApp Oficial (920221581)', action: 'humano' },
      ],
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <aside aria-label="Asistente WhatsApp Bot" className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
      {/* Interactive WhatsApp Bot Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bot Automatizado de WhatsApp AQUA-SALUD"
          className="w-[calc(100vw-32px)] sm:w-96 h-[480px] max-h-[85vh] mb-3 bg-[#efeae2] rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075E54] font-bold shadow-inner">
                <span className="material-symbols-outlined text-[24px] text-[#25D366]">chat</span>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] ring-2 ring-[#075E54]"></span>
              </div>
              <div>
                <h3 className="font-hud font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>AQUA-SALUD Bot</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#25D366] text-[#002116] font-bold uppercase">
                    Oficial
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span>En línea • Soporte 920221581</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Abrir en app de WhatsApp"
              >
                <span className="material-symbols-outlined text-lg">open_in_new</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Cerrar ventana de chat"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs sm:text-sm">
            {/* Encryption notice pill */}
            <div className="text-center my-1">
              <span className="inline-block bg-[#ffeecd] text-[#54656f] text-[10.5px] px-3 py-1 rounded-lg shadow-2xs">
                🔒 Mensajes protegidos. Canal oficial AQUA-SALUD (D.S. N.° 031-2010-SA).
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-xl shadow-xs text-slate-800 ${
                    msg.sender === 'user'
                      ? 'bg-[#d9fdd3] rounded-tr-xs'
                      : 'bg-white rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9.5px] text-slate-400 block text-right mt-1">
                    {msg.time}
                  </span>
                </div>

                {/* Option chips if available */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.action}
                        type="button"
                        onClick={() => handleSelectOption(opt.action, opt.label)}
                        className="px-2.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#075E54] border border-emerald-300 font-medium text-[11px] shadow-2xs hover:shadow transition-all cursor-pointer text-left active:scale-95"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Direct Link to WhatsApp with exact message */}
          <div className="px-3 py-2 bg-[#f0f2f5] border-t border-slate-200">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Continuar en WhatsApp (+51 920221581)</span>
            </a>
          </div>

          {/* Input field */}
          <form onSubmit={handleSendCustomMessage} className="p-2 bg-[#f0f2f5] flex items-center gap-2 border-t border-slate-200">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-white border border-slate-300 rounded-full px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#075E54]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-full bg-[#075E54] disabled:opacity-50 text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Enviar mensaje"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle / Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Abrir asistente automatizado WhatsApp Bot"
        className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ml-auto"
        title="WhatsApp Bot — Soporte técnico (920221581)"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[22px]">
            {isOpen ? 'chat_bubble' : 'chat'}
          </span>
          <span className="font-hud text-[12px] sm:text-[13px] font-bold tracking-tight whitespace-nowrap">
            WhatsApp Bot
          </span>
        </div>
        {hasUnreadNotice && !isOpen && (
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
        )}
      </button>
    </aside>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Database,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Droplet,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  WaterSystem,
  SamplingRecord,
  WaterSample,
  AquaAlertItem,
  AquaRiskItem,
  ActionPlanItem,
} from '../../types';
import {
  queryAquaIA,
  parseAquaIAResponse,
  AquaIAMessage,
} from '../../services/aquaIaService';

interface AquaIAViewProps {
  systems: WaterSystem[];
  records: SamplingRecord[];
  samples: WaterSample[];
  alerts: AquaAlertItem[];
  risks: AquaRiskItem[];
  plans: ActionPlanItem[];
  onNavigateToPlanes?: () => void;
  onNavigateToAlerts?: () => void;
  onNavigateToData?: () => void;
  onNavigateToJass?: (systemId?: string) => void;
  operatorName?: string;
}

const SAMPLE_QUERIES = [
  {
    icon: 'alert-triangle',
    label: '¿Qué JASS tienen más alertas?',
    text: '¿Qué JASS tienen más alertas?',
  },
  {
    icon: 'droplet',
    label: '¿Qué sistemas tienen controles de cloro pendientes?',
    text: '¿Qué sistemas tienen controles de cloro pendientes?',
  },
  {
    icon: 'activity',
    label: '¿Qué parámetros presentan más incumplimientos?',
    text: '¿Qué parámetros presentan más incumplimientos?',
  },
  {
    icon: 'trending-down',
    label: '¿Qué sistemas presentan tendencia desfavorable?',
    text: '¿Qué sistemas presentan tendencia desfavorable?',
  },
  {
    icon: 'clipboard-list',
    label: '¿Qué acciones correctivas están pendientes?',
    text: '¿Qué acciones correctivas están pendientes?',
  },
  {
    icon: 'file-text',
    label: 'Genera un resumen mensual.',
    text: 'Genera un resumen mensual.',
  },
];

export const AquaIAView: React.FC<AquaIAViewProps> = ({
  systems,
  records,
  samples,
  alerts,
  risks,
  plans,
  onNavigateToPlanes,
  onNavigateToAlerts,
  onNavigateToData,
  onNavigateToJass,
  operatorName = 'Ing. Zaira Salvador Amaya',
}) => {
  const [messages, setMessages] = useState<AquaIAMessage[]>(() => {
    // Initial welcome message from AQUA-IA
    const welcomeText = `### DATOS
Plataforma CLORAGUA / AQUA-SALUD operativa con:
• **${systems.length}** sistemas de agua rural y organizaciones JASS.
• **${records.length}** registros de cloro residual libre en bitácora oficial.
• **${samples.length}** muestras de laboratorio validadas.
• **${alerts.length}** alertas sanitarias registradas.
• **${plans.length}** planes de acción correctiva en seguimiento.

### INTERPRETACIÓN
AQUA-IA está configurado como asistente de vigilancia sanitaria bajo la normativa D.S. N.° 031-2010-SA de DIGESA / MINSA. Mis respuestas se formulan **exclusivamente a partir de los datos registrados** en esta plataforma, sin inventar parámetros ni asumir cumplimientos sin respaldo.

### RECOMENDACIÓN
Puedes seleccionar cualquiera de las consultas predefinidas o formular una pregunta sobre la calidad del agua, controles de cloro pendientes, alertas críticas o planes de acción.

*Nota técnica: Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente.*`;

    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        content: welcomeText,
        parsed: parseAquaIAResponse(welcomeText),
        source: 'deterministic-engine',
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContextInspector, setShowContextInspector] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech Synthesis
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text from markdown markers
    const cleanText = text
      .replace(/###\s*DATOS/gi, 'Sección Datos.')
      .replace(/###\s*INTERPRETACIÓN/gi, 'Sección Interpretación.')
      .replace(/###\s*RECOMENDACIÓN/gi, 'Sección Recomendación.')
      .replace(/[*#•]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-PE';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMessage: AquaIAMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    const contextData = {
      systems,
      records,
      samples,
      alerts,
      risks,
      plans,
    };

    try {
      const response = await queryAquaIA(textToSend, contextData);
      const parsed = parseAquaIAResponse(response.text);

      const assistantMessage: AquaIAMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        content: response.text,
        parsed,
        source: response.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error in AquaIA response:', err);
      const fallbackErrorText = `### DATOS\nNo existen datos suficientes para realizar esta evaluación en este momento.\n\n### INTERPRETACIÓN\nOcurrió una interrupción al conectar con el motor de inferencia analítica.\n\n### RECOMENDACIÓN\nVerificar la conectividad o seleccionar una consulta directa sobre los sistemas registrados.\n\n*Nota técnica: Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente.*`;
      const assistantMessage: AquaIAMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        content: fallbackErrorText,
        parsed: parseAquaIAResponse(fallbackErrorText),
        source: 'deterministic-engine',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Deseas reiniciar la conversación con AQUA-IA?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeakingId(null);
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          content: `### DATOS\nPlataforma CLORAGUA con ${systems.length} sistemas y ${records.length} controles cargados.\n\n### INTERPRETACIÓN\nHistorial reiniciado. AQUA-IA está listo para nuevas consultas de vigilancia sanitaria.\n\n### RECOMENDACIÓN\nIndica la consulta requerida o utiliza las preguntas rápidas recomendadas.\n\n*Nota técnica: Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente.*`,
          parsed: parseAquaIAResponse(`### DATOS\nPlataforma CLORAGUA con ${systems.length} sistemas y ${records.length} controles cargados.\n\n### INTERPRETACIÓN\nHistorial reiniciado. AQUA-IA está listo para nuevas consultas de vigilancia sanitaria.\n\n### RECOMENDACIÓN\nIndica la consulta requerida o utiliza las preguntas rápidas recomendadas.\n\n*Nota técnica: Las recomendaciones se presentan como orientación sanitaria y no reemplazan el criterio profesional ni de la autoridad sanitaria competente.*`),
          source: 'deterministic-engine',
        },
      ]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-140px)] animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-4 sm:p-5 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-[#00b4d8] flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  AQUA-IA
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    FASE 9 • ASISTENTE SANITARIO
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Inteligencia artificial basada <strong className="text-slate-700">exclusivamente en datos verificados</strong> de la plataforma. Cumplimiento estricto de D.S. N.° 031-2010-SA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
            <button
              onClick={() => setShowContextInspector(!showContextInspector)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Ver datos disponibles en memoria"
            >
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>Contexto Real ({systems.length} Sist / {alerts.length} Alert)</span>
              {showContextInspector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Limpiar conversación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Context Inspector Drawer */}
        {showContextInspector && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs animate-fadeIn">
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
              <span className="text-slate-500 block">Sistemas</span>
              <strong className="text-blue-900 text-sm">{systems.length} activos</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="text-slate-500 block">Bitácora Cloro</span>
              <strong className="text-emerald-900 text-sm">{records.length} controles</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
              <span className="text-slate-500 block">Muestras Lab</span>
              <strong className="text-purple-900 text-sm">{samples.length} análisis</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="text-slate-500 block">Alertas Sanitarias</span>
              <strong className="text-amber-900 text-sm">{alerts.length} reportadas</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100">
              <span className="text-slate-500 block">Matriz Riesgos</span>
              <strong className="text-red-900 text-sm">{risks.length} evaluados</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-100">
              <span className="text-slate-500 block">Planes de Acción</span>
              <strong className="text-teal-900 text-sm">{plans.length} en curso</strong>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Consultas rápidas recomendadas:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {SAMPLE_QUERIES.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sq.text)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 shadow-2xs transition disabled:opacity-50"
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 overflow-y-auto max-h-[58vh] space-y-4 shadow-inner mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Message header */}
            <div className="flex items-center gap-1.5 text-2xs text-slate-400 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span>{operatorName}</span>
                  <User className="w-3 h-3 text-slate-500" />
                  <span>• {msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold text-teal-800">AQUA-IA</span>
                  {msg.source && (
                    <span className="text-3xs px-1.5 py-0.2 rounded bg-teal-100 text-teal-700 font-mono">
                      {msg.source === 'gemini-3.8-flash' ? 'Gemini 3.8-Flash' : 'Motor Analítico'}
                    </span>
                  )}
                  <span>• {msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Body */}
            {msg.sender === 'user' ? (
              <div className="max-w-[85%] sm:max-w-xl bg-gradient-to-r from-teal-700 to-[#0077b6] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm shadow-sm font-medium">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-full sm:max-w-3xl w-full bg-white rounded-2xl rounded-tl-xs border border-teal-100 shadow-sm p-4 sm:p-5 text-sm text-slate-800">
                {msg.parsed ? (
                  <div className="space-y-4">
                    {/* 1. SECCIÓN DATOS */}
                    {msg.parsed.datos && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-200">
                          <Database className="w-4 h-4 text-blue-600" />
                          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                            DATOS COMPROBADOS
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {msg.parsed.datos}
                        </div>
                      </div>
                    )}

                    {/* 2. SECCIÓN INTERPRETACIÓN */}
                    {msg.parsed.interpretacion && (
                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-200/80">
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                            INTERPRETACIÓN SANITARIA (D.S. N.° 031-2010-SA)
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {msg.parsed.interpretacion}
                        </div>
                      </div>
                    )}

                    {/* 3. SECCIÓN RECOMENDACIÓN */}
                    {msg.parsed.recomendacion && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-200">
                          <Droplet className="w-4 h-4 text-emerald-700" />
                          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                            RECOMENDACIÓN TÉCNICA
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                          {msg.parsed.recomendacion}
                        </div>
                      </div>
                    )}

                    {/* Mandatory Disclaimer Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-2xs text-slate-500 italic">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{msg.parsed.disclaimer}</span>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-sm text-slate-800 leading-relaxed">
                    {msg.content}
                  </div>
                )}

                {/* Assistant Card Action Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition"
                      title="Copiar texto completo"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    {'speechSynthesis' in window && (
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded transition ${
                          speakingId === msg.id
                            ? 'text-teal-700 bg-teal-50 font-medium'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        title={speakingId === msg.id ? 'Detener lectura' : 'Leer en voz alta'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-teal-600" />
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Contextual navigation quick links */}
                  <div className="flex items-center gap-2">
                    {onNavigateToPlanes && (
                      <button
                        onClick={onNavigateToPlanes}
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium hover:underline text-2xs"
                      >
                        <span>Ver Planes</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {onNavigateToData && (
                      <button
                        onClick={onNavigateToData}
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium hover:underline text-2xs"
                      >
                        <span>AQUA-DATA</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing / Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-xs border border-teal-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-teal-800">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span className="font-semibold">AQUA-IA analizando datos oficiales...</span>
              </div>
              <p className="text-2xs text-slate-400 mt-1">
                Extrayendo registros verificados de sistemas, bitácora de cloro y muestras de laboratorio.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2 flex items-center gap-2"
      >
        <div className="pl-3 text-teal-600">
          <Bot className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Escribe tu consulta sanitaria (ej. ¿Qué sistemas tienen controles de cloro pendientes?)..."
          disabled={isLoading}
          className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 py-2"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-[#00b4d8] text-white font-semibold text-xs sm:text-sm hover:opacity-95 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Bottom info caption */}
      <div className="mt-2 text-center text-2xs text-slate-400">
        AQUA-IA opera bajo estricta regla de fidelidad: si los datos no están registrados en CLORAGUA, responderá "No existen datos suficientes para realizar esta evaluación".
      </div>
    </div>
  );
};

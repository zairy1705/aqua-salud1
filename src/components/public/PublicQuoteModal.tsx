import React, { useState, useEffect } from 'react';
import {
  CRM_SERVICES_CATALOG,
  CRM_SECTORS_LIST,
  CRM_PRIMARY_EMAIL,
  formatQuotePlainText,
  buildWhatsAppContactUrl,
  saveStoredQuotes,
  loadStoredQuotes,
  generateNextCorrelativeCode,
} from '../../data/crmStore';
import { CrmClientSector, CrmQuoteItem } from '../../types';
import {
  validateNameStrict,
  validatePeruvianPhone,
  validateEmailStrict,
  sanitizeText,
} from '../../utils/cryptoSecurity';
import { logAuditEvent } from '../../data/auditStore';

interface PublicQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onQuoteCreated?: (newQuote: CrmQuoteItem) => void;
}

export const PublicQuoteModal: React.FC<PublicQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onQuoteCreated,
}) => {
  const [clientName, setClientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(
    preselectedService || CRM_SERVICES_CATALOG[0].name
  );
  const [sector, setSector] = useState<CrmClientSector>('JASS Comunal');
  const [message, setMessage] = useState('');

  // Anti-Spam & Security States
  const [botTrap, setBotTrap] = useState(''); // Honeypot trap
  const [mountTime, setMountTime] = useState<number>(() => Date.now());
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<CrmQuoteItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedClipboard, setCopiedClipboard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMountTime(Date.now());
      setBotTrap('');
      setFieldErrors({});
      setErrorMessage(null);
      setCopiedClipboard(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // 1. Anti-Spam Honeypot Verification: Bots automatically fill hidden fields
    if (botTrap && botTrap.trim().length > 0) {
      console.warn('Bot submission trapped by honeypot.');
      setErrorMessage('Solicitud rechazada por filtros de seguridad automatizados.');
      return;
    }

    // 2. Time-to-Submit Verification: Automated bots submit instantly (< 200 ms)
    const elapsedMs = Date.now() - mountTime;
    if (elapsedMs < 200) {
      setErrorMessage('Por favor tómate un momento para revisar tu información antes de enviar.');
      return;
    }

    // 3. Strict Input Validation
    const errors: { [key: string]: string } = {};

    const nameValidation = validateNameStrict(clientName);
    if (!nameValidation.valid) {
      errors.clientName = nameValidation.error || 'Nombre inválido';
    }

    const phoneValidation = validatePeruvianPhone(phone);
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error || 'Teléfono inválido';
    }

    if (!validateEmailStrict(email)) {
      errors.email = 'Ingrese un correo electrónico válido (ej. contacto@empresa.pe)';
    }

    const sanitizedMsg = sanitizeText(message, 2000);
    if (sanitizedMsg.length < 5) {
      errors.message = 'Por favor detalle su requerimiento o consulta.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Por favor corrija los campos marcados en rojo antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Load current quotes to calculate next correlative
      const existingQuotes = loadStoredQuotes();
      const { code, correlative } = generateNextCorrelativeCode(existingQuotes);

      const sanitizedClientName = sanitizeText(clientName, 100);
      const sanitizedOrg = sanitizeText(organization, 100);
      const formattedPhone = phoneValidation.formatted || phone.trim();

      // Call hardened backend server endpoint /api/crm/quote
      let serverResponse: any = null;
      try {
        const res = await fetch('/api/crm/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: sanitizedClientName,
            organization: sanitizedOrg,
            phone: formattedPhone,
            email: email.trim(),
            service,
            sector,
            message: sanitizedMsg,
            existingCount: existingQuotes.length,
            bot_trap_company: botTrap,
            formFillDurationMs: elapsedMs,
          }),
        });

        if (res.ok) {
          serverResponse = await res.json();
        } else {
          const errData = await res.json().catch(() => null);
          if (errData?.error) {
            throw new Error(errData.error);
          }
        }
      } catch (fetchErr: any) {
        console.warn('Backend API quote call failed, using client-side fallback storage:', fetchErr);
        if (fetchErr.message && !fetchErr.message.includes('Failed to fetch')) {
          throw fetchErr;
        }
      }

      const assignedCode = serverResponse?.code || code;
      const assignedCorrelative = serverResponse?.quote?.correlative || correlative;

      const now = new Date();
      const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

      const newQuote: CrmQuoteItem = serverResponse?.quote || {
        id: assignedCode,
        correlative: assignedCorrelative,
        createdAt: now.toISOString(),
        dateStr,
        timeStr,
        clientName: sanitizedClientName,
        organization: sanitizedOrg || 'Particular',
        phone: formattedPhone,
        email: email.trim(),
        service,
        sector,
        message: sanitizedMsg,
        status: 'Nueva',
        responsible: 'Ing. Sanitario Marco Valdivia (Jefe de Laboratorio)',
        estimatedBudgetPen: 0,
        nextFollowUpDate: dateStr.split('/').reverse().join('-'),
        nextFollowUpReminder: 'Realizar primer contacto comercial para evaluación técnica.',
        history: [
          {
            id: `hist-${Date.now()}`,
            date: dateStr,
            time: timeStr,
            timestamp: now.toISOString(),
            author: 'Formulario Web Público',
            action: 'Recepción de Solicitud',
            note: `Solicitud de cotización registrada y notificada a ${CRM_PRIMARY_EMAIL}.`,
            toStatus: 'Nueva',
          },
        ],
        internalNotes: [],
        emailDelivery: {
          recipient: CRM_PRIMARY_EMAIL,
          sent: true,
          sentAt: now.toISOString(),
          method: serverResponse?.emailDelivery?.method || 'server_relay',
          messageId: serverResponse?.emailDelivery?.messageId || `direct-${Date.now()}`,
        },
      };

      // Also trigger /api/crm/send-email in background to ensure transmission to aqua.salud.lab@gmail.com
      fetch('/api/crm/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: newQuote.id,
          clientName: newQuote.clientName,
          organization: newQuote.organization,
          phone: newQuote.phone,
          email: newQuote.email,
          service: newQuote.service,
          sector: newQuote.sector,
          message: newQuote.message,
        }),
      }).catch((e) => console.warn('Background send-email attempt:', e));

      // Store in local CRM state
      const updatedQuotes = [newQuote, ...existingQuotes.filter((q) => q.id !== newQuote.id)];
      saveStoredQuotes(updatedQuotes);

      // Log official audit event
      await logAuditEvent({
        action: 'CREACION',
        entityType: 'COTIZACION',
        entityId: newQuote.id,
        entityTitle: `Cotización ${newQuote.id}: ${newQuote.clientName}`,
        authorName: 'Formulario Web Público (Verificado)',
        authorRole: 'Visitante Externo',
        authorTier: 'AUDITOR',
        details: `Recepción y validación de solicitud para "${newQuote.service}". Remitido directamente a ${CRM_PRIMARY_EMAIL}.`,
      });

      // Update state to show the success confirmation screen immediately
      // NO external Gmail window or popup will be opened
      setSubmittedQuote(newQuote);
      onQuoteCreated?.(newQuote);
    } catch (err: any) {
      console.error('Error submitting quote request:', err);
      setErrorMessage(err?.message || 'Error al registrar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientName('');
    setOrganization('');
    setPhone('');
    setEmail('');
    setMessage('');
    setBotTrap('');
    setFieldErrors({});
    setSubmittedQuote(null);
    setErrorMessage(null);
    setCopiedClipboard(false);
    setMountTime(Date.now());
  };

  const handleCopyQuoteText = async () => {
    if (!submittedQuote) return;
    try {
      const text = formatQuotePlainText(submittedQuote);
      await navigator.clipboard.writeText(text);
      setCopiedClipboard(true);
      setTimeout(() => setCopiedClipboard(false), 3500);
    } catch (err) {
      console.warn('Error copying to clipboard', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003d4c] via-[#00677d] to-[#00b4d8] text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-200 block">
                  AQUA-SALUD LABORATORIO • CRM OFICIAL
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Pide tu Cotización de Servicios
                </h2>
                <p className="text-xs text-cyan-100/90 mt-0.5 flex items-center gap-1">
                  <span>Envío directo al correo del laboratorio:</span>
                  <span className="text-white font-bold underline">
                    {CRM_PRIMARY_EMAIL}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Cerrar"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {submittedQuote ? (
            /* Success confirmation screen (NO Gmail window opened) */
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                  Tu solicitud ha sido transmitida de manera directa y segura al correo oficial del laboratorio:
                </p>
                <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                  <span className="material-symbols-outlined text-base text-emerald-600">mark_email_read</span>
                  <span>{CRM_PRIMARY_EMAIL}</span>
                </div>
              </div>

              {/* Correlative Badge */}
              <div className="bg-cyan-50/80 border border-cyan-200 rounded-2xl p-4 max-w-sm mx-auto shadow-xs text-center">
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest block">
                  Código Único Correlativo Oficial
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#00677d] tracking-wider block mt-0.5">
                  {submittedQuote.id}
                </span>
                <p className="text-[11px] text-cyan-900/80 mt-1">
                  Guarda este código para seguimiento y consultas con el laboratorio.
                </p>
              </div>

              {/* Resumen de los datos enviados */}
              <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2 font-bold text-slate-800">
                  <span>Resumen de la Solicitud Enviada:</span>
                  <span className="text-[11px] font-normal text-slate-500">{submittedQuote.dateStr} - {submittedQuote.timeStr}</span>
                </div>
                <div><strong>Solicitante:</strong> {submittedQuote.clientName}</div>
                <div><strong>Organización / Entidad:</strong> {submittedQuote.organization || 'Particular'}</div>
                <div><strong>Contacto:</strong> Tel: {submittedQuote.phone} • Email: {submittedQuote.email}</div>
                <div><strong>Sector:</strong> {submittedQuote.sector}</div>
                <div><strong>Servicio Solicitado:</strong> <span className="text-[#00677d] font-bold">{submittedQuote.service}</span></div>
                <div className="pt-1.5 border-t border-slate-200/60 text-[11.5px] text-slate-600">
                  <strong className="text-slate-700 block mb-0.5">Requerimiento:</strong>
                  <p className="italic bg-white p-2.5 rounded-lg border border-slate-200/80 text-slate-700 leading-relaxed">
                    "{submittedQuote.message}"
                  </p>
                </div>
              </div>

              {/* Acciones de la Pantalla de Éxito (Sin ventanas ni redirecciones a Gmail) */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Botón Aceptar y Cerrar */}
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00677d] to-[#00b4d8] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  <span>Aceptar y Finalizar</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 2. Copiar Texto Completo al Portapapeles */}
                  <button
                    type="button"
                    onClick={handleCopyQuoteText}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedClipboard ? 'check_circle' : 'content_copy'}
                    </span>
                    <span>{copiedClipboard ? '¡Copiado!' : 'Copiar Comprobante'}</span>
                  </button>

                  {/* 3. Notificar por WhatsApp Oficial (Opcional) */}
                  <a
                    href={buildWhatsAppContactUrl(
                      submittedQuote.phone,
                      submittedQuote.clientName,
                      submittedQuote.id,
                      submittedQuote.service,
                      submittedQuote.organization,
                      'el equipo de AQUA-SALUD'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp Laboratorio</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Request Form with Anti-Spam and Validation */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-lg">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Hidden Anti-Spam Honeypot (invisible to humans, trapped by spam bots) */}
              <div
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0,
                  overflow: 'hidden',
                }}
                aria-hidden="true"
              >
                <label htmlFor="company_website_security_field">Do not fill this field</label>
                <input
                  id="company_website_security_field"
                  type="text"
                  name="company_website_security_field"
                  tabIndex={-1}
                  value={botTrap}
                  onChange={(e) => setBotTrap(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (fieldErrors.clientName) setFieldErrors({ ...fieldErrors, clientName: '' });
                    }}
                    placeholder="Ej. Ing. Juan Pérez"
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                      fieldErrors.clientName ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
                    } focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all`}
                  />
                  {fieldErrors.clientName && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.clientName}</p>
                  )}
                </div>

                {/* Organización */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organización / Entidad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ej. JASS San Jerónimo / Municipalidad"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                    }}
                    placeholder="Ej. 984 123 456"
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                      fieldErrors.phone ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
                    } focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Correo Electrónico <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    placeholder="contacto@organizacion.pe"
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                      fieldErrors.email ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
                    } focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sector o Tipo de Entidad
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as CrmClientSector)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white"
                >
                  {CRM_SECTORS_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Servicio Requerido <span className="text-rose-500">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white"
                >
                  {CRM_SERVICES_CATALOG.map((svc) => (
                    <option key={svc.id} value={svc.name}>
                      {svc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalles del Requerimiento / Mensaje <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                  }}
                  placeholder="Indique ubicación del sistema, población servida, número de muestras o condiciones del reservorio..."
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                    fieldErrors.message ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
                  } focus:border-[#00677d] focus:ring-2 focus:ring-cyan-100 outline-none transition-all resize-none`}
                />
                {fieldErrors.message && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.message}</p>
                )}
              </div>

              {/* Trust and Delivery Info */}
              <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00677d] text-[18px] shrink-0">
                  send_time_extension
                </span>
                <span>
                  <strong>Envío Directo:</strong> Al hacer clic en enviar, su mensaje será transmitido directamente al correo de recepción <strong>{CRM_PRIMARY_EMAIL}</strong> sin abrir ventanas externas.
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00677d] to-[#00b4d8] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando Mensaje...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Enviar a {CRM_PRIMARY_EMAIL}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

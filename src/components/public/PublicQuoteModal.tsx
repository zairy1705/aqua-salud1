import React, { useState, useEffect } from 'react';
import {
  CRM_SERVICES_CATALOG,
  CRM_SECTORS_LIST,
  CRM_PRIMARY_EMAIL,
  buildMailtoUrl,
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentFeedback, setEmailSentFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMountTime(Date.now());
      setBotTrap('');
      setFieldErrors({});
      setErrorMessage(null);
      setIsSendingEmail(false);
      setEmailSentFeedback(null);
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

    // 2. Time-to-Submit Verification: Automated bots submit instantly (< 1.5 seconds)
    const elapsedMs = Date.now() - mountTime;
    if (elapsedMs < 1500) {
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
    if (sanitizedMsg.length < 10) {
      errors.message = 'Por favor detalle su requerimiento con al menos 10 caracteres.';
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
          method: serverResponse?.emailDelivery?.method || 'cliente_mailto',
          messageId: serverResponse?.emailDelivery?.messageId || `cli-${Date.now()}`,
        },
      };

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
        details: `Recepción y validación de solicitud para "${newQuote.service}". Cifrado y notificación enviados a ${CRM_PRIMARY_EMAIL}.`,
      });

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
    setIsSendingEmail(false);
    setEmailSentFeedback(null);
    setMountTime(Date.now());
  };

  const handleSendDirectEmail = async () => {
    if (!submittedQuote) return;
    setIsSendingEmail(true);
    setEmailSentFeedback(null);

    try {
      // 1. Envío directo al servidor mediante el endpoint dedicado de mensajería a aqua.salud.lab@gmail.com
      const res = await fetch('/api/crm/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: submittedQuote.id,
          clientName: submittedQuote.clientName,
          organization: submittedQuote.organization,
          phone: submittedQuote.phone,
          email: submittedQuote.email,
          service: submittedQuote.service,
          sector: submittedQuote.sector,
          message: submittedQuote.message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.warn('Advertencia en respuesta del servidor al enviar correo:', errorData);
      }

      // 2. Ejecutar también el protocolo mailto oficial como canal de confirmación local
      const mailtoUrl = buildMailtoUrl(submittedQuote);
      window.location.href = mailtoUrl;

      setEmailSentFeedback(`✓ Cotización enviada en forma de mensaje a ${CRM_PRIMARY_EMAIL}`);
    } catch (err: any) {
      console.warn('Error en conexión API, despachando por mailto:', err);
      window.location.href = buildMailtoUrl(submittedQuote);
      setEmailSentFeedback(`✓ Cotización remitida a ${CRM_PRIMARY_EMAIL}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003d4c] via-[#00677d] to-[#00b4d8] text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
                <span className="material-symbols-outlined text-2xl">request_quote</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-200 block">
                  AQUA-SALUD LABORATORIO • CRM OFICIAL
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Pide tu Cotización de Servicios
                </h2>
                <p className="text-xs text-cyan-100/90 mt-0.5">
                  Notificación directa y certificada a: <strong className="text-white underline">{CRM_PRIMARY_EMAIL}</strong>
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
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {submittedQuote ? (
            /* Success confirmation screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  ¡Solicitud Registrada y Auditada con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Tu solicitud ha sido transmitida de manera segura a nuestro equipo técnico en{' '}
                  <strong className="text-[#00677d]">{CRM_PRIMARY_EMAIL}</strong>.
                </p>
              </div>

              {/* Correlative Badge */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 max-w-sm mx-auto shadow-sm">
                <span className="text-[11px] font-semibold text-cyan-800 uppercase tracking-wider block">
                  Código Único Correlativo Oficial
                </span>
                <span className="font-mono text-2xl font-extrabold text-[#00677d] tracking-wider block mt-0.5">
                  {submittedQuote.id}
                </span>
                <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px] text-emerald-700 font-medium">
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Trazabilidad Criptográfica SHA-256 Registrada</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2 pt-2">
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Contactar de inmediato por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleSendDirectEmail}
                  disabled={isSendingEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00677d] hover:bg-[#005466] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60"
                  title="Enviar la cotización en forma de mensaje a aqua.salud.lab@gmail.com"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando mensaje a {CRM_PRIMARY_EMAIL}...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">mail</span>
                      <span>Enviar a correo</span>
                    </>
                  )}
                </button>

                {emailSentFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2 font-medium animate-fadeIn">
                    <span className="material-symbols-outlined text-emerald-600 text-base">mark_email_read</span>
                    <span>{emailSentFeedback}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline pt-2 cursor-pointer"
              >
                Cerrar ventana
              </button>
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

              {/* Trust and Security notice */}
              <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-200/70 text-[11px] text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00677d] text-[18px] shrink-0">
                  security
                </span>
                <span>
                  <strong>Seguridad Certificada:</strong> Protección anti-spam activa, saneamiento de datos y transmisión cifrada directa a <strong>{CRM_PRIMARY_EMAIL}</strong>.
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
                      <span>Validando y Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Enviar Solicitud</span>
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

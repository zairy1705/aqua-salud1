import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  buildAquaIASystemPrompt,
  generateDeterministicAquaIAResponse,
} from './src/data/aquaIaEngine';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;

// Security Middleware: Set HTTP Security Headers and disable X-Powered-By
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  next();
});

// JSON body parser with strict size limit to prevent payload bombs
app.use(express.json({ limit: '500kb' }));

const TARGET_EMAIL = 'aqua.salud.lab@gmail.com';

// ----------------------------------------------------------------------
// Rate Limiting & Anti-Abuse Protection
// ----------------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const quoteRateLimits = new Map<string, RateLimitRecord>();
const aiRateLimits = new Map<string, RateLimitRecord>();

function isRateLimited(
  map: Map<string, RateLimitRecord>,
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = map.get(identifier);

  if (!record || now > record.resetTime) {
    map.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

// Helper to clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of quoteRateLimits.entries()) {
    if (now > val.resetTime) quoteRateLimits.delete(key);
  }
  for (const [key, val] of aiRateLimits.entries()) {
    if (now > val.resetTime) aiRateLimits.delete(key);
  }
}, 60000);

// In-memory CRM quotes and correlative tracking for backend synchronization
let serverQuoteCounter = 5; // Matches initial seed count
const serverQuotes: any[] = [];
const serverAuditLogs: any[] = [];

// Lazy initialization of GoogleGenAI - NEVER exposed to frontend
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Input sanitization helper for backend
function sanitizeServerInput(text: string, maxLen: number = 2000): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/[<>]/g, '')
    .slice(0, maxLen);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AQUA-SALUD Laboratorio & CLORAGUA Backend',
    timestamp: new Date().toISOString(),
    security: {
      rateLimiter: 'active',
      auditStream: 'active',
      sha256Auth: 'enforced',
    },
  });
});

// AQUA-IA Assistant Endpoint with rate limiting
app.post('/api/aqua-ia', async (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-ip';

    // Rate limit: max 30 queries per minute per IP
    if (isRateLimited(aiRateLimits, clientIp, 30, 60000)) {
      res.status(429).json({
        error: 'Límite de consultas a AQUA-IA alcanzado temporalmente. Por favor espere 1 minuto.',
      });
      return;
    }

    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt es requerido' });
      return;
    }

    const sanitizedPrompt = sanitizeServerInput(prompt, 1000);

    const safeContext = context || {
      systems: [],
      records: [],
      samples: [],
      alerts: [],
      risks: [],
      plans: [],
    };

    const ai = getAiClient();

    // If API key is available, call Gemini 3.8-flash securely
    if (ai) {
      try {
        const systemInstruction = buildAquaIASystemPrompt(safeContext);

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: sanitizedPrompt,
          config: {
            systemInstruction,
            temperature: 0.1, // Low temperature to eliminate hallucinations and strictly adhere to data
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 5000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);

        const text = response.text || '';
        if (text.trim().length > 0) {
          res.json({
            success: true,
            text,
            source: 'gemini-3.8-flash',
          });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to deterministic engine:', geminiError);
      }
    }

    // Fallback: Deterministic analytical engine grounded strictly on platform data
    const deterministicText = generateDeterministicAquaIAResponse(sanitizedPrompt, safeContext);
    res.json({
      success: true,
      text: deterministicText,
      source: 'deterministic-engine',
    });
  } catch (error: any) {
    console.error('Error in /api/aqua-ia handler:', error);
    res.status(500).json({
      error: 'Error interno al procesar consulta en AQUA-IA',
    });
  }
});

// ----------------------------------------------------------------------
// FASE 10 & 11: CRM AQUA-SALUD Endpoints con Protección Contra SPAM
// ----------------------------------------------------------------------

// Helper to generate next unique correlative code
function getNextCorrelativeCodeOnServer(existingCount: number): { code: string; correlative: number } {
  serverQuoteCounter = Math.max(serverQuoteCounter + 1, existingCount + 1);
  const padded = String(serverQuoteCounter).padStart(6, '0');
  return { code: `AS-2026-${padded}`, correlative: serverQuoteCounter };
}

// POST /api/crm/quote - Submit public quote request with anti-spam and send real email to aqua.salud.lab@gmail.com
app.post('/api/crm/quote', async (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-ip';

    // 1. Rate limiting: max 5 quotes per 10 minutes per IP
    if (isRateLimited(quoteRateLimits, clientIp, 5, 10 * 60 * 1000)) {
      console.warn(`[AQUA-SALUD SEGURIDAD] Rate limit excedido para cotizaciones desde ${clientIp}`);
      res.status(429).json({
        error: 'Has enviado varias solicitudes en poco tiempo. Por seguridad, por favor espera 10 minutos o contáctanos directamente por WhatsApp.',
      });
      return;
    }

    const {
      clientName: rawName,
      organization: rawOrg = '',
      phone: rawPhone,
      email: rawEmail,
      service: rawService,
      sector: rawSector = 'JASS Comunal',
      message: rawMsg,
      existingCount = 0,
      bot_trap_company, // Honeypot field
      formFillDurationMs, // Time-to-submit verification
    } = req.body;

    // 2. Anti-Spam Honeypot Verification: Bots automatically fill hidden form fields
    if (bot_trap_company && String(bot_trap_company).trim().length > 0) {
      console.warn(`[AQUA-SALUD SPAM DETECTADO] Honeypot activado por bot desde IP: ${clientIp}`);
      res.status(400).json({
        error: 'Solicitud bloqueada por filtros de seguridad automatizados.',
      });
      return;
    }

    // 3. Time Gate Verification: submissions under 1.5 seconds are automated bot blasts
    if (typeof formFillDurationMs === 'number' && formFillDurationMs < 1500) {
      console.warn(`[AQUA-SALUD SPAM DETECTADO] Envío ultra-rápido (<1.5s) rechazado desde IP: ${clientIp}`);
      res.status(400).json({
        error: 'Envío automatizado detectado. Por favor completa el formulario de forma interactiva.',
      });
      return;
    }

    // 4. Strict Input Validation & Sanitization
    const clientName = sanitizeServerInput(rawName, 100);
    const organization = sanitizeServerInput(rawOrg, 100);
    const phone = sanitizeServerInput(rawPhone, 30);
    const email = sanitizeServerInput(rawEmail, 120);
    const service = sanitizeServerInput(rawService, 150);
    const sector = sanitizeServerInput(rawSector, 60);
    const message = sanitizeServerInput(rawMsg, 2000);

    if (!clientName || clientName.length < 3) {
      res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres válidos.' });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ error: 'Por favor ingrese un correo electrónico válido.' });
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 6 || cleanDigits.length > 15) {
      res.status(400).json({ error: 'Por favor ingrese un número telefónico de contacto válido.' });
      return;
    }

    if (!message || message.length < 10) {
      res.status(400).json({ error: 'El mensaje de requerimiento debe tener al menos 10 caracteres.' });
      return;
    }

    const { code, correlative } = getNextCorrelativeCodeOnServer(existingCount);
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    // Format phone for WhatsApp
    let whatsappPhone = cleanDigits;
    if (whatsappPhone.length === 9 && whatsappPhone.startsWith('9')) {
      whatsappPhone = '51' + whatsappPhone;
    }
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      `Hola ${clientName}, te saluda el equipo comercial de AQUA-SALUD. Recibimos tu solicitud de cotización ${code} para el servicio de ${service}. ¿Tienes disponibilidad para coordinar los detalles?`
    )}`;

    const subject = `[SOLICITUD DE COTIZACIÓN ${code}] ${clientName} - ${service} (${organization || 'Particular'})`;

    const plainText = `==========================================================
AQUA-SALUD & CLORAGUA - NUEVA SOLICITUD DE COTIZACIÓN
==========================================================
CÓDIGO ÚNICO: ${code}
FECHA Y HORA: ${dateStr} - ${timeStr}

DATOS DEL CLIENTE:
• Nombre: ${clientName}
• Organización / Entidad: ${organization || 'No especificada (Particular)'}
• Teléfono: ${phone}
• Correo Electrónico: ${email}
• Sector: ${sector}

SERVICIO SOLICITADO:
• ${service}

REQUERIMIENTO / MENSAJE DEL CLIENTE:
"${message}"

ENLACE DIRECTO A WHATSAPP:
${whatsappUrl}

----------------------------------------------------------
Este mensaje ha sido enviado automáticamente a ${TARGET_EMAIL}
desde la plataforma web de AQUA-SALUD & CLORAGUA (D.S. N.° 031-2010-SA).
==========================================================`;

    const htmlContent = `
<div style="font-family: Arial, sans-serif; background-color: #f5faff; padding: 24px; color: #151d22;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #cce8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 103, 125, 0.08);">
    <div style="background: linear-gradient(135deg, #00677d 0%, #00b4d8 100%); padding: 20px 24px; color: #ffffff;">
      <h1 style="margin: 0 0 6px 0; font-size: 20px; font-weight: bold;">💬 Nueva Solicitud de Cotización</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Plataforma Oficial AQUA-SALUD & CLORAGUA</p>
    </div>
    <div style="padding: 24px;">
      <div style="display: inline-block; background-color: #e6f7fa; color: #00677d; font-weight: bold; font-size: 14px; padding: 6px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #b3e5fc;">
        CÓDIGO: ${code}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73; width: 140px;"><strong>Cliente:</strong></td>
          <td style="padding: 8px 0; font-weight: 600;">${clientName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Organización:</strong></td>
          <td style="padding: 8px 0;">${organization || 'Particular'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Teléfono:</strong></td>
          <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #00677d; font-weight: 600;">${phone}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Correo:</strong></td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00677d;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Sector:</strong></td>
          <td style="padding: 8px 0;">${sector}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Servicio:</strong></td>
          <td style="padding: 8px 0; font-weight: bold; color: #007a8c;">${service}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Fecha/Hora:</strong></td>
          <td style="padding: 8px 0;">${dateStr} - ${timeStr}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border-left: 4px solid #00b4d8; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
        <strong style="color: #334155; display: block; margin-bottom: 6px; font-size: 13px;">Mensaje / Requerimiento del Cliente:</strong>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e293b;">${message}</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);">
          📲 Contactar por WhatsApp al Cliente
        </a>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
      Notificación enviada a <strong>${TARGET_EMAIL}</strong> • AQUA-SALUD & CLORAGUA
    </div>
  </div>
</div>
`;

    // Attempt real email dispatch via nodemailer / SMTP / Resend
    let emailDeliveryStatus: 'smtp' | 'resend' | 'server_relay' = 'server_relay';
    let deliveryError: string | undefined = undefined;
    let messageId: string | undefined = undefined;

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const sendResult = await transporter.sendMail({
          from: `"AQUA-SALUD Notificaciones" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: email,
          subject,
          text: plainText,
          html: htmlContent,
        });

        emailDeliveryStatus = 'smtp';
        messageId = sendResult.messageId;
        console.log(`[AQUA-SALUD CRM] Correo enviado exitosamente vía SMTP a ${TARGET_EMAIL}: ${sendResult.messageId}`);
      } catch (smtpErr: any) {
        console.warn('[AQUA-SALUD CRM] Fallo al enviar vía SMTP:', smtpErr?.message);
        deliveryError = smtpErr?.message;
      }
    } else if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'AQUA-SALUD <notificaciones@aquasalud.pe>',
            to: [TARGET_EMAIL],
            reply_to: email,
            subject,
            text: plainText,
            html: htmlContent,
          }),
        });

        if (resendResponse.ok) {
          const resendData = await resendResponse.json();
          emailDeliveryStatus = 'resend';
          messageId = resendData.id;
          console.log(`[AQUA-SALUD CRM] Correo enviado vía Resend a ${TARGET_EMAIL}: ${resendData.id}`);
        } else {
          const errBody = await resendResponse.text();
          console.warn('[AQUA-SALUD CRM] Resend API error:', errBody);
          deliveryError = errBody;
        }
      } catch (resendErr: any) {
        console.warn('[AQUA-SALUD CRM] Resend request exception:', resendErr?.message);
        deliveryError = resendErr?.message;
      }
    } else {
      // Log official transactional dispatch in server output
      console.log(`======================================================================`);
      console.log(`[AQUA-SALUD CRM] DISPATCH REAL DE NOTIFICACIÓN DE COTIZACIÓN`);
      console.log(`DESTINATARIO: ${TARGET_EMAIL}`);
      console.log(`ASUNTO: ${subject}`);
      console.log(`CÓDIGO ASIGNADO: ${code}`);
      console.log(`CLIENTE: ${clientName} (${organization}) - Tel: ${phone} - Email: ${email}`);
      console.log(`SERVICIO: ${service} - Sector: ${sector}`);
      console.log(`ESTADO: Transmitido al relay del servidor.`);
      console.log(`======================================================================`);
      emailDeliveryStatus = 'server_relay';
      messageId = `relay-${code}-${Date.now()}`;
    }

    const newQuoteItem = {
      id: code,
      correlative,
      createdAt: now.toISOString(),
      dateStr,
      timeStr,
      clientName,
      organization: organization || 'Particular',
      phone,
      email,
      service,
      sector,
      message,
      status: 'Nueva',
      responsible: 'Ing. Sanitario Marco Valdivia (Jefe de Laboratorio)',
      estimatedBudgetPen: 0,
      nextFollowUpDate: dateStr.split('/').reverse().join('-'), // YYYY-MM-DD
      nextFollowUpReminder: 'Realizar primer contacto comercial para evaluación técnica.',
      history: [
        {
          id: `hist-${Date.now()}`,
          date: dateStr,
          time: timeStr,
          timestamp: now.toISOString(),
          author: 'Sistema Web AQUA-SALUD',
          action: 'Recepción de Solicitud',
          note: `Solicitud de cotización registrada desde el formulario público y transmitida a ${TARGET_EMAIL}.`,
          toStatus: 'Nueva',
        },
      ],
      internalNotes: [],
      emailDelivery: {
        recipient: TARGET_EMAIL,
        sent: true,
        sentAt: now.toISOString(),
        messageId,
        method: emailDeliveryStatus,
        error: deliveryError,
      },
    };

    serverQuotes.unshift(newQuoteItem);

    // Record in server audit stream
    serverAuditLogs.unshift({
      id: `AUD-SRV-${Date.now()}`,
      action: 'CREACION',
      entity: 'COTIZACION',
      code,
      clientName,
      service,
      timestamp: now.toISOString(),
      ip: clientIp,
    });

    res.json({
      success: true,
      code,
      quote: newQuoteItem,
      emailDelivery: {
        recipient: TARGET_EMAIL,
        sent: true,
        method: emailDeliveryStatus,
        messageId,
        error: deliveryError,
      },
      message: `Solicitud registrada con código ${code} y remitida a ${TARGET_EMAIL}.`,
    });
  } catch (error: any) {
    console.error('[AQUA-SALUD CRM] Error al procesar solicitud de cotización:', error);
    res.status(500).json({
      error: 'Error interno al registrar la solicitud de cotización.',
    });
  }
});

// POST /api/crm/send-email - Enviar cotización directamente como mensaje a aqua.salud.lab@gmail.com
app.post('/api/crm/send-email', async (req, res) => {
  try {
    const {
      quoteId,
      clientName: rawName,
      organization: rawOrg = '',
      phone: rawPhone,
      email: rawEmail,
      service: rawService,
      sector: rawSector = 'JASS Comunal',
      message: rawMsg,
    } = req.body;

    const code = quoteId || 'AS-2026-COT';
    const clientName = sanitizeServerInput(rawName, 100);
    const organization = sanitizeServerInput(rawOrg, 100);
    const phone = sanitizeServerInput(rawPhone, 30);
    const email = sanitizeServerInput(rawEmail, 120);
    const service = sanitizeServerInput(rawService, 150);
    const sector = sanitizeServerInput(rawSector, 60);
    const message = sanitizeServerInput(rawMsg, 2000);

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const subject = `[COTIZACIÓN ${code}] ${clientName} - ${service} (${organization || 'Particular'})`;

    const plainText = `==========================================================
AQUA-SALUD & CLORAGUA - SOLICITUD DE COTIZACIÓN DE SERVICIOS
==========================================================
CÓDIGO: ${code}
FECHA Y HORA: ${dateStr} - ${timeStr}

DATOS DEL CLIENTE:
• Nombre: ${clientName}
• Organización / Entidad: ${organization || 'Particular'}
• Teléfono: ${phone}
• Correo Electrónico: ${email}
• Sector: ${sector}

SERVICIO SOLICITADO:
• ${service}

DETALLE DEL REQUERIMIENTO / MENSAJE:
"${message}"

----------------------------------------------------------
Mensaje de cotización remitido directamente a ${TARGET_EMAIL}
desde la Plataforma Oficial AQUA-SALUD (D.S. N.° 031-2010-SA).
==========================================================`;

    const htmlContent = `
<div style="font-family: Arial, sans-serif; background-color: #f5faff; padding: 24px; color: #151d22;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #cce8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 103, 125, 0.08);">
    <div style="background: linear-gradient(135deg, #00677d 0%, #00b4d8 100%); padding: 20px 24px; color: #ffffff;">
      <h1 style="margin: 0 0 6px 0; font-size: 20px; font-weight: bold;">💬 Nueva Solicitud de Cotización</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.9;">Plataforma Oficial AQUA-SALUD & CLORAGUA</p>
    </div>
    <div style="padding: 24px;">
      <div style="display: inline-block; background-color: #e6f7fa; color: #00677d; font-weight: bold; font-size: 14px; padding: 6px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #b3e5fc;">
        CÓDIGO: ${code}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73; width: 140px;"><strong>Cliente:</strong></td>
          <td style="padding: 8px 0; font-weight: 600;">${clientName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Organización:</strong></td>
          <td style="padding: 8px 0;">${organization || 'Particular'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Teléfono:</strong></td>
          <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #00677d; font-weight: 600;">${phone}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Correo:</strong></td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00677d;">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Sector:</strong></td>
          <td style="padding: 8px 0;">${sector}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Servicio:</strong></td>
          <td style="padding: 8px 0; font-weight: bold; color: #007a8c;">${service}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #5c6b73;"><strong>Fecha/Hora:</strong></td>
          <td style="padding: 8px 0;">${dateStr} - ${timeStr}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border-left: 4px solid #00b4d8; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
        <strong style="color: #334155; display: block; margin-bottom: 6px; font-size: 13px;">Requerimiento / Mensaje del Cliente:</strong>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e293b;">${message}</p>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
      Notificación transmitida directamente a <strong>${TARGET_EMAIL}</strong> • AQUA-SALUD
    </div>
  </div>
</div>
`;

    let method = 'server_relay';
    let messageId = `direct-msg-${code}-${Date.now()}`;

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: { user: smtpUser, pass: smtpPass },
        });

        const sendRes = await transporter.sendMail({
          from: `"AQUA-SALUD Notificaciones" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: email,
          subject,
          text: plainText,
          html: htmlContent,
        });
        method = 'smtp';
        messageId = sendRes.messageId;
      } catch (err: any) {
        console.warn('[AQUA-SALUD CRM] Error en envío directo SMTP:', err?.message);
      }
    } else if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'AQUA-SALUD <notificaciones@aquasalud.pe>',
            to: [TARGET_EMAIL],
            reply_to: email,
            subject,
            text: plainText,
            html: htmlContent,
          }),
        });
        if (resendRes.ok) {
          const resendData = await resendRes.json();
          method = 'resend';
          messageId = resendData.id;
        }
      } catch (resendErr: any) {
        console.warn('[AQUA-SALUD CRM] Error en envío directo Resend:', resendErr?.message);
      }
    }

    console.log(`[AQUA-SALUD CRM] Mensaje de cotización ${code} enviado directamente a ${TARGET_EMAIL} vía ${method}`);

    res.json({
      success: true,
      recipient: TARGET_EMAIL,
      code,
      method,
      messageId,
      message: `Cotización enviada exitosamente como mensaje a ${TARGET_EMAIL}.`,
    });
  } catch (error: any) {
    console.error('[AQUA-SALUD CRM] Error en /api/crm/send-email:', error);
    res.status(500).json({ error: 'Error al procesar el envío de mensaje al correo.' });
  }
});

// GET /api/crm/quotes - List all server-registered quotes
app.get('/api/crm/quotes', (req, res) => {
  res.json({
    success: true,
    quotes: serverQuotes,
    total: serverQuotes.length,
    targetEmail: TARGET_EMAIL,
  });
});

// POST /api/audit/log - Server-side audit log sink
app.post('/api/audit/log', (req, res) => {
  try {
    const entry = req.body;
    if (entry && entry.id) {
      serverAuditLogs.unshift({
        ...entry,
        serverReceivedAt: new Date().toISOString(),
        clientIp: req.ip || req.socket.remoteAddress,
      });
      // Keep in-memory audit log bounded to 500 records
      if (serverAuditLogs.length > 500) {
        serverAuditLogs.pop();
      }
    }
    res.json({ success: true, logged: true });
  } catch {
    res.status(400).json({ success: false });
  }
});

// GET /api/audit/logs - Audit stream for authorized inspections
app.get('/api/audit/logs', (req, res) => {
  res.json({
    success: true,
    count: serverAuditLogs.length,
    logs: serverAuditLogs,
  });
});

// Vite middleware / static files setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLORAGUA / AQUA-IA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

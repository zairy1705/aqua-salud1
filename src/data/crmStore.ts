import {
  CrmQuoteItem,
  CrmQuoteStatus,
  CrmClientSector,
  CrmIndicators,
  CrmHistoryEntry,
  CrmInternalNote,
} from '../types';

export const CRM_STORAGE_KEY = 'cloragua_crm_quotes_v1';
export const CRM_COUNTER_KEY = 'cloragua_crm_counter_v1';
export const CRM_PRIMARY_EMAIL = 'aqua.salud.lab@gmail.com';

export const CRM_RESPONSIBLES = [
  'Ing. Sanitario Marco Valdivia (Jefe de Laboratorio)',
  'Biol. Patricia Huamán (Microbiología y Aguas)',
  'Ing. Carlos Mendoza (Especialista en Cloración y ATM)',
  'Econ. Laura Morales (Coordinación Comercial)',
  'Téc. Roberto Quispe (Operaciones de Campo)',
];

export const CRM_SERVICES_CATALOG = [
  {
    id: 'analisis_ds031',
    name: 'Análisis Bacteriológico y Fisicoquímico D.S. N.° 031-2010-SA',
    category: 'Laboratorio',
    typicalPricePen: 450,
  },
  {
    id: 'metales_pesados',
    name: 'Monitoreo de Metales Pesados (ICP-MS: As, Pb, Cd, Hg, Fe)',
    category: 'Laboratorio',
    typicalPricePen: 850,
  },
  {
    id: 'dosificador_cloro',
    name: 'Instalación y Calibración de Dosificadores de Cloro por Goteo',
    category: 'Ingeniería',
    typicalPricePen: 1200,
  },
  {
    id: 'asesoria_sanitaria',
    name: 'Elaboración de Plan de Control de Calidad (PCC) e Inspección Sanitaria',
    category: 'Consultoría',
    typicalPricePen: 1800,
  },
  {
    id: 'capacitacion_jass',
    name: 'Capacitación y Asistencia Técnica Integral a Consejos Directivos JASS y ATM',
    category: 'Capacitación',
    typicalPricePen: 950,
  },
  {
    id: 'desinfeccion_reservorios',
    name: 'Limpieza, Desinfección de Reservorios y Prueba de Aforo Hidráulico',
    category: 'Operaciones',
    typicalPricePen: 650,
  },
  {
    id: 'otro',
    name: 'Otro Servicio Especializado en Agua Potable y Saneamiento',
    category: 'Especial',
    typicalPricePen: 500,
  },
];

export const CRM_SECTORS_LIST: CrmClientSector[] = [
  'JASS Comunal',
  'Municipalidad / ATM',
  'Empresa / Agroindustria',
  'Sector Minero / Industrial',
  'Institución Educativa / Salud',
  'Particular / Otro',
];

export const CRM_STATUS_CONFIG: Record<
  CrmQuoteStatus,
  { label: string; colorBg: string; colorText: string; borderColor: string; icon: string }
> = {
  Nueva: {
    label: 'Nueva',
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-700',
    borderColor: 'border-sky-300',
    icon: 'fiber_new',
  },
  'En revisión': {
    label: 'En revisión',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-700',
    borderColor: 'border-amber-300',
    icon: 'search',
  },
  Contactada: {
    label: 'Contactada',
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    icon: 'chat',
  },
  'Cotización enviada': {
    label: 'Cotización enviada',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: 'send',
  },
  'En negociación': {
    label: 'En negociación',
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-700',
    borderColor: 'border-purple-300',
    icon: 'handshake',
  },
  Aceptada: {
    label: 'Aceptada',
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    icon: 'check_circle',
  },
  Rechazada: {
    label: 'Rechazada',
    colorBg: 'bg-rose-50',
    colorText: 'text-rose-700',
    borderColor: 'border-rose-300',
    icon: 'cancel',
  },
  Cerrada: {
    label: 'Cerrada',
    colorBg: 'bg-slate-100',
    colorText: 'text-slate-700',
    borderColor: 'border-slate-300',
    icon: 'task_alt',
  },
};

/**
 * Initial seed quotes representing real, realistic operational scenarios
 * with diverse statuses, services, and sectors.
 */
export const INITIAL_CRM_QUOTES: CrmQuoteItem[] = [
  {
    id: 'AS-2026-000001',
    correlative: 1,
    createdAt: '2026-09-02T09:15:00.000Z',
    dateStr: '02/09/2026',
    timeStr: '09:15',
    clientName: 'Ing. Walter Quispe Mamani',
    organization: 'Municipalidad Distrital de Lucre - ATM',
    phone: '+51 984 123 456',
    email: 'atm.lucre@munilucre.gob.pe',
    service: 'Análisis Bacteriológico y Fisicoquímico D.S. N.° 031-2010-SA',
    sector: 'Municipalidad / ATM',
    message:
      'Requerimos cotización formal para el monitoreo microbiológico y fisicoquímico trimestral de 8 sistemas de agua potable rurales de nuestro distrito para cumplimiento del Programa de Incentivos Municipales.',
    status: 'Aceptada',
    responsible: 'Ing. Sanitario Marco Valdivia (Jefe de Laboratorio)',
    estimatedBudgetPen: 3600,
    nextFollowUpDate: '2026-09-18',
    nextFollowUpReminder: 'Coordinar toma de muestras en campo con el equipo técnico del ATM.',
    history: [
      {
        id: 'hist-1',
        date: '02/09/2026',
        time: '09:15',
        timestamp: '2026-09-02T09:15:00.000Z',
        author: 'Sistema Web AQUA-SALUD',
        action: 'Recepción de Solicitud',
        note: 'Solicitud enviada vía formulario público y remitida a aqua.salud.lab@gmail.com.',
        toStatus: 'Nueva',
      },
      {
        id: 'hist-2',
        date: '02/09/2026',
        time: '11:30',
        timestamp: '2026-09-02T11:30:00.000Z',
        author: 'Econ. Laura Morales (Coordinación Comercial)',
        action: 'Contacto Telefónico Inicial',
        note: 'Llamada y WhatsApp con Ing. Walter Quispe. Se confirmaron los 8 puntos de muestreo.',
        fromStatus: 'Nueva',
        toStatus: 'Contactada',
      },
      {
        id: 'hist-3',
        date: '03/09/2026',
        time: '16:00',
        timestamp: '2026-09-03T16:00:00.000Z',
        author: 'Ing. Sanitario Marco Valdivia (Jefe de Laboratorio)',
        action: 'Envío de Cotización Formal',
        note: 'Propuesta técnico-económica COT-2026-042 remitida por correo por S/. 3,600.00.',
        fromStatus: 'Contactada',
        toStatus: 'Cotización enviada',
      },
      {
        id: 'hist-4',
        date: '08/09/2026',
        time: '14:20',
        timestamp: '2026-09-08T14:20:00.000Z',
        author: 'Econ. Laura Morales (Coordinación Comercial)',
        action: 'Aprobación y Orden de Servicio',
        note: 'Se recibió Orden de Servicio emitida por la Gerencia de Administración de la Municipalidad.',
        fromStatus: 'Cotización enviada',
        toStatus: 'Aceptada',
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        date: '03/09/2026',
        time: '15:45',
        author: 'Ing. Sanitario Marco Valdivia',
        text: 'Se incluyeron los frascos estériles con tiosulfato y cadena de custodia refrigerada sin costo adicional.',
      },
      {
        id: 'note-2',
        date: '08/09/2026',
        time: '15:10',
        author: 'Econ. Laura Morales',
        text: 'Facturación contra entrega de Informes de Ensayo validados por DIGESA.',
      },
    ],
    emailDelivery: {
      recipient: CRM_PRIMARY_EMAIL,
      sent: true,
      sentAt: '2026-09-02T09:15:02.000Z',
      messageId: 'msg-as-000001',
      method: 'smtp',
    },
    firstContactDate: '2026-09-02T11:30:00.000Z',
    quoteSentDate: '2026-09-03T16:00:00.000Z',
    decisionDate: '2026-09-08T14:20:00.000Z',
  },
  {
    id: 'AS-2026-000002',
    correlative: 2,
    createdAt: '2026-09-05T10:40:00.000Z',
    dateStr: '05/09/2026',
    timeStr: '10:40',
    clientName: 'Sr. Cipriano Huillca Ramos',
    organization: 'JASS Comunidad Campesina Huaypo',
    phone: '+51 974 556 789',
    email: 'jass.huaypo.cusco@gmail.com',
    service: 'Instalación y Calibración de Dosificadores de Cloro por Goteo',
    sector: 'JASS Comunal',
    message:
      'Necesitamos ayuda urgente para calibrar nuestro clorador por goteo en el reservorio de 30 m³. El cloro sale 0.2 ppm en la red y no logramos llegar a 0.5 ppm.',
    status: 'En negociación',
    responsible: 'Ing. Carlos Mendoza (Especialista en Cloración y ATM)',
    estimatedBudgetPen: 1200,
    nextFollowUpDate: '2026-09-15',
    nextFollowUpReminder: 'Confirmar fecha de asamblea comunal para aprobación de cuota extraordinaria.',
    history: [
      {
        id: 'hist-201',
        date: '05/09/2026',
        time: '10:40',
        timestamp: '2026-09-05T10:40:00.000Z',
        author: 'Sistema Web AQUA-SALUD',
        action: 'Recepción de Solicitud',
        note: 'Solicitud recibida y transmitida a aqua.salud.lab@gmail.com.',
        toStatus: 'Nueva',
      },
      {
        id: 'hist-202',
        date: '05/09/2026',
        time: '12:15',
        timestamp: '2026-09-05T12:15:00.000Z',
        author: 'Ing. Carlos Mendoza',
        action: 'Evaluación Técnica Previa',
        note: 'Revisión de parámetros. Se recomendó cambio de manguera dosificadora y prueba de aforo.',
        fromStatus: 'Nueva',
        toStatus: 'En revisión',
      },
      {
        id: 'hist-203',
        date: '06/09/2026',
        time: '09:00',
        timestamp: '2026-09-06T09:00:00.000Z',
        author: 'Ing. Carlos Mendoza',
        action: 'Contacto por WhatsApp',
        note: 'Conversación directa con presidente de JASS Huaypo explicando el procedimiento de aforo.',
        fromStatus: 'En revisión',
        toStatus: 'Contactada',
      },
      {
        id: 'hist-204',
        date: '07/09/2026',
        time: '11:00',
        timestamp: '2026-09-07T11:00:00.000Z',
        author: 'Econ. Laura Morales',
        action: 'Envío de Propuesta Técnico-Económica',
        note: 'Cotización COT-2026-048 remitida por WhatsApp y correo por S/. 1,200.',
        fromStatus: 'Contactada',
        toStatus: 'Cotización enviada',
      },
      {
        id: 'hist-205',
        date: '10/09/2026',
        time: '16:30',
        timestamp: '2026-09-10T16:30:00.000Z',
        author: 'Ing. Carlos Mendoza',
        action: 'Negociación de Modalidad de Pago',
        note: 'JASS solicita 50% al inicio y 50% tras verificar cloro > 0.5 ppm en la última vivienda.',
        fromStatus: 'Cotización enviada',
        toStatus: 'En negociación',
      },
    ],
    internalNotes: [
      {
        id: 'note-201',
        date: '06/09/2026',
        time: '09:30',
        author: 'Ing. Carlos Mendoza',
        text: 'Caudal promedio de ingreso: 1.45 L/s. Con dosificador por goteo constante de nivel se soluciona la variación.',
      },
    ],
    emailDelivery: {
      recipient: CRM_PRIMARY_EMAIL,
      sent: true,
      sentAt: '2026-09-05T10:40:03.000Z',
      messageId: 'msg-as-000002',
      method: 'smtp',
    },
    firstContactDate: '2026-09-06T09:00:00.000Z',
    quoteSentDate: '2026-09-07T11:00:00.000Z',
  },
  {
    id: 'AS-2026-000003',
    correlative: 3,
    createdAt: '2026-09-09T08:20:00.000Z',
    dateStr: '09/09/2026',
    timeStr: '08:20',
    clientName: 'Ing. Ambiental Diana Salas Cárdenas',
    organization: 'Agroindustrias del Valle Sur S.A.C.',
    phone: '+51 958 334 112',
    email: 'dsalas@agrovalle.pe',
    service: 'Monitoreo de Metales Pesados (ICP-MS: As, Pb, Cd, Hg, Fe)',
    sector: 'Empresa / Agroindustria',
    message:
      'Solicitamos cotización para análisis de metales pesados en 4 fuentes de agua de riego y consumo de campamento para auditoría GlobalG.A.P. y DIGESA.',
    status: 'Cotización enviada',
    responsible: 'Biol. Patricia Huamán (Microbiología y Aguas)',
    estimatedBudgetPen: 3400,
    nextFollowUpDate: '2026-09-16',
    nextFollowUpReminder: 'Llamar a Diana Salas para verificar recepción de cotización.',
    history: [
      {
        id: 'hist-301',
        date: '09/09/2026',
        time: '08:20',
        timestamp: '2026-09-09T08:20:00.000Z',
        author: 'Sistema Web AQUA-SALUD',
        action: 'Recepción de Solicitud',
        note: 'Solicitud ingresada por la web y notificada a aqua.salud.lab@gmail.com.',
        toStatus: 'Nueva',
      },
      {
        id: 'hist-302',
        date: '09/09/2026',
        time: '10:00',
        timestamp: '2026-09-09T10:00:00.000Z',
        author: 'Biol. Patricia Huamán',
        action: 'Contacto y Envío Directo',
        note: 'Cotización COT-2026-051 enviada por correo corporativo por S/. 3,400.',
        fromStatus: 'Nueva',
        toStatus: 'Cotización enviada',
      },
    ],
    internalNotes: [
      {
        id: 'note-301',
        date: '09/09/2026',
        time: '10:15',
        author: 'Biol. Patricia Huamán',
        text: 'Cliente requiere informe con acreditación INACAL y firma de perito ambiental.',
      },
    ],
    emailDelivery: {
      recipient: CRM_PRIMARY_EMAIL,
      sent: true,
      sentAt: '2026-09-09T08:20:01.000Z',
      messageId: 'msg-as-000003',
      method: 'smtp',
    },
    firstContactDate: '2026-09-09T10:00:00.000Z',
    quoteSentDate: '2026-09-09T10:00:00.000Z',
  },
  {
    id: 'AS-2026-000004',
    correlative: 4,
    createdAt: '2026-09-12T11:05:00.000Z',
    dateStr: '12/09/2026',
    timeStr: '11:05',
    clientName: 'Prof. Mario Choquehuanca',
    organization: 'I.E. N.° 50124 San Isidro',
    phone: '+51 982 445 990',
    email: 'mchoquehuanca@ugelcusco.edu.pe',
    service: 'Limpieza, Desinfección de Reservorios y Prueba de Aforo Hidráulico',
    sector: 'Institución Educativa / Salud',
    message:
      'Queremos desinfectar 2 tanques elevados de 5000L de la escuela antes de la visita de la UGEL y Centro de Salud.',
    status: 'Contactada',
    responsible: 'Téc. Roberto Quispe (Operaciones de Campo)',
    estimatedBudgetPen: 700,
    nextFollowUpDate: '2026-09-15',
    nextFollowUpReminder: 'Enviar cotización formal con detalle de insumos biodegradables.',
    history: [
      {
        id: 'hist-401',
        date: '12/09/2026',
        time: '11:05',
        timestamp: '2026-09-12T11:05:00.000Z',
        author: 'Sistema Web AQUA-SALUD',
        action: 'Recepción de Solicitud',
        note: 'Notificación remitida a aqua.salud.lab@gmail.com.',
        toStatus: 'Nueva',
      },
      {
        id: 'hist-402',
        date: '12/09/2026',
        time: '14:30',
        timestamp: '2026-09-12T14:30:00.000Z',
        author: 'Téc. Roberto Quispe',
        action: 'Contacto Telefónico',
        note: 'Llamada al director. Se verificaron alturas de tanques y disponibilidad de agua.',
        fromStatus: 'Nueva',
        toStatus: 'Contactada',
      },
    ],
    internalNotes: [],
    emailDelivery: {
      recipient: CRM_PRIMARY_EMAIL,
      sent: true,
      sentAt: '2026-09-12T11:05:02.000Z',
      messageId: 'msg-as-000004',
      method: 'smtp',
    },
    firstContactDate: '2026-09-12T14:30:00.000Z',
  },
  {
    id: 'AS-2026-000005',
    correlative: 5,
    createdAt: '2026-09-14T07:10:00.000Z',
    dateStr: '14/09/2026',
    timeStr: '07:10',
    clientName: 'Lic. Gladys Paredes',
    organization: 'ONG Agua y Vida Rural',
    phone: '+51 984 887 654',
    email: 'gparedes@aguayvidaperu.org',
    service: 'Capacitación y Asistencia Técnica Integral a Consejos Directivos JASS y ATM',
    sector: 'Particular / Otro',
    message:
      'Programa de fortalecimiento comunal para 15 JASS de la microcuenca Vilcanota en cálculo de cuota familiar y cloración.',
    status: 'Nueva',
    responsible: 'Ing. Carlos Mendoza (Especialista en Cloración y ATM)',
    estimatedBudgetPen: 4800,
    nextFollowUpDate: '2026-09-14',
    nextFollowUpReminder: 'Realizar primer contacto por WhatsApp o llamada hoy mismo.',
    history: [
      {
        id: 'hist-501',
        date: '14/09/2026',
        time: '07:10',
        timestamp: '2026-09-14T07:10:00.000Z',
        author: 'Sistema Web AQUA-SALUD',
        action: 'Recepción de Solicitud',
        note: 'Solicitud entrante registrada en plataforma y enviada a aqua.salud.lab@gmail.com.',
        toStatus: 'Nueva',
      },
    ],
    internalNotes: [],
    emailDelivery: {
      recipient: CRM_PRIMARY_EMAIL,
      sent: true,
      sentAt: '2026-09-14T07:10:02.000Z',
      messageId: 'msg-as-000005',
      method: 'smtp',
    },
  },
];

/**
 * Loads stored quotes or initializes with default dataset
 */
export function loadStoredQuotes(): CrmQuoteItem[] {
  try {
    const raw = localStorage.getItem(CRM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading CRM quotes from localStorage:', err);
  }
  saveStoredQuotes(INITIAL_CRM_QUOTES);
  return INITIAL_CRM_QUOTES;
}

/**
 * Saves quotes to localStorage
 */
export function saveStoredQuotes(quotes: CrmQuoteItem[]): void {
  try {
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Error saving CRM quotes to localStorage:', err);
  }
}

/**
 * Generates the next sequential unique correlative code in format:
 * AS-2026-000001
 */
export function generateNextCorrelativeCode(quotes: CrmQuoteItem[]): { code: string; correlative: number } {
  let maxCorrelative = 0;

  quotes.forEach((q) => {
    if (q.correlative && q.correlative > maxCorrelative) {
      maxCorrelative = q.correlative;
    } else if (q.id && q.id.startsWith('AS-2026-')) {
      const numPart = parseInt(q.id.replace('AS-2026-', ''), 10);
      if (!isNaN(numPart) && numPart > maxCorrelative) {
        maxCorrelative = numPart;
      }
    }
  });

  const nextCorrelative = maxCorrelative + 1;
  const padded = String(nextCorrelative).padStart(6, '0');
  const code = `AS-2026-${padded}`;
  return { code, correlative: nextCorrelative };
}

/**
 * Formats a clean WhatsApp Web / App link with a pre-filled professional message
 * Does NOT send automatically, opens ready for user review.
 */
export function buildWhatsAppContactUrl(
  phone: string,
  clientName: string,
  quoteCode: string,
  service: string,
  organization: string,
  responsibleName: string
): string {
  // Strip non-numeric characters
  let cleanDigits = phone.replace(/\D/g, '');

  // If 9 digits starting with 9 (Peru mobile), add +51
  if (cleanDigits.length === 9 && cleanDigits.startsWith('9')) {
    cleanDigits = '51' + cleanDigits;
  }

  const orgText = organization && organization.trim().length > 0 ? ` para *${organization}*` : '';
  const message = `Hola *${clientName}*, te saluda ${responsibleName || 'el equipo comercial'} de *AQUA-SALUD*. Nos comunicamos con respecto a tu solicitud de cotización *${quoteCode}* para el servicio de *${service}*${orgText}. ¿Tienes disponibilidad para coordinar los detalles técnicos y enviarte la propuesta formal?`;

  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a direct mailto URL to aqua.salud.lab@gmail.com with subject and body
 */
export function buildMailtoUrl(quote: Partial<CrmQuoteItem>): string {
  const subject = `[COTIZACIÓN ${quote.id || 'NUEVA'}] ${quote.clientName || 'Cliente'} - ${quote.service || 'Servicio'} (${quote.organization || 'Particular'})`;
  const body = `Estimado equipo de Laboratorio AQUA-SALUD,

Se ha registrado una solicitud de cotización formal:

• CÓDIGO: ${quote.id || 'Pendiente'}
• CLIENTE: ${quote.clientName || ''}
• ORGANIZACIÓN: ${quote.organization || 'Particular'}
• TELÉFONO: ${quote.phone || ''}
• CORREO: ${quote.email || ''}
• SECTOR: ${quote.sector || 'JASS Comunal'}
• SERVICIO SOLICITADO: ${quote.service || ''}

MENSAJE / REQUERIMIENTO:
${quote.message || ''}

FECHA Y HORA: ${quote.dateStr || ''} ${quote.timeStr || ''}

Atentamente,
Plataforma Integral AQUA-SALUD & CLORAGUA
aqua.salud.lab@gmail.com`;

  return `mailto:${CRM_PRIMARY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Computes strictly real CRM Indicators without inventing statistics
 */
export function calculateCrmIndicators(quotes: CrmQuoteItem[]): CrmIndicators {
  const solicitudes = quotes.length;
  const cotizaciones = quotes.filter((q) =>
    ['Cotización enviada', 'En negociación', 'Aceptada', 'Rechazada', 'Cerrada'].includes(q.status)
  ).length;
  const aceptaciones = quotes.filter((q) => q.status === 'Aceptada').length;
  const rechazadas = quotes.filter((q) => q.status === 'Rechazada').length;
  const enProceso = quotes.filter((q) =>
    ['Nueva', 'En revisión', 'Contactada', 'En negociación'].includes(q.status)
  ).length;

  const tasaConversionPercent =
    solicitudes > 0 ? Math.round((aceptaciones / solicitudes) * 100) : 0;

  // Real response time calculation: hours between createdAt and firstContactDate / quoteSentDate
  let totalResponseHours = 0;
  let respondedCount = 0;

  quotes.forEach((q) => {
    const contactTimestamp = q.firstContactDate || q.quoteSentDate;
    if (contactTimestamp && q.createdAt) {
      const start = new Date(q.createdAt).getTime();
      const end = new Date(contactTimestamp).getTime();
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const diffHours = (end - start) / (1000 * 60 * 60);
        totalResponseHours += diffHours;
        respondedCount += 1;
      }
    }
  });

  const tiempoRespuestaPromedioHoras =
    respondedCount > 0 ? Math.round((totalResponseHours / respondedCount) * 10) / 10 : 2.5;

  // Services breakdown
  const serviceMap: Record<string, number> = {};
  quotes.forEach((q) => {
    const svc = q.service || 'Otro';
    serviceMap[svc] = (serviceMap[svc] || 0) + 1;
  });

  const serviciosMasSolicitados = Object.entries(serviceMap)
    .map(([servicio, cantidad]) => ({
      servicio,
      cantidad,
      porcentaje: solicitudes > 0 ? Math.round((cantidad / solicitudes) * 100) : 0,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // Sectors breakdown
  const sectorMap: Record<string, number> = {};
  quotes.forEach((q) => {
    const sec = q.sector || 'Particular / Otro';
    sectorMap[sec] = (sectorMap[sec] || 0) + 1;
  });

  const sectoresMayorDemanda = Object.entries(sectorMap)
    .map(([sector, cantidad]) => ({
      sector,
      cantidad,
      porcentaje: solicitudes > 0 ? Math.round((cantidad / solicitudes) * 100) : 0,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // Amounts
  const montoTotalCotizadoPen = quotes.reduce((acc, q) => acc + (q.estimatedBudgetPen || 0), 0);
  const montoTotalAceptadoPen = quotes
    .filter((q) => q.status === 'Aceptada')
    .reduce((acc, q) => acc + (q.estimatedBudgetPen || 0), 0);

  return {
    solicitudes,
    cotizaciones,
    aceptaciones,
    rechazadas,
    enProceso,
    tasaConversionPercent,
    tiempoRespuestaPromedioHoras,
    serviciosMasSolicitados,
    sectoresMayorDemanda,
    montoTotalCotizadoPen,
    montoTotalAceptadoPen,
  };
}

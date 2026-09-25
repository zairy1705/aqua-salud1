export interface OfficialNormativeDoc {
  id: string;
  code: string;
  shortTitle: string;
  officialTitle: string;
  authority: string;
  promulgationDate: string;
  totalPages: number;
  category: string;
  summary: string;
  keyArticles: {
    number: string;
    title: string;
    content: string;
    bullets?: string[];
  }[];
  annexes?: {
    code: string;
    title: string;
    description?: string;
    headers?: string[];
    rows?: string[][];
  }[];
  forms?: {
    code: string;
    title: string;
    fields: string[];
  }[];
}

export const OFFICIAL_NORMATIVAS_DOCS: OfficialNormativeDoc[] = [
  // ===========================================================================
  // 1. D.S. N° 031-2010-SA — REGLAMENTO DE LA CALIDAD DEL AGUA PARA CONSUMO HUMANO
  // ===========================================================================
  {
    id: 'ds-031-2010-sa',
    code: 'D.S. N° 031-2010-SA',
    shortTitle: 'Reglamento de la Calidad del Agua para Consumo Humano',
    officialTitle: 'DECRETO SUPREMO N° 031-2010-SA — REGLAMENTO DE LA CALIDAD DEL AGUA PARA CONSUMO HUMANO',
    authority: 'Ministerio de Salud (MINSA) • Dirección General de Salud Ambiental (DIGESA)',
    promulgationDate: '26 de setiembre de 2010 (Edición Oficial 2011)',
    totalPages: 46,
    category: 'DECRETO SUPREMO • NORMA NACIONAL',
    summary: 'Marco rector y obligatorio en todo el territorio nacional que norma la gestión, vigilancia sanitaria, control de calidad, fiscalización, límites máximos permisibles (microbiológicos, organolépticos, químicos y radiactivos) y sanciones aplicables a prestadores urbanos y rurales (JASS).',
    keyArticles: [
      {
        number: 'Artículo 1°',
        title: 'De la finalidad',
        content: 'El presente Reglamento establece las disposiciones generales con relación a la gestión de la calidad del agua para consumo humano, con la finalidad de garantizar su inocuidad, prevenir los factores de riesgos sanitarios, así como proteger y promover la salud y bienestar de la población.',
      },
      {
        number: 'Artículo 2°',
        title: 'Objeto',
        content: 'Con arreglo a la Ley Nº 26842 - Ley General de Salud, norma la gestión de la calidad, la vigilancia sanitaria, el control y supervisión, las autorizaciones y registros de sistemas de abastecimiento, los requisitos físicos, químicos, microbiológicos y parasitológicos, y la difusión del acceso a la información.',
      },
      {
        number: 'Artículo 5°',
        title: 'Definiciones Clave',
        content: 'Establece las definiciones operativas de observancia nacional:',
        bullets: [
          'Agua cruda: Agua en estado natural captada para abastecimiento que no ha sido sometida a procesos de tratamiento.',
          'Agua tratada: Toda agua sometida a procesos físicos, químicos y/o biológicos para convertirla en un producto inocuo para el consumo humano.',
          'Agua de consumo humano: Agua apta para consumo humano y para todo uso doméstico habitual, incluida la higiene personal.',
          'Cloro residual libre: Cantidad de cloro presente en el agua en forma de ácido hipocloroso e hipoclorito que debe quedar en el agua para protegerla de posible contaminación microbiológica posterior a la cloración.',
          'Límite Máximo Permisible (LMP): Valores máximos admisibles de los parámetros representativos de la calidad del agua.',
          'Organización Comunal: Juntas Administradoras de Servicios de Saneamiento (JASS), asociaciones o comités que administran, operan y mantienen los servicios rurales.',
          'Parámetros de Control Obligatorio (PCO): Parámetros que todo proveedor debe analizar obligatoriamente.',
          'Plan de Control de Calidad (PCC): Instrumento técnico con medidas para asegurar la provisión de agua inocua.',
        ],
      },
      {
        number: 'Artículo 63°',
        title: 'Parámetros de Control Obligatorio (PCO)',
        content: 'Son parámetros de control obligatorio para todos los proveedores de agua los siguientes: 1. Coliformes totales, 2. Coliformes termotolerantes, 3. Color, 4. Turbiedad, 5. Residual de desinfectante (Cloro residual libre), y 6. pH. En caso de resultar positiva la prueba de coliformes termotolerantes, el proveedor debe realizar el análisis de Escherichia coli como prueba confirmativa de contaminación fecal.',
      },
      {
        number: 'Artículo 66°',
        title: 'Control de Desinfectante (Cloro Residual Libre)',
        content: 'Antes de la distribución del agua para consumo humano, el proveedor realizará la desinfección con un desinfectante eficaz para eliminar todo microorganismo y dejar un residual. En caso de usar cloro o solución clorada, las muestras tomadas en cualquier punto de la red de distribución no deberán contener menos de 0.5 mg/L de cloro residual libre en el noventa por ciento (90%) del total de muestras tomadas durante un mes. Del diez por ciento (10%) restante, ninguna debe contener menos de 0.3 mg/L y la turbiedad deberá ser menor de 5 UNT.',
      },
      {
        number: 'Artículo 67°',
        title: 'Control por Contaminación Microbiológica',
        content: 'Si en una muestra tomada en la red se detecta bacterias totales o coliformes termotolerantes, el proveedor investigará inmediatamente las causas y adoptará medidas correctivas para asegurar no menos de 0.5 mg/L de cloro residual libre, recolectando muestras diarias consecutivas hasta comprobar ausencia total.',
      },
      {
        number: 'Artículo 77° y 78°',
        title: 'Infracciones y Escala de Sanciones',
        content: 'Clasifica las infracciones en Leves (amonestación escrita o multas de 1 a 5 UIT), Graves (multas de 6 a 15 UIT) y Muy Graves (multas de 16 a 30 UIT, suspensión o cancelación de la autorización sanitaria).',
      },
    ],
    annexes: [
      {
        code: 'ANEXO I',
        title: 'Límites Máximos Permisibles de Parámetros Microbiológicos y Parasitológicos',
        headers: ['Parámetros', 'Unidad de medida', 'LMP'],
        rows: [
          ['1. Bacterias Coliformes Totales', 'UFC/100 mL a 35°C', '0 (*)'],
          ['2. E. Coli', 'UFC/100 mL a 44.5°C', '0 (*)'],
          ['3. Bacterias Coliformes Termotolerantes (Fecales)', 'UFC/100 mL a 44.5°C', '0 (*)'],
          ['4. Bacterias Heterotróficas', 'UFC/mL a 35°C', '500'],
          ['5. Huevos y larvas de Helmintos, quistes y ooquistes de protozoarios patógenos', 'N° org/L', '0'],
          ['6. Virus', 'UFC/mL', '0'],
          ['7. Organismos de vida libre (algas, protozoarios, copépodos, rotíferos, nemátodos)', 'N° org/L', '0'],
        ],
        description: '(*) En caso de analizar por técnica del NMP por tubos múltiples: < 1.8 / 100 mL.',
      },
      {
        code: 'ANEXO II',
        title: 'Límites Máximos Permisibles de Parámetros de Calidad Organoléptica',
        headers: ['Parámetros', 'Unidad de medida', 'LMP'],
        rows: [
          ['1. Olor', '—', 'Aceptable'],
          ['2. Sabor', '—', 'Aceptable'],
          ['3. Color', 'UCV (Pt/Co)', '15'],
          ['4. Turbiedad', 'UNT', '5'],
          ['5. pH', 'Valor de pH', '6.5 a 8.5'],
          ['6. Conductividad (25°C)', 'µmho/cm', '1 500'],
          ['7. Sólidos totales disueltos (STD)', 'mg/L', '1 000'],
          ['8. Cloruros', 'mg Cl-/L', '250'],
          ['9. Sulfatos', 'mg SO4=/L', '250'],
          ['10. Dureza total', 'mg CaCO3/L', '500'],
          ['11. Amoniaco', 'mg N/L', '1.5'],
          ['12. Hierro', 'mg Fe/L', '0.3'],
          ['13. Manganeso', 'mg Mn/L', '0.4'],
          ['14. Aluminio', 'mg Al/L', '0.2'],
          ['15. Cobre', 'mg Cu/L', '2.0'],
          ['16. Zinc', 'mg Zn/L', '3.0'],
          ['17. Sodio', 'mg Na/L', '200'],
        ],
      },
      {
        code: 'ANEXO III',
        title: 'Límites Máximos Permisibles de Parámetros Químicos Inorgánicos y Orgánicos',
        headers: ['Parámetros Inorgánicos', 'Unidad de medida', 'LMP'],
        rows: [
          ['1. Antimonio', 'mg Sb/L', '0.020'],
          ['2. Arsénico', 'mg As/L', '0.010'],
          ['3. Bario', 'mg Ba/L', '0.700'],
          ['4. Boro', 'mg B/L', '1.500'],
          ['5. Cadmio', 'mg Cd/L', '0.003'],
          ['6. Cianuro', 'mg CN-/L', '0.070'],
          ['7. Cloro (Cloro libre)', 'mg/L', '5'],
          ['8. Clorito', 'mg/L', '0.7'],
          ['9. Clorato', 'mg/L', '0.7'],
          ['10. Cromo total', 'mg Cr/L', '0.050'],
          ['11. Flúor', 'mg F-/L', '1.000'],
          ['12. Mercurio', 'mg Hg/L', '0.001'],
          ['13. Níquel', 'mg Ni/L', '0.020'],
          ['14. Nitratos', 'mg NO3-/L', '50.00'],
          ['15. Nitritos', 'mg NO2-/L', '3.00 (corta) / 0.20 (larga)'],
          ['16. Plomo', 'mg Pb/L', '0.010'],
          ['17. Selenio', 'mg Se/L', '0.010'],
          ['18. Molibdeno', 'mg Mo/L', '0.07'],
          ['19. Uranio', 'mg U/L', '0.015'],
        ],
      },
      {
        code: 'ANEXO IV',
        title: 'Límites Máximos Permisibles de Parámetros Radiactivos',
        headers: ['Parámetros', 'Unidad de medida', 'LMP'],
        rows: [
          ['1. Dosis de referencia total', 'mSv/año', '0.1'],
          ['2. Actividad global alfa (α)', 'Bq/L', '0.5'],
          ['3. Actividad global beta (β)', 'Bq/L', '1.0'],
        ],
      },
      {
        code: 'ANEXO V',
        title: 'Autorización Sanitaria y Registro de los Sistemas de Abastecimiento',
        headers: ['Componente del Sistema', 'Registro', 'Autorización Sanitaria', 'Aprobaciones'],
        rows: [
          ['Fuente de abastecimiento', 'SI (DIRESA/GRS/DISA)', '—', '—'],
          ['Sistemas de abastecimiento', 'SI (DIRESA/GRS/DISA)', '—', '—'],
          ['Plantas de tratamiento', '—', 'SI (DIGESA / DIRESA / GRS)', '—'],
          ['Plan de Control de Calidad (PCC)', '—', '—', 'SI (DIGESA / DIRESA / GRS)'],
          ['Planes de Adecuación Sanitaria (PAS)', '—', '—', 'SI (DIGESA / DIRESA / GRS)'],
          ['Surtidores de agua', '—', 'SI (DIRESA/GRS/DISA)', '—'],
          ['Camiones cisterna', '—', 'SI (DIRESA/GRS/DISA)', '—'],
          ['Desinfectantes de agua', 'SI (DIGESA / DIRESA / GRS)', '—', '—'],
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. R.D. N° 160-2015/DIGESA/SA — PROTOCOLO DE TOMA DE MUESTRAS
  // ===========================================================================
  {
    id: 'rd-160-2015-digesa',
    code: 'R.D. N° 160-2015/DIGESA/SA',
    shortTitle: 'Protocolo de Toma de Muestras y Cadena de Custodia',
    officialTitle: 'RESOLUCIÓN DIRECTORAL N° 160-2015/DIGESA/SA — PROTOCOLO DE PROCEDIMIENTOS PARA LA TOMA DE MUESTRAS, PRESERVACIÓN, CONSERVACIÓN, TRANSPORTE, ALMACENAMIENTO Y RECEPCIÓN DE AGUA PARA CONSUMO HUMANO',
    authority: 'Dirección General de Salud Ambiental (DIGESA) • Ministerio de Salud',
    promulgationDate: '24 de setiembre de 2015',
    totalPages: 23,
    category: 'RESOLUCIÓN DIRECTORAL • PROTOCOLO OFICIAL',
    summary: 'Documento técnico normativo de obligatorio cumplimiento que estandariza las técnicas de muestreo en campo, cadena de custodia analítica, neutralización con tiosulfato de sodio, acondicionamiento térmico en coolers y formatos oficiales.',
    keyArticles: [
      {
        number: 'Ítem 2 y 3',
        title: 'Finalidad y Objetivo',
        content: 'Garantizar la predictibilidad, idoneidad, representatividad e invariabilidad de las muestras de agua para consumo humano desde su recolección en fuentes, reservorios o grifos hasta su ensayo en laboratorios acreditados.',
      },
      {
        number: 'Ítem 6.2.1',
        title: 'Materiales, Equipos e Insumos Específicos',
        content: 'Exige el uso de frascos de borosilicato estériles de 500 mL autoclavados para microbiología, frascos de vidrio neutro de 1L para fisicoquímica, y recipientes blancos de 4L a 20L para hidrobilogía. Incluye tiosulfato de sodio al 3% (0.1 mL por cada 120 mL de muestra) para neutralizar de inmediato el cloro residual libre.',
      },
      {
        number: 'Ítem 6.2.2.1',
        title: 'Ubicación de Puntos de Muestreo Fijos y de Red',
        content: 'Obliga a tomar muestras en: a) Captación (punto fijo obligatorio por cada fuente), b) Salida del sistema de tratamiento o desinfección, c) Salida del reservorio (grifo de tubería de salida o grifo más cercano), d) Áreas intermedias y puntos extremos más alejados de la red de distribución (mayor tiempo de residencia del agua).',
      },
      {
        number: 'Ítem 6.2.2.2',
        title: 'Procedimiento de Muestreo en Grifos y Reservorios',
        content: 'Selección de grifo conectado directamente a la matriz pública (sin filtros domiciliarios ni ablandadores). Desinfección interna y externa con solución de hipoclorito de sodio a 100 mg/L o alcohol al 70%. Purga continua de 2 a 3 minutos para evacuar agua estancada. En muestreos de pozos o reservorios sin grifo, empleo de cordón de nylon y sujeción estéril sin tocar paredes.',
      },
      {
        number: 'Ítem 6.2.3',
        title: 'Conservación, Rotulado y Cadena de Custodia',
        content: 'Las muestras deben ser embaladas y mantenidas entre 4°C y 10°C en cajas térmicas (coolers) con refrigerantes (ice packs), aisladas de la luz solar. Cada frasco debe portar etiqueta indeleble protegida con cinta adhesiva y remitirse acompañada de su Solicitud de Ensayo y Hoja de Cadena de Custodia.',
      },
    ],
    forms: [
      {
        code: 'ANEXO N° 01',
        title: 'Rótulo de Identificación de Muestra — Laboratorio de Control Ambiental DIGESA',
        fields: [
          'Código de identificación de campo',
          'Coordenadas UTM (Este, Norte, Altura / Zona)',
          'Localidad / Distrito / Provincia / Región',
          'Punto de muestreo (Captación, Reservorio, Red, Grifo)',
          'Matriz de agua (Agua tratada / cruda)',
          'Fecha y Hora exacta de muestreo',
          'Tipo de análisis requerido (Microbiológico, Fisicoquímico, Metales)',
          'Preservada: Si / No (Nombre del preservante)',
          'Nombre del muestreador y Entidad / JASS',
        ],
      },
      {
        code: 'ANEXO N° 02',
        title: 'Ficha de Datos de Campo Oficial',
        fields: [
          'N° Ficha de campo y Nombre de Red de Salud / Micro Red',
          'Nombre del Sistema de Agua Potable y Población servida',
          'Muestreador (Nombres, DNI, Firma)',
          'Lecturas in situ: pH, Temperatura (°C), Conductividad (µS/cm), Turbiedad (UNT), Cloro Residual Libre (mg/L)',
          'Tipo de fuente hídrica aprovechada y Continuidad del servicio (h/día)',
          'Observaciones técnicas sanitarias',
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. GUÍA SENCICO / PNSR (2019) — LIMPIEZA Y DESINFECCIÓN DE SAP
  // ===========================================================================
  {
    id: 'guia-sencico-pnsr-2019',
    code: 'Guía SENCICO / PNSR (2019)',
    shortTitle: 'Guía para Limpieza y Desinfección del Sistema de Agua',
    officialTitle: 'GUÍA PARA LIMPIEZA Y DESINFECCIÓN DEL SISTEMA DE AGUA PARA CONSUMO HUMANO',
    authority: 'Ministerio de Vivienda, Construcción y Saneamiento (PNSR) • SENCICO',
    promulgationDate: 'Edición Oficial 2019',
    totalPages: 24,
    category: 'GUÍA TÉCNICA OPERATIVA DE CAMPO',
    summary: 'Procedimiento operativo ilustrado para fontaneros, técnicos comunales y JASS rurales. Incluye cálculos de dosificación con hipoclorito de calcio al 70%, cubicación volumétrica y protocolo paso a paso en 4 etapas: Captación, Línea de conducción/CRP, Reservorio y Redes.',
    keyArticles: [
      {
        number: 'Módulo 1',
        title: 'Requerimientos, EPP y Herramientas',
        content: 'Exige que el operador cuente con Equipo de Protección Personal completo: casco, lentes de seguridad, guantes de nitrilo/PVC de manga larga, botas de jebe, overol con cintas reflectivas y mascarilla con doble filtro. Herramientas: balde de plástico de 20 litros, escoba, escobilla de cerdas duras, varilla de madera de 40 cm y 1.5 m, balanza gramera y reactivo DPD N° 1.',
      },
      {
        number: 'Módulo 2',
        title: 'Fórmulas de Cubicación y Cálculo de Dosis al 70%',
        content: 'Establece la fórmula general de dosificación: Peso (g) = (C × V) / (% Cloro × 10), donde C es la concentración en ppm (mg/L), V es el volumen en m³, y % Cloro es 70. Concentraciones reglamentarias: Captación y Cámaras Rompe Presión: 150 a 200 ppm (tiempo de contacto 4 h); Reservorio: 50 ppm (tiempo de contacto 4 h).',
      },
      {
        number: 'Módulo 3.2.A',
        title: 'Procedimiento en Captación',
        content: 'Limpieza exterior y desmalezado. Retiro del cono de rebose para vaciar la cámara húmeda. Escobillado riguroso de paredes, piso y accesorios. Enjuague abundante. Frotado de paredes con solución clorada a 150-200 ppm con trapo limpio. Reposo y reposición del rebose.',
      },
      {
        number: 'Módulo 3.2.B y C',
        title: 'Procedimiento en Línea de Conducción, CRP y Reservorio',
        content: 'Para el reservorio: evacuar abriendo válvula de desagüe, cerrar salida a red y abrir by-pass. Escobillar paredes y accesorios internos, retirar sedimentos y enjuagar. Llenar hasta ¾ partes con agua, verter la solución de hipoclorito calculada para 50 ppm, completar el llenado y dejar reposar 4 horas.',
      },
      {
        number: 'Módulo 3.2.D',
        title: 'Desinfección de Línea de Aducción y Redes de Distribución',
        content: 'Asegurarse de que todos los grifos domiciliarios estén cerrados. Abrir la válvula de salida del reservorio dejando ingresar la solución clorada a toda la red. Dejar reposar por 4 horas. Abrir válvulas de purga hasta evacuar totalmente el agua con alta concentración. Llenar nuevamente el reservorio e iniciar cloración por goteo continuo (0.5 a 1.0 mg/L) para restablecer el servicio a la población.',
      },
    ],
  },

  // ===========================================================================
  // 4. R.M. N° 854-2020/MINSA (NTS N° 166-MINSA/2020/DIGESA) — SURTIDORES Y CISTERNAS
  // ===========================================================================
  {
    id: 'rm-854-2020-minsa',
    code: 'R.M. N° 854-2020/MINSA (NTS N° 166)',
    shortTitle: 'Norma Sanitaria de Surtidores y Camiones Cisterna',
    officialTitle: 'RESOLUCIÓN MINISTERIAL N° 854-2020/MINSA — NTS N° 166-MINSA/2020/DIGESA: NORMA SANITARIA PARA EL ABASTECIMIENTO DE AGUA PARA CONSUMO HUMANO MEDIANTE ESTACIONES DE SURTIDORES Y CAMIONES CISTERNA',
    authority: 'Ministerio de Salud (MINSA) • DIGESA',
    promulgationDate: '16 de octubre de 2020',
    totalPages: 19,
    category: 'RESOLUCIÓN MINISTERIAL • NORMA TÉCNICA DE SALUD',
    summary: 'Establece los requisitos sanitarios para estaciones de surtidores públicos y privados, camiones cisterna de reparto, dosificación automática, desinfección obligatoria de tanques cada 6 meses, y valores de cloro residual libre (≥ 1.0 mg/L en surtidor y ≥ 0.8 mg/L al consumidor final).',
    keyArticles: [
      {
        number: 'Numeral 4.4 y 5.1.1',
        title: 'Condiciones Sanitarias de Estaciones de Surtidores',
        content: 'La estación de surtidor debe contar con sistema de desinfección automático o mecánico permanente que garantice un cloro residual libre mínimo de 1.0 mg/L en el agua suministrada al camión cisterna. Pozo con muro de protección de 0.30 m sobre nivel de terreno y forro de 3 m de profundidad. Losa de concreto armado de 2 m con canaletas y drenaje. Muestreo diario obligatorio con comparador DPD-1, pH-metro y turbidímetro.',
      },
      {
        number: 'Numeral 5.1.2',
        title: 'Condiciones Sanitarias del Camión Cisterna',
        content: 'El tanque debe ser de uso exclusivo para agua de consumo humano, con estanqueidad total. Paredes internas lisas recubiertas con pintura epóxica blanca aprobada para contacto con alimentos/agua, rompeolas revestidos, mangueras con protección en sus últimos 50 cm y cierre hermético. Exterior pintado color celeste con letras blancas de 40 × 15 cm que consignen "Agua para Consumo Humano" y N° de autorización sanitaria.',
      },
      {
        number: 'Numeral 5.1.2.iii',
        title: 'Cloro Residual Libre de Entrega al Usuario Final',
        content: 'La concentración de cloro residual libre del agua entregada por el camión cisterna directamente al usuario en su domicilio debe ser como mínimo de 0.8 mg/L (ppm).',
      },
      {
        number: 'Numeral 5.1.3',
        title: 'Limpieza y Desinfección Obligatoria del Tanque Cisterna',
        content: 'El propietario del camión cisterna está obligado a desinfectar el tanque cada seis (6) meses a través de una empresa de saneamiento ambiental registrada ante el MINSA, contando con certificado de desinfección vigente.',
      },
      {
        number: 'Numeral 5.3.4',
        title: 'Libros de Registro Obligatorios',
        content: 'Todo operador de surtidor y cisterna debe mantener tres libros oficiales foliados: a) Libro de Registro de Análisis de Calidad del Agua Suministrada (conservar 5 años), b) Libro de Incidencias en la Fuente, c) Libro de Registro de los Camiones Cisterna (placa, N° autorización, fecha/hora, volumen, zona de reparto y vigencia del certificado de desinfección).',
      },
    ],
  },

  // ===========================================================================
  // 5. DIRECTIVA SANITARIA N° 132-MINSA/2021/DIGESA — CALIDAD DEL AGUA EN IPRESS
  // ===========================================================================
  {
    id: 'directiva-132-minsa-2021',
    code: 'Directiva Sanitaria N° 132-MINSA/2021',
    shortTitle: 'Vigilancia de Calidad del Agua en Establecimientos de Salud (IPRESS)',
    officialTitle: 'DIRECTIVA SANITARIA N° 132-MINSA/2021/DIGESA — DIRECTIVA SANITARIA PARA LA VIGILANCIA DE LA CALIDAD DEL AGUA PARA CONSUMO HUMANO EN INSTITUCIONES PRESTADORAS DE SERVICIOS DE SALUD (IPRESS)',
    authority: 'Ministerio de Salud (MINSA) • DIGESA',
    promulgationDate: '15 de setiembre de 2021',
    totalPages: 18,
    category: 'DIRECTIVA SANITARIA NACIONAL',
    summary: 'Regula las exigencias sanitarias del agua en hospitales, clínicas, centros y puestos de salud. Fija inspección sanitaria semestral, desinfección de cisternas cada 6 meses, y monitoreo diario de cloro residual libre (≥ 0.5 mg/L) en servicios críticos (Cocina, Partos, Quirófanos, Laboratorio y Central de Esterilización).',
    keyArticles: [
      {
        number: 'Numeral 6.1.1',
        title: 'Inspección Sanitaria de Infraestructura de la IPRESS',
        content: 'El responsable de epidemiología o salud ambiental de la IPRESS debe realizar una inspección sanitaria técnica cada seis (6) meses a la fuente de abastecimiento, cisternas de almacenamiento, reservorios elevados y red interna, exigiendo certificado de desinfección con vigencia no mayor a 6 meses.',
      },
      {
        number: 'Numeral 6.1.2.1',
        title: 'Monitoreo Diario en Servicios Críticos de la IPRESS',
        content: 'Es obligatorio medir y registrar diariamente el Cloro Residual Libre (mínimo 0.5 mg/L) y turbiedad (< 5 UNT) en los puntos críticos de atención médica: 1. Cocina y Comedor, 2. Sala de Partos, 3. Sala de Operaciones (Quirófano), 4. Laboratorio Clínico, 5. Centro de Esterilización, y 6. Extremo más alejado de la red interna.',
      },
      {
        number: 'Numeral 6.1.2.1.ii',
        title: 'Abastecimiento mediante Camión Cisterna a la IPRESS',
        content: 'En IPRESS abastecidas por cisterna, se debe medir obligatoriamente el cloro residual libre en el momento mismo de la descarga antes de autorizar el llenado de la cisterna institucional; si es menor a 0.5 mg/L no se autoriza la recepción y se rechaza la carga.',
      },
      {
        number: 'Numeral 6.1.2.2',
        title: 'Libros de Registro y Protocolo de Contingencia',
        content: 'Mantenimiento del Libro de Registro de Calidad del Agua y Libro de Incidencias en la IPRESS por un plazo mínimo de cinco (5) años. Si el cloro es menor a 0.5 mg/L, se tomará de inmediato muestra bacteriológica (coliformes/E. coli) y se dispondrá desinfección correctiva de choque inmediata.',
      },
    ],
  },
];

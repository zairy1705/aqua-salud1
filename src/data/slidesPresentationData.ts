export interface PresentationSlide {
  slideNumber: number;
  tema?: string;
  title: string;
  subtitle?: string;
  category: 'Metales Pesados' | 'Saneamiento Ambiental' | 'Manejo de Residuos' | 'Control de Vectores' | 'Higiene del Entorno' | 'Introducción' | 'Conclusión';
  bullets: string[];
  callout?: string;
  authorInfo?: {
    expositora: string;
    area: string;
  };
  elements?: {
    label: string;
    description: string;
    icon?: string;
    color?: string;
  }[];
}

export const MASTER_SLIDES_PRESENTATION: {
  title: string;
  author: string;
  area: string;
  totalPages: number;
  slides: PresentationSlide[];
} = {
  title: 'METALES PESADOS, SANEAMIENTO AMBIENTAL Y PRÁCTICAS DE HIGIENE',
  author: 'Ing. Quim Salvador Amaya Zaira Ingrid Djanira',
  area: 'Promoción de Gestión Territorial',
  totalPages: 28,
  slides: [
    // -------------------------------------------------------------
    // SLIDE 1: Portada
    // -------------------------------------------------------------
    {
      slideNumber: 1,
      title: 'METALES PESADOS, SANEAMIENTO AMBIENTAL Y PRÁCTICAS DE HIGIENE',
      subtitle: 'Capacitación Integral para la Gestión Territorial del Agua Segura',
      category: 'Introducción',
      authorInfo: {
        expositora: 'Ing. Quim Salvador Amaya Zaira Ingrid Djanira',
        area: 'Promoción de Gestión Territorial',
      },
      bullets: [
        'Agua Segura: Vigilancia fisicoquímica, microbiológica y desinfección continua.',
        'Saneamiento Ambiental: Protección integral de fuentes hídricas y ecosistemas.',
        'Manejo Adecuado de Residuos: Segregación en la fuente y disposición controlada.',
        'Prácticas de Higiene: Hábitos sanitarios intradomiciliarios y comunitarios.',
      ],
      callout: 'Estrategia intersectorial para la protección de la salud pública y el desarrollo comunal.',
    },

    // -------------------------------------------------------------
    // SLIDE 2: Tema 1: Metales Pesados
    // -------------------------------------------------------------
    {
      slideNumber: 2,
      tema: 'TEMA 1',
      title: 'METALES PESADOS EN FUENTES DE AGUA',
      subtitle: 'Identificación, Riesgos y Mecanismos de Control',
      category: 'Metales Pesados',
      bullets: [
        'Fuentes de contaminación: Naturales y antropogénicas.',
        'Agua contaminada: Comportamiento físico y químico en cuerpos de agua.',
        'Riesgos para la salud: Efectos toxicológicos en poblaciones vulnerables.',
        'Prevención y control: Monitoreo analítico y barreras de protección sanitaria.',
      ],
      elements: [
        { label: '33 As', description: 'Arsénico: Metalóide cancerígeno de origen hidrogeológico o minero.', color: '#00b4d8' },
        { label: '82 Pb', description: 'Plomo: Neurotóxico acumulativo que afecta el desarrollo infantil.', color: '#64748b' },
        { label: '24 Cr', description: 'Cromo: Tóxico industrial oxidante y mutagénico.', color: '#8b5cf6' },
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 3: ¿Qué son los metales pesados?
    // -------------------------------------------------------------
    {
      slideNumber: 3,
      title: '¿QUÉ SON LOS METALES PESADOS?',
      subtitle: 'Definición y Elementos de Mayor Riesgo Sanitario',
      category: 'Metales Pesados',
      bullets: [
        'Los metales pesados son elementos químicos de elevada densidad que pueden resultar tóxicos cuando se encuentran en concentraciones superiores a los límites permitidos.',
        'Tóxicos para la salud: No se degradan biológicamente, se acumulan progresivamente en los tejidos humanos.',
        'Afectan el ambiente: Alteran la calidad del agua, degradan suelos agrícolas y dañan ecosistemas acuáticos.',
        'Pueden estar en el agua: Presentes tanto en aguas superficiales (ríos, lagunas) como en subterráneas (pozos, manantiales).',
      ],
      elements: [
        { label: '33 As — Arsénico', description: 'LMP D.S. 031-2010-SA: 0.010 mg/L. Causa arsenicismo crónico y lesiones cutáneas.', icon: 'science' },
        { label: '82 Pb — Plomo', description: 'LMP D.S. 031-2010-SA: 0.010 mg/L. Causa saturnismo y daño neurológico irreversible.', icon: 'science' },
        { label: '80 Hg — Mercurio', description: 'LMP D.S. 031-2010-SA: 0.001 mg/L. Altamente neurotóxico por bioacumulación.', icon: 'science' },
        { label: '48 Cd — Cadmio', description: 'LMP D.S. 031-2010-SA: 0.003 mg/L. Afecta los túbulos renales y la desmineralización ósea.', icon: 'science' },
        { label: '24 Cr — Cromo', description: 'LMP D.S. 031-2010-SA: 0.050 mg/L. Cromo hexavalente es cancerígeno comprobado.', icon: 'science' },
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 4: Fuentes Naturales de Contaminación
    // -------------------------------------------------------------
    {
      slideNumber: 4,
      title: 'FUENTES NATURALES: CONTAMINACIÓN DEL AGUA POR METALES',
      subtitle: 'Procesos Hidrogeológicos de Disolución Natural',
      category: 'Metales Pesados',
      bullets: [
        'Formación geológica: Las rocas y minerales se forman de manera natural a lo largo de millones de años mediante enfriamiento de magma, sedimentación y alta presión.',
        'Minerales presentes en el subsuelo: Yacimientos naturales ricos en arsénico (As), plomo (Pb), cadmio (Cd), mercurio (Hg) y cromo (Cr).',
        'Aguas subterráneas: El agua de lluvia se infiltra en el suelo y, al circular por las capas de rocas y minerales, disuelve los metales de forma natural, transportándolos a acuíferos.',
        'Impacto en captaciones: Los metales disueltos emergen en manantiales, pozos y afloramientos utilizados para consumo humano.',
      ],
      callout: '¡ATENCIÓN! Aunque son procesos geológicos naturales, la presencia de metales en el agua representa un grave riesgo para la salud humana y el ambiente.',
    },

    // -------------------------------------------------------------
    // SLIDE 5: Actividades Humanas que Contaminan
    // -------------------------------------------------------------
    {
      slideNumber: 5,
      title: 'CONTAMINACIÓN DEL AGUA POR ACTIVIDADES HUMANAS',
      subtitle: 'Fuentes Antropogénicas de Vertimiento de Metales',
      category: 'Metales Pesados',
      bullets: [
        '1. Minería: Actividades de extracción y lixiviación que liberan metales en ríos y quebradas.',
        '2. Relaves mineros: Depósitos de desechos con altas concentraciones de metales que pueden filtrarse a la napa freática.',
        '3. Industria: Emisiones, derrames y efluentes sin tratamiento previo.',
        '4. Agricultura: Uso desmedido de fertilizantes químicos, pesticidas y agroquímicos con impurezas metálicas.',
        '5. Botaderos de residuos: Lixiviados tóxicos de pilas, baterías y chatarra electrónica que penetran el subsuelo.',
        '6. Descargas de aguas residuales: Vertimientos domésticos y comerciales con residuos de pinturas, solventes y detergentes.',
        '7. Uso inadecuado de sustancias químicas: Manejo informal que contamina directamente fuentes de agua.',
      ],
      callout: 'CONSECUENCIAS: Los metales pesados no se degradan; se bioacumulan en los organismos vivos y causan daños irreversibles.',
    },

    // -------------------------------------------------------------
    // SLIDE 6: Efectos del Consumo Prolongado en la Salud
    // -------------------------------------------------------------
    {
      slideNumber: 6,
      title: 'CONSUMIR AGUA CONTAMINADA CON METALES PUEDE PRODUCIR:',
      subtitle: 'Efectos Crónicos en Niños, Adultos y Exposición Prolongada',
      category: 'Metales Pesados',
      bullets: [
        'En Niños: Disminución del aprendizaje, problemas de memoria, retraso del crecimiento físico y alteraciones irreversibles del desarrollo cerebral.',
        'En Adultos: Enfermedades renales crónicas, problemas hepáticos (hígado), hipertensión arterial, alteraciones del sistema nervioso central y problemas reproductivos.',
        'Exposición Prolongada: Aumenta exponencialmente el riesgo de diversos tipos de cáncer (pulmón, piel, vejiga y riñón), especialmente por arsénico y cromo hexavalente.',
      ],
      callout: 'El agua limpia es salud. Proteger nuestras fuentes de agua es proteger nuestra propia vida.',
    },

    // -------------------------------------------------------------
    // SLIDE 7: Consecuencias Ecológicas y Ambientales
    // -------------------------------------------------------------
    {
      slideNumber: 7,
      title: 'CONSECUENCIAS AMBIENTALES DE LA CONTAMINACIÓN',
      subtitle: 'Impacto en Ecosistemas Acuáticos y la Cadena Trófica',
      category: 'Metales Pesados',
      bullets: [
        '1. Muerte de peces: Toxicidad aguda y daño branquial que colapsa poblaciones ictiológicas.',
        '2. Disminución de la biodiversidad: Reducción drástica de especies nativas de flora y fauna acuática.',
        '3. Contaminación del suelo: Pérdida de fertilidad y fitotoxicidad en cultivos agrícolas regados con agua contaminada.',
        '4. Bioacumulación en animales: Los metales se concentran en tejidos grasos y órganos de peces y ganado.',
        '5. Alteración de cadenas alimenticias: De algas a zooplancton, peces pequeños, peces mayores y humanos (biomagnificación).',
        'Pérdida de calidad del agua: El recurso queda inhabilitado para consumo, riego, ganadería y recreación.',
      ],
      callout: '¡CUIDEMOS NUESTRA AGUA, CUIDEMOS LA VIDA!',
    },

    // -------------------------------------------------------------
    // SLIDE 8: Señales de Alerta de Contaminación del Agua
    // -------------------------------------------------------------
    {
      slideNumber: 8,
      title: 'SEÑALES QUE PUEDEN INDICAR CONTAMINACIÓN DEL AGUA',
      subtitle: 'Indicadores Visuales, Organolépticos y la Regla de Oro Analítica',
      category: 'Metales Pesados',
      bullets: [
        'Coloración anormal: Tonos amarillentos, verdosos, marrones o turbidez inusual.',
        'Olor desagradable: Olores fétidos, sulfurosos, a hidrocarburo o químicos extraños.',
        'Sabor metálico o astringente en boca.',
        'Presencia de sedimentos oscuros: Partículas de lodo o precipitados en recipientes.',
        'Muerte de peces o fauna acuática en las riberas del río o fuente.',
        'Disminución visible de especies acuáticas en la zona.',
      ],
      callout: '¡ADVERTENCIA CRÍTICA! Los metales pesados como el Arsénico o el Plomo muchas veces NO alteran el olor, color ni sabor del agua. Un agua cristalina PUEDE estar contaminada; por eso el análisis de laboratorio acreditado es INDISPENSABLE.',
    },

    // -------------------------------------------------------------
    // SLIDE 9: Medidas de Prevención y Control
    // -------------------------------------------------------------
    {
      slideNumber: 9,
      title: 'MEDIDAS DE PREVENCIÓN Y CONTROL DE METALES EN AGUA',
      subtitle: 'Acciones Técnicas para Blindar la Calidad Hídrica',
      category: 'Metales Pesados',
      bullets: [
        'Controlar los vertimientos: Fiscalizar efluentes de actividades mineras, industriales y comerciales.',
        'Tratar adecuadamente las aguas residuales antes de su descarga al cuerpo receptor.',
        'Proteger ríos, quebradas y zonas de recarga hídrica de los manantiales.',
        'Monitoreo permanente de calidad del agua: Detección analítica temprana mediante espectrofotometría y fotometría in situ.',
      ],
      callout: 'La mejor manera de proteger la salud de la población es PREVENIR que los metales pesados ingresen a las fuentes de agua.',
    },

    // -------------------------------------------------------------
    // SLIDE 10: Responsabilidad Compartida por el Agua Segura
    // -------------------------------------------------------------
    {
      slideNumber: 10,
      title: 'ACCIONES PARA GARANTIZAR AGUA SEGURA',
      subtitle: 'Un Compromiso Articulado entre Actores Clave',
      category: 'Saneamiento Ambiental',
      bullets: [
        'Autoridades (Gobierno Regional / Nacional): Supervisan y garantizan el cumplimiento de normas ambientales y sanitarias.',
        'JASS y Operadores: Aseguran la correcta operación, desinfección, cloración continua y mantenimiento del sistema.',
        'Establecimientos de Salud (IPRESS): Realizan vigilancia epidemiológica y sanitaria de la calidad del agua.',
        'Comunidad y Familias: Cuidan las fuentes, pagan oportunamente la cuota familiar y no arrojan residuos.',
      ],
      callout: 'TRABAJO CONJUNTO: Agua segura hoy para tener una comunidad saludable y un futuro sostenible.',
    },

    // -------------------------------------------------------------
    // SLIDE 11: Rol de la Municipalidad (ATM)
    // -------------------------------------------------------------
    {
      slideNumber: 11,
      title: 'EL ROL DE LA MUNICIPALIDAD EN EL AGUA SEGURA',
      subtitle: 'Funciones del Área Técnica Municipal (ATM)',
      category: 'Saneamiento Ambiental',
      bullets: [
        '1. Monitorear, supervisar y fiscalizar la calidad del agua para consumo humano en toda la jurisdicción.',
        '2. Asistencia Técnica: Brindar soporte técnico permanente a las JASS para la correcta administración, operación y mantenimiento.',
        '3. Capacitación: Promover la educación sanitaria, cuidado del recurso hídrico y sensibilización ciudadana.',
      ],
      callout: 'AGUA SEGURA, COMUNIDAD SALUDABLE, FUTURO SOSTENIBLE — LEY MARCO DE SANEAMIENTO.',
    },

    // -------------------------------------------------------------
    // SLIDE 12: Tema 2: Saneamiento Ambiental
    // -------------------------------------------------------------
    {
      slideNumber: 12,
      tema: 'TEMA 2',
      title: 'SANEAMIENTO AMBIENTAL COMUNAL',
      subtitle: 'Los 4 Pilares del Entorno Saludable',
      category: 'Saneamiento Ambiental',
      bullets: [
        'Pilar 1: Agua Segura (libre de patógenos y tóxicos).',
        'Pilar 2: Manejo de Residuos (clasificación y disposición adecuada).',
        'Pilar 3: Control de Vectores (prevención de zancudos y roedores).',
        'Pilar 4: Higiene del Entorno (limpieza en hogares y espacios públicos).',
      ],
      callout: 'El saneamiento ambiental es la primera barrera protectora de la salud pública comunitaria.',
    },

    // -------------------------------------------------------------
    // SLIDE 13: ¿Qué es el Saneamiento Ambiental?
    // -------------------------------------------------------------
    {
      slideNumber: 13,
      title: '¿QUÉ ES EL SANEAMIENTO AMBIENTAL?',
      subtitle: 'Definición y Componentes Operativos',
      category: 'Saneamiento Ambiental',
      bullets: [
        'Es el conjunto de acciones técnicas, operativas y educativas que buscan mejorar las condiciones del entorno físico para proteger la salud humana y prevenir enfermedades transmisibles.',
        'Componentes esenciales:',
        '• Acceso universal a agua potable y saneamiento básico.',
        '• Reducir, reutilizar y reciclar residuos para frenar la degradación ambiental.',
        '• Prevención de enfermedades transmitidas por insectos y plagas.',
        '• Limpieza rigurosa de hogares, escuelas, centros de salud y mercados.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 14: Componente 1: Agua Segura
    // -------------------------------------------------------------
    {
      slideNumber: 14,
      title: '1. AGUA SEGURA: CUIDAR EL AGUA ES CUIDAR LA VIDA',
      subtitle: 'Definición Sanitaria y Características Obligatorias',
      category: 'Saneamiento Ambiental',
      bullets: [
        'Es el agua que puede ser consumida sin ningún riesgo para la salud, porque cumple con los estándares sanitarios del D.S. N.° 031-2010-SA.',
        'SEGURA: Libre de bacterias, virus, parásitos y metales pesados.',
        'SALUDABLE: Protege el bienestar familiar y previene enfermedades diarreicas y anemia infantil.',
        'CONFIABLE: Proviene de una fuente captada protegida y con sistema de cloración permanente.',
        'DE CALIDAD: Cumple con los límites de cloro libre residual (0.5 a 1.0 mg/L), pH (6.5 - 8.5) y turbiedad (< 5 UNT).',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 15: Importancia del Consumo de Agua Segura
    // -------------------------------------------------------------
    {
      slideNumber: 15,
      title: 'IMPORTANCIA DEL CONSUMO DE AGUA SEGURA',
      subtitle: 'Salud, Bienestar y Desarrollo Social',
      category: 'Saneamiento Ambiental',
      bullets: [
        'El agua segura es esencial para la vida. Consumirla diariamente protege la salud celular, optimiza la absorción de nutrientes y previene la desnutrición infantil.',
        'Beneficios comprobados:',
        '• Previene enfermedades gastrointestinales agudas y crónicas.',
        '• Fomenta el rendimiento escolar y la asistencia a clases de los niños.',
        '• Reduce el gasto familiar en medicamentos y atención médica.',
        '• Fortalece la productividad laboral de los adultos de la comunidad.',
      ],
      callout: 'TOMAR AGUA SEGURA HOY ES ASEGURAR UN MAÑANA MEJOR PARA TODOS.',
    },

    // -------------------------------------------------------------
    // SLIDE 16: Principales Fuentes de Contaminación del Agua
    // -------------------------------------------------------------
    {
      slideNumber: 16,
      title: 'PRINCIPALES FUENTES DE CONTAMINACIÓN DEL AGUA',
      subtitle: 'Focos de Contaminación que Amenazan las Fuentes Comunales',
      category: 'Saneamiento Ambiental',
      bullets: [
        '01. Excretas humanas por letrinas mal ubicadas cerca a la captación.',
        '02. Basura y botaderos a cielo abierto en laderas o quebradas.',
        '03. Animales sueltos que defecan o pastan cerca a las fuentes de agua.',
        '04. Descarga directa de aguas residuales y desagües sin tratamiento.',
        '05. Residuos de agroquímicos y envases de pesticidas lavados en acequias.',
        '06. Residuos industriales, aceites y grasas automotrices.',
        '07. Manipulación inadecuada en el transporte o almacenamiento domiciliario.',
      ],
      callout: 'CUIDEMOS EL AGUA HOY PARA GARANTIZAR NUESTRO MAÑANA.',
    },

    // -------------------------------------------------------------
    // SLIDE 17: Enfermedades Asociadas al Agua Contaminada
    // -------------------------------------------------------------
    {
      slideNumber: 17,
      title: 'ENFERMEDADES ASOCIADAS AL AGUA CONTAMINADA',
      subtitle: 'Signos y Síntomas de Infecciones de Transmisión Hídrica',
      category: 'Saneamiento Ambiental',
      bullets: [
        'Diarrea Aguda: Dolor cólico abdominal, deposiciones líquidas frecuentes y deshidratación severa.',
        'Cólera (Vibrio cholerae): Diarrea blanquecina profusa en "agua de arroz", vómitos violentos y colapso circulatorio rápido.',
        'Hepatitis A: Fiebre, astenia, coloración amarillenta de piel y ojos (ictericia) y coluria.',
        'Fiebre Tifoidea (Salmonella Typhi): Fiebre alta continua, cefalea intensa, erupciones y dolor abdominal.',
        'Parasitosis Intestinal (Áscaris lumbricoides, Giardia lamblia, Amebas, Trichuris): Dolor estomacal crónico, meteorismo, mala absorción y anemia.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 18: Métodos Domésticos para Obtener Agua Segura
    // -------------------------------------------------------------
    {
      slideNumber: 18,
      title: 'MÉTODOS DOMÉSTICOS PARA OBTENER AGUA SEGURA',
      subtitle: 'Hervido y Desinfección con Cloro Intradomiciliario',
      category: 'Saneamiento Ambiental',
      bullets: [
        '1. HERVIDO: Hervir el agua a borbotones durante 3 a 5 minutos cronometrados. Dejar enfriar tapada y conservar en recipiente desinfectado con caño o tapa hermética.',
        '2. CLORACIÓN DOMÉSTICA (DESINFECCIÓN RÁPIDA): Usar lejía comercial no aromática apta para desinfección de agua. Dosificar exactamente 1 gota de lejía por cada 1 litro de agua (o 2 gotas si está ligeramente turbia). Mezclar bien y esperar obligatoriamente 30 minutos antes de consumir para permitir la acción biocida del cloro.',
      ],
      callout: '30 MINUTOS DE ESPERA ES EL TIEMPO NECESARIO PARA QUE EL CLORO ELIMINE BACTERIAS Y VIRUS.',
    },

    // -------------------------------------------------------------
    // SLIDE 19: Almacenamiento Correcto del Agua en el Hogar
    // -------------------------------------------------------------
    {
      slideNumber: 19,
      title: '¿CÓMO ALMACENAR CORRECTAMENTE EL AGUA?',
      subtitle: 'Reglas de Oro de Higiene Intradomiciliaria',
      category: 'Saneamiento Ambiental',
      bullets: [
        '✔ Recipientes limpios: Lavar y desinfectar periódicamente el balde o bidón.',
        '✔ Con tapa segura: Mantener permanentemente cerrado el recipiente para evitar polvo e insectos.',
        '✔ Superficie elevada: Colocar sobre una tarima o mesa, evitando el contacto directo con el suelo.',
        '✔ No introducir vasos ni manos: Evitar contaminar el agua con bacterias de la piel.',
        '✔ Extraer con cucharón limpio de mango largo o preferir recipientes con grifo dispensador inferior.',
      ],
      callout: 'AGUA SEGURA, SALUD SEGURA PARA TI Y TU FAMILIA.',
    },

    // -------------------------------------------------------------
    // SLIDE 20: Tema 3: Manejo de Residuos Sólidos
    // -------------------------------------------------------------
    {
      slideNumber: 20,
      tema: 'TEMA 3',
      title: 'MANEJO DE RESIDUOS SÓLIDOS',
      subtitle: 'Definición, Tipos y Fuentes de Generación',
      category: 'Manejo de Residuos',
      bullets: [
        '¿Qué son? Todos aquellos materiales y objetos que desechamos tras utilizarlos en nuestras actividades cotidianas.',
        'Ejemplos: Restos de alimentos, papeles, botellas de plástico, cartón, latas de conserva, envases de vidrio.',
        '¿Dónde se generan? En viviendas familiares, instituciones educativas, mercados de abastos, centros de salud y vías públicas.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 21: Importancia del Manejo Adecuado de Residuos
    // -------------------------------------------------------------
    {
      slideNumber: 21,
      title: 'IMPORTANCIA DEL MANEJO ADECUADO DE RESIDUOS SÓLIDOS',
      subtitle: 'Salud Ambiental, Reciclaje y Mitigación del Cambio Climático',
      category: 'Manejo de Residuos',
      bullets: [
        '1. Previene enfermedades: Evita la proliferación de moscas, mosquitos, cucarachas y roedores que transmiten dengue, diarreas y leptospirosis.',
        '2. Protege el medio ambiente: Reduce la contaminación de suelo y fuentes de agua provocada por lixiviados y quema indiscriminada.',
        '3. Disminuye la contaminación: Facilita el reciclaje y disminuye el volumen de basura que llega a botaderos.',
        '4. Conserva recursos naturales: Permite reutilizar plástico, papel, vidrio y metales, evitando la extracción de materias primas vírgenes.',
        '5. Reduce emisiones de gases de efecto invernadero (metano y CO₂).',
      ],
      elements: [
        { label: 'Tacho Verde', description: 'Residuos Orgánicos (restos de comida, cáscaras, podas)', color: '#16a34a' },
        { label: 'Tacho Azul', description: 'Residuos Reciclables Aprovechables (plástico, papel, cartón, latas)', color: '#2563eb' },
        { label: 'Tacho Negro', description: 'No Aprovechables (papel higiénico, pañales, envolturas sucias)', color: '#334155' },
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 22: ¿Cómo Almacenar Correctamente la Basura?
    // -------------------------------------------------------------
    {
      slideNumber: 22,
      title: '¿CÓMO ALMACENAR CORRECTAMENTE LA BASURA EN CASA?',
      subtitle: '5 Pasos Obligatorios para Evitar Plagas',
      category: 'Manejo de Residuos',
      bullets: [
        '1. Utilizar recipientes con tapa hermética que impidan el escape de olores y el ingreso de vectores.',
        '2. Colocar bolsas resistentes en el interior para evitar roturas y filtración de líquidos.',
        '3. Mantener los recipientes limpios, lavándolos y desinfectándolos periódicamente.',
        '4. Sacar la basura únicamente en el horario y días establecidos por el camión recolector municipal.',
        '5. No dejar bolsas en la vía pública fuera de horario para evitar que animales las rompan.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 23: Tema 4: Control de Vectores
    // -------------------------------------------------------------
    {
      slideNumber: 23,
      tema: 'TEMA 4',
      title: 'CONTROL DE VECTORES EN LA COMUNIDAD',
      subtitle: '¿Qué son y cuáles son los principales vectores de riesgo?',
      category: 'Control de Vectores',
      bullets: [
        'Los vectores son animales o insectos que transmiten agentes infecciosos (virus, bacterias, parásitos) de una persona o animal infectado a otra persona sana.',
        'Principales vectores sanitarios:',
        '• Mosquitos (zancudos): Aedes aegypti, Anopheles.',
        '• Moscas domésticas: Transportan gérmenes en sus patas.',
        '• Pulgas y Garrapatas: Parásitos hematófagos.',
        '• Chinches (Triatominos / chirimachas).',
        '• Roedores (Ratas y ratones): Portadores de leptospiras y pulgas.',
      ],
      callout: '¡Prevengamos las enfermedades eliminando criaderos y manteniendo limpios nuestros espacios!',
    },

    // -------------------------------------------------------------
    // SLIDE 24: Enfermedades Transmitidas por Vectores
    // -------------------------------------------------------------
    {
      slideNumber: 24,
      title: 'ENFERMEDADES TRANSMITIDAS POR VECTORES',
      subtitle: 'Identificación Rápida de Cuadros Clínicos',
      category: 'Control de Vectores',
      bullets: [
        'DENGUE (Aedes aegypti): Fiebre alta repentina, cefalea retroocular intensa, mialgias, erupción y náuseas.',
        'MALARIA (Anopheles): Fiebre cíclica con escalofríos intensos, sudoración profusa y anemia severa.',
        'LEPTOSPIROSIS (Orina de ratas en charcos): Fiebre, dolor en pantorrillas, ictericia y daño renal agudo.',
        'ENFERMEDAD DE CHAGAS (Chinches triatominos): Fiebre, edema bipalpebral (signo de Romaña), daño cardíaco crónico.',
        'ZIKA Y CHIKUNGUNYA: Artralgias severas incapacitantes, fiebre leve, conjuntivitis no purulenta y eritema.',
      ],
      callout: 'La prevención está en tus manos: infórmate, actúa y protege la salud de tu comunidad.',
    },

    // -------------------------------------------------------------
    // SLIDE 25: ¿Cómo Prevenir Enfermedades por Vectores?
    // -------------------------------------------------------------
    {
      slideNumber: 25,
      title: '¿CÓMO PREVENIR ENFERMEDADES TRANSMITIDAS POR VECTORES?',
      subtitle: 'Medidas Prácticas de Control Vectorial',
      category: 'Control de Vectores',
      bullets: [
        '• Elimina criaderos: Vacía, cepilla, tapa o voltea recipientes que acumulen agua en patios y techos.',
        '• Tapa y almacena el agua en depósitos herméticos bien cerrados.',
        '• Usa protección personal: Ropa de manga larga clara y repelente.',
        '• Mantén limpio el entorno: Desmalezar jardines y eliminar chatarra en desuso.',
        '• Coloca mallas mosquiteras en puertas y ventanas de las viviendas.',
        '• Lava con escobilla y cambia el agua de bebederos y floreros cada 2 a 3 días.',
        '• Desparasita y revisa periódicamente a tus mascotas.',
        '• Acude de inmediato al Centro de Salud ante fiebre, malestar o erupción (no automedicarse).',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 26: Tema 5: Higiene del Entorno
    // -------------------------------------------------------------
    {
      slideNumber: 26,
      tema: 'TEMA 5',
      title: 'HIGIENE DEL ENTORNO COMUNITARIO',
      subtitle: 'Espacios Limpios para una Población Sana',
      category: 'Higiene del Entorno',
      bullets: [
        'Es el conjunto de acciones destinadas a mantener limpios, ordenados y ventilados los espacios donde vivimos, trabajamos y estudiamos.',
        'Ámbitos indispensables:',
        '• Viviendas familiares y dormitorios.',
        '• Escuelas y colegios (aulas, servicios higiénicos y quioscos).',
        '• Centros de Salud (IPRESS) y salas de espera.',
        '• Mercados de abastos y ferias agropecuarias.',
        '• Calles, veredas, parques y plazas comunales.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 27: Principales Prácticas de Higiene del Entorno
    // -------------------------------------------------------------
    {
      slideNumber: 27,
      title: 'PRINCIPALES PRÁCTICAS DE HIGIENE DEL ENTORNO',
      subtitle: '4 Pilares Comunitarios Cotidianos',
      category: 'Higiene del Entorno',
      bullets: [
        '1. Manejo adecuado de residuos sólidos: Separar orgánicos e inorgánicos, usar tachos con tapa y respetar horarios de recojo.',
        '2. Limpieza de la vivienda: Barrer y trapear diariamente, desinfectar baños y cocinas, y ventilar todos los ambientes abriendo ventanas.',
        '3. Eliminación de criaderos de vectores: Tapar reservorios, cambiar agua de floreros y bebederos, y mantener patios libres de maleza.',
        '4. Cuidado de áreas comunes: Mantener limpias calles y parques, no arrojar desperdicios y participar activamente en faenas comunales de limpieza.',
      ],
    },

    // -------------------------------------------------------------
    // SLIDE 28: Conclusión y Cierre
    // -------------------------------------------------------------
    {
      slideNumber: 28,
      title: 'COMPROMISO POR LA SALUD Y EL AGUA SEGURA',
      subtitle: 'Mensaje de Cierre',
      category: 'Conclusión',
      bullets: [
        '“Pequeñas acciones generan grandes cambios. Juntos podemos proteger el agua, el ambiente y la salud de todos.”',
        'La salud comunal depende de la suma de nuestros hábitos diarios: consumir agua clorada, segregar los residuos, erradicar criaderos de zancudos y mantener limpias nuestras comunidades.',
      ],
      callout: '¡¡MUCHAS GRACIAS POR SU COMPROMISO CON EL AGUA SEGURA Y LA SALUD DE NUESTRO PERÚ!!',
      authorInfo: {
        expositora: 'Ing. Quim Salvador Amaya Zaira Ingrid Djanira',
        area: 'Promoción de Gestión Territorial',
      },
    },
  ],
};

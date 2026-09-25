export interface InstructivoPdfDocument {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  totalPages: number;
  normatives: string[];
  description: string;
  pages: InstructivoPage[];
}

export interface InstructivoPage {
  pageNumber: number;
  sections: InstructivoSection[];
}

export interface InstructivoSection {
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  bullets?: string[];
  numberedSteps?: string[];
  alert?: string;
  note?: string;
  formula?: {
    expression: string;
    description?: string[];
  };
  table?: {
    headers: string[];
    rows: string[][];
    caption?: string;
  };
  nfpa?: {
    chemical: string;
    formula: string;
    health: number;
    flammability: number;
    reactivity: number;
    special: string;
  };
  diagram?: {
    type: 'flow' | 'boxes';
    items: string[];
  };
}

export const OFFICIAL_INSTRUCTIVOS_PDFS: InstructivoPdfDocument[] = [
  // ===========================================================================
  // DOCUMENTO 1
  // ===========================================================================
  {
    id: 'cloracion-consumo-humano',
    code: 'IT-CLOR-01',
    title: 'INSTRUCTIVO TÉCNICO: CLORACIÓN DEL AGUA PARA CONSUMO HUMANO',
    subtitle: 'Limpieza, desinfección, dosificación, monitoreo y registro en sistemas de abastecimiento de agua (SAP), estaciones de surtidores, camiones cisterna e IPRESS',
    category: 'INSTRUCTIVO TÉCNICO OPERATIVO',
    totalPages: 8,
    normatives: [
      'D.S. N° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
      'R.M. N° 854-2020/MINSA — NTS N° 166-MINSA/2020/DIGESA (surtidores y camiones cisterna)',
      'R.D. N° 160-2015/DIGESA/SA — Protocolo de toma de muestras de agua',
      'Directiva Sanitaria N° 132-MINSA/2021/DIGESA — Vigilancia de calidad del agua en IPRESS',
      'Directiva Sanitaria N° 161-MINSA/DIGESA-2025 — Vigilancia sanitaria por DIRESA/GERESA/DIRIS',
      'Guía SENCICO/PNSR — Limpieza y desinfección del sistema de agua (2019)',
      'Capacitación técnica GERESA La Libertad — Limpieza, Desinfección y Cloración de SAP',
    ],
    description: 'Manual técnico integral con tablas de dosificación, cubicación de captaciones y reservorios, flujos de limpieza en 5 fases, requisitos de EPP y rangos normados de cloro residual libre.',
    pages: [
      // Página 1 (Portada)
      {
        pageNumber: 1,
        sections: [
          {
            title: 'INSTRUCTIVO TÉCNICO',
            subtitle: 'CLORACIÓN DEL AGUA PARA CONSUMO HUMANO',
            paragraphs: [
              'Limpieza, desinfección, dosificación, monitoreo y registro en sistemas de abastecimiento de agua (SAP), estaciones de surtidores, camiones cisterna e IPRESS',
              'Elaborado con base en la normativa sanitaria vigente del Ministerio de Salud del Perú (DIGESA):',
            ],
            bullets: [
              'D.S. N° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
              'R.M. N° 854-2020/MINSA — NTS N° 166-MINSA/2020/DIGESA (surtidores y camiones cisterna)',
              'R.D. N° 160-2015/DIGESA/SA — Protocolo de toma de muestras de agua',
              'Directiva Sanitaria N° 132-MINSA/2021/DIGESA — Vigilancia de calidad del agua en IPRESS',
              'Directiva Sanitaria N° 161-MINSA/DIGESA-2025 — Vigilancia sanitaria por DIRESA/GERESA/DIRIS',
              'Guía SENCICO/PNSR — Limpieza y desinfección del sistema de agua (2019)',
              'Capacitación técnica GERESA La Libertad — Limpieza, Desinfección y Cloración de SAP',
            ],
          },
        ],
      },
      // Página 2
      {
        pageNumber: 2,
        sections: [
          {
            title: '1. Introducción y objetivo',
            paragraphs: [
              'La cloración es el método de desinfección más utilizado en el Perú para garantizar que el agua destinada al consumo humano esté libre de microorganismos patógenos. Este instructivo reúne, en un solo documento operativo, los criterios técnicos y normativos vigentes para limpiar, desinfectar y clorar los componentes de un sistema de abastecimiento de agua (SAP) —captación, línea de conducción, cámaras rompe presión, reservorio y red de distribución—, así como para dosificar, monitorear y registrar la calidad del agua clorada.',
              'Está dirigido a operadores de Organizaciones Comunales (JASS/OC), personal de establecimientos de salud (IPRESS) responsables de la vigilancia del agua, operadores de estaciones de surtidores y camiones cisterna, y personal de salud ambiental de DIRESA/GERESA/DIRIS.',
            ],
            subtitle: 'Objetivo específico',
            bullets: [
              'Estandarizar el procedimiento de limpieza, desinfección y cloración de los componentes del SAP.',
              'Establecer las dosis, concentraciones y tiempos de contacto normados para cada componente.',
              'Fijar los valores de cloro residual libre que deben verificarse en cada punto del sistema.',
              'Precisar la frecuencia de monitoreo, los registros obligatorios y las responsabilidades.',
            ],
          },
          {
            title: '2. Marco legal y normativo',
            table: {
              headers: ['Norma', 'Contenido relevante para la cloración'],
              rows: [
                ['Ley N° 26842, Ley General de Salud', 'Sujeta el abastecimiento de agua a las disposiciones de la Autoridad de Salud.'],
                ['D.S. N° 031-2010-SA', 'Reglamento de la Calidad del Agua para Consumo Humano: LMP, cloro residual libre ≥ 0,5 mg/L en red, turbiedad < 5 UNT, parámetros de control obligatorio (PCO).'],
                ['D.S. N° 022-2001-SA', 'Reglamento Sanitario para actividades de Saneamiento Ambiental (desinfección de reservorios y tanques sépticos).'],
                ['R.M. N° 449-2001-SA/DM', 'Norma Sanitaria para Desinsectación, Desratización, Desinfección y Limpieza y Desinfección de Reservorios de Agua.'],
                ['R.M. N° 854-2020/MINSA (NTS N° 166-MINSA/2020/DIGESA)', 'Abastecimiento mediante estaciones de surtidores y camiones cisterna: cloro residual ≥ 1,0 mg/L en la estación y ≥ 0,8 mg/L al usuario.'],
                ['R.D. N° 160-2015/DIGESA/SA', 'Protocolo de toma de muestras, preservación, conservación, transporte y recepción de agua para consumo humano.'],
                ['Directiva Sanitaria N° 132-MINSA/2021/DIGESA', 'Vigilancia de la calidad del agua en Instituciones Prestadoras de Servicios de Salud (IPRESS).'],
                ['Directiva Sanitaria N° 161-MINSA/DIGESA-2025 (R.M. N° 193-2025/MINSA)', 'Vigilancia sanitaria de la calidad del agua por DIRESA/GERESA/DIRIS: inspecciones, muestreo y frecuencia.'],
                ['Guía SENCICO/PNSR (2019)', 'Procedimiento operativo de limpieza y desinfección de captación, línea de conducción, CRP y reservorio con hipoclorito de calcio al 70%.'],
              ],
            },
          },
          {
            title: '3. Definiciones clave',
            bullets: [
              'Limpieza: conjunto de acciones para remover la suciedad y los materiales sedimentados en los componentes del SAP, en forma interna y externa. Debe realizarse antes de cualquier desinfección.',
              'Desinfección: conjunto de acciones para eliminar los microorganismos patógenos de los componentes del SAP, utilizando hipoclorito de calcio o de sodio en altas concentraciones. Se realiza con una frecuencia mínima de dos veces al año.',
            ],
          },
        ],
      },
      // Página 3
      {
        pageNumber: 3,
        sections: [
          {
            bullets: [
              'Cloración: proceso de desinfección continua del agua mediante compuestos clorados (hipoclorito de calcio, hipoclorito de sodio o cloro gas), con el fin de asegurar y mantener su inocuidad hasta el consumidor.',
              'Cloro residual libre: concentración de cloro (ácido hipocloroso e hipoclorito) que permanece en el agua después de la cloración, protegiéndola de una posible recontaminación microbiológica en la red.',
              'Límite Máximo Permisible (LMP): valor máximo admisible de un parámetro de calidad del agua; superarlo puede causar daño a la salud.',
              'Punto crítico de control: lugar del sistema (captación, salida de tratamiento, reservorio, red) donde se debe medir y controlar el cloro residual.',
            ],
          },
          {
            title: '4. Desinfectantes clorados disponibles',
            paragraphs: [
              'El cloro es el desinfectante más utilizado en el país por su bajo costo, eficacia y disponibilidad. Se presenta en tres formas:',
            ],
            table: {
              headers: ['Compuesto', 'Presentación', 'Aplicación', '% Cloro activo'],
              rows: [
                ['Cloro gas', 'Gas', 'Gas – líquido', '100'],
                ['Hipoclorito de sodio (comercial/lejía)', 'Líquido', 'Solución', '5 – 15'],
                ['Hipoclorito de sodio (por electrólisis in situ)', 'Líquido', 'Solución', '0,5 – 1,0'],
                ['Hipoclorito de calcio (HTH)', 'Sólido (polvo/granulado o briquetas)', 'Solución', '65 – 70'],
              ],
            },
            note: 'Nota: El hipoclorito de calcio y el hipoclorito de sodio deben almacenarse en envases cerrados, protegidos de la luz y el calor, fuera del alcance de menores, y contar con Registro Sanitario vigente otorgado por la Autoridad Sanitaria.',
          },
          {
            title: '5. Requisitos previos a la cloración',
            bullets: [
              'Contar con el análisis microbiológico, físico y químico previo del agua (caracterización de la fuente).',
              'Medir parámetros de campo: pH, turbiedad, conductividad y demanda de cloro.',
              'Conocer el caudal de ingreso de agua al reservorio o el volumen de cada componente a desinfectar.',
              'Verificar que el sistema de abastecimiento se encuentre en buenas condiciones sanitarias (sin fugas, tapas herméticas, cerco perimétrico, etc.).',
              'Contar con un operador capacitado, responsable de la dosificación y el registro.',
            ],
            subtitle: '5.1 Equipos de protección personal (EPP)',
          },
          {
            bullets: [
              'Casco, lentes de protección, mascarilla con doble filtro.',
              'Guantes y botas de seguridad, overol y cintas reflectivas.',
            ],
            subtitle: '5.2 Herramientas, equipos e insumos',
          },
          {
            bullets: [
              'Balde de plástico de 20 litros, escoba, escobilla, trapo industrial, varillas de madera (0,40 m y 1,5 m).',
              'Balanza gramera, comparador de cloro (colorimétrico) con reactivo DPD N° 1, medidor de pH y turbidímetro.',
              'Hipoclorito de calcio al 70% (polvo, granulado o briquetas) o hipoclorito de sodio.',
            ],
          },
          {
            title: '6. Valores de cloro residual libre según el punto del sistema',
            paragraphs: [
              'El cloro residual libre es el indicador de campo más importante para verificar que la desinfección se mantiene hasta el punto de consumo. Los valores mínimos y objetivos según la normativa vigente son:',
            ],
          },
        ],
      },
      // Página 4
      {
        pageNumber: 4,
        sections: [
          {
            table: {
              headers: ['Punto de control', 'Cloro residual libre objetivo', 'Norma'],
              rows: [
                ['Salida del reservorio (después de la cloración)', '1,0 – 1,2 mg/L', 'Guía técnica de cloración / buenas prácticas'],
                ['Redes de distribución (cualquier punto)', '0,5 – 0,8 mg/L (mínimo 0,5 mg/L; excepcionalmente no menor de 0,3 mg/L en el 10% de muestras)', 'D.S. N° 031-2010-SA, art. 66°'],
                ['Estación de surtidor (salida hacia el camión cisterna)', '≥ 1,0 mg/L', 'NTS N° 166-MINSA/2020/DIGESA'],
                ['Camión cisterna (agua entregada al usuario)', '≥ 0,8 mg/L', 'NTS N° 166-MINSA/2020/DIGESA'],
                ['Fuente de camión cisterna que abastece a una IPRESS', '≥ 0,5 mg/L', 'Directiva Sanitaria N° 132-MINSA/2021/DIGESA'],
                ['Cisternas, reservorios y red interna de una IPRESS', '≥ 0,5 mg/L (turbiedad < 5 UNT)', 'Directiva Sanitaria N° 132-MINSA/2021/DIGESA'],
              ],
            },
            note: 'Nota: Si el cloro residual libre resulta menor al valor mínimo indicado, se debe tomar una muestra para análisis microbiológico y solicitar al responsable de la operación que incremente la dosificación del desinfectante de inmediato.',
          },
          {
            title: '7. Cálculo de la dosis de hipoclorito de calcio al 70%',
            subtitle: '7.1 Fórmula general',
            paragraphs: ['Para calcular el peso (gramos) de hipoclorito de calcio necesario para desinfectar un volumen de agua, se utiliza:'],
            formula: {
              expression: 'Peso (g) = (C × V) / (% Cloro × 10)',
              description: [
                'C = concentración deseada de cloro, en mg/L o ppm.',
                'V = volumen del componente a desinfectar, en m³.',
                '% Cloro = concentración del producto comercial (por ejemplo, 70 para hipoclorito de calcio al 70%).',
              ],
            },
          },
          {
            subtitle: '7.2 Volumen de los componentes (según su geometría)',
            table: {
              headers: ['Componente', 'Geometría', 'Fórmula'],
              rows: [
                ['Captación, cámara de reunión, CRP (cúbicos)', 'Cubo/prisma: ancho = largo = alto = a', 'V = a³'],
                ['Línea de conducción / redes (tubería)', 'Cilindro: r = radio, L = longitud', 'V = π × r² × L'],
                ['Reservorio cúbico', 'Ancho = largo = alto = a', 'V = a³'],
                ['Reservorio circular', 'r = radio, h = altura', 'V = π × r² × h'],
              ],
            },
          },
          {
            subtitle: '7.3 Dosificación normada para desinfección de componentes (Guía SENCICO)',
            table: {
              headers: ['Componente', 'Concentración (mg/L o ppm)', 'Tiempo de contacto', 'Agua para diluir la solución'],
              rows: [
                ['Captación', '150 – 200', '4 horas', '20 litros'],
                ['Cámara de reunión / Cámaras rompe presión', '150 – 200', '4 horas', '20 litros'],
                ['Reservorio', '50', '4 horas', '20 litros'],
              ],
            },
          },
        ],
      },
      // Página 5
      {
        pageNumber: 5,
        sections: [
          {
            subtitle: '7.4 Ejemplo de cálculo (centro poblado de referencia, 300 habitantes)',
            paragraphs: [
              'Sistema por gravedad: captación de manantial 0,6×0,6×0,6 m; línea de conducción de 1000 m con tubería de 2 pulgadas; 2 cámaras rompe presión tipo 6 (0,6×0,6×0,6 m); reservorio de 14,40 m³ (3×3×1,6 m).',
            ],
            table: {
              headers: ['Componente', 'Volumen (m³)', 'Concentración (mg/L)', 'Peso de hipoclorito de calcio al 70% (g)'],
              rows: [
                ['Captación', '0,22', '200', '0,06'],
                ['Línea de conducción', '2,03', '200', '0,58'],
                ['Cámaras rompe presión (x2)', '0,43', '200', '0,12'],
                ['Reservorio', '14,40', '50', '1,03'],
                ['TOTAL', '—', '—', '1,79 g'],
              ],
            },
          },
          {
            title: '8. Procedimiento paso a paso de limpieza, desinfección y cloración',
            subtitle: '8.1 Coordinación previa',
            numberedSteps: [
              'El operador coordina con el presidente de la Organización Comunal (OC) la fecha de limpieza y desinfección.',
              'La OC convoca a asamblea, fija la fecha, designa dos ayudantes del operador y compromete a los usuarios a almacenar agua un día antes.',
              'Se comunica con anticipación a los usuarios sobre la actividad y el corte temporal del servicio.',
            ],
          },
          {
            subtitle: '8.2 Captación',
            numberedSteps: [
              'Limpiar la estructura externa de la captación y el área circundante (retirar maleza y residuos).',
              'Retirar la tubería de rebose para desaguar la cámara húmeda.',
              'Escobillar las paredes internas de la cámara húmeda y sus accesorios.',
              'Retirar o limpiar los sedimentos acumulados.',
              'Enjuagar con abundante agua la estructura interna.',
              'Calcular la cantidad de hipoclorito de calcio (150–200 ppm) y preparar la solución en un balde de 20 litros.',
              'Frotar las paredes internas con la solución desinfectante usando un trapo.',
              'Enjuagar nuevamente con abundante agua.',
              'Colocar la tubería de rebose en su posición inicial.',
              'Llenar la cámara, verter la solución restante y dejarla correr por la línea de conducción.',
            ],
          },
          {
            subtitle: '8.3 Línea de conducción y cámaras rompe presión (CRP)',
            numberedSteps: [
              'Calcular la cantidad de hipoclorito de calcio (150–200 ppm) según el volumen de la tubería.',
              'Preparar la solución desinfectante en un balde de 20 litros.',
              'Cerrar la válvula de la estructura siguiente en la ruta del agua.',
              'Verter la solución en la cámara húmeda de la captación hasta que suba el nivel; cerrar la válvula de la cámara seca.',
              'Dejar reposar 4 horas y luego evacuar la línea abriendo la válvula de la estructura siguiente.',
            ],
            note: 'Nota: Las actividades de limpieza y desinfección de las cámaras rompe presión son similares a las de la captación.',
          },
          {
            subtitle: '8.4 Reservorio',
            numberedSteps: [
              'Limpiar la estructura externa del reservorio y el área circundante.',
              'Evacuar el reservorio abriendo la válvula de limpieza de la caja de válvulas; cerrar la válvula de salida a la red y abrir el by pass.',
              'Cerrar la válvula de ingreso al reservorio.',
            ],
          },
        ],
      },
      // Página 6
      {
        pageNumber: 6,
        sections: [
          {
            numberedSteps: [
              'Escobillar paredes, piso y accesorios internos; limpiar sedimentos.',
              'Enjuagar con abundante agua toda la estructura interna.',
              'Calcular la dosis de hipoclorito de calcio (50 ppm) y preparar la solución en un balde de 20 litros.',
              'Llenar el reservorio hasta las ¾ partes cerrando la válvula de limpieza; abrir la válvula de salida a la red y cerrar el by pass; abrir la válvula de ingreso.',
              'Verter la solución clorada y dejar llenar el reservorio por completo.',
              'Dejar reposar la solución clorada aproximadamente 4 horas.',
            ],
          },
          {
            subtitle: '8.5 Línea de aducción y redes de distribución',
            numberedSteps: [
              'Verificar que todos los caños de las viviendas estén cerrados.',
              'Abrir la válvula de salida del reservorio hacia la red de aducción y distribución (usa la misma solución clorada del reservorio).',
              'Dejar reposar la solución clorada en la red aproximadamente 4 horas.',
              'Abrir las válvulas de purga hasta evacuar toda el agua contenida en las redes.',
              'Llenar nuevamente el reservorio, cerrar la válvula de salida y realizar la cloración de mantenimiento para restablecer el servicio a la población.',
            ],
          },
          {
            title: '9. Sistema de cloración continua por goteo',
            paragraphs: [
              'Es el conjunto de componentes que permite desinfectar de forma continua el agua en el reservorio, mediante un tanque de solución madre y accesorios de regulación que entregan, por descarga libre en forma de goteo, la cantidad de solución clorada necesaria para mantener el cloro residual dentro del rango objetivo.',
              'El sistema comprende tres procesos:',
            ],
            bullets: [
              'Preparación de la solución madre (dilución del hipoclorito de calcio o de sodio en agua limpia).',
              'Dosificación (entrega controlada de la solución al agua que ingresa al reservorio).',
              'Regulación (ajuste del goteo según el caudal de ingreso, para mantener la concentración objetivo).',
            ],
            note: 'Nota: El operador debe verificar y registrar diariamente el cloro residual libre a la salida del reservorio y en al menos un punto de la red, ajustando el goteo cuando el valor se aleje del rango 1,0–1,2 mg/L en la salida o 0,5–0,8 mg/L en la red.',
          },
          {
            title: '10. Monitoreo y control de la calidad del agua clorada',
            subtitle: '10.1 Parámetros de control obligatorio (PCO)',
            bullets: [
              'Coliformes totales y coliformes termotolerantes.',
              'Color y turbiedad (LMP: turbiedad < 5 UNT).',
              'Residual de desinfectante (cloro residual libre, mínimo 0,5 mg/L en red).',
              'pH.',
            ],
            paragraphs: [
              'Si el cloro residual es menor a 0,5 mg/L, se debe tomar una muestra para el análisis de coliformes totales y termotolerantes. Si estos resultan positivos, se realiza la prueba confirmatoria de Escherichia coli.',
            ],
          },
          {
            subtitle: '10.2 Puntos de muestreo',
            bullets: [
              'En la captación (obligatorio; por cada fuente si existe más de una).',
              'A la salida del sistema de tratamiento o desinfección.',
              'En cisternas y a la salida de reservorios.',
              'En áreas intermedias y en el punto más alejado de la red de distribución (mayor recorrido de agua).',
              'En servicios críticos de IPRESS: cocina, comedor, sala de partos, sala de operaciones, laboratorio y centro de esterilización (parámetro: cloro residual libre).',
            ],
          },
          {
            subtitle: '10.3 Frecuencia mínima de muestreo',
          },
        ],
      },
      // Página 7
      {
        pageNumber: 7,
        sections: [
          {
            table: {
              headers: ['Parámetro', 'Ámbito urbano', 'Ámbito rural'],
              rows: [
                ['Parámetros de campo (cloro residual, turbiedad, pH, conductividad, temperatura)', '1 vez al mes', '1 vez al mes'],
                ['Parámetros bacteriológicos', '8 muestras al mes / sistema', '3 muestras al mes / sistema'],
                ['Parámetros parasitológicos', '3 muestras al año', '3 muestras al año'],
                ['Parámetros físico-químicos', '4 muestras al año', '2 muestras al año'],
                ['Metales pesados', '3 muestras al año', '2 muestras al año'],
              ],
            },
            note: 'Nota: En IPRESS, la inspección sanitaria al sistema de agua se realiza cada 6 meses y la desinfección de cisternas/reservorios debe certificarse con una vigencia no mayor a 6 meses.',
          },
          {
            title: '11. Cloración en estaciones de surtidores y camiones cisterna',
            bullets: [
              'La estación de surtidor debe contar con sistema de desinfección (automático, mecánico o similar) que asegure un cloro residual libre en el agua entregada al camión cisterna ≥ 1,0 mg/L.',
              'Debe contar con comparador de cloro residual y reactivo DPD N° 1, además de equipos para medir pH y turbiedad, verificando diariamente la dosificación.',
              'El tanque del camión cisterna debe ser de uso exclusivo para agua de consumo humano, sin fugas, con superficie interna lisa (pintura epóxica blanca) y rompeolas revestidos.',
              'El cloro residual libre del agua entregada al usuario final por el camión cisterna debe ser ≥ 0,8 mg/L.',
              'El tanque del camión cisterna debe desinfectarse como máximo cada seis (6) meses, conforme a la R.M. N° 449-2001-SA/DM, mediante una empresa de saneamiento ambiental, y contar con certificado vigente.',
              'Se debe llevar un Libro de Registro de Análisis de Calidad del Agua Suministrada y un Libro de Registro de los Camiones Cisterna (placa, N° de autorización sanitaria, fecha/hora, volumen, zona de reparto).',
            ],
          },
          {
            title: '12. Registro y comunicación de resultados',
            bullets: [
              'Libro de Registro de Calidad del Agua para Consumo Humano: lugar, fecha y hora de muestreo, laboratorio, resultados e insumo químico utilizado (con N° de Registro Sanitario). Conservar 5 años.',
              'Libro de Registro de Incidencias en la Fuente de Abastecimiento: eventos y medidas adoptadas.',
              'Comunicar los resultados de la inspección sanitaria y del monitoreo a la jefatura de la IPRESS u organización comunal, con seguimiento de las medidas correctivas.',
              'Toda la documentación (fichas de campo, etiquetas, solicitudes de ensayo) debe mantenerse sin borrones ni enmendaduras y estar a disposición de la Autoridad Sanitaria.',
            ],
          },
          {
            title: '13. Resumen: valores clave para recordar',
            table: {
              headers: ['Parámetro', 'Valor de referencia'],
              rows: [
                ['Cloro residual libre mínimo en red de distribución', '0,5 mg/L (no menor de 0,3 mg/L en el 10% de muestras)'],
                ['Cloro residual libre — salida de reservorio', '1,0 – 1,2 mg/L'],
                ['Cloro residual libre — estación de surtidor', '≥ 1,0 mg/L'],
                ['Cloro residual libre — camión cisterna al usuario', '≥ 0,8 mg/L'],
                ['Turbiedad máxima permisible', '< 5 UNT'],
                ['Concentración para desinfección de captación / CRP', '150 – 200 mg/L, 4 horas de contacto'],
              ],
            },
          },
        ],
      },
      // Página 8
      {
        pageNumber: 8,
        sections: [
          {
            table: {
              headers: ['Parámetro', 'Valor de referencia'],
              rows: [
                ['Concentración para desinfección de reservorio', '50 mg/L, 4 horas de contacto'],
                ['Frecuencia mínima de desinfección de componentes del SAP', '2 veces al año'],
                ['Frecuencia de desinfección del tanque de camión cisterna', 'Cada 6 meses (máximo)'],
              ],
            },
          },
          {
            title: '14. Referencias normativas',
            bullets: [
              'Decreto Supremo N° 031-2010-SA. Reglamento de la Calidad del Agua para Consumo Humano.',
              'Resolución Ministerial N° 854-2020/MINSA. NTS N° 166-MINSA/2020/DIGESA.',
              'Resolución Directoral N° 160-2015/DIGESA/SA. Protocolo de procedimientos para la toma de muestras de agua.',
              'Directiva Sanitaria N° 132-MINSA/2021/DIGESA. Vigilancia de la calidad del agua en IPRESS.',
              'Directiva Sanitaria N° 161-MINSA/DIGESA-2025 (R.M. N° 193-2025/MINSA).',
              'Guía para Limpieza y Desinfección del Sistema de Agua para Consumo Humano. SENCICO / Programa Nacional de Saneamiento Rural (2019).',
              'Resolución Ministerial N° 449-2001-SA/DM. Norma Sanitaria para Desinfección, Limpieza y Desinfección de Reservorios de Agua.',
              'Material de capacitación: Limpieza, Desinfección y Cloración de Sistemas de Agua Potable. GERESA La Libertad.',
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DOCUMENTO 2
  // ===========================================================================
  {
    id: 'medicion-cloro-residual-dpd',
    code: 'IT-DPD-02',
    title: 'INSTRUCTIVO TÉCNICO: MEDICIÓN DE CLORO RESIDUAL LIBRE EN AGUA PARA CONSUMO HUMANO',
    subtitle: 'Procedimiento de campo con el método DPD (colorímetro digital, comparador de disco o comparador artesanal)',
    category: 'INSTRUCTIVO TÉCNICO DE CAMPO',
    totalPages: 8,
    normatives: [
      'D.S. N° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
      'R.D. N° 160-2015/DIGESA/SA — Protocolo de toma de muestras de agua',
      'R.M. N° 854-2020/MINSA — NTS N° 166-MINSA/2020/DIGESA (surtidores y camiones cisterna)',
      'Directiva Sanitaria N° 132-MINSA/2021/DIGESA — Vigilancia de calidad del agua en IPRESS',
      'Directiva Sanitaria N° 161-MINSA/DIGESA-2025 — Vigilancia sanitaria DIRESA/GERESA/DIRIS',
    ],
    description: 'Protocolo estandarizado de medición in situ con reactivo DPD N° 1. Incluye ajuste de blanco, tiempos de lectura, escala visual vs fotometría digital, fichas de registro y matriz de acciones correctivas.',
    pages: [
      // Página 1 (Portada)
      {
        pageNumber: 1,
        sections: [
          {
            title: 'INSTRUCTIVO TÉCNICO',
            subtitle: 'MEDICIÓN DE CLORO RESIDUAL LIBRE EN AGUA PARA CONSUMO HUMANO',
            paragraphs: [
              'Procedimiento de campo con el método DPD (colorímetro digital, comparador de disco o comparador artesanal)',
              'Basado en la normativa sanitaria vigente del Ministerio de Salud del Perú (DIGESA):',
            ],
            bullets: [
              'D.S. N° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
              'R.D. N° 160-2015/DIGESA/SA — Protocolo de toma de muestras de agua',
              'R.M. N° 854-2020/MINSA — NTS N° 166-MINSA/2020/DIGESA (surtidores y camiones cisterna)',
              'Directiva Sanitaria N° 132-MINSA/2021/DIGESA — Vigilancia de calidad del agua en IPRESS',
              'Directiva Sanitaria N° 161-MINSA/DIGESA-2025 — Vigilancia sanitaria DIRESA/GERESA/DIRIS',
            ],
          },
        ],
      },
      // Página 2
      {
        pageNumber: 2,
        sections: [
          {
            title: '1. Objetivo y alcance',
            paragraphs: [
              'Este instructivo estandariza el procedimiento para medir el cloro residual libre en el agua para consumo humano en campo, mediante el método colorimétrico DPD (N,N-dietil-p-fenilendiamina), que es el método oficial exigido por la normativa sanitaria peruana. Es de aplicación para operadores de sistemas de abastecimiento de agua (SAP), personal de IPRESS, estaciones de surtidores, camiones cisterna y personal de salud ambiental que realiza vigilancia sanitaria.',
              'La medición del cloro residual libre permite verificar, en el momento y lugar del muestreo, que el agua mantiene una concentración de desinfectante suficiente para protegerla de una recontaminación microbiológica hasta que llega al consumidor.',
            ],
          },
          {
            title: '2. Fundamento del método',
            paragraphs: [
              'El reactivo DPD (N,N-dietil-p-fenilendiamina) reacciona con el cloro libre presente en el agua produciendo una coloración rosada o magenta, cuya intensidad es proporcional a la concentración de cloro. Esta coloración se compara contra una escala de referencia (disco de color, cartilla o lectura fotométrica), obteniéndose el valor en mg/L (equivalente a ppm).',
            ],
            diagram: {
              type: 'flow',
              items: [
                'Muestra de agua (con cloro libre)',
                '+ Reactivo DPD N° 1 (N,N-dietil-p-fenilendiamina)',
                'Color rosado/magenta (intensidad ∝ concentración)',
              ],
            },
            bullets: [
              'Cloro libre: forma activa del desinfectante (ácido hipocloroso e ion hipoclorito), la que se mide con DPD N° 1.',
              'A mayor turbiedad o presencia de materia orgánica, el cloro se consume más rápido, por lo que la medición debe hacerse en el mismo punto y momento del muestreo, nunca con agua almacenada por horas.',
            ],
          },
          {
            title: '3. Equipos, insumos y materiales',
            subtitle: '3.1 Equipos de medición (uno de los tres, según disponibilidad)',
            table: {
              headers: ['Equipo', 'Descripción', 'Precisión / uso'],
              rows: [
                ['Colorímetro digital portátil', 'Fotómetro que mide automáticamente la absorbancia de la reacción DPD y muestra el valor numérico en pantalla.', 'Mayor precisión; recomendado para vigilancia sanitaria oficial.'],
                ['Comparador de cloro de disco', 'Dispositivo con un disco de colores calibrados que se gira hasta igualar el color de la muestra con reactivo DPD.', 'Precisión visual; requiere buena iluminación y ojo entrenado.'],
              ],
            },
          },
        ],
      },
      // Página 3
      {
        pageNumber: 3,
        sections: [
          {
            table: {
              headers: ['Equipo', 'Descripción', 'Precisión / uso'],
              rows: [
                ['Comparador de cloro artesanal (cartilla)', 'Cartilla impresa con escala de colores de referencia, se compara visualmente con la celda de muestra.', 'Uso de campo básico en zonas rurales; menor precisión.'],
              ],
            },
          },
          {
            subtitle: '3.2 Insumos y materiales',
            bullets: [
              'Reactivo DPD N° 1 (en polvo, tableta o líquido), con registro sanitario vigente y dentro de su fecha de vencimiento.',
              'Celdas o tubos de muestra limpios y transparentes (los del propio equipo).',
              'Frasco o vaso de muestreo limpio.',
              'Agua destilada para el blanco y para el enjuague de celdas.',
              'Paño o papel absorbente sin pelusa para secar las celdas.',
              'Guantes descartables.',
              'Ficha de registro de campo y lapicero de tinta indeleble.',
            ],
          },
          {
            subtitle: '3.3 Verificaciones antes de salir a campo',
            bullets: [
              'Confirmar la carga de batería o pilas del colorímetro digital.',
              'Verificar la calibración vigente del equipo según las especificaciones del fabricante.',
              'Revisar que el reactivo DPD no esté vencido, decolorado o húmedo (si es en polvo).',
              'Llevar celdas de repuesto y un paño de limpieza.',
            ],
          },
          {
            title: '4. Consideraciones previas a la medición',
            diagram: {
              type: 'flow',
              items: [
                'Elegir grifo (conectado a la red)',
                'Desinfectar grifo (alcohol 70% / NaOCl)',
                'Purgar 2-3 min (descartar agua estancada)',
                'Tomar la muestra y medir de inmediato',
              ],
            },
            bullets: [
              'Usar guantes al momento de la toma de muestra.',
              'Elegir un grifo conectado directamente a la tubería de distribución (no a tanques domiciliarios, filtros o puntos muertos de la red).',
              'Desinfectar el grifo interna y externamente con algodón o hisopo con hipoclorito de sodio (100 mg NaOCl/L) o alcohol al 70%.',
              'Abrir la llave y dejar fluir el agua de 2 a 3 minutos antes de medir, para descartar el agua estancada en la tubería.',
              'Si se mide en un pozo, cisterna o reservorio sin grifo, tomar la muestra sumergiendo el frasco de muestreo, evitando tocar las paredes de la estructura.',
            ],
          },
        ],
      },
      // Página 4
      {
        pageNumber: 4,
        sections: [
          {
            alert: '⚠ El cloro residual se debe medir inmediatamente en el punto de muestreo. No transportar la muestra para medir cloro más tarde: el valor cambia en minutos.',
          },
          {
            title: '5. Procedimiento con colorímetro digital',
            diagram: {
              type: 'boxes',
              items: [
                '1. Purgar el punto de muestreo (Dejar fluir agua 2-3 min)',
                '2. Enjuagar y ajustar blanco (Celda solo con muestra)',
                '3. Agregar reactivo DPD N°1 (Mezclar por inversión)',
                '4. Esperar la reacción (Aprox. 1 minuto)',
                '5. Leer el valor en mg/L (Pantalla, disco o cartilla)',
                '6. Registrar de inmediato (Ficha de campo)',
              ],
            },
            numberedSteps: [
              'Encender el equipo y esperar a que se estabilice (según manual del fabricante).',
              'Enjuagar la celda de muestra dos a tres veces con la misma agua a analizar.',
              'Llenar una celda solo con agua de la muestra (sin reactivo): esta será el "blanco". Secar el exterior de la celda y colocarla en el equipo para poner la lectura en cero (ajuste de blanco).',
              'Llenar una segunda celda con la muestra y agregar el reactivo DPD N° 1 (tableta, polvo o gotas, según presentación).',
              'Tapar y mezclar suavemente por inversión (sin agitar fuerte) hasta disolver el reactivo. Esperar el tiempo de reacción indicado por el fabricante (usualmente menos de 1 minuto).',
              'Secar el exterior de la celda con el paño y colocarla en el equipo.',
              'Leer y registrar el valor de cloro residual libre en mg/L que muestra la pantalla.',
              'Repetir la lectura en cada punto de muestreo programado y anotar el resultado en la ficha de campo.',
            ],
          },
          {
            title: '6. Procedimiento con comparador de disco o comparador artesanal',
          },
        ],
      },
      // Página 5
      {
        pageNumber: 5,
        sections: [
          {
            diagram: {
              type: 'boxes',
              items: [
                '1. Enjuagar las dos celdas (Con agua de la muestra)',
                '2. Celda de referencia (Solo muestra, sin reactivo)',
                '3. Celda con reactivo DPD (Mezclar suavemente)',
                '4. Esperar ~1 minuto (Color rosado estable)',
                '5. Girar disco / cartilla (Igualar tono de color)',
                '6. Leer y registrar mg/L (Anotar de inmediato)',
              ],
            },
            numberedSteps: [
              'Enjuagar las dos celdas del comparador con el agua de la muestra.',
              'Llenar una celda solo con la muestra (sin reactivo): esta se usa como referencia de comparación.',
              'Llenar la segunda celda con la muestra y agregar el reactivo DPD N° 1.',
              'Mezclar suavemente y esperar el tiempo de reacción (aprox. 1 minuto) hasta que se estabilice el color rosado/magenta.',
              'Colocar ambas celdas en el comparador, con luz natural o blanca de fondo (nunca luz solar directa ni luz artificial amarilla).',
              'Girar el disco de color (o deslizar la cartilla) hasta igualar el tono de la celda con reactivo con el de la escala de referencia.',
              'Leer el valor de cloro residual libre en mg/L indicado en el disco o cartilla frente a la posición de igualación.',
              'Registrar el resultado inmediatamente en la ficha de campo.',
            ],
            note: 'Nota: Si el color de la muestra sobrepasa el valor máximo de la escala del comparador, diluir la muestra con partes iguales de agua destilada, repetir la lectura y multiplicar el resultado por el factor de dilución utilizado.',
          },
          {
            title: '7. Puntos de medición y frecuencia',
            diagram: {
              type: 'flow',
              items: [
                'Captación (Diaria)',
                'Tratamiento (Diaria)',
                'Reservorio (1,0-1,2 mg/L)',
                'Red distribución (0,5-0,8 mg/L)',
                'Camión cisterna (≥0,8 mg/L al usuario)',
                'IPRESS (≥0,5 mg/L)',
              ],
            },
            table: {
              headers: ['Punto de medición', 'Frecuencia mínima'],
              rows: [
                ['Captación (fuente de abastecimiento)', 'Diaria, si la fuente requiere desinfección previa'],
                ['Salida del sistema de tratamiento o desinfección', 'Diaria'],
                ['Cisternas de almacenamiento', 'Diaria'],
                ['Salida de reservorio(s)', 'Diaria'],
              ],
            },
          },
        ],
      },
      // Página 6
      {
        pageNumber: 6,
        sections: [
          {
            table: {
              headers: ['Punto de medición', 'Frecuencia mínima'],
              rows: [
                ['Red de distribución (punto intermedio y punto más alejado)', 'Diaria (ámbito urbano) / mensual (ámbito rural, como mínimo)'],
                ['Estación de surtidor (hacia el camión cisterna)', 'Diaria, en cada operación de llenado'],
                ['Camión cisterna (cada recarga del tanque)', 'Como mínimo una vez por cada recarga'],
                ['Servicios críticos de IPRESS (cocina, comedor, sala de partos, sala de operaciones, laboratorio, centro de esterilización)', 'Diaria'],
              ],
            },
          },
          {
            title: '8. Interpretación de resultados',
            table: {
              headers: ['Punto de control', 'Cloro residual libre esperado', 'Acción si el resultado es menor'],
              rows: [
                ['Salida de reservorio (post-cloración)', '1,0 – 1,2 mg/L', 'Aumentar la dosificación de desinfectante; volver a medir en 30-60 min.'],
                ['Red de distribución', '0,5 – 0,8 mg/L (mínimo 0,5 mg/L)', 'Tomar muestra para análisis microbiológico (coliformes) y notificar al responsable.'],
                ['Estación de surtidor', '≥ 1,0 mg/L', 'Verificar y ajustar el dosificador automático de cloro.'],
                ['Camión cisterna (entrega al usuario)', '≥ 0,8 mg/L', 'Suspender la entrega y ajustar dosificación antes de continuar el reparto.'],
                ['IPRESS (cisternas, reservorios, red interna)', '≥ 0,5 mg/L', 'Tomar muestra microbiológica; comunicar a la jefatura y aplicar medidas correctivas.'],
              ],
            },
            alert: '⚠ Si el cloro residual libre resulta menor al valor mínimo señalado, se debe tomar de inmediato una muestra de agua para análisis microbiológico (coliformes totales y termotolerantes) y solicitar al responsable de la operación del sistema que incremente la dosificación de desinfectante (D.S. N° 031-2010-SA, art. 66°).',
            paragraphs: [
              'Un valor de cloro residual excesivamente alto (por ejemplo, mayor a 5 mg/L de forma sostenida) tampoco es deseable: puede indicar sobredosificación, generar sabor y olor desagradables, y debe reportarse para ajustar el sistema de dosificación.',
            ],
          },
          {
            title: '9. Registro de resultados',
          },
        ],
      },
      // Página 7
      {
        pageNumber: 7,
        sections: [
          {
            paragraphs: [
              'Todo resultado de cloro residual libre medido en campo debe consignarse en la Ficha de Datos de Campo o en el Libro de Registro de Calidad del Agua, con letra legible, sin borrones ni enmendaduras, incluyendo como mínimo:',
            ],
            bullets: [
              'Código de identificación de campo y coordenadas (GPS/UTM).',
              'Localidad, distrito, provincia y región.',
              'Punto de muestreo (captación, reservorio, red, camión cisterna, servicio de IPRESS, etc.).',
              'Fecha y hora exacta de la medición.',
              'Valor de cloro residual libre (mg/L) y, de ser posible, turbiedad y pH.',
              'Nombre y firma del responsable de la medición.',
            ],
            note: 'Nota: Los registros deben conservarse a disposición de la Autoridad Sanitaria: 5 años para el Libro de Registro de Calidad del Agua y 3 años para el Libro de Registro de los Camiones Cisterna.',
          },
          {
            title: '10. Buenas prácticas y errores comunes a evitar',
            table: {
              headers: ['Correcto', 'Incorrecto'],
              rows: [
                ['• Medir de inmediato en el punto', '• Transportar la muestra para medir'],
                ['• Leer antes de 1-2 minutos', '• Demorar la lectura del color'],
                ['• Usar reactivo DPD vigente', '• Usar DPD húmedo o vencido'],
                ['• Secar bien las celdas', '• Reutilizar celdas sin limpiar'],
                ['• Calibrar el equipo periódicamente', '• Medir bajo sol directo'],
                ['• Repetir la medición si hay duda', '• Reportar sin verificar'],
              ],
            },
            bullets: [
              'No usar el equipo bajo luz solar directa: puede alterar la lectura de comparadores visuales.',
              'No dejar pasar más de 1-2 minutos entre agregar el reactivo y realizar la lectura: el color se degrada con el tiempo (efecto de "fading").',
              'No reutilizar reactivo DPD húmedo, apelmazado o decolorado.',
              'No confundir cloro libre con cloro total: para medir cloro total se requiere DPD N° 3 (reactivo adicional); este instructivo se refiere solo al cloro residual libre, que es el parámetro normado.',
              'Limpiar y secar bien las celdas después de cada uso para evitar contaminación cruzada entre muestras.',
              'Calibrar periódicamente el colorímetro digital según la frecuencia indicada por el fabricante.',
              'Si el resultado genera duda, repetir la medición con una nueva muestra antes de reportar un valor fuera de rango.',
            ],
          },
          {
            title: 'Anexo. Modelo simplificado de ficha de registro',
            table: {
              headers: ['Fecha / hora', 'Punto de muestreo', 'Coordenadas', 'Cloro residual (mg/L)', 'Turbiedad (UNT)', 'pH', 'Responsable'],
              rows: [
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
              ],
            },
          },
        ],
      },
      // Página 8
      {
        pageNumber: 8,
        sections: [
          {
            subtitle: 'Continuación: Modelo simplificado de ficha de registro oficial de campo',
            table: {
              headers: ['Fecha / hora', 'Punto de muestreo', 'Coordenadas', 'Cloro residual (mg/L)', 'Turbiedad (UNT)', 'pH', 'Responsable'],
              rows: [
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
                ['', '', '', '', '', '', ''],
              ],
            },
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // DOCUMENTO 3
  // ===========================================================================
  {
    id: 'seguridad-quimica-hipoclorito-cloro',
    code: 'IS-SEG-03',
    title: 'INSTRUCTIVO DE SEGURIDAD: MANEJO DE HIPOCLORITO DE CALCIO, HIPOCLORITO DE SODIO Y CLORO GAS',
    subtitle: 'Rombos NFPA 704, riesgos y Equipo de Protección Personal (EPP)',
    category: 'INSTRUCTIVO DE SEGURIDAD QUÍMICA',
    totalPages: 10,
    normatives: [
      'NFPA 704 — Sistema Normativo para la Identificación de Materiales Peligrosos',
      'Ley N° 29783 — Ley de Seguridad y Salud en el Trabajo',
      'D.S. N° 031-2010-SA — Reglamento de la Calidad del Agua para Consumo Humano',
      'D.S. N° 015-2005-SA — Valores Límite Permisibles para Agentes Químicos en el Ambiente de Trabajo',
    ],
    description: 'Manual de bioseguridad ocupacional para operadores de caseta y planta de tratamiento. Rombos NFPA 704 detallados, compatibilidad química, protocolo SCBA ante fugas y primeros auxilios de emergencia.',
    pages: [
      // Página 1 (Portada)
      {
        pageNumber: 1,
        sections: [
          {
            title: 'INSTRUCTIVO DE SEGURIDAD',
            subtitle: 'Manejo de Hipoclorito de Calcio, Hipoclorito de Sodio y Cloro Gas',
            paragraphs: [
              'Rombos NFPA 704, riesgos y Equipo de Protección Personal (EPP)',
              'Documento de referencia para personal que manipula desinfectantes clorados en plantas de tratamiento de agua.',
            ],
          },
        ],
      },
      // Página 2
      {
        pageNumber: 2,
        sections: [
          {
            title: '1. Objetivo y alcance',
            paragraphs: [
              'Este instructivo establece los lineamientos mínimos de seguridad para el almacenamiento, manipulación y dosificación de los tres desinfectantes clorados más usados en el tratamiento de agua: hipoclorito de calcio (sólido), hipoclorito de sodio (solución) y cloro gas. Aplica a todo el personal operativo, de mantenimiento y de almacén que tenga contacto con estos productos.',
            ],
          },
          {
            title: '2. Regla de oro: nunca mezclar',
            paragraphs: [
              'Los tres productos son incompatibles entre sí y con ácidos, amoníaco y materia orgánica. La mezcla de hipoclorito (sólido o líquido) con un ácido libera cloro gas de forma inmediata, incluso en pequeñas cantidades. Nunca almacene ni manipule estos productos junto a ácidos, amoníaco, aceites, grasas o materiales combustibles.',
            ],
          },
        ],
      },
      // Página 3
      {
        pageNumber: 3,
        sections: [
          {
            title: '3. Hipoclorito de Calcio — Ca(ClO)₂',
            paragraphs: [
              'Sólido granulado o en tabletas, de 65% a 70% de cloro disponible. Fuerte agente oxidante: al contacto con agua libera cloro gas y calor.',
            ],
            subtitle: 'Datos generales',
            table: {
              headers: ['Parámetro', 'Valor / Especificación'],
              rows: [
                ['Fórmula', 'Ca(ClO)₂'],
                ['N° CAS', '7778-54-3'],
                ['N° ONU', '1748'],
                ['Estado físico', 'Sólido granular / tabletas, olor a cloro'],
                ['Uso típico', 'Desinfección de agua, piscinas y pozos'],
              ],
            },
            nfpa: {
              chemical: 'Hipoclorito de Calcio',
              formula: 'Ca(ClO)₂',
              health: 3,
              flammability: 0,
              reactivity: 1,
              special: 'OX',
            },
          },
          {
            subtitle: 'Peligros principales',
            bullets: [
              'Oxidante fuerte: puede provocar o intensificar un incendio en contacto con material combustible.',
              'Reacciona con agua y humedad liberando cloro gas y calor; riesgo de descomposición violenta si se contamina con materia orgánica.',
              'Corrosivo: causa quemaduras graves en piel, ojos y mucosas; la inhalación de polvo irrita severamente las vías respiratorias.',
              'Puede provocar edema pulmonar en exposiciones intensas.',
            ],
          },
          {
            subtitle: 'Equipo de Protección Personal (EPP) obligatorio',
            bullets: [
              'Respirador con filtro para gases ácidos/cloro (o media/full face según evaluación de riesgo) al manipular el producto a granel.',
              'Gafas de seguridad tipo careta o goggles químicos (no lentes de contacto).',
              'Guantes resistentes a químicos (nitrilo o PVC), de manga larga.',
              'Traje o delantal impermeable resistente a oxidantes; botas de jebe.',
              'Ducha de emergencia y lavaojos disponibles en el área de trabajo.',
            ],
          },
        ],
      },
      // Página 4
      {
        pageNumber: 4,
        sections: [
          {
            title: 'Manipulación y almacenamiento (Hipoclorito de Calcio)',
            bullets: [
              'Almacenar en lugar fresco, seco, ventilado y alejado de la luz solar directa y de fuentes de calor.',
              'Mantener en su envase original, bien cerrado, sobre tarimas y separado de ácidos, amoníaco y combustibles.',
              'No usar herramientas de metal que generen chispas; usar cucharas/palas de plástico.',
              'No devolver producto sobrante al envase original; no mezclar con agua en recipientes cerrados.',
              'Rotular claramente el área de almacenamiento como "Oxidante - Sección 5.1".',
            ],
          },
          {
            subtitle: 'Respuesta ante emergencia / primeros auxilios',
            bullets: [
              'Contacto con la piel: retirar ropa contaminada y lavar con abundante agua durante 15-20 minutos.',
              'Contacto con los ojos: enjuagar con agua limpia por al menos 15 minutos y buscar atención médica.',
              'Inhalación: trasladar a la persona a un área con aire fresco; si hay dificultad para respirar, buscar atención médica inmediata.',
              'Derrame: evacuar el área, ventilar, evitar contacto con materia orgánica o combustible, recoger en seco con pala plástica y disponer según normativa local.',
            ],
          },
        ],
      },
      // Página 5
      {
        pageNumber: 5,
        sections: [
          {
            title: '4. Hipoclorito de Sodio — NaOCl (solución)',
            paragraphs: [
              'Solución acuosa clorada (normalmente 5% a 15% de cloro activo). El grado de riesgo a la salud puede subir a 3 en concentraciones altas (>15%).',
            ],
            subtitle: 'Datos generales',
            table: {
              headers: ['Parámetro', 'Valor / Especificación'],
              rows: [
                ['Fórmula', 'NaOCl (en solución acuosa)'],
                ['N° CAS', '7681-52-9'],
                ['N° ONU', '1791'],
                ['Estado físico', 'Líquido amarillo pálido, olor a cloro'],
                ['Uso típico', 'Desinfección de agua potable, efluentes y superficies'],
              ],
            },
            nfpa: {
              chemical: 'Hipoclorito de Sodio',
              formula: 'NaOCl',
              health: 2,
              flammability: 0,
              reactivity: 1,
              special: 'OX',
            },
          },
          {
            subtitle: 'Peligros principales',
            bullets: [
              'Corrosivo: causa quemaduras en piel y daño ocular grave; el vapor irrita nariz, garganta y pulmones.',
              'Agente oxidante; reacciona violentamente con ácidos liberando cloro gas tóxico.',
              'Inestable con el calor, la luz y los metales pesados (cobalto, níquel, hierro): se descompone liberando oxígeno y cloro.',
              'Corrosivo para metales como aluminio y bronce.',
            ],
          },
          {
            subtitle: 'Equipo de Protección Personal (EPP) obligatorio',
            bullets: [
              'Gafas de seguridad tipo goggles o careta facial completa.',
              'Guantes de nitrilo o PVC resistentes a químicos, de manga larga.',
              'Delantal o traje impermeable; botas de jebe antideslizantes.',
              'Respirador con cartucho para gases ácidos si hay riesgo de vapores en espacios cerrados o durante trasiego.',
              'Ducha de emergencia y lavaojos accesibles en la zona de dosificación.',
            ],
          },
          {
            subtitle: 'Manipulación y almacenamiento',
            bullets: [
              'Almacenar en área fresca, ventilada y protegida de la luz solar directa (la concentración se degrada con calor y luz).',
            ],
          },
        ],
      },
      // Página 6
      {
        pageNumber: 6,
        sections: [
          {
            bullets: [
              'Usar recipientes de plástico compatible (HDPE); evitar contenedores metálicos no protegidos.',
              'Separar de ácidos, amoníaco, agua oxigenada y productos orgánicos.',
              'No trasvasar por succión con la boca; usar bombas dosificadoras o sifones manuales.',
              'Contener el área de trasiego con cubetos para evitar derrames al piso o alcantarillado.',
            ],
          },
          {
            subtitle: 'Respuesta ante emergencia / primeros auxilios (Hipoclorito de Sodio)',
            bullets: [
              'Contacto con la piel: lavar de inmediato con abundante agua por 15-20 minutos y retirar ropa contaminada.',
              'Contacto con los ojos: enjuagar con agua limpia durante 15 minutos manteniendo los párpados abiertos; acudir al médico.',
              'Inhalación de vapores: retirar a la persona al aire libre; si persiste la dificultad respiratoria, administrar oxígeno y buscar atención médica.',
              'Ingestión accidental: no inducir el vómito; enjuagar la boca y dar de beber agua si la persona está consciente; buscar atención médica inmediata.',
              'Derrame: ventilar el área, contener con material absorbente inerte, no usar materiales combustibles, neutralizar y disponer según normativa local.',
            ],
          },
        ],
      },
      // Página 7
      {
        pageNumber: 7,
        sections: [
          {
            title: '5. Cloro Gas — Cl₂',
            paragraphs: [
              'Gas amarillo-verdoso, más pesado que el aire (se acumula en zonas bajas), de olor penetrante e irritante. Se almacena y transporta como gas licuado a presión. Es el más peligroso de los tres por su alta toxicidad aguda.',
            ],
            subtitle: 'Datos generales',
            table: {
              headers: ['Parámetro', 'Valor / Especificación'],
              rows: [
                ['Fórmula', 'Cl₂'],
                ['N° CAS', '7782-50-5'],
                ['N° ONU', '1017'],
                ['Estado físico', 'Gas licuado a presión, color amarillo-verdoso'],
                ['Uso típico', 'Cloración directa de agua potable y aguas residuales'],
              ],
            },
            nfpa: {
              chemical: 'Cloro Gas',
              formula: 'Cl₂',
              health: 4,
              flammability: 0,
              reactivity: 0,
              special: 'OX',
            },
          },
          {
            subtitle: 'Peligros principales',
            bullets: [
              'Extremadamente tóxico por inhalación: una exposición corta a alta concentración puede ser mortal.',
              'Gas oxidante y comburente: intensifica la combustión de otros materiales, aunque él mismo no es inflamable.',
              'Corrosivo severo para ojos, piel y vías respiratorias; puede causar edema pulmonar de aparición diferida.',
              'Al liberarse se comporta como gas pesado y se acumula en zonas bajas, sótanos y espacios confinados.',
              'Los cilindros presurizados representan riesgo físico adicional (fuga, proyección) ante daño o exposición al fuego.',
            ],
          },
          {
            subtitle: 'Equipo de Protección Personal (EPP) obligatorio',
            bullets: [
              'Equipo de respiración autónoma (SCBA) obligatorio para atender fugas o ingresar a la sala de cloración en emergencia.',
              'Máscara de cara completa con filtro específico para cloro solo para exposiciones de baja concentración y tiempo limitado (nunca para fugas mayores).',
              'Traje encapsulado resistente a químicos para atención de fugas grandes.',
              'Guantes resistentes a químicos y calzado de seguridad.',
              'Detector fijo y portátil de cloro con alarma en la sala de cilindros; ducha de emergencia y lavaojos en el acceso.',
            ],
          },
          {
            subtitle: 'Manipulación y almacenamiento',
          },
        ],
      },
      // Página 8
      {
        pageNumber: 8,
        sections: [
          {
            bullets: [
              'Almacenar y usar los cilindros en salas ventiladas, con extracción de aire a nivel de piso (el cloro es más denso que el aire).',
              'Asegurar los cilindros en posición vertical, encadenados o con soporte, alejados de fuentes de calor y de la luz solar directa.',
              'Instalar detectores de fuga con alarma audible y visible, y kit de contención de fugas (kit tipo "Chlorine B") junto a los cilindros.',
              'No manipular válvulas ni conexiones sin la llave y herramientas adecuadas; verificar fugas con amoníaco (nunca con la nariz).',
              'Capacitar y entrenar periódicamente al personal en el uso del SCBA y en el protocolo de evacuación.',
            ],
          },
          {
            subtitle: 'Respuesta ante emergencia / primeros auxilios (Cloro Gas)',
            bullets: [
              'Ante alarma de fuga: evacuar inmediatamente en dirección contraria al viento y hacia zonas altas; no intentar controlar la fuga sin SCBA y entrenamiento.',
              'Contacto con la piel: retirar ropa contaminada y lavar con abundante agua durante al menos 20 minutos.',
              'Contacto con los ojos: enjuagar con agua limpia por 20 minutos y trasladar de inmediato a atención médica.',
              'Inhalación: sacar a la persona al aire libre, mantenerla en reposo y en posición semisentada; administrar oxígeno si está disponible y trasladar de urgencia (el edema pulmonar puede aparecer horas después).',
              'Notificar de inmediato a los servicios de emergencia y al responsable de seguridad de la planta.',
            ],
          },
        ],
      },
      // Página 9
      {
        pageNumber: 9,
        sections: [
          {
            title: '6. Cuadro comparativo de EPP mínimo',
            table: {
              headers: ['EPP', 'Hipoclorito de Calcio', 'Hipoclorito de Sodio', 'Cloro Gas'],
              rows: [
                ['Protección respiratoria', 'Respirador para gases ácidos', 'Respirador (espacios cerrados)', 'SCBA obligatorio'],
                ['Protección ocular', 'Goggles / careta', 'Goggles / careta', 'Careta completa'],
                ['Guantes', 'Nitrilo / PVC', 'Nitrilo / PVC', 'Resistentes a químicos'],
                ['Protección corporal', 'Delantal impermeable', 'Delantal impermeable', 'Traje encapsulado (fugas)'],
                ['Detección de fuga', 'No aplica', 'No aplica', 'Detector fijo + alarma'],
                ['Rombo NFPA (S-I-R-E)', '3-0-1-OX', '2-0-1-OX', '4-0-0-OX'],
              ],
            },
            note: 'Nota: Los valores NFPA 704 pueden variar ligeramente según el fabricante y la concentración del producto; siempre verificar la Hoja de Datos de Seguridad (HDS/SDS) específica del proveedor antes de su uso.',
          },
        ],
      },
      // Página 10
      {
        pageNumber: 10,
        sections: [
          {
            title: 'Anexo. Cómo leer el rombo NFPA 704',
            table: {
              headers: ['Cuadrante / Color', 'Significado y Criterio de Riesgo'],
              rows: [
                ['Azul (Salud)', 'Grado de riesgo para la salud por exposición aguda, de 0 (ninguno) a 4 (mortal en exposición corta).'],
                ['Rojo (Inflamabilidad)', 'Facilidad de combustión del material, de 0 (no se quema) a 4 (extremadamente inflamable).'],
                ['Amarillo (Reactividad/Inestabilidad)', 'Tendencia a liberar energía o reaccionar violentamente, de 0 (estable) a 4 (puede detonar).'],
                ['Blanco (Riesgo especial)', '"OX" = agente oxidante fuerte. Otros símbolos posibles: W̶ (reacciona peligrosamente con agua), COR (corrosivo).'],
              ],
            },
          },
        ],
      },
    ],
  },
];

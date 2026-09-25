// ============================================================================
// AQUA-SALUD: DICCIONARIO CIENTÍFICO Y EDUCATIVO DE PARÁMETROS DE CALIDAD DE AGUA
// Basado en el D.S. N.° 031-2010-SA, Standard Methods (SMEWW) y guías EPA/OMS.
// Incluye imágenes reales de trabajo analítico en el laboratorio.
// ============================================================================

import imgPhTest from '../assets/images/lab_ph_test_1790144988973.jpg';
import imgTurbidityTest from '../assets/images/lab_turbidity_test_1790145005132.jpg';
import imgTitrationHardness from '../assets/images/lab_titration_hardness_1790145020466.jpg';
import imgSpectrophotometer from '../assets/images/lab_spectrophotometer_1790145031801.jpg';
import imgPetriMembrane from '../assets/images/lab_petri_membrane_1790145042074.jpg';
import imgMetalsIcp from '../assets/images/lab_metals_icp_1790052468879.jpg';
import imgPhysicochemicalGen from '../assets/images/lab_physicochemical_1790052441019.jpg';
import imgMicrobiologyGen from '../assets/images/lab_microbiology_1790052454574.jpg';

export interface ParameterInterpretation {
  low?: string;
  lowLabel?: string;
  normal: string;
  normalLabel?: string;
  high?: string;
  highLabel?: string;
}

export interface WaterParameterDetail {
  id: string;
  category: 'fisicoquimico' | 'microbiologico' | 'metales';
  name: string;
  technicalName: string;
  symbol?: string;
  icon: string;
  badgeEmoji: string;
  unit: string;
  limit: string;
  normativeRef: string;
  method: string;
  equipment: string;
  whatIs: string;
  whatIsFor: string;
  whyImportant: string;
  interpretation?: ParameterInterpretation;
  // Imagen de trabajo en el laboratorio
  labImage: string;
  labImageCaption: string;
}

export const WATER_PARAMETERS_DETAIL_DATA: WaterParameterDetail[] = [
  // ==========================================================================
  // 1. PARÁMETROS FISICOQUÍMICOS (16 parámetros)
  // ==========================================================================
  {
    id: 'ph',
    category: 'fisicoquimico',
    name: 'pH',
    technicalName: 'Potencial de hidrógeno',
    symbol: 'pH',
    icon: 'water_drop',
    badgeEmoji: '💧',
    unit: 'Unidades pH',
    limit: '6.5 – 8.5',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 4500-H⁺ B (Electrométrico con electrodo de vidrio) / EPA 150.1',
    equipment: 'Multiparámetro digital con electrodo de vidrio calibrado con soluciones buffer trazables NIST',
    whatIs:
      'El pH es una medida que indica qué tan ácida o alcalina es el agua en una escala de 0 a 14, donde 7 representa un valor neutro.',
    whatIsFor:
      'Su determinación permite conocer las condiciones de acidez o alcalinidad del agua y apoyar la evaluación de su calidad. También es un parámetro fundamental para interpretar y controlar diferentes procesos de desinfección, coagulación y neutralización en el tratamiento del agua.',
    whyImportant:
      'Un pH adecuado garantiza que el cloro desinfectante destruya eficazmente bacterias y virus. Si el pH es muy bajo, el agua corroe tuberías metálicas y disuelve plomo o cobre; si es muy alto, el cloro pierde su poder protector y se forman sarro e incrustaciones en las redes.',
    interpretation: {
      low: 'Agua ácida y agresiva. Puede corroer tuberías metálicas, liberar metales pesados en las redes y presentar un sabor metálico o ligeramente amargo.',
      lowLabel: 'Valor Bajo (< 6.5)',
      normal: 'Rango óptimo y seguro según el D.S. N.° 031-2010-SA. El cloro desinfectante actúa con máxima efectividad y el agua mantiene estabilidad química.',
      normalLabel: 'Rango de Referencia (6.5 – 8.5)',
      high: 'Agua alcalina. Reduce drásticamente la capacidad desinfectante del cloro libre, favorece la formación de sarro en tuberías y puede generar sabor jabonoso.',
      highLabel: 'Valor Elevado (> 8.5)',
    },
    labImage: imgPhTest,
    labImageCaption: 'Analista calibrando electrodo de vidrio y midiendo pH in situ en vaso de precipitados.',
  },
  {
    id: 'turbidez',
    category: 'fisicoquimico',
    name: 'Turbidez',
    technicalName: 'Turbidez nefelométrica',
    symbol: 'NTU',
    icon: 'grain',
    badgeEmoji: '🌫️',
    unit: 'NTU (Unidades Nefelométricas de Turbidez)',
    limit: '≤ 5.0 NTU',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 2130 B (Nefelométrico a 90° de dispersión) / EPA 180.1',
    equipment: 'Turbidímetro portátil o de sobremesa calibrado con patrones primarios de formazina',
    whatIs:
      'La turbidez es una medida relacionada con la presencia de partículas suspendidas microscópicas (como arcillas, lodos o materia orgánica) que afectan la transparencia y claridad del agua.',
    whatIsFor:
      'Permite evaluar la claridad del agua y detectar cambios asociados a partículas o materia suspendida en fuentes naturales, captaciones, sedimentadores y redes de distribución.',
    whyImportant:
      'Las partículas suspendidas actúan como un escudo protector para bacterias, parásitos y virus, impidiendo que el cloro los alcance y elimine. Mantener una turbidez baja es indispensable para asegurar que el agua esté desinfectada y cristalina.',
    interpretation: {
      normal: 'Agua clara y transparente. Cumple con la normativa sanitaria nacional y permite una desinfección confiable con cloro residual libre.',
      normalLabel: 'Dentro de Referencia (≤ 5.0 NTU)',
      high: 'Agua con sedimentos visibles o velo blanquecino. Interfiere con la cloración, protege microbios patógenos y puede causar rechazo por parte de los usuarios.',
      highLabel: 'Valor Elevado (> 5.0 NTU)',
    },
    labImage: imgTurbidityTest,
    labImageCaption: 'Técnico de laboratorio insertando celda de vidrio óptico en turbidímetro digital nefelométrico.',
  },
  {
    id: 'conductividad',
    category: 'fisicoquimico',
    name: 'Conductividad',
    technicalName: 'Conductividad eléctrica a 25 °C',
    symbol: 'CE',
    icon: 'electric_bolt',
    badgeEmoji: '⚡',
    unit: 'µS/cm (microsiemens por centímetro)',
    limit: '≤ 1500 µS/cm',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 2510 B (Celda conductimétrica compensada a 25 °C)',
    equipment: 'Conductímetro digital con compensación automática de temperatura (ATC) y celda de platino',
    whatIs:
      'Es la capacidad que tiene el agua para conducir la corriente eléctrica, la cual depende directamente de la cantidad de minerales y sales disueltas que contiene.',
    whatIsFor:
      'Sirve como un indicador rápido y confiable de la mineralización general del agua y permite detectar intrusiones salinas o aportes de fuentes contaminantes.',
    whyImportant:
      'Permite conocer si el agua es fresca o tiene un exceso de sales que afecte su sabor, altere las actividades culinarias de la población o desgaste prematuramente cañerías y accesorios domiciliarios.',
    interpretation: {
      normal: 'Agua con mineralización natural equilibrada, fresca al paladar y segura para el consumo humano según la norma sanitaria.',
      normalLabel: 'Dentro de Referencia (≤ 1500 µS/cm)',
      high: 'Alta concentración de sales minerales disueltas. El agua puede presentar sabor salobre, sensación pesada y propensión a incrustaciones en redes.',
      highLabel: 'Valor Elevado (> 1500 µS/cm)',
    },
    labImage: imgTurbidityTest,
    labImageCaption: 'Medición electroquímica de conductividad iónica con sonda de celda compensada a 25 °C.',
  },
  {
    id: 'temperatura',
    category: 'fisicoquimico',
    name: 'Temperatura',
    technicalName: 'Temperatura in situ',
    symbol: '°C',
    icon: 'device_thermostat',
    badgeEmoji: '🌡️',
    unit: '°C (Grados Celsius)',
    limit: 'Referencial (In situ)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Físico - In situ)',
    method: 'Standard Methods 2550 B (Termométrico in situ)',
    equipment: 'Termómetro digital sumergible calibrado o sonda multiparamétrica de campo',
    whatIs:
      'Es el nivel térmico del agua medido de forma inmediata en el mismo punto de muestreo (captación, reservorio o grifo).',
    whatIsFor:
      'Es un parámetro maestro que influye en la velocidad de las reacciones químicas, la solubilidad de sales y gases, y la eficacia del proceso de cloración.',
    whyImportant:
      'El agua a temperaturas mayores a 25 °C disipa más rápido el cloro residual libre y propicia la multiplicación de bacterias en reservorios y tramos terminales de la red.',
    interpretation: {
      low: 'Agua fresca. Dificulta la multiplicación bacteriana, aunque puede requerir unos minutos adicionales de contacto con el cloro para una desinfección total.',
      lowLabel: 'Temperatura Fresca (< 15 °C)',
      normal: 'Rango habitual en fuentes de agua natural y redes protegidas en la mayoría de cuencas del país.',
      normalLabel: 'Rango Usual (15 °C – 25 °C)',
      high: 'Agua cálida. Acelera la evaporación del cloro libre residual, estimula el crecimiento de biopelículas en tuberías y disminuye el oxígeno disuelto.',
      highLabel: 'Temperatura Elevada (> 25 °C)',
    },
    labImage: imgPhTest,
    labImageCaption: 'Registro termométrico digital simultáneo durante el análisis in situ en fuente de agua.',
  },
  {
    id: 'tds',
    category: 'fisicoquimico',
    name: 'Sólidos Disueltos Totales (TDS)',
    technicalName: 'Sólidos totales disueltos',
    symbol: 'TDS',
    icon: 'scatter_plot',
    badgeEmoji: '🧂',
    unit: 'mg/L',
    limit: '≤ 1000 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 2540 C (Gravimétrico por secado a 180 °C) / EPA 160.1',
    equipment: 'Balanza analítica con estufa termorregulada a 180 °C y cápsula de porcelana desecada',
    whatIs:
      'Representa la suma de todos los minerales, sales inorgánicas (calcio, magnesio, sodio, potasio) y pequeñas cantidades de materia orgánica disueltas en el agua.',
    whatIsFor:
      'Permite evaluar la carga mineral global del agua y verificar si es agradable y apta para beber y cocinar en las comunidades.',
    whyImportant:
      'Niveles elevados de sólidos disueltos provocan un sabor mineral fuerte o amargo, generan depósitos de sarro en ollas y calentadores, y pueden causar molestias estomacales leves en visitantes o niños.',
    interpretation: {
      normal: 'Contenido mineral moderado, seguro para la salud y con excelente sabor para beber y preparar alimentos.',
      normalLabel: 'Dentro de Referencia (≤ 1000 mg/L)',
      high: 'Carga mineral excesiva. Puede generar sabor salobre o amargo, incrustaciones densas y efecto laxante en consumidores no acostumbrados.',
      highLabel: 'Valor Elevado (> 1000 mg/L)',
    },
    labImage: imgPhysicochemicalGen,
    labImageCaption: 'Determinación gravimétrica en cápsula desecada y pesado con balanza analítica de 0.1 mg.',
  },
  {
    id: 'color',
    category: 'fisicoquimico',
    name: 'Color Aparente',
    technicalName: 'Color aparente / escala platino-cobalto',
    symbol: 'UCV',
    icon: 'palette',
    badgeEmoji: '🎨',
    unit: 'UCV (Unidades de Color Verdadero)',
    limit: '≤ 15 UCV',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 2120 B (Comparación visual con escala estándar Platino-Cobalto)',
    equipment: 'Comparador de color con discos calibrados Platino-Cobalto o espectrofotómetro UV-VIS',
    whatIs:
      'Es la tonalidad visual que adquiere el agua debido a sustancias disueltas como humus, hojas descompuestas, arcillas o metales como hierro y manganeso.',
    whatIsFor:
      'Evalúa la apariencia estética del agua y ayuda a identificar arrastre de materia orgánica vegetal en las fuentes de captación.',
    whyImportant:
      'Un agua con coloración amarillenta o marrón es rechazada de inmediato por las familias, quienes podrían optar por consumir agua de canales o acequias sin clorar con grave riesgo para su salud.',
    interpretation: {
      normal: 'Agua visualmente limpia, incolora y transparente. Fomenta la confianza y el consumo saludable en los hogares.',
      normalLabel: 'Dentro de Referencia (≤ 15 UCV)',
      high: 'Agua con color amarillento, pardo o rojizo. Genera rechazo comunitario, manchas en ropa blanca y demanda un consumo excesivo de cloro.',
      highLabel: 'Valor Elevado (> 15 UCV)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Evaluación colorimétrica espectrofotométrica comparada con escala estándar Platino-Cobalto.',
  },
  {
    id: 'dureza_total',
    category: 'fisicoquimico',
    name: 'Dureza Total',
    technicalName: 'Dureza total (como carbonato de calcio CaCO₃)',
    symbol: 'CaCO₃',
    icon: 'diamond',
    badgeEmoji: '💎',
    unit: 'mg/L CaCO₃',
    limit: '≤ 500 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 2340 C (Titulación complejométrica con EDTA)',
    equipment: 'Bureta digital de precisión, agitador magnético e indicador de Negro de Eriocromo T',
    whatIs:
      'Es la concentración combinada de iones de calcio (Ca²⁺) y magnesio (Mg²⁺) disueltos en el agua al atravesar suelos calcáreos y rocas.',
    whatIsFor:
      'Permite clasificar el agua como blanda, moderada o dura, evaluando su tendencia a formar sarro o a gastar más jabón durante el lavado.',
    whyImportant:
      'Aunque el calcio y magnesio son minerales beneficiosos para el organismo, un agua con dureza excesiva incrusta tuberías, obstruye llaves de paso y hace que el jabón corte sin generar espuma.',
    interpretation: {
      low: 'Agua blanda. Produce abundante espuma con poco jabón; si es extremadamente blanda puede ser ligeramente agresiva con las tuberías.',
      lowLabel: 'Agua Blanda (< 100 mg/L)',
      normal: 'Dureza moderada a aceptable. Proporciona minerales esenciales para el organismo sin generar incrustaciones severas en las instalaciones.',
      normalLabel: 'Rango Seguro (100 – 500 mg/L)',
      high: 'Agua muy dura. Produce abundante sarro en reservorios y cañerías, corta el jabón y dificulta la cocción rápida de legumbres.',
      highLabel: 'Valor Elevado (> 500 mg/L)',
    },
    labImage: imgTitrationHardness,
    labImageCaption: 'Química analista realizando titulación complejométrica con EDTA y bureta de vidrio de precisión.',
  },
  {
    id: 'alcalinidad',
    category: 'fisicoquimico',
    name: 'Alcalinidad Total',
    technicalName: 'Alcalinidad total (como CaCO₃)',
    symbol: 'Alc',
    icon: 'balance',
    badgeEmoji: '⚖️',
    unit: 'mg/L CaCO₃',
    limit: 'Referencial (≤ 400 mg/L)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetro Regulador / Buffer)',
    method: 'Standard Methods 2320 B (Titulación ácido-base con ácido sulfúrico a viraje verde de bromocresol-rojo de metilo)',
    equipment: 'Bureta de precisión de 0.01 mL o titulador potenciométrico automático',
    whatIs:
      'Es la capacidad amortiguadora ("efecto buffer") que tiene el agua para neutralizar ácidos, debida principalmente a la presencia de bicarbonatos.',
    whatIsFor:
      'Permite saber qué tan estable es el pH del agua frente a la adición de desinfectantes clorados o sustancias químicas de tratamiento.',
    whyImportant:
      'Una alcalinidad adecuada impide que el agua se vuelva ácida al dosificar cloro, protegiendo las tuberías contra la corrosión y asegurando una desinfección estable en toda la red comunal.',
    interpretation: {
      low: 'Baja capacidad amortiguadora. El pH del agua es inestable y puede descender con facilidad a niveles corrosivos durante la cloración.',
      lowLabel: 'Baja Capacidad (< 30 mg/L)',
      normal: 'Excelente capacidad reguladora. Mantiene el pH equilibrado y estable frente a fluctuaciones climáticas y dosificación de cloro.',
      normalLabel: 'Rango Estable (30 – 400 mg/L)',
      high: 'Alcalinidad elevada. En conjunto con alta dureza incrementa la formación de depósitos calcáreos en reservorios y redes de conducción.',
      highLabel: 'Elevada (> 400 mg/L)',
    },
    labImage: imgTitrationHardness,
    labImageCaption: 'Titulación volumétrica ácido-base para determinación de capacidad buffer en matraz Erlenmeyer.',
  },
  {
    id: 'cloruros',
    category: 'fisicoquimico',
    name: 'Cloruros (Cl⁻)',
    technicalName: 'Ión cloruro',
    symbol: 'Cl⁻',
    icon: 'science',
    badgeEmoji: '🧪',
    unit: 'mg/L',
    limit: '≤ 250 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 4500-Cl⁻ B (Método argentométrico con nitrato de plata AgNO₃)',
    equipment: 'Bureta analítica con agitador magnético e indicador de cromato de potasio',
    whatIs:
      'Son sales naturales compuestas de cloro y metales (como sal común NaCl) disueltas en el agua desde los estratos del suelo o por lixiviados.',
    whatIsFor:
      'Permite detectar salinidad natural del subsuelo, intrusión de aguas salobres o posible contaminación por efluentes domésticos o industriales.',
    whyImportant:
      'En concentraciones moderadas son inofensivos, pero cuando superan los 250 mg/L le dan un sabor salado notable al agua y aceleran notablemente la corrosión de grifos y tuberías metálicas.',
    interpretation: {
      normal: 'Concentración natural segura, sin sabor salino y compatible con la conservación de accesorios y tuberías de la vivienda.',
      normalLabel: 'Dentro de Referencia (≤ 250 mg/L)',
      high: 'Sabor salado evidente al beber. Acelera fuertemente la corrosión de cañerías metálicas galvanizadas, calentadores y griferías.',
      highLabel: 'Valor Elevado (> 250 mg/L)',
    },
    labImage: imgTitrationHardness,
    labImageCaption: 'Determinación argentométrica de cloruros con titulación de nitrato de plata bajo agitación magnética.',
  },
  {
    id: 'sulfatos',
    category: 'fisicoquimico',
    name: 'Sulfatos (SO₄²⁻)',
    technicalName: 'Ión sulfato',
    symbol: 'SO₄²⁻',
    icon: 'waves',
    badgeEmoji: '🌊',
    unit: 'mg/L',
    limit: '≤ 250 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 4500-SO₄²⁻ E (Método turbidimétrico con cloruro de bario) / EPA 375.4',
    equipment: 'Espectrofotómetro UV-VIS calibrado a 420 nm con celdas de vidrio óptico',
    whatIs:
      'Son sales de azufre y oxígeno que provienen de la disolución natural de minerales como el yeso en el subsuelo o de actividades agrícolas y mineras.',
    whatIsFor:
      'Permite evaluar el contenido mineral de origen geológico y prevenir molestias gastrointestinales en la población.',
    whyImportant:
      'Valores elevados de sulfato pueden provocar un efecto purgante o laxante transitorio en personas no habituadas y niños, además de un sabor amargo astringente.',
    interpretation: {
      normal: 'Concentración inocua de sulfatos, segura para la digestión y agradable al paladar de toda la comunidad.',
      normalLabel: 'Dentro de Referencia (≤ 250 mg/L)',
      high: 'Efecto laxante inmediato en niños y consumidores no habituados. Sabor amargo característico y potencial corrosión en conducciones de concreto.',
      highLabel: 'Valor Elevado (> 250 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Lectura espectrofotométrica de suspensión de sulfato de bario en espectrofotómetro UV-VIS.',
  },
  {
    id: 'nitratos',
    category: 'fisicoquimico',
    name: 'Nitratos (NO₃⁻)',
    technicalName: 'Ión nitrato (como NO₃⁻)',
    symbol: 'NO₃⁻',
    icon: 'warning',
    badgeEmoji: '⚠️',
    unit: 'mg/L',
    limit: '≤ 50 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'Standard Methods 4500-NO₃⁻ B (Espectrofotometría ultravioleta a 220 nm y 275 nm)',
    equipment: 'Espectrofotómetro de doble haz UV-VIS con celdas de cuarzo de alta pureza',
    whatIs:
      'Es un compuesto de nitrógeno originado por la descomposición de materia orgánica animal, pozos ciegos y el uso extensivo de abonos y fertilizantes agrícolas.',
    whatIsFor:
      'Es un indicador crítico de contaminación de la fuente hídrica por aguas servidas sin tratar o escorrentía agrícola con fertilizantes.',
    whyImportant:
      'Es un parámetro de alta prioridad sanitaria: en bebés menores de 6 meses produce el "síndrome del niño azul" (metahemoglobinemia), una afección grave que impide que la sangre transporte oxígeno a los tejidos vitales.',
    interpretation: {
      normal: 'Agua protegida contra lixiviados agrícolas o filtraciones de letrinas; segura para la alimentación de lactantes y preparación de fórmulas.',
      normalLabel: 'Dentro de Referencia (≤ 50 mg/L)',
      high: 'Peligro toxicológico severo para gestantes y lactantes menores de 6 meses. No debe hervirse para concentrarlo; requiere suspensión del consumo infantil y cambio de fuente.',
      highLabel: 'Valor Elevado (> 50 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Inserción de celda de cuarzo para cuantificación ultravioleta de nitratos a 220 nm.',
  },
  {
    id: 'nitritos',
    category: 'fisicoquimico',
    name: 'Nitritos (NO₂⁻)',
    technicalName: 'Ión nitrito (como NO₂⁻)',
    symbol: 'NO₂⁻',
    icon: 'report_problem',
    badgeEmoji: '🚨',
    unit: 'mg/L',
    limit: '≤ 3.0 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'Standard Methods 4500-NO₂⁻ B (Colorimétrico diazotación con sulfanilamida y NED)',
    equipment: 'Espectrofotómetro UV-VIS calibrado a 543 nm',
    whatIs:
      'Es una forma inestable e intermedia de nitrógeno que se produce durante la descomposición de aguas residuales o desechos biológicos.',
    whatIsFor:
      'Su detección en el agua es una señal inequívoca de contaminación fecal u orgánica muy reciente en el entorno de la captación.',
    whyImportant:
      'Presenta alta toxicidad directa en la sangre y además reacciona con el cloro libre anulando por completo el poder desinfectante de los sistemas de agua potable.',
    interpretation: {
      normal: 'Ausencia o niveles indetectables. Confirma una fuente protegida, con adecuada oxigenación y sin ingreso de aguas residuales recientes.',
      normalLabel: 'Dentro de Referencia (≤ 3.0 mg/L)',
      high: 'Alerta sanitaria máxima. Evidencia contaminación orgánica o fecal activa cerca de la captación; anula el cloro desinfectante y compromete la salud.',
      highLabel: 'Valor Elevado (> 3.0 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Medición de complejo azoico rojizo en espectrofotómetro UV-VIS para ensayo de nitritos.',
  },
  {
    id: 'amonio',
    category: 'fisicoquimico',
    name: 'Amonio (NH₄⁺)',
    technicalName: 'Ión amonio / nitrógeno amoniacal',
    symbol: 'NH₄⁺',
    icon: 'bubble_chart',
    badgeEmoji: '💨',
    unit: 'mg/L',
    limit: '≤ 1.5 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 4500-NH₃ C/F (Método del fenato con hipoclorito a viraje azul de indofenol)',
    equipment: 'Destilador micro-Kjeldahl y espectrofotómetro UV-VIS a 640 nm',
    whatIs:
      'Es un compuesto de nitrógeno e hidrógeno liberado por la putrefacción de residuos animales, corrales ganaderos, efluentes domésticos y agroquímicos.',
    whatIsFor:
      'Permite detectar infiltraciones de aguas negras o escorrentías de corrales hacia pozos, manantiales o galerías filtrantes.',
    whyImportant:
      'Reacciona vorazmente con el cloro libre en los reservorios formando cloraminas, lo que elimina el cloro residual libre y deja a la población desprotegida frente a infecciones diarreicas.',
    interpretation: {
      normal: 'Ausencia de carga amoniacal. Permite una cloración eficiente, económica y con residual libre desinfectante duradero en la red.',
      normalLabel: 'Dentro de Referencia (≤ 1.5 mg/L)',
      high: 'Indica ingreso de efluentes fecales o fertilizantes. Consume aceleradamente el cloro desinfectante, requiere mayor dosificación y revisión urgente de la captación.',
      highLabel: 'Valor Elevado (> 1.5 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Lectura fotométrica del complejo indofenol azul para determinación de nitrógeno amoniacal.',
  },
  {
    id: 'fluoruros',
    category: 'fisicoquimico',
    name: 'Fluoruros (F⁻)',
    technicalName: 'Ión fluoruro',
    symbol: 'F⁻',
    icon: 'dentistry',
    badgeEmoji: '🦷',
    unit: 'mg/L',
    limit: '≤ 1.5 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'Standard Methods 4500-F⁻ D (Colorimétrico con reactivo SPADNS) o Electrodo de Ión Selectivo',
    equipment: 'Medidor de ión selectivo con electrodo combinado de fluoruro o espectrofotómetro UV-VIS',
    whatIs:
      'Es un compuesto inorgánico natural que se desprende de rocas fluoradas y depósitos minerales subterráneos.',
    whatIsFor:
      'Permite vigilar que el agua proteja el esmalte dental sin llegar a niveles tóxicos que perjudiquen la estructura ósea.',
    whyImportant:
      'En dosis adecuadas previene las caries en los niños; sin embargo, si sobrepasa 1.5 mg/L de forma continuada, ocasiona fluorosis dental (manchas pardas y fragilidad en los dientes) y fluorosis ósea en adultos.',
    interpretation: {
      normal: 'Concentración óptima para la protección dental comunitaria sin generar efectos tóxicos en los huesos ni en el esmalte.',
      normalLabel: 'Dentro de Referencia (≤ 1.5 mg/L)',
      high: 'Peligro de fluorosis dental en niños (manchas oscuras y dientes quebradizos) y fragilidad ósea acumulativa en adultos tras consumo prolongado.',
      highLabel: 'Valor Elevado (> 1.5 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Ensayo espectrofotométrico SPADNS con curva de calibración para fluoruros.',
  },
  {
    id: 'hierro',
    category: 'fisicoquimico',
    name: 'Hierro (Fe)',
    technicalName: 'Hierro total',
    symbol: 'Fe',
    icon: 'invert_colors',
    badgeEmoji: '🧲',
    unit: 'mg/L',
    limit: '≤ 0.3 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'Standard Methods 3500-Fe B (Método de la 1,10-fenantrolina) / EPA 200.7 (ICP-OES)',
    equipment: 'Espectrofotómetro UV-VIS a 510 nm o espectrómetro de emisión óptica ICP-OES',
    whatIs:
      'Es uno de los metales más abundantes de la corteza terrestre, frecuente en aguas subterráneas con poco oxígeno y en redes con corrosión de fierro.',
    whatIsFor:
      'Evalúa la calidad organoléptica del agua y detecta el desgaste de tuberías de hierro fundido o el ingreso de aguas de pozo profundas no aireadas.',
    whyImportant:
      'Aunque en dosis bajas no es peligroso para la salud, tiñe el agua de rojo o marrón, mancha la ropa al lavar, produce un sabor a herrumbre desagradable y propicia bacterias que obstruyen las tuberías.',
    interpretation: {
      normal: 'Agua límpida, sin coloraciones rojizas, sin sabor metálico y compatible con el lavado y consumo doméstico.',
      normalLabel: 'Dentro de Referencia (≤ 0.3 mg/L)',
      high: 'Color rojizo o amarillento perceptible, sabor metálico a herrumbre, manchas rebeldes en ropa blanca y acumulación de sedimentos en la red.',
      highLabel: 'Valor Elevado (> 0.3 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Cuantificación espectrofotométrica de complejo fenantrolina-hierro a 510 nm.',
  },
  {
    id: 'manganeso',
    category: 'fisicoquimico',
    name: 'Manganeso (Mn)',
    technicalName: 'Manganeso total',
    symbol: 'Mn',
    icon: 'format_paint',
    badgeEmoji: '⬛',
    unit: 'mg/L',
    limit: '≤ 0.4 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II y Anexo III',
    method: 'Standard Methods 3500-Mn B (Método del persulfato a permanganato) / EPA 200.7',
    equipment: 'Espectrofotómetro UV-VIS a 525 nm o ICP-MS Agilent',
    whatIs:
      'Es un elemento metálico que suele acompañar al hierro en formaciones rocosas subterráneas y estratos volcánicos.',
    whatIsFor:
      'Permite evitar manchas oscuras en artefactos sanitarios y prevenir acumulaciones que puedan afectar la salud a largo plazo.',
    whyImportant:
      'En niveles superiores al límite produce manchas negras muy difíciles de limpiar en lavamanos e inodoros, agua con apariencia turbia oscura y sabor amargo; a niveles muy altos continuos puede tener efectos neurológicos.',
    interpretation: {
      normal: 'Agua sin sedimentos oscuros y perfectamente segura para uso doméstico, cocina y consumo comunitario.',
      normalLabel: 'Dentro de Referencia (≤ 0.4 mg/L)',
      high: 'Manchas negras tenaces en artefactos de baño y prendas de vestir; sabor amargo astringente y riesgo toxicológico con el consumo crónico.',
      highLabel: 'Valor Elevado (> 0.4 mg/L)',
    },
    labImage: imgSpectrophotometer,
    labImageCaption: 'Oxidación en caliente con persulfato de amonio y lectura espectrofotométrica a 525 nm.',
  },

  // ==========================================================================
  // 2. PARÁMETROS MICROBIOLÓGICOS (5 parámetros)
  // ==========================================================================
  {
    id: 'escherichia_coli',
    category: 'microbiologico',
    name: 'Escherichia coli (E. coli)',
    technicalName: 'Bacterias Escherichia coli',
    symbol: 'E. coli',
    icon: 'coronavirus',
    badgeEmoji: '🦠',
    unit: 'UFC/100 mL o NMP',
    limit: '0 (Ausencia total en 100 mL)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo I (Parámetros Bacteriológicos)',
    method: 'Standard Methods 9222 G (Filtración por membrana / medio selectivo M-TEC) / SMEWW 9221 (Colilert)',
    equipment: 'Incubadora bacteriológica de baño maría a 44.5 ± 0.2 °C con lámpara UV de 365 nm y contador de colonias',
    whatIs:
      'Es una bacteria que habita exclusivamente en los intestinos de seres humanos y animales de sangre caliente.',
    whatIsFor:
      'Es el indicador bacteriológico definitivo y específico de contaminación fecal humana o animal en el agua.',
    whyImportant:
      'Su presencia confirma que el agua contiene microorganismos fecales que causan diarreas severas, cólera, tifoidea, deshidratación aguda e infecciones gastrointestinales, especialmente mortales en niños pequeños y ancianos.',
    interpretation: {
      normal: 'Ausencia total (0 UFC/100 mL). Agua biológicamente inocua y segura para el consumo humano directo.',
      normalLabel: 'Agua Segura (Ausencia Total)',
      high: 'Emergencia sanitaria crítica. Presencia de contaminación fecal directa. Se debe suspender el consumo sin hervir o clorar inmediatamente y desinfectar la red.',
      highLabel: 'Peligro Crítico (Presencia > 0)',
    },
    labImage: imgPetriMembrane,
    labImageCaption: 'Microbióloga sembrando membrana filtrada cuadriculada sobre agar selectivo en cabina de bioseguridad.',
  },
  {
    id: 'coliformes_totales',
    category: 'microbiologico',
    name: 'Coliformes Totales',
    technicalName: 'Bacterias coliformes totales',
    symbol: 'Colif. Totales',
    icon: 'bug_report',
    badgeEmoji: '🧫',
    unit: 'UFC/100 mL o NMP',
    limit: '0 (Ausencia total en 100 mL)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo I (Parámetros Bacteriológicos)',
    method: 'Standard Methods 9221 B (Sustrato definido enzimático / NMP) o SMEWW 9222 B (Filtración por membrana)',
    equipment: 'Incubadora bacteriológica regulada a 35.0 ± 0.5 °C y equipo de filtración estéril en vacío',
    whatIs:
      'Es un grupo de bacterias que habitan tanto en los intestinos de seres vivos como de forma natural en el suelo, vegetación y aguas superficiales.',
    whatIsFor:
      'Permite evaluar la efectividad de la desinfección con cloro, la integridad de las tuberías y detectar la entrada de suciedad externa a los reservorios.',
    whyImportant:
      'Indica si la barrera de desinfección está funcionando. Si se encuentran en agua tratada, significa que la cloración se agotó o existen roturas en la red por donde entra tierra o agua de lluvia.',
    interpretation: {
      normal: 'Ausencia total (0 UFC/100 mL). Confirma una desinfección con cloro activa y una red de distribución estanca y bien protegida.',
      normalLabel: 'Agua Segura (Ausencia Total)',
      high: 'Falla o insuficiencia en la cloración, o rotura en la red. Favorece la proliferación de microbios oportunistas en el agua de consumo.',
      highLabel: 'Alerta Sanitaria (Presencia > 0)',
    },
    labImage: imgPetriMembrane,
    labImageCaption: 'Filtración al vacío y siembra en placa Petri con agar cromogénico para recuento de coliformes.',
  },
  {
    id: 'bacterias_heterotroficas',
    category: 'microbiologico',
    name: 'Bacterias Heterotróficas',
    technicalName: 'Recuento de bacterias heterotróficas en placa a 35 °C',
    symbol: 'Bact. Heterotróf.',
    icon: 'biotech',
    badgeEmoji: '🔬',
    unit: 'UFC/mL a 35 °C',
    limit: '≤ 500 UFC/mL',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo I (Parámetros Bacteriológicos)',
    method: 'Standard Methods 9215 B (Siembra en masa con agar R2A o plate count)',
    equipment: 'Incubadora bacteriológica a 35 °C y contador digital de colonias con lupa estereoscópica',
    whatIs:
      'Son un conjunto de microorganismos ambientales benignos que requieren carbono orgánico para reproducirse.',
    whatIsFor:
      'Mide la calidad higiénica global del agua y permite detectar estancamiento en tramos muertos o formación de biopelículas (sarro biológico) dentro de las tuberías.',
    whyImportant:
      'Aunque la mayoría no son patógenos directos, un recuento elevado indica que el agua ha perdido el cloro desinfectante y que las tuberías están acumulando sedimentos orgánicos.',
    interpretation: {
      normal: 'Nivel basal seguro (≤ 500 UFC/mL). Agua en buen estado higiénico y con circulación constante.',
      normalLabel: 'Dentro de Referencia (≤ 500 UFC/mL)',
      high: 'Proliferación masiva de biopelículas o agua estancada. Indica falta de cloro residual libre y requiere purga y desinfección de reservorios.',
      highLabel: 'Valor Elevado (> 500 UFC/mL)',
    },
    labImage: imgMicrobiologyGen,
    labImageCaption: 'Recuento microscópico de unidades formadoras de colonias (UFC) en placa tras 48h de incubación a 35 °C.',
  },
  {
    id: 'coliformes_termotolerantes',
    category: 'microbiologico',
    name: 'Coliformes Termotolerantes',
    technicalName: 'Coliformes fecales termotolerantes',
    symbol: 'Colif. Fecales',
    icon: 'thermostat',
    badgeEmoji: '🔥',
    unit: 'UFC/100 mL',
    limit: '0 (Ausencia total en 100 mL)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo I (Parámetros Bacteriológicos)',
    method: 'Standard Methods 9221 E (Tubos múltiples en caldo EC a 44.5 °C) / SMEWW 9222 D',
    equipment: 'Baño maría de circulación forzada termorregulado con precisión a 44.5 ± 0.2 °C',
    whatIs:
      'Es un subgrupo de bacterias coliformes que crecen a temperaturas altas (44.5 °C), provenientes primordialmente de materia fecal fresca.',
    whatIsFor:
      'Permite confirmar con rapidez si una contaminación bacteriana proviene directamente del intestino humano o de animales.',
    whyImportant:
      'Su detección en el agua potable representa una alarma higiénica grave, alertando que las familias corren peligro inmediato de contraer infecciones intestinales agudas.',
    interpretation: {
      normal: 'Ausencia total (0 UFC/100 mL). Garantía de ausencia de materia fecal reciente en el sistema de agua.',
      normalLabel: 'Agua Segura (Ausencia Total)',
      high: 'Contaminación fecal confirmada. Alerta de brote de enfermedades diarreicas agudas (EDA); exige cloración de choque urgente.',
      highLabel: 'Peligro Crítico (Presencia > 0)',
    },
    labImage: imgPetriMembrane,
    labImageCaption: 'Incubación selectiva a 44.5 °C en baño maría de precisión para ensayo de termotolerancia fecal.',
  },
  {
    id: 'huevos_helmintos',
    category: 'microbiologico',
    name: 'Huevos de Helmintos',
    technicalName: 'Huevos y larvas de helmintos',
    symbol: 'Helmintos',
    icon: 'stream',
    badgeEmoji: '🪱',
    unit: 'N° / Litro',
    limit: '0 (Ausencia total)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo I (Parámetros Parasitológicos)',
    method: 'Standard Methods 9711 (Técnica de concentración por flotación y sedimentación microscópica)',
    equipment: 'Microscopio óptico binocular con cámara de recuento Sedgwick-Rafter y centrífuga clínica',
    whatIs:
      'Son formas de resistencia microscópica de parásitos intestinales (como lombrices y tenias) que se transmiten por agua con restos fecales.',
    whatIsFor:
      'Permite verificar si el agua cruda o tratada está contaminada con excrementos y evaluar la eficiencia de los filtros de arena o sedimentadores.',
    whyImportant:
      'Los huevos de parásitos resisten dosis normales de cloro y, al ser ingeridos por niños, producen parasitosis intestinal severa, desnutrición crónica, anemia y bajo rendimiento escolar.',
    interpretation: {
      normal: 'Ausencia total de formas parasitarias. Agua protegida y filtrada adecuadamente.',
      normalLabel: 'Agua Segura (Ausencia Total)',
      high: 'Contaminación directa con aguas residuales no tratadas. Riesgo grave de parasitosis infantil; requiere filtración física profunda y protección de fuentes.',
      highLabel: 'Peligro Severo (Presencia > 0)',
    },
    labImage: imgMicrobiologyGen,
    labImageCaption: 'Examen microscópico con objetivo de 40X para identificación morfológica de formas parasitarias.',
  },

  // ==========================================================================
  // 3. METALES PESADOS Y ELEMENTOS TRAZA (10 parámetros)
  // ==========================================================================
  {
    id: 'arsenico',
    category: 'metales',
    name: 'Arsénico (As)',
    technicalName: 'Arsénico total',
    symbol: 'As',
    icon: 'blur_on',
    badgeEmoji: '⚛️',
    unit: 'mg/L',
    limit: '≤ 0.010 mg/L (10 µg/L)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3114 B (EAA con generador de hidruros)',
    equipment: 'Espectrómetro de masas con plasma acoplado inductivamente (ICP-MS Agilent 7850)',
    whatIs:
      'Es un metaloide sumamente tóxico presente de manera natural en rocas de origen volcánico o liberado por labores mineras en cuencas hidrográficas.',
    whatIsFor:
      'Evalúa la inocuidad toxicológica del agua y previene enfermedades crónicas irreversibles en poblaciones que beben de pozos o ríos andinos.',
    whyImportant:
      'Es catalogado por la OMS como carcinógeno humano de Clase 1. El consumo continuo de agua con arsénico causa hidroarsenicismo crónico (HACRE), manchas y durezas en la piel, daño circulatorio y cáncer de piel, vejiga y pulmones.',
    interpretation: {
      normal: 'Concentración dentro del límite toxicológico seguro de protección a la salud humana (≤ 0.010 mg/L).',
      normalLabel: 'Dentro de Norma (≤ 0.010 mg/L)',
      high: 'Emergencia toxicológica severa. Carcinógeno humano acumulativo; requiere suspender la fuente para consumo directo e instalar sistemas de coagulación-filtración o adsorción.',
      highLabel: 'Alerta Toxicológica (> 0.010 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Química analista operando espectrómetro de masas ICP-MS para cuantificación de arsénico a nivel de trazas.',
  },
  {
    id: 'plomo',
    category: 'metales',
    name: 'Plomo (Pb)',
    technicalName: 'Plomo total',
    symbol: 'Pb',
    icon: 'radioactive',
    badgeEmoji: '🧱',
    unit: 'mg/L',
    limit: '≤ 0.010 mg/L (10 µg/L)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3113 B (EAA horno de grafito con corrección Zeeman)',
    equipment: 'Espectrómetro ICP-MS o equipo de absorción atómica PerkinElmer PinAAcle 900T con horno grafito',
    whatIs:
      'Es un metal pesado neurotóxico que ingresa al agua por vetas minerales naturales, relaves mineros o por corrosión de griferías y soldaduras antiguas de plomo.',
    whatIsFor:
      'Permite proteger el desarrollo mental infantil y prevenir afectaciones renales y cardiovasculares crónicas.',
    whyImportant:
      'El plomo no tiene ninguna función biológica en el cuerpo: se acumula en los huesos y en el cerebro de los niños, causando pérdida irreparable del coeficiente intelectual, retraso escolar, anemia y daño renal.',
    interpretation: {
      normal: 'Niveles seguros libres de riesgo neurotóxico por plomo (≤ 0.010 mg/L).',
      normalLabel: 'Dentro de Norma (≤ 0.010 mg/L)',
      high: 'Alto riesgo neurotóxico infantil. Puede causar saturnismo y daño del neurodesarrollo; requiere verificar si proviene de la fuente o de la grifería domiciliaria.',
      highLabel: 'Alerta Toxicológica (> 0.010 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Carga de muestras en automuestreador de espectrómetro ICP-MS para análisis multielemental de plomo.',
  },
  {
    id: 'cadmio',
    category: 'metales',
    name: 'Cadmio (Cd)',
    technicalName: 'Cadmio total',
    symbol: 'Cd',
    icon: 'lens_blur',
    badgeEmoji: '☣️',
    unit: 'mg/L',
    limit: '≤ 0.003 mg/L (3 µg/L)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3113 B (EAA horno de grafito)',
    equipment: 'Espectrómetro ICP-MS de alta resolución para cuantificación a nivel de trazas (µg/L)',
    whatIs:
      'Es un metal pesado altamente tóxico presente comúnmente en minerales de zinc y en escorrentías de zonas metalúrgicas.',
    whatIsFor:
      'Permite detectar bioacumulación en cuencas de agua y prevenir enfermedades crónicas en los riñones y huesos de la población.',
    whyImportant:
      'El cuerpo humano tarda entre 20 y 30 años en eliminar el cadmio ingerido. Se almacena en los riñones provocando insuficiencia renal irreversible y descalcificación ósea severa (enfermedad de Itai-Itai).',
    interpretation: {
      normal: 'Concentración basal indetectable o inocua que no genera riesgo de acumulación renal.',
      normalLabel: 'Dentro de Norma (≤ 0.003 mg/L)',
      high: 'Peligro tóxico severo con bioacumulación prolongada en los riñones y fragilidad ósea patológica.',
      highLabel: 'Alerta Toxicológica (> 0.003 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Nebulización por plasma de argón a 8000 K en ICP-MS para determinación de cadmio ultra-traza.',
  },
  {
    id: 'mercurio',
    category: 'metales',
    name: 'Mercurio (Hg)',
    technicalName: 'Mercurio total',
    symbol: 'Hg',
    icon: 'water_bottle',
    badgeEmoji: '💧',
    unit: 'mg/L',
    limit: '≤ 0.001 mg/L (1 µg/L)',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 245.1 / Standard Methods 3112 B (EAA con técnica de vapor frío) o DMA-80',
    equipment: 'Analizador automático de mercurio por combustión directa Milestone DMA-80',
    whatIs:
      'Es un metal líquido de extrema toxicidad liberado comúnmente por actividades de minería artesanal aurífera o yacimientos geológicos.',
    whatIsFor:
      'Es vital para prevenir intoxicaciones neurotóxicas devastadoras en comunidades cercanas a cuencas mineras.',
    whyImportant:
      'El mercurio ataca directamente el cerebro y el sistema nervioso, provocando temblores, ceguera, pérdida del equilibrio y malformaciones congénitas irreparables si es consumido por madres gestantes.',
    interpretation: {
      normal: 'Agua completamente libre de mercurio según los más estrictos estándares mundiales de inocuidad.',
      normalLabel: 'Dentro de Norma (≤ 0.001 mg/L)',
      high: 'Emergencia sanitaria y ambiental aguda. Exige el cierre preventivo inmediato de la fuente y atención médica a los consumidores.',
      highLabel: 'Alerta Crítica (> 0.001 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Determinación directa de mercurio por técnica de vapor frío y trampa de oro en analizador Milestone.',
  },
  {
    id: 'cromo',
    category: 'metales',
    name: 'Cromo Total (Cr)',
    technicalName: 'Cromo total',
    symbol: 'Cr',
    icon: 'category',
    badgeEmoji: '🛡️',
    unit: 'mg/L',
    limit: '≤ 0.05 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3111 B (EAA de llama)',
    equipment: 'Espectrómetro ICP-MS o EAA con celda de llama acetileno-óxido nitroso',
    whatIs:
      'Es un metal presente en rocas ígneas y utilizado en procesos industriales de curtido de cueros, cromado y colorantes.',
    whatIsFor:
      'Permite vigilar posibles vertimientos industriales o lixiviados minerales que afecten ríos y manantiales.',
    whyImportant:
      'En concentraciones superiores a la norma, el cromo puede causar irritación y úlceras en el estómago, dermatitis alérgica y daño en el hígado y riñones.',
    interpretation: {
      normal: 'Nivel seguro que no representa riesgo digestivo, cutáneo ni hepático para los consumidores.',
      normalLabel: 'Dentro de Norma (≤ 0.05 mg/L)',
      high: 'Concentración tóxica que puede provocar úlceras digestivas y daño renal crónico; requiere filtración específica o cambio de fuente.',
      highLabel: 'Alerta Toxicológica (> 0.05 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Alineación óptica y análisis de masa/carga (m/z) para cromo total en ICP-MS.',
  },
  {
    id: 'niquel',
    category: 'metales',
    name: 'Níquel (Ni)',
    technicalName: 'Níquel total',
    symbol: 'Ni',
    icon: 'toll',
    badgeEmoji: '🪙',
    unit: 'mg/L',
    limit: '≤ 0.02 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo III (Parámetros Químicos Inorgánicos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3113 B (EAA horno grafito)',
    equipment: 'Espectrómetro ICP-MS calibrado con soluciones multielementales trazables NIST',
    whatIs:
      'Es un elemento metálico presente en depósitos geológicos y en el revestimiento niquelado de accesorios y griferías de fontanería.',
    whatIsFor:
      'Permite controlar el aporte de metales traza en el agua potable y verificar si las instalaciones domiciliarias sufren corrosión.',
    whyImportant:
      'Es un conocido agente causante de alergias y eccemas en la piel, y en concentraciones crónicas puede alterar el funcionamiento de los riñones.',
    interpretation: {
      normal: 'Concentración segura que no produce reacciones alérgicas ni acumulación tóxica en el organismo.',
      normalLabel: 'Dentro de Norma (≤ 0.02 mg/L)',
      high: 'Riesgo de hipersensibilidad alérgica cutánea y sobrecarga en los túbulos renales con el consumo continuo.',
      highLabel: 'Alerta Toxicológica (> 0.02 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Verificación de curva de calibración con patrón interno trazable para níquel en ICP-MS.',
  },
  {
    id: 'cobre',
    category: 'metales',
    name: 'Cobre (Cu)',
    technicalName: 'Cobre total',
    symbol: 'Cu',
    icon: 'circle',
    badgeEmoji: '🟠',
    unit: 'mg/L',
    limit: '≤ 2.0 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II y Anexo III',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3111 B (EAA de llama)',
    equipment: 'Espectrómetro de absorción atómica de llama de aire-acetileno o ICP-MS',
    whatIs:
      'Es un mineral esencial para el cuerpo humano que ingresa al agua por yacimientos cupríferos o por desgaste de tuberías domiciliarias de cobre.',
    whatIsFor:
      'Permite detectar si el agua es químicamente agresiva y está corroyendo las cañerías interiores de las viviendas.',
    whyImportant:
      'Aunque es un nutriente en cantidades microscópicas, en concentraciones elevadas da un sabor metálico astringente, tiñe de verde o azul lavamanos y produce cólicos y vómitos agudos.',
    interpretation: {
      normal: 'Nivel seguro y saludable. No produce manchas en artefactos ni molestias estomacales.',
      normalLabel: 'Dentro de Norma (≤ 2.0 mg/L)',
      high: 'Sabor amargo astringente, manchas azuladas o verdosas en sanitarios y riesgo de irritación gastrointestinal aguda (náuseas y diarreas).',
      highLabel: 'Valor Elevado (> 2.0 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Ensayo por espectrometría de llama para cuantificación de cobre en muestras acidificadas con HNO₃.',
  },
  {
    id: 'zinc',
    category: 'metales',
    name: 'Zinc (Zn)',
    technicalName: 'Zinc total',
    symbol: 'Zn',
    icon: 'panorama_fish_eye',
    badgeEmoji: '🔘',
    unit: 'mg/L',
    limit: '≤ 3.0 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II (Parámetros Organolépticos)',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3111 B (EAA de llama)',
    equipment: 'Espectrómetro de absorción atómica de llama o ICP-OES',
    whatIs:
      'Es un metal presente en vetas polimetálicas y ampliamente utilizado en el baño galvanizado que recubre tuberías de fierro para evitar el óxido.',
    whatIsFor:
      'Permite comprobar si las tuberías galvanizadas de la red están envejeciendo y disolviéndose en el agua potable.',
    whyImportant:
      'En cantidades normales es beneficioso para el sistema inmunológico; en exceso confiere un aspecto blanquecino o lechoso al agua hervida y un sabor amargo indeseable.',
    interpretation: {
      normal: 'Concentración equilibrada, agradable al paladar y segura para el consumo familiar.',
      normalLabel: 'Dentro de Norma (≤ 3.0 mg/L)',
      high: 'Aspecto lechoso o iridiscente en el agua, sabor astringente indeseable y posible irritación digestiva leve.',
      highLabel: 'Valor Elevado (> 3.0 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Aspiración de muestra acuosa en quemador de absorción atómica para lectura de zinc a 213.9 nm.',
  },
  {
    id: 'hierro_metal',
    category: 'metales',
    name: 'Hierro Total (Fe)',
    technicalName: 'Hierro total por espectrometría',
    symbol: 'Fe',
    icon: 'invert_colors',
    badgeEmoji: '🧲',
    unit: 'mg/L',
    limit: '≤ 0.3 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II y Anexo III',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3111 B (EAA de llama)',
    equipment: 'Espectrómetro de masas ICP-MS o Espectrofotómetro de Absorción Atómica',
    whatIs:
      'Metal disuelto cuantificado con alta precisión mediante espectrometría de masas para identificar fuentes subterráneas ferrosas o drenajes de roca.',
    whatIsFor:
      'Diferenciar entre aportes geológicos de hierro y procesos corrosivos severos en las líneas de conducción del sistema.',
    whyImportant:
      'Produce turbidez amarillenta-rojiza, sabor metálico rancio, manchas persistentes en prendas de vestir y obstrucción progresiva de válvulas y aspersores.',
    interpretation: {
      normal: 'Concentración inocua que no genera color ni sabor metálico en el agua potable.',
      normalLabel: 'Dentro de Norma (≤ 0.3 mg/L)',
      high: 'Coloración rojiza, sabor a herrumbre y formación de precipitados que colmatan tuberías y reservorios.',
      highLabel: 'Valor Elevado (> 0.3 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Lectura espectrométrica ICP-MS con corrección de interferencias isobáricas para hierro total.',
  },
  {
    id: 'manganeso_metal',
    category: 'metales',
    name: 'Manganeso (Mn)',
    technicalName: 'Manganeso total por espectrometría',
    symbol: 'Mn',
    icon: 'format_paint',
    badgeEmoji: '⬛',
    unit: 'mg/L',
    limit: '≤ 0.4 mg/L',
    normativeRef: 'D.S. N.° 031-2010-SA, Anexo II y Anexo III',
    method: 'EPA 200.8 (ICP-MS) / Standard Methods 3111 B',
    equipment: 'Espectrómetro de masas ICP-MS Agilent 7850',
    whatIs:
      'Elemento metálico evaluado a nivel de trazas que acompaña comúnmente a sulfuros y minerales de hierro en aguas de montaña.',
    whatIsFor:
      'Prevenir depósitos oscuros en redes de agua y vigilar la exposición prolongada acumulativa en comunidades rurales.',
    whyImportant:
      'Mancha de negro tuberías y loza sanitaria, genera sabor astringente amargo y en dosis muy elevadas crónicas puede tener implicancias neurológicas acumulativas.',
    interpretation: {
      normal: 'Niveles seguros sin sedimentos negros ni riesgo para la salud humana.',
      normalLabel: 'Dentro de Norma (≤ 0.4 mg/L)',
      high: 'Manchas negras difíciles de remover, sabor amargo y rechazo por la comunidad usuaria.',
      highLabel: 'Valor Elevado (> 0.4 mg/L)',
    },
    labImage: imgMetalsIcp,
    labImageCaption: 'Monitoreo de señal analítica en software de espectrometría para cuantificación de manganeso traza.',
  },
];

// Helper para buscar un parámetro por id o por nombre normalizado
export const findParameterDetail = (paramKey: string): WaterParameterDetail | undefined => {
  const normalized = paramKey
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return WATER_PARAMETERS_DETAIL_DATA.find((p) => {
    const idNorm = p.id.toLowerCase();
    const nameNorm = p.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const techNorm = p.technicalName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return (
      idNorm === normalized ||
      nameNorm === normalized ||
      nameNorm.startsWith(normalized) ||
      normalized.startsWith(nameNorm) ||
      techNorm.includes(normalized) ||
      (p.symbol && p.symbol.toLowerCase() === normalized)
    );
  });
};

export const getParametersByCategory = (
  category: 'fisicoquimico' | 'microbiologico' | 'metales'
): WaterParameterDetail[] => {
  return WATER_PARAMETERS_DETAIL_DATA.filter((p) => p.category === category);
};

import React, { useState } from 'react';

interface SafeWaterManualViewProps {
  onNavigateToDosage?: () => void;
  onNavigateToSystems?: () => void;
}

export const SafeWaterManualView: React.FC<SafeWaterManualViewProps> = ({
  onNavigateToDosage,
  onNavigateToSystems,
}) => {
  const [activeTopic, setActiveTopic] = useState<'hogar' | 'operador' | 'reservorio' | 'salud' | 'tabla'>('hogar');

  const handlePrintManual = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner Principal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#003d4c] via-[#00677d] to-[#00b4d8] text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#10e7b2] text-[11px] font-hud font-bold uppercase mb-3">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>GUÍAS SANITARIAS OFICIALES • D.S. N.° 031-2010-SA</span>
          </div>
          <h1 className="font-hud font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            MANUALES DE AYUDA PARA AGUA SEGURA Y SALUD
          </h1>
          <p className="text-cyan-100 text-[13px] sm:text-[14px] mt-2 leading-relaxed">
            Instrucciones técnicas y comunitarias para garantizar que el agua suministrada por la JASS sea apta para el consumo humano, previniendo diarreas infantiles, anemia y parásitos.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={handlePrintManual}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-cyan-50 text-[#004e5f] font-hud text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimir / Guardar en PDF</span>
            </button>
            {onNavigateToDosage && (
              <button
                type="button"
                onClick={onNavigateToDosage}
                className="px-4 py-2.5 rounded-xl bg-[#10e7b2]/20 hover:bg-[#10e7b2]/30 border border-[#10e7b2]/40 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#10e7b2]">calculate</span>
                <span>Ir al Calculador de Dosis</span>
              </button>
            )}
            {onNavigateToSystems && (
              <button
                type="button"
                onClick={onNavigateToSystems}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">water</span>
                <span>Monitorear Sistemas JASS</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[240px]">health_and_safety</span>
        </div>
      </div>

      {/* Selector de Guías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTopic('hogar')}
          className={`px-4 py-2.5 rounded-2xl font-hud text-[12px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTopic === 'hogar'
              ? 'bg-[#00677d] text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">family_restroom</span>
          <span>1. Agua Segura en el Hogar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopic('operador')}
          className={`px-4 py-2.5 rounded-2xl font-hud text-[12px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTopic === 'operador'
              ? 'bg-[#00677d] text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">engineering</span>
          <span>2. Manual del Operador JASS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopic('reservorio')}
          className={`px-4 py-2.5 rounded-2xl font-hud text-[12px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTopic === 'reservorio'
              ? 'bg-[#00677d] text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">clean_hands</span>
          <span>3. Limpieza y Desinfección</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopic('salud')}
          className={`px-4 py-2.5 rounded-2xl font-hud text-[12px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTopic === 'salud'
              ? 'bg-[#00677d] text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">child_care</span>
          <span>4. Salud & Prevención de Diarreas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTopic('tabla')}
          className={`px-4 py-2.5 rounded-2xl font-hud text-[12px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTopic === 'tabla'
              ? 'bg-[#00677d] text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">speed</span>
          <span>5. Tabla de Cloro y Rango Seguro</span>
        </button>
      </div>

      {/* Contenido Dinámico por Tema */}

      {/* 1. AGUA SEGURA EN EL HOGAR */}
      {activeTopic === 'hogar' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-[#00677d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <div>
                <h3 className="font-hud font-black text-lg text-[#003440]">
                  TRES MÉTODOS PARA OBTENER AGUA SEGURA EN CASA
                </h3>
                <p className="text-[12px] text-slate-500">
                  Recomendaciones prácticas para las familias de la comunidad rural
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#00677d] text-white flex items-center justify-center font-hud font-black text-[13px] mb-2">
                    1
                  </div>
                  <h4 className="font-hud font-bold text-[14px] text-[#003440] mb-1">
                    Hervido Correcto
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    Hacer hervir el agua a borbotones durante <strong>3 a 5 minutos completos</strong>. Luego dejar enfriar en la misma olla bien tapada sin introducir vasos o manos.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyan-200 text-[11px] text-[#00677d] font-bold">
                  ✓ Elimina bacterias, virus y parásitos al 100%.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-hud font-black text-[13px] mb-2">
                    2
                  </div>
                  <h4 className="font-hud font-bold text-[14px] text-teal-900 mb-1">
                    Cloración Casera
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    Agregar <strong>2 gotas de lejía tradicional (5%) por cada litro de agua</strong> (o 1 cucharadita para un balde de 20 litros). Agitar bien y <strong>esperar 30 minutos</strong> antes de consumir.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-teal-200 text-[11px] text-teal-800 font-bold">
                  ✓ Mantener el tiempo de contacto de 30 minutos.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-hud font-black text-[13px] mb-2">
                    3
                  </div>
                  <h4 className="font-hud font-bold text-[14px] text-emerald-900 mb-1">
                    Almacenamiento Seguro
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    Usar recipientes limpios, de <strong>boca angosta y con tapa hermética</strong>. Servir siempre mediante caño o vertido directo; nunca meter jarros ni pocillos al recipiente común.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] text-emerald-800 font-bold">
                  ✓ Lavar el recipiente con escobilla cada 3 días.
                </div>
              </div>
            </div>
          </div>

          {/* Reglas de Oro del Consumo */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200">
            <h4 className="font-hud font-bold text-[15px] text-amber-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <span>¡CUIDADO CON LA RECONTAMINACIÓN EN CASA!</span>
            </h4>
            <ul className="text-[12.5px] text-amber-900/90 space-y-1.5 list-disc pl-5">
              <li>El agua desinfectada de la red puede volverse peligrosa si se almacena en baldes destapados o sucios.</li>
              <li>Mantén los depósitos de agua alejados del piso, de corrales y de animales domésticos (perros, gallinas, cerdos).</li>
              <li>Lávate siempre las manos con agua y jabón antes de manipular el agua y antes de comer o dar de lactar.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 2. MANUAL DEL OPERADOR JASS */}
      {activeTopic === 'operador' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
              </div>
              <div>
                <h3 className="font-hud font-black text-lg text-[#003440]">
                  PASO A PASO: PROTOCOLO DE CLORACIÓN CONTINUA EN RESERVORIO
                </h3>
                <p className="text-[12px] text-slate-500">
                  Para operadores de JASS con sistemas por gravedad o bombeo
                </p>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#003440] font-hud block">Medición del Caudal de Ingreso (L/s)</strong>
                  <p className="text-slate-600 text-[12px] mt-0.5">
                    Mide el tiempo en segundos que tarda en llenarse un balde graduado de 10 o 20 litros en la llegada al reservorio. Repite 3 veces y saca el promedio.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#003440] font-hud block">Cálculo de la Cantidad de Hipoclorito de Calcio (65% – 70%)</strong>
                  <p className="text-slate-600 text-[12px] mt-0.5">
                    Utiliza la fórmula oficial: Peso de Cloro (g) = (Caudal × Dosis Deseada × Tiempo en segundos) / (% Cloro / 100). Puedes usar el módulo interactivo de Dosificación de esta aplicación.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#003440] font-hud block">Preparación de la Solución Madre (Sin sedimentos)</strong>
                  <p className="text-slate-600 text-[12px] mt-0.5">
                    Disuelve el cloro en un balde con agua limpia usando un agitador de madera o PVC. Deja reposar durante <strong>2 a 4 horas</strong> para que la cal o sedimentos decanten al fondo. Vierte únicamente el líquido clarificado al tanque dosificador.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-[#003440] font-hud block">Calibración del Goteo del Clorador</strong>
                  <p className="text-slate-600 text-[12px] mt-0.5">
                    Regula la válvula de paso o gotero para suministrar el volumen de solución madre calculado de manera uniforme durante los 7 a 15 días programados.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#00677d] text-white flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <strong className="text-[#003440] font-hud block">Control Diario con Comparador DPD-1</strong>
                  <p className="text-slate-600 text-[12px] mt-0.5">
                    Toma una muestra en la salida del reservorio y en la vivienda más lejana. El cloro residual libre debe estar entre <strong>0.50 y 2.00 mg/L</strong> (D.S. N.° 031-2010-SA).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LIMPIEZA Y DESINFECCIÓN */}
      {activeTopic === 'reservorio' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#00677d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">cleaning_services</span>
              </div>
              <div>
                <h3 className="font-hud font-black text-lg text-[#003440]">
                  GUÍA SEMESTRAL DE LIMPIEZA Y DESINFECCIÓN DE RESERVORIOS
                </h3>
                <p className="text-[12px] text-slate-500">
                  Obligatorio según SUNASS y MINSA al menos dos veces al año
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12.5px]">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-hud font-bold text-[13.5px] text-[#003440] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00677d]">brush</span>
                  <span>Fase 1: Lavado y Retiro de Lodos</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  1. Cerrar la válvula de entrada y abrir el desagüe hasta vaciar el agua acumulada.<br />
                  2. Escobillar paredes, piso y techo del reservorio únicamente con agua limpia y escobillón de cerdas duras. <strong>Nunca usar detergente</strong> ni jabón comercial.<br />
                  3. Enjuagar abundantemente y eliminar el agua sucia por la tubería de purga.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-hud font-bold text-[13.5px] text-[#003440] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00677d]">sanitizer</span>
                  <span>Fase 2: Desinfección de Choque (Shock)</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  1. Preparar una solución de choque concentrada con hipoclorito de calcio (150 a 200 g por cada 20 L de agua).<br />
                  2. Impregnar paredes y piso con la solución usando una brocha o rociador, protegiéndose con guantes, botas y mascarilla.<br />
                  3. Dejar actuar durante <strong>2 a 4 horas</strong>.<br />
                  4. Llenar el reservorio y realizar un purgado a la red antes de reanudar el consumo normal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SALUD Y PREVENCIÓN */}
      {activeTopic === 'salud' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
              </div>
              <div>
                <h3 className="font-hud font-black text-lg text-[#003440]">
                  IMPACTO EN LA SALUD INFANTIL Y PREVENCIÓN DE ENFERMEDADES
                </h3>
                <p className="text-[12px] text-slate-500">
                  Por qué la cloración es la intervención de salud pública más costo-efectiva
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px]">
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
                <span className="text-rose-700 font-hud font-bold text-[13px] block mb-1">
                  Enfermedades Diarreicas (EDA)
                </span>
                <p className="text-slate-700">
                  Causadas por bacterias coliformes y parásitos presentes en aguas no cloradas. La cloración adecuada reduce los episodios de diarrea aguda en niños menores de 5 años hasta en un <strong>45%</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <span className="text-amber-800 font-hud font-bold text-[13px] block mb-1">
                  Anemia y Desnutrición Crónica
                </span>
                <p className="text-slate-700">
                  Las infecciones estomacales recurrentes por agua contaminada dañan la mucosa intestinal e impiden la absorción del hierro y nutrientes, perpetuando la desnutrición infantil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200">
                <span className="text-[#00677d] font-hud font-bold text-[13px] block mb-1">
                  Desarrollo y Asistencia Escolar
                </span>
                <p className="text-slate-700">
                  Una comunidad con agua segura garantiza niños sanos, sin ausentismo escolar por infecciones gastrointestinales, y reduce los gastos médicos de las familias.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TABLA DE CLORO Y RANGOS SEGUROS */}
      {activeTopic === 'tabla' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-[#00677d] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">table_chart</span>
              </div>
              <div>
                <h3 className="font-hud font-black text-lg text-[#003440]">
                  SEMÁFORO DE CLORO RESIDUAL LIBRE (D.S. N.° 031-2010-SA)
                </h3>
                <p className="text-[12px] text-slate-500">
                  Valores guía para el comparador colorimétrico DPD-1 en red y reservorio
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#003440] font-hud font-bold text-[11px] uppercase border-b border-slate-200">
                    <th className="p-3">Rango de Cloro</th>
                    <th className="p-3">Semáforo</th>
                    <th className="p-3">Diagnóstico Sanitario</th>
                    <th className="p-3">Acción Inmediata Requerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-rose-50/40">
                    <td className="p-3 font-mono font-bold text-rose-700">&lt; 0.50 mg/L</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold">
                        🔴 Crítico / Alerta
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      Agua sin protección desinfectante. Alto riesgo de contaminación bacteriológica.
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      Aumentar el goteo del clorador de inmediato. Recomendar hervir el agua en casa temporalmente.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/40 hover:bg-emerald-50">
                    <td className="p-3 font-mono font-bold text-emerald-800">0.50 – 2.00 mg/L</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                        🟢 Conforme / Seguro
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      Rango reglamentario óptimo. Destruye bacterias patógenas y es totalmente segura para beber.
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      Mantener el flujo y goteo calibrado. Registrar el control en la bitácora diaria.
                    </td>
                  </tr>

                  <tr className="hover:bg-amber-50/40">
                    <td className="p-3 font-mono font-bold text-amber-700">&gt; 2.00 – 5.00 mg/L</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold">
                        🟡 Exceso Leve
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      Posible olor o sabor a cloro pronunciado que puede inducir rechazo en la población.
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      Disminuir ligeramente la válvula dosificadora del reservorio.
                    </td>
                  </tr>

                  <tr className="hover:bg-rose-50/40">
                    <td className="p-3 font-mono font-bold text-rose-800">&gt; 5.00 mg/L</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10.5px] font-bold">
                        🔴 Fuera de Límite
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      Supera el Límite Máximo Permisible (LMP). Puede provocar irritación gástrica.
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      Cerrar temporalmente el dosificador y purgar la línea de agua hasta normalizar.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

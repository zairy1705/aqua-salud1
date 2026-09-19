import React, { useState } from 'react';
import { WaterSample, WaterSystem } from '../../types';

interface NewSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSample: (newSample: WaterSample) => void;
  systems: WaterSystem[];
  existingSamplesCount: number;
}

const COMMON_SAMPLING_POINTS = [
  'Red de Distribución - Grifo Domiciliario (Extremo Terminal)',
  'Red de Distribución - Punto Intermedio (Zona Urbana/Rural)',
  'Red de Distribución - Primer Punto (Salida Inmediata)',
  'Salida de Reservorio (Agua Tratada Clorada)',
  'Entrada a Reservorio (Agua Cruda Pre-cloración)',
  'Captación / Manantial (Fuente Superficial/Subterránea)',
  'Cámara de Bombeo / Caseta de Cloración',
  'Grifo Comunitario / Pileta Pública',
  'Grifo Comedor Escolar / Puesto de Salud',
];

export const NewSampleModal: React.FC<NewSampleModalProps> = ({
  isOpen,
  onClose,
  onSaveSample,
  systems,
  existingSamplesCount,
}) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const nextNum = existingSamplesCount + 1;
  const autoCode = `LAB-${currentYear}-${String(nextNum).padStart(3, '0')}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().substring(0, 5);

  const [code, setCode] = useState(autoCode);
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTimeStr);
  const [selectedSystemId, setSelectedSystemId] = useState(systems[0]?.id || '');
  const [jassName, setJassName] = useState(() => {
    const sys = systems[0];
    return sys ? `JASS ${sys.name.split('-')[0].trim()}` : 'JASS El Molino';
  });
  const [origin, setOrigin] = useState(() => systems[0]?.location || 'Caserío Rural');
  const [point, setPoint] = useState(COMMON_SAMPLING_POINTS[0]);
  const [customPoint, setCustomPoint] = useState('');
  const [responsible, setResponsible] = useState('Ing. Carlos Mendoza (Operador JASS)');
  const [sampleType, setSampleType] = useState<'rutina' | 'vigilancia_sanitaria' | 'control_calidad' | 'emergencia'>('vigilancia_sanitaria');
  const [observations, setObservations] = useState('');

  // Initial Chain of custody fields
  const [sampleTemp, setSampleTemp] = useState('18.0');
  const [sealNumber, setSealNumber] = useState(`PREC-${Math.floor(7800 + Math.random() * 200)}`);
  const [flaskType, setFlaskType] = useState('Frasco estéril de polietileno con Tiosulfato de Sodio al 10% (500 mL)');

  const handleSystemChange = (sysId: string) => {
    setSelectedSystemId(sysId);
    const found = systems.find((s) => s.id === sysId);
    if (found) {
      setOrigin(found.location);
      setJassName(`JASS ${found.name.split('-')[0].trim()}`);
      if (found.operator) {
        setResponsible(found.operator);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !responsible.trim()) return;

    const selectedSys = systems.find((s) => s.id === selectedSystemId) || {
      id: 'sys-custom',
      name: 'Sistema Personalizado',
    };

    const finalPoint = point === 'otro' ? customPoint.trim() || 'Punto No Especificado' : point;

    const newSample: WaterSample = {
      id: `smp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      date,
      time,
      origin: origin.trim(),
      jassId: `jass-${selectedSys.id}`,
      jassName: jassName.trim(),
      systemId: selectedSys.id,
      systemName: selectedSys.name,
      point: finalPoint,
      responsible: responsible.trim(),
      observations: observations.trim() || 'Muestra recolectada conforme al protocolo técnico de muestreo de agua.',
      sampleType,
      chainOfCustody: {
        toma: {
          completed: true,
          date,
          time,
          responsible: responsible.trim(),
          locationOrEntity: finalPoint,
          temperatureC: parseFloat(sampleTemp) || 18.0,
          sealNumber: sealNumber.trim(),
          preservationNotes: flaskType,
          observations: 'Muestra tomada en campo con purga previa y preservación adecuada.',
        },
        transporte: {
          completed: true,
          date,
          time: time,
          responsible: 'Unidad de Transporte / Custodio ATM',
          locationOrEntity: 'En tránsito hacia el Laboratorio',
          temperatureC: 4.0,
          sealNumber: sealNumber.trim(),
          preservationNotes: 'Cooler isotérmico con refrigerante a ≤ 4°C.',
        },
        recepcion: {
          completed: true,
          date,
          time: time,
          responsible: 'Mesa de Entrada / Recepción Lab',
          locationOrEntity: 'Área de Registro de Muestras',
          temperatureC: 4.2,
          sealNumber: sealNumber.trim(),
          preservationNotes: 'Frasco íntegro verificado a la recepción.',
        },
        analisis: {
          completed: false,
          date: '',
          time: '',
          responsible: 'Por asignar al iniciar análisis',
        },
        validacion: {
          completed: false,
          date: '',
          time: '',
          responsible: 'Pendiente de Director Técnico',
        },
      },
      status: 'recibida', // Estado inicial estricto: Muestra recibida
      results: [], // Estrictamente vacío: NO inventar resultados
    };

    onSaveSample(newSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003440] via-[#004e5f] to-[#00677d] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-300 text-[22px]">science</span>
            </div>
            <div>
              <h3 className="font-hud font-extrabold text-[17px] sm:text-[19px] tracking-wide text-white flex items-center gap-2">
                REGISTRAR NUEVA MUESTRA
              </h3>
              <p className="text-[12px] text-cyan-200/90">
                AQUA-LAB • Ingreso y Apertura de Cadena de Custodia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-left">
          {/* Relación JASS -> Sistema -> Punto */}
          <div className="bg-cyan-50/60 border border-cyan-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-[#00677d]">
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <h4 className="font-hud font-bold text-[13px] uppercase tracking-wide">
                Conexión Territorial: JASS → Sistema Hídrico → Punto de Muestreo
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Sistema Hídrico Conectado *
                </label>
                <select
                  value={selectedSystemId}
                  onChange={(e) => handleSystemChange(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                >
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  JASS o Entidad Prestadora *
                </label>
                <input
                  type="text"
                  value={jassName}
                  onChange={(e) => setJassName(e.target.value)}
                  placeholder="Ej: JASS El Molino"
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Punto Específico de Muestreo *
                </label>
                <select
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-cyan-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {COMMON_SAMPLING_POINTS.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                  <option value="otro">Otro punto personalizado...</option>
                </select>

                {point === 'otro' && (
                  <input
                    type="text"
                    value={customPoint}
                    onChange={(e) => setCustomPoint(e.target.value)}
                    placeholder="Describa el punto exacto de muestreo..."
                    className="w-full mt-2 px-3 py-2 text-[13px] rounded-xl border border-amber-300 bg-amber-50/50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Datos de la Muestra */}
          <div>
            <h4 className="font-hud font-bold text-[13px] uppercase tracking-wide text-slate-800 mb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00b4d8] text-[18px]">label</span>
              Identificación y Registro de Campo
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Código de Muestra *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="LAB-2026-001"
                  className="w-full px-3 py-2 font-mono font-bold text-[14px] text-[#00677d] rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Fecha de Toma *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Hora de Toma *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Procedencia (Caserío / Distrito / Cuenca) *
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej: Sector 1, Cascas, Gran Chimú"
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Tipo de Muestreo
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value as any)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="vigilancia_sanitaria">Vigilancia Sanitaria</option>
                  <option value="rutina">Control de Rutina</option>
                  <option value="control_calidad">Control de Calidad ATM</option>
                  <option value="emergencia">Emergencia / Queja</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Responsable de la Toma de Muestra *
                </label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Nombre y cargo del tomador de muestra"
                  className="w-full px-3 py-2 text-[13px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Apertura de Cadena de Custodia */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="font-hud font-bold text-[12.5px] uppercase tracking-wide text-slate-800 mb-2.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">verified_user</span>
              Apertura de Cadena de Custodia (Etapas 1, 2 y 3)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase font-hud mb-1">
                  Temp. en Toma (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={sampleTemp}
                  onChange={(e) => setSampleTemp(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12.5px] rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase font-hud mb-1">
                  N.° de Precinto de Seguridad
                </label>
                <input
                  type="text"
                  value={sealNumber}
                  onChange={(e) => setSealNumber(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono text-[12.5px] rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase font-hud mb-1">
                  Conservación de Transporte
                </label>
                <div className="text-[12px] text-teal-800 font-semibold bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-teal-600">ac_unit</span>
                  <span>Cooler a ≤ 4.0 °C</span>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase font-hud mb-1">
                  Tipo de Frasco y Preservación
                </label>
                <input
                  type="text"
                  value={flaskType}
                  onChange={(e) => setFlaskType(e.target.value)}
                  className="w-full px-3 py-1.5 text-[12px] rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
              Observaciones de Campo
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Detalles climatológicos, olor, turbidez visible, tiempo de purga o eventos relevantes..."
              className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-[11.5px] text-amber-900 flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">info</span>
            <span>
              <strong>Regla de Integridad AQUA-LAB:</strong> La muestra ingresará con estado <em>"Muestra recibida"</em> y los resultados analíticos permanecerán vacíos hasta que los analistas realicen los ensayos correspondientes. No se inventan resultados.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-hud text-[12px] font-bold uppercase hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#009bb8] hover:to-[#0fd1a1] text-[#002b1f] font-hud text-[12px] font-extrabold uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Registrar Muestra en AQUA-LAB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

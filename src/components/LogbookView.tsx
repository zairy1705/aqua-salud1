import React, { useState } from 'react';
import { 
  ClipboardList, 
  Download, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  X,
  FileSpreadsheet,
  Droplet
} from 'lucide-react';
import { SamplingRecord, WaterSystem } from '../types';
import { evaluateChlorineNormative } from '../utils/waterMath';

interface LogbookViewProps {
  records: SamplingRecord[];
  systems: WaterSystem[];
  onAddRecord: (record: Omit<SamplingRecord, 'id' | 'timestamp'>) => void;
  isNewRecordModalOpen: boolean;
  setIsNewRecordModalOpen: (open: boolean) => void;
  prefillSystemId?: string;
}

export const LogbookView: React.FC<LogbookViewProps> = ({
  records,
  systems,
  onAddRecord,
  isNewRecordModalOpen,
  setIsNewRecordModalOpen,
  prefillSystemId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'compliant' | 'low' | 'excess'>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Record Form State
  const [selectedSystemId, setSelectedSystemId] = useState(prefillSystemId || systems[0]?.id || '');
  const [point, setPoint] = useState('Grifo de usuario extremo de red');
  const [freeChlorine, setFreeChlorine] = useState<number>(1.1);
  const [phVal, setPhVal] = useState<number>(7.4);
  const [turbidity, setTurbidity] = useState<number>(0.6);
  const [tempVal, setTempVal] = useState<number>(19.5);
  const [operatorName, setOperatorName] = useState(systems[0]?.operator || 'Téc. Operador Sanitario');
  const [obsText, setObsText] = useState('');

  // Filtering
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.measurementPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.operator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Fecha',
      'Hora',
      'Sistema / Tanque',
      'Punto de Muestreo',
      'Cloro Residual Libre (mg/L)',
      'pH',
      'Turbiedad (NTU)',
      'Temperatura (C)',
      'Estado Normativo',
      'Operador',
      'Observaciones',
    ];

    const rows = records.map((r) => [
      r.id,
      r.dateStr,
      r.timeStr,
      `"${r.systemName.replace(/"/g, '""')}"`,
      `"${r.measurementPoint.replace(/"/g, '""')}"`,
      r.freeChlorinePpm,
      r.ph,
      r.turbidityNtu,
      r.temperatureC,
      r.status,
      `"${r.operator.replace(/"/g, '""')}"`,
      `"${(r.observations || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bitacora_Cloragua_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluation = evaluateChlorineNormative(freeChlorine);
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

    const sysObj = systems.find((s) => s.id === selectedSystemId);

    onAddRecord({
      dateStr,
      timeStr,
      systemId: selectedSystemId,
      systemName: sysObj ? sysObj.name : 'Sistema de Agua Potable',
      measurementPoint: point.trim() || 'Punto de Muestreo en Red',
      freeChlorinePpm: Number(freeChlorine),
      ph: Number(phVal),
      turbidityNtu: Number(turbidity),
      temperatureC: Number(tempVal),
      status: evaluation.status,
      operator: operatorName.trim() || 'Inspector de Calidad',
      observations: obsText.trim() || evaluation.verdictText,
      correctiveAction: evaluation.status !== 'compliant' ? evaluation.recommendation : undefined,
    });

    setIsNewRecordModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-100 text-teal-800 border border-teal-200">
              Vigilancia Sanitaria
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Registro Oficial D.S. N.° 031-2010-SA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Bitácora de Control y Calidad del Agua
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Historial cronológico de muestras de Cloro Residual Libre, pH y Turbiedad para cumplimiento ante MINSA, DIGESA y fiscalizaciones de SUNASS.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            id="btn-print-act"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            <span>Acta Oficial</span>
          </button>
          <button
            id="btn-new-record"
            onClick={() => setIsNewRecordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Medición</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por punto, sistema u operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-teal-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `Todos (${records.length})` },
            { id: 'compliant', label: `Conforme (${records.filter((r) => r.status === 'compliant').length})` },
            { id: 'low', label: `Bajo Cloro (${records.filter((r) => r.status === 'low').length})` },
            { id: 'excess', label: `Exceso (${records.filter((r) => r.status === 'excess').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === f.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Fecha / Hora</th>
                <th className="px-4 py-3">Punto de Muestreo / Sistema</th>
                <th className="px-4 py-3 text-center">Cloro Libre</th>
                <th className="px-4 py-3 text-center">pH</th>
                <th className="px-4 py-3 text-center">Turbiedad</th>
                <th className="px-4 py-3 text-center">Temp.</th>
                <th className="px-4 py-3">Estado Normativo</th>
                <th className="px-4 py-3">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron registros de muestreo con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{rec.dateStr}</span>
                        <span className="text-[10px] text-slate-400">{rec.timeStr}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block leading-tight">{rec.systemName}</span>
                        <span className="text-[11px] text-slate-500">{rec.measurementPoint}</span>
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`inline-block font-mono font-extrabold text-sm px-2 py-0.5 rounded-md ${
                          rec.status === 'compliant'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : rec.status === 'low'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {rec.freeChlorinePpm.toFixed(2)} ppm
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-medium whitespace-nowrap">
                        {rec.ph.toFixed(1)}
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-medium whitespace-nowrap">
                        {rec.turbidityNtu.toFixed(1)} NTU
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-slate-500 whitespace-nowrap">
                        {rec.temperatureC.toFixed(1)} °C
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === 'compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'low'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.status === 'compliant' ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>CONFORME</span>
                            </>
                          ) : rec.status === 'low' ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>BAJO CLORO</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>EXCESO</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-medium">
                        {rec.operator}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for New Field Sampling Record */}
      {isNewRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-600" />
                Registrar Medición de Calidad de Agua
              </h2>
              <button
                onClick={() => setIsNewRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sistema o Reservorio:
                </label>
                <select
                  value={selectedSystemId}
                  onChange={(e) => setSelectedSystemId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium bg-white"
                >
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Punto Específico de Muestreo:
                </label>
                <input
                  type="text"
                  required
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  placeholder="ej. Grifo domiciliario extremo de red - Manzana C Lote 4"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium"
                />
              </div>

              {/* Physicochemical Readings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-teal-700 mb-1">
                    Cloro Libre (ppm)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={freeChlorine}
                    onChange={(e) => setFreeChlorine(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-teal-300 bg-white font-extrabold text-teal-900"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">LMP: 0.5 - 2.0</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    pH
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="4"
                    max="10"
                    value={phVal}
                    onChange={(e) => setPhVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-slate-300 bg-white font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">LMP: 6.5 - 8.5</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Turbiedad (NTU)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={turbidity}
                    onChange={(e) => setTurbidity(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-slate-300 bg-white font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">LMP: &lt; 5.0</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Temp. (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="40"
                    value={tempVal}
                    onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-slate-300 bg-white font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Referencia</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsable del Muestreo / Inspector:
                </label>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones / Hallazgos:
                </label>
                <textarea
                  rows={2}
                  value={obsText}
                  onChange={(e) => setObsText(e.target.value)}
                  placeholder="ej. Muestra tomada según protocolo. Coloración DPD uniforme sin interferencia aparente."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Guardar en Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Official Printable Sanitary Report (Acta) */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header of Certificate */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                  REPÚBLICA DEL PERÚ — SISTEMA DE VIGILANCIA SANITARIA
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mt-0.5">
                  Acta de Control y Monitoreo de Cloro Residual Libre
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Conforme al Decreto Supremo N.° 031-2010-SA (Reglamento de Calidad del Agua para Consumo Humano)
                </p>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Act Content */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Prestador / Entidad:</span>
                  <strong className="text-slate-900">JASS / EPS Prestadora de Servicio</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Fecha de Emisión:</span>
                  <strong className="text-slate-900">{new Date().toLocaleDateString('es-PE')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Total Muestras Registradas:</span>
                  <strong className="text-slate-900">{records.length} puntos analizados</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Índice de Conformidad:</span>
                  <strong className="text-emerald-700">
                    {((records.filter((r) => r.status === 'compliant').length / records.length) * 100).toFixed(1)}% Apto
                  </strong>
                </div>
              </div>

              {/* Sample Summary Table */}
              <table className="w-full border border-slate-200 text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 border">Fecha</th>
                    <th className="p-2 border">Punto de Muestreo</th>
                    <th className="p-2 border text-center">Cloro Libre</th>
                    <th className="p-2 border text-center">pH</th>
                    <th className="p-2 border">Veredicto Sanitario</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 border">{r.dateStr}</td>
                      <td className="p-2 border font-medium">{r.measurementPoint}</td>
                      <td className="p-2 border text-center font-mono font-bold">
                        {r.freeChlorinePpm.toFixed(2)} mg/L
                      </td>
                      <td className="p-2 border text-center font-mono">{r.ph.toFixed(1)}</td>
                      <td className="p-2 border font-bold">
                        {r.status === 'compliant' ? 'CONFORME' : 'NO CONFORME'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Legal Note & Signatures */}
              <p className="text-[10px] text-slate-500 leading-relaxed italic pt-2">
                "El presente documento da fe de las mediciones de Cloro Residual Libre efectuadas in situ mediante método colorimétrico DPD N° 1, en cumplimiento del Art. 62 del D.S. N.° 031-2010-SA."
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block text-slate-900">Operador Técnico / Inspector</span>
                  <span className="text-[10px] text-slate-500">Firma y Sello</span>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <span className="font-bold block text-slate-900">Responsable de Calidad Sanitaria</span>
                  <span className="text-[10px] text-slate-500">Visto Bueno DIGESA / JASS</span>
                </div>
              </div>
            </div>

            {/* Print Action button */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Documento</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { WaterSample } from '../../types';
import { logAuditEvent } from '../../data/auditStore';

interface ValidateSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: WaterSample;
  onConfirmValidation: (
    sampleId: string,
    validatorName: string,
    validatorRole: string,
    remarks: string,
    authCode: string
  ) => void;
}

const AUTHORIZED_VALIDATORS = [
  {
    name: 'Blgo. Roberto Valdivia',
    role: 'Director Técnico de Laboratorio (Reg. CBP 4512)',
    code: 'DIR-TEC-VAL-2026-CBP4512',
  },
  {
    name: 'Ing. Zaira Salvador Amaya',
    role: 'Administrador/a del Sistema Hídrico y Calidad',
    code: 'ADM-SAN-ZSA-2026',
  },
  {
    name: 'Dra. Elena Ramos',
    role: 'Jefa de Aseguramiento de la Calidad (QA/QC)',
    code: 'QA-QC-ELR-2026',
  },
];

export const ValidateSampleModal: React.FC<ValidateSampleModalProps> = ({
  isOpen,
  onClose,
  sample,
  onConfirmValidation,
}) => {
  if (!isOpen) return null;

  const [selectedValidatorIndex, setSelectedValidatorIndex] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [authCode, setAuthCode] = useState(AUTHORIZED_VALIDATORS[0].code);
  const [remarks, setRemarks] = useState(
    'Ensayos analíticos revisados conforme a los protocolos del D.S. N.° 031-2010-SA. Control de blancos y duplicados analíticos conformes.'
  );
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleValidatorChange = (idx: number) => {
    setSelectedValidatorIndex(idx);
    if (idx < AUTHORIZED_VALIDATORS.length) {
      setAuthCode(AUTHORIZED_VALIDATORS[idx].code);
    } else {
      setAuthCode('');
    }
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedCheck) {
      setErrorMessage('Debe confirmar la declaración jurada de validación técnica.');
      return;
    }

    let finalName = '';
    let finalRole = '';

    if (selectedValidatorIndex < AUTHORIZED_VALIDATORS.length) {
      finalName = AUTHORIZED_VALIDATORS[selectedValidatorIndex].name;
      finalRole = AUTHORIZED_VALIDATORS[selectedValidatorIndex].role;
    } else {
      finalName = customName.trim();
      finalRole = customRole.trim();
    }

    if (!finalName || !finalRole) {
      setErrorMessage('Por favor ingrese el nombre y cargo del validador autorizado.');
      return;
    }

    if (!authCode.trim()) {
      setErrorMessage('Por favor ingrese o verifique el código de firma digital.');
      return;
    }

    // Official Audit Trail Registration
    logAuditEvent({
      action: 'VALIDACION',
      entityType: 'MUESTRA_LAB',
      entityId: sample.id,
      entityTitle: `Muestra ${sample.code}: ${sample.jassName}`,
      authorName: finalName,
      authorRole: finalRole,
      authorTier: 'SUPERVISOR',
      previousState: `Estado: ${sample.status}`,
      newState: 'Estado: validada',
      details: `Validación técnica oficial bajo D.S. N.° 031-2010-SA con firma ${authCode.trim()}. Observaciones: ${remarks.trim()}`,
    }).catch((err) => console.warn('Audit error:', err));

    onConfirmValidation(sample.id, finalName, finalRole, remarks.trim(), authCode.trim());
    onClose();
  };

  const hasNonCompliantResult = sample.results.some((r) => r.compliant === false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto text-left">
      <div className="bg-white rounded-3xl shadow-2xl border border-teal-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-[#004e5f] to-[#00677d] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-300 text-[22px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-hud font-extrabold text-[16px] sm:text-[18px] text-white">
                VALIDACIÓN TÉCNICA AUTORIZADA
              </h3>
              <p className="text-[12px] text-teal-200">
                AQUA-LAB • Certificación de Ensayos Analíticos
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

        {/* Content */}
        <form onSubmit={handleValidate} className="p-6 overflow-y-auto space-y-4">
          {/* Sample context card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2 mb-2">
              <span className="font-hud font-bold text-[13px] text-slate-800">
                MUESTRA: <span className="font-mono text-[#00677d]">{sample.code}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-hud font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Pendiente de Validación
              </span>
            </div>

            <div className="text-[12px] text-slate-600 space-y-1">
              <p>
                <strong>JASS:</strong> {sample.jassName} • <strong>Sistema:</strong> {sample.systemName}
              </p>
              <p>
                <strong>Punto:</strong> {sample.point}
              </p>
              <p>
                <strong>Ensayos a validar:</strong> {sample.results.length} parámetros analíticos registrados.
              </p>
            </div>

            {hasNonCompliantResult && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11.5px] flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">warning</span>
                <span>
                  <strong>Atención:</strong> Uno o más parámetros exceden los Límites Máximos Permisibles (D.S. N.° 031-2010-SA). El dictamen técnico debe reflejar esta condición de no conformidad sanitaria.
                </span>
              </div>
            )}
          </div>

          {/* Authorized Validator Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1.5">
              Seleccione Profesional Autorizado *
            </label>
            <div className="space-y-2">
              {AUTHORIZED_VALIDATORS.map((val, idx) => (
                <label
                  key={val.name}
                  onClick={() => handleValidatorChange(idx)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedValidatorIndex === idx
                      ? 'bg-teal-50/80 border-teal-500 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="validator"
                    checked={selectedValidatorIndex === idx}
                    onChange={() => handleValidatorChange(idx)}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="flex-1 text-[12.5px]">
                    <div className="font-bold text-slate-800">{val.name}</div>
                    <div className="text-[11.5px] text-slate-500">{val.role}</div>
                    <div className="text-[10.5px] font-mono text-teal-700 mt-0.5">Firma: {val.code}</div>
                  </div>
                </label>
              ))}

              <label
                onClick={() => handleValidatorChange(AUTHORIZED_VALIDATORS.length)}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedValidatorIndex === AUTHORIZED_VALIDATORS.length
                    ? 'bg-teal-50/80 border-teal-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="validator"
                  checked={selectedValidatorIndex === AUTHORIZED_VALIDATORS.length}
                  onChange={() => handleValidatorChange(AUTHORIZED_VALIDATORS.length)}
                  className="mt-1 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex-1 text-[12.5px]">
                  <div className="font-bold text-slate-800">Otro Profesional Autorizado (Personalizado)</div>
                  <div className="text-[11.5px] text-slate-500">Ingresar nombre, colegiatura y cargo oficial</div>
                </div>
              </label>
            </div>
          </div>

          {selectedValidatorIndex === AUTHORIZED_VALIDATORS.length && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej: Ing. Jorge Paredes"
                  className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
                  Cargo y Colegiatura *
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Ej: Director Técnico (Reg. CIP 89123)"
                  className="w-full px-3 py-2 text-[12.5px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Validation code */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
              Código / Credencial de Autorización Digital *
            </label>
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Código de firma digital"
              className="w-full px-3 py-2 font-mono text-[13px] rounded-xl border border-teal-300 bg-teal-50/40 text-teal-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          {/* Dictamen / Remarks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase font-hud mb-1">
              Dictamen y Observaciones de Validación Técnica
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 text-[12px] rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Legal affirmation check */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedCheck}
                onChange={(e) => {
                  setConfirmedCheck(e.target.checked);
                  if (e.target.checked) setErrorMessage('');
                }}
                className="mt-0.5 text-teal-600 focus:ring-teal-500 rounded"
              />
              <span className="text-[12px] text-teal-950 leading-snug">
                Doy fe como profesional autorizado de que los ensayos analíticos registrados fueron revisados, verificando la cadena de custodia y los controles de aseguramiento de la calidad.
              </span>
            </label>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-hud text-[12px] font-bold uppercase hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-[#10e7b2] hover:from-teal-800 hover:to-[#0fd1a1] text-white font-hud text-[12px] font-extrabold uppercase shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>Validar Muestra Formalmente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

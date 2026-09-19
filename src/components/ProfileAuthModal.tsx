import React, { useState, useEffect } from 'react';
import { OperatorProfile, UserRoleTier } from '../types';
import { hashPassword } from '../utils/cryptoSecurity';
import { ROLE_TIER_INFO } from '../utils/rbac';
import { logAuditEvent } from '../data/auditStore';

interface ProfileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'switch';
  profiles: OperatorProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: OperatorProfile) => void;
  onAddProfile: (newProfile: OperatorProfile) => void;
  onSaveProfile?: (name: string, role: string) => void;
}

export const ProfileAuthModal: React.FC<ProfileAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onSaveProfile,
}) => {
  const [mode, setMode] = useState<'register' | 'switch'>(initialMode);

  // Form states for new profile registration
  const [name, setName] = useState('Ing.Zaira Salvador Amaya');
  const [email, setEmail] = useState('operador@cloragua.pe');
  const [roleTier, setRoleTier] = useState<UserRoleTier>('ADMIN');
  const [role, setRole] = useState('Administrador de Sistema Hídrico');
  const [badge, setBadge] = useState('ADMINISTRADOR DE SISTEMA HÍDRICO');
  const [guardianTitle, setGuardianTitle] = useState('Guardián Potable');
  const [community, setCommunity] = useState('JASS El molino, Cascas, La Libertad');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingrese el nombre del operador.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Cryptographic hash: NEVER store plain text password!
      const secureHash = await hashPassword(password || 'operador2026');

      const newProfile: OperatorProfile = {
        id: `prof-${Date.now()}`,
        name: name.trim(),
        email: email.trim() || 'operador@cloragua.pe',
        roleTier,
        role: role.trim() || ROLE_TIER_INFO[roleTier].label,
        badge: (badge.trim() || ROLE_TIER_INFO[roleTier].label).toUpperCase(),
        guardianTitle: guardianTitle.trim() || 'Guardián Potable',
        community: community.trim() || 'JASS Comunitaria',
        passwordHash: secureHash, // SHA-256 with salt
        avatarLetter: name.trim().charAt(0).toUpperCase() || 'I',
      };

      onAddProfile(newProfile);
      onSelectProfile(newProfile);

      if (onSaveProfile) {
        onSaveProfile(newProfile.name, newProfile.role);
      }

      // Log official audit event
      await logAuditEvent({
        action: 'CREACION',
        entityType: 'PERFIL_OPERADOR',
        entityId: newProfile.id,
        entityTitle: `Alta de Perfil: ${newProfile.name}`,
        authorName: newProfile.name,
        authorRole: newProfile.role,
        authorTier: newProfile.roleTier,
        details: `Registro de nuevo operador con nivel de privilegios RBAC: ${newProfile.roleTier}. Credencial cifrada con SHA-256.`,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg('Error al registrar perfil con cifrado seguro.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAccount = async (profile: OperatorProfile) => {
    onSelectProfile(profile);
    if (onSaveProfile) {
      onSaveProfile(profile.name, profile.role);
    }

    // Audit log account switch
    await logAuditEvent({
      action: 'AUTENTICACION',
      entityType: 'PERFIL_OPERADOR',
      entityId: profile.id,
      entityTitle: `Cambio de Sesión: ${profile.name}`,
      authorName: profile.name,
      authorRole: profile.role,
      authorTier: profile.roleTier || 'OPERADOR',
      details: `Sesión de trabajo transferida a ${profile.name} (${profile.role}). Nivel de acceso: ${profile.roleTier || 'OPERADOR'}.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00677d] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">
                {mode === 'register' ? 'person_add' : 'switch_account'}
              </span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[16px] text-white flex items-center gap-2">
                <span>{mode === 'register' ? 'Registrar Nuevo Perfil' : 'Cambiar de Cuenta'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cifrado SHA-256
                </span>
              </h3>
              <p className="text-[11.5px] text-cyan-300/80">
                Sistema Oficial CLORAGUA • Control de Acceso RBAC
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center border-b border-cyan-500/20 bg-[#00171d] px-4 pt-2">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`pb-2.5 px-4 font-hud text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              mode === 'register'
                ? 'border-[#10e7b2] text-[#10e7b2]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            + Registrar Perfil
          </button>
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`pb-2.5 px-4 font-hud text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              mode === 'switch'
                ? 'border-[#00b4d8] text-[#00b4d8]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Cuentas Registradas ({profiles.length})
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-hud flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5 text-[13px]">
              {/* Role Tier Selector (RBAC) */}
              <div>
                <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                  Nivel de Privilegios RBAC (Autorización por Roles):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ADMIN', 'SUPERVISOR', 'OPERADOR', 'AUDITOR'] as UserRoleTier[]).map((tier) => {
                    const info = ROLE_TIER_INFO[tier];
                    const isSelected = roleTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setRoleTier(tier);
                          setRole(info.label);
                          setBadge(info.label.toUpperCase());
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-900/60 border-[#10e7b2] shadow-sm'
                            : 'bg-[#00141a] border-cyan-500/30 hover:border-cyan-400/60 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-[17px] text-[#10e7b2]">
                            {info.icon}
                          </span>
                          <span className="font-hud font-bold text-[11.5px] text-white">
                            {tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-200/70 leading-tight">
                          {info.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-cyan-300/80 mt-1.5 italic font-sans">
                  {ROLE_TIER_INFO[roleTier].description}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                  Nombre Completo del Operador / Ingeniero:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ing. Zaira Salvador Amaya"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-white font-hud text-[13px] focus:outline-none focus:border-[#10e7b2]"
                    required
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-cyan-400/50 text-[18px]">
                    person
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Correo Electrónico Oficial:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operador@cloragua.pe"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1 flex items-center justify-between">
                    <span>Contraseña / PIN de Firma:</span>
                    <span className="text-[9.5px] text-[#10e7b2]">Hash SHA-256</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Cargo o Especialidad:
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Administrador de Sistema Hídrico"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Distintivo / Badge Superior:
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="ADMINISTRADOR DE SISTEMA HÍDRICO"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] uppercase focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    Título de Vigilancia:
                  </label>
                  <select
                    value={guardianTitle}
                    onChange={(e) => setGuardianTitle(e.target.value)}
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12px] focus:outline-none focus:border-[#10e7b2]"
                  >
                    <option value="Guardián Potable">Guardián Potable</option>
                    <option value="Vigilante Sanitario">Vigilante Sanitario</option>
                    <option value="Operador Comunitario">Operador Comunitario</option>
                    <option value="Auditor de Calidad">Auditor de Calidad</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-hud font-bold text-cyan-200 block mb-1">
                    JASS / Organización / Red:
                  </label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    placeholder="JASS El molino, Cascas, La Libertad"
                    className="w-full bg-[#00141a] border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-hud text-[12.5px] focus:outline-none focus:border-[#10e7b2]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#10e7b2] shrink-0">
                  shield
                </span>
                <span>
                  <strong>Aviso de Seguridad:</strong> Las credenciales son hasheadas criptográficamente en el cliente antes de ser almacenadas. Ninguna contraseña es guardada en texto plano ni transmitida sin protección.
                </span>
              </div>

              <div className="mt-2 pt-3 border-t border-cyan-500/20 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-hud text-[12px] font-bold uppercase transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:opacity-95 text-[#002116] font-hud text-[12px] font-extrabold uppercase tracking-wide shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>{isProcessing ? 'Cifrando...' : 'Registrar y Activar'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-cyan-200/80 mb-1">
                Seleccione el perfil para iniciar sesión con su respectivo nivel de autorización RBAC:
              </p>

              <div className="divide-y divide-cyan-500/20">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  const initial = p.avatarLetter || p.name.charAt(0).toUpperCase();
                  const tier = p.roleTier || 'OPERADOR';
                  const tierInfo = ROLE_TIER_INFO[tier];

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectAccount(p)}
                      className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#002833] border-2 border-[#10e7b2] shadow-sm'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#007791] text-white flex items-center justify-center font-hud text-lg font-black shrink-0">
                          {initial}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-hud font-bold text-[13.5px] text-white truncate">
                              {p.name}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-hud font-black uppercase border ${tierInfo.badgeColor}`}>
                              {tier}
                            </span>
                          </div>
                          <span className="text-[11.5px] text-cyan-300/80 truncate mt-0.5">
                            {p.role} • {p.community}
                          </span>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="px-3 py-1 rounded-full bg-[#10e7b2]/20 border border-[#10e7b2] text-[#10e7b2] font-hud text-[10.5px] font-extrabold uppercase shrink-0">
                          ACTIVO
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 rounded-full bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 font-hud text-[10.5px] font-bold uppercase transition-colors shrink-0"
                        >
                          Elegir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-cyan-400/50 hover:border-cyan-400 text-cyan-300 font-hud text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Registrar Otro Perfil</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

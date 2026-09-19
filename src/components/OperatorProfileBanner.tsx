import React from 'react';
import { OperatorProfile } from '../types';

interface OperatorProfileBannerProps {
  profile: OperatorProfile;
  onOpenRegisterProfile: () => void;
  onOpenSwitchAccount: () => void;
}

export const OperatorProfileBanner: React.FC<OperatorProfileBannerProps> = ({
  profile,
  onOpenRegisterProfile,
  onOpenSwitchAccount,
}) => {
  const initial = profile.avatarLetter || profile.name.charAt(0).toUpperCase() || 'I';

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,103,125,0.06)] border border-[#bcc9ce]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
      {/* Operator Info (Left) */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#007791] text-white flex items-center justify-center font-hud text-2xl font-black shrink-0 shadow-sm select-none">
          {initial}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h2 className="font-hud font-extrabold text-[15px] sm:text-[17px] text-[#151d22] tracking-tight truncate">
              {profile.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#d7f9ef] border border-[#10e7b2]/70 text-[#006c51] font-hud text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wide shrink-0">
              {profile.badge || 'ADMINISTRADOR DE SISTEMA HÍDRICO'}
            </span>
            {profile.guardianTitle && (
              <span className="text-[11.5px] sm:text-[12px] font-hud font-bold text-[#00677d] shrink-0">
                {profile.guardianTitle}
              </span>
            )}
          </div>

          <div className="text-[11.5px] sm:text-[12px] text-[#5f747e] mt-0.5 flex items-center flex-wrap gap-1.5 truncate">
            <span className="truncate">{profile.email || 'operador@cloragua.pe'}</span>
            <span className="text-slate-300 font-bold">•</span>
            <span className="truncate">{profile.community || 'JASS El molino, Cascas, La Libertad'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={onOpenRegisterProfile}
          className="flex-1 sm:flex-none bg-gradient-to-r from-[#007791] to-[#006277] hover:from-[#00b4d8] hover:to-[#10e7b2] text-white hover:text-[#002116] font-hud font-extrabold text-[11.5px] sm:text-[12px] uppercase tracking-wide px-4 py-2.5 rounded-xl sm:rounded-full flex items-center justify-center gap-2 shadow-xs hover:shadow-[0_4px_18px_rgba(0,180,216,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
          title="Registrar nuevo perfil de operador o técnico con correo y contraseña"
        >
          <span className="material-symbols-outlined text-[19px]">person_add</span>
          <span>REGISTRAR PERFIL</span>
        </button>

        <button
          type="button"
          onClick={onOpenSwitchAccount}
          className="flex-1 sm:flex-none bg-white hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 text-[#007791] hover:text-[#005a6e] border border-[#007791]/35 hover:border-[#00b4d8] font-hud font-bold text-[11.5px] sm:text-[12px] px-4 py-2.5 rounded-xl sm:rounded-full flex items-center justify-center gap-2 shadow-xs hover:shadow-[0_2px_12px_rgba(0,180,216,0.2)] active:scale-95 transition-all duration-300 cursor-pointer"
          title="Cambiar o alternar entre cuentas de operador registradas"
        >
          <span className="material-symbols-outlined text-[19px]">contact_page</span>
          <span>Cambiar Cuenta</span>
        </button>
      </div>
    </div>
  );
};

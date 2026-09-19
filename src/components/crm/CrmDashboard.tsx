import React from 'react';
import { CrmQuoteItem } from '../../types';
import { calculateCrmIndicators, CRM_STATUS_CONFIG } from '../../data/crmStore';

interface CrmDashboardProps {
  quotes: CrmQuoteItem[];
  onSelectStatusFilter?: (status: string) => void;
  onOpenNewQuoteModal: () => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  quotes,
  onSelectStatusFilter,
  onOpenNewQuoteModal,
}) => {
  const indicators = calculateCrmIndicators(quotes);

  const statusCounts = {
    Nueva: quotes.filter((q) => q.status === 'Nueva').length,
    'En revisión': quotes.filter((q) => q.status === 'En revisión').length,
    Contactada: quotes.filter((q) => q.status === 'Contactada').length,
    'Cotización enviada': quotes.filter((q) => q.status === 'Cotización enviada').length,
    'En negociación': quotes.filter((q) => q.status === 'En negociación').length,
    Aceptada: quotes.filter((q) => q.status === 'Aceptada').length,
    Rechazada: quotes.filter((q) => q.status === 'Rechazada').length,
    Cerrada: quotes.filter((q) => q.status === 'Cerrada').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action */}
      <div className="bg-gradient-to-r from-[#00677d] via-[#007a8c] to-[#00b4d8] rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">handshake</span>
            <span>CRM COMERCIAL & COTIZACIONES • FASE 10</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Panel de Gestión Comercial y Clientes
          </h2>
          <p className="text-xs sm:text-sm text-cyan-50 mt-1 max-w-2xl">
            Trazabilidad completa desde la recepción en <strong>aqua.salud.lab@gmail.com</strong> hasta el
            cierre, emisión de cotizaciones y contacto WhatsApp oficial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewQuoteModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#00677d] hover:bg-cyan-50 text-xs sm:text-sm font-bold shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Registrar Solicitud</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Solicitudes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Solicitudes</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 material-symbols-outlined text-lg">
              inbox
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {indicators.solicitudes}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Total registradas</span>
          </div>
        </div>

        {/* 2. Cotizaciones Enviadas / En Proceso */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cotizaciones</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 material-symbols-outlined text-lg">
              request_quote
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {indicators.cotizaciones}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Propuestas formuladas</span>
          </div>
        </div>

        {/* 3. Aceptaciones */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aceptaciones</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 material-symbols-outlined text-lg">
              verified
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            {indicators.aceptaciones}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Órdenes aprobadas</span>
          </div>
        </div>

        {/* 4. Conversión */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conversión</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 material-symbols-outlined text-lg">
              trending_up
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 tracking-tight">
            {indicators.tasaConversionPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>De solicitud a cierre</span>
          </div>
        </div>

        {/* 5. Tiempo de Respuesta */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tiempo Respuesta</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 material-symbols-outlined text-lg">
              timer
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {indicators.tiempoRespuestaPromedioHoras}{' '}
            <span className="text-sm font-semibold text-slate-500">hrs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Primer contacto</span>
          </div>
        </div>
      </div>

      {/* Commercial Funnel / Pipeline States */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00677d] text-lg">filter_alt</span>
              <span>Embudo Comercial de Cotizaciones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en cualquier fase para filtrar la lista de cotizaciones activas
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600">
            Total Presupuesto Aprobado:{' '}
            <span className="text-emerald-700 font-bold font-mono">
              S/. {indicators.montoTotalAceptadoPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Status Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {(Object.keys(CRM_STATUS_CONFIG) as Array<keyof typeof CRM_STATUS_CONFIG>).map((st) => {
            const config = CRM_STATUS_CONFIG[st];
            const count = statusCounts[st] || 0;
            return (
              <button
                key={st}
                onClick={() => onSelectStatusFilter?.(st)}
                type="button"
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${config.colorBg} ${config.borderColor}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`material-symbols-outlined text-lg ${config.colorText}`}>
                    {config.icon}
                  </span>
                  <span
                    className={`font-mono text-base font-black px-1.5 py-0.5 rounded-md bg-white/80 shadow-2xs ${config.colorText}`}
                  >
                    {count}
                  </span>
                </div>
                <div className={`text-[11px] font-bold leading-tight line-clamp-1 ${config.colorText}`}>
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Most Requested Services & Highest Demand Sectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Servicios más solicitados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00677d] text-lg">science</span>
              <span>Servicios Más Solicitados</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Datos Reales</span>
          </div>

          <div className="space-y-3">
            {indicators.serviciosMasSolicitados.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No hay solicitudes registradas aún.</p>
            ) : (
              indicators.serviciosMasSolicitados.map((item, idx) => (
                <div key={item.servicio} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 line-clamp-1 max-w-[75%]">
                      {idx + 1}. {item.servicio}
                    </span>
                    <span className="font-mono text-slate-600 font-bold">
                      {item.cantidad} ({item.porcentaje}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00677d] to-[#00b4d8] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.porcentaje, 6)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sectores con mayor demanda */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00677d] text-lg">pie_chart</span>
              <span>Sectores con Mayor Demanda</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Datos Reales</span>
          </div>

          <div className="space-y-3">
            {indicators.sectoresMayorDemanda.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No hay solicitudes registradas aún.</p>
            ) : (
              indicators.sectoresMayorDemanda.map((item, idx) => {
                const colors = [
                  'from-teal-500 to-emerald-400',
                  'from-blue-500 to-cyan-400',
                  'from-indigo-500 to-purple-400',
                  'from-amber-500 to-orange-400',
                  'from-rose-500 to-pink-400',
                  'from-slate-500 to-slate-400',
                ];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={item.sector} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 line-clamp-1 max-w-[75%]">
                        {item.sector}
                      </span>
                      <span className="font-mono text-slate-600 font-bold">
                        {item.cantidad} ({item.porcentaje}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(item.porcentaje, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

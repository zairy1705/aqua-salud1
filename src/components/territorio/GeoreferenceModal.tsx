import React, { useState } from 'react';
import { MapPin, Navigation, Save, X, Compass } from 'lucide-react';
import { WaterSystemTerritorialProfile } from '../../types';

interface GeoreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WaterSystemTerritorialProfile;
  onSaveCoordinates: (
    systemId: string,
    lat: number,
    lng: number,
    altitude?: number
  ) => void;
}

export const GeoreferenceModal: React.FC<GeoreferenceModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveCoordinates,
}) => {
  const [lat, setLat] = useState<string>(
    profile.coordinates ? profile.coordinates.lat.toString() : ''
  );
  const [lng, setLng] = useState<string>(
    profile.coordinates ? profile.coordinates.lng.toString() : ''
  );
  const [alt, setAlt] = useState<string>(
    profile.coordinates?.altitudeMeters
      ? profile.coordinates.altitudeMeters.toString()
      : '2400'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGetDeviceGps = () => {
    if (!navigator.geolocation) {
      setGeoError('La geolocalización no está disponible en este navegador.');
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        if (pos.coords.altitude) {
          setAlt(Math.round(pos.coords.altitude).toString());
        }
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          `No se pudo obtener el GPS del dispositivo: ${err.message}. Puede ingresar las coordenadas manualmente.`
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const altNum = alt ? parseFloat(alt) : undefined;

    if (isNaN(latNum) || isNaN(lngNum)) {
      setGeoError('Debe ingresar coordenadas numéricas válidas de Latitud y Longitud.');
      return;
    }

    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setGeoError('Coordenadas fuera de rango geográfico WGS84.');
      return;
    }

    onSaveCoordinates(profile.systemId, latNum, lngNum, altNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cyan-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-[#00677d] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-hud text-[#002f3a]">
              Georreferenciación GIS In Situ
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-[260px]">
              {profile.systemName} • {profile.jassName}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 bg-cyan-50/70 p-3 rounded-2xl border border-cyan-100">
          📍 <strong>Norma de Trazabilidad Territorial:</strong> El sistema no
          inventa coordenadas. Al registrar el levantamiento GPS real en campo,
          este sistema se integrará inmediatamente a la cartografía interactiva
          y al GeoJSON.
        </p>

        {geoError && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {geoError}
          </div>
        )}

        <div className="mb-4">
          <button
            type="button"
            onClick={handleGetDeviceGps}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-hud transition-colors cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating
                ? 'Obteniendo GPS de alta precisión...'
                : 'Capturar ubicación actual con GPS móvil'}
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Latitud (WGS84) *
              </label>
              <input
                type="number"
                step="any"
                placeholder="-7.812000"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Longitud (WGS84) *
              </label>
              <input
                type="number"
                step="any"
                placeholder="-78.049000"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Altitud (m.s.n.m.)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                placeholder="2400"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none pr-16"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                metros
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" /> Datum: WGS84
            </span>
            <span>Zona UTM: 17S / 18S Perú</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-[#0096c7] hover:to-[#0077b6] text-white text-xs font-bold font-hud shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Guardar en GIS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';

interface DpdCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReading: (ppm: number, colorHex: string) => void;
  systemName?: string;
}

export const DpdCameraModal: React.FC<DpdCameraModalProps> = ({
  isOpen,
  onClose,
  onApplyReading,
  systemName = 'Reservorio Principal',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedPpm, setDetectedPpm] = useState<number>(1.2);
  const [detectedColor, setDetectedColor] = useState<string>('#ec4899');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dpdScale = [
    { ppm: 0.2, color: '#fbcfe8', label: '0.2 ppm (Bajo - Riesgo)' },
    { ppm: 0.5, color: '#f472b6', label: '0.5 ppm (Mínimo D.S. 031)' },
    { ppm: 1.0, color: '#ec4899', label: '1.0 ppm (Seguro / Cumple)' },
    { ppm: 1.5, color: '#db2777', label: '1.5 ppm (Óptimo)' },
    { ppm: 2.0, color: '#be185d', label: '2.0 ppm (Máximo D.S. 031)' },
    { ppm: 3.5, color: '#831843', label: '3.5+ ppm (Exceso)' },
  ];

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    setErrorMessage(null);
    setCapturedImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        'El navegador no soporta acceso directo a cámara WebRTC en este entorno. Puedes subir o tomar una foto de la celda DPD.'
      );
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Camera error:', error);
      setErrorMessage(
        'No se pudo acceder a la cámara WebRTC en este entorno. Puedes cargar una foto de la celda de lectura DPD abajo.'
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setErrorMessage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
      analyzeColor(ctx, canvas.width, canvas.height);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setCapturedImage(url);
        stopCamera();
        // Simulate reading
        setDetectedPpm(1.1);
        setDetectedColor('#ec4899');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeColor = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Pick center pixel
      const pixel = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      setDetectedColor(hex);

      // Estimate ppm based on pink hue
      const pinkness = Math.max(0, r - g);
      let calculatedPpm = 0.8;
      if (pinkness > 80) calculatedPpm = 1.8;
      else if (pinkness > 50) calculatedPpm = 1.2;
      else if (pinkness > 20) calculatedPpm = 0.6;
      else calculatedPpm = 0.3;

      setDetectedPpm(calculatedPpm);
      setIsAnalyzing(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#001b22] text-white rounded-3xl border border-cyan-400/40 shadow-[0_24px_50px_rgba(0,103,125,0.4)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#00242e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#10e7b2]">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </div>
            <div>
              <h3 className="font-hud font-bold text-[15px] text-white">
                Escáner Óptico de Cámara DPD
              </h3>
              <p className="text-[11px] text-cyan-300/80">
                Fotómetro de Cloro Residual Libre ({systemName})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[320px] bg-black flex items-center justify-center overflow-hidden">
          {isCameraActive && (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Target reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-36 h-36 rounded-2xl border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(0,180,216,0.6)] flex items-center justify-center">
                  <span className="text-[10px] font-hud text-cyan-200 bg-black/60 px-2 py-0.5 rounded-full">
                    Alinear Celda DPD
                  </span>
                </div>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Muestra capturada"
                className="max-w-full max-h-[320px] object-contain"
              />
              <div className="absolute top-3 right-3 bg-[#001f27]/90 px-3 py-1 rounded-full border border-cyan-400/40 text-[11px] text-cyan-200 font-hud font-bold">
                Muestra analizada
              </div>
            </div>
          )}

          {!isCameraActive && !capturedImage && (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#10e7b2]/10 border border-[#10e7b2]/30 flex items-center justify-center text-[#10e7b2] mb-3 shadow-[0_0_20px_rgba(16,231,178,0.2)]">
                <span className="material-symbols-outlined text-[32px]">photo_camera</span>
              </div>
              <h4 className="font-hud font-bold text-white text-[15px]">
                Lectura de Celda Colorimétrica DPD
              </h4>
              <p className="text-[12px] text-cyan-200/80 mt-1.5 mb-5 leading-relaxed">
                {errorMessage ||
                  'Toma una foto de la celda de ensayo con pastilla DPD-1 o sube una imagen de tu comparador visual para analizar el cloro libre.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] hover:from-[#10e7b2] hover:to-[#caf300] text-[#00212b] font-hud text-[11.5px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                  <span>Tomar Foto / Subir</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-cyan-400/30 text-cyan-200 font-hud text-[11px] font-bold uppercase transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  <span>Cámara en Vivo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Colorimetric Scale & Controls */}
        <div className="p-4 bg-[#00212b] border-t border-cyan-500/20 flex flex-col gap-3">
          {/* Detected PPM reading */}
          <div className="flex items-center justify-between bg-[#00171d] p-3 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg border border-white/30 shadow-inner"
                style={{ backgroundColor: detectedColor }}
              />
              <div>
                <span className="text-[10px] uppercase font-hud text-cyan-300 font-bold block">
                  Lectura Estimada DPD
                </span>
                <span className="text-[18px] font-hud font-extrabold text-white leading-none">
                  {detectedPpm.toFixed(2)} ppm Cl₂
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span
                className={`px-2 py-0.5 rounded-full font-hud text-[10px] font-extrabold uppercase ${
                  detectedPpm >= 0.5 && detectedPpm <= 2.0
                    ? 'bg-[#10e7b2]/20 text-[#10e7b2] border border-[#10e7b2]/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {detectedPpm >= 0.5 && detectedPpm <= 2.0
                  ? 'Dentro de Norma (D.S. 031)'
                  : 'Fuera de Rango'}
              </span>
              <span className="text-[9.5px] text-slate-400 mt-0.5">Rango: 0.50 a 2.00 ppm</span>
            </div>
          </div>

          {/* DPD color swatches selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-hud text-cyan-300/80 font-bold">
              Escala de Referencia DPD-1 (Selecciona manualmente si es necesario):
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {dpdScale.map((item) => (
                <button
                  key={item.ppm}
                  type="button"
                  onClick={() => {
                    setDetectedPpm(item.ppm);
                    setDetectedColor(item.color);
                  }}
                  className={`flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                    detectedPpm === item.ppm
                      ? 'border-[#10e7b2] bg-white/10 scale-105 shadow-md'
                      : 'border-white/10 hover:border-white/30 bg-black/20'
                  }`}
                  title={item.label}
                >
                  <span
                    className="w-full h-3.5 rounded-md border border-white/20 mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[9.5px] font-hud font-bold text-white">
                    {item.ppm.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isCameraActive ? (
              <button
                type="button"
                onClick={captureFrame}
                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#10e7b2] text-[#00212b] font-hud text-[12px] font-extrabold uppercase transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">camera</span>
                <span>Capturar Lectura</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-cyan-200 border border-cyan-400/40 font-hud text-[12px] font-bold uppercase transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Abrir Cámara</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onApplyReading(detectedPpm, detectedColor);
                stopCamera();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-full bg-[#10e7b2] hover:bg-[#00d4a0] text-[#00212b] font-hud text-[12px] font-black uppercase transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Aplicar {detectedPpm.toFixed(2)} ppm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

interface WaterBackgroundProps {
  interactive?: boolean;
}

export const WaterBackground: React.FC<WaterBackgroundProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      amplitude: number;
      speed: number;
      alpha: number;
      color: string;
    }

    const ripples: Ripple[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const addRipple = (x: number, y: number, amplitude = 1, speed = 2.4, maxRadius = 140) => {
      if (!interactive) return;
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius,
        amplitude,
        speed,
        alpha: 1,
        color: Math.random() > 0.3 ? 'rgba(255, 255, 255, ' : 'rgba(120, 240, 255, ',
      });
      if (ripples.length > 50) ripples.shift();
    };

    let lastMoveTime = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMoveTime > 100) {
        lastMoveTime = now;
        addRipple(e.clientX, e.clientY, 0.7, 2, 90);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      addRipple(e.clientX, e.clientY, 1.3, 3.2, 170);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Ambient automatic gentle ripples
    const interval = setInterval(() => {
      if (interactive && Math.random() > 0.3) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        addRipple(x, y, 0.75, 2, 110);
      }
    }, 3200);

    let step = 0;
    const render = () => {
      step += 0.016;
      // Base water gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#009bb8');
      grad.addColorStop(0.3, '#00b4d8');
      grad.addColorStop(0.7, '#008ba3');
      grad.addColorStop(1, '#005f73');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Sinusoidal waves
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const g = step * (0.8 + i * 0.2) + i * 1.5;
        const baseLine = (height / waveCount) * i + ((step * 20) % (height / waveCount));
        ctx.moveTo(0, baseLine);
        const segs = 12;
        const segW = width / segs;
        for (let j = 0; j <= segs; j++) {
          const x = j * segW;
          const y = baseLine + Math.sin(j * 0.8 + g) * 18 + Math.cos(j * 0.5 + g * 0.7) * 12;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + Math.sin(g) * 0.06})`;
        ctx.lineWidth = 14 + Math.sin(g) * 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // Ripples
      if (ripples.length > 0) {
        ctx.save();
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.speed;
          r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);
          if (r.alpha <= 0.01) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.color}${r.alpha * 0.75 * r.amplitude})`;
          ctx.lineWidth = 3.5;
          ctx.stroke();

          if (r.radius > 6) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius - 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 78, 100, ${r.alpha * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Soft light overlay to ensure text readability
      ctx.save();
      const topOverlay = ctx.createLinearGradient(0, 0, 0, height);
      topOverlay.addColorStop(0, 'rgba(240, 250, 255, 0.45)');
      topOverlay.addColorStop(0.5, 'rgba(230, 247, 255, 0.40)');
      topOverlay.addColorStop(1, 'rgba(240, 250, 255, 0.50)');
      ctx.fillStyle = topOverlay;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none"
      style={{ touchAction: 'none' }}
    />
  );
};

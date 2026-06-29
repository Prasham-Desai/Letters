'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number;
  size: number;
  life: number;
  maxLife: number;
}

export default function DustParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const MAX = 14; // reduced for performance

    const spawn = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -Math.random() * 0.08 - 0.02,
      opacity: Math.random() * 0.28 + 0.04,
      size: Math.random() * 1.2 + 0.4,
      life: 0,
      maxLife: Math.random() * 500 + 300,
    });

    const particles: Particle[] = Array.from({ length: MAX }, () => {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      return p;
    });

    let raf: number;
    let lastTime = 0;
    const draw = (time: number) => {
      // throttle to ~30fps for performance
      if (time - lastTime < 33) { raf = requestAnimationFrame(draw); return; }
      lastTime = time;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.maxLife;
        const fade = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,158,118,${p.opacity * fade})`;
        ctx.fill();
        if (p.life >= p.maxLife) Object.assign(p, spawn(), { life: 0 });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}

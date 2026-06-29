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
    const MAX = 30; // Increased for a more magical feel

    const spawn = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.1 - 0.05,
      opacity: Math.random() * 0.35 + 0.05,
      size: Math.random() * 1.8 + 0.5,
      life: 0,
      maxLife: Math.random() * 600 + 400,
    });

    const particles: Particle[] = Array.from({ length: MAX }, () => {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      return p;
    });

    let raf: number;
    let lastTime = 0;
    const draw = (time: number) => {
      if (time - lastTime < 33) { raf = requestAnimationFrame(draw); return; }
      lastTime = time;
      ctx.clearRect(0, 0, W, H);
      
      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        
        // Gentle horizontal drift (sine wave)
        p.x += Math.sin(p.life * 0.02) * 0.2;

        const t = p.life / p.maxLife;
        const fade = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 180, ${p.opacity * fade})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = `rgba(255, 200, 120, ${p.opacity * fade * 0.8})`;
        ctx.fill();
        
        // Reset shadow for next draw to avoid compounding
        ctx.shadowBlur = 0;

        if (p.life >= p.maxLife || p.y < -10) Object.assign(p, spawn(), { life: 0, y: H + 10 });
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

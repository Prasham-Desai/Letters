'use client';
import { memo, useEffect, useRef } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length?: number; // For rain
  radius?: number; // For snow
  alpha: number;
}

const WeatherEffects = memo(function WeatherEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const env = useEnvironment();
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Prefer reduced motion check
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const weather = env.weatherConfig;
    const isRain = weather.rainDensity > 0;
    const isSnow = weather.snowDensity > 0;

    // Determine target count based on weather config
    const targetCount = isReducedMotion
      ? 0 // No particles if reduced motion
      : isRain
      ? Math.floor(weather.rainDensity * 150)
      : isSnow
      ? Math.floor(weather.snowDensity * 80)
      : 0;

    // Initialize/adjust particle pool
    const particles = particlesRef.current;
    while (particles.length < targetCount) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: isRain ? (weather.windStrength * 5) + 1 : (Math.random() - 0.5) * 2,
        vy: isRain ? 15 + Math.random() * 10 : 1 + Math.random() * 2,
        length: isRain ? 15 + Math.random() * 15 : undefined,
        radius: isSnow ? 1 + Math.random() * 3 : undefined,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    while (particles.length > targetCount) {
      particles.pop();
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 16.66; // Normalize to 60fps
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length === 0) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      
      // We only want particles to be visible primarily in the upper area (window view) 
      // but they can fall slightly over the desk.
      // A gradient mask could be used, but for performance we'll just draw them and fade their alpha down the screen.

      if (isRain) {
        ctx.strokeStyle = `rgba(200, 220, 255, ${0.4 * (env.isNight ? 0.3 : 1)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const p of particles) {
          // Update
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.y > canvas.height || p.x > canvas.width) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
          
          // Draw
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx, p.y + (p.length || 20));
        }
        ctx.stroke();
      } else if (isSnow) {
        ctx.fillStyle = `rgba(255, 255, 255, ${env.isNight ? 0.4 : 0.8})`;
        ctx.beginPath();
        for (const p of particles) {
          // Update
          p.x += Math.sin(time / 1000 + p.y / 50) * 0.5 * dt + p.vx * dt;
          p.y += p.vy * dt;
          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
          
          // Draw
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.radius || 2, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [env.weatherConfig, env.isNight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
});

export default WeatherEffects;

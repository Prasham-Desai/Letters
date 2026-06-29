'use client';
import { memo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const WindowScene = memo(function WindowScene() {
  const env = useEnvironment();
  
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.5)',
        backgroundColor: env.lighting.skyGradient[2], // base color before gradients load
      }}
      aria-hidden="true"
    >
      {/* ─── 1. Outdoor View Background (Sky) ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${env.lighting.skyGradient[0]} 0%, ${env.lighting.skyGradient[1]} 50%, ${env.lighting.skyGradient[2]} 100%)`,
          transition: 'background 5s ease',
        }}
      />

      {/* ─── 2. Stars (Night only) ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: env.isNight && env.weather === 'sunny' ? 1 : 0,
          transition: 'opacity 3s ease',
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 1px, transparent 1.5px), radial-gradient(circle at 40% 10%, rgba(255,255,255,0.6) 1.5px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.9) 1px, transparent 1.5px), radial-gradient(circle at 60% 60%, rgba(255,255,255,0.5) 1px, transparent 1.5px)',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ─── 3. Sun / Moon ─── */}
      {/* Sun */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ffdf80 40%, transparent 80%)',
          boxShadow: '0 0 40px 20px rgba(255, 220, 100, 0.4)',
          opacity: env.isDaytime && env.weather !== 'rain' && env.weather !== 'snow' ? 1 : 0,
          transform: `translateY(${env.timeOfDay === 'noon' ? '0' : '20px'})`,
          transition: 'opacity 3s ease, transform 3s ease',
        }}
      />
      
      {/* Moon */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '25%',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#e0e6f0',
          boxShadow: '0 0 20px 5px rgba(200, 220, 255, 0.3), inset -8px -4px 10px rgba(100, 120, 150, 0.5)',
          opacity: env.isNight && env.weather !== 'rain' && env.weather !== 'snow' ? 1 : 0,
          transition: 'opacity 3s ease',
        }}
      >
        {/* Moon craters */}
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(100,120,150,0.2)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '50%', width: '15px', height: '12px', borderRadius: '50%', background: 'rgba(100,120,150,0.15)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '60%', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(100,120,150,0.2)' }} />
      </div>

      {/* ─── 4. Clouds ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: env.weatherConfig.cloudOpacity,
          transition: 'opacity 3s ease',
          pointerEvents: 'none',
        }}
      >
        <svg width="200%" height="100%" style={{ animation: 'cloud-drift 40s linear infinite alternate' }}>
           <path d="M 20 80 Q 40 40 70 70 Q 110 30 140 70 Q 180 50 190 90 L 20 90 Z" fill={env.isNight ? 'rgba(40,50,70,0.8)' : 'rgba(255,255,255,0.7)'} style={{ transition: 'fill 3s ease' }} />
           <path d="M 120 120 Q 150 90 180 120 Q 220 80 260 110 Q 280 130 250 140 L 120 140 Z" fill={env.isNight ? 'rgba(30,40,60,0.9)' : 'rgba(240,245,255,0.8)'} style={{ transition: 'fill 3s ease' }} />
        </svg>
      </div>

      {/* ─── 5. Landscape Silhouettes (Trees/Hills) ─── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Back hills */}
          <path d="M 0 60 Q 25 30 50 60 T 100 50 L 100 100 L 0 100 Z" fill={env.isNight ? '#121820' : '#4a6b5d'} style={{ transition: 'fill 3s ease' }} />
          {/* Front trees */}
          <path d="M 0 80 Q 15 50 30 80 T 60 70 T 80 90 T 100 65 L 100 100 L 0 100 Z" fill={env.isNight ? '#0a0d14' : '#2d4538'} style={{ transition: 'fill 3s ease' }} />
        </svg>
      </div>

      {/* ─── 6. Glass Effect Overlay ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1), inset 0 2px 2px rgba(255,255,255,0.3)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── 7. Wooden Window Frame (Muntins) ─── */}
      {/* Vertical divider */}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '12px', marginLeft: '-6px', background: 'linear-gradient(to right, #6a4a2a, #8a6a40, #5a3a1a)', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
      {/* Horizontal divider */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '12px', marginTop: '-6px', background: 'linear-gradient(to bottom, #7a5a3a, #5a3a1a)', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />

      {/* ─── 8. Curtains ─── */}
      {/* Left Curtain */}
      <div
        style={{
          position: 'absolute',
          top: -10, left: -20, bottom: -10, width: '30%',
          background: 'linear-gradient(to right, #f4f0ea 0%, #e8e0d4 40%, #d8cec0 80%, #f4f0ea 100%)',
          boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
          transformOrigin: 'top center',
          animation: 'curtain-sway 8s ease-in-out infinite alternate',
          borderRight: '1px solid rgba(255,255,255,0.5)',
          clipPath: 'polygon(0 0, 100% 0, 80% 30%, 90% 70%, 100% 100%, 0 100%)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' }} />
      </div>
      
      {/* Right Curtain */}
      <div
        style={{
          position: 'absolute',
          top: -10, right: -20, bottom: -10, width: '30%',
          background: 'linear-gradient(to left, #f4f0ea 0%, #e8e0d4 40%, #d8cec0 80%, #f4f0ea 100%)',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.3)',
          transformOrigin: 'top center',
          animation: 'curtain-sway 9s ease-in-out infinite alternate-reverse',
          borderLeft: '1px solid rgba(255,255,255,0.5)',
          clipPath: 'polygon(0 0, 100% 0, 0 100%, 10% 70%, 20% 30%, 0 0)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' }} />
      </div>

    </div>
  );
});

export default WindowScene;

'use client';
import { memo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const RoomLighting = memo(function RoomLighting() {
  const env = useEnvironment();
  const l = env.lighting;

  return (
    <>
      {/* 1. Sunlight Beam (Volumetric Ray) */}
      {env.isDaytime && env.weather !== 'rain' && env.weather !== 'snow' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: `linear-gradient(${l.shadowAngle}deg, rgba(255, 230, 180, ${l.intensity * 0.4}) 0%, transparent 60%)`,
            transition: 'background 5s ease, opacity 5s ease',
            opacity: l.intensity,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. Desk Lamp Glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          // Position matches the desk lamp SVG in DeskObjects
          background: `radial-gradient(circle at 88% 25%, rgba(255, 180, 50, ${l.lampIntensity * 0.6}) 0%, rgba(255, 120, 20, ${l.lampIntensity * 0.15}) 20%, transparent 60%)`,
          transition: 'background 3s ease, opacity 3s ease',
          opacity: l.lampOn ? 1 : 0,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 11,
        }}
        aria-hidden="true"
      />

      {/* 3. Ambient Vignette / Edge Shadow (Depth) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: env.isNight
            ? 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(10, 15, 30, 0.7) 100%)'
            : env.weather === 'rain'
            ? 'radial-gradient(ellipse at 50% 60%, transparent 50%, rgba(30, 40, 50, 0.4) 100%)'
            : 'radial-gradient(ellipse at 50% 60%, transparent 60%, rgba(40, 20, 10, 0.25) 100%)',
          transition: 'background 5s ease',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          zIndex: 12,
        }}
        aria-hidden="true"
      />

      {/* 4. Global Color Grading */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: l.ambientColor,
          transition: 'background-color 5s ease',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          zIndex: 13,
          opacity: 0.8,
        }}
        aria-hidden="true"
      />
    </>
  );
});

export default RoomLighting;

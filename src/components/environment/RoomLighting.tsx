'use client';
import { memo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const RoomLighting = memo(function RoomLighting() {
  const env = useEnvironment();
  const l = env.lighting;

  // Window is roughly at top: 3%, left: 4%, width: ~35% of screen
  // Sunlight beam angle should cast from that area across the desk
  const sunlightAngle = `${l.shadowAngle}deg`;

  return (
    <>
      {/* 1. Ambient Tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: l.ambientColor,
          transition: 'background-color 3s ease',
          mixBlendMode: 'multiply',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* 2. Sunlight Beam */}
      {env.isDaytime && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${sunlightAngle}, ${l.sunlightColor} 0%, transparent 60%)`,
            transition: 'background 3s ease, opacity 3s ease',
            opacity: l.intensity,
            mixBlendMode: 'screen',
            zIndex: 2,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Desk Lamp Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // Position the radial gradient at the bottom right where a lamp might be
          background: `radial-gradient(circle at 80% 80%, rgba(255, 200, 100, ${l.lampIntensity * 0.15}) 0%, rgba(255, 180, 50, ${l.lampIntensity * 0.05}) 30%, transparent 70%)`,
          transition: 'background 3s ease, opacity 3s ease',
          opacity: l.lampOn ? 1 : 0,
          mixBlendMode: 'screen',
          zIndex: 3,
        }}
        aria-hidden="true"
      />

      {/* 4. Vignette / Dark Edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: env.isNight
            ? 'radial-gradient(circle at center, transparent 40%, rgba(10, 15, 30, 0.4) 100%)'
            : 'radial-gradient(circle at center, transparent 60%, rgba(40, 20, 10, 0.15) 100%)',
          transition: 'background 5s ease',
          pointerEvents: 'none',
          zIndex: 4,
        }}
        aria-hidden="true"
      />
    </>
  );
});

export default RoomLighting;

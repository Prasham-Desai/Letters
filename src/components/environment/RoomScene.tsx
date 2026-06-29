'use client';
import { memo, ReactNode } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import WindowScene from './WindowScene';
import RoomLighting from './RoomLighting';
import WeatherEffects from './WeatherEffects';
import RainOnGlass from './RainOnGlass';
import DeskObjects from './DeskObjects';
import Cat from './Cat';
import Chair from './Chair';

interface Props {
  children: ReactNode;
  visible: boolean;
}

/**
 * RoomScene — Master orchestrator for the immersive room environment.
 *
 * Layers (back to front):
 * 1. Room wall background
 * 2. Window scene (outdoor view + frame)
 * 3. Cat on windowsill
 * 4. Rain on glass overlay
 * 5. Chair (partial, atmospheric)
 * 6. Desk surface with objects and envelopes (children)
 * 7. Room lighting overlays
 * 8. Weather particle effects
 */
const RoomScene = memo(function RoomScene({ children, visible }: Props) {
  const env = useEnvironment();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
      aria-hidden="true"
    >
      {/* ─── Layer 1: Room Wall ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: env.isNight
            ? 'linear-gradient(180deg, #2a2218 0%, #3a3028 40%, #4a3c30 100%)'
            : env.timeOfDay === 'evening' || env.timeOfDay === 'dusk'
            ? 'linear-gradient(180deg, #5a4838 0%, #6a5848 40%, #7a6858 100%)'
            : 'linear-gradient(180deg, #8a7a68 0%, #9a8a78 40%, #a89888 100%)',
          transition: 'background 5s ease',
        }}
      >
        {/* Wall texture — subtle plaster pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'w\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23w)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: 0.6,
          }}
          aria-hidden="true"
        />
        {/* Wainscoting / lower wall panel divider line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '58%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent 5%, rgba(80,60,30,0.2) 20%, rgba(80,60,30,0.25) 80%, transparent 95%)',
          }}
          aria-hidden="true"
        />
        {/* Lower wall — slightly different tone like wainscoting */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '58%',
            bottom: 0,
            background: env.isNight
              ? 'rgba(30,22,14,0.3)'
              : 'rgba(60,44,24,0.08)',
            transition: 'background 5s ease',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ─── Layer 2: Window Scene ─── */}
      <div
        style={{
          position: 'absolute',
          top: '3%',
          left: '4%',
          width: 'clamp(280px, 42vw, 550px)',
          height: 'clamp(220px, 50vh, 450px)',
          zIndex: 2,
        }}
      >
        <WindowScene />
        {/* Rain on glass overlay */}
        {env.weather === 'rain' && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
            <RainOnGlass />
          </div>
        )}
      </div>

      {/* ─── Layer 3: Cat on Windowsill ─── */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(180px, 44vh, 380px)',
          left: 'clamp(160px, 24vw, 340px)',
          zIndex: 3,
        }}
      >
        <Cat />
      </div>

      {/* ─── Layer 4: Chair ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2%',
          left: '2%',
          zIndex: 4,
          opacity: 0.7,
        }}
      >
        <Chair />
      </div>

      {/* ─── Layer 5: Desk Surface ─── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '52%',
          zIndex: 5,
        }}
      >
        {/* Desk front edge */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            left: '5%',
            right: '5%',
            height: '6px',
            background: 'linear-gradient(to bottom, #a07838, #8a6828)',
            borderRadius: '2px 2px 0 0',
            boxShadow: '0 -2px 8px rgba(40,20,8,0.2)',
          }}
          aria-hidden="true"
        />

        {/* Desk wood surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(90,60,20,0.05) 2px, rgba(90,60,20,0.05) 3px)',
              'repeating-linear-gradient(91deg, transparent, transparent 8px, rgba(60,40,12,0.035) 8px, rgba(60,40,12,0.035) 9px)',
              'linear-gradient(162deg, #c89850 0%, #b88838 18%, #a87828 38%, #b08040 58%, #b88c48 75%, #c49858 100%)',
            ].join(', '),
            boxShadow: 'inset 0 2px 20px rgba(40,20,8,0.15), 0 -4px 20px rgba(40,20,8,0.3)',
          }}
        >
          {/* Paper texture on desk */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
            aria-hidden="true"
          />

          {/* Desk objects */}
          <DeskObjects />

          {/* Envelope area (children) — centered on desk */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* ─── Layer 6: Lighting Overlays ─── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none' }}>
        <RoomLighting />
      </div>

      {/* ─── Layer 7: Weather Particle Effects ─── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none' }}>
        <WeatherEffects />
      </div>
    </div>
  );
});

export default RoomScene;

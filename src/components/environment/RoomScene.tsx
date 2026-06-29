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
 * RoomScene — 2.5D Diorama
 *
 * Uses CSS 3D transforms to create a physical sense of depth.
 */
const RoomScene = memo(function RoomScene({ children, visible }: Props) {
  const env = useEnvironment();

  return (
    <div
      className="room-viewport"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
      aria-hidden="true"
    >
      <div className="room-world">
        {/* ─── The Back Wall ─── */}
        <div 
          className="room-wall"
          style={{
            background: env.isNight
              ? 'linear-gradient(180deg, #2a2218 0%, #3a3028 40%, #4a3c30 100%)'
              : env.timeOfDay === 'evening' || env.timeOfDay === 'dusk'
              ? 'linear-gradient(180deg, #5a4838 0%, #6a5848 40%, #7a6858 100%)'
              : 'linear-gradient(180deg, #8a7a68 0%, #9a8a78 40%, #a89888 100%)',
            transition: 'background 5s ease',
          }}
        >
          {/* Wall texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'w\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23w)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
              opacity: 0.6,
            }}
          />

          {/* Window Scene (mounted flat on the wall) */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: 'clamp(300px, 40vw, 600px)',
              height: 'clamp(250px, 45vh, 550px)',
              zIndex: 2,
            }}
          >
            <WindowScene />
            {env.weather === 'rain' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
                <RainOnGlass />
              </div>
            )}
          </div>

          {/* Weather Particles (mounted on the wall, acts as a window overlay) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
            <WeatherEffects />
          </div>

          {/* Cat on windowsill */}
          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              left: '20%',
              zIndex: 5,
            }}
          >
            <Cat />
          </div>
        </div>

        {/* ─── The Desk Plane (Floor) ─── */}
        <div 
          className="room-desk-plane"
          style={{
            background: [
              'repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(90,60,20,0.05) 2px, rgba(90,60,20,0.05) 3px)',
              'repeating-linear-gradient(91deg, transparent, transparent 8px, rgba(60,40,12,0.035) 8px, rgba(60,40,12,0.035) 9px)',
              'linear-gradient(162deg, #c89850 0%, #b88838 18%, #a87828 38%, #b08040 58%, #b88c48 75%, #c49858 100%)',
            ].join(', '),
          }}
        >
          {/* Desk ambient occlusion around edges */}
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 150px rgba(40,20,8,0.8)', pointerEvents: 'none' }} />

          {/* Paper texture on desk */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
          />

          {/* 3D Desk Objects (Billboards) */}
          <DeskObjects />

          {/* Envelope area (children) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            {children}
          </div>

          {/* Chair (Billboard on desk edge) */}
          <div
            className="billboard"
            style={{
              position: 'absolute',
              bottom: '-10%',
              left: '10%',
              zIndex: 10,
              opacity: 0.8,
            }}
          >
            <Chair />
          </div>

          {/* Lighting Overlays (Mapped to the 3D desk plane) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', transformStyle: 'preserve-3d' }}>
            <RoomLighting />
          </div>
        </div>
      </div>
    </div>
  );
});

export default RoomScene;

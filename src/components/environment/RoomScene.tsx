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
import RoomDecorations from './RoomDecorations';

interface Props {
  children: ReactNode;
  visible: boolean;
}

/**
 * RoomScene — Cinematic 2D Composite
 * 
 * True perspective created by strict scaling and positioning:
 * Desk takes up 75% of the screen. Wall takes up 25-30%.
 * Depth of field achieved via CSS blur on background/foreground layers.
 */
const RoomScene = memo(function RoomScene({ children, visible }: Props) {
  const env = useEnvironment();

  return (
    <div
      className="scene-container"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
      aria-hidden="true"
    >
      {/* ─── BACKGROUND LAYER (Z=10) ─── */}
      {/* Blurred slightly for depth of field */}
      <div 
        className="scene-wall scene-layer"
        style={{
          zIndex: 10,
          filter: 'blur(1.5px)',
          background: env.isNight
            ? 'linear-gradient(180deg, #1c150d 0%, #2a2218 100%)'
            : env.timeOfDay === 'evening' || env.timeOfDay === 'dusk'
            ? 'linear-gradient(180deg, #4a3624 0%, #5a4838 100%)'
            : 'linear-gradient(180deg, #7a6a58 0%, #8a7a68 100%)',
          transition: 'background 5s ease',
        }}
      >
        {/* Wall texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'w\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23w)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Window (Upper Left, Large) */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '5%',
            width: '35%',
            minWidth: '400px',
            height: '140%',
            zIndex: 2,
          }}
        >
          <WindowScene />
          {env.weather === 'rain' && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
              <RainOnGlass />
            </div>
          )}
          {/* Weather Particles bounded to window frame */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', overflow: 'hidden', borderRadius: '4px' }}>
            <WeatherEffects />
          </div>
        </div>

        {/* Cat on windowsill */}
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '15%',
            zIndex: 5,
            transform: 'scale(1.4)',
          }}
        >
          <Cat />
        </div>

        {/* Room Background Decorations (Bookshelf, pictures, etc.) */}
        <RoomDecorations />
      </div>

      {/* ─── MIDGROUND LAYER (Z=30) ─── */}
      {/* The massive desk surface in sharp focus */}
      <div 
        className="scene-desk desk-surface"
        style={{ zIndex: 30 }}
      >
        {/* Paper texture overlay on wood */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Desk top edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, rgba(255,220,160,0.1), rgba(255,220,160,0.3) 20%, rgba(255,220,160,0.05) 80%)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        />

        {/* Ambient Occlusion (Dark vignette around desk edges) */}
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px rgba(20,10,5,0.7)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Static Desk Objects */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <DeskObjects />
        </div>

        {/* Interactive Layer (Mailbox, Collection Box, Envelopes) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
          }}
        >
          {children}
        </div>

        {/* Lighting Overlays (Cinematic Gradients affecting desk) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          <RoomLighting />
        </div>
      </div>

      {/* ─── FOREGROUND LAYER (Z=50) ─── */}
      {/* Extreme blur depth of field for elements closest to camera */}
      <div 
        className="scene-layer"
        style={{ zIndex: 50, filter: 'blur(5px)' }}
      >
        {/* Extreme Desk Edge */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, left: 0, right: 0, 
            height: '25px', 
            background: 'linear-gradient(180deg, rgba(80,50,20,0.9), rgba(30,15,5,1))',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.5)'
          }} 
        />
        
        {/* Chair Back (Bottom right corner) */}
        <div
          style={{
            position: 'absolute',
            bottom: '-5%',
            right: '15%',
            transform: 'scale(1.8)',
            opacity: 0.9,
          }}
        >
          <Chair />
        </div>
      </div>
    </div>
  );
});

export default RoomScene;

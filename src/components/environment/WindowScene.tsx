'use client';

import React, { memo, useMemo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

// ─── Constants ───────────────────────────────────────────
const WINDOW_WIDTH = 45; // vw
const PANE_COLS = 2;
const PANE_ROWS = 3;

// ─── Sub-components ──────────────────────────────────────

/** Rolling hills + tree silhouettes at the bottom of the window */
function Landscape({ isNight, intensity }: { isNight: boolean; intensity: number }) {
  const fillFar = isNight ? '#1a2418' : `rgba(85, 120, 75, ${0.7 + intensity * 0.2})`;
  const fillMid = isNight ? '#141e12' : `rgba(65, 100, 58, ${0.8 + intensity * 0.15})`;
  const fillNear = isNight ? '#0e170c' : `rgba(45, 78, 40, ${0.85 + intensity * 0.1})`;

  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '35%',
        transition: 'all 3s ease',
      }}
    >
      {/* Far hills */}
      <path
        d="M0,80 Q50,30 100,60 Q150,20 200,50 Q250,30 300,55 Q350,25 400,45 L400,120 L0,120Z"
        fill={fillFar}
        style={{ transition: 'fill 3s ease' }}
      />
      {/* Mid hills */}
      <path
        d="M0,90 Q60,50 120,75 Q180,45 240,70 Q300,50 360,65 Q380,55 400,60 L400,120 L0,120Z"
        fill={fillMid}
        style={{ transition: 'fill 3s ease' }}
      />
      {/* Near hills with tree silhouettes */}
      <path
        d="M0,100 Q40,70 80,85 Q120,65 160,80 Q200,60 240,78 Q280,65 320,82 Q360,72 400,80 L400,120 L0,120Z"
        fill={fillNear}
        style={{ transition: 'fill 3s ease' }}
      />
      {/* Trees on near ridge */}
      {[60, 130, 210, 275, 350].map((x, i) => {
        const h = 14 + (i % 3) * 5;
        const baseY = i % 2 === 0 ? 78 : 74;
        return (
          <g key={i} style={{ transition: 'fill 3s ease' }}>
            {/* Trunk */}
            <rect x={x - 1} y={baseY - h + 8} width={2} height={h - 4} fill={isNight ? '#0a1008' : '#3d5a30'} />
            {/* Canopy - triangle */}
            <polygon
              points={`${x},${baseY - h} ${x - 6 - i % 2 * 2},${baseY - 2} ${x + 6 + i % 2 * 2},${baseY - 2}`}
              fill={isNight ? '#0e170c' : '#3a6832'}
              style={{ transition: 'fill 3s ease' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Sun or Moon positioned based on timeFactor */
function CelestialBody({
  timeFactor,
  timeOfDay,
  isNight,
}: {
  timeFactor: number;
  timeOfDay: string;
  isNight: boolean;
}) {
  // Compute arc position: sun/moon travels left→right in a parabolic arc
  // timeFactor maps to 0-1 within the current period, but we want full-day arc
  // For daytime: dawn→dusk, sun moves L→R. For night: moon moves L→R.

  let progress: number;
  switch (timeOfDay) {
    case 'dawn':    progress = timeFactor * 0.15; break;
    case 'morning': progress = 0.15 + timeFactor * 0.25; break;
    case 'noon':    progress = 0.40 + timeFactor * 0.20; break;
    case 'evening': progress = 0.60 + timeFactor * 0.25; break;
    case 'dusk':    progress = 0.85 + timeFactor * 0.15; break;
    case 'night':   progress = timeFactor; break;
    default:        progress = 0.5;
  }

  const x = 8 + progress * 84; // percentage
  // Parabolic arc: highest at 0.5 progress
  const yPeak = 12;
  const yBase = 65;
  const y = yBase - (1 - Math.pow(2 * progress - 1, 2)) * (yBase - yPeak);

  if (isNight) {
    // Moon
    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #e8e4d8, #c8c4b8)',
          boxShadow: '0 0 18px 6px rgba(200, 200, 180, 0.25), 0 0 40px 12px rgba(180, 180, 160, 0.1)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 3s ease, top 3s ease',
          willChange: 'transform',
        }}
      />
    );
  }

  // Sun
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #ffe8a0, #f0c050)',
        boxShadow: '0 0 24px 10px rgba(255, 200, 80, 0.35), 0 0 60px 20px rgba(255, 180, 60, 0.15)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 3s ease, top 3s ease',
        willChange: 'transform',
      }}
    />
  );
}

/** Drifting cloud shapes */
function Clouds({ opacity, windStrength }: { opacity: number; windStrength: number }) {
  const clouds = useMemo(() => [
    { id: 0, cx: 70, cy: 25, rx: 28, ry: 10, delay: 0, scale: 1 },
    { id: 1, cx: 180, cy: 18, rx: 35, ry: 12, delay: 3, scale: 1.1 },
    { id: 2, cx: 290, cy: 30, rx: 24, ry: 9, delay: 7, scale: 0.9 },
    { id: 3, cx: 130, cy: 40, rx: 20, ry: 8, delay: 11, scale: 0.8 },
  ], []);

  const duration = Math.max(30, 80 - windStrength * 60);

  return (
    <svg
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60%',
        pointerEvents: 'none',
        transition: 'opacity 3s ease',
        opacity,
      }}
    >
      <defs>
        <filter id="cloud-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {clouds.map((c) => (
        <g key={c.id} filter="url(#cloud-blur)">
          <ellipse
            cx={c.cx}
            cy={c.cy}
            rx={c.rx * c.scale}
            ry={c.ry * c.scale}
            fill="rgba(230, 228, 222, 0.75)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${40 + windStrength * 30},0; 0,0`}
              dur={`${duration + c.delay}s`}
              begin={`-${c.delay}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Secondary lobe */}
          <ellipse
            cx={c.cx + c.rx * 0.5}
            cy={c.cy - c.ry * 0.4}
            rx={c.rx * 0.6 * c.scale}
            ry={c.ry * 0.7 * c.scale}
            fill="rgba(235, 232, 226, 0.65)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${40 + windStrength * 30},0; 0,0`}
              dur={`${duration + c.delay}s`}
              begin={`-${c.delay}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      ))}
    </svg>
  );
}

/** Night sky stars with twinkling */
function Stars({ visible }: { visible: boolean }) {
  const stars = useMemo(() => {
    const s: Array<{ id: number; x: number; y: number; size: number; delay: number; dur: number }> = [];
    // Deterministic "random" positions using simple seeding
    for (let i = 0; i < 35; i++) {
      const seed = i * 137.5;
      s.push({
        id: i,
        x: ((seed * 7.3) % 96) + 2,
        y: ((seed * 3.7) % 55) + 3,
        size: 1 + ((seed * 1.1) % 2),
        delay: (seed * 0.9) % 5,
        dur: 2 + ((seed * 0.6) % 3),
      });
    }
    return s;
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes wsce-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wsce-star { animation: none !important; opacity: 0.7 !important; }
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          className="wsce-star"
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: '#e8e4d0',
            animation: `wsce-twinkle ${star.dur}s ${star.delay}s ease-in-out infinite`,
            willChange: 'opacity',
          }}
        />
      ))}
    </>
  );
}

// ─── Glass Pane Grid ─────────────────────────────────────

function GlassPanes() {
  const panes: React.ReactNode[] = [];
  for (let row = 0; row < PANE_ROWS; row++) {
    for (let col = 0; col < PANE_COLS; col++) {
      panes.push(
        <div
          key={`${row}-${col}`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
            boxShadow:
              'inset 0 0 12px 2px rgba(200, 210, 220, 0.12), inset 0 1px 4px rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            background: 'rgba(200, 220, 240, 0.04)',
          }}
        />
      );
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateRows: `repeat(${PANE_ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${PANE_COLS}, 1fr)`,
        gap: 6,
        padding: 6,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {panes}
    </div>
  );
}

// ─── Wood Frame SVG ──────────────────────────────────────

function WoodFrame() {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: -8,
        width: 'calc(100% + 16px)',
        height: 'calc(100% + 16px)',
        zIndex: 4,
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Wood grain pattern */}
        <pattern id="wsce-wood-grain" patternUnits="userSpaceOnUse" width="60" height="12">
          <rect width="60" height="12" fill="#8b6b42" />
          <path d="M0,3 Q15,1 30,4 Q45,2 60,5" stroke="#7a5c36" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M0,7 Q20,5 40,8 Q50,6 60,9" stroke="#7a5c36" strokeWidth="0.4" fill="none" opacity="0.35" />
          <path d="M0,10 Q10,9 30,11 Q50,9 60,10" stroke="#6d5030" strokeWidth="0.3" fill="none" opacity="0.3" />
        </pattern>
        {/* Slight highlight for bevel */}
        <linearGradient id="wsce-frame-bevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,240,200,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
        </linearGradient>
      </defs>

      {/* Outer frame */}
      <rect x="0" y="0" width="400" height="500" rx="4" fill="url(#wsce-wood-grain)" />
      {/* Inner cutout */}
      <rect x="18" y="18" width="364" height="464" rx="2" fill="transparent" stroke="none" />
      {/* Use clip to cut out the interior */}
      <clipPath id="wsce-frame-clip">
        <rect x="0" y="0" width="400" height="500" rx="4" />
        <rect x="18" y="18" width="364" height="464" rx="2" />
      </clipPath>

      {/* Frame border (the frame itself) drawn via outline approach */}
      {/* Top rail */}
      <rect x="0" y="0" width="400" height="20" rx="4" fill="url(#wsce-wood-grain)" />
      <rect x="0" y="0" width="400" height="20" rx="4" fill="url(#wsce-frame-bevel)" />
      {/* Bottom rail */}
      <rect x="0" y="480" width="400" height="20" rx="4" fill="url(#wsce-wood-grain)" />
      {/* Left stile */}
      <rect x="0" y="0" width="20" height="500" rx="4" fill="url(#wsce-wood-grain)" />
      <rect x="0" y="0" width="20" height="500" rx="4" fill="url(#wsce-frame-bevel)" />
      {/* Right stile */}
      <rect x="380" y="0" width="20" height="500" rx="4" fill="url(#wsce-wood-grain)" />

      {/* Horizontal muntins */}
      <rect x="18" y="172" width="364" height="6" fill="url(#wsce-wood-grain)" />
      <rect x="18" y="172" width="364" height="6" fill="url(#wsce-frame-bevel)" />
      <rect x="18" y="328" width="364" height="6" fill="url(#wsce-wood-grain)" />
      <rect x="18" y="328" width="364" height="6" fill="url(#wsce-frame-bevel)" />

      {/* Vertical muntin */}
      <rect x="197" y="18" width="6" height="464" fill="url(#wsce-wood-grain)" />
      <rect x="197" y="18" width="6" height="464" fill="url(#wsce-frame-bevel)" />

      {/* Imperfections – small knots */}
      <circle cx="10" cy="120" r="3" fill="#6d5030" opacity="0.35" />
      <circle cx="390" cy="350" r="2.5" fill="#6d5030" opacity="0.3" />
      <circle cx="200" cy="490" r="2" fill="#6d5030" opacity="0.25" />
    </svg>
  );
}

// ─── Curtains ────────────────────────────────────────────

function Curtains() {
  return (
    <>
      <style>{`
        @keyframes wsce-curtain-sway {
          0%, 100% { transform: skewX(-0.5deg) translateX(0); }
          30% { transform: skewX(0.3deg) translateX(1px); }
          60% { transform: skewX(-0.2deg) translateX(-0.5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wsce-curtain { animation: none !important; }
        }
      `}</style>
      {/* Left curtain */}
      <div
        className="wsce-curtain"
        style={{
          position: 'absolute',
          top: 0,
          left: -6,
          width: '16%',
          height: '100%',
          background: `linear-gradient(
            90deg,
            rgba(245, 240, 230, 0.85) 0%,
            rgba(240, 235, 225, 0.7) 40%,
            rgba(245, 240, 232, 0.5) 70%,
            rgba(245, 240, 232, 0.15) 100%
          )`,
          borderRight: '1px solid rgba(210, 200, 185, 0.3)',
          zIndex: 5,
          animation: 'wsce-curtain-sway 12s ease-in-out infinite',
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
      >
        {/* Folds */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(200, 190, 170, 0.08) 4px,
              transparent 8px,
              rgba(200, 190, 170, 0.05) 12px,
              transparent 16px
            )`,
          }}
        />
      </div>
      {/* Right curtain */}
      <div
        className="wsce-curtain"
        style={{
          position: 'absolute',
          top: 0,
          right: -6,
          width: '16%',
          height: '100%',
          background: `linear-gradient(
            270deg,
            rgba(245, 240, 230, 0.85) 0%,
            rgba(240, 235, 225, 0.7) 40%,
            rgba(245, 240, 232, 0.5) 70%,
            rgba(245, 240, 232, 0.15) 100%
          )`,
          borderLeft: '1px solid rgba(210, 200, 185, 0.3)',
          zIndex: 5,
          animation: 'wsce-curtain-sway 14s 2s ease-in-out infinite',
          animationDirection: 'reverse',
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(200, 190, 170, 0.08) 4px,
              transparent 8px,
              rgba(200, 190, 170, 0.05) 12px,
              transparent 16px
            )`,
          }}
        />
      </div>
    </>
  );
}

// ─── Windowsill ──────────────────────────────────────────

function Windowsill() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -14,
        left: -12,
        right: -12,
        height: 18,
        background: 'linear-gradient(180deg, #8b6b42 0%, #7a5c36 60%, #6d5030 100%)',
        borderRadius: '0 0 4px 4px',
        boxShadow: '0 4px 8px rgba(40, 25, 10, 0.2), 0 1px 0 rgba(255, 240, 200, 0.1) inset',
        zIndex: 5,
      }}
    >
      {/* Wood grain lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(110, 80, 45, 0.15) 2px,
            transparent 4px
          )`,
          borderRadius: '0 0 4px 4px',
        }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────

const WindowScene = memo(function WindowScene() {
  const { lighting, weatherConfig, isNight, isDaytime, timeFactor, timeOfDay } = useEnvironment();

  const skyStyle = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${lighting.skyGradient[0]}, ${lighting.skyGradient[1]}, ${lighting.skyGradient[2]})`,
      transition: 'background 3s ease',
    }),
    [lighting.skyGradient]
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '4%',
        left: '6%',
        width: `${WINDOW_WIDTH}%`,
        aspectRatio: '4 / 5',
        maxHeight: '58vh',
        zIndex: 1,
      }}
    >
      {/* Window interior (the view behind glass) */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          borderRadius: 2,
          overflow: 'hidden',
          ...skyStyle,
        }}
      >
        {/* Stars (night only) */}
        <Stars visible={isNight} />

        {/* Celestial body */}
        <CelestialBody
          timeFactor={timeFactor}
          timeOfDay={timeOfDay}
          isNight={isNight}
        />

        {/* Clouds */}
        <Clouds
          opacity={weatherConfig.cloudOpacity}
          windStrength={weatherConfig.windStrength}
        />

        {/* Landscape */}
        <Landscape isNight={isNight} intensity={lighting.intensity} />
      </div>

      {/* Glass panes overlay */}
      <GlassPanes />

      {/* Wood frame */}
      <WoodFrame />

      {/* Curtains */}
      <Curtains />

      {/* Windowsill */}
      <Windowsill />
    </div>
  );
});

export default WindowScene;

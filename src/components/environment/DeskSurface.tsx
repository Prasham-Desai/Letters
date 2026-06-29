'use client';

import React, { memo, type ReactNode } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

interface DeskSurfaceProps {
  children: ReactNode;
}

const DeskSurface = memo(function DeskSurface({ children }: DeskSurfaceProps) {
  const { lighting } = useEnvironment();

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '63%',
        perspective: '1200px',
        zIndex: 10,
      }}
    >
      {/* Desk body — perspective tilt */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: 'perspective(1200px) rotateX(2deg)',
          transformOrigin: 'center bottom',
          willChange: 'transform',
        }}
      >
        {/* ── Wood surface ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              /* Fine walnut grain */
              'repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(90,60,20,0.05) 2px, rgba(90,60,20,0.05) 3px)',
              /* Medium grain variation */
              'repeating-linear-gradient(91deg, transparent, transparent 8px, rgba(60,40,12,0.035) 8px, rgba(60,40,12,0.035) 9px)',
              /* Wide grain stripes */
              'repeating-linear-gradient(89deg, transparent, transparent 22px, rgba(80,50,15,0.025) 22px, rgba(80,50,15,0.025) 24px)',
              /* Primary walnut tone */
              'linear-gradient(162deg, #c89850 0%, #b88838 18%, #a87828 38%, #b08040 58%, #b88c48 75%, #c49858 100%)',
            ].join(', '),
            boxShadow: 'inset 0 0 120px rgba(40,20,8,0.3)',
            overflow: 'hidden',
            borderRadius: '2px 2px 0 0',
          }}
        >
          {/* ── Top-left directional light highlight ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background:
                'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(255,220,140,0.18) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          {/* ── Vignette ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background:
                'radial-gradient(ellipse 85% 78% at 50% 50%, transparent 40%, rgba(30,15,5,0.3) 100%)',
            }}
            aria-hidden="true"
          />

          {/* ── Ambient light overlay (responds to environment) ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: lighting.ambientColor,
              transition: 'background 3s ease',
              mixBlendMode: 'multiply',
            }}
            aria-hidden="true"
          />

          {/* ── Lamp glow overlay (when lamp is on) ── */}
          {lighting.lampOn && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: `radial-gradient(ellipse 50% 60% at 70% 20%, rgba(255,200,100,${
                  0.08 * lighting.lampIntensity
                }) 0%, transparent 70%)`,
                transition: 'background 3s ease',
              }}
              aria-hidden="true"
            />
          )}

          {/* ── Paper texture noise overlay ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
            aria-hidden="true"
          />

          {/* ── Children (envelopes, desk objects, etc.) ── */}
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

        {/* ── Front edge of the desk ── */}
        <div
          style={{
            position: 'absolute',
            bottom: -8,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(180deg, #8a6828 0%, #6a5020 60%, #5a4018 100%)',
            borderRadius: '0 0 3px 3px',
            boxShadow: '0 2px 8px rgba(30,15,5,0.4)',
            zIndex: 1,
          }}
        >
          {/* Top highlight line on edge */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '5%',
              right: '5%',
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(220,180,120,0.35) 20%, rgba(220,180,120,0.4) 50%, rgba(220,180,120,0.35) 80%, transparent)',
            }}
            aria-hidden="true"
          />
          {/* Wood grain on edge */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(40,25,10,0.08) 12px, rgba(40,25,10,0.08) 13px)',
              borderRadius: '0 0 3px 3px',
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
});

export default DeskSurface;

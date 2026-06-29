'use client';
import { memo, useEffect, useState } from 'react';

interface Droplet {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const RainOnGlass = memo(function RainOnGlass() {
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  useEffect(() => {
    // Initial batch
    const initialDrops = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: (Math.random() * -50) - 10, // Start above
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setDroplets(initialDrops);

    // Continuously add drops and cycle them
    const interval = setInterval(() => {
      setDroplets(current => {
        // Keep only 20 drops max
        const active = current.slice(-15);
        const newDrop = {
          id: Date.now(),
          x: Math.random() * 100,
          y: -10,
          size: 2 + Math.random() * 4,
          delay: 0,
          duration: 3 + Math.random() * 4,
        };
        return [...active, newDrop];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <filter id="water-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {droplets.map(drop => (
          <g
            key={drop.id}
            style={{
              animation: `rain-drop-slide ${drop.duration}s ${drop.delay}s linear forwards`,
              transformOrigin: 'center',
            }}
          >
            {/* Main droplet body */}
            <ellipse
              cx={`${drop.x}%`}
              cy={`${drop.y}%`}
              rx={drop.size / 2}
              ry={drop.size}
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="0.5"
              filter="url(#water-distortion)"
            />
            {/* Highlight */}
            <ellipse
              cx={`${drop.x - 0.5}%`}
              cy={`${drop.y - drop.size * 0.3}%`}
              rx={drop.size * 0.15}
              ry={drop.size * 0.3}
              fill="rgba(255, 255, 255, 0.6)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
});

export default RainOnGlass;

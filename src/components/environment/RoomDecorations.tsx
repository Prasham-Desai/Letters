'use client';
import { memo } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const RoomDecorations = memo(function RoomDecorations() {
  const env = useEnvironment();
  const opacity = env.isNight ? 0.3 : 0.7;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }}>
      {/* Bookshelf (Top Right) */}
      <div style={{ position: 'absolute', top: '5%', right: '8%', width: '120px', height: '200px' }}>
        {/* Shelf structure */}
        <rect width="120" height="200" fill="#2a1e10" opacity="0.4" />
        <svg viewBox="0 0 120 200" style={{ position: 'absolute', inset: 0 }}>
          {/* Shelves */}
          <rect x="0" y="60" width="120" height="8" fill="#4a3624" />
          <rect x="0" y="130" width="120" height="8" fill="#4a3624" />
          
          {/* Books Shelf 1 */}
          <rect x="10" y="10" width="15" height="50" fill="#6b2c3a" />
          <rect x="26" y="15" width="12" height="45" fill="#2c4c3b" />
          <rect x="39" y="8" width="18" height="52" fill="#8a6428" />
          {/* Leaning book */}
          <g transform="translate(60, 20) rotate(15)">
            <rect x="0" y="0" width="14" height="40" fill="#3a4c5c" />
          </g>

          {/* Books Shelf 2 */}
          <rect x="15" y="80" width="12" height="50" fill="#8a3a28" />
          <rect x="28" y="75" width="20" height="55" fill="#1c2c3b" />
          
          {/* Small Potted Plant */}
          <path d="M 80 110 L 100 110 L 95 130 L 85 130 Z" fill="#c4785a" />
          <circle cx="90" cy="100" r="15" fill="#3a5c3a" />
          <circle cx="80" cy="95" r="10" fill="#2c4c2b" />
          <circle cx="100" cy="105" r="12" fill="#4a6c4a" />
        </svg>
      </div>

      {/* Hanging Ivy (Top Edge) */}
      <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Vines */}
        <path d="M 0 0 Q 150 60 300 10 Q 500 80 700 20 Q 850 70 1000 0" fill="none" stroke="#2c4c2b" strokeWidth="3" />
        {/* Leaves */}
        <path d="M 50 20 Q 60 35 50 50 Q 40 35 50 20 Z" fill="#3a5c3a" />
        <path d="M 150 40 Q 165 55 150 70 Q 135 55 150 40 Z" fill="#2c4c2b" />
        <path d="M 250 15 Q 260 30 250 45 Q 240 30 250 15 Z" fill="#4a6c4a" />
        <path d="M 400 35 Q 415 50 400 65 Q 385 50 400 35 Z" fill="#3a5c3a" />
        <path d="M 550 50 Q 560 65 550 80 Q 540 65 550 50 Z" fill="#2c4c2b" />
        <path d="M 750 25 Q 765 40 750 55 Q 735 40 750 25 Z" fill="#4a6c4a" />
        <path d="M 900 45 Q 910 60 900 75 Q 890 60 900 45 Z" fill="#3a5c3a" />
      </svg>

      {/* Corkboard with Photos (Mid Right) */}
      <div style={{ position: 'absolute', top: '35%', right: '35%', transform: 'rotate(-2deg)' }}>
        <svg width="180" height="120" viewBox="0 0 180 120">
          {/* Frame */}
          <rect x="0" y="0" width="180" height="120" fill="#6a4a2a" rx="2" />
          {/* Cork */}
          <rect x="5" y="5" width="170" height="110" fill="#c49a6a" />
          <rect x="5" y="5" width="170" height="110" fill="url(#w)" opacity="0.1" />

          {/* Photo 1 */}
          <g transform="translate(15, 15) rotate(5)">
            <rect width="50" height="60" fill="#f5f0e8" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.3))" />
            <rect x="4" y="4" width="42" height="40" fill="#5a6c7a" />
            <circle cx="25" cy="5" r="2" fill="#c44a3a" /> {/* Pin */}
          </g>

          {/* Photo 2 */}
          <g transform="translate(80, 10) rotate(-4)">
            <rect width="60" height="45" fill="#f5f0e8" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.3))" />
            <rect x="4" y="4" width="52" height="30" fill="#8a6c5a" />
            <circle cx="30" cy="5" r="2" fill="#4a6ca4" /> {/* Pin */}
          </g>

          {/* Note */}
          <g transform="translate(45, 60) rotate(-8)">
            <rect width="40" height="40" fill="#e8cc78" filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.2))" />
            <line x1="8" y1="10" x2="32" y2="10" stroke="#8a7030" strokeWidth="1.5" />
            <line x1="8" y1="16" x2="28" y2="16" stroke="#8a7030" strokeWidth="1.5" />
            <line x1="8" y1="22" x2="30" y2="22" stroke="#8a7030" strokeWidth="1.5" />
            <circle cx="20" cy="4" r="2" fill="#3a3530" />
          </g>
        </svg>
      </div>
    </div>
  );
});

export default RoomDecorations;

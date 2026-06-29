'use client';
import { memo } from 'react';

const Chair = memo(function Chair() {
  return (
    <div
      style={{
        width: '120px',
        height: '160px',
        pointerEvents: 'none',
        transform: 'rotate(-8deg)',
        transformOrigin: 'bottom left',
      }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 140" fill="none">
        <defs>
          <linearGradient id="chair-wood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b08848" />
            <stop offset="60%" stopColor="#9a7438" />
            <stop offset="100%" stopColor="#7a5828" />
          </linearGradient>
          <linearGradient id="chair-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="10%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="chair-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="80%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </linearGradient>
        </defs>

        {/* Backrest right post */}
        <rect x="75" y="10" width="8" height="80" rx="4" fill="url(#chair-wood)" />
        <rect x="75" y="10" width="8" height="80" rx="4" fill="url(#chair-shadow)" />

        {/* Backrest left post */}
        <rect x="15" y="0" width="8" height="90" rx="4" fill="url(#chair-wood)" />
        <rect x="15" y="0" width="8" height="90" rx="4" fill="url(#chair-highlight)" />
        <rect x="15" y="0" width="8" height="90" rx="4" fill="url(#chair-shadow)" />

        {/* Top rail */}
        <path d="M 17 8 Q 49 0 77 15 L 77 25 Q 49 10 17 18 Z" fill="url(#chair-wood)" />
        <path d="M 17 8 Q 49 0 77 15 L 77 25 Q 49 10 17 18 Z" fill="url(#chair-highlight)" />

        {/* Middle rail */}
        <path d="M 19 35 Q 49 28 75 40 L 75 48 Q 49 36 19 43 Z" fill="url(#chair-wood)" />
        
        {/* Spindles */}
        <rect x="30" y="20" width="4" height="20" fill="url(#chair-wood)" transform="rotate(-5 32 20)" />
        <rect x="45" y="15" width="4" height="22" fill="url(#chair-wood)" transform="rotate(-2 47 15)" />
        <rect x="60" y="15" width="4" height="23" fill="url(#chair-wood)" transform="rotate(2 62 15)" />

        {/* Seat base (angled perspective) */}
        <path d="M 5 90 L 85 98 L 95 110 L 0 115 Z" fill="#8a6828" />
        <path d="M 5 90 L 85 98 L 95 110 L 0 115 Z" fill="rgba(0,0,0,0.15)" />
        
        {/* Seat cushion/wood top */}
        <path d="M 5 86 L 85 94 L 98 106 L -2 110 Z" fill="url(#chair-wood)" />
        <path d="M 5 86 L 85 94 L 98 106 L -2 110 Z" fill="rgba(255,255,255,0.05)" />

        {/* Front left leg */}
        <rect x="5" y="108" width="10" height="32" rx="2" fill="url(#chair-wood)" />
        <rect x="5" y="108" width="10" height="32" rx="2" fill="url(#chair-highlight)" />
        <rect x="5" y="108" width="10" height="32" rx="2" fill="url(#chair-shadow)" />

        {/* Front right leg */}
        <rect x="78" y="102" width="9" height="38" rx="2" fill="url(#chair-wood)" />
        <rect x="78" y="102" width="9" height="38" rx="2" fill="url(#chair-shadow)" />

      </svg>
    </div>
  );
});

export default Chair;

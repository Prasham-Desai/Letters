import { WaxSealType, SealColor } from '@/types/letter';
import { memo } from 'react';

// Premium tailored colors for realistic wax
const SEAL_COLORS: Record<SealColor, { base: string; dark: string; light: string; highlight: string }> = {
  burgundy:   { base: '#8b2030', dark: '#3a0812', light: '#ba3b4d', highlight: '#e86a7d' },
  forest:     { base: '#2b5030', dark: '#102413', light: '#457a4a', highlight: '#73b079' },
  navy:       { base: '#253550', dark: '#0c1524', light: '#3a5075', highlight: '#6884b3' },
  terracotta: { base: '#b54b35', dark: '#4a170b', light: '#d96c55', highlight: '#ff9c87' },
  brown:      { base: '#6e4526', dark: '#2b1708', light: '#96633b', highlight: '#c48f64' },
  purple:     { base: '#4c2e63', dark: '#1c0c29', light: '#704791', highlight: '#9f73c4' },
};

interface Props {
  type: WaxSealType;
  color: SealColor;
  cracked?: boolean;
  size?: number;
}

const WaxSeal = memo(function WaxSeal({ type, color, cracked = false, size = 48 }: Props) {
  const { base, dark, light, highlight } = SEAL_COLORS[color] ?? SEAL_COLORS.burgundy;
  const idPrefix = `${type}-${color}-${cracked ? 'c' : 'n'}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      style={{ 
        overflow: 'visible',
        filter: 'drop-shadow(0px 3px 6px rgba(40, 20, 8, 0.35)) drop-shadow(0px 1px 2px rgba(40, 20, 8, 0.2))',
      }}
    >
      <defs>
        {/* Base wax lighting — strong directional light from top-left */}
        <radialGradient id={`base-light-${idPrefix}`} cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor={light} />
          <stop offset="30%" stopColor={base} />
          <stop offset="85%" stopColor={dark} />
          <stop offset="100%" stopColor="#110500" />
        </radialGradient>
        
        {/* Raised rim highlight */}
        <linearGradient id={`rim-highlight-${idPrefix}`} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor={highlight} stopOpacity="0.8" />
          <stop offset="40%" stopColor={light} stopOpacity="0.2" />
          <stop offset="60%" stopColor={dark} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>

        {/* Depressed center pool shadow */}
        <radialGradient id={`pool-shadow-${idPrefix}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={dark} stopOpacity="0.8" />
          <stop offset="70%" stopColor={base} stopOpacity="0.4" />
          <stop offset="100%" stopColor={light} stopOpacity="0.1" />
        </radialGradient>

        {/* Engraving effect: inner shadow + subtle bottom lip highlight */}
        <filter id={`engrave-${idPrefix}`} x="-20%" y="-20%" width="140%" height="140%">
          {/* 1. Inner shadow (darkness inside the cut) */}
          <feOffset dx="0.5" dy="1" in="SourceAlpha" result="shadowOffset" />
          <feGaussianBlur stdDeviation="0.8" in="shadowOffset" result="shadowBlur" />
          <feComposite operator="out" in="SourceAlpha" in2="shadowBlur" result="innerShadowMask" />
          <feFlood floodColor={dark} floodOpacity="0.95" result="shadowColor" />
          <feComposite operator="in" in="shadowColor" in2="innerShadowMask" result="innerShadow" />
          
          {/* 2. Bottom lip highlight (light catching the bottom edge of the cut) */}
          <feOffset dx="-0.5" dy="-0.5" in="SourceAlpha" result="highlightOffset" />
          <feGaussianBlur stdDeviation="0.4" in="highlightOffset" result="highlightBlur" />
          <feComposite operator="out" in="SourceAlpha" in2="highlightBlur" result="highlightMask" />
          <feFlood floodColor={highlight} floodOpacity="0.75" result="highlightColor" />
          <feComposite operator="in" in="highlightColor" in2="highlightMask" result="bottomHighlight" />

          {/* Merge them over the base shape */}
          <feMerge>
            <feMergeNode in="bottomHighlight" />
            <feMergeNode in="innerShadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle noise for wax texture */}
        <filter id={`wax-texture-${idPrefix}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
          <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
        </filter>
      </defs>

      <g filter={`url(#wax-texture-${idPrefix})`}>
        {/* Squished outer edge — more irregular and natural */}
        <path 
          d="M 29 4 C 44 2, 57 11, 56 28 C 55 45, 45 56, 28 55 C 13 54, 3 44, 4 29 C 5 13, 14 6, 29 4 Z" 
          fill={`url(#base-light-${idPrefix})`}
        />
        
        {/* Thick Raised Rim */}
        <path 
          d="M 30 7 C 42 6, 52 14, 51 28 C 50 42, 41 51, 29 50 C 16 49, 7 40, 8 29 C 9 16, 18 8, 30 7 Z" 
          fill="none" stroke={`url(#rim-highlight-${idPrefix})`} strokeWidth="2.5"
        />

        {/* Inner Depressed Pool */}
        <path 
          d="M 30 10 C 40 9, 48 16, 47 28 C 46 39, 39 47, 29 46 C 18 45, 11 38, 12 28 C 13 17, 20 11, 30 10 Z" 
          fill={`url(#pool-shadow-${idPrefix})`}
        />
      </g>

      {/* Engraved Icon — Perfectly centered at (30, 30) */}
      <g filter={`url(#engrave-${idPrefix})`} fill={base} opacity="0.92" transform="translate(30, 30)">
        
        {type === 'flower' && (
          <g transform="scale(1.35)">
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <ellipse key={i} cx={Math.cos((a * Math.PI) / 180) * 5} cy={Math.sin((a * Math.PI) / 180) * 5} rx="2.5" ry="4" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="3.5" />
          </g>
        )}
        
        {type === 'moon' && (
          <g transform="scale(1.4) translate(-0.5, 0)">
            <path d="M 4 -7 A 7 7 0 1 0 4 7 A 9 9 0 1 1 4 -7 Z" />
          </g>
        )}
        
        {type === 'leaf' && (
          <g transform="scale(1.3) rotate(30)">
            <path d="M -5 -7 C -9 -3, -11 3, -9 9 C -7 13, -4 14, -4 14 C -4 14, -1 13, 1 9 C 3 3, 1 -3, -5 -7 Z" />
          </g>
        )}
        
        {type === 'star' && (
          <g transform="scale(1.2)">
            <polygon points="0,-9 2.5,-3 9,-3 4,2 6,9 0,5 -6,9 -4,2 -9,-3 -2.5,-3" />
          </g>
        )}
        
        {type === 'feather' && (
          <g transform="scale(1.3)">
            <path d="M 0 -9 Q 7 -2, 4 9 L 0 12 Q -4 4, -2 -5 Z M 0 12 L -1.5 -5" stroke={base} strokeWidth="0.6"/>
          </g>
        )}
        
        {type === 'bear' && (
          <g transform="scale(1.25)">
            <circle cx="0" cy="1" r="6"/>
            <circle cx="-5.5" cy="-4.5" r="3"/>
            <circle cx="5.5" cy="-4.5" r="3"/>
            <circle cx="-2.5" cy="0" r="1.2" fill={dark}/>
            <circle cx="2.5" cy="0" r="1.2" fill={dark}/>
            <path d="M -2.5 3 Q 0 5.5, 2.5 3" stroke={dark} strokeWidth="1" fill="none" strokeLinecap="round"/>
          </g>
        )}
        
        {type === 'bird' && (
          <g transform="scale(1.3)" fill="none" stroke={base} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M -7 -2 Q -1 -7, 4 -4 Q 7 -7, 11 -2"/>
            <circle cx="4" cy="1" r="3.5" fill={base} stroke="none"/>
            <path d="M 2.5 4 L 1 9 M 5.5 4 L 7 9" strokeWidth="1.2"/>
          </g>
        )}
      </g>

      {/* Realistic Crack when opened */}
      {cracked && (
        <g>
          {/* Crack shadow/depth */}
          <path d="M 29 11 L 32 18 L 27 24 L 30 35 L 28 47" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.6" />
          {/* Crack highlight on left edge */}
          <path d="M 28.5 11 L 31.5 18 L 26.5 24 L 29.5 35 L 27.5 47" fill="none" stroke={highlight} strokeWidth="0.8" opacity="0.8" />
          {/* Core crack void */}
          <path d="M 29 11 L 32 18 L 27 24 L 30 35 L 28 47" fill="none" stroke={dark} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      )}
    </svg>
  );
});

export default WaxSeal;

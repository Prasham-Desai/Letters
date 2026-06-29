import { WaxSealType, SealColor } from '@/types/letter';

const SEAL_COLORS: Record<SealColor, { base: string; dark: string; light: string }> = {
  burgundy:   { base: '#8b2030', dark: '#4a111a', light: '#ba3b4d' },
  forest:     { base: '#2b5030', dark: '#152918', light: '#457a4a' },
  navy:       { base: '#253550', dark: '#111a2b', light: '#3a5075' },
  terracotta: { base: '#b54b35', dark: '#632518', light: '#d96c55' },
  brown:      { base: '#6e4526', dark: '#3b2311', light: '#96633b' },
  purple:     { base: '#4c2e63', dark: '#281736', light: '#704791' },
};

interface Props {
  type: WaxSealType;
  color: SealColor;
  cracked?: boolean;
  size?: number;
}

export default function WaxSeal({ type, color, cracked = false, size = 48 }: Props) {
  const { base, dark, light } = SEAL_COLORS[color] ?? SEAL_COLORS.burgundy;
  const idPrefix = `${type}-${color}-${cracked ? 'c' : 'n'}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`grad-base-${idPrefix}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        
        <radialGradient id={`grad-inner-${idPrefix}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={dark} stopOpacity="0.7"/>
          <stop offset="70%" stopColor={base} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={light} stopOpacity="0.5"/>
        </radialGradient>
        
        <filter id={`drop-shadow-${idPrefix}`} x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#2e1b12" floodOpacity="0.4" />
        </filter>

        <filter id={`inner-emboss-${idPrefix}`}>
          {/* Inner shadow for the engraved look */}
          <feOffset dx="0.5" dy="1"/>
          <feGaussianBlur stdDeviation="0.5" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood floodColor={dark} floodOpacity="0.9" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          
          {/* Subtle highlight on the bottom edge */}
          <feOffset dx="-0.5" dy="-0.5"/>
          <feGaussianBlur stdDeviation="0.5" result="offset-blur-light"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur-light" result="inverse-light"/>
          <feFlood floodColor={light} floodOpacity="0.8" result="color-light"/>
          <feComposite operator="in" in="color-light" in2="inverse-light" result="highlight"/>

          <feMerge>
            <feMergeNode in="shadow"/>
            <feMergeNode in="highlight"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#drop-shadow-${idPrefix})`}>
        {/* Organic outer edge representing squished wax */}
        <path 
          d="M 24 3 C 36 2, 45 10, 46 22 C 47 34, 38 45, 25 45 C 13 46, 3 37, 2 25 C 1 12, 11 4, 24 3 Z" 
          fill={`url(#grad-base-${idPrefix})`}
        />
        
        {/* Raised Rim highlight */}
        <path 
          d="M 24 6 C 34 5, 41 12, 42 22 C 43 32, 35 41, 25 41 C 14 42, 6 34, 5 24 C 4 13, 13 7, 24 6 Z" 
          fill="none" stroke={light} strokeWidth="0.8" strokeOpacity="0.5"
        />

        {/* Depressed center pool where the stamp hit */}
        <path 
          d="M 24 8 C 33 7, 39 13, 40 23 C 41 31, 33 39, 25 39 C 15 40, 8 32, 7 24 C 6 14, 14 9, 24 8 Z" 
          fill={`url(#grad-inner-${idPrefix})`}
        />
      </g>

      {/* Engraved Icon */}
      <g filter={`url(#inner-emboss-${idPrefix})`} fill={base} opacity="0.9" transform="translate(24,24) scale(1.1)">
        {type === 'flower' && (
          <g>
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <ellipse key={i} cx={Math.cos((a * Math.PI) / 180) * 5.5} cy={Math.sin((a * Math.PI) / 180) * 5.5} rx="3" ry="4.5" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="3.5" />
          </g>
        )}
        {type === 'moon' && (
          <path d="M 4 -7 A 7 7 0 1 0 4 7 A 9 9 0 1 1 4 -7 Z" />
        )}
        {type === 'leaf' && (
          <path d="M -5 -7 C -9 -3, -11 3, -9 9 C -7 13, -4 14, -4 14 C -4 14, -1 13, 1 9 C 3 3, 1 -3, -5 -7 Z" transform="rotate(30)" />
        )}
        {type === 'star' && (
          <polygon points="0,-8 2.5,-2 9,-2 4,2.5 6,9 0,5 -6,9 -4,2.5 -9,-2 -2.5,-2" />
        )}
        {type === 'feather' && (
          <path d="M 0 -9 Q 7 -2, 4 9 L 0 12 Q -4 4, -2 -5 Z M 0 12 L -1.5 -5" stroke={base} strokeWidth="0.5"/>
        )}
        {type === 'bear' && (
          <g>
            <circle cx="0" cy="1" r="5.5"/>
            <circle cx="-5" cy="-4" r="3"/>
            <circle cx="5" cy="-4" r="3"/>
            <circle cx="-2" cy="0" r="1.2" fill={dark}/>
            <circle cx="2" cy="0" r="1.2" fill={dark}/>
            <path d="M -2 3 Q 0 5.5, 2 3" stroke={dark} strokeWidth="1" fill="none"/>
          </g>
        )}
        {type === 'bird' && (
          <g fill="none" stroke={base} strokeWidth="2">
            <path d="M -6 -2 Q -1 -7, 3 -4 Q 6 -7, 10 -2"/>
            <circle cx="3" cy="1" r="4" fill={base} stroke="none"/>
            <path d="M 1.5 5 L 0 9 M 4.5 5 L 6 9" strokeWidth="1.2"/>
          </g>
        )}
      </g>

      {/* Crack when opened */}
      {cracked && (
        <g stroke={dark} strokeWidth="1.5" opacity="0.85" filter="url(#drop-shadow-crack)">
          <filter id="drop-shadow-crack">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodColor={light} floodOpacity="0.8" />
          </filter>
          <path d="M 24 10 L 27 18 L 22 22 L 25 32 L 24 40" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      )}
    </svg>
  );
}

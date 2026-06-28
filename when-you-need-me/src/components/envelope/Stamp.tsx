import { StampType } from '@/types/letter';

interface Props { type: StampType; size?: number; }

const STAMP_COLORS = ['#7a95a8','#8a9e8a','#c4785a','#7a95a8','#c9924a','#7a95a8','#8a9e8a','#c4785a','#8a9e8a','#7a95a8'];

export default function Stamp({ type, size = 32 }: Props) {
  const types: StampType[] = ['mountains','rain','rabbit','cat','moon','lighthouse','wildflowers','teacup','forest','cottage'];
  const colorIdx = types.indexOf(type);
  const borderColor = STAMP_COLORS[colorIdx] ?? '#7a95a8';

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Stamp border with perforations */}
      <rect x="2" y="2" width="36" height="36" rx="1" fill="white" opacity="0.85"/>
      <rect x="3" y="3" width="34" height="34" rx="1" stroke={borderColor} strokeWidth="0.5" fill="none"/>
      {/* Perforations */}
      {Array.from({length: 8}).map((_,i) => (
        <g key={i}>
          <circle cx={5 + i * 4.3} cy="2" r="1.2" fill="#c8a878"/>
          <circle cx={5 + i * 4.3} cy="38" r="1.2" fill="#c8a878"/>
          <circle cx="2" cy={5 + i * 4.3} r="1.2" fill="#c8a878"/>
          <circle cx="38" cy={5 + i * 4.3} r="1.2" fill="#c8a878"/>
        </g>
      ))}

      {/* Inner illustration */}
      <g transform="translate(6,6) scale(0.7)">
        {type === 'mountains' && (
          <>
            <polygon points="14,28 24,8 34,28" fill={borderColor} opacity="0.7"/>
            <polygon points="4,28 16,12 28,28" fill={borderColor} opacity="0.5"/>
            <rect x="2" y="26" width="36" height="6" fill="#e0d0b8" opacity="0.6"/>
          </>
        )}
        {type === 'rain' && (
          <>
            <ellipse cx="20" cy="16" rx="10" ry="7" fill={borderColor} opacity="0.6"/>
            {[10,16,22,28].map((x,i) => (
              <line key={i} x1={x} y1="24" x2={x-2} y2="32" stroke={borderColor} strokeWidth="1.2" opacity="0.5"/>
            ))}
          </>
        )}
        {type === 'rabbit' && (
          <>
            <ellipse cx="20" cy="25" rx="8" ry="9" fill={borderColor} opacity="0.6"/>
            <ellipse cx="15" cy="13" rx="3" ry="7" fill={borderColor} opacity="0.5"/>
            <ellipse cx="25" cy="13" rx="3" ry="7" fill={borderColor} opacity="0.5"/>
            <circle cx="18" cy="23" r="1" fill="white" opacity="0.7"/>
            <circle cx="22" cy="23" r="1" fill="white" opacity="0.7"/>
          </>
        )}
        {type === 'cat' && (
          <>
            <circle cx="20" cy="22" r="9" fill={borderColor} opacity="0.6"/>
            <polygon points="12,15 15,8 18,15" fill={borderColor} opacity="0.55"/>
            <polygon points="22,15 25,8 28,15" fill={borderColor} opacity="0.55"/>
            <circle cx="17" cy="21" r="1.5" fill="white" opacity="0.7"/>
            <circle cx="23" cy="21" r="1.5" fill="white" opacity="0.7"/>
            <path d="M18 25 Q20 27 22 25" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7"/>
          </>
        )}
        {type === 'moon' && (
          <>
            <path d="M26 10 A12 12 0 1 0 26 34 A16 16 0 1 1 26 10Z" fill={borderColor} opacity="0.65"/>
            <circle cx="30" cy="14" r="1.5" fill={borderColor} opacity="0.4"/>
            <circle cx="16" cy="28" r="1" fill={borderColor} opacity="0.3"/>
          </>
        )}
        {type === 'lighthouse' && (
          <>
            <rect x="16" y="10" width="8" height="18" fill={borderColor} opacity="0.6"/>
            <polygon points="12,10 28,10 20,6" fill={borderColor} opacity="0.8"/>
            <rect x="14" y="28" width="12" height="6" fill={borderColor} opacity="0.5"/>
            {[12,18,24].map((y,i) => (
              <rect key={i} x="16" y={y} width="8" height="1" fill="white" opacity="0.4"/>
            ))}
          </>
        )}
        {type === 'wildflowers' && (
          <>
            {[[12,18],[20,12],[28,18],[16,22],[24,22]].map(([x,y],i) => (
              <g key={i}>
                <line x1={x} y1={y} x2={x} y2="28" stroke="#8a9e8a" strokeWidth="0.8" opacity="0.5"/>
                <circle cx={x} cy={y} r="3" fill={borderColor} opacity="0.6"/>
              </g>
            ))}
          </>
        )}
        {type === 'teacup' && (
          <>
            <path d="M10 19 L12 31 L28 31 L30 19 Z" fill={borderColor} opacity="0.6"/>
            <path d="M28 22 Q34 22 34 26 Q34 30 28 30" stroke={borderColor} strokeWidth="1.5" fill="none" opacity="0.6"/>
            <rect x="10" y="17" width="20" height="3" rx="1" fill={borderColor} opacity="0.5"/>
            <path d="M16 13 Q18 9 20 13" stroke={borderColor} strokeWidth="1" fill="none" opacity="0.4"/>
          </>
        )}
        {type === 'forest' && (
          <>
            {[[10,21],[16,15],[20,9],[24,15],[30,21]].map(([x,y],i) => (
              <polygon key={i} points={`${x},${y} ${x+7},${y+10} ${x-7},${y+10}`} fill={borderColor} opacity={0.4 + i*0.08}/>
            ))}
          </>
        )}
        {type === 'cottage' && (
          <>
            <polygon points="8,19 20,7 32,19" fill={borderColor} opacity="0.65"/>
            <rect x="10" y="19" width="20" height="14" fill={borderColor} opacity="0.5"/>
            <rect x="17" y="23" width="6" height="10" fill="white" opacity="0.6"/>
            <rect x="12" y="21" width="5" height="5" fill="white" opacity="0.5"/>
          </>
        )}
      </g>

      {/* Postmark circle */}
      <circle cx="32" cy="32" r="5" stroke={borderColor} strokeWidth="0.6" fill="none" opacity="0.4"/>
      <line x1="29" y1="32" x2="35" y2="32" stroke={borderColor} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

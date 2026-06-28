import { WaxSealType, SealColor } from '@/types/letter';

const SEAL_COLORS: Record<SealColor, string> = {
  burgundy:  '#7a2840',
  forest:    '#3a5c3a',
  navy:      '#2c4060',
  terracotta:'#b46048',
  brown:     '#6b4c30',
  purple:    '#4a3860',
};

interface Props {
  type: WaxSealType;
  color: SealColor;
  cracked?: boolean;
  size?: number;
}

export default function WaxSeal({ type, color, cracked = false, size = 36 }: Props) {
  const fill = SEAL_COLORS[color];
  const lightFill = fill + 'cc';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 2px 4px ${fill}55)` }}
    >
      {/* Wax blob */}
      <ellipse cx="20" cy="20" rx="17" ry="16" fill={fill} opacity="0.92"/>
      <ellipse cx="18" cy="17" rx="14" ry="13" fill={lightFill} opacity="0.3"/>

      {/* Icon by type */}
      {type === 'flower' && (
        <g fill="rgba(255,255,255,0.75)" transform="translate(20,20)">
          {[0,60,120,180,240,300].map((a, i) => (
            <ellipse key={i} cx={Math.cos((a * Math.PI) / 180) * 5} cy={Math.sin((a * Math.PI) / 180) * 5} rx="2.5" ry="4"
              transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="2.5" fill="rgba(255,255,255,0.9)"/>
        </g>
      )}
      {type === 'moon' && (
        <path d="M25 10 A10 10 0 1 0 25 30 A14 14 0 1 1 25 10Z" fill="rgba(255,255,255,0.75)"/>
      )}
      {type === 'leaf' && (
        <path d="M20 10 C15 15 13 20 15 26 C17 30 20 31 20 31 C20 31 23 30 25 26 C27 20 25 15 20 10Z"
          fill="rgba(255,255,255,0.75)" strokeWidth="0"/>
      )}
      {type === 'star' && (
        <polygon
          points="20,9 22.5,16 30,16 24,21 26.5,29 20,24 13.5,29 16,21 10,16 17.5,16"
          fill="rgba(255,255,255,0.75)"
        />
      )}
      {type === 'feather' && (
        <path d="M20 10 Q26 16 24 26 L20 30 Q16 22 18 14 Z M20 30 L19 14"
          fill="rgba(255,255,255,0.65)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
      )}
      {type === 'bear' && (
        <g fill="rgba(255,255,255,0.72)">
          <circle cx="20" cy="21" r="6"/>
          <circle cx="15" cy="15" r="3.5"/>
          <circle cx="25" cy="15" r="3.5"/>
          <circle cx="18.5" cy="20" r="1" fill={fill}/>
          <circle cx="21.5" cy="20" r="1" fill={fill}/>
          <path d="M18 23 Q20 25 22 23" stroke={fill} strokeWidth="0.8" fill="none"/>
        </g>
      )}
      {type === 'bird' && (
        <g fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2">
          <path d="M13 18 Q17 14 20 16 Q23 14 27 18"/>
          <circle cx="20" cy="21" r="4" fill="rgba(255,255,255,0.7)" stroke="none"/>
          <path d="M19 24 L18 28 M21 24 L22 28" strokeWidth="0.8"/>
        </g>
      )}

      {/* Crack when opened */}
      {cracked && (
        <g stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" opacity="0.7">
          <path d="M20 12 L22 18 L19 20 L21 28" fill="none"/>
          <path d="M15 16 L18 19" fill="none"/>
        </g>
      )}
    </svg>
  );
}

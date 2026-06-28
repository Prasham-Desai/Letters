'use client';

// Hand-drawn SVG doodles scattered around the desk
const doodleSet = [
  // tiny flower
  { id: 'flower1', x: '5%',  y: '10%',  rot: -12, scale: 0.9, svg: (
    <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
      <line x1="16" y1="36" x2="16" y2="18" stroke="#5a685a" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 14 Q16 8 21 14 Q26 20 21 24 Q16 28 11 24 Q6 20 11 14Z" fill="#95a491" opacity="0.85"/>
      <circle cx="16" cy="19" r="4" fill="#a9722a" opacity="0.8"/>
      <path d="M12 24 Q10 28 12 32" stroke="#5a685a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  )},
  // teacup
  { id: 'teacup1', x: '88%', y: '8%', rot: 8, scale: 1, svg: (
    <svg width="38" height="36" viewBox="0 0 38 36" fill="none">
      <path d="M6 12 L8 26 L28 26 L30 12 Z" stroke="#70615b" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 16 Q34 16 34 20 Q34 24 28 24" stroke="#70615b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="6" y="10" width="24" height="3" rx="1.5" stroke="#70615b" strokeWidth="1.2" fill="none"/>
      {/* steam */}
      <path d="M12 7 Q13 4 12 1" stroke="#888074" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d="M18 8 Q19 5 18 2" stroke="#888074" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      <rect x="4" y="26" width="30" height="2" rx="1" stroke="#70615b" strokeWidth="1.2" fill="none" opacity="0.8"/>
    </svg>
  )},
  // small star
  { id: 'star1', x: '92%', y: '58%', rot: 15, scale: 0.9, svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 14,9 21,9 15.5,13.5 17.5,21 12,16.5 6.5,21 8.5,13.5 3,9 10,9" stroke="#b9823a" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  )},
  // book
  { id: 'book1', x: '4%', y: '68%', rot: -8, scale: 1.1, svg: (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
      <rect x="6" y="2" width="24" height="38" rx="2" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <line x1="8" y1="2" x2="8" y2="40" stroke="#70615b" strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>
      <line x1="12" y1="8" x2="28" y2="8" stroke="#70615b" strokeWidth="1.2" opacity="0.6"/>
      <line x1="12" y1="12" x2="28" y2="12" stroke="#70615b" strokeWidth="1.2" opacity="0.6"/>
      <line x1="12" y1="16" x2="22" y2="16" stroke="#70615b" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  )},
  // leaf
  { id: 'leaf1', x: '82%', y: '85%', rot: 35, scale: 0.9, svg: (
    <svg width="22" height="32" viewBox="0 0 22 32" fill="none">
      <path d="M11 2 C5 8 3 16 5 22 C7 28 11 30 11 30 C11 30 15 28 17 22 C19 16 17 8 11 2Z" stroke="#5a685a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="11" y1="5" x2="11" y2="29" stroke="#5a685a" strokeWidth="1.2" opacity="0.8"/>
      <path d="M11 12 Q15 14 17 18" stroke="#5a685a" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M11 12 Q7 14 5 18" stroke="#5a685a" strokeWidth="1" fill="none" opacity="0.7"/>
    </svg>
  )},
  // moon
  { id: 'moon1', x: '45%', y: '3%', rot: -12, scale: 0.85, svg: (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
      <path d="M14 3 A10 10 0 1 0 14 25 A6 6 0 1 1 14 3Z" stroke="#5a7588" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="6" r="1.5" stroke="#5a7588" strokeWidth="1.2" fill="none" opacity="0.7"/>
    </svg>
  )},
  // paper clip
  { id: 'clip1', x: '65%', y: '12%', rot: 25, scale: 1.1, svg: (
    <svg width="16" height="36" viewBox="0 0 16 36" fill="none">
      <path d="M12 8 L12 26 Q12 32 8 32 Q4 32 4 26 L4 6 Q4 2 8 2 Q12 2 12 6 L12 24 Q12 28 8 28 Q6 28 6 26 L6 8"
        stroke="#888074" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )},
  // small bird
  { id: 'bird1', x: '25%', y: '88%', rot: 8, scale: 1, svg: (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M4 14 Q12 8 16 10 Q20 8 28 14" stroke="#70615b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="14" r="5" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <path d="M15 18 L14 22 M17 18 L18 22" stroke="#70615b" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="14" cy="13" r="1.2" fill="#70615b" opacity="0.9"/>
    </svg>
  )},
  // MORE DOODLES:
  // envelope
  { id: 'env1', x: '35%', y: '6%', rot: -15, scale: 0.9, svg: (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <rect x="2" y="2" width="28" height="20" rx="2" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <path d="M2 4 L16 14 L30 4" stroke="#70615b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  )},
  // pencil
  { id: 'pencil1', x: '18%', y: '45%', rot: 75, scale: 1.2, svg: (
    <svg width="10" height="48" viewBox="0 0 10 48" fill="none">
      <rect x="2" y="10" width="6" height="30" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <path d="M2 10 L5 2 L8 10 Z" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <rect x="2" y="40" width="6" height="6" stroke="#70615b" strokeWidth="1.5" fill="none"/>
      <line x1="5" y1="2" x2="5" y2="4" stroke="#70615b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  // hearts
  { id: 'hearts1', x: '78%', y: '45%', rot: -20, scale: 0.8, svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 21 L10 19 C5 14 2 11 2 7 C2 4 4 2 7 2 C9 2 11 3 12 5 C13 3 15 2 17 2 C20 2 22 4 22 7 C22 11 19 14 14 19 L12 21 Z" stroke="#9a3855" strokeWidth="1.5" fill="none"/>
    </svg>
  )},
  // squiggly arrow
  { id: 'arrow1', x: '55%', y: '85%', rot: -10, scale: 1, svg: (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
      <path d="M2 12 Q10 2 18 12 T34 12" stroke="#70615b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M28 6 L34 12 L28 18" stroke="#70615b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )},
];

export default function Doodles() {
  return (
    <>
      {doodleSet.map(d => (
        <div
          key={d.id}
          className="doodle"
          style={{
            left: d.x,
            top: d.y,
            transform: `rotate(${d.rot}deg) scale(${d.scale})`,
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          {d.svg}
        </div>
      ))}
    </>
  );
}

'use client';

// Hand-drawn SVG doodles scattered around the desk
const doodleSet = [
  // elegant butterfly
  { id: 'butterfly1', x: '5%',  y: '10%',  rot: -12, scale: 1.1, svg: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 12 Q24 4 30 14 Q32 20 22 18 Q16 26 22 30 Q28 28 20 20 Z" fill="#9c7a87" opacity="0.6"/>
      <path d="M18 12 Q12 4 6 14 Q4 20 14 18 Q20 26 14 30 Q8 28 16 20 Z" fill="#9c7a87" opacity="0.6"/>
      <path d="M18 10 C18 10 16 16 16 22 C16 26 18 28 18 28 C18 28 20 26 20 22 C20 16 18 10 18 10 Z" fill="#6d535b"/>
      <path d="M18 10 Q14 6 12 4 M18 10 Q22 6 24 4" stroke="#6d535b" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )},
  // tulip
  { id: 'tulip1', x: '88%', y: '8%', rot: 15, scale: 1.2, svg: (
    <svg width="24" height="42" viewBox="0 0 24 42" fill="none">
      <path d="M12 20 Q12 30 12 40" stroke="#718667" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 32 Q6 28 4 22 Q4 32 12 36" fill="#718667" opacity="0.8"/>
      <path d="M6 10 C6 2 12 2 12 2 C12 2 18 2 18 10 C20 16 16 20 12 24 C8 20 4 16 6 10 Z" fill="#b96a75" opacity="0.85"/>
      <path d="M12 2 L8 12 L12 24 L16 12 Z" fill="#a55964" opacity="0.4"/>
    </svg>
  )},
  // cloud with stars
  { id: 'cloud1', x: '90%', y: '55%', rot: 5, scale: 1, svg: (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      <path d="M12 18 C8 18 6 14 8 10 C10 6 16 8 18 8 C20 4 28 4 30 10 C34 10 36 16 32 20 C28 24 16 22 12 18 Z" fill="#aab8c4" opacity="0.7"/>
      <path d="M12 22 L12 28 M20 20 L20 26 M28 22 L28 28" stroke="#8796a5" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
      <polygon points="12,28 13,30 15,30 13.5,31.5 14,33.5 12,32.5 10,33.5 10.5,31.5 9,30 11,30" fill="#e0c765"/>
      <polygon points="28,28 29,30 31,30 29.5,31.5 30,33.5 28,32.5 26,33.5 26.5,31.5 25,30 27,30" fill="#e0c765"/>
    </svg>
  )},
  // paper crane
  { id: 'crane1', x: '4%', y: '68%', rot: -18, scale: 1.1, svg: (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
      <path d="M16 12 L30 4 L18 16 L16 12 Z" fill="#d9d0c5" stroke="#7e746a" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M16 12 L2 4 L14 16 L16 12 Z" fill="#e5dfd8" stroke="#7e746a" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M16 12 L20 22 L18 16 L14 16 L12 22 L16 12 Z" fill="#c3bab0" stroke="#7e746a" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M20 22 L26 18 M12 22 L6 18 M16 12 L20 6 L18 2 M20 6 L22 4" stroke="#7e746a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  // vintage key
  { id: 'key1', x: '82%', y: '85%', rot: 35, scale: 1.1, svg: (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
      <circle cx="8" cy="10" r="5" stroke="#8c7756" strokeWidth="1.5" fill="none"/>
      <circle cx="8" cy="10" r="2" fill="#8c7756"/>
      <line x1="13" y1="10" x2="36" y2="10" stroke="#8c7756" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 10 L28 16 L32 16 L32 10 M32 10 L32 14 L36 14 L36 10" stroke="#8c7756" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )},
  // sparkles
  { id: 'sparkles1', x: '45%', y: '3%', rot: 0, scale: 1, svg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 C12 8 16 12 22 12 C16 12 12 16 12 22 C12 16 8 12 2 12 C8 12 12 8 12 2 Z" fill="#d8a868" opacity="0.8"/>
      <circle cx="6" cy="6" r="1.5" fill="#d8a868" opacity="0.6"/>
      <circle cx="20" cy="18" r="1" fill="#d8a868" opacity="0.6"/>
    </svg>
  )},
  // bow
  { id: 'bow1', x: '65%', y: '12%', rot: 15, scale: 1.2, svg: (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M16 12 C10 6 2 8 4 16 C6 18 12 14 16 12 Z" fill="#af7f8f" stroke="#865d6c" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M16 12 C22 6 30 8 28 16 C26 18 20 14 16 12 Z" fill="#af7f8f" stroke="#865d6c" strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="16" cy="12" r="2.5" fill="#865d6c"/>
      <path d="M14 14 Q10 20 8 24 M18 14 Q22 20 24 24" stroke="#865d6c" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  // sleeping cat
  { id: 'cat1', x: '25%', y: '88%', rot: 4, scale: 1.1, svg: (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
      <path d="M10 18 Q4 18 4 12 C4 8 8 6 12 8 C16 10 20 8 24 8 C28 8 30 12 28 18 Z" fill="#696568"/>
      <path d="M6 10 L4 4 L10 6" stroke="#696568" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M24 6 L30 4 L28 10" stroke="#696568" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M28 18 Q32 16 30 10" stroke="#696568" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M12 14 Q14 16 16 14 Q18 16 20 14" stroke="#eaddd9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )},
  // crystal
  { id: 'crystal1', x: '35%', y: '6%', rot: -25, scale: 1, svg: (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
      <polygon points="12,2 18,10 12,30 6,10" fill="#a4b4bc" opacity="0.6" stroke="#718691" strokeWidth="1" strokeLinejoin="round"/>
      <polygon points="12,2 18,10 12,12" fill="#d1e0e8" opacity="0.8"/>
      <polygon points="12,2 6,10 12,12" fill="#889da8" opacity="0.8"/>
      <polygon points="6,10 12,12 12,30" fill="#6d838f" opacity="0.7"/>
      <polygon points="18,10 12,12 12,30" fill="#a0b1ba" opacity="0.7"/>
    </svg>
  )},
  // cupids arrow
  { id: 'arrow2', x: '18%', y: '45%', rot: 45, scale: 1.1, svg: (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
      <line x1="6" y1="12" x2="34" y2="12" stroke="#8a6f65" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 8 L36 12 L30 16" stroke="#8a6f65" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8 L4 12 L8 16 M12 8 L8 12 L12 16" stroke="#8a6f65" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  // cherries
  { id: 'cherries1', x: '78%', y: '45%', rot: -10, scale: 1, svg: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="8" cy="20" r="5" fill="#a14251"/>
      <circle cx="20" cy="18" r="5" fill="#a14251"/>
      <path d="M8 15 Q12 6 16 4 M20 13 Q18 6 16 4" stroke="#718667" strokeWidth="1.5" fill="none"/>
      <path d="M16 4 C20 4 22 2 24 6 C20 8 16 6 16 4 Z" fill="#849b78"/>
    </svg>
  )},
  // latte cup
  { id: 'latte1', x: '55%', y: '85%', rot: 5, scale: 1.1, svg: (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path d="M6 4 L8 20 Q16 24 24 20 L26 4 Z" fill="#e8dcc4" stroke="#8a7362" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M26 8 Q32 8 32 12 Q32 16 25 16" stroke="#8a7362" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="16" cy="4" rx="10" ry="3" fill="#6f503b"/>
      <path d="M16 7 C14 5 12 5 12 3 C12 2 14 2 16 4 C18 2 20 2 20 3 C20 5 18 5 16 7 Z" fill="#e8dcc4" opacity="0.9"/>
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

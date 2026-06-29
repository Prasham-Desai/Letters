import { PlacedEnvelope, LetterMeta } from '@/types/letter';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function overlaps(a: Rect, b: Rect, padding = 24): boolean {
  return !(
    a.x + a.width + padding < b.x ||
    b.x + b.width + padding < a.x ||
    a.y + a.height + padding < b.y ||
    b.y + b.height + padding < a.y
  );
}

// Seeded pseudo-random number generator for deterministic placement
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function placeEnvelopes(
  letters: LetterMeta[],
  containerWidth: number,
  containerHeight: number,
  isMobile: boolean
): PlacedEnvelope[] {
  const W = isMobile ? 160 : 200;
  const H = isMobile ? 110 : 136;

  const placed: PlacedEnvelope[] = [];

  letters.forEach((letter) => {
    const rand = seededRandom(stringToSeed(letter.id));

    let attempts = 0;
    let hasOverlap = true;
    
    // Default candidate if we fail to resolve overlap
    const candidate: Rect = { x: 0, y: 0, width: W, height: H };

    while (hasOverlap && attempts < 150) {
      // Pick any spot on the desk
      candidate.x = 12 + rand() * (containerWidth - W - 24);
      candidate.y = 12 + rand() * (containerHeight - H - 24);
      
      // Clamp to be strictly within desk bounds just to be safe
      candidate.x = Math.max(12, Math.min(containerWidth - W - 12, candidate.x));
      candidate.y = Math.max(12, Math.min(containerHeight - H - 12, candidate.y));

      // Check if it overlaps heavily with existing letters (allow slight overlap by reducing padding to 12)
      hasOverlap = placed.some(p => overlaps(candidate, p, 12));
      attempts++;
    }

    placed.push({
      ...letter,
      x: candidate.x,
      y: candidate.y,
      width: W,
      height: H,
    });
  });

  return placed;
}

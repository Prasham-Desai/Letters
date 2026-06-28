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

  // Divide desk into loose zones
  const cols = isMobile ? 2 : 3;
  const rows = Math.ceil(letters.length / cols);
  const zoneW = containerWidth / cols;
  const zoneH = containerHeight / rows;

  letters.forEach((letter, i) => {
    const rand = seededRandom(stringToSeed(letter.id));

    const col = i % cols;
    const row = Math.floor(i / cols);

    const baseX = col * zoneW + zoneW * 0.1;
    const baseY = row * zoneH + zoneH * 0.1;
    const maxX = col * zoneW + zoneW * 0.9 - W;
    const maxY = row * zoneH + zoneH * 0.9 - H;

    let x = baseX + rand() * Math.max(0, maxX - baseX);
    let y = baseY + rand() * Math.max(0, maxY - baseY);

    // Clamp to container
    x = Math.max(8, Math.min(containerWidth - W - 8, x));
    y = Math.max(8, Math.min(containerHeight - H - 8, y));

    // Try to resolve overlaps
    let attempts = 0;
    const candidate: Rect = { x, y, width: W, height: H };
    while (attempts < 20) {
      const hasOverlap = placed.some(p => overlaps(candidate, p));
      if (!hasOverlap) break;
      candidate.x = baseX + rand() * Math.max(0, maxX - baseX);
      candidate.y = baseY + rand() * Math.max(0, maxY - baseY);
      candidate.x = Math.max(8, Math.min(containerWidth - W - 8, candidate.x));
      candidate.y = Math.max(8, Math.min(containerHeight - H - 8, candidate.y));
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

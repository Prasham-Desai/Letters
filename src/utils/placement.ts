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
  const W = isMobile ? 180 : 250;
  const H = isMobile ? 124 : 170;

  const placed: PlacedEnvelope[] = [];

  // 8 invisible positions (cells)
  const cols = isMobile ? 2 : 4;
  const rows = isMobile ? 4 : 2;
  const slotW = containerWidth / cols;
  const slotH = containerHeight / rows;

  const availableSlots: { x: number, y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
       // exact center of the cell
       let cx = c * slotW + (slotW - W) / 2;
       let cy = r * slotH + (slotH - H) / 2;
       availableSlots.push({ x: cx, y: cy });
    }
  }

  letters.forEach((letter) => {
    const rand = seededRandom(stringToSeed(letter.id));

    if (availableSlots.length > 0) {
      // Pick a random available slot
      const idx = Math.floor(rand() * availableSlots.length);
      const slot = availableSlots[idx];
      availableSlots.splice(idx, 1); // remove so it's not reused (no overlap)

      // Organic jitter bounded within the cell so they never overlap
      const jitterX = (rand() - 0.5) * Math.max(0, slotW - W);
      const jitterY = (rand() - 0.5) * Math.max(0, slotH - H);

      let finalX = slot.x + jitterX;
      let finalY = slot.y + jitterY;

      // Clamp to container bounds just to be absolutely safe
      finalX = Math.max(12, Math.min(containerWidth - W - 12, finalX));
      finalY = Math.max(12, Math.min(containerHeight - H - 12, finalY));

      placed.push({
        ...letter,
        x: finalX,
        y: finalY,
        width: W,
        height: H,
      });
    } else {
      // Fallback if more than 8 letters are somehow passed (should be capped at 5)
      placed.push({
        ...letter,
        x: 12,
        y: 12,
        width: W,
        height: H,
      });
    }
  });

  return placed;
}

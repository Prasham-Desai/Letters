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
  isMobile: boolean,
  assignedCells: Record<string, number> = {}
): PlacedEnvelope[] {
  const W = isMobile ? 120 : 150;
  const H = isMobile ? 82 : 102;

  const placed: PlacedEnvelope[] = [];

  // 8 invisible positions (cells)
  const cols = isMobile ? 2 : 4;
  const rows = isMobile ? 4 : 2;
  const slotW = containerWidth / cols;
  const slotH = containerHeight / rows;



  // Let's rewrite the core loop completely to be truly independent:
  const TOTAL_CELLS = cols * rows;
  const validCells: { r: number, c: number }[] = [];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
       if (r === rows - 1 && (c === 0 || c === cols - 1)) continue;
       validCells.push({ r, c });
    }
  }

  // To prevent collisions, we track taken cells for this specific render.
  const takenCells = new Set<number>();

  // Sort letters deterministically so collision resolution is always the same
  // regardless of the order they were passed in
  const sortedLetters = [...letters].sort((a, b) => a.id.localeCompare(b.id));

  sortedLetters.forEach((letter) => {
    const rand = seededRandom(stringToSeed(letter.id));
    
    let choiceIndex = -1;

    // If this letter already has an assigned cell, and it's not taken, try to use it
    if (assignedCells[letter.id] !== undefined && !takenCells.has(assignedCells[letter.id])) {
      choiceIndex = assignedCells[letter.id];
    } else {
      // Primary choice based on hash
      choiceIndex = Math.floor(rand() * validCells.length);
      
      // Linear probing for collision resolution
      let attempts = 0;
      while (takenCells.has(choiceIndex) && attempts < validCells.length) {
        choiceIndex = (choiceIndex + 1) % validCells.length;
        attempts++;
      }
      
      // Cache the newly assigned cell for this letter so it stays persistent
      assignedCells[letter.id] = choiceIndex;
    }
    
    takenCells.add(choiceIndex);
    const cell = validCells[choiceIndex] || validCells[0];

    const cx = cell.c * slotW + (slotW - W) / 2;
    const cy = cell.r * slotH + (slotH - H) / 2;

    const jitterX = (rand() - 0.5) * Math.max(0, slotW - W);
    const jitterY = (rand() - 0.5) * Math.max(0, slotH - H);

    let finalX = cx + jitterX;
    let finalY = cy + jitterY;

    finalX = Math.max(12, Math.min(containerWidth - W - 12, finalX));
    finalY = Math.max(12, Math.min(containerHeight - H - 12, finalY));

    placed.push({
      ...letter,
      x: finalX,
      y: finalY,
      width: W,
      height: H,
    });
  });

  return placed;
}

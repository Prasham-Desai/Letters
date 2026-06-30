'use server';

import fs from 'fs';
import path from 'path';
import { LetterMeta, PaperTone, WaxSealType, SealColor, StampType, LetterCategory } from '@/types/letter';

// Basic seeded random to ensure consistent visual assignments
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
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const PAPER_COLORS = ['cream', 'ivory', 'warm', 'aged', 'soft'];
const SEAL_TYPES = ['flower', 'moon', 'feather', 'bird', 'bear', 'star', 'leaf'];
const SEAL_COLORS = ['burgundy', 'navy', 'forest', 'terracotta', 'brown', 'purple'];
const STAMPS = ['wildflowers', 'rain', 'lighthouse', 'cottage', 'mountains', 'moon'];

export async function getLettersAction(): Promise<LetterMeta[]> {
  const dir = path.join(process.cwd(), 'public/letters');
  
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  } catch (error) {
    console.error("Could not read letters directory", error);
    return [];
  }

  // Sort files numerically if possible, so they are somewhat ordered
  files.sort((a, b) => {
    const numA = parseInt(a.replace('.md', ''), 10);
    const numB = parseInt(b.replace('.md', ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  return files.map((file) => {
    const id = file.replace('.md', '');
    const rand = seededRandom(stringToSeed(id));
    
    // Pick deterministic random values for each property
    const paper = PAPER_COLORS[Math.floor(rand() * PAPER_COLORS.length)] as PaperTone;
    const sealType = SEAL_TYPES[Math.floor(rand() * SEAL_TYPES.length)] as WaxSealType;
    const seal = SEAL_COLORS[Math.floor(rand() * SEAL_COLORS.length)] as SealColor;
    const stamp = STAMPS[Math.floor(rand() * STAMPS.length)] as StampType;
    const rotation = Math.floor(rand() * 16) - 8; // -8 to 8

    return {
      id,
      title: `Letter ${id}`, // No longer displayed, but kept for type safety
      file,
      stamp,
      seal,
      sealType,
      rotation,
      paper,
      category: 'comfort' as LetterCategory
    };
  });
}

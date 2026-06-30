import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic seeded random to ensure consistent visual assignments
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function stringToSeed(str) {
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

function generateLetters() {
  const dir = path.join(__dirname, '../public/letters');
  
  let files = [];
  try {
    files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  } catch (error) {
    console.error("Could not read letters directory", error);
    process.exit(1);
  }

  // Sort files numerically if possible
  files.sort((a, b) => {
    const numA = parseInt(a.replace('.md', ''), 10);
    const numB = parseInt(b.replace('.md', ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const letters = files.map((file) => {
    const id = file.replace('.md', '');
    const rand = seededRandom(stringToSeed(id));
    
    // Pick deterministic random values for each property
    const paper = PAPER_COLORS[Math.floor(rand() * PAPER_COLORS.length)];
    const sealType = SEAL_TYPES[Math.floor(rand() * SEAL_TYPES.length)];
    const seal = SEAL_COLORS[Math.floor(rand() * SEAL_COLORS.length)];
    const stamp = STAMPS[Math.floor(rand() * STAMPS.length)];
    const rotation = Math.floor(rand() * 16) - 8; // -8 to 8

    return {
      id,
      title: `Letter ${id}`,
      file,
      stamp,
      seal,
      sealType,
      rotation,
      paper,
      category: 'comfort'
    };
  });

  const outDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outDir, 'letters.json'),
    JSON.stringify(letters, null, 2)
  );
  console.log(`Generated src/data/letters.json with ${letters.length} letters.`);
}

generateLetters();

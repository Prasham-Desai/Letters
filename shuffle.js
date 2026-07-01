const fs = require('fs');
const path = require('path');

const lettersDir = path.join(__dirname, 'public', 'letters');

// We want to shuffle files 4 to 50.
const filesToShuffle = [];
for (let i = 4; i <= 50; i++) {
  if (fs.existsSync(path.join(lettersDir, `${i}.md`))) {
    filesToShuffle.push(i);
  }
}

if (filesToShuffle.length === 0) {
  console.log("No files found to shuffle.");
  process.exit(0);
}

// Fisher-Yates Shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffledFiles = shuffleArray(filesToShuffle);

console.log(`Original: ${filesToShuffle.join(', ')}`);
console.log(`Shuffled: ${shuffledFiles.join(', ')}`);

// Step 1: Rename all to temp names to avoid overwriting conflicts
filesToShuffle.forEach(fileNum => {
  const oldPath = path.join(lettersDir, `${fileNum}.md`);
  const tempPath = path.join(lettersDir, `temp_${fileNum}.md`);
  fs.renameSync(oldPath, tempPath);
});

// Step 2: Rename from temp names to their new shuffled names
filesToShuffle.forEach((originalNum, index) => {
  const newNum = shuffledFiles[index];
  const tempPath = path.join(lettersDir, `temp_${originalNum}.md`);
  const newPath = path.join(lettersDir, `${newNum}.md`);
  fs.renameSync(tempPath, newPath);
  console.log(`Renamed ${originalNum}.md -> ${newNum}.md`);
});

console.log("Shuffle complete.");

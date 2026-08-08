/**
 * process-skill-images.mjs
 *
 * For every PNG in public/assets/skills/:
 *  1. Flood-fills background from all 4 corners → makes transparent
 *  2. Trims excess transparent space
 *  3. Resizes to 128x128 (contain, transparent fill)
 *  4. Saves back as clean PNG
 *
 * Run: node scripts/process-skill-images.mjs
 */

import sharp from 'sharp';
import { readdir, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const SKILLS_DIR  = 'public/assets/skills';
const OUTPUT_SIZE = 128;

// Tolerance: how different a pixel can be from the seed color and still be removed.
// Higher = more aggressive. 80 handles off-white, light grey, cream etc.
const TOLERANCE = 80;

function colorDiff(r1, g1, b1, r2, g2, b2) {
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

/**
 * Flood-fill background removal starting from all 4 corners.
 * Uses BFS to find all connected background pixels and makes them transparent.
 */
async function removeBackground(inputBuffer) {
  const image = sharp(inputBuffer);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels  = new Uint8ClampedArray(data);
  const visited = new Uint8Array(width * height); // 0 = unvisited

  const idx = (x, y) => (y * width + x) * channels;

  function floodFill(startX, startY) {
    const si    = idx(startX, startY);
    const seedR = pixels[si];
    const seedG = pixels[si + 1];
    const seedB = pixels[si + 2];
    const seedA = pixels[si + 3];

    // Don't flood fill from already-transparent pixels
    if (seedA < 128) return;

    const queue = [[startX, startY]];
    visited[startY * width + startX] = 1;

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const pi     = idx(x, y);

      // Make this pixel transparent
      pixels[pi + 3] = 0;

      // Check 4 neighbours
      const neighbours = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
      for (const [nx, ny] of neighbours) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const ni = ny * width + nx;
        if (visited[ni]) continue;
        visited[ni] = 1;

        const pi2 = ni * channels;
        const a   = pixels[pi2 + 3];
        if (a < 128) continue; // already transparent

        const diff = colorDiff(
          pixels[pi2], pixels[pi2+1], pixels[pi2+2],
          seedR, seedG, seedB
        );
        if (diff <= TOLERANCE) {
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Seed from all 4 corners
  floodFill(0,         0);
  floodFill(width - 1, 0);
  floodFill(0,         height - 1);
  floodFill(width - 1, height - 1);

  return sharp(Buffer.from(pixels), {
    raw: { width, height, channels },
  }).png().toBuffer();
}

async function processImage(filePath) {
  const name = basename(filePath);
  if (extname(filePath).toLowerCase() !== '.png') return;

  console.log(`Processing: ${name}`);
  try {
    const original   = await sharp(filePath).toBuffer();
    const noBg       = await removeBackground(original);

    const processed  = await sharp(noBg)
      .trim({ threshold: 10 })
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
        fit:        'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    await writeFile(filePath, processed);
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name} —`, err.message);
  }
}

async function main() {
  const files = await readdir(SKILLS_DIR);
  const pngs  = files.filter(f => extname(f).toLowerCase() === '.png');
  console.log(`Found ${pngs.length} PNG files\n`);
  for (const file of pngs) {
    await processImage(join(SKILLS_DIR, file));
  }
  console.log('\n✅ All done.');
}

main().catch(console.error);

/**
 * removebg.mjs
 *
 * Removes background from all PNGs in public/assets/skills/ using remove.bg API.
 * Free tier: 50 images/month — enough for all skill logos.
 *
 * Usage:
 *   1. Get free API key from https://www.remove.bg/api
 *   2. Run: node scripts/removebg.mjs YOUR_API_KEY
 */

import { readdir, writeFile, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import sharp from 'sharp';

const SKILLS_DIR  = 'public/assets/skills';
const OUTPUT_SIZE = 128;
const API_KEY     = process.argv[2];

if (!API_KEY) {
  console.error('❌ No API key provided.');
  console.error('   Get a free key at https://www.remove.bg/api');
  console.error('   Usage: node scripts/removebg.mjs YOUR_API_KEY');
  process.exit(1);
}

async function removeBg(filePath) {
  const name    = basename(filePath);
  const imgData = await readFile(filePath);

  // Build multipart form
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const CRLF     = '\r\n';

  const head =
    `--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="image_file"; filename="${name}"${CRLF}` +
    `Content-Type: image/png${CRLF}${CRLF}`;

  const tail =
    `${CRLF}--${boundary}${CRLF}` +
    `Content-Disposition: form-data; name="size"${CRLF}${CRLF}` +
    `auto` +
    `${CRLF}--${boundary}--${CRLF}`;

  const body = Buffer.concat([
    Buffer.from(head),
    imgData,
    Buffer.from(tail),
  ]);

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method:  'POST',
    headers: {
      'X-Api-Key':     API_KEY,
      'Content-Type':  `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status} — ${err}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function processImage(filePath) {
  const name = basename(filePath);
  if (extname(filePath).toLowerCase() !== '.png') return;

  console.log(`Processing: ${name}`);
  try {
    // 1. Remove background via API
    const noBg = await removeBg(filePath);

    // 2. Trim + resize to 128x128 with transparent fill
    const processed = await sharp(noBg)
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

  // Small delay to avoid hammering the API
  await new Promise(r => setTimeout(r, 300));
}

async function main() {
  const files = await readdir(SKILLS_DIR);
  const pngs  = files.filter(f => extname(f).toLowerCase() === '.png');

  console.log(`Found ${pngs.length} PNG files — using remove.bg API\n`);
  console.log(`Note: Free tier = 50 credits/month. This will use ${pngs.length} credits.\n`);

  for (const file of pngs) {
    await processImage(join(SKILLS_DIR, file));
  }

  console.log('\n✅ All done.');
}

main().catch(console.error);

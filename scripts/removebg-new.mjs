/**
 * removebg-new.mjs
 * Only processes the two new skill images (openmp + mpi).
 * Usage: node scripts/removebg-new.mjs YOUR_API_KEY
 */

import { writeFile, readFile } from 'fs/promises';
import sharp from 'sharp';

const FILES = [
  'public/assets/skills/openmp.png',
  'public/assets/skills/mpi.png',
];
const OUTPUT_SIZE = 128;
const API_KEY     = process.argv[2];

if (!API_KEY) {
  console.error('Usage: node scripts/removebg-new.mjs YOUR_API_KEY');
  process.exit(1);
}

async function removeBg(filePath) {
  const { basename } = await import('path');
  const name    = basename(filePath);
  const imgData = await readFile(filePath);

  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const CRLF     = '\r\n';
  const head     = `--${boundary}${CRLF}Content-Disposition: form-data; name="image_file"; filename="${name}"${CRLF}Content-Type: image/png${CRLF}${CRLF}`;
  const tail     = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="size"${CRLF}${CRLF}auto${CRLF}--${boundary}--${CRLF}`;
  const body     = Buffer.concat([Buffer.from(head), imgData, Buffer.from(tail)]);

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method:  'POST',
    headers: { 'X-Api-Key': API_KEY, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
    body,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} — ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const filePath of FILES) {
  console.log(`Processing: ${filePath}`);
  try {
    const noBg      = await removeBg(filePath);
    const processed = await sharp(noBg)
      .trim({ threshold: 10 })
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(filePath, processed);
    console.log(`  ✅ done`);
  } catch (e) {
    console.error(`  ❌ ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 300));
}
console.log('\nDone — used 2 credits.');

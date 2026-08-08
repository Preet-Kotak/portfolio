import sharp from 'sharp';
import { writeFile, readFile } from 'fs/promises';

const FILES = [
  'public/assets/skills/express.png',
  'public/assets/skills/supabase.png',
];
const OUTPUT_SIZE     = 128;
const WHITE_THRESHOLD = 240;

async function removeWhiteBackground(inputBuffer) {
  const { data, info } = await sharp(inputBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = new Uint8ClampedArray(data);
  for (let i = 0; i < pixels.length; i += channels) {
    if (pixels[i] >= WHITE_THRESHOLD && pixels[i+1] >= WHITE_THRESHOLD && pixels[i+2] >= WHITE_THRESHOLD) {
      pixels[i + 3] = 0;
    }
  }
  return sharp(Buffer.from(pixels), { raw: { width, height, channels } }).png().toBuffer();
}

for (const filePath of FILES) {
  try {
    const original     = await readFile(filePath);
    const noBackground = await removeWhiteBackground(original);
    const processed    = await sharp(noBackground)
      .trim()
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();

    // write directly to buffer instead of rename
    await writeFile(filePath, processed);
    console.log(`✅ ${filePath}`);
  } catch (e) {
    console.error(`❌ ${filePath} —`, e.message);
  }
}

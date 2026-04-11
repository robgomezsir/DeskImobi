/**
 * Gera favicons e PNGs a partir de logo/SIMBOLO.svg (fonte única).
 * Copia o SVG para public/favicon.svg.
 * Executar: npm run icons (a partir de frontend/)
 */
import { mkdir, writeFile, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import toIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, '..');
const repoRoot = join(frontendRoot, '..');
const logoDir = join(repoRoot, 'logo');
const publicDir = join(frontendRoot, 'public');
const iconsDir = join(publicDir, 'icons');

const SRC_SVG = join(logoDir, 'SIMBOLO.svg');

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

async function ensureSource() {
  if (!existsSync(SRC_SVG)) {
    throw new Error(`Arquivo não encontrado: ${SRC_SVG}`);
  }
  await mkdir(iconsDir, { recursive: true });
}

async function symbolResizePng(size, outPath, background = transparent) {
  await sharp(SRC_SVG)
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toFile(outPath);
}

/** Apple: símbolo sobre fundo preto BrokerVision */
async function appleTouchGreen() {
  const size = 180;
  const pad = Math.round(size * 0.11);
  const inner = size - pad * 2;
  await sharp(SRC_SVG)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
}

/** PWA maskable: área segura ~80% */
async function maskable512() {
  const size = 512;
  const pad = Math.round(size * 0.1);
  const inner = size - pad * 2;
  await sharp(SRC_SVG)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png()
    .toFile(join(iconsDir, 'bv-maskable-512.png'));
}

async function main() {
  await ensureSource();

  await copyFile(SRC_SVG, join(publicDir, 'favicon.svg'));

  await symbolResizePng(16, join(iconsDir, 'bv-symbol-green-16.png'));
  await symbolResizePng(32, join(iconsDir, 'bv-symbol-green-32.png'));
  await symbolResizePng(192, join(iconsDir, 'bv-symbol-green-192.png'));
  await symbolResizePng(512, join(iconsDir, 'bv-symbol-green-512.png'));

  await symbolResizePng(32, join(iconsDir, 'bv-symbol-black-32.png'));
  await symbolResizePng(32, join(iconsDir, 'bv-symbol-white-32.png'));

  const buf16 = await sharp(SRC_SVG)
    .resize(16, 16, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();
  const buf32 = await sharp(SRC_SVG)
    .resize(32, 32, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();
  const buf48 = await sharp(SRC_SVG)
    .resize(48, 48, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();

  await writeFile(join(publicDir, 'favicon.ico'), await toIco([buf16, buf32, buf48]));

  await appleTouchGreen();
  await maskable512();

  console.log('Favicon SVG + ícones gerados a partir de logo/SIMBOLO.svg → public/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

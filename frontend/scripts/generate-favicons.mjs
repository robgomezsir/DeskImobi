/**
 * Gera favicons e ícones a partir de logo/SIMBOLO VERDE|PRETO|BRANCO.png
 * Executar: node scripts/generate-favicons.mjs (a partir de frontend/)
 */
import { mkdir, writeFile } from 'fs/promises';
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

const SRC = {
  green: join(logoDir, 'SIMBOLO VERDE.png'),
  black: join(logoDir, 'SIMBOLO PRETO.png'),
  white: join(logoDir, 'SIMBOLO BRANCO.png'),
};

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

async function ensureDirs() {
  if (!existsSync(SRC.green)) {
    throw new Error(`Arquivo não encontrado: ${SRC.green}`);
  }
  await mkdir(iconsDir, { recursive: true });
}

async function symbolResize(inputPath, size, outPath, background = transparent) {
  await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toFile(outPath);
}

/** Apple: símbolo verde sobre fundo preto BrokerVision */
async function appleTouchGreen() {
  const size = 180;
  const pad = Math.round(size * 0.11);
  const inner = size - pad * 2;
  await sharp(SRC.green)
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
  await sharp(SRC.green)
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

async function faviconSvgFromGreen32(buf32) {
  const b64 = buf32.toString('base64');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <image href="data:image/png;base64,${b64}" width="32" height="32" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  await writeFile(join(publicDir, 'favicon.svg'), svg, 'utf8');
}

async function main() {
  await ensureDirs();

  await symbolResize(SRC.green, 16, join(iconsDir, 'bv-symbol-green-16.png'));
  await symbolResize(SRC.green, 32, join(iconsDir, 'bv-symbol-green-32.png'));
  await symbolResize(SRC.green, 192, join(iconsDir, 'bv-symbol-green-192.png'));
  await symbolResize(SRC.green, 512, join(iconsDir, 'bv-symbol-green-512.png'));

  await symbolResize(SRC.black, 32, join(iconsDir, 'bv-symbol-black-32.png'));
  await symbolResize(SRC.white, 32, join(iconsDir, 'bv-symbol-white-32.png'));

  const buf16 = await sharp(SRC.green)
    .resize(16, 16, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();
  const buf32 = await sharp(SRC.green)
    .resize(32, 32, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();
  const buf48 = await sharp(SRC.green)
    .resize(48, 48, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();

  await writeFile(join(publicDir, 'favicon.ico'), await toIco([buf16, buf32, buf48]));
  await faviconSvgFromGreen32(buf32);

  await appleTouchGreen();
  await maskable512();

  console.log('Favicons e ícones gerados em public/ e public/icons/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

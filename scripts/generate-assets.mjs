import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const assetsDir = path.join(root, 'assets');
const publicDir = path.join(root, 'public');

const NAVY_TOP = '#17305B';
const NAVY_BOTTOM = '#0F2242';

const bgDefs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY_TOP}"/>
      <stop offset="1" stop-color="${NAVY_BOTTOM}"/>
    </linearGradient>
  </defs>`;

// Wallet body + F monogram + clasp, drawn in a 1024 box.
const mark = `
  <rect x="232" y="300" width="560" height="424" rx="92" fill="#FFFFFF"/>
  <rect x="344" y="404" width="58" height="216" rx="8" fill="#142C53"/>
  <rect x="344" y="404" width="172" height="58" rx="8" fill="#142C53"/>
  <rect x="344" y="478" width="132" height="52" rx="8" fill="#142C53"/>
  <rect x="642" y="434" width="178" height="156" rx="78" fill="#2563EB"/>
  <circle cx="731" cy="512" r="26" fill="#FFFFFF"/>`;

const iconSvg = (bg, scale = 1, offset = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  ${bgDefs}
  ${bg ? `<rect width="1024" height="1024" fill="url(#bg)"/>` : ''}
  <g transform="translate(${512 + offset} 512) scale(${scale}) translate(-512 -512)">
    ${mark}
  </g>
</svg>`;

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732">
  ${bgDefs}
  <rect width="2732" height="2732" fill="url(#bg)"/>
  <g transform="translate(1028 832) scale(0.66)">
    ${mark}
  </g>
  <text x="1366" y="1690" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="150" font-weight="700" letter-spacing="22" fill="#FFFFFF">FINORA</text>
  <text x="1366" y="1780" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="44" font-weight="600" letter-spacing="14" fill="#9DBBEB">PERSONAL FINANCE</text>
</svg>`;

const writePng = async (svg, file, size) => {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log('written', path.relative(root, file));
};

await mkdir(assetsDir, { recursive: true });
await mkdir(publicDir, { recursive: true });

// Capacitor uses a single logo source so every Android density is generated
// at full resolution. Separate foreground/background sources are not used.
await writePng(iconSvg(true), path.join(assetsDir, 'logo.png'), 1024);

const splashPng = await sharp(Buffer.from(splashSvg)).png().toBuffer();
await sharp(splashPng).toFile(path.join(assetsDir, 'splash.png'));
await sharp(splashPng).toFile(path.join(assetsDir, 'splash-dark.png'));
console.log('written assets/splash.png');

// PWA + browser icons
await writePng(iconSvg(true), path.join(publicDir, 'pwa-192x192.png'), 192);
await writePng(iconSvg(true), path.join(publicDir, 'pwa-512x512.png'), 512);
await writePng(iconSvg(true, 0.78), path.join(publicDir, 'pwa-maskable-512x512.png'), 512);
await writePng(iconSvg(true), path.join(publicDir, 'apple-touch-icon.png'), 180);

const faviconSvg = iconSvg(true)
  .split('\n')
  .map((line) => line.trimEnd())
  .join('\n');
await writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
console.log('written public icons');

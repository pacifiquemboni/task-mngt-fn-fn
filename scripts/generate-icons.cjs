/**
 * PWA Icon Generator
 * 
 * Run:  node scripts/generate-icons.cjs
 * 
 * This generates simple PNG icons for the PWA manifest.
 * For production, replace these with properly designed icons.
 */
const fs = require('fs');
const path = require('path');

// Simple 1-pixel gold PNG generator for PWA icons
// These are minimal placeholder PNGs with the "T" brand color
function createMinimalPng(size) {
  // We'll create an SVG-based approach instead — write an SVG that can be
  // referenced as a maskable icon. For real PNG generation, use sharp/canvas.
  // For now we create a simple SVG icon at the right dimensions.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#f59e0b"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="bold"
        font-size="${Math.round(size * 0.55)}" fill="#000">T</text>
</svg>`;
}

const publicDir = path.join(__dirname, '..', 'public');

[192, 512].forEach(size => {
  const svg = createMinimalPng(size);
  fs.writeFileSync(path.join(publicDir, `pwa-${size}x${size}.svg`), svg);
  console.log(`Created pwa-${size}x${size}.svg`);
});

// Also create a maskable icon (with extra padding for safe zone)
const maskableSize = 512;
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maskableSize}" height="${maskableSize}" viewBox="0 0 ${maskableSize} ${maskableSize}">
  <rect width="${maskableSize}" height="${maskableSize}" fill="#f59e0b"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="bold"
        font-size="${Math.round(maskableSize * 0.4)}" fill="#000">T</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.svg'), maskableSvg);
console.log('Created pwa-maskable-512x512.svg');

console.log('\nDone! Icons created in public/');

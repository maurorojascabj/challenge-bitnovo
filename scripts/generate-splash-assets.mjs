/**
 * generate-splash-assets.mjs
 * Generates splash-icon.png (white logo on transparent, 1024×1024)
 * and icon.png (white logo on brand-blue background, 1024×1024)
 * from assets/svg/Bitnovo-logo.svg using qlmanage (macOS).
 *
 * Usage: node scripts/generate-splash-assets.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SVG_SRC = readFileSync(join(ROOT, 'assets/svg/Bitnovo-logo.svg'), 'utf8');

// Logo original viewBox: 88×32
// We want to center it in a 1024×1024 canvas at ~400px wide
const LOGO_W = 400;
const LOGO_H = Math.round(400 * (32 / 88)); // ≈ 145
const OFFSET_X = Math.round((1024 - LOGO_W) / 2); // ≈ 312
const OFFSET_Y = Math.round((1024 - LOGO_H) / 2); // ≈ 439

// --- Helper: build a 1024×1024 SVG wrapping the logo ---
function buildSVG({ bgColor, fillOverride }) {
  // Extract inner paths from the source SVG (everything between first > and </svg>)
  const innerMatch = SVG_SRC.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  let inner = innerMatch ? innerMatch[1] : '';

  if (fillOverride) {
    // Replace all fill= attributes with the override color
    inner = inner.replace(/fill="[^"]+"/g, `fill="${fillOverride}"`);
  }

  const bg = bgColor
    ? `<rect width="1024" height="1024" fill="${bgColor}"/>`
    : '';

  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  ${bg}
  <g transform="translate(${OFFSET_X}, ${OFFSET_Y}) scale(${LOGO_W / 88})">
    ${inner}
  </g>
</svg>`;
}

// --- Generate splash-icon.png (white logo, transparent background) ---
const splashSVG = buildSVG({ bgColor: null, fillOverride: '#FFFFFF' });
const splashSVGPath = '/tmp/bitnovo-splash-icon.svg';
const splashPNGOut = '/tmp';

writeFileSync(splashSVGPath, splashSVG, 'utf8');
execSync(`qlmanage -t -s 1024 -o "${splashPNGOut}" "${splashSVGPath}" 2>/dev/null`);
execSync(`cp "/tmp/bitnovo-splash-icon.svg.png" "${join(ROOT, 'assets/images/splash-icon.png')}"`);
console.log('✅ splash-icon.png generated');

// --- Generate icon.png (white logo, brand-blue background) ---
const iconSVG = buildSVG({ bgColor: '#035AC5', fillOverride: '#FFFFFF' });
const iconSVGPath = '/tmp/bitnovo-icon.svg';

writeFileSync(iconSVGPath, iconSVG, 'utf8');
execSync(`qlmanage -t -s 1024 -o "${splashPNGOut}" "${iconSVGPath}" 2>/dev/null`);
execSync(`cp "/tmp/bitnovo-icon.svg.png" "${join(ROOT, 'assets/images/icon.png')}"`);
console.log('✅ icon.png generated');

console.log('\nDone. Rebuild the app with `pnpm ios` or `pnpm android` to pick up the new splash assets.');

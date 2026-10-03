// Generates every brand asset from assets/brand/app-icon.png.
// Run: node scripts/brand-icons.mjs
//
// The source is a squircle on a solid black canvas with no alpha channel.
// We flood-fill the black background from the image edges, turn only that
// region transparent (softened by brightness so the squircle's own
// anti-aliased rim is kept), then crop to the squircle and export sizes.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "assets/brand/app-icon.png";
const NAVY = { r: 19, g: 21, b: 31 }; // squircle body colour, used where we need an opaque fill
const BG_T = 14; // luminance at or below which a pixel counts as background black
const NOISE = 4; // compression noise in the "black" background

async function transparentSquircle() {
  const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const lum = (i) => (data[i * 3] + data[i * 3 + 1] + data[i * 3 + 2]) / 3;

  // Flood-fill the outer background starting from every border pixel.
  const outside = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const i = stack.pop();
    if (outside[i] || lum(i) > BG_T) continue;
    outside[i] = 1;
    const x = i % W;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (i >= W) stack.push(i - W);
    if (i < W * (H - 1)) stack.push(i + W);
  }

  // Build RGBA: background -> transparent, rim pixels -> partially opaque.
  const rgba = Buffer.alloc(W * H * 4);
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let i = 0; i < W * H; i++) {
    const x = i % W, y = (i / W) | 0;
    // background noise up to NOISE stays fully transparent; the rim ramps up to opaque
    let a = 255;
    if (outside[i]) a = Math.round(Math.max(0, Math.min(1, (lum(i) - NOISE) / (BG_T - NOISE))) * 255);
    if (!outside[i]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    // un-premultiply the dark fringe so the edge doesn't look grey on light tabs
    const k = outside[i] && a > 0 ? 255 / a : 1;
    rgba[i * 4] = Math.min(255, data[i * 3] * k);
    rgba[i * 4 + 1] = Math.min(255, data[i * 3 + 1] * k);
    rgba[i * 4 + 2] = Math.min(255, data[i * 3 + 2] * k);
    rgba[i * 4 + 3] = a;
  }

  const cropped = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();

  // The squircle is ~3% wider than tall; squaring it is imperceptible and fills the canvas.
  const master = await sharp(cropped).resize(1024, 1024, { fit: "fill" }).png().toBuffer();
  console.log(`squircle ${maxX - minX + 1}x${maxY - minY + 1} at (${minX},${minY}) -> 1024x1024 master`);
  return master;
}

// palette-quantised PNG (libimagequant keeps alpha) — a fraction of the size, visually identical
const PNG_OPTS = { palette: true, quality: 95, effort: 10, compressionLevel: 9 };
const png = (buf, size) => sharp(buf).resize(size, size, { kernel: "lanczos3" }).png(PNG_OPTS).toBuffer();

// Opaque square for platforms that apply their own mask (iOS home screen, Android maskable).
async function opaque(master, size, inset = 0) {
  const inner = Math.round(size * (1 - inset * 2));
  const art = await png(master, inner);
  return sharp({ create: { width: size, height: size, channels: 4, background: { ...NAVY, alpha: 1 } } })
    .composite([{ input: art, gravity: "center" }])
    .flatten({ background: NAVY })
    .png(PNG_OPTS)
    .toBuffer();
}

// .ico that embeds PNG images (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, n) => {
    const e = 6 + n * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

async function ogImage(master) {
  const W = 1200, H = 630, ICON = 220;
  const icon = await png(master, ICON);
  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="436" text-anchor="middle" fill="#f5f5f7"
        font-family="SF Pro Display, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="96" font-weight="600" letter-spacing="-2.5">Ordo</text>
      <text x="50%" y="500" text-anchor="middle" fill="#86868b"
        font-family="SF Pro Text, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="30">Freelance projects and payments, finally in order.</text>
    </svg>`);
  return sharp({ create: { width: W, height: H, channels: 3, background: "#000000" } })
    .composite([
      { input: icon, top: 90, left: Math.round((W - ICON) / 2) },
      { input: text, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const master = await transparentSquircle();
await mkdir("public/brand", { recursive: true });

const out = {
  // Next.js metadata file conventions (auto-linked in <head>)
  "app/icon.png": png(master, 192),
  "app/apple-icon.png": opaque(master, 180),
  "app/opengraph-image.png": ogImage(master),
  // in-app logo (2x for retina) + PWA manifest icons
  "public/brand/logo-64.png": png(master, 64),
  "public/brand/icon-192.png": png(master, 192),
  "public/brand/icon-512.png": png(master, 512),
  "public/brand/icon-maskable-512.png": opaque(master, 512, 0.1),
};

// favicon.ico needs its PNG frames resolved first
out["app/favicon.ico"] = ico(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(master, size) })))
);

for (const [file, data] of Object.entries(out)) {
  const buf = await data;
  await writeFile(file, buf);
  console.log(`${file.padEnd(36)} ${(buf.length / 1024).toFixed(1)} KB`);
}

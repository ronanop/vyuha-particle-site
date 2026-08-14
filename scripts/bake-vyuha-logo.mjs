/**
 * Bake Vyuha logo particles from a clean logo PNG (not the Meshy UV atlas).
 *
 * The Meshy GLB texture is an atlas / generative mess — silhouette sampling
 * from it looks like noise. Use the crisp brand mark image instead.
 *
 * Source: scripts/vyuha-raw/logo-ref-flat.png
 * Run:    npm run bake:vyuha
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import jpeg from "jpeg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "scripts", "vyuha-raw", "logo-ref-flat.png");
const OUT = path.join(ROOT, "src", "lib", "particles", "vyuhaLogoData");

const TIERS = { HIGH: 12000, MEDIUM: 8000, LOW: 5500 };
const TARGET_RADIUS = 2.55;

function hash2(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function float32ToBase64(arr) {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString(
    "base64",
  );
}

function normalizeToRadius(positions, radius) {
  let maxR = 0;
  for (let i = 0; i < positions.length; i += 3) {
    const r = Math.hypot(positions[i], positions[i + 1], positions[i + 2]);
    if (r > maxR) maxR = r;
  }
  if (maxR < 1e-8) return;
  const s = radius / maxR;
  for (let i = 0; i < positions.length; i++) positions[i] *= s;
}

function sortPointsSpatially(positions, extras) {
  const n = positions.length / 3;
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => {
    const ax = positions[a * 3];
    const ay = positions[a * 3 + 1];
    const az = positions[a * 3 + 2];
    const bx = positions[b * 3];
    const by = positions[b * 3 + 1];
    const bz = positions[b * 3 + 2];
    const ka = Math.atan2(ay, ax) * 1000 + Math.hypot(ax, ay) * 10 + az;
    const kb = Math.atan2(by, bx) * 1000 + Math.hypot(bx, by) * 10 + bz;
    return ka - kb;
  });
  const pos2 = new Float32Array(positions.length);
  const extra2 = extras.map((e) => new Float32Array(e.length));
  for (let i = 0; i < n; i++) {
    const s = order[i];
    pos2[i * 3] = positions[s * 3];
    pos2[i * 3 + 1] = positions[s * 3 + 1];
    pos2[i * 3 + 2] = positions[s * 3 + 2];
    for (let e = 0; e < extras.length; e++) extra2[e][i] = extras[e][s];
  }
  positions.set(pos2);
  for (let e = 0; e < extras.length; e++) extras[e].set(extra2[e]);
}

function glowScore(r, g, b, a) {
  if (a < 0.08) return 0;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const cyan = b * 0.55 + g * 0.5 - r * 0.7;
  return Math.max(0, cyan) * 1.6 + lum * 0.35;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error("Missing", SRC);
    process.exit(1);
  }

  const png = PNG.sync.read(fs.readFileSync(SRC));
  const { width: w, height: h, data } = png;
  console.log("Source", w, "x", h);

  // Crop to content bbox of glowing pixels
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  const scores = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const s = glowScore(
        data[i] / 255,
        data[i + 1] / 255,
        data[i + 2] / 255,
        data[i + 3] / 255,
      );
      scores[y * w + x] = s;
      if (s > 0.25) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  console.log("Content bbox", { minX, minY, maxX, maxY, bw, bh });

  const pixels = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const s = scores[y * w + x];
      if (s < 0.28) continue;
      // Normalize to ~[-1,1] square, Y up
      const nx = ((x - minX) / (bw - 1)) * 2 - 1;
      const ny = 1 - ((y - minY) / (bh - 1)) * 2;
      pixels.push({ x: nx, y: ny, s });
    }
  }
  pixels.sort((a, b) => b.s - a.s);
  console.log("Glow pixels", pixels.length);

  // Preview
  const preview = Buffer.alloc(bw * bh * 4, 0);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const s = Math.min(1, scores[(minY + y) * w + (minX + x)] / 1.2);
      const i = (y * bw + x) * 4;
      preview[i] = Math.floor(s * 60);
      preview[i + 1] = Math.floor(s * 220);
      preview[i + 2] = Math.floor(s * 255);
      preview[i + 3] = 255;
    }
  }
  fs.writeFileSync(
    path.join(ROOT, "scripts", "vyuha-raw", "bake-preview.jpg"),
    jpeg.encode({ data: preview, width: bw, height: bh }, 92).data,
  );

  if (pixels.length < 800) {
    console.error("Not enough glow pixels");
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const top = pixels[0].s;

  for (const [tier, count] of Object.entries(TIERS)) {
    const outPos = new Float32Array(count * 3);
    const layers = new Float32Array(count);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Mostly even coverage for smooth strokes; slight bias to bright cores
      const u =
        i % 5 === 0 ? Math.pow(hash2(i, 2.7), 1.35) : hash2(i, 0.9);
      const p =
        pixels[Math.min(pixels.length - 1, Math.floor(u * pixels.length))];
      const hot = p.s / top;

      // Mild plate depth: rim a bit forward, interior slightly back
      const r = Math.hypot(p.x, p.y);
      const z = (hot > 0.65 ? 0.08 : 0.02) + (1 - Math.min(1, r)) * 0.04;

      outPos[i * 3] = p.x + (hash2(i, 1.1) - 0.5) * 0.008;
      outPos[i * 3 + 1] = p.y + (hash2(i, 2.2) - 0.5) * 0.008;
      outPos[i * 3 + 2] = z + (hash2(i, 3.3) - 0.5) * 0.02;

      if (hot > 0.72) {
        layers[i] = 3;
        sizes[i] = 1.55;
        opacities[i] = 1;
      } else if (hot > 0.4) {
        layers[i] = 3;
        sizes[i] = 1.2;
        opacities[i] = 0.95;
      } else {
        layers[i] = 2;
        sizes[i] = 0.75;
        opacities[i] = 0.45;
      }
    }

    normalizeToRadius(outPos, TARGET_RADIUS);
    sortPointsSpatially(outPos, [layers, sizes, opacities]);

    fs.writeFileSync(
      path.join(OUT, `${tier.toLowerCase()}.json`),
      JSON.stringify({
        count,
        radius: TARGET_RADIUS,
        source: "scripts/vyuha-raw/logo-ref-flat.png",
        strategy: "png-neon-silhouette",
        positions: float32ToBase64(outPos),
        layers: float32ToBase64(layers),
        sizes: float32ToBase64(sizes),
        opacities: float32ToBase64(opacities),
      }),
    );
    console.log("Wrote", tier, count);
  }

  console.log("Done.");
}

main();

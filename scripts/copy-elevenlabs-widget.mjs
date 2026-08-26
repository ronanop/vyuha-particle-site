import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(
  root,
  "node_modules",
  "@elevenlabs",
  "convai-widget-embed",
  "dist",
  "index.js",
);
const destDir = join(root, "public", "vendor");
const dest = join(destDir, "elevenlabs-convai-widget-0.16.4.js");

if (!existsSync(src)) {
  console.warn(
    "[copy-elevenlabs-widget] Package not installed; skip vendor copy.",
  );
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-elevenlabs-widget] Wrote ${dest}`);

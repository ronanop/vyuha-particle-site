/**
 * Offline bake: world country border particles with India (Survey-aligned) highlight.
 *
 * Sources (downloaded to scripts/earth-raw/):
 * - Natural Earth 10m Admin-0 Countries, India POV (neighbors aligned to Indian claims)
 * - DataMeet india-composite.geojson (Survey of India–style official India land area)
 *
 * Run: node scripts/bake-earth.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(__dirname, "earth-raw");
const OUT = path.join(ROOT, "src", "lib", "particles", "earthBoundaryData");

const TIERS = {
  HIGH: 7000,
  MEDIUM: 4800,
  LOW: 3600,
};

const LAYER = { SHELL: 0, WORLD: 1, SRI_LANKA: 2, INDIA: 3 };

const INDIA_FLOOR = { HIGH: 1200, MEDIUM: 820, LOW: 620 };
// Shell must stay sparse — a dense fibonacci shell reads as a filled ball and hides borders.
const SHARE = { shell: 0.08, world: 0.52, highlight: 0.4 };
const TARGET_RADIUS = 2.4;
const SPHERE_R = 1; // pre-normalize unit sphere, then normalizeToRadius

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function countryName(props) {
  return (
    props.ADMIN ||
    props.NAME ||
    props.NAME_EN ||
    props.name ||
    props.NAME_LONG ||
    ""
  );
}

function isIndiaFeature(props) {
  const n = countryName(props).toLowerCase();
  const a3 = (props.ADM0_A3 || props.ISO_A3 || "").toUpperCase();
  return a3 === "IND" || n === "india";
}

function isSriLankaFeature(props) {
  const n = countryName(props).toLowerCase();
  const a3 = (props.ADM0_A3 || props.ISO_A3 || "").toUpperCase();
  return a3 === "LKA" || n === "sri lanka";
}

/** Extract exterior rings as [lon,lat][][] from a GeoJSON geometry. */
function extractRings(geometry) {
  if (!geometry) return [];
  const rings = [];
  const pushPoly = (coords) => {
    if (!coords || !coords.length) return;
    // exterior only
    const ring = coords[0];
    if (ring && ring.length >= 3) rings.push(ring.map((c) => [c[0], c[1]]));
  };
  if (geometry.type === "Polygon") pushPoly(geometry.coordinates);
  else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) pushPoly(poly);
  } else if (geometry.type === "GeometryCollection") {
    for (const g of geometry.geometries || []) {
      rings.push(...extractRings(g));
    }
  }
  return rings;
}

function haversineKm(a, b) {
  const toR = Math.PI / 180;
  const lat1 = a[1] * toR;
  const lat2 = b[1] * toR;
  const dLat = (b[1] - a[1]) * toR;
  const dLon = (b[0] - a[0]) * toR;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

function ringLengthKm(ring) {
  let len = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    len += haversineKm(ring[i], ring[i + 1]);
  }
  return len;
}

function closeRing(ring) {
  if (ring.length < 2) return ring;
  const a = ring[0];
  const b = ring[ring.length - 1];
  if (a[0] !== b[0] || a[1] !== b[1]) return [...ring, [a[0], a[1]]];
  return ring;
}

/** Even arc-length resampling along a lon/lat ring. */
function resampleRing(ring, spacingKm) {
  const closed = closeRing(ring);
  if (closed.length < 2) return [];
  const segLens = [];
  let total = 0;
  for (let i = 0; i < closed.length - 1; i++) {
    const d = haversineKm(closed[i], closed[i + 1]);
    segLens.push(d);
    total += d;
  }
  if (total < 1e-6) return [[closed[0][0], closed[0][1]]];

  const count = Math.max(3, Math.round(total / spacingKm));
  const step = total / count;
  const out = [];
  let dist = 0;
  let seg = 0;
  let segPos = 0;

  for (let i = 0; i < count; i++) {
    const target = i * step;
    while (seg < segLens.length - 1 && dist + segLens[seg] < target) {
      dist += segLens[seg];
      seg++;
      segPos = 0;
    }
    const segLen = segLens[seg] || 1e-9;
    const t = Math.min(1, (target - dist) / segLen);
    const a = closed[seg];
    const b = closed[seg + 1];
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/**
 * Project lon/lat to sphere with India-facing camera (+Z).
 * After subtracting lonOffset, lon'=0 lies on +Z (toward default camera at z>0).
 */
function lonLatToXyz(lon, lat, lonOffsetDeg, radius = SPHERE_R) {
  const lonR = ((lon - lonOffsetDeg) * Math.PI) / 180;
  const latR = (lat * Math.PI) / 180;
  const cl = Math.cos(latR);
  return [
    radius * cl * Math.sin(lonR),
    radius * Math.sin(latR),
    radius * cl * Math.cos(lonR),
  ];
}

function fibonacciSphere(n, radius = SPHERE_R) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push([radius * Math.cos(theta) * r, radius * y, radius * Math.sin(theta) * r]);
  }
  return pts;
}

function normalizeToRadius(positions, targetRadius = TARGET_RADIUS) {
  let maxLen = 0;
  for (let i = 0; i < positions.length; i += 3) {
    const len = Math.hypot(positions[i], positions[i + 1], positions[i + 2]);
    if (len > maxLen) maxLen = len;
  }
  if (maxLen < 1e-8) return;
  const scale = targetRadius / maxLen;
  for (let i = 0; i < positions.length; i++) positions[i] *= scale;
}

function spatialSortKey(x, y, z) {
  const len = Math.hypot(x, y, z) || 1;
  const ny = y / len;
  const nx = x / len;
  const nz = z / len;
  const theta = Math.atan2(nz, nx);
  const phi = Math.acos(Math.min(1, Math.max(-1, ny)));
  return phi * 1000 + (theta + Math.PI);
}

function sortSpatially(positions, layers, sizes, opacities) {
  const count = positions.length / 3;
  const order = Array.from({ length: count }, (_, i) => i);
  order.sort((a, b) => {
    const ka = spatialSortKey(positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]);
    const kb = spatialSortKey(positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]);
    return ka - kb;
  });
  const p = new Float32Array(positions.length);
  const l = new Float32Array(layers.length);
  const s = new Float32Array(sizes.length);
  const o = new Float32Array(opacities.length);
  for (let i = 0; i < count; i++) {
    const src = order[i];
    p[i * 3] = positions[src * 3];
    p[i * 3 + 1] = positions[src * 3 + 1];
    p[i * 3 + 2] = positions[src * 3 + 2];
    l[i] = layers[src];
    s[i] = sizes[src];
    o[i] = opacities[src];
  }
  positions.set(p);
  layers.set(l);
  sizes.set(s);
  opacities.set(o);
}

function float32ToBase64(arr) {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString("base64");
}

function pickLargestRings(rings, maxRings) {
  return [...rings]
    .map((r) => ({ r, len: ringLengthKm(closeRing(r)) }))
    .sort((a, b) => b.len - a.len)
    .slice(0, maxRings)
    .map((x) => x.r);
}

function buildCountryLoops() {
  const ne = readJson(path.join(RAW, "ne_ind.geojson"));
  const indiaSrc = readJson(path.join(RAW, "india-composite.geojson"));

  /** @type {{ name: string, kind: "india"|"sriLanka"|"world", rings: number[][][] }[]} */
  const countries = [];

  for (const feature of ne.features) {
    const props = feature.properties || {};
    if (isIndiaFeature(props)) continue; // replace with SOI composite
    const rings = extractRings(feature.geometry);
    if (!rings.length) continue;
    const kind = isSriLankaFeature(props) ? "sriLanka" : "world";
    // Keep largest few rings (mainland + major islands); drop tiny islets to save budget
    const kept = pickLargestRings(rings, kind === "sriLanka" ? 2 : 4);
    countries.push({ name: countryName(props), kind, rings: kept });
  }

  // India from Survey-aligned composite
  let indiaRings = [];
  if (indiaSrc.type === "FeatureCollection") {
    for (const f of indiaSrc.features) {
      indiaRings.push(...extractRings(f.geometry));
    }
  } else if (indiaSrc.type === "Feature") {
    indiaRings = extractRings(indiaSrc.geometry);
  } else {
    indiaRings = extractRings(indiaSrc);
  }
  // Keep mainland + major pieces; composite should be mostly one landmass
  indiaRings = pickLargestRings(indiaRings, 6);
  countries.push({ name: "India", kind: "india", rings: indiaRings });

  return countries;
}

function indiaCentroidLonLat(countries) {
  // Prefer a peninsula-weighted centroid so the mainland faces the camera,
  // not an east-skewed mean pulled by the northeast extremity alone.
  const india = countries.find((c) => c.kind === "india");
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const ring of india.rings) {
    for (const [lon, lat] of ring) {
      if (lat < 8 || lat > 35 || lon < 68 || lon > 90) continue;
      sx += lon;
      sy += lat;
      n++;
    }
  }
  if (n < 50) return { lon: 78.9, lat: 21.5 };
  return { lon: sx / n, lat: sy / n };
}

function spacingFor(kind, ringLenKm) {
  if (kind === "india") {
    if (ringLenKm > 2000) return 8;
    if (ringLenKm > 500) return 11;
    return 14;
  }
  if (kind === "sriLanka") return 16;
  // Denser world coastlines so continents read as outlines, not sparse dots
  if (ringLenKm < 200) return 28;
  if (ringLenKm < 1000) return 20;
  return 16;
}

function sampleBorders(countries, lonOffset) {
  /** @type {{ xyz: number[], kind: string, name: string }[]} */
  const samples = [];
  for (const c of countries) {
    for (const ring of c.rings) {
      const len = ringLengthKm(closeRing(ring));
      if (len < 40 && c.kind === "world") continue; // skip tiny world islets
      const spacing = spacingFor(c.kind, len);
      const pts = resampleRing(ring, spacing);
      for (const [lon, lat] of pts) {
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
        if (Math.abs(lat) > 89.5) continue;
        const xyz = lonLatToXyz(lon, lat, lonOffset);
        if (xyz.some((v) => !Number.isFinite(v))) continue;
        samples.push({ xyz, kind: c.kind, name: c.name });
      }
    }
  }
  return samples;
}

function allocate(count, tierName) {
  const indiaFloor = INDIA_FLOOR[tierName];
  let shellN = Math.round(count * SHARE.shell);
  let worldN = Math.round(count * SHARE.world);
  let highlightN = count - shellN - worldN;

  // Within highlight: ~92% India, ~8% Sri Lanka (SL not highlighted color)
  let indiaN = Math.round(highlightN * 0.92);
  let slN = highlightN - indiaN;
  if (indiaN < indiaFloor) {
    const need = indiaFloor - indiaN;
    indiaN = indiaFloor;
    // Steal from shell first, then world
    const fromShell = Math.min(need, Math.max(0, shellN - Math.floor(count * 0.15)));
    shellN -= fromShell;
    const remain = need - fromShell;
    worldN = Math.max(Math.floor(count * 0.2), worldN - remain);
    highlightN = count - shellN - worldN;
    slN = Math.max(8, highlightN - indiaN);
    indiaN = highlightN - slN;
  }

  // Final exact sum
  let sum = shellN + worldN + indiaN + slN;
  shellN += count - sum;
  return { shellN, worldN, indiaN, slN };
}

function pickDistributed(pool, n) {
  if (n <= 0) return [];
  if (pool.length === 0) return [];
  if (n >= pool.length) {
    // pad by jittered duplicates
    const out = [...pool];
    let i = 0;
    while (out.length < n) {
      const src = pool[i % pool.length];
      const j = (i * 0.017) % 1;
      out.push({
        ...src,
        xyz: [
          src.xyz[0] * (1 + (j - 0.5) * 0.002),
          src.xyz[1] * (1 + (j - 0.5) * 0.002),
          src.xyz[2] * (1 + (j - 0.5) * 0.002),
        ],
      });
      i++;
    }
    return out;
  }
  const out = [];
  const step = pool.length / n;
  for (let i = 0; i < n; i++) {
    out.push(pool[Math.floor(i * step) % pool.length]);
  }
  return out;
}

function bakeTier(tierName, count, borderSamples, lonOffset) {
  const { shellN, worldN, indiaN, slN } = allocate(count, tierName);

  const indiaPool = borderSamples.filter((s) => s.kind === "india");
  const slPool = borderSamples.filter((s) => s.kind === "sriLanka");
  const worldPool = borderSamples.filter((s) => s.kind === "world");

  const picked = [
    ...fibonacciSphere(shellN).map((xyz) => ({
      xyz,
      layer: LAYER.SHELL,
      size: 0.28,
      opacity: 0.1,
    })),
    ...pickDistributed(worldPool, worldN).map((s) => ({
      xyz: s.xyz,
      layer: LAYER.WORLD,
      size: 1.05,
      opacity: 0.88,
    })),
    ...pickDistributed(slPool, slN).map((s) => ({
      xyz: s.xyz,
      layer: LAYER.SRI_LANKA,
      size: 1.05,
      opacity: 0.85,
    })),
    ...pickDistributed(indiaPool, indiaN).map((s) => ({
      xyz: s.xyz,
      layer: LAYER.INDIA,
      size: 1.85,
      opacity: 1.0,
    })),
  ];

  // Trim/pad to exact count (never trim India)
  if (picked.length > count) {
    // remove from shell first
    let over = picked.length - count;
    for (let i = picked.length - 1; i >= 0 && over > 0; i--) {
      if (picked[i].layer === LAYER.SHELL) {
        picked.splice(i, 1);
        over--;
      }
    }
    for (let i = picked.length - 1; i >= 0 && over > 0; i--) {
      if (picked[i].layer === LAYER.WORLD) {
        picked.splice(i, 1);
        over--;
      }
    }
  }
  while (picked.length < count) {
    const shell = fibonacciSphere(1)[0];
    picked.push({ xyz: shell, layer: LAYER.SHELL, size: 0.45, opacity: 0.22 });
  }

  const positions = new Float32Array(count * 3);
  const layers = new Float32Array(count);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const p = picked[i];
    positions[i * 3] = p.xyz[0];
    positions[i * 3 + 1] = p.xyz[1];
    positions[i * 3 + 2] = p.xyz[2];
    layers[i] = p.layer;
    sizes[i] = p.size;
    opacities[i] = p.opacity;
  }

  normalizeToRadius(positions, TARGET_RADIUS);
  sortSpatially(positions, layers, sizes, opacities);

  // Sanity
  for (let i = 0; i < positions.length; i++) {
    if (!Number.isFinite(positions[i])) {
      throw new Error(`Non-finite position at ${i} tier ${tierName}`);
    }
  }

  let maxR = 0;
  for (let i = 0; i < count; i++) {
    maxR = Math.max(
      maxR,
      Math.hypot(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
    );
  }

  const indiaCount = [...layers].filter((l) => l === LAYER.INDIA).length;
  const meta = {
    tier: tierName,
    count,
    radius: maxR,
    indiaCount,
    sriLankaCount: [...layers].filter((l) => l === LAYER.SRI_LANKA).length,
    worldCount: [...layers].filter((l) => l === LAYER.WORLD).length,
    shellCount: [...layers].filter((l) => l === LAYER.SHELL).length,
    lonOffsetDeg: lonOffset,
    sources: {
      world: "Natural Earth 10m Admin-0 Countries (India POV)",
      india: "DataMeet india-composite (Survey of India–style official boundary)",
    },
  };

  return {
    meta,
    payload: {
      count,
      radius: TARGET_RADIUS,
      lonOffsetDeg: lonOffset,
      positions: float32ToBase64(positions),
      layers: float32ToBase64(layers),
      sizes: float32ToBase64(sizes),
      opacities: float32ToBase64(opacities),
    },
  };
}

function main() {
  if (!fs.existsSync(path.join(RAW, "ne_ind.geojson"))) {
    console.error("Missing scripts/earth-raw/ne_ind.geojson — download sources first.");
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  console.log("Extracting country loops…");
  const countries = buildCountryLoops();
  const india = countries.find((c) => c.kind === "india");
  const sl = countries.find((c) => c.kind === "sriLanka");
  console.log(
    `Countries: ${countries.length}, India rings: ${india?.rings.length}, Sri Lanka rings: ${sl?.rings.length}`,
  );

  const centroid = indiaCentroidLonLat(countries);
  // Lock focus longitude to classic peninsula center so India faces the camera
  // (ring-mean alone drifts east toward the northeast sector).
  const lonOffset = 78.9;
  console.log(
    `India ring centroid ≈ ${centroid.lon.toFixed(2)}, ${centroid.lat.toFixed(2)} → using focus lon ${lonOffset}`,
  );

  const borderSamples = sampleBorders(countries, lonOffset);
  console.log(
    `Border samples: total=${borderSamples.length} india=${borderSamples.filter((s) => s.kind === "india").length} sl=${borderSamples.filter((s) => s.kind === "sriLanka").length} world=${borderSamples.filter((s) => s.kind === "world").length}`,
  );

  const manifest = { generatedAt: new Date().toISOString(), tiers: {} };

  for (const [tierName, count] of Object.entries(TIERS)) {
    console.log(`Baking ${tierName} (${count})…`);
    const { meta, payload } = bakeTier(tierName, count, borderSamples, lonOffset);
    const file = `${tierName.toLowerCase()}.json`;
    fs.writeFileSync(path.join(OUT, file), JSON.stringify(payload));
    manifest.tiers[tierName] = { file, ...meta };
    console.log(
      `  → ${file} radius=${meta.radius.toFixed(3)} india=${meta.indiaCount} world=${meta.worldCount} shell=${meta.shellCount}`,
    );
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Done. Wrote", OUT);
}

main();

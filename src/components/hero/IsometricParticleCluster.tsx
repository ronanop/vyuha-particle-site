"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { createEarthCloud } from "@/components/hero/earthCloud";
import {
  addAnimatedLines,
  addAnimatedPoints,
  EARTH_ASSEMBLE_MS,
  updateAssembleLayers,
  type AssembleLayer,
} from "@/components/hero/earthAssemble";

/**
 * Port of Framer `IsometricParticleCluster`
 * (https://framer.com/m/Particle-zeK0h5.js@VkkfJCafRtFcYWd99GGW)
 */

export type IsometricParticleClusterProps = {
  shape?: "hashtag" | "earth";
  logoImage?: string;
  /**
   * Scroll-driven morph chain for the earth shape. Each stage's particles morph
   * as the element matched by `selector` reaches center — toward `image`, or, if
   * `spread` is set, dispersed across the whole viewport as a particle field.
   */
  morphStages?: Array<{
    image?: string;
    selector: string;
    spread?: boolean;
    /** Docks the shape on the right of the CTA, held straight (final logo). */
    logo?: boolean;
  }>;
  particleColor?: string;
  particleBrightness?: number;
  lineColor?: string;
  particleSize?: number;
  lineOpacity?: number;
  particleDensity?: number;
  autoRotationSpeed?: number;
  interactionStrength?: number;
  damping?: number;
  className?: string;
  style?: CSSProperties;
};

type ClusterMesh = THREE.Points | THREE.LineSegments;

const HASH_CELLS: Array<[number, number]> = [
  [1, 3],
  [2, 3],
  [0, 2],
  [1, 2],
  [3, 2],
  [0, 1],
  [2, 1],
  [3, 1],
  [1, 0],
  [2, 0],
];

const MARCHING_SQUARES: number[][][] = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[1, 0]],
  [
    [0, 3],
    [1, 2],
  ],
  [[2, 0]],
  [[3, 0]],
  [[0, 3]],
  [[0, 2]],
  [
    [3, 2],
    [0, 1],
  ],
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
];

export default function IsometricParticleCluster({
  shape = "hashtag",
  logoImage = "",
  morphStages,
  particleColor = "#ffffff",
  particleBrightness = 1,
  lineColor = "#ffffff",
  particleSize = 0.1,
  lineOpacity = 0.15,
  particleDensity = 400,
  autoRotationSpeed = 1,
  interactionStrength = 0.25,
  damping = 0.05,
  className,
  style,
}: IsometricParticleClusterProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const morphKey = JSON.stringify(morphStages ?? []);
  const motionRef = useRef({
    autoRotationSpeed,
    interactionStrength,
    damping,
  });
  motionRef.current = { autoRotationSpeed, interactionStrength, damping };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isMounted = true;
    const reduced = prefersReducedMotion();
    const pColor = new THREE.Color(particleColor).multiplyScalar(
      particleBrightness,
    );
    const isMobile = window.innerWidth < 768;
    const cores =
      typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 8 : 8;
    const tier: "high" | "low" = isMobile || cores <= 4 ? "low" : "high";
    const maxDensity = isMobile ? 600 : 1500;
    const density = Math.min(particleDensity, maxDensity);

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    // Additive point clouds don't benefit from >1.5x DPR, and the extra
    // fragments are pure fill-rate cost on integrated/mobile GPUs.
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, tier === "low" ? 1.25 : 1.5),
    );
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");
    // Guard against a stacked canvas (e.g. StrictMode double-mount in dev).
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 60);
    camera.lookAt(0, 0, 0);

    const paint = () => {
      renderer.render(scene, camera);
    };

    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    const meshes: ClusterMesh[] = [];
    const assembleLayers: AssembleLayer[] = [];
    let introComplete = reduced;
    let assembleStart: number | null = reduced ? 0 : null;
    let waitStart = 0;
    const INTRO_FALLBACK_MS = 2600;

    const clearMeshes = () => {
      assembleLayers.length = 0;
      introComplete = reduced;
      assembleStart = reduced ? 0 : null;
      meshes.forEach((mesh) => {
        clusterGroup.remove(mesh);
        mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material.dispose();
      });
      meshes.length = 0;
    };

    const addCloud = (positions: number[], edges: number[]) => {
      const faceGeo = new THREE.BufferGeometry();
      faceGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      const faceMat = new THREE.PointsMaterial({
        size: particleSize,
        color: pColor,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const faceMesh = new THREE.Points(faceGeo, faceMat);
      clusterGroup.add(faceMesh);
      meshes.push(faceMesh);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(edges, 3),
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: lineOpacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      clusterGroup.add(lineMesh);
      meshes.push(lineMesh);
      paint();
    };

    const addPoints = (
      positions: Float32Array,
      color: string,
      size: number,
      opacity: number,
    ) => {
      if (positions.length < 3) return;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Points(geo, mat);
      clusterGroup.add(mesh);
      meshes.push(mesh);
    };

    const addLines = (
      positions: Float32Array,
      color: string,
      opacity: number,
    ) => {
      if (positions.length < 6) return;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.LineSegments(geo, mat);
      clusterGroup.add(mesh);
      meshes.push(mesh);
    };

    const buildEarth = () => {
      clearMeshes();
      camera.position.set(0, 0.15, 48);
      camera.lookAt(0, 0, 0);
      const cloud = createEarthCloud({
        particleColor: `#${pColor.getHexString()}`,
        particleSize,
        lineColor,
        lineOpacity,
        tier,
      });
      cloud.points.forEach((layer) => {
        addAnimatedPoints(
          clusterGroup,
          meshes,
          assembleLayers,
          layer.positions,
          layer.color,
          layer.size,
          layer.opacity,
        );
      });
      cloud.lines.forEach((layer) => {
        addAnimatedLines(
          clusterGroup,
          meshes,
          assembleLayers,
          layer.positions,
          layer.color,
          layer.opacity,
        );
      });
      if (!reduced) {
        updateAssembleLayers(assembleLayers, 0);
      } else {
        updateAssembleLayers(assembleLayers, 1);
      }
      paint();
    };

    const buildHashtag = () => {
      clearMeshes();
      camera.position.set(0, 0, 60);
      camera.lookAt(0, 0, 0);

      const S = 6;
      const h = S / 2;
      const cubes = HASH_CELLS.map(([x, y]) => [x - 1.5, y - 1.5, 0] as const);
      const verticesMap = new Map<string, THREE.Vector3>();
      const edgeMap = new Map<string, number[]>();
      const facePositions: number[] = [];

      cubes.forEach(([cx, cy, cz]) => {
        const cubeCenter = new THREE.Vector3(cx * S, cy * S, cz * S);
        const localVertices: THREE.Vector3[] = [];
        for (const dx of [-1, 1]) {
          for (const dy of [-1, 1]) {
            for (const dz of [-1, 1]) {
              const px = cubeCenter.x + dx * h;
              const py = cubeCenter.y + dy * h;
              const pz = cubeCenter.z + dz * h;
              const key = `${Math.round(px * 10)},${Math.round(py * 10)},${Math.round(pz * 10)}`;
              if (!verticesMap.has(key)) {
                verticesMap.set(key, new THREE.Vector3(px, py, pz));
              }
              localVertices.push(new THREE.Vector3(px, py, pz));
            }
          }
        }

        for (let i = 0; i < 8; i++) {
          for (let j = i + 1; j < 8; j++) {
            const diffX = Math.abs(localVertices[i].x - localVertices[j].x);
            const diffY = Math.abs(localVertices[i].y - localVertices[j].y);
            const diffZ = Math.abs(localVertices[i].z - localVertices[j].z);
            if (Math.round(diffX + diffY + diffZ) === Math.round(S)) {
              const v1 = localVertices[i];
              const v2 = localVertices[j];
              const k1 = `${Math.round(v1.x * 10)},${Math.round(v1.y * 10)},${Math.round(v1.z * 10)}`;
              const k2 = `${Math.round(v2.x * 10)},${Math.round(v2.y * 10)},${Math.round(v2.z * 10)}`;
              const edgeKey = [k1, k2].sort().join("|");
              if (!edgeMap.has(edgeKey)) {
                edgeMap.set(edgeKey, [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z]);
              }
            }
          }
        }

        const buildFace = (
          axis: "x" | "y" | "z",
          dir: number,
          extX: number,
          extY: number,
          extZ: number,
        ) => {
          const cloudMargin = 0.88;
          for (let i = 0; i < density; i++) {
            const rx = (Math.random() - 0.5) * (extX * cloudMargin);
            const ry = (Math.random() - 0.5) * (extY * cloudMargin);
            const rz = (Math.random() - 0.5) * (extZ * cloudMargin);
            let px = cubeCenter.x + rx + (Math.random() - 0.5) * 0.4;
            let py = cubeCenter.y + ry + (Math.random() - 0.5) * 0.4;
            let pz = cubeCenter.z + rz + (Math.random() - 0.5) * 0.4;
            if (axis === "x") px = cubeCenter.x + dir * h + (Math.random() - 0.5) * 0.4;
            if (axis === "y") py = cubeCenter.y + dir * h + (Math.random() - 0.5) * 0.4;
            if (axis === "z") pz = cubeCenter.z + dir * h + (Math.random() - 0.5) * 0.4;
            facePositions.push(px, py, pz);
          }
        };

        buildFace("x", 1, 0, S, S);
        buildFace("x", -1, 0, S, S);
        buildFace("y", 1, S, 0, S);
        buildFace("y", -1, S, 0, S);
        buildFace("z", 1, S, S, 0);
        buildFace("z", -1, S, S, 0);
      });

      const edgePositions: number[] = [];
      edgeMap.forEach((line) => edgePositions.push(...line));
      addCloud(facePositions, edgePositions);
    };

    const buildLogo = (imgSrc: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!isMounted) return;
        clearMeshes();
        camera.position.set(0, 0, 60);
        camera.lookAt(0, 0, 0);

        const W = 512;
        const H = 512;
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          buildHashtag();
          return;
        }

        const aspect = img.width / img.height;
        let drawW = W;
        let drawH = H;
        if (aspect > 1) drawH = W / aspect;
        else drawW = H * aspect;
        ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
        const data = ctx.getImageData(0, 0, W, H).data;

        const solidPixels: Array<{ x: number; y: number }> = [];
        const edgePixels: Array<{ x: number; y: number }> = [];
        let minX = W;
        let maxX = 0;
        let minY = H;
        let maxY = 0;
        const isSolid = (x: number, y: number) => {
          if (x < 0 || x >= W || y < 0 || y >= H) return false;
          return data[(y * W + x) * 4 + 3] > 50;
        };

        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            if (!isSolid(x, y)) continue;
            solidPixels.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (
              !isSolid(x - 1, y) ||
              !isSolid(x + 1, y) ||
              !isSolid(x, y - 1) ||
              !isSolid(x, y + 1)
            ) {
              edgePixels.push({ x, y });
            }
          }
        }

        if (solidPixels.length === 0) {
          buildHashtag();
          return;
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const maxPx = Math.max(maxX - minX, maxY - minY) || 1;
        const scale = 24 / maxPx;
        const D = 6;
        const facePositions: number[] = [];
        const addParticle = (px: number, py: number, pz: number) => {
          const jitter = 0.3;
          facePositions.push(
            (px - centerX) * scale + (Math.random() - 0.5) * jitter,
            -(py - centerY) * scale + (Math.random() - 0.5) * jitter,
            pz + (Math.random() - 0.5) * jitter,
          );
        };

        const totalParticles = density * 40;
        const pickSolid = () =>
          solidPixels[Math.floor(Math.random() * solidPixels.length)];
        const pickEdge = () =>
          edgePixels[Math.floor(Math.random() * edgePixels.length)] ?? pickSolid();

        for (let i = 0; i < totalParticles * 0.35; i++) {
          const p = pickSolid();
          addParticle(p.x, p.y, D / 2);
        }
        for (let i = 0; i < totalParticles * 0.35; i++) {
          const p = pickSolid();
          addParticle(p.x, p.y, -D / 2);
        }
        for (let i = 0; i < totalParticles * 0.2; i++) {
          const p = pickSolid();
          addParticle(p.x, p.y, (Math.random() - 0.5) * D);
        }
        for (let i = 0; i < totalParticles * 0.1; i++) {
          const p = pickEdge();
          addParticle(p.x, p.y, (Math.random() - 0.5) * D);
        }

        const edgePositions: number[] = [];
        const W_grid = 80;
        const H_grid = 80;
        const pad = 2;
        const startX = Math.max(0, minX - pad);
        const startY = Math.max(0, minY - pad);
        const endX = Math.min(W - 1, maxX + pad);
        const endY = Math.min(H - 1, maxY + pad);
        const stepX = (endX - startX) / W_grid;
        const stepY = (endY - startY) / H_grid;
        const grid = Array.from({ length: W_grid + 1 }, () =>
          new Array<boolean>(H_grid + 1).fill(false),
        );
        for (let i = 0; i <= W_grid; i++) {
          for (let j = 0; j <= H_grid; j++) {
            grid[i][j] = isSolid(
              Math.floor(startX + i * stepX),
              Math.floor(startY + j * stepY),
            );
          }
        }

        const getPt = (i: number, j: number, edge: number) => {
          if (edge === 0) return { x: i + 0.5, y: j };
          if (edge === 1) return { x: i + 1, y: j + 0.5 };
          if (edge === 2) return { x: i + 0.5, y: j + 1 };
          return { x: i, y: j + 0.5 };
        };

        const contourPoints: Array<{ x: number; y: number }> = [];
        for (let i = 0; i < W_grid; i++) {
          for (let j = 0; j < H_grid; j++) {
            const idx =
              (grid[i][j] ? 8 : 0) |
              (grid[i + 1][j] ? 4 : 0) |
              (grid[i + 1][j + 1] ? 2 : 0) |
              (grid[i][j + 1] ? 1 : 0);
            MARCHING_SQUARES[idx].forEach((seg) => {
              const p1 = getPt(i, j, seg[0]);
              const p2 = getPt(i, j, seg[1]);
              const px1 = startX + p1.x * stepX;
              const py1 = startY + p1.y * stepY;
              const x1 = (px1 - centerX) * scale;
              const y1 = -(py1 - centerY) * scale;
              const px2 = startX + p2.x * stepX;
              const py2 = startY + p2.y * stepY;
              const x2 = (px2 - centerX) * scale;
              const y2 = -(py2 - centerY) * scale;
              edgePositions.push(x1, y1, D / 2, x2, y2, D / 2);
              edgePositions.push(x1, y1, -D / 2, x2, y2, -D / 2);
              contourPoints.push({ x: x1, y: y1 });
            });
          }
        }

        const depthLines: Array<{ x: number; y: number }> = [];
        const minGap = scale * Math.max(stepX, stepY) * 2.5;
        for (const pt of contourPoints) {
          const far = depthLines.every((dp) => {
            const dx = dp.x - pt.x;
            const dy = dp.y - pt.y;
            return dx * dx + dy * dy >= minGap * minGap;
          });
          if (far) {
            depthLines.push(pt);
            edgePositions.push(pt.x, pt.y, D / 2, pt.x, pt.y, -D / 2);
          }
        }

        addCloud(facePositions, edgePositions);
      };
      img.onerror = () => {
        if (isMounted) buildHashtag();
      };
      img.src = imgSrc;
    };

    if (shape === "earth") {
      buildEarth();
    } else if (typeof logoImage === "string" && logoImage.trim()) {
      buildLogo(logoImage.trim());
    } else {
      buildHashtag();
    }

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      time: 0,
    };
    let intersecting = true;

    let earthHalfW = 0;
    let earthHalfH = 0;
    let earthNarrow = false;
    // Scroll progress the earth glides across: 0 = hero (right), 1 = left.
    let scrollEased = 0;
    let dockEl: Element | null = null;

    // Morph chain: earth -> stage[0] -> stage[1] ... each synced to a heading.
    const stages = morphStages ?? [];
    type MorphPoint = {
      mesh: THREE.Points;
      live: Float32Array; // shared with the geometry attribute
      base: Float32Array; // earth rest positions
      shapes: Float32Array[]; // one position target per stage
      colorAttr: THREE.BufferAttribute; // live vertex colors
      baseColors: Float32Array; // cyan rest colors
      logoColors: Float32Array; // sampled logo colors (empty until loaded)
      baseSize: number; // resting point size
    };
    const morphPoints: MorphPoint[] = [];
    const morphLines: AssembleLayer[] = [];
    const stageEls: Array<Element | null> = stages.map(() => null);
    const stageEased: number[] = stages.map(() => 0);
    const stageReady: boolean[] = stages.map(() => false);
    const stageSpread: boolean[] = stages.map((s) => s.spread === true);
    const stageLogo: boolean[] = stages.map((s) => s.logo === true);
    let prevStageSig = -1;

    /**
     * Sample an image into a pool of 2D points. Auto-detects whether the icon is
     * light-on-dark or dark-on-light (and transparent backgrounds), so any icon
     * works without recoloring.
     */
    const sampleIconPool = (img: HTMLImageElement) => {
      // Match the canvas to the image aspect (no letterbox) so the corners are
      // real background pixels, not transparent padding.
      const maxDim = 240;
      const fit = maxDim / Math.max(img.width || 1, img.height || 1);
      const W = Math.max(1, Math.round((img.width || 1) * fit));
      const H = Math.max(1, Math.round((img.height || 1) * fit));
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;

      // Sample the four corners to characterize the background.
      const cornerIdx = [
        0,
        (W - 1) * 4,
        (H - 1) * W * 4,
        ((H - 1) * W + (W - 1)) * 4,
      ];
      let bgA = 0;
      let bgLum = 0;
      for (const c of cornerIdx) {
        bgA += data[c + 3];
        bgLum += data[c] + data[c + 1] + data[c + 2];
      }
      bgA /= 4;
      bgLum /= 4;
      const bgTransparent = bgA < 40;
      const bgLight = bgLum > 384;
      const isForeground = (i: number) => {
        if (data[i + 3] < 40) return false;
        if (bgTransparent) return true; // transparent bg -> any opaque pixel
        const lum = data[i] + data[i + 1] + data[i + 2];
        return bgLight ? lum < bgLum - 120 : lum > bgLum + 60;
      };

      const xs: number[] = [];
      const ys: number[] = [];
      let minX = W;
      let maxX = 0;
      let minY = H;
      let maxY = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          if (!isForeground(idx)) continue;
          xs.push(x);
          ys.push(y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      if (xs.length === 0) return null;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const span = Math.max(maxX - minX, maxY - minY) || 1;
      const scale = 26 / span; // icon footprint roughly matches the globe
      const n = xs.length;
      const px = new Float32Array(n);
      const py = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        px[i] = (xs[i] - cx) * scale;
        py[i] = -(ys[i] - cy) * scale;
      }
      return { px, py, n };
    };

    // Logo variant: keep only the cyan artwork (the rounded frame + the "V"
    // constellation) and drop the black plate and the background, so particles
    // trace the mark instead of filling a solid square.
    const sampleLogoPool = (img: HTMLImageElement) => {
      const maxDim = 320;
      const fit = maxDim / Math.max(img.width || 1, img.height || 1);
      const W = Math.max(1, Math.round((img.width || 1) * fit));
      const H = Math.max(1, Math.round((img.height || 1) * fit));
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;

      const isCyan = (i: number) => {
        if (data[i + 3] < 40) return false;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Cyan/teal: green & blue are strong and clearly above red.
        return g > 80 && b > 80 && (g + b) / 2 - r > 30;
      };

      const xs: number[] = [];
      const ys: number[] = [];
      let minX = W;
      let maxX = 0;
      let minY = H;
      let maxY = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          if (!isCyan(idx)) continue;
          xs.push(x);
          ys.push(y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      if (xs.length === 0) return null;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const span = Math.max(maxX - minX, maxY - minY) || 1;
      const scale = 30 / span;
      const n = xs.length;
      const px = new Float32Array(n);
      const py = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        px[i] = (xs[i] - cx) * scale;
        py[i] = -(ys[i] - cy) * scale;
      }
      return { px, py, n };
    };

    const buildIconTargets = (
      pool: { px: Float32Array; py: Float32Array; n: number },
      count: number,
    ) => {
      const out = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const idx = (Math.random() * pool.n) | 0;
        out[i * 3] = pool.px[idx];
        out[i * 3 + 1] = pool.py[idx];
        out[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
      return out;
    };

    const setupMorph = () => {
      if (stages.length === 0) return;
      morphPoints.length = 0;
      morphLines.length = 0;
      for (const layer of assembleLayers) {
        if (layer.kind === "points") {
          const base = new Float32Array(layer.positions.length);
          for (let k = 0; k < base.length; k++) {
            base[k] = layer.starts[k] + layer.delta[k];
          }
          const colorAttr = layer.mesh.geometry.getAttribute(
            "color",
          ) as THREE.BufferAttribute;
          const baseColors = (colorAttr.array as Float32Array).slice();
          morphPoints.push({
            mesh: layer.mesh as THREE.Points,
            live: layer.positions,
            base,
            shapes: stages.map(() => new Float32Array(0)),
            colorAttr,
            baseColors,
            logoColors: new Float32Array(0),
            baseSize: (
              (layer.mesh as THREE.Points).material as THREE.PointsMaterial
            ).size,
          });
        } else {
          morphLines.push(layer);
        }
      }
      stages.forEach((stage, si) => {
        if (stage.spread) {
          // Procedural "fill the whole background" target: normalized factors in
          // [-1,1] mapped to the viewport each frame (resize-independent).
          for (const mp of morphPoints) {
            const rnd = new Float32Array(mp.live.length);
            for (let k = 0; k < rnd.length; k++) rnd[k] = Math.random() * 2 - 1;
            mp.shapes[si] = rnd;
          }
          stageReady[si] = true;
          return;
        }
        if (!stage.image) return;
        const img = new Image();
        img.onload = () => {
          if (!isMounted) return;
          const pool = stage.logo ? sampleLogoPool(img) : sampleIconPool(img);
          if (!pool) return;
          for (const mp of morphPoints) {
            mp.shapes[si] = buildIconTargets(pool, mp.live.length / 3);
          }
          stageReady[si] = true;
        };
        img.src = stage.image;
      });
    };

    if (shape === "earth") setupMorph();

    const applyEarthPosition = () => {
      const rightX = earthNarrow ? earthHalfW * 0.1 : earthHalfW * 0.36;
      const leftX = earthNarrow ? -earthHalfW * 0.34 : -earthHalfW * 0.44;
      const y = earthNarrow ? earthHalfH * 0.06 : 0;
      const eP = 1 - Math.pow(1 - scrollEased, 3);
      clusterGroup.position.set(rightX + (leftX - rightX) * eP, y, 0);
    };

    const placeEarth = () => {
      if (shape !== "earth") {
        clusterGroup.position.set(0, 0, 0);
        return;
      }
      const dist = Math.abs(camera.position.z);
      earthHalfH = dist * Math.tan((camera.fov * Math.PI) / 360);
      earthHalfW = earthHalfH * camera.aspect;
      earthNarrow = container.clientWidth < 768;
      applyEarthPosition();
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      placeEarth();
      if (reduced) paint();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const viewObserver = new IntersectionObserver((entries) => {
      intersecting = entries[0]?.isIntersecting ?? false;
    });
    viewObserver.observe(container);

    const allowPointer = !reduced && shape !== "earth";
    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const feel = motionRef.current;
      mouse.targetX = nx * feel.interactionStrength;
      mouse.targetY = ny * feel.interactionStrength;
    };

    if (allowPointer) {
      window.addEventListener("pointermove", handlePointerMove);
    }

    let frameId = 0;
    if (reduced) {
      clusterGroup.rotation.x = shape === "earth" ? 0.16 : 0.22;
      clusterGroup.rotation.y = shape === "earth" ? 0.12 : 0.55;
      paint();
    } else {
      const render = (now: number) => {
        frameId = requestAnimationFrame(render);
        if (!intersecting) return;

        if (shape === "earth" && !introComplete) {
          if (waitStart === 0) waitStart = now;
          const introReady =
            document.documentElement.dataset.intro === "ready";
          // Start on the intro handoff, but never wait forever — guarantees the
          // formation always plays on every refresh even if the flag is missed.
          if (introReady || now - waitStart > INTRO_FALLBACK_MS) {
            if (assembleStart === null) assembleStart = now;
            const progress = Math.min(
              1,
              (now - assembleStart) / EARTH_ASSEMBLE_MS,
            );
            updateAssembleLayers(assembleLayers, progress);
            if (progress >= 1) introComplete = true;
          }
        }

        const feel = motionRef.current;
        mouse.time += 0.002 * feel.autoRotationSpeed;
        mouse.x += (mouse.targetX - mouse.x) * feel.damping;
        mouse.y += (mouse.targetY - mouse.y) * feel.damping;
        if (shape === "earth") {
          // Glide the earth from the right (hero) to the left, synced to the
          // first section heading: progress hits 1 exactly when that heading
          // reaches the middle of the viewport.
          const vh = window.innerHeight || 1;
          if (!dockEl) dockEl = document.querySelector("[data-earth-dock]");
          let rawP: number;
          if (dockEl) {
            const rect = dockEl.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            // center at bottom of viewport -> 0, center at middle -> 1
            rawP = (vh - center) / (vh * 0.5);
          } else {
            rawP = window.scrollY / (vh * 0.9);
          }
          rawP = Math.min(1, Math.max(0, rawP));
          scrollEased += (rawP - scrollEased) * 0.12;
          const eP = 1 - Math.pow(1 - scrollEased, 3);
          const rightX = earthNarrow ? earthHalfW * 0.1 : earthHalfW * 0.36;
          const leftX = earthNarrow ? -earthHalfW * 0.34 : -earthHalfW * 0.44;
          clusterGroup.position.x = rightX + (leftX - rightX) * eP;
          clusterGroup.rotation.x =
            0.16 + Math.sin(mouse.time * 0.35) * 0.08;
          clusterGroup.rotation.y =
            Math.sin(mouse.time * 0.22) * 0.38 + eP * 0.85;

          // Chained morph earth -> stage[0] -> stage[1] ..., each stage synced
          // to its heading reaching the center of the viewport.
          if (morphPoints.length) {
            const eArr: number[] = [];
            let active = false;
            for (let i = 0; i < stages.length; i++) {
              if (!stageReady[i]) {
                eArr.push(0);
                continue;
              }
              if (!stageEls[i]) {
                stageEls[i] = document.querySelector(stages[i].selector);
              }
              let raw = 0;
              const el = stageEls[i];
              if (el) {
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                raw = (vh - center) / (vh * 0.5);
              }
              raw = Math.min(1, Math.max(0, raw));
              stageEased[i] += (raw - stageEased[i]) * 0.12;
              const e = 1 - Math.pow(1 - stageEased[i], 3);
              eArr.push(e);
              if (stageEased[i] > 0.0006) active = true;
            }

            if (active) {
              // Viewport extents for procedural "spread" stages.
              const hw = earthHalfW * 1.15;
              const hh = earthHalfH * 1.15;
              const dz = earthHalfH * 0.5;
              let spreadE = 0;
              let logoE = 0;
              let sig = 0;
              for (let i = 0; i < stages.length; i++) {
                if (stageSpread[i] && eArr[i] > spreadE) spreadE = eArr[i];
                if (stageLogo[i] && eArr[i] > logoE) logoE = eArr[i];
                sig += eArr[i] * (i + 1);
              }
              // Only rewrite the (large) particle buffers when progress changes;
              // once a shape is fully settled the buffers are static.
              const stageChanged = Math.abs(sig - prevStageSig) > 1e-4;
              prevStageSig = sig;

              if (stageChanged) {
                for (const mp of morphPoints) {
                  const { live, base, shapes } = mp;
                  for (let k = 0; k < live.length; k++) {
                    let val = base[k];
                    for (let i = 0; i < shapes.length; i++) {
                      const e = eArr[i];
                      if (e <= 0) continue;
                      let target: number;
                      if (stageSpread[i]) {
                        const comp = k % 3;
                        const factor = comp === 0 ? hw : comp === 1 ? hh : dz;
                        target = shapes[i][k] * factor;
                      } else {
                        target = shapes[i][k];
                      }
                      val += (target - val) * e;
                    }
                    live[k] = val;
                  }
                  (
                    mp.mesh.geometry.getAttribute(
                      "position",
                    ) as THREE.BufferAttribute
                  ).needsUpdate = true;

                  if (logoE > 0) {
                    // Thicken so the logo reads as solid strokes, not dots.
                    (mp.mesh.material as THREE.PointsMaterial).size =
                      mp.baseSize * (1 + logoE * 1.1);
                    // If a stage supplied per-particle colors, fade toward them.
                    if (mp.logoColors.length) {
                      const c = mp.colorAttr.array as Float32Array;
                      const bc = mp.baseColors;
                      const lc = mp.logoColors;
                      for (let k = 0; k < c.length; k++) {
                        c[k] = bc[k] + (lc[k] - bc[k]) * logoE;
                      }
                      mp.colorAttr.needsUpdate = true;
                    }
                  }
                }
              }
              // Lines fade out (and rotation flattens) with the first stage.
              const e0 = eArr[0] ?? 0;
              for (const ln of morphLines) {
                (ln.mesh.material as THREE.LineBasicMaterial).opacity =
                  ln.targetOpacity * (1 - e0);
              }
              clusterGroup.rotation.x *= 1 - e0;
              clusterGroup.rotation.y *= 1 - e0;
              // Recenter for the spread, then dock the logo on the right of the CTA.
              let gx = clusterGroup.position.x * (1 - spreadE);
              let gy = clusterGroup.position.y * (1 - spreadE);
              if (logoE > 0) {
                const logoX = earthNarrow ? earthHalfW * 0.02 : earthHalfW * 0.42;
                gx += (logoX - gx) * logoE;
                gy += (0 - gy) * logoE;
                // Hold the logo perfectly straight (no drift/rotation).
                clusterGroup.rotation.y *= 1 - logoE;
                clusterGroup.rotation.x *= 1 - logoE;
              }
              clusterGroup.position.x = gx;
              clusterGroup.position.y = gy;
            }
          }
        } else {
          clusterGroup.rotation.x =
            Math.sin(mouse.time * 0.4) * 0.15 + mouse.y;
          clusterGroup.rotation.y = mouse.time + mouse.x;
        }
        paint();
      };
      frameId = requestAnimationFrame(render);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      clearMeshes();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [
    shape,
    logoImage,
    morphKey,
    particleColor,
    particleBrightness,
    lineColor,
    particleDensity,
    particleSize,
    lineOpacity,
  ]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 100,
        background: "transparent",
        overflow: "hidden",
        pointerEvents: shape === "earth" ? "none" : "auto",
        cursor: shape === "earth" ? "default" : undefined,
        touchAction: "pan-y",
        ...style,
      }}
    />
  );
}

"use client";

/**
 * Infinite image tunnel, ported from Framer:
 * https://framer.com/m/Infinite-scroll-F3bukW.js@RFzWw3xnhlB4MeO81nW3
 *
 * Auto-driven (not scroll-coupled) and ticked on the same GSAP clock as
 * Lenis so the page scroll never fights a second rAF / scroll lerp.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { SOLUTIONS_TUNNEL_IMAGES } from "@/lib/marketing/hero-prefetch";

const DEFAULT_IMAGES = [...SOLUTIONS_TUNNEL_IMAGES];

const TUNNEL_WIDTH = 24;
const TUNNEL_HEIGHT = 16;
const SEGMENT_DEPTH = 7;
const NUM_SEGMENTS = 8;
const FLOOR_COLS = 5;
const WALL_ROWS = 3;
const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;
const BG_HEX = 0x050505;
const LINE_HEX = 0x555555;
const LINE_OPACITY = 0.32;
/** Units of tunnel depth advanced per second. */
const AUTO_SPEED = 8.5;
/** Textures needed before first paint / onReady. */
const INITIAL_TEXTURE_COUNT = 3;

type InfiniteScrollTunnelProps = {
  images?: string[];
  className?: string;
  onReady?: () => void;
};

type SlabMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

/** Module-level cache so soft navigations reuse decoded GPU textures. */
const textureCache = new Map<string, Promise<THREE.Texture>>();

function configureTexture(tex: THREE.Texture) {
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 1;
  return tex;
}

function loadTexture(url: string): Promise<THREE.Texture> {
  const cached = textureCache.get(url);
  if (cached) return cached;

  const promise = new Promise<THREE.Texture>((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => resolve(configureTexture(tex)),
      undefined,
      reject,
    );
  }).catch((err) => {
    textureCache.delete(url);
    throw err;
  });

  textureCache.set(url, promise);
  return promise;
}

async function loadTexturePool(
  urls: string[],
  onPartial?: (textures: THREE.Texture[]) => void,
): Promise<THREE.Texture[]> {
  const pool: THREE.Texture[] = [];
  const initial = urls.slice(0, INITIAL_TEXTURE_COUNT);
  const rest = urls.slice(INITIAL_TEXTURE_COUNT);

  const firstBatch = await Promise.allSettled(initial.map((url) => loadTexture(url)));
  for (const result of firstBatch) {
    if (result.status === "fulfilled") pool.push(result.value);
  }
  onPartial?.(pool);

  if (rest.length === 0) return pool;

  const secondBatch = await Promise.allSettled(rest.map((url) => loadTexture(url)));
  for (const result of secondBatch) {
    if (result.status === "fulfilled") pool.push(result.value);
  }
  return pool;
}

function pickTexture(pool: THREE.Texture[]): THREE.Texture {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function createSlab(
  pos: THREE.Vector3,
  rot: THREE.Euler,
  wd: number,
  ht: number,
  texture: THREE.Texture,
): SlabMesh {
  const geom = new THREE.PlaneGeometry(wd, ht);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.78,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(pos);
  mesh.rotation.copy(rot);
  mesh.name = "slab_image";
  mesh.frustumCulled = true;
  return mesh;
}

function populateImages(group: THREE.Group, pool: THREE.Texture[]) {
  const w = TUNNEL_WIDTH / 2;
  const h = TUNNEL_HEIGHT / 2;
  const d = SEGMENT_DEPTH;
  const cellMargin = 0.45;

  let lastFloorIdx = -999;
  for (let i = 0; i < FLOOR_COLS; i++) {
    if (i > lastFloorIdx + 1 && Math.random() > 0.55) {
      group.add(
        createSlab(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2),
          new THREE.Euler(-Math.PI / 2, 0, 0),
          COL_WIDTH - cellMargin,
          d - cellMargin,
          pickTexture(pool),
        ),
      );
      lastFloorIdx = i;
    }
  }

  let lastCeilIdx = -999;
  for (let i = 0; i < FLOOR_COLS; i++) {
    if (i > lastCeilIdx + 1 && Math.random() > 0.72) {
      group.add(
        createSlab(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2),
          new THREE.Euler(Math.PI / 2, 0, 0),
          COL_WIDTH - cellMargin,
          d - cellMargin,
          pickTexture(pool),
        ),
      );
      lastCeilIdx = i;
    }
  }

  let lastLeftIdx = -999;
  for (let i = 0; i < WALL_ROWS; i++) {
    if (i > lastLeftIdx + 1 && Math.random() > 0.55) {
      group.add(
        createSlab(
          new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, Math.PI / 2, 0),
          d - cellMargin,
          ROW_HEIGHT - cellMargin,
          pickTexture(pool),
        ),
      );
      lastLeftIdx = i;
    }
  }

  let lastRightIdx = -999;
  for (let i = 0; i < WALL_ROWS; i++) {
    if (i > lastRightIdx + 1 && Math.random() > 0.55) {
      group.add(
        createSlab(
          new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, -Math.PI / 2, 0),
          d - cellMargin,
          ROW_HEIGHT - cellMargin,
          pickTexture(pool),
        ),
      );
      lastRightIdx = i;
    }
  }
}

function createSegment(zPos: number, pool: THREE.Texture[]) {
  const group = new THREE.Group();
  group.position.z = zPos;
  const w = TUNNEL_WIDTH / 2;
  const h = TUNNEL_HEIGHT / 2;
  const d = SEGMENT_DEPTH;

  const lineMaterial = new THREE.LineBasicMaterial({
    color: LINE_HEX,
    transparent: true,
    opacity: LINE_OPACITY,
  });
  const lineGeo = new THREE.BufferGeometry();
  const vertices: number[] = [];

  for (let i = 0; i <= FLOOR_COLS; i++) {
    const x = -w + i * COL_WIDTH;
    vertices.push(x, -h, 0, x, -h, -d);
    vertices.push(x, h, 0, x, h, -d);
  }
  for (let i = 1; i < WALL_ROWS; i++) {
    const y = -h + i * ROW_HEIGHT;
    vertices.push(-w, y, 0, -w, y, -d);
    vertices.push(w, y, 0, w, y, -d);
  }
  vertices.push(-w, -h, 0, w, -h, 0);
  vertices.push(-w, h, 0, w, h, 0);
  vertices.push(-w, -h, 0, -w, h, 0);
  vertices.push(w, -h, 0, w, h, 0);

  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  group.add(new THREE.LineSegments(lineGeo, lineMaterial));
  populateImages(group, pool);
  return group;
}

function createFallbackTexture(): THREE.Texture {
  const canvasTex = document.createElement("canvas");
  canvasTex.width = 2;
  canvasTex.height = 2;
  const ctx = canvasTex.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, 2, 2);
  }
  return configureTexture(new THREE.CanvasTexture(canvasTex));
}

export default function InfiniteScrollTunnel({
  images = DEFAULT_IMAGES,
  className = "",
  onReady,
}: InfiniteScrollTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReadyRef.current?.();
      return;
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let isVisible = true;
    let renderer: THREE.WebGLRenderer | null = null;
    let tickerCb: ((time: number, deltaTime: number) => void) | null = null;
    const segments: THREE.Group[] = [];
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const resize = () => {
      if (!renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const recycleForward = (segment: THREE.Group) => {
      let minZ = Infinity;
      for (const s of segments) minZ = Math.min(minZ, s.position.z);
      segment.position.z = minZ - SEGMENT_DEPTH;
    };

    const tick = (_time: number, deltaTime: number) => {
      if (disposed || !renderer || !isVisible) return;

      const dt = Math.min(deltaTime / 1000, 0.05);
      camera.position.z -= AUTO_SPEED * dt;

      const camZ = camera.position.z;
      for (const segment of segments) {
        if (segment.position.z > camZ + SEGMENT_DEPTH) {
          recycleForward(segment);
        }
      }

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(container);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize);

    let sceneBooted = false;
    const bootScene = (texturePool: THREE.Texture[]) => {
      if (disposed || sceneBooted || texturePool.length === 0) return;
      sceneBooted = true;

      scene.background = new THREE.Color(BG_HEX);
      scene.fog = new THREE.FogExp2(BG_HEX, 0.04);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      });
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      resize();

      for (let i = 0; i < NUM_SEGMENTS; i++) {
        const segment = createSegment(-i * SEGMENT_DEPTH, texturePool);
        scene.add(segment);
        segments.push(segment);
      }

      tickerCb = (_time: number, deltaTime: number) => {
        tick(_time, deltaTime);
      };
      gsap.ticker.add(tickerCb);
      setCanvasReady(true);
      onReadyRef.current?.();
    };

    void (async () => {
      let texturePool: THREE.Texture[] = [];
      try {
        texturePool = await loadTexturePool(images, (partial) => {
          if (partial.length > 0) bootScene(partial);
        });
      } catch {
        texturePool = [];
      }
      if (disposed) return;

      if (!sceneBooted) {
        if (texturePool.length === 0) texturePool = [createFallbackTexture()];
        bootScene(texturePool);
      }
    })();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      if (tickerCb) gsap.ticker.remove(tickerCb);

      segments.forEach((segment) => {
        segment.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
            obj.geometry.dispose();
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else (mat as THREE.Material).dispose();
          }
        });
        scene.remove(segment);
      });
      // Keep textures in module cache, do not dispose on unmount.
      renderer?.dispose();
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full overflow-hidden bg-[#050505] [contain:strict] [transform:translateZ(0)] ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-0 transition-opacity duration-500 [transform:translateZ(0)] data-[ready=true]:opacity-100"
        data-ready={canvasReady}
      />
    </div>
  );
}

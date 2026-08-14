# Particle animation system

Canonical reference for the scroll-driven GPU particle engine. Read this before changing morphs, formations, shaders, slots, or section IDs that drive the timeline.

**One rule:** there is a single `THREE.Points` mesh. Particles never spawn/despawn. The same indices lerp between adjacent target clouds. A second canvas, a second particle group, or a different count per shape will break morph correspondence.

---

## 1. What it does

On load, a scattered field assembles into an India-facing earth. As the page scrolls, that same cloud morphs along a fixed chain:

`earth → command field → cart → bot → gear → shield → delivery field → Vyuha logo`

Motion is GPU-side (custom ShaderMaterial). CPU only:

- picks the current adjacent formation pair
- writes `aPositionFrom` / `aPositionTo` when the pair changes
- damps uniforms (progress, noise, scale, slot offset, mouse)

Visual language: Dala-like — settled shapes sit still; noise/flow only during mid-flight; reverse scroll unwinds the same path.

---

## 2. Runtime topology

```
PageContent
  SmoothScroll (Lenis ↔ GSAP ScrollTrigger)
  ParticleScene  (dynamic, ssr:false, fixed inset canvas z-[1])
    Canvas (R3F)
      ParticleBridge
        useParticleController()  → writes particleState each raf
        ParticleSystem           → reads particleState in useFrame
  <main z-10>
    SectionFrame / sections with data-particle-slot
```

| Layer | File | Job |
|---|---|---|
| Boot + canvas | `src/components/particles/ParticleScene.tsx` | WebGL check, quality boot, DPR cap, fallback gradient |
| Input | `src/components/particles/ParticleController.tsx` | Scroll → stage, pointer → mouse, slots → world offset |
| Frame loop | `src/components/particles/ParticleSystem.tsx` | Buffer swaps, GSAP intro, damping, FPS downgrade |
| Material | `src/components/particles/ParticleMaterial.tsx` | Uniforms + ShaderMaterial |
| Shaders | `src/shaders/particles.ts` | GPU morph, curl noise, color, point size |
| Singleton state | `src/lib/particles/ParticleState.ts` | Shared mutable engine state (not React) |
| Chain + stage | `src/lib/particles/formationChain.ts` | `FORMATION_CHAIN`, `readFormationStage` |
| Registry | `src/lib/particles/ParticleTarget.ts` | `registerTarget`, `buildTargetCache` |
| Slots | `src/lib/particles/slotProjection.ts` | DOM slot → world XYZ, blended anchors |
| Quality | `src/lib/particles/ParticlePerformance.ts` | Tiers (HIGH…MINIMAL), GPU detect, counts, FPS monitor |
| Types | `src/types/particles.ts` | Shared types + `DEFAULT_VISUAL_CONFIG` |
| Public API | `src/components/particles/index.ts` | Re-exports for shape work |

Entry: `src/components/PageContent.tsx` loads `ParticleScene` with `next/dynamic` and remounts only when the query string changes (dev replay).

---

## 3. State (`particleState`)

Mutable singleton. Controllers write; `ParticleSystem` reads. Do not duplicate this in React state except `count` / `tier` in `ParticleScene` (those remount the geometry).

| Field | Meaning |
|---|---|
| `scrollProgress` | 0–1 page progress (Lenis or fallback) |
| `formationStage` | Continuous 0…7 along `FORMATION_CHAIN` (**this** drives morph after intro) |
| `introProgress` / `introComplete` | GSAP intro 0→1, then scroll morph is allowed |
| `engineReady` / `scrollWarmed` | Mesh exists; GPU morph pairs + fonts warmed behind the loader |
| `slotOffsetX/Y/Z` | World-space group translation toward the active slot |
| `activeSlotId` | Winning `data-particle-slot` id |
| `mouseX/Y` | NDC-ish −1…1, Y flipped |
| `mouseActive` | Pointer in window |
| `qualityTier` / `particleCount` | HIGH/MEDIUM/LOW and exact count |
| `reducedMotion` / `webglAvailable` | Accessibility + capability |
| `debug.visual` | Color/size/noise/mouse knobs (`DEFAULT_VISUAL_CONFIG`) |
| `debug.forceFormation` | Debug lock (only while settled on earth, `stage < 0.01`) |
| `breakProgress` | **Deprecated.** Derived as `min(1, formationStage)` |
| `slotTravel` | Legacy travel kick; controller now always writes `0` |

Helpers: `setFormationStage`, `setScrollProgress`, `setMouse`, `setActiveSlot`, `bootParticleState`, `resetIntro`, `completeIntroImmediately`, `markEngineReady`, `markScrollWarmed`, `armIntroAssemble`.

---

## 4. Lifecycle

### 4.1 Boot

`ParticleScene` on first client render:

1. `isWebGLAvailable()` — if false, radial CSS fallback, no canvas
2. `prefersReducedMotion()` + `detectQualityTier()` → `bootParticleState`
3. `useState(profile.count)` — changing count rebuilds `ParticleSystem` `useMemo` cache

Quality detection (`ParticlePerformance.ts`):

- Software GL / Save-Data → **MINIMAL**
- Weak GPU (old Mali/Adreno, Intel HD/UHD except Iris/Arc) → **LOW** (touch + weak → **MINIMAL**)
- Touch: **LOW**, or **MINIMAL** if ≤4 cores / ≤3 GB
- Desktop: ≤4 cores or ≤4 GB → **LOW**; 1440p+ or <8 cores → **MEDIUM**; else **HIGH**
- Reduced motion still boots LOW/MINIMAL (intro skipped)
- The tier a previous visit settled on is persisted (`localStorage`, 7-day TTL) and clamps boot detection down — repeat visits skip the downgrade ladder
- Dev builds accept a `?tier=high|medium|low|minimal` query override for QA
- Detection and per-tier profiles are memoized; media queries are cached with `change` listeners (no `matchMedia` in the frame loop)

Counts (`fitCount` resamples bakes — MINIMAL uses the LOW bake):

| Tier | Target count | DPR cap | Mouse | Noise | Shader LOD |
|---|---|---|---|---|---|
| HIGH | 12000 | 2 | yes (unless touch) | curl | 3 |
| MEDIUM | 8000 | 1.5 | yes | cheap hash | 2 |
| LOW | 5500 | 1 | no | off | 1 |
| MINIMAL | 2800 | 1 | no | off | 0 |

Runtime FPS: rolling 30-frame window (including intro). Floors 48 / 42 / 36; average below ~0.7× the floor drops **two** tiers at once. Soft drop (LOD + DPR, same count) during intro; remount to the cheaper count after intro — does **not** replay the assemble. Never upgrades; each drop is persisted for the next visit. Downgrades are cheap: target caches are memoized per count and every lower tier is prebuilt during idle time after the intro, and the ShaderMaterial persists across count remounts (no mid-scroll shader recompile — only geometry rebuilds). R3F `performance.regress()` also lowers DPR when a frame exceeds ~26 ms. Tab hidden → `frameloop="never"`. LOW and MINIMAL skip Lenis (see §4.4); a runtime drop to LOW/MINIMAL destroys Lenis mid-session via the `particle-tier-change` window event. The active tier is mirrored to `<html data-particle-tier>` so CSS can gate expensive effects (e.g. the nav backdrop blur).

### 4.2 Intro (pre-scroll)

Only if motion is allowed. `ParticleSystem` GSAP timeline:

| Phase | Duration | From → To | Notes |
|---|---|---|---|
| Warm | ~N frames | each `FORMATION_CHAIN` pair | Same `THREE.Points`, `uOpacity=0`. Compiles shader, uploads every adjacent buffer pair, waits `document.fonts.ready` (1.2s cap). Then restores scatter→earth and sets `engineReady` + `scrollWarmed`. |
| Load | ≥0.85s | — | Overlay waits for `engineReady` **and** `scrollWarmed` |
| Text | 0.52s + fade | — | Overlay out, hero/nav in |
| Gate | 250ms | — | After text is on screen |
| Assemble | 2.5s `power2.inOut` | `scattered-bg` → `earth-india` | `uProgress` 0→1, `uEarthMode` 0→1, mid-flight noise/flow |
| Settle | 0.85s | earth locked | `uFlowFade` 1→0, noise dies, `introComplete = true` |

`IntroLoader` stays up until GPU warmup finishes (and the 850ms floor), then crossfades: overlay out + hero line stagger in → **250ms** → scattered cloud assembles into earth (`introArmed`). On `scrollWarmed`, the controller refreshes ScrollTrigger / Lenis / slot + section caches so the first scroll is not a cold layout. Scroll unlocks after the text-in is underway so Lenis does not hitch the handoff.

Reduced motion: skip timeline, lock both buffers to earth, `uProgress=1`, `uEarthMode=1`, no noise. Skip the loader.

After intro, both `aPositionFrom` and `aPositionTo` are earth until `formationStage` leaves 0.

### 4.3 Scroll morph

Each `useFrame` after `introComplete`:

1. Damp displayed stage toward `particleState.formationStage` (λ from `getScrollFeel()` — ~1.85 forward / 1.55 reverse on HIGH)
2. `resolveFormationSegment(stage)` → `{ from, to, local, isBreak }`
3. If the adjacent pair changed, rewrite `aPositionFrom` / `aPositionTo` (index-matched)
4. Damp `uProgress` toward `smoothstep(local)` (HIGH morph λ ≈ 2.05)
5. Visual attrs (`aSize`, `aOpacity`, `aLayer`) hysteresis-switch to destination when `local > 0.62` (back when `< 0.28`)
6. Damp earth-mode, cyan-only, flow, noise, scale, group position/rotation

Settled (`local` near 0 or 1): noise and flow go to **0**. Shapes do not breathe.

### 4.4 Scroll feel

`src/lib/utils/scrollFeel.ts` — Lenis is **lerp-only** (no `duration` on the constructor; that would override lag). Wheel input sets a target; the page eases toward it. Particles trail further via stage/morph damp + ScrollTrigger scrub.

**Lenis runs only on HIGH/MEDIUM.** It animates native scrollTop from the shared rAF, so on weak devices dropped canvas frames would stutter the whole page scroll. LOW/MINIMAL use native scroll; stage/morph damping still smooths the particles.

| Tier | Lenis lerp | Wheel × | Particle stage λ |
|---|---|---|---|
| HIGH | 0.048 | 0.62 | 1.85 / 1.55 |
| MEDIUM | 0.062 | 0.72 | 2.2 / 1.85 |
| LOW | native scroll | 1 | 3.4 / 3.0 |
| MINIMAL | native scroll | 1 | snappy |

Reduced motion / LOW / MINIMAL skip Lenis; a runtime downgrade to LOW/MINIMAL tears Lenis down mid-session. Anchor jumps use a ~2s quartic ease, not the wheel lerp.

---

## 5. Formation chain (source of truth)

`src/lib/particles/formationChain.ts` — **not** `ParticleMorph.ts`.

```ts
FORMATION_CHAIN = [
  "earth-india",    // 0  hero (after intro)
  "section-bg",     // 1  command field
  "shopping-cart",  // 2  command-01 App Store
  "ai-bot",         // 3  command-02 Agents
  "ai-gear",        // 4  command-03 AI Tools
  "shield-lock",    // 5  box-perimeter
  "section-bg",     // 6  box-delivery (same generator as 1)
  "vyuha-logo",     // 7  demo
]
FORMATION_STAGE_MAX = 7
```

`resolveFormationSegment(stage)`:

- `fromIndex = floor(stage)` clamped to `max-1`
- `toIndex = fromIndex + 1`
- `local = fractional part` (1 when `stage >= max`)
- `isBreak = true` for **0→1** (earth→field) and **5→6** (shield→delivery field)

Break morphs use `uBreakMode=1`: bottom-first leave, larger arc, different earth-mode fade. Reverse uses the same mapping.

### 5.1 Stage from the DOM

`readFormationStage(viewportHeight)` is monotonic with page order:

```
stage = breakT + iconGate * (e1 + e2 + e3 + e4 + e5 + e6)
```

| Term | DOM id | Role |
|---|---|---|
| `breakT` | `#command` | 0…1 earth→field. Starts when top is at `1.05 * vh`, ends at `0.18 * vh` |
| `iconGate` | derived from `breakT` | 0 until break is ~82% done, then 0…1 over the last 18% — icons cannot start while earth is still forming |
| `e1` | `#command-01` | field → cart |
| `e2` | `#command-02` | cart → bot |
| `e3` | `#command-03` | bot → gear |
| `e4` | `#box-perimeter` | gear → shield |
| `e5` | `#box-delivery` | shield → field |
| `e6` | `#demo` | field → logo |

`sectionEnter(id)`: 0 when the section top is at `0.9 * vh`, 1 at `0.34 * vh`.

Section tops are cached in **document space** (one `getBoundingClientRect` per section per invalidation); the per-frame read derives viewport position from `window.scrollY` and never touches layout. `invalidateFormationDomCache()` (resize / scroll-warm) re-measures. Slot rects in `slotProjection.ts` use the same scheme via `invalidateParticleSlotCache()`. If a layout change moves sections without a resize, invalidate both caches.

**Invariant:** these six ids plus `#command` must exist. Renaming or removing them desyncs the morph from the copy. Adding a formation means adding a section id **and** inserting it in this sum in page order.

Hero `#top`, `#box`, `#box-advantage`, `#founders`, `#pillars` have slots (or not) but **do not** advance `formationStage`.

### 5.2 Scale / palette along the stage

Driven in `ParticleSystem` from damped `stage`:

| Stage band | Scale | Notes |
|---|---|---|
| Intro → earth | lerp 0.96 → `EARTH_SCALE` (1.4) | Idle sway only while `stage < 0.06` |
| Icons (1…5) | `ICON_SCALE` (1.22) | Orange→blue gradient |
| Delivery field (~6) | back toward 1.0 | Re-pins to viewport center |
| Logo (6→7) | `LOGO_SCALE` (1.45) | `uCyanOnly` ramps with `smoothstep(stage - 6)` |

---

## 6. Slot anchoring

Sections declare `data-particle-slot="<id>"`. `SectionFrame` does this automatically: `id` is both the section `id` and the slot id.

- **Left / right** (`side="left"|"right"`): slot is the empty column (hidden on mobile). Copy occupies the other half.
- **Center**: slot is `absolute inset-0` behind the copy.

Each animation frame, `listParticleSlotIds()` + `resolveBlendedSlotWorld()`:

- Score visible slots by viewport overlap × Gaussian distance to `0.45 * vh`
- Blend the top two winners so the group glides instead of snapping

Then **pin** toward world origin during field phases so the earth/field stay centered:

```
pin = breakPin * (1 - iconRelease)
iconRelease = intoIcons * (1 - deliveryField)
```

- Earth + command field: mostly pinned (center)
- Icon sections + logo: follow the empty column / slot
- Delivery field (`stage` 5→6): re-pin
- Logo: release again

`ParticleSystem` damps `points.position` toward that offset (λ ~1.15–1.8). Mouse parallax subtracts a little more.

Camera (fixed): `position [0, 0.35, 11]`, `fov 50`, `near 0.1`, `far 80`. Slot projection ray-intersects plane `z = 0`.

---

## 7. GPU morph

### 7.1 Geometry attributes

| Attribute | Size | Source |
|---|---|---|
| `position` | vec3 | Dummy; vertex shader uses from/to |
| `aPositionFrom` | vec3 | Current segment start (DynamicDraw) |
| `aPositionTo` | vec3 | Current segment end (DynamicDraw) |
| `aSeed` | float | Stable `hash2(i, …)` per index |
| `aSize` | float | Per-formation, hysteresis-swapped |
| `aOpacity` | float | Per-formation |
| `aLayer` | float | 0–3, see §8 |

All formations in a cache **must** have `count * 3` positions. Index `i` in shape A corresponds to index `i` in shape B. `sortPointsSpatially` (spherical key) keeps neighbors coherent across shapes.

### 7.2 Vertex shader (`src/shaders/particles.ts`)

Per particle:

1. Stagger: `delay = aSeed * maxDelay` (tiny, 0.028) except break mode: bottom-first from `aPositionFrom.y` plus seed
2. `eased = easeInOutQuint((uProgress - delay) / span)`
3. `pos = mix(from, to, eased) + side * arc` (break: larger downward arc)
4. Curl-noise displacement only while `flowGate` (not arrived) and `uNoiseStrength * uFlowFade` > ε
5. Optional radial `uPulse` (currently always 0 after intro — no heartbeat)
6. Per-particle mouse parallax scaled by depth / layer
7. `gl_PointSize` from `uSize * aSize * dpr * depthScale`, with earth-mode layer size tweaks

### 7.3 Fragment shader

Soft disc (`gl_PointCoord`, alpha falls to 0 past the disc — no `discard`, which defeats tile-GPU fast paths). Point size caps at 44 px on HIGH/MEDIUM (18 / 14 on LOW / MINIMAL). The canvas has **no depth buffer** (`gl.depth: false`, material `depthTest: false`) — a single Points draw with `depthWrite: false` never uses it. Two palettes mixed by earth-mode weight:

- **Scatter:** dark blue → cyan by seed, white core
- **Formed:** orange (`#f97316`) → blue (`#3b82f6`) along `vGrad` (diagonal of world pos), or cyan-only when `uCyanOnly > 0`
- Layer 0 in earth mode: almost transparent (`alphaScale = 0.1`) — globe **shell**, not icons

### 7.4 Uniforms that matter

| Uniform | Role |
|---|---|
| `uProgress` | Local morph 0–1 |
| `uEarthMode` | Formed-shape coloring (damped; on break, fades out with local) |
| `uBreakMode` | 0/1 wide dissolve |
| `uCyanOnly` | Force cyan formed colors (logo) |
| `uFlowFade` / `uNoiseStrength` / `uNoiseSpeed` | Mid-flight motion |
| `uIntroActive` | Extra intro/morph gating |
| `uMouse` / `uMouseActive` / `uMouseInfluence` | Parallax |
| `uSize` / `uOpacity` / `uIntensity` | Global look |
| `uPulse` | Unused in the live timeline (kept in shader) |
| `uReducedMotion` | Kills noise / mouse in shader |

Palette constants live in `PARTICLE_PALETTE` (`ParticleMaterial.tsx`).

---

## 8. Layers (`aLayer`)

Must match bake + icon generators + fragment coloring:

| Value | Earth | Icons / logo | Earth-mode look |
|---|---|---|---|
| 0 | Globe shell (fibonacci, sparse) | **Do not use** | Nearly invisible (`alphaScale 0.1`) |
| 1 | World country borders | Field particles (section-bg uses 1 or 2) | Visible, medium |
| 2 | Sri Lanka | Soft fill | Visible |
| 3 | India highlight | Bright outline / hot logo core | Brightest, slightly smaller points |

`section-bg` **must** use layers 1–2. Layer 0 on a field/icon makes particles flash out when `uEarthMode` is high.

---

## 9. Formations

Registered in `ParticleTarget.ensureDefaults()` / `buildTargetCache(count)`.

| Id | File | Kind | Buffers |
|---|---|---|---|
| `earth-india` | `targets/earth.ts` | Baked JSON | pos + layers + sizes + opacities |
| `scattered-bg` | `targets/scatteredBg.ts` | Procedural, **not** radius-normalized | pos only |
| `section-bg` | `targets/sectionBg.ts` | Procedural full-bleed field | pos + visual attrs, layers 1–2 |
| `shopping-cart` | `targets/shoppingCart.ts` | Procedural icon | outline L3 / fill L2, then normalize + spatial sort |
| `ai-bot` | `targets/aiBot.ts` | Procedural icon | same |
| `ai-gear` | `targets/aiGear.ts` | Procedural icon | same |
| `shield-lock` | `targets/shieldLock.ts` | Procedural icon | same |
| `vyuha-logo` | `targets/vyuhaLogo.ts` | Baked from PNG | pos + visual attrs |
| `placeholder` | `targets/placeholder.ts` | Ellipsoid stand-in | pos, radius-normalized |

Icons: sample polylines / rings / disks in a ~[-1,1] design space, `normalizeToRadius(…, 2.4 * 1.05)`, `sortPointsSpatially`. Shared radius band is **2.2–2.6** (`normalizeToRadius.ts`) so morph travel distance stays similar.

`scattered-bg` is **only** for the intro. It is wide (≈ 24 × 15 world units) on purpose.

### 9.1 Baked earth

- Assets: `src/lib/particles/earthBoundaryData/{high,medium,low}.json` + `manifest.json`
- Bake: `npm run bake:earth` → `scripts/bake-earth.cjs`
- Sources in `scripts/earth-raw/`: Natural Earth 10m India-POV countries + DataMeet `india-composite.geojson`
- Sphere projection: `lonOffsetDeg = 78.9` so India faces the camera at `+Z`
- Bake **counts** (7000 / 4800 / 3600) are smaller than runtime targets; `fitCount` resamples. Prefer exact-count bakes if you re-run the pipeline — update `TIERS` in the bake script to 12000 / 8000 / 5500 if you want 1:1
- Shell share is kept sparse (~8%) so borders read as outlines, not a filled ball

### 9.2 Baked logo

- Assets: `src/lib/particles/vyuhaLogoData/{high,medium,low}.json`
- Bake: `npm run bake:vyuha` → `scripts/bake-vyuha-logo.mjs`
- Source: `scripts/vyuha-raw/logo-ref-flat.png` (do **not** sample the Meshy GLB atlas)
- Tiers **match** runtime: 12000 / 8000 / 5500
- Samples glowing (cyan-biased) pixels; hot cores → layer 3; radius 2.55

---

## 10. How to add a formation

Do this in order. Skipping the chain/DOM step means the shape exists but never appears.

1. **Generator** in `src/components/particles/targets/<name>.ts`
   - Export `NAME_FORMATION = "<id>"`
   - Export `generateXTarget(count)` and, if you need layers/sizes, `getXFormationBuffers(count): FormationBuffers`
   - Exact `count` length. Use layers **2 and 3** for icons (never 0)
   - `normalizeToRadius` + `sortPointsSpatially` for compact shapes
2. **Register** in `ParticleTarget.ts` `ensureDefaults()` **and** the `buildTargetCache` / `getTargetPositions` branches (same pattern as cart/bot/gear)
3. **Re-export** from `src/components/particles/index.ts`
4. **Insert** into `FORMATION_CHAIN` at the right index (page order)
5. **Drive the stage:** add a section with a stable `id`, then add `sectionEnter("that-id")` into `readFormationStage` in the same order. If it is a wide dissolve (field-like), add the index pair to `isBreak`
6. **Slot:** use `SectionFrame` (gets `data-particle-slot` for free) or a manual `data-particle-slot` on a sized box. Left/right sides leave a column for the icon; center pins behind copy
7. **Tune** scale / cyan-only / pin in `ParticleSystem` / `ParticleController` only if the new stage needs a distinct treatment (logo and earth already special-cased)

Do **not** call `setMorphSegments` for the live timeline. That API is leftover (earth→section-bg only) and is not what `useFrame` reads.

---

## 11. How to add / move a page section

| Goal | What to change |
|---|---|
| Copy-only section (no morph) | Any `SectionFrame`; optional slot. Do **not** add to `readFormationStage` |
| Section that **is** a morph beat | Stable `id` + `FORMATION_CHAIN` entry + `sectionEnter` term in page order |
| Keep earth centered on a new mid-page field | Treat like delivery: pin band in `ParticleController` using `smoothstep(stage - n)` |
| Mobile | Left/right slots are `hidden md:block`. Icons still morph; they stay centered via pin logic when the slot is gone |

Never animate a second particle system for a section. Never put `pointer-events` on the canvas (it is `pointer-events-none` so UI stays clickable).

---

## 12. Accessibility and fallbacks

- `prefers-reduced-motion: reduce`: no Lenis, skip intro, snap stage to integers, no mouse, no idle sway, noise off
- No WebGL: CSS radial gradient only (`ParticleScene` fallback + `PageContent` background)
- Touch: quality LOW (MINIMAL on weak GPUs / ≤4 cores), mouse disabled
- LOW: native scroll (no Lenis), 5500 points, DPR 1, no noise, no nav backdrop blur
- MINIMAL: native scroll (no Lenis), 2800 points, DPR 1, no noise, no nav backdrop blur
- Hidden tab pauses the WebGL loop
- Canvas is `aria-hidden`

---

## 13. Legacy — do not confuse

| API | Status |
|---|---|
| `setMorphSegments` / `resolveMorph` / `getEffectiveProgress` | Unused by the live scroll path. `resolveMorph` only appears in a debug `forceFormation` branch |
| `breakProgress` / `setBreakProgress` | Derived; stage is canonical |
| `slotTravel` | Controller writes 0; decay still runs |
| `uPulse` | Shader-ready, timeline sets 0 |
| `placeholder` formation | Registered, not in `FORMATION_CHAIN` |

---

## 14. Invariants (break these and morphs look wrong)

1. One mesh, one count, index-matched targets
2. `FORMATION_CHAIN` order = page order of stage drivers
3. `#command`, `#command-01`, `#command-02`, `#command-03`, `#box-perimeter`, `#box-delivery`, `#demo` stay in the DOM with those ids unless you update `readFormationStage`
4. Icon/field particles: `aLayer` ∈ {1, 2, 3}, never 0
5. Compact shapes: radius ~2.4 and spatial-sorted
6. `scattered-bg` is intro-only and not radius-normalized
7. Settled noise/flow must be 0 (damp toward 0, don’t leave a floor on settled shapes)
8. Reverse scroll must unwind — no one-shot flags that don’t go backwards
9. Don’t add hero overlays, extra canvases, or per-section particle components
10. Rebake logo from PNG; rebake earth from GeoJSON — don’t hand-edit the JSON blobs

---

## 15. Debug / replay

- `ParticleScene` key = search params string. Changing `?anything` remounts the canvas and replays the intro
- `?tier=high|medium|low|minimal` (dev builds only) forces a quality tier for QA
- `particleState.debug.forceFormation` locks a shape only while intro is done **and** `stage < 0.01`
- Visual knobs: `particleState.debug.visual` (`DEFAULT_VISUAL_CONFIG` in `src/types/particles.ts`)
- A persisted downgrade lives in `localStorage["vyuha:particle-tier"]` (7-day TTL) — clear it to re-test boot detection

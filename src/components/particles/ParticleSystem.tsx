"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import {
  createParticleMaterial,
  createParticleUniforms,
} from "@/components/particles/ParticleMaterial";
import {
  resolveMorph,
  smoothstep,
} from "@/lib/particles/ParticleMorph";
import {
  FORMATION_STAGE_MAX,
  resolveFormationSegment,
} from "@/lib/particles/formationChain";
import {
  downgradeTier,
  FpsMonitor,
  getQualityProfile,
  prefersReducedMotion,
} from "@/lib/particles/ParticlePerformance";
import {
  completeIntroImmediately,
  decaySlotTravel,
  getEffectiveProgress,
  particleState,
  resetIntro,
  setIntroProgress,
} from "@/lib/particles/ParticleState";
import {
  buildTargetCache,
  getFormationBuffers,
  getTargetPositions,
} from "@/lib/particles/ParticleTarget";
import { hash2 } from "@/lib/particles/ParticleNoise";
import type { ParticleFormation, QualityTier } from "@/types/particles";
import { EARTH_FORMATION } from "@/components/particles/targets/earth";
import { SCATTERED_BG_FORMATION } from "@/components/particles/targets/scatteredBg";

interface ParticleSystemProps {
  count: number;
  onQualityChange?: (count: number, tier: QualityTier) => void;
}

const EARTH_SWAY_Y = (4.0 * Math.PI) / 180;
const EARTH_SWAY_X = (2.2 * Math.PI) / 180;
const EARTH_MOUSE_Y = (5 * Math.PI) / 180;
const EARTH_MOUSE_X = (3.5 * Math.PI) / 180;
/** Group-level mouse parallax (world units at full cursor). */
const PARALLAX_POS_X = 0.72;
const PARALLAX_POS_Y = 0.48;
const PARALLAX_ROT_Y = (9 * Math.PI) / 180;
const PARALLAX_ROT_X = (6 * Math.PI) / 180;
const EARTH_SCALE = 1.4;
const ICON_SCALE = 1.22;
const LOGO_SCALE = 1.45;
const FLOW_FLOOR = 0.04;
const NOISE_FLOOR = 0.008;
const INTENSITY_FLOOR = 1.55;

const INTRO_ASSEMBLE = 5.2;
const INTRO_DELAY = 0.12;
const INTRO_SETTLE = 1.4;

function fillSeedBuffers(count: number) {
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);
  const layers = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    seeds[i] = hash2(i, 0.37);
    sizes[i] = 0.7 + hash2(i, 1.91) * 0.6;
    opacities[i] = 0.55 + hash2(i, 2.53) * 0.45;
    layers[i] = 0;
  }
  return { seeds, sizes, opacities, layers };
}

function applyVisualAttrs(
  geo: THREE.BufferGeometry,
  formation: ParticleFormation,
  cache: ReturnType<typeof buildTargetCache>,
  defaults: {
    sizes: Float32Array;
    opacities: Float32Array;
    layers: Float32Array;
  },
) {
  const buffers = getFormationBuffers(cache, formation);
  const sizeAttr = geo.getAttribute("aSize") as THREE.BufferAttribute;
  const opacityAttr = geo.getAttribute("aOpacity") as THREE.BufferAttribute;
  const layerAttr = geo.getAttribute("aLayer") as THREE.BufferAttribute;

  (sizeAttr.array as Float32Array).set(buffers.sizes ?? defaults.sizes);
  (opacityAttr.array as Float32Array).set(
    buffers.opacities ?? defaults.opacities,
  );
  (layerAttr.array as Float32Array).set(buffers.layers ?? defaults.layers);
  sizeAttr.needsUpdate = true;
  opacityAttr.needsUpdate = true;
  layerAttr.needsUpdate = true;
}

function writePositions(
  attr: THREE.BufferAttribute | null | undefined,
  data: Float32Array,
) {
  if (!attr || !data || data.length === 0) return;
  const arr = attr.array as Float32Array;
  if (arr.length !== data.length) return;
  arr.set(data);
  attr.needsUpdate = true;
}

function getPosAttr(
  geo: THREE.BufferGeometry,
  name: "aPositionFrom" | "aPositionTo",
): THREE.BufferAttribute | null {
  const attr = geo.getAttribute(name);
  return attr ? (attr as THREE.BufferAttribute) : null;
}

function lockEarthBuffers(
  cache: ReturnType<typeof buildTargetCache>,
  geo: THREE.BufferGeometry,
) {
  const earthBuf = getTargetPositions(cache, EARTH_FORMATION);
  writePositions(getPosAttr(geo, "aPositionFrom"), earthBuf);
  writePositions(getPosAttr(geo, "aPositionTo"), earthBuf);
}

export function ParticleSystem({ count, onQualityChange }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const fromAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const toAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const lastSegmentRef = useRef<{
    from: ParticleFormation;
    to: ParticleFormation;
    index: number;
  } | null>(null);
  const fpsRef = useRef(new FpsMonitor(90));
  const downgradeCooldownRef = useRef(0);
  const defaultsRef = useRef<ReturnType<typeof fillSeedBuffers> | null>(null);
  const settledRef = useRef(false);
  const swayBlendRef = useRef(0);
  const travelMorphRef = useRef(0);
  /** Display stage — light damp of the unified formation timeline. */
  const stageDisplayRef = useRef(0);
  const visualFormationRef = useRef<ParticleFormation | null>(null);
  const earthModeDisplayRef = useRef(1);
  const cyanOnlyDisplayRef = useRef(0);
  /** Extra damp on morph local progress — Dala-style catch-up. */
  const morphProgressRef = useRef(0);
  const displayPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const hasDisplayPosRef = useRef(false);
  const mouseSmoothRef = useRef(new THREE.Vector2(0, 0));
  const mouseBlendRef = useRef(0);
  const { gl } = useThree();

  const { geometry, material, uniforms, cache } = useMemo(() => {
    const targetCache = buildTargetCache(count);
    const scatterBuf = getTargetPositions(targetCache, SCATTERED_BG_FORMATION);
    const earthBuf = getFormationBuffers(targetCache, EARTH_FORMATION);
    const defaults = fillSeedBuffers(count);
    defaultsRef.current = defaults;

    const from = new Float32Array(scatterBuf);
    const to = new Float32Array(earthBuf.positions);
    const position = new Float32Array(scatterBuf);

    const geo = new THREE.BufferGeometry();
    const fromAttr = new THREE.BufferAttribute(from, 3);
    const toAttr = new THREE.BufferAttribute(to, 3);
    fromAttr.setUsage(THREE.DynamicDrawUsage);
    toAttr.setUsage(THREE.DynamicDrawUsage);

    const sizeArr = new Float32Array(earthBuf.sizes ?? defaults.sizes);
    const opacityArr = new Float32Array(earthBuf.opacities ?? defaults.opacities);
    const layerArr = new Float32Array(earthBuf.layers ?? defaults.layers);

    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aPositionFrom", fromAttr);
    geo.setAttribute("aPositionTo", toAttr);
    geo.setAttribute("aSeed", new THREE.BufferAttribute(defaults.seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizeArr, 1));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacityArr, 1));
    geo.setAttribute("aLayer", new THREE.BufferAttribute(layerArr, 1));

    const nextUniforms = createParticleUniforms(particleState.debug.visual);
    nextUniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    nextUniforms.uEarthMode.value = 0;
    nextUniforms.uIntroActive.value = 1;
    nextUniforms.uFlowFade.value = 1;
    nextUniforms.uProgress.value = 0;
    nextUniforms.uPulse.value = 0;
    nextUniforms.uBreakMode.value = 0;
    nextUniforms.uNoiseStrength.value = 0.22;
    nextUniforms.uNoiseSpeed.value = 0.12;
    const mat = createParticleMaterial(nextUniforms);

    fromAttrRef.current = fromAttr;
    toAttrRef.current = toAttr;
    lastSegmentRef.current = {
      from: SCATTERED_BG_FORMATION,
      to: EARTH_FORMATION,
      index: -1,
    };
    settledRef.current = false;
    swayBlendRef.current = 0;

    return {
      geometry: geo,
      material: mat,
      uniforms: nextUniforms,
      cache: targetCache,
    };
  }, [count, gl]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    resetIntro();
    const scatterBuf = getTargetPositions(cache, SCATTERED_BG_FORMATION);
    const earthBuf = getTargetPositions(cache, EARTH_FORMATION);
    writePositions(getPosAttr(geometry, "aPositionFrom"), scatterBuf);
    writePositions(getPosAttr(geometry, "aPositionTo"), earthBuf);

    if (prefersReducedMotion() || particleState.reducedMotion) {
      completeIntroImmediately();
      lockEarthBuffers(cache, geometry);
      uniforms.uProgress.value = 1;
      uniforms.uIntroActive.value = 0;
      uniforms.uFlowFade.value = 0;
      uniforms.uEarthMode.value = 1;
      uniforms.uNoiseStrength.value = 0;
      uniforms.uPulse.value = 0;
      settledRef.current = true;
      return;
    }

    particleState.introProgress = 0;
    particleState.introComplete = false;
    settledRef.current = false;
    swayBlendRef.current = 0;
    stageDisplayRef.current = 0;
    visualFormationRef.current = null;
    earthModeDisplayRef.current = 1;
    cyanOnlyDisplayRef.current = 0;
    uniforms.uProgress.value = 0;
    uniforms.uIntroActive.value = 1;
    uniforms.uFlowFade.value = 1;
    uniforms.uEarthMode.value = 0;
    uniforms.uCyanOnly.value = 0;
    uniforms.uNoiseStrength.value = 0.22;
    uniforms.uPulse.value = 0;
    uniforms.uBreakMode.value = 0;

    const proxy = { t: 0, flow: 1, earth: 0 };

    const tl = gsap.timeline({
      delay: INTRO_DELAY,
      onComplete: () => {
        setIntroProgress(1);
        lockEarthBuffers(cache, geometry);
        lastSegmentRef.current = {
          from: EARTH_FORMATION,
          to: EARTH_FORMATION,
          index: 0,
        };
        uniforms.uProgress.value = 1;
        uniforms.uIntroActive.value = 0;
        uniforms.uFlowFade.value = 0;
        uniforms.uEarthMode.value = 1;
        uniforms.uNoiseStrength.value = 0;
        uniforms.uPulse.value = 0;
        settledRef.current = true;
      },
    });

    tl.to(proxy, {
      t: 1,
      earth: 1,
      duration: INTRO_ASSEMBLE,
      ease: "power2.inOut",
      onUpdate: () => {
        particleState.introProgress = proxy.t;
        uniforms.uProgress.value = proxy.t;
        uniforms.uEarthMode.value = proxy.earth;
        uniforms.uIntroActive.value = 1;
        const mid = proxy.t * (1 - proxy.t) * 4;
        uniforms.uFlowFade.value = 0.7 + mid * 0.3;
        uniforms.uNoiseStrength.value = 0.12 + mid * 0.16;
        uniforms.uPulse.value = 0;
      },
    });

    tl.to(proxy, {
      flow: 0,
      duration: INTRO_SETTLE,
      ease: "power2.inOut",
      onStart: () => {
        lockEarthBuffers(cache, geometry);
        particleState.introProgress = 1;
        uniforms.uProgress.value = 1;
        uniforms.uEarthMode.value = 1;
        uniforms.uPulse.value = 0;
      },
      onUpdate: () => {
        uniforms.uProgress.value = 1;
        uniforms.uEarthMode.value = 1;
        uniforms.uPulse.value = 0;
        uniforms.uFlowFade.value = proxy.flow;
        uniforms.uNoiseStrength.value = 0.06 * proxy.flow;
        uniforms.uIntroActive.value = proxy.flow > 0.02 ? 1 : 0;
      },
    });

    return () => {
      tl.kill();
    };
  }, [uniforms, cache, geometry]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const visual = particleState.debug.visual;
    const introDone = particleState.introComplete;
    const introT = particleState.introProgress;
    const settling = introT >= 0.999 && !settledRef.current;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uNoiseSpeed.value = introDone ? 0.045 : 0.09;
    uniforms.uMouseInfluence.value = visual.mouseInfluence;
    uniforms.uOpacity.value = visual.particleOpacity;
    uniforms.uReducedMotion.value = particleState.reducedMotion ? 1 : 0;

    // Smooth cursor → parallax (ease out when pointer leaves)
    const wantMouse =
      particleState.mouseActive && !particleState.reducedMotion ? 1 : 0;
    mouseBlendRef.current = THREE.MathUtils.damp(
      mouseBlendRef.current,
      wantMouse,
      wantMouse > 0.5 ? 5 : 2.4,
      delta,
    );
    mouseSmoothRef.current.x = THREE.MathUtils.damp(
      mouseSmoothRef.current.x,
      particleState.mouseActive ? particleState.mouseX : 0,
      4.5,
      delta,
    );
    mouseSmoothRef.current.y = THREE.MathUtils.damp(
      mouseSmoothRef.current.y,
      particleState.mouseActive ? particleState.mouseY : 0,
      4.5,
      delta,
    );
    const mx = mouseSmoothRef.current.x;
    const my = mouseSmoothRef.current.y;
    const mBlend = mouseBlendRef.current;
    uniforms.uMouse.value.set(mx, my);
    uniforms.uMouseActive.value = mBlend;
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);

    let stage = 0;

    if (introDone) {
      const stageTarget = particleState.formationStage;
      // Soft catch-up — lower lambda = Dala-like inertia on scrub
      const stageDelta = stageTarget - stageDisplayRef.current;
      const stageLambda = particleState.reducedMotion
        ? 18
        : stageDelta < 0
          ? 2.6
          : 3.1;
      stageDisplayRef.current = THREE.MathUtils.damp(
        stageDisplayRef.current,
        stageTarget,
        stageLambda,
        delta,
      );
      if (
        Math.abs(stageDisplayRef.current - stageTarget) < 0.00035
      ) {
        stageDisplayRef.current = stageTarget;
      }
      stage = Math.min(
        FORMATION_STAGE_MAX,
        Math.max(0, stageDisplayRef.current),
      );

      const segment = resolveFormationSegment(stage);
      const prev = lastSegmentRef.current;

      // Rewrite buffers only when the adjacent pair changes — seamless at integers
      let segmentChanged = false;
      if (
        !prev ||
        prev.from !== segment.from ||
        prev.to !== segment.to ||
        prev.index !== segment.fromIndex
      ) {
        writePositions(
          getPosAttr(geometry, "aPositionFrom"),
          getTargetPositions(cache, segment.from),
        );
        writePositions(
          getPosAttr(geometry, "aPositionTo"),
          getTargetPositions(cache, segment.to),
        );
        lastSegmentRef.current = {
          from: segment.from,
          to: segment.to,
          index: segment.fromIndex,
        };
        segmentChanged = true;
      }

      const localTarget = particleState.reducedMotion
        ? segment.local > 0.5
          ? 1
          : 0
        : smoothstep(segment.local);

      if (segmentChanged) {
        // Snap onto the new pair so progress doesn't reverse across seams
        morphProgressRef.current = localTarget;
      } else {
        morphProgressRef.current = THREE.MathUtils.damp(
          morphProgressRef.current,
          localTarget,
          particleState.reducedMotion ? 18 : 3.4,
          delta,
        );
        if (Math.abs(morphProgressRef.current - localTarget) < 0.0004) {
          morphProgressRef.current = localTarget;
        }
      }
      const local = morphProgressRef.current;

      // Visual attrs follow the destination once mostly arrived (wide hysteresis)
      if (defaultsRef.current) {
        const want =
          local > 0.62
            ? segment.to
            : local < 0.28
              ? segment.from
              : visualFormationRef.current ?? segment.from;
        if (visualFormationRef.current !== want) {
          applyVisualAttrs(geometry, want, cache, defaultsRef.current);
          visualFormationRef.current = want;
        }
      }

      uniforms.uProgress.value = local;
      uniforms.uBreakMode.value = segment.isBreak ? 1 : 0;
      // Soft earth-mode handoff — hard 0→1 at field→cart made layer-0 field vanish
      const earthTarget = segment.isBreak ? 1 - local : 1;
      earthModeDisplayRef.current = THREE.MathUtils.damp(
        earthModeDisplayRef.current,
        earthTarget,
        3.2,
        delta,
      );
      uniforms.uEarthMode.value = earthModeDisplayRef.current;
      // Cyan-only palette while morphing into / holding the Vyuha logo (stage 6→7)
      const cyanTarget = smoothstep(Math.min(1, Math.max(0, stage - 6)));
      cyanOnlyDisplayRef.current = THREE.MathUtils.damp(
        cyanOnlyDisplayRef.current,
        cyanTarget,
        4.2,
        delta,
      );
      uniforms.uCyanOnly.value = cyanOnlyDisplayRef.current;
      uniforms.uIntroActive.value =
        local > 0.03 && local < 0.97 ? 1 : 0;
      uniforms.uPulse.value = 0;

      const mid = local * (1 - local) * 4;
      // Near-zero noise when settled — Dala particles sit still on the mark
      const flowing = local > 0.04 && local < 0.96;
      const flowTarget = flowing
        ? FLOW_FLOOR + mid * (segment.isBreak ? 0.1 : 0.055)
        : 0;
      const noiseTarget = flowing
        ? NOISE_FLOOR + mid * (segment.isBreak ? 0.028 : 0.014)
        : 0;

      uniforms.uFlowFade.value = THREE.MathUtils.damp(
        uniforms.uFlowFade.value,
        flowTarget,
        2.6,
        delta,
      );
      uniforms.uNoiseStrength.value = THREE.MathUtils.damp(
        uniforms.uNoiseStrength.value,
        noiseTarget,
        2.6,
        delta,
      );

      const sizeTarget = Math.max(
        visual.particleSize,
        stage < 1 ? THREE.MathUtils.lerp(2.2, 2.4, Math.min(1, stage)) : 2.5,
      );
      uniforms.uSize.value = THREE.MathUtils.damp(
        uniforms.uSize.value,
        sizeTarget,
        3.2,
        delta,
      );
      uniforms.uIntensity.value = Math.max(
        visual.particleIntensity,
        stage < 0.05 ? 1.35 : INTENSITY_FLOOR,
      );
    } else {
      uniforms.uBreakMode.value = 0;
      uniforms.uCyanOnly.value = 0;
      cyanOnlyDisplayRef.current = 0;
      uniforms.uPulse.value = 0;
      uniforms.uSize.value = Math.max(visual.particleSize, 2.0);
      uniforms.uIntensity.value = Math.max(visual.particleIntensity, 1.2);
    }

    // Slot follow — soft glide, no travel kicks
    const targetPos = {
      x: particleState.slotOffsetX,
      y: particleState.slotOffsetY,
      z: particleState.slotOffsetZ,
    };
    if (!hasDisplayPosRef.current) {
      displayPosRef.current.set(targetPos.x, targetPos.y, targetPos.z);
      hasDisplayPosRef.current = true;
    } else {
      const follow = particleState.reducedMotion
        ? 14
        : THREE.MathUtils.lerp(1.8, 1.15, Math.min(1, stage));
      displayPosRef.current.x = THREE.MathUtils.damp(
        displayPosRef.current.x,
        targetPos.x,
        follow,
        delta,
      );
      displayPosRef.current.y = THREE.MathUtils.damp(
        displayPosRef.current.y,
        targetPos.y,
        follow,
        delta,
      );
      displayPosRef.current.z = THREE.MathUtils.damp(
        displayPosRef.current.z,
        targetPos.z,
        follow,
        delta,
      );
    }
    points.position.copy(displayPosRef.current);
    // Group parallax — opposite to cursor for depth feel
    if (mBlend > 0.001) {
      const influence = visual.mouseInfluence;
      points.position.x -= mx * mBlend * PARALLAX_POS_X * influence;
      points.position.y -= my * mBlend * PARALLAX_POS_Y * influence;
    }

    travelMorphRef.current = THREE.MathUtils.damp(
      travelMorphRef.current,
      0,
      2.2,
      delta,
    );
    decaySlotTravel(delta * 2.4);

    const breakAmt = Math.min(1, stage);
    // Icon/logo scale while command icons or final logo are active
    const commandIcons =
      smoothstep(Math.min(1, Math.max(0, stage - 1))) *
      (1 - smoothstep(Math.min(1, Math.max(0, stage - 5))));
    const finalLogo = smoothstep(Math.min(1, Math.max(0, stage - 6)));
    const iconAmt = Math.max(commandIcons, finalLogo);
    const fieldScale = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(
        0.96,
        EARTH_SCALE,
        smoothstep(Math.min(1, introT * 1.02)),
      ),
      1.0,
      smoothstep(breakAmt),
    );
    const shapeScale = THREE.MathUtils.lerp(ICON_SCALE, LOGO_SCALE, finalLogo);
    const targetScale = THREE.MathUtils.lerp(
      fieldScale,
      shapeScale,
      iconAmt,
    );
    points.scale.setScalar(
      THREE.MathUtils.damp(points.scale.x || 1, targetScale, 2.2, delta),
    );

    const swayTarget =
      introDone &&
      settledRef.current &&
      stage < 0.06 &&
      !particleState.reducedMotion
        ? 1
        : 0;
    swayBlendRef.current = THREE.MathUtils.damp(
      swayBlendRef.current,
      swayTarget,
      0.55,
      delta,
    );
    const sb = swayBlendRef.current;
    const t = state.clock.elapsedTime;

    // Idle earth sway + mouse tilt (parallax) across all stages
    let rotY = 0;
    let rotX = 0;
    if (sb > 0.001) {
      rotY += Math.sin(t * 0.22) * EARTH_SWAY_Y * sb;
      rotX += Math.sin(t * 0.18 + 1.2) * EARTH_SWAY_X * sb;
    } else if (!introDone && !settling) {
      rotY += Math.sin(t * 0.12) * 0.03;
      rotX += Math.sin(t * 0.1) * 0.02;
    }
    if (mBlend > 0.001) {
      const influence = visual.mouseInfluence;
      rotY += mx * mBlend * PARALLAX_ROT_Y * influence;
      rotX += -my * mBlend * PARALLAX_ROT_X * influence;
      // Extra earth-stage mouse tilt (legacy feel)
      if (sb > 0.001) {
        rotY += mx * mBlend * EARTH_MOUSE_Y * sb;
        rotX += -my * mBlend * EARTH_MOUSE_X * sb;
      }
    }
    uniforms.uIdleSway.value = rotY;
    points.rotation.y = THREE.MathUtils.damp(points.rotation.y, rotY, 2.4, delta);
    points.rotation.x = THREE.MathUtils.damp(points.rotation.x, rotX, 2.4, delta);

    if (
      introDone &&
      settledRef.current &&
      stage < 0.01 &&
      particleState.debug.forceFormation
    ) {
      const morph = resolveMorph(getEffectiveProgress());
      const forced = particleState.debug.forceFormation;
      writePositions(
        getPosAttr(geometry, "aPositionFrom"),
        getTargetPositions(cache, forced),
      );
      writePositions(
        getPosAttr(geometry, "aPositionTo"),
        getTargetPositions(cache, forced),
      );
      if (defaultsRef.current) {
        applyVisualAttrs(geometry, forced, cache, defaultsRef.current);
      }
      lastSegmentRef.current = {
        from: forced,
        to: forced,
        index: morph.segmentIndex,
      };
      uniforms.uProgress.value = 1;
      uniforms.uEarthMode.value = forced === EARTH_FORMATION ? 1 : 1;
      uniforms.uBreakMode.value = 0;
    }

    if (introDone && onQualityChange && particleState.qualityTier !== "LOW") {
      fpsRef.current.push(delta);
      downgradeCooldownRef.current = Math.max(
        0,
        downgradeCooldownRef.current - delta,
      );
      if (
        downgradeCooldownRef.current === 0 &&
        fpsRef.current.shouldDowngrade(40)
      ) {
        const nextTier = downgradeTier(particleState.qualityTier);
        const profile = getQualityProfile(nextTier);
        particleState.qualityTier = profile.tier;
        particleState.particleCount = profile.count;
        downgradeCooldownRef.current = 4;
        fpsRef.current.reset();
        onQualityChange(profile.count, profile.tier);
      }
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </points>
  );
}

"use client";

import * as THREE from "three";
import {
  particleFragmentShader,
  particleVertexShader,
} from "@/shaders/particles";
import { DEFAULT_VISUAL_CONFIG } from "@/types/particles";

export const PARTICLE_PALETTE = {
  white: new THREE.Color("#ffffff"),
  cyan: new THREE.Color("#22d3ee"),
  darkBlue: new THREE.Color("#0b1f4d"),
  /** Warm end of formed-shape gradient */
  orange: new THREE.Color("#f97316"),
  /** Cool end of formed-shape gradient */
  blue: new THREE.Color("#3b82f6"),
} as const;

export type ParticleMaterialUniforms = {
  uProgress: { value: number };
  uTime: { value: number };
  uSize: { value: number };
  uNoiseStrength: { value: number };
  uNoiseSpeed: { value: number };
  uMouseInfluence: { value: number };
  uMouse: { value: THREE.Vector2 };
  uMouseActive: { value: number };
  uReducedMotion: { value: number };
  uPixelRatio: { value: number };
  uEarthMode: { value: number };
  uIntroActive: { value: number };
  uFlowFade: { value: number };
  uIdleSway: { value: number };
  /** Radial breathe / heartbeat amplitude (Dala-style pulse). */
  uPulse: { value: number };
  /** 1 while earth → section-bg break (bottom-first leave). */
  uBreakMode: { value: number };
  /** 1 = force cyan-only formed colors (Vyuha logo). */
  uCyanOnly: { value: number };
  /** 3=HIGH, 2=MEDIUM, 1=LOW, 0=MINIMAL — coherent shader LOD. */
  uLod: { value: number };
  uColorWhite: { value: THREE.Color };
  uColorCyan: { value: THREE.Color };
  uColorDarkBlue: { value: THREE.Color };
  uColorOrange: { value: THREE.Color };
  uColorBlue: { value: THREE.Color };
  uOpacity: { value: number };
  uIntensity: { value: number };
};

export function createParticleUniforms(
  visual = DEFAULT_VISUAL_CONFIG,
): ParticleMaterialUniforms {
  return {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: visual.particleSize },
    uNoiseStrength: { value: visual.noiseStrength },
    uNoiseSpeed: { value: visual.noiseSpeed },
    uMouseInfluence: { value: visual.mouseInfluence },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseActive: { value: 0 },
    uReducedMotion: { value: 0 },
    uPixelRatio: { value: 1 },
    uEarthMode: { value: 0 },
    uIntroActive: { value: 0 },
    uFlowFade: { value: 0 },
    uIdleSway: { value: 0 },
    uPulse: { value: 0 },
    uBreakMode: { value: 0 },
    uCyanOnly: { value: 0 },
    uLod: { value: 3 },
    uColorWhite: { value: PARTICLE_PALETTE.white.clone() },
    uColorCyan: { value: PARTICLE_PALETTE.cyan.clone() },
    uColorDarkBlue: { value: PARTICLE_PALETTE.darkBlue.clone() },
    uColorOrange: { value: PARTICLE_PALETTE.orange.clone() },
    uColorBlue: { value: PARTICLE_PALETTE.blue.clone() },
    uOpacity: { value: visual.particleOpacity },
    uIntensity: { value: visual.particleIntensity },
  };
}

export function createParticleMaterial(
  uniforms: ParticleMaterialUniforms,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    // Canvas has no depth buffer (ParticleScene gl.depth: false)
    depthTest: false,
    blending: THREE.NormalBlending,
  });
}

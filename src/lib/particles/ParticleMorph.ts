import type {
  MorphSegment,
  ParticleFormation,
  ResolvedMorph,
} from "@/types/particles";
import { PLACEHOLDER_FORMATION } from "@/types/particles";
import { EARTH_FORMATION } from "@/components/particles/targets/earth";
import { SECTION_BG_FORMATION } from "@/components/particles/targets/sectionBg";

/**
 * Scroll → morph timeline.
 * breakProgress (0–1 from #command ScrollTrigger) drives earth → section-bg.
 */
let morphSegments: MorphSegment[] = [
  {
    start: 0,
    end: 1,
    from: EARTH_FORMATION,
    to: SECTION_BG_FORMATION,
  },
];

export function getMorphSegments(): readonly MorphSegment[] {
  return morphSegments;
}

export function setMorphSegments(segments: MorphSegment[]): void {
  if (segments.length === 0) {
    morphSegments = [
      {
        start: 0,
        end: 1,
        from: PLACEHOLDER_FORMATION,
        to: PLACEHOLDER_FORMATION,
      },
    ];
    return;
  }
  morphSegments = [...segments].sort((a, b) => a.start - b.start);
}

export function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Soft ease with a hint of overshoot for intro-style morphs. */
export function springEase(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3) * Math.cos(x * Math.PI * 0.35);
}

export function resolveMorph(globalProgress: number): ResolvedMorph {
  const p = Math.min(1, Math.max(0, globalProgress));
  const segments = morphSegments;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (p <= seg.end || i === segments.length - 1) {
      const span = Math.max(1e-6, seg.end - seg.start);
      const local = Math.min(1, Math.max(0, (p - seg.start) / span));
      return {
        from: seg.from,
        to: seg.to,
        localProgress: local,
        segmentIndex: i,
      };
    }
  }

  const last = segments[segments.length - 1];
  return {
    from: last.from,
    to: last.to,
    localProgress: 1,
    segmentIndex: segments.length - 1,
  };
}

/** Convenience when a single formation should stay locked (e.g. reduced motion). */
export function holdFormation(formation: ParticleFormation): MorphSegment[] {
  return [{ start: 0, end: 1, from: formation, to: formation }];
}

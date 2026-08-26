/**
 * Lenis wheel feel. lerp only — do not also set duration on the constructor.
 */
export interface ScrollFeel {
  lerp: number;
  wheelMultiplier: number;
  touchMultiplier: number;
  anchorDuration: number;
}

const FEEL: ScrollFeel = {
  lerp: 0.048,
  wheelMultiplier: 0.62,
  touchMultiplier: 1.05,
  anchorDuration: 2.05,
};

export function luxuryEase(t: number): number {
  return 1 - (1 - t) ** 4;
}

export function getScrollFeel(): ScrollFeel {
  return FEEL;
}

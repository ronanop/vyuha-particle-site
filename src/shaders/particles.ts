/**
 * GPU particle morph shaders.
 * Intro assemble; scroll break: earth → section bg (bottom-first).
 * No idle / heartbeat pulse on settled earth.
 */

export const particleVertexShader = /* glsl */ `
attribute vec3 aPositionFrom;
attribute vec3 aPositionTo;
attribute float aSeed;
attribute float aSize;
attribute float aOpacity;
attribute float aLayer;

uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uNoiseStrength;
uniform float uNoiseSpeed;
uniform float uMouseInfluence;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uReducedMotion;
uniform float uPixelRatio;
uniform float uEarthMode;
uniform float uIntroActive;
uniform float uFlowFade;
uniform float uIdleSway;
uniform float uPulse;
uniform float uBreakMode;
uniform float uLod;

varying float vOpacity;
varying float vDepth;
varying float vSeed;
varying float vLayer;
varying float vArrive;
varying float vPulse;
varying float vGrad;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float n1 = hash(p + dy) - hash(p - dy);
  float n2 = hash(p + dz) - hash(p - dz);
  float n3 = hash(p + dx) - hash(p - dx);

  return normalize(vec3(n2 - n1, n3 - n2, n1 - n3) + vec3(0.0001));
}

float easeOutCubic(float t) {
  float x = 1.0 - clamp(t, 0.0, 1.0);
  return 1.0 - x * x * x;
}

float easeInOutCubic(float t) {
  float x = clamp(t, 0.0, 1.0);
  return x < 0.5
    ? 4.0 * x * x * x
    : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

float easeInOutQuint(float t) {
  float x = clamp(t, 0.0, 1.0);
  return x < 0.5
    ? 16.0 * x * x * x * x * x
    : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0;
}

void main() {
  float t = clamp(uProgress, 0.0, 1.0);

  float maxDelay;
  float delay;
  if (uBreakMode > 0.5) {
    // Bottom leaves first on the way out; same mapping reverses cleanly on the way back
    float bottomFirst = smoothstep(2.2, -2.4, aPositionFrom.y);
    maxDelay = 0.12;
    delay = (1.0 - bottomFirst) * maxDelay * 0.8 + aSeed * maxDelay * 0.2;
  } else {
    // Near-unified morph — stagger reads as jitter vs Dala
    maxDelay = 0.028;
    delay = aSeed * maxDelay;
  }

  float span = max(0.001, 1.0 - maxDelay);
  float raw = clamp((t - delay) / span, 0.0, 1.0);
  // Soft quintic both modes for buttery scrub
  float eased = easeInOutQuint(raw);

  vec3 pos = mix(aPositionFrom, aPositionTo, eased);
  float arrive = eased * eased;
  float flowGate = (1.0 - arrive) * (1.0 - arrive);

  // Arc + curl are fill/ALU heavy — skip on LOW/MINIMAL (uLod < 2)
  if (uLod > 1.5) {
    vec3 delta = aPositionTo - aPositionFrom;
    vec3 side = normalize(cross(delta, vec3(0.15, 1.0, 0.05)) + vec3(0.0001));
    float arcAmt = 0.04 + aSeed * 0.05;
    if (uBreakMode > 0.5) {
      side = normalize(mix(side, vec3(0.0, -1.0, 0.0), 0.45) + vec3(0.0001));
      arcAmt = 0.14 + aSeed * 0.12;
    }
    float arc = sin(3.14159265 * eased) * arcAmt;
    pos += side * arc * length(delta) * (uBreakMode > 0.5 ? 0.045 : 0.018);
  }

  float noiseAmp = uNoiseStrength * uFlowFade * flowGate;
  if (uBreakMode > 0.5) {
    noiseAmp *= 0.45;
  } else {
    noiseAmp *= 0.55;
  }

  if (uReducedMotion < 0.5 && noiseAmp > 0.0004 && uLod > 0.5) {
    if (uLod > 2.5) {
      vec3 flow = curlNoise(pos * 0.11 + vec3(aSeed * 1.7, uTime * uNoiseSpeed * 0.4, aSeed));
      pos += flow * noiseAmp * 0.18;
    } else {
      // MEDIUM: one hash instead of 6-tap curl
      float n = hash(pos * 0.11 + vec3(aSeed * 1.7, uTime * uNoiseSpeed * 0.4, aSeed));
      pos += (vec3(n) - 0.5) * noiseAmp * 0.22;
    }
  }

  float pulse = uPulse;
  if (uLod > 1.5 && uReducedMotion < 0.5 && abs(pulse) > 0.0005) {
    float phase = aSeed * 6.2831853;
    float wave = pulse * (0.85 + 0.15 * sin(phase));
    vec3 radial = normalize(pos + vec3(0.0001));
    float layerAmp = aLayer < 0.5 ? 1.15 : (aLayer > 2.5 ? 0.55 : 0.85);
    pos += radial * wave * 0.22 * layerAmp;
  }

  // Mouse-relative depth parallax — farther / outer particles shift more
  float mouseAmt = uLod > 1.5
    ? uMouseActive * uMouseInfluence * (1.0 - uReducedMotion) * mix(1.0, 0.35, flowGate)
    : 0.0;
  if (mouseAmt > 0.001) {
    float depthPlane = clamp(0.42 + (-pos.z) * 0.35 + aLayer * 0.08 + aSeed * 0.12, 0.28, 1.25);
    pos.x -= uMouse.x * mouseAmt * depthPlane * 0.55;
    pos.y -= uMouse.y * mouseAmt * depthPlane * 0.4;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depthScale = clamp(12.0 / max(0.5, -mvPosition.z), 0.35, 2.4);
  float sizeMul = aSize;
  float earthBlend;
  if (uBreakMode > 0.5) {
    earthBlend = clamp(uEarthMode * (1.0 - easeInOutCubic(eased)), 0.0, 1.0);
  } else {
    // Hold most of the glow through the morph — don't dim mid-scroll
    earthBlend = clamp(mix(uEarthMode * easeInOutCubic(eased), uEarthMode, 0.78), 0.0, 1.0);
  }
  if (earthBlend > 0.25) {
    if (aLayer > 2.5) sizeMul *= 0.945;
    else if (aLayer > 0.5) sizeMul *= 1.15;
    else sizeMul *= 0.7;
  }
  sizeMul *= mix(0.94, 1.0, eased);
  sizeMul *= 1.0 + abs(pulse) * 0.35;
  // 44px cap bounds fill rate on iGPUs that boot HIGH/MEDIUM
  float maxPt = uLod < 0.5 ? 14.0 : (uLod < 1.5 ? 18.0 : 44.0);
  gl_PointSize = clamp(uSize * sizeMul * uPixelRatio * depthScale, 1.0, maxPt);

  float depthFade = earthBlend > 0.45
    ? mix(0.78, 1.0, smoothstep(18.0, 4.0, -mvPosition.z))
    : smoothstep(22.0, 3.0, -mvPosition.z);

  vOpacity = aOpacity * mix(0.88, 1.0, eased) * (1.0 + abs(pulse) * 0.45);
  vDepth = depthFade;
  vSeed = aSeed;
  vLayer = aLayer;
  vArrive = eased;
  vPulse = pulse;
  // Diagonal orange→blue across formed shapes (soft seed jitter)
  vGrad = clamp(
    0.5 + 0.5 * (pos.y * 0.72 + pos.x * 0.38) + (aSeed - 0.5) * 0.12,
    0.0,
    1.0
  );
}
`;

export const particleFragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColorWhite;
uniform vec3 uColorCyan;
uniform vec3 uColorDarkBlue;
uniform vec3 uColorOrange;
uniform vec3 uColorBlue;
uniform float uOpacity;
uniform float uIntensity;
uniform float uEarthMode;
uniform float uBreakMode;
uniform float uCyanOnly;

varying float vOpacity;
varying float vDepth;
varying float vSeed;
varying float vLayer;
varying float vArrive;
varying float vPulse;
varying float vGrad;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float dist = length(uv);

  // No discard — it defeats tile-GPU fast paths; soft falls to 0 past the disc
  float soft = smoothstep(1.0, 0.18, dist);
  float core = smoothstep(0.55, 0.0, dist);

  vec3 scatterCol = mix(uColorDarkBlue, uColorCyan, smoothstep(0.1, 0.9, vSeed));
  scatterCol = mix(scatterCol, uColorWhite, core * 0.35);

  // Orange → blue across formed shapes (icons); logo forces cyan-only
  float g = smoothstep(0.08, 0.92, vGrad);
  vec3 warm = mix(uColorOrange, uColorWhite, 0.22 + core * 0.45);
  vec3 cool = mix(uColorBlue, uColorWhite, 0.28 + core * 0.5);
  vec3 gradientCol = mix(warm, cool, g);
  vec3 cyanCol = mix(uColorCyan, uColorWhite, 0.28 + core * 0.5);
  vec3 shapeCol = mix(gradientCol, cyanCol, clamp(uCyanOnly, 0.0, 1.0));

  vec3 earthCol;
  float alphaScale = 1.0;
  if (vLayer > 2.5) {
    earthCol = mix(shapeCol, uColorWhite, 0.18 + core * 0.35);
    alphaScale = 1.55;
  } else if (vLayer > 1.5) {
    earthCol = mix(shapeCol * 0.72, uColorWhite, 0.15 + core * 0.3);
    alphaScale = 1.05;
  } else if (vLayer > 0.5) {
    earthCol = mix(shapeCol * 0.85, uColorWhite, 0.2 + core * 0.35);
    alphaScale = 1.35;
  } else {
    earthCol = mix(
      mix(uColorOrange * 0.25, uColorBlue * 0.35, g),
      uColorCyan * 0.3,
      clamp(uCyanOnly, 0.0, 1.0)
    );
    alphaScale = 0.1;
  }

  float earthW = uBreakMode > 0.5
    ? clamp(uEarthMode * (1.0 - smoothstep(0.05, 0.9, vArrive)), 0.0, 1.0)
    // Keep icon/earth glow lit through the whole morph (no mid-scroll washout)
    : clamp(mix(uEarthMode * smoothstep(0.12, 0.92, vArrive), uEarthMode, 0.8), 0.0, 1.0);
  vec3 col = mix(scatterCol, earthCol, earthW);
  vec3 pulseGrad = mix(uColorOrange, uColorBlue, g);
  vec3 pulseCol = mix(pulseGrad, uColorCyan, clamp(uCyanOnly, 0.0, 1.0));
  pulseCol = mix(pulseCol, uColorWhite, 0.45);
  col = mix(col, pulseCol, clamp(abs(vPulse) * 0.55, 0.0, 0.65));
  float aScale = mix(0.92, alphaScale, earthW);

  float alpha = soft * uOpacity * vOpacity * (0.6 + vDepth * 0.45) * uIntensity * aScale;
  gl_FragColor = vec4(col, alpha);
}
`;

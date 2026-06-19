/**
 * Shared utilities for the "AI with JTS" cinematic intro.
 * Color palette, easing functions, and procedural helpers.
 */

// ─── Color Palette ──────────────────────────────────────────
export const COLORS = {
  // Primary
  cyan: "#06b6d4",
  cyanGlow: "rgba(6, 182, 212, 0.6)",
  neonBlue: "#3b82f6",
  neonBlueGlow: "rgba(59, 130, 246, 0.5)",
  indigo: "#6366f1",
  purple: "#a855f7",

  // Backgrounds
  void: "#020614",
  deepNavy: "#0a0e27",
  darkSlate: "#0f172a",

  // Text / Chrome
  chrome: "#e2e8f0",
  chromeBright: "#f8fafc",
  mercuryLight: "#cbd5e1",
  mercuryDark: "#475569",

  // Accents
  warmGlow: "#f59e0b",
  redAccent: "#ef4444",
} as const;

// ─── Spring Configs ──────────────────────────────────────────
export const CINEMATIC_SPRING = { damping: 12, stiffness: 100, mass: 0.5 };
export const LOGO_SPRING_CONFIG = { damping: 12, stiffness: 40, mass: 0.5 };

// ─── Easing ─────────────────────────────────────────────────
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeInQuad(t: number): number {
  return t * t;
}

// ─── Deterministic Seeded Random ────────────────────────────
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

/** Generate n deterministic 2D points in [0,1] range */
export function generatePoints(
  n: number,
  seed: number = 42
): { x: number; y: number }[] {
  return Array.from({ length: n }, (_, i) => ({
    x: seededRandom(seed + i * 2),
    y: seededRandom(seed + i * 2 + 1),
  }));
}

// ─── Noise-like function (simple Perlin approximation) ──────
export function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f); // smoothstep
  return (
    seededRandom(i) * (1 - u) + seededRandom(i + 1) * u
  );
}

// ─── Helpers ────────────────────────────────────────────────
/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Map a value from one range to another, clamped */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

/** Lerp between two values */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/** Convert polar to cartesian */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

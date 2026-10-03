import {Easing, interpolate} from 'remotion';

/** House easing curves. Nothing in the kit moves linearly. */
export const ease = {
  /** Expo-style deceleration: the default for entrances. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Softer cubic deceleration for large surfaces. */
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  /** Symmetric, for wipes and path draws. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Acceleration for exits. */
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
  /** Slight overshoot for "landing" moments. */
  back: Easing.bezier(0.34, 1.4, 0.64, 1),
};

/** Duration tokens (frames @ 30fps). See DESIGN.md → Motion. */
export const dur = {
  /** Press / micro feedback. */
  micro: 6,
  /** Exits, small fades. */
  exit: 10,
  fast: 12,
  /** Default entrance: words, labels, panels. */
  base: 24,
  /** Large surfaces, rule draws, logo strokes. */
  slow: 36,
  /** Number count-ups and bar growth. */
  count: 54,
  /** Line-chart path draw (upper bound). */
  draw: 110,
};

/** Stagger tokens (frames between siblings). */
export const stagger = {
  /** Title / headline words. */
  word: 4,
  /** Kinetic-type words (faster, more rhythmic). */
  kinetic: 3,
  /** Chart bars. */
  bar: 12,
};

type EasingFn = (t: number) => number;

/** Clamped 0→1 progress over [start, start + duration]. */
export const progress = (frame: number, start: number, duration: number, easing: EasingFn = ease.out) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Linear map of an already-eased progress value. */
export const mix = (p: number, from: number, to: number) => from + (to - from) * p;

/** 0→1 over the last `length` frames of a scene, accelerating. */
export const exitProgress = (frame: number, durationInFrames: number, length = 12) =>
  progress(frame, durationInFrames - length, length, ease.in);

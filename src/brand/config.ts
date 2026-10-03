/**
 * Brand artwork slots. Files live in /public/brand (paths relative to /public).
 *
 * Masters: the website repo BUILD3R-Dev/dollarsanddeductions, public/brand/ (PR #1 adds the
 * tagline lock-ups, fixed stacked lock-ups and icon-on-dark). Copies here are byte-identical;
 * re-copy them when the masters change.
 *
 * Set a slot to `null` to fall back to the procedural placeholder in geometry.ts.
 */
export const BRAND_ASSETS: {
  /** Square icon for dark backgrounds (corner bug, transitions, avatar, watermark). */
  markSrc: string | null;
  /** Square icon for light backgrounds. Falls back to markSrc. */
  markLightSrc: string | null;
  /** Horizontal lock-up for dark backgrounds. */
  lockupSrc: string | null;
  /** Horizontal lock-up for light backgrounds. Falls back to lockupSrc. */
  lockupLightSrc: string | null;
  /** Compact horizontal lock-up width ÷ height. */
  lockupAspect: number;
  /** Tagline lock-up width ÷ height. */
  lockupTaglineAspect: number;
  /** Horizontal lock-up with tagline (same artboard as lockupSrc) for dark / light. */
  lockupTaglineSrc: string | null;
  lockupTaglineLightSrc: string | null;
  /** Stacked lock-up (icon over wordmark + tagline) for dark / light. */
  stackedSrc: string | null;
  stackedLightSrc: string | null;
  stackedAspect: number;
} = {
  markSrc: 'brand/icon-on-dark.svg',
  markLightSrc: 'brand/icon-full-color.svg',
  lockupSrc: 'brand/horizontal-dark.svg',
  lockupLightSrc: 'brand/horizontal-light.svg',
  lockupAspect: 871 / 120,
  lockupTaglineAspect: 760 / 120,
  lockupTaglineSrc: 'brand/horizontal-tagline-dark.svg',
  lockupTaglineLightSrc: 'brand/horizontal-tagline-light.svg',
  stackedSrc: 'brand/stacked-dark.svg',
  stackedLightSrc: 'brand/stacked-light.svg',
  stackedAspect: 588 / 256,
};

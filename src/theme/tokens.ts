/**
 * Colour, spacing and type tokens. Source of truth: DESIGN.md.
 * Base colours are the website's tokens (dollarsanddeductions repo, src/styles/site.css)
 * with the same names; a few video-only extensions are marked.
 */
export const colors = {
  // --- website tokens (keep in sync with site.css :root) ---
  white: '#ffffff',
  mist: '#eef4f0',
  ledger: '#f4f9f6',
  line: '#d8e3dd',
  lineStrong: '#b9cdc2',
  ink: '#15211c',
  ink2: '#2f3c36',
  muted: '#5a6862',
  pine: '#0b5d45',
  pineHover: '#084a37',
  pineDeep: '#07352a',
  mint: '#cfe6da',
  mintInk: '#a9c9b9',
  red: '#c3283a',
  // --- video-only extensions ---
  /** Vignette / gradient edge below pineDeep. */
  pineNight: '#04241c',
  /** Red for rules and fills on dark backgrounds (site red is only 2.4:1 on pineDeep). */
  redBright: '#e5636f',
};

/** 8px spacing rhythm. Every margin, gap and offset should be space(n). */
export const space = (n: number) => n * 8;

/** Corner radii: the site's 6 / 10 / 14px, doubled for 1080p video. */
export const radius = {sm: 12, md: 20, lg: 28};

export const VIDEO = {width: 1920, height: 1080, fps: 30};
/** Shorts / Reels / TikTok. */
export const VIDEO_VERTICAL = {width: 1080, height: 1920, fps: 30};


/** Type scale (px). Body copy never drops below `bodySm`; labels never below `label`. */
export const typeScale = {
  hero: 300,
  display: 144,
  h1: 112,
  h2: 88,
  h3: 64,
  body: 56,
  bodySm: 48,
  label: 40,
  micro: 32,
};

export type ThemeMode = 'dark' | 'light';

export type Palette = {
  mode: ThemeMode;
  bg: string;
  bgEdge: string;
  bgGlow: string;
  /** Headlines and figures. */
  fg: string;
  /** Running text. */
  body: string;
  muted: string;
  faint: string;
  /** Rules, strokes, check fills, emphasis. */
  accent: string;
  /** Accent colour safe for text on this background. */
  accentText: string;
  /** Text/icon colour placed ON an accent fill (buttons, checked boxes, pills). */
  onAccent: string;
  /** Primary data stroke (lines). */
  mark: string;
  /** Favourable data (savings). */
  saving: string;
  /** Unfavourable data (tax owed, cost) and the double rule under totals. */
  cost: string;
  grid: string;
  panel: string;
};

/** Dark = the site's deep-pine bands (lead CTA, footer). */
const dark: Palette = {
  mode: 'dark',
  bg: colors.pineDeep,
  bgEdge: colors.pineNight,
  bgGlow: colors.pine,
  fg: colors.white,
  body: colors.mint,
  muted: colors.mintInk,
  faint: 'rgba(207, 230, 218, 0.18)',
  accent: colors.mint,
  accentText: colors.mint,
  onAccent: colors.pineDeep,
  mark: colors.mint,
  saving: colors.mint,
  cost: colors.redBright,
  grid: 'rgba(207, 230, 218, 0.07)',
  panel: 'rgba(4, 36, 28, 0.94)',
};

/** Light = the site's mist bands and white pages. */
const light: Palette = {
  mode: 'light',
  bg: colors.mist,
  bgEdge: colors.line,
  bgGlow: colors.white,
  fg: colors.ink,
  body: colors.ink2,
  muted: colors.muted,
  faint: colors.line,
  accent: colors.pine,
  accentText: colors.pine,
  onAccent: colors.white,
  mark: colors.pine,
  saving: colors.pine,
  cost: colors.red,
  grid: 'rgba(11, 93, 69, 0.07)',
  panel: colors.white,
};

export const palette = (mode: ThemeMode = 'dark'): Palette => (mode === 'dark' ? dark : light);

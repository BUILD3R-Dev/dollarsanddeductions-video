import {createContext, useContext} from 'react';
import {useVideoConfig} from 'remotion';
import {space} from './tokens';

export type Insets = {top: number; right: number; bottom: number; left: number};

export type Layout = {
  width: number;
  height: number;
  vertical: boolean;
  /** Keep text and key content inside these insets. */
  safe: Insets;
  /** The safe content box. */
  box: {x: number; y: number; w: number; h: number};
};

/** 16:9: title-safe margins. */
export const SAFE_LANDSCAPE: Insets = {top: space(12), right: space(16), bottom: space(12), left: space(16)};

/**
 * 9:16 (Shorts / Reels / TikTok): a union of the three platforms' UI overlays.
 * - top 240: status bar, "Shorts"/"Reels" header, search and camera icons
 * - right 144: like / comment / share / remix column
 * - bottom 480: channel name, caption, audio ticker, subscribe/follow, nav bar
 * - left 72: comfortable margin
 */
export const SAFE_VERTICAL: Insets = {top: space(30), right: space(18), bottom: space(60), left: space(9)};

export const layoutFor = (width: number, height: number): Layout => {
  const vertical = height > width;
  const safe = vertical ? SAFE_VERTICAL : SAFE_LANDSCAPE;
  return {
    width,
    height,
    vertical,
    safe,
    box: {x: safe.left, y: safe.top, w: width - safe.left - safe.right, h: height - safe.top - safe.bottom},
  };
};

/** CSS padding string for an inset box. */
export const insetPadding = (i: Insets) => `${i.top}px ${i.right}px ${i.bottom}px ${i.left}px`;

/**
 * Extra bottom inset reserved for burned-in captions. SceneSequence provides it for
 * scenes when a video has captions, so scene content lays out above the caption band.
 */
export const ReservedBottom = createContext(0);

/** Caption band height (px) reserved above the bottom safe inset. */
export const captionBand = (vertical: boolean) => (vertical ? 200 : 150);

/** Current composition's layout. Every scene sizes itself from this, never from constants. */
export const useLayout = (): Layout => {
  const {width, height} = useVideoConfig();
  const reserved = useContext(ReservedBottom);
  const base = layoutFor(width, height);
  if (!reserved) return base;
  const safe = {...base.safe, bottom: base.safe.bottom + reserved};
  return {...base, safe, box: {...base.box, h: base.box.h - reserved}};
};

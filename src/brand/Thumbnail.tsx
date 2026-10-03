import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {colors, fonts, radius} from '../theme';
import {LogoMark} from './Logo';

/**
 * YouTube thumbnail template (1280×720). Every text layer is a prop, so a new video is a
 * new thumbnails/<slug>.json. Rules it is built around:
 *  - 3–5 words total: a topic tag, one huge figure, one short label.
 *  - Readable at ~160px wide (the mobile list size): figure ≥ 200px tall, label ≥ 80px.
 *  - Bottom-right is covered by YouTube's duration badge; the logo bug sits top-left.
 */
export type ThumbnailBar = {label: string; tone: 'cost' | 'saving' | 'neutral'; /** 0–1 relative height */ height: number};

export type ThumbnailProps = {
  /** Small tag above the figure, e.g. "S Corp vs LLC". 2–4 words. */
  topic: string;
  /** The hero figure, e.g. "$15,000" or "20%". */
  figure: string;
  /** Short label under the figure, e.g. "tax gap". 1–3 words. */
  label: string;
  /** Optional comparison bars on the right (2–3), drawn without numbers. */
  bars?: ThumbnailBar[];
  /** Draw the red double rule under the figure (the brand's "final total" mark). Default true. */
  doubleRule?: boolean;
};

const BAR_COLOR = {cost: colors.redBright, saving: colors.mint, neutral: 'rgba(207,230,218,0.45)'};

export const Thumbnail: React.FC<ThumbnailProps> = ({topic, figure, label, bars, doubleRule = true}) => {
  const hasBars = Boolean(bars?.length);
  // Shrink the figure for long strings so it never wraps.
  const figureSize = Math.min(250, Math.floor((hasBars ? 760 : 1120) / (figure.length * 0.56)));
  return (
    <AbsoluteFill>
      <Background grid glow={{x: 30, y: 35}} seed="thumb" />
      {/* Logo bug, top-left (YouTube's duration badge covers bottom-right). */}
      <div style={{position: 'absolute', left: 40, top: 36}}>
        <LogoMark size={92} start={null} />
      </div>

      <div style={{position: 'absolute', left: 64, top: 160, width: hasBars ? 800 : 1150}}>
        <div
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            borderRadius: radius.sm,
            background: colors.mint,
            color: colors.pineDeep,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.05,
          }}
        >
          {topic}
        </div>
        <div style={{display: 'inline-block', marginTop: 18}}>
          <div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: figureSize, lineHeight: 0.95, letterSpacing: '-0.03em', color: colors.white}}>{figure}</div>
          {doubleRule ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14}}>
              <div style={{height: 9, borderRadius: 9, background: colors.redBright}} />
              <div style={{height: 9, borderRadius: 9, background: colors.redBright}} />
            </div>
          ) : null}
        </div>
        <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: colors.mint, marginTop: 14}}>{label}</div>
      </div>

      {hasBars ? (
        <div style={{position: 'absolute', right: 70, bottom: 120, height: 430, display: 'flex', alignItems: 'flex-end', gap: 34}}>
          {bars!.map((b, i) => (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{width: 128, height: Math.max(40, 380 * b.height), borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, background: BAR_COLOR[b.tone]}} />
              <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 40, color: colors.white}}>{b.label}</div>
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

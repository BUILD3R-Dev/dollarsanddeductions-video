import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {LogoMark} from '../brand/Logo';
import {ease, mix, progress} from '../lib/motion';
import {colors} from '../theme';

export type TransitionStyle = 'wipe' | 'iris' | 'fade';

export type TransitionProps = {
  durationInFrames: number;
  style?: TransitionStyle;
  /** Wipe travel direction. */
  direction?: 'right' | 'left';
  /** Flash the monogram while the screen is covered. */
  showMark?: boolean;
};


/**
 * Full-frame branded transition. It fully covers the frame at its midpoint, so
 * place it centred on a cut (SceneSequence does this automatically).
 */
export const Transition: React.FC<TransitionProps> = ({durationInFrames: d, style = 'wipe', direction = 'right', showMark = true}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const cover = progress(frame, 0, d * 0.46, ease.inOut);
  const reveal = progress(frame, d * 0.54, d * 0.46, ease.inOut);
  const markIn = progress(frame, d * 0.3, d * 0.2, ease.out);
  const markOut = progress(frame, d * 0.55, d * 0.2, ease.in);
  const mark = showMark ? markIn * (1 - markOut) : 0;

  const markEl = (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: mark, transform: `scale(${mix(markIn, 0.85, 1)})`}}>
      <LogoMark size={176} start={null} />
    </AbsoluteFill>
  );

  if (style === 'fade') {
    const o = cover * (1 - reveal);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at center, ${colors.pine} 0%, ${colors.pineDeep} 60%, ${colors.pineNight} 100%)`, opacity: o}} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: W * 0.5, height: 3, background: colors.mint, transform: `scaleX(${cover * (1 - reveal)})`, opacity: o}} />
        </AbsoluteFill>
        {markEl}
      </AbsoluteFill>
    );
  }

  if (style === 'iris') {
    const R = Math.hypot(W, H) / 2 + 40;
    const outer = mix(cover, 0, R);
    const inner = mix(reveal, 0, R);
    const mask = `radial-gradient(circle at 50% 50%, transparent ${inner}px, black ${inner + 1}px)`;
    return (
      <AbsoluteFill>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at center, ${colors.pine} 0%, ${colors.pineDeep} 50%, ${colors.pineNight} 100%)`,
            clipPath: `circle(${outer}px at 50% 50%)`,
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        />
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {cover < 1 ? <circle cx={W / 2} cy={H / 2} r={outer} fill="none" stroke={colors.mint} strokeWidth={6} /> : null}
          {reveal > 0 && reveal < 1 ? <circle cx={W / 2} cy={H / 2} r={inner} fill="none" stroke={colors.mint} strokeWidth={6} /> : null}
        </svg>
        {markEl}
      </AbsoluteFill>
    );
  }

  // Wipe: a skewed deep-pine panel with mint trailing edge and a white double-rule leading edge.
  // The skew shifts the panel's top/bottom edges sideways by `slant`; size and travel
  // account for it so the frame is fully covered at the midpoint in any aspect ratio.
  const slant = Math.tan((14 * Math.PI) / 180) * ((H + 80) / 2);
  const EDGES = 96; // gold-free edge bands + gaps inside the panel
  const PANEL = W + 2 * slant + 2 * EDGES + 120;
  const mid = -(slant + EDGES + 60);
  const start = -PANEL - slant - 40;
  const end = W + slant + 40;
  const x = reveal > 0 ? mix(reveal, mid, end) : mix(cover, start, mid);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: direction === 'left' ? 'scaleX(-1)' : undefined, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            top: -40,
            height: H + 80,
            left: 0,
            width: PANEL,
            transform: `translateX(${x}px) skewX(-14deg)`,
            display: 'flex',
          }}
        >
          <div style={{width: 14, background: colors.mint}} />
          <div style={{width: 22}} />
          <div style={{flex: 1, background: `linear-gradient(90deg, ${colors.pineNight} 0%, ${colors.pineDeep} 35%, ${colors.pine} 50%, ${colors.pineDeep} 65%, ${colors.pineNight} 100%)`}} />
          <div style={{width: 22}} />
          {/* Leading edge: a double rule, the site's "total" mark */}
          <div style={{width: 14, background: colors.white}} />
          <div style={{width: 10}} />
          <div style={{width: 14, background: colors.white}} />
        </div>
      </AbsoluteFill>
      {markEl}
    </AbsoluteFill>
  );
};

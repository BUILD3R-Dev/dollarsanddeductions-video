import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Logo} from '../brand/Logo';
import {SceneShell} from '../components/SceneShell';
import {WordReveal} from '../components/WordReveal';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, insetPadding, palette, radius, space, useLayout} from '../theme';

export type ShortCTAProps = {
  durationInFrames: number;
  /** Main call to action. `*word*` for emphasis. */
  headline?: string;
  /** Button label. */
  action?: string;
  /** Title of the related long-form video, shown as "Full breakdown on YouTube". */
  fullVideoTitle?: string;
  url?: string;
  disclaimer?: string;
};

/**
 * Short-form end card. Shorts and Reels have no end screens, so the ask lives in the
 * video: follow, and where the full breakdown is. Short and loop-friendly: it ends on
 * the same deep-pine background most hooks open on.
 */
export const ShortCTA: React.FC<ShortCTAProps> = ({
  durationInFrames,
  headline = 'Follow for plain-English *tax wins.*',
  action = 'Follow',
  fullVideoTitle,
  url = 'dollarsanddeductions.com',
  disclaimer = 'Educational purposes only — not tax, legal, or financial advice.',
}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical} = useLayout();
  const p = palette('dark');
  const btn = progress(frame, 22, 16, ease.back);
  const pulse = 1 + 0.035 * Math.max(0, Math.sin((frame - 40) / 7));
  const card = progress(frame, 34, 24, ease.out);
  const foot = progress(frame, 44, 24, ease.out);

  return (
    <SceneShell durationInFrames={durationInFrames} theme="dark" exit={0} background={{glow: {x: 50, y: 30}}}>
      <AbsoluteFill
        style={{
          padding: insetPadding(safe),
          alignItems: vertical ? 'center' : 'flex-start',
          justifyContent: 'center',
          textAlign: vertical ? 'center' : 'left',
          gap: vertical ? space(4) : space(6),
        }}
      >
        {/* Tagline lock-up at full safe width keeps the tagline ≥ 26px; the stacked lock-up's spaced caps get too small on phones. */}
        <Logo variant="horizontal" tagline size={vertical ? (box.w / 760) * 120 : 120} start={0} />
        <WordReveal
          text={headline}
          start={8}
          accent={colors.mint}
          style={{fontSize: vertical ? 88 : 104, fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em', color: p.fg, maxWidth: box.w, textWrap: 'balance'}}
        />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: space(2),
            padding: `${space(2.5)}px ${space(6)}px`,
            borderRadius: radius.sm,
            background: colors.white,
            color: colors.pineDeep,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 56,
            opacity: Math.min(1, btn * 1.4),
            transform: `scale(${mix(btn, 0.7, 1) * pulse})`,
          }}
        >
          <svg width={48} height={48} viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke={colors.pineDeep} strokeWidth={3} strokeLinecap="round" />
          </svg>
          {action}
        </div>
        {fullVideoTitle ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: space(3),
              maxWidth: box.w,
              padding: `${space(3)}px ${space(4)}px`,
              border: `2px solid ${colors.mintInk}`,
              borderRadius: radius.lg,
              background: 'rgba(11, 93, 69, 0.5)',
              textAlign: 'left',
              opacity: card,
              transform: `translateY(${mix(card, 24, 0)}px)`,
            }}
          >
            <svg width={64} height={64} viewBox="0 0 88 88" style={{flexShrink: 0}}>
              <circle cx={44} cy={44} r={41} fill="none" stroke={colors.mint} strokeWidth={4} />
              <path d="M 36 28 L 62 44 L 36 60 Z" fill={colors.white} />
            </svg>
            <div>
              <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 36, color: colors.mint}}>Full breakdown on YouTube</div>
              <div style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: 48, lineHeight: 1.12, color: colors.white}}>{fullVideoTitle}</div>
            </div>
          </div>
        ) : null}
        <div style={{opacity: foot}}>
          <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 44, color: colors.mint}}>{url}</div>
          <div style={{fontFamily: fonts.sans, fontWeight: 400, fontSize: 32, color: colors.mintInk, marginTop: space(1)}}>{disclaimer}</div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

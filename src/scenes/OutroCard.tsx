import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Logo} from '../brand/Logo';
import {ShortCTA} from './ShortCTA';
import {SceneShell} from '../components/SceneShell';
import {WordReveal} from '../components/WordReveal';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, insetPadding, palette, radius, space, typeScale, useLayout} from '../theme';

export type OutroCardProps = {
  durationInFrames: number;
  headline?: string;
  /** Title shown on the "up next" placeholder card. */
  nextTitle: string;
  nextLabel?: string;
  url?: string;
  disclaimer?: string;
  /** Upload cadence line under the subscribe button. */
  schedule?: string;
};

const CARD_W = 720;
const CARD_H = 405;

const Cursor: React.FC<{x: number; y: number; press: number; opacity: number}> = ({x, y, press, opacity}) => (
  <svg width={56} height={64} viewBox="0 0 28 32" style={{position: 'absolute', left: x, top: y, opacity, transform: `scale(${1 - press * 0.15})`, transformOrigin: 'top left', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))'}}>
    <path d="M 2 2 L 2 26 L 8.5 20 L 13 30 L 17.5 28 L 13 18.5 L 22 18.5 Z" fill={colors.white} stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const OutroLandscape: React.FC<OutroCardProps> = ({
  durationInFrames,
  headline = 'Keep more of *what you earn.*',
  nextTitle,
  nextLabel = 'Up next',
  url = 'dollarsanddeductions.com',
  disclaimer = 'Educational purposes only — not tax, legal, or financial advice.',
  schedule = 'New episodes twice a week.',
}) => {
  const frame = useCurrentFrame();
  const {safe} = useLayout();
  const p = palette('dark');

  const btnIn = progress(frame, 30, 24, ease.back);
  const CLICK = 84;
  const travel = progress(frame, 46, CLICK - 46, ease.inOut);
  const press = progress(frame, CLICK, 5, ease.out) - progress(frame, CLICK + 5, 8, ease.out);
  const subscribed = frame >= CLICK + 4;
  const ripple = progress(frame, CLICK + 2, 26, ease.out);
  const cursorOut = progress(frame, CLICK + 24, 16, ease.in);

  const card = progress(frame, 24, 36, ease.out);
  const cardTitle = progress(frame, 44, 30, ease.out);
  const footer = progress(frame, 40, 50, ease.inOut);
  const playPulse = 1 + 0.04 * Math.sin(frame / 8);

  // Cursor coordinates are relative to the button row; target is the button centre.
  const TARGET = {x: 200, y: 52};
  const cursor = {x: mix(travel, 760, TARGET.x), y: mix(travel, 360, TARGET.y)};

  return (
    <SceneShell durationInFrames={durationInFrames} theme="dark" exit={0} background={{seed: 'outro', glow: {x: 70, y: 40}}}>
      <Logo variant="horizontal" size={120} start={0} tagline />

      {/* Left column */}
      <AbsoluteFill style={{padding: `0 ${space(16)}px`, justifyContent: 'center'}}>
        <div style={{width: 840, display: 'flex', flexDirection: 'column', gap: space(6), marginTop: space(2)}}>
          <WordReveal text={headline} start={10} accent={colors.mint} style={{fontSize: typeScale.h1 - 8, fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.02em', color: p.fg}} />
          <div style={{position: 'relative', height: 104}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: space(2),
                padding: `${space(2.5)}px ${space(5)}px`,
                borderRadius: radius.sm,
                background: subscribed ? 'transparent' : colors.white,
                border: `3px solid ${subscribed ? colors.mint : colors.white}`,
                color: subscribed ? colors.mint : colors.pineDeep,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: typeScale.bodySm,
                opacity: btnIn,
                transform: `scale(${mix(btnIn, 0.7, 1) * (1 - press * 0.06)})`,
                transformOrigin: 'left center',
                boxShadow: subscribed ? 'none' : `0 ${space(2)}px ${space(6)}px rgba(0,0,0,0.3)`,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24">
                {subscribed ? (
                  <path d="M 4 12.5 L 9.5 18 L 20 6.5" fill="none" stroke={colors.mint} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path
                    d="M 12 3 C 8.5 3 6.5 5.6 6.5 9 L 6.5 13.5 L 4.5 16.5 L 19.5 16.5 L 17.5 13.5 L 17.5 9 C 17.5 5.6 15.5 3 12 3 Z M 9.5 18.5 C 10 20 11 20.8 12 20.8 C 13 20.8 14 20 14.5 18.5 Z"
                    fill={colors.pineDeep}
                  />
                )}
              </svg>
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </div>
            <div
              style={{
                position: 'absolute',
                left: TARGET.x,
                top: TARGET.y,
                width: 40,
                height: 40,
                marginLeft: -20,
                marginTop: -20,
                borderRadius: '50%',
                border: `3px solid ${colors.mint}`,
                opacity: ripple > 0 ? 1 - ripple : 0,
                transform: `scale(${mix(ripple, 1, 9)})`,
              }}
            />
            {frame < CLICK + 40 ? <Cursor x={cursor.x} y={cursor.y} press={press} opacity={progress(frame, 44, 10, ease.out) * (1 - cursorOut)} /> : null}
          </div>
          <div style={{fontFamily: fonts.sans, fontSize: typeScale.label, color: p.muted, opacity: progress(frame, 50, 24, ease.out)}}>
            {schedule}
          </div>
        </div>
      </AbsoluteFill>

      {/* Up-next placeholder (YouTube end-screen element sits on top of this) */}
      <div
        style={{
          position: 'absolute',
          right: space(16),
          top: (1080 - CARD_H) / 2 - space(2),
          width: CARD_W,
          height: CARD_H,
          overflow: 'hidden',
          border: `2px solid ${colors.mintInk}`,
          borderRadius: radius.lg,
          background: `linear-gradient(135deg, ${colors.pine} 0%, ${colors.pineDeep} 75%)`,
          boxShadow: `0 ${space(4)}px ${space(10)}px rgba(0,0,0,0.45)`,
          opacity: card,
          transform: `translateY(${mix(card, 40, 0)}px) scale(${mix(card, 0.96, 1)})`,
          clipPath: `inset(0 0 ${mix(card, 100, 0)}% 0 round ${radius.lg}px)`,
        }}
      >
        <svg width={CARD_W} height={CARD_H} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
          {new Array(10).fill(0).map((_, i) => (
            <line key={i} x1={0} y1={56 + i * 40} x2={CARD_W} y2={56 + i * 40} stroke="rgba(207,230,218,0.1)" strokeWidth={2} />
          ))}
        </svg>
        <div style={{position: 'absolute', left: space(5), top: space(4), fontFamily: fonts.sans, fontWeight: 600, fontSize: typeScale.micro, color: colors.mint}}>
          {nextLabel}
        </div>
        <div style={{position: 'absolute', right: space(5), top: space(4), transform: `scale(${playPulse})`}}>
          <svg width={88} height={88} viewBox="0 0 88 88">
            <circle cx={44} cy={44} r={41} fill="rgba(4,36,28,0.6)" stroke={colors.mint} strokeWidth={3} />
            <path d="M 36 28 L 62 44 L 36 60 Z" fill={colors.white} />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            left: space(5),
            right: space(5),
            bottom: space(5),
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: typeScale.bodySm + 8,
            lineHeight: 1.1,
            color: colors.white,
            opacity: cardTitle,
            transform: `translateY(${mix(cardTitle, 20, 0)}px)`,
          }}
        >
          {nextTitle}
        </div>
      </div>

      {/* Footer */}
      <AbsoluteFill style={{justifyContent: 'flex-end', padding: insetPadding(safe)}}>
        <div style={{height: 2, background: p.faint, transform: `scaleX(${footer})`, transformOrigin: 'left', marginBottom: space(3)}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: footer}}>
          <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: typeScale.label + 4, color: colors.mint}}>{url}</div>
          <div style={{fontFamily: fonts.sans, fontWeight: 400, fontSize: typeScale.micro, color: p.muted}}>{disclaimer}</div>
        </div>
      </AbsoluteFill>

    </SceneShell>
  );
};

/** 16:9 end screen. In 9:16 there is no YouTube end screen, so it hands off to ShortCTA. */
export const OutroCard: React.FC<OutroCardProps> = (props) =>
  useLayout().vertical ? (
    <ShortCTA durationInFrames={props.durationInFrames} fullVideoTitle={props.nextTitle} url={props.url} disclaimer={props.disclaimer} />
  ) : (
    <OutroLandscape {...props} />
  );

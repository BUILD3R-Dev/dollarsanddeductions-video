import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kicker} from '../components/Kicker';
import {SceneShell} from '../components/SceneShell';
import {WordReveal} from '../components/WordReveal';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, insetPadding, palette, Palette, radius, space, ThemeMode, typeScale, useLayout} from '../theme';

export type BulletItem = {
  /** Headline for the item, e.g. "Home office". */
  text: string;
  /** Optional supporting line, e.g. "$5 per sq ft, up to 300 sq ft". */
  detail?: string;
};

export type BulletBuildProps = {
  durationInFrames: number;
  title: string;
  kicker?: string;
  /** 2–5 items; they check off one by one. */
  items: BulletItem[];
  theme?: ThemeMode;
};

const BOX = 56;
// Rows: hairline separators + 2px top rule, as `ul.checklist` / `.hubs` on the site.

const Check: React.FC<{appear: number; tick: number; p: Palette}> = ({appear, tick, p}) => (
  <div
    style={{
      width: BOX,
      height: BOX,
      flexShrink: 0,
      borderRadius: radius.sm - 4,
      border: `3px solid ${tick > 0.05 ? p.accent : p.mode === 'dark' ? p.muted : colors.lineStrong}`,
      background: tick > 0.05 ? p.accent : 'transparent',
      opacity: appear,
      transform: `scale(${mix(appear, 0.5, 1) * (1 + 0.06 * Math.sin(Math.PI * tick))})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width={44} height={44} viewBox="0 0 16 16">
      {/* Same check glyph as the site's checklist boxes. */}
      <path d="M3.8 8.3l2.7 2.7 5.7-6" fill="none" stroke={p.onAccent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
    </svg>
  </div>
);

export const BulletBuild: React.FC<BulletBuildProps> = ({durationInFrames, title, kicker, items, theme = 'light'}) => {
  const frame = useCurrentFrame();
  const {safe, vertical} = useLayout();
  const p = palette(theme);
  const LIST_START = 34;
  const stagger = Math.min(56, Math.floor((durationInFrames - LIST_START - 50) / items.length));
  const divider = progress(frame, 12, 40, ease.inOut);
  const checked = items.filter((_, i) => frame >= LIST_START + i * stagger + 16).length;

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'bullets', glow: {x: 20, y: 30}}}>
      <AbsoluteFill style={{flexDirection: vertical ? 'column' : 'row', padding: insetPadding(safe), alignItems: vertical ? 'stretch' : 'center', justifyContent: 'center', gap: vertical ? space(6) : space(10)}}>
        {/* Left: title column */}
        <div style={{width: vertical ? 'auto' : 600, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: vertical ? space(3) : space(4)}}>
          {kicker ? <Kicker text={kicker} color={p.accentText} start={0} /> : null}
          <WordReveal
            text={title}
            start={6}
            accent={p.accentText}
            style={{fontSize: vertical ? 88 : typeScale.h1 - 8, fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.02em', color: p.fg}}
          />
          <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: typeScale.label, color: p.muted, opacity: progress(frame, 30, 20, ease.out), fontVariantNumeric: 'tabular-nums'}}>
            <span style={{color: p.accentText, fontWeight: 700}}>{checked}</span> of {items.length} covered
          </div>
        </div>

        {/* Right: the list, ruled like the site's checklist (2px ink rule on top, hairlines between) */}
        <div style={{flex: vertical ? 'none' : 1, display: 'flex', flexDirection: 'column', position: 'relative'}}>
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.fg, transform: `scaleX(${divider})`, transformOrigin: 'left'}} />
          {items.map((item, i) => {
            const t = LIST_START + i * stagger;
            const appear = progress(frame, t, 20, ease.back);
            const text = progress(frame, t + 4, 26, ease.out);
            const tick = progress(frame, t + 16, 18, ease.inOut);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: space(4), padding: `${space(4)}px 0`, borderBottom: `2px solid ${p.faint}`, opacity: Math.min(1, appear * 2)}}>
                <Check appear={appear} tick={tick} p={p} />
                <div style={{opacity: text, transform: `translateX(${mix(text, -32, 0)}px)`, paddingTop: space(0.5)}}>
                  <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: typeScale.body, lineHeight: 1.1, color: p.fg}}>{item.text}</div>
                  {item.detail ? (
                    <div style={{fontFamily: fonts.sans, fontWeight: 400, fontSize: typeScale.label, lineHeight: 1.3, color: p.body, marginTop: space(1)}}>
                      {item.detail}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

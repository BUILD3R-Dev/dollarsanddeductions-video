import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Logo} from '../brand/Logo';
import {CountUp} from '../components/CountUp';
import {SceneShell} from '../components/SceneShell';
import {ease, mix, progress} from '../lib/motion';
import {parseRich, plainText} from '../lib/rich';
import {fonts, insetPadding, palette, radius, space, ThemeMode, useLayout} from '../theme';

export type HookCardProps = {
  durationInFrames: number;
  /** The hook: one punchy sentence. `*word*` = accent emphasis, `$7,775` counts up. */
  text: string;
  /** Sticker above the hook, e.g. "Tax tip #14". */
  sticker?: string;
  /** Small logo at the top of the safe area. */
  showLogo?: boolean;
  theme?: ThemeMode;
};

/**
 * Short-form opener: the hook must land inside ~1s. Words pop in fast (2-frame
 * stagger), then the whole block drifts slightly closer so the frame never sits
 * still while the viewer decides whether to swipe.
 */
export const HookCard: React.FC<HookCardProps> = ({durationInFrames, text, sticker, showLogo = true, theme = 'dark'}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical} = useLayout();
  const p = palette(theme);
  const words = parseRich(text);
  const n = plainText(text).length;
  const size = vertical ? (n <= 28 ? 120 : n <= 48 ? 104 : 88) : n <= 40 ? 144 : 112;
  const drift = mix(progress(frame, 0, durationInFrames, ease.soft), 1, 1.04);
  const stick = progress(frame, 2, 12, ease.back);

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} exit={6} background={{glow: {x: 50, y: 40}}}>
      {showLogo ? (
        <div style={{display: 'flex', justifyContent: vertical ? 'center' : 'flex-start'}}>
          <Logo variant="horizontal" tagline size={vertical ? (box.w / 760) * 120 : 120} start={0} theme={theme} />
        </div>
      ) : null}
      <AbsoluteFill style={{padding: insetPadding(safe), justifyContent: 'center', alignItems: vertical ? 'center' : 'flex-start'}}>
        <div style={{transform: `scale(${drift})`, transformOrigin: vertical ? 'center' : 'left center', maxWidth: box.w, textAlign: vertical ? 'center' : 'left'}}>
          {sticker ? (
            <div
              style={{
                display: 'inline-block',
                marginBottom: space(4),
                padding: `${space(1.5)}px ${space(3)}px`,
                borderRadius: radius.sm,
                background: p.accent,
                color: p.onAccent,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 44,
                opacity: Math.min(1, stick * 1.5),
                transform: `rotate(-2deg) scale(${mix(stick, 0.6, 1)})`,
              }}
            >
              {sticker}
            </div>
          ) : null}
          <div style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: '-0.02em', color: p.fg, textWrap: 'balance'}}>
            {words.map((w, i) => {
              const t = 6 + i * 2;
              const pop = progress(frame, t, 10, ease.out);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: 'inline-block',
                      opacity: pop,
                      transform: `translateY(${mix(pop, 0.25, 0)}em) scale(${mix(pop, 1.12, 1)})`,
                      fontStyle: w.emphasis ? 'italic' : undefined,
                      fontWeight: w.emphasis ? 500 : undefined,
                      color: w.emphasis || w.money ? p.accentText : undefined,
                    }}
                  >
                    {w.money ? (
                      <>
                        {w.money.before}
                        <CountUp value={w.money.value} decimals={w.money.decimals} format="currency" start={t + 2} duration={24} />
                        {w.money.after}
                      </>
                    ) : (
                      w.text
                    )}
                  </span>
                  {i < words.length - 1 ? ' ' : null}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

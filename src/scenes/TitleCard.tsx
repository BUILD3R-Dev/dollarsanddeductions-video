import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Logo} from '../brand/Logo';
import {Kicker} from '../components/Kicker';
import {SceneShell} from '../components/SceneShell';
import {WordReveal} from '../components/WordReveal';
import {ease, mix, progress} from '../lib/motion';
import {fonts, insetPadding, palette, space, ThemeMode, typeScale, useLayout} from '../theme';

export type TitleCardProps = {
  durationInFrames: number;
  /** Episode title. Wrap words in *asterisks* for italic accent emphasis. */
  title: string;
  /** Small label above the title, e.g. "Episode 14 · The S-Corp Series". */
  kicker?: string;
  subtitle?: string;
  /** Footer URL. */
  url?: string;
  /** Show the horizontal logo lock-up top-left. */
  showLogo?: boolean;
  /** Include the tagline under the wordmark. */
  showTagline?: boolean;
  theme?: ThemeMode;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  durationInFrames,
  title,
  kicker,
  subtitle,
  url = 'dollarsanddeductions.com',
  showLogo = true,
  showTagline = true,
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical} = useLayout();
  const p = palette(theme);
  const words = title.split(/\s+/).length;
  const titleStart = 22;
  const subStart = titleStart + words * 4 + 14;
  const sub = progress(frame, subStart, 30, ease.out);
  const footer = progress(frame, 10, 60, ease.inOut);
  const size = vertical ? (title.length > 40 ? 96 : 120) : title.length > 48 ? typeScale.h1 : typeScale.display;

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'title'}}>
      {showLogo ? <Logo variant="horizontal" size={vertical ? (box.w / 760) * 120 : 120} start={0} theme={theme} tagline={showTagline} /> : <div />}

      <AbsoluteFill style={{padding: insetPadding(safe), justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: space(4), maxWidth: box.w, marginTop: space(4)}}>
          {kicker ? <Kicker text={kicker} color={p.accentText} start={14} /> : null}
          <WordReveal
            text={title}
            start={titleStart}
            accent={p.accentText}
            style={{fontSize: size, fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.02em', color: p.fg}}
          />
          {subtitle ? (
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: typeScale.body,
                fontWeight: 400,
                lineHeight: 1.35,
                color: p.body,
                maxWidth: box.w,
                textWrap: 'balance',
                opacity: sub,
                transform: `translateY(${mix(sub, 24, 0)}px)`,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'flex-end', padding: insetPadding(safe)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: space(4)}}>
          <div style={{flex: 1, height: 2, background: p.faint, transform: `scaleX(${footer})`, transformOrigin: 'left'}} />
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: typeScale.micro,
              color: p.muted,
              opacity: footer,
            }}
          >
            {url}
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

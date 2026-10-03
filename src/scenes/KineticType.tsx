import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CountUp} from '../components/CountUp';
import {Kicker} from '../components/Kicker';
import {SceneShell} from '../components/SceneShell';
import {ease, mix, progress, stagger} from '../lib/motion';
import {parseRich, plainText} from '../lib/rich';
import {fonts, insetPadding, palette, space, ThemeMode, typeScale, useLayout} from '../theme';

export type KineticLine =
  | string
  | {
      /** Line copy. `*word*` = italic accent emphasis; `$12,345` = accent count-up. */
      text: string;
      /** Frame the line enters (defaults to evenly spaced beats). */
      at?: number;
      size?: 'xl' | 'lg' | 'md';
    };

export type KineticTypeProps = {
  durationInFrames: number;
  lines: KineticLine[];
  /** stack: lines accumulate. replace: one line on screen at a time. */
  mode?: 'stack' | 'replace';
  align?: 'left' | 'center';
  kicker?: string;
  /** Frames between auto-timed beats. */
  beat?: number;
  /** Shift the text block vertically (px), e.g. to leave room for a lower third. */
  offsetY?: number;
  theme?: ThemeMode;
};

const SIZES = {xl: typeScale.display, lg: typeScale.h1, md: typeScale.h2};
const SIZES_VERTICAL = {xl: 128, lg: 100, md: 84};
const autoSize = (text: string, vertical: boolean): keyof typeof SIZES => {
  const n = plainText(text).length;
  if (vertical) return n <= 10 ? 'xl' : n <= 20 ? 'lg' : 'md';
  return n <= 16 ? 'xl' : n <= 30 ? 'lg' : 'md';
};

const Line: React.FC<{text: string; at: number; size: number; accent: string; color: string; align: 'left' | 'center'}> = ({
  text,
  at,
  size,
  accent,
  color,
  align,
}) => {
  const frame = useCurrentFrame();
  const words = parseRich(text);
  return (
    <div
      style={{
        fontFamily: fonts.serif,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        color,
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const start = at + i * stagger.kinetic;
        const p = progress(frame, start, 22, ease.out);
        const wordStyle: React.CSSProperties = {
          display: 'inline-block',
          opacity: p,
          transform: `translateY(${mix(p, 0.35, 0)}em) scale(${mix(p, 0.96, 1)})`,
          filter: `blur(${mix(p, 10, 0)}px)`,
          fontStyle: w.emphasis ? 'italic' : undefined,
          fontWeight: w.emphasis ? 500 : undefined,
          color: w.emphasis || w.money ? accent : undefined,
        };
        let content: React.ReactNode = w.text;
        if (w.money) {
          const countStart = start + 4;
          const underline = progress(frame, countStart + 30, 20, ease.inOut);
          content = (
            <>
              {w.money.before}
              <span style={{position: 'relative', display: 'inline-block'}}>
                <CountUp value={w.money.value} decimals={w.money.decimals} format="currency" start={countStart} duration={36} />
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '0.02em',
                    height: Math.max(4, size * 0.05),
                    background: accent,
                    opacity: 0.55,
                    transform: `scaleX(${underline})`,
                    transformOrigin: 'left',
                  }}
                />
              </span>
              {w.money.after}
            </>
          );
        }
        return (
          <React.Fragment key={i}>
            <span style={wordStyle}>{content}</span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const KineticType: React.FC<KineticTypeProps> = ({
  durationInFrames,
  lines,
  mode = 'stack',
  align = 'center',
  kicker,
  beat,
  offsetY = 0,
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical} = useLayout();
  const p = palette(theme);
  const sizes = vertical ? SIZES_VERTICAL : SIZES;
  const first = kicker ? 18 : 10;
  const tail = mode === 'stack' ? 50 : 0;
  const autoBeat = beat ?? Math.max(18, Math.floor((durationInFrames - first - tail) / lines.length));
  const norm = lines.map((l, i) => {
    const o = typeof l === 'string' ? {text: l} : l;
    return {text: o.text, at: o.at ?? first + i * autoBeat, size: sizes[o.size ?? autoSize(o.text, vertical)]};
  });

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'kinetic', particles: 20}}>
      <AbsoluteFill
        style={{
          padding: insetPadding(safe),
          justifyContent: 'center',
          alignItems: align === 'center' ? 'center' : 'flex-start',
          transform: `translateY(${offsetY}px)`,
        }}
      >
        {kicker ? (
          <div style={{marginBottom: space(5)}}>
            <Kicker text={kicker} color={p.accentText} align={align} start={0} />
          </div>
        ) : null}
        {mode === 'stack' ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: space(2), maxWidth: box.w}}>
            {norm.map((l, i) => (
              <Line key={i} {...l} accent={p.accentText} color={p.fg} align={align} />
            ))}
          </div>
        ) : (
          <div style={{position: 'relative', width: '100%', maxWidth: box.w, height: vertical ? 640 : 400}}>
            {norm.map((l, i) => {
              const next = norm[i + 1]?.at ?? Infinity;
              const out = progress(frame, next - 10, 12, ease.in);
              if (frame < l.at - 1 || out >= 1) return null;
              return (
                <AbsoluteFill
                  key={i}
                  style={{
                    justifyContent: 'center',
                    alignItems: align === 'center' ? 'center' : 'flex-start',
                    opacity: 1 - out,
                    transform: `translateY(${mix(out, 0, -space(5))}px)`,
                  }}
                >
                  <Line {...l} accent={p.accentText} color={p.fg} align={align} />
                </AbsoluteFill>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </SceneShell>
  );
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChartHeader} from '../components/ChartHeader';
import {CountUp} from '../components/CountUp';
import {SceneShell} from '../components/SceneShell';
import {ValueFormat} from '../lib/format';
import {dur, ease, mix, progress, stagger} from '../lib/motion';
import {DoubleRule} from '../components/DoubleRule';
import {colors, fonts, palette, Palette, space, ThemeMode, radius, typeScale, useLayout} from '../theme';

/** Semantic bar colour. `saving` = favourable (one per chart), `cost` = tax owed / money lost. */
export type BarTone = 'saving' | 'cost' | 'neutral' | 'gold' | 'loss' | 'cream' | 'forest';

export type Bar = {
  label: string;
  value: number;
  /** One short line under the label, e.g. "15.3% on 92.35% of profit". */
  caption?: string;
  tone?: BarTone;
};

export type BarChartProps = {
  durationInFrames: number;
  title: string;
  subtitle?: string;
  kicker?: string;
  /** 1–5 bars. */
  bars: Bar[];
  format?: ValueFormat;
  decimals?: number;
  /** Bracket the gap between the tallest and shortest bar, with this lead-in label. */
  difference?: {label: string};
  theme?: ThemeMode;
};


// 'gold' | 'loss' | 'cream' | 'forest' are accepted as aliases from the first version of the kit.
const toneFill = (tone: BarTone, p: Palette): [string, string] => {
  const t = tone === 'gold' ? 'saving' : tone === 'loss' ? 'cost' : tone === 'cream' || tone === 'forest' ? 'neutral' : tone;
  if (t === 'saving') return p.mode === 'dark' ? [colors.mint, colors.mintInk] : [colors.pine, colors.pineHover];
  if (t === 'cost') return p.mode === 'dark' ? ['#ec7c86', colors.redBright] : ['#d24050', colors.red];
  return p.mode === 'dark' ? ['rgba(207,230,218,0.42)', 'rgba(207,230,218,0.28)'] : [colors.lineStrong, '#a3bdb0'];
};

export const BarChart: React.FC<BarChartProps> = ({
  durationInFrames,
  title,
  subtitle,
  kicker,
  bars,
  format = 'currency',
  decimals = 0,
  difference,
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {box, vertical} = useLayout();
  const p = palette(theme);
  const n = bars.length;
  // Landscape: wide bars, difference callout to the right. Vertical: narrower bars so the
  // callout still fits beside them inside the 856px safe width.
  const barW = vertical ? (n <= 2 ? 200 : n <= 3 ? 168 : 128) : n <= 2 ? 288 : n <= 3 ? 240 : 184;
  const gap = vertical ? (n <= 2 ? 96 : 64) : n <= 2 ? 224 : n <= 3 ? 152 : 96;
  const showDiff = Boolean(difference) && n >= 2;
  const groupW = n * barW + (n - 1) * gap + (showDiff ? (vertical ? 320 : 400) : 0);
  const left0 = box.x + (box.w - groupW) / 2;
  const BASELINE = vertical ? box.y + box.h - space(26) : 832;
  const MAX_H = vertical ? 420 : 360;
  const max = Math.max(...bars.map((b) => b.value));

  const GROW_START = 24;
  const STAGGER = stagger.bar;
  const GROW = dur.count;
  const grownAt = GROW_START + (n - 1) * STAGGER + GROW;

  const baseline = progress(frame, 8, 36, ease.inOut);
  const geom = bars.map((b, i) => ({
    ...b,
    x: left0 + i * (barW + gap),
    h: (b.value / max) * MAX_H,
    start: GROW_START + i * STAGGER,
  }));

  // Difference bracket between tallest and shortest bar.
  const hi = geom.reduce((a, b) => (b.value > a.value ? b : a));
  const lo = geom.reduce((a, b) => (b.value < a.value ? b : a));
  const diffP = progress(frame, grownAt + 4, 30, ease.inOut);
  const diffLabel = progress(frame, grownAt + 18, 26, ease.out);
  const bracketX = Math.max(hi.x, lo.x) + barW + space(5);
  const hiY = BASELINE - hi.h;
  const loY = BASELINE - lo.h;
  const lineFrom = Math.min(hi.x, lo.x) + (hi.x < lo.x ? barW : 0);

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'bars', glow: {x: 50, y: 70}}}>
      <ChartHeader title={title} subtitle={subtitle} kicker={kicker} p={p} />

      <div style={{position: 'absolute', inset: 0}}>
        {/* Baseline */}
        <div
          style={{
            position: 'absolute',
            left: left0 - space(5),
            width: n * barW + (n - 1) * gap + space(10),
            top: BASELINE,
            height: 3,
            background: p.accent,
            transform: `scaleX(${baseline})`,
            transformOrigin: 'left',
          }}
        />

        {geom.map((b, i) => {
          const g = progress(frame, b.start, GROW, ease.out);
          const label = progress(frame, b.start + 6, 26, ease.out);
          const [top, bottom] = toneFill(b.tone ?? 'neutral', p);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: b.x,
                  width: barW,
                  top: BASELINE - b.h,
                  height: b.h,
                  borderRadius: `${radius.sm}px ${radius.sm}px 0 0`,
                  background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`,
                  transform: `scaleY(${g})`,
                  transformOrigin: 'bottom',
                  boxShadow: theme === 'dark' ? `0 ${space(3)}px ${space(8)}px rgba(0,0,0,0.3)` : `0 ${space(4)}px ${space(8)}px -${space(4)}px rgba(7,53,42,0.45)`,
                }}
              />
              {/* Value rides the top of the bar while it grows */}
              <div
                style={{
                  position: 'absolute',
                  left: b.x - gap / 2,
                  width: barW + gap,
                  top: BASELINE - b.h * g - space(12),
                  textAlign: 'center',
                  fontFamily: fonts.serif,
                  fontWeight: 600,
                  fontSize: vertical ? typeScale.h3 : typeScale.h3 + 8,
                  color: p.fg,
                  opacity: progress(frame, b.start, 12, ease.out),
                }}
              >
                <CountUp value={b.value} format={format} decimals={decimals} start={b.start} duration={GROW} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: b.x - gap / 2,
                  width: barW + gap,
                  top: BASELINE + space(3),
                  textAlign: 'center',
                  opacity: label,
                  transform: `translateY(${mix(label, 16, 0)}px)`,
                }}
              >
                <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: vertical ? 44 : typeScale.bodySm + 4, lineHeight: 1.15, color: p.fg}}>{b.label}</div>
                {b.caption ? (
                  <div style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: vertical ? 32 : typeScale.label - 4, lineHeight: 1.25, color: p.muted, marginTop: space(1)}}>{b.caption}</div>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}

        {showDiff ? (
          <>
            {/* Dashed reference from the tallest bar's top */}
            <div
              style={{
                position: 'absolute',
                left: lineFrom,
                width: bracketX - lineFrom + space(2),
                top: hiY - 1,
                height: 0,
                borderTop: `3px dashed ${p.accent}`,
                opacity: 0.8,
                transform: `scaleX(${diffP})`,
                transformOrigin: hi.x < lo.x ? 'left' : 'right',
              }}
            />
            {/* Bracket */}
            <svg style={{position: 'absolute', left: bracketX - 4, top: hiY - 4, overflow: 'visible'}} width={40} height={loY - hiY + 8}>
              <path
                d={`M 4 4 L 24 4 L 24 ${loY - hiY + 4} L 4 ${loY - hiY + 4}`}
                fill="none"
                stroke={p.accent}
                strokeWidth={4}
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - diffP}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: bracketX + space(7),
                top: (hiY + loY) / 2,
                transform: `translate(${mix(diffLabel, -16, 0)}px, -50%)`,
                opacity: diffLabel,
              }}
            >
              <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: typeScale.label, color: p.body}}>
                {difference!.label}
              </div>
              <div style={{display: 'inline-block', fontFamily: fonts.serif, fontWeight: 700, fontSize: vertical ? 72 : typeScale.h2, color: p.fg, lineHeight: 1.05}}>
                <CountUp value={hi.value - lo.value} format={format} decimals={decimals} start={grownAt + 18} duration={36} />
                <DoubleRule color={p.cost} start={grownAt + 50} style={{marginTop: space(1)}} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </SceneShell>
  );
};

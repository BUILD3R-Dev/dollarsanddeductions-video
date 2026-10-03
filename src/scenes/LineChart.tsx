import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChartHeader} from '../components/ChartHeader';
import {SceneShell} from '../components/SceneShell';
import {monotone, niceScale} from '../lib/curve';
import {formatValue, ValueFormat} from '../lib/format';
import {dur, ease, mix, progress} from '../lib/motion';
import {colors, fonts, palette, radius, space, ThemeMode, typeScale, useLayout} from '../theme';

export type LinePoint = {label: string; value: number};

export type LineChartProps = {
  durationInFrames: number;
  title: string;
  subtitle?: string;
  kicker?: string;
  /** 2–16 points, evenly spaced on the x axis. */
  points: LinePoint[];
  format?: ValueFormat;
  decimals?: number;
  /** Shown beside the final value once the line lands, e.g. "after 10 years". */
  endLabel?: string;
  theme?: ThemeMode;
};

const SAMPLES = 320;

export const LineChart: React.FC<LineChartProps> = ({
  durationInFrames,
  title,
  subtitle,
  kicker,
  points,
  format = 'currency',
  decimals = 0,
  endLabel,
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {width: FW, height: FH, box, vertical} = useLayout();
  // Plot area: room for y labels on the left, the value pill on the right, header above.
  const X0 = vertical ? box.x + 132 : 272;
  const X1 = vertical ? box.x + box.w - space(5) : 1616;
  const Y0 = vertical ? box.y + 500 : 400;
  const Y1 = vertical ? box.y + box.h - space(12) : 856;
  const p = palette(theme);
  const ys = points.map((pt) => pt.value);
  const scale = niceScale(Math.max(...ys));
  const curve = monotone(ys);
  const n = points.length;
  const W = X1 - X0;
  const H = Y1 - Y0;
  const toX = (i: number) => X0 + (i / (n - 1)) * W;
  const toY = (v: number) => Y1 - (v / scale.max) * H;

  const DRAW_START = 28;
  const drawDur = Math.min(dur.draw, Math.max(40, durationInFrames - 100));
  const draw = progress(frame, DRAW_START, drawDur, ease.inOut);
  const done = progress(frame, DRAW_START + drawDur - 4, 30, ease.back);

  const samples = new Array(SAMPLES + 1).fill(0).map((_, s) => {
    const t = (s / SAMPLES) * (n - 1);
    return [X0 + (s / SAMPLES) * W, toY(curve(t))] as const;
  });
  const line = samples.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L ${X1} ${Y1} L ${X0} ${Y1} Z`;

  const headT = draw * (n - 1);
  const headX = X0 + draw * W;
  const headValue = curve(headT);
  const headY = toY(headValue);
  const dark = theme === 'dark';
  const pillBg = dark ? colors.white : colors.pine;
  const pillFg = dark ? colors.pineDeep : colors.white;
  const labelEvery = n > (vertical ? 6 : 12) ? 2 : 1;

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'line', glow: {x: 75, y: 30}}}>
      <ChartHeader title={title} subtitle={subtitle} kicker={kicker} p={p} />

      <div style={{position: 'absolute', inset: 0}}>
        {/* Gridlines + y labels */}
        {new Array(scale.ticks + 1).fill(0).map((_, i) => {
          const v = (scale.max / scale.ticks) * i;
          const y = toY(v);
          const g = progress(frame, 6 + i * 4, 30, ease.out);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: X0,
                  width: W,
                  top: y,
                  height: i === 0 ? 3 : 2,
                  background: i === 0 ? p.fg : p.faint,
                  transform: `scaleX(${g})`,
                  transformOrigin: 'left',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: FW - X0 + space(3),
                  top: y,
                  transform: 'translateY(-50%)',
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: typeScale.label - 4,
                  color: p.muted,
                  opacity: g,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatValue(v, {format, compact: true})}
              </div>
            </React.Fragment>
          );
        })}

        {/* X labels */}
        {points.map((pt, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: toX(i),
                top: Y1 + space(3),
                transform: 'translateX(-50%)',
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: typeScale.label - 4,
                color: p.muted,
                opacity: progress(frame, 10 + i * 2, 24, ease.out),
              }}
            >
              {pt.label}
            </div>
          ) : null,
        )}

        <svg width={FW} height={FH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="line-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? colors.mint : colors.pine} stopOpacity={dark ? 0.32 : 0.22} />
              <stop offset="100%" stopColor={dark ? colors.mint : colors.pine} stopOpacity={0} />
            </linearGradient>
            <clipPath id="line-reveal">
              <rect x={X0 - 8} y={0} width={draw * W + 8} height={FH} />
            </clipPath>
            <filter id="line-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g clipPath="url(#line-reveal)">
            <path d={area} fill="url(#line-area)" />
            <path d={line} fill="none" stroke={p.mark} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" filter={dark ? 'url(#line-glow)' : undefined} />
          </g>
          {points.map((pt, i) => {
            const x = toX(i);
            const s = ease.back(Math.min(1, Math.max(0, (headX - x + 4) / 48)));
            return <circle key={i} cx={x} cy={toY(pt.value)} r={9 * s} fill={p.bg} stroke={p.mark} strokeWidth={4} />;
          })}
          {draw > 0 ? (
            <>
              <circle cx={headX} cy={headY} r={28 + 10 * Math.sin(frame / 6)} fill={p.mark} opacity={0.18} />
              <circle cx={headX} cy={headY} r={13} fill={p.mark} stroke={p.bg} strokeWidth={4} />
            </>
          ) : null}
        </svg>

        {/* Value pill tracks the head; numbers stay in sync with the line. It
            slides from centred to right-anchored so it never leaves the frame. */}
        {draw > 0 ? (
          <div style={{position: 'absolute', left: headX, top: headY - space(5)}}>
            <div
              style={{
                position: 'absolute',
                transform: `translate(${-15 - 75 * draw}%, -100%) scale(${mix(done, 1, 1.1)})`,
                transformOrigin: 'bottom right',
                background: pillBg,
                color: pillFg,
                borderRadius: radius.sm,
                padding: `${space(1)}px ${space(3)}px`,
                whiteSpace: 'nowrap',
                textAlign: 'right',
                boxShadow: `0 ${space(2)}px ${space(5)}px rgba(0,0,0,0.25)`,
              }}
            >
              {endLabel ? (
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: typeScale.micro + 4,
                    letterSpacing: '0.02em',
                    height: mix(Math.min(1, done), 0, 48),
                    opacity: Math.min(1, done),
                    paddingTop: space(1),
                    overflow: 'hidden',
                  }}
                >
                  {endLabel}
                </div>
              ) : null}
              <div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: typeScale.bodySm + 8, fontVariantNumeric: 'tabular-nums lining-nums'}}>
                {formatValue(Math.round(headValue * 10 ** decimals) / 10 ** decimals, {format, decimals})}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SceneShell>
  );
};

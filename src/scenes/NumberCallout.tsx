import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CountUp} from '../components/CountUp';
import {DoubleRule} from '../components/DoubleRule';
import {Kicker} from '../components/Kicker';
import {SceneShell} from '../components/SceneShell';
import {formatValue, ValueFormat} from '../lib/format';
import {dur, ease, mix, progress} from '../lib/motion';
import {colors, fonts, insetPadding, palette, space, ThemeMode, typeScale, useLayout} from '../theme';

export type NumberCalloutProps = {
  durationInFrames: number;
  value: number;
  format?: ValueFormat;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Small caps label above the figure. */
  kicker?: string;
  /** Supporting sentence below the figure. `*word*` for emphasis. */
  caption?: string;
  /** Draw the red double rule under the figure: use when it is a final total. Default true. */
  doubleRule?: boolean;
  theme?: ThemeMode;
};

const COUNT_START = 14;
const COUNT = dur.count;

export const NumberCallout: React.FC<NumberCalloutProps> = ({
  durationInFrames,
  value,
  format = 'currency',
  decimals = 0,
  prefix,
  suffix,
  kicker,
  caption,
  doubleRule = true,
  theme = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {safe, box} = useLayout();
  const p = palette(theme);
  const dark = theme === 'dark';
  const finalText = formatValue(value, {format, decimals, prefix, suffix});
  // Scale the figure so long values still fit inside the safe area.
  const size = Math.min(typeScale.hero, Math.floor((box.w - space(4)) / (finalText.length * 0.6)));

  const enter = progress(frame, 4, 30, ease.out);
  const land = COUNT_START + COUNT - 6;
  const pop = progress(frame, land, 18, ease.back) - progress(frame, land + 10, 20, ease.soft);
  const pulse = progress(frame, land - 4, 40, ease.out);
  const cap = progress(frame, land - 10, 30, ease.out);
  const ringColor = p.accent;

  return (
    <SceneShell durationInFrames={durationInFrames} theme={theme} background={{seed: 'callout', glow: {x: 50, y: 48}}}>
      {/* Accent: orbiting rings + landing pulse */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: insetPadding(safe)}}>
        <svg width={1400} height={1400} style={{position: 'absolute', transform: `rotate(${frame * 0.12}deg)`}}>
          {[360, 448, 536].map((r, i) => {
            const c = 2 * Math.PI * r;
            const d = progress(frame, 2 + i * 6, 60, ease.inOut);
            return (
              <circle
                key={r}
                cx={700}
                cy={700}
                r={r}
                fill="none"
                stroke={ringColor}
                strokeOpacity={[0.32, 0.2, 0.12][i]}
                strokeWidth={i === 0 ? 3 : 2}
                strokeDasharray={i === 1 ? `4 18` : `${c}`}
                strokeDashoffset={i === 1 ? 0 : c * (1 - d)}
                opacity={i === 1 ? d : 1}
              />
            );
          })}
          {[0, 90, 180, 270].map((a) => (
            <circle
              key={a}
              cx={700 + 448 * Math.cos((a * Math.PI) / 180)}
              cy={700 + 448 * Math.sin((a * Math.PI) / 180)}
              r={6}
              fill={p.accent}
              opacity={progress(frame, 30, 20, ease.out)}
            />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            width: 720,
            height: 720,
            borderRadius: '50%',
            border: `4px solid ${p.accent}`,
            opacity: (1 - pulse) * 0.7 * (pulse > 0 ? 1 : 0),
            transform: `scale(${mix(pulse, 0.6, 1.9)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 1100,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${dark ? 'rgba(11,93,69,0.9)' : 'rgba(255,255,255,0.9)'} 0%, transparent 65%)`,
            opacity: enter,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: insetPadding(safe)}}>
        {kicker ? (
          <div style={{marginBottom: space(2)}}>
            <Kicker text={kicker} color={p.accentText} align="center" start={0} />
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: p.fg,
            opacity: enter,
            transform: `translateY(${mix(enter, 40, 0)}px) scale(${mix(enter, 0.92, 1) * (1 + pop * 0.05)})`,
          }}
        >
          <CountUp value={value} format={format} decimals={decimals} prefix={prefix} suffix={suffix} start={COUNT_START} duration={COUNT} />
          {doubleRule ? <DoubleRule color={p.cost} start={land + 4} weight={8} gap={10} style={{marginTop: space(1)}} /> : null}
        </div>
        {caption ? (
          <div
            style={{
              marginTop: space(4),
              maxWidth: Math.min(1280, box.w),
              textAlign: 'center',
              textWrap: 'balance',
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: typeScale.body,
              lineHeight: 1.3,
              color: p.body,
              opacity: cap,
              transform: `translateY(${mix(cap, 24, 0)}px)`,
            }}
          >
            {caption}
          </div>
        ) : null}
      </AbsoluteFill>
    </SceneShell>
  );
};

import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette, ThemeMode} from '../theme';

export type BackgroundProps = {
  theme?: ThemeMode;
  /** Drifting ledger rules (horizontal lines, like ledger paper). */
  grid?: boolean;
  /** Number of floating motes (0 = off, the default; the site has no ornament). */
  particles?: number;
  /** Where the soft light source sits, in % of frame. */
  glow?: {x: number; y: number};
  seed?: string;
};

const CELL = 72;

/** Shared procedural backdrop: gradient + drifting grid + motes + grain + vignette. */
export const Background: React.FC<BackgroundProps> = ({
  theme = 'dark',
  grid = true,
  particles = 0,
  glow = {x: 28, y: 22},
  seed = 'bg',
}) => {
  const frame = useCurrentFrame();
  const VIDEO = useVideoConfig();
  const p = palette(theme);
  const dark = theme === 'dark';

  const motes = useMemo(
    () =>
      new Array(particles).fill(0).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * VIDEO.width,
        y: random(`${seed}-y-${i}`) * VIDEO.height,
        r: 1.5 + random(`${seed}-r-${i}`) * 3,
        speed: 0.25 + random(`${seed}-s-${i}`) * 0.6,
        phase: random(`${seed}-p-${i}`) * Math.PI * 2,
        alpha: 0.25 + random(`${seed}-a-${i}`) * 0.5,
      })),
    [particles, seed, VIDEO.width, VIDEO.height],
  );

  // Slow upward drift, like paper feeding; wraps every rule so it can run forever.
  const drift = (frame * 0.3) % CELL;

  return (
    <AbsoluteFill style={{backgroundColor: p.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at ${glow.x}% ${glow.y}%, ${p.bgGlow} 0%, ${p.bg} 48%, ${p.bgEdge} 100%)`,
        }}
      />
      {grid ? (
        <AbsoluteFill
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 45%, black 20%, transparent 85%)',
          }}
        >
          <svg width={VIDEO.width + CELL} height={VIDEO.height + CELL} style={{transform: `translateY(${-drift}px)`}}>
            <defs>
              <pattern id={`grid-${seed}`} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                <path d={`M 0 0.75 H ${CELL}`} fill="none" stroke={p.grid} strokeWidth={1.5} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
          </svg>
        </AbsoluteFill>
      ) : null}
      {motes.map((m, i) => {
        const y = (((m.y - frame * m.speed) % VIDEO.height) + VIDEO.height) % VIDEO.height;
        const x = m.x + Math.sin(frame / 50 + m.phase) * 12;
        const twinkle = 0.55 + 0.45 * Math.sin(frame / 22 + m.phase);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: m.r * 2,
              height: m.r * 2,
              borderRadius: '50%',
              background: p.accent,
              opacity: m.alpha * twinkle * (dark ? 1 : 0.6),
              boxShadow: `0 0 ${m.r * 4}px ${p.accent}`,
            }}
          />
        );
      })}
      {/* Static film grain: animated grain fights YouTube's encoder. */}
      <AbsoluteFill style={{opacity: dark ? 0.05 : 0, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id={`grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: dark
            ? 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.42) 100%)'
            : 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 65%, rgba(7,53,42,0.06) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

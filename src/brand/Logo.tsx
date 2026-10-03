import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, space, ThemeMode} from '../theme';
import {BRAND_ASSETS} from './config';
import {LOGO} from './geometry';

export type LogoColors = {
  /** Tile fill. */
  tile?: string;
  /** Ledger lines. */
  line?: string;
  /** Double rule. */
  total?: string;
  /** Wordmark colour. */
  ink?: string;
};

/** Logo colours for a theme. The tile itself is always pine, as on the site. */
export const logoColors = (theme: ThemeMode = 'dark'): Required<LogoColors> => ({
  tile: colors.pine,
  line: colors.mint,
  total: colors.white,
  ink: theme === 'dark' ? colors.white : colors.ink,
});

export type LogoMarkProps = LogoColors & {
  size?: number;
  /** Frame to start the build-on. `null` renders it static. */
  start?: number | null;
  /** Which supplied-artwork slot to prefer (see config.ts). */
  theme?: ThemeMode;
};

/** The square mark. Build-on: tile settles, entries draw, then the double rule. */
export const LogoMark: React.FC<LogoMarkProps> = ({size = 96, start = 0, theme = 'dark', ...c}) => {
  const frame = useCurrentFrame();
  const col = {...logoColors(theme), ...c};
  const t0 = start ?? 0;
  const at = (offset: number, d: number, e = ease.out) => (start === null ? 1 : progress(frame, t0 + offset, d, e));

  const custom = theme === 'light' && BRAND_ASSETS.markLightSrc ? BRAND_ASSETS.markLightSrc : BRAND_ASSETS.markSrc;
  if (custom) {
    const p = at(0, 30);
    return <Img src={staticFile(custom)} style={{width: size, height: size, objectFit: 'contain', flexShrink: 0, opacity: p, transform: `scale(${mix(p, 0.88, 1)})`}} />;
  }

  const tile = at(0, 18, ease.back);
  const strokes = [...LOGO.lines.map((d) => ({d, color: col.line})), ...LOGO.total.map((d) => ({d, color: col.total}))];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${LOGO.viewBox} ${LOGO.viewBox}`} style={{flexShrink: 0, overflow: 'visible'}}>
      <rect width={32} height={32} rx={LOGO.tile.rx} fill={col.tile} style={{transformOrigin: '16px 16px', transform: `scale(${mix(tile, 0.6, 1)})`}} opacity={Math.min(1, tile * 1.5)} />
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          stroke={s.color}
          strokeWidth={LOGO.stroke}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - at(10 + i * 5, 14, ease.inOut)}
        />
      ))}
    </svg>
  );
};

export type LogoProps = LogoMarkProps & {
  /** horizontal: mark + one-line wordmark (site header). stacked: mark over wordmark. mark: mark only. */
  variant?: 'horizontal' | 'stacked' | 'mark';
  /** Wordmark font-size px. The mark scales from it unless `size` is given. */
  textSize?: number;
  /**
   * Horizontal only: the lock-up with the tagline under the wordmark. Default true: the tagline
   * lock-up is the channel's logo. Pass `tagline={false}` only for the compact export.
   */
  tagline?: boolean;
};

/** Lock-ups. Wordmark = Newsreader 600, as in the site header. */
export const Logo: React.FC<LogoProps> = ({variant = 'horizontal', textSize = 48, size, start = 0, theme = 'dark', tagline = true, ...rest}) => {
  const frame = useCurrentFrame();
  const t0 = start ?? 0;
  const word = start === null ? 1 : progress(frame, t0 + 16, 30, ease.out);
  const ink = rest.ink ?? logoColors(theme).ink;

  const plain = theme === 'light' && BRAND_ASSETS.lockupLightSrc ? BRAND_ASSETS.lockupLightSrc : BRAND_ASSETS.lockupSrc;
  const withTag = theme === 'light' && BRAND_ASSETS.lockupTaglineLightSrc ? BRAND_ASSETS.lockupTaglineLightSrc : BRAND_ASSETS.lockupTaglineSrc;
  const lockup = tagline && withTag ? withTag : plain;
  if (variant === 'horizontal' && lockup) {
    // Wordmark cap-height in the art is ~43% of its height; this keeps it matching `textSize`.
    const h = size ?? textSize * 2.3;
    const useTag = tagline && Boolean(withTag);
    const aspect = useTag ? BRAND_ASSETS.lockupTaglineAspect : BRAND_ASSETS.lockupAspect;
    const [x0, y0, x1, y1] = useTag ? BRAND_ASSETS.lockupTaglineInk : BRAND_ASSETS.lockupInk;
    const k = h / 120;
    // Crop to the visible ink so alignment (left or centred) uses what the eye sees.
    return (
      <div style={{width: (x1 - x0) * k, height: (y1 - y0) * k, overflow: 'hidden', flexShrink: 0, opacity: word, transform: `translateX(${mix(word, -space(3), 0)}px)`}}>
        <Img src={staticFile(lockup)} style={{display: 'block', height: h, width: h * aspect, marginLeft: -x0 * k, marginTop: -y0 * k}} />
      </div>
    );
  }

  const textStyle: React.CSSProperties = {
    fontFamily: fonts.serif,
    fontWeight: 600,
    fontSize: textSize,
    color: ink,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    opacity: word,
  };

  if (variant === 'mark') return <LogoMark size={size ?? textSize * 2} start={start} theme={theme} {...rest} />;

  const stacked = theme === 'light' && BRAND_ASSETS.stackedLightSrc ? BRAND_ASSETS.stackedLightSrc : BRAND_ASSETS.stackedSrc;
  if (variant === 'stacked' && stacked) {
    const w = size ?? textSize * 7;
    return (
      <Img
        src={staticFile(stacked)}
        style={{width: w, height: w / BRAND_ASSETS.stackedAspect, objectFit: 'contain', opacity: word, transform: `translateY(${mix(word, 16, 0)}px)`}}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: textSize * 0.5}}>
        <LogoMark size={size ?? textSize * 2.4} start={start} theme={theme} {...rest} />
        <div style={{...textStyle, textAlign: 'center', lineHeight: 1.08, transform: `translateY(${mix(word, 16, 0)}px)`}}>
          Dollars &amp;
          <br />
          Deductions
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: textSize * 0.46}}>
      <LogoMark size={size ?? textSize * 1.4} start={start} theme={theme} {...rest} />
      <div style={{...textStyle, transform: `translateX(${mix(word, -space(3), 0)}px)`, clipPath: `inset(-20% ${mix(word, 100, 0)}% -20% 0)`}}>Dollars &amp; Deductions</div>
    </div>
  );
};

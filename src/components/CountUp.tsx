import React from 'react';
import {useCurrentFrame} from 'remotion';
import {formatValue, FormatOptions} from '../lib/format';
import {dur, ease, progress} from '../lib/motion';

export type CountUpProps = FormatOptions & {
  value: number;
  from?: number;
  /** Frame (relative to the parent sequence) the count starts. */
  start?: number;
  duration?: number;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
};

/**
 * Animated number. Width is reserved with an invisible copy of the final value
 * so surrounding layout never jitters while digits are added.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  from = 0,
  start = 0,
  duration = dur.count,
  easing = ease.out,
  style,
  ...fmt
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration, easing);
  const current = from + (value - from) * p;
  const step = Math.pow(10, fmt.decimals ?? 0);
  const shown = Math.round(current * step) / step;
  return (
    <span style={{position: 'relative', display: 'inline-block', fontVariantNumeric: 'tabular-nums lining-nums', ...style}}>
      <span style={{visibility: 'hidden'}}>{formatValue(value, fmt)}</span>
      <span style={{position: 'absolute', inset: 0, textAlign: 'center', whiteSpace: 'nowrap'}}>{formatValue(shown, fmt)}</span>
    </span>
  );
};

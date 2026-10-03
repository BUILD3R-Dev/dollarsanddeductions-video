import React from 'react';
import {useCurrentFrame} from 'remotion';
import {dur, ease, progress} from '../lib/motion';

/**
 * The bookkeeper's double rule under a final total, the site's signature motif
 * (`.ws-total` in site.css). Draws left→right, second line a beat behind.
 * Use only under final totals.
 */
export const DoubleRule: React.FC<{color: string; start?: number; weight?: number; gap?: number; style?: React.CSSProperties}> = ({
  color,
  start = 0,
  weight = 4,
  gap = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  const a = progress(frame, start, dur.base, ease.inOut);
  const b = progress(frame, start + 5, dur.base, ease.inOut);
  const line = (p: number): React.CSSProperties => ({height: weight, background: color, transform: `scaleX(${p})`, transformOrigin: 'left', borderRadius: weight});
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap, ...style}}>
      <div style={line(a)} />
      <div style={line(b)} />
    </div>
  );
};

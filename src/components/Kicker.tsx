import React from 'react';
import {useCurrentFrame} from 'remotion';
import {dur, ease, mix, progress} from '../lib/motion';
import {fonts, space, typeScale} from '../theme';

/** Sentence-case label with a drawn rule: "—— Episode 14 · The S-corp series". */
export const Kicker: React.FC<{
  text: string;
  color: string;
  start?: number;
  align?: 'left' | 'center';
  size?: number;
}> = ({text, color, start = 0, align = 'left', size = typeScale.label}) => {
  const frame = useCurrentFrame();
  const rule = progress(frame, start, dur.base, ease.out);
  const label = progress(frame, start + 6, dur.base, ease.out);
  const ruleEl = (
    <div style={{width: space(6), height: 3, background: color, transform: `scaleX(${rule})`, transformOrigin: align === 'center' ? 'right' : 'left'}} />
  );
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: space(3), justifyContent: align === 'center' ? 'center' : 'flex-start'}}>
      {ruleEl}
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: size,
          letterSpacing: '0.005em',
          color,
          opacity: label,
          transform: `translateX(${mix(label, -16, 0)}px)`,
        }}
      >
        {text}
      </div>
      {align === 'center' ? <div style={{width: space(6), height: 3, background: color, transform: `scaleX(${rule})`, transformOrigin: 'left'}} /> : null}
    </div>
  );
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease, mix, progress} from '../lib/motion';
import {fonts, Palette, space, typeScale} from '../theme';
import {Kicker} from './Kicker';
import {WordReveal} from './WordReveal';

/** Kicker + serif title + sans subtitle, used atop chart scenes. */
export const ChartHeader: React.FC<{title: string; subtitle?: string; kicker?: string; p: Palette}> = ({title, subtitle, kicker, p}) => {
  const frame = useCurrentFrame();
  const sub = progress(frame, 16, 28, ease.out);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: space(2)}}>
      {kicker ? (
        <div style={{marginBottom: space(1)}}>
          <Kicker text={kicker} color={p.accentText} />
        </div>
      ) : null}
      <WordReveal
        text={title}
        start={4}
        stagger={3}
        accent={p.accentText}
        style={{fontSize: typeScale.h3 + 16, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.015em', color: p.fg}}
      />
      {subtitle ? (
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: typeScale.bodySm,
            color: p.muted,
            opacity: sub,
            transform: `translateY(${mix(sub, 16, 0)}px)`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

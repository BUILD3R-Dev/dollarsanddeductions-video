import React from 'react';
import {useCurrentFrame} from 'remotion';
import {dur, ease, mix, progress, stagger as staggerTokens} from '../lib/motion';
import {parseRich} from '../lib/rich';
import {fonts} from '../theme';

/**
 * Masked, staggered word reveal. Each word rises out of its own clip box.
 * Supports *emphasis* (italic, accent colour).
 */
export const WordReveal: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  duration?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({text, start = 0, stagger = staggerTokens.word, duration = dur.base + 4, accent, style}) => {
  const frame = useCurrentFrame();
  const words = parseRich(text);
  return (
    <div style={{fontFamily: fonts.serif, ...style}}>
      {words.map((w, i) => {
        const p = progress(frame, start + i * stagger, duration, ease.out);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
                // Pad the clip box so ascenders/descenders and italics aren't cut.
                padding: '0.08em 0.06em 0.14em',
                margin: '-0.08em -0.06em -0.14em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${mix(p, 115, 0)}%) rotate(${mix(p, 4, 0)}deg)`,
                  transformOrigin: 'left bottom',
                  opacity: mix(p, 0.2, 1),
                  fontStyle: w.emphasis ? 'italic' : undefined,
                  fontWeight: w.emphasis ? 500 : undefined,
                  color: w.emphasis ? accent : undefined,
                }}
              >
                {w.text}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, radius, space, typeScale, useLayout} from '../theme';

export type LowerThirdProps = {
  durationInFrames: number;
  /** Concept name, e.g. "QBI Deduction". */
  title: string;
  /** One-line definition, e.g. "20% pass-through deduction". */
  subtitle?: string;
  /** Tiny tag above the title. */
  tag?: string;
  align?: 'left' | 'right';
};

/**
 * Transparent overlay — layer it over any scene (see `overlays` in SceneSpec).
 * Animates in and back out within its own duration.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({durationInFrames, title, subtitle, tag = 'Concept', align = 'left'}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical} = useLayout();
  const OUT = 18;
  const outStart = durationInFrames - OUT;
  const bar = progress(frame, 0, 16, ease.out) - progress(frame, outStart + 8, 10, ease.in);
  const panel = progress(frame, 6, 24, ease.out) - progress(frame, outStart, 14, ease.in);
  const titleP = progress(frame, 14, 24, ease.out) - progress(frame, outStart, 10, ease.in);
  const subP = progress(frame, 20, 24, ease.out) - progress(frame, outStart, 10, ease.in);
  const right = align === 'right';

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: right ? 'flex-end' : 'flex-start', padding: `${safe.top}px ${safe.right}px ${safe.bottom + space(3)}px ${safe.left}px`}}>
      <div style={{display: 'flex', flexDirection: right ? 'row-reverse' : 'row', alignItems: 'stretch'}}>
        <div style={{width: space(1.5), background: colors.mint, transform: `scaleY(${bar})`, transformOrigin: 'bottom', borderRadius: 2}} />
        <div
          style={{
            background: `linear-gradient(${right ? 270 : 90}deg, rgba(4,36,28,0.96) 0%, rgba(7,53,42,0.94) 100%)`,
            padding: `${space(3)}px ${space(5)}px ${space(3.5)}px`,
            clipPath: right ? `inset(0 0 0 ${mix(panel, 100, 0)}%)` : `inset(0 ${mix(panel, 100, 0)}% 0 0)`,
            boxShadow: `0 ${space(2)}px ${space(6)}px rgba(0,0,0,0.35)`,
            borderTop: `1px solid rgba(207,230,218,0.25)`,
            borderRadius: right ? `${radius.sm}px 0 0 ${radius.sm}px` : `0 ${radius.sm}px ${radius.sm}px 0`,
            textAlign: right ? 'right' : 'left',
            maxWidth: box.w - space(1.5),
          }}
        >
          {tag ? (
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: typeScale.micro,
                color: colors.mintInk,
                marginBottom: space(1),
                opacity: titleP,
              }}
            >
              {tag}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: fonts.serif,
              fontWeight: 600,
              fontSize: typeScale.h3,
              lineHeight: 1.1,
              color: colors.white,
              whiteSpace: vertical ? 'normal' : 'nowrap',
              opacity: titleP,
              transform: `translateX(${mix(titleP, right ? 24 : -24, 0)}px)`,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: typeScale.label + 4,
                color: colors.mint,
                marginTop: space(1),
                whiteSpace: vertical ? 'normal' : 'nowrap',
                opacity: subP,
                transform: `translateX(${mix(subP, right ? 24 : -24, 0)}px)`,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

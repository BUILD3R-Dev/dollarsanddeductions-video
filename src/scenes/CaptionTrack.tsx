import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, mix, progress} from '../lib/motion';
import {colors, fonts, radius, space, useLayout} from '../theme';

export type CaptionCue = {
  /** One short phrase, ≤ ~7 words. `*word*` highlights a word in mint for the whole cue. */
  text: string;
  /** Frames, relative to the start of this overlay. */
  from: number;
  to: number;
  /** Optional per-word timings (frames) for exact highlight sync; otherwise words are spread evenly. */
  words?: {from: number; to: number}[];
};

export type CaptionTrackProps = {
  durationInFrames: number;
  cues: CaptionCue[];
  /** lower: just above the platform UI (default). middle: frame centre. upper: below the top UI. */
  position?: 'lower' | 'middle' | 'upper';
};

/**
 * Burned-in, word-by-word captions for voiced Shorts/Reels (most viewers watch muted).
 * Words are spread evenly across each cue; the spoken word gets the mint highlight,
 * spoken words are white, upcoming words are dimmed. Timings usually come from the
 * voiceover's word timestamps (TTS or a transcription), grouped into short phrases.
 */
export const CaptionTrack: React.FC<CaptionTrackProps> = ({cues, position = 'lower'}) => {
  const frame = useCurrentFrame();
  const {safe, box, vertical, height} = useLayout();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;

  const words = cue.text.split(/\s+/).filter(Boolean);
  const span = Math.max(1, cue.to - cue.from);
  const per = span / words.length;
  const timed = cue.words && cue.words.length === words.length ? cue.words : null;
  const active = timed
    ? Math.max(0, timed.reduce((a, w, i) => (frame >= w.from ? i : a), -1))
    : Math.min(words.length - 1, Math.floor((frame - cue.from) / per));
  const enter = progress(frame, cue.from, 6, ease.out);
  const size = vertical ? 64 : 52;

  const place: React.CSSProperties =
    position === 'middle'
      ? {justifyContent: 'center'}
      : position === 'upper'
        ? {justifyContent: 'flex-start', paddingTop: safe.top + space(2)}
        : {justifyContent: 'flex-end', paddingBottom: (vertical ? safe.bottom : safe.bottom + space(4)) + space(2)};

  return (
    <AbsoluteFill style={{alignItems: 'center', paddingLeft: safe.left, paddingRight: safe.right, ...place}}>
      <div
        style={{
          maxWidth: Math.min(box.w, vertical ? box.w : 1400),
          padding: `${space(2)}px ${space(3)}px`,
          borderRadius: radius.md,
          background: 'rgba(4, 36, 28, 0.88)',
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.25,
          color: colors.white,
          opacity: enter,
          transform: `translateY(${mix(enter, 12, 0)}px) scale(${mix(enter, 0.96, 1)})`,
          maxHeight: height,
        }}
      >
        {words.map((raw, i) => {
          const emphasis = raw.startsWith('*') || raw.endsWith('*') || raw.includes('*');
          const w = raw.replace(/\*/g, '');
          const isActive = i === active;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: 'inline-block',
                  padding: `0 ${space(1)}px`,
                  margin: `0 -${space(1)}px`,
                  borderRadius: radius.sm - 4,
                  background: isActive ? colors.mint : 'transparent',
                  color: isActive ? colors.pineDeep : emphasis ? colors.mint : colors.white,
                  opacity: i > active ? 0.45 : 1,
                }}
              >
                {w}
              </span>
              {i < words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

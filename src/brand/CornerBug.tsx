import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {dur, ease, mix, progress} from '../lib/motion';
import {space, ThemeMode} from '../theme';
import {LogoMark} from './Logo';

export type BugOptions = {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Mark diameter in px. 48 is the minimum with rings. */
  size?: number;
  opacity?: number;
};

export type CornerBugProps = BugOptions & {durationInFrames: number; theme?: ThemeMode};

/** Small persistent channel mark. Fades in after a scene starts and out before it ends. */
export const CornerBug: React.FC<CornerBugProps> = ({durationInFrames, theme = 'dark', position = 'top-right', size = 64, opacity = 0.85}) => {
  const frame = useCurrentFrame();
  const inP = progress(frame, 8, dur.base, ease.out);
  const outP = progress(frame, durationInFrames - dur.exit - 4, dur.exit, ease.in);
  const top = position.startsWith('top');
  const right = position.endsWith('right');
  return (
    <AbsoluteFill
      style={{
        justifyContent: top ? 'flex-start' : 'flex-end',
        alignItems: right ? 'flex-end' : 'flex-start',
        padding: `${space(5)}px ${space(6)}px`,
        pointerEvents: 'none',
      }}
    >
      <div style={{opacity: opacity * inP * (1 - outP), transform: `scale(${mix(inP, 0.85, 1)})`}}>
        <LogoMark size={size} start={null} theme={theme} />
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {dur, exitProgress, mix} from '../lib/motion';
import {ThemeMode, useLayout} from '../theme';
import {Background, BackgroundProps} from './Background';

/** Standard scene wrapper: background, safe-area padding and a gentle exit. */
export const SceneShell: React.FC<{
  durationInFrames: number;
  theme?: ThemeMode;
  background?: Omit<BackgroundProps, 'theme'>;
  /** Frames for the exit fade (0 disables). */
  exit?: number;
  children: React.ReactNode;
}> = ({durationInFrames, theme = 'dark', background, exit = dur.exit, children}) => {
  const frame = useCurrentFrame();
  const {safe} = useLayout();
  const out = exit > 0 ? exitProgress(frame, durationInFrames, exit) : 0;
  return (
    <AbsoluteFill>
      <Background theme={theme} {...background} />
      <AbsoluteFill
        style={{
          padding: `${safe.top}px ${safe.right}px ${safe.bottom}px ${safe.left}px`,
          opacity: 1 - out,
          transform: `translateY(${mix(out, 0, -16)}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

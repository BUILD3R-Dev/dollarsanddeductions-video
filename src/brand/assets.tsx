import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {Logo, LogoMark} from './Logo';

/** Brand asset compositions, rendered to /brand by `npm run brand`. Transparent unless noted. */

export const LogoHorizontalAsset: React.FC<{theme?: 'dark' | 'light'}> = ({theme = 'dark'}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Logo variant="horizontal" tagline={false} textSize={88} start={null} theme={theme} />
  </AbsoluteFill>
);

export const LogoTaglineAsset: React.FC<{theme?: 'dark' | 'light'}> = ({theme = 'dark'}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Logo variant="horizontal" tagline textSize={88} start={null} theme={theme} />
  </AbsoluteFill>
);

export const LogoStackedAsset: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Logo variant="stacked" textSize={88} start={0} />
  </AbsoluteFill>
);

/** YouTube profile picture (800×800, shown as a circle). Opaque deep-pine background. */
export const AvatarAsset: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Background grid={false} glow={{x: 40, y: 35}} />
    <LogoMark size={440} start={null} />
  </AbsoluteFill>
);

/** YouTube branding watermark (150×150, transparent). */
export const WatermarkAsset: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <LogoMark size={128} start={null} />
  </AbsoluteFill>
);

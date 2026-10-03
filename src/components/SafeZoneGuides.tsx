import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../theme';

/** Review aid: shades the platform-UI zones red and outlines the safe content box. Never ship with it on. */
export const SafeZoneGuides: React.FC = () => {
  const {width, height, safe, box} = useLayout();
  const shade = 'rgba(255, 40, 60, 0.28)';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width, height: safe.top, background: shade}} />
      <div style={{position: 'absolute', left: 0, top: height - safe.bottom, width, height: safe.bottom, background: shade}} />
      <div style={{position: 'absolute', left: 0, top: safe.top, width: safe.left, height: box.h, background: shade}} />
      <div style={{position: 'absolute', left: width - safe.right, top: safe.top, width: safe.right, height: box.h, background: shade}} />
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, outline: '2px dashed rgba(255,255,255,0.7)'}} />
    </AbsoluteFill>
  );
};

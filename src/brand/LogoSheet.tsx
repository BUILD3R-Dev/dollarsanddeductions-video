import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {colors, fonts, space} from '../theme';
import {Logo, LogoMark} from './Logo';

const Label: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark = true}) => (
  <div style={{fontFamily: fonts.sans, fontSize: 24, fontWeight: 600, color: dark ? colors.mintInk : colors.muted, marginTop: space(3)}}>{children}</div>
);

/** Brand reference sheet: every lock-up at real sizes, on deep pine and mist. */
export const LogoSheet: React.FC = () => (
  <AbsoluteFill style={{flexDirection: 'row'}}>
    <div style={{position: 'relative', flex: 1.25}}>
      <Background grid={false} />
      <AbsoluteFill style={{padding: space(10), justifyContent: 'space-between'}}>
        <div>
          <Logo start={null} variant="horizontal" tagline size={150} />
          <Label>Horizontal with tagline · primary: title card, outro, Short end card</Label>
          <div style={{height: space(5)}} />
          <Logo start={null} variant="horizontal" tagline={false} size={64} />
          <Label>Compact (no tagline) · only where the tagline would be under ~18px</Label>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: space(10)}}>
          <div>
            <Logo start={null} variant="stacked" textSize={48} />
            <Label>Stacked</Label>
          </div>
          <div>
            <LogoMark start={null} size={200} />
            <Label>Mark</Label>
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: space(4)}}>
              <LogoMark start={null} size={64} />
              <LogoMark start={null} size={48} />
              <LogoMark start={null} size={32} />
            </div>
            <Label>Bug · 64 / 48 / 32</Label>
          </div>
        </div>
      </AbsoluteFill>
    </div>
    <div style={{position: 'relative', flex: 1}}>
      <Background theme="light" grid={false} />
      <AbsoluteFill style={{padding: space(10), justifyContent: 'space-between'}}>
        <div>
          <LogoMark start={null} size={240} theme="light" />
          <Label dark={false}>Mark on mist</Label>
        </div>
        <div>
          <Logo start={null} variant="horizontal" tagline size={110} theme="light" />
          <Label dark={false}>Horizontal with tagline on mist</Label>
        </div>
      </AbsoluteFill>
    </div>
  </AbsoluteFill>
);

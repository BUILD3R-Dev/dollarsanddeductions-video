import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {colors, fonts} from '../theme';
import {Logo} from './Logo';

/**
 * YouTube channel banner, 2560×1440. YouTube crops it per device:
 *   TV       2560×1440 (everything)
 *   desktop  2560×423  (centre strip)
 *   mobile / text-and-logo safe area  1546×423 (centre)
 * All content (logo with tagline, URL, upload cadence) lives in the safe area; desktop
 * widths vary, so the strip outside it carries only background.
 */
export const BANNER = {width: 2560, height: 1440, safe: {w: 1546, h: 423}, desktop: {h: 423}};

export type BannerProps = {
  url?: string;
  cadence?: string;
  /** Review aid: outline the safe area and desktop strip. */
  guides?: boolean;
};

export const Banner: React.FC<BannerProps> = ({url = 'dollarsanddeductions.com', cadence = 'New videos twice a week', guides = false}) => {
  const {width: W, height: H, safe} = BANNER;
  const safeX = (W - safe.w) / 2;
  const safeY = (H - safe.h) / 2;
  // Logo with tagline across ~78% of the safe width: the tagline stays legible on phones.
  const logoH = (safe.w * 0.78 * 120) / 652.5;
  return (
    <AbsoluteFill>
      <Background grid glow={{x: 50, y: 50}} seed="banner" />
      {/* Ledger double rules framing the strip: the site's "total" mark. */}
      {[safeY - 70, safeY + safe.h + 52].map((y) => (
        <div key={y} style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.35}}>
          <div style={{height: 3, background: colors.mint}} />
          <div style={{height: 3, background: colors.mint}} />
        </div>
      ))}
      {/* Everything that matters sits in the mobile safe area: logo with tagline, then URL · cadence. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 34}}>
        <Logo variant="horizontal" tagline size={logoH} start={null} />
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 44, color: colors.mint, whiteSpace: 'nowrap'}}>
          {url} <span style={{color: colors.mintInk}}>·</span> {cadence}
        </div>
      </AbsoluteFill>
      {guides ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: (H - BANNER.desktop.h) / 2, height: BANNER.desktop.h, outline: '4px dashed rgba(255,200,0,0.8)'}} />
          <div style={{position: 'absolute', left: safeX, top: safeY, width: safe.w, height: safe.h, outline: '4px dashed rgba(255,60,80,0.9)'}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

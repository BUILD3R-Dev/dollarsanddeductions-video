import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CornerBug, BugOptions} from './brand/CornerBug';
import {AudioSpec, CaptionsSpec, resolveCaptions, Soundtrack} from './audio';
import {SafeZoneGuides} from './components/SafeZoneGuides';
import {CaptionTrack} from './scenes/CaptionTrack';
import {sceneRegistry, ScenePropsOf, SceneType, TransitionProps} from './scenes';
import {ThemeMode, useLayout} from './theme';

export type TransitionSpec = Omit<TransitionProps, 'durationInFrames'> & {durationInFrames?: number};

/** A LowerThird (or any scene) layered on top of its parent scene. */
export type OverlaySpec = {
  [K in SceneType]: {type: K; from: number; durationInFrames: number; props: ScenePropsOf<K>};
}[SceneType];

/** One entry in a video. This is the JSON an agent writes. */
export type SceneSpec = {
  [K in SceneType]: {
    type: K;
    durationInFrames?: number;
    props: ScenePropsOf<K>;
    /** Branded transition into the NEXT scene, centred on the cut. */
    transition?: TransitionSpec;
    overlays?: OverlaySpec[];
    /** Override the corner bug for this scene (default: per scene type). */
    bug?: boolean;
  };
}[SceneType];

export type VideoSpec = {
  scenes: SceneSpec[];
  /** Corner logo bug. On by default in 16:9, off in 9:16 (platform UI covers the corners). `false` disables it. */
  bug?: false | BugOptions;
  /** Review aid: shade platform-UI zones and outline the safe box. Leave off for final renders. */
  guides?: boolean;
  /** Voiceover + background music (files in /public). */
  audio?: AudioSpec;
  /** Burned-in captions for the whole video, from a timestamp file or inline cues. */
  captions?: CaptionsSpec;
};

/** Async prep for calculateMetadata: loads captions and sizes the video to its scenes. */
export const prepareVideo = async (props: VideoSpec, fps: number) => {
  const captions = await resolveCaptions(props.captions, props.audio, fps);
  const durationInFrames = Math.max(1, totalDuration(props.scenes));
  const lastCue = captions?.resolved?.[captions.resolved.length - 1];
  if (lastCue && lastCue.to > durationInFrames) {
    console.warn(`Captions run to frame ${lastCue.to} but the scenes end at ${durationInFrames}: lengthen the scenes or the voiceover will be cut.`);
  }
  return {durationInFrames, props: {...props, captions}};
};

export const sceneDuration = (s: {type: SceneType; durationInFrames?: number}) =>
  s.durationInFrames ?? sceneRegistry[s.type].defaultDuration;

export const totalDuration = (scenes: SceneSpec[]) => scenes.reduce((sum, s) => sum + sceneDuration(s), 0);

const render = (type: SceneType, props: object, durationInFrames: number) => {
  const Comp = sceneRegistry[type].component as React.FC<Record<string, unknown>>;
  return <Comp {...props} durationInFrames={durationInFrames} />;
};

/** Plays scenes back to back; overlays and transitions are layered on top. */
export const SceneSequence: React.FC<VideoSpec> = ({scenes, bug: bugProp, guides = false, audio, captions}) => {
  const {vertical} = useLayout();
  const bug = bugProp ?? (vertical ? false : {});
  const base: React.ReactNode[] = [];
  const bugs: React.ReactNode[] = [];
  const overlays: React.ReactNode[] = [];
  const transitions: React.ReactNode[] = [];
  let at = 0;

  scenes.forEach((s, i) => {
    const dur = sceneDuration(s);
    base.push(
      <Sequence key={`s${i}`} from={at} durationInFrames={dur} name={`${i + 1}. ${s.type}`}>
        {render(s.type, s.props, dur)}
      </Sequence>,
    );
    s.overlays?.forEach((o, j) => {
      overlays.push(
        <Sequence key={`o${i}-${j}`} from={at + o.from} durationInFrames={o.durationInFrames} name={`↳ ${o.type}`}>
          {render(o.type, o.props, o.durationInFrames)}
        </Sequence>,
      );
    });
    const showBug = bug !== false && (s.bug ?? sceneRegistry[s.type].bug);
    if (showBug) {
      const theme = ((s.props as {theme?: ThemeMode}).theme ?? sceneRegistry[s.type].defaultTheme) as ThemeMode;
      bugs.push(
        <Sequence key={`b${i}`} from={at} durationInFrames={dur} name="◦ bug" layout="none">
          <CornerBug {...bug} theme={theme} durationInFrames={dur} />
        </Sequence>,
      );
    }
    at += dur;
    if (s.transition && i < scenes.length - 1) {
      const {durationInFrames: td = 30, ...tprops} = s.transition;
      transitions.push(
        <Sequence key={`t${i}`} from={at - Math.floor(td / 2)} durationInFrames={td} name={`⇄ ${tprops.style ?? 'wipe'}`}>
          {render('Transition', tprops, td)}
        </Sequence>,
      );
    }
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#041a14'}}>
      {base}
      {overlays}
      {bugs}
      {transitions}
      {captions?.resolved?.length ? <CaptionTrack durationInFrames={at} cues={captions.resolved} position={captions.position} /> : null}
      {audio ? <Soundtrack audio={audio} cues={captions?.resolved} durationInFrames={at} /> : null}
      {guides ? <SafeZoneGuides /> : null}
    </AbsoluteFill>
  );
};

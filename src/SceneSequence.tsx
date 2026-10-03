import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {CornerBug, BugOptions} from './brand/CornerBug';
import {assetSrc, AudioSpec, CaptionsSpec, resolveAudio, resolveCaptions, Soundtrack} from './audio';
import {FrameCue, parseCaptionFile, toFrameCues} from './lib/captions';
import {DEFAULT_START_SEC, narrationFile, narrationManifests, NarrationOptions, probeAudio, ResolvedNarration, TAIL_SEC} from './narration';
import {SafeZoneGuides} from './components/SafeZoneGuides';
import {CaptionTrack} from './scenes/CaptionTrack';
import {sceneRegistry, ScenePropsOf, SceneType, TransitionProps} from './scenes';
import {captionBand, ReservedBottom, ThemeMode, useLayout} from './theme';

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
  /**
   * Burned-in captions: a timestamp file or inline cues. When omitted, captions come from
   * per-segment narration timestamps (public/audio/<slug>/NN.json) if delivered. `false` = none.
   */
  captions?: CaptionsSpec | false;
  /** Narration manifest slug (narration/<slug>.json) or options. Audio: public/audio/<slug>/NN.mp3. */
  narration?: string | NarrationOptions;
  /** Filled in by prepareVideo; don't set by hand. */
  narrationResolved?: ResolvedNarration[];
};

const narrationOptions = (n: VideoSpec['narration']): NarrationOptions | null => (n ? (typeof n === 'string' ? {slug: n} : n) : null);

/** Loads delivered narration audio, stretches scenes to fit it, and places each segment. */
const resolveNarration = async (props: VideoSpec, fps: number) => {
  const opts = narrationOptions(props.narration);
  if (!opts) return {scenes: props.scenes, resolved: undefined, cues: [] as FrameCue[]};
  const manifest = narrationManifests[opts.slug];
  if (!manifest) throw new Error(`Narration manifest not found: narration/${opts.slug}.json`);
  const maxWords = props.captions ? props.captions.maxWords : undefined;

  const found = await Promise.all(
    manifest.segments.map(async (seg) => {
      const src = narrationFile(opts.slug, seg.scene);
      const audio = await probeAudio(assetSrc(src));
      let words: ReturnType<typeof parseCaptionFile> | undefined;
      if (audio.exists) {
        const ts = await fetch(assetSrc(narrationFile(opts.slug, seg.scene, 'json')));
        if (ts.ok) words = parseCaptionFile('segment.json', await ts.text(), maxWords);
      }
      return {seg, src, startSec: seg.startSec ?? DEFAULT_START_SEC, ...audio, words};
    }),
  );
  const missing = found.filter((f) => !f.exists).map((f) => narrationFile(opts.slug, f.seg.scene));
  if (missing.length) console.warn(`Narration: ${missing.length} segment(s) not delivered yet, rendering without them: ${missing.join(', ')}`);

  // Stretch scenes so no segment is cut off or runs into the next scene's narration.
  const scenes = props.scenes.map((s, i) => {
    const f = found.find((x) => x.seg.scene === i + 1 && x.duration);
    const need = f && f.duration ? Math.ceil((f.startSec + f.duration + TAIL_SEC) * fps) : 0;
    if (need <= sceneDuration(s)) return s;
    if (opts.fit === false) {
      console.warn(`Narration for scene ${i + 1} runs ${((need - sceneDuration(s)) / fps).toFixed(1)}s past the scene and will overlap the next.`);
      return s;
    }
    return {...s, durationInFrames: need};
  });

  const starts: number[] = [];
  scenes.reduce((at, s) => (starts.push(at), at + sceneDuration(s)), 0);
  const placed = found.filter((f) => f.exists && starts[f.seg.scene - 1] !== undefined);
  const resolved: ResolvedNarration[] = placed.map((f) => ({
    scene: f.seg.scene,
    src: f.src,
    from: starts[f.seg.scene - 1] + Math.round(f.startSec * fps),
    durationInFrames: f.duration ? Math.ceil(f.duration * fps) : undefined,
  }));
  const cues = placed.flatMap((f) => (f.words ? toFrameCues(f.words, fps, starts[f.seg.scene - 1] / fps + f.startSec) : []));
  return {scenes, resolved, cues};
};

/** Async prep for calculateMetadata: loads captions and sizes the video to its scenes. */
export const prepareVideo = async (props: VideoSpec, fps: number) => {
  const narration = await resolveNarration(props, fps);
  const audio = await resolveAudio(props.audio);
  let captions = props.captions === false ? undefined : await resolveCaptions(props.captions, props.audio, fps);
  if (props.captions !== false && !captions?.resolved?.length && narration.cues.length) captions = {...(captions ?? {}), resolved: narration.cues};
  const durationInFrames = Math.max(1, totalDuration(narration.scenes));
  const lastCue = captions?.resolved?.[captions.resolved.length - 1];
  if (lastCue && lastCue.to > durationInFrames) {
    console.warn(`Captions run to frame ${lastCue.to} but the scenes end at ${durationInFrames}: lengthen the scenes or the voiceover will be cut.`);
  }
  const outCaptions: VideoSpec['captions'] = props.captions === false ? false : captions;
  const out: VideoSpec = {...props, scenes: narration.scenes, audio, captions: outCaptions, narrationResolved: narration.resolved};
  return {durationInFrames, props: out};
};

export const sceneDuration = (s: {type: SceneType; durationInFrames?: number}) =>
  s.durationInFrames ?? sceneRegistry[s.type].defaultDuration;

export const totalDuration = (scenes: SceneSpec[]) => scenes.reduce((sum, s) => sum + sceneDuration(s), 0);

const render = (type: SceneType, props: object, durationInFrames: number) => {
  const Comp = sceneRegistry[type].component as React.FC<Record<string, unknown>>;
  return <Comp {...props} durationInFrames={durationInFrames} />;
};

/** Plays scenes back to back; overlays and transitions are layered on top. */
export const SceneSequence: React.FC<VideoSpec> = ({scenes, bug: bugProp, guides = false, audio, captions: captionsProp, narration, narrationResolved}) => {
  const captions = captionsProp || undefined;
  const narrationVolume = narrationOptions(narration)?.volume ?? 1;
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
      {/* Scenes lay out above the caption band when captions are burned in. */}
      <ReservedBottom.Provider value={captions?.resolved?.length ? captionBand(vertical) : 0}>
        {base}
        {overlays}
        {bugs}
      </ReservedBottom.Provider>
      {transitions}
      {captions?.resolved?.length ? <CaptionTrack durationInFrames={at} cues={captions.resolved} position={captions.position} /> : null}
      {narrationResolved?.map((n) => (
        <Sequence key={`n${n.scene}`} from={n.from} layout="none" name={`♪ narration ${String(n.scene).padStart(2, '0')}`}>
          <Audio src={assetSrc(n.src)} volume={narrationVolume} />
        </Sequence>
      ))}
      {audio ? (
        <Soundtrack
          audio={audio}
          cues={captions?.resolved}
          speech={narrationResolved?.map((n) => [n.from, n.from + (n.durationInFrames ?? 0)] as [number, number])}
          durationInFrames={at}
        />
      ) : null}
      {guides ? <SafeZoneGuides /> : null}
    </AbsoluteFill>
  );
};

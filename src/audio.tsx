import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {FrameCue, parseCaptionFile, SecondsCue, toFrameCues} from './lib/captions';
import {ease} from './lib/motion';

/** Paths are relative to /public (e.g. 'audio/ep14-voiceover.mp3') or full https URLs. */
export const assetSrc = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

export type AudioTrack = {
  src: string;
  /** 0–1+. Voiceover default 1. */
  volume?: number;
  /** Seconds into the video where the track starts. Default 0. */
  startAt?: number;
  /** Seconds to skip at the start of the file. Default 0. */
  trimStart?: number;
};

export type MusicTrack = AudioTrack & {
  /** Level while nobody is speaking. Default 0.22. */
  volume?: number;
  /** Level under the voice (needs captions for timing). Default 0.07. */
  duckTo?: number;
  /** Loop if shorter than the video. Default true. */
  loop?: boolean;
  /** Seconds. Defaults 1 and 2. */
  fadeIn?: number;
  fadeOut?: number;
};

export type CaptionsSpec = {
  /** Timestamp file in /public: .srt, .vtt, or word-level .json (Whisper, ElevenLabs, AssemblyAI, Deepgram…). */
  src?: string;
  /** Or inline cues, in seconds. */
  cues?: SecondsCue[];
  /**
   * Seconds added to every timestamp. Defaults to the voiceover's
   * `startAt − trimStart`, so timestamps relative to the voiceover file line up.
   */
  offset?: number;
  position?: 'lower' | 'middle' | 'upper';
  /** Max words on screen at once: groups word-level timestamps (default 6) and splits long SRT/VTT sentences (default 7). */
  maxWords?: number;
  /** Filled in at render time from `src`/`cues`; don't set by hand. */
  resolved?: FrameCue[];
};

export type AudioSpec = {voiceover?: AudioTrack; music?: MusicTrack};

/** Drops audio tracks whose files haven't been delivered yet (with a warning) so previews still render. */
export const resolveAudio = async (audio: AudioSpec | undefined): Promise<AudioSpec | undefined> => {
  if (!audio) return audio;
  const out: AudioSpec = {...audio};
  for (const key of ['voiceover', 'music'] as const) {
    const track = audio[key];
    if (!track) continue;
    const res = await fetch(assetSrc(track.src), {method: 'HEAD'});
    if (!res.ok) {
      console.warn(`Audio: ${key} file ${track.src} not found (HTTP ${res.status}); rendering without it.`);
      delete out[key];
    }
  }
  return out.voiceover || out.music ? out : undefined;
};

/** Loads and converts captions once, before rendering (called from calculateMetadata). */
export const resolveCaptions = async (captions: CaptionsSpec | undefined, audio: AudioSpec | undefined, fps: number) => {
  if (!captions || (!captions.src && !captions.cues)) return captions;
  const vo = audio?.voiceover;
  const offset = captions.offset ?? (vo?.startAt ?? 0) - (vo?.trimStart ?? 0);
  let cues = captions.cues ?? [];
  if (captions.src) {
    const res = await fetch(assetSrc(captions.src));
    if (!res.ok) throw new Error(`Could not load captions ${captions.src}: HTTP ${res.status}`);
    cues = parseCaptionFile(captions.src, await res.text(), captions.maxWords);
  }
  return {...captions, resolved: toFrameCues(cues, fps, offset)};
};

const ATTACK = 6;
const RELEASE = 15;

/** 0→1 "someone is speaking" envelope with soft attack/release around each spoken interval. */
const speechEnvelope = (intervals: [number, number][], f: number) => {
  let env = 0;
  for (const [a, b] of intervals) {
    if (f >= a && f <= b) return 1;
    if (f < a && f >= a - ATTACK) env = Math.max(env, ease.inOut((f - (a - ATTACK)) / ATTACK));
    if (f > b && f <= b + RELEASE) env = Math.max(env, ease.inOut(1 - (f - b) / RELEASE));
  }
  return env;
};

export const Soundtrack: React.FC<{audio: AudioSpec; cues?: FrameCue[]; speech?: [number, number][]; durationInFrames: number}> = ({audio, cues, speech, durationInFrames}) => {
  const {fps} = useVideoConfig();
  const {voiceover: vo, music} = audio;

  // Speech timing for ducking: caption word timings when available, else narration segment spans.
  const fromCues: [number, number][] = (cues ?? []).flatMap((c) => (c.words?.length ? c.words.map((w) => [w.from, w.to] as [number, number]) : [[c.from, c.to] as [number, number]]));
  const intervals = fromCues.length ? fromCues : (speech ?? []);

  const musicVolume = (f: number) => {
    if (!music) return 0;
    const base = music.volume ?? 0.22;
    const duck = music.duckTo ?? 0.07;
    const start = Math.round((music.startAt ?? 0) * fps);
    const len = durationInFrames - start;
    const fadeIn = Math.max(1, (music.fadeIn ?? 1) * fps);
    const fadeOut = Math.max(1, (music.fadeOut ?? 2) * fps);
    const fade = Math.min(
      interpolate(f, [0, fadeIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      interpolate(f, [len - fadeOut, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    );
    const level = intervals.length ? base + (duck - base) * speechEnvelope(intervals, f + start) : base;
    return level * fade;
  };

  return (
    <>
      {vo ? (
        <Sequence from={Math.round((vo.startAt ?? 0) * fps)} layout="none" name="♪ voiceover">
          <Audio src={assetSrc(vo.src)} volume={vo.volume ?? 1} trimBefore={Math.round((vo.trimStart ?? 0) * fps)} />
        </Sequence>
      ) : null}
      {music ? (
        <Sequence from={Math.round((music.startAt ?? 0) * fps)} layout="none" name="♪ music">
          {/* `extend`: the volume curve runs across loops (default `repeat` would re-fade at every loop point). */}
          <Audio src={assetSrc(music.src)} loop={music.loop ?? true} loopVolumeCurveBehavior="extend" volume={musicVolume} trimBefore={Math.round((music.trimStart ?? 0) * fps)} />
        </Sequence>
      ) : null}
    </>
  );
};

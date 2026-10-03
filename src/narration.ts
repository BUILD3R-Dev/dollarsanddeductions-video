import type {SceneType} from './scenes';

/**
 * Narration manifests: one JSON file per video in /narration/<slug>.json, paired
 * with the video spec /videos/<slug>.json. Audio for scene N (1-based) is
 * public/audio/<slug>/<NN>.mp3, generated outside the kit (ElevenLabs) and never
 * committed. See README → Narration.
 */
export type NarrationSegment = {
  /** 1-based scene number in the video spec; also the audio file name (3 → 03.mp3). */
  scene: number;
  /** Seconds from the start of that scene to the start of its audio. Default 0.3. */
  startSec?: number;
  /** Exactly what the voice says. Plain text: no *emphasis* markup. */
  text: string;
  /** Optional: the scene's type, checked against the spec to catch misnumbering. */
  type?: SceneType;
  /** Optional note for the voice generator (pronunciation, pacing). Not spoken. */
  note?: string;
};

export type NarrationVoice = {
  provider: 'elevenlabs';
  name?: string;
  voiceId: string;
  model: string;
  /** Passed through to the generator (e.g. ElevenLabs voice_settings). */
  settings?: Record<string, unknown>;
};

export type NarrationManifest = {
  /** Must equal the file's slug. */
  video: string;
  /** Video spec path relative to the repo root. Default videos/<slug>.json. */
  spec?: string;
  voice: NarrationVoice;
  segments: NarrationSegment[];
};

/** The channel voice. */
export const CHANNEL_VOICE: NarrationVoice = {
  provider: 'elevenlabs',
  name: 'Kallen',
  voiceId: 'Pi2Zqk51cRysbs4RoCCF',
  model: 'eleven_v4',
};

export const DEFAULT_START_SEC = 0.3;

export const narrationFile = (slug: string, scene: number, ext: 'mp3' | 'json' = 'mp3') =>
  `audio/${slug}/${String(scene).padStart(2, '0')}.${ext}`;

// Every manifest in /narration is bundled, so specs can refer to them by slug.
const ctx = require.context('../narration', false, /\.json$/);
export const narrationManifests: Record<string, NarrationManifest> = Object.fromEntries(
  ctx.keys().map((k) => [k.replace(/^\.\//, '').replace(/\.json$/, ''), ctx<NarrationManifest>(k)]),
);

// ---------------------------------------------------------------------------
// Render-time resolution (runs in calculateMetadata, in the browser).
// ---------------------------------------------------------------------------

/** Seconds of air left after a segment when a scene is stretched to fit it. */
export const TAIL_SEC = 0.5;

export type NarrationOptions = {
  slug: string;
  /** Default 1. */
  volume?: number;
  /** Stretch scenes whose narration runs longer than the scene. Default true. */
  fit?: boolean;
};

/** Where each delivered segment plays, in absolute frames. Filled in by prepareVideo. */
export type ResolvedNarration = {scene: number; src: string; from: number; durationInFrames?: number};

/** Fetches an audio file and measures it. `exists: false` when it hasn't been delivered yet. */
export const probeAudio = async (url: string): Promise<{exists: boolean; duration: number | null}> => {
  const res = await fetch(url);
  if (!res.ok) return {exists: false, duration: null};
  try {
    const ctx = new OfflineAudioContext(1, 1, 44100);
    const decoded = await ctx.decodeAudioData(await res.arrayBuffer());
    return {exists: true, duration: decoded.duration};
  } catch {
    return {exists: true, duration: null};
  }
};

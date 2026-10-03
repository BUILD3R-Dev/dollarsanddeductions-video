/**
 * Caption timestamp parsing. Times are seconds until `toFrameCues` converts them.
 *
 * Accepted inputs:
 *  - SRT / WebVTT: phrase-level cues; words inside a cue are spread evenly.
 *  - Word-level JSON (best sync): an array of words, or an object containing one, from
 *    Whisper (`segments[].words[]` with `word,start,end`), ElevenLabs (`words[]` with
 *    `text,start,end`), AssemblyAI (`words[]` with `text,start,end` in **ms**),
 *    Deepgram (`results.channels[0].alternatives[0].words[]`), ElevenLabs text-to-speech
 *    "with timestamps" (`alignment.characters` + character start/end times), or our own
 *    `[{text, start, end}]`. Milliseconds are detected and converted.
 */

export type TimedWord = {text: string; start: number; end: number};
export type SecondsCue = {text: string; start: number; end: number; words?: TimedWord[]};

const tc = (s: string) => {
  // 00:01:02,345 | 00:01:02.345 | 01:02.345
  const m = s.trim().match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)/);
  if (!m) throw new Error(`Bad timestamp: ${s}`);
  const [, h = '0', mi, se, ms] = m;
  return Number(h) * 3600 + Number(mi) * 60 + Number(se) + Number(ms.padEnd(3, '0').slice(0, 3)) / 1000;
};

/** SRT and WebVTT (cue settings, identifiers, NOTE/STYLE blocks and tags are ignored). */
export const parseSubtitles = (src: string): SecondsCue[] =>
  src
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((block) => block.split('\n').filter(Boolean))
    .map((lines) => {
      const i = lines.findIndex((l) => l.includes('-->'));
      if (i < 0) return null;
      const [a, b] = lines[i].split('-->');
      const text = lines
        .slice(i + 1)
        .join(' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return text ? {text, start: tc(a), end: tc(b.trim().split(/\s+/)[0])} : null;
    })
    .filter((c): c is SecondsCue => c !== null);

type RawWord = {word?: string; text?: string; punctuated_word?: string; start?: number; end?: number; type?: string};

type CharAlignment = {characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[]};

/** ElevenLabs TTS returns per-character timings; rebuild words by splitting on whitespace. */
const wordsFromChars = (a: CharAlignment): RawWord[] => {
  const out: RawWord[] = [];
  let text = '';
  let start = 0;
  let end = 0;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (text) out.push({text, start, end});
      text = '';
      return;
    }
    if (!text) start = a.character_start_times_seconds[i];
    text += ch;
    end = a.character_end_times_seconds[i];
  });
  if (text) out.push({text, start, end});
  return out;
};

const findWords = (data: unknown): RawWord[] => {
  if (Array.isArray(data)) {
    if (data.length && typeof data[0] === 'object' && data[0] && 'words' in data[0]) return data.flatMap((s: {words: RawWord[]}) => s.words);
    return data as RawWord[];
  }
  const d = data as Record<string, unknown>;
  const align = (d.alignment ?? d.normalized_alignment ?? (d.characters ? d : undefined)) as CharAlignment | undefined;
  if (align?.characters) return wordsFromChars(align);
  if (Array.isArray(d.words)) return d.words as RawWord[];
  if (Array.isArray(d.segments)) return (d.segments as {words?: RawWord[]}[]).flatMap((s) => s.words ?? []);
  const dg = (d.results as {channels?: {alternatives?: {words?: RawWord[]}[]}[]})?.channels?.[0]?.alternatives?.[0]?.words;
  if (dg) return dg;
  throw new Error('No word timestamps found in caption JSON');
};

/** Word-level timestamps from common TTS / transcription JSON shapes. */
export const parseWordJson = (src: string): TimedWord[] => {
  const raw = findWords(JSON.parse(src)).filter((w) => w.type === undefined || w.type === 'word');
  const words = raw
    .map((w) => ({text: (w.punctuated_word ?? w.word ?? w.text ?? '').trim(), start: Number(w.start), end: Number(w.end)}))
    .filter((w) => w.text && Number.isFinite(w.start) && Number.isFinite(w.end));
  // AssemblyAI and some others use milliseconds.
  const ms = words.length > 0 && words[words.length - 1].end > 3600;
  return ms ? words.map((w) => ({...w, start: w.start / 1000, end: w.end / 1000})) : words;
};

/**
 * Group words into caption cues: break on sentence punctuation, on pauses, or at
 * `maxWords`; commas break once a cue has a few words.
 */
export const groupWords = (words: TimedWord[], maxWords = 6, pause = 0.45): SecondsCue[] => {
  const cues: SecondsCue[] = [];
  let cur: TimedWord[] = [];
  const flush = () => {
    if (cur.length) cues.push({text: cur.map((w) => w.text).join(' '), start: cur[0].start, end: cur[cur.length - 1].end, words: cur});
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    if (/[.?!]["')\]]?$/.test(w.text) || gap > pause || cur.length >= maxWords || (/[,;:—–]$/.test(w.text) && cur.length >= 3)) flush();
  });
  flush();
  // Keep each cue on screen until the next starts (no flicker in short gaps).
  return cues.map((c, i) => ({...c, end: cues[i + 1] && cues[i + 1].start - c.end < 0.6 ? cues[i + 1].start : c.end + 0.25}));
};

/**
 * Split long phrase-level cues (SRT/VTT sentences) into on-screen chunks of ≤ maxWords,
 * preferring breaks after punctuation. Time is shared in proportion to characters.
 * Only the burned-in captions are chunked; the subtitle file itself is untouched.
 */
export const splitLongCues = (cues: SecondsCue[], maxWords = 7): SecondsCue[] =>
  cues.flatMap((c) => {
    const words = c.text.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return [c];
    const chunks: string[][] = [];
    let cur: string[] = [];
    words.forEach((w, i) => {
      cur.push(w);
      const left = words.length - i - 1;
      const punct = /[,;:.?!—–]$/.test(w) && cur.length >= 3 && left >= 2;
      if (cur.length >= maxWords || punct) {
        chunks.push(cur);
        cur = [];
      }
    });
    if (cur.length) {
      // Avoid a dangling 1–2 word tail: merge it back if the previous chunk has room.
      if (cur.length <= 2 && chunks.length && chunks[chunks.length - 1].length + cur.length <= maxWords + 2) chunks[chunks.length - 1].push(...cur);
      else chunks.push(cur);
    }
    const weights = chunks.map((ch) => ch.join(' ').length);
    const total = weights.reduce((a, b) => a + b, 0);
    let t = c.start;
    return chunks.map((ch, i) => {
      const end = i === chunks.length - 1 ? c.end : t + ((c.end - c.start) * weights[i]) / total;
      const cue = {text: ch.join(' '), start: t, end};
      t = end;
      return cue;
    });
  });

/** Detect the format from the file name (or content) and return cues in seconds. */
export const parseCaptionFile = (name: string, src: string, maxWords?: number): SecondsCue[] => {
  const trimmed = src.trim();
  if (/\.json$/i.test(name) || trimmed.startsWith('[') || trimmed.startsWith('{')) return groupWords(parseWordJson(src), maxWords);
  return splitLongCues(parseSubtitles(src), maxWords ?? 7);
};

export type FrameCue = {text: string; from: number; to: number; words?: {from: number; to: number}[]};

/** Seconds → frames, applying an offset (e.g. the voiceover starts 0.5s into the video). */
export const toFrameCues = (cues: SecondsCue[], fps: number, offset = 0): FrameCue[] =>
  cues.map((c) => ({
    text: c.text,
    from: Math.round((c.start + offset) * fps),
    to: Math.round((c.end + offset) * fps),
    words: c.words?.map((w) => ({from: Math.round((w.start + offset) * fps), to: Math.round((w.end + offset) * fps)})),
  }));

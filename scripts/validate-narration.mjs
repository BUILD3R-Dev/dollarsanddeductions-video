#!/usr/bin/env node
// Validates narration manifests against their video specs before any voice credits are spent.
//
//   node scripts/validate-narration.mjs <slug | path/to/manifest.json> [...]
//   node scripts/validate-narration.mjs --all
//
// Exit code 1 if any manifest has errors. Warnings never fail.
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {basename, join, resolve} from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FPS = 30;
const MONTHLY_QUOTA = 90_000; // ElevenLabs characters per month on the current plan
const WORDS_PER_SEC = 2.5; // ~150 wpm, typical for the channel voice; used only for overrun estimates
const DEFAULT_START_SEC = 0.3; // keep in sync with src/narration.ts
const CHANNEL_VOICE_ID = 'Pi2Zqk51cRysbs4RoCCF';
const CHANNEL_MODEL = 'eleven_v4';

// Scene default durations, read from the registry so this never drifts from the kit.
const registrySrc = readFileSync(join(ROOT, 'src/scenes/index.ts'), 'utf8');
const DEFAULT_FRAMES = Object.fromEntries([...registrySrc.matchAll(/(\w+): \{component: \w+, defaultDuration: (\d+)/g)].map((m) => [m[1], Number(m[2])]));

const c = process.stdout.isTTY ? {red: (s) => `\x1b[31m${s}\x1b[0m`, yel: (s) => `\x1b[33m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m`, grn: (s) => `\x1b[32m${s}\x1b[0m`} : {red: String, yel: String, dim: String, grn: String};
const fmt = (n) => n.toLocaleString('en-US');

const parseTime = (t) => {
  const m = t.trim().match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)/);
  if (!m) throw new Error(`bad timestamp "${t}"`);
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, '0').slice(0, 3)) / 1000;
};
/** Minimal SRT/VTT reader: [{start, end, text}] in seconds. */
const parseSubs = (src) =>
  src
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((b) => b.split('\n').filter(Boolean))
    .map((lines) => {
      const i = lines.findIndex((l) => l.includes('-->'));
      if (i < 0) return null;
      const [a, b] = lines[i].split('-->');
      return {start: parseTime(a), end: parseTime(b.trim().split(/\s+/)[0]), text: lines.slice(i + 1).join(' ').trim()};
    })
    .filter(Boolean);
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const readJson = (p, what) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    throw new Error(`${what} ${p}: ${e.code === 'ENOENT' ? 'not found' : e.message}`);
  }
};

function validate(manifestPath) {
  const slug = basename(manifestPath).replace(/\.json$/, '');
  const errors = [];
  const warnings = [];
  const m = readJson(manifestPath, 'Manifest');

  if (m.video !== slug) errors.push(`"video" is ${JSON.stringify(m.video)} but the file slug is "${slug}"`);
  if (!m.voice?.voiceId || !m.voice?.model) errors.push('"voice" needs voiceId and model');
  else if (m.voice.voiceId !== CHANNEL_VOICE_ID || m.voice.model !== CHANNEL_MODEL) warnings.push(`voice ${m.voice.voiceId}/${m.voice.model} is not the channel voice (${CHANNEL_VOICE_ID}/${CHANNEL_MODEL})`);

  const specPath = join(ROOT, m.spec ?? `videos/${slug}.json`);
  const spec = readJson(specPath, 'Video spec');
  const scenes = spec.scenes ?? [];
  if (!scenes.length) errors.push(`${specPath} has no scenes`);
  if (spec.narration !== undefined && (typeof spec.narration === 'string' ? spec.narration : spec.narration.slug) !== slug)
    errors.push(`video spec points at narration "${typeof spec.narration === 'string' ? spec.narration : spec.narration.slug}", not "${slug}"`);
  if (spec.narration === undefined) warnings.push(`video spec has no "narration": "${slug}", so the audio won't play`);

  const segs = Array.isArray(m.segments) ? m.segments : (errors.push('"segments" must be an array'), []);
  const byScene = new Map();
  const rows = [];
  segs.forEach((s, i) => {
    const at = `segment ${i + 1}`;
    if (!Number.isInteger(s.scene) || s.scene < 1 || s.scene > scenes.length) {
      errors.push(`${at}: "scene" must be 1–${scenes.length} (got ${JSON.stringify(s.scene)})`);
      return;
    }
    if (byScene.has(s.scene)) errors.push(`${at}: scene ${s.scene} already has a segment (one per scene)`);
    byScene.set(s.scene, s);
    const sc = scenes[s.scene - 1];
    const sceneSec = (sc.durationInFrames ?? DEFAULT_FRAMES[sc.type] ?? 0) / FPS;
    if (s.type !== undefined && s.type !== sc.type) errors.push(`${at}: type "${s.type}" but scene ${s.scene} is ${sc.type}: check the numbering`);
    const text = typeof s.text === 'string' ? s.text.trim() : '';
    if (!text) errors.push(`${at} (scene ${s.scene}): text is empty`);
    const start = s.startSec ?? DEFAULT_START_SEC;
    if (typeof start !== 'number' || start < 0) errors.push(`${at}: startSec must be a number ≥ 0`);
    else if (start >= sceneSec) errors.push(`${at}: startSec ${start}s is past the end of scene ${s.scene} (${sceneSec.toFixed(1)}s)`);
    if (/[*_<>{}[\]#]/.test(text)) warnings.push(`${at}: text contains markup characters (* _ < > # …) that the voice may read aloud`);
    const words = text.split(/\s+/).filter(Boolean).length;
    const estSec = words / WORDS_PER_SEC;
    if (start + estSec > sceneSec + 0.25)
      warnings.push(`scene ${s.scene} (${sc.type}): ~${estSec.toFixed(1)}s of speech + ${start}s lead-in vs ${sceneSec.toFixed(1)}s scene; it will be stretched ~${(start + estSec + 0.5 - sceneSec).toFixed(1)}s at render`);
    const file = join(ROOT, 'public', `audio/${slug}/${String(s.scene).padStart(2, '0')}.mp3`);
    rows.push({scene: s.scene, type: sc.type, chars: text.length, sceneSec, estSec, audio: existsSync(file)});
  });
  scenes.forEach((sc, i) => {
    if (!byScene.has(i + 1)) errors.push(`scene ${i + 1} (${sc.type}) has no narration segment`);
  });

  const audioDir = join(ROOT, 'public/audio', slug);
  if (existsSync(audioDir)) {
    const extra = readdirSync(audioDir).filter((f) => /^\d+\.mp3$/.test(f) && !byScene.has(Number(f.slice(0, -4))));
    if (extra.length) warnings.push(`public/audio/${slug}/ has mp3s with no segment: ${extra.join(', ')}`);
  }

  // Spec timeline: where each segment's voice starts (scene start + startSec). After
  // `npm run narration:fit` this is the exact render timeline.
  const sceneStart = [];
  scenes.reduce((at, sc) => (sceneStart.push(at), at + (sc.durationInFrames ?? DEFAULT_FRAMES[sc.type] ?? 0) / FPS), 0);
  const videoEnd = scenes.reduce((n, sc) => n + (sc.durationInFrames ?? DEFAULT_FRAMES[sc.type] ?? 0) / FPS, 0);
  const notes = [];
  const unfitted = segs.filter((s) => s.startSec === undefined).length;
  if (unfitted && rows.some((r) => r.audio)) warnings.push(`${unfitted} segment(s) have no explicit startSec: run \`npm run narration:fit -- ${slug}\` after the mp3s land`);

  // Captions
  if (spec.captions === false) notes.push('captions: off');
  else if (!spec.captions?.src) warnings.push(`no "captions": {"src": "captions/${slug}.srt"} in the spec`);
  else {
    const capPath = join(ROOT, 'public', spec.captions.src);
    if (!existsSync(capPath)) warnings.push(`captions file public/${spec.captions.src} not delivered yet`);
    else if (/\.(srt|vtt)$/i.test(capPath)) {
      const cues = parseSubs(readFileSync(capPath, 'utf8'));
      if (!cues.length) errors.push(`captions file public/${spec.captions.src} has no cues`);
      cues.forEach((c, i) => {
        if (!(c.end > c.start)) errors.push(`captions cue ${i + 1} ends before it starts`);
        if (!c.text) errors.push(`captions cue ${i + 1} has no text`);
        if (i && c.start < cues[i - 1].end - 0.001) errors.push(`captions cue ${i + 1} overlaps cue ${i}`);
      });
      if (cues.length && cues[cues.length - 1].end > videoEnd + 0.05) errors.push(`captions run to ${cues[cues.length - 1].end.toFixed(2)}s but the video ends at ${videoEnd.toFixed(2)}s`);
      // Sync: match cues to segments by text; each segment's first cue should start with its voice.
      let ci = 0;
      let checked = 0;
      let worst = 0;
      for (const seg of [...segs].sort((a, b) => a.scene - b.scene)) {
        const text = norm(seg.text ?? '');
        let pos = 0;
        let first = null;
        while (ci < cues.length) {
          const k = text.indexOf(norm(cues[ci].text), pos);
          if (k < 0) break;
          if (first === null) first = cues[ci].start;
          pos = k + norm(cues[ci].text).length;
          ci++;
        }
        if (first === null) continue;
        checked++;
        const expect = sceneStart[seg.scene - 1] + (seg.startSec ?? DEFAULT_START_SEC);
        const off = first - expect;
        worst = Math.max(worst, Math.abs(off));
        if (Math.abs(off) > 0.25) errors.push(`captions out of sync at scene ${seg.scene}: first caption at ${first.toFixed(2)}s, voice starts at ${expect.toFixed(2)}s (${off > 0 ? '+' : ''}${off.toFixed(2)}s). Re-time the SRT to the fitted spec`);
      }
      notes.push(`captions: ${cues.length} cues, ${checked}/${segs.length} segments matched by text, worst start offset ${worst.toFixed(2)}s`);
      if (checked < segs.length) warnings.push(`captions text matches only ${checked}/${segs.length} segments; sync not checked for the rest`);
    }
  }

  // Music
  for (const key of ['voiceover', 'music']) {
    const t = spec.audio?.[key];
    if (!t?.src) continue;
    const ok = /^https?:/.test(t.src) || existsSync(join(ROOT, 'public', t.src));
    if (ok) notes.push(`${key}: public/${t.src} ✓`);
    else warnings.push(`${key} file public/${t.src} not delivered yet (renders skip it with a warning)`);
  }

  const chars = rows.reduce((n, r) => n + r.chars, 0);
  console.log(`\n${c.dim('narration/')}${slug}.json  →  ${c.dim(specPath.replace(ROOT + '/', ''))}  (${scenes.length} scenes)`);
  for (const r of rows.sort((a, b) => a.scene - b.scene)) {
    console.log(`  ${String(r.scene).padStart(2, '0')}  ${r.type.padEnd(14)} ${fmt(r.chars).padStart(5)} chars  ~${r.estSec.toFixed(1)}s / ${r.sceneSec.toFixed(1)}s scene  ${r.audio ? c.grn('mp3 ✓') : c.dim('mp3 missing')}`);
  }
  notes.forEach((n) => console.log(`  ${c.dim(n)}`));
  console.log(`  Total: ${fmt(chars)} characters (${((100 * chars) / MONTHLY_QUOTA).toFixed(1)}% of the ${fmt(MONTHLY_QUOTA)}/mo ElevenLabs quota)`);
  warnings.forEach((w) => console.log(`  ${c.yel('warn')}  ${w}`));
  errors.forEach((e) => console.log(`  ${c.red('error')} ${e}`));
  if (!errors.length) console.log(`  ${c.grn('OK')}`);
  return {errors: errors.length, chars};
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: node scripts/validate-narration.mjs <slug | manifest.json> [...] | --all');
  process.exit(2);
}
const paths = args.includes('--all')
  ? readdirSync(join(ROOT, 'narration'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(ROOT, 'narration', f))
  : args.map((a) => (a.endsWith('.json') ? resolve(a) : join(ROOT, 'narration', `${a}.json`)));

let failed = 0;
let total = 0;
for (const p of paths) {
  try {
    const r = validate(p);
    failed += r.errors ? 1 : 0;
    total += r.chars;
  } catch (e) {
    failed++;
    console.log(`\n${c.red('error')} ${e.message}`);
  }
}
if (paths.length > 1) console.log(`\nAll manifests: ${fmt(total)} characters (${((100 * total) / MONTHLY_QUOTA).toFixed(1)}% of ${fmt(MONTHLY_QUOTA)}/mo). Regenerating a segment costs its characters again.`);
process.exit(failed ? 1 : 0);

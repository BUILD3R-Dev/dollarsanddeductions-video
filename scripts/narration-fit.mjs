#!/usr/bin/env node
// Bakes the delivered narration into the video's timeline so the spec IS the render timeline.
//
//   node scripts/narration-fit.mjs <slug> [--dry-run]
//
// Run once after the mp3s land in public/audio/<slug>/, before timing captions:
//  - measures every NN.mp3 (ffprobe bundled with Remotion);
//  - lengthens scenes in videos/<slug>.json that are shorter than startSec + audio + 0.5s
//    (never shortens), so nothing stretches at render time;
//  - writes an explicit startSec on every manifest segment (default 0.3 becomes visible).
// Then caption timestamps can be computed from the spec alone: scene start + startSec + offset in the segment.
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FPS = 30;
const DEFAULT_START_SEC = 0.3; // keep in sync with src/narration.ts
const TAIL_SEC = 0.5; // keep in sync with src/narration.ts
const SAFETY_FRAMES = 2; // decoders can report a slightly longer duration than ffprobe

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error('Usage: node scripts/narration-fit.mjs <slug> [--dry-run]');
  process.exit(2);
}
const dry = flags.includes('--dry-run');
const manifestPath = join(ROOT, 'narration', `${slug}.json`);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const specPath = join(ROOT, manifest.spec ?? `videos/${slug}.json`);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const remotion = join(ROOT, 'node_modules/.bin/remotion');

const duration = (file) =>
  Number(execFileSync(remotion, ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).trim());

let changed = 0;
let at = 0;
const rows = [];
for (const seg of manifest.segments) {
  if (seg.startSec === undefined) {
    seg.startSec = DEFAULT_START_SEC;
    changed++;
  }
}
spec.scenes.forEach((scene, i) => {
  const n = i + 1;
  const seg = manifest.segments.find((s) => s.scene === n);
  const file = join(ROOT, 'public/audio', slug, `${String(n).padStart(2, '0')}.mp3`);
  if (!seg || !existsSync(file)) {
    rows.push(`  ${String(n).padStart(2, '0')}  no audio, unchanged`);
    at += scene.durationInFrames;
    return;
  }
  const d = duration(file);
  const need = Math.ceil((seg.startSec + d + TAIL_SEC) * FPS) + SAFETY_FRAMES;
  const before = scene.durationInFrames;
  if (!before || need > before) {
    scene.durationInFrames = need;
    changed++;
  }
  rows.push(
    `  ${String(n).padStart(2, '0')}  starts ${(at / FPS).toFixed(2)}s  voice ${(at / FPS + seg.startSec).toFixed(2)}–${(at / FPS + seg.startSec + d).toFixed(2)}s  scene ${(before / FPS).toFixed(1)} → ${(scene.durationInFrames / FPS).toFixed(1)}s${scene.durationInFrames !== before ? '  (lengthened)' : ''}`,
  );
  at += scene.durationInFrames;
});

console.log(`${slug}: ${rows.length} scenes, timeline ${(at / FPS).toFixed(2)}s (${at} frames)`);
rows.forEach((r) => console.log(r));
if (dry) console.log('Dry run: nothing written.');
else if (changed) {
  writeFileSync(specPath, JSON.stringify(spec, null, 2) + '\n');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Wrote ${specPath.replace(ROOT + '/', '')} and ${manifestPath.replace(ROOT + '/', '')}.`);
} else console.log('Already fitted: nothing to change.');

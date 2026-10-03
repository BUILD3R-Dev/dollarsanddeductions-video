#!/usr/bin/env node
// The one command for a release render. Every final goes through all four steps:
//
//   node scripts/render-final.mjs <slug> [more slugs...]      (npm run final -- <slug>)
//
//   1. validate   narration manifest + spec (fails on errors: missing scenes, captions out of sync…)
//   2. render     videos/<slug>.json with its composition ("composition": "Short" for 9:16, else Episode)
//   3. normalise  final mix to -14 LUFS / -1 dBTP (scripts/finalize-audio.mjs)
//   4. report     duration, size, measured loudness
//
// Output: out/<slug>.mp4. Rendering straight to a temp file means a half-finished or
// un-normalised render never sits at the final path.
import {spawnSync} from 'node:child_process';
import {existsSync, readFileSync, renameSync, statSync, unlinkSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {finalize} from './finalize-audio.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node scripts/render-final.mjs <slug> [...]');
  process.exit(2);
}

const step = (label, cmd, args) => {
  console.log(`\n▸ ${label}`);
  const r = spawnSync(cmd, args, {cwd: ROOT, stdio: 'inherit'});
  if (r.status !== 0) throw new Error(`${label} failed (exit ${r.status})`);
};
const probeDuration = (file) => {
  const r = spawnSync(join(ROOT, 'node_modules/.bin/remotion'), ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'});
  return Number(r.stdout.trim());
};

const results = [];
for (const slug of slugs) {
  const specPath = join(ROOT, 'videos', `${slug}.json`);
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  const composition = spec.composition ?? 'Episode';
  const out = join(ROOT, 'out', `${slug}.mp4`);
  const tmp = join(ROOT, 'out', `${slug}.rendering.mp4`);
  try {
    if (existsSync(join(ROOT, 'narration', `${slug}.json`))) step(`validate ${slug}`, 'node', ['scripts/validate-narration.mjs', slug]);
    step(`render ${slug} (${composition})`, join(ROOT, 'node_modules/.bin/remotion'), ['render', composition, tmp, `--props=videos/${slug}.json`]);
    console.log(`\n▸ normalise ${slug} to -14 LUFS / -1 dBTP`);
    const n = finalize(tmp);
    renameSync(tmp, out);
    const r = {slug, file: `out/${slug}.mp4`, seconds: probeDuration(out), mb: statSync(out).size / 1e6, ...n};
    console.log(`  ${r.before.I} LUFS / ${r.before.TP} dBTP  ->  ${r.after.I} LUFS / ${r.after.TP} dBTP (LRA ${r.after.LRA} LU; ${r.mode})`);
    results.push(r);
  } catch (e) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.error(`\n✗ ${slug}: ${e.message}`);
    process.exitCode = 1;
  }
}

if (results.length) {
  console.log('\nFinal renders');
  for (const r of results) {
    const mm = Math.floor(r.seconds / 60);
    const ss = (r.seconds - mm * 60).toFixed(1).padStart(4, '0');
    console.log(`  ${r.file.padEnd(28)} ${mm}:${ss}  ${r.mb.toFixed(1)} MB  ${r.after.I} LUFS integrated, ${r.after.TP} dBTP true peak`);
  }
}

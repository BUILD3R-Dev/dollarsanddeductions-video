#!/usr/bin/env node
// Loudness-normalises a rendered video's final mix in place: EBU R128, -14 LUFS integrated,
// true peak <= -1 dBTP (YouTube's reference; it turns loud videos down but never quiet ones up).
//
//   node scripts/finalize-audio.mjs out/<slug>.mp4 [more.mp4 ...]
//
// Gain (through a look-ahead peak limiter when needed) + two-pass ffmpeg loudnorm in linear
// mode, video stream copied untouched, then an independent ebur128 measurement of the result. Exits 1 if the result
// misses the target (integrated outside ±0.5 LU, or true peak above -1 dBTP).
// Needs a full ffmpeg (with loudnorm/ebur128) on PATH or at FFMPEG; Remotion's bundled one lacks them.
import {spawnSync} from 'node:child_process';
import {existsSync, renameSync, statSync, unlinkSync} from 'node:fs';

const FFMPEG = process.env.FFMPEG || (existsSync('/usr/bin/ffmpeg') ? '/usr/bin/ffmpeg' : 'ffmpeg');
export const TARGET = {I: -14, TP: -1, LRA: 11};

const runErr = (args) => {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-nostats', ...args], {encoding: 'utf8', maxBuffer: 64 << 20});
  if (r.status !== 0) throw new Error(`ffmpeg failed (${r.status}): ${r.stderr.split('\n').slice(-8).join('\n')}`);
  return r.stderr;
};
const lastJson = (text) => JSON.parse(text.slice(text.lastIndexOf('{'), text.lastIndexOf('}') + 1));

/** Integrated loudness, LRA and true peak via ebur128 (independent of loudnorm). */
export const measure = (file) => {
  const out = runErr(['-i', file, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-']);
  const summary = out.slice(out.lastIndexOf('Summary:'));
  const num = (re) => Number(summary.match(re)?.[1]);
  return {I: num(/I:\s+(-?[\d.]+) LUFS/), LRA: num(/LRA:\s+(-?[\d.]+) LU/), TP: num(/True peak:\s+Peak:\s+(-?[\d.]+) dBFS/)};
};

// loudnorm targets a little below the delivered limit: AAC encoding adds small inter-sample overshoots.
const TP_INTERNAL = TARGET.TP - 0.5;
const db2lin = (db) => Math.pow(10, db / 20);

export const finalize = (file) => {
  const {I, LRA} = TARGET;
  const before = measure(file);
  const tmpWav = file.replace(/\.mp4$/, '.prelimit.tmp.wav');
  const tmp = file.replace(/\.mp4$/, '.loudnorm.tmp.mp4');
  const loudnorm = (extra) => `loudnorm=I=${I}:TP=${TP_INTERNAL}:LRA=${LRA}${extra}:print_format=json`;
  try {
    // 1. Measure.
    const m1 = lastJson(runErr(['-i', file, '-map', '0:a:0', '-af', loudnorm(''), '-f', 'null', '-']));
    const gain = I - Number(m1.input_i);
    // 2. If a straight gain would push peaks past the limit, pre-apply the gain through a
    //    fast look-ahead limiter so only the rare peaks are caught; the loudness then comes
    //    from one fixed gain (loudnorm "linear" mode), which keeps the mix's dynamics intact.
    let src = file;
    let stage = 'gain only';
    let m2 = m1;
    if (Number(m1.input_tp) + gain > TP_INTERNAL) {
      // Limiting costs loudness, so add it back and limit again until the result sits at the
      // target with true-peak headroom for a final fixed (linear) gain. Converges in 1–3 passes.
      let g = gain;
      for (let pass = 0; pass < 4; pass++) {
        runErr(['-y', '-i', file, '-map', '0:a:0', '-af', `volume=${g.toFixed(2)}dB,alimiter=limit=${db2lin(TP_INTERNAL - 0.7).toFixed(4)}:attack=5:release=50:level=disabled`, '-c:a', 'pcm_s24le', tmpWav]);
        m2 = lastJson(runErr(['-i', tmpWav, '-af', loudnorm(''), '-f', 'null', '-']));
        const residual = I - Number(m2.input_i);
        if (Number(m2.input_tp) + residual <= TP_INTERNAL - 0.1) break;
        g += residual;
      }
      src = tmpWav;
      stage = `+${g.toFixed(1)} dB through a look-ahead peak limiter`;
    }
    // 3. Second loudnorm pass, linear: a single fixed gain using the measurements of `src`.
    const af = loudnorm(`:measured_I=${m2.input_i}:measured_TP=${m2.input_tp}:measured_LRA=${m2.input_lra}:measured_thresh=${m2.input_thresh}:offset=${m2.target_offset}:linear=true`);
    const inputs = src === file ? ['-i', file] : ['-i', file, '-i', src];
    const audioMap = src === file ? '0:a:0' : '1:a:0';
    const applied = lastJson(
      runErr(['-y', ...inputs, '-map', '0:v:0', '-map', audioMap, '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp]),
    );
    // 4. Independent check of the delivered file.
    const after = measure(tmp);
    if (Math.abs(after.I - I) > 0.5 || after.TP > TARGET.TP) {
      throw new Error(`normalisation missed the target (got ${after.I} LUFS, ${after.TP} dBTP); original left untouched`);
    }
    renameSync(tmp, file);
    return {before, after, mode: `${stage}, loudnorm ${applied.normalization_type}`, size: statSync(file).size};
  } catch (e) {
    throw new Error(`${file}: ${e.message}`);
  } finally {
    for (const t of [tmpWav, tmp]) if (existsSync(t)) unlinkSync(t);
  }
};

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error('Usage: node scripts/finalize-audio.mjs out/<slug>.mp4 [...]');
    process.exit(2);
  }
  let failed = 0;
  for (const f of files) {
    try {
      const r = finalize(f);
      console.log(
        `${f}: ${r.before.I} LUFS / ${r.before.TP} dBTP (LRA ${r.before.LRA} LU)  ->  ${r.after.I} LUFS / ${r.after.TP} dBTP (LRA ${r.after.LRA} LU, ${r.mode} mode), ${(r.size / 1e6).toFixed(1)} MB`,
      );
    } catch (e) {
      failed++;
      console.error(e.message);
    }
  }
  process.exit(failed ? 1 : 0);
}

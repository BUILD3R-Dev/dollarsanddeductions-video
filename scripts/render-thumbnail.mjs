#!/usr/bin/env node
// Renders thumbnails/<slug>.json with the Thumbnail template to thumbnails/<slug>.png (1280×720).
//   node scripts/render-thumbnail.mjs <slug> [...]      (npm run thumbnail -- <slug>)
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join, resolve} from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node scripts/render-thumbnail.mjs <slug> [...]');
  process.exit(2);
}
for (const slug of slugs) {
  const props = join('thumbnails', `${slug}.json`);
  if (!existsSync(join(ROOT, props))) {
    console.error(`${props} not found`);
    process.exitCode = 1;
    continue;
  }
  const r = spawnSync(join(ROOT, 'node_modules/.bin/remotion'), ['still', 'Thumbnail', `thumbnails/${slug}.png`, `--props=${props}`], {cwd: ROOT, stdio: 'inherit'});
  if (r.status !== 0) process.exitCode = 1;
}

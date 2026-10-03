# Dollars & Deductions — Remotion scene kit

A motion-graphics template library for the **Dollars & Deductions** YouTube channel
(small-business taxes & finance). Everything is procedural (CSS/SVG). There's no stock footage
and no web images. Output is 1920×1080 @ 30 fps.

- **Brand:** matches the website (dollarsanddeductions repo): deep pine `#07352a`, pine `#0b5d45`, mint `#cfe6da`, mist `#eef4f0`, ink `#15211c`, red `#c3283a` for totals
- **Type:** Newsreader (headlines, numbers) + Public Sans (body, labels), the site's faces, loaded via `@remotion/google-fonts`
- **Motion:** all movement uses the eased curves in `src/lib/motion.ts`. Nothing moves linearly.

**Design rules live in [DESIGN.md](DESIGN.md)**, the source of truth for color, type, spacing, motion and logo usage.

> **Logo:** the final logo system lives in `public/brand/` (masters in the website repo) and is wired up in
> `src/brand/config.ts`. See DESIGN.md §7 for files and usage rules.

## Quick start

```bash
npm install
npx remotion studio                         # browse every scene + the demo
npx remotion render Demo out/demo.mp4       # 60s sizzle reel (16:9)
npm run final -- video-01 video-01-teaser   # release renders: validate, render, -14 LUFS
npx remotion render DemoShort out/short.mp4 # 28s Short / Reel (9:16)
```

Render a new video from a JSON spec (no code changes needed):

```bash
npx remotion render Episode out/home-office.mp4 --props=videos/episode-home-office.json   # 16:9, 1920×1080
npx remotion render Short out/home-office-short.mp4 --props=videos/short-home-office.json # 9:16, 1080×1920
```

`Episode` and `Short` take the same JSON format, and every scene adapts to the frame.
The same spec renders in either format, which is useful for cutting a Short from a long-form episode.
Short-form specs should still be written for the format: a hook first, fewer words, and 15–45s total.

Render one scene for review:

```bash
npx remotion still BarChart out/bar.png --frame=150
```

Export logo files (SVG marks, PNG lock-ups, YouTube avatar and watermark) to `/brand`:

```bash
npm run brand
```

Font loading needs network access the first time (Google Fonts).

Remotion downloads its headless Chrome on first render. If that download fails (e.g. `remotion.media` is unreachable),
set `REMOTION_BROWSER_EXECUTABLE=/usr/bin/google-chrome-stable` (or any local Chrome/Chromium) and `remotion.config.ts` uses it.

## How a video is described

A video is an ordered list of `SceneSpec`s (`src/SceneSequence.tsx`). An agent only has to write this JSON:

```ts
type SceneSpec = {
  type: 'TitleCard' | 'KineticType' | 'BarChart' | 'LineChart' | 'NumberCallout'
      | 'BulletBuild' | 'LowerThird' | 'Transition' | 'OutroCard';
  durationInFrames?: number;      // defaults to the scene's defaultDuration; 30 frames = 1s
  props: { ... };                 // the scene's props, minus durationInFrames
  transition?: {                  // branded transition into the NEXT scene, centred on the cut
    style?: 'wipe' | 'iris' | 'fade';
    direction?: 'right' | 'left';
    durationInFrames?: number;    // default 30
    showMark?: boolean;           // flash the logo mark mid-transition (default true)
  };
  overlays?: Array<{              // layered on top of this scene (typically LowerThird)
    type: SceneType; from: number; durationInFrames: number; props: { ... };
  }>;
  bug?: boolean;                  // force the corner logo bug on/off for this scene
};

type VideoSpec = {
  scenes: SceneSpec[];
  bug?: false | {                 // corner logo bug; on by default in 16:9 (hidden on Title/Outro), off in 9:16
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    size?: number;                // default 64
    opacity?: number;             // default 0.85
  };
};
```

- The `Episode` composition sums the scene durations, so total length is automatic.
- Transitions overlap the cut and don't add time.
- `SceneSequence` injects `durationInFrames` into every scene, and each scene times its entrance and exit from it.
- In code, import `SceneSequence` and pass `scenes={...}`. `src/Demo.tsx` is the reference example.

### Text conventions (all text props)

| Syntax | Effect |
|---|---|
| `*word*` or `*several words*` | Italic serif emphasis in the accent colour |
| `$16,955` (KineticType only) | Auto-detected: accent colour, counts up from $0, underline draws in |

### Common props

| Prop | Values | Notes |
|---|---|---|
| `theme` | `'dark'` (deep pine, default) / `'light'` (mist) | Alternate between them to vary the rhythm. BulletBuild defaults to light. |
| `format` | `'currency'` / `'percent'` / `'number'` | Numeric scenes. Default `'currency'`. |
| `decimals` | number | Default `0`. |
| `kicker` | string | Sentence-case accent label with a drawn rule. |

## Scene catalog

Durations are at 30 fps. "Default" is used when a spec omits `durationInFrames`.

### TitleCard — default 165f
Brand lock-up draws in. The kicker rule extends, then the title rises word by word out of masks.
The subtitle and footer URL follow. Ledger rules drift in the background.

| Prop | Type | Req | Example |
|---|---|---|---|
| `title` | string | ✓ | `'S-Corp vs. LLC: Which One *Actually* Saves You More?'` |
| `kicker` | string | | `'Episode 14 · The S-Corp Series'` |
| `subtitle` | string | | `'The real numbers on $120,000 of small-business profit.'` |
| `url` | string | | default `'dollarsanddeductions.com'` |
| `showLogo` | boolean | | default `true` (horizontal lock-up with tagline, top-left) |
| `theme` | `'dark' \| 'light'` | | |

Titles over 48 characters drop from 144px to 112px automatically.

### KineticType — default 180f
Full-screen kinetic typography. Lines arrive on beats. Each word lifts out of a blur, and dollar figures count up in the accent colour.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `lines` | `(string \| {text, at?, size?})[]` | ✓ | `at` = entry frame; `size` = `'xl' \| 'lg' \| 'md'` (auto by length) |
| `mode` | `'stack' \| 'replace'` | | `stack` accumulates lines; `replace` shows one line at a time |
| `align` | `'center' \| 'left'` | | |
| `kicker` | string | | |
| `beat` | number | | Frames between auto-timed lines. Default 30 (1s) in `stack` mode, so a scene's lines build quickly and then hold; in `replace` mode lines are spread across the scene. Use `at` on a line to time it to a specific narration moment |
| `offsetY` | number | | Shift the text block, e.g. `-88` to clear a LowerThird |

```json
{"type": "KineticType", "props": {"lines": ["You cleared $120,000 in profit.", "Self-employment tax takes $16,955", "before *income tax* even starts."]}}
```

### BarChart — default 240f
Vertical bars grow in a stagger with values riding their tops. An optional bracket measures the gap between the tallest and shortest bar.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `title` | string | ✓ | Keep it to one line (about 40 characters) |
| `bars` | `{label, value, caption?, tone?}[]` | ✓ | 1–5 bars. `tone`: `'saving' \| 'cost' \| 'neutral'` (old `gold`/`loss`/`cream` still accepted) |
| `subtitle`, `kicker` | string | | |
| `difference` | `{label: string}` | | e.g. `{label: 'You keep'}`. Shows max − min with a counting value and the red double rule |
| `format`, `decimals`, `theme` | | | |

### LineChart — default 240f
Gridlines draw in, then a monotone curve with an accent area fill sweeps left to right. A glowing head carries a live value pill.
When the line lands, the pill pops and reveals `endLabel`.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `title` | string | ✓ | |
| `points` | `{label, value}[]` | ✓ | 2–16 evenly spaced points. The y-axis auto-scales to friendly ticks |
| `endLabel` | string | | e.g. `'after 10 years'` |
| `subtitle`, `kicker`, `format`, `decimals`, `theme` | | | |

### NumberCallout — default 150f
A giant count-up figure inside orbiting rings. A pulse and scale pop mark the landing, the red double rule draws under it, then the caption rises.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `value` | number | ✓ | |
| `format` | `'currency' \| 'percent' \| 'number'` | | `20` + `'percent'` → `20%` |
| `prefix`, `suffix`, `decimals` | | | e.g. `suffix: '/yr'` |
| `kicker`, `caption` | string | | Caption is 56px, about 2 lines max |
| `doubleRule` | boolean | | default `true`. Set `false` when the figure isn't a final total (e.g. a percentage) |
| `theme` | | | |

The figure auto-shrinks for long values.

### BulletBuild — default 270f
Two-column checklist. The title sits on the left with a live "3 of 4 covered" counter. Items slide in on the right, and their boxes fill with pine/mint as checks draw (styled like the site's checklist).

| Prop | Type | Req | Notes |
|---|---|---|---|
| `title` | string | ✓ | |
| `items` | `{text, detail?}[]` | ✓ | 2–5 items, spread evenly across the scene |
| `kicker` | string | | |
| `theme` | | | default `'light'` |

### LowerThird — default 120f (overlay)
A transparent overlay: mint bar, then a deep-pine panel wipes open, then the title and definition slide in. It reverses out in its last 18 frames.
Use it in a scene's `overlays`, or on its own as a scene.

| Prop | Type | Req | Example |
|---|---|---|---|
| `title` | string | ✓ | `'QBI Deduction'` |
| `subtitle` | string | | `'20% pass-through deduction under §199A'` |
| `tag` | string | | default `'Concept'` |
| `align` | `'left' \| 'right'` | | |

```json
{"type": "KineticType", "props": {"lines": ["..."], "offsetY": -88},
 "overlays": [{"type": "LowerThird", "from": 60, "durationInFrames": 110,
               "props": {"title": "Reasonable Compensation", "subtitle": "Salary must match fair market pay"}}]}
```

### Transition — default 30f
Branded full-frame transition that fully covers the frame at its midpoint, with an optional logo flash.
Usually set via `transition` on a SceneSpec.

| Prop | Type | Notes |
|---|---|---|
| `style` | `'wipe' \| 'iris' \| 'fade'` | wipe = skewed deep-pine panel with a white double-rule edge; iris = mint-ringed circle out, then in; fade = dip to deep pine with a mint hairline |
| `direction` | `'right' \| 'left'` | wipe only |
| `showMark` | boolean | default `true` |

### OutroCard — default 240f
End screen. The headline reveals and a procedural cursor clicks **Subscribe**, flipping it to *Subscribed ✓*.
On the right is a 16:9 "Up next" placeholder (720×405) where you place YouTube's end-screen element. The URL and disclaimer sit in the footer.

| Prop | Type | Req | Default |
|---|---|---|---|
| `nextTitle` | string | ✓ | |
| `headline` | string | | `'Keep more of *what you earn.*'` |
| `nextLabel` | string | | `'Up next'` |
| `url` | string | | `'dollarsanddeductions.com'` |
| `disclaimer` | string | | `'Educational purposes only — not tax, legal, or financial advice.'` (site wording) |
| `schedule` | string | | `'New episodes twice a week.'` |

YouTube end screens need at least 5s (150f) and at most 20s. Keep the OutroCard at 150f or longer.

## Short-form: Shorts, Reels, TikTok (9:16)

Render with the `Short` composition (1080×1920, 30fps). See DESIGN.md §10 for the full rules.

- **Safe zone:** scenes keep content inside the area all three platforms leave clear of UI:
  - 240px top
  - 144px right (like/comment column)
  - 480px bottom (caption, audio and nav)
  - 144px left (mirrors the right inset, so centered content sits on the frame's center line)
  To check a spec, add `"guides": true`: it shades the UI zones red and outlines the safe box. Remove it before the final render.
- **Adapts automatically:** every existing scene reflows for vertical. BulletBuild stacks, charts re-scale, and the type steps down.
  `OutroCard` becomes `ShortCTA`, because Shorts have no end screens.
- **Corner logo:** off by default in 9:16, because platform UI covers the corners and the channel name is already shown.
  Set `"bug": {}` on the spec to force it on.

### HookCard: default 75f (2.5s)
The opener. It must land within about 1s: words pop in on a 2-frame stagger, then the block drifts slightly closer, so the frame is never static.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `text` | string | ✓ | One sentence. `*word*` = emphasis; `$7,775` counts up |
| `sticker` | string | | Tilted label above, e.g. `'Tax tip #14'` |
| `showLogo` | boolean | | default `true` |
| `theme` | | | |

### CaptionTrack: default 150f (overlay)
Burned-in, word-by-word captions for voiced Shorts (most people watch muted).
The spoken word gets a mint highlight, spoken words are white, and upcoming words are dimmed.

| Prop | Type | Req | Notes |
|---|---|---|---|
| `cues` | `{text, from, to}[]` | ✓ | Frames relative to the overlay. ≤ ~7 words per cue. Words are spread evenly across `from`→`to` |
| `position` | `'lower' \| 'middle' \| 'upper'` | | default `'lower'` (just above the platform UI) |

Use it as an overlay on the scene it narrates:

```json
{"type": "NumberCallout", "props": {"value": 7775},
 "overlays": [{"type": "CaptionTrack", "from": 0, "durationInFrames": 135,
               "props": {"cues": [{"text": "That's money you *keep*", "from": 48, "to": 88}]}}]}
```

Cue timings normally come from the voiceover's word timestamps (TTS output or a transcription), grouped into short phrases.
Don't caption over the lower part of charts; captions belong on scenes with a clear lower band (callouts, kinetic type, hooks).

### ShortCTA: default 120f
The end card: the logo with tagline, a follow prompt, a "Full breakdown on YouTube" card, the URL and the disclaimer.

| Prop | Type | Req | Default |
|---|---|---|---|
| `headline` | string | | `'Follow for plain-English *tax wins.*'` |
| `action` | string | | `'Follow'` |
| `fullVideoTitle` | string | | Shows the long-form card when set |
| `url`, `disclaimer` | string | | site URL / site disclaimer wording |

## Narration (per-scene voice)

The channel voice is ElevenLabs **Kallen** (`Pi2Zqk51cRysbs4RoCCF`, model `eleven_v4`).
Narration is generated per scene, so a script change only re-spends the characters of the scenes that changed.

### Files

| File | Committed | What |
|---|---|---|
| `videos/<slug>.json` | yes | The video spec (scenes). Add `"narration": "<slug>"` |
| `narration/<slug>.json` | yes | The narration manifest: what is said in each scene |
| `public/audio/<slug>/NN.mp3` | **no** (gitignored) | Generated voice for scene NN (01, 02, …) |
| `public/audio/<slug>/NN.json` | **no** | Optional ElevenLabs timestamps for that segment; turns on synced captions |

### Manifest format (`narration/<slug>.json`)

```json
{
  "video": "short-home-office",
  "voice": {"provider": "elevenlabs", "name": "Kallen",
            "voiceId": "Pi2Zqk51cRysbs4RoCCF", "model": "eleven_v4"},
  "segments": [
    {"scene": 1, "type": "HookCard", "startSec": 0.2, "text": "Work from home? You could be missing out on fifteen hundred dollars a year."},
    {"scene": 2, "type": "NumberCallout", "text": "The simplified home office deduction is five dollars per square foot, up to three hundred square feet."}
  ]
}
```

| Field | Notes |
|---|---|
| `video` | Must equal the file's slug |
| `spec` | Optional; defaults to `videos/<slug>.json` |
| `voice` | Voice and model for the generator. `settings` (optional) is passed through, e.g. ElevenLabs `voice_settings` |
| `segments[].scene` | 1-based scene number in the spec. **Exactly one segment per scene.** Scene 3 → `03.mp3` |
| `segments[].startSec` | Seconds from the start of that scene to the start of its audio. Default `0.3` |
| `segments[].text` | Exactly what the voice says. Plain text, no `*emphasis*`. Write numbers the way they should be spoken ("fifteen hundred dollars") |
| `segments[].type` | Optional; the scene's type. The validator checks it against the spec to catch misnumbering |
| `segments[].note` | Optional direction for whoever generates the audio. Never spoken |

### Workflow (every video)

| Step | Who | Command / file |
|---|---|---|
| 1. Write the spec and manifest | agent | `videos/<slug>.json` with `"narration"`, `"captions"` and `"audio.music"` (see below); `narration/<slug>.json` |
| 2. Validate | anyone | `npm run narration:check -- <slug>` |
| 3. Generate the voice | Nyx, via the ElevenLabs API | `public/audio/<slug>/NN.mp3`, one per scene. Optionally `NN.json` timestamps |
| 4. **Fit the timeline** | anyone | `npm run narration:fit -- <slug>` |
| 5. Time the captions **to the fitted spec** | Nyx | `public/captions/<slug>.srt` |
| 6. Deliver the music bed | Nyx / editor | `public/audio/music/<slug>-bed.mp3` |
| 7. Validate again | anyone | `npm run narration:check -- <slug>`: every scene `mp3 ✓`, captions in sync, music ✓ |
| 8. **Final render** | anyone | `npm run final -- <slug>`: validate → render → loudness-normalise → report. Never ship a plain `remotion render` output |

More detail on each step:

1. **Write.** An agent writes `videos/<slug>.json` and `narration/<slug>.json`, one segment per scene.
2. **Validate.**
   - Fails if a scene has no segment, a text is empty, a scene number or type doesn't match the spec, or `startSec` is past the scene's end.
   - Warns about markup the voice would read aloud, and estimates where the voice will run long.
   - Prints character counts against the monthly ElevenLabs quota. Regenerating a segment spends its characters again.
3. **Generate the voice.** One request per segment, using the manifest's `voice`. **No API key ever lives in this repo**; `public/audio/` is gitignored.
4. **Fit.** Measures every mp3, then:
   - lengthens scenes that are too short for their voice (`startSec` + audio + 0.5s);
   - writes an explicit `startSec` on every segment.

   After this, the spec **is** the render timeline: nothing stretches at render, and a segment's voice starts at
   `sum(earlier scenes' durationInFrames) / 30 + startSec` seconds. Captions must be timed from that.
   The validator warns until this has run.
5. **Captions.** Sentence-level SRT, timed to the fitted spec. The same file is uploaded to YouTube as the subtitle track, so it has to match the final video exactly.
6. **Music.** See *Music beds* below.
7. **Re-validate.** The validator matches caption text to segments and fails if any segment's first caption is more than 0.25s from its voice.
8. **Final render**, for both the main video and the teaser: `npm run final -- <slug> <slug>-teaser`. See *Loudness* below.

### Captions (standard for every video)

Every spec references its SRT the same way:

```json
"captions": {"src": "captions/<slug>.srt"}
```

- **Files** live in `public/captions/` and are committed, since they're also the YouTube subtitle tracks.
- **Burned-in captions render for both formats:**
  - Position `lower`, just above the bottom safe area (16:9) or above the platform UI (9:16).
  - Public Sans 700 at 52px (16:9) or 64px (9:16), with the spoken word highlighted in mint.
- **Long sentences:** SRT sentences are split on screen into phrases of at most 7 words (`captions.maxWords`), with time shared in proportion to length. The SRT file itself is never modified.
- **Caption band:** while captions are on, scenes reserve a band at the bottom (150px in 16:9, 200px in 9:16) and lay out above it, so captions never cover content.
- **Turning them off:** `"captions": false`. Word-level ElevenLabs timestamps (`NN.json` next to each mp3) also work, and are used automatically when there's no SRT.

### Music beds (standard for every video)

```json
"audio": {"music": {"src": "audio/music/<slug>-bed.mp3", "volume": 0.22, "duckTo": 0.07}}
```

| | Main video | Teaser (9:16) |
|---|---|---|
| File | `public/audio/music/<slug>-bed.mp3` | `public/audio/music/<slug>-teaser-bed.mp3` |
| Character | Calm, professional underscore | Same family, slightly more energy and pulse |
| Vocals | **None.** Instrumental only | **None** |
| Length | Any. Loops seamlessly if shorter than the video, so pick a bed that loops cleanly (no fade or swell at the loop point) | Ideally ≥ the teaser length, else loops |
| Mix | 0.22 in gaps, ducked to 0.07 under the voice, 1s fade-in, 2s fade-out | Same |
| Licensing | Must be licensed for YouTube/social. Music files stay out of git (`public/audio/` is ignored) | Same |

**Short clips (e.g. a 13s Suno phrase): make them seamless first.**

```bash
python3 scripts/loop-music.py public/audio/music/<slug>-bed.wav public/audio/music/<slug>-bed.loop.wav --seconds 620
```

It measures the bar length and repeats the phrase every 4 bars, not every file length, so downbeats stay on time across seams. Each repeat's tail fades under the next one's start, so there are no clicks. Point the spec at the `.loop.wav`.

Generated clips usually end with a decaying last bar, so expect a gentle "phrase breath" at each repeat. For long videos, a longer bed (1–3 minutes) repeats less and sounds less looped.

Ducking is timed from the caption cues. Until a music file is delivered, renders skip it with a warning, so you can preview without it; the validator lists it as not delivered.

### Loudness (every final)

Every final mix is normalised to **−14 LUFS integrated, true peak ≤ −1 dBTP** (EBU R128 measurement; YouTube's reference).
`npm run final` does this automatically after rendering (`scripts/finalize-audio.mjs`). To normalise an existing file in place: `npm run finalize-audio -- out/<slug>.mp4`.

How it works:
1. **Measure** the rendered mix.
2. **Gain through a look-ahead peak limiter.** ElevenLabs voice peaks sit about 19 dB above its average loudness, but −14 LUFS with a −1 dBTP ceiling only allows about 13 dB, so the loudest syllables get limited.
   The limit is iterated so the loudness lands on target.
3. **One fixed gain** (ffmpeg `loudnorm`, two-pass, linear mode) to land exactly on −14. The target is −1.5 dBTP internally, which leaves headroom for AAC encoding.
4. **Independent check** with `ebur128`. If the delivered file is outside −14 ±0.5 LUFS or above −1.0 dBTP, it fails and the original is left untouched.

The video stream is copied untouched; only the audio is re-encoded (AAC 192 kb/s, 48 kHz).
This needs a full ffmpeg with `loudnorm`/`ebur128` (`/usr/bin/ffmpeg`, or set `FFMPEG`); Remotion's bundled ffmpeg doesn't include those filters.

### Audio-only checks

To review the mix or check sync without rendering video:

```bash
npx remotion render Episode out/preview/<slug>.wav --codec=wav --config=remotion.audio.config.ts --props=videos/<slug>.json
```

### What happens at render

- Each `NN.mp3` plays at its scene's start + `startSec`.
- **Scenes stretch to fit their narration** if `narration:fit` hasn't been run (it should be, before captions are timed). If a segment (plus 0.5s of air) is longer than its scene, the scene gets longer, so the voice is never cut off or overlapping. The video length follows.
  Set `"narration": {"slug": "<slug>", "fit": false}` to keep scene lengths fixed (you get a warning instead).
- Segments not delivered yet are skipped with a warning, so you can preview visuals before the audio arrives.
- If `NN.json` timestamps are present, captions appear automatically and stay in sync. Set `"captions": false` to turn them off.
- Background music (`audio.music`) ducks under each narration segment.
- `"narration": {"slug": "…", "volume": 0.9}` adjusts the narration level.

Verified on a test render with four stand-in segments: every segment started exactly at scene start + `startSec` (measured to 10ms).
Scenes stretched to the calculated lengths, and captions came up from a segment's timestamp file.

## Voiceover, music & captions

Drop the files in `public/audio/` and reference them from the spec (paths are relative to `public/`):

```json
{
  "scenes": [ ... ],
  "audio": {
    "voiceover": {"src": "audio/ep15-vo.mp3", "startAt": 0.5},
    "music":     {"src": "audio/bed-calm.mp3", "volume": 0.22, "duckTo": 0.07}
  },
  "captions": {"src": "audio/ep15-vo.words.json"}
}
```

| Field | Default | Notes |
|---|---|---|
| `voiceover.src` | | mp3 / wav / m4a in `public/`, or an https URL |
| `voiceover.startAt` | `0` | Seconds into the video where the voice begins |
| `voiceover.trimStart` | `0` | Seconds to skip at the head of the file |
| `voiceover.volume` | `1` | |
| `music.volume` | `0.22` | Level when nobody is speaking |
| `music.duckTo` | `0.07` | Level under the voice. Ducking is timed from the caption word timestamps |
| `music.loop` | `true` | Loops seamlessly if the track is shorter than the video |
| `music.fadeIn` / `fadeOut` | `1` / `2` | Seconds |
| `captions.src` | | Timestamp file (formats below) |
| `captions.cues` | | Or inline: `[{"text", "start", "end"}]` in seconds |
| `captions.offset` | voiceover `startAt − trimStart` | Timestamps are relative to the voiceover file, so they stay in sync automatically |
| `captions.position` | `'lower'` | `'lower' \| 'middle' \| 'upper'` |
| `captions.maxWords` | `6` | Words per caption when grouping word-level timestamps |

**Caption timestamp formats** (detected automatically):
- **Word-level JSON** (best: exact per-word highlight, and tight music ducking):
  - Whisper / OpenAI (`segments[].words[]`)
  - ElevenLabs speech-to-text (`words[]`) and text-to-speech "with timestamps" (`alignment.characters`)
  - AssemblyAI (`words[]`, milliseconds)
  - Deepgram
  - a plain `[{"text","start","end"}]` list
  Words are grouped into captions at sentence ends, pauses, commas, or `maxWords`.
- **SRT / WebVTT:** phrase-level; words inside each cue are spread evenly.

Captions from `captions` run across the whole video, on top of scenes and transitions.
A scene-level `CaptionTrack` overlay is still available for one-off captions.

**Check the length:** scene durations decide the video length. If the captions run past the last scene, the render logs
`Captions run to frame … but the scenes end at …`. Lengthen the scenes so the voiceover isn't cut.

Measured on a test render: voiced words land within 5ms of their timestamps (one frame is 33ms), and the music ducks to about 40% under speech.

## Thumbnails (one per video)

The `Thumbnail` composition (1280×720, `src/brand/Thumbnail.tsx`) is a template: every text layer is a prop. Each video gets a `thumbnails/<slug>.json`:

```json
{
  "topic": "S Corp vs LLC",
  "figure": "$15,000",
  "label": "tax gap",
  "bars": [
    {"label": "LLC", "tone": "cost", "height": 1},
    {"label": "S corp", "tone": "saving", "height": 0.41}
  ]
}
```

Render it with `npm run thumbnail -- <slug>`, which writes `thumbnails/<slug>.png`.

| Prop | Notes |
|---|---|
| `topic` | Mint tag above the figure. 2–4 words |
| `figure` | The hero: `$15,000`, `20%`, `$1,500`. Auto-shrinks for long strings |
| `label` | 1–3 words under the figure (mint, Public Sans 700, 92px) |
| `bars` | Optional 2–3 comparison bars on the right, no numbers. `tone`: `cost` (red), `saving` (mint), `neutral`. `height` 0–1 relative. Omit them and the text spans the full width |
| `doubleRule` | Red double rule under the figure (the brand's "total" mark). Default `true`; set `false` when the figure isn't a total |

Rules the template enforces or assumes:
- **3–5 words of text in total.**
- **Readable at about 160px wide**, the mobile list size.
- **Logo bug top-left**, because YouTube's duration badge covers the bottom-right.
- **Brand colors only**, on the deep-pine background.
- **Keep the copy consistent with the video and its website article**: same numbers, same claim.

## Channel banner

`brand/youtube-banner.png` (2560×1440) is rendered from the `Banner` composition (`src/brand/Banner.tsx`) by `npm run brand`.
- **Where content goes:** everything sits in the 1546×423 center safe area that phones show: logo with tagline, URL and upload cadence.
- **The rest:** the desktop strip and TV area beyond it carry only background and the ledger double rules, since desktop crop widths vary.
- **Text props:** `url` and `cadence`. To check placement: `npx remotion still Banner out/banner-guides.png --props='{"guides":true}'`.

## Project layout

```
src/
  index.ts              registerRoot
  Root.tsx              compositions: Demo, Episode (JSON-driven), Scenes/* previews
  Demo.tsx              60s sizzle reel (reference SceneSpec[])
  DemoShort.tsx         28s vertical Short (reference SceneSpec[])
  SceneSequence.tsx     SceneSpec types + the sequencer
  scenes/               the 9 templates + index.ts registry
  components/           Background, SceneShell, CountUp, DoubleRule, WordReveal, Kicker, ChartHeader
  lib/                  motion (easing), format (currency/percent), rich (*emphasis*, $money), curve (monotone + nice ticks)
  theme/                tokens (colours, space(), type scale, palettes), fonts, layout (useLayout: format + safe zones)
  brand/                Logo / LogoMark / CornerBug, geometry (fallback mark), config.ts (logo file slots), asset comps
brand/                  exported logo files (npm run brand)
public/brand/           logo system SVGs (copied from the website repo)
public/audio/           voiceover, music and caption timestamp files
videos/                 video specs, one per video: videos/<slug>.json (pass with --props)
narration/              narration manifests: narration/<slug>.json
scripts/                validate-narration.mjs (npm run narration:check), narration-fit.mjs (npm run narration:fit), render-final.mjs (npm run final), finalize-audio.mjs, loop-music.py, render-thumbnail.mjs (npm run thumbnail)
thumbnails/             <slug>.json props + rendered <slug>.png
```

## Design rules (keep them when extending)

- **Spacing:** use `space(n)` (n × 8px) for every margin, gap and offset. Title-safe margins are `SAFE` (128 × 96).
- **Type:** body copy ≥ `typeScale.body` (56) or `bodySm` (48). Labels ≥ `typeScale.label` (40). Only micro tags and footers use 32.
- **Colour:** take colours from `palette(theme)`, never hard-coded hex. Use `accentText` for accent *text*, and `p.cost` (not raw red) for red on dark.
- **Motion:** use `progress(frame, start, duration, ease.out)` and `mix()` with the `dur` / `stagger` tokens. Use `ease.out` for entrances, `ease.inOut` for draws and wipes, `ease.in` for exits, and `ease.back` for small landings.
  Never call `interpolate` without an easing.
- **Numbers:** always render with `<CountUp>`. It reserves the final width, so the layout doesn't jitter, and uses tabular figures.
- **Grain** is static on purpose. Animated noise costs YouTube bitrate and smears.

## Adding a new scene

1. Create `src/scenes/MyScene.tsx`:

   ```tsx
   import React from 'react';
   import {useCurrentFrame} from 'remotion';
   import {SceneShell} from '../components/SceneShell';
   import {ease, mix, progress} from '../lib/motion';
   import {fonts, palette, ThemeMode, typeScale} from '../theme';

   export type MySceneProps = {durationInFrames: number; headline: string; theme?: ThemeMode};

   export const MyScene: React.FC<MySceneProps> = ({durationInFrames, headline, theme = 'dark'}) => {
     const frame = useCurrentFrame();
     const p = palette(theme);
     const t = progress(frame, 8, 30, ease.out);
     return (
       <SceneShell durationInFrames={durationInFrames} theme={theme}>
         <div style={{fontFamily: fonts.serif, fontSize: typeScale.h1, color: p.fg,
                      opacity: t, transform: `translateY(${mix(t, 32, 0)}px)`}}>
           {headline}
         </div>
       </SceneShell>
     );
   };
   ```

   The props type must include `durationInFrames: number`. `SceneShell` gives you the background, safe padding and an exit fade.
   Size and position things from `useLayout()` (`box`, `safe`, `vertical`), never from fixed 1920×1080 numbers, so the scene works in both formats.
   Check it in both the `Scenes` and `Scenes-Vertical` studio folders.

2. Register it in `src/scenes/index.ts`: add `export * from './MyScene'` and an entry in `sceneRegistry`:
   `MyScene: {component: MyScene, defaultDuration: 150}`.

3. That's it. `SceneSpec` types, the `Episode` JSON renderer and a studio preview under **Scenes/** pick it up automatically.
   For a nicer preview, add default props to `extraPreviews` in `Root.tsx`, or use it in `Demo.tsx`.
4. Run `npx tsc --noEmit`, then check a few frames with `npx remotion still MyScene out/x.png --frame=N`.

## Content note

The demo figures are illustrative 2026 federal numbers for a single owner with $120,000 net profit:
- SE tax = 15.3% × 92.35% × $120,000 = **$16,955**
- S-corp FICA on a $60,000 salary = **$9,180**
- Difference = **$7,775**

They ignore state tax, payroll costs and the SE-tax deduction. Have every episode script reviewed by a tax professional.

# Dollars & Deductions: Design Language

This file is the source of truth for every Dollars & Deductions video. It derives from the
**website's design system**: repo `BUILD3R-Dev/dollarsanddeductions`, `src/styles/site.css` and `BUILD_NOTES.md`.

The videos don't copy the site pixel for pixel, but they must read as the same brand: same palette, same typefaces, same motifs.

| Spec section | Video code |
|---|---|
| Color, type, spacing, radii | `src/theme/tokens.ts` |
| Fonts | `src/theme/fonts.ts` |
| Motion | `src/lib/motion.ts` (`ease`, `dur`, `stagger`) |
| Logo slots | `src/brand/config.ts` |
| Format + safe zones | `src/theme/layout.ts` (`useLayout`) |

**Change the doc and the code in the same commit.** If they disagree, this document wins.
If the website's tokens change, update §2 and `tokens.ts` to match.

---

## 1. Character

> *"Borrowed from the paperwork itself: numbered form lines, ledger columns, and the bookkeeper's double rule under a final total."*
> (site.css)

- **Plain-English authority.** The site's tagline is "written for owners, not accountants". Videos are clear, calm and factual. No hype.
- **Paperwork, made beautiful.** The visual vocabulary is ledger rules, form lines, check boxes and the double rule under a total.
  No coins, cash stacks, piggy banks or stock imagery.
- **Money is the hero.** Figures are the largest, highest-contrast things on screen. Totals get the red double rule.
- **Restraint.** The site has no ornament. The videos add only motion (things drawing, counting, settling) and soft depth on dark.

### 1.1 How video relates to the site

| Site | Video |
|---|---|
| White pages and mist bands | **Light theme**: mist background, ink text, pine accents |
| Deep-pine lead-CTA band and footer | **Dark theme** (the default): deep-pine background, white headings, mint text and accents |
| `ul.checklist`: hairline rows, pine check boxes | `BulletBuild` uses the same row rules and check glyph |
| `.ws-total`: red double underline on a final total | `DoubleRule` under hero totals (`NumberCallout`, BarChart difference) |
| `.is-saving` pine / `.is-cost` red | Chart tones `saving` / `cost` |
| 2px ink rule above section groups (`.hubs`, `.principle-grid`) | 3px rule above lists and chart baselines |
| Logo system in `public/brand/` | Same files, in the title card, outro, corner bug and transitions (§7) |
| Buttons: radius 6, pine / white-on-dark (`.btn-light`) | Subscribe button: radius 12, white on deep pine |

What video adds, and the site doesn't have: a radial light source on dark, slow ledger-rule drift, count-ups and draw-ons.

---

## 2. Color

### 2.1 Tokens (`colors`). Names match site.css custom properties.

| Token | Hex | Site variable | Role in video |
|---|---|---|---|
| `pineDeep` | `#07352a` | `--pine-deep` | **Dark-theme background** (default) |
| `pine` | `#0b5d45` | `--pine` | Accent on light; dark-theme light source; logo tile; buttons on light |
| `pineHover` | `#084a37` | `--pine-hover` | Gradient bottoms on light |
| `mint` | `#cfe6da` | `--mint` | Accent, emphasis and data marks on dark; body text on dark |
| `mintInk` | `#a9c9b9` | `--mint-ink` | Muted text on dark |
| `white` | `#ffffff` | `--white` | Headlines and figures on dark; light-theme glow |
| `mist` | `#eef4f0` | `--mist` | **Light-theme background** |
| `ledger` | `#f4f9f6` | `--ledger` | Panels on light |
| `line` | `#d8e3dd` | `--line` | Hairlines on light; light-theme gradient edge |
| `lineStrong` | `#b9cdc2` | `--line-strong` | Unchecked boxes; neutral bars on light |
| `ink` | `#15211c` | `--ink` | Headlines and figures on light |
| `ink2` | `#2f3c36` | `--ink-2` | Body text on light |
| `muted` | `#5a6862` | `--muted` | Captions and axis labels on light |
| `red` | `#c3283a` | `--red` | Totals' double rule and cost data **on light only** |

**Video-only extensions** (not on the site; derived because video needs them):

| Token | Hex | Why |
|---|---|---|
| `pineNight` | `#04241c` | Vignette and gradient edge below `pineDeep` |
| `redBright` | `#e5636f` | Site red is only 2.4:1 on deep pine, so this is the double rule and cost data on dark |

There is **no gold** in the brand. An earlier draft of this kit used gold; it's retired.

### 2.2 Theme palettes (`palette('dark' | 'light')`)

Scenes never use raw hex. They read semantic roles.

| Role | Dark | Light | Use for |
|---|---|---|---|
| `bg` / `bgGlow` / `bgEdge` | pineDeep / pine / pineNight | mist / white / line | Background gradient |
| `fg` | white | ink | Headlines, figures |
| `body` | mint | ink2 | Running text, captions |
| `muted` | mintInk | muted | Secondary labels, axis ticks |
| `faint` | mint @ 18% | line | Hairlines, gridlines |
| `accent` / `accentText` | mint | pine | Rules, check fills, emphasis, kickers |
| `onAccent` | pineDeep | white | Glyphs and text on an accent fill |
| `mark` | mint | pine | Line-chart stroke |
| `saving` | mint | pine | Favorable data |
| `cost` | redBright | red | Unfavorable data, the double rule |
| `grid` | mint @ 7% | pine @ 7% | Ledger rules in the background |

### 2.3 Contrast (WCAG, measured)

| Pair | Ratio | Verdict |
|---|---|---|
| white on pineDeep | 13.5 | Any size |
| mint on pineDeep | 10.3 | Any size |
| mintInk on pineDeep | 7.6 | Any size |
| redBright on pineDeep | 4.1 | Rules and fills; text ≥ 40px only |
| red on pineDeep | 2.4 | **Never.** Use redBright. |
| pine on pineDeep | 1.7 | Logo tile only (lines carry it, as in the site footer) |
| ink on mist | 14.9 | Any size |
| ink2 on mist | 10.3 | Any size |
| pine on mist | 7.1 | Any size |
| muted on mist | 5.2 | Captions ≥ 36px |
| red on mist | 5.1 | Rules, cost data |
| white on pine | 7.9 | Buttons, value pills |
| pineDeep on white / mint | 13.5 / 10.3 | Buttons on dark |

### 2.4 Proportion

Per frame: about **70% background, 25–28% white/mint (or ink), and red only under totals and on cost bars**.
Red is a warning color on the site ("only on totals") and must stay rare. At most one double rule per frame.

---

## 3. Typography

Same faces as the site.

### 3.1 Families

| Family | Role | Weights |
|---|---|---|
| **Newsreader** (serif, optical sizes) | Headlines, all on-screen figures | 600 (headlines, figures), 700 (chart callouts, value pills), 500 italic (emphasis) |
| **Public Sans** (US federal design system face) | Body, captions, labels, UI | 400 (body), 500 (captions, axis), 600 (kickers, labels, URL), 700 (list items, buttons, bar labels) |

The site loads Newsreader italic only at 400–500, so emphasis is **italic 500**, never bold italic.
Fonts load via `@remotion/google-fonts`, latin subset.

### 3.2 Scale (`typeScale`, px at 1080p)

| Token | Size | Face / weight | Line height | Tracking | Used for |
|---|---|---|---|---|---|
| `hero` | 300 | Newsreader 600 | 1.0 | −0.03em | NumberCallout figure (auto-shrinks) |
| `display` | 144 | Newsreader 600 | 1.04–1.08 | −0.02em | Title card (≤ 48 chars), short kinetic lines |
| `h1` | 112 | Newsreader 600 | 1.04 | −0.02em | Long titles, mid-length kinetic lines, checklist and outro headline (104) |
| `h2` | 88 | Newsreader 600–700 | 1.05–1.08 | −0.02em | Long kinetic lines, chart difference figure |
| `h3` | 64 | Newsreader 600 | 1.1 | −0.015em | Lower-third title; chart titles (80); bar values (72) |
| `body` | 56 | Public Sans 400–700 | 1.1–1.35 | 0 | Subtitles, captions, list items |
| `bodySm` | 48 | Public Sans 400/700 | 1.3 | 0 | Chart subtitles, bar labels (52), buttons |
| `label` | 40 | Public Sans 500–600 | 1.3 | 0 | Kickers, list details, axis labels (36) |
| `micro` | 32 | Public Sans 500–600 | 1.2 | 0 | URL footer, legal line, tags |

### 3.3 Rules

- **Sentence case everywhere**, like the site. Kickers are sentence case too ("Episode 14 · The S-corp series"). No letter-spaced all-caps.
  Titles may use Title Case.
- **Kicker:** Public Sans 600, `accentText`, preceded by a 48px rule (`<Kicker>`). This mirrors the site's pine `.gl-hub` labels.
- **Emphasis:** Newsreader italic 500 in `accentText`, written `*word*` in copy. At most one emphasis per headline.
- **Numbers:** Newsreader, `tabular-nums lining-nums` (the site's worksheet does the same), always via `<CountUp>`.
- **Currency:** `$16,955` (cents only when they matter). Negatives use a true minus: `−$7,775`. Axis ticks: `$120k`, `$1.2M`.
- **Minimum sizes:** body ≥ 48px, labels ≥ 36px, micro (URL, legal, tags) ≥ 32px.
- **Line length:** about 45 characters for body (the site's measure is 42rem). Centered captions use `text-wrap: balance`, as the site's headings do.
- **Never:** a third typeface, faux bold, outlined text, or text shadows.

---

## 4. Spacing, radii & layout

### 4.1 8px rhythm

`space(n) = n × 8px`. Common steps: 8 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128.
Half steps only for optical alignment inside small components.

### 4.2 Radii (`radius`)

The site's 6 / 10 / 14px, doubled for 1080p: **`sm` 12** (buttons, pills, bar tops, lower third), **`md` 20**, **`lg` 28** (cards, up-next box).

### 4.3 Rules (lines)

| Line | Site | Video |
|---|---|---|
| Hairline row separator | 1px `--line` | 2px `faint` |
| Section rule above a group | 2px `--ink` | 3px `fg` (list top, chart baseline) |
| Double rule under a total | 1.5px red, double | 2 × 4px (8px on hero figures), 6–10px gap, `cost` |

### 4.4 Frame

- 1920×1080 @ 30fps.
- **Title-safe:** 128px sides, 96px top and bottom. Only the corner bug, background and transitions go outside it.
- **Alignment:** titles, charts and checklists are left-aligned on the 128px line. Kinetic type and callouts are centered.
- **Lower-third zone:** the bottom 360px. Shift centered content up with `offsetY: -88` when a lower third is planned.
- **YouTube end screen:** the "Up next" box is 720×405, right-aligned. Keep text out from under it.

---

## 5. Motion

The site is nearly static: 0.15s color transitions, and it respects reduced motion.
Video motion should feel like the paperwork being filled in: lines drawing, numbers totaling, boxes ticking. Nothing bounces around.

### 5.1 Easing (`ease`). Nothing moves linearly.

| Token | cubic-bezier | Use for |
|---|---|---|
| `ease.out` | `0.16, 1, 0.3, 1` | **Default.** Every entrance |
| `ease.soft` | `0.33, 1, 0.68, 1` | Large surfaces, settling |
| `ease.inOut` | `0.65, 0, 0.35, 1` | Draws: rules, double rules, check glyphs, chart paths, wipes |
| `ease.in` | `0.55, 0, 0.75, 0.2` | Exits only |
| `ease.back` | `0.34, 1.4, 0.64, 1` | Small landings only: check boxes, value pill, logo tile, figure pop |

### 5.2 Durations (`dur`, frames @ 30fps)

| Token | Frames | Use for |
|---|---|---|
| `micro` | 6 | Button press |
| `exit` | 10 | Scene exit (fade + 16px lift) |
| `fast` | 12 | Small fades |
| `base` | 24 | Default entrance; word reveal is `base + 4`; double-rule draw |
| `slow` | 36 | Long rules, large panels |
| `count` | 54 | Count-ups and bar growth (always together, same curve) |
| `draw` | 110 | Max line-chart sweep |

### 5.3 Stagger (`stagger`)

| Token | Frames | Use for |
|---|---|---|
| `word` | 4 | Headline words |
| `kinetic` | 3 | Kinetic-type words |
| `bar` | 12 | Chart bars |
| list items | auto | `min(56, (duration − 84) / n)` |

### 5.4 Signature moves

1. **Total:** a figure counts up, lands with a 5% pop, then the double rule draws under it, the second line 5 frames behind.
2. **Tick:** check boxes pop in (`ease.back`), fill with the accent, and the site's check glyph draws.
3. **Masked word rise:** headline words rise out of clip boxes.
4. **Blur-lift:** kinetic words rise 0.35em from a 10px blur.
5. **Ledger drift:** background rules feed upward at 0.3px/frame.
6. **Logo build:** the tile settles, the two entries draw, then the double rule.

### 5.5 Scene timing

| Phase | Timing |
|---|---|
| First movement | frames 0–10 |
| Primary content in place | by ~1.5s |
| Hold | at least 1.5s, still apart from ambient drift |
| Exit | last 10 frames |
| Transitions | 24–30 frames, centered on the cut, fully covering at the midpoint |

Transitions: wipe (deep-pine panel with a white double-rule leading edge), iris (mint ring), fade (to deep pine with a mint hairline).

Default lengths: Title 5.5s, Kinetic 6s, Bar 8s, Line 8s, Callout 5s, Checklist 9s, Outro 8s.
Reading time = words ÷ 3 per second, plus 1.5s.

### 5.6 Ambient

Ledger rules drift. There are no floating particles by default (`particles` is available but off; the site has no ornament).
Grain is static and only on dark, at 5%. Light scenes stay clean like the site's pages.

---

## 6. Data visualization

The site's worksheet is the reference: tabular numbers, right-aligned amounts, a red double rule under the result, pine for saving, red for cost.

- **Title states the takeaway** ("Same profit, two *very* different bills").
- **Tones are semantic:**
  - `saving` (mint on dark, pine on light): one per chart.
  - `cost` (redBright on dark, red on light): tax owed or money lost.
  - `neutral`: everything else.
- **Label directly** with values on bars or the line head. No legends.
- **Axes:** a solid `fg` baseline (the 2px-ink-rule echo), `faint` gridlines, and 4–5 compact ticks.
- **Lines** are monotone, 7px, with an accent-to-transparent area fill.
- **The delta between two options is a total:** bracket it and put the double rule under the figure.
- **State assumptions in captions** ("15.3% on 92.35% of profit"). The site's worksheet also nets out S-corp running costs
  (~$3,000/yr default). When a video quotes "savings", say whether costs are included.

---

## 7. Logo

### 7.1 The system

The final logo system was supplied on 2026-10-03. **Masters live in the website repo** (`BUILD3R-Dev/dollarsanddeductions`, `public/brand/`).
The video kit uses copies in `public/brand/`, wired up in `src/brand/config.ts`.

- **Icon:** a pine document/speech-bubble tile with three ledger lines and a mint-ink folded corner. It's the paperwork motif as a single mark.
- **Wordmark:** "Dollars & Deductions", outlined Noto Serif 600, with the ampersand in mint-ink `#a9c9b9`.
  The wordmark face differs from the headline face (Newsreader); that's deliberate. **Never retype the wordmark.** Always use the art.
- **Tagline:** "Plain-English tax guides for real business owners".
  - **Horizontal lock-up:** sentence case, outlined Public Sans 500 (23.2px on the 760×120 artboard, +0.01em tracking).
    Fitted edge-to-edge under the wordmark (sized and tracked, never stretched). The wordmark + tagline block is raised 5px to center on the icon.
    Color: mint `#cfe6da` on dark, muted `#5a6862` on light.
  - **Stacked lock-up:** keeps the designer's letter-spaced caps. This is the one place spaced caps are allowed.
  - **Readability:** use the tagline version only when the lock-up is ≥ 600px wide (tagline ≥ 18px). Below that, use the plain horizontal lock-up.

| File | Use |
|---|---|
| `icon-full-color.svg` | Icon on light backgrounds (mist, white). Video: light scenes |
| `icon-on-dark.svg` | Icon on deep pine: white tile, deep-pine lines, mint-ink fold. Video: corner bug, transitions, avatar, watermark. |
| `icon-single-white.svg` / `icon-single-ink.svg` | Single-color uses (merch, embossing, photos) |
| `favicon.svg` | Browser favicon (same geometry as the icon) |
| `horizontal-dark.svg` / `horizontal-light.svg` | Compact lock-up, 871×120 (7.26:1); wordmark 1.35× and centered on the icon. **Not used in videos**; the kit defaults to the tagline lock-up everywhere. Web: mobile header only (below 1100px). |
| `horizontal-tagline-dark.svg` / `horizontal-tagline-light.svg` | **Primary lock-up**, same 760×120 artboard. Video: title card and outro (native 760×120), Short end card (792 wide). Web: desktop header ≥ 1100px (62px tall) and footer (80px tall). |
| `stacked-dark.svg` / `stacked-light.svg` | Icon over wordmark + tagline. Square formats, intros. 588×256. |
| `master-brand-sheet.svg` | Reference sheet only. Not used in the kit |

### 7.2 Usage rules (from the brand sheet)

| Rule | Value |
|---|---|
| Clear space | ≥ 25% of the icon's height on all sides |
| Minimum size | 16px (favicon-checked); 32px+ preferred |
| Effects | None: no gradients, shadows or effects |
| Light backgrounds | `*-light` lock-ups and `icon-full-color` |
| Dark backgrounds | `*-dark` lock-ups and `icon-on-dark` |
| Corner bug | `icon-on-dark` (or full color on light scenes), top-right, 64px, 85% opacity, 40/48px inset. Hidden on title, outro, transitions and lower thirds |

Don't recolor the logo, stretch it, rotate it, retype the wordmark, or place it on busy content.

### 7.3 Updating the logo

1. Update the masters in the website repo's `public/brand/`.
2. Copy them to the kit's `public/brand/`. Keep the file names, or update `src/brand/config.ts`.
3. Run `npm run brand`. It exports PNGs to `/brand`:
   - `logo-horizontal.png` / `logo-horizontal-light.png`
   - `logo-stacked.png`
   - `youtube-avatar.png` (800×800)
   - `youtube-watermark.png` (150×150)
   - `youtube-banner.png` (2560×1440; all content inside the 1546×423 safe area)
   - `logo-sheet.png`
4. Re-render `Demo` and check frames 120 (title), 545 (corner bug) and 1665 (outro).

Fallback: if a slot in `config.ts` is `null`, the kit draws a procedural placeholder (`src/brand/geometry.ts`, the site's old ledger-tile mark).

---

## 8. Copy voice

Match the site:
- **Plain English, second person, concrete numbers.** "You keep $7,775", not "Significant savings are possible."
- **Show the math** in captions, and state the tax year and assumptions.
- **Hedge accurately:** "may be deductible", "up to", "rough estimate".
- **Every video ends with the site's disclaimer wording:** "Educational purposes only — not tax, legal, or financial advice."
- No lorem ipsum. No hype ("SHOCKING tax hack").

---

## 9. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `progress(frame, 12, dur.base, ease.out)` | `interpolate(frame, [12, 36], [0, 1])`. Linear. |
| `padding: space(4)`, `borderRadius: radius.sm` | `padding: 30`, `borderRadius: 999` |
| `color: p.accentText` | Raw hex in a scene, or gold anywhere |
| `p.cost` (redBright) for red on dark | Site `red` on deep pine (2.4:1) |
| Double rule under the one final total | Double rule under every number, or under a percentage that isn't a total |
| `<CountUp value={7775} format="currency" />` | `` {`$${Math.round(v)}`} `` |
| Sentence-case kicker: "The payroll-tax gap" | "THE PAYROLL-TAX GAP" with wide tracking |
| `tone: 'saving'` on the recommended option | Two `saving` bars, or `cost` for something good |
| `*one*` emphasis per headline, italic 500 | Bold italic; three emphasized words |
| Ledger rules, check boxes, form lines as visual metaphors | Coins, dollar-bill textures, stock photos |
| Alternate dark and light scenes | Three light scenes in a row |
| `offsetY: -88` under a planned LowerThird | A lower third over body text |
| Body ≥ 48px | 24px footnotes |

### Reference frames

Check these with `npx remotion still Demo out/x.png --frame=N`:

| Frame | Shows |
|---|---|
| 120 | Title |
| 315 | Kinetic type |
| 545 | Bars and double rule |
| 685 | Total callout |
| 915 | Light line chart |
| 1095 | Lower third |
| 1395 | Checklist |
| 1665 | Outro |

---

## 10. Short-form (9:16): Shorts, Reels, TikTok

Same brand, different viewing: a phone held at arm's length, sound often off, a thumb ready to swipe.
The kit renders every scene in 1080×1920 via `useLayout()`. These rules apply on top of §1–9.

### 10.1 Frame & safe zone (`SAFE_VERTICAL`)

| Inset | px | What's there |
|---|---|---|
| Top | 240 | Status bar, "Shorts"/"Reels" header, search and camera icons |
| Right | 144 | Like / comment / share / remix column |
| Bottom | 480 | Channel name, caption text, audio ticker, follow button, nav bar |
| Left | 144 | Mirrors the right inset, so centered content is truly centered |

This leaves a **792×1200 content box**, centered horizontally: the left inset mirrors the right one, so centered elements sit on the frame's center line. It's the union of the three platforms' UI, so one export works everywhere.
Backgrounds and transitions still fill the full frame.

### 10.2 Type (vertical sizes)

| Use | Size |
|---|---|
| Hook | 120 / 104 / 88 (by length) |
| Kinetic lines | 128 / 100 / 84 |
| Title card | 120 / 96 |
| Checklist title | 88 |
| Captions | Public Sans 700, 64 |
| Bar labels | 44 |
| Hero figures | auto-fit to 792px |

Minimums stay the same as §3.3; a phone screen is about as wide as the 1080px frame.

### 10.3 Pacing

- **Hook in the first second.** Open with `HookCard` (2–3s): one sentence with one number or one emphasized idea. No title card, no logo animation first.
- **Total 15–45s.** Each scene 2–7s. Transitions 20–24 frames.
- **One idea per scene,** fewer words than long-form: kinetic lines ≤ 5 words, checklists ≤ 4 items.
- **Captions:** use `CaptionTrack` for any voiceover. ≤ 7 words per cue, mint highlight on the spoken word,
  placed just above the bottom UI band. Never caption over chart labels.
- **End on `ShortCTA`** (3–5s): follow prompt plus a pointer to the long-form video.
  It ends on deep pine, which loops cleanly into a deep-pine hook.

### 10.4 Brand in vertical

- **Logo:** the horizontal tagline lock-up at full safe width (792px, so the tagline is about 24px) on the hook card, title card and end card.
  The stacked lock-up's spaced-caps tagline is too small on phones, so don't use it in video.
- **Corner logo:** off by default (platform UI covers the corners, and the channel name is already shown).
- **Double rule, ledger rules, palette and fonts:** unchanged. A Short must look like a clip from the long-form channel.

## 11. Sound

| Element | Rule |
|---|---|
| Voiceover | Volume 1.0, the loudest thing in the mix. Starts 0.3–0.5s after the first frame (`startAt`) so the hook animation lands first |
| Music bed | 0.22 in gaps, ducked to 0.07 under speech (timed from caption word timestamps). 1s fade-in, 2s fade-out. Calm, unobtrusive, no vocals |
| Captions | Always on for Shorts; recommended for long-form. Word-level timestamps preferred. Captions follow the voiceover file automatically |
| Loudness | Every final: −14 LUFS integrated, true peak ≤ −1 dBTP (`npm run final`). Never ship an un-normalised render |
| Length | Scenes set the video length. Size scenes to cover the voiceover; the render warns if captions run past the end |

---

## 12. Changing the system

1. If the website's tokens changed, mirror them in §2 and `tokens.ts` first.
2. Otherwise edit this file, then the matching token. Scenes read tokens, so most changes need no scene edits.
3. Re-render `Demo` and check the reference frames.
4. For style iteration, add a **prop** with the current look as its default, so existing videos render the same.

"""Single source for Video 7. Run `python3 video-07-sep-vs-solo-401k/build.py` to regenerate script.md, teaser-script.md,
narration/video-07*.json and videos/video-07*.json after editing the text below. Never hand-edit those outputs."""
import json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICE = {"provider": "elevenlabs", "name": "Kallen", "voiceId": "Pi2Zqk51cRysbs4RoCCF", "model": "eleven_v4"}
FPS = 30
# Channel bed (Video 1's seamless loop) until a dedicated video-02 bed is delivered.
MUSIC_BED = 'audio/music/video-01-bed.loop.wav'
WPS = 2.5

MAIN = [
 ("Cold open", "KineticType",
  {"lines": ["Same $100,000 profit.", "$24,500 more *room*."]},
  "Two self-employed owners. Same one hundred thousand dollars of profit. Both want to put as much as they can into retirement this year. One can contribute about eighteen thousand six hundred dollars. The other can put in about forty-three thousand. The only difference is which retirement plan they opened. Today we'll compare the two most common plans for owner-only businesses, and work out where that gap comes from.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 7 · Retirement", "title": "SEP IRA vs Solo 401(k): Which Saves You *More*?", "subtitle": "The 2026 limits, the math, and what else to weigh."},
  "This is Dollars and Deductions. Today: the SEP IRA versus the solo four oh one k. How each one works, the twenty twenty-six limits, the math at a few profit levels, and the things beyond the limits that should factor in. As always, this is education, not tax or investment advice, so run your own numbers with a professional before you open anything.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("Why it matters", "KineticType",
  {"lines": ["The deduction where", "the money stays *yours*."]},
  "First, why this matters. Back in our deductions episode, we called retirement contributions the deduction where the money stays yours. Traditional contributions to either plan are deductible this year, and they grow tax-deferred until you withdraw them in retirement, when they're taxed as income. So the plan you pick sets how much of that deduction you can actually use.",
  {"transition": {"style": "wipe"}}),
 ("The SEP IRA", "BulletBuild",
  {"kicker": "How a SEP works", "title": "The SEP IRA", "theme": "light", "items": [
     {"text": "Employer contributions only", "detail": "You contribute as the business"},
     {"text": "Up to 25% of pay", "detail": "About 20% of net profit if self-employed"},
     {"text": "Capped at $72,000", "detail": "For 2026"},
     {"text": "Open and fund by tax time", "detail": "Your filing deadline, with extensions"}]},
  "Let's start with the SEP IRA. SEP stands for simplified employee pension, and it lives up to the name. Only the business contributes. There's no employee contribution. The limit is twenty-five percent of pay, up to seventy-two thousand dollars for twenty twenty-six. And it's flexible on timing. You can open and fund a SEP as late as your tax filing deadline, including extensions.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The 20% detail", "KineticType",
  {"kicker": "If you're self-employed", "lines": ["25% of pay", "≈ *20%* of your profit."]},
  "One detail trips people up. If you're a sole proprietor or a single-member LLC, you don't get a paycheck, so pay is figured from your net profit, minus the deductible half of your self-employment tax. And because the contribution itself comes off that number, the math works out to about twenty percent of that adjusted profit, not twenty-five. That's the figure to use.",
  {"transition": {"style": "wipe"}}),
 ("The Solo 401(k)", "BulletBuild",
  {"kicker": "For owner-only businesses", "title": "The Solo 401(k)", "items": [
     {"text": "You wear two hats", "detail": "Employee and employer"},
     {"text": "Employee: up to $24,500", "detail": "Elective deferrals, 2026"},
     {"text": "Employer: the same ~20%", "detail": "As with a SEP"},
     {"text": "Combined cap: $72,000", "detail": "Plus catch-ups if eligible"}]},
  "Now the solo four oh one k. It's a regular four oh one k for a business with no employees besides the owner, and possibly a spouse. The key difference is that you contribute twice. As the employee, you can defer up to twenty-four thousand five hundred dollars in twenty twenty-six. And as the employer, you can add the same roughly twenty percent a SEP allows. Together, they're capped at seventy-two thousand dollars.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Catch-up contributions", "NumberCallout",
  {"kicker": "Age 50+ catch-up · Solo 401(k) only", "value": 8000, "doubleRule": False, "caption": "$11,250 at ages 60 through 63"},
  "There's one more piece. If you're fifty or older, a solo four oh one k lets you add a catch-up contribution of eight thousand dollars on top of that, and eleven thousand two hundred fifty if you're sixty through sixty-three. A SEP has no catch-up contributions at all.",
  {"transition": {"style": "iris"}}),
 ("The example", "NumberCallout",
  {"kicker": "Net profit, sole proprietor, 2026", "value": 100000, "doubleRule": False, "caption": "Under 50, no employees"},
  "Let's run the numbers. A sole proprietor, under fifty, no employees, with one hundred thousand dollars of net profit in twenty twenty-six.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("SEP math", "KineticType",
  {"kicker": "SEP IRA", "lines": ["$100,000 − $7,065 = $92,935", "× 20% = $18,587"]},
  "Start with the SEP. Self-employment tax on one hundred thousand dollars is about fourteen thousand one hundred thirty. Half of it, about seven thousand sixty-five, comes off profit. That leaves about ninety-two thousand, nine hundred thirty-five. Twenty percent of that is about eighteen thousand, five hundred eighty-seven dollars. That's the most this owner can put in a SEP.",
  {"transition": {"style": "wipe"}}),
 ("Solo 401(k) math", "KineticType",
  {"kicker": "Solo 401(k)", "lines": ["$24,500 + $18,587", "= $43,087"]},
  "Now the solo four oh one k. The employer side is the same eighteen thousand, five hundred eighty-seven. But this owner can also defer twenty-four thousand five hundred as the employee. Together, that's about forty-three thousand, eighty-seven dollars.",
  {"transition": {"style": "iris"}}),
 ("Side by side", "BarChart",
  {"kicker": "Maximum contribution on $100,000 of profit", "title": "About *$24,500* more room", "bars": [
     {"label": "SEP IRA", "caption": "Employer only", "value": 18587, "tone": "neutral"},
     {"label": "Solo 401(k)", "caption": "Employee + employer", "value": 43087, "tone": "saving"}],
   "difference": {"label": "Extra room"}},
  "Side by side: about eighteen thousand six hundred in the SEP, about forty-three thousand one hundred in the solo four oh one k. The gap is the twenty-four thousand five hundred dollar employee deferral, and at moderate profits, it's a big difference in how much you can shelter.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Room isn't a requirement", "KineticType",
  {"lines": ["More room", "isn't a *requirement*."]},
  "Keep one thing in mind. Room isn't an obligation. Forty-three thousand dollars out of a hundred thousand of profit is a lot to set aside, and you still owe income tax and self-employment tax on the year. In both plans, contributions are generally flexible from year to year. The solo four oh one k's advantage only matters if you actually have the cash to use it.",
  {"transition": {"style": "wipe"}}),
 ("Where they meet", "KineticType",
  {"kicker": "At higher profits", "lines": ["Both top out", "at *$72,000*."]},
  "And the gap doesn't last forever. As profit rises, both plans run into the same seventy-two thousand dollar ceiling. In our setup, the solo four oh one k reaches it at roughly two hundred fifty thousand dollars of profit. The SEP reaches it at roughly three hundred seventy-five thousand. Above that, the limits are the same, unless you're old enough for catch-ups, which only the four oh one k allows.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Side business example", "KineticType",
  {"kicker": "$40,000 side business, 2026", "lines": ["SEP: $7,435", "Solo 401(k): *$31,935*"]},
  "At the other end, smaller profits are where the gap matters most. Say you have a day job, plus a side business with forty thousand dollars of profit. A SEP allows about seven thousand four hundred. A solo four oh one k allows that, plus up to twenty-four thousand five hundred as the employee, about thirty-one thousand nine hundred. But here's the catch. The employee deferral limit is per person, not per plan. If you already defer into a four oh one k at your day job, that counts against the same twenty-four thousand five hundred. Defer ten thousand at work, and you have fourteen thousand five hundred left for the side business.",
  {"transition": {"style": "iris"}}),
 ("S corp owners", "KineticType",
  {"kicker": "If you're an S corp owner", "lines": ["It's based on", "your *salary*."]},
  "If your business is taxed as an S corp, the math changes. Contributions are based on your W-2 salary, not your distributions. Take the reasonable salary from our first episode, sixty-eight thousand dollars. A SEP allows twenty-five percent of it, seventeen thousand. A solo four oh one k allows that seventeen thousand plus the twenty-four thousand five hundred deferral, forty-one thousand five hundred. This is the retirement piece of the S corp math we flagged back then.",
  {"transition": {"style": "wipe"}}),
 ("Beyond the limits", "BulletBuild",
  {"kicker": "Beyond the limits", "title": "What else differs", "theme": "light", "items": [
     {"text": "Paperwork", "detail": "Solo 401(k): Form 5500-EZ over $250,000"},
     {"text": "Roth option", "detail": "Common in solo 401(k) plans"},
     {"text": "Loans", "detail": "A solo 401(k) can allow them; a SEP can't"},
     {"text": "Setup timing", "detail": "A SEP can wait until you file"}]},
  "The limits aren't the only difference. Paperwork: a SEP has almost none, while a solo four oh one k has to file Form fifty-five hundred E Z once plan assets pass two hundred fifty thousand dollars. Roth: many solo four oh one k plans let you make your employee deferrals as Roth contributions. Loans: a solo four oh one k can allow you to borrow from it, and a SEP can't. And setup timing, which deserves a closer look.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Roth or traditional", "KineticType",
  {"kicker": "If your plan offers Roth", "lines": ["Deduct now, or", "tax-free *later*?"]},
  "A quick word on that Roth option. Traditional contributions give you a deduction now, and you pay tax when you withdraw the money in retirement. Roth contributions work the other way. No deduction this year, but qualified withdrawals in retirement are tax-free. Which is better mostly comes down to whether you expect your tax rate to be higher now, or later. Some owners split the difference and do some of each.",
  {"transition": {"style": "wipe"}}),
 ("Timing", "KineticType",
  {"kicker": "Setup timing", "lines": ["A SEP can wait.", "A 401(k) needs *planning*."]},
  "A SEP can be opened and funded right up to your filing deadline, including extensions, which makes it the classic decide-it-in-April plan. A solo four oh one k has tighter rules, especially for the employee deferral, and those rules have changed in recent years. If you're considering one, look at it before the year ends, and confirm the current deadlines with your provider or tax professional.",
  {"transition": {"style": "wipe"}}),
 ("Employees change everything", "BulletBuild",
  {"kicker": "If you have employees", "title": "Employees change the math", "items": [
     {"text": "SEP", "detail": "Same percentage for eligible employees"},
     {"text": "Solo 401(k)", "detail": "Owner and spouse only"},
     {"text": "Hiring later?", "detail": "Plan for what the plan becomes"}]},
  "Everything so far assumes no employees. That's important. With a SEP, if you contribute twenty percent for yourself, you generally have to contribute the same percentage of pay for every eligible employee. And a solo four oh one k only works while the only participants are you and your spouse. Once you hire eligible employees, it has to become a regular four oh one k, with more rules. If you plan to hire, factor that in now. And for businesses with a few employees, there's a third option, the SIMPLE IRA, with lower limits and a required employer contribution. That's a comparison for another day.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Who each tends to fit", "BulletBuild",
  {"kicker": "Who each tends to fit", "title": "Matching the plan", "theme": "light", "items": [
     {"text": "Solo 401(k)", "detail": "Moderate profit, wants max room, 50+"},
     {"text": "SEP IRA", "detail": "Wants simplicity, decides late"},
     {"text": "Either", "detail": "Very high profit, both at the cap"}]},
  "So who does each tend to fit? A solo four oh one k tends to fit owners at moderate profit levels who want to shelter as much as possible, and owners fifty and older who can use catch-ups. A SEP tends to fit owners who value simplicity, or who don't decide until tax time. And at very high profits, where both hit the cap, the choice comes down to those other features.",
  {"transition": {"style": "wipe"}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["Solo 401(k): more *room*.", "SEP: more simplicity."]},
  "If you remember one thing from this video, make it this. For an owner-only business, the solo four oh one k almost always allows at least as much as a SEP, and often far more at moderate profits. The SEP wins on simplicity and timing. Which one saves you more depends on how much you can actually set aside, and when you decide.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Site + disclaimer", "KineticType",
  {"kicker": "More plain-English guides", "lines": ["dollarsanddeductions.com"]},
  "There are more plain-English guides on dollarsanddeductions.com. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, investment, or financial advice. These are twenty twenty-six limits, they change every year, and your situation is your own, so talk to a qualified professional before you open or fund a plan.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "LLC Taxes Explained"},
  "Thanks for watching Dollars and Deductions. Next time: LLC taxes, explained. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "Retirement", "text": "Same profit. *$24,500* more retirement room."},
  "Two self-employed owners, same one hundred thousand dollars of profit. One can put about twenty-four thousand five hundred dollars more into retirement this year. Here's exactly why.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("SEP", "NumberCallout",
  {"kicker": "SEP IRA, $100,000 profit", "value": 18587, "doubleRule": False, "caption": "About 20% of adjusted profit"},
  "A SEP IRA lets the business contribute about twenty percent of adjusted profit. On a hundred thousand, that's about eighteen thousand six hundred.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("Solo 401(k)", "BarChart",
  {"kicker": "2026 maximums", "title": "Two hats, more *room*", "bars": [
     {"label": "SEP", "caption": "Employer only", "value": 18587, "tone": "neutral"},
     {"label": "Solo 401(k)", "caption": "+ $24,500 deferral", "value": 43087, "tone": "saving"}]},
  "A solo four oh one k allows that same amount, plus up to twenty-four thousand five hundred as the employee. That's about forty-three thousand.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("The trade-off", "KineticType",
  {"lines": ["SEP:", "*simpler*,", "and it can wait."]},
  "The SEP's edge is simplicity, and you can open it as late as your filing deadline. But with employees, the math changes completely.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "SEP IRA vs Solo 401(k): Which Saves You More?"},
  "The full comparison, with the math, is on the channel. Educational only, not tax or investment advice.",
  {}),
]

def frames_for(text, start):
    words = len(text.split())
    return math.ceil((start + words / WPS + 0.6) * FPS)

def build(slug, scenes, vertical):
    spec_scenes, segs = [], []
    for i, (label, typ, props, text, ex) in enumerate(scenes, 1):
        start = ex.get('startSec', 0.3)
        sc = {"type": typ, "durationInFrames": frames_for(text, start), "props": props}
        if 'transition' in ex: sc['transition'] = ex['transition']
        if 'overlays' in ex: sc['overlays'] = ex['overlays']
        spec_scenes.append(sc)
        seg = {"scene": i, "type": typ}
        if 'startSec' in ex: seg['startSec'] = start
        seg['text'] = text
        segs.append(seg)
    # Keep what later pipeline steps wrote: fitted scene lengths (narration-fit),
    # explicit startSec, and the captions/music slots. Text edits still need new audio + refit + re-timed captions.
    spec_path, man_path = ROOT / 'videos' / f'{slug}.json', ROOT / 'narration' / f'{slug}.json'
    if spec_path.exists():
        old = json.loads(spec_path.read_text())
        for new_sc, old_sc in zip(spec_scenes, old.get('scenes', [])):
            if old_sc.get('type') == new_sc['type']:
                new_sc['durationInFrames'] = max(new_sc['durationInFrames'], old_sc.get('durationInFrames', 0))
    if man_path.exists():
        old_segs = {x['scene']: x for x in json.loads(man_path.read_text()).get('segments', [])}
        for seg in segs:
            if 'startSec' in old_segs.get(seg['scene'], {}) and 'startSec' not in seg:
                seg['startSec'] = old_segs[seg['scene']]['startSec']
            seg_order = ['scene', 'type', 'startSec', 'text']
            seg_items = sorted(seg.items(), key=lambda kv: seg_order.index(kv[0]) if kv[0] in seg_order else 9)
            seg.clear(); seg.update(seg_items)
    spec = {
        "composition": "Short" if vertical else "Episode",
        "narration": slug,
        "captions": {"src": f"captions/{slug}.srt"},
        # Music bed: see MUSIC_BED above.
        "audio": {"music": {"src": MUSIC_BED, "volume": 0.22, "duckTo": 0.07}},
        "scenes": spec_scenes,
    }
    manifest = {"video": slug, "voice": VOICE, "segments": segs}
    for path, obj in [(spec_path, spec), (man_path, manifest)]:
        path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + '\n')
    return sum(len(s['text']) for s in segs), sum(s['durationInFrames'] for s in spec_scenes) / FPS

def md(title, slug, scenes, chars, secs, fmt, extra_top, extra_bottom):
    out = [f"# {title}", "", *extra_top, "",
           f"| | |", "|---|---|",
           f"| Format | {fmt} |",
           f"| Narration | {chars:,} characters (ElevenLabs bills per character) |",
           f"| Est. runtime | ~{secs/60:.1f} min at ~150 wpm (scenes stretch to the real audio) |",
           f"| Voice | {VOICE['name']} · `{VOICE['voiceId']}` · `{VOICE['model']}` |",
           f"| Manifest | `narration/{slug}.json` (generated from the same source; text is identical) |",
           f"| Video spec | `videos/{slug}.json` |", "", "---", ""]
    for i, (label, typ, props, text, ex) in enumerate(scenes, 1):
        out.append(f"### {i:02d} · {label}  `{typ}`")
        on = []
        if props.get('kicker'): on.append(props['kicker'])
        if props.get('title'): on.append(props['title'].replace('*', ''))
        if props.get('text'): on.append(props['text'].replace('*', ''))
        if props.get('lines'): on.extend((l['text'] if isinstance(l, dict) else l).replace('*', '') for l in props['lines'])
        if props.get('items'): on.extend('☑ ' + it['text'] for it in props['items'])
        if props.get('bars'): on.extend(f"{b['label']}: ${b['value']:,}" for b in props['bars'])
        if typ == 'NumberCallout':
            v = props['value']; on.append(f"{v}%" if props.get('format') == 'percent' else f"{props.get('prefix', '')}${v:,}")
            if props.get('caption'): on.append(props['caption'])
        if typ == 'OutroCard': on.append(f"Up next: {props['nextTitle']}")
        if typ == 'ShortCTA': on.append(f"Follow · Full breakdown: {props['fullVideoTitle']}")
        for o in ex.get('overlays', []): on.append(f"Lower third: {o['props']['title']}: {o['props']['subtitle']}")
        out.append(f"*On screen:* {' / '.join(on)}")
        out.append("")
        out.append(f"> {text}")
        out.append(f"<sub>{len(text):,} chars</sub>")
        out.append("")
    out += ["---", "", *extra_bottom]
    return "\n".join(out) + "\n"

if __name__ == '__main__':
    main_chars, main_secs = build('video-07', MAIN, False)
    t_chars, t_secs = build('video-07-teaser', TEASER, True)
    d = ROOT / 'video-07-sep-vs-solo-401k'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "There's no site article on this comparison; it agrees with the deductions guide (/small-business-tax-deductions/: SEP \"simple to set up, limits scale with income\"; Solo 401(k) \"employer and employee contributions, usually the highest limits\"; \"the money stays yours\") and with /s-corp-vs-llc/ and Video 1 (S corp retirement limits depend on salary). Limits are 2026, from IRS Notice 2025-67.",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| 401(k) elective deferral | **$24,500** | Notice 2025-67, IRC §402(g) |",
      "| Annual additions cap | **$72,000** | Notice 2025-67, IRC §415(c) |",
      "| Catch-ups (401(k) only) | **$8,000** at 50+; **$11,250** at 60–63 | Notice 2025-67; IRC §414(v); SEPs have no catch-up |",
      "| Compensation cap | $360,000 (= the base at which the SEP hits $72,000) | Notice 2025-67, IRC §401(a)(17) |",
      "| SEP rate | 25% of compensation; for the self-employed, 20% of (net profit − ½ SE tax) | IRC §404(h), §402(h); IRS Pub. 560 rate table |",
      "| SEP deadline | Established and funded by the filing deadline incl. extensions | Pub. 560; Form 5305-SEP |",
      "| Example, $100,000 | SE tax $14,129.55; half $7,064.77; base $92,935.23; × 20% = **$18,587.05**; + $24,500 = **$43,087.04**; gap $24,500 | Schedule SE; wage base $184,500 not reached |",
      "| Solo 401(k) reaches $72,000 | Base $237,500 (= $47,500 / 20%) → profit ≈ **$252,300** (\"roughly $250,000\") | SE tax with the 2026 wage base ($184,500) |",
      "| SEP reaches $72,000 | Base $360,000 → profit ≈ **$376,500** (\"roughly $375,000\") | Same |",
      "| Example, $40,000 side business | SE tax $5,651.82; half $2,825.91; base $37,174.09; × 20% = **$7,434.82**; + $24,500 = **$31,934.82**. Deferral fits: base − employer contribution = $29,739 ≥ $24,500 | Same method as the $100,000 example; deferrals can't exceed earned income (IRC §415(c)(1)(B)) |",
      "| Deferral limit is per person | $24,500 is shared across every 401(k) (and 403(b)) the person defers into, day job included; $24,500 − $10,000 = **$14,500** left | IRC §402(g)(1); Pub. 560. Employer contributions from unrelated employers have separate §415(c) limits (not discussed) |",
      "| S corp, $68,000 salary | SEP 25% = **$17,000**; Solo 401(k) $17,000 + $24,500 = **$41,500** | W-2 wages only; distributions aren't compensation. Salary from Video 1 (illustrative) |",
      "| Form 5500-EZ | Required once one-participant plan assets exceed $250,000 | Form 5500-EZ instructions |",
      "| Loans | 401(k) may permit; IRAs (incl. SEP) can't | IRC §72(p), §408(e) |",
      "| Employees | SEP: same % for eligible employees; Solo 401(k): owner (and spouse) only | Pub. 560 |",
      "",
      "Deliberately general: Solo 401(k) establishment and deferral-election deadlines (changed by the SECURE Acts; the script says to confirm the current deadlines), Roth SEP availability, and the Roth-catch-up rule for high W-2 earners.",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. The disclaimer adds \"investment\" advice, since this video touches retirement accounts.",
      "- Segment 12 makes the point that more room isn't a recommendation to contribute it.",
      "- Segments 03 and 15 reference the deductions episode and \"our first episode\" (Videos 2 and 1).",
      "- Spoken disclaimer in segment 22, early educational note in segment 02, on-screen disclaimer on the outro card.",
    ]
    (d / 'script.md').write_text(md(
        "SEP IRA vs Solo 401(k): Which Saves You More?", 'video-07', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 7 · full narration script. Structure: cold open (same profit, $24,500 apart) → how each plan works, with 2026 limits → the $100,000 example → where they converge → the $40,000 side business, and the per-person deferral limit → S corp owners → paperwork, Roth, loans, timing → employees → who each fits → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · SEP IRA vs Solo 401(k) (Shorts / Reels)", 'video-07-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook ($24,500 more room) → the SEP number → the Solo 401(k) number → the SEP's edge → \"full comparison on the channel\".",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["Math matches the main video: $100,000 profit → SEP $18,587, Solo 401(k) $43,087 (2026). See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

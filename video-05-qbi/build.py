"""Single source for Video 5. Run `python3 video-05-qbi/build.py` to regenerate script.md, teaser-script.md,
narration/video-05*.json and videos/video-05*.json after editing the text below. Never hand-edit those outputs."""
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
  {"lines": ["A deduction", "you don't have to *spend* for."]},
  "Almost every business deduction starts with spending money. You buy the equipment, you pay for the mileage, you fund the retirement account. But there's one big deduction that doesn't work that way. If you own a pass-through business, you may be able to deduct up to twenty percent of your business income, just for earning it. It's called the qualified business income deduction, and a lot of owners don't really know how it's figured.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 5 · QBI", "title": "The QBI Deduction, *Explained*", "subtitle": "Who gets it, how it's figured, and the limits that matter."},
  "This is Dollars and Deductions. Today: the QBI deduction. Who gets it, how it's actually calculated, what changed for twenty twenty-six, and the limits that kick in at higher incomes. As always, this is education, not tax advice. The rules here have real complexity, so check your own numbers with a tax professional.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("What it is", "KineticType",
  {"kicker": "Section 199A", "lines": ["Up to *20%*", "of qualified business income."], "offsetY": -88},
  "Here's the short version. The QBI deduction, from section one ninety-nine A of the tax code, lets owners of pass-through businesses deduct up to twenty percent of their qualified business income. Qualified business income, or QBI, is basically the net profit from your business, with a few adjustments we'll get to. Pass-through means the business's profit flows onto your personal return, instead of being taxed at the business level.",
  {"overlays": [{"type": "LowerThird", "from": 90, "durationInFrames": 300, "props": {"title": "QBI Deduction", "subtitle": "Section 199A pass-through deduction"}}], "transition": {"style": "wipe"}}),
 ("Why it exists", "KineticType",
  {"kicker": "Why it exists", "lines": ["Corporations got 21%.", "Pass-throughs got *this*."]},
  "Why does this deduction exist? In twenty seventeen, Congress cut the corporate tax rate to a flat twenty-one percent. But most small businesses aren't C corporations. Their profit is taxed on the owners' personal returns, at personal rates, which can run well above twenty-one percent. The QBI deduction was created at the same time, to give pass-through owners a break of their own. It was meant to be temporary. We'll get to what changed in a moment.",
  {"transition": {"style": "iris"}}),
 ("Who qualifies", "BulletBuild",
  {"kicker": "Who can claim it", "title": "Pass-through owners", "theme": "light", "items": [
     {"text": "Sole proprietors", "detail": "Including single-member LLCs"},
     {"text": "Partners", "detail": "Including multi-member LLCs"},
     {"text": "S corp owners", "detail": "On their share of the profit"},
     {"text": "Not C corporations", "detail": "They pay their own corporate tax"}]},
  "So who can claim it? Sole proprietors, including single-member LLCs taxed the default way. Partners in a partnership, including most multi-member LLCs. And S corp shareholders, on their share of the company's profit. What's left out is the C corporation. It pays its own corporate income tax, so its owners don't get this deduction on the business's profit.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("How it's taken", "KineticType",
  {"kicker": "On your personal return", "lines": ["Lowers *income tax*.", "Not self-employment tax."]},
  "A few things about how it's taken. You claim it on your personal return. You don't have to itemize to get it, so it works alongside the standard deduction. It lowers your taxable income, which lowers your income tax. But it doesn't lower your self-employment tax. That's still figured on your full net earnings, the same way we covered in our first episode.",
  {"transition": {"style": "wipe"}}),
 ("New for 2026", "BulletBuild",
  {"kicker": "What changed for 2026", "title": "Now permanent", "items": [
     {"text": "No expiration date", "detail": "It was set to end after 2025"},
     {"text": "A $400 minimum", "detail": "With at least $1,000 of active QBI"},
     {"text": "Wider phase-in ranges", "detail": "$75,000 single, $150,000 joint"}]},
  "Some news for twenty twenty-six. This deduction was originally set to expire after twenty twenty-five. The tax law passed in twenty twenty-five made it permanent. It also added a minimum deduction of four hundred dollars, for owners who materially participate in a business with at least one thousand dollars of QBI. And it widened the income ranges where the limits for higher earners phase in. We'll get to those.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("What counts as QBI", "BulletBuild",
  {"kicker": "What counts as QBI", "title": "Business profit, not everything", "theme": "light", "items": [
     {"text": "Counts: net business profit", "detail": "From a U.S. trade or business"},
     {"text": "Doesn't: your S corp salary", "detail": "Wages aren't QBI"},
     {"text": "Doesn't: guaranteed payments", "detail": "Paid to partners for services"},
     {"text": "Doesn't: investment income", "detail": "Capital gains, dividends, interest"}]},
  "Now, what actually counts as QBI? The net profit from a trade or business in the United States. What doesn't count: wages, including the salary your own S corp pays you. Guaranteed payments a partnership pays you for your services. And investment income, like capital gains, dividends, and most interest. Those are taxed normally, without the twenty percent deduction.",
  {"transition": {"style": "wipe"}}),
 ("QBI adjustments", "BulletBuild",
  {"kicker": "Then, a few subtractions", "title": "QBI is profit, minus", "items": [
     {"text": "The deductible half of SE tax", "detail": "From your personal return"},
     {"text": "Self-employed health insurance", "detail": "If you take that deduction"},
     {"text": "Retirement contributions", "detail": "Tied to the business"}]},
  "And one more step. QBI is your business profit minus a few deductions that come from the business but are taken on your personal return. The deductible half of your self-employment tax. Your self-employed health insurance deduction, if you take it. And retirement contributions connected to the business, like a SEP IRA. That's why QBI usually comes out a bit lower than your profit.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The simple version", "NumberCallout",
  {"kicker": "$100,000 of QBI × 20%", "value": 20000, "doubleRule": False, "caption": "If the full 20% applies"},
  "Here's the simple version. If you have one hundred thousand dollars of QBI, and the full twenty percent applies, your deduction is twenty thousand dollars. In the twenty-two percent bracket, that's worth about forty-four hundred dollars of income tax. But notice the if. There's a cap, and for a lot of owners, it's the cap that decides the number.",
  {"transition": {"style": "iris"}}),
 ("The taxable income cap", "KineticType",
  {"kicker": "The cap", "lines": ["No more than 20%", "of your *taxable income*."]},
  "The deduction can't be more than twenty percent of your taxable income, figured before the QBI deduction itself, and leaving out net capital gains. If most of your income comes from the business, your taxable income is lower than your QBI, because the standard deduction comes off first. So this cap often wins. Let's see it with real numbers.",
  {"transition": {"style": "wipe"}}),
 ("The example", "NumberCallout",
  {"kicker": "Net business profit", "value": 80000, "doubleRule": False, "caption": "A single filer, no other income, 2026"},
  "Our example: a single filer with a sole proprietorship that nets eighty thousand dollars in twenty twenty-six. No other income, no health insurance or retirement deductions, and the standard deduction of sixteen thousand one hundred dollars.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Step 1: 20% of QBI", "KineticType",
  {"kicker": "Step 1 · 20% of QBI", "lines": ["$80,000 − $5,652 = $74,348", "× 20% = $14,870"]},
  "Step one. Self-employment tax on eighty thousand dollars is about eleven thousand three hundred. Half of that, about fifty-six hundred fifty-two dollars, is deductible, and it comes off QBI. So QBI is about seventy-four thousand, three hundred forty-eight dollars. Twenty percent of that is about fourteen thousand, eight hundred seventy.",
  {"transition": {"style": "wipe"}}),
 ("Step 2: 20% of taxable income", "KineticType",
  {"kicker": "Step 2 · 20% of taxable income", "lines": ["$74,348 − $16,100 = $58,248", "× 20% = $11,650"]},
  "Step two, the cap. Taxable income before the QBI deduction is that same seventy-four thousand, three hundred forty-eight, minus the sixteen thousand one hundred dollar standard deduction. That's about fifty-eight thousand, two hundred forty-eight. Twenty percent of that is about eleven thousand, six hundred fifty dollars.",
  {"transition": {"style": "iris"}}),
 ("The smaller number wins", "BarChart",
  {"kicker": "$80,000 of profit, single filer", "title": "The *smaller* number wins", "bars": [
     {"label": "20% of QBI", "caption": "Step 1", "value": 14870, "tone": "neutral"},
     {"label": "20% of taxable income", "caption": "Step 2: the cap", "value": 11650, "tone": "saving"}],
   "difference": {"label": "Lost to the cap"}},
  "The deduction is the smaller of the two. So our owner deducts about eleven thousand, six hundred fifty dollars, not fourteen thousand, eight hundred seventy. Still a meaningful deduction for doing nothing but earning a profit. Just not the full twenty percent of the business income.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The threshold", "NumberCallout",
  {"kicker": "2026 taxable income threshold, single", "value": 201750, "doubleRule": False, "caption": "$403,500 if married filing jointly"},
  "Everything so far is the simple version, and it applies as long as your taxable income is under a threshold. For twenty twenty-six, that's two hundred one thousand, seven hundred fifty dollars for single filers, and four hundred three thousand, five hundred for married couples filing jointly. Above it, two extra limits start to apply.",
  {"transition": {"style": "wipe"}}),
 ("Above the threshold", "BulletBuild",
  {"kicker": "Above the threshold", "title": "Two extra limits", "theme": "light", "items": [
     {"text": "A wage and property limit", "detail": "50% of W-2 wages, or 25% plus 2.5% of property"},
     {"text": "Phases in over $75,000", "detail": "$150,000 if married filing jointly"},
     {"text": "Service businesses phase out", "detail": "To zero at the top of the range"}]},
  "The first is a wage and property limit. The deduction can't be more than the greater of fifty percent of the W-2 wages the business pays, or twenty-five percent of those wages plus two and a half percent of the original cost of its business property. That limit phases in over the next seventy-five thousand dollars of taxable income, or one hundred fifty thousand if you're married filing jointly. The second limit is for service businesses.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Specified service businesses", "KineticType",
  {"kicker": "Specified service businesses", "lines": ["Above $276,750 single,", "no deduction at all."], "offsetY": -88},
  "The tax code calls them specified service trades or businesses. That includes fields like health, law, accounting, consulting, financial services, athletics, and the performing arts. Engineering and architecture are specifically left out of the list. Below the threshold, service businesses get the deduction like anyone else. But across the phase-in range it shrinks, and above two hundred seventy-six thousand, seven hundred fifty dollars for single filers, or five hundred fifty-three thousand, five hundred joint, it's gone.",
  {"overlays": [{"type": "LowerThird", "from": 90, "durationInFrames": 300, "props": {"title": "SSTB", "subtitle": "Specified service trade or business"}}], "transition": {"style": "wipe"}}),
 ("The S corp connection", "KineticType",
  {"kicker": "Back to Episode 1", "lines": ["Your S corp salary", "isn't *QBI*."]},
  "This also connects back to our first episode. If you're an S corp owner, the reasonable salary you pay yourself isn't QBI. Only the profit left after that salary is. So the S corp election that lowers your payroll taxes can also shrink your QBI deduction. That doesn't mean pay yourself less. The salary has to be reasonable either way. It means the S corp math should always be run with the QBI deduction included.",
  {"transition": {"style": "iris"}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["Below the threshold, it's *simple*.", "Above it, get help."]},
  "If you remember one thing from this video, make it this. Below the threshold, the QBI deduction is fairly simple: twenty percent of your QBI, or twenty percent of your taxable income, whichever is smaller. It's claimed on Form eighty-nine ninety-five. Above the threshold, wages, property, and the type of business all come into play, on the longer Form eighty-nine ninety-five A. That's where professional help tends to earn its fee.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Site + disclaimer", "KineticType",
  {"kicker": "More plain-English guides", "lines": ["dollarsanddeductions.com"]},
  "There are more plain-English guides on dollarsanddeductions.com. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. The figures here are for twenty twenty-six, they change with inflation, and your situation is your own, so talk to a qualified tax professional before you rely on them.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "Quarterly Estimated Taxes: The Complete Walkthrough"},
  "Thanks for watching Dollars and Deductions. Next time: quarterly estimated taxes, the complete walkthrough. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "QBI deduction", "text": "Deduct up to *20%* of your business income."},
  "Most deductions start with spending money. This one doesn't. If you own a pass-through business, you may be able to deduct up to twenty percent of your business income.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("The catch", "KineticType",
  {"lines": [{"text": "The smaller of", "size": "md"}, {"text": "20% of QBI", "size": "md"}, {"text": "or 20% of", "size": "md"}, {"text": "*taxable income*.", "size": "md"}]},
  "It's called the QBI deduction. But it's capped at twenty percent of your taxable income, so if most of your income is from the business, the cap usually decides.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("The example", "BarChart",
  {"kicker": "$80,000 profit, single, 2026", "title": "The *smaller* wins", "bars": [
     {"label": "20% of QBI", "caption": "Step 1", "value": 14870, "tone": "neutral"},
     {"label": "The cap", "caption": "Step 2", "value": 11650, "tone": "saving"}]},
  "On eighty thousand dollars of profit, twenty percent of QBI is about fourteen thousand, eight hundred seventy. The cap is about eleven thousand, six hundred fifty. The smaller one wins.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("Above the threshold", "KineticType",
  {"lines": ["Over $201,750?", "New limits *apply*."]},
  "And above two hundred one thousand, seven hundred fifty dollars of taxable income for single filers, extra limits kick in.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "The QBI Deduction, Explained"},
  "The full walkthrough, step by step, is on the channel. Educational only, not tax advice.",
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
    main_chars, main_secs = build('video-05', MAIN, False)
    t_chars, t_secs = build('video-05-teaser', TEASER, True)
    d = ROOT / 'video-05-qbi'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "There's no dollarsanddeductions.com article on QBI yet, so every rule comes from the statute and IRS guidance, checked against current (2026) law. It agrees with the site where they overlap: /s-corp-vs-llc/ (SE tax figured on 92.35% of profit; S corp salary vs distributions) and Video 1 (\"the QBI deduction can shrink when profit is paid as salary\").",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| Origin | Enacted in the 2017 tax act (TCJA) alongside the 21% flat corporate rate; originally scheduled to expire after 2025 | P.L. 115-97 §11011, §13001 |",
      "| Deduction | Up to 20% of QBI; pass-throughs only; not C corps | IRC §199A; IRS Form 8995 / 8995-A instructions |",
      "| How it's taken | Below-the-line: not itemized, doesn't reduce AGI or SE tax | IRC §62(a), §63(b)(3), §199A; SE tax computed on Schedule SE before it |",
      "| Permanent; $400 minimum; wider phase-in | OBBBA (P.L. 119-21) §70105: no sunset; §199A(i) $400 minimum with ≥ $1,000 QBI from active (materially participating) businesses, tax years after 2025; phase-in $75,000 / $150,000 | OBBBA §70105 |",
      "| Not QBI | Wages (incl. S corp owner salary), guaranteed payments, capital gains, dividends, most interest | IRC §199A(c)(3)–(4) |",
      "| Adjustments | QBI reduced by deductible half of SE tax, SE health insurance, retirement contributions attributable to the business | Treas. Reg. §1.199A-3(b)(1)(vi) |",
      "| Simple version | $100,000 × 20% = **$20,000**; × 22% ≈ **$4,400** | Arithmetic; explicitly \"if the full 20% applies\" |",
      "| Cap | 20% × (taxable income before QBI deduction − net capital gain) | IRC §199A(a)(1)(B) |",
      "| 2026 standard deduction (single) | **$16,100** | Rev. Proc. 2025-32 |",
      "| Example, step 1 | SE tax: $80,000 × 0.9235 × 0.153 = $11,303.64; half = $5,651.82; QBI = $74,348.18; × 20% = **$14,869.64** (\"about $14,870\") | Schedule SE; the site's /s-corp-vs-llc/ quotes \"roughly $11,300\" for the same $80,000 |",
      "| Example, step 2 | Taxable income = $80,000 − $5,651.82 − $16,100 = $58,248.18; × 20% = **$11,649.64** (\"about $11,650\") | IRC §199A(a)(1)(B) |",
      "| Example result | min($14,870, $11,650) = **$11,650**; gap $3,220 | |",
      "| 2026 threshold | **$201,750** single / **$403,500** MFJ; phase-in ends **$276,750** / **$553,500** | Rev. Proc. 2025-32; + $75,000 / $150,000 |",
      "| Wage/property limit | Greater of 50% of W-2 wages, or 25% of W-2 wages + 2.5% of UBIA of qualified property | IRC §199A(b)(2)(B) |",
      "| SSTBs | Health, law, accounting, actuarial science, performing arts, consulting, athletics, financial and brokerage services, investing/trading; engineering and architecture excluded; full deduction below threshold, zero above phase-in | IRC §199A(d)(2), §1202(e)(3)(A); Treas. Reg. §1.199A-5 |",
      "| Forms | 8995 (simplified, below threshold); 8995-A (above) | IRS |",
      "",
      "The example deliberately has no other income and no health-insurance or retirement adjustments, and the script says so. Figures are 2026 and inflation-adjusted yearly; the disclaimer says so.",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. Framing is \"may be able to\", \"tends to\", \"check your own numbers with a tax professional\".",
      "- The S corp scene (19) says explicitly not to lower salary for QBI's sake; the salary must be reasonable either way (consistent with Video 1 and /s-corp-vs-llc/).",
      "- Segments 06 and 19 reference \"our first episode\" (Video 1).",
      "- Spoken disclaimer in segment 21, early educational note in segment 02, on-screen disclaimer on the outro card.",
    ]
    (d / 'script.md').write_text(md(
        "The QBI Deduction, Explained", 'video-05', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 5 · full narration script. Structure: cold open → what it is and who gets it → what's new for 2026 → what counts as QBI → the simple version → the cap, with a worked $80,000 example → thresholds, wage limit, service businesses → the S corp connection → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · The QBI Deduction (Shorts / Reels)", 'video-05-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook (a deduction you don't spend for) → the cap → the $80,000 example → the threshold → \"full walkthrough on the channel\".",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["Math matches the main video: $80,000 profit, single, 2026 → 20% of QBI $14,870 vs cap $11,650. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

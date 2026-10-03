"""Single source for Video 6. Run `python3 video-06-estimated-taxes/build.py` to regenerate script.md, teaser-script.md,
narration/video-06*.json and videos/video-06*.json after editing the text below. Never hand-edit those outputs."""
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
  {"lines": ["Nobody withholds", "from your *profit*."]},
  "When you had a regular job, taxes came out of every paycheck, and you barely had to think about it. Then you started a business, and nobody withholds anything from your profit. A lot of new owners don't find that out until April, when they owe the whole year's tax at once, plus a penalty for paying late. Quarterly estimated taxes are how you avoid that. Here's the whole system, start to finish.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 6 · Estimated taxes", "title": "Quarterly Estimated Taxes: The *Complete* Walkthrough", "subtitle": "Who pays, when, how much, and how to stay penalty-free."},
  "This is Dollars and Deductions. Today: who has to pay estimated taxes, the four due dates, how to figure the amount, the safe harbor rules that protect you from penalties, and how to actually pay. As always, this is education, not tax advice. Your numbers are your own, so check them with a tax professional.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("Pay as you go", "KineticType",
  {"kicker": "The basic rule", "lines": ["The tax system is", "*pay as you go*."]},
  "Start with the basic rule. The federal tax system is pay as you go. The IRS expects to receive your tax during the year, as you earn the income, not all at once when you file. For employees, withholding takes care of it. When you work for yourself, you're expected to send it in yourself, in four installments called estimated tax payments.",
  {"transition": {"style": "wipe"}}),
 ("Who has to pay", "NumberCallout",
  {"kicker": "If you expect to owe", "value": 1000, "doubleRule": False, "caption": "or more, after withholding and credits"},
  "So who has to pay? Generally, anyone who expects to owe one thousand dollars or more in federal tax for the year, after subtracting withholding and credits. The payments are made using Form ten forty E S. If you're a sole proprietor, a single-member LLC, a partner, or an S corp owner taking distributions, there's a good chance that's you.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("What's included", "BulletBuild",
  {"kicker": "What the payments cover", "title": "It's more than income tax", "theme": "light", "items": [
     {"text": "Income tax", "detail": "On your business profit and other income"},
     {"text": "Self-employment tax", "detail": "Social Security and Medicare, 15.3%"},
     {"text": "Minus withholding and credits", "detail": "Anything already paid in"}]},
  "And here's what catches people: estimated payments cover more than income tax. They also cover self-employment tax, the fifteen point three percent for Social Security and Medicare that we walked through in episode one. For a lot of small business owners, the self-employment tax is the bigger of the two. From that total, you subtract any withholding, from a job or a spouse's job, and any credits.",
  {"transition": {"style": "wipe"}}),
 ("The four due dates", "BulletBuild",
  {"kicker": "For the 2026 tax year", "title": "The four due dates", "items": [
     {"text": "April 15, 2026", "detail": "Income from January through March"},
     {"text": "June 15, 2026", "detail": "April and May"},
     {"text": "September 15, 2026", "detail": "June through August"},
     {"text": "January 15, 2027", "detail": "September through December"}]},
  "Here are the four due dates for the twenty twenty-six tax year. April fifteenth, June fifteenth, and September fifteenth, twenty twenty-six. And the last one, January fifteenth, twenty twenty-seven. When a date falls on a weekend or a legal holiday, it moves to the next business day. If you're watching this in the fall, that January payment is the next one up.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Not actually quarterly", "KineticType",
  {"lines": ["Two months.", "Four months.", "*Not* really quarterly."]},
  "And notice something odd. The periods aren't equal. The June payment covers just two months, April and May. The January payment covers four, September through December. So quarterly estimated taxes aren't really quarterly. If your income is seasonal, that uneven calendar matters, and we'll come back to it.",
  {"transition": {"style": "iris"}}),
 ("The example", "NumberCallout",
  {"kicker": "Expected 2026 profit", "value": 80000, "doubleRule": False, "caption": "A single filer, no other income"},
  "Now let's figure an amount. Same owner as our QBI episode: a single filer with a sole proprietorship that expects to net eighty thousand dollars in twenty twenty-six, with no other income and the standard deduction.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The year's tax", "KineticType",
  {"kicker": "Estimated federal tax for the year", "lines": ["SE tax ≈ $11,304", "+ income tax ≈ $5,344", "= $16,648"]},
  "Self-employment tax on eighty thousand dollars is about eleven thousand three hundred four. Income tax, after the deduction for half of the self-employment tax, the standard deduction, and the QBI deduction, comes to about fifty-three hundred forty-four. Together, that's about sixteen thousand, six hundred forty-eight dollars of federal tax for the year.",
  {"transition": {"style": "wipe"}}),
 ("Per quarter", "NumberCallout",
  {"kicker": "$16,648 ÷ 4 payments", "value": 4162, "doubleRule": False, "caption": "Each of the four payments"},
  "Divide that by four, and the payment is about four thousand, one hundred sixty-two dollars each time. That's the straightforward method: estimate the year, and pay a quarter of it on each date. The catch, of course, is that it's an estimate. If your profit comes in higher than you expected, your estimate was too low.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Safe harbors", "BulletBuild",
  {"kicker": "Avoiding the penalty", "title": "The safe harbors", "theme": "light", "items": [
     {"text": "90% of this year's tax", "detail": "Paid on time, in installments"},
     {"text": "Or 100% of last year's tax", "detail": "From last year's return"},
     {"text": "110% above $150,000 of AGI", "detail": "Last year's AGI; $75,000 if filing separately"}]},
  "That's where the safe harbors come in. You generally avoid the underpayment penalty if your withholding and on-time estimated payments add up to at least ninety percent of this year's tax. Or one hundred percent of last year's tax, as long as last year was a full twelve-month tax year. That second one becomes one hundred ten percent if last year's adjusted gross income was over one hundred fifty thousand dollars.",
  {"transition": {"style": "wipe"}}),
 ("Safe harbor example", "KineticType",
  {"kicker": "Using last year's number", "lines": ["Last year's tax: $12,000", "÷ 4 = $3,000 a payment."]},
  "The prior-year safe harbor is the easy one, because the number is already on last year's return. Say our owner's total tax last year was twelve thousand dollars, and their income was under the one hundred fifty thousand dollar line. Four payments of three thousand dollars covers one hundred percent of it. Even if this year's tax turns out to be sixteen thousand, six hundred forty-eight, there's generally no underpayment penalty.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Safe isn't free", "NumberCallout",
  {"kicker": "Still due in April", "value": 4648, "caption": "$16,648 − $12,000 paid during the year"},
  "But safe from penalties doesn't mean nothing is owed. The difference, about forty-six hundred forty-eight dollars, is still due when you file in April. The safe harbor protects you from the penalty, not from the bill. So if you use it in a growing year, set the extra aside as you go.",
  {"transition": {"style": "iris"}}),
 ("The penalty", "KineticType",
  {"kicker": "If you underpay", "lines": ["The penalty works", "like *interest*."]},
  "And if you do miss? The underpayment penalty works like interest. It's figured on how much you were short for each payment period, and for how long, at an IRS rate that resets every quarter. Because it's calculated payment by payment, a big catch-up payment in January doesn't erase the penalty that built up on the earlier quarters. Paying on time, each time, is what keeps it at zero.",
  {"transition": {"style": "wipe"}}),
 ("Uneven income", "BulletBuild",
  {"kicker": "If your income is uneven", "title": "Two useful tools", "items": [
     {"text": "The annualized income method", "detail": "Pay as the income actually arrives"},
     {"text": "Withholding counts as paid evenly", "detail": "From a job, or a spouse's job"}]},
  "Now, back to seasonal income. If most of your profit lands late in the year, the annualized income installment method lets your required payments follow when the income actually came in, instead of four equal amounts. It's figured on Form twenty-two ten, Schedule A I. And if you, or a spouse filing jointly, also have a W-2 job, there's a useful rule. Withholding is generally treated as paid evenly through the year, even if it's withheld late. So raising withholding in the fall can cover a shortfall from earlier quarters.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("How to pay", "BulletBuild",
  {"kicker": "How to pay", "title": "Four ways to send it", "theme": "light", "items": [
     {"text": "IRS Direct Pay", "detail": "From a bank account, free"},
     {"text": "Your IRS online account", "detail": "Pay and see payment history"},
     {"text": "EFTPS", "detail": "The Treasury's payment system, free"},
     {"text": "Card or check", "detail": "Card processors charge a fee"}]},
  "Paying is the easy part. IRS Direct Pay takes payments straight from a bank account, for free. Your IRS online account lets you pay and see every payment you've made. EFTPS, the Treasury's electronic payment system, is free too, and lets you schedule payments ahead. You can also pay by card through an approved processor, for a fee, or mail a check with the Form ten forty E S voucher.",
  {"transition": {"style": "wipe"}}),
 ("Your state", "KineticType",
  {"lines": ["Don't forget", "your *state*."]},
  "And don't forget your state. Most states with an income tax have their own estimated payment rules, with their own thresholds and their own dates, which don't always match the federal ones. Everything in this video is federal, so check your state's rules separately.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("S corp owners", "KineticType",
  {"kicker": "If you're an S corp owner", "lines": ["Your paycheck", "can do the *work*."]},
  "If you're an S corp owner, you have an extra option. Your salary runs through payroll, so you can have income tax withheld from it, and that withholding counts toward the safe harbors. Your distributions don't have anything withheld, though. So depending on how much comes out as distributions, you may still need estimated payments, or more withholding on your salary.",
  {"transition": {"style": "wipe"}}),
 ("Owed nothing last year", "KineticType",
  {"kicker": "For brand-new owners", "lines": ["Owed nothing last year?", "No penalty *this* year."]},
  "One more rule that helps brand-new owners. If you owed no federal tax at all last year, and you were a U.S. citizen or resident for the whole year, you generally can't be charged an underpayment penalty this year. That doesn't make the tax go away. It's all still due in April. But your first profitable year is the classic surprise, so start setting money aside from your very first invoice.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("A simple system", "BulletBuild",
  {"kicker": "A simple system", "title": "Make it automatic", "items": [
     {"text": "Set aside a share of every payment", "detail": "In a separate savings account"},
     {"text": "Put the four dates on your calendar", "detail": "Plus a reminder a week before"},
     {"text": "Recheck each quarter", "detail": "Is profit running ahead of plan?"},
     {"text": "True up the January payment", "detail": "Once the year is nearly done"}]},
  "Here's a simple way to run it. Set aside a share of every payment you receive in a separate savings account, so the tax money is never in your spending money. Put the four dates on your calendar, with a reminder a week ahead. Recheck your numbers each quarter, especially if profit is running ahead of plan. And true up the January payment once the year is nearly done, so you're neither penalized, nor giving the government an interest-free loan.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["Four dates.", "One *safe harbor*."]},
  "If you remember one thing from this video, make it this. Know the four dates, and pick a safe harbor. Paying one hundred percent of last year's tax, or one hundred ten percent at higher incomes, in four on-time payments, is the simplest way to stay penalty-free. Then set aside enough to cover the rest in April.",
  {"transition": {"style": "wipe"}}),
 ("Checklist + disclaimer", "KineticType",
  {"kicker": "Dates and deadlines", "lines": ["dollarsanddeductions.com"]},
  "The deductions checklist on dollarsanddeductions.com has these dates, along with the other filing deadlines to keep on your calendar. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. Your situation is your own, so work out your payments with a qualified tax professional.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "SEP IRA vs Solo 401(k): Which Saves You More?"},
  "Thanks for watching Dollars and Deductions. Next time: SEP IRA versus solo four oh one k, and which one saves you more. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "Estimated taxes", "text": "Self-employed? Nobody withholds from your *profit*."},
  "If you work for yourself, nobody withholds tax from your profit. If you expect to owe a thousand dollars or more, the IRS expects you to pay during the year.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("The dates", "BulletBuild",
  {"kicker": "2026 tax year", "title": "Four due dates", "items": [
     {"text": "April 15", "detail": "2026"},
     {"text": "June 15", "detail": "2026"},
     {"text": "September 15", "detail": "2026"},
     {"text": "January 15", "detail": "2027"}]},
  "That's four estimated payments: April fifteenth, June fifteenth, September fifteenth, and January fifteenth of the next year.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("Safe harbor", "KineticType",
  {"lines": ["Pay 100% of", "*last year's* tax.", "No penalty."]},
  "The easy way to avoid the penalty: pay at least one hundred percent of last year's total tax, split across those four payments. It's one hundred ten percent if last year's income was over one hundred fifty thousand.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("The catch", "KineticType",
  {"lines": ["No penalty", "isn't *no bill*."]},
  "But that only stops the penalty. If you earned more this year, the rest is still due in April, so set it aside as you go.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "Quarterly Estimated Taxes: The Complete Walkthrough"},
  "The full walkthrough, with the math, is on the channel. Educational only, not tax advice.",
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
    main_chars, main_secs = build('video-06', MAIN, False)
    t_chars, t_secs = build('video-06-teaser', TEASER, True)
    d = ROOT / 'video-06-estimated-taxes'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "There's no dedicated site article on estimated taxes; the script agrees with the checklist article (/small-business-tax-deductions-checklist/, reviewed October 3, 2026): the $1,000 threshold, Form 1040-ES, mid-April/June/September/January dates, last-year safe harbor, and truing up the final payment. Everything else is from IRS Publication 505, Form 1040-ES and Form 2210 instructions.",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| Who must pay | Expect to owe ≥ **$1,000** after withholding and credits | IRC §6654(e)(1); Form 1040-ES; checklist article |",
      "| What's included | Income tax + self-employment tax, minus withholding and credits | Form 1040-ES worksheet |",
      "| 2026 due dates | Apr 15, Jun 15, Sep 15 2026; Jan 15 2027 (weekend/holiday → next business day) | Form 1040-ES (2026); IRC §7503 |",
      "| Uneven periods | Jan–Mar, Apr–May, Jun–Aug, Sep–Dec | Pub. 505 |",
      "| Example: SE tax | $80,000 × 0.9235 × 0.153 = **$11,303.64** | Schedule SE (same as Video 5) |",
      "| Example: income tax | $80,000 − $5,651.82 (½ SE) − $16,100 (std ded.) − $11,649.64 (QBI, Video 5) = $46,598.54 taxable; 10% × $12,400 + 12% × $34,198.54 = **$5,343.83** | 2026 brackets and standard deduction, Rev. Proc. 2025-32; taxable income stays inside the 12% bracket |",
      "| Example: total / per payment | $16,647.47 (\"about $16,648\"); ÷ 4 = **$4,161.87** (\"about $4,162\") | |",
      "| Safe harbors | 90% of current-year tax; or 100% of prior-year tax (full 12-month prior year); 110% if prior-year AGI > $150,000 ($75,000 MFS) | IRC §6654(d)(1); Pub. 505 |",
      "| Safe harbor example | $12,000 prior-year tax ÷ 4 = **$3,000**; balance due at filing $16,647 − $12,000 = **$4,647** (\"about $4,648\") | Illustrative prior-year figure, stated as an assumption |",
      "| Penalty | Interest-like; per installment, for the days underpaid; rate = federal short-term rate + 3 points, set quarterly | IRC §6654(a), §6621; Form 2210 |",
      "| Annualized income method | Form 2210 Schedule AI | IRC §6654(d)(2) |",
      "| No prior-year liability | No penalty if the prior year was a full 12 months with no tax liability, as a U.S. citizen or resident all year | IRC §6654(e)(2) |",
      "| Withholding treated as paid evenly | Unless you elect otherwise | IRC §6654(g); Pub. 505 |",
      "| Payment options | IRS Direct Pay, IRS online account, EFTPS, card via approved processors (fees), check with 1040-ES voucher | IRS.gov/payments |",
      "",
      "Rounding: spoken and on-screen figures are rounded to the dollar from the exact values above.",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. Framing is \"generally\", \"check your state's rules\", \"work out your payments with a qualified tax professional\".",
      "- The penalty rate itself isn't quoted (it resets quarterly).",
      "- Segments 05 and 08 reference episode one and \"our QBI episode\" (Videos 1 and 5). Keep the order, or change those lines before voicing.",
      "- Spoken disclaimer in segment 22, early educational note in segment 02, on-screen disclaimer on the outro card.",
    ]
    (d / 'script.md').write_text(md(
        "Quarterly Estimated Taxes: The Complete Walkthrough", 'video-06', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 6 · full narration script. Structure: cold open (nobody withholds) → who pays and what it covers → the four dates → a worked $80,000 estimate → safe harbors, with a prior-year example → the penalty → uneven income → how to pay → state and S corp notes → a simple system → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · Quarterly Estimated Taxes (Shorts / Reels)", 'video-06-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook (nobody withholds) → the four dates → the prior-year safe harbor → no penalty isn't no bill → \"full walkthrough on the channel\".",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["Rules match the main video. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

"""Single source for Video 1. Run `python3 video-01-s-corp-vs-llc/build.py` to regenerate script.md, teaser-script.md,
narration/video-01*.json and videos/video-01*.json after editing the text below. Never hand-edit those outputs."""
import json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICE = {"provider": "elevenlabs", "name": "Justin Time - Elearning Narration", "voiceId": "uFIXVu9mmnDZ7dTKCBTX", "model": "eleven_multilingual_v2"}
FPS = 30
WPS = 2.5

# (label, scene type, props, narration, extras)
MAIN = [
 ("Cold open", "KineticType",
  {"lines": ["Same business.", "Same $180,000 profit.", "About $15,000 apart."]},
  "Two business owners. Same kind of work, same one hundred eighty thousand dollars in profit. One of them pays about fifteen thousand dollars more in tax every year. Not because of a loophole, and not because anyone did anything shady. The only difference is how their business is taxed. In this video, we'll walk through the actual math, line by line, so you can see exactly where that number comes from.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 1 · S Corp vs LLC", "title": "S Corp vs LLC: The *$15,000* Tax Difference, Explained", "subtitle": "Where the number comes from, and who it actually fits."},
  "This is Dollars and Deductions. Today: S corp versus LLC, where that fifteen thousand dollars comes from, and who it actually applies to. One note before we start. This is education, not tax advice. Your numbers will be different, so run your own situation by a tax professional before you change anything.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("LLC vs S corp: not the same kind of thing", "KineticType",
  {"kicker": "First, a common mix-up", "lines": ["LLC: a *legal* structure.", "S corp: a *tax* status."]},
  "First, a mix-up that trips up a lot of people. An LLC and an S corp are not two versions of the same thing. An LLC is a legal structure you form under state law. It's about ownership and liability. An S corp is a tax status. It's an election you make with the IRS that changes how the business's profit is taxed at the federal level. That means an LLC can choose to be taxed as an S corp. So the real question usually isn't LLC or S corp. It's whether your LLC keeps its default tax treatment, or elects S corp status.",
  {"transition": {"style": "wipe"}}),
 ("The default single-member LLC", "BulletBuild",
  {"kicker": "Default single-member LLC", "title": "How the profit is taxed", "theme": "light", "items": [
     {"text": "Treated like a sole proprietorship", "detail": "For federal income tax purposes"},
     {"text": "Profit flows to your personal return", "detail": "Reported on Schedule C"},
     {"text": "Income tax on the profit", "detail": "At your regular rates"},
     {"text": "Self-employment tax on the profit", "detail": "Social Security and Medicare"}]},
  "Let's start with the default. If you're the only owner, the IRS treats a single-member LLC like a sole proprietorship for income tax purposes. All of the profit flows onto your personal return. You pay regular income tax on it, and you also pay self-employment tax on it. Self-employment tax is how people who work for themselves pay into Social Security and Medicare.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The 15.3% rate", "NumberCallout",
  {"kicker": "Self-employment tax rate", "value": 15.3, "decimals": 1, "format": "percent", "doubleRule": False, "caption": "12.4% Social Security + 2.9% Medicare"},
  "The rate is fifteen point three percent. Twelve point four percent goes to Social Security, and two point nine percent goes to Medicare. If that sounds high, it's because you're paying both halves. When you work for someone else, your employer pays half of those taxes and you pay the other half. When you work for yourself, you're both, so you pay both.",
  {"transition": {"style": "wipe"}}),
 ("The 92.35% detail and the wage base", "KineticType",
  {"kicker": "Two details that matter", "lines": ["Charged on *92.35%* of profit.", "Social Security part is capped."]},
  "Two details matter for the math. First, self-employment tax isn't charged on every dollar of profit. It's charged on ninety-two point three five percent of it. That adjustment roughly mirrors the employer's share you'd be able to deduct as an employee. Second, there's a cap. The Social Security part only applies up to a yearly limit called the wage base, which the Social Security Administration sets each year. Our example stays under that limit.",
  {"transition": {"style": "iris"}}),
 ("How an S corp pays its owner", "BulletBuild",
  {"kicker": "Taxed as an S corp", "title": "Two kinds of pay", "items": [
     {"text": "A salary, through payroll", "detail": "Social Security and Medicare: 15.3% in total"},
     {"text": "Distributions of remaining profit", "detail": "Not wages, so no payroll taxes"},
     {"text": "Income tax on all of it", "detail": "Profit still passes through to you"}]},
  "Now the S corp. When your business is taxed as an S corp and you work in it, you become an employee of your own company. The company runs payroll and pays you a salary. That salary gets the same Social Security and Medicare taxes as any paycheck: fifteen point three percent in total, half paid by the company and half withheld from you. Profit left over after your salary can be paid out to you as a distribution. Distributions aren't wages, so they don't carry those payroll taxes.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Income tax doesn't go away", "KineticType",
  {"lines": ["Income tax: *same*.", "Payroll tax: *different*."]},
  "Here's what doesn't change. You still pay income tax on all of the business's profit, the salary and the rest. An S corp passes its profit through to your personal return, just like the default LLC. So the difference we're talking about isn't income tax. It's payroll tax. The S corp charges Social Security and Medicare only on the part you pay yourself as salary, instead of on nearly all of the profit.",
  {"transition": {"style": "wipe"}}),
 ("Reasonable compensation", "KineticType",
  {"kicker": "The catch", "lines": ["The IRS expects", "a *reasonable salary.*"], "offsetY": -88},
  "And here's the catch everyone asks about. Why not pay yourself a tiny salary and take everything else as distributions? Because the IRS requires S corp owners who work in the business to pay themselves reasonable compensation. That means roughly what the business would have to pay someone else to do the work you do. The IRS looks at things like your role, your hours, your experience, and what comparable businesses pay. There's no fixed percentage in the rules. Underpaying yourself to avoid payroll taxes is exactly what the IRS watches for, and it can treat those distributions as wages, with back taxes and penalties.",
  {"overlays": [{"type": "LowerThird", "from": 90, "durationInFrames": 300, "props": {"title": "Reasonable Compensation", "subtitle": "Pay yourself what the work is worth"}}], "transition": {"style": "wipe"}}),
 ("Let's run the numbers", "KineticType",
  {"lines": ["Let's run", "the *numbers*."]},
  "Okay. Let's do the math with one example, step by step. Same business, same work, same profit, two tax treatments.",
  {"transition": {"style": "iris"}}),
 ("The profit", "NumberCallout",
  {"kicker": "Net business profit", "value": 180000, "doubleRule": False, "caption": "One owner, one year, before paying themselves"},
  "Our owner's business makes one hundred eighty thousand dollars in profit for the year. That's after business expenses, and before the owner pays themselves anything.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Default LLC math", "KineticType",
  {"kicker": "Default LLC", "lines": ["$180,000 × 92.35% = $166,230", "× 15.3% = $25,433"]},
  "Under the default LLC treatment, self-employment tax starts with ninety-two point three five percent of the profit. That's one hundred sixty-six thousand, two hundred thirty dollars. Multiply that by fifteen point three percent, and the self-employment tax comes to about twenty-five thousand, four hundred thirty-three dollars.",
  {"transition": {"style": "wipe"}}),
 ("S corp math", "KineticType",
  {"kicker": "Taxed as an S corp", "lines": ["Salary: $68,000", "× 15.3% = $10,404"]},
  "Now the S corp version. Let's say a reasonable salary for this owner's role is sixty-eight thousand dollars. We're using that number to illustrate the math. A real reasonable salary depends on the actual work. Payroll taxes on that salary, both halves together, are fifteen point three percent. That's ten thousand, four hundred four dollars. Most of the remaining profit comes out as distributions, with no Social Security or Medicare tax on it.",
  {"transition": {"style": "iris"}}),
 ("Side by side", "BarChart",
  {"kicker": "Payroll taxes on $180,000 of profit", "title": "About *$15,000* apart", "bars": [
     {"label": "Default LLC", "caption": "15.3% on 92.35% of profit", "value": 25433, "tone": "cost"},
     {"label": "S corp", "caption": "15.3% on a $68,000 salary", "value": 10404, "tone": "saving"}],
   "difference": {"label": "Difference"}},
  "Put them side by side. About twenty-five thousand, four hundred dollars under the default. About ten thousand, four hundred under the S corp. The gap is about fifteen thousand dollars a year. That's where the number in the title comes from.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("What an S corp costs", "BulletBuild",
  {"kicker": "The honest part", "title": "What an S corp costs", "items": [
     {"text": "Payroll", "detail": "Quarterly filings and year-end forms"},
     {"text": "A business tax return", "detail": "Form 1120-S, usually with a preparer"},
     {"text": "Unemployment taxes", "detail": "Federal and state, on your salary"},
     {"text": "State fees or taxes", "detail": "Some states add their own"}]},
  "Now, the honest part. That fifteen thousand is the payroll tax difference, not money in your pocket. Running an S corp costs money. You need payroll, with quarterly filings and year-end forms. The business files its own tax return, Form eleven twenty S, which usually means paying a preparer. Your salary also picks up federal and state unemployment taxes. And some states charge their own fees or taxes on S corps. Depending on where you live and who you hire, those costs can run a few thousand dollars a year.",
  {"transition": {"style": "wipe"}}),
 ("After costs", "NumberCallout",
  {"kicker": "After about $3,000 of costs", "value": 12000, "prefix": "~", "caption": "Still real money. Just not the full fifteen."},
  "If those costs come to about three thousand dollars, our owner keeps roughly twelve thousand. Still real money. Just not the full fifteen.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("What else moves the number", "BulletBuild",
  {"kicker": "Payroll tax isn't the whole picture", "title": "What else moves the number", "theme": "light", "items": [
     {"text": "The QBI deduction", "detail": "Can shrink when profit is paid as salary"},
     {"text": "Retirement contributions", "detail": "Some limits depend on your salary"},
     {"text": "The wage base", "detail": "Caps the gap at higher profits"}]},
  "A few other things can push the result up or down. Income tax can shift, because of how the qualified business income deduction works when part of your profit is paid as salary. Some retirement plan contributions depend on your salary. And at higher profit levels, the Social Security wage base caps the self-employment tax, so the gap stops growing the way it does in this example. This comparison is payroll tax only, which is why the full picture is worth running with a professional.",
  {"transition": {"style": "wipe"}}),
 ("Who it tends to fit", "BulletBuild",
  {"kicker": "Who it tends to fit", "title": "When it can make sense", "items": [
     {"text": "Profit well above a reasonable salary", "detail": "That gap is where the savings come from"},
     {"text": "Steady profit year to year", "detail": "So the costs pay off every year"},
     {"text": "Willing to run payroll properly", "detail": "And keep the paperwork clean"},
     {"text": "In it for the long run", "detail": "Setup costs need time to pay back"}]},
  "So who does this tend to make sense for? Generally, owners whose profit is well above what a reasonable salary for their role would be. That gap between profit and salary is where the savings come from. It also tends to fit owners whose profit is steady from year to year, who are willing to run payroll properly and keep the paperwork clean, and who plan to keep the business going long enough for the savings to outweigh the setup and running costs.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Who it usually doesn't fit", "BulletBuild",
  {"kicker": "Who it usually doesn't fit", "title": "When it often doesn't", "theme": "light", "items": [
     {"text": "Profit close to a reasonable salary", "detail": "Little left to take as distributions"},
     {"text": "New or uneven income", "detail": "Payroll costs in lean years"},
     {"text": "A small side business", "detail": "Savings may not cover the costs"},
     {"text": "You want the simplest setup", "detail": "The default is far less paperwork"}]},
  "And who it usually doesn't fit. If your profit is close to what a reasonable salary would be, there's not much left to take as distributions, so there's little to save, and the extra costs can wipe it out. If your business is brand new, or your income swings a lot, you could be paying for payroll in years with very little profit. A small side business with modest profit often won't clear the costs. And if you value simplicity, the default setup means a lot less paperwork.",
  {"transition": {"style": "wipe"}}),
 ("The real question", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["How far is your profit", "above a *reasonable salary*?"]},
  "If you remember one thing from this video, make it this. The S corp question isn't really about the label on your business. It's about the gap between your profit and a reasonable salary for the work you do, and whether that gap is big enough to cover the extra costs. And if an owner does decide to make the election, it's done on IRS Form twenty-five fifty-three, which has its own deadlines for when the election takes effect.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Calculator + disclaimer", "KineticType",
  {"kicker": "Try it with your numbers", "lines": ["dollarsanddeductions.com"]},
  "If you want to try this with your own numbers, there's a free calculator on dollarsanddeductions.com. It runs this same comparison with your profit, your salary, and your costs. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. Tax rules change, and your situation is your own, so talk to a qualified tax professional before you make an election.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "The QBI Deduction, Explained"},
  "Thanks for watching Dollars and Deductions. If this was useful, subscribe, and I'll see you in the next one.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "S corp vs LLC", "text": "Same profit. About *$15,000* less tax."},
  "Two business owners, same one hundred eighty thousand dollars in profit. One pays about fifteen thousand dollars less tax every year, and it's completely legal. Here's why.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("Default LLC", "NumberCallout",
  {"kicker": "Default LLC: self-employment tax", "value": 25433, "doubleRule": False},
  "A default LLC pays self-employment tax, fifteen point three percent, on almost all of that profit. That's about twenty-five thousand dollars.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("S corp", "BarChart",
  {"kicker": "Payroll taxes, same profit", "title": "S corp: tax on *salary* only", "bars": [
     {"label": "LLC", "caption": "on 92.35% of profit", "value": 25433, "tone": "cost"},
     {"label": "S corp", "caption": "on a $68k salary", "value": 10404, "tone": "saving"}],
   "difference": {"label": "Gap"}},
  "An S corp owner pays that same rate only on a reasonable salary. At sixty-eight thousand, that's about ten thousand dollars. The rest comes out as distributions.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("Fine print", "BulletBuild",
  {"kicker": "The fine print", "title": "Not for everyone", "items": [
     {"text": "Salary must be reasonable", "detail": "What the work is actually worth"},
     {"text": "It costs to run", "detail": "Payroll and a business tax return"},
     {"text": "After costs: about $12,000", "detail": "In this example"}]},
  "The catch: your salary has to be reasonable for the work, and an S corp costs a few thousand a year to run. In this example, that still leaves about twelve thousand. But it's not for everyone.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "S Corp vs LLC: The $15,000 Tax Difference, Explained"},
  "The full breakdown, with the math and who it actually fits, is on the channel. Educational only, not tax advice, so check with a tax professional.",
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
    spec = {"narration": slug, "scenes": spec_scenes}
    manifest = {"video": slug, "voice": VOICE, "segments": segs}
    for path, obj in [(ROOT / 'videos' / f'{slug}.json', spec), (ROOT / 'narration' / f'{slug}.json', manifest)]:
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
        if props.get('lines'): on.extend(l.replace('*', '') for l in props['lines'])
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
    main_chars, main_secs = build('video-01', MAIN, False)
    t_chars, t_secs = build('video-01-teaser', TEASER, True)
    d = ROOT / 'video-01-s-corp-vs-llc'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "Every figure is built from general, IRS-published mechanics. There are no outside statistics.",
      "",
      "| Step | Value | Basis |",
      "|---|---|---|",
      "| Self-employment tax rate | 15.3% = 12.4% Social Security + 2.9% Medicare | IRS Topic 554 (Self-employment tax); Schedule SE |",
      "| Net earnings from self-employment | 92.35% of profit (100% − 7.65%) | Schedule SE |",
      "| Social Security wage base | Annual cap set by the SSA; $166,230 is under it | SSA annual wage base (the website's calculator uses the 2026 figure, $184,500) |",
      "| Default LLC | $180,000 × 0.9235 = $166,230; × 0.153 = **$25,433.19** | Single-member LLC is disregarded by default; profit on Schedule C |",
      "| S corp payroll tax | $68,000 × 0.153 = **$10,404.00** (employer $5,202 + employee $5,202) | FICA on W-2 wages |",
      "| Difference | $25,433.19 − $10,404.00 = **$15,029.19** (\"about $15,000\") | |",
      "| After costs | $15,029 − ~$3,000 ≈ **$12,029** (\"roughly $12,000\") | ~$3,000/yr matches the default in the dollarsanddeductions.com calculator; real costs vary |",
      "| Reasonable compensation | No fixed percentage; based on duties, time, experience, comparable pay. IRS may recharacterize distributions as wages | IRS guidance on S corporation compensation and medical insurance issues |",
      "| Election / return | Form 2553 (election), Form 1120-S (S corp return) | IRS |",
      "",
      "The $68,000 salary is **illustrative**; the script says so. The comparison is payroll tax only. The script names what it leaves out: income tax and the QBI deduction, state taxes and fees, unemployment taxes, retirement limits, and the wage base at higher profits.",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. There's no \"you should\" advice; the framing is \"tends to\", \"usually\", \"talk to a tax professional\".",
      "- The spoken disclaimer is in segment 21, and there's an early educational note in segment 02. The outro card also shows the site disclaimer on screen.",
      "- The calculator on dollarsanddeductions.com exists (homepage worksheet: profit, salary, costs).",
    ]
    (d / 'script.md').write_text(md(
        "S Corp vs LLC: The $15,000 Tax Difference Explained", 'video-01', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 1 · full narration script. Structure: cold open → mechanics → the self-employment tax math → who it fits / doesn't → CTA + disclaimer."],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · S Corp vs LLC (Shorts / Reels)", 'video-01-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook → the single most surprising number (≈$15,000 gap on the same profit) → \"full breakdown on the channel\". On-screen lines are short to fit the 856px safe width."],
        ["Math matches the main video: $25,433 vs $10,404 on $180,000 profit with an illustrative $68,000 salary; about $12,000 after ~$3,000 of costs. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

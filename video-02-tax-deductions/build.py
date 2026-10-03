"""Single source for Video 2. Run `python3 video-02-tax-deductions/build.py` to regenerate script.md, teaser-script.md,
narration/video-02*.json and videos/video-02*.json after editing the text below. Never hand-edit those outputs."""
import json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICE = {"provider": "elevenlabs", "name": "Kallen", "voiceId": "Pi2Zqk51cRysbs4RoCCF", "model": "eleven_v4"}
FPS = 30
# Channel bed (Video 1's seamless loop) until a dedicated video-02 bed is delivered.
MUSIC_BED = 'audio/music/video-01-bed.loop.wav'
WPS = 2.5

# (label, scene type, props, narration, extras)
MAIN = [
 ("Cold open", "KineticType",
  {"lines": ["A $1,000 write-off", "doesn't save you *$1,000*."]},
  "You've probably heard someone say, don't worry, it's a write-off. As if spending a thousand dollars on the business makes that thousand dollars free. It doesn't. A deduction lowers the income you're taxed on, not the tax itself. So a thousand-dollar deduction saves you a slice of that thousand, not the whole thing. Deductions still matter a lot, though. Today we'll go through the ones that matter most.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 2 · Tax deductions", "title": "Small Business Tax Deductions: The *7* That Matter", "subtitle": "How each one works, and what makes it hold up."},
  "This is Dollars and Deductions. Today: seven deduction categories that move the needle for small businesses, how each one works, and what makes it hold up if the IRS ever asks. A quick note before we start. This is education, not tax advice. Check anything you act on with a tax professional.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("Deduction vs credit", "KineticType",
  {"kicker": "First, the basics", "lines": ["Deduction: lowers your *taxable income*.", "Credit: lowers the tax itself."]},
  "First, the basics. A deduction and a credit are not the same thing. A deduction reduces the income your tax is calculated on. A credit reduces the tax itself, dollar for dollar. Credits are worth more per dollar, but for a business, deductions are far more common.",
  {"transition": {"style": "wipe"}}),
 ("What a deduction is worth", "NumberCallout",
  {"kicker": "A $1,000 deduction at a 22% rate", "value": 220, "doubleRule": False, "caption": "What it saves: the deduction × your tax rate"},
  "Here's the math. Say you're in the twenty-two percent tax bracket. A one thousand dollar deduction saves you one thousand times twenty-two percent. That's two hundred twenty dollars of income tax. A one thousand dollar credit would save you the full thousand. The higher your bracket, the more each deduction saves.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Ordinary and necessary", "KineticType",
  {"kicker": "The rule behind all of them", "lines": ["Ordinary", "and *necessary*."], "offsetY": -88},
  "Every deduction in this video comes from one principle. The IRS lets a business deduct expenses that are ordinary and necessary. Ordinary means common in your trade. Necessary means helpful and appropriate for your business. A simple pattern to remember: if it's genuinely for the business, documented, and not personal, it's usually deductible. The fights almost always come down to records, and where business ends and personal begins.",
  {"overlays": [{"type": "LowerThird", "from": 90, "durationInFrames": 300, "props": {"title": "Ordinary and Necessary", "subtitle": "Common in your trade, helpful for your business"}}], "transition": {"style": "iris"}}),
 ("1 · Home office", "BulletBuild",
  {"kicker": "Number one", "title": "The home office", "theme": "light", "items": [
     {"text": "Regular and exclusive use", "detail": "A guest room that doubles as an office fails"},
     {"text": "Simplified method", "detail": "A flat rate per square foot, up to 300"},
     {"text": "Regular method", "detail": "The business share of actual home costs"}]},
  "Number one, the home office. If you use part of your home regularly and exclusively for business, you can deduct it. A guest room that doubles as an office fails the test. There are two methods. The simplified method uses a flat rate per square foot, up to three hundred square feet, with very little paperwork. The regular method deducts the business share of your actual home costs, like rent or mortgage interest, utilities, insurance, and repairs. It takes more record keeping, but it's often a bigger deduction.",
  {"transition": {"style": "wipe"}}),
 ("Home office: the simplified maximum", "NumberCallout",
  {"kicker": "Simplified method, at the maximum", "value": 1500, "doubleRule": False, "caption": "300 sq ft × $5 per sq ft"},
  "Here's the simplified method at its maximum. The rate is five dollars per square foot, and it caps at three hundred square feet. Three hundred times five is fifteen hundred dollars. In the twenty-two percent bracket, that deduction is worth about three hundred thirty dollars of income tax.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("2 · Vehicle", "BulletBuild",
  {"kicker": "Number two", "title": "Your vehicle", "items": [
     {"text": "Business driving counts", "detail": "Commuting to a regular workplace doesn't"},
     {"text": "Standard mileage rate", "detail": "An IRS rate per business mile, set yearly"},
     {"text": "Or actual expenses", "detail": "Gas, upkeep, insurance, depreciation"},
     {"text": "A mileage log", "detail": "Kept as you go, not rebuilt in April"}]},
  "Number two, your vehicle. Driving for business is deductible. Commuting from home to a regular workplace is not. Again, there are two methods. The standard mileage rate is a per-mile rate the IRS publishes each year. You multiply it by your business miles. Or you can deduct actual expenses, like gas, maintenance, insurance, and depreciation, multiplied by the share of your driving that's for business. Either way, you need a mileage log. An app that tracks trips as you drive beats a notebook you fill in from memory.",
  {"transition": {"style": "wipe"}}),
 ("3 · Retirement contributions", "BulletBuild",
  {"kicker": "Number three", "title": "Retirement contributions", "theme": "light", "items": [
     {"text": "SEP IRA", "detail": "Simple to set up; limits scale with income"},
     {"text": "Solo 401(k)", "detail": "Owner-only businesses; usually the highest limits"},
     {"text": "SIMPLE IRA", "detail": "A middle ground with a few employees"}]},
  "Number three, retirement contributions. This is often the largest deduction available to a profitable small business, and one of the most underused. A SEP IRA is simple to set up, and the contribution limits scale with your income. A solo four oh one k is for businesses with no employees besides the owner, and possibly a spouse. It allows contributions as both the employer and the employee, which usually means the highest limits. And a SIMPLE IRA is a middle ground when you have a few employees. Limits change every year, so check the current numbers.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Retirement: the money stays yours", "KineticType",
  {"lines": ["A deduction where", "the money stays *yours*."]},
  "And here's what makes retirement different from almost every other deduction. Most deductions mean spending money on something. With a retirement contribution, the money doesn't leave. It moves from your business into an account in your name, and you still get the deduction. Traditional contributions are taxed when you withdraw them in retirement, so it's a deferral, not a disappearing act.",
  {"transition": {"style": "iris"}}),
 ("4 · Health insurance", "BulletBuild",
  {"kicker": "Number four", "title": "Self-employed health insurance", "items": [
     {"text": "You, your spouse, your dependents", "detail": "Premiums you pay"},
     {"text": "Its own line on your return", "detail": "No need to itemize"},
     {"text": "Not with a subsidized employer plan", "detail": "Including through a spouse's job"},
     {"text": "S corp owners: a different setup", "detail": "Premiums run through payroll"}]},
  "Number four, health insurance. If you're self-employed, you can generally deduct the health insurance premiums you pay for yourself, your spouse, and your dependents. It has its own line on your return, so you don't have to itemize to get it. Two details matter. It generally isn't available for any month you were eligible for a subsidized health plan through an employer, including your spouse's. And if you own more than two percent of an S corp, there are specific rules, and the premiums run through payroll. It's also easy to miss when nothing changed from last year.",
  {"transition": {"style": "wipe"}}),
 ("5 · Business meals", "NumberCallout",
  {"kicker": "Number five: business meals", "value": 50, "format": "percent", "doubleRule": False, "caption": "With a clear business purpose, and documented"},
  "Number five, business meals. They're generally fifty percent deductible when there's a clear business purpose, like a meal with a client, or a meal while you're traveling for business. Entertainment, like tickets to a game, generally isn't deductible at all. And the documentation matters. Write down who you were with, where, why, and how much.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("6 · Startup costs", "KineticType",
  {"kicker": "Number six: startup costs", "lines": ["Up to $5,000 in year one,", "plus $5,000 of *organizational* costs."]},
  "Number six, startup costs. You can generally deduct up to five thousand dollars of startup costs in your first year, plus up to five thousand dollars of organizational costs, like forming the entity. Those amounts phase out once your total costs pass fifty thousand dollars, and whatever you can't deduct right away is spread out over fifteen years. What counts as a startup cost has specific rules, so this one is worth a conversation with a professional.",
  {"transition": {"style": "wipe"}}),
 ("7 · Section 179", "KineticType",
  {"kicker": "Number seven: Section 179", "lines": ["Deduct equipment *now*,", "instead of over years."]},
  "Number seven, Section one seventy-nine. Normally, equipment like a computer, machinery, or furniture is depreciated. You deduct its cost a piece at a time, over several years. Section one seventy-nine lets you deduct the cost of qualifying equipment in the year you put it into service. The limits are set each year, so check the current figures. Timing matters too. Equipment placed in service in December counts for this year. Buy it in January, and it lands on next year's return.",
  {"transition": {"style": "iris"}}),
 ("Which taxes a deduction lowers", "BulletBuild",
  {"kicker": "If you file a Schedule C", "title": "Which taxes it lowers", "theme": "light", "items": [
     {"text": "Business expenses", "detail": "Lower income tax and self-employment tax"},
     {"text": "Health insurance, retirement", "detail": "Lower income tax only"}]},
  "One detail that ties back to our last episode. If you're a sole proprietor or a single-member LLC, the business expenses on your Schedule C, like the home office, the vehicle, meals, and equipment, lower your profit. That lowers your income tax and your self-employment tax. A few deductions work differently. Your health insurance and your own retirement contributions are taken on your personal return, so they lower income tax, but not self-employment tax.",
  {"transition": {"style": "wipe"}}),
 ("What survives scrutiny", "BulletBuild",
  {"kicker": "What makes it hold up", "title": "Deductions that survive scrutiny", "items": [
     {"text": "A business purpose, written down", "detail": "At the time, not in April"},
     {"text": "Separate accounts", "detail": "Business money stays business money"},
     {"text": "Consistency", "detail": "Claimed the same way every year"}]},
  "Now, what makes a deduction survive scrutiny? Three things. First, a business purpose, written down at the time. Lunch with a client to discuss a contract beats a receipt on its own. Second, separation. A dedicated business bank account and card turn the question, was this a business expense, from an argument into a statement. Third, consistency. Deductions claimed the same way every year look like a system. A pile of new ones in a high-income year looks like a strategy, and it draws more attention.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Adequate records", "KineticType",
  {"kicker": "The IRS standard", "lines": ["Adequate", "*records*."], "offsetY": -88},
  "The IRS standard is called adequate records. For most expenses, that means receipts, or bank and card records, that show the amount, the date, the place, and the business purpose. A good test: could a stranger look at your records and reconstruct what happened, and why it was business? Records made at the time beat records rebuilt later, every time.",
  {"overlays": [{"type": "LowerThird", "from": 75, "durationInFrames": 270, "props": {"title": "Adequate Records", "subtitle": "Amount, date, place, business purpose"}}], "transition": {"style": "wipe"}}),
 ("Year-round habits", "BulletBuild",
  {"kicker": "Year-round habits", "title": "The checklist", "theme": "light", "items": [
     {"text": "Separate the money", "detail": "Business checking and card"},
     {"text": "Photograph receipts", "detail": "Thermal paper fades; photos don't"},
     {"text": "Log mileage as you go", "detail": "An app beats a notebook"},
     {"text": "Reconcile monthly", "detail": "Thirty minutes a month"},
     {"text": "Collect W-9s up front", "detail": "Before 1099s are due in January"}]},
  "The deduction you forget in April is decided by the records you keep all year. Keep business money separate, with its own checking account and card. Photograph receipts when you buy, because thermal paper fades and phone photos don't. Log mileage as you go. Reconcile your books once a month. Thirty minutes a month beats thirty hours in March. And collect a W-9 when you hire a contractor, not in January when the 1099s are due.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Year-end moves", "BulletBuild",
  {"kicker": "October to early December", "title": "Year-end moves to discuss", "items": [
     {"text": "Retirement contributions", "detail": "Limits and deadlines are year-specific"},
     {"text": "Equipment timing", "detail": "December or January changes the year"},
     {"text": "Health insurance premiums", "detail": "Make sure the deduction is captured"},
     {"text": "Fourth-quarter estimates", "detail": "True them up"}]},
  "And if you're watching this in the fall, October through early December is the practical window for year-end moves. A few are worth discussing with your tax professional: retirement contributions, the timing of equipment purchases, making sure the health insurance deduction is captured, and truing up your fourth-quarter estimated payment, so you're not penalized, or giving the government an interest-free loan. They interact with your entity type, so treat them as planning conversations, not do-it-yourself decisions.",
  {"transition": {"style": "wipe"}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["A deduction is worth *your rate*.", "Records make it real."]},
  "If you remember one thing from this video, make it this. A deduction isn't free money. It's worth the expense times your tax rate, so spend because the business needs it, not for the write-off. And a deduction is only as good as the records behind it. Ordinary and necessary, documented at the time, and kept separate from personal spending.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Guide + disclaimer", "KineticType",
  {"kicker": "The full checklist", "lines": ["dollarsanddeductions.com"]},
  "The full guide and the deductions checklist, with the key filing deadlines, are on dollarsanddeductions.com. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. Rules change, and your situation is your own, so talk to a qualified tax professional before you claim a deduction you're not sure about.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "How Much Does a CPA Cost for a Small Business?"},
  "Thanks for watching Dollars and Deductions. Next time: what a CPA actually costs a small business. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "Tax deductions", "text": "A $1,000 write-off doesn't save you *$1,000*."},
  "A one thousand dollar write-off does not save you one thousand dollars. Here's what it actually saves, and the deductions that really move the needle.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("The math", "NumberCallout",
  {"kicker": "$1,000 deduction, 22% bracket", "value": 220, "doubleRule": False, "caption": "Saved in income tax"},
  "A deduction lowers the income you're taxed on, not the tax itself. In the twenty-two percent bracket, a thousand-dollar deduction saves two hundred twenty dollars of income tax. So spend because the business needs it, not for the write-off.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("The big ones", "BulletBuild",
  {"kicker": "The ones that matter", "title": "The big ones", "items": [
     {"text": "Home office", "detail": "Regular, exclusive use"},
     {"text": "Your vehicle", "detail": "With a mileage log"},
     {"text": "Health insurance", "detail": "If you're self-employed"},
     {"text": "Retirement", "detail": "Often the biggest of all"}]},
  "The deductions that matter are things like the home office, your vehicle, self-employed health insurance, and retirement contributions, often the biggest of all, because the money stays yours.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("Records", "KineticType",
  {"lines": ["No records,", "no *deduction*."]},
  "And every one of them depends on records. The amount, the date, and the business purpose, written down at the time.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "Small Business Tax Deductions: The 7 That Matter"},
  "All seven, with the math, are in the full video on the channel. Educational only, not tax advice, so check with a tax professional.",
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
    main_chars, main_secs = build('video-02', MAIN, False)
    t_chars, t_secs = build('video-02-teaser', TEASER, True)
    d = ROOT / 'video-02-tax-deductions'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "Every figure is a general IRS rule or simple arithmetic on one. There are no outside statistics. Source articles: dollarsanddeductions.com/small-business-tax-deductions/ and /small-business-tax-deductions-checklist/ (both reviewed October 3, 2026); the script follows them and adds nothing that contradicts them.",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| Deduction vs credit | $1,000 × 22% = **$220**; a $1,000 credit saves $1,000 | Same example as the article's FAQ. 22% is a current federal bracket |",
      "| Ordinary and necessary | Common in your trade; helpful and appropriate (need not be indispensable) | IRC §162; IRS Pub. 535 / Pub. 334 |",
      "| Home office, simplified | $5/sq ft × 300 sq ft max = **$1,500**; × 22% = **$330** (\"about\") | Rev. Proc. 2013-13; rate unchanged since 2013. Regular and exclusive use: IRC §280A, Pub. 587 |",
      "| Vehicle | Standard mileage rate (set yearly, not quoted) or actual expenses × business-use %; commuting not deductible; log required | IRS Pub. 463; IRC §274(d) substantiation |",
      "| Retirement | SEP IRA, Solo 401(k), SIMPLE IRA; limits not quoted (they change yearly) | IRS Pub. 560. Traditional contributions taxed on withdrawal |",
      "| Self-employed health insurance | Premiums for self, spouse, dependents; above-the-line; not for months eligible for a subsidized employer plan (incl. spouse's); >2% S corp shareholders via payroll | IRC §162(l); Form 7206 |",
      "| Meals | Generally **50%** with a business purpose; entertainment generally 0% | IRC §274(k), (n), (a) (post-2017) |",
      "| Startup / organizational costs | Up to **$5,000** each in year one; reduced dollar-for-dollar above **$50,000**; rest amortized over 180 months (\"fifteen years\") | IRC §195, §248 |",
      "| Section 179 | Expense qualifying equipment in the year placed in service; limits set annually (not quoted) | IRC §179; Pub. 946 |",
      "| Which taxes it lowers | Schedule C expenses lower income tax and SE tax; SE health insurance and the owner's own retirement contributions are adjustments on Schedule 1 (income tax only) | Schedule SE is computed from Schedule C net profit |",
      "| Adequate records | Amount, date, place, business purpose | IRS Pub. 583, Pub. 463 |",
      "| Year-end window, W-9/1099 timing | October through early December; 1099s due January 31 | Checklist article |",
      "",
      "Deliberately **not** quoted, because they change every year: the standard mileage rate, retirement contribution limits, Section 179 limits. The articles don't quote them either; the script tells viewers to check the current year's figures.",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. Framing is \"generally\", \"usually\", \"worth discussing with your tax professional\".",
      "- The spoken disclaimer is in segment 21, with an early educational note in segment 02. The outro card also shows the site disclaimer on screen.",
      "- The guide and checklist referenced in segment 21 exist on dollarsanddeductions.com.",
      "- Segment 15 references \"our last episode\" (Video 1, S Corp vs LLC). Keep the publishing order, or change that line before voicing.",
    ]
    (d / 'script.md').write_text(md(
        "Small Business Tax Deductions: The 7 That Matter", 'video-02', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 2 · full narration script. Structure: cold open (the write-off myth) → deduction vs credit math → the principle → seven categories → which taxes they lower → what survives scrutiny → checklist + year-end → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · Small Business Tax Deductions (Shorts / Reels)", 'video-02-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook (the write-off myth) → the $220 math → the big categories → records → \"all seven in the full video\". On-screen lines are short to fit the 856px safe width.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["Math matches the main video: $1,000 deduction × 22% = $220 of income tax. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

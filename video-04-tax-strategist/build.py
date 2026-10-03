"""Single source for Video 4. Run `python3 video-04-tax-strategist/build.py` to regenerate script.md, teaser-script.md,
narration/video-04*.json and videos/video-04*.json after editing the text below. Never hand-edit those outputs."""
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
  {"lines": ["Compliance files the return.", "Strategy decides *what goes on it*."]},
  "Most small business owners meet their tax person once a year, in the spring, to report what already happened. By then, almost every decision that shaped the bill is locked in. That's compliance, and it matters. But there's a different kind of tax work that happens before the year ends, while those decisions can still change. That's what a tax strategist sells. The question is whether you actually need one.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 4 · Tax pros", "title": "Do You Need a Tax *Strategist*?", "subtitle": "What they do, what the label means, and when it pays."},
  "This is Dollars and Deductions. Today: what a tax strategist actually does, how that's different from a preparer or a CPA, and when paying for one tends to make sense. As always, this is education, not tax advice. Your situation is your own, so use this to ask better questions, not to skip asking them.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("The year you give them", "KineticType",
  {"kicker": "Compliance vs strategy", "lines": ["A preparer works with", "the year you *give* them."]},
  "Here's the split. Most tax work is compliance: accurately reporting decisions you already made. A preparer can only work with the year you give them. A strategist works on the other side. They try to shape the year before it ends, by working on the decisions that determine what the return will look like. Whether that's worth paying for depends on one thing: how many decisions in your business can actually still move.",
  {"transition": {"style": "wipe"}}),
 ("What they work on", "BulletBuild",
  {"kicker": "What a strategist works on", "title": "Movable decisions", "theme": "light", "items": [
     {"text": "Entity and election timing", "detail": "Whether, and when, to elect S corp"},
     {"text": "How you pay yourself", "detail": "Owner compensation structure"},
     {"text": "Retirement plan choice", "detail": "SEP, Solo 401(k), SIMPLE, and timing"},
     {"text": "Income and expense timing", "detail": "Across the year boundary"},
     {"text": "Estimated payments", "detail": "No penalties, no overpaying"}]},
  "So what do strategists typically work on? Entity and election timing: whether an S corp election makes sense, and when. How you pay yourself. Which retirement plan fits, and when to fund it. The timing of income and expenses across the year boundary, where the rules allow it. And estimated payments, set so you avoid penalties without overpaying. Good strategy also looks at the multi-year picture, because this year's decisions shape next year's options.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Example: the S election", "NumberCallout",
  {"kicker": "Episode 1's example, after costs", "value": 12000, "prefix": "~", "doubleRule": False, "caption": "One movable decision: the S corp election"},
  "To see why these decisions matter, go back to our first episode. On one hundred eighty thousand dollars of profit, with an illustrative reasonable salary, the S corp election cut payroll taxes by about fifteen thousand dollars a year. After roughly three thousand dollars of running costs, that was still about twelve thousand. That's one decision, and it's exactly the kind a strategist works on, because it has deadlines and it has to be set up right.",
  {"transition": {"style": "wipe"}}),
 ("Example: a retirement contribution", "NumberCallout",
  {"kicker": "$10,000 retirement contribution, 22% bracket", "value": 2200, "doubleRule": False, "caption": "Income tax deferred this year"},
  "Here's a smaller one. Say you put ten thousand dollars into a traditional retirement plan through your business, and you're in the twenty-two percent bracket. That's twenty-two hundred dollars less income tax this year, and the money is still yours. You'll pay tax when you withdraw it later. The planning question is which plan fits, how much to put in, and when.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Timing", "KineticType",
  {"lines": ["December: still *movable*.", "April: mostly history."]},
  "And timing is the whole game. In the fall, there's still room. You can decide when to buy equipment, whether to pull an expense into this year, and how to true up your last estimated payment. By April, most of that is history. The preparer reports it. They can't go back and change it. That's the core of what you're paying a strategist for: being in the room while the year is still open.",
  {"transition": {"style": "iris"}}),
 ("The multi-year picture", "KineticType",
  {"lines": ["This year's decisions", "shape *next year's* options."]},
  "There's one more thing good strategy does that a once-a-year filing can't. It looks past this year. Elect S corp status, and you're committing to running payroll every year after, not just once. Set up a retirement plan, and it comes with rules for how you fund it, and who it has to cover once you hire. A strategist should be thinking about next year, and the year after, not just the return in front of them.",
  {"transition": {"style": "wipe"}}),
 ("The labels", "BulletBuild",
  {"kicker": "Strategist vs preparer vs CPA", "title": "What the labels mean", "items": [
     {"text": "Tax preparer", "detail": "Prepares and files returns"},
     {"text": "CPA", "detail": "A state license: education, exam, experience"},
     {"text": "Tax strategist", "detail": "A description, not a license"}]},
  "Now, the labels, because they get mixed together. A tax preparer prepares and files returns. The focus is accuracy and deadlines. A CPA holds a state-issued license, which takes education, an exam, and experience. CPAs can do preparation, planning, or both, and the license doesn't tell you which. And tax strategist is a description, not a license. It signals a focus on planning, rather than just filing.",
  {"transition": {"style": "wipe"}}),
 ("A label, not a license", "KineticType",
  {"kicker": "So ask", "lines": ["A *label*,", "not a license."], "offsetY": -88},
  "That matters, because anyone can call themselves a tax strategist. Some strategists are CPAs. Some are attorneys, or enrolled agents, which is a credential issued by the IRS. Some are experienced tax professionals without any of those. None of that makes them good or bad on its own, but you should know which one you're hiring. So ask about actual credentials, and check them.",
  {"overlays": [{"type": "LowerThird", "from": 90, "durationInFrames": 270, "props": {"title": "Enrolled Agent", "subtitle": "A tax credential issued by the IRS", "tag": "Credential"}}], "transition": {"style": "wipe"}}),
 ("What are you buying?", "KineticType",
  {"lines": ["A filed return in March,", "or decisions made *all year*?"]},
  "Honestly, the label matters less than the engagement. The real question is what you're buying. A filed return in March, or decisions made all year? Plenty of firms that call themselves strategists mostly file returns, and plenty of preparers do real planning. Get the answer in writing before you pay, including what you'll actually receive: a plan, a set of meetings, or help putting it in place.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("When it tends to pay off", "BulletBuild",
  {"kicker": "When it tends to pay off", "title": "Signs you might", "theme": "light", "items": [
     {"text": "Profit where decisions move real dollars", "detail": "Entity, pay, retirement"},
     {"text": "One meeting a year, at filing time", "detail": "Nobody plans the coming year"},
     {"text": "A structural change", "detail": "New entity, partners, hires, states"}]},
  "So when does it tend to pay off? First, when your business is profitable enough that entity, compensation, and retirement decisions move real dollars. Second, when you only meet your tax person once a year, at filing time, and nobody ever talks about the year ahead. And third, when something structural changes. A new entity, new partners, your first employees, or starting to do business in more than one state.",
  {"transition": {"style": "wipe"}}),
 ("When you probably don't", "BulletBuild",
  {"kicker": "Not every business, yet", "title": "Signs you might not", "items": [
     {"text": "A simple Schedule C", "detail": "One state, clean books"},
     {"text": "Few decisions that can move", "detail": "Modest, steady profit"},
     {"text": "Nothing structural changing", "detail": "Same setup as last year"}]},
  "And when you probably don't, at least not yet. A simple Schedule C with clean books, in one state, often does fine with tax software, or a preparer, plus a periodic check-in. If your profit is modest and steady, and nothing structural is changing, there may not be many decisions left to move. And honest strategy work will tell you that. Nothing to optimize yet is a useful answer, and it should be a cheap one.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("How they charge", "BulletBuild",
  {"kicker": "How strategists charge", "title": "Three fee models", "theme": "light", "items": [
     {"text": "Project-based", "detail": "A defined piece of planning work"},
     {"text": "Monthly subscription", "detail": "Ongoing, often bundled with filing"},
     {"text": "A percentage of savings", "detail": "Less common; worth scrutinizing"}]},
  "How do strategists charge? There's no standard credential, so there's no standard rate card either. You'll usually see one of three models. Project-based work, for a defined piece of planning. A monthly subscription, often bundled with bookkeeping and filing. Or a percentage of the savings they identify. That last one is less common, and worth a closer look.",
  {"transition": {"style": "wipe"}}),
 ("Percentage of savings", "KineticType",
  {"kicker": "A percentage of savings", "lines": ["Who decides", "what counts as *savings*?"]},
  "Here's why. When the fee is a cut of the savings, the incentive is to find as much savings as possible, and to define savings as generously as possible. That can push toward aggressive positions. And if the IRS disagrees later, you're the one whose name is on the return. So if you see this model, ask exactly how savings are measured, and what happens to the fee if a position doesn't hold up.",
  {"transition": {"style": "iris"}}),
 ("Does it pay for itself?", "KineticType",
  {"lines": ["The fee should be smaller", "than the decisions it *moves*."]},
  "Whichever model you're quoted, the test is the same. Planning pays for itself when the decisions it changes are worth more than the fee. For a reference point, our last episode's sources put a single planning session with a CPA firm at roughly five hundred to fifteen hundred dollars. Strategy engagements vary much more than that. Because there's no rate card, get written proposals from more than one provider, and compare what's actually included: how many planning sessions, help putting the plan in place, and whether the return is part of it.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Questions to ask", "BulletBuild",
  {"kicker": "Before you hire anyone", "title": "Five questions to ask", "items": [
     {"text": "What are your credentials?", "detail": "CPA, attorney, enrolled agent?"},
     {"text": "Is the return included?", "detail": "Or is this planning only?"},
     {"text": "How is the fee structured?", "detail": "And what exactly does it cover?"},
     {"text": "When do we meet?", "detail": "How many touchpoints, and when"},
     {"text": "A situation like mine?", "detail": "Where planning paid for itself"}]},
  "Before you hire anyone, ask five questions. What are your actual credentials? Is the return included, or is this planning only? How is the fee structured, and what exactly does it cover? How many planning touchpoints happen during the year, and when? And can you describe a situation like mine where the planning paid for itself?",
  {"transition": {"style": "wipe"}}),
 ("Who files the return?", "KineticType",
  {"lines": ["Who is actually", "*filing* the return?"]},
  "That second question matters more than it sounds. Some strategy firms prepare the return as well. Others only plan, and coordinate with your existing preparer. Either can work. What you don't want is to find out in March that each one assumed the other was filing it.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["Count your", "*movable* decisions."]},
  "If you remember one thing from this video, make it this. You don't need a tax strategist because of the title. You need planning when your business has decisions that can still move, and that move real money. Count those decisions. If there are several, planning during the year tends to pay. If there aren't, a good preparer and clean books may be all you need for now.",
  {"transition": {"style": "wipe"}}),
 ("Guide + disclaimer", "KineticType",
  {"kicker": "The full guide", "lines": ["dollarsanddeductions.com"]},
  "The full guide to what tax strategists do, and what to ask, is on dollarsanddeductions.com. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. Your situation is your own, so talk to a qualified tax professional before you act on any of it.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "The QBI Deduction, Explained"},
  "Thanks for watching Dollars and Deductions. Next time: the qualified business income deduction, a deduction worth up to twenty percent of your qualified business income. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "Tax pros", "text": "By April, your tax bill is mostly *decided*."},
  "By the time you file in April, almost everything that shaped your tax bill is already decided. That's the difference between a tax preparer and a tax strategist.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("The split", "KineticType",
  {"lines": ["Compliance", "files the return.", "Strategy decides", "*what goes on it*."]},
  "A preparer reports the year you give them. A strategist works on the decisions while the year is still open: your entity, how you pay yourself, retirement, timing.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("The label", "KineticType",
  {"lines": ["A *label*,", "not a license."]},
  "But tax strategist is a label, not a license. Some are CPAs, some are enrolled agents or attorneys, and some aren't any of those. Ask.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("The test", "KineticType",
  {"lines": ["Planning pays", "when it moves", "*more* than it costs."]},
  "The test is simple. Planning pays when the decisions it changes are worth more than the fee. If nothing can move, you may not need one yet.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "Do You Need a Tax Strategist?"},
  "The full breakdown, with the questions to ask before you hire, is on the channel. Educational only, not tax advice.",
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
    main_chars, main_secs = build('video-04', MAIN, False)
    t_chars, t_secs = build('video-04-teaser', TEASER, True)
    d = ROOT / 'video-04-tax-strategist'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "Source article: dollarsanddeductions.com/what-is-a-tax-strategist/ (reviewed October 3, 2026). The script follows its compliance/strategy split, its label definitions, its \"when it pays off\" list, its fee models and its five questions. The \"when you probably don't\" scene follows the DIY breakpoint in /how-much-does-a-cpa-cost-for-a-small-business/.",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| S election example | ~$15,000 payroll-tax gap, ~$12,000 after ~$3,000 costs | Video 1 and /s-corp-vs-llc/: $180,000 profit, illustrative $68,000 salary; $25,433 − $10,404 = $15,029; − $3,000 ≈ $12,029 |",
      "| Retirement example | $10,000 × 22% = **$2,200** of income tax, deferred (taxed on withdrawal) | Simple arithmetic; traditional contributions. No contribution limits quoted |",
      "| CPA | State-issued license: education, exam, experience | Article |",
      "| Enrolled agent | A credential issued by the IRS | IRS (enrolled agents are licensed by the IRS); the article lists EAs among credentials to ask about |",
      "| Tax strategist | A descriptive label, not a license | Article |",
      "| Fee models | Project-based, monthly subscription, percentage of identified savings (\"less common and worth scrutinizing\") | Article FAQ. No fee ranges quoted, because the article gives none (\"no standard credential or rate card\") |",
      "| Timing | Fall decisions still movable; by April mostly history | Article (\"a strategist tries to change the year before it ends\"); checklist article (\"anything discovered in January is mostly history\") |",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed. The video explains the labels; it doesn't recommend hiring anyone in particular.",
      "- No partner or referral pitch. Segment 20 points to the site's free guide only.",
      "- The percentage-of-savings scene (14) explains the incentive problem in general terms, matching the article's \"worth scrutinizing\"; it doesn't accuse any provider.",
      "- Segment 05 references \"our first episode\" (Video 1) and segment 16 \"our last episode\" (Video 3, $500–$1,500 per planning session, from /how-much-does-a-cpa-cost-for-a-small-business/). Keep the order, or change those lines before voicing.",
      "- Spoken disclaimer in segment 20, early educational note in segment 02, on-screen disclaimer on the outro card.",
    ]
    (d / 'script.md').write_text(md(
        "Do You Need a Tax Strategist?", 'video-04', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 4 · full narration script. Structure: cold open (compliance vs strategy) → what strategists work on → two worked examples → timing → the labels → when it pays off / when it doesn't → fee models → five questions → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · Do You Need a Tax Strategist? (Shorts / Reels)", 'video-04-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook (by April it's decided) → compliance vs strategy → a label, not a license → the fee test → \"full breakdown on the channel\".",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["No figures in the teaser. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

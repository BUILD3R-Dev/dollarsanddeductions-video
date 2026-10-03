"""Single source for Video 3. Run `python3 video-03-cpa-cost/build.py` to regenerate script.md, teaser-script.md,
narration/video-03*.json and videos/video-03*.json after editing the text below. Never hand-edit those outputs."""
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
  {"lines": ["The tax return", "is the *smallest* part of the bill."]},
  "Ask a small business owner what their CPA costs, and they'll usually quote the price of their tax return. But for most small businesses, the return is the smallest part of the bill. The real cost is spread across the whole year, and most of it is in places owners don't think to price. So let's put actual numbers on it, and look at what moves them, so you know what you're paying for before you sign anything.",
  {"startSec": 0.4, "transition": {"style": "wipe"}}),
 ("Title", "TitleCard",
  {"kicker": "Episode 3 · CPA costs", "title": "How Much Does a *CPA* Cost for a Small Business?", "subtitle": "Three bills, real ranges, and how to compare quotes."},
  "This is Dollars and Deductions. Today: what a CPA commonly costs a small business, the three separate bills you might be paying, and how to get quotes you can actually compare. One note first. The prices in this video are commonly reported ranges, not quotes. Your price depends on your situation, so always get it in writing.",
  {"startSec": 0.8, "transition": {"style": "fade", "durationInFrames": 24}}),
 ("Price of complexity", "KineticType",
  {"lines": ["The price of a CPA", "is the price of your *complexity*."]},
  "Here's the idea that explains almost every number in this video. The price of a CPA is the price of your complexity. What kind of entity you have, how many states you file in, how many transactions you run, and above all, the condition of your books. Two businesses with the same revenue can get very different quotes. Market and seniority matter too, but complexity is the big one, and part of it is under your control.",
  {"transition": {"style": "wipe"}}),
 ("Three pricing models", "BulletBuild",
  {"kicker": "How CPAs charge", "title": "Three pricing models", "theme": "light", "items": [
     {"text": "Hourly", "detail": "Roughly $100 to $400+ an hour"},
     {"text": "Flat fee per return", "detail": "Now the most common for tax prep"},
     {"text": "Monthly subscription", "detail": "Roughly $200 to $1,000+ a month"}]},
  "First, how CPAs charge. There are three common models. Hourly, commonly reported at around one hundred to four hundred dollars an hour or more, depending on seniority and market. Flat fee per return, which is now the most common model for tax preparation. You know the price up front. And monthly subscriptions, commonly two hundred to a thousand dollars a month or more, which bundle bookkeeping with tax, and sometimes planning. Subscriptions are getting more popular, because the firm has a reason to keep your books clean all year, not just in March.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Hourly and flat fee", "KineticType",
  {"kicker": "If it's hourly", "lines": ["Ask *whose* hours."]},
  "If you're quoted hourly, ask whose hours. Partner time can cost several times what staff time costs. Hourly billing still shows up for advisory work, cleanup, and unusual projects. For routine tax preparation, though, a flat fee usually works better for you. The price is known up front, and the firm isn't rewarded for being slow.",
  {"transition": {"style": "iris"}}),
 ("What business returns cost", "BulletBuild",
  {"kicker": "Common 2026 ranges", "title": "What a business return costs", "items": [
     {"text": "Schedule C", "detail": "Sole proprietor: about $500 to $1,500"},
     {"text": "Partnership or LLC, Form 1065", "detail": "About $1,000 to $2,500"},
     {"text": "S corp, Form 1120-S", "detail": "About $1,200 to $2,500+"},
     {"text": "C corp, Form 1120", "detail": "About $1,500 to $3,000+"}]},
  "So what does a business return cost? Here are commonly reported ranges for twenty twenty-six. A sole proprietor's Schedule C, roughly five hundred to fifteen hundred dollars. A partnership or multi-member LLC return, about one thousand to twenty-five hundred. An S corp return, about twelve hundred to twenty-five hundred or more. And a C corp return, about fifteen hundred to three thousand or more. Business returns cost more than personal ones, because someone is checking entity compliance, not just the math.",
  {"transition": {"style": "wipe"}}),
 ("The most common band", "KineticType",
  {"kicker": "One 2025 pricing survey", "lines": ["Most common band:", "$1,000 to $1,499."]},
  "One industry pricing survey from twenty twenty-five put the most common price band for a small business return at one thousand to fourteen ninety-nine. Treat all of these as orientation, not quotes. Your entity type, your state filings, and the shape your books are in can move the real price a lot.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("Three bills, not one", "BulletBuild",
  {"kicker": "For a small business", "title": "Three bills, not one", "theme": "light", "items": [
     {"text": "The return", "detail": "Once a year"},
     {"text": "Bookkeeping", "detail": "About $200 to $1,000 a month"},
     {"text": "Planning and advisory", "detail": "Often $500 to $1,500 a session"}]},
  "Now the bigger picture. A small business doesn't really buy a CPA. It buys up to three things, often from different providers. The return itself. Bookkeeping, commonly two hundred to a thousand dollars a month for a typical small business, depending on how many transactions you have. And planning, often five hundred to fifteen hundred dollars per session. Of the three, bookkeeping is the one owners underestimate most.",
  {"transition": {"style": "wipe"}}),
 ("Bookkeeping, per year", "KineticType",
  {"kicker": "Bookkeeping, over a full year", "lines": ["$200 to $1,000 a month", "= $2,400 to $12,000 a year."]},
  "Here's why. A monthly bill looks small. But two hundred dollars a month is twenty-four hundred dollars a year. And a thousand dollars a month is twelve thousand a year. For a lot of businesses, the bookkeeping costs more than the return, several times over.",
  {"transition": {"style": "iris"}}),
 ("One owner's year", "BarChart",
  {"kicker": "An illustrative year, à la carte", "title": "Where the money goes", "bars": [
     {"label": "Return only", "caption": "Schedule C", "value": 1000, "tone": "neutral"},
     {"label": "+ Bookkeeping", "caption": "$400 a month", "value": 5800, "tone": "neutral"},
     {"label": "+ Planning", "caption": "Two sessions", "value": 7800, "tone": "cost"}]},
  "Let's build one illustrative year. These numbers are examples, picked from inside the ranges. A Schedule C return at one thousand dollars. Add bookkeeping at four hundred dollars a month, which is forty-eight hundred a year, and you're at fifty-eight hundred. Add two planning sessions at a thousand dollars each, and the year comes to seventy-eight hundred dollars. The return is about an eighth of it.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The bundled model", "KineticType",
  {"kicker": "The bundled model", "lines": ["$750 a month", "= $9,000 a year."]},
  "More firms now sell a single monthly package instead: bookkeeping, tax filing, payroll coordination, and planning, all in one. Full-service bundles commonly start around seven hundred fifty dollars a month. That's nine thousand dollars a year. The pitch is that when the same firm keeps your books all year, there's no cleanup surprise in March, and planning happens while decisions can still change.",
  {"transition": {"style": "wipe"}}),
 ("Bundle or à la carte", "BulletBuild",
  {"kicker": "Bundle or à la carte?", "title": "It depends on your books", "items": [
     {"text": "Clean books, just need a return", "detail": "À la carte is usually cheaper"},
     {"text": "Every April starts with cleanup", "detail": "The bundle is usually the lower total"}]},
  "So which is cheaper? It depends on your discipline. In our example, the bundle at nine thousand costs more than seventy-eight hundred à la carte. If your books are clean and you only need a return filed, unbundled usually wins. But if every April starts with a cleanup project, the bundle is usually the lower total cost, because you're paying for that cleanup either way.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("What moves your quote", "BulletBuild",
  {"kicker": "What moves your quote", "title": "Four price levers", "theme": "light", "items": [
     {"text": "Book condition", "detail": "Messy books can double a quote"},
     {"text": "Entity type", "detail": "More complex entity, pricier return"},
     {"text": "States", "detail": "Each extra state filing adds cost"},
     {"text": "Add-ons", "detail": "Planning, payroll, advisory"}]},
  "Four things move your quote the most. Book condition. Clean, reconciled books versus a year of uncategorized transactions can double a quote. Entity type, because more complex entities mean more expensive returns. States, since each extra state filing adds cost, and activity in several states compounds it. And add-ons. Planning sessions, payroll, and advisory are usually separate line items, so ask what's included before you compare.",
  {"transition": {"style": "wipe"}}),
 ("Clean books, clean quote", "KineticType",
  {"lines": ["Clean books,", "clean *quote*."]},
  "Of those four, book condition is the one you control. A clean, reconciled bookkeeping file and a shoebox of receipts get very different quotes for the same business. Messy books are the most expensive option, no matter who does the return.",
  {"transition": {"style": "iris"}}),
 ("Online vs local", "KineticType",
  {"kicker": "Online and virtual firms", "lines": ["Commonly reported:", "20 to 50% *less*."]},
  "What about online and virtual firms? They're commonly reported as twenty to fifty percent cheaper than traditional local firms, because they carry less overhead. For straightforward, single-state situations, the savings are real. The tradeoff is relationship depth, and local knowledge. If you have activity in several states, or an unusual situation, a local specialist can be worth the premium.",
  {"transition": {"style": "wipe"}}),
 ("The DIY breakpoint", "KineticType",
  {"kicker": "The do-it-yourself breakpoint", "lines": ["Software files the return.", "It can't make the *decisions*."]},
  "And can you skip the professional entirely? For simple situations, often yes. A single-member LLC with clean books in one state can usually be handled by tax software, with business tiers commonly under two hundred dollars. The breakpoint is decisions. Entity choice, how you pay yourself, activity in multiple states, and significant retirement contributions. That's where professional input tends to pay for itself, in the decisions, not the filing.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("A common setup", "KineticType",
  {"kicker": "A common middle ground", "lines": ["Software for the books,", "a pro for the *decisions*."]},
  "Plenty of owners land in the middle. They use software to keep their own books, and pay a professional for the return and for planning. That can work well, as long as the books really are kept up. Remember, the cheapest sticker price is doing it all yourself. But the cheapest total cost is usually clean books, plus the right level of professional help for how complicated your business actually is.",
  {"transition": {"style": "wipe"}}),
 ("Comparable quotes", "BulletBuild",
  {"kicker": "Before you hire", "title": "Get quotes you can compare", "items": [
     {"text": "Describe the same scope", "detail": "Entity, states, revenue, transactions, books"},
     {"text": "Ask what's included", "detail": "Forms, states, sessions, extra fees"},
     {"text": "Ask the engagement model", "detail": "Once a year, or year-round?"},
     {"text": "Get it in writing", "detail": "Verbal quotes evaporate in April"}]},
  "When you shop around, make the quotes comparable. Describe the same scope to every firm: your entity type, your states, your revenue, your transaction volume, and the condition of your books. Ask exactly what's included, which forms, how many states, any planning sessions, and what triggers extra fees. Ask whether it's a once-a-year filing or a year-round relationship. And get it in writing, because verbal quotes evaporate in April.",
  {"transition": {"style": "wipe"}}),
 ("Cheapest isn't lowest", "KineticType",
  {"lines": ["The cheapest quote", "isn't the lowest *total cost*."]},
  "Because here's the trap. The cheapest quote and the lowest total cost are rarely the same thing. Cleanup fees, and planning opportunities nobody raised in time, can easily dwarf the difference between two quotes.",
  {"transition": {"style": "fade", "durationInFrames": 24}}),
 ("The real takeaway", "KineticType",
  {"kicker": "If you remember one thing", "lines": ["Price the *whole year*,", "not just the return."]},
  "If you remember one thing from this video, make it this. When you price a CPA, price the whole year, not just the return. Add up the return, the bookkeeping, and any planning, match the level of help to how complex your business actually is, and keep your books clean, because that's the lever you control.",
  {"transition": {"style": "wipe"}}),
 ("Guide + disclaimer", "KineticType",
  {"kicker": "The full pricing guide", "lines": ["dollarsanddeductions.com"]},
  "The full CPA pricing guides are on dollarsanddeductions.com. And a reminder: everything in this video is for educational purposes only. It's not tax, legal, or financial advice. The prices here are commonly reported ranges, not quotes, and your situation is your own, so get written proposals before you decide.",
  {"transition": {"style": "wipe"}}),
 ("Outro", "OutroCard",
  {"nextTitle": "Do You Need a Tax Strategist?"},
  "Thanks for watching Dollars and Deductions. Next time: what a tax strategist actually does, and whether you need one. Subscribe so you don't miss it. Real business. Real answers.",
  {}),
]

TEASER = [
 ("Hook", "HookCard",
  {"sticker": "CPA costs", "text": "Your tax return is the *smallest* part of the bill."},
  "If you think your CPA costs what your tax return costs, you're probably only counting the smallest part of the bill. Here's the whole thing.",
  {"startSec": 0.2, "transition": {"style": "wipe", "durationInFrames": 24}}),
 ("The return", "NumberCallout",
  {"kicker": "A sole proprietor's return", "value": 1000, "doubleRule": False, "caption": "Roughly $500 to $1,500"},
  "A sole proprietor's return is commonly reported at roughly five hundred to fifteen hundred dollars. Say a thousand.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("The full year", "BarChart",
  {"kicker": "An illustrative year", "title": "The *whole* bill", "bars": [
     {"label": "Return", "caption": "Schedule C", "value": 1000, "tone": "neutral"},
     {"label": "Full year", "caption": "+ books, planning", "value": 7800, "tone": "cost"}]},
  "Now add bookkeeping at four hundred a month, that's forty-eight hundred a year, and two planning sessions at a thousand each. The year comes to seventy-eight hundred dollars. The return is about an eighth of it.",
  {"transition": {"style": "iris", "durationInFrames": 24}}),
 ("The lever", "KineticType",
  {"lines": ["Clean books,", "clean *quote*."]},
  "The biggest lever you control is the condition of your books. Clean, reconciled books versus a shoebox of receipts can double a quote.",
  {"transition": {"style": "fade", "durationInFrames": 20}}),
 ("CTA", "ShortCTA",
  {"fullVideoTitle": "How Much Does a CPA Cost for a Small Business?"},
  "The full breakdown, with real ranges and how to compare quotes, is on the channel. Educational only, and these are ranges, not quotes, so get yours in writing.",
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
    main_chars, main_secs = build('video-03', MAIN, False)
    t_chars, t_secs = build('video-03-teaser', TEASER, True)
    d = ROOT / 'video-03-cpa-cost'; d.mkdir(exist_ok=True)
    sources = [
      "## Math and sources",
      "",
      "Every price is a range quoted in the site's articles, which cite 2025–2026 industry pricing surveys and firm-published guides: dollarsanddeductions.com/how-much-does-a-cpa-cost/ and /how-much-does-a-cpa-cost-for-a-small-business/ (both reviewed October 3, 2026). The script uses no ranges the articles don't, and says \"commonly reported\" and \"not quotes\" the same way they do.",
      "",
      "| Claim | Value | Basis |",
      "|---|---|---|",
      "| Hourly | $100–$400+ | CPA cost article |",
      "| Monthly subscription | $200–$1,000+ | CPA cost article |",
      "| Schedule C / 1065 / 1120-S / 1120 | $500–$1,500 / $1,000–$2,500 / $1,200–$2,500+ / $1,500–$3,000+ | CPA cost article (2026 ranges) |",
      "| Most common band | $1,000–$1,499 | Ignition 2025 U.S. pricing survey, as cited in the article; the script says \"one industry pricing survey\" |",
      "| Bookkeeping | $200–$1,000/mo → × 12 = **$2,400–$12,000/yr** | Small-business article |",
      "| Planning | $500–$1,500 per session | Small-business article |",
      "| Illustrative year | $1,000 return + $400 × 12 = $4,800 books → **$5,800**; + 2 × $1,000 planning → **$7,800**. Return share: 1,000 / 7,800 = 12.8% (\"about an eighth\") | Example values chosen inside the article ranges; the script says they're illustrative |",
      "| Bundle | $750/mo × 12 = **$9,000/yr** | Small-business article (\"commonly starting around $750/month\") |",
      "| Bundle vs à la carte | $9,000 > $7,800 in the example, consistent with the article: clean books → unbundled cheaper; recurring cleanup → bundle usually lower total | Small-business article |",
      "| Book condition | Can double a quote | CPA cost article |",
      "| Online / virtual firms | Commonly 20–50% less | Both articles |",
      "| DIY software | Business tiers commonly under $200 | Small-business article FAQ |",
      "",
      "## Compliance notes",
      "",
      "- No CPA, advisor or professional titles are claimed for the channel or narrator. The video is about what CPAs charge, not advice from one.",
      "- Every range is framed as \"commonly reported\" orientation, not a quote, as on the site. Segment 02 says so up front; segment 21 repeats it with the spoken disclaimer.",
      "- No partner or referral pitch. Segment 21 points to the site's free pricing guides only.",
    ]
    (d / 'script.md').write_text(md(
        "How Much Does a CPA Cost for a Small Business?", 'video-03', MAIN, main_chars, main_secs,
        "16:9 · 1920×1080 · main video",
        ["Video 3 · full narration script. Structure: cold open (the return is the smallest bill) → pricing models → return ranges by entity → three bills → an illustrative year vs a bundle → what moves the quote → online vs local, DIY breakpoint → comparable quotes → CTA + disclaimer.",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        sources))
    (d / 'teaser-script.md').write_text(md(
        "Teaser · How Much Does a CPA Cost? (Shorts / Reels)", 'video-03-teaser', TEASER, t_chars, t_secs,
        "9:16 · 1080×1920 · vertical teaser",
        ["Hook (the return is the smallest part) → a $1,000 return → the $7,800 year → book condition → \"full breakdown on the channel\".",
         "",
         "**Status: draft for Dustin's read. Not voiced.**"],
        ["Math matches the main video: $1,000 return + $4,800 bookkeeping ($400 × 12) + $2,000 planning = $7,800. See `script.md` → Math and sources."]))
    print(f"main: {main_chars:,} chars, ~{main_secs/60:.1f} min | teaser: {t_chars:,} chars, ~{t_secs:.0f}s")

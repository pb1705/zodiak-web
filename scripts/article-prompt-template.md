# Claude API Article Prompt Template

Use this with the Claude API to get **properly formatted** articles (Markdown or HTML). Copy and adapt for each article.

**Quick generate:** Run the script to get a Markdown file in one go:

```bash
# Set your API key (get it at https://console.anthropic.com/)
export ANTHROPIC_API_KEY=sk-ant-...

# Generate an article (saved to scripts/output/<slug>.md)
node scripts/generate-article.js how-to-read-birth-chart
node scripts/generate-article.js rising-sign-ascendant
node scripts/generate-article.js mercury-retrograde-2025
node scripts/generate-article.js vedic-vs-western-astrology
```

Then edit the generated file (fact-check dates, add your voice, add FAQ schema if needed) and publish to your Learn/blog section.

---

## Format instructions (include in every request)

```
Output the article in Markdown with this structure only:
- One # H1 title at the top
- Short intro paragraph (2-3 sentences)
- ## H2 for each main section, ### H3 for subsections
- Short paragraphs (2-4 sentences each), no walls of text
- Bullet lists where helpful
- Internal links in format: [anchor text](/path) for: /birth-chart, /horoscope, /daily-cosmic, /compatibility, /transits
- End with a 1-sentence CTA linking to the most relevant tool
Use only **bold**, *italic*, and [links](url). No other Markdown (no images unless requested).
```

---

## Example prompts (paste into Claude API)

### 1. How to read your birth chart

```
Write a 600–800 word article: "How to Read Your Birth Chart".

Audience: people new to astrology who want to understand their natal chart.
Tone: clear, warm, expert but accessible.

Structure:
- H1: How to Read Your Birth Chart
- Intro: what a birth chart is and why it matters (2–3 sentences)
- H2: What You Need (date, time, place of birth)
- H2: The Big Three (Sun, Moon, Rising) — 1 short para each
- H2: Houses and Planets — brief, non-overwhelming
- H2: How to Start Reading — 3–4 practical steps
- CTA: link to our free birth chart calculator at /birth-chart

Include 2–3 internal links to /birth-chart, /horoscope, or /transits where natural.
Output in Markdown only, with the format rules above.
```

### 2. What is a rising sign (ascendant)?

```
Write a 500–700 word article: "What Is a Rising Sign (Ascendant)?".

Audience: people who know their sun sign but not their rising sign.
Tone: clear, concise, expert.

Structure:
- H1: What Is a Rising Sign (Ascendant)?
- Intro: definition in 2–3 sentences
- H2: How the Rising Sign Is Calculated (time and place of birth)
- H2: Rising vs Sun vs Moon — short comparison
- H2: Why It Matters (first impressions, outer style)
- CTA: link to free birth chart at /birth-chart to get your rising sign

Include 1–2 internal links to /birth-chart or /horoscope.
Output in Markdown only, with the format rules above.
```

### 3. Mercury retrograde 2025

```
Write a 500–700 word article: "Mercury Retrograde 2025: Dates and Meaning".

Audience: people searching for Mercury retrograde dates and what to do.
Tone: practical, reassuring, expert.

Structure:
- H1: Mercury Retrograde 2025: Dates and Meaning
- Intro: what Mercury retrograde is (2–3 sentences)
- H2: Mercury Retrograde 2025 Dates (list each period with dates)
- H2: What It Means (communication, tech, travel — keep brief)
- H2: How to Use It Well (3–4 practical tips)
- CTA: link to /transits to track current transits

Include 1–2 internal links to /transits or /daily-cosmic.
Output in Markdown only, with the format rules above.
```

### 4. Vedic vs Western astrology

```
Write a 600–800 word article: "Vedic vs Western Astrology: Key Differences".

Audience: people curious about the two systems.
Tone: neutral, informative, respectful of both.

Structure:
- H1: Vedic vs Western Astrology: Key Differences
- Intro: both are valid systems; different origins and focus (2–3 sentences)
- H2: Western Astrology (tropical zodiac, sun-sign focus, brief history)
- H2: Vedic Astrology (sidereal zodiac, moon and nakshatras, brief history)
- H2: Main Differences (zodiac, timing, emphasis — bullet list ok)
- H2: Which One to Use (personal choice; we offer both)
- CTA: link to /birth-chart or /daily-cosmic

Include 2–3 internal links to /birth-chart, /daily-cosmic, or /compatibility.
Output in Markdown only, with the format rules above.
```

---

## Tips for best results

1. **Always include the format instructions** at the start or end of your prompt so the API returns consistent Markdown.
2. **Ask for word counts** (e.g. 600–800 words) to avoid overly long or short articles.
3. **Specify internal links** and paths so the API uses your real URLs.
4. **Edit after generation:** fact-check dates (e.g. Mercury retrograde 2025), terms, and add your voice before publishing.
5. **Add FAQ schema** yourself if you want rich results: turn 2–3 Q&As from the article into FAQPage JSON-LD on the page.

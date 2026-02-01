#!/usr/bin/env node
/**
 * Generate a properly formatted article using Claude API.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=your_key node scripts/generate-article.js "how-to-read-birth-chart"
 *   ANTHROPIC_API_KEY=your_key node scripts/generate-article.js "rising-sign-ascendant"
 *
 * Prompts are in scripts/article-prompt-template.md — copy one into the script below
 * or pass a slug and we use a built-in prompt. Output is saved to scripts/output/<slug>.md.
 *
 * Get your API key: https://console.anthropic.com/
 * Add to .env.local: ANTHROPIC_API_KEY=sk-ant-...
 */

const fs = require('fs');
const path = require('path');

const PROMPTS = {
  'how-to-read-birth-chart': `Write a 600–800 word article: "How to Read Your Birth Chart".
Audience: people new to astrology who want to understand their natal chart. Tone: clear, warm, expert but accessible.
Structure: H1: How to Read Your Birth Chart. Intro: what a birth chart is and why it matters (2–3 sentences). H2: What You Need (date, time, place of birth). H2: The Big Three (Sun, Moon, Rising) — 1 short para each. H2: Houses and Planets — brief. H2: How to Start Reading — 3–4 practical steps. CTA: link to our free birth chart at /birth-chart.
Include 2–3 internal links to /birth-chart, /horoscope, or /transits. Output in Markdown only: one # H1, ## H2, ### H3, short paragraphs, [links](/path).`,

  'rising-sign-ascendant': `Write a 500–700 word article: "What Is a Rising Sign (Ascendant)?".
Audience: people who know their sun sign but not rising. Tone: clear, expert.
Structure: H1: What Is a Rising Sign (Ascendant)? Intro: definition in 2–3 sentences. H2: How the Rising Sign Is Calculated. H2: Rising vs Sun vs Moon. H2: Why It Matters. CTA: link to /birth-chart.
Include 1–2 internal links to /birth-chart or /horoscope. Output in Markdown only: one # H1, ## H2, short paragraphs, [links](/path).`,

  'mercury-retrograde-2025': `Write a 500–700 word article: "Mercury Retrograde 2025: Dates and Meaning".
Audience: people searching for Mercury retrograde dates. Tone: practical, reassuring.
Structure: H1: Mercury Retrograde 2025: Dates and Meaning. Intro: what it is. H2: Mercury Retrograde 2025 Dates (list each period). H2: What It Means. H2: How to Use It Well (3–4 tips). CTA: link to /transits.
Include 1–2 internal links to /transits or /daily-cosmic. Output in Markdown only: one # H1, ## H2, short paragraphs, [links](/path).`,

  'vedic-vs-western-astrology': `Write a 600–800 word article: "Vedic vs Western Astrology: Key Differences".
Audience: people curious about both systems. Tone: neutral, informative.
Structure: H1: Vedic vs Western Astrology: Key Differences. Intro: both valid, different origins. H2: Western Astrology. H2: Vedic Astrology. H2: Main Differences (bullet list). H2: Which One to Use. CTA: link to /birth-chart or /daily-cosmic.
Include 2–3 internal links to /birth-chart, /daily-cosmic, /compatibility. Output in Markdown only: one # H1, ## H2, short paragraphs, [links](/path).`,
};

const FORMAT_INSTRUCTION = `Output the article in Markdown with: one # H1 at the top, ## H2 for main sections, ### H3 for subsections, short paragraphs (2-4 sentences), bullet lists where helpful. Internal links as [text](/path) for /birth-chart, /horoscope, /daily-cosmic, /compatibility, /transits. End with a 1-sentence CTA linking to the most relevant tool. Use only **bold**, *italic*, and [links](url).`;

async function main() {
  const slug = process.argv[2] || 'how-to-read-birth-chart';
  const prompt = PROMPTS[slug];
  if (!prompt) {
    console.error('Unknown slug. Use one of:', Object.keys(PROMPTS).join(', '));
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Set ANTHROPIC_API_KEY (e.g. in .env.local or export ANTHROPIC_API_KEY=sk-ant-...)');
    process.exit(1);
  }

  const fullPrompt = `${FORMAT_INSTRUCTION}\n\n---\n\n${prompt}`;

  const body = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [{ role: 'user', content: fullPrompt }],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('API error:', res.status, err);
    process.exit(1);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  if (!text) {
    console.error('No text in response');
    process.exit(1);
  }

  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outPath, text.trim(), 'utf8');
  console.log('Saved:', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

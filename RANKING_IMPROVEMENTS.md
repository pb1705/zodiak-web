# How to Move zodiak.life Up in Search Results

Beyond what’s already done (metadata, keywords, schema, sitemap, one H1 per page), these actions help improve **ranking** over time. Google’s main signals: **backlinks**, **content quality**, **page experience**, and **user engagement**.

---

## 1. Backlinks (Off-Page SEO)

Backlinks from other sites are one of the strongest ranking factors.

**What to do:**

- **Guest posts**: Write for astrology, wellness, or lifestyle blogs and link back to zodiak.life (e.g. “Free birth chart calculator”, “Daily horoscope”).
- **Directories**: List Zodiak in app directories (Product Hunt, alternative-to lists), astrology/wellness directories, and “best astrology app” roundups.
- **Partnerships**: Ask astrology influencers, newsletters, or podcasts to mention or link to zodiak.life.
- **Content that earns links**: Publish useful, unique content (see Section 2) that others want to reference and link to.
- **Social**: Share key pages (birth chart, horoscope, blog) on Twitter, Instagram, Reddit (r/astrology, r/AskAstrologers) with a link—links from social don’t pass “link juice” but can bring traffic and indirect links.

**Avoid:** Buying links, link farms, or spammy link schemes; they can hurt rankings.

---

## 2. Content Quality & Freshness (E-E-A-T)

Google favors **original, helpful content** that shows expertise and is kept up to date.

**What to do:**

- **Blog / guides**: Add a simple blog or “Learn” section with articles like:
  - “How to read your birth chart”
  - “What is a rising sign (ascendant)?”
  - “Mercury retrograde 2025 dates and meaning”
  - “Vedic vs Western astrology: differences”
  Use target keywords naturally and link to your tools (birth chart, horoscope, transits).
- **FAQs**: Add short FAQ sections on key pages (birth-chart, horoscope, compatibility) with schema (FAQPage) where it makes sense—you already do this on Support.
- **Update key pages**: Refresh “last updated” or add a “Updated [date]” note on horoscope, daily cosmic, and transits so Google sees freshness.
- **Long-tail pages**: Create pages for phrases like “Aries and Leo compatibility”, “birth chart calculator free”, “today’s horoscope for [sign]” if you don’t already cover them (e.g. via horoscope/[sign] and compatibility).

---

### Fresh articles daily? Does it help?

**Freshness helps, but quality matters more.**

- **What "fresh" means for you:** Your horoscope and daily cosmic pages already update daily (via your data/API). That counts as fresh. You don't need a *new* long article every single day.
- **Daily new articles:** Publishing a brand-new article every day can help *if* each one is genuinely useful and original. Publishing lots of thin or repetitive content can hurt rankings. Prefer **2–4 strong articles per month** over 30 weak ones.
- **Good rhythm:**  
  - **Daily:** Keep horoscope, daily cosmic, transits updated (you already do).  
  - **Weekly:** One short "This week in astrology" or "Moon phase this week" post.  
  - **Biweekly/monthly:** Deeper guides (e.g. "How to read your birth chart", "Mercury retrograde 2025").
- **Bottom line:** Regular, helpful updates beat "daily for the sake of daily." Focus on quality and usefulness first.

### Using AI for content? Does it help?

**Yes, if you use it as an assistant—not as a replacement for expertise.**

- **Google's stance:** They reward *helpful, original* content. They've said they don't penalize content just because it's AI-assisted; they care about quality and E-E-A-T (experience, expertise, authoritativeness, trust).
- **Risks of pure AI content:** Raw AI output is often generic, repetitive, or factually shallow. Sites that publish a lot of it without editing or expertise can get lower rankings or manual actions if it's seen as spam.
- **Best way to use AI:**
  - **Research & outlines:** Use AI to brainstorm topics, outlines, or first drafts.
  - **Drafts:** Generate a draft, then **edit heavily**: add your own voice, correct facts, add examples, and link to your tools (birth chart, horoscope, transits).
  - **Tie content to your app:** e.g. "Based on today's transits in Zodiak", "Try your free birth chart here", "See your sign's horoscope today." That makes content unique and useful.
  - **Human pass:** Always fact-check dates (e.g. Mercury retrograde 2025), astrological terms, and interpretations. A quick review by someone who knows astrology (or you) improves trust and quality.
- **Bottom line:** AI can speed up writing and ideas; **you** add the expertise, accuracy, and links to your product. That combination helps both users and SEO.

---

## 3. Page Experience (Core Web Vitals & Mobile)

Page speed and stability are ranking factors.

**What to do:**

- **Measure**: Use [PageSpeed Insights](https://pagespeed.web.dev/) and **Search Console → Experience → Core Web Vitals** for zodiak.life.
- **Images**: Keep using Next.js `Image` with sensible `sizes`; compress images (e.g. WebP). You already use `priority` on the hero image.
- **Fonts**: You preconnect to Google Fonts; consider `font-display: swap` and only loading weights you use.
- **LCP**: Ensure the largest element (often hero image or main heading) loads quickly; avoid blocking scripts above the fold.
- **CLS**: Avoid layout shifts (e.g. reserve space for images with width/height; you already do this in places).
- **Mobile**: Test on real devices; tap targets and text size matter for usability and mobile ranking.

---

## 4. Search Console & Indexing

Use Search Console to fix issues and nudge Google to crawl what matters.

**What to do:**

- **Submit sitemap**: `https://zodiak.life/sitemap.xml` (see [GET_LISTED_GOOGLE.md](./GET_LISTED_GOOGLE.md)).
- **Request indexing**: For homepage and important URLs (birth-chart, horoscope, daily-cosmic, compatibility, transits) via **URL Inspection → Request indexing** after big changes.
- **Monitor**: **Performance** → see which queries and pages get impressions/clicks; double down on content and titles for queries that already get impressions but low clicks.
- **Fix errors**: **Pages** and **Experience** for crawl errors, mobile usability, or Core Web Vitals; fix critical issues first.
- **Coverage**: If “Discovered – currently not indexed” grows, consider increasing internal links to those URLs or requesting indexing for the most important ones.

---

## 5. Titles & Descriptions (CTR)

Better click-through from search results can support rankings over time.

**What to do:**

- **Titles**: Keep one primary keyword near the start, brand at the end; stay within ~50–60 characters so they don’t get cut off.
- **Descriptions**: Write clear, benefit-focused copy (e.g. “Free birth chart in 2 minutes”, “Today’s horoscope for all 12 signs”) and stay within ~120–158 characters.
- **A/B feel**: In Search Console, compare different pages’ CTR for similar queries; if a page has good impressions but low CTR, try a more compelling title/description.

---

## 6. Internal Linking

Strong internal links help Google discover and weight your important pages.

**What to do:**

- **Link from homepage**: You already link to birth-chart, horoscope, daily-cosmic, compatibility, transits, readers; keep these clear and descriptive (e.g. “Free birth chart”, “Today’s horoscope”).
- **Link between tools**: From horoscope page to birth chart (“Get a full birth chart”), from compatibility to birth chart (“Need birth details?”), from transits to daily cosmic, etc.
- **Footer**: Keep footer links to main sections and key legal/support pages.
- **Breadcrumbs**: Use breadcrumb links (and BreadcrumbList schema) on inner pages so both users and Google see hierarchy.

---

## 7. User Engagement (Indirect Ranking Signals)

Google uses engagement as a signal (e.g. pogo-sticking, time on page).

**What to do:**

- **Fast, clear landing**: Fast load and clear headline/CTA so visitors don’t bounce immediately.
- **Relevant content**: Match the intent of the query (e.g. “birth chart calculator” → page that lets them calculate in one or two steps).
- **Mobile UX**: Easy tap targets, readable text, minimal pop-ups so mobile users stay and engage.
- **Value first**: Lead with free, useful content (e.g. horoscope, birth chart) before asking for sign-up or payment where that fits your product.

---

## 8. Optional: Local & Business Trust

If you have a business entity or audience in a specific region:

- **Google Business Profile**: If you have a physical location or serve a local audience, create/optimize a profile and link to zodiak.life.
- **NAP + schema**: Keep Organization schema (and ContactPoint) accurate; same name, address, phone (NAP) on site and in profiles.
- **Reviews**: Encourage genuine reviews on the app stores or Google; schema and real reviews support E-E-A-T.

---

## 9. What You’ve Already Done (Recap)

- Metadata, keywords, and schema (WebSite, Organization, ItemList, FAQ, etc.)
- Sitemap, robots.txt, canonicals, hreflang
- One H1 per page (readers, horoscope)
- Preconnect/dns-prefetch for performance
- Theme color, clear structure

---

## 10. Priority Order (If You Do a Few Things First)

1. **Search Console**: Verify, submit sitemap, request indexing for main URLs (see GET_LISTED_GOOGLE.md).
2. **Backlinks**: 2–3 quality links from astrology/wellness sites or directories.
3. **Content**: 3–5 helpful articles (blog or guides) with internal links to your tools.
4. **Core Web Vitals**: Check PageSpeed + Search Console and fix “Poor” URLs.
5. **Titles/descriptions**: Tweak any page with high impressions and low CTR in Search Console.

Rankings usually improve over **weeks to months**; focus on backlinks and content first, then refine with Search Console and Core Web Vitals data.

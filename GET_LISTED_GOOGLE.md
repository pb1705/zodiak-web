# Get zodiak.life into Google Search (Astrology Results)

Your site is already optimized for astrology-related searches (titles, descriptions, schema). To **actually show up** in Google for “astrology”, “birth chart”, “daily horoscope”, etc., you need to get the site **indexed** and give Google time to rank it.

## 1. Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property** → choose **URL prefix** → enter `https://zodiak.life`.
3. **Verify ownership** using one of:
   - **HTML tag** (recommended): add the meta tag they give you to your site (e.g. in `app/layout.tsx` `<head>`). You already have `NEXT_PUBLIC_GOOGLE_VERIFICATION` in metadata — use that value as the content of the verification meta tag if it matches.
   - **HTML file upload**: download their file, put it in `public/`, deploy.
   - **DNS**: add the TXT record they provide at your domain DNS.
4. After verification, go to **Sitemaps** and submit:
   - `https://zodiak.life/sitemap.xml`
5. Use **URL Inspection** for your homepage:
   - Enter `https://zodiak.life` → **Request indexing**.
   - Optionally request indexing for key pages: `/birth-chart`, `/horoscope`, `/daily-cosmic`, `/compatibility`, `/transits`.

## 2. Give it time

- New or updated sites often take **days to a few weeks** to appear for competitive terms like “astrology”.
- Check **Search Console → Performance** after a week to see impressions, clicks, and queries.
- Keep the sitemap submitted; Google will recrawl periodically.

## 3. Optional: Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Add site `https://zodiak.life` and verify (similar options to Google).
3. Submit sitemap: `https://zodiak.life/sitemap.xml`.

## 4. What’s already done on the site

- **Titles/descriptions**: “Astrology” and related terms in default and Open Graph metadata.
- **Schema**: WebSite and other structured data with astrology-focused name/description.
- **Sitemap**: All main pages and horoscope sign URLs in `sitemap.xml`.
- **robots.txt**: Allows crawlers; sitemap URL is declared.
- **Canonical URLs** and **hreflang** for language/SEO.

Submitting the sitemap and requesting indexing in Search Console is the main step to get zodiak.life showing in search results for astrology-related queries.

**To move up in rankings** (backlinks, content, Core Web Vitals, engagement), see **[RANKING_IMPROVEMENTS.md](./RANKING_IMPROVEMENTS.md)**.

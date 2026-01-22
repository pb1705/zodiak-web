# Multi-Language Support (Hreflang Tags)

This document explains how the multi-language (hreflang) implementation works and how to add new languages.

## Current Implementation

The site currently supports **English (en)** as the default language. Hreflang tags are implemented and ready for additional languages.

## How It Works

### 1. Language Configuration (`lib/languages.ts`)

All supported languages are defined in `lib/languages.ts`. Currently, only English is active:

```typescript
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    locale: 'en_US',
    name: 'English',
    region: 'US',
  },
  // Additional languages can be added here
];
```

### 2. Hreflang Tags in Root Layout

The root layout (`app/layout.tsx`) automatically generates hreflang tags for all supported languages:

```html
<link rel="alternate" hrefLang="en" href="https://zodiak.life/" />
<link rel="alternate" hrefLang="x-default" href="https://zodiak.life/" />
```

### 3. Page-Level Hreflang

Each page includes hreflang tags in its metadata:

```typescript
alternates: {
  canonical: `${baseUrl}/birth-chart`,
  languages: Object.fromEntries(
    SUPPORTED_LANGUAGES.map(lang => [
      lang.code,
      getHreflangUrl('/birth-chart', lang, baseUrl)
    ])
  ),
}
```

## Adding a New Language

### Step 1: Add Language to Configuration

Edit `lib/languages.ts` and uncomment or add a new language:

```typescript
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    locale: 'en_US',
    name: 'English',
    region: 'US',
  },
  {
    code: 'es',        // ISO 639-1 code
    locale: 'es_ES',   // Full locale
    name: 'Español',   // Language name
    region: 'ES',      // Region code
  },
];
```

### Step 2: Update URL Structure (Future)

Currently, all languages use the same URL structure. When you're ready to implement language-specific URLs:

1. Update `getHreflangUrl()` in `lib/languages.ts`:
   ```typescript
   export function getHreflangUrl(path: string, lang: LanguageConfig, baseUrl: string): string {
     if (lang.code === DEFAULT_LANGUAGE.code) {
       return `${baseUrl}${path}`;
     }
     // Language-specific URLs: /es/birth-chart, /hi/birth-chart, etc.
     return `${baseUrl}/${lang.code}${path}`;
   }
   ```

2. Implement Next.js i18n routing (optional):
   - Use Next.js middleware for locale detection
   - Create `[locale]` route groups
   - Update all page imports

### Step 3: Add Translations

1. Create translation files (e.g., `messages/es.json`, `messages/hi.json`)
2. Update page content to use translations
3. Implement a translation hook or context

### Step 4: Update HTML Lang Attribute

Update the `<html>` tag in `app/layout.tsx` to be dynamic based on the current locale.

## Current Status

✅ **Implemented:**
- Hreflang tags in root layout
- Hreflang tags in all page metadata
- Language configuration system
- Open Graph alternateLocale support
- Structured data with inLanguage

⏳ **Ready for Future:**
- Language-specific URL routing
- Translation system integration
- Dynamic HTML lang attribute
- Language switcher component

## SEO Benefits

Hreflang tags help search engines:
- Understand which language version to show users
- Prevent duplicate content issues across languages
- Improve international SEO rankings
- Provide better user experience for global audiences

## Testing

To verify hreflang tags are working:

1. View page source and check for `<link rel="alternate" hrefLang="...">` tags
2. Use Google Search Console's International Targeting report
3. Test with hreflang tag checker tools online

## Notes

- Currently, all language variants point to the same URLs (English content)
- When translations are added, update URLs to point to language-specific pages
- The `x-default` tag points to the default language (English)
- All pages automatically include hreflang tags via metadata

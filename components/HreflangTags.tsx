'use client';

import { usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

/**
 * Client component to generate hreflang tags for the current page
 * Use this in pages that need dynamic hreflang tags based on the current path
 */
export function HreflangTags() {
  const pathname = usePathname();
  
  return (
    <>
      {SUPPORTED_LANGUAGES.map(lang => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={getHreflangUrl(pathname, lang, baseUrl)}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={getHreflangUrl(pathname, DEFAULT_LANGUAGE, baseUrl)}
      />
    </>
  );
}

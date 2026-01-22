// Supported languages configuration for hreflang tags
export interface LanguageConfig {
  code: string; // ISO 639-1 language code
  locale: string; // Full locale code (e.g., en_US, es_ES)
  name: string; // Language name
  region?: string; // Optional region code
}

// Currently supported languages
// Add more languages as they become available
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    locale: 'en_US',
    name: 'English',
    region: 'US',
  },
  // Future language support - uncomment as translations become available
  // {
  //   code: 'es',
  //   locale: 'es_ES',
  //   name: 'Español',
  //   region: 'ES',
  // },
  // {
  //   code: 'hi',
  //   locale: 'hi_IN',
  //   name: 'हिन्दी',
  //   region: 'IN',
  // },
  // {
  //   code: 'fr',
  //   locale: 'fr_FR',
  //   name: 'Français',
  //   region: 'FR',
  // },
  // {
  //   code: 'de',
  //   locale: 'de_DE',
  //   name: 'Deutsch',
  //   region: 'DE',
  // },
  // {
  //   code: 'pt',
  //   locale: 'pt_BR',
  //   name: 'Português',
  //   region: 'BR',
  // },
  // {
  //   code: 'it',
  //   locale: 'it_IT',
  //   name: 'Italiano',
  //   region: 'IT',
  // },
  // {
  //   code: 'ja',
  //   locale: 'ja_JP',
  //   name: '日本語',
  //   region: 'JP',
  // },
  // {
  //   code: 'zh',
  //   locale: 'zh_CN',
  //   name: '中文',
  //   region: 'CN',
  // },
];

// Default language
export const DEFAULT_LANGUAGE: LanguageConfig = SUPPORTED_LANGUAGES[0];

// Get language by code
export function getLanguageByCode(code: string): LanguageConfig | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

// Generate hreflang URL for a given path
export function getHreflangUrl(path: string, lang: LanguageConfig, baseUrl: string): string {
  // For now, all languages use the same URL structure
  // In the future, you might want: `${baseUrl}/${lang.code}${path}`
  if (lang.code === DEFAULT_LANGUAGE.code) {
    return `${baseUrl}${path}`;
  }
  // Future: return `${baseUrl}/${lang.code}${path}`;
  return `${baseUrl}${path}`;
}

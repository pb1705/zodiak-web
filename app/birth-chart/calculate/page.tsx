import type { Metadata } from 'next';
import BirthChartClient from '../BirthChartClient';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Generate Birth Chart — Free Natal Chart Calculator | Zodiak',
  description: 'Enter your birth details to generate a complete natal chart with planetary positions, house placements, and aspects. Free birth chart calculator powered by NASA data. Get detailed interpretations for all 12 houses, planetary aspects, and chart patterns.',
  keywords: ['birth chart calculator', 'natal chart generator', 'free birth chart', 'astrology chart calculator', 'planetary positions', 'house placements', 'ascendant calculator', 'rising sign calculator'],
  openGraph: {
    title: 'Generate Birth Chart — Free Natal Chart Calculator | Zodiak',
    description: 'Enter your birth details to generate a complete natal chart with planetary positions, house placements, and aspects.',
    url: `${baseUrl}/birth-chart/calculate`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
  },
  alternates: {
    canonical: `${baseUrl}/birth-chart/calculate`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/birth-chart/calculate', lang, baseUrl)
      ])
    ),
  },
};

export default function BirthChartCalculatePage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <BirthChartClient />
    </main>
  );
}

import type { Metadata } from 'next';
import TransitsClient from '../TransitsClient';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'View Transits — Planetary Transit Calculator | Zodiak',
  description: 'Enter your birth details to view personalized planetary transits for daily, weekly, monthly, and yearly periods. Track how current planetary movements affect your natal chart with NASA-precise calculations.',
  keywords: ['transit calculator', 'planetary transits calculator', 'daily transits', 'weekly transits', 'monthly transits', 'yearly transits', 'transit tracking', 'current transits'],
  openGraph: {
    title: 'View Transits — Planetary Transit Calculator | Zodiak',
    description: 'Enter your birth details to view personalized planetary transits for daily, weekly, monthly, and yearly periods.',
    url: `${baseUrl}/transits/calculate`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
  },
  alternates: {
    canonical: `${baseUrl}/transits/calculate`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/transits/calculate', lang, baseUrl)
      ])
    ),
  },
};

export default function TransitCalculatePage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <TransitsClient />
    </main>
  );
}

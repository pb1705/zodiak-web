import type { Metadata } from 'next';
import HoroscopeDetailClient from './HoroscopeDetailClient';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign: signParam } = await params;
  const sign = signParam.charAt(0).toUpperCase() + signParam.slice(1);
  const path = `/horoscope/${signParam}`;
  
  return {
    title: `${sign} Daily Horoscope Today — Love, Career, Health | Zodiak`,
    description: `Today's horoscope for ${sign}. Personalized astrological guidance for love, career, health, finances, and spirituality. Get daily, weekly, monthly, and yearly forecasts powered by NASA data.`,
    keywords: [`${sign} horoscope`, `${sign} daily horoscope`, `${sign} horoscope today`, `${sign} astrology`, `${sign} zodiac sign`, `today ${sign} horoscope`, `${sign} love horoscope`, `${sign} career horoscope`, `${sign} weekly horoscope`, `${sign} monthly horoscope`, `${sign} today`, `${sign} sign`, `horoscope ${sign} today`],
    openGraph: {
      title: `${sign} Daily Horoscope Today | Zodiak`,
      description: `Today's horoscope for ${sign}. Personalized astrological guidance for love, career, health, and finances.`,
      url: `${baseUrl}${path}`,
      type: 'website',
      locale: DEFAULT_LANGUAGE.locale,
      alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
      images: [{
        url: `${baseUrl}/og-horoscope-${signParam}.png`,
        width: 1200,
        height: 630,
        alt: `${sign} Daily Horoscope`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sign} Daily Horoscope Today`,
      description: `Today's horoscope for ${sign}. Personalized astrological guidance.`,
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(lang => [
          lang.code,
          getHreflangUrl(path, lang, baseUrl)
        ])
      ),
    },
  };
}

export const revalidate = 3600; // Cache for 1 hour

export default async function SignHoroscopePage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  
  return <HoroscopeDetailClient sign={sign} />;
}

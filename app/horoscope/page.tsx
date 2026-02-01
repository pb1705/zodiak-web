import type { Metadata } from 'next';
import Link from 'next/link';
import { StarIcon, SunIcon, MoonIcon } from '@/components/icons';
import { fetchAllDailyHoroscopes } from '@/lib/api';
import AppDownloadButtons from '@/components/AppDownloadButtons';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Daily Horoscopes — All 12 Zodiac Signs | Zodiak',
  description: 'Daily horoscopes for Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces. NASA data. Updated daily.',
  keywords: ['daily horoscope', 'horoscope today', 'today horoscope', 'zodiac signs', 'zodiac horoscope', 'sun sign horoscope', 'daily zodiac forecast', 'today\'s horoscope', 'daily astrology', 'free daily horoscope', 'love horoscope', 'career horoscope', 'Aries horoscope', 'Taurus horoscope', 'Gemini horoscope', 'Cancer horoscope', 'Leo horoscope', 'Virgo horoscope', 'Libra horoscope', 'Scorpio horoscope', 'Sagittarius horoscope', 'Capricorn horoscope', 'Aquarius horoscope', 'Pisces horoscope', 'weekly horoscope', 'monthly horoscope'],
  openGraph: {
    title: 'Daily Horoscopes — All 12 Zodiac Signs | Zodiak',
    description: 'Daily horoscopes for all 12 zodiac signs. NASA data. Updated daily. Love, career, health.',
    url: `${baseUrl}/horoscope`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-horoscope.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Daily Horoscopes',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Horoscopes — All 12 Zodiac Signs',
    description: 'Daily horoscopes for all 12 zodiac signs powered by NASA data. Updated daily.',
  },
  alternates: {
    canonical: `${baseUrl}/horoscope`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/horoscope', lang, baseUrl)
      ])
    ),
  },
};

export const revalidate = 3600; // Revalidate every hour

const ZODIAC_DATA: Record<string, { icon: string; color: string; element: string; planet: string }> = {
  Aries: { icon: '♈', color: '#FF6B6B', element: 'Fire', planet: 'Mars' },
  Taurus: { icon: '♉', color: '#48BB78', element: 'Earth', planet: 'Venus' },
  Gemini: { icon: '♊', color: '#F59E0B', element: 'Air', planet: 'Mercury' },
  Cancer: { icon: '♋', color: '#63B3ED', element: 'Water', planet: 'Moon' },
  Leo: { icon: '♌', color: '#F59E0B', element: 'Fire', planet: 'Sun' },
  Virgo: { icon: '♍', color: '#48BB78', element: 'Earth', planet: 'Mercury' },
  Libra: { icon: '♎', color: '#818CF8', element: 'Air', planet: 'Venus' },
  Scorpio: { icon: '♏', color: '#63B3ED', element: 'Water', planet: 'Pluto' },
  Sagittarius: { icon: '♐', color: '#FF6B6B', element: 'Fire', planet: 'Jupiter' },
  Capricorn: { icon: '♑', color: '#48BB78', element: 'Earth', planet: 'Saturn' },
  Aquarius: { icon: '♒', color: '#818CF8', element: 'Air', planet: 'Uranus' },
  Pisces: { icon: '♓', color: '#63B3ED', element: 'Water', planet: 'Neptune' },
};

export default async function HoroscopePage() {
  const horoscopes = await fetchAllDailyHoroscopes('warm');

  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Hero */}
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <SunIcon size={20} className="text-[#F59E0B]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">DAILY HOROSCOPES</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Today's<br />Horoscopes
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Daily astrological guidance for all 12 zodiac signs powered by NASA data
        </p>
        
        <Link href="#horoscopes" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          View All Signs
        </Link>
      </section>

      {/* Horoscopes Grid - Real Data */}
      <section id="horoscopes" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {horoscopes.map((horoscope) => {
            const zodiacData = ZODIAC_DATA[horoscope.sign] || ZODIAC_DATA.Aries;
            // Use new API structure (overview) with fallback to legacy fields
            const predictionText = horoscope.overview 
              ? horoscope.overview 
              : (typeof horoscope.prediction === 'string' 
                ? horoscope.prediction 
                : (typeof horoscope.general_prediction === 'string' 
                  ? horoscope.general_prediction 
                  : 'Your cosmic guidance is being prepared...'));
            
            return (
              <Link key={horoscope.sign} href={`/horoscope/${horoscope.sign.toLowerCase()}`}>
                <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer min-h-[280px] flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl" style={{ color: zodiacData.color }}>
                        {zodiacData.icon}
                      </span>
                      <div>
                        <h3 className="text-2xl font-light">{horoscope.sign}</h3>
                        <p className="text-xs text-white/40 mono tracking-wider">{zodiacData.element}</p>
                      </div>
                    </div>
                    {horoscope.overall_rating && (
                      <div className="flex items-center gap-1">
                        <StarIcon size={14} className="text-[#F59E0B]" filled />
                        <span className="text-sm font-medium text-white/70">{horoscope.overall_rating}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Prediction */}
                  <p className="text-sm text-white/60 font-light leading-relaxed mb-6 flex-1 line-clamp-4">
                    {predictionText.substring(0, 200)}{predictionText.length > 200 ? '...' : ''}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
                    <span className="font-medium" style={{ color: zodiacData.color }}>Read Full Horoscope</span>
                    <svg className="w-4 h-4" style={{ color: zodiacData.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {horoscopes.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="card-minimal p-8 rounded-none animate-pulse min-h-[280px]">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/5 rounded"></div>
                    <div>
                      <div className="h-6 w-24 bg-white/5 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded w-4/5"></div>
                </div>
                <div className="h-4 w-32 bg-white/5 rounded"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-light mb-8">
          Get personalized insights
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Download Zodiak for horoscopes based on your complete birth chart
        </p>
        <AppDownloadButtons />
      </section>
    </main>
  );
}

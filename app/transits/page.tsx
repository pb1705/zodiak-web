import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingIcon, SunIcon, MoonIcon, StarIcon, CalendarIcon, SparklesIcon } from '@/components/icons';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Planetary Transits — Daily, Weekly, Monthly, Yearly Forecasts | Zodiak',
  description: 'Track planetary transits with NASA-precise calculations. Get daily, weekly, monthly, and yearly transit forecasts combining Vedic and Western astrology for personalized guidance. Real-time planetary movement tracking.',
  keywords: ['planetary transits', 'daily transits', 'weekly forecast', 'monthly horoscope', 'yearly prediction', 'Saturn return', 'Jupiter transit', 'transit tracking', 'planetary movements', 'astrology transits', 'current transits'],
  openGraph: {
    title: 'Planetary Transits — Daily, Weekly, Monthly, Yearly Forecasts | Zodiak',
    description: 'Track planetary transits with NASA-precise calculations. Get personalized transit forecasts for daily, weekly, monthly, and yearly periods.',
    url: `${baseUrl}/transits`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-transits.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Planetary Transits',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planetary Transits — Daily, Weekly, Monthly, Yearly Forecasts',
    description: 'Track planetary transits with NASA-precise calculations. Get personalized transit forecasts.',
  },
  alternates: {
    canonical: `${baseUrl}/transits`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/transits', lang, baseUrl)
      ])
    ),
  },
};

export default function TransitsPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <TrendingIcon size={20} className="text-[#48BB78]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">PLANETARY TRANSITS</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Track the<br />Cosmic Weather
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Real-time planetary movements and how they interact with your natal chart to shape your daily, weekly, monthly, and yearly experiences
        </p>
        
        <Link href="/transits/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          View My Transits
        </Link>
      </section>

      <section id="periods" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          Transit periods
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: SunIcon, color: '#F59E0B', title: 'Daily', desc: 'Moon phases, planetary aspects, and energy quality for today', period: 'daily' },
            { icon: CalendarIcon, color: '#63B3ED', title: 'Weekly', desc: 'Key days, major transits, and weekly themes at a glance', period: 'weekly' },
            { icon: MoonIcon, color: '#818CF8', title: 'Monthly', desc: 'New and full moons, best days, challenging periods, life area focus', period: 'monthly' },
            { icon: StarIcon, color: '#48BB78', title: 'Yearly', desc: 'Quarterly themes, eclipses, retrogrades, and major planetary shifts', period: 'yearly' },
          ].map((item, i) => (
            <Link key={i} href="/transits/calculate">
              <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer h-full">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={32} style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-light mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 font-light leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="card-minimal p-12 rounded-none">
          <h2 className="text-4xl md:text-5xl font-light mb-12 text-center">
            What's included
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {[
              { icon: TrendingIcon, title: 'Overall Rating', desc: 'Daily energy quality score from 1-10 with clear guidance' },
              { icon: MoonIcon, title: 'Moon Tracking', desc: 'Moon sign, nakshatra, tithi, and yoga for each day' },
              { icon: StarIcon, title: 'Critical Transits', desc: 'High-impact planetary aspects that need your attention' },
              { icon: CalendarIcon, title: 'Key Dates', desc: 'Best and challenging days highlighted throughout each period' },
              { icon: SparklesIcon, title: 'Psychological Guidance', desc: 'Modern psychological insights for navigating each transit' },
              { icon: SunIcon, title: 'Traditional Wisdom', desc: 'Vedic remedies and traditional practices for support' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <item.icon size={24} className="text-[#48BB78]" />
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Enter Your Birth Details', text: 'Provide your birth date, time, and location for personalized transits' },
            { num: '02', title: 'Select Time Period', text: 'Choose daily, weekly, monthly, or yearly view' },
            { num: '03', title: 'Get Personalized Guidance', text: 'Receive transit forecasts tailored to your natal chart' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-light text-[#48BB78] mb-4">{step.num}</div>
              <h3 className="text-xl font-light mb-3">{step.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-light mb-8">
          Navigate with clarity
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Know what's coming and make the most of cosmic timing
        </p>
        <Link href="/transits/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          View My Transits
        </Link>
      </section>
    </main>
  );
}

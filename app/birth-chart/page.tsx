import type { Metadata } from 'next';
import Link from 'next/link';
import { CompassIcon, SunIcon, MoonIcon, StarIcon, ChartIcon, SparklesIcon } from '@/components/icons';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Birth Chart Calculator — Free Natal Chart | Zodiak',
  description: 'Free birth chart calculator with planetary positions, houses, and aspects. NASA data. Vedic and Western astrology. Get your natal chart in minutes.',
  keywords: ['birth chart', 'birth chart calculator', 'natal chart', 'free birth chart', 'astrology chart', 'planetary positions', 'house placements', 'aspects', 'zodiac signs', 'ascendant', 'rising sign', 'moon sign', 'sun sign', 'rising sign calculator', 'moon sign calculator', 'birth chart analysis', 'natal chart free', 'birth chart free', 'Vedic birth chart', 'Western birth chart', 'chart ruler', 'planetary aspects'],
  openGraph: {
    title: 'Birth Chart Calculator — Free Natal Chart | Zodiak',
    description: 'Free birth chart calculator with planetary positions, houses, aspects. NASA data. Vedic and Western astrology.',
    url: `${baseUrl}/birth-chart`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-birth-chart.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Birth Chart Calculator',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birth Chart Calculator — Free Natal Chart Analysis',
    description: 'Generate your complete natal birth chart with detailed planetary positions. Powered by NASA data.',
  },
  alternates: {
    canonical: `${baseUrl}/birth-chart`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/birth-chart', lang, baseUrl)
      ])
    ),
  },
};

export default function BirthChartPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <CompassIcon size={20} className="text-[#818CF8]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">NATAL CHART</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Map Your<br />Cosmic Blueprint
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          The exact positions of celestial bodies at your birth create a unique map of your potential, challenges, and life path
        </p>
        
        <Link href="/birth-chart/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          Generate My Chart
        </Link>
      </section>

      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          What you'll discover
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: SunIcon, color: '#F59E0B', title: 'Sun Sign', desc: 'Your core identity, ego, and life purpose. The essence of who you are at your deepest level.' },
            { icon: MoonIcon, color: '#94A3B8', title: 'Moon Sign', desc: 'Your emotional nature, instincts, and inner world. How you process feelings and find comfort.' },
            { icon: CompassIcon, color: '#818CF8', title: 'Rising Sign', desc: 'Your outer persona and first impressions. How the world perceives you and your approach to life.' },
            { icon: StarIcon, color: '#EC4899', title: 'Planetary Positions', desc: 'Where each planet was located at your birth and what it means for different life areas.' },
            { icon: ChartIcon, color: '#63B3ED', title: 'House Placements', desc: 'The 12 houses reveal which life areas are emphasized in your chart and where you\'ll focus energy.' },
            { icon: SparklesIcon, color: '#48BB78', title: 'Aspects & Patterns', desc: 'Planetary relationships that create unique strengths, challenges, and life themes.' },
          ].map((item, i) => (
            <Link key={i} href="/birth-chart/calculate" className="h-full">
              <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer h-full flex flex-col">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500" style={{ color: item.color }}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-light mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 font-light leading-relaxed flex-grow">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="card-minimal p-12 rounded-none">
          <h2 className="text-4xl md:text-5xl font-light mb-12 text-center">
            Chart features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {[
              { icon: ChartIcon, title: 'Visual Chart Wheel', desc: 'Beautiful interactive chart showing all planetary placements' },
              { icon: SunIcon, title: 'Big Three Analysis', desc: 'Detailed breakdown of your Sun, Moon, and Rising signs' },
              { icon: StarIcon, title: 'All Planets', desc: 'Complete positions for Sun through Pluto including nodes' },
              { icon: CompassIcon, title: 'House System Options', desc: 'Support for Placidus, Whole Sign, and other house systems' },
              { icon: SparklesIcon, title: 'Aspect Grid', desc: 'All major and minor aspects between planets clearly displayed' },
              { icon: MoonIcon, title: 'Vedic & Western', desc: 'Both tropical (Western) and sidereal (Vedic) calculations' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <item.icon size={24} className="text-[#818CF8]" />
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
            { num: '01', title: 'Enter Your Birth Details', text: 'Provide your birth date, exact time, and location for accurate calculations' },
            { num: '02', title: 'Generate Your Chart', text: 'We calculate precise planetary positions using astronomical data' },
            { num: '03', title: 'Explore Your Blueprint', text: 'View your complete chart with detailed interpretations for each placement' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-light text-[#818CF8] mb-4">{step.num}</div>
              <h3 className="text-xl font-light mb-3">{step.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-light mb-8">
          Discover yourself
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Your birth chart is waiting to reveal its secrets
        </p>
        <Link href="/birth-chart/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          Generate My Chart
        </Link>
      </section>
    </main>
  );
}

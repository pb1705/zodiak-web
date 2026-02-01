import type { Metadata } from 'next';
import Link from 'next/link';
import { SunIcon, MoonIcon, SparklesIcon, CalendarIcon, ClockIcon, TargetIcon, HeartIcon, BrainIcon } from '@/components/icons';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Daily Cosmic Report — Moon, Transits, Panchang | Zodiak',
  description: 'Daily cosmic report: moon phases, transits, panchang, timing. Vedic and Western astrology. Updated daily. NASA-precise.',
  keywords: ['daily cosmic report', 'daily astrology', 'daily astrology reading', 'personalized daily horoscope', 'moon phase today', 'panchang', 'panchang today', 'muhurta', 'muhurta timing', 'daily transits', 'morning ritual astrology', 'daily spiritual guidance', 'cosmic weather', 'daily astrological forecast', 'today astrology', 'Vedic daily', 'Western daily', 'moon phase', 'tithi', 'nakshatra', 'auspicious time today'],
  openGraph: {
    title: 'Daily Cosmic Report — Moon, Transits, Panchang | Zodiak',
    description: 'Daily cosmic report: moon phases, transits, panchang. Vedic and Western astrology. Updated daily.',
    url: `${baseUrl}/daily-cosmic`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-daily-cosmic.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Daily Cosmic Report',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Cosmic Report — Personalized Astrological Guidance',
    description: 'Get your complete daily cosmic report with moon phases and transit analysis. Updated daily.',
  },
  alternates: {
    canonical: `${baseUrl}/daily-cosmic`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/daily-cosmic', lang, baseUrl)
      ])
    ),
  },
};

export default function DailyCosmicPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <SparklesIcon size={20} className="text-[#818CF8]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">DAILY GUIDANCE</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Your Daily<br />Cosmic Report
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Comprehensive daily guidance combining NASA data with expert astrological interpretation
        </p>
        
        <Link href="/daily-cosmic/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          Get Your Report
        </Link>
      </section>

      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: MoonIcon, color: '#7DD3FC', title: 'Moon Guidance', desc: 'Current lunar phase, nakshatra, and emotional weather for today' },
            { icon: SparklesIcon, color: '#818CF8', title: 'Dual Systems', desc: 'Both Vedic and Western astrological perspectives combined' },
            { icon: CalendarIcon, color: '#48BB78', title: 'Transit Report', desc: 'Personalized planetary movements affecting your chart' },
            { icon: ClockIcon, color: '#F59E0B', title: 'Optimal Times', desc: 'Best time blocks for important activities and decisions' },
            { icon: TargetIcon, color: '#34D399', title: 'Top 3 Priorities', desc: 'Most important focus areas with actionable guidance' },
            { icon: SunIcon, color: '#63B3ED', title: 'Daily Rituals', desc: 'Morning and evening practices aligned with cosmic energy' },
            { icon: BrainIcon, color: '#818CF8', title: 'Panchang Details', desc: 'Vedic panchang with tithi, nakshatra, yoga, and karana' },
            { icon: HeartIcon, color: '#FF6B6B', title: 'Emotional Forecast', desc: 'Expected emotional themes and energy for the day' },
            { icon: SparklesIcon, color: '#F59E0B', title: 'Cosmic Theme', desc: 'Overarching theme and focus for maximum alignment' },
          ].map((item, i) => (
            <div key={i} className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500" style={{ color: item.color }}>
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-light mb-3">{item.title}</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="card-minimal p-12 rounded-none">
          <h2 className="text-4xl md:text-5xl font-light mb-12 text-center">
            What makes it special
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            <div>
              <h3 className="text-white text-lg mb-3 font-normal">Hyper-Personalized</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Based on your exact birth chart, not just your sun sign. Every report is unique to you.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg mb-3 font-normal">Dual Tradition</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Combines ancient Vedic wisdom with modern Western astrology for complete perspective.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg mb-3 font-normal">Actionable Guidance</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Not just predictions – concrete steps, timing suggestions, and practical rituals.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg mb-3 font-normal">Updated Daily</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Fresh cosmic insights every morning based on real-time planetary positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Enter Your Details', text: 'Provide birth date, time, and location once' },
            { num: '02', title: 'Wake Up to Guidance', text: 'Your personalized report is ready each morning' },
            { num: '03', title: 'Navigate Your Day', text: 'Use insights, timings, and rituals for optimal flow' },
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
          Start each day aligned
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Download Zodiak for your personalized daily cosmic report
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/daily-cosmic/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
            Get Your Report Now
          </Link>
          <Link href="#features" className="btn-minimal px-12 py-4 text-sm tracking-widest uppercase inline-block">
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}

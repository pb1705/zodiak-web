import type { Metadata } from 'next';
import Link from 'next/link';
import { HeartIcon, UsersIcon, StarIcon, BrainIcon, TargetIcon, CompassIcon } from '@/components/icons';
import AppDownloadButtons from '@/components/AppDownloadButtons';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Compatibility Analysis — Love & Relationship | Zodiak',
  description: 'Free compatibility analysis: love, friendship, work. Guna Milan and Western synastry. Compare birth charts. NASA data.',
  keywords: ['love compatibility', 'relationship compatibility', 'zodiac compatibility', 'synastry', 'synastry chart', 'Guna Milan', 'birth chart compatibility', 'relationship astrology', 'partner compatibility', 'friendship compatibility', 'work compatibility', 'compatibility calculator', 'astrology compatibility', 'moon sign compatibility', 'sun sign compatibility', 'compatibility report', 'love match astrology', 'couple compatibility', 'Vedic compatibility', 'Western synastry'],
  openGraph: {
    title: 'Compatibility Analysis — Love & Relationship | Zodiak',
    description: 'Free compatibility analysis: love, friendship, work. Guna Milan and synastry. Compare birth charts. NASA data.',
    url: `${baseUrl}/compatibility`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-compatibility.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Compatibility Analysis',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compatibility Analysis — Love, Work, Friendship Compatibility',
    description: 'Comprehensive compatibility analysis powered by NASA data. Compare birth charts for relationships.',
  },
  alternates: {
    canonical: `${baseUrl}/compatibility`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/compatibility', lang, baseUrl)
      ])
    ),
  },
};

export default function CompatibilityPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <HeartIcon size={20} className="text-[#FF6B6B]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">RELATIONSHIP INSIGHTS</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Discover Your<br />Compatibility
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Deep relationship analysis combining Vedic Guna Milan and Western synastry for complete compatibility insights
        </p>
        
        <Link href="/compatibility/calculate" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          Calculate Compatibility
        </Link>
      </section>

      <section id="types" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          Compatibility types
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: HeartIcon, color: '#FF6B6B', title: 'Love & Romance', desc: 'Deep analysis of romantic compatibility, emotional connection, and long-term potential', type: 'love' },
            { icon: UsersIcon, color: '#63B3ED', title: 'Friendship', desc: 'Understanding friendship dynamics, shared interests, and social compatibility', type: 'friendship' },
            { icon: BrainIcon, color: '#48BB78', title: 'Work & Business', desc: 'Professional synergy, collaboration potential, and team dynamics analysis', type: 'work' },
            { icon: TargetIcon, color: '#F59E0B', title: 'Sexual Chemistry', desc: 'Physical attraction, passion compatibility, and intimate connection insights', type: 'sexual' },
            { icon: UsersIcon, color: '#818CF8', title: 'Family', desc: 'Parent-child, sibling, and extended family relationship compatibility', type: 'family' },
            { icon: CompassIcon, color: '#34D399', title: 'Guna Milan', desc: 'Traditional Vedic matching system with 36-point scoring for marriage', type: 'guna_milan' },
          ].map((item, i) => (
            <Link key={i} href="/compatibility/calculate">
              <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500" style={{ color: item.color }}>
                  <item.icon size={32} />
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
              { icon: StarIcon, title: 'Overall Score', desc: 'Comprehensive 0-100 rating based on planetary positions and aspects' },
              { icon: HeartIcon, title: 'Strengths Analysis', desc: 'Areas where you naturally complement each other and share harmony' },
              { icon: TargetIcon, title: 'Growth Challenges', desc: 'Areas requiring attention, compromise, and conscious effort' },
              { icon: CompassIcon, title: 'Guna Milan Score', desc: 'Traditional Vedic 36-point compatibility scoring for marriage' },
              { icon: BrainIcon, title: 'Expert Guidance', desc: 'Specific advice for navigating challenges and deepening connection' },
              { icon: UsersIcon, title: 'Dual Perspective', desc: 'Both Vedic and Western astrological compatibility analysis' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <item.icon size={24} className="text-[#FF6B6B]" />
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
            { num: '01', title: 'Enter Both Birth Details', text: 'Provide birth date, time, and location for both individuals' },
            { num: '02', title: 'Select Compatibility Type', text: 'Choose love, friendship, work, family, or sexual compatibility' },
            { num: '03', title: 'Get Detailed Analysis', text: 'Receive comprehensive report with scores, strengths, and guidance' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-light text-[#FF6B6B] mb-4">{step.num}</div>
              <h3 className="text-xl font-light mb-3">{step.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-light mb-8">
          Understand your connections
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Download Zodiak to analyze compatibility with anyone
        </p>
        <AppDownloadButtons />
      </section>
    </main>
  );
}

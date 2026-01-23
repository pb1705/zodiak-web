import type { Metadata } from 'next';
import Link from 'next/link';
import { UsersIcon, StarIcon, MessageIcon, ClockIcon, CheckCircleIcon, HeartIcon } from '@/components/icons';
import { fetchReaders, formatReaderForDisplay } from '@/lib/api';
import AppDownloadButtons from '@/components/AppDownloadButtons';
import ComingSoonButton from '@/components/ComingSoonButton';

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from '@/lib/languages';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Expert Astrologers — Live Consultations 24/7 | Zodiak',
  description: 'Connect with certified professional astrologers for personalized readings. Live consultations available 24/7. Specializing in love, career, spiritual guidance, and life transitions. Average rating 4.8+ stars.',
  keywords: ['astrologer consultation', 'live astrology reading', 'professional astrologer', 'psychic reading online', 'tarot card reading', 'spiritual counselor', 'relationship advisor', 'career astrologer', '24/7 astrology', 'certified astrologer', 'online astrologer', 'astrology consultation'],
  openGraph: {
    title: 'Expert Astrologers — Live Consultations 24/7 | Zodiak',
    description: 'Connect with certified professional astrologers for personalized readings. Live consultations available 24/7.',
    url: `${baseUrl}/readers`,
    type: 'website',
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    images: [{
      url: `${baseUrl}/og-readers.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Expert Astrologers',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert Astrologers — Live Consultations 24/7',
    description: 'Connect with certified professional astrologers for personalized readings. Available 24/7.',
  },
  alternates: {
    canonical: `${baseUrl}/readers`,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/readers', lang, baseUrl)
      ])
    ),
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ReadersPage() {
  const readersData = await fetchReaders();
  const readers = readersData.map(formatReaderForDisplay);
  const availableCount = readers.filter(r => r.available).length;

  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Hero */}
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <UsersIcon size={20} className="text-[#48BB78]" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">EXPERT GUIDANCE</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none">
          Talk to Expert<br />Astrologers
        </h1>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Certified professional astrologers available 24/7 for personalized readings and spiritual guidance
        </p>
        
        <Link href="#readers" className="btn-trust px-12 py-4 text-sm tracking-widest uppercase inline-block">
          Browse Readers
        </Link>
      </section>

      {/* Why Choose Our Readers */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          Why our readers are exceptional
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: CheckCircleIcon, color: '#48BB78', title: 'Certified Professionals', desc: 'All readers are verified and certified with years of professional experience' },
            { icon: StarIcon, color: '#F59E0B', title: 'High Ratings', desc: 'Average rating of 4.8+ stars based on thousands of authentic client reviews' },
            { icon: ClockIcon, color: '#63B3ED', title: '24/7 Availability', desc: 'Expert guidance available around the clock when you need it most' },
            { icon: HeartIcon, color: '#FF6B6B', title: 'Compassionate Care', desc: 'Empathetic approach combining professional insight with genuine support' },
            { icon: MessageIcon, color: '#818CF8', title: 'Multiple Specialties', desc: 'Tarot, astrology, numerology, mediumship, and spiritual counseling' },
            { icon: CheckCircleIcon, color: '#34D399', title: 'Satisfaction Guaranteed', desc: 'If you\'re not satisfied, get credits for another reading' },
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

      {/* Featured Readers - Real Data */}
      <section id="readers" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-light">Featured readers</h2>
          {availableCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#48BB78]/10 border border-[#48BB78]/20">
              <div className="w-2 h-2 rounded-full bg-[#48BB78] animate-pulse"></div>
              <span className="text-sm font-medium text-[#48BB78]">
                {availableCount} Online Now
              </span>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {readers.slice(0, 12).map((reader) => (
            <Link key={reader.id} href={`/readers/${reader.id}`}>
              <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.04] transition-all duration-700 cursor-pointer h-full flex flex-col">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <img 
                    src={reader.image} 
                    alt={reader.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/10"
                  />
                  {reader.available && (
                    <div className="absolute bottom-0 right-1/2 translate-x-8 w-6 h-6 bg-[#48BB78] rounded-full border-4 border-[#0F172A]"></div>
                  )}
                </div>

                {/* Name & Rating */}
                <h3 className="text-xl font-light text-center mb-2">{reader.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <StarIcon size={16} className="text-[#F59E0B]" filled />
                  <span className="text-sm font-medium text-white/70">{reader.rating.toFixed(2)}</span>
                  <span className="text-sm text-white/40">({reader.readings} readings)</span>
                </div>

                {/* Experience */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-white/50">
                  <ClockIcon size={14} className="text-white/40" />
                  <span>{reader.experience}+ years experience</span>
                </div>

                {/* Specialties - Fixed height area */}
                <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[60px]">
                  {reader.specialties.slice(0, 3).map((specialty, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/60"
                    >
                      {specialty}
                    </span>
                  ))}
                  {reader.specialties.length > 3 && (
                    <span className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/40">
                      +{reader.specialties.length - 3}
                    </span>
                  )}
                </div>

                {/* Rate & CTA - Push to bottom */}
                <div className="text-center mt-auto">
                  <div className="text-2xl font-light mb-4 text-[#48BB78]">{reader.rate}/min</div>
                  <ComingSoonButton 
                    className="btn-trust w-full py-3 text-sm tracking-widest uppercase"
                    text={reader.available ? 'Start Reading' : 'Schedule'}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {readers.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-minimal p-8 rounded-none animate-pulse">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full mx-auto bg-white/5 border-2 border-white/10"></div>
                </div>
                <div className="text-center space-y-3 mb-4">
                  <div className="h-6 w-32 bg-white/5 rounded mx-auto"></div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-20 bg-white/5 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="h-4 w-32 bg-white/5 rounded"></div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-20 bg-white/5 rounded-full"></div>
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <div className="h-8 w-24 bg-white/5 rounded mx-auto"></div>
                  <div className="h-12 w-full bg-white/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Specializations */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          Specializations
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Love & Relationships',
            'Career & Finance',
            'Spiritual Guidance',
            'Psychic Reading',
            'Tarot Reading',
            'Astrology',
            'Numerology',
            'Mediumship',
            'Energy Healing',
            'Angel Cards',
            'Past Life Reading',
            'Dream Interpretation',
          ].map((spec, i) => (
            <div key={i} className="card-minimal p-6 rounded-none hover:bg-white/[0.04] transition-all duration-700 text-center">
              <span className="text-white/70 font-light">{spec}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: '01', title: 'Browse Readers', text: 'Explore profiles, ratings, and specializations' },
            { num: '02', title: 'Choose Your Expert', text: 'Select based on availability and expertise' },
            { num: '03', title: 'Start Your Session', text: 'Connect instantly via chat or schedule a call' },
            { num: '04', title: 'Get Guidance', text: 'Receive personalized insights and recommendations' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-light text-[#48BB78] mb-4">{step.num}</div>
              <h3 className="text-lg font-light mb-2">{step.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="card-minimal p-12 rounded-none text-center">
          <h2 className="text-4xl font-light mb-6">Simple, transparent pricing</h2>
          <p className="text-white/50 mb-12 max-w-2xl mx-auto">
            Pay only for the time you use. Rates vary by reader experience from $3.75-$7.99 per minute. 
            First 3 minutes free for new clients.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-light text-white mb-2">$3.75</div>
              <div className="text-sm text-white/40">Starting rate</div>
            </div>
            <div>
              <div className="text-5xl font-light text-[#48BB78] mb-2">FREE</div>
              <div className="text-sm text-white/40">First 3 minutes</div>
            </div>
            <div>
              <div className="text-5xl font-light text-white mb-2">24/7</div>
              <div className="text-sm text-white/40">Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-light mb-8">
          Get guidance today
        </h2>
        <p className="text-lg text-white/40 mb-12 font-light">
          Download Zodiak to connect with expert astrologers
        </p>
        <AppDownloadButtons />
      </section>
    </main>
  );
}

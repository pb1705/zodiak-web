'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZodiakLogo } from '@/components/ZodiakLogo';
import CelestialHero from '@/components/CelestialHero';
import ComingSoonModal from '@/components/ComingSoonModal';
import { SunIcon, MoonIcon, HeartIcon, CalendarIcon, UsersIcon, CompassIcon, ChartIcon, SparklesIcon, GlobeIcon } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : (process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life');

const screenshots = [
  { url: 'https://hel1.your-objectstorage.com/pics/Horocope_Page.png', title: 'Daily guidance', desc: 'Personalized horoscopes' },
  { url: 'https://hel1.your-objectstorage.com/pics/Daily_Cosmic_Report.png', title: 'Cosmic insights', desc: 'Comprehensive reports' },
  { url: 'https://hel1.your-objectstorage.com/pics/Love_Compatibilty.png', title: 'Compatibility', desc: 'Relationship analysis' },
  { url: 'https://hel1.your-objectstorage.com/pics/Transit_Yearly_overview.png', title: 'Transit tracking', desc: 'Yearly planetary cycles' },
  { url: 'https://hel1.your-objectstorage.com/pics/Astrology_Readers.png', title: 'Expert readers', desc: 'Professional astrologers' },
  { url: 'https://hel1.your-objectstorage.com/pics/ChatWithAstrologer.jpeg', title: 'Live guidance', desc: '1-on-1 consultations' },
];

const FloatingOrb = ({ delay = 0, duration = 25, top = '20%', left = '10%', color = "#63B3ED" }) => (
  <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-3xl"
    style={{ top, left, background: `radial-gradient(circle, ${color}60 0%, transparent 70%)` }}
    animate={{ x: [0, 50, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }} />
);

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Zodiak — Hyper-Personalized Astrology",
    "description": "Professional astrology app powered by NASA data. Get personalized birth charts, daily cosmic reports, compatibility analysis, transit tracking, and 24/7 expert consultations.",
    "url": baseUrl,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Zodiak",
      "url": baseUrl
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "Zodiak",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "5000"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Birth Chart Calculator",
          "url": `${baseUrl}/birth-chart`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Daily Cosmic Reports",
          "url": `${baseUrl}/daily-cosmic`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Compatibility Analysis",
          "url": `${baseUrl}/compatibility`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Transit Tracking",
          "url": `${baseUrl}/transits`
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Expert Consultations",
          "url": `${baseUrl}/readers`
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Daily Horoscopes",
          "url": `${baseUrl}/horoscope`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-[#0F172A] relative overflow-hidden">
        {/* New Celestial Hero */}
        <CelestialHero />
        
        {/* Floating orbs for rest of page */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <FloatingOrb delay={0} duration={30} top="120vh" left="5%" color="#63B3ED" />
          <FloatingOrb delay={8} duration={35} top="180vh" left="70%" color="#48BB78" />
          <FloatingOrb delay={15} duration={28} top="250vh" left="80%" color="#818CF8" />
        </div>
        
        <div className="relative h-px"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" /></div>
        
        {/* Features - Minimal classy design with generous whitespace */}
        <section id="features" className="relative px-6 py-24 md:py-32 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }} className="text-center mb-20 md:mb-24">
              <p className="mono text-white/45 mb-6 text-[9px] tracking-[0.3em] uppercase">THE EXPERIENCE</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">Everything<br />you need</h2>
              <p className="text-base md:text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
                Professional astrology at your fingertips: birth chart calculator, horoscope today, zodiac signs, compatibility, planetary transits, moon sign, rising sign, and expert readings.
              </p>
            </motion.div>
            
            {/* Show first 3, readers, and chat on mobile; all 6 on desktop - minimal classy design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {screenshots.map((screenshot, i) => {
                // Hide index 2 (Compatibility) and index 3 (Transit tracking) on mobile, show all others including readers (4) and chat (5)
                const shouldHide = i === 2 || i === 3;
                return (
                <motion.article 
                  key={screenshot.title} 
                  initial={{ opacity: 0, y: 60 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }} 
                  transition={{ delay: i * 0.1, duration: 0.8 }} 
                  className={`group ${shouldHide ? 'hidden md:block' : ''}`}
                >
                  <div className="relative mb-8 mx-auto max-w-[300px]">
                    <motion.div 
                      whileHover={{ y: -12 }} 
                      className="relative rounded-[40px] overflow-hidden bg-[#0a0118] p-2.5 transition-all duration-500"
                      style={{ border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)' }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#0F172A] rounded-b-3xl z-10" />
                      <div className="relative rounded-[32px] overflow-hidden aspect-[9/19.5] bg-[#0F172A]">
                        <Image
                          src={screenshot.url}
                          alt={`${screenshot.title} - ${screenshot.desc}`}
                          width={300}
                          height={650}
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-light mb-2">{screenshot.title}</h3>
                    <p className="text-sm text-white/55 font-light mono tracking-wide uppercase text-[11px]">{screenshot.desc}</p>
                  </div>
                </motion.article>
                );
              })}
            </div>
          </div>
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-20 md:my-24" />
        
        {/* Services - Minimal spacing */}
        <section className="relative px-6 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16 md:mb-20">
              <p className="mono text-white/45 text-[9px] tracking-[0.3em] uppercase">SERVICES</p>
            </motion.div>
            
            <nav className="space-y-0" aria-label="Main services">
              {[
                { num: '01', title: 'Birth chart analysis', detail: 'NASA-powered precision mapping', icon: CompassIcon, href: '/birth-chart' },
                { num: '02', title: 'Daily cosmic reports', detail: 'Personalized daily guidance', icon: SunIcon, href: '/daily-cosmic' },
                { num: '03', title: 'Compatibility reports', detail: 'Deep relationship insights', icon: HeartIcon, href: '/compatibility' },
                { num: '04', title: 'Transit tracking', detail: 'Real-time planetary movements', icon: CalendarIcon, href: '/transits' },
                { num: '05', title: 'Expert consultations', detail: '24/7 professional astrologers', icon: UsersIcon, href: '/readers' },
                { num: '06', title: 'Horoscopes', detail: 'Daily, weekly, monthly, yearly', icon: MoonIcon, href: '/horoscope' },
              ].map((item, i) => (
                <Link key={item.num} href={item.href}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      delay: i * 0.1, 
                      duration: 0.8,
                      ease: [0.25, 0.1, 0.25, 1]
                    }} 
                    className="group flex items-center gap-6 md:gap-8 py-8 md:py-10 border-b border-white/[0.03] last:border-none hover:bg-white/[0.01] transition-all duration-700 px-4 md:px-8 cursor-pointer"
                  >
                    <motion.span 
                      className="text-4xl opacity-60 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon size={40} className="text-white/60" />
                    </motion.span>
                    <span className="mono text-[10px] text-white/20 tracking-widest w-12" aria-label={`Service ${item.num}`}>{item.num}</span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-light flex-1">{item.title}</h3>
                    <p className="text-sm text-white/50 font-light text-right mono tracking-wide hidden lg:block">{item.detail}</p>
                    <motion.svg 
                      className="w-6 h-6 text-white/10 group-hover:text-trust transition-colors duration-500" 
                      initial={{ x: 0 }}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.3 }}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>
        </section>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-20 md:my-24" />
        
        {/* Technology - Minimal spacing */}
        <section className="relative px-6 py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">Built on precision</h2>
              <p className="text-base md:text-lg text-white/60 font-light max-w-2xl mx-auto">
                NASA JPL data and certified professional astrologers
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
              {[
                { icon: GlobeIcon, title: 'NASA data', text: 'Real-time astronomical calculations' },
                { icon: SparklesIcon, title: 'Expert interpretation', text: 'Certified professional astrologers' },
                { icon: CompassIcon, title: 'Your privacy', text: 'End-to-end encryption. GDPR compliant.' },
              ].map((item, i) => (
                <motion.article 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8 }} 
                  className="card-minimal p-12 rounded-none"
                >
                  <div className="text-6xl mb-6" aria-hidden="true">
                    <item.icon size={48} className="mx-auto text-trust" />
                  </div>
                  <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">{item.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
        
        {/* Final CTA — account creation */}
        <section className="relative px-6 py-24 md:py-32 border-t border-white/[0.05]">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <p className="mono text-[9px] text-white/45 tracking-[0.3em] uppercase mb-4">Begin now</p>
              <h2 className="text-4xl md:text-5xl font-light mb-4 leading-tight tracking-tight">Your birth chart awaits.</h2>
              <p className="text-white/60 font-light mb-10 leading-relaxed">
                Create a free account in seconds — no passwords, just your mobile number. Access birth charts, daily transits, compatibility, and expert readers instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login?intent=signup" className="btn-trust px-12 py-4 text-xs md:text-sm tracking-widest uppercase inline-block">
                  Create Account
                </Link>
                <Link href="/login" className="btn-minimal px-12 py-4 text-xs md:text-sm tracking-widest uppercase inline-block">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/[0.03] px-6 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="mono text-white/20 text-[10px] tracking-[0.3em]">© 2026 ZODIAK</p>
            <nav aria-label="Footer navigation">
              <div className="flex gap-12 mono text-[10px] text-white/20 tracking-[0.3em]">
                <Link href="/privacy" className="hover:text-trust transition-colors duration-500">PRIVACY</Link>
                <Link href="/terms" className="hover:text-trust transition-colors duration-500">TERMS</Link>
                <Link href="/support" className="hover:text-trust transition-colors duration-500">SUPPORT</Link>
              </div>
            </nav>
          </div>
        </footer>

        <ComingSoonModal 
          isOpen={showComingSoon} 
          onClose={() => setShowComingSoon(false)}
          title="Coming Soon"
          message="The Zodiak app will be available on iOS and Android soon. Stay tuned for updates!"
        />
      </main>
    </>
  );
}

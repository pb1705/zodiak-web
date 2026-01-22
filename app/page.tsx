'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZodiakLogo } from '@/components/ZodiakLogo';
import CelestialHero from '@/components/CelestialHero';
import ComingSoonModal from '@/components/ComingSoonModal';
import { SunIcon, MoonIcon, HeartIcon, CalendarIcon, UsersIcon, CompassIcon, ChartIcon, SparklesIcon, GlobeIcon } from '@/components/icons';
import Link from 'next/link';

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

  return (
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
            <p className="mono text-white/25 mb-6 text-[9px] tracking-[0.3em] uppercase">THE EXPERIENCE</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-tight">Everything<br />you need</h2>
            <p className="text-base md:text-lg text-white/40 font-light max-w-2xl mx-auto leading-relaxed">
              Birth charts. Daily horoscopes. Compatibility analysis. Transit tracking. Expert guidance.
            </p>
          </motion.div>
          
          {/* Show first 3, readers, and chat on mobile; all 6 on desktop - minimal classy design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {screenshots.map((screenshot, i) => {
              // Hide index 2 (Compatibility) and index 3 (Transit tracking) on mobile, show all others including readers (4) and chat (5)
              const shouldHide = i === 2 || i === 3;
              return (
              <motion.div 
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
                      <img src={screenshot.url} alt={screenshot.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </motion.div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-light mb-2">{screenshot.title}</h3>
                  <p className="text-sm text-white/40 font-light mono tracking-wide uppercase text-[11px]">{screenshot.desc}</p>
                </div>
              </motion.div>
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
            <p className="mono text-white/25 text-[9px] tracking-[0.3em] uppercase">SERVICES</p>
          </motion.div>
          
          <div className="space-y-0">
            {[
              { num: '01', title: 'Birth chart analysis', detail: 'NASA-powered precision mapping', icon: CompassIcon, href: '/birth-chart' },
              { num: '02', title: 'Daily cosmic reports', detail: 'Personalized daily guidance', icon: SunIcon, href: '/daily-cosmic' },
              { num: '03', title: 'Compatibility reports', detail: 'Deep relationship insights', icon: HeartIcon, href: '/compatibility' },
              { num: '04', title: 'Transit tracking', detail: 'Real-time planetary movements', icon: CalendarIcon, href: '/transits' },
              { num: '05', title: 'Expert consultations', detail: '24/7 professional astrologers', icon: UsersIcon, href: '/readers' },
              { num: '06', title: 'Horoscopes', detail: 'Daily, weekly, monthly, yearly', icon: MoonIcon, href: '/horoscope' },
            ].map((item, i) => (
              <Link key={item.num} href={item.href}>
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }} className="group flex items-center gap-6 md:gap-8 py-8 md:py-10 border-b border-white/[0.03] last:border-none hover:bg-white/[0.01] transition-all duration-700 px-4 md:px-8 cursor-pointer">
                  <span className="text-4xl opacity-60 group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={40} className="text-white/60" />
                  </span>
                  <span className="mono text-[10px] text-white/20 tracking-widest w-12">{item.num}</span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-light flex-1">{item.title}</h3>
                  <p className="text-sm text-white/30 font-light text-right mono tracking-wide hidden lg:block">{item.detail}</p>
                  <motion.svg className="w-6 h-6 text-white/10 group-hover:text-trust transition-colors duration-500" initial={{ x: 0 }}
                    whileHover={{ x: 6 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-20 md:my-24" />
      
      {/* Technology - Minimal spacing */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">Built on precision</h2>
            <p className="text-base md:text-lg text-white/40 font-light max-w-2xl mx-auto">
              NASA JPL data and certified professional astrologers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
            {[
              { icon: GlobeIcon, title: 'NASA data', text: 'Real-time astronomical calculations' },
              { icon: SparklesIcon, title: 'Expert interpretation', text: 'Certified professional astrologers' },
              { icon: CompassIcon, title: 'Your privacy', text: 'End-to-end encryption. GDPR compliant.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }} className="card-minimal p-12 rounded-none">
                <div className="text-6xl mb-6"><item.icon size={48} className="mx-auto text-trust" /></div>
                <h3 className="text-2xl font-light mb-4">{item.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA - Minimal spacing with refined logo positioning */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            {/* Logo with generous whitespace - minimal aesthetic */}
            <div className="mb-20 md:mb-24 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative"
              >
                <ZodiakLogo size={180} />
              </motion.div>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 md:mb-12 leading-none tracking-tight">Begin your<br />cosmic journey</h2>
            <p className="text-lg md:text-xl text-white/40 font-light mb-12 md:mb-16">Available on iOS and Android</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 md:mb-24">
              <button 
                onClick={() => setShowComingSoon(true)}
                className="btn-trust px-12 md:px-16 py-4 md:py-5 text-xs md:text-sm tracking-widest uppercase"
              >
                App Store
              </button>
              <button 
                onClick={() => setShowComingSoon(true)}
                className="btn-minimal px-12 md:px-16 py-4 md:py-5 text-xs md:text-sm tracking-widest uppercase"
              >
                Google Play
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-16 md:pt-20 border-t border-white/[0.05]">
              <div><p className="mono text-[9px] text-white/25 mb-2 tracking-[0.3em] uppercase">FREE TO START</p><p className="text-xs md:text-sm text-white/40 font-light">First reading included</p></div>
              <div><p className="mono text-[9px] text-white/25 mb-2 tracking-[0.3em] uppercase">NO COMMITMENT</p><p className="text-xs md:text-sm text-white/40 font-light">Cancel anytime</p></div>
              <div><p className="mono text-[9px] text-white/25 mb-2 tracking-[0.3em] uppercase">24/7 AVAILABLE</p><p className="text-xs md:text-sm text-white/40 font-light">Always here for you</p></div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative border-t border-white/[0.03] px-6 py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="mono text-white/20 text-[10px] tracking-[0.3em]">© 2026 ZODIAK</p>
          <div className="flex gap-12 mono text-[10px] text-white/20 tracking-[0.3em]">
            <a href="#" className="hover:text-trust transition-colors duration-500">PRIVACY</a>
            <a href="#" className="hover:text-trust transition-colors duration-500">TERMS</a>
            <a href="#" className="hover:text-trust transition-colors duration-500">SUPPORT</a>
          </div>
        </div>
      </footer>

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)}
        title="Coming Soon"
        message="The Zodiak app will be available on iOS and Android soon. Stay tuned for updates!"
      />
    </main>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CelestialHero() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F172A]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full min-h-screen">
        <Image
          src="https://hel1.your-objectstorage.com/pics/20260120_1515_Celestial%20Hand%20Reaching_simple_compose_01kfdcpwy1fqtvqhjrkkn8yx6z.png"
          alt="Celestial hand reaching down to human hand"
          fill
          className="object-cover md:object-cover"
          priority
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          style={{ objectPosition: 'center 60%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/60 via-transparent to-[#0F172A]/60 md:from-transparent md:to-transparent" />
      </div>

      {/* Content — brand/tagline high, flex-1 breathing room, actions pinned to bottom */}
      <div className="absolute inset-0 z-10 w-full px-6">
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col">

          {/* Top — brand + tagline */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-24 sm:pt-28 md:pt-32 text-center"
          >
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-2 leading-none tracking-tight">
                Zodiak
              </h1>
              <p className="text-[9px] md:text-[10px] text-white/50 tracking-[0.3em] uppercase mb-0 mono" aria-hidden="true">
                Hyper-Personalized Astrology
              </p>
            </div>
            <p className="sr-only">Zodiak — Astrology, horoscope today, birth chart calculator, zodiac signs, natal chart, moon sign, rising sign, compatibility, planetary transits, Saturn return, Mercury retrograde. Free astrology readings. Vedic and Western. Expert astrologers 24/7.</p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-[1.1] tracking-tight">
              The cosmos reaches<br />
              <span className="text-white/70">for those who seek.</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-white/60 font-light max-w-lg mx-auto leading-relaxed">
              NASA-precision astrology meets ancient wisdom. Your birth chart decoded with clarity.
            </p>
          </motion.div>

          {/* Middle — breathing room */}
          <div className="flex-1" />

          {/* Bottom — buttons + trust strip (scroll indicator lives outside this div, absolutely positioned) */}
          <div className="pb-20 md:pb-24 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[800px] mx-auto mb-5">
              <Link href="/login?intent=signup" className="w-full min-w-0 flex justify-center sm:order-1 order-first">
                <button type="button" className="w-full min-w-0 btn-minimal py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase whitespace-nowrap">
                  Create Account
                </button>
              </Link>
              <Link href="/birth-chart/calculate" className="w-full min-w-0 flex justify-center sm:order-2">
                <button type="button" className="w-full min-w-0 btn-trust py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase font-medium whitespace-nowrap">
                  Discover Your Chart
                </button>
              </Link>
              <Link href="#features" className="w-full min-w-0 flex justify-center sm:order-3">
                <button type="button" className="w-full min-w-0 btn-minimal py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase whitespace-nowrap">
                  Explore Features
                </button>
              </Link>
            </div>

            <motion.div
              initial={false}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mono text-[9px] md:text-[10px] text-white/45 tracking-[0.2em] uppercase"
            >
              <div className="w-[120px] md:w-[170px] text-center flex flex-col items-center">
                <div className="text-trust text-xs md:text-sm mb-1 whitespace-nowrap leading-none">NASA</div>
                <div>Data Precision</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="w-[120px] md:w-[170px] text-center flex flex-col items-center">
                <div className="text-growth text-xs md:text-sm mb-1 whitespace-nowrap leading-none">24/7</div>
                <div>Expert Access</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="w-[120px] md:w-[170px] text-center flex flex-col items-center">
                <div className="text-premium text-xs md:text-sm mb-1 whitespace-nowrap leading-none">Vedic + Western</div>
                <div>Dual Systems</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — absolutely pinned to bottom centre, clear of trust strip */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-white/35 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-[#63B3ED]/60 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}

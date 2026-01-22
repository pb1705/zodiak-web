'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CelestialHero() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Background Image - Optimized for mobile and desktop */}
      <div className="absolute inset-0 w-full h-full min-h-screen">
        <Image
          src="https://hel1.your-objectstorage.com/pics/20260120_1515_Celestial%20Hand%20Reaching_simple_compose_01kfdcpwy1fqtvqhjrkkn8yx6z.png"
          alt="Celestial hand reaching down to human hand"
          fill
          className="object-cover md:object-cover"
          priority
          quality={100}
          sizes="100vw"
          unoptimized
          style={{
            objectPosition: 'center 60%',
          }}
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 via-transparent to-transparent" />
        {/* Side gradients for mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/60 via-transparent to-[#0F172A]/60 md:from-transparent md:to-transparent" />
      </div>

      {/* Content positioned at bottom */}
      <div className="relative z-10 w-full px-6">
        <div className="max-w-4xl mx-auto text-center mt-[45vh] md:mt-[50vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Brand Name */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-2 leading-none tracking-tight">
                Zodiak
              </h1>
            </div>
            
            {/* Optional small label - minimal styling */}
            <p className="text-[9px] md:text-[10px] text-white/30 tracking-[0.3em] uppercase mb-6 mono">
              Hyper-Personalized Astrology
            </p>
            
            {/* Main tagline - cleaner typography */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-[1.1] tracking-tight">
              The cosmos reaches<br />
              <span className="text-white/50">for those who seek.</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-white/40 font-light max-w-lg mx-auto mb-10 md:mb-12 leading-relaxed">
              NASA-precision data meets ancient wisdom. Your birth chart decoded with clarity.
            </p>

            {/* Equal-width buttons - fixed sizing */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/birth-chart/calculate" className="w-full sm:w-auto">
                <button className="w-full sm:w-[240px] btn-trust py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase font-medium whitespace-nowrap">
                  Discover Your Chart
                </button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <button className="w-full sm:w-[240px] btn-minimal py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase whitespace-nowrap">
                  Explore Features
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators - with extra bottom padding to avoid scroll indicator overlap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 md:mt-16 pb-20 md:pb-24 flex flex-wrap items-center justify-center gap-6 md:gap-12 mono text-[9px] md:text-[10px] text-white/25 tracking-[0.2em] uppercase"
          >
            <div className="text-center">
              <div className="text-trust text-xs md:text-sm mb-1">NASA</div>
              <div>Data Precision</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-growth text-xs md:text-sm mb-1">24/7</div>
              <div>Expert Access</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-premium text-xs md:text-sm mb-1">Vedic + Western</div>
              <div>Dual Systems</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - positioned below trust indicators with proper spacing */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-[#63B3ED]/60 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}

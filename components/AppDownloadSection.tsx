'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ComingSoonModal from './ComingSoonModal';

export function AppDownloadSection() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative glass-strong rounded-[3rem] p-16 md:p-20 overflow-hidden"
      >
        {/* Animated Gradient Orbs - App Colors */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[500px] h-[500px] rounded-full glow-trust"
          style={{ 
            top: '-20%', 
            left: '-10%',
            background: 'radial-gradient(circle, rgba(99, 179, 237, 0.3) 0%, transparent 70%)',
          }}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -60, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[500px] h-[500px] rounded-full glow-growth"
          style={{ 
            bottom: '-20%', 
            right: '-10%',
            background: 'radial-gradient(circle, rgba(72, 187, 120, 0.3) 0%, transparent 70%)',
          }}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[400px] h-[400px] rounded-full glow-premium"
          style={{ 
            top: '30%', 
            right: '20%',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-9xl mb-12"
          >
            🌟
          </motion.div>
          
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-trust-growth">Begin Your Journey</span>
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-6 max-w-3xl mx-auto leading-relaxed">
            Join 20,000+ users exploring their cosmic destiny
          </p>
          
          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-7 h-7 text-energy-amber fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-2xl font-semibold">4.8</span>
            <span className="text-lg text-slate-400">• 15,000+ reviews</span>
          </div>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            <motion.button
              onClick={() => setShowComingSoon(true)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary group inline-flex"
            >
              <span className="flex items-center gap-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-sm opacity-90 font-normal">Download on</div>
                  <div className="text-xl font-bold -mt-1">App Store</div>
                </div>
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowComingSoon(true)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glass inline-flex"
            >
              <span className="flex items-center gap-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-sm opacity-90 font-normal">Get it on</div>
                  <div className="text-xl font-bold -mt-1">Google Play</div>
                </div>
              </span>
            </motion.button>
          </div>
          
          <ComingSoonModal 
            isOpen={showComingSoon} 
            onClose={() => setShowComingSoon(false)}
            title="Coming Soon"
            message="The Zodiak app will be available on iOS and Android soon. Stay tuned for updates!"
          />
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-10 text-base"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-trust flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-300 font-medium">First Reading Free</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-growth flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-300 font-medium">24/7 Expert Support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-premium flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-300 font-medium">Cancel Anytime</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

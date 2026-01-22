'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const zodiacSigns = [
  { name: 'Aries', icon: '♈', dates: 'Mar 21 - Apr 19', color: 'from-energy-amber to-energy-amber-light', element: '🔥' },
  { name: 'Taurus', icon: '♉', dates: 'Apr 20 - May 20', color: 'from-growth-green to-growth-green-light', element: '🌍' },
  { name: 'Gemini', icon: '♊', dates: 'May 21 - Jun 20', color: 'from-energy-amber to-energy-amber-light', element: '💨' },
  { name: 'Cancer', icon: '♋', dates: 'Jun 21 - Jul 22', color: 'from-trust-blue to-trust-blue-light', element: '💧' },
  { name: 'Leo', icon: '♌', dates: 'Jul 23 - Aug 22', color: 'from-energy-amber to-energy-amber-light', element: '🔥' },
  { name: 'Virgo', icon: '♍', dates: 'Aug 23 - Sep 22', color: 'from-growth-green to-growth-green-light', element: '🌍' },
  { name: 'Libra', icon: '♎', dates: 'Sep 23 - Oct 22', color: 'from-trust-blue to-premium-indigo', element: '💨' },
  { name: 'Scorpio', icon: '♏', dates: 'Oct 23 - Nov 21', color: 'from-premium-indigo to-premium-indigo-dark', element: '💧' },
  { name: 'Sagittarius', icon: '♐', dates: 'Nov 22 - Dec 21', color: 'from-energy-amber to-energy-amber-light', element: '🔥' },
  { name: 'Capricorn', icon: '♑', dates: 'Dec 22 - Jan 19', color: 'from-growth-green to-trust-blue', element: '🌍' },
  { name: 'Aquarius', icon: '♒', dates: 'Jan 20 - Feb 18', color: 'from-trust-blue to-premium-indigo', element: '💨' },
  { name: 'Pisces', icon: '♓', dates: 'Feb 19 - Mar 20', color: 'from-premium-indigo to-trust-blue-light', element: '💧' },
];

export function HoroscopePreview() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {zodiacSigns.map((sign, index) => (
          <motion.div
            key={sign.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            viewport={{ once: true }}
          >
            <Link href={`/horoscope/${sign.name.toLowerCase()}`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="group glass glass-hover rounded-3xl p-8 text-center relative overflow-hidden h-full"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sign.color} opacity-0 group-hover:opacity-20 transition-all duration-700`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`text-7xl mb-6 relative z-10 bg-gradient-to-br ${sign.color} bg-clip-text text-transparent font-bold`}
                >
                  {sign.icon}
                </motion.div>
                
                {/* Name */}
                <h3 className="text-xl font-bold mb-3 relative z-10">{sign.name}</h3>
                
                {/* Dates */}
                <p className="text-sm text-slate-400 mb-4 relative z-10">{sign.dates}</p>
                
                {/* Element */}
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="text-3xl">{sign.element}</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Link href="/horoscope">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-12 py-5"
          >
            <span>View All Horoscopes</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

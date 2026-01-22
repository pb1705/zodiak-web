'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const topReaders = [
  {
    id: 1,
    name: 'Luna Starlight',
    avatar: '🌙',
    specialties: ['Vedic', 'Tarot', 'Birth Charts'],
    rating: 4.9,
    sessions: 2543,
    price: 2.99,
    available: true,
    gradient: 'from-trust-blue to-premium-indigo'
  },
  {
    id: 2,
    name: 'Cosmic Maya',
    avatar: '✨',
    specialties: ['Love', 'Career', 'Transit'],
    rating: 4.8,
    sessions: 1876,
    price: 2.49,
    available: true,
    gradient: 'from-growth-green to-trust-blue-light'
  },
  {
    id: 3,
    name: 'Astral Phoenix',
    avatar: '🔮',
    specialties: ['Numerology', 'Chakra', 'Healing'],
    rating: 4.9,
    sessions: 3210,
    price: 3.49,
    available: false,
    gradient: 'from-energy-amber to-energy-amber-light'
  },
];

export function ReadersPreview() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Live Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-16"
      >
        <div className="relative flex h-4 w-4">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-growth-green opacity-75"></div>
          <div className="relative inline-flex rounded-full h-4 w-4 bg-growth-green"></div>
        </div>
        <span className="text-xl font-semibold text-growth-green">
          20+ Expert Astrologers Online Now
        </span>
      </motion.div>
      
      {/* Readers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {topReaders.map((reader, index) => (
          <motion.div
            key={reader.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <Link href={`/readers/${reader.id}`}>
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group glass glass-hover rounded-3xl p-10 relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reader.gradient} opacity-0 group-hover:opacity-15 transition-all duration-700`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Avatar with Status */}
                  <div className="relative inline-block mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-28 h-28 rounded-full bg-gradient-to-br ${reader.gradient} flex items-center justify-center text-6xl relative shadow-2xl`}
                    >
                      <div className={`absolute inset-0 rounded-full border-4 border-white/10 group-hover:border-white/20 transition-all duration-700`} />
                      {reader.avatar}
                    </motion.div>
                    {reader.available && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-growth-green rounded-full border-4 border-[#0F172A] animate-pulse-glow" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-3xl font-bold mb-4">{reader.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(reader.rating) ? 'text-energy-amber' : 'text-slate-600'} fill-current`} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{reader.rating}</span>
                    <span className="text-base text-slate-400">({reader.sessions.toLocaleString()})</span>
                  </div>
                  
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {reader.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${reader.gradient} text-white shadow-lg`}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold">${reader.price}</div>
                      <div className="text-base text-slate-400">per minute</div>
                    </div>
                    
                    {reader.available ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${reader.gradient} shadow-xl`}
                      >
                        Start Chat
                      </motion.button>
                    ) : (
                      <div className="px-8 py-4 rounded-xl font-semibold text-slate-400 bg-slate-800/50">
                        Busy
                      </div>
                    )}
                  </div>
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
        className="text-center"
      >
        <Link href="/readers">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-12 py-5 text-lg"
          >
            <span>Browse All Expert Astrologers</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

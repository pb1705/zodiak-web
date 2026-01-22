'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const compatibilityTypes = [
  {
    type: 'Love Match',
    icon: '💕',
    description: 'Discover your romantic compatibility and relationship potential with detailed cosmic insights',
    gradient: 'from-trust-blue via-premium-indigo to-trust-blue-light',
    bgGradient: 'gradient-trust',
    size: 'large'
  },
  {
    type: 'Friendship',
    icon: '🤝',
    description: 'Find your cosmic companions and soul friends',
    gradient: 'from-trust-blue to-trust-blue-light',
    bgGradient: 'gradient-trust',
    size: 'small'
  },
  {
    type: 'Work',
    icon: '💼',
    description: 'Understand professional dynamics and collaborations',
    gradient: 'from-growth-green to-growth-green-light',
    bgGradient: 'gradient-growth',
    size: 'small'
  },
  {
    type: 'Chemistry',
    icon: '✨',
    description: 'Explore deeper cosmic connections between souls',
    gradient: 'from-energy-amber to-energy-amber-light',
    bgGradient: 'gradient-energy',
    size: 'small'
  },
];

export function CompatibilitySection() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {compatibilityTypes.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
            viewport={{ once: true }}
            className={item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
          >
            <Link href="/compatibility">
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className={`group glass glass-hover rounded-3xl relative overflow-hidden ${
                  item.size === 'large' ? 'p-16 h-full min-h-[500px]' : 'p-10 h-full'
                } flex flex-col justify-center`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                
                {/* Animated Gradient Orb */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute ${item.size === 'large' ? 'w-96 h-96' : 'w-64 h-64'} rounded-full bg-gradient-to-br ${item.gradient} blur-3xl opacity-20`}
                  style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`${item.size === 'large' ? 'text-9xl mb-10' : 'text-7xl mb-8'}`}
                  >
                    {item.icon}
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className={`font-bold mb-6 ${
                    item.size === 'large' ? 'text-6xl' : 'text-4xl'
                  } bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.type}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-slate-300 leading-relaxed ${
                    item.size === 'large' ? 'text-2xl mb-10' : 'text-lg mb-8'
                  }`}>
                    {item.description}
                  </p>
                  
                  {/* Arrow */}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 10 }}
                    className={`flex items-center gap-3 font-semibold ${
                      item.size === 'large' ? 'text-xl' : 'text-lg'
                    } bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                  >
                    <span>Check Now</span>
                    <svg className={item.size === 'large' ? 'w-7 h-7' : 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Main CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Link href="/compatibility">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-12 py-5 text-lg"
          >
            <span>Explore All Compatibility Types</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

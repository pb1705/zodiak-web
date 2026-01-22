'use client';

import { motion } from 'framer-motion';

const features = [
  { title: 'Daily Horoscopes', desc: 'Personalized for your sign', icon: '🌙' },
  { title: 'Birth Charts', desc: 'Complete natal analysis', icon: '📊' },
  { title: 'Compatibility', desc: 'Relationship insights', icon: '🔗' },
  { title: 'Transits', desc: 'Planetary tracking', icon: '⭐' },
  { title: 'Expert Readers', desc: '24/7 consultations', icon: '💬' },
  { title: 'Moon Phases', desc: 'Lunar guidance', icon: '🌑' },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-[#0F172A] p-12 hover:bg-white/[0.02] transition-all group"
        >
          <p className="text-5xl mb-8">{feature.icon}</p>
          <h3 className="text-2xl font-light mb-3">{feature.title}</h3>
          <p className="text-white/60 font-light">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

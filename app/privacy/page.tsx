'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldIcon, LockIcon, GlobeIcon, CheckCircleIcon, ArrowRightIcon } from '@/components/icons';

const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : (process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life');

const FloatingOrb = ({ delay = 0, duration = 25, top = '20%', left = '10%', color = "#63B3ED" }) => (
  <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-3xl"
    style={{ top, left, background: `radial-gradient(circle, ${color}60 0%, transparent 70%)` }}
    animate={{ x: [0, 50, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }} />
);

const sections = [
  {
    icon: ShieldIcon,
    color: '#48BB78',
    title: 'Data Protection',
    content: [
      'We are committed to protecting your personal information and ensuring your privacy throughout your cosmic journey. All birth details, conversations, and personal data are encrypted and stored securely using industry-standard encryption protocols.',
      'Your conversations with our readers are processed through secure, encrypted channels. We employ end-to-end encryption to ensure that your personal information remains private and accessible only to you.',
      'The responses you receive are generated through secure computational systems that analyze astrological patterns while maintaining strict privacy boundaries. Our systems are designed to process your requests efficiently while preserving the confidentiality of your personal data.'
    ]
  },
  {
    icon: LockIcon,
    color: '#63B3ED',
    title: 'End-to-End Encryption',
    content: [
      'All data transmissions are secured using industry-standard encryption protocols. Your personal information, including birth details and payment information, is protected by multiple layers of security.',
      'We provide end-to-end encryption for all communications. This means your data is encrypted from the moment it leaves your device until it reaches our secure servers, and vice versa.',
      'Our computational infrastructure utilizes automated systems that operate within strict privacy boundaries. These systems are designed to process your requests efficiently while maintaining the confidentiality of your personal data.'
    ]
  },
  {
    icon: GlobeIcon,
    color: '#818CF8',
    title: 'Data Access & Control',
    content: [
      'Our team does not access your data without your explicit approval. You maintain full control over your personal information at all times.',
      'You can request access to your data, request corrections, or request deletion at any time by contacting us at connect@zodiak.life. We will respond to your request within 30 days.',
      'We never sell or share your personal data with third parties for marketing purposes. Your information is used solely to provide you with personalized astrological services.'
    ]
  },
  {
    icon: CheckCircleIcon,
    color: '#34D399',
    title: 'Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal information at any time. You can also request a copy of your data in a portable format.',
      'You have the right to object to processing of your personal data and to withdraw consent at any time, without affecting the lawfulness of processing based on consent before withdrawal.',
      'You have the right to lodge a complaint with a supervisory authority if you believe your data protection rights have been violated.'
    ]
  }
];

export default function PrivacyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Zodiak Privacy Policy - Learn how we protect your personal information with end-to-end encryption",
    "url": `${baseUrl}/privacy`,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Zodiak",
      "url": baseUrl
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": `${baseUrl}/privacy`
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
        {/* Floating orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <FloatingOrb delay={0} duration={30} top="10%" left="5%" color="#63B3ED" />
          <FloatingOrb delay={8} duration={35} top="50%" left="80%" color="#48BB78" />
          <FloatingOrb delay={15} duration={28} top="80%" left="10%" color="#818CF8" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/[0.03]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <nav aria-label="Breadcrumb" className="mb-8">
              <Link href="/" className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-500">
                <ArrowRightIcon size={16} className="rotate-180" />
                <span className="mono text-[10px] tracking-[0.3em] uppercase">Back to Home</span>
              </Link>
            </nav>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="mono text-white/25 mb-6 text-[9px] tracking-[0.3em] uppercase">PRIVACY POLICY</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
                Your Privacy<br />Our Priority
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-light max-w-3xl leading-relaxed">
                We are committed to protecting your personal information and ensuring your privacy throughout your cosmic journey.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <section className="relative z-10 px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 md:mb-24"
            >
              <article className="card-minimal p-8 md:p-12 rounded-none">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#48BB78]/10 flex items-center justify-center border border-[#48BB78]/20" aria-hidden="true">
                    <ShieldIcon size={32} className="text-[#48BB78]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-light mb-4">Our Commitment</h2>
                    <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                      At Zodiak, we understand that your personal information, especially your birth details, is sensitive and private. 
                      We are dedicated to maintaining the highest standards of data protection and privacy. Your trust is essential to us, 
                      and we work tirelessly to ensure your information remains secure and confidential.
                    </p>
                  </div>
                </div>
              </article>
            </motion.div>

            {/* Sections */}
            <div className="space-y-16 md:space-y-24">
              {sections.map((section, i) => (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  <div className="flex items-start gap-6 md:gap-8 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.05] flex-shrink-0" aria-hidden="true">
                      <section.icon size={24} className="text-white/60" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light">{section.title}</h2>
                  </div>
                  
                  <div className="space-y-6 ml-0 md:ml-20">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-base md:text-lg text-white/50 font-light leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Key Points */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-24 md:mt-32"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none border-[#48BB78]/20">
                <h3 className="text-2xl md:text-3xl font-light mb-8">Key Privacy Principles</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
                  {[
                    { text: 'End-to-end encryption for all communications' },
                    { text: 'No data access without your explicit approval' },
                    { text: 'Your data is never sold or shared with third parties' },
                    { text: 'Full control over your personal information' },
                    { text: 'GDPR and data protection compliant' },
                    { text: 'Regular security audits and updates' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon size={20} className="text-[#48BB78] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm md:text-base text-white/60 font-light">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-24 md:mt-32 text-center"
            >
              <p className="text-base md:text-lg text-white/40 font-light mb-4">
                Questions about our privacy practices?
              </p>
              <a 
                href="mailto:connect@zodiak.life" 
                className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-[#7DD3FC] transition-colors duration-500 mono text-sm tracking-wider"
                aria-label="Contact Zodiak support via email"
              >
                connect@zodiak.life
                <ArrowRightIcon size={16} aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.03] px-6 py-16 mt-24">
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
      </main>
    </>
  );
}

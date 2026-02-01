'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { DocumentIcon, CheckCircleIcon, ArrowRightIcon, InfoIcon } from '@/components/icons';

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
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using Zodiak, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
      'These Terms of Service ("Terms") govern your access to and use of Zodiak\'s website and services. Your use of our services constitutes your agreement to these Terms.'
    ]
  },
  {
    title: 'Service Description',
    content: [
      'Zodiak provides personalized astrological services including birth chart analysis, daily horoscopes, compatibility reports, transit tracking, and consultations with professional astrologers.',
      'Our services are provided for informational and entertainment purposes. While we strive for accuracy, astrological readings are not a substitute for professional medical, legal, or financial advice.',
      'We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with or without notice.'
    ]
  },
  {
    title: 'User Accounts',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      'You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.',
      'You must be at least 18 years old to use our services, or have parental consent if you are between 13 and 17 years old.'
    ]
  },
  {
    title: 'Payment Terms',
    content: [
      'All fees for our services are clearly displayed before purchase. Payment is required in advance for most services.',
      'Refunds may be available for technical issues or service failures. Contact support@zodiak.life within 24 hours of purchase to request a refund.',
      'We reserve the right to change our pricing at any time, but price changes will not affect purchases already made.'
    ]
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on Zodiak, including text, graphics, logos, icons, images, and software, is the property of Zodiak or its content suppliers and is protected by copyright and trademark laws.',
      'You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use our content without our prior written permission.',
      'You retain ownership of any content you submit to Zodiak, but grant us a license to use, modify, and display such content in connection with providing our services.'
    ]
  },
  {
    title: 'Limitation of Liability',
    content: [
      'Zodiak provides services "as is" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.',
      'To the maximum extent permitted by law, Zodiak shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.',
      'Our total liability for any claims arising from your use of our services shall not exceed the amount you paid to us in the 12 months preceding the claim.'
    ]
  },
  {
    title: 'Prohibited Uses',
    content: [
      'You agree not to use Zodiak for any unlawful purpose or in any way that could damage, disable, or impair our services.',
      'You may not attempt to gain unauthorized access to any portion of our services, other accounts, computer systems, or networks connected to Zodiak.',
      'You may not use automated systems or software to extract data from our website without our express written permission.'
    ]
  },
  {
    title: 'Termination',
    content: [
      'We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice, for any breach of these Terms.',
      'You may terminate your account at any time by contacting us at connect@zodiak.life or through your account settings.',
      'Upon termination, your right to use our services will immediately cease, but provisions of these Terms that by their nature should survive termination will survive.'
    ]
  },
  {
    title: 'Changes to Terms',
    content: [
      'We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last Updated" date.',
      'Your continued use of our services after any changes constitutes your acceptance of the new Terms. If you do not agree to the changes, you should discontinue use of our services.',
      'We encourage you to review these Terms periodically to stay informed about how we are protecting your rights.'
    ]
  }
];

export default function TermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service",
    "description": "Zodiak Terms of Service - User agreement covering service description, payment terms, and legal terms",
    "url": `${baseUrl}/terms`,
    "inLanguage": "en-US",
    "datePublished": "2026-01-23",
    "dateModified": "2026-01-23",
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
          "name": "Terms of Service",
          "item": `${baseUrl}/terms`
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
          <FloatingOrb delay={8} duration={35} top="50%" left="80%" color="#818CF8" />
          <FloatingOrb delay={15} duration={28} top="80%" left="10%" color="#48BB78" />
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
              <p className="mono text-white/25 mb-6 text-[9px] tracking-[0.3em] uppercase">TERMS OF SERVICE</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
                Terms &<br />Conditions
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-light max-w-3xl leading-relaxed">
                Please read these terms carefully before using our services.
              </p>
              <time className="text-sm text-white/30 font-light mt-4 mono tracking-wide block" dateTime="2026-01-23">
                Last Updated: January 23, 2026
              </time>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <section className="relative z-10 px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 md:mb-24"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#63B3ED]/10 flex items-center justify-center border border-[#63B3ED]/20" aria-hidden="true">
                    <DocumentIcon size={32} className="text-[#63B3ED]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-light mb-4">Agreement to Terms</h2>
                    <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                      These Terms of Service constitute a legally binding agreement between you and Zodiak. 
                      By accessing or using our website and services, you agree to be bound by these Terms. 
                      If you disagree with any part of these Terms, you may not access or use our services.
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sections */}
            <div className="space-y-16 md:space-y-24">
              {sections.map((section, i) => (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.08, duration: 0.8 }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <span className="mono text-[10px] text-white/20 tracking-widest w-8 pt-1" aria-label={`Section ${i + 1}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-light flex-1">{section.title}</h2>
                  </div>
                  
                  <div className="space-y-4 ml-0 md:ml-12">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-base md:text-lg text-white/50 font-light leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Contact */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-24 md:mt-32"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none border-[#63B3ED]/20">
                <div className="flex items-start gap-6">
                  <InfoIcon size={24} className="text-[#63B3ED] mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-light mb-4">Questions About These Terms?</h3>
                    <p className="text-base text-white/60 font-light mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <a 
                      href="mailto:connect@zodiak.life" 
                      className="inline-flex items-center gap-2 text-[#63B3ED] hover:text-[#7DD3FC] transition-colors duration-500 mono text-sm tracking-wider"
                      aria-label="Contact Zodiak support via email"
                    >
                      connect@zodiak.life
                      <ArrowRightIcon size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.section>
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

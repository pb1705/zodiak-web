'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MailIcon, HelpIcon, ArrowRightIcon, CheckCircleIcon, ZapIcon } from '@/components/icons';

const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : (process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life');

const FloatingOrb = ({ delay = 0, duration = 25, top = '20%', left = '10%', color = "#63B3ED" }) => (
  <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none blur-3xl"
    style={{ top, left, background: `radial-gradient(circle, ${color}60 0%, transparent 70%)` }}
    animate={{ x: [0, 50, 0], y: [0, -80, 0], scale: [1, 1.1, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }} />
);

const faqs = [
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team via email at connect@zodiak.life. We typically respond within 24-48 hours during business days.'
  },
  {
    question: 'What information should I include in my support request?',
    answer: 'Please include your account email, a detailed description of your issue, and any relevant screenshots or error messages. This helps us assist you more efficiently.'
  },
  {
    question: 'How long does it take to get a response?',
    answer: 'We aim to respond to all support inquiries within 24-48 hours. For urgent matters, please mark your email as urgent and we will prioritize it accordingly.'
  },
  {
    question: 'Can I get help with my birth chart interpretation?',
    answer: 'Yes! Our support team can help with technical issues related to your birth chart. For detailed astrological interpretations, we recommend booking a consultation with one of our expert readers.'
  },
  {
    question: 'What if I have a billing question?',
    answer: 'For billing inquiries, refund requests, or payment issues, please email connect@zodiak.life with "Billing" in the subject line. Include your transaction details for faster processing.'
  },
  {
    question: 'How do I report a technical issue?',
    answer: 'Please email connect@zodiak.life with details about the issue, including what you were trying to do, what happened, and any error messages you received. Screenshots are helpful!'
  }
];

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      const subject = encodeURIComponent('Support Request from Website');
      const body = encodeURIComponent(`Email: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:connect@zodiak.life?subject=${subject}&body=${body}`;
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setMessage('');
      }, 3000);
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Support & Help Center",
    "description": "Zodiak Support - Get help with astrology app, contact support team, find FAQs",
    "url": `${baseUrl}/support`,
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
          "name": "Support",
          "item": `${baseUrl}/support`
        }
      ]
    },
    "about": {
      "@type": "ContactPage",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "connect@zodiak.life",
        "availableLanguage": "English"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
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
              <p className="mono text-white/25 mb-6 text-[9px] tracking-[0.3em] uppercase">SUPPORT</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight">
                We're Here<br />to Help
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-light max-w-3xl leading-relaxed">
                Have a question or need assistance? Our support team is ready to help you.
              </p>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <section className="relative z-10 px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            {/* Contact Method */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 md:mb-24"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none border-[#48BB78]/20">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-full bg-[#48BB78]/10 flex items-center justify-center border border-[#48BB78]/20" aria-hidden="true">
                    <MailIcon size={32} className="text-[#48BB78]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-light mb-4">Email Support</h2>
                    <p className="text-base md:text-lg text-white/60 font-light leading-relaxed mb-6">
                      Currently, we provide email-based support. Our team typically responds within 24-48 hours.
                    </p>
                    <a 
                      href="mailto:connect@zodiak.life" 
                      className="inline-flex items-center gap-3 text-[#48BB78] hover:text-[#34D399] transition-colors duration-500 text-lg font-light"
                      aria-label="Contact Zodiak support via email at connect@zodiak.life"
                    >
                      connect@zodiak.life
                      <ArrowRightIcon size={20} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-white/[0.05]">
                  <ZapIcon size={20} className="text-[#F59E0B]" aria-hidden="true" />
                  <p className="text-sm text-white/40 font-light">
                    <span className="text-white/60">Response Time:</span> Typically within 24-48 hours
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Contact Form */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-20 md:mb-24"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none">
                <h2 className="text-2xl md:text-3xl font-light mb-8">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
                  <div>
                    <label htmlFor="email" className="block mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-3">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-base font-light transition-all duration-500 outline-none focus:border-[#48BB78]/50 focus:bg-white/[0.04]"
                      placeholder="your.email@example.com"
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-base font-light transition-all duration-500 outline-none focus:border-[#48BB78]/50 focus:bg-white/[0.04] resize-none"
                      placeholder="Tell us how we can help..."
                      aria-required="true"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-trust px-8 py-4 text-sm tracking-widest uppercase w-full md:w-auto"
                    aria-label="Submit support request"
                  >
                    {submitted ? 'Opening Email...' : 'Send Message'}
                  </button>
                  
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 text-[#48BB78] text-sm"
                      role="status"
                      aria-live="polite"
                    >
                      <CheckCircleIcon size={20} aria-hidden="true" />
                      <span>Your email client will open with the message pre-filled.</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              aria-labelledby="faq-heading"
            >
              <div className="flex items-center gap-4 mb-12">
                <HelpIcon size={24} className="text-white/40" aria-hidden="true" />
                <h2 id="faq-heading" className="text-3xl md:text-4xl font-light">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4" role="list">
                {faqs.map((faq, i) => (
                  <motion.article
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                      className="w-full text-left card-minimal p-6 rounded-none hover:bg-white/[0.04] transition-all duration-500"
                      aria-expanded={expandedFAQ === i}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-light flex-1">{faq.question}</h3>
                        <motion.div
                          animate={{ rotate: expandedFAQ === i ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          aria-hidden="true"
                        >
                          <ArrowRightIcon size={20} className="text-white/20 rotate-90" />
                        </motion.div>
                      </div>
                      {expandedFAQ === i && (
                        <motion.div
                          id={`faq-answer-${i}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 text-base text-white/50 font-light leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </button>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            {/* Additional Info */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-24 md:mt-32"
            >
              <div className="card-minimal p-8 md:p-12 rounded-none border-[#63B3ED]/20">
                <h3 className="text-xl md:text-2xl font-light mb-6">Before You Contact Us</h3>
                <ul className="space-y-4" role="list">
                  {[
                    'Check our FAQ section above - your question might already be answered',
                    'Include your account email and any relevant details',
                    'For technical issues, include screenshots or error messages',
                    'For billing questions, include transaction IDs or receipts'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon size={20} className="text-[#63B3ED] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm md:text-base text-white/60 font-light">{item}</span>
                    </li>
                  ))}
                </ul>
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

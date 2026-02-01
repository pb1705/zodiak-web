import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Terms of Service — User Agreement & Legal Terms | Zodiak',
  description: 'Read Zodiak\'s Terms of Service. User agreement covering service description, payment terms, intellectual property, liability, and prohibited uses. Last updated January 2026.',
  keywords: ['terms of service', 'user agreement', 'legal terms', 'astrology app terms', 'service agreement', 'terms and conditions', 'user policy', 'Zodiak terms', 'astrology app legal', 'horoscope app terms'],
  openGraph: {
    title: 'Terms of Service — User Agreement & Legal Terms | Zodiak',
    description: 'Read Zodiak\'s Terms of Service. User agreement covering service description, payment terms, and legal terms.',
    url: `${baseUrl}/terms`,
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Terms of Service',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — User Agreement & Legal Terms',
    description: 'Read Zodiak\'s Terms of Service. User agreement covering service description and legal terms.',
  },
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

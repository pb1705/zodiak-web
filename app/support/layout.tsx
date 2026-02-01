import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Support & Help Center — Contact Us | Zodiak',
  description: 'Zodiak support: contact connect@zodiak.life. FAQ on birth charts, horoscopes, compatibility. Response within 24-48 hours.',
  keywords: ['zodiak support', 'astrology app help', 'customer support', 'help center', 'contact zodiak', 'faq astrology', 'support email', 'birth chart help', 'horoscope app support', 'astrology consultation help', 'Zodiak contact', 'astrology FAQ'],
  openGraph: {
    title: 'Support & Help Center — Contact Us | Zodiak',
    description: 'Get help with Zodiak astrology app. Contact our support team via email. Find answers to frequently asked questions.',
    url: `${baseUrl}/support`,
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Support & Help Center',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support & Help Center — Contact Us',
    description: 'Get help with Zodiak astrology app. Contact our support team via email.',
  },
  alternates: {
    canonical: `${baseUrl}/support`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

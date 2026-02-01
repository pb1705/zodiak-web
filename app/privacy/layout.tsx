import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data Protection & Security | Zodiak',
  description: 'Learn how Zodiak protects your personal information with end-to-end encryption. Our team does not access your data without your explicit approval. GDPR compliant privacy policy.',
  keywords: ['privacy policy', 'data protection', 'end-to-end encryption', 'GDPR compliant', 'data security', 'privacy astrology app', 'secure astrology', 'data privacy', 'Zodiak privacy', 'astrology app privacy', 'personal data astrology'],
  openGraph: {
    title: 'Privacy Policy — Data Protection & Security | Zodiak',
    description: 'Learn how Zodiak protects your personal information with end-to-end encryption. GDPR compliant privacy policy.',
    url: `${baseUrl}/privacy`,
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Zodiak Privacy Policy',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Data Protection & Security',
    description: 'Learn how Zodiak protects your personal information with end-to-end encryption.',
  },
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import "./globals.css";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from "@/lib/languages";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Zodiak — Hyper-Personalized Astrology | Birth Charts, Daily Horoscopes & Expert Readings",
    template: "%s | Zodiak"
  },
  description: "Professional astrology app powered by NASA data. Get personalized birth charts, daily cosmic reports, compatibility analysis, transit tracking, and 24/7 expert consultations. High-precision astrological guidance combining Vedic and Western traditions.",
  keywords: [
    "astrology app",
    "birth chart calculator",
    "natal chart analysis",
    "daily horoscope personalized",
    "NASA astronomy data",
    "professional astrologer consultation",
    "relationship compatibility astrology",
    "planetary transit tracking",
    "moon phases calendar",
    "Vedic astrology",
    "Western astrology",
    "rising sign calculator",
    "accurate birth chart",
    "daily cosmic report",
    "astrology reading online",
    "expert astrologer",
    "Saturn return",
    "mercury retrograde",
    "full moon meaning",
    "zodiac signs compatibility"
  ],
  authors: [{ name: "Zodiak Team" }],
  creator: "Zodiak",
  publisher: "Zodiak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: DEFAULT_LANGUAGE.locale,
    alternateLocale: SUPPORTED_LANGUAGES.filter(l => l.code !== DEFAULT_LANGUAGE.code).map(l => l.locale),
    url: baseUrl,
    siteName: "Zodiak",
    title: "Zodiak — Hyper-Personalized Astrology | Birth Charts, Daily Horoscopes & Expert Readings",
    description: "Professional astrology powered by NASA data. Birth charts, daily horoscopes, and 24/7 expert guidance.",
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Zodiak Astrology App - Hyper-Personalized Astrological Guidance",
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiak — Hyper-Personalized Astrology",
    description: "Professional astrology powered by NASA data. Birth charts, daily horoscopes, and 24/7 expert guidance.",
    images: [`${baseUrl}/og-image.png`],
    creator: "@zodiak",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: Object.fromEntries(
      SUPPORTED_LANGUAGES.map(lang => [
        lang.code,
        getHreflangUrl('/', lang, baseUrl)
      ])
    ),
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "Astrology",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Hreflang Tags for Multi-Language Support */}
        {SUPPORTED_LANGUAGES.map(lang => (
          <link
            key={lang.code}
            rel="alternate"
            hrefLang={lang.code}
            href={getHreflangUrl('/', lang, baseUrl)}
          />
        ))}
        {/* x-default points to the default language */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={getHreflangUrl('/', DEFAULT_LANGUAGE, baseUrl)}
        />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              "name": "Zodiak",
              "description": "Professional astrology app powered by NASA data for personalized birth charts, daily cosmic reports, and expert consultations",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "iOS, Android",
              "url": baseUrl,
              "inLanguage": SUPPORTED_LANGUAGES.map(l => l.code),
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "5000"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free to start with premium features available"
              },
              "featureList": [
                "Birth Chart Calculator",
                "Daily Cosmic Reports",
                "Compatibility Analysis",
                "Transit Tracking",
                "Expert Astrologer Consultations",
                "Moon Phase Guidance",
                "Vedic & Western Astrology"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Zodiak",
              "url": baseUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${baseUrl}/horoscope?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Zodiak",
              "url": baseUrl,
              "logo": `${baseUrl}/logo.png`,
              "sameAs": [
                "https://twitter.com/zodiak",
                "https://facebook.com/zodiak",
                "https://instagram.com/zodiak"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

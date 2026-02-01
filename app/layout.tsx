import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getHreflangUrl } from "@/lib/languages";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F172A" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

// SEO: title 50–60 chars, description 120–158 chars (2024 best practice)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Astrology & Birth Chart | Zodiak — Horoscopes & Expert Readings",
    template: "%s | Zodiak"
  },
  description: "Free astrology readings and birth charts. Daily horoscopes, compatibility, transits, and 24/7 expert astrology. NASA data. Vedic and Western.",
  keywords: [
    "astrology",
    "horoscope",
    "horoscope today",
    "zodiac signs",
    "astrology signs",
    "daily horoscope",
    "birth chart",
    "birth chart calculator",
    "natal chart",
    "free birth chart",
    "astrology chart",
    "daily horoscope today",
    "today horoscope",
    "moon sign",
    "rising sign",
    "sun sign",
    "ascendant",
    "rising sign calculator",
    "moon sign calculator",
    "astrology app",
    "natal chart analysis",
    "NASA astronomy data",
    "professional astrologer",
    "astrology reading",
    "astrology reading online",
    "relationship compatibility",
    "zodiac compatibility",
    "love compatibility",
    "synastry",
    "Guna Milan",
    "planetary transits",
    "transit forecast",
    "Saturn return",
    "mercury retrograde",
    "moon phases",
    "Vedic astrology",
    "Western astrology",
    "daily cosmic report",
    "expert astrologer",
    "online astrologer",
    "full moon meaning",
    "free astrology",
    "personalized horoscope",
    "astrology consultation",
    "birth chart reading",
    "weekly horoscope",
    "monthly horoscope",
    "yearly horoscope",
    "love horoscope",
    "career horoscope",
    "compatibility chart"
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
    title: "Astrology & Birth Chart | Zodiak — Horoscopes & Expert Readings",
    description: "Free astrology readings and birth charts. Daily horoscopes, compatibility, transits, and 24/7 expert astrology. NASA data. Vedic and Western.",
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Zodiak Astrology App - Hyper-Personalized Astrological Guidance",
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology & Birth Chart | Zodiak — Horoscopes & Expert Readings",
    description: "Free astrology readings and birth charts. Daily horoscopes, compatibility, transits, and 24/7 expert astrology. NASA data.",
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
    <html lang="en" itemScope itemType="https://schema.org/WebSite">
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
        
        {/* Preconnect / dns-prefetch for performance (Core Web Vitals) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://hel1.your-objectstorage.com" />
        <link rel="preconnect" href="https://hel1.your-objectstorage.com" crossOrigin="anonymous" />
        
        {/* Structured Data - MobileApplication (keyword-rich for search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              "name": "Zodiak — Astrology, Horoscope & Birth Chart",
              "description": "Free astrology app: birth chart calculator, daily horoscope, zodiac signs, compatibility, planetary transits, moon sign, rising sign. NASA data. Vedic and Western astrology. Expert readings 24/7.",
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
                "description": "Free birth chart, horoscope today, compatibility. Premium expert astrology consultations available."
              },
              "featureList": [
                "Birth Chart Calculator",
                "Natal Chart Free",
                "Daily Horoscope",
                "Horoscope Today",
                "All 12 Zodiac Signs",
                "Daily Cosmic Report",
                "Compatibility Analysis",
                "Synastry & Guna Milan",
                "Planetary Transits",
                "Saturn Return",
                "Mercury Retrograde",
                "Moon Sign & Rising Sign",
                "Expert Astrologer Consultations",
                "Moon Phase Guidance",
                "Vedic & Western Astrology"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite with Search (astrology-focused for search visibility) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Zodiak — Astrology, Horoscope Today & Birth Chart",
              "description": "Free astrology: birth chart, horoscope today, zodiac signs, compatibility, transits, moon sign, rising sign. NASA data. Vedic and Western. Expert readings 24/7.",
              "url": baseUrl,
              "inLanguage": "en",
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
        
        {/* Structured Data - Organization */}
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
                "email": "connect@zodiak.life",
                "availableLanguage": "English"
              }
            })
          }}
        />
        
        {/* Structured Data - BreadcrumbList (Default) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseUrl
                }
              ]
            })
          }}
        />
        {/* Structured Data - ItemList of main services (astrology keywords for search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Zodiak Astrology Services",
              "description": "Birth chart, daily horoscope, compatibility, transits, and expert astrology readings.",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Birth Chart Calculator", "url": `${baseUrl}/birth-chart` },
                { "@type": "ListItem", "position": 2, "name": "Daily Horoscope", "url": `${baseUrl}/horoscope` },
                { "@type": "ListItem", "position": 3, "name": "Daily Cosmic Report", "url": `${baseUrl}/daily-cosmic` },
                { "@type": "ListItem", "position": 4, "name": "Compatibility Analysis", "url": `${baseUrl}/compatibility` },
                { "@type": "ListItem", "position": 5, "name": "Planetary Transits", "url": `${baseUrl}/transits` },
                { "@type": "ListItem", "position": 6, "name": "Expert Astrologers", "url": `${baseUrl}/readers` }
              ]
            })
          }}
        />
      </head>
      <body itemScope itemType="https://schema.org/WebSite">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

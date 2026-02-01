'use client';

/**
 * Google Analytics: we only send page views (on load and on route change).
 * Extra events (clicks, scrolls, outbound links) come from GA4 "Enhanced measurement".
 * To limit to page views only: GA4 → Admin → Data Streams → [Web] → Enhanced measurement → turn off or disable individual events.
 */
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = 'G-W8XZEVNL3Q';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname ?? window.location.pathname,
    });
  }, [pathname]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsInner />
      </Suspense>
    </>
  );
}

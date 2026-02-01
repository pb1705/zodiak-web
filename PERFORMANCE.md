# Performance (Lighthouse) – What We Did & What’s Left

## Implemented

1. **Google Analytics off main thread**  
   GA scripts use `strategy="lazyOnload"` so they load after the page is idle. Reduces main-thread work and long tasks.

2. **Image optimization for screenshots**  
   Homepage feature screenshots use `next/image` with `sizes="(max-width: 768px) 100vw, 300px"`. Next.js serves WebP/AVIF and appropriate dimensions, cutting transfer size.

3. **Cache headers**  
   - `/_next/static/*`: long-term cache (immutable).  
   - `/_next/image`: long-term cache for optimized images.  
   - Favicon and PNGs: 24h cache.

4. **Modern browsers only**  
   `package.json` has a `browserslist` for Chrome/Edge/Firefox/Safari recent versions. Build tools can ship less legacy polyfill code (some polyfills may still come from dependencies).

5. **LCP image hints**  
   - Hero image uses `priority` and `fetchPriority="high"`.  
   - `preconnect` to `hel1.your-objectstorage.com` so the connection starts early.

## Optional / Server-Side

- **Render-blocking CSS (~300 ms)**  
  The main CSS chunk blocks first paint. To improve further you’d need critical CSS (e.g. inline above-the-fold styles and defer the rest). That usually means a build plugin or manual extraction; not done here.

- **Legacy JavaScript (~12 KiB)**  
  Polyfills (e.g. `Array.at`, `Object.fromEntries`) can come from dependencies (e.g. framer-motion). Browserslist helps; fully removing them may require updating or replacing those deps.

- **LCP “element render delay”**  
  The LCP element (hero heading) is inside a client component, so it can paint only after hydration. To reduce delay you could make the hero shell (heading + CTA) server-rendered and keep only animations in a small client component.

- **External image cache (objectstorage)**  
  Cache headers for `hel1.your-objectstorage.com` must be set on that CDN/storage (e.g. long `max-age`). We can’t change that from the Next app.

- **Further image savings**  
  For maximum savings, re-export hero and screenshots as WebP/AVIF at the right display sizes and serve them from your CDN; Next.js image optimization already helps for images we proxy.

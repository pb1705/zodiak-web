import { MoonIcon, StarIcon } from '@/components/icons';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Hero Skeleton */}
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <a href="/horoscope" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Signs
        </a>

        {/* Animated Icon Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="w-24 h-24 mx-auto rounded-full bg-white/5"></div>
        </div>
        
        {/* Title Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-20 w-64 mx-auto bg-white/5 rounded animate-pulse"></div>
          <div className="h-6 w-48 mx-auto bg-white/5 rounded animate-pulse"></div>
        </div>
        
        {/* Stars Skeleton */}
        <div className="flex items-center justify-center gap-2 mb-12 animate-pulse">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} size={20} className="text-white/10" />
            ))}
          </div>
        </div>
      </section>

      {/* Main Reading Skeleton */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="card-minimal p-12 rounded-none mb-8 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-white/5 rounded"></div>
            <div className="h-7 w-48 bg-white/5 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-white/5 rounded w-full"></div>
            <div className="h-5 bg-white/5 rounded w-11/12"></div>
            <div className="h-5 bg-white/5 rounded w-10/12"></div>
            <div className="h-5 bg-white/5 rounded w-full"></div>
            <div className="h-5 bg-white/5 rounded w-9/12"></div>
          </div>
        </div>

        {/* Life Areas Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card-minimal p-8 rounded-none animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 bg-white/5 rounded"></div>
                <div className="h-6 w-24 bg-white/5 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-11/12"></div>
                <div className="h-4 bg-white/5 rounded w-10/12"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <MoonIcon size={20} className="text-[#7DD3FC] animate-spin" />
        <span className="text-sm text-white/60 font-light">Loading cosmic insights...</span>
      </div>
    </main>
  );
}

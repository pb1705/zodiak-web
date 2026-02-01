import { SunIcon, MoonIcon } from '@/components/icons';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Hero */}
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <SunIcon size={20} className="text-[#F59E0B] animate-pulse" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">DAILY HOROSCOPES</span>
        </div>
        
        <div className="text-6xl md:text-8xl font-light mb-8 leading-none" aria-hidden="true">
          Today's<br />Horoscopes
        </div>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Daily astrological guidance for all 12 zodiac signs powered by NASA data
        </p>
      </section>

      {/* Horoscopes Grid Skeleton */}
      <section id="horoscopes" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="card-minimal p-8 rounded-none min-h-[280px] flex flex-col animate-pulse">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded"></div>
                  <div>
                    <div className="h-7 w-24 bg-white/5 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-white/5 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-12 bg-white/5 rounded"></div>
              </div>

              {/* Prediction */}
              <div className="flex-1 space-y-2 mb-6">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-11/12"></div>
                <div className="h-4 bg-white/5 rounded w-10/12"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
              </div>

              {/* Read More */}
              <div className="h-5 w-40 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <MoonIcon size={20} className="text-[#7DD3FC] animate-spin" />
        <span className="text-sm text-white/60 font-light">Loading today's horoscopes...</span>
      </div>
    </main>
  );
}

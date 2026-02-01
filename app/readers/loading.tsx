import { UsersIcon, StarIcon, ClockIcon } from '@/components/icons';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Hero */}
      <section className="px-6 py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <UsersIcon size={20} className="text-[#48BB78] animate-pulse" />
          <span className="mono text-[10px] text-white/40 tracking-[0.3em]">EXPERT GUIDANCE</span>
        </div>
        
        <div className="text-6xl md:text-8xl font-light mb-8 leading-none" aria-hidden="true">
          Talk to Expert<br />Astrologers
        </div>
        
        <p className="text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Certified professional astrologers available 24/7 for personalized readings and spiritual guidance
        </p>
      </section>

      {/* Why Choose Our Readers */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
          Why our readers are exceptional
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-minimal p-8 rounded-none animate-pulse">
              <div className="mb-6">
                <div className="w-8 h-8 bg-white/5 rounded"></div>
              </div>
              <div className="h-6 w-32 bg-white/5 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full"></div>
                <div className="h-3 bg-white/5 rounded w-11/12"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Readers Skeleton */}
      <section id="readers" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-light">Featured readers</h2>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#48BB78]/10 border border-[#48BB78]/20 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#48BB78]"></div>
            <div className="h-4 w-24 bg-[#48BB78]/20 rounded"></div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="card-minimal p-8 rounded-none animate-pulse">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full mx-auto bg-white/5 border-2 border-white/10"></div>
                {i % 3 === 0 && (
                  <div className="absolute bottom-0 right-1/2 translate-x-8 w-6 h-6 bg-[#48BB78]/20 rounded-full"></div>
                )}
              </div>

              {/* Name & Rating */}
              <div className="text-center space-y-3 mb-4">
                <div className="h-6 w-32 bg-white/5 rounded mx-auto"></div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} size={16} className="text-white/10" />
                    ))}
                  </div>
                  <div className="h-4 w-20 bg-white/5 rounded"></div>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <ClockIcon size={14} className="text-white/10" />
                <div className="h-4 w-32 bg-white/5 rounded"></div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-20 bg-white/5 rounded-full"></div>
                ))}
              </div>

              {/* Rate & CTA */}
              <div className="text-center space-y-4">
                <div className="h-8 w-24 bg-white/5 rounded mx-auto"></div>
                <div className="h-12 w-full bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <UsersIcon size={20} className="text-[#48BB78] animate-pulse" />
        <span className="text-sm text-white/60 font-light">Loading expert readers...</span>
      </div>
    </main>
  );
}

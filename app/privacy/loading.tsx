export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Floating orbs skeleton */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] blur-3xl bg-[#63B3ED]/20" style={{ top: '10%', left: '5%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] blur-3xl bg-[#48BB78]/20" style={{ top: '50%', left: '80%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] blur-3xl bg-[#818CF8]/20" style={{ top: '80%', left: '10%' }} />
      </div>

      {/* Header Skeleton */}
      <header className="relative z-10 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <div className="inline-flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 bg-white/5 rounded"></div>
              <div className="h-3 w-32 bg-white/5 rounded"></div>
            </div>
          </nav>
          
          <div className="space-y-6 animate-pulse">
            <div className="h-4 w-40 bg-white/5 rounded"></div>
            <div className="h-24 md:h-32 w-full md:w-3/4 bg-white/5 rounded"></div>
            <div className="h-6 md:h-8 w-full md:w-2/3 bg-white/5 rounded"></div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <section className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Card Skeleton */}
          <div className="mb-20 md:mb-24 animate-pulse">
            <div className="card-minimal p-8 md:p-12 rounded-none">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/5"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-48 bg-white/5 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-11/12"></div>
                    <div className="h-4 bg-white/5 rounded w-10/12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Skeleton */}
          <div className="space-y-16 md:space-y-24">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start gap-6 md:gap-8 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/5"></div>
                  <div className="h-10 w-64 bg-white/5 rounded"></div>
                </div>
                
                <div className="space-y-6 ml-0 md:ml-20">
                  <div className="space-y-3">
                    <div className="h-5 bg-white/5 rounded w-full"></div>
                    <div className="h-5 bg-white/5 rounded w-11/12"></div>
                    <div className="h-5 bg-white/5 rounded w-10/12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Points Card Skeleton */}
          <div className="mt-24 md:mt-32 animate-pulse">
            <div className="card-minimal p-8 md:p-12 rounded-none">
              <div className="h-8 w-64 bg-white/5 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/5 rounded mt-1"></div>
                    <div className="h-4 flex-1 bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Skeleton */}
          <div className="mt-24 md:mt-32 text-center animate-pulse">
            <div className="h-5 w-80 mx-auto bg-white/5 rounded mb-4"></div>
            <div className="h-6 w-48 mx-auto bg-white/5 rounded"></div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="relative z-10 border-t border-white/[0.03] px-6 py-16 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
          <div className="flex gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-20 bg-white/5 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

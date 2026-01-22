import { UsersIcon, StarIcon } from '@/components/icons';

export default function Loading() {
  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <a href="/readers" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Readers
        </a>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="card-minimal p-8 rounded-none sticky top-24 animate-pulse">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full mx-auto bg-white/5"></div>
                <div className="absolute bottom-2 right-1/2 translate-x-16 w-6 h-6 bg-white/5 rounded-full"></div>
              </div>

              {/* Name & Rating */}
              <div className="text-center space-y-3 mb-6">
                <div className="h-8 w-40 bg-white/5 rounded mx-auto"></div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} size={16} className="text-white/10" />
                    ))}
                  </div>
                  <div className="h-4 w-24 bg-white/5 rounded"></div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-24 bg-white/5 rounded-full"></div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/5">
                {[1, 2].map((i) => (
                  <div key={i} className="text-center space-y-1">
                    <div className="h-7 w-16 bg-white/5 rounded mx-auto"></div>
                    <div className="h-3 w-20 bg-white/5 rounded mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="text-center space-y-4">
                <div className="h-10 w-32 bg-white/5 rounded mx-auto"></div>
                <div className="h-12 w-full bg-white/5 rounded"></div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="card-minimal p-8 rounded-none animate-pulse">
              <div className="h-7 w-32 bg-white/5 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-11/12"></div>
                <div className="h-4 bg-white/5 rounded w-10/12"></div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="card-minimal p-8 rounded-none animate-pulse">
              <div className="h-7 w-40 bg-white/5 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-11/12"></div>
                <div className="h-4 bg-white/5 rounded w-9/12"></div>
              </div>
            </div>

            {/* Approach Section */}
            <div className="card-minimal p-8 rounded-none animate-pulse">
              <div className="h-7 w-44 bg-white/5 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-4 bg-white/5 rounded w-10/12"></div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card-minimal p-8 rounded-none animate-pulse">
              <div className="h-7 w-48 bg-white/5 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-5 w-32 bg-white/5 rounded"></div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} size={14} className="text-white/10" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/5 rounded w-full"></div>
                      <div className="h-4 bg-white/5 rounded w-11/12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <UsersIcon size={20} className="text-[#48BB78] animate-pulse" />
        <span className="text-sm text-white/60 font-light">Loading reader profile...</span>
      </div>
    </main>
  );
}

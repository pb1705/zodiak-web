import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchReader, fetchReaders, type Reader } from '@/lib/api';
import { StarIcon } from '@/components/icons';
import AppDownloadButtons from '@/components/AppDownloadButtons';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const reader = await fetchReader(id);
  
  if (!reader) {
    return {
      title: 'Reader Not Found',
    };
  }

  return {
    title: `${reader.displayName} - Expert Astrologer | Zodiak`,
    description: `Book a session with ${reader.displayName}. ${reader.averageRating}★ rating with ${reader.totalReadings} readings completed.`,
  };
}

export const revalidate = 300; // Cache for 5 minutes

export default async function ReaderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reader = await fetchReader(id);
  const allReaders = await fetchReaders();

  if (!reader) {
    notFound();
  }

  // Get other available readers (exclude current one)
  const otherReaders = allReaders.filter(r => r.readerId !== reader.readerId).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="px-6 py-6 max-w-6xl mx-auto border-b border-white/[0.08]">
        <Link href="/readers" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Readers
        </Link>
      </section>

      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-minimal p-8 rounded-none sticky top-24">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <img
                    src={reader.profileImageUrl || 'https://via.placeholder.com/150'}
                    alt={reader.displayName}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-[#63B3ED]/30"
                  />
                  {reader.isAvailable && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#48BB78] rounded-full border-4 border-[#0F172A]"></div>
                  )}
                </div>
                
                <h1 className="text-3xl font-light mb-2">{reader.displayName}</h1>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <StarIcon size={20} className="text-[#F59E0B]" filled />
                  <span className="text-2xl font-light">{reader.averageRating.toFixed(2)}</span>
                </div>

                {/* Status Badge */}
                {reader.isAvailable ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#48BB78]/15 border border-[#48BB78]/25">
                    <span className="w-2 h-2 rounded-full bg-[#48BB78]"></span>
                    <span className="text-sm font-semibold text-[#48BB78]">Available Now</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    <span className="w-2 h-2 rounded-full bg-white/40"></span>
                    <span className="text-sm font-medium text-white/60">Currently Offline</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/[0.08]">
                <div className="text-center">
                  <div className="text-2xl font-light mb-1">{reader.totalReadings.toLocaleString()}</div>
                  <div className="text-xs text-white/50">Readings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light mb-1">{reader.yearsOfExperience}+</div>
                  <div className="text-xs text-white/50">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light mb-1">{Math.floor(reader.totalMinutesRead / 60)}</div>
                  <div className="text-xs text-white/50">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light mb-1">{reader.currency === 'INR' ? '₹' : '$'}{reader.ratePerMinute.toFixed(2)}</div>
                  <div className="text-xs text-white/50">Per Minute</div>
                </div>
              </div>

              {/* Specializations */}
              {reader.specializations && reader.specializations.length > 0 && (
                <div className="pt-6 border-t border-white/[0.08]">
                  <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {reader.specializations.map((spec) => (
                      <div key={spec.specializationId} className="px-3 py-1.5 rounded-full bg-[#63B3ED]/15 border border-[#63B3ED]/25">
                        <span className="text-xs font-medium text-[#63B3ED]">{spec.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Badge */}
              {reader.isVerified && (
                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2 text-sm text-[#48BB78]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Verified Astrologer</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - About & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="card-minimal p-8 rounded-none">
              <h2 className="text-2xl font-light mb-4">About {reader.displayName}</h2>
              <p className="text-base text-white/70 font-light leading-relaxed">
                {reader.bio}
              </p>
            </div>

            {/* Specializations with Images */}
            {reader.specializations && reader.specializations.length > 0 && (
              <div className="card-minimal p-8 rounded-none">
                <h2 className="text-2xl font-light mb-6">Areas of Expertise</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {reader.specializations.map((spec) => (
                    <div key={spec.specializationId} className="flex items-center gap-4 p-4 rounded-none bg-white/[0.02] border border-white/[0.08]">
                      <img
                        src={spec.iconUrl}
                        alt={spec.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-base font-semibold">{spec.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Summary */}
            <div className="card-minimal p-8 rounded-none">
              <h2 className="text-2xl font-light mb-6">Track Record</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-light mb-2 text-[#63B3ED]">{reader.totalReadings.toLocaleString()}</div>
                  <div className="text-sm text-white/60">Completed Readings</div>
                </div>
                <div>
                  <div className="text-4xl font-light mb-2 text-[#48BB78]">{Math.floor(reader.totalMinutesRead / 60).toLocaleString()}</div>
                  <div className="text-sm text-white/60">Hours of Guidance</div>
                </div>
                <div>
                  <div className="text-4xl font-light mb-2 text-[#F59E0B]">{reader.averageRating.toFixed(2)}</div>
                  <div className="text-sm text-white/60">Average Rating</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card-minimal p-8 rounded-none text-center" style={{ backgroundColor: 'rgba(99, 179, 237, 0.05)', borderColor: 'rgba(99, 179, 237, 0.15)' }}>
              <h3 className="text-2xl font-light mb-4">Ready to Connect?</h3>
              <p className="text-white/60 mb-6 font-light">
                Download the Zodiak app to start your session with {reader.displayName.split(' ')[0]}
              </p>
              <AppDownloadButtons />
            </div>
          </div>
        </div>

        {/* Other Readers */}
        {otherReaders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6">Other Available Readers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherReaders.map((r) => (
                <Link key={r.readerId} href={`/readers/${r.readerId}`}>
                  <div className="card-minimal p-6 rounded-none hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={r.profileImageUrl || 'https://via.placeholder.com/50'} 
                        alt={r.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold truncate">{r.displayName}</h3>
                        <div className="text-sm text-[#63B3ED]">{r.currency === 'INR' ? '₹' : '$'}{r.ratePerMinute.toFixed(2)}/min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon size={14} className="text-[#F59E0B]" filled />
                      <span className="text-white/70">{r.averageRating.toFixed(1)}</span>
                      {r.isAvailable && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="text-[#48BB78]">Available Now</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

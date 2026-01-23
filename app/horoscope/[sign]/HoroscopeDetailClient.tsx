'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  StarIcon, SunIcon, HeartIcon, BrainIcon, ClockIcon, TrendingIcon, 
  SparklesIcon, CalendarIcon, GlobeIcon, MoonIcon, CompassIcon, 
  TargetIcon, InfoIcon, ArrowRightIcon
} from '@/components/icons';
import { fetchDailyHoroscope, fetchWeeklyHoroscope, fetchMonthlyHoroscope, fetchYearlyHoroscope, fetchReaders, type HoroscopeResponse, type Reader } from '@/lib/api';

// Zodiac sign data matching mobile app
const ZODIAC_DATA: Record<string, { icon: string; color: string; element: string; planet: string; dateRange: string }> = {
  aries: { icon: '♈', color: '#FF6B6B', element: 'Fire', planet: 'Mars', dateRange: 'Mar 21 - Apr 19' },
  taurus: { icon: '♉', color: '#48BB78', element: 'Earth', planet: 'Venus', dateRange: 'Apr 20 - May 20' },
  gemini: { icon: '♊', color: '#F59E0B', element: 'Air', planet: 'Mercury', dateRange: 'May 21 - Jun 20' },
  cancer: { icon: '♋', color: '#63B3ED', element: 'Water', planet: 'Moon', dateRange: 'Jun 21 - Jul 22' },
  leo: { icon: '♌', color: '#F59E0B', element: 'Fire', planet: 'Sun', dateRange: 'Jul 23 - Aug 22' },
  virgo: { icon: '♍', color: '#48BB78', element: 'Earth', planet: 'Mercury', dateRange: 'Aug 23 - Sep 22' },
  libra: { icon: '♎', color: '#818CF8', element: 'Air', planet: 'Venus', dateRange: 'Sep 23 - Oct 22' },
  scorpio: { icon: '♏', color: '#63B3ED', element: 'Water', planet: 'Pluto', dateRange: 'Oct 23 - Nov 21' },
  sagittarius: { icon: '♐', color: '#FF6B6B', element: 'Fire', planet: 'Jupiter', dateRange: 'Nov 22 - Dec 21' },
  capricorn: { icon: '♑', color: '#48BB78', element: 'Earth', planet: 'Saturn', dateRange: 'Dec 22 - Jan 19' },
  aquarius: { icon: '♒', color: '#818CF8', element: 'Air', planet: 'Uranus', dateRange: 'Jan 20 - Feb 18' },
  pisces: { icon: '♓', color: '#63B3ED', element: 'Water', planet: 'Neptune', dateRange: 'Feb 19 - Mar 20' },
};

// Rating circle component
const RatingCircle = ({ rating, size = 80 }: { rating: number; size?: number }) => {
  const circumference = 2 * Math.PI * 35;
  const progress = (rating / 10) * circumference;
  const getColor = (r: number) => {
    if (r >= 8) return '#48BB78';
    if (r >= 6) return '#63B3ED';
    if (r >= 4) return '#F59E0B';
    return '#EF4444';
  };
  const color = getColor(rating);
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" className="transform -rotate-90">
        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3"/>
        <circle 
          cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light" style={{ color }}>{rating}</span>
        <span className="text-[9px] text-white/30 uppercase tracking-wider">/10</span>
      </div>
    </div>
  );
};

interface HoroscopeDetailClientProps {
  sign: string;
}

export default function HoroscopeDetailClient({ sign }: HoroscopeDetailClientProps) {
  const signLower = sign.toLowerCase();
  const signCapitalized = signLower.charAt(0).toUpperCase() + signLower.slice(1);
  const zodiacData = ZODIAC_DATA[signLower] || ZODIAC_DATA.aries;

  const [dailyHoroscope, setDailyHoroscope] = useState<HoroscopeResponse | null>(null);
  const [weeklyHoroscope, setWeeklyHoroscope] = useState<HoroscopeResponse | null>(null);
  const [monthlyHoroscope, setMonthlyHoroscope] = useState<HoroscopeResponse | null>(null);
  const [yearlyHoroscope, setYearlyHoroscope] = useState<HoroscopeResponse | null>(null);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllHoroscopes();
    loadReaders();
  }, [sign]);

  const loadAllHoroscopes = async () => {
    setLoading(true);
    
    // Load daily first (primary)
    const daily = await fetchDailyHoroscope(signCapitalized, 'warm');
    setDailyHoroscope(daily);

    // Load others in parallel
    const [weekly, monthly, yearly] = await Promise.all([
      fetchWeeklyHoroscope(signCapitalized, 'warm'),
      fetchMonthlyHoroscope(signCapitalized, 'warm'),
      fetchYearlyHoroscope(signCapitalized, 'warm'),
    ]);

    setWeeklyHoroscope(weekly);
    setMonthlyHoroscope(monthly);
    setYearlyHoroscope(yearly);
    
    setLoading(false);
  };

  const loadReaders = async () => {
    const readersList = await fetchReaders();
    const uniqueReadersMap = new Map();
    readersList.forEach(reader => {
      if (reader.readerId && !uniqueReadersMap.has(reader.readerId)) {
        uniqueReadersMap.set(reader.readerId, reader);
      }
    });
    const uniqueReaders = Array.from(uniqueReadersMap.values());
    const shuffled = [...uniqueReaders].sort(() => 0.5 - Math.random());
    setReaders(shuffled.slice(0, 5));
  };

  const getCurrentHoroscope = () => {
    switch (activeTab) {
      case 'daily': return dailyHoroscope;
      case 'weekly': return weeklyHoroscope;
      case 'monthly': return monthlyHoroscope;
      case 'yearly': return yearlyHoroscope;
      default: return dailyHoroscope;
    }
  };

  if (loading || !dailyHoroscope) {
    return (
      <main className="min-h-screen bg-[#0F172A]">
        {/* Header Skeleton */}
        <section className="px-6 py-8 max-w-6xl mx-auto border-b border-white/[0.05]">
          <div className="h-4 w-24 bg-white/5 rounded mb-8 animate-pulse"></div>
          
          {/* Sign Hero Skeleton */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-full bg-white/5 mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 w-48 bg-white/5 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 w-32 bg-white/5 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-white/5 rounded animate-pulse"></div>
            ))}
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="px-6 py-12 max-w-6xl mx-auto space-y-8">
          {/* Overview Card Skeleton */}
          <div className="card-minimal p-8 md:p-10 rounded-none animate-pulse">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="h-4 w-32 bg-white/5 rounded mb-2"></div>
                <div className="h-8 w-48 bg-white/5 rounded mb-3"></div>
              </div>
              <div className="w-20 h-20 rounded-full bg-white/5"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-5/6"></div>
            </div>
            <div className="pt-6 border-t border-white/[0.05] mt-6 space-y-3">
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-full"></div>
              <div className="h-4 bg-white/5 rounded w-4/5"></div>
            </div>
          </div>

          {/* Life Areas Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card-minimal p-6 rounded-none animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/5"></div>
                  <div className="h-6 w-24 bg-white/5 rounded"></div>
                  <div className="ml-auto h-4 w-12 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-full"></div>
                  <div className="h-3 bg-white/5 rounded w-full"></div>
                  <div className="h-3 bg-white/5 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Items Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="card-minimal p-6 rounded-none animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-white/5 rounded"></div>
                  <div className="h-5 w-24 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-white/5 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Timing & Luck Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="card-minimal p-6 rounded-none animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-white/5 rounded"></div>
                  <div className="h-5 w-32 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-4 bg-white/5 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Lucky Elements Skeleton */}
          <div className="card-minimal p-6 rounded-none animate-pulse">
            <div className="h-5 w-32 bg-white/5 rounded mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-white/5 rounded mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-8 w-12 bg-white/5 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Mantra Skeleton */}
          <div className="card-minimal p-8 rounded-none animate-pulse text-center">
            <div className="w-6 h-6 bg-white/5 rounded mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-white/5 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const currentHoroscope = getCurrentHoroscope();

  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <section className="px-6 py-8 max-w-6xl mx-auto border-b border-white/[0.05]">
        <Link href="/horoscope" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Horoscopes
        </Link>

        {/* Sign Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 border-2" 
               style={{ backgroundColor: `${zodiacData.color}10`, borderColor: `${zodiacData.color}30` }}>
            <span className="text-6xl" style={{ color: zodiacData.color }}>{zodiacData.icon}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-4 leading-none">{signCapitalized}</h1>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="px-4 py-1.5 rounded-full text-xs font-light tracking-wide" 
                 style={{ backgroundColor: `${zodiacData.color}15`, color: zodiacData.color, border: `1px solid ${zodiacData.color}30` }}>
              {zodiacData.element}
            </div>
            <div className="px-4 py-1.5 rounded-full text-xs font-light text-white/60 bg-white/[0.05] border border-white/[0.08]">
              {zodiacData.planet}
            </div>
          </div>

          <div className="text-sm text-white/40 font-light">{zodiacData.dateRange}</div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { id: 'daily' as const, label: 'Today', icon: SunIcon },
            { id: 'weekly' as const, label: 'This Week', icon: CalendarIcon },
            { id: 'monthly' as const, label: 'This Month', icon: MoonIcon },
            { id: 'yearly' as const, label: 'Year Ahead', icon: GlobeIcon },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-xs mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#63B3ED] text-[#0F172A]'
                    : 'bg-white/[0.02] text-white/40 hover:text-white/60 border border-white/[0.05]'
                }`}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {currentHoroscope && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Overview Card */}
              <div className="card-minimal p-8 md:p-10 rounded-none">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                  <div className="text-center md:text-left">
                    <p className="mono text-[10px] text-white/30 tracking-[0.2em] uppercase mb-2">
                      {activeTab === 'daily' ? new Date().toLocaleDateString('en-US', { weekday: 'long' }) :
                       activeTab === 'weekly' ? 'This Week' :
                       activeTab === 'monthly' ? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                       new Date().getFullYear()}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light mb-3">Overview</h2>
                  </div>
                  {currentHoroscope.overall_rating && (
                    <RatingCircle rating={currentHoroscope.overall_rating} size={90} />
                  )}
                </div>
                
                <p className="text-base text-white/70 font-light leading-relaxed mb-6">
                  {currentHoroscope.overview}
                </p>

                {currentHoroscope.detailed_reading && (
                  <div className="pt-6 border-t border-white/[0.05]">
                    <p className="text-sm text-white/60 font-light leading-relaxed">
                      {currentHoroscope.detailed_reading}
                    </p>
                  </div>
                )}
              </div>

              {/* Life Areas Grid */}
              {(currentHoroscope.love || currentHoroscope.career || currentHoroscope.money || currentHoroscope.health || currentHoroscope.spirituality) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {currentHoroscope.love && (
                    <div className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/20">
                          <div style={{ color: '#FF6B6B' }}>
                            <HeartIcon size={18} />
                          </div>
                        </div>
                        <h3 className="text-xl font-light">Love</h3>
                        {currentHoroscope.area_ratings?.love && (
                          <span className="ml-auto text-sm text-white/40">{currentHoroscope.area_ratings.love}/10</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{currentHoroscope.love}</p>
                    </div>
                  )}

                  {currentHoroscope.career && (
                    <div className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#63B3ED]/10 flex items-center justify-center border border-[#63B3ED]/20">
                          <div style={{ color: '#63B3ED' }}>
                            <BrainIcon size={18} />
                          </div>
                        </div>
                        <h3 className="text-xl font-light">Career</h3>
                        {currentHoroscope.area_ratings?.career && (
                          <span className="ml-auto text-sm text-white/40">{currentHoroscope.area_ratings.career}/10</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{currentHoroscope.career}</p>
                    </div>
                  )}

                  {currentHoroscope.money && (
                    <div className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#48BB78]/10 flex items-center justify-center border border-[#48BB78]/20">
                          <div style={{ color: '#48BB78' }}>
                            <TrendingIcon size={18} />
                          </div>
                        </div>
                        <h3 className="text-xl font-light">Money</h3>
                        {currentHoroscope.area_ratings?.money && (
                          <span className="ml-auto text-sm text-white/40">{currentHoroscope.area_ratings.money}/10</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{currentHoroscope.money}</p>
                    </div>
                  )}

                  {currentHoroscope.health && (
                    <div className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                          <div style={{ color: '#F59E0B' }}>
                            <SparklesIcon size={18} />
                          </div>
                        </div>
                        <h3 className="text-xl font-light">Health</h3>
                        {currentHoroscope.area_ratings?.health && (
                          <span className="ml-auto text-sm text-white/40">{currentHoroscope.area_ratings.health}/10</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{currentHoroscope.health}</p>
                    </div>
                  )}

                  {currentHoroscope.spirituality && (
                    <div className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#818CF8]/10 flex items-center justify-center border border-[#818CF8]/20">
                          <div style={{ color: '#818CF8' }}>
                            <CompassIcon size={18} />
                          </div>
                        </div>
                        <h3 className="text-xl font-light">Spirituality</h3>
                        {currentHoroscope.area_ratings?.spirituality && (
                          <span className="ml-auto text-sm text-white/40">{currentHoroscope.area_ratings.spirituality}/10</span>
                        )}
                      </div>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{currentHoroscope.spirituality}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Items */}
              {(currentHoroscope.do_this || currentHoroscope.avoid_this) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {currentHoroscope.do_this && currentHoroscope.do_this.length > 0 && (
                    <div className="card-minimal p-6 rounded-none border-[#48BB78]/20 bg-[#48BB78]/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div style={{ color: '#48BB78' }}>
                          <TargetIcon size={18} />
                        </div>
                        <h3 className="text-lg font-light">Do This</h3>
                      </div>
                      <ul className="space-y-2">
                        {currentHoroscope.do_this.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70 font-light">
                            <span className="text-[#48BB78] mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentHoroscope.avoid_this && currentHoroscope.avoid_this.length > 0 && (
                    <div className="card-minimal p-6 rounded-none border-[#EF4444]/20 bg-[#EF4444]/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div style={{ color: '#EF4444' }}>
                          <InfoIcon size={18} />
                        </div>
                        <h3 className="text-lg font-light">Avoid This</h3>
                      </div>
                      <ul className="space-y-2">
                        {currentHoroscope.avoid_this.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70 font-light">
                            <span className="text-[#EF4444] mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Timing & Luck */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Power Periods */}
                {currentHoroscope.power_periods && currentHoroscope.power_periods.length > 0 && (
                  <div className="card-minimal p-6 rounded-none">
                    <div className="flex items-center gap-2 mb-4">
                      <div style={{ color: '#63B3ED' }}>
                        <ClockIcon size={18} />
                      </div>
                      <h3 className="text-lg font-light">Power Periods</h3>
                    </div>
                    <ul className="space-y-2">
                      {currentHoroscope.power_periods.map((period, i) => (
                        <li key={i} className="text-sm text-white/60 font-light flex items-start gap-2">
                          <span className="text-[#63B3ED] mt-1">•</span>
                          <span>{period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Caution Periods */}
                {currentHoroscope.caution_periods && currentHoroscope.caution_periods.length > 0 && (
                  <div className="card-minimal p-6 rounded-none border-[#F59E0B]/20 bg-[#F59E0B]/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div style={{ color: '#F59E0B' }}>
                        <InfoIcon size={18} />
                      </div>
                      <h3 className="text-lg font-light">Caution Periods</h3>
                    </div>
                    <ul className="space-y-2">
                      {currentHoroscope.caution_periods.map((period, i) => (
                        <li key={i} className="text-sm text-white/60 font-light flex items-start gap-2">
                          <span className="text-[#F59E0B] mt-1">•</span>
                          <span>{period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Lucky Elements */}
              {(currentHoroscope.lucky_numbers || currentHoroscope.lucky_colors || currentHoroscope.lucky_days || currentHoroscope.lucky_direction) && (
                <div className="card-minimal p-6 rounded-none">
                  <h3 className="text-lg font-light mb-4 flex items-center gap-2">
                    <div style={{ color: '#818CF8' }}>
                      <SparklesIcon size={18} />
                    </div>
                    Lucky Elements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentHoroscope.lucky_numbers && currentHoroscope.lucky_numbers.length > 0 && (
                      <div>
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Numbers</p>
                        <div className="flex flex-wrap gap-2">
                          {currentHoroscope.lucky_numbers.map((num, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light">
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentHoroscope.lucky_colors && currentHoroscope.lucky_colors.length > 0 && (
                      <div>
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Colors</p>
                        <div className="flex flex-wrap gap-2">
                          {currentHoroscope.lucky_colors.map((color, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentHoroscope.lucky_days && currentHoroscope.lucky_days.length > 0 && (
                      <div>
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Days</p>
                        <div className="flex flex-wrap gap-2">
                          {currentHoroscope.lucky_days.map((day, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentHoroscope.lucky_direction && (
                      <div>
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Direction</p>
                        <span className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light inline-block">
                          {currentHoroscope.lucky_direction}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Daily Mantra */}
              {currentHoroscope.daily_mantra && (
                <div className="card-minimal p-8 rounded-none text-center border-[#818CF8]/20 bg-[#818CF8]/5">
                  <div className="mx-auto mb-4" style={{ color: '#818CF8' }}>
                    <SparklesIcon size={24} />
                  </div>
                  <p className="text-lg text-white/80 font-light italic leading-relaxed">
                    "{currentHoroscope.daily_mantra}"
                  </p>
                </div>
              )}

              {/* Key Dates */}
              {currentHoroscope.key_dates && Object.keys(currentHoroscope.key_dates).length > 0 && (
                <div className="card-minimal p-6 rounded-none">
                  <h3 className="text-lg font-light mb-4 flex items-center gap-2">
                    <div style={{ color: '#63B3ED' }}>
                      <CalendarIcon size={18} />
                    </div>
                    Key Dates
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(currentHoroscope.key_dates).map(([date, description], i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/[0.05] last:border-0">
                        <span className="text-sm text-white/40 font-light min-w-[120px]">{date}</span>
                        <span className="text-sm text-white/60 font-light flex-1">{description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility & Challenges */}
              {(currentHoroscope.compatible_signs || currentHoroscope.challenging_signs) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {currentHoroscope.compatible_signs && currentHoroscope.compatible_signs.length > 0 && (
                    <div className="card-minimal p-6 rounded-none border-[#48BB78]/20 bg-[#48BB78]/5">
                      <h3 className="text-lg font-light mb-4">Compatible Signs</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentHoroscope.compatible_signs.map((sign, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light">
                            {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentHoroscope.challenging_signs && currentHoroscope.challenging_signs.length > 0 && (
                    <div className="card-minimal p-6 rounded-none border-[#F59E0B]/20 bg-[#F59E0B]/5">
                      <h3 className="text-lg font-light mb-4">Challenging Signs</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentHoroscope.challenging_signs.map((sign, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] text-sm font-light">
                            {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Astronomical Summary */}
              {currentHoroscope.astronomical_summary && (
                <div className="card-minimal p-6 rounded-none">
                  <h3 className="text-lg font-light mb-4 flex items-center gap-2">
                    <div style={{ color: '#63B3ED' }}>
                      <GlobeIcon size={18} />
                    </div>
                    Astronomical Summary
                  </h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed">
                    {currentHoroscope.astronomical_summary}
                  </p>
                </div>
              )}

              {/* Active Transits */}
              {currentHoroscope.active_transits && currentHoroscope.active_transits.length > 0 && (
                <div className="card-minimal p-6 rounded-none">
                  <h3 className="text-lg font-light mb-4 flex items-center gap-2">
                    <div style={{ color: '#63B3ED' }}>
                      <CompassIcon size={18} />
                    </div>
                    Active Transits
                  </h3>
                  <ul className="space-y-2">
                    {currentHoroscope.active_transits.map((transit, i) => (
                      <li key={i} className="text-sm text-white/60 font-light flex items-start gap-2">
                        <span className="text-[#63B3ED] mt-1">•</span>
                        <span>{transit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA - Expert Consultation */}
              <Link href="/readers" className="block">
                <div className="card-minimal p-6 rounded-none hover:bg-white/[0.02] transition-all group cursor-pointer border-[#63B3ED]/20 bg-[#63B3ED]/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#63B3ED]/15 border border-[#63B3ED]/25">
                      <svg className="w-6 h-6 text-[#63B3ED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-light text-white mb-1">Want Deeper Insights?</h3>
                      <p className="text-sm text-white/60 font-light">Connect with expert astrologers now</p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#63B3ED]/15 border border-[#63B3ED]/20 group-hover:scale-110 transition-transform">
                      <ArrowRightIcon size={18} className="text-[#63B3ED]" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Readers Section */}
              {readers.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-light">Expert Astrologers</h2>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-light bg-[#48BB78]/15 border border-[#48BB78]/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78]"></span>
                      <span className="text-[#48BB78]">{readers.filter(r => r.isAvailable).length} Online</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {readers.map((reader) => (
                      <Link key={reader.readerId} href={`/readers/${reader.readerId}`}>
                        <div className="card-minimal p-4 rounded-none hover:bg-white/[0.02] transition-all group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <img 
                              src={reader.profileImageUrl || 'https://via.placeholder.com/50'} 
                              alt={reader.displayName}
                              className="w-11 h-11 rounded-full bg-[#63B3ED]/20 object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-light text-white truncate">{reader.displayName}</h3>
                              <div className="flex items-center gap-2 text-xs">
                                <StarIcon size={11} className="text-[#F59E0B]" filled />
                                <span className="text-[#F59E0B] font-light">{reader.averageRating?.toFixed(1) || 'New'}</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/50">{reader.yearsOfExperience}+ yrs</span>
                              </div>
                            </div>
                            {reader.isAvailable && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-light bg-[#48BB78]/15 border border-[#48BB78]/25">
                                <span className="w-1 h-1 rounded-full bg-[#48BB78]"></span>
                                <span className="text-[#48BB78]">LIVE</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

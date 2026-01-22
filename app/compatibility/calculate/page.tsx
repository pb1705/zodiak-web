'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HeartIcon, UsersIcon, CalendarIcon, ClockIcon, SparklesIcon, WorkIcon, ChemistryIcon, FamilyIcon, StarIcon } from '@/components/icons';
import LocationInput from '@/components/LocationInput';
import { fetchCompatibility, CompatibilityData, CompatibilityResponse, GeocodeResult } from '@/lib/api';

const COMPATIBILITY_TYPES = {
  love: { 
    label: 'Love & Romance', 
    icon: HeartIcon,
    color: '#FF6B6B',
    description: 'Romantic connection'
  },
  friendship: { 
    label: 'Friendship', 
    icon: UsersIcon,
    color: '#48BB78',
    description: 'Social compatibility'
  },
  work: { 
    label: 'Work & Business', 
    icon: WorkIcon,
    color: '#63B3ED',
    description: 'Professional synergy'
  },
  sexual: { 
    label: 'Sexual Chemistry', 
    icon: ChemistryIcon,
    color: '#F59E0B',
    description: 'Physical attraction'
  },
  family: { 
    label: 'Family', 
    icon: FamilyIcon,
    color: '#818CF8',
    description: 'Family harmony'
  },
};

// Spinner
const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

export default function CompatibilityCalculatePage() {
  const [compatibilityType, setCompatibilityType] = useState<string>('love');
  const [person1, setPerson1] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
  });
  const [person2, setPerson2] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
  });
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationChange1 = useCallback((location: string, geocode?: GeocodeResult) => {
    if (geocode) {
      setPerson1(prev => ({
        ...prev,
        location,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
      }));
    } else {
      setPerson1(prev => ({ ...prev, location, latitude: 0, longitude: 0 }));
    }
  }, []);

  const handleLocationChange2 = useCallback((location: string, geocode?: GeocodeResult) => {
    if (geocode) {
      setPerson2(prev => ({
        ...prev,
        location,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
      }));
    } else {
      setPerson2(prev => ({ ...prev, location, latitude: 0, longitude: 0 }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!person1.date || !person1.time || !person2.date || !person2.time) {
      setError('Please enter birth dates and times for both people');
      return;
    }
    
    if (person1.latitude === 0 || person1.longitude === 0 || person2.latitude === 0 || person2.longitude === 0) {
      setError('Please select locations from the suggestions for both people');
      return;
    }
    
    setLoading(true);

    try {
      const person1Data: CompatibilityData = {
        name: person1.name || 'Person 1',
        date: person1.date,
        time: person1.time,
        latitude: person1.latitude,
        longitude: person1.longitude,
        timezone: person1.timezone,
      };

      const person2Data: CompatibilityData = {
        name: person2.name || 'Person 2',
        date: person2.date,
        time: person2.time,
        latitude: person2.latitude,
        longitude: person2.longitude,
        timezone: person2.timezone,
      };

      const compatibilityResult = await fetchCompatibility(compatibilityType, person1Data, person2Data);
      
      if (!compatibilityResult) {
        throw new Error('Failed to calculate compatibility');
      }

      setResult(compatibilityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentType = COMPATIBILITY_TYPES[compatibilityType as keyof typeof COMPATIBILITY_TYPES] || COMPATIBILITY_TYPES.love;
  const CurrentIcon = currentType.icon;

  return (
    <main className="min-h-screen bg-[#0F172A]">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {/* Back Link */}
            <section className="px-6 pt-12 pb-8 max-w-5xl mx-auto">
              <Link href="/compatibility" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Compatibility
              </Link>

              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
                  <CurrentIcon size={20} style={{ color: currentType.color }} />
                  <span className="mono text-[10px] text-white/40 tracking-[0.3em]">COMPATIBILITY CALCULATOR</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                  Discover Your<br />Cosmic Connection
                </h1>
                
                <p className="text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                  Enter both birth details to analyze your relationship compatibility
                </p>
              </motion.div>
            </section>

            {/* Form Section */}
            <section className="px-6 pb-24 max-w-5xl mx-auto">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card-minimal p-4 rounded-none border-[#FF6B6B]/30 bg-[#FF6B6B]/5"
                  >
                    <p className="text-[#FF6B6B] text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Type Selector */}
                <div className="card-minimal p-8 rounded-none">
                  <label className="block text-sm font-light text-white/70 mb-4 tracking-wide text-center">
                    SELECT COMPATIBILITY TYPE
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(COMPATIBILITY_TYPES).map(([key, type]) => {
                      const Icon = type.icon;
                      const isActive = compatibilityType === key;
                      
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCompatibilityType(key)}
                          className={`p-6 rounded-none border transition-all duration-500 group ${
                            isActive ? 'border-current shadow-lg' : 'border-white/[0.08] hover:border-white/[0.15]'
                          }`}
                          style={isActive ? { borderColor: type.color } : {}}
                        >
                          <Icon size={24} className="mx-auto mb-2" style={{ color: isActive ? type.color : 'rgba(255,255,255,0.4)' }} />
                          <div className="text-xs font-light text-center" style={{ color: isActive ? type.color : 'rgba(255,255,255,0.6)' }}>
                            {type.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Person 1 Form */}
                <div className="card-minimal p-10 rounded-none">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/20">
                      <UsersIcon size={20} style={{ color: '#FF6B6B' }} />
                    </div>
                    <h2 className="text-2xl font-light">Person 1</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs text-white/50 mb-2 tracking-wide">NAME (OPTIONAL)</label>
                      <input
                        type="text"
                        value={person1.name}
                        onChange={(e) => setPerson1(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter name (optional)"
                        className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 placeholder:font-light placeholder:tracking-wide focus:border-[#FF6B6B] focus:bg-white/[0.04] focus:placeholder-white/30 transition-all duration-500 outline-none font-light"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <CalendarIcon size={14} />
                          DATE OF BIRTH
                        </label>
                        <input
                          type="date"
                          value={person1.date}
                          onChange={(e) => setPerson1(prev => ({ ...prev, date: e.target.value }))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white focus:border-[#FF6B6B] focus:bg-white/[0.04] transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <ClockIcon size={14} />
                          TIME OF BIRTH
                        </label>
                        <input
                          type="time"
                          value={person1.time}
                          onChange={(e) => setPerson1(prev => ({ ...prev, time: e.target.value }))}
                          max={person1.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white focus:border-[#FF6B6B] focus:bg-white/[0.04] transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Input */}
                    <div className="relative">
                      <LocationInput
                        value={person1.location}
                        onChange={handleLocationChange1}
                        color="#FF6B6B"
                      />
                    </div>
                    
                    {person1.latitude !== 0 && (
                      <p className="text-[10px] text-white/20 flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#48BB78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Location confirmed: {person1.latitude.toFixed(4)}°, {person1.longitude.toFixed(4)}°
                      </p>
                    )}
                  </div>
                </div>

                {/* Person 2 Form */}
                <div className="card-minimal p-10 rounded-none">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-[#63B3ED]/10 flex items-center justify-center border border-[#63B3ED]/20">
                      <UsersIcon size={20} style={{ color: '#63B3ED' }} />
                    </div>
                    <h2 className="text-2xl font-light">Person 2</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs text-white/50 mb-2 tracking-wide">NAME (OPTIONAL)</label>
                      <input
                        type="text"
                        value={person2.name}
                        onChange={(e) => setPerson2(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter name (optional)"
                        className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 placeholder:font-light placeholder:tracking-wide focus:border-[#63B3ED] focus:bg-white/[0.04] focus:placeholder-white/30 transition-all duration-500 outline-none font-light"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <CalendarIcon size={14} />
                          DATE OF BIRTH
                        </label>
                        <input
                          type="date"
                          value={person2.date}
                          onChange={(e) => setPerson2(prev => ({ ...prev, date: e.target.value }))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white focus:border-[#63B3ED] focus:bg-white/[0.04] transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <ClockIcon size={14} />
                          TIME OF BIRTH
                        </label>
                        <input
                          type="time"
                          value={person2.time}
                          onChange={(e) => setPerson2(prev => ({ ...prev, time: e.target.value }))}
                          max={person2.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none text-white focus:border-[#63B3ED] focus:bg-white/[0.04] transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Input */}
                    <div className="relative">
                      <LocationInput
                        value={person2.location}
                        onChange={handleLocationChange2}
                        color="#63B3ED"
                      />
                    </div>
                    
                    {person2.latitude !== 0 && (
                      <p className="text-[10px] text-white/20 flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#48BB78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Location confirmed: {person2.latitude.toFixed(4)}°, {person2.longitude.toFixed(4)}°
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-minimal p-8 rounded-none relative" style={{ zIndex: 1 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-12 py-5 text-sm tracking-widest uppercase
                             flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                             group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{ backgroundColor: '#63B3ED', color: 'white' }}
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        <span>CALCULATING COMPATIBILITY...</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>CALCULATE COMPATIBILITY</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: HeartIcon, color: '#FF6B6B', title: 'Synastry Analysis', text: 'Planetary aspects between both charts' },
                  { icon: StarIcon, color: '#818CF8', title: 'Guna Milan', text: 'Traditional Vedic 36-point matching' },
                  { icon: SparklesIcon, color: '#63B3ED', title: 'Relationship Insights', text: 'Strengths, challenges, and guidance' }
                ].map((item, i) => {
                  const InfoIcon = item.icon;
                  return (
                    <div key={i} className="card-minimal p-6 rounded-none text-center">
                      <div className="mb-4">
                        <InfoIcon size={32} className="mx-auto" style={{ color: item.color }} />
                      </div>
                      <h3 className="text-lg font-light mb-2">{item.title}</h3>
                      <p className="text-sm text-white/40 font-light leading-relaxed">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-12 max-w-4xl mx-auto"
          >
            {/* Result Display */}
            <div className="card-minimal p-8 rounded-none text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <CurrentIcon size={48} style={{ color: currentType.color }} />
                <div>
                  <h1 className="text-4xl font-light mb-2">{result.overall_score}/100</h1>
                  <p className="text-lg text-white/60 font-light">{result.rating}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={24}
                    className={star <= Math.round(result.overall_score / 20) ? 'text-[#F59E0B]' : 'text-white/20'}
                    filled={star <= Math.round(result.overall_score / 20)}
                  />
                ))}
              </div>

              <button
                onClick={() => setResult(null)}
                className="px-6 py-2 rounded-none border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-all"
              >
                Check Another Match
              </button>
            </div>

            {/* Guna Milan */}
            {result.guna_milan && (
              <div className="card-minimal p-8 rounded-none mb-8">
                <h3 className="text-xl font-light mb-4">Vedic Guna Milan</h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl font-light">{result.guna_milan.total_points}</div>
                  <div className="text-white/40">out of</div>
                  <div className="text-2xl text-white/40">{result.guna_milan.max_points}</div>
                  <div className="text-2xl" style={{ color: currentType.color }}>
                    ({result.guna_milan.percentage.toFixed(1)}%)
                  </div>
                </div>
                <p className="text-white/60 text-center">{result.guna_milan.recommendation}</p>
              </div>
            )}

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                  <span style={{ color: '#48BB78' }}>✓</span> Strengths
                </h3>
                <div className="space-y-3">
                  {result.strengths.map((strength, index) => (
                    <div key={index} className="card-minimal p-4 rounded-none flex items-start gap-3">
                      <span style={{ color: '#48BB78' }}>✓</span>
                      <p className="text-white/70 flex-1">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {result.challenges && result.challenges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                  <span style={{ color: '#F59E0B' }}>!</span> Areas to Navigate
                </h3>
                <div className="space-y-3">
                  {result.challenges.map((challenge, index) => (
                    <div key={index} className="card-minimal p-4 rounded-none flex items-start gap-3">
                      <span style={{ color: '#F59E0B' }}>!</span>
                      <p className="text-white/70 flex-1">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advice */}
            {result.advice && result.advice.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                  <SparklesIcon size={20} style={{ color: '#818CF8' }} /> Guidance
                </h3>
                <div className="space-y-3">
                  {result.advice.map((item, index) => (
                    <div key={index} className="card-minimal p-4 rounded-none flex items-start gap-3">
                      <SparklesIcon size={16} style={{ color: '#818CF8' }} />
                      <p className="text-white/70 flex-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

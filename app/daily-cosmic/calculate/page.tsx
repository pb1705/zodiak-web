'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  MoonIcon, SunIcon, SparklesIcon, CalendarIcon, ClockIcon, 
  StarIcon, CheckCircleIcon, ChartIcon, BookIcon, CompassIcon
} from '@/components/icons';
import LocationInput from '@/components/LocationInput';
import { GeocodeResult } from '@/lib/api';

// Types for the new API response
interface TimingWindow {
  color: string;
  label: string;
  description: string;
  best_for: string[];
  avoid: string[];
}

interface TimingGuidance {
  overall_quality: TimingWindow;
  morning_window: TimingWindow;
  afternoon_window: TimingWindow;
  evening_window: TimingWindow;
  specific_favorable_hours: string[];
  specific_caution_hours: string[];
}

interface TraditionalContext {
  tithi: string;
  nakshatra: string;
  yoga: string;
  rahu_kaal: string;
}

interface CosmicReport {
  date: string;
  daily_focus: string;
  energy_quality: string;
  rating: number;
  what_works_today: string[];
  what_needs_care: string[];
  timing_guidance: TimingGuidance;
  moon_influence: string;
  how_you_might_feel: string;
  morning_focus: string;
  evening_reflection: string;
  key_transit_summary: string;
  traditional_context: TraditionalContext;
  generated_at: string;
  personalization_level: string;
}

// Rating colors - using app palette
const getRatingColor = (rating: number): string => {
  if (rating >= 8) return '#48BB78'; // Growth Green
  if (rating >= 6) return '#63B3ED'; // Trust Blue
  if (rating >= 4) return '#F59E0B'; // Energy Amber
  return '#EF4444'; // Red for low
};

// Timing window color mapping - using app palette
const getWindowColor = (color: string): { bg: string; border: string; text: string } => {
  switch (color) {
    case 'green': return { bg: 'bg-[#48BB78]/10', border: 'border-[#48BB78]/20', text: 'text-[#48BB78]' };
    case 'amber': return { bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20', text: 'text-[#F59E0B]' };
    case 'red': return { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20', text: 'text-[#EF4444]' };
    default: return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/60' };
  }
};

// Spinner
const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

// Circular Rating
const RatingCircle = ({ rating, size = 80 }: { rating: number; size?: number }) => {
  const circumference = 2 * Math.PI * 35;
  const progress = (rating / 10) * circumference;
  const color = getRatingColor(rating);
  
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

// Expandable Section
const ExpandableSection = ({ 
  title, 
  children, 
  icon: Icon,
  defaultOpen = false
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-white/[0.05] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-white/30" />}
          <span className="text-xs text-white/50 tracking-wide uppercase">{title}</span>
        </div>
        <motion.svg 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-white/20"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 border-t border-white/[0.03]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Timing Window Card
const TimingWindowCard = ({ 
  title, 
  window, 
  icon: Icon 
}: { 
  title: string; 
  window: TimingWindow;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) => {
  const colors = getWindowColor(window.color);
  
  return (
    <div className={`p-5 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={colors.text} />
        <span className="text-[10px] uppercase tracking-wider text-white/40">{title}</span>
        <span className={`ml-auto text-xs px-2 py-0.5 ${colors.bg} ${colors.text} border ${colors.border}`}>
          {window.label}
        </span>
      </div>
      <p className="text-sm text-white/60 font-light mb-3">{window.description}</p>
      
      {window.best_for.length > 0 && (
        <div className="mb-2">
          <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Best for</p>
          <div className="flex flex-wrap gap-1">
            {window.best_for.map((item, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/50">{item}</span>
            ))}
          </div>
        </div>
      )}
      
      {window.avoid.length > 0 && (
        <div>
          <p className="text-[9px] text-[#EF4444]/60 uppercase tracking-wider mb-1">Avoid</p>
          <div className="flex flex-wrap gap-1">
            {window.avoid.map((item, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444]/70">{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DailyCosmicCalculate() {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
  });

  const [report, setReport] = useState<CosmicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationChange = useCallback((location: string, geocode?: GeocodeResult) => {
    if (geocode) {
      setBirthData(prev => ({
        ...prev,
        location,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
      }));
    } else {
      setBirthData(prev => ({ ...prev, location, latitude: 0, longitude: 0 }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!birthData.date || !birthData.time) {
      setError('Please enter your birth date and time');
      return;
    }
    
    if (birthData.latitude === 0 || birthData.longitude === 0) {
      setError('Please select a location from the suggestions');
      return;
    }
    
    setLoading(true);

    try {
      const datetime = `${birthData.date}T${birthData.time}:00Z`;

      const response = await fetch('https://prediction-service-latest-o30p.onrender.com/api/v2/api/v2/integrated-cosmic/daily-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_data: {
            datetime,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            timezone: birthData.timezone,
          },
          preferences: {
            zodiac_system: 'sidereal',
            ayanamsa_type: 'lahiri',
            include_system_comparison: false,
            language: 'en',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cosmic report');
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A]">
      <AnimatePresence mode="wait">
        {!report ? (
          /* ===== FORM VIEW ===== */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {/* Back Link */}
            <section className="px-6 pt-12 pb-8 max-w-5xl mx-auto">
              <Link href="/daily-cosmic" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Daily Cosmic
              </Link>

              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
                  <SparklesIcon size={20} className="text-[#818CF8]" />
                  <span className="mono text-[10px] text-white/40 tracking-[0.3em]">DAILY COSMIC REPORT</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                  Your Personalized<br />Daily Guidance
                </h1>
                
                <p className="text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                  Comprehensive cosmic insights for navigating your day with clarity and intention
                </p>
              </motion.div>
            </section>

            {/* Form Section */}
            <section className="px-6 pb-24 max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
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
                    className="card-minimal p-4 rounded-none border-[#EF4444]/30 bg-[#EF4444]/5"
                  >
                    <p className="text-[#EF4444] text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Main Form Card */}
                <div className="card-minimal p-10 rounded-none">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-[#818CF8]/10 flex items-center justify-center border border-[#818CF8]/20">
                      <div style={{ color: '#818CF8' }}>
                        <StarIcon size={20} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-light">Your Birth Details</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Date Input */}
                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <CalendarIcon size={14} />
                          DATE OF BIRTH
                        </label>
                        <input
                          type="date"
                          value={birthData.date}
                          onChange={(e) => setBirthData(prev => ({ ...prev, date: e.target.value }))}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none
                                   text-white focus:border-[#818CF8] focus:bg-white/[0.04]
                                   transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>

                      {/* Time Input */}
                      <div>
                        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                          <ClockIcon size={14} />
                          TIME OF BIRTH
                        </label>
                        <input
                          type="time"
                          value={birthData.time}
                          onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
                          max={birthData.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none
                                   text-white focus:border-[#818CF8] focus:bg-white/[0.04]
                                   transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-white/30 -mt-2">The more accurate your birth time, the more precise your daily guidance</p>

                    {/* Location Input */}
                    <div className="relative">
                      <LocationInput
                        value={birthData.location}
                        onChange={handleLocationChange}
                        color="#818CF8"
                      />
                    </div>
                    
                    {birthData.latitude !== 0 && (
                      <p className="text-[10px] text-white/20 flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#48BB78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Location confirmed: {birthData.latitude.toFixed(4)}°, {birthData.longitude.toFixed(4)}°
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
                        <span>GENERATING REPORT...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>GET TODAY'S GUIDANCE</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: SparklesIcon, color: '#818CF8', title: 'Personalized Report', text: 'Daily focus and energy quality tailored to your chart' },
                  { icon: ClockIcon, color: '#F59E0B', title: 'Optimal Timing', text: 'Best time windows for important activities' },
                  { icon: MoonIcon, color: '#63B3ED', title: 'Moon Guidance', text: 'Lunar influence and emotional climate' }
                ].map((item, i) => {
                  const InfoIcon = item.icon;
                  return (
                    <div key={i} className="card-minimal p-6 rounded-none text-center">
                      <div className="mb-4">
                        <div className="mx-auto" style={{ color: item.color }}>
                          <InfoIcon size={32} />
                        </div>
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
          /* ===== REPORT VIEW ===== */
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-12 max-w-4xl mx-auto"
          >
            {/* 1. Header / Overview Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/[0.02] border border-white/[0.05] mb-6"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                    {new Date(report.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-light mb-2">
                    {new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
                    <SparklesIcon size={12} className="text-white/40" />
                    <span className="text-sm text-white/60">{report.energy_quality}</span>
                  </div>
                </div>
                <RatingCircle rating={report.rating} size={90} />
              </div>
              
              {/* Daily Focus */}
              <div className="mt-6 pt-6 border-t border-white/[0.05]">
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Today's Focus</p>
                <p className="text-white/70 font-light leading-relaxed">{report.daily_focus}</p>
              </div>
            </motion.div>

            {/* 2. What Works / What Needs Care */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-2 gap-4 mb-6"
            >
              <div className="p-6 bg-[#48BB78]/5 border border-[#48BB78]/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleIcon size={16} className="text-[#48BB78]" />
                  <p className="text-[10px] text-[#48BB78]/80 uppercase tracking-wider">What Works Today</p>
                </div>
                <ul className="space-y-2">
                  {report.what_works_today.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#48BB78]/60 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-[#F59E0B]/5 border border-[#F59E0B]/20">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[10px] text-[#F59E0B]/80 uppercase tracking-wider">What Needs Care</p>
                </div>
                <ul className="space-y-2">
                  {report.what_needs_care.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#F59E0B]/60 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 3. Timing Guidance */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon size={16} className="text-white/30" />
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Day Flow</p>
              </div>
              
              {/* Overall Quality */}
              <div className={`p-5 mb-4 ${getWindowColor(report.timing_guidance.overall_quality.color).bg} border ${getWindowColor(report.timing_guidance.overall_quality.color).border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Overall Day</span>
                  <span className={`text-xs px-2 py-0.5 ${getWindowColor(report.timing_guidance.overall_quality.color).text}`}>
                    {report.timing_guidance.overall_quality.label}
                  </span>
                </div>
                <p className="text-sm text-white/70 font-light">{report.timing_guidance.overall_quality.description}</p>
              </div>
              
              {/* Time Windows */}
              <div className="grid md:grid-cols-3 gap-3">
                <TimingWindowCard 
                  title="Morning" 
                  window={report.timing_guidance.morning_window}
                  icon={SunIcon}
                />
                <TimingWindowCard 
                  title="Afternoon" 
                  window={report.timing_guidance.afternoon_window}
                  icon={SparklesIcon}
                />
                <TimingWindowCard 
                  title="Evening" 
                  window={report.timing_guidance.evening_window}
                  icon={MoonIcon}
                />
              </div>
              
              {/* Caution Hours */}
              {report.timing_guidance.specific_caution_hours.length > 0 && (
                <div className="mt-4 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20">
                  <p className="text-[9px] text-[#EF4444]/60 uppercase tracking-wider mb-2">Caution Periods</p>
                  {report.timing_guidance.specific_caution_hours.map((hour, i) => (
                    <p key={i} className="text-sm text-white/50">{hour}</p>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 5. Guided Anchors */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-4 mb-6"
            >
              <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-3">
                  <SunIcon size={16} className="text-[#F59E0B]" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Morning Focus</p>
                </div>
                <p className="text-sm text-white/60 font-light leading-relaxed">{report.morning_focus}</p>
              </div>
              
              <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-3">
                  <MoonIcon size={16} className="text-[#818CF8]" />
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Evening Reflection</p>
                </div>
                <p className="text-sm text-white/60 font-light leading-relaxed italic">{report.evening_reflection}</p>
              </div>
            </motion.div>

            {/* Expandable Sections */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 mb-8"
            >
              {/* 4. How You Might Feel */}
              <ExpandableSection title="How Today May Feel" icon={CompassIcon}>
                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Moon Influence</p>
                    <p className="text-sm text-white/60 font-light leading-relaxed">{report.moon_influence}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Emotional Climate</p>
                    <p className="text-sm text-white/60 font-light leading-relaxed">{report.how_you_might_feel}</p>
                  </div>
                </div>
              </ExpandableSection>

              {/* 6. Key Influence Summary */}
              <ExpandableSection title="Why Today Feels This Way" icon={ChartIcon}>
                <div className="pt-4">
                  <p className="text-sm text-white/60 font-light leading-relaxed">{report.key_transit_summary}</p>
                </div>
              </ExpandableSection>

              {/* 7. Traditional Context */}
              <ExpandableSection title="Traditional Context (Vedic)" icon={BookIcon}>
                <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Tithi</p>
                    <p className="text-sm text-white/60">{report.traditional_context.tithi}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Nakshatra</p>
                    <p className="text-sm text-white/60">{report.traditional_context.nakshatra}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Yoga</p>
                    <p className="text-sm text-white/60">{report.traditional_context.yoga}</p>
                  </div>
                  <div className="p-3 bg-[#EF4444]/5 border border-[#EF4444]/20">
                    <p className="text-[9px] text-[#EF4444]/60 uppercase tracking-wider mb-1">Rahu Kaal</p>
                    <p className="text-sm text-white/60">{report.traditional_context.rahu_kaal}</p>
                  </div>
                </div>
              </ExpandableSection>
            </motion.div>

            {/* New Report Button */}
            <div className="text-center">
              <button
                onClick={() => setReport(null)}
                className="text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                ← Enter different birth details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

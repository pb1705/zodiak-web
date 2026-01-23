'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  SunIcon, MoonIcon, CompassIcon, StarIcon, ArrowRightIcon, ChartIcon, SparklesIcon,
  CalendarIcon, ClockIcon, InfoIcon,
  MarsIcon, VenusIcon, MercuryIcon, JupiterIcon, SaturnIcon,
  AriesIcon, TaurusIcon, GeminiIcon, CancerIcon, LeoIcon, VirgoIcon,
  LibraIcon, ScorpioIcon, SagittariusIcon, CapricornIcon, AquariusIcon, PiscesIcon,
  FireIcon, EarthIcon, AirIcon, WaterIcon, TrineIcon, SquareIcon, OppositionIcon
} from '@/components/icons';
import LocationInput from '@/components/LocationInput';
import { 
  fetchNatalChart, 
  type NatalChartResponse, type GeocodeResult 
} from '@/lib/api';

// Zodiac sign icon mapping
const signIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Aries': AriesIcon, 'Taurus': TaurusIcon, 'Gemini': GeminiIcon, 'Cancer': CancerIcon,
  'Leo': LeoIcon, 'Virgo': VirgoIcon, 'Libra': LibraIcon, 'Scorpio': ScorpioIcon,
  'Sagittarius': SagittariusIcon, 'Capricorn': CapricornIcon, 'Aquarius': AquariusIcon, 'Pisces': PiscesIcon
};

// Planet colors - using app palette
const planetColors: Record<string, string> = {
  'Sun': '#F59E0B', 'Moon': '#94A3B8', 'Mercury': '#818CF8', 'Venus': '#EC4899',
  'Mars': '#EF4444', 'Jupiter': '#63B3ED', 'Saturn': '#6B7280', 'Rahu': '#1E293B', 'Ketu': '#475569'
};

// Element colors - using app palette
const elementColors: Record<string, string> = {
  'Fire': '#EF4444', 'Earth': '#48BB78', 'Air': '#63B3ED', 'Water': '#7DD3FC'
};

// Spinner
const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

interface FormData {
  date: string;
  time: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
}

export default function BirthChartClient() {
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    location: '',
    latitude: null,
    longitude: null,
    timezone: 'UTC'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<NatalChartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'overview' | 'personality' | 'angles' | 'houses' | 'planets' | 'planet-detail' | 'aspects' | 'special-points' | 'chart-emphasis' | 'technical'>('overview');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null);

  const handleLocationChange = useCallback((value: string, geocode?: GeocodeResult) => {
    if (geocode) {
      setFormData(prev => ({
        ...prev, location: value, latitude: geocode.latitude, longitude: geocode.longitude
      }));
    } else {
      setFormData(prev => ({ ...prev, location: value, latitude: null, longitude: null }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.date || !formData.time) {
      setError('Please enter your birth date and time');
      return;
    }
    
    if (!formData.latitude || !formData.longitude) {
      setError('Please select a location from the suggestions');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchNatalChart({
        birth_dt: `${formData.date}T${formData.time}:00`,
        house_system: 'PLACIDUS',
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone || 'UTC'
      });

      if (response) {
        setChartData(response);
      } else {
        setError('Unable to generate chart. Please check your details and try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[Math.floor(longitude / 30) % 12];
  };

  const formatDegree = (degree: number): string => {
    const d = Math.floor(degree);
    const m = Math.floor((degree - d) * 60);
    return `${d}°${m}'`;
  };

  const capitalize = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.split(' ').map(word => capitalize(word)).join(' ');
  };

  const getSunSign = () => chartData?.planets?.Sun?.tropical_sign_name || '';
  const getMoonSign = () => chartData?.planets?.Moon?.tropical_sign_name || '';
  const getRisingSign = () => getSignFromLongitude(chartData?.angles?.ASC || 0);

  // Screen navigation
  const screens = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'personality', label: 'Personality', icon: StarIcon },
    { id: 'angles', label: 'Angles', icon: CompassIcon },
    { id: 'houses', label: 'Houses', icon: InfoIcon },
    { id: 'planets', label: 'Planets', icon: SunIcon },
    { id: 'aspects', label: 'Aspects', icon: TrineIcon },
    { id: 'special-points', label: 'Special Points', icon: SparklesIcon },
    { id: 'chart-emphasis', label: 'Chart Emphasis', icon: FireIcon },
    { id: 'technical', label: 'Technical', icon: InfoIcon },
  ];

  const getNextScreen = () => {
    const currentIndex = screens.findIndex(s => s.id === currentScreen);
    if (currentIndex < screens.length - 1) return screens[currentIndex + 1].id;
    return screens[0].id;
  };

  const getPrevScreen = () => {
    const currentIndex = screens.findIndex(s => s.id === currentScreen);
    if (currentIndex > 0) return screens[currentIndex - 1].id;
    return screens[screens.length - 1].id;
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Loading Skeleton */}
            <section className="px-6 pt-12 pb-12 max-w-6xl mx-auto">
              <div className="mb-12 animate-pulse">
                <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.08]">
                  <div>
                    <div className="h-10 w-64 bg-white/5 rounded mb-3"></div>
                    <div className="h-4 w-48 bg-white/5 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded"></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-12">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="h-10 w-24 bg-white/5 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="card-minimal p-8 rounded-none">
                      <div className="h-3 w-24 bg-white/5 rounded mb-4"></div>
                      <div className="h-8 w-48 bg-white/5 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/5 rounded-full"></div>
                        <div className="h-3 w-16 bg-white/5 rounded"></div>
                      </div>
                      <div className="h-6 w-24 bg-white/5 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        ) : !chartData ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <section className="px-6 pt-20 pb-12 max-w-5xl mx-auto">
              <Link href="/birth-chart" className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Birth Chart
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
                  <CompassIcon size={20} className="text-[#818CF8]" />
                  <span className="mono text-[10px] text-white/40 tracking-[0.3em]">BIRTH CHART CALCULATOR</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                  Generate Your<br />Natal Chart
                </h1>
                
                <p className="text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                  Enter your birth details to calculate your complete natal chart with planetary positions and house placements
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
                    className="card-minimal p-4 rounded-none border-[#EF4444]/30 bg-[#EF4444]/5"
                  >
                    <p className="text-[#EF4444] text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Main Form Card */}
                <div className="card-minimal p-10 rounded-none">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-[#818CF8]/10 flex items-center justify-center border border-[#818CF8]/20">
                      <CompassIcon size={20} className="text-[#818CF8]" />
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
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
                          value={formData.time}
                          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                          max={formData.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none
                                   text-white focus:border-[#818CF8] focus:bg-white/[0.04]
                                   transition-all duration-500 outline-none font-light [color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-white/30 -mt-2">The more accurate your birth time, the more precise your rising sign and house placements</p>

                    {/* Location Input */}
                    <div className="relative">
                    <LocationInput
                      value={formData.location}
                      onChange={handleLocationChange}
                        color="#818CF8"
                    />
                    </div>
                    
                    {formData.latitude && (
                      <p className="text-[10px] text-white/20 flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#48BB78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Location confirmed: {formData.latitude.toFixed(4)}°, {formData.longitude?.toFixed(4)}°
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-minimal p-8 rounded-none relative" style={{ zIndex: 1 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                    className="w-full px-12 py-5 text-sm tracking-widest uppercase
                             flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                             group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{ backgroundColor: '#818CF8', color: 'white' }}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                        <span>GENERATING CHART...</span>
                    </>
                  ) : (
                    <>
                        <CompassIcon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span>GENERATE BIRTH CHART</span>
                    </>
                  )}
                </button>
                </div>
              </motion.form>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: SunIcon, color: '#F59E0B', title: 'Big Three', text: 'Sun, Moon, and Rising signs' },
                  { icon: StarIcon, color: '#818CF8', title: 'Planetary Positions', text: 'Complete planetary placements' },
                  { icon: ChartIcon, color: '#63B3ED', title: 'House System', text: '12 houses and their meanings' }
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
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Chart Results - Multi-Screen Navigation */}
            <section className="px-6 pt-12 pb-12 max-w-6xl mx-auto">
              {/* Navigation Bar - Minimal Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/[0.08]">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-light mb-3 tracking-tight">
                  {new Date(chartData.birth_data.datetime).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </h1>
                    <p className="text-sm text-white/40 font-light">
                  {new Date(chartData.birth_data.datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', minute: '2-digit' 
                  })} · {chartData.birth_data.location_name}
                </p>
                  </div>
                  <button
                    onClick={() => {
                      setChartData(null);
                      setFormData({ date: '', time: '', location: '', latitude: null, longitude: null, timezone: 'UTC' });
                      setCurrentScreen('overview');
                      setSelectedPlanet(null);
                    }}
                    className="px-4 py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all duration-300 mono tracking-wider uppercase border border-white/[0.08]"
                  >
                    New Chart
                  </button>
                </div>

                {/* Screen Navigation - Minimal Premium Tabs */}
                <div className="flex flex-wrap gap-2 mb-12">
                  {screens.map((screen) => {
                    const ScreenIcon = screen.icon;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => {
                          setCurrentScreen(screen.id as any);
                          setSelectedPlanet(null);
                        }}
                        className={`px-5 py-2.5 text-xs mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 ${
                          currentScreen === screen.id
                            ? 'bg-white text-[#0F172A] shadow-lg'
                            : 'bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-white/[0.08]'
                        }`}
                      >
                        <ScreenIcon size={14} />
                        <span className="hidden sm:inline">{screen.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Screen Content */}
              <AnimatePresence mode="wait">
                {/* Screen 1: Chart Overview */}
                {currentScreen === 'overview' && (
              <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                        <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-4">Chart Type</p>
                        <p className="text-2xl font-light tracking-tight">{capitalizeWords(chartData.chart_type)}</p>
                      </div>
                      <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                        <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-4">Systems Used</p>
                        <p className="text-2xl font-light tracking-tight">{capitalizeWords(chartData.zodiac_system)} · {capitalizeWords(chartData.house_system)}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Element', value: chartData.dominant_element, icon: chartData.dominant_element === 'Fire' ? FireIcon : chartData.dominant_element === 'Earth' ? EarthIcon : chartData.dominant_element === 'Air' ? AirIcon : WaterIcon, color: elementColors[chartData.dominant_element] || '#fff' },
                        { label: 'Modality', value: chartData.dominant_modality, icon: StarIcon, color: '#818CF8' },
                        { label: 'Chart Shape', value: chartData.chart_shape, icon: CompassIcon, color: '#63B3ED' },
                        { label: 'House System', value: chartData.house_system, icon: InfoIcon, color: '#6B7280' },
                      ].map((item, i) => (
                        <div key={item.label} className="card-minimal p-6 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-white/[0.02]" style={{ border: `1px solid ${item.color}20` }}>
                              <div style={{ color: item.color }}>
                                <item.icon size={16} />
                              </div>
                            </div>
                            <span className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase">{item.label}</span>
                          </div>
                          <p className="text-xl font-light tracking-tight">{capitalizeWords(item.value)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={() => setCurrentScreen('personality')}
                        className="btn-minimal px-6 py-3 text-xs tracking-widest uppercase"
                      >
                        Next: Personality →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Screen 2: Personality Summary */}
                {currentScreen === 'personality' && (
                    <motion.div
                    key="personality"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="card-minimal p-10 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h2 className="text-2xl font-light mb-6 tracking-tight">Element Interpretation</h2>
                      <p className="text-white/60 font-light leading-relaxed text-base">
                        {chartData.element_interpretation}
                      </p>
                      </div>

                    <div className="card-minimal p-10 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h2 className="text-2xl font-light mb-6 tracking-tight">Modality Interpretation</h2>
                      <p className="text-white/60 font-light leading-relaxed text-base">
                        {chartData.modality_interpretation}
                      </p>
                        </div>

                    <div className="card-minimal p-10 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h2 className="text-2xl font-light mb-8 tracking-tight">Hemisphere Emphasis</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: 'Eastern', value: chartData.hemisphere_emphasis.Eastern },
                          { label: 'Western', value: chartData.hemisphere_emphasis.Western },
                          { label: 'Northern', value: chartData.hemisphere_emphasis.Northern },
                          { label: 'Southern', value: chartData.hemisphere_emphasis.Southern },
                        ].map((item) => (
                          <div key={item.label} className="p-4 bg-white/[0.02] rounded-none">
                            <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">{item.label}</p>
                            <p className="text-2xl font-light tracking-tight">{item.value}%</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-white/60 font-light leading-relaxed text-base">
                        {chartData.hemisphere_interpretation}
                      </p>
                    </div>

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('overview')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('angles')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Angles →
                      </button>
                      </div>
                    </motion.div>
                )}

                {/* Screen 3: Angles & Core Axes */}
                {currentScreen === 'angles' && (
                  <motion.div
                    key="angles"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {[
                      { name: 'Ascendant', key: 'ASC', icon: CompassIcon, color: '#818CF8' },
                      { name: 'Midheaven', key: 'MC', icon: StarIcon, color: '#F59E0B' },
                      { name: 'Descendant', key: 'DSC', icon: CompassIcon, color: '#EC4899' },
                      { name: 'IC', key: 'IC', icon: MoonIcon, color: '#94A3B8' },
                      { name: 'Vertex', key: 'Vertex', icon: SparklesIcon, color: '#48BB78' },
                    ].map((angle) => {
                      const longitude = chartData.angles[angle.key as keyof typeof chartData.angles];
                      const sign = getSignFromLongitude(longitude);
                      const degree = longitude % 30;
                      const SignIcon = signIcons[sign] || StarIcon;
                      return (
                        <div key={angle.key} className="card-minimal p-6 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div className="p-3 rounded-full bg-white/[0.02]" style={{ border: `1px solid ${angle.color}20` }}>
                                <div style={{ color: angle.color }}>
                                  <angle.icon size={20} />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-light mb-2 tracking-tight">{angle.name}</h3>
                                <div className="flex items-center gap-3">
                                  <SignIcon size={18} className="text-white/50" />
                                  <span className="text-lg font-light text-white/90">{capitalize(sign)}</span>
                                  <span className="mono text-sm text-white/40">{formatDegree(degree)}</span>
                                </div>
                              </div>
                            </div>
                            <span className="mono text-xs text-white/30 font-light">{formatDegree(longitude)}</span>
                          </div>
                        </div>
                  );
                })}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('personality')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('houses')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Houses →
                      </button>
                    </div>
              </motion.div>
                )}

                {/* Screen 4: Houses Overview */}
                {currentScreen === 'houses' && (
              <motion.div
                    key="houses"
                    initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {chartData.houses.map((house) => {
                      const SignIcon = signIcons[house.sign] || StarIcon;
                      const isExpanded = expandedHouse === house.number;
                      return (
                        <div
                          key={house.number}
                          className="card-minimal p-6 rounded-none cursor-pointer group hover:bg-white/[0.03] transition-all duration-500"
                          onClick={() => setExpandedHouse(isExpanded ? null : house.number)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                                <span className="mono text-xl text-white/30 font-light">H{house.number}</span>
                    </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <SignIcon size={18} className="text-white/50" />
                                  <span className="text-lg font-light text-white/90">{capitalize(house.sign)}</span>
                                  <span className="mono text-sm text-white/40">{formatDegree(house.cusp_degree)}</span>
                                </div>
                                <p className="text-xs text-white/40 mono">Ruler: {capitalize(house.ruler)}</p>
                              </div>
                            </div>
                            {house.planets_in_house.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {house.planets_in_house.map(planet => (
                                  <span 
                                    key={planet}
                                    className="px-2.5 py-1 text-[10px] rounded-full font-medium"
                                    style={{ 
                                      backgroundColor: `${planetColors[planet] || '#fff'}15`,
                                      color: planetColors[planet] || '#fff',
                                      border: `1px solid ${planetColors[planet] || '#fff'}30`
                                    }}
                                  >
                                    {capitalize(planet)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 pt-4 border-t border-white/[0.05]"
                            >
                              <p className="text-sm text-white/60 font-light leading-relaxed">
                                {house.interpretation}
                              </p>
                              {house.intercepted_sign && (
                                <p className="text-xs text-white/40 mt-3 mono tracking-wider">
                                  Intercepted: {capitalize(house.intercepted_sign)}
                                </p>
                              )}
              </motion.div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                  <button
                        onClick={() => setCurrentScreen('angles')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                  </button>
                      <button
                        onClick={() => setCurrentScreen('planets')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Planets →
                      </button>
              </div>
                  </motion.div>
                )}

                {/* Screen 5: Planetary Positions */}
                {currentScreen === 'planets' && !selectedPlanet && (
                  <motion.div
                    key="planets"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {Object.entries(chartData.planets).map(([name, planet]) => {
                      const SignIcon = signIcons[planet.tropical_sign_name] || StarIcon;
                      return (
                        <div
                          key={name}
                          onClick={() => setSelectedPlanet(name)}
                          className="card-minimal p-6 rounded-none cursor-pointer group hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-500"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ 
                                  backgroundColor: `${planetColors[name] || '#fff'}15`,
                                  border: `1px solid ${planetColors[name] || '#fff'}30`
                                }}
                              >
                                <span className="text-lg font-light" style={{ color: planetColors[name] || '#fff' }}>
                                  {capitalize(name).charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-light mb-2 tracking-tight">{capitalize(name)}</h3>
                                <div className="flex items-center gap-3">
                                  <SignIcon size={16} className="text-white/50" />
                                  <span className="text-white/90 font-light">{capitalize(planet.tropical_sign_name)}</span>
                                  <span className="mono text-xs text-white/40">{planet.degree_str}</span>
                              </div>
                            </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/40 mb-1 mono">House {planet.house}</p>
                            {planet.is_retrograde && (
                                <span className="mono text-[9px] text-[#F59E0B] tracking-wider px-2 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20">Rx</span>
                            )}
                          </div>
                          </div>
                          </div>
                      );
                    })}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('houses')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('aspects')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Aspects →
                      </button>
                          </div>
                  </motion.div>
                )}

                {/* Screen 6: Planet Detail */}
                {currentScreen === 'planets' && selectedPlanet && (
                  <motion.div
                    key={`planet-${selectedPlanet}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {(() => {
                      const planet = chartData.planets[selectedPlanet];
                      if (!planet) return null;
                      const SignIcon = signIcons[planet.tropical_sign_name] || StarIcon;
                      const SiderealSignIcon = signIcons[planet.sidereal_sign_name] || StarIcon;
                      
                      return (
                        <>
                          <div className="flex items-center gap-4 mb-6">
                            <button
                              onClick={() => setSelectedPlanet(null)}
                              className="text-sm text-white/40 hover:text-white/60 transition-colors"
                            >
                              ← Back to Planets
                            </button>
                          </div>

                          <div className="card-minimal p-8 rounded-none mb-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div 
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${planetColors[selectedPlanet] || '#fff'}15` }}
                              >
                                <span className="text-2xl font-light" style={{ color: planetColors[selectedPlanet] || '#fff' }}>
                                  {selectedPlanet.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h2 className="text-3xl font-light mb-2 tracking-tight">{capitalize(selectedPlanet)}</h2>
                                <div className="flex items-center gap-3">
                                  <SignIcon size={20} className="text-white/50" />
                                  <span className="text-xl font-light text-white/90">{capitalize(planet.tropical_sign_name)}</span>
                                  <span className="mono text-sm text-white/40">{planet.degree_str}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-white/[0.05]">
                              <div className="p-4 bg-white/[0.02] rounded-none">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Tropical</p>
                                <p className="text-base text-white/70 font-light">{formatDegree(planet.tropical_longitude)}</p>
                              </div>
                              <div className="p-4 bg-white/[0.02] rounded-none">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Sidereal</p>
                                <div className="flex items-center gap-2">
                                  <SiderealSignIcon size={16} className="text-white/50" />
                                  <span className="text-base text-white/70 font-light">{capitalize(planet.sidereal_sign_name)}</span>
                                  <span className="mono text-xs text-white/40">{formatDegree(planet.sidereal_longitude)}</span>
                              </div>
                            </div>
                          </div>
                          
                            {planet.nakshatra_name && (
                              <div className="mb-8 pt-6 border-t border-white/[0.05]">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Nakshatra</p>
                                <p className="text-sm text-white/60 font-light">
                                  {capitalizeWords(planet.nakshatra_name)} · Pada {planet.nakshatra_pada} · Lord: {capitalize(planet.nakshatra_lord)}
                                </p>
                            </div>
                          )}
                          
                            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-white/[0.05]">
                              <div className="p-4 bg-white/[0.02] rounded-none">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Speed</p>
                                <p className="text-base text-white/70 font-light">{planet.speed?.toFixed(4) || 'N/A'}</p>
                              </div>
                              <div className="p-4 bg-white/[0.02] rounded-none">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Retrograde</p>
                                <p className="text-base text-white/70 font-light">{planet.is_retrograde ? 'Yes' : 'No'}</p>
                              </div>
                              <div className="p-4 bg-white/[0.02] rounded-none">
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Dignity</p>
                                <p className="text-base text-white/70 font-light">{capitalizeWords(planet.dignity)}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.05]">
                              <div>
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Dignity Score</p>
                                <p className="text-xl font-light">{planet.dignity_score || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Strength</p>
                                <p className="text-xl font-light">{planet.strength_percent}%</p>
                              </div>
                              <div>
                                <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-2">Psychological</p>
                                <p className="text-sm text-white/60 font-light">{capitalizeWords(planet.psychological_strength) || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}

                {/* Screen 7: Aspect Matrix */}
                {currentScreen === 'aspects' && (
                  <motion.div
                    key="aspects"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {chartData.aspects
                      .sort((a, b) => b.strength - a.strength)
                      .map((aspect, i) => {
                        const AspectIcon = aspect.aspect_type === 'trine' ? TrineIcon : 
                                          aspect.aspect_type === 'square' ? SquareIcon : 
                                          aspect.aspect_type === 'opposition' ? OppositionIcon : StarIcon;
                        const aspectColor = aspect.aspect_type === 'trine' || aspect.aspect_type === 'sextile' ? '#48BB78' :
                                           aspect.aspect_type === 'square' || aspect.aspect_type === 'opposition' ? '#EF4444' : '#6B7280';
                        
                        return (
                          <div
                            key={`${aspect.point1}-${aspect.point2}-${i}`}
                            className="card-minimal p-6 rounded-none group hover:bg-white/[0.03] transition-all duration-500"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                              <span 
                                  className="font-light text-lg tracking-tight"
                                style={{ color: planetColors[aspect.point1] || '#fff' }}
                              >
                                  {capitalize(aspect.point1)}
                              </span>
                                <div className="p-2 rounded-full bg-white/[0.02]" style={{ border: `1px solid ${aspectColor}30` }}>
                              <div style={{ color: aspectColor }}>
                                <AspectIcon size={18} />
                              </div>
                            </div>
                              <span 
                                  className="font-light text-lg tracking-tight"
                                style={{ color: planetColors[aspect.point2] || '#fff' }}
                              >
                                  {capitalize(aspect.point2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                                <span className="mono tracking-wider">{capitalizeWords(aspect.aspect_type)}</span>
                              <span className="mono">{aspect.angle.toFixed(1)}°</span>
                              <span className="mono">orb {aspect.orb.toFixed(1)}°</span>
                                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${aspect.strength}%`,
                                    backgroundColor: aspectColor
                                  }}
                                />
                              </div>
                            </div>
                            </div>
                            {aspect.interpretation && (
                              <p className="text-sm text-white/60 font-light leading-relaxed pt-4 border-t border-white/[0.05]">
                                {aspect.interpretation}
                              </p>
                            )}
                          </div>
                        );
                      })}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('planets')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('special-points')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Special Points →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Screen 8: Special Points */}
                {currentScreen === 'special-points' && (
              <motion.div
                    key="special-points"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {Object.entries(chartData.chart_points).map(([name, point]) => {
                      const sign = getSignFromLongitude(point.longitude);
                      const SignIcon = signIcons[sign] || StarIcon;
                      return (
                        <div key={name} className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                          <h3 className="text-2xl font-light mb-6 tracking-tight">{capitalizeWords(name)}</h3>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-full bg-white/[0.02] border border-white/[0.08]">
                              <SignIcon size={18} className="text-white/50" />
                            </div>
                            <span className="text-lg font-light text-white/90">{capitalize(sign)}</span>
                            <span className="mono text-sm text-white/40">{formatDegree(point.degree_in_sign)}</span>
                            <span className="text-sm text-white/40 mono">House {point.house}</span>
                          </div>
                          <p className="text-sm text-white/60 font-light leading-relaxed">
                            {point.interpretation}
                  </p>
                </div>
                      );
                    })}

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('aspects')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('chart-emphasis')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Chart Emphasis →
                      </button>
                </div>
                  </motion.div>
                )}

                {/* Screen 9: Chart Emphasis */}
                {currentScreen === 'chart-emphasis' && (
                  <motion.div
                    key="chart-emphasis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h3 className="text-2xl font-light mb-6 tracking-tight">Dominant Element</h3>
                      <div className="flex items-center gap-5 mb-4">
                        {(() => {
                          const ElementIcon = chartData.dominant_element === 'Fire' ? FireIcon : 
                                            chartData.dominant_element === 'Earth' ? EarthIcon : 
                                            chartData.dominant_element === 'Air' ? AirIcon : WaterIcon;
                          return (
                            <div className="p-4 rounded-full bg-white/[0.02]" style={{ border: `1px solid ${elementColors[chartData.dominant_element] || '#fff'}30` }}>
                              <div style={{ color: elementColors[chartData.dominant_element] || '#fff' }}>
                                <ElementIcon size={28} />
                              </div>
                            </div>
                          );
                        })()}
                        <span className="text-3xl font-light tracking-tight">{capitalize(chartData.dominant_element)}</span>
                      </div>
                    </div>

                    <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h3 className="text-2xl font-light mb-6 tracking-tight">Dominant Modality</h3>
                      <p className="text-3xl font-light tracking-tight">{capitalize(chartData.dominant_modality)}</p>
                    </div>

                    <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h3 className="text-2xl font-light mb-6 tracking-tight">Chart Shape</h3>
                      <p className="text-3xl font-light tracking-tight">{capitalizeWords(chartData.chart_shape)}</p>
                    </div>

                    <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h3 className="text-2xl font-light mb-6 tracking-tight">Hemisphere Distribution</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Eastern', value: chartData.hemisphere_emphasis.Eastern },
                          { label: 'Western', value: chartData.hemisphere_emphasis.Western },
                          { label: 'Northern', value: chartData.hemisphere_emphasis.Northern },
                          { label: 'Southern', value: chartData.hemisphere_emphasis.Southern },
                        ].map((item) => (
                          <div key={item.label} className="p-4 bg-white/[0.02] rounded-none">
                            <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">{item.label}</p>
                            <p className="text-2xl font-light tracking-tight">{item.value}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                      <button
                        onClick={() => setCurrentScreen('special-points')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentScreen('technical')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Next: Technical →
                      </button>
                </div>
              </motion.div>
                )}

                {/* Screen 10: Technical Details */}
                {currentScreen === 'technical' && (
              <motion.div
                    key="technical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="card-minimal p-8 rounded-none group hover:bg-white/[0.03] transition-all duration-500">
                      <h3 className="text-2xl font-light mb-6 tracking-tight">Calculation Details</h3>
                      <div className="space-y-6">
                        <div className="p-4 bg-white/[0.02] rounded-none">
                          <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">House System</p>
                          <p className="text-lg font-light tracking-tight">{capitalizeWords(chartData.birth_data.house_system)}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] rounded-none">
                          <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Zodiac System</p>
                          <p className="text-lg font-light tracking-tight">{capitalizeWords(chartData.zodiac_system)}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] rounded-none">
                          <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Generated At</p>
                          <p className="text-sm text-white/60 font-light">
                            {new Date(chartData.generated_at).toLocaleString()}
                          </p>
                        </div>
                        {chartData.calculation_notes && (
                          <div className="p-4 bg-white/[0.02] rounded-none">
                            <p className="mono text-[9px] text-white/25 tracking-[0.3em] uppercase mb-3">Notes</p>
                            <p className="text-sm text-white/60 font-light leading-relaxed">
                              {chartData.calculation_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-12 pt-8 border-t border-white/[0.05]">
                <button
                        onClick={() => setCurrentScreen('chart-emphasis')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        ← Back
                </button>
                      <button
                        onClick={() => setCurrentScreen('overview')}
                        className="btn-minimal px-8 py-3.5 text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
                      >
                        Back to Overview
                      </button>
                    </div>
              </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

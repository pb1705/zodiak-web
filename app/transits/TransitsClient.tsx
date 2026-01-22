'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon, MoonIcon, CalendarIcon, ClockIcon, StarIcon, ChartIcon, TrendingIcon,
  CompassIcon, SparklesIcon, BookIcon, CheckCircleIcon,
  AriesIcon, TaurusIcon, GeminiIcon, CancerIcon, LeoIcon, VirgoIcon,
  LibraIcon, ScorpioIcon, SagittariusIcon, CapricornIcon, AquariusIcon, PiscesIcon,
} from '@/components/icons';
import LocationInput from '@/components/LocationInput';
import { 
  fetchDailyTransit, fetchWeeklyTransit, fetchMonthlyTransit, fetchYearlyTransit,
  type DailyTransitResponse, type WeeklyTransitResponse, 
  type MonthlyTransitResponse, type YearlyTransitResponse,
  type TransitBirthData, type TransitItem, type GeocodeResult
} from '@/lib/api';

// Parse markdown-style formatting to JSX
const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;
  
  // Split by newlines and process each line
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Handle headers (## or **)
    if (line.startsWith('**') && line.endsWith('**')) {
      const headerText = line.replace(/\*\*/g, '');
      return (
        <h4 key={lineIndex} className="text-white/80 font-medium mt-4 mb-2 first:mt-0">
          {headerText}
        </h4>
      );
    }
    
    // Handle bullet points
    if (line.startsWith('• ') || line.startsWith('- ')) {
      const bulletText = line.replace(/^[•\-]\s*/, '');
      return (
        <div key={lineIndex} className="flex items-start gap-2 mb-1">
          <span className="text-white/20 mt-0.5">•</span>
          <span>{parseBoldText(bulletText)}</span>
        </div>
      );
    }
    
    // Handle numbered lists
    const numberedMatch = line.match(/^(\d+)\.\s*(.*)$/);
    if (numberedMatch) {
      return (
        <div key={lineIndex} className="flex items-start gap-2 mb-1">
          <span className="text-white/30 min-w-[1.5rem]">{numberedMatch[1]}.</span>
          <span>{parseBoldText(numberedMatch[2])}</span>
        </div>
      );
    }
    
    // Regular paragraph with inline bold
    if (line.trim()) {
      return (
        <p key={lineIndex} className="mb-2 last:mb-0">
          {parseBoldText(line)}
        </p>
      );
    }
    
    // Empty line = spacing
    return <div key={lineIndex} className="h-2" />;
  });
};

// Parse **bold** text within a line
const parseBoldText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white/80 font-medium">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Zodiac sign icons
const signIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Aries': AriesIcon, 'Taurus': TaurusIcon, 'Gemini': GeminiIcon, 'Cancer': CancerIcon,
  'Leo': LeoIcon, 'Virgo': VirgoIcon, 'Libra': LibraIcon, 'Scorpio': ScorpioIcon,
  'Sagittarius': SagittariusIcon, 'Capricorn': CapricornIcon, 'Aquarius': AquariusIcon, 'Pisces': PiscesIcon
};

// Planet colors
const planetColors: Record<string, string> = {
  'Sun': '#F59E0B', 'Moon': '#94A3B8', 'Mercury': '#818CF8', 'Venus': '#EC4899',
  'Mars': '#EF4444', 'Jupiter': '#63B3ED', 'Saturn': '#6B7280', 'Rahu': '#1E293B', 'Ketu': '#475569'
};

// Rating colors
const getRatingColor = (rating: number): string => {
  if (rating >= 8) return '#48BB78';
  if (rating >= 6) return '#63B3ED';
  if (rating >= 4) return '#F59E0B';
  return '#EF4444';
};

// Energy styling
const getEnergyStyle = (type: string): { bg: string; text: string } => {
  if (type.includes('highly_favorable') || type.includes('exceptional')) return { bg: 'bg-[#48BB78]/10', text: 'text-[#48BB78]' };
  if (type.includes('favorable')) return { bg: 'bg-[#63B3ED]/10', text: 'text-[#63B3ED]' };
  if (type.includes('challenging')) return { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' };
  return { bg: 'bg-white/5', text: 'text-white/50' };
};

interface FormData {
  date: string;
  time: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
}

type TransitPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
type TransitData = DailyTransitResponse | WeeklyTransitResponse | MonthlyTransitResponse | YearlyTransitResponse;

// Spinner
const Spinner = ({ size = 20 }: { size?: number }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

// Circular Rating
const RatingCircle = ({ rating, size = 80, label }: { rating: number; size?: number; label?: string }) => {
  const circumference = 2 * Math.PI * 35;
  const progress = (rating / 10) * circumference;
  const color = getRatingColor(rating);
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 80 80" className="transform -rotate-90">
          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5"/>
          <circle 
            cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="2.5"
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-light" style={{ color }}>{rating}</span>
        </div>
      </div>
      {label && <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>}
    </div>
  );
};

// Expandable Section
const ExpandableSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon: Icon
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
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
          <span className="text-xs text-white/50 tracking-wide">{title}</span>
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

// Transit Card with full interpretation
const TransitCard = ({ transit }: { transit: TransitItem }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="py-4 border-b border-white/[0.03] last:border-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ color: planetColors[transit.transiting_planet] || '#fff' }} className="font-light">
              {transit.transiting_planet}
            </span>
            <span className="text-white/20 text-xs">{transit.aspect_type}</span>
            <span style={{ color: planetColors[transit.natal_planet] || '#fff' }} className="font-light">
              {transit.natal_planet}
            </span>
          </div>
          <motion.svg 
            animate={{ rotate: expanded ? 180 : 0 }}
            className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
        <p className="text-sm text-white/50 font-light leading-relaxed">{transit.one_line_summary}</p>
      </button>
      
      <AnimatePresence>
        {expanded && transit.interpretation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {/* Psychological & Traditional */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 bg-white/[0.02] border border-white/[0.03]">
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Psychological</p>
                <p className="text-xs text-white/60 leading-relaxed">{transit.interpretation.psychological}</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.03]">
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Traditional</p>
                <p className="text-xs text-white/60 leading-relaxed">{transit.interpretation.traditional}</p>
              </div>
            </div>
            
            {/* Timing */}
            {transit.interpretation.timing && (
              <p className="text-xs text-white/40 pl-4 border-l-2 border-white/10">
                <span className="text-white/20">Timing:</span> {transit.interpretation.timing}
              </p>
            )}
            
            {/* Action Suggestions */}
            {transit.interpretation.action_suggestions?.length > 0 && (
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Actions</p>
                <div className="flex flex-wrap gap-2">
                  {transit.interpretation.action_suggestions.map((a, i) => (
                    <span key={i} className="px-2 py-1 text-[10px] bg-[#63B3ED]/10 text-[#63B3ED] border border-[#63B3ED]/20">{a}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reflection Prompts */}
            {transit.interpretation.reflection_prompts?.length > 0 && (
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Reflect</p>
                {transit.interpretation.reflection_prompts.map((r, i) => (
                  <p key={i} className="text-xs text-white/40 italic pl-3 border-l border-white/10">"{r}"</p>
                ))}
              </div>
            )}
            
            {/* Remedies */}
            <div className="grid grid-cols-2 gap-3">
              {transit.interpretation.western_remedies?.length > 0 && (
                <div className="p-3 bg-white/[0.01]">
                  <p className="text-[9px] text-[#48BB78]/60 uppercase tracking-wider mb-2">Western Remedies</p>
                  {transit.interpretation.western_remedies.map((r, i) => (
                    <p key={i} className="text-[11px] text-white/40 leading-relaxed">{r}</p>
                  ))}
                </div>
              )}
              {transit.interpretation.vedic_remedies?.length > 0 && (
                <div className="p-3 bg-white/[0.01]">
                  <p className="text-[9px] text-[#F59E0B]/60 uppercase tracking-wider mb-2">Vedic Remedies</p>
                  {transit.interpretation.vedic_remedies.map((r, i) => (
                    <p key={i} className="text-[11px] text-white/40 leading-relaxed">{r}</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dedupe transits by planet pair
const dedupeTransits = (transits: TransitItem[]): TransitItem[] => {
  const seen = new Set<string>();
  return transits.filter(t => {
    const key = `${t.transiting_planet}-${t.natal_planet}-${t.aspect_type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function TransitsClient() {
  const [formData, setFormData] = useState<FormData>({
    date: '', time: '', location: '', latitude: null, longitude: null, timezone: 'UTC'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<TransitPeriod>('daily');
  const [transitData, setTransitData] = useState<TransitData | null>(null);
  const [birthData, setBirthData] = useState<TransitBirthData | null>(null);

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

    const newBirthData: TransitBirthData = {
      datetime: `${formData.date}T${formData.time}:00`,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: formData.timezone || 'UTC'
    };

    setBirthData(newBirthData);
    await fetchTransitData(newBirthData, 'daily');
  };

  const fetchTransitData = async (data: TransitBirthData, period: TransitPeriod) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: TransitData | null = null;
      const today = new Date();

      switch (period) {
        case 'daily': response = await fetchDailyTransit(data); break;
        case 'weekly': response = await fetchWeeklyTransit(data); break;
        case 'monthly': response = await fetchMonthlyTransit(data, today.getMonth() + 1, today.getFullYear()); break;
        case 'yearly': response = await fetchYearlyTransit(data, today.getFullYear()); break;
      }

      if (response) {
        setTransitData(response);
        setActivePeriod(period);
      } else {
        setError('Unable to fetch transit data. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: TransitPeriod) => {
    if (birthData && period !== activePeriod) {
      fetchTransitData(birthData, period);
    }
  };

  // ==================== DAILY VIEW ====================
  const DailyView = ({ data }: { data: DailyTransitResponse }) => {
    const MoonSignIcon = signIcons[data.moon_sign] || MoonIcon;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Push Notification Header */}
        <div className="text-center py-8">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-2">{data.push_notification.title}</p>
          <h1 className="text-xl md:text-2xl font-light text-white/80 max-w-xl mx-auto leading-relaxed">
            {data.push_notification.body}
          </h1>
        </div>

        {/* Date & Rating Card */}
        <div className="p-8 bg-white/[0.02] border border-white/[0.05]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                {new Date(data.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <h2 className="text-3xl md:text-4xl font-light">
                {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <RatingCircle rating={data.overall_rating} label="Rating" />
              <div className="text-right">
                <p className="text-lg font-light" style={{ color: getRatingColor(data.overall_rating) }}>
                  {data.energy_quality}
                </p>
                <p className="text-xs text-white/30">Energy Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Focus */}
        <div className="p-6 bg-gradient-to-r from-[#F59E0B]/5 to-[#F59E0B]/5 border border-[#F59E0B]/10">
          <div className="flex items-start gap-4">
            <StarIcon size={18} className="text-[#F59E0B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-[#F59E0B]/60 uppercase tracking-wider mb-1">Today's Focus</p>
              <p className="text-white/80 font-light leading-relaxed">{data.top_focus}</p>
            </div>
          </div>
        </div>

        {/* Moon & Panchang */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-white/[0.02] border border-white/[0.05]">
            <MoonSignIcon size={16} className="text-white/30 mb-2" />
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Moon Sign</p>
            <p className="text-white/70 font-light">{data.moon_sign}</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/[0.05]">
            <StarIcon size={16} className="text-white/30 mb-2" />
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Nakshatra</p>
            <p className="text-white/70 font-light">{data.moon_nakshatra}</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/[0.05]">
            <MoonIcon size={16} className="text-white/30 mb-2" />
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Tithi</p>
            <p className="text-white/70 font-light">{data.tithi}</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/[0.05]">
            <CompassIcon size={16} className="text-white/30 mb-2" />
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Yoga</p>
            <p className="text-white/70 font-light">{data.yoga}</p>
          </div>
        </div>

        {/* Daily Guidance */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <BookIcon size={14} className="text-[#63B3ED]" />
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Psychological</p>
            </div>
            <p className="text-sm text-white/60 font-light leading-relaxed">{data.daily_guidance.psychological}</p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon size={14} className="text-[#818CF8]" />
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Traditional</p>
            </div>
            <p className="text-sm text-white/60 font-light leading-relaxed">{data.daily_guidance.traditional}</p>
          </div>
        </div>

        {/* Action Suggestions */}
        {data.daily_guidance.action_suggestions?.length > 0 && (
          <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Today's Actions</p>
            <div className="flex flex-wrap gap-2">
              {data.daily_guidance.action_suggestions.map((action, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] text-sm text-white/60">
                  <CheckCircleIcon size={12} className="text-[#48BB78]" />
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable: Critical & Notable Transits */}
        {(data.critical_transits?.length > 0 || data.notable_transits?.length > 0) && (
          <ExpandableSection title="Why This Day? — Transit Details" icon={ChartIcon}>
            <div className="pt-4 space-y-6">
              {data.critical_transits?.length > 0 && (
                <div>
                  <p className="text-[9px] text-[#F59E0B]/80 uppercase tracking-wider mb-3">Critical Transits</p>
                  {data.critical_transits.map((t, i) => <TransitCard key={i} transit={t} />)}
                </div>
              )}
              {data.notable_transits?.length > 0 && (
                <div>
                  <p className="text-[9px] text-[#63B3ED]/80 uppercase tracking-wider mb-3">Notable Transits</p>
                  {data.notable_transits.map((t, i) => (
                    <div key={i} className="py-2 border-b border-white/[0.03] last:border-0">
                      <p className="text-sm text-white/50 font-light">{t.one_line_summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ExpandableSection>
        )}

        {/* Optional: Favorable Activities & Growth Areas */}
        {(data.favorable_activities?.length > 0 || data.growth_areas?.length > 0 || data.major_events?.length > 0) && (
          <ExpandableSection title="Advanced — Activities, Growth & Events" icon={TrendingIcon}>
            <div className="pt-4 space-y-4">
              {data.major_events?.length > 0 && (
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Major Events</p>
                  {data.major_events.map((e, i) => (
                    <p key={i} className="text-sm text-white/50">{e}</p>
                  ))}
                </div>
              )}
              {data.favorable_activities?.length > 0 && (
                <div>
                  <p className="text-[9px] text-[#48BB78]/60 uppercase tracking-wider mb-2">Favorable Activities</p>
                  <div className="flex flex-wrap gap-2">
                    {data.favorable_activities.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-[#48BB78]/10 text-[#48BB78] text-xs border border-[#48BB78]/20">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.growth_areas?.length > 0 && (
                <div>
                  <p className="text-[9px] text-[#818CF8]/60 uppercase tracking-wider mb-2">Growth Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {data.growth_areas.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-[#818CF8]/10 text-[#818CF8] text-xs border border-[#818CF8]/20">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ExpandableSection>
        )}
      </motion.div>
    );
  };

  // ==================== WEEKLY VIEW ====================
  const WeeklyView = ({ data }: { data: WeeklyTransitResponse }) => {
    const dedupedTransits = dedupeTransits(data.major_transits || []);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center py-6">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2">Week of</p>
          <h1 className="text-2xl md:text-3xl font-light mb-4">
            {new Date(data.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(data.week_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h1>
          <RatingCircle rating={data.week_rating} size={70} label="Week Rating" />
        </div>

        {/* Theme */}
        <div className="p-6 bg-gradient-to-r from-[#63B3ED]/5 to-[#7DD3FC]/5 border border-[#63B3ED]/10 text-center">
          <p className="text-lg text-white/80 font-light">{data.overall_theme}</p>
        </div>

        {/* Weekly Guidance */}
        <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-4">Weekly Guidance</p>
          <div className="text-sm text-white/60 font-light leading-relaxed">
            {parseMarkdown(data.weekly_guidance.psychological)}
          </div>
          {data.weekly_guidance.traditional && (
            <div className="pt-4 border-t border-white/5 mt-4">
              <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Traditional</p>
              <div className="text-sm text-white/50 font-light leading-relaxed">
                {parseMarkdown(data.weekly_guidance.traditional)}
              </div>
            </div>
          )}
          {data.weekly_guidance.timing && (
            <p className="mt-4 text-xs text-white/40 pl-3 border-l-2 border-white/10">
              <span className="text-white/20">Timing:</span> {data.weekly_guidance.timing}
            </p>
          )}
        </div>

        {/* Action Suggestions */}
        {data.weekly_guidance.action_suggestions?.length > 0 && (
          <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">This Week's Actions</p>
            <ul className="space-y-2">
              {data.weekly_guidance.action_suggestions.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircleIcon size={14} className="text-[#48BB78] mt-0.5 flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Days */}
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Key Days</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.key_days.map((day, i) => {
              const style = getEnergyStyle(day.energy_type);
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm font-medium" style={{ color: getRatingColor(day.rating) }}>
                      {day.rating}
                    </span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-[9px] ${style.bg} ${style.text} mb-2`}>
                    {day.energy_type.replace(/_/g, ' ')}
                  </span>
                  <p className="text-[11px] text-white/50 leading-relaxed">{day.suggestion}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Moon Phases */}
        {data.moon_phase_dates && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(data.moon_phase_dates).map(([phase, date]) => (
              <div key={phase} className="p-3 bg-white/[0.02] border border-white/[0.05] text-center">
                <MoonIcon size={16} className="mx-auto mb-1 text-white/20" />
                <p className="text-[9px] text-white/30 uppercase">{phase.replace(/_/g, ' ')}</p>
                <p className="text-white/50 text-sm">
                  {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Expandable: Major Transits */}
        {dedupedTransits.length > 0 && (
          <ExpandableSection title="Why This Week? — Major Transits" icon={ChartIcon}>
            <div className="pt-4">
              {dedupedTransits.slice(0, 5).map((t, i) => <TransitCard key={i} transit={t} />)}
            </div>
          </ExpandableSection>
        )}

        {/* Focus Areas */}
        {data.focus_areas?.length > 0 && (
          <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Focus Areas</p>
            <div className="flex flex-wrap gap-2">
              {data.focus_areas.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-white/[0.05] text-white/60 text-sm border border-white/[0.05]">{a}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ==================== MONTHLY VIEW ====================
  const MonthlyView = ({ data }: { data: MonthlyTransitResponse }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-light mb-4">{data.month} {data.year}</h1>
        <RatingCircle rating={data.month_rating} size={70} label="Month Rating" />
      </div>

      {/* Theme */}
      <div className="p-6 bg-gradient-to-r from-[#818CF8]/5 to-[#EC4899]/5 border border-[#818CF8]/10 text-center">
        <p className="text-lg text-white/80 font-light mb-2">{data.overall_theme}</p>
        <p className="text-sm text-white/40">{data.lunar_theme}</p>
      </div>

      {/* Lunar Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 bg-white/[0.02] border border-white/[0.05] flex items-center gap-4">
          <MoonIcon size={20} className="text-white/20" />
          <div>
            <p className="text-[9px] text-white/30 uppercase">New Moon</p>
            <p className="text-white/70">{new Date(data.new_moon_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/[0.05] flex items-center gap-4">
          <MoonIcon size={20} className="text-[#F59E0B]/50" />
          <div>
            <p className="text-[9px] text-white/30 uppercase">Full Moon</p>
            <p className="text-white/70">{new Date(data.full_moon_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Monthly Guidance */}
      <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-4">Monthly Guidance</p>
        <div className="text-sm text-white/60 font-light leading-relaxed">
          {parseMarkdown(data.monthly_guidance.psychological)}
        </div>
        
        {data.monthly_guidance.traditional && (
          <div className="pt-4 border-t border-white/5 mb-4 mt-4">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Traditional</p>
            <div className="text-sm text-white/50 font-light leading-relaxed">
              {parseMarkdown(data.monthly_guidance.traditional)}
            </div>
          </div>
        )}
        
        {data.monthly_guidance.timing && (
          <p className="text-xs text-white/40 pl-3 border-l-2 border-white/10 mb-4">
            <span className="text-white/20">Timing:</span> {data.monthly_guidance.timing}
          </p>
        )}
        
        {data.monthly_guidance.action_suggestions?.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Actions</p>
            <ul className="space-y-1">
              {data.monthly_guidance.action_suggestions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircleIcon size={12} className="text-[#48BB78] mt-0.5" /> {a}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {data.monthly_guidance.reflection_prompts?.length > 0 && (
          <div className="pt-4 border-t border-white/5 mt-4">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Reflection</p>
            {data.monthly_guidance.reflection_prompts.map((r, i) => (
              <p key={i} className="text-sm text-white/40 italic">"{r}"</p>
            ))}
          </div>
        )}
      </div>

      {/* Remedies */}
      {(data.monthly_guidance.western_remedies?.length > 0 || data.monthly_guidance.vedic_remedies?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {data.monthly_guidance.western_remedies?.length > 0 && (
            <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[9px] text-[#48BB78]/60 uppercase tracking-wider mb-2">Western Remedies</p>
              {data.monthly_guidance.western_remedies.map((r, i) => (
                <p key={i} className="text-xs text-white/50 mb-1">{r}</p>
              ))}
            </div>
          )}
          {data.monthly_guidance.vedic_remedies?.length > 0 && (
            <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[9px] text-[#F59E0B]/60 uppercase tracking-wider mb-2">Vedic Remedies</p>
              {data.monthly_guidance.vedic_remedies.map((r, i) => (
                <p key={i} className="text-xs text-white/50 mb-1">{r}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Breakdown */}
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Weekly Breakdown</p>
        <div className="space-y-2">
          {data.weekly_breakdown.map((week) => (
            <div key={week.week} className="p-4 bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-white/20 w-16">Week {week.week}</span>
                <span className="text-xs text-white/40 hidden md:inline">{week.summary}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: getRatingColor(week.rating) }}>{week.rating}/10</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best & Challenging Days */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-[#48BB78]/5 border border-[#48BB78]/20">
          <p className="text-[10px] text-[#48BB78]/80 uppercase tracking-wider mb-3">Best Days</p>
          <div className="space-y-2">
            {data.best_days.slice(0, 5).map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[#48BB78] text-sm">{day.rating}/10</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 bg-[#EF4444]/5 border border-[#EF4444]/20">
          <p className="text-[10px] text-[#EF4444]/80 uppercase tracking-wider mb-3">Challenging Days</p>
          <div className="space-y-2">
            {data.challenging_days.slice(0, 5).map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-white/60">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[#EF4444] text-sm">{day.rating}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Life Area Forecasts */}
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Life Areas</p>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(data.life_area_forecasts).map(([area, forecast]) => (
            <div key={area} className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{area}</p>
              <p className="text-sm text-white/60 font-light leading-relaxed">{forecast}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      {data.focus_areas?.length > 0 && (
        <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {data.focus_areas.map((a, i) => (
              <span key={i} className="px-3 py-1 bg-white/[0.05] text-white/60 text-sm border border-white/[0.05]">{a}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // ==================== YEARLY VIEW ====================
  const YearlyView = ({ data }: { data: YearlyTransitResponse }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-light mb-4">{data.year}</h1>
        <RatingCircle rating={data.year_rating} size={80} label="Year Rating" />
      </div>

      {/* Theme */}
      <div className="p-6 bg-gradient-to-r from-[#F59E0B]/5 to-[#F59E0B]/5 border border-[#F59E0B]/10 text-center">
        <p className="text-lg text-white/80 font-light">{data.overall_theme}</p>
      </div>

      {/* Quarterly Breakdown */}
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Quarterly Breakdown</p>
        <div className="grid md:grid-cols-2 gap-3">
          {data.quarterly_breakdown.map((q) => (
            <div key={q.quarter} className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40">{q.months}</span>
                <span className="text-lg font-medium" style={{ color: getRatingColor(q.rating) }}>{q.rating}/10</span>
              </div>
              <p className="text-white/70 font-light mb-1">{q.theme}</p>
              <p className="text-sm text-white/40">{q.primary_focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Guidance */}
      <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-4">Yearly Guidance</p>
        <div className="text-sm text-white/60 font-light leading-relaxed">
          {parseMarkdown(data.yearly_guidance.psychological)}
        </div>
        
        {data.yearly_guidance.traditional && (
          <div className="pt-4 border-t border-white/5 mb-4 mt-4">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Traditional</p>
            <div className="text-sm text-white/50 font-light leading-relaxed">
              {parseMarkdown(data.yearly_guidance.traditional)}
            </div>
          </div>
        )}
        
        {data.yearly_guidance.timing && (
          <p className="text-xs text-white/40 pl-3 border-l-2 border-white/10 mb-4">
            <span className="text-white/20">Timing:</span> {data.yearly_guidance.timing}
          </p>
        )}
        
        {data.yearly_guidance.action_suggestions?.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Key Actions</p>
            <ul className="space-y-1">
              {data.yearly_guidance.action_suggestions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                  <CheckCircleIcon size={12} className="text-[#48BB78] mt-0.5" /> {a}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {data.yearly_guidance.reflection_prompts?.length > 0 && (
          <div className="pt-4 border-t border-white/5 mt-4">
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-2">Reflection</p>
            {data.yearly_guidance.reflection_prompts.map((r, i) => (
              <p key={i} className="text-sm text-white/40 italic">"{r}"</p>
            ))}
          </div>
        )}
      </div>

      {/* Remedies */}
      {(data.yearly_guidance.western_remedies?.length > 0 || data.yearly_guidance.vedic_remedies?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {data.yearly_guidance.western_remedies?.length > 0 && (
            <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[9px] text-[#48BB78]/60 uppercase tracking-wider mb-2">Western Remedies</p>
              {data.yearly_guidance.western_remedies.map((r, i) => (
                <p key={i} className="text-xs text-white/50 mb-1">{r}</p>
              ))}
            </div>
          )}
          {data.yearly_guidance.vedic_remedies?.length > 0 && (
            <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[9px] text-[#F59E0B]/60 uppercase tracking-wider mb-2">Vedic Remedies</p>
              {data.yearly_guidance.vedic_remedies.map((r, i) => (
                <p key={i} className="text-xs text-white/50 mb-1">{r}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Eclipse Dates */}
      {data.eclipse_dates?.length > 0 && (
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Eclipse Season</p>
          <div className="grid md:grid-cols-2 gap-2">
            {data.eclipse_dates.map((eclipse, i) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.05] flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  {eclipse.type.includes('Solar') ? <SunIcon size={16} className="text-[#F59E0B]" /> : <MoonIcon size={16} className="text-white/40" />}
                </div>
                <div>
                  <p className="text-sm text-white/70">{eclipse.type}</p>
                  <p className="text-xs text-white/30 mb-1">
                    {new Date(eclipse.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-white/50">{eclipse.theme}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retrograde Periods */}
      {data.retrograde_periods?.length > 0 && (
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Retrograde Periods</p>
          <div className="space-y-2">
            {data.retrograde_periods.map((retro, i) => (
              <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-light" style={{ color: planetColors[retro.planet] || '#fff' }}>{retro.planet}</span>
                  <span className="text-[10px] text-[#F59E0B]/60 uppercase tracking-wider">Rx</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/50">
                    {new Date(retro.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(retro.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-white/30">{retro.theme}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Dates */}
      {data.key_dates?.length > 0 && (
        <ExpandableSection title="Key Dates Throughout the Year" icon={CalendarIcon}>
          <div className="pt-4 space-y-2">
            {data.key_dates.map((day, i) => {
              const style = getEnergyStyle(day.energy_type);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                  <span className="text-sm text-white/60">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 ${style.bg} ${style.text}`}>
                    {day.energy_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm" style={{ color: getRatingColor(day.rating) }}>{day.rating}/10</span>
                </div>
              );
            })}
          </div>
        </ExpandableSection>
      )}

      {/* Outer Planet Themes */}
      {data.outer_planet_themes && (
        <ExpandableSection title="Outer Planet Themes" icon={SparklesIcon}>
          <div className="pt-4 grid md:grid-cols-2 gap-3">
            <div className="p-4 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#63B3ED]/20 flex items-center justify-center">
                  <span className="text-[#63B3ED] text-xs">♃</span>
                </div>
                <p className="text-[9px] text-white/30 uppercase">Jupiter</p>
              </div>
              <p className="text-sm text-white/50">{data.outer_planet_themes.jupiter}</p>
            </div>
            <div className="p-4 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">♄</span>
                </div>
                <p className="text-[9px] text-white/30 uppercase">Saturn</p>
              </div>
              <p className="text-sm text-white/50">{data.outer_planet_themes.saturn}</p>
            </div>
          </div>
        </ExpandableSection>
      )}

      {/* Focus Areas */}
      {data.focus_areas?.length > 0 && (
        <div className="p-5 bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Focus Areas</p>
          <div className="flex flex-wrap gap-2">
            {data.focus_areas.map((a, i) => (
              <span key={i} className="px-3 py-1 bg-white/[0.05] text-white/60 text-sm border border-white/[0.05]">{a}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!transitData ? (
          /* ===== FORM VIEW ===== */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-20 max-w-2xl mx-auto"
          >
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/[0.02] border border-white/[0.05]">
                <TrendingIcon size={14} className="text-white/40" />
                <span className="text-[10px] text-white/40 tracking-[0.15em] uppercase">Planetary Transits</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
                Track the<br />cosmic weather
              </h1>
              <p className="text-white/40 font-light max-w-md mx-auto leading-relaxed">
                Real-time planetary movements and how they interact with your natal chart
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-8 bg-white/[0.02] border border-white/[0.05] space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.05]">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <StarIcon size={18} className="text-white/40" />
                  </div>
                  <h2 className="text-xl font-light">Your Birth Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                      <CalendarIcon size={14} /> DATE OF BIRTH
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] text-white focus:border-white/20 focus:bg-white/[0.04] transition-all outline-none font-light [color-scheme:dark]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
                      <ClockIcon size={14} /> TIME OF BIRTH
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      max={formData.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] text-white focus:border-white/20 focus:bg-white/[0.04] transition-all outline-none font-light [color-scheme:dark]"
                      required
                    />
                    <p className="text-[10px] text-white/20 mt-2">Enter as accurately as possible</p>
                  </div>
                </div>

                {/* Location Input */}
                <div className="relative">
                  <LocationInput
                    value={formData.location}
                    onChange={handleLocationChange}
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

              {error && (
                <div className="flex items-center gap-3 text-[#EF4444]/80 text-sm p-4 bg-[#EF4444]/5 border border-[#EF4444]/20">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit Button - Lower z-index to stay below location suggestions */}
              <div className="relative" style={{ zIndex: 1 }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-white text-[#0F172A] text-sm tracking-[0.15em] uppercase font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? <><Spinner /> Calculating...</> : <>View Your Transits</>}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* ===== RESULTS VIEW ===== */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-12 max-w-4xl mx-auto"
          >
            {/* Period Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-white/[0.02] border border-white/[0.05] p-1">
                {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    disabled={isLoading}
                    className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-all disabled:opacity-50 ${
                      activePeriod === period ? 'bg-white text-[#0F172A]' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                {/* Period Header Skeleton */}
                <div className="text-center mb-10">
                  <div className="h-8 w-48 bg-white/5 rounded mx-auto mb-4"></div>
                  <div className="h-4 w-32 bg-white/5 rounded mx-auto"></div>
                </div>
                
                {/* Transit Cards Skeleton */}
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="card-minimal p-6 rounded-none">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-5 w-32 bg-white/5 rounded mb-2"></div>
                          <div className="h-4 w-48 bg-white/5 rounded"></div>
                        </div>
                        <div className="h-6 w-20 bg-white/5 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                        <div className="h-4 bg-white/5 rounded w-4/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {activePeriod === 'daily' && transitData && 'date' in transitData && (
                  <DailyView data={transitData as DailyTransitResponse} />
                )}
                {activePeriod === 'weekly' && transitData && 'week_start' in transitData && (
                  <WeeklyView data={transitData as WeeklyTransitResponse} />
                )}
                {activePeriod === 'monthly' && transitData && 'month' in transitData && (
                  <MonthlyView data={transitData as MonthlyTransitResponse} />
                )}
                {activePeriod === 'yearly' && transitData && 'year' in transitData && !('month' in transitData) && (
                  <YearlyView data={transitData as YearlyTransitResponse} />
                )}
              </>
            )}

            {/* Back Button */}
            <div className="mt-12 text-center">
              <button
                onClick={() => { setTransitData(null); setBirthData(null); }}
                className="text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                ← Enter different birth details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

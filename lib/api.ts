// API utility functions for fetching real data

const HOROSCOPE_API_BASE = 'https://prediction-service-latest-o30p.onrender.com/api';
const READERS_API_BASE = 'https://eclipse-mosquitto-vmzh.onrender.com/api/v1/web';

// ==================== NATAL CHART TYPES ====================

export interface NatalChartRequest {
  birth_dt: string; // ISO format: "1990-05-15T10:30:00"
  house_system: string; // "PLACIDUS" | "WHOLE_SIGN" | "EQUAL"
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetData {
  name: string;
  tropical_longitude: number;
  sidereal_longitude: number;
  tropical_sign_name: string;
  tropical_degree_in_sign: number;
  sidereal_sign_name: string;
  sidereal_degree_in_sign: number;
  house: number;
  is_retrograde: boolean;
  dignity: string;
  dignity_score: number;
  strength_percent: number;
  nakshatra_name: string;
  nakshatra_pada: number;
  nakshatra_lord: string;
  degree_str: string;
  psychological_strength: string;
}

export interface HouseData {
  number: number;
  sign: string;
  sign_num: number;
  cusp_degree: number;
  ruler: string;
  planets_in_house: string[];
  interpretation: string;
}

export interface AspectData {
  point1: string;
  point2: string;
  aspect_type: string;
  angle: number;
  orb: number;
  is_applying: boolean;
  is_exact: boolean;
  strength: number;
  interpretation: string;
}

export interface ChartPointData {
  name: string;
  longitude: number;
  sign: string;
  degree_in_sign: number;
  house: number;
  interpretation: string;
}

export interface NatalChartResponse {
  chart_type: string;
  birth_data: {
    datetime: string;
    latitude: number;
    longitude: number;
    timezone: string;
    house_system: string;
    location_name: string;
  };
  house_system: string;
  zodiac_system: string;
  planets: Record<string, PlanetData>;
  houses: HouseData[];
  angles: {
    ASC: number;
    MC: number;
    DSC: number;
    IC: number;
    Vertex: number;
  };
  chart_points: Record<string, ChartPointData>;
  aspects: AspectData[];
  chart_shape: string;
  dominant_element: string;
  dominant_modality: string;
  hemisphere_emphasis: {
    Eastern: number;
    Western: number;
    Northern: number;
    Southern: number;
  };
  element_interpretation: string;
  modality_interpretation: string;
  hemisphere_interpretation: string;
  generated_at: string;
}

/**
 * Fetch natal chart data from the API
 */
export async function fetchNatalChart(data: NatalChartRequest): Promise<NatalChartResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/western/natal-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Natal Chart API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching natal chart:', error);
    return null;
  }
}

/**
 * Get sign from longitude
 */
export function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
}

/**
 * Format degree for display
 */
export function formatDegree(degree: number): string {
  const d = Math.floor(degree);
  const m = Math.floor((degree - d) * 60);
  const s = Math.floor(((degree - d) * 60 - m) * 60);
  return `${d}°${m}'${s}"`;
}

// ==================== TRANSIT TYPES ====================

export interface TransitBirthData {
  datetime: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface TransitPreferences {
  zodiac_system: 'sidereal' | 'tropical';
  ayanamsa_type: 'lahiri' | 'krishnamurti' | 'raman';
  include_system_comparison: boolean;
  language: string;
}

export interface TransitRequest {
  birth_data: TransitBirthData;
  preferences: TransitPreferences;
}

export interface TransitInterpretation {
  psychological: string;
  traditional: string;
  timing: string;
  action_suggestions: string[];
  reflection_prompts: string[];
  western_remedies: string[];
  vedic_remedies: string[];
}

export interface TransitItem {
  transiting_planet: string;
  natal_planet: string;
  aspect_type: string;
  orb: number;
  strength: number;
  tier: 'critical' | 'notable' | 'background';
  transiting_sign: string;
  transiting_house: number;
  is_applying: boolean;
  exact_date: string | null;
  interpretation: TransitInterpretation | null;
  keywords: string[];
  one_line_summary: string;
}

export interface DailyGuidance {
  psychological: string;
  traditional: string;
  timing: string;
  action_suggestions: string[];
  reflection_prompts: string[];
  western_remedies: string[];
  vedic_remedies: string[];
}

export interface PushNotification {
  title: string;
  body: string;
  priority: string;
}

export interface DailyTransitResponse {
  date: string;
  moon_sign: string;
  moon_nakshatra: string;
  overall_rating: number;
  top_focus: string;
  energy_quality: string;
  critical_transits: TransitItem[];
  notable_transits: TransitItem[];
  background_transits: TransitItem[];
  major_events: string[];
  daily_guidance: DailyGuidance;
  push_notification: PushNotification;
  favorable_activities: string[];
  growth_areas: string[];
  tithi: string;
  yoga: string;
  generated_at: string;
}

export interface KeyDay {
  date: string;
  rating: number;
  energy_type: string;
  dominant_transit: string;
  suggestion: string;
}

export interface WeeklyGuidance {
  psychological: string;
  traditional: string;
  timing: string;
  action_suggestions: string[];
  reflection_prompts: string[];
  western_remedies: string[];
  vedic_remedies: string[];
}

export interface MoonPhaseDates {
  new_moon: string | null;
  first_quarter: string | null;
  full_moon: string | null;
  last_quarter: string | null;
}

export interface WeeklyTransitResponse {
  week_start: string;
  week_end: string;
  overall_theme: string;
  week_rating: number;
  key_days: KeyDay[];
  weekly_guidance: WeeklyGuidance;
  major_transits: TransitItem[];
  focus_areas: string[];
  moon_phase_dates: MoonPhaseDates;
  generated_at: string;
}

export interface WeeklyBreakdown {
  week: number;
  start: string;
  end: string;
  rating: number;
  summary: string;
}

export interface LifeAreaForecasts {
  career: string;
  love: string;
  finance: string;
  health: string;
}

export interface MonthlyTransitResponse {
  month: string;
  year: number;
  overall_theme: string;
  month_rating: number;
  new_moon_date: string;
  full_moon_date: string;
  lunar_theme: string;
  weekly_breakdown: WeeklyBreakdown[];
  monthly_guidance: WeeklyGuidance;
  major_events: string[];
  best_days: KeyDay[];
  challenging_days: KeyDay[];
  life_area_forecasts: LifeAreaForecasts;
  focus_areas: string[];
  generated_at: string;
}

export interface QuarterlyBreakdown {
  quarter: number;
  months: string;
  theme: string;
  rating: number;
  primary_focus: string;
  key_transits: string[];
}

export interface EclipseDate {
  date: string;
  type: string;
  theme: string;
}

export interface RetrogradePeriod {
  planet: string;
  start: string;
  end: string;
  theme: string;
}

export interface OuterPlanetThemes {
  jupiter: string;
  saturn: string;
}

export interface YearlyTransitResponse {
  year: number;
  overall_theme: string;
  year_rating: number;
  quarterly_breakdown: QuarterlyBreakdown[];
  yearly_guidance: WeeklyGuidance;
  eclipse_dates: EclipseDate[];
  retrograde_periods: RetrogradePeriod[];
  outer_planet_themes: OuterPlanetThemes;
  major_life_transits: TransitItem[];
  key_dates: KeyDay[];
  focus_areas: string[];
  generated_at: string;
}

/**
 * Fetch daily transit report
 */
export async function fetchDailyTransit(
  birthData: TransitBirthData,
  targetDate?: string,
  preferences?: Partial<TransitPreferences>
): Promise<DailyTransitResponse | null> {
  try {
    const params = new URLSearchParams();
    if (targetDate) params.append('target_date', targetDate);

    const response = await fetch(
      `${HOROSCOPE_API_BASE}/v2/research-optimized/daily-report${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_data: birthData,
          preferences: {
            zodiac_system: 'sidereal',
            ayanamsa_type: 'lahiri',
            include_system_comparison: false,
            language: 'en',
            ...preferences
          }
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Daily Transit API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching daily transit:', error);
    return null;
  }
}

/**
 * Fetch weekly transit forecast
 */
export async function fetchWeeklyTransit(
  birthData: TransitBirthData,
  weekStart?: string,
  preferences?: Partial<TransitPreferences>
): Promise<WeeklyTransitResponse | null> {
  try {
    const params = new URLSearchParams();
    if (weekStart) params.append('week_start', weekStart);

    const response = await fetch(
      `${HOROSCOPE_API_BASE}/v2/research-optimized/weekly-forecast${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_data: birthData,
          preferences: {
            zodiac_system: 'sidereal',
            ayanamsa_type: 'lahiri',
            include_system_comparison: false,
            language: 'en',
            ...preferences
          }
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Weekly Transit API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weekly transit:', error);
    return null;
  }
}

/**
 * Fetch monthly transit forecast
 */
export async function fetchMonthlyTransit(
  birthData: TransitBirthData,
  targetMonth?: number,
  targetYear?: number,
  preferences?: Partial<TransitPreferences>
): Promise<MonthlyTransitResponse | null> {
  try {
    const params = new URLSearchParams();
    if (targetMonth) params.append('target_month', targetMonth.toString());
    if (targetYear) params.append('target_year', targetYear.toString());

    const response = await fetch(
      `${HOROSCOPE_API_BASE}/v2/research-optimized/monthly-forecast${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_data: birthData,
          preferences: {
            zodiac_system: 'sidereal',
            ayanamsa_type: 'lahiri',
            include_system_comparison: false,
            language: 'en',
            ...preferences
          }
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Monthly Transit API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching monthly transit:', error);
    return null;
  }
}

/**
 * Fetch yearly transit forecast
 */
export async function fetchYearlyTransit(
  birthData: TransitBirthData,
  targetYear?: number,
  preferences?: Partial<TransitPreferences>
): Promise<YearlyTransitResponse | null> {
  try {
    const params = new URLSearchParams();
    if (targetYear) params.append('target_year', targetYear.toString());

    const response = await fetch(
      `${HOROSCOPE_API_BASE}/v2/research-optimized/yearly-forecast${params.toString() ? '?' + params.toString() : ''}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_data: birthData,
          preferences: {
            zodiac_system: 'sidereal',
            ayanamsa_type: 'lahiri',
            include_system_comparison: false,
            language: 'en',
            ...preferences
          }
        }),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Yearly Transit API error: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching yearly transit:', error);
    return null;
  }
}

export interface Reader {
  readerId: string;
  displayName: string;
  bio: string;
  profileImageUrl: string;
  isVerified: boolean;
  isAvailable: boolean;
  yearsOfExperience: number;
  ratePerMinute: number;
  ratePerMinuteINR: number;
  averageRating: number;
  totalReadings: number;
  totalMinutesRead: number;
  specializations: Array<{
    specializationId: string;
    name: string;
    iconUrl: string;
  }>;
  currency: string;
}

export interface HoroscopeResponse {
  generated_at: string;
  horoscope_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  personalization_level: string;
  sign: string;
  overview: string;
  detailed_reading?: string;
  love?: string;
  career?: string;
  money?: string;
  health?: string;
  spirituality?: string;
  key_dates?: Record<string, string>;
  power_periods?: string[];
  caution_periods?: string[];
  lucky_numbers?: number[];
  lucky_colors?: string[];
  lucky_days?: string[];
  lucky_direction?: string;
  do_this?: string[];
  avoid_this?: string[];
  daily_mantra?: string;
  compatible_signs?: string[];
  challenging_signs?: string[];
  astronomical_summary?: string;
  active_transits?: string[];
  vedic_summary?: string | null;
  nakshatra_guidance?: string | null;
  overall_rating?: number;
  area_ratings?: {
    love?: number;
    career?: number;
    money?: number;
    health?: number;
    spirituality?: number;
  };
  data_sources?: {
    ephemeris?: string;
    calculation_time?: string;
    planetary_positions?: Record<string, string>;
    moon_phase?: string;
    moon_theme?: string;
    retrograde_planets?: string[];
  };
  // Legacy fields for backward compatibility
  prediction?: string;
  general_prediction?: string;
  finance?: string;
  tip_of_the_day?: string;
}

// ==================== COMPATIBILITY TYPES ====================

export interface CompatibilityData {
  name: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CompatibilityResponse {
  overall_score: number;
  rating: string;
  strengths?: string[];
  challenges?: string[];
  advice?: string[];
  guna_milan?: {
    total_points: number;
    max_points: number;
    percentage: number;
    recommendation: string;
  };
}

/**
 * Get compatibility between two people
 * @param type - Compatibility type (love, friendship, work, sexual, family)
 * @param person1 - First person's birth details
 * @param person2 - Second person's birth details
 */
export async function fetchCompatibility(
  type: string,
  person1: CompatibilityData,
  person2: CompatibilityData
): Promise<CompatibilityResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/compatibility/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ person1, person2 }),
      cache: 'no-store' // Don't cache compatibility calculations
    });

    if (!response.ok) {
      console.error(`Compatibility API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching compatibility:', error);
    return null;
  }
}

/**
 * Fetch all available readers
 */
export async function fetchReaders(): Promise<Reader[]> {
  try {
    const response = await fetch(`${READERS_API_BASE}/readers`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch readers');
    }
    
    const data = await response.json();
    return data.readers || [];
  } catch (error) {
    console.error('Error fetching readers:', error);
    return [];
  }
}

/**
 * Fetch a single reader by ID
 */
export async function fetchReader(readerId: string): Promise<Reader | null> {
  try {
    const response = await fetch(`${READERS_API_BASE}/readers/${readerId}`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch reader');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reader:', error);
    return null;
  }
}

/**
 * Fetch daily horoscope for a specific sign
 */
export async function fetchDailyHoroscope(sign: string, tone: string = 'warm'): Promise<HoroscopeResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/horoscope/enhanced/sign-only/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sun_sign: sign,
        horoscope_type: 'daily',
        tone: tone,
      }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch horoscope');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily horoscope:', error);
    return null;
  }
}

/**
 * Fetch weekly horoscope for a specific sign
 */
export async function fetchWeeklyHoroscope(sign: string, tone: string = 'warm'): Promise<HoroscopeResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/horoscope/enhanced/sign-only/weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sun_sign: sign,
        horoscope_type: 'weekly',
        tone: tone,
      }),
      next: { revalidate: 7200 } // Cache for 2 hours
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch weekly horoscope');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    return null;
  }
}

/**
 * Fetch monthly horoscope for a specific sign
 */
export async function fetchMonthlyHoroscope(sign: string, tone: string = 'warm'): Promise<HoroscopeResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/horoscope/enhanced/sign-only/monthly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sun_sign: sign,
        horoscope_type: 'monthly',
        tone: tone,
      }),
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch monthly horoscope');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    return null;
  }
}

/**
 * Fetch yearly horoscope for a specific sign
 */
export async function fetchYearlyHoroscope(sign: string, tone: string = 'warm'): Promise<HoroscopeResponse | null> {
  try {
    const response = await fetch(`${HOROSCOPE_API_BASE}/v1/horoscope/enhanced/sign-only/yearly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sun_sign: sign,
        horoscope_type: 'yearly',
        tone: tone,
      }),
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch yearly horoscope');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching yearly horoscope:', error);
    return null;
  }
}

/**
 * Fetch all zodiac signs' daily horoscopes
 */
export async function fetchAllDailyHoroscopes(tone: string = 'warm'): Promise<HoroscopeResponse[]> {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  try {
    // Fetch in batches to avoid overwhelming the API
    const batchSize = 3;
    const results: HoroscopeResponse[] = [];
    
    for (let i = 0; i < signs.length; i += batchSize) {
      const batch = signs.slice(i, i + batchSize);
      const batchPromises = batch.map(sign => fetchDailyHoroscope(sign, tone));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter((h): h is HoroscopeResponse => h !== null));
      // Small delay between batches
      if (i + batchSize < signs.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching all horoscopes:', error);
    return [];
  }
}

/**
 * Format reader data for display
 */
export function formatReaderForDisplay(reader: Reader) {
  return {
    id: reader.readerId,
    name: reader.displayName,
    image: reader.profileImageUrl,
    bio: reader.bio,
    rating: reader.averageRating,
    experience: reader.yearsOfExperience,
    readings: reader.totalReadings > 1000 ? `${(reader.totalReadings / 1000).toFixed(1)}K` : reader.totalReadings.toString(),
    rate: `$${reader.ratePerMinute.toFixed(2)}`,
    rateValue: reader.ratePerMinute,
    specialties: reader.specializations.map(s => s.name).slice(0, 3),
    available: reader.isAvailable,
    verified: reader.isVerified,
  };
}

// ==================== GEOCODING ====================

export interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  display_name: string;
}

/**
 * Search for location suggestions using Nominatim (OpenStreetMap)
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}` +
      `&format=json` +
      `&limit=5` +
      `&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Zodiak-Website/1.0',
        },
      }
    );

    if (!response.ok) return [];
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Get geocode data from a location selection
 */
export function geocodeLocation(location: LocationSuggestion): GeocodeResult {
  return {
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon),
    display_name: location.display_name,
  };
}


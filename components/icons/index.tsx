'use client';

// Professional SVG Icon Library - Award-Winning Design

export const SunIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MoonIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const HeartIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const StarIcon = ({ size = 24, className = "", filled = false }: { size?: number; className?: string; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const SparklesIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
);

export const CompassIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const UsersIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CalendarIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const ChartIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 16l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="16" r="1.5" fill="currentColor"/>
    <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="14" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="8" r="1.5" fill="currentColor"/>
  </svg>
);

export const MessageIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
);

export const GlobeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const ZapIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2"/>
  </svg>
);

export const ClockIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BookIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const TrendingIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.5"/>
    <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const TargetIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const CheckCircleIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BrainIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.7C7 6.3 6.3 7 5.2 7 3.4 7 2 8.4 2 10.2c0 1.2.7 2.3 1.7 2.8.6.3 1 .9 1 1.5v1c0 1.4 1.1 2.5 2.5 2.5h.3c.6 0 1.2.4 1.4 1 .4 1 1.4 1.5 2.4 1.1.6-.2 1-.8 1-1.4v-2.7c0-.6.5-1 1-1s1 .5 1 1v2.7c0 .6.5 1.2 1 1.4 1 .4 2-.1 2.4-1.1.2-.6.8-1 1.4-1h.3c1.4 0 2.5-1.1 2.5-2.5v-1c0-.6.4-1.2 1-1.5 1-.5 1.7-1.6 1.7-2.8 0-1.8-1.4-3.2-3.2-3.2-1.1 0-1.8-.7-1.8-1.8V4.5A2.5 2.5 0 0 0 14.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== COMPATIBILITY ICONS ====================

export const LoveIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.5v4.5M10 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const FriendshipIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11v-1M16 7v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const WorkIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 12h10M12 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const ChemistryIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="15" r="1" fill="currentColor" opacity="0.5"/>
    <circle cx="14" cy="17" r="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const FamilyIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 21V7a3 3 0 0 1 6 0v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="15" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

// ==================== ZODIAC SIGN ICONS ====================

export const AriesIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 18C4 14 7 10 12 10C17 10 20 14 20 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 18V6M20 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="4" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const TaurusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 6C7 3 17 3 20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const GeminiIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 4H18M6 20H18M8 4V20M16 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CancerIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="7" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="17" cy="15" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 9C3 12 6 15 12 15M21 15C21 12 18 9 12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LeoIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 11C10 14 12 16 12 19C12 21 14 21 14 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const VirgoIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4V12C4 14 6 16 8 16M8 4V16M12 4V12C12 14 14 16 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 12C16 14 18 16 20 16C20 18 18 20 16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LibraIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 20H21M3 14H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 14V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 4C6 6 8 8 12 8C16 8 18 6 18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ScorpioIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4V12C4 14 6 16 8 16M8 4V16M12 4V12C12 14 14 16 16 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 16H20L17 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SagittariusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 20L20 4M20 4H14M20 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CapricornIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4V12C4 14 6 16 8 16C10 16 12 14 12 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12C12 14 14 16 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const AquariusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PiscesIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 12H20M7 4C4 6 4 10 4 12C4 14 4 18 7 20M17 4C20 6 20 10 20 12C20 14 20 18 17 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ==================== PLANET ICONS ====================

export const MercuryIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 15V21M9 19H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 5C8 3 10 2 12 2C14 2 16 3 16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const VenusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 15V22M9 19H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MarsIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="10" cy="14" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 9L20 4M20 4H15M20 4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const JupiterIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4C8 4 12 4 14 8C16 12 12 16 8 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SaturnIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 4H12M9 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 14C8 12 16 12 20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const UranusIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="18" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 14V4M8 8L12 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
  </svg>
);

export const NeptuneIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4V20M8 8L12 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const PlutoIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 13V20M9 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RahuIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4C7 4 4 8 4 12C4 16 7 20 12 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 4L15 7L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const KetuIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4C17 4 20 8 20 12C20 16 17 20 12 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 20L9 17L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== ASPECT ICONS ====================

export const ConjunctionIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

export const OppositionIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="6" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const TrineIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const SquareIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const SextileIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L20 12L12 20L4 12L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" transform="rotate(45 12 12)"/>
  </svg>
);

// ==================== HOUSE ICONS ====================

export const HouseIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V13H15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AscendantIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3V12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MidheavenIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3V12M12 12H3M12 12L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ==================== ELEMENT ICONS ====================

export const FireIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8 6 6 10 6 14C6 18 9 21 12 21C15 21 18 18 18 14C18 10 16 6 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21C10 21 9 19 9 17C9 15 10 13 12 11C14 13 15 15 15 17C15 19 14 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

export const EarthIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const AirIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 8H16C18 8 20 6 20 4C20 2 18 2 17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 12H18C20 12 21 14 21 15C21 17 19 17 18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 16H14C16 16 17 18 17 19C17 21 15 21 14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const WaterIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3C8 8 5 12 5 16C5 20 8 22 12 22C16 22 19 20 19 16C19 12 16 8 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16C8 14 10 12 12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// ==================== UI ICONS ====================

export const LoadingIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.25"/>
    <path d="M12 2C6.5 2 2 6.5 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ArrowRightIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InfoIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LocationIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


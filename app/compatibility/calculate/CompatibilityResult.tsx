'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, StarIcon, CheckCircleIcon, InfoIcon, ArrowRightIcon, 
  MoonIcon, SunIcon, SparklesIcon, UsersIcon 
} from '@/components/icons';
import { CompatibilityResponse, KootScore, Dosha } from '@/lib/api';

interface CompatibilityResultProps {
  result: CompatibilityResponse;
  currentType: { color: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  onReset: () => void;
}

// Circular Score Display
const CircularScore = ({ score, maxScore, color }: { score: number; maxScore: number; color: string }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light" style={{ color }}>{score}</span>
        <span className="text-xs text-white/30">/ {maxScore}</span>
      </div>
    </div>
  );
};

// Expandable Koot Card
const KootCard = ({ koot, index }: { koot: KootScore; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = (koot.obtained_points / koot.max_points) * 100;
  const tierColor = koot.details.tier === 'high' ? '#48BB78' : koot.details.tier === 'medium' ? '#F59E0B' : '#EF4444';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-minimal rounded-none border border-white/[0.05] overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 hover:bg-white/[0.02] transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-light">{koot.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full border" style={{ 
                color: tierColor, 
                borderColor: `${tierColor}40`,
                backgroundColor: `${tierColor}10`
              }}>
                {koot.details.tier}
              </span>
            </div>
            <p className="text-sm text-white/50 font-light leading-relaxed mb-3">{koot.description}</p>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>{koot.obtained_points}/{koot.max_points} points</span>
              <span className="text-white/20">•</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ArrowRightIcon size={20} className="text-white/20 rotate-90" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 space-y-4 border-t border-white/[0.05]">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Person 1</p>
                  <p className="text-sm text-white/60 font-light">{koot.details.person1_value}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Person 2</p>
                  <p className="text-sm text-white/60 font-light">{koot.details.person2_value}</p>
                </div>
              </div>
              
              {koot.details.strengths && koot.details.strengths.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Strengths</p>
                  <ul className="space-y-1">
                    {koot.details.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <CheckCircleIcon size={14} className="text-[#48BB78] mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {koot.details.growth_areas && koot.details.growth_areas.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Growth Areas</p>
                  <ul className="space-y-1">
                    {koot.details.growth_areas.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="text-[#F59E0B] mt-0.5">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-2 border-t border-white/[0.05]">
                <p className="text-sm text-white/60 font-light italic">"{koot.details.advice}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Dosha Card
const DoshaCard = ({ dosha, index }: { dosha: Dosha; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const severityColor = dosha.severity === 'significant' ? '#EF4444' : dosha.severity === 'medium' ? '#F59E0B' : '#63B3ED';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-minimal rounded-none border"
      style={{ borderColor: dosha.is_cancelled ? '#48BB78' : `${severityColor}40` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 hover:bg-white/[0.02] transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-light">{dosha.name}</h4>
              {dosha.is_cancelled && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#48BB78]/20 text-[#48BB78] border border-[#48BB78]/40">
                  Cancelled
                </span>
              )}
              {!dosha.is_cancelled && (
                <span className="text-xs px-2 py-0.5 rounded-full border" style={{
                  color: severityColor,
                  borderColor: `${severityColor}40`,
                  backgroundColor: `${severityColor}10`
                }}>
                  {dosha.severity}
                </span>
              )}
            </div>
            <p className="text-sm text-white/50 font-light leading-relaxed mb-2">{dosha.description}</p>
            <p className="text-xs text-white/40 font-light">{dosha.impact}</p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ArrowRightIcon size={20} className="text-white/20 rotate-90" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {expanded && dosha.remedies && dosha.remedies.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 space-y-3 border-t border-white/[0.05]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider pt-4">Remedies</p>
              <div className="grid md:grid-cols-2 gap-3">
                {dosha.remedies.map((remedy, i) => (
                  <div key={i} className="p-3 bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded border" style={{
                        color: remedy.type === 'practice' ? '#63B3ED' : '#F59E0B',
                        borderColor: remedy.type === 'practice' ? '#63B3ED40' : '#F59E0B40',
                        backgroundColor: remedy.type === 'practice' ? '#63B3ED10' : '#F59E0B10'
                      }}>
                        {remedy.type}
                      </span>
                    </div>
                    <p className="text-sm font-light text-white/70 mb-1">{remedy.title}</p>
                    <p className="text-xs text-white/50 font-light">{remedy.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function CompatibilityResult({ result, currentType, onReset }: CompatibilityResultProps) {
  const CurrentIcon = currentType.icon;
  
  // Find Emotional Wavelength and Energy Balance koot scores
  const emotionalWavelength = result.guna_milan.koot_scores.find(k => k.name === 'Emotional Wavelength');
  const energyBalance = result.guna_milan.koot_scores.find(k => k.name === 'Energy Balance');
  
  return (
    <div className="min-h-screen pb-24">
      {/* 1. Hero / Overview Screen */}
      <section className="px-6 pt-12 pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
            <div style={{ color: currentType.color }}>
              <CurrentIcon size={20} />
            </div>
            <span className="mono text-[10px] text-white/40 tracking-[0.3em] uppercase">
              {result.compatibility_type.toUpperCase()} COMPATIBILITY
            </span>
          </div>
          
          <div className="mb-8">
            <CircularScore 
              score={result.overall_score} 
              maxScore={100} 
              color={currentType.color} 
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-4" style={{ color: currentType.color }}>
            {result.overall_score}/100
          </h1>
          <p className="text-2xl text-white/60 font-light mb-8">{result.rating}</p>
          
          {/* Guna Milan Tooltip */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/[0.05] mb-8">
            <div className="text-center">
              <p className="text-2xl font-light" style={{ color: currentType.color }}>
                {result.guna_milan.percentage.toFixed(1)}%
              </p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Guna Milan</p>
            </div>
            <div className="h-12 w-px bg-white/10"></div>
            <div className="text-left">
              <p className="text-sm text-white/50 font-light">{result.guna_milan.recommendation}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Quick Summary (TL;DR) */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-minimal p-8 md:p-12 rounded-none"
        >
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">QUICK SUMMARY</p>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
            {result.detailed_interpretation}
          </p>
        </motion.div>
      </section>

      {/* 3. Strengths */}
      {result.strengths && result.strengths.length > 0 && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircleIcon size={24} className="text-[#48BB78]" />
              <h2 className="text-3xl md:text-4xl font-light">Strengths</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.strengths.map((strength, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="card-minimal p-5 rounded-none border-l-2 border-[#48BB78]/30"
                >
                  <p className="text-white/70 font-light leading-relaxed">{strength}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 4. Challenges */}
      {result.challenges && result.challenges.length > 0 && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <InfoIcon size={24} className="text-[#F59E0B]" />
              <h2 className="text-3xl md:text-4xl font-light">Growth Areas</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.challenges.map((challenge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="card-minimal p-5 rounded-none border-l-2 border-[#F59E0B]/30"
                >
                  <p className="text-white/70 font-light leading-relaxed">{challenge}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 5. Guna Milan Breakdown */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <StarIcon size={24} className="text-[#818CF8]" />
            <h2 className="text-3xl md:text-4xl font-light">Guna Milan Breakdown</h2>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {result.guna_milan.koot_scores.map((koot, i) => (
              <KootCard key={i} koot={koot} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. Dosha Section */}
      {result.guna_milan.doshas && result.guna_milan.doshas.length > 0 && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <InfoIcon size={24} className="text-[#EF4444]" />
              <h2 className="text-3xl md:text-4xl font-light">Doshas</h2>
            </div>
            <div className="space-y-4">
              {result.guna_milan.doshas.map((dosha, i) => (
                <DoshaCard key={i} dosha={dosha} index={i} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 7. Emotional & Energy Compatibility */}
      {(emotionalWavelength || energyBalance) && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {emotionalWavelength && (
              <div className="card-minimal p-8 rounded-none">
                <div className="flex items-center gap-3 mb-4">
                  <MoonIcon size={20} className="text-[#63B3ED]" />
                  <h3 className="text-xl font-light">Emotional Wavelength</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-light" style={{ color: currentType.color }}>
                      {emotionalWavelength.obtained_points}
                    </span>
                    <span className="text-white/30">/ {emotionalWavelength.max_points}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000"
                      style={{ 
                        width: `${(emotionalWavelength.obtained_points / emotionalWavelength.max_points) * 100}%`,
                        backgroundColor: currentType.color
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {emotionalWavelength.description}
                </p>
              </div>
            )}
            
            {energyBalance && (
              <div className="card-minimal p-8 rounded-none">
                <div className="flex items-center gap-3 mb-4">
                  <SunIcon size={20} className="text-[#F59E0B]" />
                  <h3 className="text-xl font-light">Energy Balance</h3>
                </div>
                <div className="mb-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Person 1</p>
                    <p className="text-sm text-white/60 font-light">{energyBalance.details.person1_value}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Person 2</p>
                    <p className="text-sm text-white/60 font-light">{energyBalance.details.person2_value}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {energyBalance.description}
                </p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* 8. Element Compatibility */}
      {result.element_compatibility && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card-minimal p-8 md:p-12 rounded-none"
          >
            <h3 className="text-2xl font-light mb-6">Element Compatibility</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Sun Elements</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-sm text-white/60">{result.element_compatibility.person1_sun_element}</p>
                  </div>
                  <span className="text-white/20">×</span>
                  <div className="flex-1 text-center p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-sm text-white/60">{result.element_compatibility.person2_sun_element}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Moon Elements</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-sm text-white/60">{result.element_compatibility.person1_moon_element}</p>
                  </div>
                  <span className="text-white/20">×</span>
                  <div className="flex-1 text-center p-3 bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-sm text-white/60">{result.element_compatibility.person2_moon_element}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/[0.05]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/40">Compatibility Score</span>
                <span className="text-2xl font-light" style={{ color: currentType.color }}>
                  {result.element_compatibility.average}/3
                </span>
              </div>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                {result.element_compatibility.interpretation}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* 9. Synastry Aspects */}
      {result.synastry_aspects && result.synastry_aspects.length > 0 && (
        <section className="px-6 pb-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <SparklesIcon size={24} className="text-[#818CF8]" />
              <h2 className="text-3xl md:text-4xl font-light">Synastry Aspects</h2>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {result.synastry_aspects.map((aspect, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.02 }}
                  className="card-minimal p-4 rounded-none flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-light text-white/70">{aspect.planet1}</span>
                    <span className="text-xs text-white/30">{aspect.aspect_type}</span>
                    <span className="text-sm font-light text-white/70">{aspect.planet2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      aspect.is_harmonious 
                        ? 'text-[#48BB78] border-[#48BB78]/40 bg-[#48BB78]/10' 
                        : 'text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10'
                    }`}>
                      {aspect.is_harmonious ? 'Harmonious' : 'Challenging'}
                    </span>
                    <span className="text-xs text-white/30 w-12 text-right">{aspect.weight.toFixed(1)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* 10. Partner Profiles */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[result.guna_milan.person1_details, result.guna_milan.person2_details].map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="card-minimal p-8 rounded-none"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.05]">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <UsersIcon size={20} className="text-white/40" />
                </div>
                <h3 className="text-xl font-light">Person {i + 1}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-base text-white/70 font-light">{person.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Moon Sign</p>
                  <p className="text-base text-white/70 font-light">{person.moon_sign}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Nakshatra</p>
                  <p className="text-base text-white/70 font-light">{person.nakshatra}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Temperament</p>
                  <p className="text-base text-white/70 font-light">{person.temperament}</p>
                  <p className="text-xs text-white/50 font-light mt-1">{person.temperament_archetype}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Intimacy Style</p>
                  <p className="text-base text-white/70 font-light">{person.intimacy_style}</p>
                  {person.intimacy_essence && (
                    <p className="text-xs text-white/50 font-light mt-1">{person.intimacy_essence}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Constitution</p>
                  <p className="text-base text-white/70 font-light">{person.constitution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 11. Practical Advice (Sticky) */}
      {result.advice && result.advice.length > 0 && (
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="card-minimal p-8 md:p-12 rounded-none border-2"
            style={{ borderColor: `${currentType.color}40` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span style={{ color: currentType.color }}>
                <SparklesIcon size={24} />
              </span>
              <h2 className="text-2xl md:text-3xl font-light">Practical Advice</h2>
            </div>
            <ul className="space-y-4">
              {result.advice.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                    backgroundColor: `${currentType.color}20`,
                    border: `1px solid ${currentType.color}40`
                  }}>
                    <span className="text-xs font-light" style={{ color: currentType.color }}>{i + 1}</span>
                  </div>
                  <p className="text-base text-white/70 font-light leading-relaxed flex-1">{item}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>
      )}
    </div>
  );
}

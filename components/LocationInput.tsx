'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { GlobeIcon } from '@/components/icons';
import { searchLocations, geocodeLocation, LocationSuggestion, GeocodeResult } from '@/lib/api';

interface LocationInputProps {
  value: string;
  onChange: (value: string, geocode?: GeocodeResult) => void;
  placeholder?: string;
  required?: boolean;
  color?: string;
  label?: string;
}

export default function LocationInput({ 
  value, 
  onChange, 
  placeholder = "Start typing a city...",
  required = false,
  color = '#63B3ED',
  label = 'PLACE OF BIRTH'
}: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update dropdown position relative to input
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4, // Use viewport coordinates for fixed positioning
        left: rect.left,
        width: rect.width
      });
    }
  }, []);

  // Update position on scroll/resize/input changes
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showSuggestions, updateDropdownPosition, suggestions]);

  // Initialize query from value on mount
  useEffect(() => {
    if (value && !query) {
      setQuery(value);
      setIsSelected(true);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if just selected
    if (isSelected) {
      return;
    }

    // Only search if query is long enough
    if (query.length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchLocations(query);
          setSuggestions(results);
          if (results.length > 0) {
            updateDropdownPosition();
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      }, 350);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, isSelected]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsSelected(false);
    onChange(newValue); // Just update text, no geocode
  };

  const handleSelectLocation = useCallback((location: LocationSuggestion) => {
    const geocode = geocodeLocation(location);
    const shortName = location.display_name.split(',').slice(0, 2).join(',').trim();
    
    setIsSelected(true);
    setQuery(shortName);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Use setTimeout to ensure state updates before callback
    setTimeout(() => {
      onChange(shortName, geocode);
    }, 0);
  }, [onChange]);

  return (
    <div className="relative" style={{ isolation: 'isolate', zIndex: 100 }}>
      {label && (
        <label className="block text-xs text-white/50 mb-2 tracking-wide flex items-center gap-2">
          <GlobeIcon size={14} />
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full px-6 py-4 bg-white/[0.02] border border-white/[0.08] rounded-none
                   text-white placeholder-white/20 placeholder:font-light placeholder:tracking-wide
                   transition-all duration-300 outline-none font-light
                   focus:border-white/20 focus:bg-white/[0.04] focus:placeholder-white/30"
          onFocus={() => {
            updateDropdownPosition();
            if (suggestions.length > 0 && !isSelected) {
              setShowSuggestions(true);
            }
          }}
        />
        
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
          </div>
        )}
        
        {isSelected && !isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 text-[#48BB78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown - Portal to body for proper z-index, positioned near input */}
      {showSuggestions && suggestions.length > 0 && typeof window !== 'undefined' && inputRef.current && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-[#0F172A] border border-white/10 shadow-2xl max-h-60 overflow-y-auto"
          style={{ 
            backdropFilter: 'blur(20px)',
            zIndex: 10000,
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width || inputRef.current.offsetWidth}px`,
            minWidth: '200px'
          }}
        >
          {suggestions.map((suggestion, index) => {
            const parts = suggestion.display_name.split(',');
            const primary = parts.slice(0, 2).join(',').trim();
            const secondary = parts.slice(2, 4).join(',').trim();
            
            return (
              <button
                key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectLocation(suggestion);
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/[0.05] transition-colors border-b border-white/[0.05] last:border-b-0 group"
              >
                <div className="flex items-start gap-3">
                  <GlobeIcon size={14} className="mt-1 flex-shrink-0 text-white/30 group-hover:text-white/50 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/80 font-light group-hover:text-white transition-colors">
                      {primary}
                    </div>
                    {secondary && (
                      <div className="text-xs text-white/30 mt-0.5">
                        {secondary}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

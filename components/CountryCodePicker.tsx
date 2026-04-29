'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { COUNTRY_DIAL_CODES, type CountryDialCode } from '@/lib/countryDialCodes';

type CountryCodePickerProps = {
  value: CountryDialCode;
  onChange: (country: CountryDialCode) => void;
  disabled?: boolean;
};

export default function CountryCodePicker({ value, onChange, disabled }: CountryCodePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const searchId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        setQuery('');
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
      );
    });
  }, [query]);

  const triggerLabel = `Country calling code, ${value.name}, ${value.dialCode}. ${open ? 'Expanded' : 'Collapsed'}.`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[52px] px-2 sm:px-3 bg-white/[0.03] border border-white/[0.14] text-left flex items-center justify-between gap-1 sm:gap-2 hover:bg-white/[0.05] hover:border-white/[0.18] transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={triggerLabel}
      >
        <span className="flex items-center gap-1.5 min-w-0 overflow-hidden" aria-hidden="true">
          <span className="text-base leading-none shrink-0">{value.flag}</span>
          <span className="text-xs sm:text-sm text-white/90 mono tracking-wide truncate">{value.dialCode}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/35 shrink-0" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close country picker"
            onClick={() => {
              setOpen(false);
              setQuery('');
              triggerRef.current?.focus();
            }}
          />
          <div className="absolute z-50 mt-2 w-[min(92vw,420px)] left-0 border border-white/[0.12] bg-[#0B1220]/95 backdrop-blur-md shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="p-3 border-b border-white/[0.08]">
              <label htmlFor={searchId} className="sr-only">
                Search countries by name, code, or dial prefix
              </label>
              <input
                id={searchId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full bg-transparent border border-white/[0.12] px-3 py-2 text-sm text-white/90 outline-none focus:border-[#63B3ED]/50 focus-visible:ring-2 focus-visible:ring-[#63B3ED]/40 focus-visible:ring-inset"
                autoFocus
              />
            </div>
            <div
              id={listboxId}
              role="listbox"
              aria-label="Countries and calling codes"
              className="max-h-[320px] overflow-y-auto"
            >
              {filtered.map((c) => {
                const selected = c.code === value.code && c.dialCode === value.dialCode;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#63B3ED]/50 ${
                      selected ? 'bg-white/[0.04]' : ''
                    }`}
                    onClick={() => {
                      onChange(c);
                      setOpen(false);
                      setQuery('');
                      triggerRef.current?.focus();
                    }}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="text-lg leading-none" aria-hidden="true">
                        {c.flag}
                      </span>
                      <span className="text-sm text-white/85 font-light truncate">{c.name}</span>
                    </span>
                    <span className="mono text-xs text-white/70 tabular-nums">{c.dialCode}</span>
                  </button>
                );
              })}
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-sm text-white/45" role="status">
                  No matches.
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

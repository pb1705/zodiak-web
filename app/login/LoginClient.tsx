'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { ZodiakLogo } from '@/components/ZodiakLogo';
import CountryCodePicker from '@/components/CountryCodePicker';
import { COUNTRY_DIAL_CODES, type CountryDialCode } from '@/lib/countryDialCodes';

type SocialProvider = 'google' | 'apple';

type GoogleCredentialResponse = {
  credential?: string;
};

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://s400.zodiak.life';
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID || '1';
const GOOGLE_WEB_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  '1049109311543-s2kp8fs5fdmlrjvjlckhsu23mr7v7ctb.apps.googleusercontent.com';
const APPLE_SERVICES_ID = process.env.NEXT_PUBLIC_APPLE_SERVICES_ID || '';
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || '';

export default function LoginClient() {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<CountryDialCode>(COUNTRY_DIAL_CODES[0]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const phoneFieldId = useId();
  const otpFieldId = useId();
  const authStatusId = useId();
  const phoneCountryLabelId = useId();

  // Start false (matches SSR) — set after hydration so server/client HTML agree
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  useEffect(() => {
    setIsAppleDevice(/iphone|ipad|ipod|macintosh/i.test(window.navigator.userAgent));
  }, []);

  const handleAuthSuccess = useCallback((data: any) => {
    const authData = data?.data ?? data;
    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;
    const user = authData?.user;

    if (accessToken) localStorage.setItem('zodiak_access_token', accessToken);
    if (refreshToken) localStorage.setItem('zodiak_refresh_token', refreshToken);
    if (user) localStorage.setItem('zodiak_user', JSON.stringify(user));

    setStatusMessage('Welcome. Redirecting...');
    window.location.href = '/';
  }, []);

  const normalizedPhoneNumber = useMemo(() => {
    // Strip everything except digits and a leading +
    const trimmed = phone.trim();

    // If the user's autofill included a full E.164 number (e.g. +919876543210)
    if (trimmed.startsWith('+')) {
      return trimmed.replace(/[^\d+]/g, ''); // keep + and digits only
    }

    // Digits only from here
    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return '';

    const dialDigits = selectedCountry.dialCode.replace(/\D/g, ''); // e.g. "91" from "+91"

    // If autofill prepended the country code (e.g. "919876543210" when dial is +91)
    if (digits.startsWith(dialDigits) && digits.length > dialDigits.length) {
      return `+${digits}`;
    }

    // Strip a single leading 0 (trunk prefix used in many countries, e.g. UK "07911123456")
    const local = digits.startsWith('0') ? digits.slice(1) : digits;

    return `${selectedCountry.dialCode}${local}`;
  }, [selectedCountry.dialCode, phone]);

  const authenticateWithBackend = useCallback(
    async ({ provider, idToken }: { provider: SocialProvider; idToken: string }) => {
      setLoadingProvider(provider);
      setStatusMessage('');

      try {
        const endpoint = provider === 'google' ? '/api/v1/auth/google' : '/api/v1/auth/apple';

        const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Business-Id': BUSINESS_ID,
          },
          body: JSON.stringify({ idToken }),
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.errorMessage || `Unable to continue with ${provider}.`);
        }

        handleAuthSuccess(result);
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : 'Authentication failed.');
      } finally {
        setLoadingProvider(null);
      }
    },
    [handleAuthSuccess]
  );

  const initializeGoogleSignIn = useCallback(() => {
    const w = window as any;
    if (!w.google?.accounts?.id || !GOOGLE_WEB_CLIENT_ID) return;

    w.google.accounts.id.initialize({
      client_id: GOOGLE_WEB_CLIENT_ID,
      callback: (response: GoogleCredentialResponse) => {
        if (!response?.credential) {
          setStatusMessage('Google did not return a valid token.');
          return;
        }
        void authenticateWithBackend({ provider: 'google', idToken: response.credential });
      },
      ux_mode: 'popup',
      auto_select: false,
    });
  }, [authenticateWithBackend]);

  const handleGoogleSignIn = useCallback(() => {
    const w = window as any;
    if (!w.google?.accounts?.id) {
      setStatusMessage('Google Sign-In is not ready yet. Please try again.');
      return;
    }
    w.google.accounts.id.prompt();
  }, []);

  const handleAppleSignIn = useCallback(async () => {
    if (!isAppleDevice) return;

    const w = window as any;
    if (!w.AppleID?.auth) {
      setStatusMessage('Apple Sign-In is not available right now.');
      return;
    }
    if (!APPLE_SERVICES_ID) {
      setStatusMessage('Apple Sign-In is not configured yet.');
      return;
    }

    try {
      setLoadingProvider('apple');
      setStatusMessage('');

      w.AppleID.auth.init({
        clientId: APPLE_SERVICES_ID,
        scope: 'name email',
        redirectURI: APPLE_REDIRECT_URI || `${window.location.origin}/login`,
        state: `zodiak-${Date.now()}`,
        usePopup: true,
      });

      const response = await w.AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;

      if (!idToken) {
        throw new Error('Apple did not return a valid token.');
      }

      await authenticateWithBackend({ provider: 'apple', idToken });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Apple Sign-In failed.');
      setLoadingProvider(null);
    }
  }, [authenticateWithBackend, isAppleDevice]);

  const handleSendOtp = useCallback(async () => {
    if (!normalizedPhoneNumber) {
      setStatusMessage('Please enter a valid mobile number.');
      return;
    }

    setOtpLoading(true);
    setStatusMessage('');
    try {
      const response = await fetch(`${AUTH_BASE_URL}/api/v1/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Business-Id': BUSINESS_ID,
        },
        body: JSON.stringify({ phoneNumber: normalizedPhoneNumber }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.errorMessage || 'Unable to send OTP right now.');
      }
      setOtpStep('verify');
      setStatusMessage('OTP sent. Enter the 6-digit code.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  }, [normalizedPhoneNumber]);

  const handleVerifyOtp = useCallback(async () => {
    const otpDigits = otp.replace(/\D/g, '');
    if (otpDigits.length !== 6) {
      setStatusMessage('Please enter a valid 6-digit OTP.');
      return;
    }

    setOtpLoading(true);
    setStatusMessage('');
    try {
      const response = await fetch(`${AUTH_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Business-Id': BUSINESS_ID,
        },
        body: JSON.stringify({
          phoneNumber: normalizedPhoneNumber,
          otp: otpDigits,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.errorMessage || 'OTP verification failed.');
      }
      handleAuthSuccess(result);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    } finally {
      setOtpLoading(false);
    }
  }, [otp, normalizedPhoneNumber, handleAuthSuccess]);

  const authBusy = otpLoading || loadingProvider !== null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F172A] text-white" lang="en">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogleSignIn} />
      {isAppleDevice ? (
        <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" strategy="afterInteractive" />
      ) : null}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.45) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-240px] right-[-200px] w-[640px] h-[640px] rounded-full opacity-[0.09] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.4) 0%, transparent 72%)' }}
        />
      </div>

      <section className="relative z-10 px-6 pt-10 pb-20 md:pt-14 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10 md:mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              aria-label="Zodiak — Return to home"
            >
              <ZodiakLogo size={148} />
            </Link>
            <Link
              href="/"
              className="btn-minimal px-6 py-2 text-[10px] md:text-xs mono tracking-[0.2em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="card-minimal p-7 md:p-10 border-white/[0.08]">
              <p className="mono text-[10px] tracking-[0.25em] uppercase text-white/50 mb-4">Member Access</p>
              <h1 className="text-4xl md:text-5xl font-light leading-tight tracking-tight mb-3">
                Continue to Zodiak
              </h1>
              <p id={`${phoneCountryLabelId}-hint`} className="text-white/65 font-light mb-8 leading-relaxed">
                Enter your mobile number. We will send a one-time code — no passwords, no friction.
              </p>

              <div className="space-y-4 mb-7" aria-busy={authBusy}>
                {otpStep === 'phone' ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleSendOtp();
                    }}
                  >
                    <p id={phoneCountryLabelId} className="sr-only">
                      Country and phone number for one-time password delivery
                    </p>
                    <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] gap-2 sm:gap-3" role="group" aria-labelledby={phoneCountryLabelId}>
                      <CountryCodePicker
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        disabled={authBusy}
                      />
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor={phoneFieldId} className="sr-only">
                          Mobile number without country code
                        </label>
                        <input
                          id={phoneFieldId}
                          type="tel"
                          name="phone"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="Mobile number"
                          value={phone}
                          onChange={(e) => {
                            const raw = e.target.value;
                            // If autofill pastes a full E.164 or local-prefixed number, clean it
                            const dialDigits = selectedCountry.dialCode.replace(/\D/g, '');
                            let cleaned = raw;
                            // Strip leading + and country code (e.g. +91 → "")
                            if (cleaned.startsWith('+')) {
                              cleaned = cleaned.replace(/^\+\d{1,4}\s?/, '');
                            // Strip numeric country code prefix without + (e.g. "91XXXXXXXX")
                            } else if (cleaned.replace(/\D/g, '').startsWith(dialDigits) &&
                                       cleaned.replace(/\D/g, '').length > dialDigits.length + 4) {
                              cleaned = cleaned.replace(/\D/g, '').slice(dialDigits.length);
                            // Strip single leading trunk zero
                            } else if (/^\s*0/.test(cleaned)) {
                              cleaned = cleaned.replace(/^\s*0/, '');
                            }
                            setPhone(cleaned);
                          }}
                          className="input-premium text-base md:text-lg placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#63B3ED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                          aria-required="true"
                          aria-describedby={
                            statusMessage
                              ? `${phoneCountryLabelId}-hint ${authStatusId}`
                              : `${phoneCountryLabelId}-hint`
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-trust py-[18px] text-xs md:text-sm mono tracking-[0.18em] uppercase disabled:opacity-60 shadow-[0_18px_60px_rgba(99,179,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      disabled={authBusy}
                    >
                      {otpLoading ? 'Sending OTP...' : 'Continue with Mobile OTP'}
                    </button>
                  </form>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleVerifyOtp();
                    }}
                  >
                    <label htmlFor={otpFieldId} className="sr-only">
                      Six-digit one-time password sent to your phone
                    </label>
                    <input
                      id={otpFieldId}
                      type="text"
                      name="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-premium text-base md:text-lg tracking-[0.4em] placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#63B3ED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      aria-required="true"
                      aria-describedby={
                        statusMessage
                          ? `${phoneCountryLabelId}-hint ${authStatusId}`
                          : `${phoneCountryLabelId}-hint`
                      }
                    />
                    <button
                      type="submit"
                      className="w-full btn-trust py-[18px] text-xs md:text-sm mono tracking-[0.18em] uppercase disabled:opacity-60 shadow-[0_18px_60px_rgba(99,179,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      disabled={authBusy}
                    >
                      {otpLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                      type="button"
                      className="w-full btn-minimal py-3 text-[10px] md:text-xs mono tracking-[0.16em] uppercase bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      onClick={() => {
                        setOtpStep('phone');
                        setOtp('');
                        setStatusMessage('');
                      }}
                      disabled={otpLoading}
                    >
                      Change mobile number
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-center gap-4 mb-7">
                <div className="h-px bg-white/10 flex-1" aria-hidden="true" />
                <span className="mono text-[10px] tracking-[0.22em] uppercase text-white/45">or</span>
                <div className="h-px bg-white/10 flex-1" aria-hidden="true" />
              </div>

              <div className="space-y-4" role="group" aria-label="Sign in with a social account">
                <button
                  type="button"
                  className="w-full h-[54px] bg-white/[0.03] border border-white/[0.14] px-4 text-xs md:text-sm mono tracking-[0.16em] uppercase text-white/90 hover:bg-white/[0.06] hover:border-white/[0.22] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                  onClick={handleGoogleSignIn}
                  disabled={loadingProvider !== null}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full bg-white text-[#0F172A] text-[11px] font-semibold leading-none select-none"
                    style={{ display: 'grid', placeItems: 'center' }}
                    aria-hidden="true"
                  >
                    G
                  </span>
                  {loadingProvider === 'google' ? 'Connecting Google...' : 'Continue with Google'}
                </button>

                {isAppleDevice ? (
                  <button
                    type="button"
                    className="w-full h-[54px] bg-transparent border border-white/[0.18] px-4 text-xs md:text-sm mono tracking-[0.16em] uppercase text-white/90 hover:bg-white/[0.04] hover:border-white/[0.26] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                    onClick={handleAppleSignIn}
                    disabled={loadingProvider !== null}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">
                      
                    </span>
                    {loadingProvider === 'apple' ? 'Connecting Apple...' : 'Continue with Apple'}
                  </button>
                ) : null}
              </div>

              {statusMessage ? (
                <div
                  id={authStatusId}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="mt-6 text-sm text-white/75 border-l-2 border-[#63B3ED]/50 pl-4 py-1"
                >
                  {statusMessage}
                </div>
              ) : (
                <div id={authStatusId} aria-live="polite" aria-atomic="true" className="sr-only" />
              )}
            </div>

            <aside
              className="flex card-minimal p-7 md:p-10 border-white/[0.08] flex-col justify-between gap-8 lg:gap-10"
              aria-labelledby="login-benefits-heading"
            >
              {/* Top — headline */}
              <div className="space-y-3">
                <p className="mono text-[10px] tracking-[0.28em] uppercase text-white/45">What awaits you</p>
                <h2
                  id="login-benefits-heading"
                  className="text-2xl sm:text-3xl md:text-4xl font-light leading-[1.15] tracking-tight text-white"
                >
                  Your cosmos,<br />
                  <span className="text-white/60">precisely mapped.</span>
                </h2>
              </div>

              {/* Middle — feature rows */}
              <div className="flex-1 flex flex-col justify-center gap-0 divide-y divide-white/[0.06]">
                {([
                  {
                    label: 'Birth chart',
                    detail: 'Natal placements decoded across Vedic and Western systems.',
                    accent: 'text-trust',
                    sym: '◎',
                  },
                  {
                    label: 'Daily transits',
                    detail: 'NASA ephemerides surfaced as personalised daily guidance.',
                    accent: 'text-growth',
                    sym: '◐',
                  },
                  {
                    label: 'Compatibility',
                    detail: 'Synastry across sun, moon, rising and outer planets.',
                    accent: 'text-premium',
                    sym: '◑',
                  },
                  {
                    label: 'Expert readers',
                    detail: 'Human astrologers available 24/7 for live interpretation.',
                    accent: 'text-energy',
                    sym: '◈',
                  },
                ] as const).map(({ label, detail, accent, sym }) => (
                  <div key={label} className="flex items-start gap-3 py-3 lg:py-4 first:pt-0 last:pb-0">
                    <span className={`${accent} mono text-sm lg:text-base mt-0.5 shrink-0 select-none`} aria-hidden="true">
                      {sym}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white/90 font-light text-xs sm:text-sm tracking-wide mb-0.5">{label}</p>
                      <p className="text-white/45 font-light text-[11px] sm:text-xs leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom — trust strip */}
              <div className="border-t border-white/[0.07] pt-5 lg:pt-6 grid grid-cols-3 gap-2 text-center">
                {([
                  { value: '12', sub: 'Zodiac signs', accent: 'text-trust' },
                  { value: '9', sub: 'Planets tracked', accent: 'text-growth' },
                  { value: '24/7', sub: 'Expert access', accent: 'text-premium' },
                ] as const).map(({ value, sub, accent }) => (
                  <div key={sub} className="flex flex-col gap-1">
                    <span className={`${accent} mono text-base lg:text-lg font-light leading-none`}>{value}</span>
                    <span className="mono text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/45">{sub}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

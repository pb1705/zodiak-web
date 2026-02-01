'use client';

import { useState } from 'react';
import { MailIcon, PhoneIcon, SparklesIcon } from '@/components/icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export default function LeadForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide either an email or a phone number');
      setStatus('error');
      return;
    }
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      setErrorMsg('Please enter a valid email address');
      setStatus('error');
      return;
    }
    if (phone.trim() && !isValidPhone(phone.trim())) {
      setErrorMsg('Please enter a valid phone number (7–15 digits)');
      setStatus('error');
      return;
    }
    setErrorMsg('');
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: phone || undefined, message: message || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left">
      <p className="mono text-[10px] text-white/50 tracking-[0.2em] uppercase mb-4">At least one required: email or phone</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="lead-email" className="block mono text-[10px] text-white/50 tracking-[0.2em] uppercase mb-2">
            Email
          </label>
          <div className="relative">
            <MailIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={status === 'loading'}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 font-light outline-none focus:border-[#63B3ED]/40 transition-colors disabled:opacity-60"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lead-phone" className="block mono text-[10px] text-white/50 tracking-[0.2em] uppercase mb-2">
            Phone
          </label>
          <div className="relative">
            <PhoneIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              disabled={status === 'loading'}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 font-light outline-none focus:border-[#63B3ED]/40 transition-colors disabled:opacity-60"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lead-message" className="block mono text-[10px] text-white/50 tracking-[0.2em] uppercase mb-2">
            Message (optional)
          </label>
          <div className="relative">
            <SparklesIcon size={18} className="absolute left-4 top-4 text-white/30" />
            <textarea
              id="lead-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Interested in free birth chart reading"
              rows={3}
              disabled={status === 'loading'}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 font-light outline-none focus:border-[#63B3ED]/40 transition-colors resize-none disabled:opacity-60"
            />
          </div>
        </div>
        {status === 'error' && (
          <p className="text-sm text-[#FF6B6B]" role="alert">
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p className="text-sm text-[#48BB78]" role="status">
            Thanks! We&apos;ll reach out when the app launches.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full btn-trust px-8 py-4 text-sm tracking-widest uppercase disabled:opacity-60"
        >
          {status === 'loading' ? 'Submitting…' : 'Get early access'}
        </button>
      </div>
    </form>
  );
}

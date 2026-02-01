'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons';

const STORAGE_KEY = 'zodiak_admin_key';

interface Lead {
  id: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [key, setKey] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoredKey(sessionStorage.getItem(STORAGE_KEY));
    }
  }, []);

  const fetchLeads = useCallback(async (authKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${authKey}` },
      });
      if (res.status === 401) {
        setError('Invalid key');
        setLeads([]);
        sessionStorage.removeItem(STORAGE_KEY);
        setStoredKey(null);
        return;
      }
      if (!res.ok) {
        setError('Failed to load leads');
        return;
      }
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storedKey) fetchLeads(storedKey);
  }, [storedKey, fetchLeads]);

  const handleSubmitKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    sessionStorage.setItem(STORAGE_KEY, key.trim());
    setStoredKey(key.trim());
    setKey('');
    fetchLeads(key.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStoredKey(null);
    setLeads([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          <ArrowRightIcon size={16} className="rotate-180" />
          Back to site
        </Link>

        <h1 className="text-3xl font-light mb-2">Leads</h1>
        <p className="text-white/50 text-sm mb-8">Pre-trial & early access signups. Only you can access this page with your admin key.</p>

        {!storedKey ? (
          <form onSubmit={handleSubmitKey} className="max-w-md space-y-4">
            <label htmlFor="admin-key" className="block text-sm text-white/60">
              Admin key
            </label>
            <input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your ADMIN_SECRET"
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-none text-white placeholder-white/20 font-mono text-sm outline-none focus:border-white/20"
              autoComplete="off"
            />
            <button type="submit" className="btn-trust px-6 py-2 text-sm uppercase">
              Access leads
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => fetchLeads(storedKey)}
                disabled={loading}
                className="text-sm text-white/60 hover:text-white disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-white/40 hover:text-white"
              >
                Log out
              </button>
            </div>
            {error && <p className="text-[#FF6B6B] text-sm mb-4">{error}</p>}
            {!loading && leads.length === 0 && !error && (
              <p className="text-white/50">No leads yet.</p>
            )}
            {leads.length > 0 && (
              <div className="overflow-x-auto border border-white/[0.08]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-white/60">
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Phone</th>
                      <th className="p-3 font-medium">Message</th>
                      <th className="p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/[0.05]">
                        <td className="p-3 text-white/90">{lead.email || '—'}</td>
                        <td className="p-3 text-white/70">{lead.phone || '—'}</td>
                        <td className="p-3 text-white/60 max-w-xs truncate">{lead.message || '—'}</td>
                        <td className="p-3 text-white/50 text-xs">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import LoginClient from './LoginClient';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';

export const metadata: Metadata = {
  title: 'Login — Zodiak',
  description: 'Sign in to Zodiak to access your birth charts, daily cosmic reports, and saved readings.',
  alternates: {
    canonical: `${baseUrl}/login`,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}

import { NextRequest, NextResponse } from 'next/server';
import { appendLead } from '@/lib/leads';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Phone: digits, optional + at start, allow spaces/dashes/parens; 7–15 digits after stripping */
function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
    const message = typeof body.message === 'string' ? body.message.trim() : undefined;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Please provide either an email or a phone number' },
        { status: 400 }
      );
    }
    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (7–15 digits)' },
        { status: 400 }
      );
    }

    await appendLead({ email: email || undefined, phone, message });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('POST /api/leads:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

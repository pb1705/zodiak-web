import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '@/lib/leads';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function isAuthorized(request: NextRequest): boolean {
  if (!ADMIN_SECRET) return false;
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  return token === ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const leads = await getLeads();
    return NextResponse.json(leads, { status: 200 });
  } catch (e) {
    console.error('GET /api/admin/leads:', e);
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 });
  }
}

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.jsonl');

export interface Lead {
  id: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function appendLead(lead: { email?: string; phone?: string; message?: string }): Promise<Lead> {
  const email = lead.email?.trim() || undefined;
  const phone = lead.phone?.trim() || undefined;
  if (!email && !phone) {
    throw new Error('Either email or phone is required');
  }
  await ensureDataDir();
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const record: Lead = {
    id,
    email,
    phone,
    message: lead.message?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  const line = JSON.stringify(record) + '\n';
  await fs.appendFile(LEADS_FILE, line, 'utf8');
  return record;
}

export async function getLeads(): Promise<Lead[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(LEADS_FILE, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    const leads = lines.map((line) => JSON.parse(line) as Lead);
    return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') return [];
    throw err;
  }
}

/* ═══════════════════════════════════════════════════════════════
   Supabase Client — Single instance used across the app
   In production, requests are proxied through Vercel rewrites
   (/supabase-proxy/*) so users aren't affected by ISP DNS blocks.
   ═══════════════════════════════════════════════════════════════ */
import { createClient } from '@supabase/supabase-js';

const directUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!directUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env'
  );
}

// In production (Vercel), route through our own domain to avoid ISP DNS issues.
// In development (localhost), connect to Supabase directly via Vite proxy.
const isLocalDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const supabaseUrl = isLocalDev ? directUrl : `${window.location.origin}/supabase-proxy`;

export const supabase = createClient(supabaseUrl, supabaseKey);

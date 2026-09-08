import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If Supabase keys are provided, initialize client. Otherwise return null gracefully.
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const hasSupabase = Boolean(supabase);

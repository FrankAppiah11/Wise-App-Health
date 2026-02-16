import { createClient } from '@supabase/supabase-js';

// Note: These must be configured in your environment settings
const supabaseUrl = (process.env as any).SUPABASE_URL || '';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Auth and database features will be limited.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
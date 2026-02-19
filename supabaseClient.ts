/**
 * Supabase Client Configuration (Database only)
 *
 * Authentication is handled by Clerk.
 * This client is used for database operations (db.ts, symptomTracker.ts).
 *
 * Environment variables required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
 *
 * Get these from: https://supabase.com/dashboard -> Your Project -> Settings -> API
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing!');
  console.error('Please add to your .env.local file:');
  console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key-here');

  throw new Error(
    'Supabase credentials not configured. ' +
    'Please check your .env.local file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (import.meta.env.DEV) {
  console.log('Supabase client initialized (database only)');
}

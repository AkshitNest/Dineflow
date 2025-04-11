
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// For development, we'll use hardcoded values if env variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key';

// Log the values for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Check if the URL is valid
if (!supabaseUrl || supabaseUrl === 'https://example-supabase-project.supabase.co') {
  console.warn('⚠️ Using example Supabase URL. Set VITE_SUPABASE_URL in your environment variables for production.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'example-anon-key') {
  console.warn('⚠️ Using example Supabase anon key. Set VITE_SUPABASE_ANON_KEY in your environment variables for production.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

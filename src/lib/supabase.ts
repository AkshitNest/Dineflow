
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// For development, we'll use hardcoded values if env variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log the values for debugging (will be removed in production)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

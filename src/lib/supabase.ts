
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// For development, we'll use hardcoded values if env variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key';

// Log the values for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Create a custom function to get Supabase client with error handling
export const getSupabaseClient = () => {
  if (!supabaseUrl || supabaseUrl === 'https://example-supabase-project.supabase.co') {
    console.warn('⚠️ Using example Supabase URL. Set VITE_SUPABASE_URL in your environment variables for production.');
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'example-anon-key') {
    console.warn('⚠️ Using example Supabase anon key. Set VITE_SUPABASE_ANON_KEY in your environment variables for production.');
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Return a mock client that won't cause the app to crash but will log errors
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              then: (callback: Function) => callback({ data: [], error: new Error('Supabase connection failed') }),
            }),
            single: () => ({
              then: (callback: Function) => callback({ data: null, error: new Error('Supabase connection failed') }),
            }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => ({
              then: (callback: Function) => callback({ data: null, error: new Error('Supabase connection failed') }),
            }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({
                then: (callback: Function) => callback({ data: null, error: new Error('Supabase connection failed') }),
              }),
            }),
          }),
        }),
      }),
    } as any;
  }
};

// Export the Supabase client
export const supabase = getSupabaseClient();

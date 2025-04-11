
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// For development, we'll use hardcoded values if env variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-anon-key';

// Log the values for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Create a single instance of the supabase client
const createSupabaseClient = () => {
  try {
    if (!supabaseUrl || supabaseUrl === 'https://example-supabase-project.supabase.co') {
      console.warn('⚠️ Using example Supabase URL. Set VITE_SUPABASE_URL in your environment variables for production.');
    }

    if (!supabaseAnonKey || supabaseAnonKey === 'example-anon-key') {
      console.warn('⚠️ Using example Supabase anon key. Set VITE_SUPABASE_ANON_KEY in your environment variables for production.');
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Create the client instance
const supabaseClient = createSupabaseClient();

// Export a function to get the client with better error handling
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    console.error('Supabase client is not available');
    // Return a mock client to prevent app crashes
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
  
  return supabaseClient;
};

// For backward compatibility
export const supabase = getSupabaseClient();

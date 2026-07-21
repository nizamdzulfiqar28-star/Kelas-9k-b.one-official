import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Create a functional Mock client so that the app never crashes if Supabase is unconfigured
const createMockSupabase = () => {
  console.warn('[Supabase] Credentials are empty or invalid. Running in local REST-fallback mode.');
  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        // Register empty subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      },
      signInWithPassword: async (credentials: any) => {
        return { data: { user: null }, error: { message: 'Supabase URL/Key is not configured. Running in fallback mode.' } };
      },
      signUp: async (credentials: any) => {
        return { data: { user: null }, error: { message: 'Supabase URL/Key is not configured. Running in fallback mode.' } };
      }
    },
    from: (table: string) => {
      return {
        select: async (columns?: string) => {
          return { data: null, error: { message: 'Supabase URL/Key is not configured.' } };
        },
        upsert: async (values: any) => {
          return { error: { message: 'Supabase URL/Key is not configured.' } };
        }
      };
    },
    channel: (name: string) => {
      const mockChannel = {
        on: (event: string, filter: any, callback: any) => {
          return mockChannel;
        },
        subscribe: (callback?: (status: string) => void) => {
          if (callback) {
            callback('SUBSCRIBED_MOCK');
          }
          return mockChannel;
        }
      };
      return mockChannel;
    }
  } as any;
};

// Create a single supabase client or a resilient mock client
export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey.trim())
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();

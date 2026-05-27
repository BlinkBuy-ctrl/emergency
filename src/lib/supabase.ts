import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Emergency] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.\n' +
    'Copy .env.example to .env and fill in your Supabase project credentials.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Same storage key as the main BlinkBuy app — shares login session
    storageKey: 'blinkbuy_auth_token',
    storage: window.localStorage,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
    timeout: 20000,
  },
  global: {
    headers: { 'X-Client-Info': 'blinkbuy-emergency' },
  },
})

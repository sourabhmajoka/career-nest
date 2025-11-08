// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

// Read the variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the Supabase client for the browser
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)
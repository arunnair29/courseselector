import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// True once a project URL + anon key have actually been supplied (via
// .env.local in development, or repo secrets in the GitHub Actions build).
// Every account/shortlist/plan feature checks this first so the rest of the
// app still works (browsing, comparing, the course finder) even before
// Supabase is configured — it just can't save anything across logins yet.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'Accounts, shortlisting, and admission plans are disabled until you set these — see .env.example.',
  )
}

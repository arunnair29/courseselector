import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

const NOT_CONFIGURED_ERROR = {
  message:
    'Accounts aren’t set up yet — this site needs a Supabase project connected before you can sign up.',
}

/**
 * Wraps the app, tracks the current Supabase auth session, and exposes
 * sign up / sign in / sign out. Safe to mount even when Supabase hasn't
 * been configured yet (see supabaseClient.js) — every method just
 * resolves with a friendly error instead of throwing, so the rest of the
 * app (browsing, comparing, the finder) keeps working either way.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null)
      },
    )

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED_ERROR }
    return supabase.auth.signUp({ email, password })
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED_ERROR }
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return { error: null }
    return supabase.auth.signOut()
  }, [])

  const value = {
    user: session?.user ?? null,
    session,
    loading,
    configured: isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

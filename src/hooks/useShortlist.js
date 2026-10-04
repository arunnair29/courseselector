import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * The signed-in user's shortlisted course ids, backed by the `shortlists`
 * table in Supabase (see supabase/schema.sql) so it follows them across
 * logins/devices. Returns an empty, read-only shortlist when signed out
 * or when Supabase hasn't been configured yet.
 */
export function useShortlist() {
  const { user } = useAuth()
  const [ids, setIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setIds([])
      return
    }

    let active = true
    setLoading(true)
    setError('')

    supabase
      .from('shortlists')
      .select('course_id')
      .eq('user_id', user.id)
      .then(({ data, error: fetchError }) => {
        if (!active) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setIds((data || []).map((row) => row.course_id))
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const isShortlisted = useCallback(
    (courseId) => ids.includes(courseId),
    [ids],
  )

  const toggleShortlist = useCallback(
    async (courseId) => {
      if (!isSupabaseConfigured) {
        setError('Shortlisting needs a Supabase project connected first.')
        return
      }
      if (!user) {
        setError('Sign in to save courses to your shortlist.')
        return
      }

      const alreadyIn = ids.includes(courseId)
      setError('')
      // Optimistic update so the star flips instantly.
      setIds((prev) =>
        alreadyIn ? prev.filter((id) => id !== courseId) : [...prev, courseId],
      )

      if (alreadyIn) {
        const { error: deleteError } = await supabase
          .from('shortlists')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', courseId)
        if (deleteError) {
          setError(deleteError.message)
          setIds((prev) => [...prev, courseId]) // revert
        }
      } else {
        const { error: insertError } = await supabase
          .from('shortlists')
          .insert({ user_id: user.id, course_id: courseId })
        if (insertError) {
          setError(insertError.message)
          setIds((prev) => prev.filter((id) => id !== courseId)) // revert
        }
      }
    },
    [ids, user],
  )

  return { shortlistIds: ids, isShortlisted, toggleShortlist, loading, error }
}

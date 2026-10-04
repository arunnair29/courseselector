import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Admission-plan checklist/notes for one shortlisted course, backed by the
 * `plan_items` table (see supabase/schema.sql). Each row is either
 * kind: 'checklist' (text, completed, optional due_date) or kind: 'note'
 * (free text; this hook keeps at most one note row per course, upserted).
 */
export function usePlan(courseId) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !user || !courseId) {
      setItems([])
      return
    }
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('plan_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [user, courseId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addChecklistItem = useCallback(
    async (text, dueDate = null) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (!isSupabaseConfigured || !user) {
        setError('Sign in to build an admission plan.')
        return
      }
      // Skip near-duplicates (e.g. clicking a suggestion chip twice).
      if (
        items.some(
          (i) => i.kind === 'checklist' && i.text.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        return
      }

      const position = items.filter((i) => i.kind === 'checklist').length
      const { data, error: insertError } = await supabase
        .from('plan_items')
        .insert({
          user_id: user.id,
          course_id: courseId,
          kind: 'checklist',
          text: trimmed,
          due_date: dueDate || null,
          position,
        })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return
      }
      setItems((prev) => [...prev, data])
    },
    [items, user, courseId],
  )

  const toggleComplete = useCallback(
    async (itemId) => {
      const item = items.find((i) => i.id === itemId)
      if (!item) return
      const nextCompleted = !item.completed
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, completed: nextCompleted } : i)),
      )
      const { error: updateError } = await supabase
        .from('plan_items')
        .update({ completed: nextCompleted })
        .eq('id', itemId)
        .eq('user_id', user.id)
      if (updateError) {
        setError(updateError.message)
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, completed: !nextCompleted } : i)),
        )
      }
    },
    [items, user],
  )

  const updateDueDate = useCallback(
    async (itemId, dueDate) => {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, due_date: dueDate || null } : i)),
      )
      const { error: updateError } = await supabase
        .from('plan_items')
        .update({ due_date: dueDate || null })
        .eq('id', itemId)
        .eq('user_id', user.id)
      if (updateError) setError(updateError.message)
    },
    [user],
  )

  const removeItem = useCallback(
    async (itemId) => {
      setItems((prev) => prev.filter((i) => i.id !== itemId))
      const { error: deleteError } = await supabase
        .from('plan_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)
      if (deleteError) setError(deleteError.message)
    },
    [user],
  )

  const saveNote = useCallback(
    async (text) => {
      if (!isSupabaseConfigured || !user) return
      const existing = items.find((i) => i.kind === 'note')

      if (!text.trim()) {
        if (existing) await removeItem(existing.id)
        return
      }

      if (existing) {
        setItems((prev) =>
          prev.map((i) => (i.id === existing.id ? { ...i, text } : i)),
        )
        const { error: updateError } = await supabase
          .from('plan_items')
          .update({ text })
          .eq('id', existing.id)
          .eq('user_id', user.id)
        if (updateError) setError(updateError.message)
      } else {
        const { data, error: insertError } = await supabase
          .from('plan_items')
          .insert({
            user_id: user.id,
            course_id: courseId,
            kind: 'note',
            text,
            position: 0,
          })
          .select()
          .single()
        if (insertError) {
          setError(insertError.message)
          return
        }
        setItems((prev) => [...prev, data])
      }
    },
    [items, user, courseId, removeItem],
  )

  const checklist = items.filter((i) => i.kind === 'checklist')
  const note = items.find((i) => i.kind === 'note')?.text ?? ''

  return {
    checklist,
    note,
    loading,
    error,
    addChecklistItem,
    toggleComplete,
    updateDueDate,
    removeItem,
    saveNote,
    refresh,
  }
}

/**
 * All of the signed-in user's plan checklist items, across every
 * shortlisted course, that have a due date set — for the cross-course
 * timeline view. Course titles/universities are looked up client-side from
 * the already-loaded course dataset by the caller.
 */
export function usePlanTimeline() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setItems([])
      return
    }

    let active = true
    setLoading(true)
    setError('')

    supabase
      .from('plan_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('kind', 'checklist')
      .not('due_date', 'is', null)
      .order('due_date', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (!active) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setItems(data || [])
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  return { items, loading, error }
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Header account control. Logged out: a "Sign in" button that opens a
 * small sign in / sign up form. Logged in: the user's email + sign out.
 */
export default function AuthPanel() {
  const { user, loading, configured, signUp, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function resetForm() {
    setEmail('')
    setPassword('')
    setError('')
    setNotice('')
    setSubmitting(false)
  }

  function closePanel() {
    setOpen(false)
    resetForm()
    setMode('signin')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    const action = mode === 'signup' ? signUp : signIn
    const { data, error: authError } = await action(email.trim(), password)

    setSubmitting(false)

    if (authError) {
      setError(authError.message || 'Something went wrong. Please try again.')
      return
    }

    if (mode === 'signup' && data && !data.session) {
      // Email confirmation is on by default for new Supabase projects.
      setNotice('Check your inbox to confirm your email, then sign in.')
      setMode('signin')
      setPassword('')
      return
    }

    closePanel()
  }

  async function handleSignOut() {
    await signOut()
  }

  if (loading) {
    return <span className="account-badge account-badge--loading">...</span>
  }

  if (user) {
    return (
      <div className="account-badge">
        <span className="account-badge__email" title={user.email}>
          {user.email}
        </span>
        <button className="account-badge__signout" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="auth-panel">
      <button className="nav-button account-trigger" onClick={() => setOpen(true)}>
        Sign in
      </button>

      {open && (
        <div className="auth-panel__backdrop" onClick={closePanel}>
          <div className="auth-panel__card" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-panel__close"
              onClick={closePanel}
              aria-label="Close"
            >
              &times;
            </button>

            <h2>{mode === 'signup' ? 'Create an account' : 'Sign in'}</h2>

            {!configured && (
              <p className="auth-panel__warning">
                Accounts aren't set up on this site yet (no Supabase project
                connected), so sign in/sign up won't work until that's done.
              </p>
            )}

            <p className="auth-panel__blurb">
              An account lets you shortlist courses and build an admission
              plan for them that follows you across devices.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-form__field">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="auth-form__field">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                />
              </label>

              {error && <p className="auth-form__error">{error}</p>}
              {notice && <p className="auth-form__notice">{notice}</p>}

              <button
                type="submit"
                className="auth-form__submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Please wait...'
                  : mode === 'signup'
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>

            <p className="auth-panel__switch">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="link-button"
                    onClick={() => {
                      setMode('signin')
                      setError('')
                      setNotice('')
                    }}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    className="link-button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                      setNotice('')
                    }}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

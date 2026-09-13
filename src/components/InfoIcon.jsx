import { useEffect, useRef, useState } from 'react'

// A small "ⓘ" affordance placed next to a label. Shows a plain-language
// explanation on hover/keyboard-focus (desktop) AND toggles open on
// click/tap, so it also works reliably on touch devices — the native
// `title` attribute this used to rely on doesn't reliably show up on tap
// on mobile browsers, which is why it looked "broken" there.
export default function InfoIcon({ text }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!text) return null

  return (
    <span
      className={open ? 'info-icon-wrap is-open' : 'info-icon-wrap'}
      ref={wrapRef}
    >
      <span
        className="info-icon"
        role="button"
        tabIndex={0}
        aria-label={text}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
        }}
      >
        ⓘ
      </span>
      <span className="info-icon__tooltip" role="tooltip">
        {text}
      </span>
    </span>
  )
}

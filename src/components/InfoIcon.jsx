// A small "ⓘ" affordance placed next to a label. Hovering (desktop) or
// tapping/long-pressing (touch) reveals a plain-language explanation via the
// native title tooltip — no extra JS state needed.
export default function InfoIcon({ text }) {
  if (!text) return null
  return (
    <span
      className="info-icon"
      title={text}
      aria-label={text}
      tabIndex={0}
    >
      ⓘ
    </span>
  )
}

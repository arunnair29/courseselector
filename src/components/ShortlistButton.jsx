export default function ShortlistButton({
  courseId,
  isShortlisted,
  onToggle,
  signedIn,
}) {
  return (
    <button
      type="button"
      className={
        isShortlisted ? 'shortlist-button is-active' : 'shortlist-button'
      }
      onClick={() => onToggle(courseId)}
      title={
        !signedIn
          ? 'Sign in to shortlist this course'
          : isShortlisted
            ? 'Remove from shortlist'
            : 'Add to shortlist'
      }
      aria-pressed={isShortlisted}
    >
      <span className="shortlist-button__star" aria-hidden="true">
        {isShortlisted ? '★' : '☆'}
      </span>
      <span className="shortlist-button__label">
        {isShortlisted ? 'Shortlisted' : 'Shortlist'}
      </span>
    </button>
  )
}

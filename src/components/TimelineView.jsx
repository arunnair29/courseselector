import { usePlanTimeline } from '../hooks/usePlan.js'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function TimelineView({ coursesData, onOpenPlan }) {
  const { items, loading, error } = usePlanTimeline()

  if (loading) {
    return <p className="empty-state">Loading your timeline...</p>
  }

  const withCourse = items
    .map((item) => ({
      item,
      course: coursesData.find((c) => c.id === item.course_id),
    }))
    .filter((row) => row.course)

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="timeline-view">
      {error && <p className="auth-form__error">{error}</p>}

      <p className="result-count">
        {withCourse.length} deadline{withCourse.length === 1 ? '' : 's'} across
        your shortlist
      </p>

      {withCourse.length === 0 ? (
        <p className="empty-state">
          No deadlines set yet. Open a course's admission plan and add a due
          date to a step to see it here.
        </p>
      ) : (
        <ul className="timeline-list">
          {withCourse.map(({ item, course }) => {
            const isOverdue = !item.completed && item.due_date < today
            return (
              <li
                key={item.id}
                className={
                  item.completed
                    ? 'timeline-item is-done'
                    : isOverdue
                      ? 'timeline-item is-overdue'
                      : 'timeline-item'
                }
              >
                <span className="timeline-item__date">
                  {formatDate(item.due_date)}
                </span>
                <div className="timeline-item__body">
                  <p className="timeline-item__text">{item.text}</p>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => onOpenPlan(course.id)}
                  >
                    {course.courseTitle} · {course.university}
                  </button>
                </div>
                {item.completed && (
                  <span className="timeline-item__done">Done</span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

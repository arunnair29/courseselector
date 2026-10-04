import { useState } from 'react'
import { formatCurrency, formatPercent } from '../utils/format.js'
import { FIELD_INFO } from '../utils/fieldInfo.js'
import InfoIcon from './InfoIcon.jsx'
import ShortlistButton from './ShortlistButton.jsx'
import TimelineView from './TimelineView.jsx'

export default function ShortlistView({
  courses,
  coursesData,
  loading,
  error,
  signedIn,
  selectedIds,
  onToggleSelect,
  onViewDetail,
  maxSelected,
  isShortlisted,
  onToggleShortlist,
  onOpenPlan,
}) {
  const [tab, setTab] = useState('courses') // 'courses' | 'timeline'

  if (!signedIn) {
    return (
      <div className="shortlist-view">
        <p className="empty-state">
          Sign in (top right) to shortlist courses and build an admission
          plan for them — your shortlist follows you across devices once
          you're signed in.
        </p>
      </div>
    )
  }

  if (loading) {
    return <p className="empty-state">Loading your shortlist...</p>
  }

  return (
    <div className="shortlist-view">
      {error && <p className="auth-form__error">{error}</p>}

      <div className="shortlist-tabs">
        <button
          className={tab === 'courses' ? 'tab-button is-active' : 'tab-button'}
          onClick={() => setTab('courses')}
        >
          Shortlisted courses
        </button>
        <button
          className={tab === 'timeline' ? 'tab-button is-active' : 'tab-button'}
          onClick={() => setTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {tab === 'timeline' ? (
        <TimelineView coursesData={coursesData} onOpenPlan={onOpenPlan} />
      ) : (
        <>
          <p className="result-count">
            {courses.length} course{courses.length === 1 ? '' : 's'} shortlisted
          </p>

          {courses.length === 0 ? (
            <p className="empty-state">
              No courses shortlisted yet. Browse or use "Find my course",
              then click the star on any course to add it here.
            </p>
          ) : (
            <ul className="course-list">
              {courses.map((course) => {
                const isSelected = selectedIds.includes(course.id)
                const disableCheckbox =
                  !isSelected && selectedIds.length >= maxSelected

                return (
                  <li
                    key={course.id}
                    className={
                      isSelected ? 'course-card is-selected' : 'course-card'
                    }
                  >
                    <div className="course-card__top">
                      <input
                        type="checkbox"
                        className="course-card__checkbox"
                        checked={isSelected}
                        disabled={disableCheckbox}
                        title={
                          disableCheckbox
                            ? `You can compare up to ${maxSelected} courses at once`
                            : 'Add to comparison'
                        }
                        onChange={() => onToggleSelect(course.id)}
                      />
                      <div className="course-card__heading">
                        <h3>{course.courseTitle}</h3>
                        <p>{course.university}</p>
                      </div>
                      <ShortlistButton
                        courseId={course.id}
                        isShortlisted={isShortlisted(course.id)}
                        onToggle={onToggleShortlist}
                        signedIn={signedIn}
                      />
                      <button
                        className="link-button course-card__details"
                        onClick={() => onViewDetail(course.id)}
                      >
                        Details →
                      </button>
                    </div>

                    <div className="course-card__stats">
                      <div className="stat">
                        <span className="stat__label">
                          Uni rank
                          <InfoIcon text={FIELD_INFO.universityRank} />
                        </span>
                        <span className="stat__value">
                          {course.universityRanking?.russellGroupRank
                            ? `#${course.universityRanking.russellGroupRank} of ${course.universityRanking.of}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat__label">
                          Typical offer
                          <InfoIcon text={FIELD_INFO.typicalOffer} />
                        </span>
                        <span className="stat__value">
                          {course.entryRequirements.aLevel}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat__label">
                          Home fees/yr
                          <InfoIcon text={FIELD_INFO.homeFees} />
                        </span>
                        <span className="stat__value">
                          {formatCurrency(course.fees.homeAnnual)}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat__label">
                          Highly skilled work
                          <InfoIcon text={FIELD_INFO.highlySkilledWork} />
                        </span>
                        <span className="stat__value">
                          {formatPercent(
                            course.careerOutcomes.highlySkilledWork ??
                              course.careerOutcomes.inWorkOrStudy15mo,
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      className="button button--primary shortlist-card__plan"
                      onClick={() => onOpenPlan(course.id)}
                    >
                      Admission plan →
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

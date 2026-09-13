import { formatCurrency, formatPercent } from '../utils/format.js'

export default function CourseList({
  courses,
  selectedIds,
  onToggleSelect,
  onViewDetail,
  maxSelected,
}) {
  if (courses.length === 0) {
    return <p className="empty-state">No courses match your filters.</p>
  }

  return (
    <ul className="course-list">
      {courses.map((course) => {
        const isSelected = selectedIds.includes(course.id)
        const disableCheckbox =
          !isSelected && selectedIds.length >= maxSelected

        return (
          <li
            key={course.id}
            className={isSelected ? 'course-card is-selected' : 'course-card'}
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
              <button
                className="link-button course-card__details"
                onClick={() => onViewDetail(course.id)}
              >
                Details →
              </button>
            </div>

            <div className="course-card__stats">
              <div className="stat">
                <span className="stat__label">Uni rank</span>
                <span className="stat__value">
                  {course.universityRanking?.russellGroupRank
                    ? `#${course.universityRanking.russellGroupRank} of ${course.universityRanking.of}`
                    : 'N/A'}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Typical offer</span>
                <span className="stat__value">
                  {course.entryRequirements.aLevel}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Tariff pts</span>
                <span className="stat__value">
                  {course.entryRequirements.ucasTariffPoints ?? 'N/A'}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Applicants/place</span>
                <span className="stat__value">
                  {course.popularity?.applicantsPerPlace != null
                    ? `${course.popularity.applicantsPerPlace}:1`
                    : 'N/A'}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Home fees/yr</span>
                <span className="stat__value">
                  {formatCurrency(course.fees.homeAnnual)}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">In work/study</span>
                <span className="stat__value">
                  {formatPercent(course.careerOutcomes.inWorkOrStudy15mo)}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Median salary</span>
                <span className="stat__value">
                  {formatCurrency(course.careerOutcomes.medianSalary15mo)}
                </span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

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
    <div className="course-table-wrap">
      <table className="course-table">
        <thead>
          <tr>
            <th aria-label="Compare"></th>
            <th>University</th>
            <th>Uni rank</th>
            <th>Course</th>
            <th>Typical offer</th>
            <th>Tariff pts</th>
            <th>Applicants/place</th>
            <th>Home fees/yr</th>
            <th>In work/study (15mo)</th>
            <th>Median salary (15mo)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const isSelected = selectedIds.includes(course.id)
            const disableCheckbox =
              !isSelected && selectedIds.length >= maxSelected
            return (
              <tr key={course.id} className={isSelected ? 'is-selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disableCheckbox}
                    title={
                      disableCheckbox
                        ? `You can compare up to ${maxSelected} courses at once`
                        : 'Add to comparison'
                    }
                    onChange={() => onToggleSelect(course.id)}
                  />
                </td>
                <td>{course.university}</td>
                <td>
                  {course.universityRanking?.russellGroupRank
                    ? `#${course.universityRanking.russellGroupRank} of ${course.universityRanking.of}`
                    : 'N/A'}
                </td>
                <td>{course.courseTitle}</td>
                <td>{course.entryRequirements.aLevel}</td>
                <td>{course.entryRequirements.ucasTariffPoints ?? 'N/A'}</td>
                <td>
                  {course.popularity?.applicantsPerPlace != null
                    ? `${course.popularity.applicantsPerPlace}:1`
                    : 'N/A'}
                </td>
                <td>{formatCurrency(course.fees.homeAnnual)}</td>
                <td>{formatPercent(course.careerOutcomes.inWorkOrStudy15mo)}</td>
                <td>{formatCurrency(course.careerOutcomes.medianSalary15mo)}</td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => onViewDetail(course.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

import { formatCurrency, formatPercent, formatValue } from '../utils/format.js'

export default function CourseDetail({ course, onBack, onToggleSelect, isSelected }) {
  return (
    <div className="course-detail">
      <button className="button" onClick={onBack}>
        ← Back to browse
      </button>

      <h2>
        {course.courseTitle} — {course.university}
      </h2>
      <p className="course-detail__subtitle">
        {course.degreeType} · {course.duration} · UCAS code {course.ucasCode}
      </p>

      <button
        className="button button--primary"
        onClick={() => onToggleSelect(course.id)}
      >
        {isSelected ? 'Remove from comparison' : 'Add to comparison'}
      </button>

      <section>
        <h3>University ranking &amp; popularity</h3>
        <dl className="detail-grid">
          <dt>University ranking</dt>
          <dd>
            {course.universityRanking?.russellGroupRank
              ? `#${course.universityRanking.russellGroupRank} of ${course.universityRanking.of} Russell Group universities`
              : 'N/A'}
            {course.universityRanking?.source && (
              <span className="detail-note"> ({course.universityRanking.source})</span>
            )}
          </dd>
          <dt>Popularity (applicants per place)</dt>
          <dd>
            {course.popularity?.applicantsPerPlace != null
              ? `${course.popularity.applicantsPerPlace}:1`
              : 'N/A'}
            {course.popularity?.cycle && ` (${course.popularity.cycle})`}
            {course.popularity?.note && (
              <span className="detail-note"> — {course.popularity.note}</span>
            )}
          </dd>
        </dl>
      </section>

      <section>
        <h3>Entry requirements</h3>
        <dl className="detail-grid">
          <dt>A-level</dt>
          <dd>{course.entryRequirements.aLevel}</dd>
          <dt>IB</dt>
          <dd>{course.entryRequirements.ib}</dd>
          <dt>UCAS tariff points</dt>
          <dd>{formatValue(course.entryRequirements.ucasTariffPoints)}</dd>
          <dt>Admissions tests</dt>
          <dd>{formatValue(course.entryRequirements.admissionsTests)}</dd>
          <dt>Other requirements</dt>
          <dd>{formatValue(course.entryRequirements.otherRequirements)}</dd>
        </dl>
      </section>

      <section>
        <h3>Fees</h3>
        <dl className="detail-grid">
          <dt>Home / year</dt>
          <dd>{formatCurrency(course.fees.homeAnnual)}</dd>
          <dt>International / year</dt>
          <dd>{formatCurrency(course.fees.internationalAnnual)}</dd>
          <dt>Fee year</dt>
          <dd>{formatValue(course.fees.feeYear)}</dd>
        </dl>
      </section>

      <section>
        <h3>Career prospects</h3>
        {course.dataNote ? (
          <p className="data-note">{course.dataNote}</p>
        ) : (
          <dl className="detail-grid">
            <dt>In work or further study (15mo)</dt>
            <dd>{formatPercent(course.careerOutcomes.inWorkOrStudy15mo)}</dd>
            <dt>In highly skilled work</dt>
            <dd>{formatPercent(course.careerOutcomes.highlySkilledWork)}</dd>
            <dt>Median salary (15mo)</dt>
            <dd>{formatCurrency(course.careerOutcomes.medianSalary15mo)}</dd>
            <dt>Salary range (15mo)</dt>
            <dd>{formatValue(course.careerOutcomes.salaryRange15mo)}</dd>
            <dt>Common destination</dt>
            <dd>{formatValue(course.careerOutcomes.commonDestination)}</dd>
          </dl>
        )}
      </section>

      <section>
        <h3>Sources</h3>
        <ul className="source-list">
          {course.sources.map((src) => (
            <li key={src}>
              <a href={src} target="_blank" rel="noreferrer">
                {src}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

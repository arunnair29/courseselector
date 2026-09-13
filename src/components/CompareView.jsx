import { formatCurrency, formatPercent, formatValue } from '../utils/format.js'
import { FIELD_INFO } from '../utils/fieldInfo.js'
import InfoIcon from './InfoIcon.jsx'

const ROWS = [
  { label: 'University', get: (c) => c.university },
  {
    label: 'University ranking',
    info: FIELD_INFO.universityRank,
    get: (c) =>
      c.universityRanking?.russellGroupRank
        ? `#${c.universityRanking.russellGroupRank} of ${c.universityRanking.of} (Russell Group)`
        : 'N/A',
  },
  { label: 'Course', get: (c) => c.courseTitle },
  {
    label: 'Degree type',
    info: FIELD_INFO.degreeType,
    get: (c) => c.degreeType,
  },
  { label: 'Duration', info: FIELD_INFO.duration, get: (c) => c.duration },
  {
    label: 'A-level offer',
    info: FIELD_INFO.typicalOffer,
    get: (c) => c.entryRequirements.aLevel,
  },
  {
    label: 'IB offer',
    info: FIELD_INFO.ibOffer,
    get: (c) => c.entryRequirements.ib,
  },
  {
    label: 'UCAS tariff points',
    info: FIELD_INFO.tariffPoints,
    get: (c) => formatValue(c.entryRequirements.ucasTariffPoints),
  },
  {
    label: 'Admissions tests',
    info: FIELD_INFO.admissionsTests,
    get: (c) => formatValue(c.entryRequirements.admissionsTests),
  },
  {
    label: 'Home fees / year',
    info: FIELD_INFO.homeFees,
    get: (c) => formatCurrency(c.fees.homeAnnual),
  },
  {
    label: 'International fees / year',
    info: FIELD_INFO.internationalFees,
    get: (c) => formatCurrency(c.fees.internationalAnnual),
  },
  {
    label: 'In work/study (15mo)',
    info: FIELD_INFO.inWorkOrStudy,
    get: (c) => formatPercent(c.careerOutcomes.inWorkOrStudy15mo),
  },
  {
    label: 'In highly skilled work',
    info: FIELD_INFO.highlySkilledWork,
    get: (c) => formatPercent(c.careerOutcomes.highlySkilledWork),
  },
  {
    label: 'Median salary (15mo)',
    info: FIELD_INFO.medianSalary,
    get: (c) => formatCurrency(c.careerOutcomes.medianSalary15mo),
  },
  {
    label: 'Salary range (15mo)',
    info: FIELD_INFO.salaryRange,
    get: (c) => formatValue(c.careerOutcomes.salaryRange15mo),
  },
  {
    label: 'Common destination',
    info: FIELD_INFO.commonDestination,
    get: (c) => formatValue(c.careerOutcomes.commonDestination),
  },
]

export default function CompareView({ courses, onRemove, onClose }) {
  if (courses.length === 0) {
    return (
      <div className="compare-view">
        <p className="empty-state">
          Select 2-4 courses from the list to compare them side by side.
        </p>
        <button className="button" onClick={onClose}>
          Back to browse
        </button>
      </div>
    )
  }

  return (
    <div className="compare-view">
      <div className="compare-view__header">
        <h2>Compare courses</h2>
        <button className="button" onClick={onClose}>
          Back to browse
        </button>
      </div>
      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-table__corner"></th>
              {courses.map((c) => (
                <th key={c.id}>
                  {c.university}
                  <button
                    className="remove-button"
                    onClick={() => onRemove(c.id)}
                    aria-label={`Remove ${c.university} from comparison`}
                  >
                    ×
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th className="compare-table__row-label">
                  {row.label}
                  {row.info && <InfoIcon text={row.info} />}
                </th>
                {courses.map((c) => (
                  <td key={c.id}>{row.get(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { formatCurrency, formatPercent } from '../utils/format.js'
import { computeDatasetStats, scoreCourse } from '../utils/ranking.js'
import { FIELD_INFO } from '../utils/fieldInfo.js'
import InfoIcon from './InfoIcon.jsx'

const RESULT_COUNT = 25
const DEFAULT_WEIGHTS = { popularity: 50, ranking: 50, jobPotential: 50 }
const DEFAULT_SUBJECTS = ['Physics', 'Mathematics', 'Chemistry']

function round(n) {
  return Math.round(n)
}

export default function CourseFinder({
  coursesData,
  subjects,
  selectedIds,
  onToggleSelect,
  onViewDetail,
  maxSelected,
}) {
  const [subject1, setSubject1] = useState(DEFAULT_SUBJECTS[0])
  const [subject2, setSubject2] = useState(DEFAULT_SUBJECTS[1])
  const [subject3, setSubject3] = useState(DEFAULT_SUBJECTS[2])
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)

  const chosenSubjects = useMemo(
    () => [...new Set([subject1, subject2, subject3].filter(Boolean))],
    [subject1, subject2, subject3],
  )

  const stats = useMemo(() => computeDatasetStats(coursesData), [coursesData])

  const results = useMemo(() => {
    if (chosenSubjects.length === 0) return []
    return coursesData
      .filter((c) => chosenSubjects.includes(c.subjectArea))
      .map((course) => ({ course, ...scoreCourse(course, stats, weights) }))
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, RESULT_COUNT)
  }, [coursesData, chosenSubjects, stats, weights])

  const totalWeight = weights.popularity + weights.ranking + weights.jobPotential
  const weightPct = (w) => (totalWeight > 0 ? round((w / totalWeight) * 100) : 0)

  function updateWeight(key, value) {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }))
  }

  function subjectOptions(excludeValues) {
    return subjects.filter((s) => !excludeValues.includes(s))
  }

  return (
    <div className="finder">
      <p className="finder__intro">
        Pick up to three subjects you're interested in, then adjust how much
        each factor matters to you. We'll rank matching courses across all 24
        Russell Group universities and show your top {RESULT_COUNT}.
      </p>

      <div className="finder-panel">
        <div className="finder-subjects">
          <label className="finder-field">
            <span>1st favourite subject</span>
            <select value={subject1} onChange={(e) => setSubject1(e.target.value)}>
              <option value="">— choose a subject —</option>
              {subjectOptions([subject2, subject3].filter(Boolean)).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="finder-field">
            <span>2nd favourite subject</span>
            <select value={subject2} onChange={(e) => setSubject2(e.target.value)}>
              <option value="">— choose a subject —</option>
              {subjectOptions([subject1, subject3].filter(Boolean)).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="finder-field">
            <span>3rd favourite subject</span>
            <select value={subject3} onChange={(e) => setSubject3(e.target.value)}>
              <option value="">— choose a subject —</option>
              {subjectOptions([subject1, subject2].filter(Boolean)).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="finder-weights">
          <div className="finder-weights__header">
            <h3>What matters most to you?</h3>
            <button
              className="link-button"
              onClick={() => setWeights(DEFAULT_WEIGHTS)}
            >
              Reset to equal weighting
            </button>
          </div>

          <label className="weight-control">
            <div className="weight-control__label">
              <span>
                Popularity
                <InfoIcon text={FIELD_INFO.weightPopularity} />
              </span>
              <span className="weight-control__pct">
                {weightPct(weights.popularity)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.popularity}
              onChange={(e) => updateWeight('popularity', e.target.value)}
            />
          </label>

          <label className="weight-control">
            <div className="weight-control__label">
              <span>
                University ranking
                <InfoIcon text={FIELD_INFO.weightRanking} />
              </span>
              <span className="weight-control__pct">
                {weightPct(weights.ranking)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.ranking}
              onChange={(e) => updateWeight('ranking', e.target.value)}
            />
          </label>

          <label className="weight-control">
            <div className="weight-control__label">
              <span>
                Job potential
                <InfoIcon text={FIELD_INFO.weightJobPotential} />
              </span>
              <span className="weight-control__pct">
                {weightPct(weights.jobPotential)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.jobPotential}
              onChange={(e) => updateWeight('jobPotential', e.target.value)}
            />
          </label>
        </div>
      </div>

      {chosenSubjects.length === 0 ? (
        <p className="empty-state">
          Choose at least one favourite subject above to see your best-fit
          courses.
        </p>
      ) : (
        <>
          <p className="result-count">
            Top {results.length} match{results.length === 1 ? '' : 'es'} for{' '}
            {chosenSubjects.join(', ')}
          </p>
          <ul className="course-list">
            {results.map(
              ({
                course,
                compositeScore,
                popScore,
                rankScore,
                jobScore,
                popularityEstimated,
                jobPotentialEstimated,
              }) => {
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
                      <span className="match-score" title="Match score out of 100">
                        {round(compositeScore)}
                        <span className="match-score__of">/100</span>
                      </span>
                      <button
                        className="link-button course-card__details"
                        onClick={() => onViewDetail(course.id)}
                      >
                        Details →
                      </button>
                    </div>

                    <div className="match-breakdown">
                      <span>
                        Popularity {round(popScore)}
                        {popularityEstimated && (
                          <em className="detail-note"> (estimated)</em>
                        )}
                      </span>
                      <span>Uni ranking {round(rankScore)}</span>
                      <span>
                        Job potential {round(jobScore)}
                        {jobPotentialEstimated && (
                          <em className="detail-note"> (estimated)</em>
                        )}
                      </span>
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
                          Tariff pts
                          <InfoIcon text={FIELD_INFO.tariffPoints} />
                        </span>
                        <span className="stat__value">
                          {course.entryRequirements.ucasTariffPoints ?? 'N/A'}
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
                      <div className="stat">
                        <span className="stat__label">
                          Median salary
                          <InfoIcon text={FIELD_INFO.medianSalary} />
                        </span>
                        <span className="stat__value">
                          {formatCurrency(course.careerOutcomes.medianSalary15mo)}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              },
            )}
          </ul>
        </>
      )}
    </div>
  )
}

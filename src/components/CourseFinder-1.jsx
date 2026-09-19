import { useMemo, useState } from 'react'
import { formatCurrency, formatPercent } from '../utils/format.js'
import { computeDatasetStats, scoreCourse } from '../utils/ranking.js'
import { FIELD_INFO } from '../utils/fieldInfo.js'
import { A_LEVEL_SUBJECTS, matchCourse } from '../utils/aLevelMatch.js'
import InfoIcon from './InfoIcon.jsx'

const RESULT_COUNT = 25
const CLOSE_COUNT = 12
const MAX_A_LEVELS = 5
const DEFAULT_WEIGHTS = { popularity: 50, ranking: 50, jobPotential: 50 }
const DEFAULT_A_LEVELS = ['Mathematics', 'Physics', 'Chemistry']

function round(n) {
  return Math.round(n)
}

// Turns an unmet requirement into a short, readable note, e.g.
// "also need Further Mathematics" / "need one of Biology, Chemistry" /
// "1 more science subject".
function describeGap(match) {
  const parts = []
  if (match.missingRequired.length > 0) {
    parts.push(`also need ${match.missingRequired.join(' and ')}`)
  }
  for (const group of match.unmetGroups) {
    parts.push(`need one of ${group.join(', ')}`)
  }
  if (match.scienceShortfall > 0) {
    parts.push(
      `${match.scienceShortfall} more science-related subject${
        match.scienceShortfall > 1 ? 's' : ''
      }`,
    )
  }
  return parts.join(' · ')
}

export default function CourseFinder({
  coursesData,
  subjects,
  selectedIds,
  onToggleSelect,
  onViewDetail,
  maxSelected,
}) {
  const [chosenALevels, setChosenALevels] = useState(DEFAULT_A_LEVELS)
  const [interestFilter, setInterestFilter] = useState('')
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)

  const stats = useMemo(() => computeDatasetStats(coursesData), [coursesData])

  function toggleALevel(subject) {
    setChosenALevels((prev) => {
      if (prev.includes(subject)) return prev.filter((s) => s !== subject)
      if (prev.length >= MAX_A_LEVELS) return prev
      return [...prev, subject]
    })
  }

  const { eligible, eligibleTotal, close } = useMemo(() => {
    if (chosenALevels.length === 0) {
      return { eligible: [], eligibleTotal: 0, close: [] }
    }
    const pool = interestFilter
      ? coursesData.filter((c) => c.subjectArea === interestFilter)
      : coursesData

    const eligibleRows = []
    const closeRows = []

    for (const course of pool) {
      const match = matchCourse(course, chosenALevels)
      const scored = scoreCourse(course, stats, weights)
      if (match.eligible) {
        eligibleRows.push({ course, match, ...scored })
      } else if (match.gapCount === 1) {
        closeRows.push({ course, match, ...scored })
      }
    }

    eligibleRows.sort((a, b) => b.compositeScore - a.compositeScore)
    closeRows.sort((a, b) => b.compositeScore - a.compositeScore)

    return {
      eligible: eligibleRows.slice(0, RESULT_COUNT),
      eligibleTotal: eligibleRows.length,
      close: closeRows.slice(0, CLOSE_COUNT),
    }
  }, [coursesData, chosenALevels, interestFilter, stats, weights])

  const totalWeight = weights.popularity + weights.ranking + weights.jobPotential
  const weightPct = (w) => (totalWeight > 0 ? round((w / totalWeight) * 100) : 0)

  function updateWeight(key, value) {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }))
  }

  function renderCourseCard({ course, match, compositeScore, popScore, rankScore, jobScore, popularityEstimated, jobPotentialEstimated }) {
    const isSelected = selectedIds.includes(course.id)
    const disableCheckbox = !isSelected && selectedIds.length >= maxSelected
    const gapNote = !match.eligible ? describeGap(match) : null

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

        <div className="eligibility-row">
          {match.eligible ? (
            match.hasRequirement ? (
              <span className="match-badge match-badge--eligible">
                ✓ Meets subject requirements
              </span>
            ) : (
              <span className="match-badge match-badge--open">
                No specific subjects required
              </span>
            )
          ) : (
            <span className="match-badge match-badge--close">
              Close match — {gapNote}
            </span>
          )}
        </div>

        <div className="match-breakdown">
          <span>
            Popularity {round(popScore)}
            {popularityEstimated && <em className="detail-note"> (estimated)</em>}
          </span>
          <span>Uni ranking {round(rankScore)}</span>
          <span>
            Job potential {round(jobScore)}
            {jobPotentialEstimated && <em className="detail-note"> (estimated)</em>}
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
            <span className="stat__value">{course.entryRequirements.aLevel}</span>
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
            <span className="stat__value">{formatCurrency(course.fees.homeAnnual)}</span>
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
  }

  return (
    <div className="finder">
      <p className="finder__intro">
        Choose the A-level subjects being studied (or planned), and we'll show
        which courses across all 24 Russell Group universities you're
        eligible for, based on each course's published entry requirements —
        plus any "close match" courses just one subject away.
      </p>

      <div className="finder-panel">
        <div className="finder-alevels">
          <div className="finder-alevels__header">
            <span>
              A-level subjects
              <InfoIcon text={FIELD_INFO.aLevelPicker} />
            </span>
            <span className="finder-alevels__count">
              {chosenALevels.length} of {MAX_A_LEVELS} selected
            </span>
          </div>
          <div className="subject-picker">
            {A_LEVEL_SUBJECTS.map((subject) => {
              const isChosen = chosenALevels.includes(subject)
              const disableChip = !isChosen && chosenALevels.length >= MAX_A_LEVELS
              return (
                <button
                  key={subject}
                  type="button"
                  className={
                    isChosen ? 'subject-chip is-selected' : 'subject-chip'
                  }
                  disabled={disableChip}
                  onClick={() => toggleALevel(subject)}
                  aria-pressed={isChosen}
                >
                  {subject}
                </button>
              )
            })}
          </div>

          <label className="finder-field finder-interest">
            <span>
              Narrow by subject area (optional)
              <InfoIcon text={FIELD_INFO.interestFilter} />
            </span>
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
            >
              <option value="">All subject areas</option>
              {subjects.map((s) => (
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

      {chosenALevels.length === 0 ? (
        <p className="empty-state">
          Choose at least one A-level subject above to see which courses
          you're eligible for.
        </p>
      ) : (
        <>
          <p className="result-count">
            {eligibleTotal} course{eligibleTotal === 1 ? '' : 's'} you meet the
            entry requirements for, based on {chosenALevels.join(', ')}
            {eligibleTotal > eligible.length ? ` (showing top ${eligible.length})` : ''}
          </p>

          {eligible.length === 0 ? (
            <p className="empty-state">
              No courses matched. Try adding another subject, or clearing the
              subject-area filter above.
            </p>
          ) : (
            <ul className="course-list">{eligible.map(renderCourseCard)}</ul>
          )}

          {close.length > 0 && (
            <div className="close-matches">
              <h3 className="close-matches__heading">
                Close matches
                <InfoIcon text={FIELD_INFO.closeMatch} />
              </h3>
              <p className="close-matches__subtitle">
                You're just one subject or subject group short of these
                courses' typical entry requirements.
              </p>
              <ul className="course-list">{close.map(renderCourseCard)}</ul>
            </div>
          )}

          <p className="data-note finder-disclaimer">
            Subject matching is done automatically from each course's stated
            A-level requirement text, so it's a best-effort guide, not a
            guarantee of an offer — universities also apply contextual
            offers, accept EPQs, IB, BTECs, and Scottish Highers as
            alternatives, and some list requirements that aren't captured
            here. Always check the course's own entry requirements page (via
            "Details →" below) before making decisions.
          </p>
        </>
      )}
    </div>
  )
}

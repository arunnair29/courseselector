// Scoring logic for the "Find my course" feature.
//
// Combines three signals into one 0-100 composite score per course:
//   - popularity      (applicants per place — higher is treated as more sought-after)
//   - university rank (Russell Group rank — lower rank number is better)
//   - job potential    (average of graduate employment rate and a normalized
//                       median-salary score)
//
// Courses missing a raw figure for popularity, employment rate, or salary are
// not excluded — they're scored using the dataset-wide average for that
// figure instead, so they can still appear in results. Each score result
// flags which parts were estimated this way so the UI can be transparent
// about it rather than presenting a guess as a real figure.

function mean(values) {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function computeDatasetStats(courses) {
  const applicants = courses
    .map((c) => c.popularity?.applicantsPerPlace)
    .filter((v) => v != null)
  const employment = courses
    .map((c) => c.careerOutcomes?.inWorkOrStudy15mo)
    .filter((v) => v != null)
  const salaries = courses
    .map((c) => c.careerOutcomes?.medianSalary15mo)
    .filter((v) => v != null)

  return {
    avgApplicantsPerPlace: mean(applicants),
    minApplicantsPerPlace: applicants.length ? Math.min(...applicants) : 0,
    maxApplicantsPerPlace: applicants.length ? Math.max(...applicants) : 1,
    avgEmploymentRate: mean(employment),
    avgMedianSalary: mean(salaries),
    minMedianSalary: salaries.length ? Math.min(...salaries) : 0,
    maxMedianSalary: salaries.length ? Math.max(...salaries) : 1,
  }
}

function normalize(value, min, max) {
  if (value == null) return 50
  if (max === min) return 50
  const pct = ((value - min) / (max - min)) * 100
  return Math.max(0, Math.min(100, pct))
}

// weights: { popularity, ranking, jobPotential } — any non-negative numbers,
// treated as relative proportions (they don't need to sum to 100).
export function scoreCourse(course, stats, weights) {
  const rank = course.universityRanking?.russellGroupRank
  const rankScore = rank ? ((25 - rank) / 24) * 100 : 50

  const rawApplicants = course.popularity?.applicantsPerPlace
  const popularityEstimated = rawApplicants == null
  const applicantsValue = rawApplicants ?? stats.avgApplicantsPerPlace
  const popScore = normalize(
    applicantsValue,
    stats.minApplicantsPerPlace,
    stats.maxApplicantsPerPlace,
  )

  const rawEmployment = course.careerOutcomes?.inWorkOrStudy15mo
  const employmentEstimated = rawEmployment == null
  const employmentValue = rawEmployment ?? stats.avgEmploymentRate ?? 50

  const rawSalary = course.careerOutcomes?.medianSalary15mo
  const salaryEstimated = rawSalary == null
  const salaryValue = rawSalary ?? stats.avgMedianSalary
  const salaryScore = normalize(
    salaryValue,
    stats.minMedianSalary,
    stats.maxMedianSalary,
  )

  const jobScore = (employmentValue + salaryScore) / 2
  const jobPotentialEstimated = employmentEstimated || salaryEstimated

  const wPop = Math.max(0, weights.popularity ?? 0)
  const wRank = Math.max(0, weights.ranking ?? 0)
  const wJob = Math.max(0, weights.jobPotential ?? 0)
  const totalWeight = wPop + wRank + wJob
  const safeTotal = totalWeight > 0 ? totalWeight : 1

  const compositeScore =
    (wPop * popScore + wRank * rankScore + wJob * jobScore) / safeTotal

  return {
    compositeScore,
    popScore,
    rankScore,
    jobScore,
    popularityEstimated,
    jobPotentialEstimated,
  }
}

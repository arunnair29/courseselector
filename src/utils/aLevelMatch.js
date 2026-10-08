// Matches a student's chosen A-level subjects against a course's stated
// A-level entry requirement text.
//
// The underlying data (`entryRequirements.aLevel`) is free text taken
// verbatim from university course pages — there's no structured "required
// subjects" field to query directly. This module extracts a best-effort
// structured requirement (specific subjects required, "one of" alternative
// groups, and generic "a science subject"-style slots) from that text so
// the "Find my course" tool can tell a student which courses they meet the
// subject requirements for, based on the A-levels they've chosen.
//
// This is necessarily approximate: offer wording varies hugely between
// universities, and edge cases (contextual offers, EPQ substitutions,
// "or" vs "and" ambiguity) won't always be parsed perfectly. Where a course
// mentions no recognisable subject at all, it's treated as open (no
// specific subject required) rather than excluded — which matches how most
// grade-only offers actually work.

// Canonical subject list offered to the user in the picker. Chosen to
// cover the vocabulary that actually appears across this dataset's
// entryRequirements.aLevel text (see aliases below for variant spellings).
export const A_LEVEL_SUBJECTS = [
  'Art and Design',
  'Biology',
  'Business Studies',
  'Chemistry',
  'Classical Civilisation',
  'Computer Science',
  'Design and Technology',
  'Drama and Theatre',
  'Economics',
  'Electronics',
  'English Language',
  'English Literature',
  'Environmental Science',
  'French',
  'Further Mathematics',
  'Geography',
  'Geology',
  'German',
  'History',
  'Law',
  'Mathematics',
  'Media Studies',
  'Music',
  'Philosophy',
  'Physical Education',
  'Physics',
  'Politics',
  'Psychology',
  'Religious Studies',
  'Sociology',
  'Spanish',
  'Statistics',
].sort()

// Subjects broadly considered "science-related" for matching generic
// phrases like "a science subject" / "two sciences" / "a further science
// subject" that don't name a specific subject.
const SCIENCE_SET = new Set([
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Further Mathematics',
  'Computer Science',
  'Environmental Science',
  'Geology',
  'Statistics',
  'Electronics',
  'Psychology',
  'Geography',
])

// Alias -> canonical subject. Keys are matched case-insensitively as whole
// phrases. Longer/more specific aliases are listed so they're preferred
// over a shorter substring (handled by sorting below, not by list order).
const ALIASES = {
  maths: 'Mathematics',
  math: 'Mathematics',
  mathematic: 'Mathematics',
  'further maths': 'Further Mathematics',
  'human biology': 'Biology',
  'life and health sciences': 'Biology',
  'life and health science': 'Biology',
  computing: 'Computer Science',
  'design technology': 'Design and Technology',
  'design & technology': 'Design and Technology',
  'product design': 'Design and Technology',
  'environmental studies': 'Environmental Science',
  'environmental sciences': 'Environmental Science',
  'environmental technology': 'Environmental Science',
  pe: 'Physical Education',
  'sport science': 'Physical Education',
  'sports science': 'Physical Education',
  'religious studies': 'Religious Studies',
  re: 'Religious Studies',
  'classical civilization': 'Classical Civilisation',
  'drama & theatre': 'Drama and Theatre',
  drama: 'Drama and Theatre',
  theatre: 'Drama and Theatre',
  'art & design': 'Art and Design',
  art: 'Art and Design',
}

// Build one master lookup of every recognised phrase (canonical names +
// aliases), longest phrase first so multi-word names are preferred over a
// shorter phrase that's a substring of them (e.g. "Further Mathematics"
// matches before plain "Mathematics" at the same position).
const RECOGNISED = new Map()
for (const s of A_LEVEL_SUBJECTS) RECOGNISED.set(s.toLowerCase(), s)
for (const [alias, canonical] of Object.entries(ALIASES)) {
  RECOGNISED.set(alias.toLowerCase(), canonical)
}
const RECOGNISED_PHRASES = [...RECOGNISED.keys()].sort((a, b) => b.length - a.length)

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const SUBJECT_ALTERNATION = RECOGNISED_PHRASES.map(escapeRegExp).join('|')
const SUBJECT_RE = new RegExp(`\\b(${SUBJECT_ALTERNATION})\\b`, 'gi')

function findSubjects(text) {
  const found = []
  let m
  SUBJECT_RE.lastIndex = 0
  while ((m = SUBJECT_RE.exec(text))) {
    const canonical = RECOGNISED.get(m[0].toLowerCase())
    if (canonical) found.push(canonical)
  }
  return found
}

// Remove matched spans from text (replace with spaces so surrounding
// offsets/words stay intact) so a later pass doesn't re-match them.
function blank(text, re) {
  return text.replace(re, (m) => ' '.repeat(m.length))
}

const NUMBER_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, 1: 1, 2: 2, 3: 3, another: 1 }

// Predicted-grade support. Uses the same UCAS Tariff (2017 table) point
// values already used elsewhere in this dataset (see merge_batch4.py's
// GRADE_POINTS / parse_tariff), so a student's predicted-grade tariff is
// directly comparable to a course's `entryRequirements.ucasTariffPoints`.
export const GRADE_OPTIONS = ['A*', 'A', 'B', 'C', 'D', 'E']

const GRADE_POINTS = { 'A*': 56, A: 48, B: 40, C: 32, D: 24, E: 16 }

/**
 * Convert a set of predicted/achieved grades into UCAS Tariff points,
 * using the best 3 grades (matching how `ucasTariffPoints` was computed
 * for this dataset from a course's stated grade profile). Returns null if
 * no recognised grade was supplied.
 */
export function computeTariffPoints(grades) {
  const values = (grades || [])
    .map((g) => GRADE_POINTS[g])
    .filter((v) => v != null)
  if (values.length === 0) return null
  values.sort((a, b) => b - a)
  return values.slice(0, 3).reduce((sum, v) => sum + v, 0)
}

/**
 * Parse a course's free-text A-level requirement into a best-effort
 * structured form.
 *
 * @returns {{
 *   required: string[],            // subjects that must ALL be present
 *   alternativeGroups: string[][],  // each group needs at least one match
 *   genericScienceCount: number,    // "a science subject" style slots, unnamed
 *   recognised: boolean,            // true if any subject/science phrase was found
 * }}
 */
export function parseALevelRequirement(rawText) {
  if (!rawText) {
    return { required: [], alternativeGroups: [], genericScienceCount: 0, recognised: false }
  }

  // Note: unlike an earlier version of this parser, parenthetical asides
  // are NOT stripped wholesale - some universities embed a real part of
  // the requirement inside parens (e.g. "(must include one of Biology,
  // Chemistry, Mathematics or Physics)"), and losing that silently
  // produced wrong matches. Contextual-offer/EPQ asides usually just
  // repeat subjects already found in the main clause, which is harmless
  // thanks to de-duplication below.
  let text = rawText

  const alternativeGroups = []

  // "N of/from: A, B, C(, or D)" groups, e.g. "including two of Biology,
  // Chemistry, Physics and Mathematics" or "two from: Biology, Chemistry, ...".
  const groupRe = /\b(one|two|three|1|2|3)\s+(?:of|from)\b:?\s*([^.;()]+?)(?=,\s*(?:plus|with|minimum)|[;()]|\.|$)/gi
  let gm
  while ((gm = groupRe.exec(text))) {
    const n = NUMBER_WORDS[gm[1].toLowerCase()] || 1
    const members = findSubjects(gm[2])
    if (members.length > 0) {
      // A group requiring n>1 members is still modelled as "need at least
      // one of the named subjects" (a reasonable simplification - the
      // common case is n=1; n>1 "two of four" groups are rare and this
      // stays permissive rather than wrongly excluding a real match).
      alternativeGroups.push([...new Set(members)])
    }
  }
  text = blank(text, groupRe)

  // Simple "X or Y(, or Z)" chains not already captured above, e.g.
  // "Biology or Chemistry", "Biology, Chemistry or Physics".
  const orChainRe = new RegExp(
    `\\b(?:${SUBJECT_ALTERNATION})\\b(?:\\s*,\\s*(?:${SUBJECT_ALTERNATION})\\b)*\\s*,?\\s+or\\s+(?:${SUBJECT_ALTERNATION})\\b`,
    'gi',
  )
  let om
  while ((om = orChainRe.exec(text))) {
    const members = findSubjects(om[0])
    if (members.length > 1) {
      alternativeGroups.push([...new Set(members)])
    }
  }
  text = blank(text, orChainRe)

  // Generic "a science subject" / "two sciences" / "a further science
  // subject" / "another core science/mathematics subject" style slots that
  // don't name one specific subject (a range of acceptable subjects is
  // implied instead). Also matches a trailing "/maths" or "/mathematics"
  // combined-subject phrasing (e.g. "science/maths subject").
  let genericScienceCount = 0
  const scienceCountRe =
    /\b(a|an|one|two|three|1|2|3|another)\s+(?:other\s+|further\s+|second\s+|additional\s+|core\s+|related\s+)*scien(?:ce|tific)(?:\s*\/\s*maths?|\s*\/\s*mathematics?)?(?:-related)?\s*(?:subjects?)?\b/gi
  let sm
  while ((sm = scienceCountRe.exec(text))) {
    const token = sm[1].toLowerCase()
    genericScienceCount += NUMBER_WORDS[token] || 1
  }
  text = blank(text, scienceCountRe)

  // Whatever named subjects remain are treated as strictly required
  // (joined by "and"/commas in the source text - conjunction words are
  // simply not matched by the subject scan, so this works regardless of
  // exact punctuation).
  const required = [...new Set(findSubjects(text))]

  return {
    required,
    alternativeGroups,
    genericScienceCount,
    recognised: required.length > 0 || alternativeGroups.length > 0 || genericScienceCount > 0,
  }
}

/**
 * Check whether a student's chosen A-level subjects satisfy a course's
 * parsed requirement.
 *
 * @param {string[]} userSubjects
 * @param {ReturnType<typeof parseALevelRequirement>} requirement
 */
export function evaluateMatch(userSubjects, requirement) {
  const chosen = new Set(userSubjects)
  const missingRequired = requirement.required.filter((s) => !chosen.has(s))
  const unmetGroups = requirement.alternativeGroups.filter(
    (group) => !group.some((s) => chosen.has(s)),
  )
  const scienceHave = [...chosen].filter((s) => SCIENCE_SET.has(s)).length
  const scienceShortfall = Math.max(0, requirement.genericScienceCount - scienceHave)

  const gapCount = missingRequired.length + unmetGroups.length + (scienceShortfall > 0 ? 1 : 0)

  return {
    eligible: gapCount === 0,
    missingRequired,
    unmetGroups,
    scienceShortfall,
    gapCount,
    hasRequirement: requirement.recognised,
  }
}

/**
 * Convenience wrapper: parse a course's aLevel text and evaluate it
 * against the chosen subjects (and, optionally, predicted grades) in one
 * call.
 *
 * @param {string[]} userSubjects
 * @param {Record<string, string>} [gradesBySubject] - optional map of
 *   chosen subject -> predicted/achieved grade (one of GRADE_OPTIONS).
 *   Subjects with no grade entered are simply left out of the tariff
 *   calculation, so partial input still produces a (labelled) estimate.
 */
export function matchCourse(course, userSubjects, gradesBySubject = {}) {
  const requirement = parseALevelRequirement(course.entryRequirements?.aLevel)
  const subjectMatch = evaluateMatch(userSubjects, requirement)

  const enteredGrades = userSubjects
    .map((s) => gradesBySubject[s])
    .filter(Boolean)
  const userTariff = computeTariffPoints(enteredGrades)
  const requiredTariff = course.entryRequirements?.ucasTariffPoints ?? null

  // Only offer a tariff comparison when we have both a usable predicted
  // tariff and a known requirement for this course - otherwise there's
  // nothing meaningful to compare, so it's left out rather than guessed.
  let tariffMatch = null
  if (userTariff != null && requiredTariff != null) {
    tariffMatch = {
      userTariff,
      requiredTariff,
      gradesCounted: enteredGrades.length,
      meetsTariff: userTariff >= requiredTariff,
    }
  }

  const gapCount = subjectMatch.gapCount + (tariffMatch && !tariffMatch.meetsTariff ? 1 : 0)

  return {
    requirement,
    ...subjectMatch,
    tariffMatch,
    gapCount,
    eligible: gapCount === 0,
  }
}

/**
 * True when a match's single gap (gapCount === 1) is specifically a
 * predicted-grade/tariff shortfall — the student's chosen subjects already
 * satisfy the course's subject requirements, but their predicted grades'
 * UCAS Tariff total falls short of the typical offer. This is the case
 * "Find my course" offers backup suggestions for, since a missing subject
 * can't be fixed by a backup course recommendation the same way a grade
 * shortfall can.
 */
export function isTariffOnlyGap(match) {
  return (
    match.missingRequired.length === 0 &&
    match.unmetGroups.length === 0 &&
    match.scienceShortfall === 0 &&
    Boolean(match.tariffMatch) &&
    !match.tariffMatch.meetsTariff
  )
}

/**
 * Suggests realistic "backup" courses for when a student's predicted
 * grades fall short of a course's typical offer (see isTariffOnlyGap):
 * other courses in the same subject area whose own entry requirements the
 * student's chosen subjects AND predicted grades already satisfy, so
 * there's a safer fallback alongside a more ambitious reach course.
 *
 * Ranked by the backup's own required UCAS Tariff points, highest first —
 * i.e. the most competitive course the student would still be safely
 * eligible for, rather than the easiest one available.
 *
 * @param {object} course - the course the student fell short of.
 * @param {object[]} coursesData - the full course dataset to search.
 * @param {string[]} userSubjects
 * @param {Record<string, string>} [gradesBySubject]
 * @param {number} [limit] - max number of backups to return (default 3).
 */
export function findBackupCourses(
  course,
  coursesData,
  userSubjects,
  gradesBySubject = {},
  limit = 3,
) {
  const candidates = coursesData.filter(
    (c) => c.id !== course.id && c.subjectArea === course.subjectArea,
  )

  const viable = []
  for (const candidate of candidates) {
    const match = matchCourse(candidate, userSubjects, gradesBySubject)
    if (match.eligible) {
      viable.push({ course: candidate, match })
    }
  }

  viable.sort((a, b) => {
    const aTariff = a.course.entryRequirements?.ucasTariffPoints ?? -1
    const bTariff = b.course.entryRequirements?.ucasTariffPoints ?? -1
    if (bTariff !== aTariff) return bTariff - aTariff
    return a.course.courseTitle.localeCompare(b.course.courseTitle)
  })

  return viable.slice(0, limit)
}

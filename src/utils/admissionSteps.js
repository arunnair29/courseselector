// courses.json uses several "no test" phrasings for admissionsTests
// (e.g. "None required", "Not required for the A*A*A offer...", "No
// written admissions test for Earth Sciences...") — checked against
// every distinct value in the real dataset. Anything matching this is
// skipped rather than turned into a nonsensical "register for None
// required" step.
const NO_TEST_PATTERN = /^(none|not required|no\b)/i

// Generic, subject-agnostic steps in a typical UK undergraduate
// application — not specific to any one course, just the standard UCAS
// process. Where a course has a real, stated admissions test requirement
// (from courses.json), that's named directly rather than invented.
export function getSuggestedSteps(course) {
  const steps = [
    'Check you meet the published entry requirements for this course',
    'Register with UCAS and add this course to your application',
  ]

  const testInfo = course?.entryRequirements?.admissionsTests?.trim()
  if (testInfo && !NO_TEST_PATTERN.test(testInfo)) {
    steps.push(`Admissions test: ${testInfo}`)
  }

  steps.push(
    'Draft your personal statement',
    'Request academic references',
    'Submit your UCAS application before the deadline',
    'Prepare for an interview or assessment, if the course has one',
  )

  return steps
}

// Generic, subject-area-level suggestions for the *kind* of preparation
// that typically helps when applying for a course in a given field.
//
// Same fidelity bar as careerPaths.js: these are general suggestion types
// (e.g. "past exam papers"), never a specific named book, website, or
// course, because we have no verifiable per-course source for that across
// all 481 courses. The UI shows STUDY_RESOURCES_DISCLAIMER alongside them.

export const STUDY_RESOURCES_DISCLAIMER =
  "General suggestions for the kind of preparation that tends to help for this subject area — not specific named books, websites, or courses. Check this course's own entry requirements page and your school/college's careers service for reading lists particular to it."

const GENERIC_RESOURCES = [
  'Past exam papers for your chosen A-level subjects',
  'A personal statement draft explaining your interest in this subject',
  'Notes on any relevant work experience, volunteering, or extracurricular projects',
]

// Matched by keyword against subjectArea, broadest/most specific first.
const CATEGORY_RESOURCES = [
  [
    ['medic', 'dentistry', 'dental', 'veterinary', 'nursing', 'midwif', 'therap', 'global health', 'pharmac', 'dietet', 'nutrition', 'audiolog', 'humanitarian'],
    [
      'Relevant work experience, shadowing, or volunteering in a care/clinical setting',
      'Wider reading on recent developments in medicine/healthcare',
      "Admissions test practice (e.g. UCAT, BMAT) — check this course's requirements",
    ],
  ],
  [
    ['law'],
    [
      'Wider reading on legal topics and current affairs',
      'Mock trial, debating, or mooting experience',
      'Work experience or shadowing at a legal practice',
    ],
  ],
  [
    ['comput', 'data science', 'cyber', 'software', 'artificial intelligence', 'data', 'information', 'technology and innovation'],
    [
      'A personal coding project or portfolio (e.g. on GitHub)',
      'An introductory online course in programming fundamentals',
      'Wider reading on current developments in computing/technology',
    ],
  ],
  [
    [
      'engineer',
      'manufactur',
      'aerospace',
      'automotive',
      'mechanical',
      'electrical',
      'civil',
      'chemical engineering',
      'materials',
      'architect',
    ],
    [
      'A personal project demonstrating practical or design skills',
      'Wider reading on engineering/design principles and current projects',
      'Attendance at relevant open days or taster sessions',
    ],
  ],
  [
    ['math', 'statistic', 'actuarial'],
    [
      'Practice beyond the core A-level syllabus (e.g. further maths problem sets)',
      'Wider reading on real-world applications of maths/statistics',
    ],
  ],
  [
    ['physic'],
    [
      'Wider reading on physics beyond the A-level syllabus',
      'Physics problem-solving or olympiad-style practice',
    ],
  ],
  [
    ['chem', 'biochem'],
    [
      'Wider reading on chemistry beyond the A-level syllabus',
      'Practical lab experience, where available',
    ],
  ],
  [
    [
      'biolog',
      'zoology',
      'genetic',
      'ecology',
      'environmental',
      'marine',
      'biomedical',
      'anatomy',
      'physiology',
      'health',
      'food science',
      'biotechnolog',
      'agricultur',
      'animal science',
      'agribusiness',
      'human scien',
      'neurosci',
    ],
    [
      'Relevant work experience or volunteering (e.g. labs, clinics, conservation)',
      'Wider reading on recent developments in the life sciences',
    ],
  ],
  [
    ['business', 'economic', 'management', 'finance', 'account', 'marketing', 'analytic'],
    [
      'Wider reading on business/economics news and current affairs',
      'Work experience, a part-time job, or an enterprise/school project',
    ],
  ],
  [
    ['psycholog'],
    [
      'Wider reading on psychology beyond the A-level syllabus',
      'Relevant volunteering (e.g. mental health, care, or education settings)',
    ],
  ],
  [
    ['art', 'design', 'landscape'],
    [
      'A portfolio of creative or design work',
      'Visits to relevant exhibitions, galleries, or sites',
    ],
  ],
  [
    [
      'history',
      'archaeolog',
      'classic',
      'theolog',
      'philosoph',
      'english',
      'literature',
      'language',
      'linguistic',
      'welsh',
      'chinese',
      'japanese',
      'translat',
      'comparative literature',
      'spanish',
      'portuguese',
      'latin american',
      'hebrew',
      'icelandic',
      'french',
      'german',
      'dutch',
      'italian',
      'russian',
    ],
    [
      'Wider reading beyond the A-level syllabus in this subject',
      'Essay practice on topics of personal interest within the subject',
    ],
  ],
  [
    ['geograph', 'geolog', 'earth science', 'urban plan', 'town plan', 'country planning', 'land management', 'urban', 'sustainab', 'built environment'],
    [
      'Wider reading on physical or human geography topics',
      'Fieldwork or relevant outdoor/environmental experience',
    ],
  ],
  [
    ['polit', 'sociolog', 'anthropolog', 'international relations', 'international development', 'development', 'war studies', 'social polic', 'social scien', 'social work', 'government', 'criminolog', 'crime', 'youth'],
    [
      'Wider reading on current affairs and debates relevant to this subject',
      'Essay practice analysing a social, political, or policy issue of your choice',
    ],
  ],
  [
    ['journalis', 'media', 'music', 'education', 'film', 'theatre', 'performance', 'communication'],
    [
      'A personal portfolio of relevant work (writing, media production, performance, or teaching experience as applicable)',
      'Wider reading or listening on current developments in this field',
    ],
  ],
]

export function getStudyResources(subjectArea) {
  const lower = (subjectArea || '').toLowerCase()
  for (const [keywords, resources] of CATEGORY_RESOURCES) {
    if (keywords.some((k) => lower.includes(k))) {
      return [...GENERIC_RESOURCES, ...resources]
    }
  }
  return GENERIC_RESOURCES
}

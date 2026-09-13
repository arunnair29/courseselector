# CourseSelector

A React app for comparing UK university courses — entry requirements, fees, and
graduate career prospects — across Computer Science, Physics, Chemistry,
Biology, Mathematics, Engineering, Medicine, Psychology, Biomedical Sciences,
Geology & Earth Sciences, Environmental Science, Neuroscience, and Genetics at
the 24 Russell Group universities, with more subjects being added over time.
It also lets you sort by Complete University Guide ranking and by course
popularity (applicants per place).

## Running locally

This project was built with [Vite](https://vitejs.dev/). You'll need
[Node.js](https://nodejs.org/) 18+ installed.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

> **Note:** this project's source was written in a sandboxed environment
> without access to the npm package registry, so `npm install` and the build
> could not be verified there. The code follows a standard Vite + React
> layout, but if `npm install` or `npm run dev` surfaces an error, let me know
> the error message and I'll fix it.

## Building for production

```bash
npm run build
```

This outputs static files to `dist/` which can be deployed anywhere that
serves static sites (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Project structure

```
src/
  data/courses.json       — the course dataset (edit this to add/update courses)
  components/             — UI components (Filters, CourseList, CompareView, CourseDetail)
  utils/format.js          — display formatting helpers
  App.jsx                  — top-level state (search, filters, sort, comparison, routing between views)
  main.jsx                 — React entry point
```

## Updating the data

Each course in `src/data/courses.json` follows this shape:

```json
{
  "id": "unique-id",
  "university": "...",
  "courseTitle": "...",
  "subjectArea": "...",
  "ucasCode": "...",
  "degreeType": "...",
  "duration": "...",
  "entryRequirements": { "aLevel": "...", "ib": "...", "ucasTariffPoints": 160, "admissionsTests": "...", "otherRequirements": "..." },
  "fees": { "homeAnnual": 9790, "internationalAnnual": 37800, "feeYear": "..." },
  "careerOutcomes": { "inWorkOrStudy15mo": 90, "highlySkilledWork": 95, "medianSalary15mo": 45000, "salaryRange15mo": "...", "commonDestination": "..." },
  "sources": ["https://...", "https://..."]
}
```

Use `null` for any figure you don't have yet — the UI will show "N/A" rather
than a misleading blank or zero.

## Current data coverage

- **Computer Science**: all 24 Russell Group universities (LSE's closest equivalent, BSc Data Science, is used since it doesn't offer a standalone CS degree).
- **Physics**: 23 of 24 (all except LSE, which doesn't offer Physics). Cambridge is covered via its Natural Sciences Tripos (no standalone Physics degree there).
- **Chemistry**: 23 of 24 (all except LSE, which doesn't offer Chemistry). Cambridge is covered via its Natural Sciences Tripos. Exeter has no standalone Chemistry BSc/MChem — its Biological and Medicinal Chemistry BSc is used as the closest equivalent, and that entry's exact grades/UCAS code/fees could not be confirmed from an official source in this pass (marked with a `dataNote`).
- **Biology**: 23 of 24 (all except LSE, which doesn't offer Biology). Cambridge is covered via its Natural Sciences Tripos. Glasgow has no plain "Biology" degree — Molecular & Cellular Biology is used as the closest equivalent. KCL has no standalone Biology/Biological Sciences degree — Biomedical Science is used instead. Exeter's Biological Sciences BSc, unlike its Chemistry situation, was fully confirmed from an official source.
- **Mathematics**: all 24 Russell Group universities. LSE has no standalone Mathematics degree — BSc Mathematics with Economics is used as the closest equivalent (mirroring its Data Science substitution for Computer Science). Cambridge, unlike Physics/Chemistry/Biology, has its own standalone Mathematical Tripos rather than routing through Natural Sciences.
- **Engineering**: 23 of 24 (all except LSE, which doesn't offer Engineering). Most universities don't offer a plain "Engineering" degree — where a general first-year-common "General Engineering" or "Engineering Science" course exists (Oxford, Cambridge, Durham, Edinburgh, Warwick, KCL, Sheffield, York, Exeter, and Birmingham's general BEng), that's used; everywhere else, Mechanical Engineering is used as the representative discipline (flagged with a `dataNote` on each such entry).
- **Medicine**: 21 of 24. Excluded: LSE (no Medicine degree), Durham (no standalone clinical Medicine programme — historically merged into Newcastle), and Warwick (Medicine there is Graduate-Entry only, no direct A-level entry route). York's entry is delivered via the Hull York Medical School partnership. Edinburgh's A-level/IB grades could not be extracted (rendered via an interactive dropdown widget rather than static text) and are marked `null` with a `dataNote`; Liverpool's detailed entry requirements similarly could not be confirmed from an official source that was reachable in this pass.
- **Psychology**: 23 of 24. Excluded: Imperial College London (no undergraduate Psychology degree — postgraduate/intercalated only). LSE's "Psychological and Behavioural Science" is a genuine full equivalent here (unlike its CS/Maths substitutions elsewhere) — flagged in a `dataNote` to make that distinction clear. Edinburgh again has the dropdown-widget grades limitation seen in Medicine.
- **Biomedical Sciences**: 20 of 24. Excluded: LSE (no science degrees), Glasgow (no standalone undergraduate Biomedical Sciences — only Biomedical Engineering and an MSc/MRes at postgraduate level), Durham (folded into the Biosciences MBiol as a themed route rather than a separately admitted degree), and Cambridge (biomedical topics sit within the Natural Sciences Tripos, the same course already used for Cambridge's Biology entry — a fourth entry would have duplicated it with no distinct admission code). Imperial's closest equivalent is Medical Biosciences BSc. KCL's Biomedical Science entry here (`kcl-biomed`) is the same real-world course already listed under KCL's Biology entry (`kcl-biology`) as its proxy — Biomedical Science is KCL's closest match for both subject areas.
- **Geology & Earth Sciences**: 15 of 24. Cambridge is covered via its Natural Sciences Tripos (Earth Sciences is a genuine formal subject option there). Manchester's closest equivalent is Earth and Planetary Sciences. Durham and UCL only offer this under an "Earth Sciences" title rather than plain Geology. Excluded (no matching degree found): LSE, KCL, QMUL, Newcastle, Nottingham, QUB, Sheffield, and Warwick. Edinburgh's grades could not be extracted (interactive dropdown widget) and fees weren't confirmed for several entries (marked with `dataNote`).
- **Environmental Science**: 20 of 24. Several universities offer this only under a related name rather than plain "Environmental Science" — Bristol, Durham, and UCL as Environmental Geoscience, Cardiff as Environmental Sustainability Science, Glasgow as Environmental Science and Sustainability, Imperial as Ecology and Environmental Biology, QUB as Environmental Management, and Edinburgh as Ecological and Environmental Sciences. Cambridge has no distinct Natural Sciences Tripos pathway for this subject, so (unlike Geology/Neuroscience/Genetics) it isn't included here. Excluded (no matching degree found): LSE, Oxford, Warwick. UCL's entry has several fields unconfirmed and is flagged with a `dataNote`.
- **Neuroscience**: 16 of 24. Cambridge is covered via its Natural Sciences Tripos ("Psychology, Neuroscience & Behaviour" Part II). Birmingham's closest equivalent is Human Neuroscience. Excluded (no matching degree found): LSE, Oxford, Imperial, Liverpool, Newcastle, QUB, Sheffield, and Durham. Cardiff's and Queen Mary's fee figures were deliberately left unconfirmed (`null`) rather than used, because the only figures found looked stale/out of date relative to those universities' other current fees — flagged with a `dataNote` in each case.
- **Genetics**: 8 of 24 — the smallest subject in this dataset, because most Russell Group universities fold Genetics into a broader Biological/Biomedical Sciences degree rather than admitting it as a standalone course. Cambridge is covered via its Natural Sciences Tripos (Part II Genetics). Edinburgh's closest equivalent is Biological Sciences (Genetics); KCL's is Molecular Genetics; Queen Mary's is Medical Genetics. Newcastle's Genetics course was found to be explicitly withdrawn for 2026 entry, and Nottingham's could not be confirmed as still running — both excluded rather than listed with stale data. Excluded elsewhere (no matching degree found): LSE, Oxford, Imperial, Birmingham, Bristol, Cardiff, Durham, Exeter, Liverpool, Southampton, QUB, Sheffield, Warwick, and York.

263 courses total. All entry requirements and fees were researched from official university course pages and UCAS. Graduate outcomes are split across two related but distinct fields:

- `highlySkilledWork` — % of graduates with known destinations in highly skilled work or further study 15 months after graduating. Populated for 251 of 263 courses (95%): a small number (mainly Computer Science and Medicine) carry Discover Uni/HESA figures specific to that exact course, and the rest are sourced from the Complete University Guide's "Graduate Prospects – Outcomes" league table metric (same underlying HESA Graduate Outcomes 2022-23 cohort survey, but reported at subject-within-university level rather than per individual course variant — every course sharing a subject and university shares this figure). Each such entry carries a `dataNote` naming this source and caveat. A handful of subject/university combinations (12 of 263) weren't confirmed in the league tables checked and remain `null`. Neuroscience and Genetics have no standalone Complete University Guide subject table, so their Biological Sciences table figure is used as the closest proxy, flagged accordingly.
- `inWorkOrStudy15mo` (broader: any work or further study, not just highly skilled) and `medianSalary15mo` — these remain largely unresearched beyond the original Oxford/Imperial Discover Uni coverage, since no reliable, scalable, course-level source was found for either (Complete University Guide doesn't publish salary at all, and the broader work-or-study rate isn't broken out separately from the highly-skilled figure in its tables). The app's sort/ranking now prefers `highlySkilledWork` where available and falls back to `inWorkOrStudy15mo` only where that's the sole figure present.

Popularity (applicants-per-place) remains the least-researched field — most universities simply don't publish a per-course competition ratio, so it's still largely "N/A" rather than a guess. A few other gaps are marked with a `dataNote` field on the course entry (e.g. Cardiff CS/Physics outcomes, Sheffield CS's unusually low 60% figure worth double-checking, LSE's Data Science and Mathematics-with-Economics proxies, Exeter's Chemistry proxy, Glasgow's and KCL's Biology proxies, the many Mechanical-Engineering-as-proxy entries, Queen's Belfast and Newcastle missing some detailed grade breakdowns, several fee figures across Medicine/Psychology/Biomedical Sciences/Geology/Environmental Science/Neuroscience/Genetics not yet confirmed from an official source, and a couple of discontinued/withdrawn Genetics courses excluded rather than listed with stale data).

### University ranking & popularity

Every course also carries:
- `universityRanking` — the university's overall Complete University Guide 2027 ranking, restricted to the 24 Russell Group universities (1 = highest-ranked).
- `popularity` — applicants-per-place, where available, either stated directly by the department or derived as 1/offer-rate from Freedom of Information data (source: admissionreport.com / tutorhunt.com). Coverage is patchy (currently strongest for Computer Science) — most courses in the other five subjects show "N/A" here rather than a guess.

The app's sort dropdown includes "University ranking (best first)" and "Popularity (most applicants per place first)" alongside the original tariff/salary/employment sorts.

All thirteen subjects covered so far span the original plan plus four additional science-based subjects (Geology & Earth Sciences, Environmental Science, Neuroscience, Genetics). Further subjects can be added in the same subject-by-subject, all-24-universities pattern.

Entry requirements and fees change year to year — always verify against the
official university/UCAS pages before relying on this for a real application.

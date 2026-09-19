# CourseSelector

A React app for comparing UK university courses — entry requirements, fees, and
graduate career prospects — across Computer Science, Physics, Chemistry,
Biology, Mathematics, Engineering, Medicine, Psychology, Biomedical Sciences,
Geology & Earth Sciences, Environmental Science, Neuroscience, Genetics, and a
growing set of specialised science subjects (Biochemistry, Materials Science,
Pharmacology, Pharmacy, Astrophysics, Chemical Engineering, Statistics, and
more) at the 24 Russell Group universities, with more subjects being added
over time. It also lets you sort by Complete University Guide ranking and by
course popularity (applicants per place).

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

### Extended science coverage at Oxbridge and the London Russell Group universities

A second expansion pass added 33 more real, currently-offered undergraduate science courses at the University of Oxford, University of Cambridge, Imperial College London, UCL, King's College London, LSE, and Queen Mary University of London — the two Oxbridge universities plus all five London members of the Russell Group. This introduced 19 new subject-area categories beyond the original thirteen: Biochemistry, Materials Science, Pharmacology, Pharmacy, Astrophysics, Chemical Engineering, Statistics, Actuarial Science, Aeronautical Engineering, Anatomy, Dentistry, Human Sciences, Infection and Immunity, Mathematics & Statistics, Nutritional Sciences, Physics and Philosophy, Theoretical Physics, and Veterinary Medicine — each of which now appears automatically in the subject filter and "Find my course" pickers.

This pass was research-only (no fabricated data) and, as with earlier passes, some courses that look like obvious candidates were deliberately left out because they don't actually exist as standalone degrees — for example Imperial has no standalone undergraduate Psychology, Genetics, or Neuroscience course; KCL and QMUL have no Geology/Earth Sciences department; Oxford's Astrophysics and Cambridge's Astrophysics/Chemical Engineering are options within other courses (Physics, Natural Sciences, Engineering) rather than separate admissions routes; and LSE — a social-science institution with no Physics, Chemistry, Biology, Medicine, or Engineering departments at all — only yielded genuinely quantitative/science-adjacent additions (Actuarial Science, two Mathematics variants). Several new entries carry a `dataNote` explaining a specific limitation encountered, most commonly: Oxford/Cambridge/Imperial not admitting by UCAS Tariff (a Tariff-equivalent figure was computed from the stated A-level grades for cross-university comparison and flagged as such); Discover Uni substituting a broader subject-group's outcomes for a small or newly-introduced course; KCL's fee pages rendering fees via client-side JavaScript that couldn't be fetched directly (international fees for KCL's new entries come from secondary aggregators, flagged accordingly); and Cambridge's Discover Uni course pages not resolving in this environment (Complete University Guide subject-table figures were used as the closest available proxy where possible).

296 courses total. All entry requirements and fees were researched from official university course pages and UCAS. Graduate outcomes are split across two related but distinct fields:

- `highlySkilledWork` — % of graduates with known destinations in highly skilled work or further study 15 months after graduating. Populated for 282 of 296 courses (95%): a small number (mainly Computer Science and Medicine) carry Discover Uni/HESA figures specific to that exact course, and the rest are sourced from the Complete University Guide's "Graduate Prospects – Outcomes" league table metric (same underlying HESA Graduate Outcomes 2022-23 cohort survey, but reported at subject-within-university level rather than per individual course variant — every course sharing a subject and university shares this figure). Each such entry carries a `dataNote` naming this source and caveat. A handful of subject/university combinations (14 of 296) weren't confirmed in the league tables checked and remain `null` (this includes a few of the new Oxbridge science-course additions where Cambridge's Discover Uni course pages didn't resolve in this environment, and where Oxford's own joint/interdisciplinary courses had too small a Discover Uni sample to publish a figure). Neuroscience and Genetics have no standalone Complete University Guide subject table, so their Biological Sciences table figure is used as the closest proxy, flagged accordingly.
- `inWorkOrStudy15mo` (broader: any work or further study, not just highly skilled) and `medianSalary15mo` — these remain largely unresearched beyond the original Oxford/Imperial Discover Uni coverage plus the new science-course additions, since no reliable, scalable, course-level source was found for either at most other universities (Complete University Guide doesn't publish salary at all, and the broader work-or-study rate isn't broken out separately from the highly-skilled figure in its tables). The app's sort/ranking now prefers `highlySkilledWork` where available and falls back to `inWorkOrStudy15mo` only where that's the sole figure present.

**Home tuition fees** (`fees.homeAnnual`) are complete for all 296 courses. UK home fees are set by a single UK-wide government fee cap rather than varying by course, and this was confirmed directly against several universities' own published fee pages (Cardiff, Queen's University Belfast, Edinburgh, Glasgow, and others) — all match the national cap exactly, with no subject- or institution-specific deviation for the subjects in this dataset. Where a course's own fee page wasn't confirmed in this pass, the entry shows the confirmed UK-wide cap for its stated entry year (£9,790 for 2026/27 entry, £10,050 for 2027/28 entry), flagged with a `dataNote` explaining this. **International fees** (`fees.internationalAnnual`) are a separate, much less scalable field — they vary by subject and university with no single cap — and remain missing for 137 of 296 courses.

**Admissions tests** (`entryRequirements.admissionsTests`) are complete for all 296 courses. UK admissions tests for these subjects are concentrated at a small, specifically-researched set of universities — Oxford, Cambridge, Imperial, UCL, and Warwick (TMUA/ESAT/TARA for specific science, maths, CS and engineering courses), Durham (TMUA recommended for Mathematics only), and UCAT for Medicine and Dentistry everywhere. Every other university/subject combination was confirmed against official course or admissions-test pages not to require a test, so those entries show "None required" rather than being left blank — this reflects actual policy, not an unresearched gap.

**Popularity** (applicants-per-place) remains the weakest field: filled for only 20 of 296 courses, mostly Medicine and Computer Science plus a few of the new Oxford/Cambridge science additions, derived either from figures stated directly by departments, from official university admissions-statistics reports (e.g. Birmingham's published MBChB cycle data, Oxford's own department/college admissions-feedback PDFs for Materials Science and Human Sciences), or as 1/offer-rate from Freedom of Information data via admissionreport.com/tutorhunt.com. No scalable, bulk, per-course source was found for this field even after further research passes — UCAS does publish provider/subject-level application data, but only as very large multi-year data files that aren't accessible from this tool's environment, and most individual universities simply don't publish a competition ratio per course. The remaining 276 courses show "N/A" here rather than a guess.

A few other gaps are marked with a `dataNote` field on the course entry (e.g. Cardiff CS/Physics outcomes, Sheffield CS's unusually low 60% figure worth double-checking, LSE's Data Science and Mathematics-with-Economics proxies, Exeter's Chemistry proxy, Glasgow's and KCL's Biology proxies, the many Mechanical-Engineering-as-proxy entries, Queen's Belfast and Newcastle missing some detailed grade breakdowns, and a couple of discontinued/withdrawn Genetics courses excluded rather than listed with stale data).

### University ranking & popularity

Every course also carries:
- `universityRanking` — the university's overall Complete University Guide 2027 ranking, restricted to the 24 Russell Group universities (1 = highest-ranked).
- `popularity` — applicants-per-place, where available (20 of 296 courses — see above), either stated directly by the department, taken from a university's own published admissions statistics, or derived as 1/offer-rate from Freedom of Information data (source: admissionreport.com / tutorhunt.com).

The app's sort dropdown includes "University ranking (best first)" and "Popularity (most applicants per place first)" alongside the original tariff/salary/employment sorts.

The original thirteen subjects span the original plan plus four additional science-based subjects (Geology & Earth Sciences, Environmental Science, Neuroscience, Genetics), covered consistently across all 24 Russell Group universities. A second pass then added 19 more specialised science subjects, but only at Oxford, Cambridge, and the five London Russell Group universities (Imperial, UCL, KCL, LSE, QMUL) rather than all 24 — see "Extended science coverage" above. Further subjects, or wider university coverage of the newer subjects, can be added in the same research-first, no-fabrication pattern.

Entry requirements and fees change year to year — always verify against the
official university/UCAS pages before relying on this for a real application.

import { useMemo, useState } from 'react'
import coursesData from './data/courses.json'
import Filters from './components/Filters.jsx'
import CourseList from './components/CourseList.jsx'
import CompareView from './components/CompareView.jsx'
import CourseDetail from './components/CourseDetail.jsx'
import CourseFinder from './components/CourseFinder.jsx'

const MAX_COMPARE = 4

export default function App() {
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [universityFilter, setUniversityFilter] = useState('')
  const [sortBy, setSortBy] = useState('university')
  const [selectedIds, setSelectedIds] = useState([])
  const [view, setView] = useState('browse') // 'browse' | 'finder' | 'compare' | 'detail'
  const [detailId, setDetailId] = useState(null)
  const [returnView, setReturnView] = useState('browse')

  const subjects = useMemo(
    () => [...new Set(coursesData.map((c) => c.subjectArea))].sort(),
    [],
  )
  const universities = useMemo(
    () => [...new Set(coursesData.map((c) => c.university))].sort(),
    [],
  )

  const filteredCourses = useMemo(() => {
    let list = coursesData.filter((c) => {
      const matchesSearch =
        search.trim() === '' ||
        c.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        c.university.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = !subjectFilter || c.subjectArea === subjectFilter
      const matchesUniversity =
        !universityFilter || c.university === universityFilter
      return matchesSearch && matchesSubject && matchesUniversity
    })

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'tariff-desc':
          return (
            (b.entryRequirements.ucasTariffPoints ?? 0) -
            (a.entryRequirements.ucasTariffPoints ?? 0)
          )
        case 'tariff-asc':
          return (
            (a.entryRequirements.ucasTariffPoints ?? 0) -
            (b.entryRequirements.ucasTariffPoints ?? 0)
          )
        case 'salary-desc':
          return (
            (b.careerOutcomes.medianSalary15mo ?? 0) -
            (a.careerOutcomes.medianSalary15mo ?? 0)
          )
        case 'employment-desc':
          return (
            (b.careerOutcomes.highlySkilledWork ?? b.careerOutcomes.inWorkOrStudy15mo ?? 0) -
            (a.careerOutcomes.highlySkilledWork ?? a.careerOutcomes.inWorkOrStudy15mo ?? 0)
          )
        case 'ranking-asc':
          return (
            (a.universityRanking?.russellGroupRank ?? 999) -
            (b.universityRanking?.russellGroupRank ?? 999)
          )
        case 'popularity-desc':
          return (
            (b.popularity?.applicantsPerPlace ?? -1) -
            (a.popularity?.applicantsPerPlace ?? -1)
          )
        case 'university':
        default:
          return a.university.localeCompare(b.university)
      }
    })

    return list
  }, [search, subjectFilter, universityFilter, sortBy])

  const selectedCourses = selectedIds
    .map((id) => coursesData.find((c) => c.id === id))
    .filter(Boolean)

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  function viewDetail(id) {
    setDetailId(id)
    setReturnView(view)
    setView('detail')
  }

  const detailCourse = coursesData.find((c) => c.id === detailId)

  return (
    <div className="app">
      <header className="app-header">
        <h1>CourseSelector</h1>
        <p className="app-header__subtitle">
          Compare undergraduate courses across the 24 Russell Group
          universities — entry requirements, fees, and graduate prospects.
        </p>
        <nav className="app-nav">
          <button
            className={view === 'browse' ? 'nav-button is-active' : 'nav-button'}
            onClick={() => setView('browse')}
          >
            Browse
          </button>
          <button
            className={view === 'finder' ? 'nav-button is-active' : 'nav-button'}
            onClick={() => setView('finder')}
          >
            Find my course
          </button>
          <button
            className={view === 'compare' ? 'nav-button is-active' : 'nav-button'}
            onClick={() => setView('compare')}
          >
            Compare ({selectedIds.length})
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'browse' && (
          <>
            <Filters
              search={search}
              onSearchChange={setSearch}
              subjects={subjects}
              subjectFilter={subjectFilter}
              onSubjectChange={setSubjectFilter}
              universities={universities}
              universityFilter={universityFilter}
              onUniversityChange={setUniversityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <p className="result-count">
              {filteredCourses.length} course
              {filteredCourses.length === 1 ? '' : 's'} found
            </p>
            <CourseList
              courses={filteredCourses}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onViewDetail={viewDetail}
              maxSelected={MAX_COMPARE}
            />
          </>
        )}

        {view === 'finder' && (
          <CourseFinder
            coursesData={coursesData}
            subjects={subjects}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onViewDetail={viewDetail}
            maxSelected={MAX_COMPARE}
          />
        )}

        {view === 'compare' && (
          <CompareView
            courses={selectedCourses}
            onRemove={toggleSelect}
            onClose={() => setView('browse')}
          />
        )}

        {view === 'detail' && detailCourse && (
          <CourseDetail
            course={detailCourse}
            onBack={() => setView(returnView)}
            onToggleSelect={toggleSelect}
            isSelected={selectedIds.includes(detailCourse.id)}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Data compiled from official university course pages, UCAS, and
          Discover Uni (HESA Graduate Outcomes survey). University ranking is
          the Complete University Guide 2027 overall ranking, restricted to
          the 24 Russell Group universities. Popularity (applicants per
          place) is only available for some courses — where shown, it mixes
          figures stated directly by departments with ones derived from
          published offer rates (not a strict like-for-like comparison; see
          each course's detail page). See each course's detail page for
          sources. Verify current figures before making decisions — entry
          requirements, fees, and competition levels change year to year.
        </p>
      </footer>
    </div>
  )
}

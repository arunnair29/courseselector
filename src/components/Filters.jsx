export default function Filters({
  search,
  onSearchChange,
  subjects,
  subjectFilter,
  onSubjectChange,
  universities,
  universityFilter,
  onUniversityChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        className="filters__search"
        placeholder="Search by course or university..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={subjectFilter}
        onChange={(e) => onSubjectChange(e.target.value)}
      >
        <option value="">All subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={universityFilter}
        onChange={(e) => onUniversityChange(e.target.value)}
      >
        <option value="">All universities</option>
        {universities.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="university">Sort: University (A-Z)</option>
        <option value="tariff-desc">Sort: Entry tariff (high to low)</option>
        <option value="tariff-asc">Sort: Entry tariff (low to high)</option>
        <option value="salary-desc">Sort: Median salary (high to low)</option>
        <option value="employment-desc">
          Sort: Highly skilled work (high to low)
        </option>
        <option value="ranking-asc">
          Sort: University ranking (best first)
        </option>
        <option value="popularity-desc">
          Sort: Popularity (most applicants per place first)
        </option>
      </select>
    </div>
  )
}

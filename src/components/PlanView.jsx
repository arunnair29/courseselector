import { useEffect, useState } from 'react'
import { usePlan } from '../hooks/usePlan.js'
import { getSuggestedSteps } from '../utils/admissionSteps.js'
import {
  getStudyResources,
  STUDY_RESOURCES_DISCLAIMER,
} from '../utils/studyResources.js'

export default function PlanView({ course, onBack }) {
  const {
    checklist,
    note,
    loading,
    error,
    addChecklistItem,
    toggleComplete,
    updateDueDate,
    removeItem,
    saveNote,
  } = usePlan(course.id)

  const [newStep, setNewStep] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [noteDraft, setNoteDraft] = useState(note)
  const [noteDirty, setNoteDirty] = useState(false)

  // Keep the draft in sync once the real note loads from Supabase, but
  // don't clobber text the user is actively typing.
  useEffect(() => {
    if (!noteDirty) setNoteDraft(note)
  }, [note, noteDirty])

  const suggestedSteps = getSuggestedSteps(course)
  const studyResources = getStudyResources(course.subjectArea)
  const doneCount = checklist.filter((i) => i.completed).length

  function handleAddStep(event) {
    event.preventDefault()
    if (!newStep.trim()) return
    addChecklistItem(newStep, newDueDate || null)
    setNewStep('')
    setNewDueDate('')
  }

  function handleSaveNote() {
    saveNote(noteDraft)
    setNoteDirty(false)
  }

  return (
    <div className="plan-view">
      <button className="button" onClick={onBack}>
        ← Back
      </button>

      <h2>Admission plan — {course.courseTitle}</h2>
      <p className="course-detail__subtitle">{course.university}</p>

      {loading && <p className="empty-state">Loading your plan...</p>}
      {error && <p className="auth-form__error">{error}</p>}

      <section className="plan-section">
        <h3>
          Checklist
          {checklist.length > 0 && ` (${doneCount}/${checklist.length} done)`}
        </h3>

        {checklist.length === 0 ? (
          <p className="empty-state">
            No steps added yet — add your own below, or add one of the
            suggestions further down.
          </p>
        ) : (
          <ul className="plan-checklist">
            {checklist.map((item) => (
              <li
                key={item.id}
                className={item.completed ? 'plan-item is-done' : 'plan-item'}
              >
                <label className="plan-item__main">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(item.id)}
                  />
                  <span>{item.text}</span>
                </label>
                <input
                  type="date"
                  className="plan-item__date"
                  value={item.due_date || ''}
                  onChange={(e) => updateDueDate(item.id, e.target.value)}
                  title="Set a deadline for this step"
                />
                <button
                  className="plan-item__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove step"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        <form className="plan-add-form" onSubmit={handleAddStep}>
          <input
            type="text"
            placeholder="Add a step..."
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            title="Optional deadline"
          />
          <button type="submit" className="button button--primary">
            Add
          </button>
        </form>
      </section>

      <section className="plan-section">
        <h3>Suggested admission steps</h3>
        <p className="plan-section__hint">
          Click to add any of these to your checklist above.
        </p>
        <ul className="suggestion-chip-list">
          {suggestedSteps.map((step) => (
            <li key={step}>
              <button
                type="button"
                className="suggestion-chip"
                onClick={() => addChecklistItem(step)}
              >
                + {step}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="plan-section">
        <h3>Suggested study resources</h3>
        <p className="plan-section__hint">
          Click to add any of these to your checklist above.
        </p>
        <ul className="suggestion-chip-list">
          {studyResources.map((resource) => (
            <li key={resource}>
              <button
                type="button"
                className="suggestion-chip"
                onClick={() => addChecklistItem(resource)}
              >
                + {resource}
              </button>
            </li>
          ))}
        </ul>
        <p className="data-note">{STUDY_RESOURCES_DISCLAIMER}</p>
      </section>

      <section className="plan-section">
        <h3>Notes</h3>
        <textarea
          className="plan-notes"
          rows={5}
          placeholder="Anything else you want to remember about applying to this course..."
          value={noteDraft}
          onChange={(e) => {
            setNoteDraft(e.target.value)
            setNoteDirty(true)
          }}
          onBlur={handleSaveNote}
        />
      </section>
    </div>
  )
}

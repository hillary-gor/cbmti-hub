"use client"

import { useFormState } from "react-dom"
import { createCourse } from "../actions"

const initialState = { success: false, errors: {} }

export function CourseForm() {
  const [state, formAction] = useFormState(createCourse, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <input name="title" placeholder="Course Title" className="input" />
        {state?.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title}</p>
        )}
      </div>
      <div>
        <input name="code" placeholder="Course Code" className="input" />
        {state?.errors?.code && (
          <p className="text-sm text-red-500">{state.errors.code}</p>
        )}
      </div>
      <textarea name="description" placeholder="Course Description" className="input" />
      <input name="semester" placeholder="Semester" className="input" />
      <button type="submit" className="btn btn-primary">
        Create Course
      </button>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  )
}

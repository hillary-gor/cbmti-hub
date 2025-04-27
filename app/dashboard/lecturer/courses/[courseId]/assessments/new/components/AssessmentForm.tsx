"use client";

import { useFormState } from "react-dom";
import { createAssessment } from "../actions";

const initialState = { success: false };

export function AssessmentForm({ courseId }: { courseId?: string }) {
  const [state, formAction] = useFormState(createAssessment, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="course_id" value={courseId} />

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input name="title" className="input" />
        {state?.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select name="type" className="input">
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input type="datetime-local" name="due_date" className="input" />
        {state?.errors?.due_date && (
          <p className="text-sm text-red-500">{state.errors.due_date}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" className="input" />
      </div>

      <button type="submit" className="btn btn-primary">
        Create
      </button>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">Assessment created.</p>
      )}
    </form>
  );
}

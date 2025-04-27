"use client";

import { useFormState } from "react-dom";
import { gradeSubmission } from "../actions";

type Submission = {
  id: string;
  submitted_at: string;
  file_url?: string;
  grade?: number;
  feedback?: string;
  students: {
    full_name: string;
    email: string;
  }[]; // ✅ FIXED: Supabase returns students as an array
};

const initialState = { success: false, error: "" };

export function SubmissionTable({
  assessmentId,
  submissions,
}: {
  assessmentId: string;
  submissions: Submission[];
}) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Student</th>
            <th className="text-left p-3">File</th>
            <th className="text-left p-3">Grade</th>
            <th className="text-left p-3">Feedback</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <SubmissionRow
              key={s.id}
              submission={s}
              assessmentId={assessmentId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionRow({
  submission,
  assessmentId,
}: {
  submission: Submission;
  assessmentId: string;
}) {
  const [state, formAction] = useFormState(gradeSubmission, initialState);
  const student = submission.students[0]; // ✅ safe array access

  return (
    <tr className="border-t align-top">
      <td className="p-3">
        <p>{student?.full_name ?? "Unknown"}</p>
        <p className="text-xs text-muted-foreground">{student?.email ?? "—"}</p>
      </td>
      <td className="p-3">
        {submission.file_url ? (
          <a
            href={submission.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="p-3">{submission.grade ?? "—"}</td>
      <td className="p-3">{submission.feedback ?? "—"}</td>
      <td className="p-3">
        <form
          action={formAction}
          className="flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <input type="hidden" name="submission_id" value={submission.id} />
          <input type="hidden" name="assessment_id" value={assessmentId} />

          <input
            name="grade"
            type="number"
            step="0.01"
            defaultValue={submission.grade ?? ""}
            placeholder="Grade"
            className="w-24 input"
          />

          <textarea
            name="feedback"
            defaultValue={submission.feedback ?? ""}
            placeholder="Feedback"
            className="input resize-none flex-1"
            rows={1}
          />

          <button type="submit" className="btn btn-sm btn-primary shrink-0">
            Save
          </button>

          <div className="text-xs leading-tight">
            {state.success && (
              <p className="text-green-600 whitespace-nowrap">Saved!</p>
            )}
            {state.error && (
              <p className="text-red-500 whitespace-nowrap">{state.error}</p>
            )}
          </div>
        </form>
      </td>
    </tr>
  );
}

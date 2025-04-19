'use client';

import { useFormState } from 'react-dom';
import { handleRegister, type RegisterState } from './actions';

type Props = {
  intakeId: string;
  students: { id: string; reg_number: string }[];
  courses: { id: string; title: string }[];
};

const initialState: RegisterState = {
  error: {},
  success: false,
};

export function EnrollmentForm({ intakeId, students, courses }: Props) {
  const [state, formAction] = useFormState<RegisterState, FormData>(
    handleRegister,
    initialState
  );

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6 max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md"
    >
      <input type="hidden" name="intakeId" value={intakeId} />

      {/* Student select */}
      <div className="space-y-2">
        <label htmlFor="studentId" className="block text-sm font-medium">
          Student
        </label>
        <select
          id="studentId"
          name="studentId"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
          defaultValue=""
          required
        >
          <option disabled value="">Select a student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.reg_number}</option>
          ))}
        </select>
      </div>

      {/* Course select */}
      <div className="space-y-2">
        <label htmlFor="courseId" className="block text-sm font-medium">
          Course
        </label>
        <select
          id="courseId"
          name="courseId"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring"
          defaultValue=""
          required
        >
          <option disabled value="">Select a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Upload admission docs */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Admission Documents (PDF or ZIP)</label>
        <input
          type="file"
          name="admission_docs"
          accept=".pdf,.zip"
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {/* Errors */}
      {state?.error?.general && (
        <p className="text-sm text-red-600">{state.error.general}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">✅ Student successfully enrolled and documents uploaded!</p>
      )}

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
      >
        Register Student
      </button>
    </form>
  );
}

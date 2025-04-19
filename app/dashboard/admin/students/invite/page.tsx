'use client';

import { useFormState } from 'react-dom';
import { inviteStudent } from './actions';

const initialState = {
  error: {},
  success: false,
};

export default function InviteStudentPage() {
  const [state, formAction] = useFormState(inviteStudent, initialState);

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Invite Student</h1>
      <p className="text-sm text-muted-foreground">
        The student will receive an email to join and complete registration.
      </p>

      <form action={formAction} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
          />
          {state?.error?.email && (
            <p className="text-sm text-red-600">{state.error.email.join(', ')}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            required
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
          />
          {state?.error?.full_name && (
            <p className="text-sm text-red-600">{state.error.full_name.join(', ')}</p>
          )}
        </div>

        {/* General Error */}
        {state?.error?.general && (
          <p className="text-sm text-red-600">{state.error.general}</p>
        )}

        {/* Success Message */}
        {state.success && (
          <p className="text-sm text-green-600">Student invited successfully! ✅</p>
        )}

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md w-full"
        >
          Send Invite
        </button>
      </form>
    </div>
  );
}

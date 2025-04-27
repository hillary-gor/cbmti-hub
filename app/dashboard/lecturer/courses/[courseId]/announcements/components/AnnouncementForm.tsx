"use client";

import { useFormState } from "react-dom";
import { createAnnouncement } from "../actions";

type FormState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

const initialState: FormState = {};

export function AnnouncementForm({ courseId }: { courseId: string }) {
  const [state, formAction] = useFormState<FormState, FormData>(
    createAnnouncement,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="course_id" value={courseId} />

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input name="title" className="input w-full" />
        {state.errors?.title && (
          <p className="text-sm text-red-500">
            {state.errors.title.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea name="message" rows={4} className="input w-full" />
        {state.errors?.message && (
          <p className="text-sm text-red-500">
            {state.errors.message.join(", ")}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Post Announcement
      </button>

      {state.success && (
        <p className="text-sm text-green-600">Posted successfully!</p>
      )}
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}

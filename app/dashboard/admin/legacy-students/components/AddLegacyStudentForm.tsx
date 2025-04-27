"use client";

import { useActionState } from "react";
import { addLegacyStudent } from "../actions";
import { useEffect, useState } from "react";

const initialState = { success: false, error: "" };

export function AddLegacyStudentForm() {
  const [state, formAction] = useActionState(addLegacyStudent, initialState);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (state.success) {
      setSuccessMessage("Student added and email sent successfully!");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm mb-1">Full Name</label>
        <input id="full_name" name="full_name" type="text" className="input w-full" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm mb-1">Email</label>
        <input id="email" name="email" type="email" className="input w-full" required />
      </div>

      <div>
        <label htmlFor="reg_number" className="block text-sm mb-1">Registration Number</label>
        <input id="reg_number" name="reg_number" type="text" className="input w-full" required />
      </div>

      <button type="submit" className="btn btn-primary">
        Add Student
      </button>

      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
    </form>
  );
}

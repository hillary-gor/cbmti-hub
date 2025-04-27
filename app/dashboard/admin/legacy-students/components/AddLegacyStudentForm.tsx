"use client";

import { useActionState } from "react";
import { addLegacyStudent } from "../actions";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react";

const initialState = { success: false, error: "" };

export function AddLegacyStudentForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{ [key: string]: FormDataEntryValue }>({});
  const [state, formAction, pending] = useActionState(addLegacyStudent, initialState);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.success && !state.partial) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        window.location.href = "/dashboard/admin/legacy-students"; // Redirect after 2.5s
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (state.partial) {
      setStep((prev) => prev + 1);
    }
  }, [state.success, state.partial]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    // Merge new form data into old
    const newFormData: { [key: string]: FormDataEntryValue } = {};
    form.forEach((value, key) => {
      newFormData[key] = value;
    });
    setFormData((prev) => ({ ...prev, ...newFormData }));

    // Submit all data collected so far
    const fullForm = new FormData();
    Object.entries({ ...formData, ...newFormData }).forEach(([key, value]) => {
      fullForm.append(key, value);
    });

    formAction(fullForm);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto mt-10">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 1: Basic Details</h2>
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input name="full_name" type="text" className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input name="email" type="email" className="input w-full" required />
            </div>
            <button type="submit" disabled={pending} className="btn btn-primary w-full">
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 2: Personal Details</h2>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input name="phone" type="text" className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender</label>
              <select name="gender" className="input w-full" required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Birth</label>
              <input name="dob" type="date" className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input name="location" type="text" className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select name="role" className="input w-full" required>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">User ID (Optional)</label>
              <input name="user_id" type="text" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1">Avatar URL (Optional)</label>
              <input name="avatar_url" type="text" className="input w-full" />
            </div>
            <button type="submit" disabled={pending} className="btn btn-primary w-full">
              Next
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Step 3: Registration Number</h2>
            <div>
              <label className="block text-sm mb-1">Registration Number</label>
              <input name="reg_number" type="text" className="input w-full" required />
            </div>
            <button type="submit" disabled={pending} className="btn btn-primary w-full">
              {pending ? "Submitting..." : "Submit"}
            </button>
          </>
        )}

        {state.error && (
          <p className="text-red-500 text-sm text-center">{state.error}</p>
        )}
      </form>

      {/* Success Modal */}
      <Dialog open={showModal} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm text-center border border-gray-200 dark:border-zinc-700 shadow-lg">
            <CheckCircle className="mx-auto text-green-500 h-10 w-10 mb-2" />
            <h2 className="text-lg font-semibold mb-1">Student Added Successfully</h2>
            <p className="text-sm text-muted-foreground">
              Student profile has been created and email sent.
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
}

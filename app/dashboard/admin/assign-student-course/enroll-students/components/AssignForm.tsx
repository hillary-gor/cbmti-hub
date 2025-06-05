"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import assignStudentToCourse from "../actions";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react";

type AssignResult = {
  success: boolean;
  error?: string;
};

const initialState: AssignResult = { success: false };

interface AssignFormProps {
  studentId: string;
  courses: { id: string; title: string }[];
  intakes: { id: string; label: string }[];
}

export function AssignForm({ studentId, courses, intakes }: AssignFormProps) {
  const [state, formAction] = useActionState(
    assignStudentToCourse,
    initialState,
  );
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setShowModal(true);
      const timeout = setTimeout(() => {
        setShowModal(false);
        router.push("/dashboard/admin/assign-student-course/unassigned");
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [state.success, router]);

  return (
    <>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="studentId" value={studentId} />

        {/* Course Selection */}
        <div className="space-y-2">
          <label
            htmlFor="courseId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Course
          </label>
          <select
            id="courseId"
            name="courseId"
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-white"
          >
            <option value="">Select...</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Intake Selection */}
        <div className="space-y-2">
          <label
            htmlFor="intakeId"
            className="block text-sm font-medium text-gray-200 dark:text-gray-300"
          >
            Select Intake
          </label>
          <select
            id="intakeId"
            name="intakeId"
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-white"
          >
            <option value="">Select...</option>
            {intakes.map((intake) => (
              <option key={intake.id} value={intake.id}>
                {intake.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-400 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:bg-gray-400"
          disabled={state.success}
        >
          {state.success ? "Assigned ✔" : "Assign"}
        </button>

        {/* Error */}
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      </form>

      {/* Success Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm text-center border dark:border-zinc-700 shadow-lg">
            <CheckCircle className="mx-auto text-green-500 h-10 w-10 mb-2" />
            <h2 className="text-lg font-semibold mb-2">Student Assigned</h2>
            <p className="text-sm text-muted-foreground">
              Student has been successfully assigned to course and intake.
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
}

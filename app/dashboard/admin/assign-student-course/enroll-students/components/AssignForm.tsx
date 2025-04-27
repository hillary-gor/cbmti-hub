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
  generatedRegNumber: string;
}

export function AssignForm({
  studentId,
  courses,
  intakes,
  generatedRegNumber,
}: AssignFormProps) {
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
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="reg_number" value={generatedRegNumber} />

        <div>
          <label className="block text-sm mb-1">Registration Number</label>
          <input
            type="text"
            value={generatedRegNumber}
            disabled
            className="input w-full bg-muted text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Select Course</label>
          <select name="courseId" className="input w-full" required>
            <option value="">Select...</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Select Intake</label>
          <select name="intakeId" className="input w-full" required>
            <option value="">Select...</option>
            {intakes.map((intake) => (
              <option key={intake.id} value={intake.id}>
                {intake.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={state.success}
        >
          {state.success ? "Assigned ✔" : "Assign"}
        </button>

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      </form>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm text-center border border-gray-200 dark:border-zinc-700 shadow-lg">
            <CheckCircle className="mx-auto text-green-500 h-10 w-10 mb-2" />
            <h2 className="text-lg font-semibold mb-1">Student Assigned</h2>
            <p className="text-sm text-muted-foreground">
              Student has been successfully assigned to course and intake.
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
}

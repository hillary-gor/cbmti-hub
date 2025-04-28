"use client";

import Link from "next/link";

export function AssignLink({ studentId }: { studentId: string }) {
  return (
    <Link
      href={`/dashboard/admin/assign-student-course/enroll-students/${studentId}/assign`}
      className="text-blue-600 hover:underline"
    >
      Assign Course & Intake
    </Link>
  );
}

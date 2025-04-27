// app/dashboard/admin/legacy-students/page.tsx
import { AddLegacyStudentForm } from "./components/AddLegacyStudentForm";

export default function LegacyStudentsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Add Old Student</h1>
      <p className="text-muted-foreground text-sm">
        Add a legacy student by providing their registration number, email, and assigning them to a course and intake.
      </p>
      <AddLegacyStudentForm />
    </div>
  );
}

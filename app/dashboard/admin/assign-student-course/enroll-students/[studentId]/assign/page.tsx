import { createClient } from "@/utils/supabase/server";
import { AssignForm } from "../../components/AssignForm";

interface AssignStudentPageProps {
  params: { studentId: string };
}

export default async function AssignStudentPage({ params }: AssignStudentPageProps) {
  const { studentId } = params;

  const supabase = await createClient();

  const [coursesRes, intakesRes, studentRes] = await Promise.all([
    supabase.from("courses").select("id, title"),
    supabase.from("intakes").select("id, label"),
    supabase.from("students").select("id, full_name").eq("id", studentId).single(),
  ]);

  if (coursesRes.error) throw new Error(coursesRes.error.message);
  if (intakesRes.error) throw new Error(intakesRes.error.message);
  if (studentRes.error) throw new Error(studentRes.error.message);
  if (!studentRes.data) throw new Error("Student not found.");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">
        Assign Course & Intake to {studentRes.data.full_name}
      </h1>

      <AssignForm
        studentId={studentId}
        courses={coursesRes.data ?? []}
        intakes={intakesRes.data ?? []}
      />
    </div>
  );
}

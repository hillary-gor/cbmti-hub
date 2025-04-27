import { createClient } from "@/utils/supabase/server";
import { AssignForm } from "../../components/AssignForm";

interface AssignStudentPageProps {
  params: { studentId: string };
}

export default async function AssignStudentPage({
  params,
}: AssignStudentPageProps) {
  const { studentId } = await params;

  const supabase = await createClient();

  const [coursesRes, intakesRes, studentRes, latestRegRes] = await Promise.all([
    supabase.from("courses").select("id, title"),
    supabase.from("intakes").select("id, label"),
    supabase
      .from("students")
      .select("id, full_name")
      .eq("id", studentId)
      .single(),
    supabase
      .from("students")
      .select("reg_number")
      .not("reg_number", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (studentRes.error) throw new Error(studentRes.error.message);
  if (!studentRes.data) throw new Error("Student not found.");

  let nextRegNumber = "CBMTI/001";
  if (latestRegRes.data?.reg_number) {
    const lastNumber = parseInt(latestRegRes.data.reg_number.split("/")[1], 10);
    const newNumber = String(lastNumber + 1).padStart(3, "0");
    nextRegNumber = `CBMTI/${newNumber}`;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">
        Assign Course & Intake to {studentRes.data.full_name}
      </h1>

      <AssignForm
        studentId={studentId}
        courses={coursesRes.data ?? []}
        intakes={intakesRes.data ?? []}
        generatedRegNumber={nextRegNumber}
      />
    </div>
  );
}

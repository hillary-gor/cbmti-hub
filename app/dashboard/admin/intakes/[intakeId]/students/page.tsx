import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: { intakeId: string };
};

type SupabaseEnrollment = {
  id: string;
  students: {
    reg_number: string;
    full_name: string;
    email: string;
  } | null;
  courses: {
    title: string;
  } | null;
};

type EnrolledStudent = {
  id: string;
  reg_number: string;
  full_name: string;
  email: string;
  course_title: string;
};

export default async function IntakeStudentsPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      students (
        reg_number,
        full_name,
        email
      ),
      courses (
        title
      )
    `
    )
    .eq("intake_id", params.intakeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[INTAKE_STUDENTS_ERROR]", error.message);
    notFound();
  }

  const typedData = data as unknown as SupabaseEnrollment[];

  const students: EnrolledStudent[] = typedData.map((record) => ({
    id: record.id,
    reg_number: record.students?.reg_number ?? "—",
    full_name: record.students?.full_name ?? "—",
    email: record.students?.email ?? "—",
    course_title: record.courses?.title ?? "—",
  }));

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students in Intake</h1>
        <p className="text-sm text-muted-foreground">
          List of students registered in this intake.
        </p>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No students enrolled yet.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">Reg Number</th>
                <th className="px-4 py-2 font-semibold">Full Name</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Course</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-muted/30 transition"
                >
                  <td className="px-4 py-2">{s.reg_number}</td>
                  <td className="px-4 py-2">{s.full_name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.course_title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

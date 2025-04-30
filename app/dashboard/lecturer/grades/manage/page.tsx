import { createClient } from "@/utils/supabase/server";
import { upsertStudentGrade } from "./actions";

type GradeField = "cat1" | "cat2" | "cat3" | "cat4" | "fqe" | "sup_fqe";

export default async function GradeManagePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const course_id = typeof params.course_id === "string" ? params.course_id : "";
  const intake_id = typeof params.intake_id === "string" ? params.intake_id : "";

  if (!course_id || !intake_id) {
    return <p className="p-6 text-red-600">Missing course or intake.</p>;
  }

  // Fetch students in the specified intake and course
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .eq("course_id", course_id)
    .eq("intake_id", intake_id)
    .order("full_name", { ascending: true });

  // Fetch existing grades
  const { data: grades } = await supabase
    .from("grades")
    .select("student_id, cat1, cat2, cat3, cat4, fqe, sup_fqe")
    .eq("course_id", course_id);

  const gradesMap = new Map<string, Record<GradeField, number>>(grades?.map((g) => [g.student_id, g]) ?? []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0049AB]">Enter Grades</h1>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 dark:bg-zinc-800 text-left">
            <th className="py-2 px-3">Student</th>
            <th className="py-2 px-3" colSpan={7}>Grades</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => {
            const existing = gradesMap.get(student.id);

            return (
              <tr key={student.id} className="border-t">
                <td className="py-2 px-3">{student.full_name}</td>
                <td className="py-2 px-3" colSpan={7}>
                  <form action={upsertStudentGrade}>
                    <input type="hidden" name="student_id" value={student.id} />
                    <input type="hidden" name="course_id" value={course_id} />

                    <div className="grid grid-cols-7 gap-2">
                      {(["cat1", "cat2", "cat3", "cat4", "fqe", "sup_fqe"] as GradeField[]).map((field) => (
                        <input
                          key={field}
                          type="number"
                          name={field}
                          defaultValue={existing?.[field] ?? ""}
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder={field.toUpperCase()}
                        />
                      ))}

                      <button
                        type="submit"
                        className="bg-[#0049AB] text-white px-3 py-1 rounded text-sm hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

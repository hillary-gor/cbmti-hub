import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export default async function UnassignedStudentsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from("students")
    .select("id, full_name, email, created_at")
    .or("course_id.is.null,intake_id.is.null");

  if (error) throw new Error(error.message);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Unassigned Students</h1>

      <table className="w-full border text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Admitted On</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student: Student) => (
            <tr
              key={student.id}
              className="border-t hover:bg-accent transition"
            >
              <td className="px-4 py-2">{student.full_name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(student.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <Link
                  href={`/dashboard/admin/assign-student-course/enroll-students/${student.id}/assign`}
                  className="text-blue-600 hover:underline"
                >
                  Assign Course & Intake
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

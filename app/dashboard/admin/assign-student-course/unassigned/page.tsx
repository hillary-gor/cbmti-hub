import { createClient } from "@/utils/supabase/server";
import { AssignLink } from "./AssignLink";

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
    .or("course_id.is.null,intake_id.is.null")
    .returns<Student[]>(); // <<< tells typescript to expect Student[]

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
          {students?.map((student) => (
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
                <AssignLink studentId={student.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

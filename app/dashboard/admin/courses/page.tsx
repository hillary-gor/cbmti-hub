import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CourseRow = {
  id: string;
  code: string;
  title: string;
  department?: {
    name: string;
  }[];
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  let courses: CourseRow[] = [];

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`id, code, title, department:departments(name)`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    courses = (data ?? []) as CourseRow[];
  } catch (err) {
    console.error("[ADMIN_COURSES_ERROR]", err);
    return <div className="text-red-600">⚠️ Failed to load courses</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <Button asChild>
          <Link href="/dashboard/admin/courses/new">➕ Add Course</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Code</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="border-t">
                  <td className="p-3">{course.code}</td>
                  <td className="p-3">{course.title}</td>
                  <td className="p-3">{course.department?.[0]?.name ?? "—"}</td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/admin/courses/${course.id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// app/dashboard/lecturer/overview/queries.ts
import { createClient } from "@/utils/supabase/server"
import { getLecturer } from "@/lib/auth"

export async function getLecturerOverview() {
  const supabase = await createClient()
  const lecturer = await getLecturer()

  if (!lecturer) {
    throw new Error("Unauthorized")
  }

  const [coursesRes, assessmentsRes, studentsRes] = await Promise.all([
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("lecturer_id", lecturer.id),

    supabase
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .in("course_id",
        await supabase
              .from("courses")
              .select("id")
              .eq("lecturer_id", lecturer.id)
              .then((res) => res.data?.map((c) => c.id) || [])
      ),

    supabase
      .from("course_enrollments")
      .select("student_id", { count: "exact", head: true })
      .in("course_id",
        await supabase
              .from("courses")
              .select("id")
              .eq("lecturer_id", lecturer.id)
              .then((res) => res.data?.map((c) => c.id) || [])
      )
  ])

  return {
    courses: coursesRes.count || 0,
    assessments: assessmentsRes.count || 0,
    students: studentsRes.count || 0,
  }
}

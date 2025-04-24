// app/dashboard/lecturer/overview/queries.ts
import { createClient } from "@/utils/supabase/server"
import { getLecturer } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getLecturerOverview() {
  const supabase = await createClient()
  const lecturer = await getLecturer()

  if (!lecturer) {
    redirect("/unauthorized")
  }

  const { id: lecturerId } = lecturer

  const { data: courseIdsData, error: courseIdError } = await supabase
    .from("courses")
    .select("id")
    .eq("lecturer_id", lecturerId)

  if (courseIdError) {
    throw new Error("Failed to fetch course IDs")
  }

  const courseIds = courseIdsData?.map((c) => c.id) ?? []

  const [coursesRes, assessmentsRes, studentsRes] = await Promise.all([
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("lecturer_id", lecturerId),

    supabase
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .in("course_id", courseIds),

    supabase
      .from("course_enrollments")
      .select("student_id", { count: "exact", head: true })
      .in("course_id", courseIds),
  ])

  return {
    courses: coursesRes.count ?? 0,
    assessments: assessmentsRes.count ?? 0,
    students: studentsRes.count ?? 0,
  }
}

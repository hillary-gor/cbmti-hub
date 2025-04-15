// app/dashboard/lecturer/courses/[courseId]/students/page.tsx
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { StudentTable } from "./components/StudentTable"

export default async function CourseStudentsPage({
  params,
}: {
  params: { courseId: string }
}) {
  const supabase = await createClient()

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", params.courseId)
    .single()

  if (!course) notFound()

  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("id, joined_at, students (id, full_name, email)")
    .eq("course_id", course.id)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Enrolled Students</h2>
      <StudentTable enrollments={enrollments ?? []} />
    </div>
  )
}

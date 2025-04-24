import CourseForm from "./components/CourseForm"
import { CourseCard } from "./components/CourseCard"
import { getLecturer } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"

export default async function CoursesPage() {
  const lecturer = await getLecturer()
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("lecturer_id", lecturer?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Create New Course</h1>
        <CourseForm />
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Your Courses</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              code={course.code}
              description={course.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

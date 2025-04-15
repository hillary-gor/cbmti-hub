// app/dashboard/lecturer/courses/[courseId]/page.tsx
import { redirect } from "next/navigation"

export default function CourseIndexRedirect({ params }: { params: { courseId: string } }) {
  redirect(`/dashboard/lecturer/courses/${params.courseId}/overview`)
}

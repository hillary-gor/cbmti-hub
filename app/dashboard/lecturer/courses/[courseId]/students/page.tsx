import { notFound } from "next/navigation";
import { getCourseEnrollments } from "./actions";
import { StudentTable } from "./components/StudentTable";

type CourseStudentsPageProps = {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CourseStudentsPage({ params }: CourseStudentsPageProps) {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  const enrollments = await getCourseEnrollments(courseId);

  if (!enrollments || enrollments.length === 0) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Enrolled Students</h1>
      <StudentTable enrollments={enrollments} />
    </div>
  );
}

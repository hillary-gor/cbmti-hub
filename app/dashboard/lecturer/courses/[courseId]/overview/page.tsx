import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CourseOverviewPage({ params }: PageProps) {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { count: studentCount } = await supabase
    .from("course_enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", course.id);

  const { count: assessmentCount } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", course.id);

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-background shadow-sm">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-muted-foreground text-sm">
          {course.code} • {course.semester}
        </p>
        {course.description && (
          <p className="mt-4 text-sm">{course.description}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Created {formatDate(course.created_at)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Enrolled Students</p>
          <p className="text-2xl font-semibold">{studentCount ?? 0}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Assessments</p>
          <p className="text-2xl font-semibold">{assessmentCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

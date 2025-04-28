import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AssessmentList } from "./components/AssessmentList";

type PageProps = {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CourseAssessmentsPage({ params }: PageProps) {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("course_id", course.id)
    .order("due_date", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assessments</h2>
        <Link
          href={`/dashboard/lecturer/assessments/new?courseId=${course.id}`}
          className="btn btn-primary"
        >
          + New Assessment
        </Link>
      </div>

      <AssessmentList assessments={assessments ?? []} />
    </div>
  );
}

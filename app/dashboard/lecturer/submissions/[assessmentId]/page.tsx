import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { SubmissionTable } from "./components/SubmissionTable";

type SubmissionsPageProps = {
  params: Promise<{ assessmentId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const awaitedParams = await params;
  const { assessmentId } = awaitedParams;

  const supabase = await createClient();

  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, title, course_id")
    .eq("id", assessmentId)
    .single();

  if (!assessment) notFound();

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      grade,
      feedback,
      submitted_at,
      file_url,
      students!inner (
        full_name,
        email
      )
    `,
    )
    .eq("assessment_id", assessment.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error loading submissions:", error.message);
    return notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Submissions for: {assessment.title}
      </h1>
      <SubmissionTable
        assessmentId={assessment.id}
        submissions={submissions ?? []}
      />
    </div>
  );
}

import { AssessmentForm } from "./components/AssessmentForm";

export default function CreateAssessmentPage({
  searchParams,
}: {
  searchParams: { courseId?: string };
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create New Assessment</h1>
      <AssessmentForm courseId={searchParams.courseId} />
    </div>
  );
}

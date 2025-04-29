import { AssessmentForm } from "./components/AssessmentForm";

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreateAssessmentPage({
  searchParams,
}: PageProps) {
  const awaitedSearchParams = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create New Assessment</h1>
      <AssessmentForm
        courseId={awaitedSearchParams.courseId as string | undefined}
      />
    </div>
  );
}

import { redirect } from "next/navigation";

export default async function CourseIndexRedirect({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  redirect(`/dashboard/lecturer/courses/${courseId}/overview`);
}

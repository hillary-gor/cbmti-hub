import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ReactNode } from "react";

const tabs = [
  { slug: "overview", label: "Overview" },
  { slug: "students", label: "Students" },
  { slug: "assessments", label: "Assessments" },
  { slug: "announcements", label: "Announcements" },
];

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Course: {course.title}</h1>
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            {tabs.map((tab) => (
              <Link
                key={tab.slug}
                href={`/dashboard/lecturer/courses/${course.id}/${tab.slug}`}
              >
                <TabsTrigger value={tab.slug}>{tab.label}</TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div>{children}</div>
    </div>
  );
}

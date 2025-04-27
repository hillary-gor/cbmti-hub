// app/dashboard/lecturer/courses/[courseId]/announcements/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AnnouncementForm } from "./components/AnnouncementForm";

export default async function AnnouncementsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", params.courseId)
    .single();

  if (!course) notFound();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, message, created_at")
    .eq("course_id", course.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Announcements for {course.title}
        </h1>
      </div>

      <AnnouncementForm courseId={course.id} />

      <div className="space-y-4">
        {announcements?.length === 0 && (
          <p className="text-muted-foreground text-sm">No announcements yet.</p>
        )}

        {announcements?.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border p-4 bg-background shadow-sm space-y-1"
          >
            <h3 className="font-medium text-lg">{a.title}</h3>
            <p className="text-sm text-muted-foreground">{a.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

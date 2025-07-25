// app/dashboard/student/tag/page.tsx

import { createClient } from "@/utils/supabase/server";
import StudentTagCard from "./components/StudentTagCard";
import { format } from "date-fns";

// Define the expected shape
type StudentProfile = {
  full_name: string;
  reg_number: string;
  created_at: string;
  merged_file_url: string;
  course: {
    title: string;
  } | null;
};

export default async function StudentTagPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-red-600">
        You must be logged in to view your student tag.
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("students")
    .select(
      `
      full_name,
      reg_number,
      created_at,
      merged_file_url,
      course:course_id ( title )
    `,
    )
    .eq("user_id", user.id)
    .maybeSingle<StudentProfile>();

  if (!profile) {
    return (
      <div className="p-6 text-gray-500">
        Student profile not found or could not be loaded.
      </div>
    );
  }

  const createdAt = new Date(profile.created_at);
  const year = createdAt.getFullYear();

  return (
    <StudentTagCard
      name={profile.full_name}
      regNo={profile.reg_number}
      course={profile.course?.title ?? "Course N/A"}
      effectiveDate={format(createdAt, "MMM yyyy")}
      dueDate={`Dec 31, ${year}`}
      photoUrl={profile.merged_file_url}
    />
  );
}

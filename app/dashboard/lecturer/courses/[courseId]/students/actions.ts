"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCourseEnrollments(courseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
        id,
        enrolled_at,
        student:students (
          id,
          full_name,
          email,
          avatar_url
        )
      `,
    )
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);

  return (
    data?.map((enrollment) => ({
      ...enrollment,
      student: Array.isArray(enrollment.student)
        ? enrollment.student[0]
        : enrollment.student,
    })) ?? []
  );
}

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertStudentGrade(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    throw new Error("Unauthorized");
  }

  const student_id = formData.get("student_id")?.toString().trim();
  const course_id = formData.get("course_id")?.toString().trim();

  if (!student_id || !course_id) {
    console.error("Missing student_id or course_id:", {
      student_id,
      course_id,
    });
    throw new Error("Missing required fields.");
  }

  // Extract all grade fields as numbers, defaulting to 0
  const gradeFields = [
    "cat1",
    "cat2",
    "cat3",
    "cat4",
    "sup_cat",
    "fqe",
    "sup_fqe",
  ] as const;
  const grades: Record<(typeof gradeFields)[number], number> =
    Object.fromEntries(
      gradeFields.map((field) => [field, Number(formData.get(field)) || 0]),
    ) as Record<(typeof gradeFields)[number], number>;

  const payload = {
    student_id,
    course_id,
    ...grades,
    recorded_by: user.id,
  };

  console.log("Upserting grade with payload:", payload);

  const { error } = await supabase.from("grades").upsert(payload);

  if (error) {
    console.error("Grade upsert failed:", error);
    throw new Error("Failed to save grade.");
  }

  revalidatePath("/dashboard/lecturer/grades/manage");
}

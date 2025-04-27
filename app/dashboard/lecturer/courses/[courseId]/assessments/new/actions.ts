// app/dashboard/lecturer/assessments/new/actions.ts
"use server";

import { CreateAssessmentSchema } from "./schema";
import { getLecturer } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type CreateAssessmentState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createAssessment(
  prevState: CreateAssessmentState,
  formData: FormData,
): Promise<CreateAssessmentState> {
  const parsed = CreateAssessmentSchema.safeParse({
    course_id: formData.get("course_id"),
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    due_date: formData.get("due_date"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const lecturer = await getLecturer();
  if (!lecturer) return { error: "Unauthorized" };

  const { error } = await supabase.from("assessments").insert({
    ...parsed.data,
  });

  if (error) return { error: error.message };

  revalidatePath(
    `/dashboard/lecturer/courses/${parsed.data.course_id}/assessments`,
  );
  return { success: true };
}

"use server";

import { CreateCourseSchema } from "./schema";
import { getLecturer } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type CreateCourseState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createCourse(
  prevState: CreateCourseState,
  formData: FormData,
): Promise<CreateCourseState> {
  const parsed = CreateCourseSchema.safeParse({
    title: formData.get("title"),
    code: formData.get("code"),
    description: formData.get("description"),
    semester: formData.get("semester"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const lecturer = await getLecturer();
  if (!lecturer) return { error: "Unauthorized" };

  const { error } = await supabase.from("courses").insert({
    ...parsed.data,
    lecturer_id: lecturer.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/lecturer/courses");
  return { success: true };
}

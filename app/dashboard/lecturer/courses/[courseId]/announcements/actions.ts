"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateAnnouncementSchema } from "./schema";

type ActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createAnnouncement(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = CreateAnnouncementSchema.safeParse({
    course_id: formData.get("course_id"),
    title: formData.get("title"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("announcements").insert({
    ...parsed.data,
  });

  if (error) return { error: error.message };

  revalidatePath(
    `/dashboard/lecturer/courses/${parsed.data.course_id}/announcements`,
  );
  return { success: true };
}

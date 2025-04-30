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
    console.error("Missing student_id or course_id:", { student_id, course_id });
    throw new Error("Missing required fields.");
  }

  const cat1 = Number(formData.get("cat1")) || 0;
  const cat2 = Number(formData.get("cat2")) || 0;
  const cat3 = Number(formData.get("cat3")) || 0;
  const cat4 = Number(formData.get("cat4")) || 0;
  const fqe = Number(formData.get("fqe")) || 0;
  const sup_fqe = Number(formData.get("sup_fqe")) || 0;

  const payload = {
    student_id,
    course_id,
    cat1,
    cat2,
    cat3,
    cat4,
    fqe,
    sup_fqe,
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

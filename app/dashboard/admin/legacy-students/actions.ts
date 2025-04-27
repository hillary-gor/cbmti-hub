"use server";

import { createClient } from "@/utils/supabase/server";
import { sendLegacyStudentEmail } from "@/lib//emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = "CBMTI@2024"; // universal temp password

export async function addLegacyStudent(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const reg_number = formData.get("reg_number") as string;
  const course_id = formData.get("course_id") as string;
  const intake_id = formData.get("intake_id") as string;

  if (!full_name || !email || !reg_number) {
    return { success: false, error: "Missing required fields." };
  }

  // 1. Create user in auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: UNIVERSAL_PASSWORD,
  });

  if (authError || !authUser.user) {
    console.error(authError);
    return { success: false, error: "Failed to create authentication user." };
  }

  // 2. Insert into students table
  const { error: studentError } = await supabase.from("students").insert({
    user_id: authUser.user.id,
    full_name,
    reg_number,
    course_id,
    intake_id,
  });

  if (studentError) {
    console.error(studentError);
    return { success: false, error: "Failed to insert student record." };
  }

  // 3. Send email to the student
  await sendLegacyStudentEmail({
    email,
    password: UNIVERSAL_PASSWORD,
    reg_number,
    full_name,
  });

  return { success: true };
}

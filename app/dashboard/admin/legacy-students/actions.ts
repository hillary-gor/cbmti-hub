"use server";

import { createClient } from "@/lib/supabase/admin-server";
import { sendLegacyStudentEmail } from "@/lib/emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = process.env.UNIVERSAL_PASSWORD!;

export async function addLegacyStudent(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const reg_number = formData.get("reg_number") as string;

  if (!full_name || !email || !reg_number) {
    return { success: false, error: "Missing required fields." };
  }

  // check if user already exists
  const { data: existingUser, error: existingUserError } = await supabase
    .from("users") // or "auth.users"
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return { success: false, error: "User with this email already exists." };
  }

  // Check for database errors
if (existingUserError) {
  console.error("Failed to check existing user:", existingUserError);
  return { success: false, error: "An error occurred while checking the user. Please try again." };
}

  // Create user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: UNIVERSAL_PASSWORD,
  });

  if (authError) {
    if (authError.status === 422 && authError.code === "email_exists") {
      return { success: false, error: "Email already registered. Please use another email." };
    }
    console.error("Auth Error:", authError);
    return { success: false, error: "Failed to create authentication user." };
  }

  const { error: studentError } = await supabase.from("students").insert({
    user_id: authUser.user.id,
    full_name,
    reg_number,
  });

  if (studentError) {
    console.error(studentError);
    return { success: false, error: "Failed to insert student record." };
  }

  await sendLegacyStudentEmail({
    email,
    password: UNIVERSAL_PASSWORD,
    reg_number,
    full_name,
  });

  return { success: true };
}

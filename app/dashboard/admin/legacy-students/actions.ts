"use server";

import { createClient } from "@/lib/supabase/admin-server";
import { sendLegacyStudentEmail } from "@/lib/emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = process.env.UNIVERSAL_PASSWORD!;

export async function addLegacyStudent(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string | null;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const gender = formData.get("gender") as string | null;
  const dob = formData.get("dob") as string | null;
  const location = formData.get("location") as string | null;
  const role = formData.get("role") as string | null;
  const user_id = formData.get("user_id") as string | null;
  const avatar_url = formData.get("avatar_url") as string | null;
  const reg_number = formData.get("reg_number") as string | null;

  // Step 1: Create auth user + users table entry
  if (email && full_name && !phone && !reg_number) {
    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      console.error("[Check Existing User Error]:", existingUserError);
      return { success: false, error: "Failed checking existing users." };
    }

    if (existingUser) {
      return { success: false, error: "Email already exists." };
    }

    // Create in Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password: UNIVERSAL_PASSWORD,
    });

    if (authError || !authUser?.user?.id) {
      console.error("[Auth Creation Error]:", authError);
      return { success: false, error: "Failed creating authentication user." };
    }

    // Insert into users table
    const { error: userInsertError } = await supabase.from("users").insert({
      id: authUser.user.id,
      email,
      full_name,
      role: "student",
    });

    if (userInsertError) {
      console.error("[Insert Users Table Error]:", userInsertError);
      return { success: false, error: "Failed inserting user profile." };
    }

    return { success: true, partial: true, userId: authUser.user.id };
  }

  // Step 2: Update users table profile details
  if (user_id && phone && gender && dob && location && role && !reg_number) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        phone,
        gender,
        date_of_birth: dob,
        location,
        role,
        avatar_url: avatar_url || null,
      })
      .eq("id", user_id);

    if (updateError) {
      console.error("[Update Users Table Error]:", updateError);
      return { success: false, error: "Failed updating user details." };
    }

    return { success: true, partial: true, userId: user_id };
  }

  // Step 3: Insert into students table and send email
  if (user_id && reg_number) {
    const { error: studentInsertError } = await supabase.from("students").insert({
      user_id,
      full_name,
      reg_number,
      phone,
      gender,
      date_of_birth: dob,
      location,
      role,
      staff_id: role === "admin" || role === "lecturer" ? user_id : null,
      avatar_url: avatar_url || null,
    });

    if (studentInsertError) {
      console.error("[Insert Students Table Error]:", studentInsertError);
      return { success: false, error: "Failed inserting student record." };
    }

    await sendLegacyStudentEmail({
      email: email!,
      password: UNIVERSAL_PASSWORD,
      reg_number,
      full_name: full_name!,
    });

    return { success: true };
  }

  return { success: false, error: "Invalid form submission stage." };
}

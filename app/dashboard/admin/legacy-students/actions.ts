"use server";

import { createClient } from "@/lib/supabase/admin-server";
import { sendLegacyStudentEmail } from "@/lib/emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = process.env.UNIVERSAL_PASSWORD!;

// We'll temporarily hold form state in database or memory if needed later
// For now, assume all fields come finally at the end

export async function addLegacyStudent(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // Step 1 fields
  const full_name = formData.get("full_name") as string | null;
  const email = formData.get("email") as string | null;

  // Step 2 fields
  const phone = formData.get("phone") as string | null;
  const gender = formData.get("gender") as string | null;
  const dob = formData.get("dob") as string | null;
  const location = formData.get("location") as string | null;
  const role = formData.get("role") as string | null;
  const user_id = formData.get("user_id") as string | null;
  const avatar_url = formData.get("avatar_url") as string | null;

  // Step 3 field
  const reg_number = formData.get("reg_number") as string | null;

  // Only finalize when all steps are completed (when reg_number is present)
  if (!reg_number) {
    // Not final submit yet, just validate current form stage
    if (!full_name || !email) {
      return { success: false, error: "Full Name and Email are required." };
    }
    if (!phone || !gender || !dob || !location || !role) {
      return { success: false, error: "Complete personal details first." };
    }
    return { success: true, partial: true }; // Signal frontend to move to next step
  }

  // Final Step: actually create the account
  if (!full_name || !email || !reg_number) {
    return { success: false, error: "Missing required fields for final submission." };
  }

  // Check if user already exists
  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUserError) {
    console.error("Check existing user error:", existingUserError);
    return { success: false, error: "Error checking existing users." };
  }

  if (existingUser) {
    return { success: false, error: "User with this email already exists." };
  }

  // Create user in auth
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

  // Insert into students table
  const { error: studentError } = await supabase.from("students").insert({
    user_id: authUser.user.id,
    full_name,
    reg_number,
    phone,
    gender,
    date_of_birth: dob,
    location,
    role,
    staff_id: user_id || null,
    avatar_url: avatar_url || null,
  });

  if (studentError) {
    console.error("Insert student error:", studentError);
    return { success: false, error: "Failed to insert student record." };
  }

  // Send welcome email
  await sendLegacyStudentEmail({
    email,
    password: UNIVERSAL_PASSWORD,
    reg_number,
    full_name,
  });

  return { success: true, partial: false };
}

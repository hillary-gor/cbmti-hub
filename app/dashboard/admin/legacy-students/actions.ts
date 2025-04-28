"use server";

import { createClient } from "@/lib/supabase/admin-server";
import { sendLegacyStudentEmail } from "@/lib/emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = process.env.UNIVERSAL_PASSWORD!;

/**
 * Utility: Wait for given milliseconds
 */
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Step 1: Create Authentication User
 * - If user already exists, fetch and continue
 * - Retry fetching from 'users' table if necessary
 * - No manual insert into users table (trigger handles it)
 */
export async function createAuthUser(formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string | null;
  const email = formData.get("email") as string | null;

  if (!full_name || !email) {
    return { success: false, error: "Full Name and Email are required." };
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: UNIVERSAL_PASSWORD,
    user_metadata: { full_name },
  });

  if (authError) {
    if (authError.status === 422 && authError.code === "email_exists") {
      console.warn("[createAuthUser] Email already exists. Fetching from users table...");

      for (let attempt = 1; attempt <= 3; attempt++) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (existingUser?.id) {
          console.log(`[createAuthUser] Found existing user after ${attempt} attempt(s).`);
          return { success: true, userId: existingUser.id };
        }

        if (attempt < 3) {
          console.warn(`[createAuthUser] User not found. Retrying attempt ${attempt}...`);
          await wait(1000); // wait 1 second before next try
        }
      }

      console.error("[createAuthUser] Failed fetching existing user after retries.");
      return { success: false, error: "User exists but could not fetch user record." };
    }

    console.error("[createAuthUser] Unexpected error:", authError);
    return { success: false, error: "Failed creating authentication user." };
  }

  // Fresh user created successfully
  return { success: true, userId: authUser.user.id };
}

/**
 * Step 2: Update User Profile
 * - Completes profile info like phone, gender, dob, location, role
 */
interface ProfileData {
  phone: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  location: string;
  role: "student" | "admin" | "lecturer";
}

export async function updateUserProfile(userId: string, data: ProfileData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({
      phone: data.phone,
      gender: data.gender,
      dob: data.dob,
      location: data.location,
      role: data.role,
    })
    .eq("id", userId);

  if (error) {
    console.error("[updateUserProfile] Error:", error);
    return { success: false, error: "Failed updating user profile." };
  }

  return { success: true };
}

/**
 * Step 3: Assign Student Registration Number
 * - Updates students.reg_number
 * - Sends welcome email after success
 */
export async function updateStudentRegNumber(userId: string, reg_number: string) {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("students")
    .update({ reg_number })
    .eq("user_id", userId);

  if (updateError) {
    console.error("[updateStudentRegNumber] Error updating reg number:", updateError);
    return { success: false, error: "Failed updating registration number." };
  }

  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError || !userData) {
    console.error("[updateStudentRegNumber] Failed fetching user for email:", fetchError);
    return { success: true }; // Still mark success even if email fails
  }

  try {
    await sendLegacyStudentEmail({
      email: userData.email,
      password: UNIVERSAL_PASSWORD,
      reg_number,
      full_name: userData.full_name,
    });
  } catch (emailError) {
    console.error("[updateStudentRegNumber] Failed sending welcome email:", emailError);
    // Continue, since reg_number is updated
  }

  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/admin-server";
import { sendLegacyStudentEmail } from "@/lib/emails/sendLegacyStudentEmail";

const UNIVERSAL_PASSWORD = process.env.UNIVERSAL_PASSWORD!;

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
  });

  if (authError) {
    console.error("[createAuthUser] Error:", authError);
    return { success: false, error: "Failed creating auth user." };
  }

  const { error: userInsertError } = await supabase.from("users").insert({
    id: authUser.user.id,
    email,
    full_name,
    role: "student",
  });

  if (userInsertError) {
    console.error("[Insert User Profile Error]:", userInsertError);
    return { success: false, error: "Failed creating user profile." };
  }

  return { success: true, userId: authUser.user.id };
}

interface ProfileData {
  phone: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  location: string;
  role: "student" | "admin" | "lecturer";
}

export async function updateUserProfile(userId: string, data: ProfileData) {
  const supabase = await createClient();

  const { error } = await supabase.from("users").update({
    phone: data.phone,
    gender: data.gender,
    date_of_birth: data.dob,
    location: data.location,
    role: data.role,
  }).eq("id", userId);

  if (error) {
    console.error("[updateUserProfile] Error:", error);
    return { success: false, error: "Failed updating profile." };
  }

  return { success: true };
}

export async function updateStudentRegNumber(userId: string, reg_number: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").update({
    reg_number,
  }).eq("user_id", userId);

  if (error) {
    console.error("[updateStudentRegNumber] Error:", error);
    return { success: false, error: "Failed updating registration number." };
  }

  // Send welcome email (optional)
  const { data: userData, error: fetchError } = await supabase.from("users").select("email, full_name").eq("id", userId).single();
  if (!fetchError && userData) {
    await sendLegacyStudentEmail({
      email: userData.email,
      password: UNIVERSAL_PASSWORD,
      reg_number,
      full_name: userData.full_name,
    });
  }

  return { success: true };
}

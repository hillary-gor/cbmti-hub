"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

// Zod schema for email validation
const emailSchema = z.string().email("Please enter a valid email address.");

// Return type
type SendResetPasswordEmailResult = {
  success: boolean;
  message: string;
};

export async function sendResetPasswordEmail(
  formData: FormData,
): Promise<SendResetPasswordEmailResult> {
  const email = formData.get("email") as string;

  // Input Validation
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return { success: false, message: parsedEmail.error.errors[0].message };
  }

  const supabase = await createClient();

  // Supabase Call with Rate Limiting Consideration (Supabase handles much of this)
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsedEmail.data,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account/update-password`,
    },
  );

  if (error) {
    if (
      error.message.includes("User not found") ||
      error.message.includes("User does not exist")
    ) {
      return {
        success: true,
        message:
          "If that email exists in our system, you’ll receive a reset link shortly.",
      };
    }

    console.error("Password reset error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  return {
    success: true,
    message:
      "If that email exists in our system, you’ll receive a reset link shortly.",
  };
}

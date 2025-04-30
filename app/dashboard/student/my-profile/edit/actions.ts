// app/dashboard/student/my-profile/edit/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  full_name: z.string().min(2).max(100),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  town_city: z.string().optional(),
  postal_code: z.string().optional(),
  nationality: z.string().optional(),
  national_id: z.string().optional(),
  marital_status: z.string().optional(),
  religion: z.string().optional(),
});

export async function updateStudentProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    phone_number: formData.get("phone_number"),
    address: formData.get("address"),
    town_city: formData.get("town_city"),
    postal_code: formData.get("postal_code"),
    nationality: formData.get("nationality"),
    national_id: formData.get("national_id"),
    marital_status: formData.get("marital_status"),
    religion: formData.get("religion"),
  });

  if (!parsed.success) {
    return { error: "Validation failed", issues: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("students")
    .update(parsed.data)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/student/my-profile");
  return { success: true };
}

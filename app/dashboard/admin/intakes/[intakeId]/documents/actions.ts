"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Generate a signed URL for file download.
 */
export async function generateSignedUrl(filePath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("student-documents")
    .createSignedUrl(filePath, 60 * 10); // 10 minutes

  if (error || !data?.signedUrl) {
    throw new Error("Failed to create signed URL");
  }

  return data.signedUrl;
}

/**
 * Server Action: for useFormState (can return data)
 */
export async function deleteFileAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: boolean }> {
  const id = formData.get("id") as string;
  const filePath = formData.get("filePath") as string;

  const supabase = await createClient();

  const { error: fileError } = await supabase.storage
    .from("student-documents")
    .remove([filePath]);

  if (fileError) {
    throw new Error(fileError.message);
  }

  const { error: dbError } = await supabase
    .from("student_attachments")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw new Error(dbError.message);
  }

  return { success: true };
}

/**
 * HTML form-safe action: must return void (Next 15+)
 */
export async function deleteFileDirect(formData: FormData): Promise<void> {
  await deleteFileAction(undefined, formData);
  // Optionally redirect here if needed:
  // redirect('/dashboard/admin/...');
}

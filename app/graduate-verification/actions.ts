"use server";

import { createClient } from "@/utils/supabase/server";

export interface GraduateRecord {
  id: string;
  full_name: string;
  reg_number: string;
  certificate_no: string;
  transcript_no: string;
  course: string;
  graduation_date: string;
  grade_class?: string | null;
  email?: string | null;
  phone_number?: string | null;
  notes?: string | null;
}

/**
 * Looks up a graduate by certificate number, transcript number, or reg number.
 */
export async function verifyGraduate(
  query: string
): Promise<GraduateRecord | null> {
  if (!query) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("graduate_documents")
    .select("*")
    .or(
      `certificate_no.eq.${query},transcript_no.eq.${query},reg_number.eq.${query}`
    )
    .maybeSingle();

  if (error) {
    console.error("verifyGraduate error:", error.message);
    return null;
  }

  return data as GraduateRecord | null;
}

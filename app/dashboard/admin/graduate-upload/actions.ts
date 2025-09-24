"use server";

import { createClient } from "@/utils/supabase/server";

export type GraduateRow = {
  full_name: string;
  reg_number: string;
  certificate_no: string;
  transcript_no: string;
  course: string;
  graduation_date: string;
  grade_class?: string;
  email?: string;
  phone_number?: string;
  notes?: string;
};

/** Bulk upsert into graduate_documents, keyed on reg_number */
export async function uploadGraduates(rows: GraduateRow[]) {
  const supabase = await createClient();
  if (!rows?.length) return;

  const payload = rows.map((r) => ({
    full_name: r.full_name.trim(),
    reg_number: r.reg_number.trim(),
    certificate_no: r.certificate_no.trim(),
    transcript_no: r.transcript_no.trim(),
    course: r.course.trim(),
    graduation_date: new Date(r.graduation_date).toISOString(),
    grade_class: r.grade_class?.trim() || null,
    email: r.email?.trim() || null,
    phone_number: r.phone_number?.trim() || null,
    notes: r.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("graduate_documents").upsert(payload, {
    onConflict: "reg_number",
    ignoreDuplicates: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);
}

"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

type AssignResult = {
  success: boolean;
  error?: string;
};

const assignSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
  intakeId: z.string().uuid(),
  reg_number: z.string(),
});

export default async function assignStudentToCourse(
  _prevState: AssignResult,
  formData: FormData,
): Promise<AssignResult> {
  const raw = {
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    intakeId: formData.get("intakeId"),
    reg_number: formData.get("reg_number"),
  };

  const parse = assignSchema.safeParse(raw);
  if (!parse.success) {
    return { success: false, error: "Invalid input data." };
  }

  const { studentId, courseId, intakeId, reg_number } = parse.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("students")
    .update({
      course_id: courseId,
      intake_id: intakeId,
      reg_number: reg_number,
    })
    .eq("id", studentId);

  if (error) {
    return { success: false, error: "Failed to assign student. Please try again." };
  }

  return { success: true };
}

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
});

export default async function assignStudentToCourse(
  _prevState: AssignResult,
  formData: FormData,
): Promise<AssignResult> {
  const raw = {
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    intakeId: formData.get("intakeId"),
  };

  const parse = assignSchema.safeParse(raw);
  if (!parse.success) {
    return { success: false, error: "Invalid input." };
  }

  const { studentId, courseId, intakeId } = parse.data;

  const supabase = await createClient();

  const { error } = await supabase
    .from("students")
    .update({ course_id: courseId, intake_id: intakeId })
    .eq("id", studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

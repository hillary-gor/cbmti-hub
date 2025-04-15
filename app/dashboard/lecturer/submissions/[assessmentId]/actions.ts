"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type GradeSubmissionState = {
  success: boolean
  error: string
}

export async function gradeSubmission(
  _prevState: GradeSubmissionState,
  formData: FormData
): Promise<GradeSubmissionState> {
  const supabase = await createClient()

  const submissionId = formData.get("submission_id")?.toString()
  const assessmentId = formData.get("assessment_id")?.toString()
  const gradeRaw = formData.get("grade")
  const feedback = formData.get("feedback")?.toString()

  const grade = gradeRaw !== null ? Number(gradeRaw) : NaN

  if (!submissionId || isNaN(grade) || !assessmentId) {
    return { error: "Invalid input", success: false }
  }

  const { error } = await supabase
    .from("submissions")
    .update({ grade, feedback })
    .eq("id", submissionId)

  if (error) {
    return {
      error: error.message ?? "Failed to update submission",
      success: false,
    }
  }

  revalidatePath(`/dashboard/lecturer/submissions/${assessmentId}`)

  return { success: true, error: "" }
}

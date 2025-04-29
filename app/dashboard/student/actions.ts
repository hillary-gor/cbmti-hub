"use server";

import { createClient } from "@/utils/supabase/server";

export async function getStudentDashboardData() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "student") return null;

  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select(`
      enrollments(courses(name, code, instructor)),
      grades(subject, score),
      student_fees(amount_due, due_date),
      certificates(title, file_url),
      v_transcript_data(file_url, gpa),
      attendance(date, status)
    `)
    .eq("id", user.id)
    .single();

  if (studentError || !studentData) return null;

  const courses =
    studentData.enrollments?.flatMap((e) =>
      Array.isArray(e.courses) ? e.courses : [e.courses]
    ) ?? [];

  const transcript = Array.isArray(studentData.v_transcript_data)
    ? studentData.v_transcript_data[0] ?? null
    : studentData.v_transcript_data ?? null;

  return {
    full_name: userData.full_name, // from users table
    courses,
    grades: studentData.grades ?? [],
    fees: studentData.student_fees ?? [],
    certificates: studentData.certificates ?? [],
    transcript,
    attendance: studentData.attendance ?? [],
  };
}

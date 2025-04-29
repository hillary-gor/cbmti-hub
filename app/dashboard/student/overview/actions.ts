"use server";

import { createClient } from "@/utils/supabase/server";

type Course = { title: string; code: string };
type Intake = { label: string };
type StudentOverview = {
  student: {
    id: string;
    full_name: string;
    reg_number: string;
    enrollment_year: number;
    course: Course;
    intake: Intake;
  };
  grades: { subject: string; score: number }[];
  fees: { amount_due: number; due_date: string }[];
  certificates: { title: string; file_url: string }[];
  transcript: { file_url: string; gpa: number } | null;
  attendance: { date: string; status: string }[];
};

export async function fetchStudentOverview(): Promise<StudentOverview | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    return null;
  }

  const { data: studentRaw, error: studentError } = await supabase
    .from("students")
    .select(`
      id,
      full_name,
      reg_number,
      enrollment_year,
      course:course_id(title, code),
      intake:intake_id(label)
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (studentError || !studentRaw) {
    console.error("Student fetch error:", studentError);
    return null;
  }

  // Supabase returns related joins as arrays — I unwrap them
  const course = Array.isArray(studentRaw.course) ? studentRaw.course[0] : studentRaw.course;
  const intake = Array.isArray(studentRaw.intake) ? studentRaw.intake[0] : studentRaw.intake;

  const student = {
    id: studentRaw.id,
    full_name: studentRaw.full_name,
    reg_number: studentRaw.reg_number,
    enrollment_year: studentRaw.enrollment_year,
    course,
    intake,
  };

  const [gradesRes, feesRes, certsRes, transcriptRes, attendanceRes] = await Promise.all([
    supabase.from("grades").select("subject, score").eq("student_id", student.id).limit(5),
    supabase.from("student_fees").select("amount_due, due_date").eq("student_id", student.id).limit(1),
    supabase.from("certificates").select("title, file_url").eq("student_id", student.id),
    supabase.from("v_transcript_data").select("file_url, gpa").eq("student_id", student.id).maybeSingle(),
    supabase.from("attendance").select("date, status").eq("student_id", student.id).order("date", { ascending: false }).limit(5),
  ]);

  if (
    gradesRes.error ||
    feesRes.error ||
    certsRes.error ||
    transcriptRes.error ||
    attendanceRes.error
  ) {
    console.error("Data fetch error", {
      grades: gradesRes.error,
      fees: feesRes.error,
      certs: certsRes.error,
      transcript: transcriptRes.error,
      attendance: attendanceRes.error,
    });
    return null;
  }

  return {
    student,
    grades: gradesRes.data ?? [],
    fees: feesRes.data ?? [],
    certificates: certsRes.data ?? [],
    transcript: transcriptRes.data ?? null,
    attendance: attendanceRes.data ?? [],
  };
}

'use server'

import { createClient } from '@/utils/supabase/server'

export async function getStudentDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      users(full_name),
      enrollments(courses(name, code, instructor)),
      grades(subject, score),
      student_fees(amount_due, due_date),
      certificates(title, file_url),
      v_transcript_data(file_url, gpa),
      attendance(date, status)
    `)
    .eq('id', user.id)
    .single()

  if (error || !data) return null

  // Runtime-safe: handle array or object
  let fullName = 'Student'
  if (Array.isArray(data.users)) {
    fullName = data.users[0]?.full_name ?? 'Student'
  } else if (data.users && typeof data.users === 'object') {
    fullName = (data.users as { full_name?: string })?.full_name ?? 'Student'
  }

  // Fix: Flatten nested courses array if needed
  const courses = data.enrollments?.flatMap(e =>
    Array.isArray(e.courses) ? e.courses : [e.courses]
  ) ?? []

  // Fix: Return first transcript item or null
  const transcript =
    Array.isArray(data.v_transcript_data) && data.v_transcript_data.length > 0
      ? data.v_transcript_data[0]
      : data.v_transcript_data ?? null

  return {
    full_name: fullName,
    courses,
    grades: data.grades ?? [],
    fees: data.student_fees ?? [],
    certificates: data.certificates ?? [],
    transcript,
    attendance: data.attendance ?? [],
  }
}

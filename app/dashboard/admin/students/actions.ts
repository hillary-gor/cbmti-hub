'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchStudents({
  search,
  courseId,
  intakeId,
  limit = 20,
  cursor,
}: {
  search?: string
  courseId?: string
  intakeId?: string
  limit?: number
  cursor?: string // the last ID from the previous batch
}) {
  const supabase = await createClient()

  let query = supabase
    .from('students')
    .select(
      `id, full_name, reg_number, status, enrollment_year, serial_no, created_at, courses(code), intakes(label)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt('created_at', cursor) // for infinite scroll
  }

  if (search) {
    query = query.ilike('full_name', `%${search}%`).or(`reg_number.ilike.%${search}%`)
  }

  if (courseId) {
    query = query.eq('course_id', courseId)
  }

  if (intakeId) {
    query = query.eq('intake_id', intakeId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data
}

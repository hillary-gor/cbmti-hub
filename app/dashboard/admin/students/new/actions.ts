'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Fetches all users eligible to be assigned as students.
 * These are users who exist in the `users` table but not in the `students` table.
 * Uses the `get_eligible_users` RPC.
 */
export async function fetchEligibleUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_eligible_users')

  if (error) throw new Error(error.message)

  return data as { id: string; email: string; full_name: string }[]
}

/**
 * Inserts a new student record using form data submitted from the admin UI.
 * Requires user_id (from eligible users), course_id, intake_id, and enrollment_year.
 */
export async function createStudent(_: unknown, formData: FormData) {
  const supabase = await createClient()

  const user_id = formData.get('user_id') as string
  const course_id = formData.get('course_id') as string
  const intake_id = formData.get('intake_id') as string
  const enrollment_year = parseInt(formData.get('enrollment_year') as string)

  const { error } = await supabase.from('students').insert({
    user_id,
    course_id,
    intake_id,
    enrollment_year,
    status: 'active',
  })

  if (error) throw new Error(error.message)

  return { success: true }
}

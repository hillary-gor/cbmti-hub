'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

const schema = z.object({
  full_name: z.string().min(2),
  course_id: z.string().uuid(),
  intake_id: z.string().uuid(),
  enrollment_year: z.coerce.number(),
  status: z.enum(['active', 'graduated', 'withdrawn', 'suspended']),
})

export async function updateStudent(studentId: string, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: 'Invalid form input' }

  const supabase = await createClient()

  const { full_name, course_id, intake_id, enrollment_year, status } = parsed.data

  const { error } = await supabase
    .from('students')
    .update({
      full_name,
      course_id,
      intake_id,
      enrollment_year,
      status,
    })
    .eq('id', studentId)

  if (error) return { error: error.message }

  return { success: true }
}

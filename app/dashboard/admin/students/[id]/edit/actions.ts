'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const schema = z.object({
  full_name: z.string().min(2),
  course_id: z.string().uuid(),
  intake_id: z.string().uuid(),
  enrollment_year: z.coerce.number().min(2000),
  status: z.enum(['active', 'graduated', 'withdrawn', 'suspended']),
})

export async function updateStudent(id: string, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const { full_name, course_id, intake_id, enrollment_year, status } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase
    .from('students')
    .update({ full_name, course_id, intake_id, enrollment_year, status })
    .eq('id', id)

  if (error) return { error: error.message }

  redirect('/dashboard/admin/students')
}

'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const schema = z.object({
  code: z.string().min(2),
  name: z.string().min(3),
  department_id: z.string().uuid(),
})

export async function updateCourse(id: string, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { error: 'Invalid input' }
  }

  const { code, name, department_id } = parsed.data
  const supabase = await createClient()

  // 🛑 Check if another course already has this code
  const { data: existing, error: lookupError } = await supabase
    .from('courses')
    .select('id')
    .eq('code', code)
    .neq('id', id)
    .maybeSingle()

  if (lookupError) {
    return { error: 'Error checking for duplicates' }
  }

  if (existing) {
    return { error: `Another course with code "${code}" already exists.` }
  }

  const { error } = await supabase
    .from('courses')
    .update({ code, name, department_id })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard/admin/courses')
}

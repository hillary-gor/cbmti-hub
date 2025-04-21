'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const schema = z.object({
  opens_on: z.string().min(10), // YYYY-MM-DD format
})

export async function createIntake(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { error: '⚠️ Invalid date format' }
  }

  const { opens_on } = parsed.data
  const date = new Date(opens_on)

  const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

  const supabase = await createClient()

  // Optional: prevent duplicates for same label
  const { data: existing, error: checkError } = await supabase
    .from('intakes')
    .select('id')
    .eq('label', label)
    .maybeSingle()

  if (checkError) return { error: 'Error checking existing intakes' }
  if (existing) return { error: `⚠️ Intake "${label}" already exists.` }

  const { error } = await supabase.from('intakes').insert([
    {
      opens_on,
      label,
    },
  ])

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard/admin/cohorts')
}

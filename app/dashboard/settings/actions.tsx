'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettingsData(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, phone')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function updateUserSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  await supabase
    .from('users')
    .update({ full_name, phone })
    .eq('id', user.id)

  revalidatePath('/dashboard/settings')
}

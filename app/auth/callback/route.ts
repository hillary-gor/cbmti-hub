// Redirect user after login
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getUserAndRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  if (error || !data) return null

  return data
}


'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function signUpWithEmailPassword(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = signUpSchema.safeParse(raw)

  if (!parsed.success) {
    console.error('[Signup Validation Failed]', parsed.error.flatten().fieldErrors)
    return { error: 'Invalid email or password format' }
  }

  const { email, password } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('[Signup Error]', error.message)
    return { error: error.message }
  }

  return { success: true, email }
}

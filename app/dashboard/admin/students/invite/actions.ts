'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const InviteUserSchema = z.object({
  email: z.string().email(),
})

export async function inviteUser(formData: FormData) {
  const parsed = InviteUserSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: 'Invalid email', issues: parsed.error.format() }
  }

  const { email } = parsed.data

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false, // <-- triggers invite email via your SMTP config
  })

  if (error) {
    if (error.message.includes('duplicate key value')) {
      return { error: 'User already exists' }
    }
    return { error: error.message }
  }

  return { success: true, email }
}

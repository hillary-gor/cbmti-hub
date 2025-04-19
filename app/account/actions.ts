'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Schema (mirrors the form schema)
const updateSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(10),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().min(1),
  location: z.string().min(2),
  role: z.enum(['student', 'admin', 'lecturer']),
  user_id: z.string().optional(),
  avatar_url: z.string().optional(),
})

export async function updateUserProfile(userId: string, data: unknown) {
  const supabase = await createClient()

  // Validate input using Zod
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) {
    console.error('[Zod Validation Error]', parsed.error.flatten().fieldErrors)
    redirect('/account?error=validation')
  }

  const payload = parsed.data

  // Perform update
  const { error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', userId)

  if (error) {
    console.error('[Update Error]', error.message)
    redirect('/account?error=update')
  }

  // Role-based redirect
  switch (payload.role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'lecturer':
      redirect('/dashboard/lecturer')
    case 'student':
      redirect('/dashboard/student')
    default:
      redirect('/unauthorized')
  }
}

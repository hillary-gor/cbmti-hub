import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('users')
    .select('full_name, phone, gender, dob, location, avatar_url, role, user_id')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    console.error('[Supabase Error]', error?.message || 'No profile found')
    redirect('/login?error=profile-not-found')
  }

  const isCommonComplete =
    profile.full_name &&
    profile.phone &&
    profile.gender &&
    profile.dob &&
    profile.location &&
    profile.avatar_url

  const requiresUserId =
    (profile.role === 'admin' || profile.role === 'lecturer') &&
    !profile.user_id

  const isComplete = isCommonComplete && !requiresUserId

  if (isComplete) {
    switch (profile.role) {
      case 'admin':
        redirect('/dashboard/admin')
      case 'student':
        redirect('/dashboard/student')
      case 'lecturer':
        redirect('/dashboard/lecturer')
      default:
        redirect('/unauthorized')
    }
  }

  return <AccountForm userId={user.id} />
}

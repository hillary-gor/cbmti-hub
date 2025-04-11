'use server'

import { createClient } from '@/utils/supabase/server'
import AccountForm from './account-form'

export default async function AccountPage() {
  // Await createClient coz it returns a Promise
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        You must be logged in to view this page.
      </p>
    )
  }

  return (
    <AccountForm
      userId={user.id}
      email={user.email ?? ''}
      role={user.user_metadata?.role ?? 'student'}
    />
  )
}

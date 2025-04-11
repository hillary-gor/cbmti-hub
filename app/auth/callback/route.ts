// Redirect user after login
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!data?.role) redirect('/unauthorized')

  switch (data.role) {
    case 'student': return redirect('/dashboard/student')
    case 'instructor': return redirect('/dashboard/instructor')
    case 'admin': return redirect('/dashboard/admin')
    default: return redirect('/unauthorized')
  }
}



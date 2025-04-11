import { getUserAndRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserAndRole()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r p-6">
        <h2 className="text-xl font-bold mb-4">CBMTI Hub</h2>
        <nav className="space-y-2 text-sm">
          <Link href="/dashboard" className="block">Home</Link>
          <Link href="/dashboard/settings" className="block">Settings</Link>
          {user.role === 'admin' && <Link href="/dashboard/admin">Admin Panel</Link>}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

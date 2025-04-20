'use client'

import { useEffect, useState } from 'react'
import { redirect, usePathname } from 'next/navigation'
import { getUserAndRole } from '@/lib/auth'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { label: '🏠 Dashboard', href: '/dashboard/admin' },
  { label: '📚 Intakes', href: '/dashboard/admin/intakes' },
  { label: '👨‍🎓 Students', href: '/dashboard/admin/students' },
  { label: '👥 Staff Accounts', href: '/dashboard/admin/staff' },
  { label: '⚙️ Settings', href: '/dashboard/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [, setUser] = useState<{ role: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    ;(async () => {
      const u = await getUserAndRole()
      if (!u) redirect('/login')
      if (u.role !== 'admin') redirect('/unauthorized')
      setUser(u)
    })()
  }, [])

  const toggleSidebar = () => setIsOpen(prev => !prev)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-zinc-800 border p-2 rounded-md"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h2 className="text-xl font-bold mb-6">CBMTI Admin</h2>
        <nav className="space-y-3 text-sm">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md font-medium transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 ml-0 lg:ml-64">{children}</main>
    </div>
  )
}

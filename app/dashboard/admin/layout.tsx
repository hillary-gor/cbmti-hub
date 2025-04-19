'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Settings,
  LayoutDashboard,
  Book,
  Users,
  FilePlus2,
  FileText,
  FileSignature,
  Menu,
  X,
} from 'lucide-react'
import { getUserAndRole } from '@/lib/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<{ role: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      const data = await getUserAndRole()
      if (!data) return redirect('/login')
      setUser(data)
    })()
  }, [])

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const adminNavItems = [
    { label: 'Admin Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Intakes', href: '/dashboard/admin/intakes', icon: Book },
    { label: 'Students', href: '/dashboard/admin/students', icon: Users },
    { label: 'Enrollments', href: '/dashboard/admin/intakes/[intakeId]/enrollments', icon: FilePlus2 },
    { label: 'Register Students', href: '/dashboard/admin/intakes/[intakeId]/register', icon: FileText },
    { label: 'Documents', href: '/dashboard/admin/intakes/[intakeId]/documents', icon: FileSignature },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile Toggle Button */}
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
        <h2 className="text-xl font-bold mb-4">CBMTI Hub</h2>
        <nav className="space-y-3 text-sm">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} pathname={pathname} />
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="border-t border-gray-300 my-4" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admin</h3>
              {adminNavItems.map((item) => (
                <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} pathname={pathname} />
              ))}
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 lg:ml-64">{children}</main>
    </div>
  )
}

function NavItem({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string
  label: string
  icon: React.ElementType
  pathname: string
}) {
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition text-sm font-medium ${
        isActive
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  )
}

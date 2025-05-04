'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUserAndRole } from '@/lib/auth'
import Link from 'next/link'
import clsx from 'clsx'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  ClipboardList,
  Megaphone,
  Settings,
} from 'lucide-react'
import { SignOutButton } from '@/components/auth/SignOutButton'

const navItems = [
  { label: 'Overview', href: '/dashboard/lecturer/overview', icon: LayoutDashboard },
  { label: 'Courses', href: '/dashboard/lecturer/courses', icon: BookOpen },
  { label: 'Assessments', href: '/dashboard/lecturer/assessments', icon: FileCheck },
  { label: 'Grades', href: '/dashboard/lecturer/grades', icon: ClipboardList },
  { label: 'Announcements', href: '/dashboard/lecturer/announcements', icon: Megaphone },
  { label: 'Settings', href: '/dashboard/lecturer/settings', icon: Settings },
]

export default function LecturerShellLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const user = await getUserAndRole()
      if (!user) return router.replace('/login')
      if (user.role !== 'lecturer') return router.replace('/unauthorized')

      setAuthorized(true)
      setAvatarUrl(user.avatar_url || null)
    })()
  }, [router])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-gray-50 dark:bg-zinc-900 relative">
      {/* Topbar (Mobile) */}
      <header className="lg:hidden sticky top-0 z-40 flex justify-between items-center bg-white dark:bg-zinc-800 border-b px-4 py-3">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <span className="font-semibold text-lg text-gray-800 dark:text-white">CBMTI Lecturer</span>
        <div className="flex items-center gap-3">
          <SignOutButton />
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Lecturer avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500" />
          )}
        </div>
      </header>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed z-50 inset-y-0 left-0 w-64 bg-white dark:bg-zinc-800 border-r shadow-lg lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">📘 Lecturer</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5 text-gray-800 dark:text-white" />
                </button>
              </div>
              <LecturerNav pathname={pathname} />
              <div className="px-6 py-4 border-t">
                <SignOutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-800 border-r shadow-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">📘 Lecturer</h2>
        </div>
        <LecturerNav pathname={pathname} />
        <div className="mt-auto p-4 border-t">
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
    </div>
  )
}

function LecturerNav({ pathname }: { pathname: string }) {
  return (
    <nav className="p-4 space-y-2 text-sm">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-md font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isActive
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserAndRole } from "@/lib/auth";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

const navItems = [
  { label: "🏠 Dashboard", href: "/dashboard/admin" },
  { label: "👨‍🎓 Student Fees", href: "/dashboard/admin/payments" },
  { label: "🚶 Visitor Check-in", href: "/dashboard/admin/visitors/checkin" },
  { label: "📋 Visitor Records", href: "/dashboard/admin/visitors/records" },
  // { label: '📚 Intakes', href: '/dashboard/admin/intakes' },
  // { label: '👨‍🎓 Students', href: '/dashboard/admin/students' },
  {
    label: "📝 Unassigned Students",
    href: "/dashboard/admin/assign-student-course/unassigned",
  },
  { label: "📜 Old Students", href: "/dashboard/admin/legacy-students" },
  { label: "👥 Staff Accounts", href: "/dashboard/admin/staff" },
  { label: "⚙ Settings", href: "/dashboard/settings" },
];

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserAndRole();
      if (!user) return router.replace("/login");
      if (user.role !== "admin") return router.replace("/unauthorized");
      setAuthorized(true);
      setAvatarUrl(user.avatar_url || null);
    })();
  }, [router]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-zinc-950 text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Checking admin access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 relative">
      {/* Topbar (Mobile) */}
      <header className="lg:hidden sticky top-0 z-40 flex justify-between items-center bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-4 py-3 shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-7 h-7 text-gray-800 dark:text-white" />
        </button>
        <span className="font-semibold text-lg text-gray-800 dark:text-white">
          CBMTI Admin
        </span>
        <div className="flex items-center gap-3">
          <SignOutButton />
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Admin avatar"
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-300 dark:border-zinc-600"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 150 }}
              className="fixed z-50 inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  🛠 Admin Panel
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              </div>
              <AdminNav pathname={pathname} />
              <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700">
                <SignOutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Static Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-xl">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            🛠 Admin Panel
          </h2>
        </div>
        <AdminNav pathname={pathname} />
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-zinc-700">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav className="p-4 space-y-2 text-base flex-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ease-in-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900", // Improved focus visible
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-blue-400" // Enhanced hover
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

// layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserAndRole } from "@/lib/auth";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Settings,
  BookOpen,
  LayoutDashboard,
  FileCheck,
  ClipboardList,
  Megaphone,
  CalendarCheck,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

const navSections = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Overview",
        href: "/dashboard/lecturer/overview",
        icon: LayoutDashboard,
      },
      {
        label: "Settings",
        href: "/dashboard/lecturer/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Course Management",
    items: [
      { label: "Courses", href: "/dashboard/lecturer/courses", icon: BookOpen },
      {
        label: "Assessments",
        href: "/dashboard/lecturer/assessments",
        icon: FileCheck,
      },
      {
        label: "Grades",
        href: "/dashboard/lecturer/grades",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Student Interaction",
    items: [
      {
        label: "Attendance",
        href: `/dashboard/lecturer/attendance`,
        icon: CalendarCheck,
      },
      {
        label: "Announcements",
        href: "/dashboard/lecturer/announcements",
        icon: Megaphone,
      },
    ],
  },
];

function LecturerNav({
  pathname,
  isCollapsed,
}: {
  pathname: string;
  isCollapsed: boolean;
}) {
  return (
    <nav className="p-4 space-y-4 flex-1 overflow-y-auto">
      {navSections.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
              {category.title}
            </h3>
          )}
          <div className="space-y-2">
            {category.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center rounded-lg font-medium transition-all duration-200 ease-in-out whitespace-nowrap",
                    isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={clsx("w-5 h-5", isCollapsed ? "mx-auto" : "")}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] =
    useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserAndRole();
      if (!user) return router.replace("/login");
      if (user.role !== "lecturer") return router.replace("/unauthorized");

      setAuthorized(true);
      setAvatarUrl(user.avatar_url || null);
    })();
  }, [router]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
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
          <span>Checking lecturer access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-50 dark:bg-zinc-950 relative">
      <header className="lg:hidden sticky top-0 z-40 flex justify-between items-center bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-4 py-3 shadow-sm">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu className="w-7 h-7 text-gray-800 dark:text-white" />
        </button>
        <span className="font-semibold text-lg text-gray-800 dark:text-white">
          CBMTI eHub
        </span>
        <div className="flex items-center gap-3">
          <SignOutButton />
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Lecturer avatar"
              width={36}
              height={36}
              className="rounded-full object-cover border border-gray-300 dark:border-zinc-600"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
              L
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
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
                  CBMTI
                </h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
              </div>
              <LecturerNav pathname={pathname} isCollapsed={false} />
              <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-700">
                <SignOutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={clsx(
          "hidden lg:flex flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-xl transition-all duration-300 ease-in-out",
          isDesktopSidebarExpanded ? "w-72" : "w-20"
        )}
        onMouseEnter={() => setIsDesktopSidebarExpanded(true)}
        onMouseLeave={() => setIsDesktopSidebarExpanded(false)}
      >
        <div
          className={clsx(
            "flex items-center py-5 border-b border-gray-200 dark:border-zinc-700",
            isDesktopSidebarExpanded
              ? "px-6 justify-start"
              : "justify-center px-0"
          )}
        >
          <h2
            className={clsx(
              "font-extrabold text-gray-900 dark:text-white transition-opacity duration-200",
              isDesktopSidebarExpanded
                ? "text-2xl opacity-100"
                : "text-xl opacity-0 w-0 overflow-hidden"
            )}
          >
            {isDesktopSidebarExpanded && "CBMTI"}
          </h2>
          {!isDesktopSidebarExpanded && (
            <span title="CBMTI Lecturer">
              <LayoutDashboard className="w-6 h-6 text-gray-800 dark:text-white" />
            </span>
          )}
        </div>
        <LecturerNav
          pathname={pathname}
          isCollapsed={!isDesktopSidebarExpanded}
        />
        <div
          className={clsx(
            "mt-auto p-6 border-t border-gray-200 dark:border-zinc-700",
            !isDesktopSidebarExpanded && "flex justify-center"
          )}
        >
          <SignOutButton isCollapsed={!isDesktopSidebarExpanded} />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}

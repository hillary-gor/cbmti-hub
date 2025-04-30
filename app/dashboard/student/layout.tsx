"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserAndRole } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const navSections = [
  {
    label: "🙍 My Profile",
    items: [
      { label: "View Profile", href: "/dashboard/student/my-profile" },
      { label: "Edit Profile", href: "/dashboard/student/my-profile/edit" },
    ],
  },
  {
    label: "🎓 Academic",
    items: [
      { label: "Transcript", href: "/dashboard/student/transcript" },
      { label: "Overview", href: "/dashboard/student/overview" },
    ],
  },
  {
    label: "💵 Finance",
    items: [
      { label: "Fee Balance", href: "/dashboard/student/fees" },
    ],
  },
  {
    label: "⚙️ Settings",
    items: [
      { label: "Account Settings", href: "/dashboard/settings" },
    ],
  },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const u = await getUserAndRole();
      if (!u) return router.replace("/login");
      if (u.role !== "student") return router.replace("/unauthorized");
      setAuthorized(true);
    })();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-zinc-800 border p-2 rounded-md shadow"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r p-6 overflow-y-auto transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          CBMTI Student
        </h2>

        <nav className="space-y-6 text-sm">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "block px-3 py-2 rounded-md font-medium transition",
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6 ml-0 lg:ml-64">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tiles = [
  { title: "My Profile", icon: "🙍‍♂️", href: "/dashboard/student/my-profile" },
  { title: "Transcript", icon: "📄", href: "/dashboard/student/transcript" },
  { title: "Fee Balance", icon: "💵", href: "/dashboard/student/fees" },
  {
    title: "Certificates",
    icon: "🎓",
    href: "/dashboard/student/certificates",
  },
  { title: "My Tag", icon: "🏷️", href: "/dashboard/student/tag" },
  { title: "Settings", icon: "⚙️", href: "/dashboard/settings" },
];

export default function StudentDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Student 👋
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is your personalized dashboard. You can view your academic
          progress, access documents, and manage your profile.
        </p>
      </header>

      {/* Quick Access Tiles */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group block p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{tile.icon}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
              </div>
              <h3 className="text-base font-medium text-gray-800 dark:text-white">
                {tile.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Optional: Academic Snapshot (static for now) */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          📊 Academic Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Current GPA", value: "-", color: "blue" },
            { label: "Completed Units", value: "12", color: "green" },
            { label: "Outstanding Fees", value: "-", color: "red" },
            { label: "Attendance", value: "94%", color: "gray" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900 text-${item.color}-800 dark:text-white`}
            >
              <p className="text-sm">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

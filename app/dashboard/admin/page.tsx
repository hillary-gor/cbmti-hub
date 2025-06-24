"use client";

import Link from "next/link";

const tiles = [
  { title: "📝 Approve/Decline Payments", href: "/dashboard/admin/payments" },
  { title: "📚 Manage Intakes", href: "/dashboard/admin/intakes" },
  { title: "👨‍🎓 View Students", href: "/dashboard/admin/students" },
  { title: "📝 Unassigned Students", href: "/dashboard/admin/assign-student-course/unassigned" },
  { title: "📜 Old Students", href: "/dashboard/admin/legacy-students" },
  { title: "👥 Staff Accounts", href: "/dashboard/admin/staff" },
  { title: "⚙️ Settings", href: "/dashboard/settings" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the CBMTI Admin Panel. Use the tools below to manage core operations.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="block p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">{tile.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* System Snapshot Placeholder */}
      <section>
        <h2 className="text-xl font-semibold mb-2">System Snapshot</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Coming soon: live stats on students, intakes, pending approvals, and more.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white p-4 rounded-md">
            <p className="text-sm">Students</p>
            <p className="text-2xl font-bold">--</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-white p-4 rounded-md">
            <p className="text-sm">Intakes</p>
            <p className="text-2xl font-bold">--</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-white p-4 rounded-md">
            <p className="text-sm">Unassigned</p>
            <p className="text-2xl font-bold">--</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-md">
            <p className="text-sm">Staff</p>
            <p className="text-2xl font-bold">--</p>
          </div>
        </div>
      </section>

      {/* Pending Tasks */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Pending Tasks</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
          <li>Assign students to current intakes and courses</li>
          <li>Review and update staff accounts</li>
          <li>Verify details for legacy students</li>
        </ul>
      </section>
    </div>
  );
}

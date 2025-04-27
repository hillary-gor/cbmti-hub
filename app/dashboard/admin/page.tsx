export const metadata = {
  title: "Admin Dashboard | CBMTI",
  description: "Welcome to your CBMTI Admin Control Panel",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Admin 👋</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Use the sidebar to manage students, intakes, staff, and settings.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StaticTile title="Manage Intakes" href="/dashboard/admin/intakes" />
        <StaticTile title="View Students" href="/dashboard/admin/students" />
        <StaticTile title="Staff Accounts" href="/dashboard/admin/staff" />
        <StaticTile title="Settings" href="/dashboard/settings" />
      </div>
    </div>
  );
}

function StaticTile({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="block p-6 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-lg hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
    </a>
  );
}

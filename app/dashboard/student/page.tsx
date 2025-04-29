import Link from "next/link";

export default function StudentHomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to your dashboard 🎓</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use the sidebar to explore your student information, grades, fees, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard
          title="📊 Student Overview"
          description="View your profile, academic info, grades, fees, and attendance."
          href="/dashboard/student/overview"
        />
        <DashboardCard
          title="⚙️ Settings"
          description="Manage your profile and preferences."
          href="/dashboard/settings"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-4 bg-white dark:bg-zinc-900 border rounded-lg shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Link>
  );
}

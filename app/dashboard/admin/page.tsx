import { getUserAndRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | CBMTI",
  description: "Manage intakes, enrollments, students, and more.",
};

export default async function AdminDashboardPage() {
  const user = await getUserAndRole();

  if (!user || user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <main className="max-w-6xl mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-8">
      <section>
        <h1 className="text-3xl font-bold">Welcome back, Admin 👋</h1>
        <p className="text-gray-600 mt-1">Here’s what you can manage today.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard
          title="Intakes"
          href="/dashboard/admin/intakes"
          description="Manage academic intakes and cohorts."
        />
        <AdminCard
          title="Students"
          href="/dashboard/admin/students"
          description="View and manage all students."
        />
        <AdminCard
          title="Enrollments"
          href="/dashboard/admin/intakes/[intakeId]/enrollments"
          description="Assign students to intakes."
        />
        <AdminCard
          title="Register New Students"
          href="/dashboard/admin/intakes/[intakeId]/register"
          description="Handle student onboarding."
        />
        <AdminCard
          title="Documents"
          href="/dashboard/admin/intakes/[intakeId]/documents"
          description="Upload or manage student docs."
        />
      </section>
    </main>
  );
}

function AdminCard({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-gray-300 hover:border-blue-500 rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white dark:bg-zinc-900"
    >
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}

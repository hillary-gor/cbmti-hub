import { getLecturerOverview } from "./queries";
import { StatCard } from "./components/StatCard";

export default async function LecturerOverviewPage() {
  const stats = await getLecturerOverview();

  return (
    <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Courses"
        value={stats.courses}
        icon="book-open"
        color="blue"
      />
      <StatCard
        title="Students"
        value={stats.students}
        icon="users"
        color="emerald"
      />
      <StatCard
        title="Assessments"
        value={stats.assessments}
        icon="file-check"
        color="amber"
      />
    </section>
  );
}

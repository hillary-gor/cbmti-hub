import { getStudentDashboardData } from "./actions";
import { redirect } from "next/navigation";

import { WelcomeCard } from "./components/WelcomeCard";
import { MyCourses } from "./components/MyCourses";
import { GradesChart } from "./components/GradesChart";
import { FeeBalanceSummary } from "./components/FeeBalanceSummary";
import { CertificatesList } from "./components/CertificatesList";
import { TranscriptSection } from "./components/TranscriptSection";
import { AttendanceTable } from "./components/AttendanceTable";

export const metadata = {
  title: "Student Dashboard | CBMTI",
  description: "Access your academic information, grades, fees, and more.",
};

export default async function StudentDashboardPage() {
  const data = await getStudentDashboardData();

  if (!data) {
    redirect("/unauthorized");
  }

  return (
    <main className="max-w-6xl mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-8">
      <section aria-label="Welcome">
        <WelcomeCard name={data.full_name} />
      </section>

      <section aria-label="Courses">
        <MyCourses courses={data.courses} />
      </section>

      <section aria-label="Grades">
        <GradesChart grades={data.grades} />
      </section>

      <section aria-label="Fee Balances">
        <FeeBalanceSummary fees={data.fees} />
      </section>

      <section aria-label="Certificates">
        <CertificatesList certificates={data.certificates} />
      </section>

      <section aria-label="Transcript">
        <TranscriptSection transcript={data.transcript} />
      </section>

      <section aria-label="Attendance">
        <AttendanceTable attendance={data.attendance} />
      </section>
    </main>
  );
}

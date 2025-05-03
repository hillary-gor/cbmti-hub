import { fetchStudentOverview } from "./actions";
import Image from "next/image";
import Link from "next/link";

export default async function StudentOverviewPage() {
  const overview = await fetchStudentOverview();

  if (!overview) {
    return (
      <div className="p-6 space-y-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Overview</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Unable to load student data. This system is currently under maintenance to ensure you get full access to your academic details.
        </p>
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Stay tuned. Check back soon for updates.</p>
      </div>
    );
  }

  const { student, grades, fees, certificates, transcript, attendance } = overview;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Profile Summary */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Image
          src="/default-avatar.png"
          alt="Student Avatar"
          width={80}
          height={80}
          className="rounded-full object-cover border-2 border-blue-500"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{student.full_name}</h2>
          <p className="text-sm text-gray-500">Reg No: {student.reg_number}</p>
        </div>
      </section>

      {/* Academic Info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard title="Course" content={student.course ? `${student.course.title} (${student.course.code})` : "N/A"} />
        <InfoCard title="Intake" content={student.intake?.label ?? "N/A"} />
        <InfoCard title="Enrollment Year" content={student.enrollment_year?.toString() ?? "N/A"} />
        <InfoCard title="GPA" content={transcript?.gpa?.toFixed(2) ?? "N/A"} />
      </section>

      {/* Insights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title="Recent Grades">
          {grades.length > 0 ? (
            <ul className="space-y-2">
              {grades.map((g) => (
                <li key={g.subject} className="flex justify-between text-sm">
                  <span>{g.subject}</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{g.score}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No grades available.</p>
          )}
        </InsightCard>

        <InsightCard title="Fee Balance">
          {fees.length > 0 ? (
            <div className="space-y-1 text-sm">
              <p>Amount Due: <strong className="text-red-600">KSH {fees[0].amount_due}</strong></p>
              <p>Due Date: {new Date(fees[0].due_date).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No pending fees.</p>
          )}
        </InsightCard>

        <InsightCard title="Certificates">
          {certificates.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {certificates.map((c) => (
                <li key={c.title}>
                  <Link href={c.file_url} target="_blank" className="text-blue-600 underline">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No certificates yet.</p>
          )}
        </InsightCard>

        <InsightCard title="Attendance">
          {attendance.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {attendance.map((a, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <span className={a.status === "Present" ? "text-green-600" : "text-red-500"}>{a.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No attendance records.</p>
          )}
        </InsightCard>
      </section>
    </div>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-700">
      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
    </div>
  );
}

function InsightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

import { fetchStudentOverview } from "./actions";
import Image from "next/image";
import Link from "next/link";

export default async function StudentOverviewPage() {
  const overview = await fetchStudentOverview();

  if (!overview) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Student Overview</h1>
        <p className="text-gray-500">Unable to load student data. Please try again later.</p>
      </div>
    );
  }

  const { student, grades, fees, certificates, transcript, attendance } = overview;

  return (
    <div className="space-y-8 p-6">
      {/* Profile Summary */}
      <section className="flex items-center gap-6">
        <Image
          src="/default-avatar.png"
          alt="Student Avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{student.full_name}</h2>
          <p className="text-gray-500">Reg No: {student.reg_number}</p>
        </div>
      </section>

      {/* Academic Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <li key={g.subject} className="flex justify-between">
                  <span>{g.subject}</span>
                  <span>{g.score}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No grades available.</p>
          )}
        </InsightCard>

        <InsightCard title="Fee Balance">
          {fees.length > 0 ? (
            <div className="space-y-1">
              <p>Amount Due: <strong>KSH {fees[0].amount_due}</strong></p>
              <p>Due Date: {new Date(fees[0].due_date).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No pending fees.</p>
          )}
        </InsightCard>

        <InsightCard title="Certificates">
          {certificates.length > 0 ? (
            <ul className="space-y-2">
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
            <ul className="space-y-2">
              {attendance.map((a, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <span>{a.status}</span>
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

// 🔁 Reusable Components

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}

function InsightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";

export default async function MyProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-6 text-red-600">Not logged in.</div>;
  }

  const { data: student } = await supabase
    .from("students")
    .select(
      `
      full_name,
      reg_number,
      gender,
      date_of_birth,
      nationality,
      email,
      phone_number,
      town_city,
      address,
      enrollment_year,
      course:course_id(title, code),
      intake:intake_id(label, year, month)
    `,
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (!student) {
    return <div className="p-6 text-red-600">Student profile not found.</div>;
  }

  // 🛠 Unwrap FK relations (always returned as arrays)
  const course = Array.isArray(student.course)
    ? student.course[0]
    : student.course;
  const intake = Array.isArray(student.intake)
    ? student.intake[0]
    : student.intake;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard label="Full Name" value={student.full_name} />
          <InfoCard label="Reg Number" value={student.reg_number} />
          <InfoCard label="Gender" value={student.gender ?? "N/A"} />
          <InfoCard
            label="Date of Birth"
            value={student.date_of_birth ?? "N/A"}
          />
          <InfoCard label="Nationality" value={student.nationality ?? "N/A"} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard label="Email" value={student.email ?? user.email} />
          <InfoCard
            label="Phone Number"
            value={student.phone_number ?? "N/A"}
          />
          <InfoCard label="Town/City" value={student.town_city ?? "N/A"} />
          <InfoCard label="Address" value={student.address ?? "N/A"} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            label="Course"
            value={course ? `${course.title} (${course.code})` : "N/A"}
          />
          <InfoCard
            label="Intake"
            value={
              intake ? `${intake.label} ${intake.month} ${intake.year}` : "N/A"
            }
          />
          <InfoCard
            label="Enrollment Year"
            value={student.enrollment_year?.toString() ?? "N/A"}
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-sm p-4">
      <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</h3>
      <p className="text-base font-medium text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

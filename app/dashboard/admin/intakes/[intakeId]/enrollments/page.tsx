import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";

type PageProps = {
  params: Promise<{ intakeId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type EnrollmentRow = {
  id: string;
  status: string;
  enrolled_at: string | null;
  students: { reg_number: string } | null;
  courses: { title: string } | null;
};

export default async function IntakeEnrollmentsPage({ params }: PageProps) {
  const awaitedParams = await params;
  const { intakeId } = awaitedParams;

  const supabase = await createClient();

  // Fetch intake
  const { data: intake, error: intakeError } = await supabase
    .from("intakes")
    .select("id, label")
    .eq("id", intakeId)
    .single();

  if (!intake || intakeError) {
    notFound();
  }

  // Fetch enrollments with joins
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      status,
      enrolled_at,
      students:students ( reg_number ),
      courses:courses ( title )
    `,
    )
    .eq("intake_id", intakeId)
    .order("enrolled_at", { ascending: false });

  if (error || !data) {
    console.error("[ENROLLMENTS_FETCH_ERROR]", error?.message);
    notFound();
  }

  // Flatten Supabase join arrays to single objects
  const enrollments: EnrollmentRow[] = data.map(
    (e: {
      id: string;
      status: string;
      enrolled_at: string | null;
      students?: { reg_number: string }[];
      courses?: { title: string }[];
    }): EnrollmentRow => ({
      id: e.id,
      status: e.status,
      enrolled_at: e.enrolled_at,
      students: Array.isArray(e.students) ? (e.students[0] ?? null) : null,
      courses: Array.isArray(e.courses) ? (e.courses[0] ?? null) : null,
    }),
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments for {intake.label}</h1>
        <p className="text-sm text-muted-foreground">
          List of students enrolled in this intake
        </p>
      </div>

      {enrollments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No enrollments found for this intake.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">Student Reg. Number</th>
                <th className="px-4 py-2 font-semibold">Course</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Enrolled At</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-t hover:bg-muted/30 transition"
                >
                  <td className="px-4 py-2">
                    {enrollment.students?.reg_number ?? "—"}
                  </td>
                  <td className="px-4 py-2">
                    {enrollment.courses?.title ?? "—"}
                  </td>
                  <td className="px-4 py-2 capitalize">{enrollment.status}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {enrollment.enrolled_at
                      ? format(
                          new Date(enrollment.enrolled_at),
                          "dd MMM yyyy, hh:mm a",
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

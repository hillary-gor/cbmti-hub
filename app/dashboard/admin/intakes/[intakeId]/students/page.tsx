import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ intakeId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type SupabaseEnrollment = {
  id: string;
  students: {
    reg_number: string;
    full_name: string;
    email: string;
  } | null;
  courses: {
    title: string;
  } | null;
};

type EnrolledStudent = {
  id: string;
  reg_number: string;
  full_name: string;
  email: string;
  course_title: string;
};

export default async function IntakeStudentsPage({
  params,
  searchParams,
}: PageProps) {
  const awaitedParams = await params;
  const awaitedSearchParams = searchParams ? await searchParams : {};

  const { intakeId } = awaitedParams;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      students (
        reg_number,
        full_name,
        email
      ),
      courses (
        title
      )
    `)
    .eq("intake_id", intakeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[INTAKE_STUDENTS_ERROR]", error.message);
    notFound();
  }

  const typedData = data as unknown as SupabaseEnrollment[];

  const students: EnrolledStudent[] = typedData.map((record) => ({
    id: record.id,
    reg_number: record.students?.reg_number ?? "—",
    full_name: record.students?.full_name ?? "—",
    email: record.students?.email ?? "—",
    course_title: record.courses?.title ?? "—",
  }));

  const query = (awaitedSearchParams.q as string | undefined)?.toLowerCase() ?? "";
  const courseFilter = (awaitedSearchParams.course as string | undefined)?.toLowerCase() ?? "";

  const filtered = students.filter((s) => {
    const matchesQuery =
      s.full_name.toLowerCase().includes(query) ||
      s.reg_number.toLowerCase().includes(query);

    const matchesCourse = courseFilter
      ? s.course_title.toLowerCase() === courseFilter
      : true;

    return matchesQuery && matchesCourse;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students in Intake</h1>
        <p className="text-sm text-muted-foreground">
          List of students registered in this intake.
        </p>
      </div>

      {/* 🔍 Filters */}
      <form className="flex flex-col sm:flex-row gap-4 items-start sm:items-end max-w-2xl">
        <div className="w-full">
          <label className="text-sm font-medium">Search</label>
          <input
            type="search"
            name="q"
            placeholder="Search reg no or name"
            defaultValue={awaitedSearchParams.q ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium">Filter by course</label>
          <select
            name="course"
            defaultValue={awaitedSearchParams.course ?? ""}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All courses</option>
            {[...new Set(students.map((s) => s.course_title))].map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm"
        >
          Apply
        </button>
      </form>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-6">
          No matching students found.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg mt-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">Reg Number</th>
                <th className="px-4 py-2 font-semibold">Full Name</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Course</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-muted/30 transition"
                >
                  <td className="px-4 py-2">{s.reg_number}</td>
                  <td className="px-4 py-2">{s.full_name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.course_title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

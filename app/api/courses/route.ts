import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const intakeId = searchParams.get("intake_id");

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("course_id")
    .eq("intake_id", intakeId ?? "");

  const courseIds = [...new Set(students?.map((s) => s.course_id))];

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, code")
    .in("id", courseIds);

  return Response.json(courses ?? []);
}

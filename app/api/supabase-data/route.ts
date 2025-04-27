import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type"); // 'students', 'courses', 'intakes'
  const id = searchParams.get("id");

  if (!type) {
    return NextResponse.json(
      { error: 'Missing "type" parameter' },
      { status: 400 },
    );
  }

  let query;

  switch (type) {
    case "students":
      query = supabase
        .from("students")
        .select("id, full_name, course_id, intake_id, enrollment_year, status");
      if (id) query = query.eq("id", id);
      break;
    case "courses":
      query = supabase.from("courses").select("id, code");
      break;
    case "intakes":
      query = supabase.from("intakes").select("id, label");
      break;
    default:
      return NextResponse.json(
        { error: 'Invalid "type" provided' },
        { status: 400 },
      );
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

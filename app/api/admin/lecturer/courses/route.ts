// app/api/courses/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const intakeId = searchParams.get("intake_id"); // Optional: Filter by intake

  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select("id, title, code, intake_id"); // Select relevant course details and intake_id

  // If an intakeId is provided, filter the courses by that intake
  if (intakeId) {
    query = query.eq("intake_id", intakeId);
  }

  // Execute the query and order results by title
  const { data: courses, error } = await query.order("title", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }

  return NextResponse.json(courses ?? []);
}

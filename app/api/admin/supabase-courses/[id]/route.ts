import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("courses")
    .select("id, code, name, department_id, departments(id, name)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[ADMIN_API_COURSE_ERROR]", error);
    return NextResponse.json(null, { status: 500 });
  }

  return NextResponse.json(data);
}

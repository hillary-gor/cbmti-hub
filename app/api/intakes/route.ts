import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("intakes")
    .select("id, label, status")
    .order("created_at", { ascending: false });

  return Response.json(data ?? []);
}

// app/api/intakes/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // Fetch all intakes
  const { data: intakes, error } = await supabase
    .from("intakes")
    .select("id, label") // Select 'id' and 'label' as per your intakes_rows.sql
    .order('label', { ascending: true }); // Order by label

  if (error) {
    console.error("Error fetching intakes:", error);
    return NextResponse.json({ error: "Failed to fetch intakes" }, { status: 500 });
  }

  return NextResponse.json(intakes ?? []);
}
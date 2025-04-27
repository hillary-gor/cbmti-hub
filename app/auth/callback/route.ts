import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return redirect("/login");
  }

  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userRecord?.role) {
    console.error(
      "[AUTH REDIRECT ERROR]",
      userError?.message || "No role found",
    );
    return redirect("/unauthorized");
  }

  const role = userRecord.role;

  switch (role) {
    case "student":
      return redirect("/dashboard/student");
    case "lecturer":
      return redirect("/dashboard/lecturer");
    case "admin":
      return redirect("/dashboard/admin");
    default:
      return redirect("/unauthorized");
  }
}

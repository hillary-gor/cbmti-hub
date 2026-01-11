import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const errorParam = url.searchParams.get("error");
  const errorCode = url.searchParams.get("error_code");
  const errorDesc = url.searchParams.get("error_description");

  if (errorParam || errorCode || errorDesc) {
    console.error("Supabase callback error:", { errorParam, errorCode, errorDesc });

    let message = "Something went wrong. Please try again!";
    if (errorCode === "otp_expired") {
      message = "This link has expired. Please request a new one!";
    } else if (errorDesc?.includes("invalid") || errorDesc?.includes("expired")) {
      message = "Oops! That link is no longer valid. Please log in again.";
    }
    
    return redirect(`/auth/signin?message=${encodeURIComponent(message)}`);
  }

  if (!code) {
    return redirect(`/auth/signin?message=${encodeURIComponent("Invalid link. Please try logging in again.")}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code:", error.message);
    return redirect(`/auth/signin?message=${encodeURIComponent("Link expired or invalid. Try signing in manually.")}`);
  }


  if (next) {
    return redirect(next);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect(`/auth/signin?message=${encodeURIComponent("Session creation failed. Please login.")}`);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/");
  }

  switch (profile.role) {
    case "student":
      return redirect("/dashboard/student");
    case "lecturer":
      return redirect("/dashboard/lecturer");
    case "admin":
      return redirect("/dashboard/admin");
    default:
      return redirect("/");
  }
}
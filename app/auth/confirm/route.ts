import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch (e) {
              // The `setAll` method was called from a Server Component.
              // This can happen if you're trying to set cookies from a Server Component
              // where the `cookies()` function from `next/headers` is not available.
              // This is generally safe to ignore if you're only setting cookies
              // in a Route Handler or Middleware.
              console.warn("Could not set cookies from Server Component:", e);
            }
          },
        },
      },
    );

    // Ensure the 'type' matches what was used to send the OTP.
    // Common types for email OTP verification are 'email', 'recovery', 'invite', 'email_change'.
    // 'signup' and 'magiclink' types are deprecated for verifyOtp.
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Clean up the URL parameters before redirecting, if desired
      redirectTo.searchParams.delete("token_hash");
      redirectTo.searchParams.delete("type");
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // Return user to error page with instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}

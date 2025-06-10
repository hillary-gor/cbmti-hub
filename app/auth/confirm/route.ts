// app/auth/confirm/route.ts (or wherever your route handler is)
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr'; // Import from @supabase/ssr
import { cookies } from 'next/headers'; // Still needed for cookie access

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null; // Keep type as EmailOtpType
  const next = searchParams.get('next') ?? '/'; // Dynamic redirect path

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const cookieStore = await cookies(); // Access cookie store
    const supabase = createServerClient( // Use createServerClient from @supabase/ssr
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
                cookieStore.set(name, value, options)
              );
            } catch (e) {
              // The `setAll` method was called from a Server Component.
              // This can happen if you're trying to set cookies from a Server Component
              // where the `cookies()` function from `next/headers` is not available.
              // This is generally safe to ignore if you're only setting cookies
              // in a Route Handler or Middleware.
              console.warn('Could not set cookies from Server Component:', e);
            }
          },
        },
      }
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
      redirectTo.searchParams.delete('token_hash');
      redirectTo.searchParams.delete('type');
      redirectTo.searchParams.delete('next'); // Remove 'next' from final URL
      return NextResponse.redirect(redirectTo);
    }
  }

  // Return the user to an error page with some instructions
  redirectTo.pathname = '/auth/auth-code-error'; // Specific error page
  return NextResponse.redirect(redirectTo);
}
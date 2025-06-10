'use server';

import { createClient } from '@/utils/supabase/server';

export async function sendResetPasswordEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    if (
      error.message.includes('User not found') ||
      error.message.includes('User does not exist')
    ) {
      return {
        success: true,
        message: 'If that email exists in our system, you’ll receive a reset link shortly.',
      };
    }

    // Log errors and return
    console.error('Password reset error:', error);
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }

  return {
    success: true,
    message: 'If that email exists in our system, you’ll receive a reset link shortly.',
  };
}

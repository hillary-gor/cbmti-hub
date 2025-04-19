'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().min(3),
});

type InviteFormState = {
  success?: boolean;
  error?: {
    email?: string[];
    full_name?: string[];
    general?: string;
  };
};

// Admin client for creating users in auth.users
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function inviteStudent(
  _prevState: InviteFormState,
  formData: FormData
): Promise<InviteFormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { email, full_name } = parsed.data;

  // Step 1: Create user in Supabase Auth
  const { data: userResult, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  const userId = userResult?.user?.id;

  if (authError || !userId) {
    return { error: { general: authError?.message ?? 'Failed to create user' } };
  }

  // Step 2: Insert into students table and link to auth user
  const cookieStore = await cookies(); // await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // safe no-op for server action
      },
    }
  );

  const { error: dbError } = await supabase.from('students').insert({
    user_id: userId,       // user FK
    full_name,
    email,
  });

  if (dbError) {
    return { error: { general: dbError.message } };
  }

  return { success: true };
}

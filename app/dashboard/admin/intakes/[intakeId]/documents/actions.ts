'use server';

import { createClient } from '@/utils/supabase/server';

export async function generateSignedUrl(filePath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from('student-documents')
    .createSignedUrl(filePath, 60 * 10); // 10 mins

  if (error || !data?.signedUrl) {
    throw new Error('Failed to create signed URL');
  }

  return data.signedUrl;
}

'use server';

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

export type RegisterState = {
  success: boolean;
  error?: {
    studentId?: string[];
    courseId?: string[];
    intakeId?: string[];
    general?: string;
  };
};

const schema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
  intakeId: z.string().uuid(),
});

export async function handleRegister(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = schema.safeParse({
    studentId: formData.get('studentId'),
    courseId: formData.get('courseId'),
    intakeId: formData.get('intakeId'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { studentId, courseId, intakeId } = parsed.data;

  const file = formData.get('admission_docs') as File | null;

  if (!file || file.size === 0) {
    return {
      success: false,
      error: { general: 'Please upload admission documents.' },
    };
  }

  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const uniqueName = `admission-${Date.now()}-${randomUUID()}.${fileExt}`;
  const filePath = `${studentId}/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from('student-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: { general: uploadError.message } };
  }

  const { error: metaError } = await supabase
    .from('student_attachments')
    .insert({
      student_id: studentId,
      file_name: file.name,
      file_path: filePath,
      category: 'admission_documents',
    });

  if (metaError) {
    return { success: false, error: { general: metaError.message } };
  }

  const { error: enrollError } = await supabase.from('enrollments').insert({
    student_id: studentId,
    course_id: courseId,
    intake_id: intakeId,
    status: 'active',
  });

  if (enrollError) {
    return { success: false, error: { general: enrollError.message } };
  }

  return { success: true };
}

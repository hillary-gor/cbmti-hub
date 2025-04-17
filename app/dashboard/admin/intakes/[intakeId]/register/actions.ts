
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { registerSchema } from './schema';

export type RegisterState = {
  success?: boolean;
  error?: {
    studentId?: string[];
    courseId?: string[];
    intakeId?: string[];
    general?: string;
  };
};

export async function registerStudentToIntakeCourse(
  formData: FormData
): Promise<RegisterState> {
  const supabase = await createClient();

  const { data: sessionData } = await supabase.auth.getUser();
  if (!sessionData?.user) return { error: { general: 'Unauthorized' } };

  const parsed = registerSchema.safeParse({
    studentId: formData.get('studentId'),
    courseId: formData.get('courseId'),
    intakeId: formData.get('intakeId'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { studentId, courseId, intakeId } = parsed.data;

  const { error } = await supabase.from('enrollments').insert({
    student_id: studentId,
    course_id: courseId,
    intake_id: intakeId,
    enrolled_at: new Date().toISOString(),
    status: 'active',
  });

  if (error) return { error: { general: error.message } };

  revalidatePath(`/dashboard/admin/intakes/${intakeId}`);
  return { success: true };
}

// useFormState-compatible reducer wrapper
export async function handleRegister(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  return await registerStudentToIntakeCourse(formData);
}

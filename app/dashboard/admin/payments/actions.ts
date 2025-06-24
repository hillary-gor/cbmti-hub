// actions.ts (updated)
'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/utils/supabase/server';
import {
  FeePayment,
  PaymentStatus,
  Course,
  Intake,
  StudentWithRelations,
  PaymentFormState,
} from '@/types/fee_payment';

export async function getIntakes(): Promise<Intake[]> {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('intakes')
    .select('*')
    .order('label', { ascending: true });

  if (error) {
    console.error('[Admin] Error fetching intakes:', error);
    return [];
  }

  return data ?? [];
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('[Admin] Error fetching courses:', error);
    return [];
  }

  return data ?? [];
}

export async function getStudentsByIntakeAndCourse(
  intakeId?: string,
  courseId?: string
): Promise<StudentWithRelations[]> {
  const supabase = await createAdminClient();

  let query = supabase
    .from('students')
    .select(
      `
      id,
      full_name,
      reg_number,
      intake:intake_id(label),
      course:course_id(title, code)
    `
    )
    .order('full_name', { ascending: true });

  if (intakeId) query = query.eq('intake_id', intakeId);
  if (courseId) query = query.eq('course_id', courseId);

  const { data, error } = await query;

  if (error) {
    console.error('[Admin] Error fetching students:', error);
    return [];
  }

  return (data ?? []).map((student) => ({
    ...student,
    intake: Array.isArray(student.intake) ? student.intake[0] : student.intake,
    course: Array.isArray(student.course) ? student.course[0] : student.course,
  })) as StudentWithRelations[];
}

export async function updatePaymentStatusByAdmin(
  prevState: PaymentFormState,
  payload: { paymentId: string; newStatus: PaymentStatus }
): Promise<PaymentFormState> {
  const { paymentId, newStatus } = payload;
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('fee_payments')
    .update({ status: newStatus })
    .eq('id', paymentId);

  if (error) {
    console.error('[Admin] Failed to update payment status:', error);
    return {
      status: 'error',
      message: `Failed to update status: ${error.message}`,
    };
  }

  revalidatePath('/dashboard/admin/payments');
  revalidatePath('/dashboard/students/record-fee-payment');

  return {
    status: 'success',
    message: 'Payment status updated successfully.',
  };
}

export async function getPaymentsByStudent(
  studentId: string
): Promise<FeePayment[]> {
  const supabase = await createAdminClient();

  if (!studentId || studentId.length < 8) {
    console.warn('[Admin] Invalid student ID:', studentId);
    return [];
  }

  const { data, error } = await supabase
    .from('fee_payments')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error(
      `[Admin] Error fetching payments for student ${studentId}:`,
      error
    );
    return [];
  }

  return data ?? [];
}

/**
 * Fetches the sum of approved payments for a specific student.
 */
export async function getApprovedPaymentsSumByStudent(studentId: string): Promise<number> {
  const supabase = await createAdminClient();

  if (!studentId || studentId.length < 8) {
    console.warn('[Admin] Invalid student ID for sum calculation:', studentId);
    return 0;
  }

  const { data, error } = await supabase
    .from('fee_payments')
    .select('amount')
    .eq('student_id', studentId)
    .eq('status', 'approved');

  if (error) {
    console.error(`[Admin] Error fetching approved payments sum for student ${studentId}:`, error);
    return 0;
  }

  // Calculate sum from fetched amounts
  const sum = (data ?? []).reduce((acc, payment) => acc + payment.amount, 0);
  return sum;
}
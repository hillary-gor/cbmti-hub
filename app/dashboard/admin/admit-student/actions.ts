'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { admitStudentSchema } from './admit-student-zod-schema'; // adjust path as needed

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
    global: {
      headers: { Cookie: cookies().toString() },
    },
  }
);


interface ActionResult {
  success?: true;
  error?: string | z.inferFlattenedErrors<typeof admitStudentSchema>;
}

export async function admitStudent(formData: unknown): Promise<ActionResult> {
  const result = admitStudentSchema.safeParse(formData);

  if (!result.success) {
    return {
      error: result.error.flatten(), // 🧠 usable with react-hook-form
    };
  }

  const {
    full_name,
    course_id,
    intake_id,
    department_id,
    enrollment_year,
    user_id,
    gender,
    date_of_birth,
    national_id,
    marital_status,
    email,
    phone_number,
    religion,
    address,
    postal_code,
    town_city,
    nationality,
    application_info,
    next_of_kin,
    emergency_contact,
    guardian_declaration,
    education_background,
    work_experience,
    referees,
  } = result.data;

  const { error } = await supabase.rpc('admit_student_tx', {
    student_data: {
      full_name,
      course_id,
      intake_id,
      department_id,
      enrollment_year,
      user_id,
      gender,
      date_of_birth,
      national_id,
      marital_status,
      email,
      phone_number,
      religion,
      address,
      postal_code,
      town_city,
      nationality,
    },
    application_info,
    next_of_kin,
    emergency_contact,
    guardian_declaration,
    education_background,
    work_experience: work_experience ?? [],
    referees,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

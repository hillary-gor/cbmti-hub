'use server';

import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase Server Client (inline)
 */
const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (all) => {
          try {
            all.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // safe to ignore in server context
          }
        },
      },
    }
  );
};

/**
 * SCHEMA - inline Zod full validation for student admission
 */
const studentSchema = z.object({
  gender: z.enum(['Male', 'Female', 'Other']),
  date_of_birth: z
    .string()
    .refine(val => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
      message: 'Date must be valid and in the past',
    }),
  national_id: z.string().regex(/^\d{6,10}$/, 'Invalid national ID'),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Other']),
  email: z.string().email(),
  phone_number: z.string().regex(/^\+?254[0-9]{9}$/, 'Invalid phone number'),
  religion: z.string().trim().optional(),
  address: z.string().trim().min(2),
  postal_code: z.string().regex(/^\d{5}$/, 'Invalid postal code').optional(),
  town_city: z.string().trim().optional(),
  nationality: z.string().trim().min(2),
  merged_file_url: z.string().url().optional(),
});

const applicationInfoSchema = z.object({
  course: z.string().trim(),
  intake_month: z.string().trim(),
  intake_year: z.coerce.number().min(1900),
  session: z.string().trim(),
  mode_of_study: z.string().trim(),
  study_center: z.string().trim(),
  payment_method: z.string().trim(),
  payment_reference: z.string().trim(),
  disability_status: z.boolean(),
  disability_type: z.string().trim().optional(),
});

const educationSchema = z.object({
  school_name: z.string().trim(),
  qualification: z.string().trim(),
  examining_body: z.string().trim(),
  index_no: z.string().trim().optional(),
  from_year: z.number().min(1900),
  to_year: z.number().min(1900),
}).refine((data) => data.from_year <= data.to_year, {
  message: 'To year must be greater than or equal to from year',
  path: ['to_year'],
});

const workExperienceSchema = z.object({
  employer: z.string().trim(),
  designation: z.string().trim(),
  nature_of_assignment: z.string().trim(),
  from_year: z.number().min(1900),
  to_year: z.number().min(1900),
}).refine((data) => data.from_year <= data.to_year, {
  message: 'To year must be after from year',
  path: ['to_year'],
});

const contactSchema = z.object({
  full_name: z.string().trim(),
  relationship: z.string().trim().optional(),
  phone_number: z.string().regex(/^\+?254[0-9]{9}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  address: z.string().trim(),
  id_or_passport_no: z.string().trim().optional(),
});

const refereeSchema = z.object({
  full_name: z.string().trim(),
  email: z.string().email(),
  phone_number: z.string().regex(/^\+?254[0-9]{9}$/, 'Invalid phone number'),
  address: z.string().trim(),
  town_city: z.string().trim(),
  postal_code: z.string().regex(/^\d{5}$/),
});

const consentSchema = z.object({
  accepted_admission_policies: z.boolean(),
  accepted_fee_policies: z.boolean(),
  agreed_code_of_conduct: z.boolean(),
  consent_data_use: z.boolean(),
  agreed_liability_waiver: z.boolean(),
  consent_photo_release: z.boolean(),
  consent_communication_policy: z.boolean(),
});

const declarationSchema = z.object({
  course_name: z.string().trim(),
  accepted_offer: z.boolean(),
  agreed_to_fees: z.boolean(),
  agreed_to_exam_rules: z.boolean(),
  agreed_to_clinical_attachment: z.boolean(),
  agreed_to_hca_policy: z.boolean(),
  agreed_to_nita_exam_policy: z.boolean(),
  no_refund_policy: z.boolean(),
});

const guardianDeclarationSchema = z.object({
  guardian_full_name: z.string().trim(),
  guardian_id_number: z.string().trim(),
  guardian_email: z.string().email(),
  guardian_agrees_to_terms: z.boolean(),
});

const admitStudentSchema = z.object({
  full_name: z.string().trim().min(2),
  course_id: z.string(),
  intake_id: z.string(),
  department_id: z.string(),
  enrollment_year: z.number(),
  user_id: z.string().optional(),

  ...studentSchema.shape,

  application_info: applicationInfoSchema,
  next_of_kin: contactSchema.extend({ relationship: z.string().trim().min(2) }),
  emergency_contact: contactSchema,
  guardian_declaration: guardianDeclarationSchema,
  education_background: z.array(educationSchema).min(1),
  work_experience: z.array(workExperienceSchema).optional(),
  referees: z.array(refereeSchema).min(1),

  // REQUIRED
  consent_acknowledgments: consentSchema,
  course_specific_declarations: declarationSchema,
});

/**
 * SERVER ACTION: Admit student
 */
export const admitStudent = async (formData: unknown) => {
  const supabase = await createClient();

  const parsed = admitStudentSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten(),
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
    merged_file_url,
    application_info,
    next_of_kin,
    emergency_contact,
    guardian_declaration,
    education_background,
    work_experience,
    referees,
    consent_acknowledgments,
    course_specific_declarations,
  } = parsed.data;

  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({
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
      merged_file_url,
    })
    .select('id')
    .single();

  if (studentError || !student?.id) {
    return {
      success: false,
      message: 'Failed to insert student record',
      error: studentError?.message,
    };
  }

  const student_id = student.id;

  const relatedInserts = [
    supabase.from('application_info').insert({ ...application_info, student_id }),
    supabase.from('next_of_kin').insert({ ...next_of_kin, student_id }),
    supabase.from('emergency_contacts').insert({ ...emergency_contact, student_id }),
    supabase.from('guardian_declarations').insert({ ...guardian_declaration, student_id }),
    supabase.from('education_background').insert(
      education_background.map((item) => ({ ...item, student_id }))
    ),
    work_experience?.length
      ? supabase.from('work_experience').insert(
          work_experience.map((item) => ({ ...item, student_id }))
        )
      : null,
    supabase.from('referees').insert(
      referees.map((item) => ({ ...item, student_id }))
    ),
    supabase.from('consent_acknowledgments').insert({ ...consent_acknowledgments, student_id }),
    supabase.from('course_declarations').insert({ ...course_specific_declarations, student_id }),
  ].filter(Boolean);

  const results = await Promise.allSettled(relatedInserts);

  const hasError = results.some(
    (res) =>
      res.status === 'rejected' ||
      ('value' in res && res.value?.error)
  );

  if (hasError) {
    return {
      success: false,
      message: 'One or more related inserts failed',
      results,
    };
  }

  return {
    success: true,
    student_id,
    message: 'Student admitted successfully',
  };
};

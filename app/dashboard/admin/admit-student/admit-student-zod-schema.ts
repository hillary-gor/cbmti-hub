import { z } from "zod";

// 🧾 students (extended fields only)
export const studentSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]),
  date_of_birth: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(),
      { message: "Date must be valid and in the past" }
    ),
  national_id: z.string().regex(/^\d{6,10}$/, "Invalid national ID"),
  marital_status: z.enum(["Single", "Married", "Divorced", "Other"]),
  email: z.string().email(),
  phone_number: z
    .string()
    .regex(/^\+?254[0-9]{9}$/, "Invalid phone number (use +254...)"),
  religion: z.string().trim().optional(),
  address: z.string().trim().min(2),
  postal_code: z.string().regex(/^\d{5}$/, "Invalid postal code").optional(),
  town_city: z.string().trim().optional(),
  nationality: z.string().trim().min(2),
});

// 📋 application_info
export const applicationInfoSchema = z.object({
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

// 🎓 education_background
export const educationSchema = z
  .object({
    school_name: z.string().trim(),
    qualification: z.string().trim(),
    examining_body: z.string().trim(),
    index_no: z.string().trim().optional(),
    from_year: z.number().min(1900),
    to_year: z.number().min(1900),
  })
  .refine((data) => data.from_year <= data.to_year, {
    message: "To year must be greater than or equal to from year",
    path: ["to_year"],
  });

// 💼 work_experience
export const workExperienceSchema = z
  .object({
    employer: z.string().trim(),
    designation: z.string().trim(),
    nature_of_assignment: z.string().trim(),
    from_year: z.number().min(1900),
    to_year: z.number().min(1900),
  })
  .refine((data) => data.from_year <= data.to_year, {
    message: "To year must be after from year",
    path: ["to_year"],
  });

// 🧬 next_of_kin + emergency_contacts (shared)
export const contactSchema = z.object({
  full_name: z.string().trim(),
  relationship: z.string().trim().optional(),
  phone_number: z
    .string()
    .regex(/^\+?254[0-9]{9}$/, "Invalid phone number"),
  email: z.string().email().optional(),
  address: z.string().trim(),
  id_or_passport_no: z.string().trim().optional(),
});

// 👥 referees
export const refereeSchema = z.object({
  full_name: z.string().trim(),
  email: z.string().email(),
  phone_number: z
    .string()
    .regex(/^\+?254[0-9]{9}$/, "Invalid phone number"),
  address: z.string().trim(),
  town_city: z.string().trim(),
  postal_code: z.string().regex(/^\d{5}$/),
});

// ✅ consent_acknowledgments
export const consentSchema = z.object({
  accepted_admission_policies: z.boolean(),
  accepted_fee_policies: z.boolean(),
  agreed_code_of_conduct: z.boolean(),
  consent_data_use: z.boolean(),
  agreed_liability_waiver: z.boolean(),
  consent_photo_release: z.boolean(),
  consent_communication_policy: z.boolean(),
});

// 📜 course_specific_declarations
export const declarationSchema = z.object({
  course_name: z.string().trim(),
  accepted_offer: z.boolean(),
  agreed_to_fees: z.boolean(),
  agreed_to_exam_rules: z.boolean(),
  agreed_to_clinical_attachment: z.boolean(),
  agreed_to_hca_policy: z.boolean(),
  agreed_to_nita_exam_policy: z.boolean(),
  no_refund_policy: z.boolean(),
});

// 👪 guardian_declarations
export const guardianDeclarationSchema = z.object({
  guardian_full_name: z.string().trim(),
  guardian_id_number: z.string().trim(),
  guardian_email: z.string().email(),
  guardian_agrees_to_terms: z.boolean(),
});

// ✅ final full student schema used in form + insert
export const admitStudentSchema = z.object({
  full_name: z.string().trim().min(2),
  course_id: z.string(),
  intake_id: z.string(),
  department_id: z.string(),
  enrollment_year: z.number(),
  user_id: z.string().optional(),

  ...studentSchema.shape,

  application_info: applicationInfoSchema,
  next_of_kin: contactSchema.extend({
    relationship: z.string().trim().min(2),
  }),
  emergency_contact: contactSchema,
  guardian_declaration: guardianDeclarationSchema,
  education_background: z
    .array(educationSchema)
    .min(1, "At least one education entry is required"),
  work_experience: z.array(workExperienceSchema).optional(),
  referees: z
    .array(refereeSchema)
    .min(1, "At least one referee is required"),
});

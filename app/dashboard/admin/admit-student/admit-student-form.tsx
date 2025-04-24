'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { admitStudentSchema } from './admit-student-zod-schema';
import { admitStudent } from './actions';

import StepPersonalInfo from './components/StepPersonalInfo';
import StepApplicationInfo from './components/StepApplicationInfo';
import StepContacts from './components/StepContacts';
import StepGuardianDeclaration from './components/StepGuardianDeclaration';
import StepEducationBackground from './components/StepEducationBackground';
import StepWorkExperience from './components/StepWorkExperience';
import StepReferees from './components/StepReferees';
import StepReviewSubmit from './components/StepReviewSubmit';

type FormData = z.infer<typeof admitStudentSchema>;

const defaultValues: FormData = {
  full_name: '',
  course_id: '',
  intake_id: '',
  department_id: '',
  enrollment_year: new Date().getFullYear(),
  gender: 'Male',
  date_of_birth: '',
  national_id: '',
  marital_status: 'Single',
  email: '',
  phone_number: '',
  religion: '',
  address: '',
  postal_code: '',
  town_city: '',
  nationality: '',
  merged_file_url: '',

  application_info: {
    course: '',
    intake_month: '',
    intake_year: new Date().getFullYear(),
    session: '',
    mode_of_study: '',
    study_center: '',
    payment_method: '',
    payment_reference: '',
    disability_status: false,
    disability_type: '',
  },

  guardian_declaration: {
    guardian_full_name: '',
    guardian_id_number: '',
    guardian_email: '',
    guardian_agrees_to_terms: false,
  },

  consent_acknowledgments: {
    accepted_admission_policies: false,
    accepted_fee_policies: false,
    agreed_code_of_conduct: false,
    consent_data_use: false,
    agreed_liability_waiver: false,
    consent_photo_release: false,
    consent_communication_policy: false,
  },

  course_specific_declarations: {
    course_name: '',
    accepted_offer: false,
    agreed_to_fees: false,
    agreed_to_exam_rules: false,
    agreed_to_clinical_attachment: false,
    agreed_to_hca_policy: false,
    agreed_to_nita_exam_policy: false,
    no_refund_policy: false,
  },

  next_of_kin: {
    full_name: '',
    relationship: '',
    phone_number: '',
    email: '',
    address: '',
    id_or_passport_no: '',
  },

  emergency_contact: {
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    id_or_passport_no: '',
  },

  education_background: [
    {
      school_name: '',
      qualification: '',
      examining_body: '',
      index_no: '',
      from_year: 2020,
      to_year: 2022,
    },
  ],

  work_experience: [],
  referees: [
    {
      full_name: '',
      email: '',
      phone_number: '',
      address: '',
      town_city: '',
      postal_code: '',
    },
  ],

  user_id: undefined,
};

const steps = [
  { label: 'Personal Info', component: StepPersonalInfo },
  { label: 'Application Info', component: StepApplicationInfo },
  { label: 'Contacts', component: StepContacts },
  { label: 'Guardian Declaration', component: StepGuardianDeclaration },
  { label: 'Education Background', component: StepEducationBackground },
  { label: 'Work Experience', component: StepWorkExperience },
  { label: 'Referees', component: StepReferees },
  { label: 'Review & Submit', component: StepReviewSubmit },
];

export default function AdmitStudentForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(admitStudentSchema),
    defaultValues,
  });

  const next = async () => {
    const valid = await methods.trigger();
    if (valid) setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const onSubmit = methods.handleSubmit(async (formData) => {
    setSubmitting(true);
    const result = await admitStudent(formData);

    if (result?.error || result?.success === false) {
      setServerError(result?.error || result?.message || 'Something went wrong');
    } else {
      setServerError(null);
      alert('🎉 Student admitted successfully!');
    }

    setSubmitting(false);
  });

  const Step = steps[stepIndex].component;

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold">{steps[stepIndex].label}</h1>
        {serverError && <p className="text-red-600">{serverError}</p>}
        <Step />

        <div className="flex justify-between pt-6">
          {stepIndex > 0 && (
            <button type="button" onClick={back} className="btn">
              Back
            </button>
          )}
          {stepIndex < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

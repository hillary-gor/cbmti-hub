'use client';

import { useFormContext, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

export const StepApplicationInfo = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();

  const disability = watch('application_info.disability_status');
  const appErrors = errors.application_info as FieldErrors<FormData['application_info']>;

  return (
    <div className="space-y-4">
      <input {...register('course_id')} type="hidden" />
      <input {...register('intake_id')} type="hidden" />
      <input {...register('department_id')} type="hidden" />

      <div>
        <label>Course</label>
        <input {...register('application_info.course')} className="input" />
        <p className="text-red-500 text-sm">{appErrors?.course?.message}</p>
      </div>

      <div>
        <label>Intake Month</label>
        <input {...register('application_info.intake_month')} className="input" />
      </div>

      <div>
        <label>Intake Year</label>
        <input type="number" {...register('application_info.intake_year')} className="input" />
      </div>

      <div>
        <label>Session</label>
        <input {...register('application_info.session')} className="input" />
      </div>

      <div>
        <label>Mode of Study</label>
        <input {...register('application_info.mode_of_study')} className="input" />
      </div>

      <div>
        <label>Study Center</label>
        <input {...register('application_info.study_center')} className="input" />
      </div>

      <div>
        <label>Payment Method</label>
        <input {...register('application_info.payment_method')} className="input" />
      </div>

      <div>
        <label>Payment Reference</label>
        <input {...register('application_info.payment_reference')} className="input" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('application_info.disability_status')} />
        <label>Do you have a disability?</label>
      </div>

      {disability && (
        <div>
          <label>Disability Type</label>
          <input
            {...register('application_info.disability_type')}
            className="input"
            placeholder="e.g. Visual, Hearing, Physical..."
          />
          <p className="text-red-500 text-sm">{appErrors?.disability_type?.message}</p>
        </div>
      )}
    </div>
  );
};
